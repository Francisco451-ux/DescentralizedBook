// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract DecentralizedBook {
    struct Line {
        address author;
        string text;
    }

    Line[] public book;

    //mapping(address => bool) public hasContributed;

    event NewLine(address indexed author, string text);

    function addLine(string calldata _text) external {
        //require(!hasContributed[msg.sender], "ja contribuiu com um linha");

        require(bytes(_text).length > 0, "Texto nao pode ser vazio");

        book.push(Line(msg.sender, _text));

        //hasContributed[msg.sender] = true;

        emit NewLine(msg.sender, _text);
    }

    function getTotalLines() external view returns (uint256) {
        return book.length;
    }

    function getLine(
        uint256 _index
    ) external view returns (address author, string memory text) {
        require(_index < book.length, "Index invalido.");
        Line storage line = book[_index];
        return (line.author, line.text);
    }

    function getAllLine() external view returns (Line[] memory) {
        return book;
    }
}
