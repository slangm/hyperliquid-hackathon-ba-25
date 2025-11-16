// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import {HypurrLeveragedVault} from "../src/HypurrLeveragedVault.sol";

contract TuneVaultParams is Script {
    function run() external {
        address vaultAddr = vm.envAddress("VAULT_ADDRESS");
        uint256 newTarget = vm.envUint("NEW_TARGET_LTV_BPS"); // e.g. 4000 = 40%
        uint256 newRebalance = vm.envOr("NEW_REBALANCE_BPS", uint256(500)); // default 5%

        vm.startBroadcast();
        HypurrLeveragedVault(vaultAddr).setTargetLtvBps(newTarget);
        HypurrLeveragedVault(vaultAddr).setRebalanceThresholdBps(newRebalance);
        vm.stopBroadcast();
        // log
        console2.log("Updated vault at", vaultAddr);
        console2.log("New TARGET_LTV_BPS", newTarget);
        console2.log("New REBALANCE_THRESHOLD_BPS", newRebalance);
    }
}
