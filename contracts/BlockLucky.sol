// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlockLucky {
    address public owner;
    address[] public players;
    uint public ticketPrice;
    uint public maxPlayers;

    event TicketBought(address indexed player);
    event WinnerSelected(address indexed winner, uint amount);

    constructor(uint _ticketPrice, uint _maxPlayers) {
        owner = msg.sender;
        ticketPrice = _ticketPrice;
        maxPlayers = _maxPlayers;
    }

    function buyTicket() external payable {
        require(msg.value == ticketPrice, "Ticket costs exactly the ticket price");
        players.push(msg.sender);
        emit TicketBought(msg.sender);

        if (players.length == maxPlayers) {
            selectWinner();
        }
    }

    function selectWinner() internal {
        uint randomIndex = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, players))) % players.length;
        address winner = players[randomIndex];
        uint balance = address(this).balance;

        delete players;

        (bool success, ) = payable(winner).call{value: balance}("");
        require(success, "Transfer failed");

        emit WinnerSelected(winner, balance);
    }

    function getPlayers() external view returns (address[] memory) {
        return players;
    }
}
