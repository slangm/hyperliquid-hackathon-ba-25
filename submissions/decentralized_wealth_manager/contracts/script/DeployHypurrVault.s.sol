// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {ERC20} from "solmate/tokens/ERC20.sol";

import {HypurrLeveragedVault} from "../src/HypurrLeveragedVault.sol";
import {IHypurrPool} from "../src/interfaces/IHypurrPool.sol";
import {IHypurrProtocolDataProvider} from "../src/interfaces/IHypurrProtocolDataProvider.sol";

contract DeployHypurrVault is Script {
    address public constant HYPURR_POOL =
        0xceCcE0EB9DD2Ef7996e01e25DD70e461F918A14b;
    address public constant PROTOCOL_DATA_PROVIDER =
        0x895C799a5bbdCb63B80bEE5BD94E7b9138D977d6;

    error InvalidReserve(address asset);

    function run() external returns (HypurrLeveragedVault vault) {
        address asset = vm.envAddress("USDC_ASSET");
        uint256 targetLtv = vm.envUint("TARGET_LTV_BPS");
        uint256 maxLtv = vm.envUint("MAX_LTV_BPS");
        uint256 rebalanceThreshold = vm.envUint("REBALANCE_THRESHOLD_BPS");
        address ownerOverride = vm.envOr("VAULT_OWNER", address(0));

        IHypurrProtocolDataProvider dataProvider = IHypurrProtocolDataProvider(
            PROTOCOL_DATA_PROVIDER
        );
        (
            address aTokenAddress,
            ,
            address variableDebtTokenAddress
        ) = dataProvider.getReserveTokensAddresses(asset);

        if (
            aTokenAddress == address(0) ||
            variableDebtTokenAddress == address(0)
        ) {
            revert InvalidReserve(asset);
        }

        vm.startBroadcast();
        vault = new HypurrLeveragedVault(
            ERC20(asset),
            ERC20(aTokenAddress),
            ERC20(variableDebtTokenAddress),
            IHypurrPool(HYPURR_POOL),
            targetLtv,
            maxLtv,
            rebalanceThreshold,
            ownerOverride
        );
        vm.stopBroadcast();

        console2.log("HypurrLeveragedVault deployed at:", address(vault));
        console2.log("Underlying asset:", asset);
        console2.log("aToken:", aTokenAddress);
        console2.log("Variable debt token:", variableDebtTokenAddress);
    }
}
