// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NFTReward
 * @dev Contract for minting free NFTs (user only pays gas fees)
 */
contract NFTReward is ERC721, ERC721URIStorage, Ownable {
    // Base URI for metadata (with trailing slash)
    string private constant _BASE_TOKEN_URI = "ipfs://bafybeidevp6ktfujxkmu3ezeqm7bkcroeijbrk7tnvbmwhnaplcw4kdukq/";

    // Counter for token IDs
    uint256 private _nextTokenId;

    // Events
    event NFTMinted(address indexed to, uint256 tokenId);

    /**
     * @dev Constructor
     * @param name The name of the NFT collection
     * @param symbol The symbol of the NFT collection 
     * @param initialOwner The initial owner of the contract
     */
    constructor(
        string memory name,
        string memory symbol,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        // No maximum supply
    }

    /**
     * @dev Override base URI function to use the constant
     */
    function _baseURI() internal pure override returns (string memory) {
        return _BASE_TOKEN_URI;
    }

    /**
     * @dev Mint a new NFT for the caller (free except for gas)
     */
    function mint() external {
        uint256 tokenId = _nextTokenId++;
        
        // Mint the NFT
        _safeMint(msg.sender, tokenId);
        
        // Set token URI (metadata)
        _setTokenURI(tokenId, string(abi.encodePacked(toString(tokenId), ".json")));
        
        emit NFTMinted(msg.sender, tokenId);
    }

    /**
     * @dev Helper function to convert uint to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}