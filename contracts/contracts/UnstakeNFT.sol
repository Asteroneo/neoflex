// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract UnstakeNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct UnstakeRequest {
        uint256 amount;
        uint256 mintTime;
        address user;
    }

    mapping(uint256 => UnstakeRequest) public unstakeRequests;

    constructor() ERC721("UnstakeNFT", "UNFT") {}

    function mint(address user, uint256 amount) external onlyOwner returns (uint256) {
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

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
        delete unstakeRequests[tokenId];
    }

    function getUnstakeRequest(uint256 tokenId) external view returns (UnstakeRequest memory) {
        return unstakeRequests[tokenId];
    }
}