// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC20} from "solmate/tokens/ERC20.sol";
import {ERC4626} from "solmate/mixins/ERC4626.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

import {IHypurrPool} from "./interfaces/IHypurrPool.sol";

abstract contract OwnableImmutable {
    address public immutable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "UNAUTHORIZED");
        _;
    }

    constructor(address initialOwner) {
        require(initialOwner != address(0), "INVALID_OWNER");
        owner = initialOwner;
    }
}

contract HypurrLeveragedVault is ERC4626, OwnableImmutable {
    using SafeTransferLib for ERC20;

    uint256 public constant BPS_DENOMINATOR = 10_000;
    uint8 public constant VARIABLE_RATE_MODE = 2;
    uint16 public constant REFERRAL_CODE = 0;

    IHypurrPool public immutable pool;
    ERC20 public immutable collateralReceiptToken;
    ERC20 public immutable variableDebtToken;

    uint256 public immutable maxLtvBps;
    uint256 public targetLtvBps;
    uint256 public rebalanceThresholdBps;

    error TargetLtvTooHigh();
    error InvalidThreshold();
    error LtvWithinBand();
    error NothingToRebalance();
    error InvalidAddress();

    event TargetLtvUpdated(uint256 newTarget);
    event RebalanceThresholdUpdated(uint256 newThreshold);
    event LoopOpened(
        uint256 depositedAssets,
        uint256 borrowedAssets,
        uint256 resultingLtvBps
    );
    event LoopUnwound(
        uint256 withdrawnAssets,
        uint256 repaidAssets,
        uint256 resultingLtvBps
    );
    event Rebalanced(
        uint256 previousLtvBps,
        uint256 newLtvBps,
        uint256 repaidAssets,
        uint256 borrowedAssets
    );

    constructor(
        ERC20 collateralAsset_,
        ERC20 collateralReceiptToken_,
        ERC20 variableDebtToken_,
        IHypurrPool pool_,
        uint256 targetLtvBps_,
        uint256 maxLtvBps_,
        uint256 rebalanceThresholdBps_,
        address owner_
    )
        ERC4626(collateralAsset_, "Hypurr Leveraged Yield Vault", "HY-POS")
        OwnableImmutable(owner_ == address(0) ? msg.sender : owner_)
    {
        if (
            address(collateralAsset_) == address(0) ||
            address(collateralReceiptToken_) == address(0) ||
            address(variableDebtToken_) == address(0) ||
            address(pool_) == address(0)
        ) revert InvalidAddress();

        if (maxLtvBps_ >= BPS_DENOMINATOR) revert TargetLtvTooHigh();
        if (targetLtvBps_ == 0 || targetLtvBps_ >= maxLtvBps_)
            revert TargetLtvTooHigh();
        if (
            rebalanceThresholdBps_ == 0 ||
            rebalanceThresholdBps_ >= targetLtvBps_
        ) revert InvalidThreshold();

        pool = pool_;
        collateralReceiptToken = collateralReceiptToken_;
        variableDebtToken = variableDebtToken_;
        maxLtvBps = maxLtvBps_;
        targetLtvBps = targetLtvBps_;
        rebalanceThresholdBps = rebalanceThresholdBps_;

        collateralAsset_.safeApprove(address(pool_), type(uint256).max);
    }

    /*//////////////////////////////////////////////////////////////
                               VIEW HELPERS
    //////////////////////////////////////////////////////////////*/

    function totalAssets() public view override returns (uint256) {
        return
            collateralReceiptToken.balanceOf(address(this)) +
            asset.balanceOf(address(this));
    }

    function debtOutstanding() public view returns (uint256) {
        return variableDebtToken.balanceOf(address(this));
    }

    function currentLtvBps() public view returns (uint256) {
        uint256 collateral = collateralReceiptToken.balanceOf(address(this));
        if (collateral == 0) return 0;
        return (debtOutstanding() * BPS_DENOMINATOR) / collateral;
    }

    /*//////////////////////////////////////////////////////////////
                               ADMIN
    //////////////////////////////////////////////////////////////*/

    function setTargetLtvBps(uint256 newTarget) external onlyOwner {
        if (
            newTarget == 0 ||
            newTarget >= maxLtvBps ||
            newTarget >= BPS_DENOMINATOR
        ) revert TargetLtvTooHigh();
        targetLtvBps = newTarget;
        emit TargetLtvUpdated(newTarget);
    }

    function setRebalanceThresholdBps(uint256 newThreshold) external onlyOwner {
        if (newThreshold == 0 || newThreshold >= targetLtvBps)
            revert InvalidThreshold();
        rebalanceThresholdBps = newThreshold;
        emit RebalanceThresholdUpdated(newThreshold);
    }

    /*//////////////////////////////////////////////////////////////
                           VAULT HOOKS
    //////////////////////////////////////////////////////////////*/

    function afterDeposit(uint256 assets, uint256) internal override {
        _loopDeposit(assets);
    }

    function beforeWithdraw(uint256 assets, uint256) internal override {
        _unwindPosition(assets);
    }

    /*//////////////////////////////////////////////////////////////
                           REBALANCING
    //////////////////////////////////////////////////////////////*/

    function rebalance() external returns (uint256 newLtvBps) {
        uint256 collateral = collateralReceiptToken.balanceOf(address(this));
        uint256 debt = debtOutstanding();
        if (collateral == 0 || debt == 0) revert NothingToRebalance();

        uint256 current = currentLtvBps();
        uint256 repayAmount;
        uint256 borrowAmount;

        if (current > targetLtvBps + rebalanceThresholdBps) {
            repayAmount = _repayAmountToReachTarget(collateral, debt);
            _deleverage(repayAmount);
        } else if (current + rebalanceThresholdBps < targetLtvBps) {
            borrowAmount = _borrowAmountToReachTarget(collateral, debt);
            _increaseLeverage(borrowAmount);
        } else {
            revert LtvWithinBand();
        }

        newLtvBps = currentLtvBps();
        emit Rebalanced(current, newLtvBps, repayAmount, borrowAmount);
    }

    /*//////////////////////////////////////////////////////////////
                           INTERNAL LOGIC
    //////////////////////////////////////////////////////////////*/

    function _loopDeposit(uint256 assets) internal {
        if (assets == 0) return;
        pool.supply(address(asset), assets, address(this), REFERRAL_CODE);

        uint256 borrowAmount = _loopBorrowAmount(assets);
        if (borrowAmount == 0) return;

        pool.borrow(
            address(asset),
            borrowAmount,
            VARIABLE_RATE_MODE,
            REFERRAL_CODE,
            address(this)
        );
        pool.supply(address(asset), borrowAmount, address(this), REFERRAL_CODE);

        emit LoopOpened(assets, borrowAmount, currentLtvBps());
    }

    function _unwindPosition(uint256 requestedAssets) internal {
        if (requestedAssets == 0) return;
        uint256 collateral = collateralReceiptToken.balanceOf(address(this));
        uint256 debt = debtOutstanding();

        uint256 withdrawAmount = requestedAssets;
        uint256 repayAmount;

        if (requestedAssets >= collateral) {
            withdrawAmount = collateral;
            repayAmount = debt;
        } else if (debt > 0 && collateral > 0) {
            uint256 numerator = (debt * BPS_DENOMINATOR) +
                (requestedAssets * BPS_DENOMINATOR) -
                (targetLtvBps * collateral);
            if (numerator > 0 && targetLtvBps < BPS_DENOMINATOR) {
                uint256 denominator = BPS_DENOMINATOR - targetLtvBps;
                withdrawAmount = numerator / denominator;
                if (withdrawAmount < requestedAssets) {
                    withdrawAmount = requestedAssets;
                }
                if (withdrawAmount > collateral) {
                    withdrawAmount = collateral;
                }
                repayAmount = withdrawAmount > requestedAssets
                    ? withdrawAmount - requestedAssets
                    : 0;
                if (repayAmount > debt) {
                    repayAmount = debt;
                    withdrawAmount = requestedAssets + repayAmount;
                }
            }
        }

        pool.withdraw(address(asset), withdrawAmount, address(this));

        if (repayAmount > 0) {
            pool.repay(
                address(asset),
                repayAmount,
                VARIABLE_RATE_MODE,
                address(this)
            );
        }

        emit LoopUnwound(requestedAssets, repayAmount, currentLtvBps());
    }

    function _deleverage(uint256 repayAmount) internal {
        if (repayAmount == 0) return;

        pool.withdraw(address(asset), repayAmount, address(this));
        pool.repay(
            address(asset),
            repayAmount,
            VARIABLE_RATE_MODE,
            address(this)
        );
    }

    function _increaseLeverage(uint256 borrowAmount) internal {
        if (borrowAmount == 0) return;

        pool.borrow(
            address(asset),
            borrowAmount,
            VARIABLE_RATE_MODE,
            REFERRAL_CODE,
            address(this)
        );
        pool.supply(address(asset), borrowAmount, address(this), REFERRAL_CODE);
    }

    function _loopBorrowAmount(
        uint256 depositAssets
    ) internal view returns (uint256) {
        if (targetLtvBps == 0) return 0;
        return
            (depositAssets * targetLtvBps) / (BPS_DENOMINATOR - targetLtvBps);
    }

    function _borrowAmountToReachTarget(
        uint256 collateral,
        uint256 debt
    ) internal view returns (uint256) {
        if (targetLtvBps >= BPS_DENOMINATOR) return 0;
        uint256 numerator = targetLtvBps * collateral;
        uint256 denominator = BPS_DENOMINATOR - targetLtvBps;
        uint256 debtScaled = debt * BPS_DENOMINATOR;
        if (numerator <= debtScaled) return 0;
        return (numerator - debtScaled) / denominator;
    }

    function _repayAmountToReachTarget(
        uint256 collateral,
        uint256 debt
    ) internal view returns (uint256) {
        if (targetLtvBps >= BPS_DENOMINATOR) return 0;
        uint256 numerator = debt * BPS_DENOMINATOR;
        uint256 denominator = BPS_DENOMINATOR - targetLtvBps;
        uint256 targetProduct = targetLtvBps * collateral;
        if (numerator <= targetProduct) return 0;
        return (numerator - targetProduct) / denominator;
    }
}
