// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IHypurrProtocolDataProvider {
    function getReserveTokensAddresses(
        address asset
    )
        external
        view
        returns (address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress);
}

