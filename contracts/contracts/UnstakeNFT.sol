// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts@4.9.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.9.0/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.0/utils/Counters.sol";

contract UnstakeNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _operator;

    struct UnstakeRequest {
        uint256 amount;
        uint256 mintTime;
        address user;
    }

    mapping(uint256 => UnstakeRequest) public unstakeRequests;

    event OperatorTransferred(address indexed previousOperator, address indexed newOperator);

    constructor() ERC721("UnstakeNFT", "UNFT") {
        _operator = _msgSender();
    }

    modifier onlyOperator() {
        require(_msgSender() == _operator, "UnstakeNFT: caller is not the operator");
        _;
    }

    function operator() public view returns (address) {
        return _operator;
    }

    function transferOperator(address newOperator) public onlyOwner {
        require(newOperator != address(0), "UnstakeNFT: new operator is the zero address");
        emit OperatorTransferred(_operator, newOperator);
        _operator = newOperator;
    }

    function mint(address user, uint256 amount) external onlyOperator returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(user, newTokenId);
        
        unstakeRequests[newTokenId] = UnstakeRequest({
            amount: amount,
            mintTime: block.timestamp,
            user: user
        });

        return newTokenId;
    }

    function burn(uint256 tokenId) external onlyOperator {
        _burn(tokenId);
        delete unstakeRequests[tokenId];
    }

    function getUnstakeRequest(uint256 tokenId) external view returns (UnstakeRequest memory) {
        return unstakeRequests[tokenId];
    }
}