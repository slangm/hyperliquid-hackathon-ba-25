// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";
import {SafeTransferLib} from "solmate/utils/SafeTransferLib.sol";

import {HypurrLeveragedVault} from "../src/HypurrLeveragedVault.sol";
import {IHypurrPool} from "../src/interfaces/IHypurrPool.sol";

contract HypurrLeveragedVaultTest is Test {
    HypurrLeveragedVault internal vault;
    MockERC20 internal usdxl;
    MockPool internal pool;

    function setUp() public {
        usdxl = new MockERC20("Mock USDXL", "mUSDXL");
        pool = new MockPool(usdxl);

        vault = new HypurrLeveragedVault(
            usdxl,
            ERC20(address(pool.aToken())),
            ERC20(address(pool.debtToken())),
            pool,
            6_000,
            7_500,
            500,
            address(this)
        );

        usdxl.mint(address(this), 10_000 ether);
        usdxl.approve(address(vault), type(uint256).max);
        usdxl.mint(address(pool), 1_000_000 ether);
    }

    function test_depositLoopsToConfiguredLtv() public {
        vault.deposit(1_000 ether, address(this));

        assertEq(pool.aToken().balanceOf(address(vault)), 2_500 ether);
        assertEq(pool.debtToken().balanceOf(address(vault)), 1_500 ether);
        assertApproxEqAbs(vault.currentLtvBps(), 6_000, 1);
    }

    function test_withdrawUnwindsAndMaintainsState() public {
        vault.deposit(1_000 ether, address(this));

        uint256 balanceBefore = usdxl.balanceOf(address(this));
        vault.withdraw(400 ether, address(this), address(this));
        uint256 balanceAfter = usdxl.balanceOf(address(this));

        assertEq(balanceAfter - balanceBefore, 400 ether);
        assertApproxEqAbs(vault.currentLtvBps(), 6_000, 1);
    }

    function test_rebalanceDeleverageWhenAboveBand() public {
        vault.deposit(1_000 ether, address(this));
        vault.setTargetLtvBps(5_000);

        uint256 previousLtv = vault.currentLtvBps();
        vault.rebalance();
        uint256 newLtv = vault.currentLtvBps();

        assertGt(previousLtv, newLtv);
        assertApproxEqAbs(newLtv, 5_000, 10);
    }

    function test_rebalanceIncreaseLeverageWhenBelowBand() public {
        vault.deposit(1_000 ether, address(this));
        vault.setRebalanceThresholdBps(100);
        vault.setTargetLtvBps(6_500);

        uint256 previousDebt = pool.debtToken().balanceOf(address(vault));
        vault.rebalance();
        uint256 newDebt = pool.debtToken().balanceOf(address(vault));

        assertGt(newDebt, previousDebt);
        assertApproxEqAbs(vault.currentLtvBps(), 6_500, 10);
    }
}

contract MockERC20 is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_, 18) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

contract MockAToken is ERC20 {
    constructor() ERC20("Mock aToken", "maTOKEN", 18) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

contract MockDebtToken is ERC20 {
    constructor() ERC20("Mock variable debt", "mDEBT", 18) {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}

contract MockPool is IHypurrPool {
    using SafeTransferLib for ERC20;

    ERC20 public immutable assetToken;
    MockAToken public immutable aToken;
    MockDebtToken public immutable debtToken;

    constructor(ERC20 asset_) {
        assetToken = asset_;
        aToken = new MockAToken();
        debtToken = new MockDebtToken();
    }

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external override {
        require(asset == address(assetToken), "asset");
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
        aToken.mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external override returns (uint256) {
        require(asset == address(assetToken), "asset");
        aToken.burn(msg.sender, amount);
        assetToken.safeTransfer(to, amount);
        return amount;
    }

    function borrow(
        address asset,
        uint256 amount,
        uint256,
        uint16,
        address onBehalfOf
    ) external override {
        require(asset == address(assetToken), "asset");
        debtToken.mint(onBehalfOf, amount);
        assetToken.safeTransfer(onBehalfOf, amount);
    }

    function repay(
        address asset,
        uint256 amount,
        uint256,
        address onBehalfOf
    ) external override returns (uint256) {
        require(asset == address(assetToken), "asset");
        assetToken.safeTransferFrom(msg.sender, address(this), amount);
        debtToken.burn(onBehalfOf, amount);
        return amount;
    }
}
