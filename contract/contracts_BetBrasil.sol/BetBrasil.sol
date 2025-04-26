// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract BetBrasil is VRFConsumerBase {
    // Config Chainlink VRF (Polygon Mumbai)
    bytes32 internal keyHash = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint256 internal fee = 0.0001 * 10 ** 18; // 0.0001 LINK

    address public owner;
    uint256 public ticketPrice = 0.01 ether;
    address[] public players;
    uint256 public lastWinner;
    bool public isLotteryOpen;

    event NewBet(address player);
    event WinnerPicked(address winner, uint256 prize);

    constructor() 
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator (Mumbai)
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token (Mumbai)
        ) {
        owner = msg.sender;
        isLotteryOpen = true;
    }

    function bet() public payable {
        require(isLotteryOpen, "Loteria fechada!");
        require(msg.value == ticketPrice, "Manda 0.01 ETH, patrão!");
        players.push(msg.sender);
        emit NewBet(msg.sender);
    }

    function pickWinner() public onlyOwner {
        require(!isLotteryOpen, "Ta rolando ainda!");
        require(LINK.balanceOf(address(this)) >= fee, "Manda LINK pra sorteio!");
        requestRandomness(keyHash, fee);
    }

    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        uint256 winnerIndex = randomness % players.length;
        address winner = players[winnerIndex];
        uint256 prize = address(this).balance * 90 / 100; // 90% pro vencedor
        payable(winner).transfer(prize);
        lastWinner = prize;
        emit WinnerPicked(winner, prize);
        resetLottery();
    }

    function resetLottery() private {
        players = new address[](0);
        isLotteryOpen = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Só o dono mexe aqui!");
        _;
    }
}