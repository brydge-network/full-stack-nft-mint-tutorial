// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract BrydgeCollection is ERC721URIStorage {
  uint256 public tokenCounter;
  //set price to 0.001 native
  uint256 price = 1000000000000000;

  constructor() public ERC721('Brydge Tutorial NFTs', 'BRYDGE') {
    tokenCounter = 0;
  }

  function mintBrydgeNFT(string memory tokenURI) public payable returns (bytes32) {
    require(msg.value >= price, "Send more tokens next time!");
    require(tokenCounter < 100, 'Max number of tokens reached');
    uint256 tokenId = tokenCounter;
    _safeMint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
    tokenCounter++;
  }
}
