// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UnstakeNFT is ERC721Enumerable, Ownable {
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
        _operator = msg.sender;
    }

    modifier onlyOperator() {
        require(msg.sender == _operator, "UnstakeNFT: caller is not the operator");
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

    // Optimized function to get all tokens owned by a user
    function getUserTokens(address user) external view returns (uint256[] memory, UnstakeRequest[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        UnstakeRequest[] memory requests = new UnstakeRequest[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            tokenIds[i] = tokenId;
            requests[i] = unstakeRequests[tokenId];
        }
        
        return (tokenIds, requests);
    }
}