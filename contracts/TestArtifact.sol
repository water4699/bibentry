// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract TestArtifact {
    uint256 public value;

    constructor() {
        value = 123;
    }

    function setValue(uint256 _value) external {
        value = _value;
    }
}
