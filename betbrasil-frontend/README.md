// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract BetBrasil is VRFConsumerBase {
    address public owner;
    uint256 public fee;
    bytes32 public keyHash;
    uint256 public randomResult;
    address[] public players;
    uint256 public ticketPrice = 0.01 ether;

    event NovaAposta(address jogador);
    event SorteioRealizado(uint256 numeroSorteado);

    constructor(address _vrfCoordinator, address _linkToken, bytes32 _keyHash, uint256 _fee)
        VRFConsumerBase(_vrfCoordinator, _linkToken) {
        owner = msg.sender;
        keyHash = _keyHash;
        fee = _fee;
    }

    function apostar() public payable {
        require(msg.value == ticketPrice, "Valor incorreto");
        players.push(msg.sender);
        emit NovaAposta(msg.sender);
    }

    function sortear() public onlyOwner {
        require(LINK.balanceOf(address(this)) >= fee, "Sem LINK suficiente");
        requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        randomResult = randomness % 100; // Número entre 0 e 99
        emit SorteioRealizado(randomResult);
        // Aqui você pode distribuir o prêmio!
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "So o dono pode isso");
        _;
    }
}