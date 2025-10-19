// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title IPNFT
 * @dev ERC-721 NFT with royalty support for intellectual property
 * @author TRTSKCS
 */
contract IPNFT is ERC721URIStorage, ERC721Enumerable, ERC721Royalty, AccessControl, Pausable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    Counters.Counter private _tokenIdCounter;
    
    // IP-NFT specific data
    struct IPData {
        address creator;
        uint256 creationTime;
        uint256 aiCredibilityScore;
        string category;
        string description;
        bool isLicensed;
        uint256 licensePrice;
        address[] collaborators;
        mapping(address => uint256) collaboratorShares;
    }
    
    mapping(uint256 => IPData) public ipData;
    mapping(address => uint256[]) public creatorTokens;
    mapping(string => bool) public usedHashes;
    
    // Events
    event IPNFTCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string category,
        uint256 aiCredibilityScore
    );
    event IPNFTLicensed(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 price
    );
    event CollaboratorAdded(
        uint256 indexed tokenId,
        address indexed collaborator,
        uint256 share
    );
    event RoyaltyUpdated(uint256 indexed tokenId, address receiver, uint96 feeNumerator);
    
    constructor() ERC721("IdeaForge IP-NFT", "IPNFT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint a new IP-NFT
     * @param to Address to mint the NFT to
     * @param tokenURI URI containing metadata
     * @param creator Address of the creator
     * @param category Category of the IP
     * @param description Description of the IP
     * @param aiScore AI credibility score (0-100)
     * @param royaltyFee Royalty fee in basis points (0-10000)
     * @param contentHash Hash of the content for uniqueness
     */
    function mintIPNFT(
        address to,
        string memory tokenURI,
        address creator,
        string memory category,
        string memory description,
        uint256 aiScore,
        uint96 royaltyFee,
        string memory contentHash
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(!usedHashes[contentHash], "Content hash already used");
        require(aiScore <= 100, "Invalid AI score");
        require(royaltyFee <= 1000, "Royalty fee too high"); // Max 10%
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _setTokenRoyalty(tokenId, creator, royaltyFee);
        
        // Set IP-specific data
        IPData storage ip = ipData[tokenId];
        ip.creator = creator;
        ip.creationTime = block.timestamp;
        ip.aiCredibilityScore = aiScore;
        ip.category = category;
        ip.description = description;
        ip.isLicensed = false;
        ip.licensePrice = 0;
        
        usedHashes[contentHash] = true;
        creatorTokens[creator].push(tokenId);
        
        emit IPNFTCreated(tokenId, creator, category, aiScore);
        emit RoyaltyUpdated(tokenId, creator, royaltyFee);
        
        return tokenId;
    }
    
    /**
     * @dev Add a collaborator to an IP-NFT
     * @param tokenId ID of the token
     * @param collaborator Address of the collaborator
     * @param share Share percentage (in basis points)
     */
    function addCollaborator(
        uint256 tokenId,
        address collaborator,
        uint256 share
    ) external {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        require(share <= 10000, "Share too high");
        require(share > 0, "Share must be positive");
        
        IPData storage ip = ipData[tokenId];
        ip.collaborators.push(collaborator);
        ip.collaboratorShares[collaborator] = share;
        
        emit CollaboratorAdded(tokenId, collaborator, share);
    }
    
    /**
     * @dev License an IP-NFT
     * @param tokenId ID of the token to license
     * @param price Price for the license
     */
    function licenseIP(uint256 tokenId, uint256 price) external payable {
        require(_exists(tokenId), "Token does not exist");
        require(msg.value >= price, "Insufficient payment");
        require(!ipData[tokenId].isLicensed, "Already licensed");
        
        IPData storage ip = ipData[tokenId];
        ip.isLicensed = true;
        ip.licensePrice = price;
        
        // Distribute payment to creator and collaborators
        _distributePayment(tokenId, msg.value);
        
        emit IPNFTLicensed(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Distribute payment among creator and collaborators
     * @param tokenId ID of the token
     * @param amount Amount to distribute
     */
    function _distributePayment(uint256 tokenId, uint256 amount) internal {
        IPData storage ip = ipData[tokenId];
        
        // Pay creator
        uint256 creatorShare = amount;
        
        // Pay collaborators
        for (uint256 i = 0; i < ip.collaborators.length; i++) {
            address collaborator = ip.collaborators[i];
            uint256 share = ip.collaboratorShares[collaborator];
            uint256 collaboratorAmount = (amount * share) / 10000;
            
            creatorShare -= collaboratorAmount;
            payable(collaborator).transfer(collaboratorAmount);
        }
        
        // Pay remaining to creator
        payable(ip.creator).transfer(creatorShare);
    }
    
    /**
     * @dev Get IP data for a token
     * @param tokenId ID of the token
     * @return creator Address of the creator
     * @return creationTime Timestamp of creation
     * @return aiScore AI credibility score
     * @return category Category of the IP
     * @return description Description of the IP
     * @return isLicensed Whether the IP is licensed
     * @return licensePrice Price of the license
     */
    function getIPData(uint256 tokenId) external view returns (
        address creator,
        uint256 creationTime,
        uint256 aiScore,
        string memory category,
        string memory description,
        bool isLicensed,
        uint256 licensePrice
    ) {
        require(_exists(tokenId), "Token does not exist");
        IPData storage ip = ipData[tokenId];
        
        return (
            ip.creator,
            ip.creationTime,
            ip.aiCredibilityScore,
            ip.category,
            ip.description,
            ip.isLicensed,
            ip.licensePrice
        );
    }
    
    /**
     * @dev Get collaborators for a token
     * @param tokenId ID of the token
     * @return collaborators Array of collaborator addresses
     * @return shares Array of collaborator shares
     */
    function getCollaborators(uint256 tokenId) external view returns (
        address[] memory collaborators,
        uint256[] memory shares
    ) {
        require(_exists(tokenId), "Token does not exist");
        IPData storage ip = ipData[tokenId];
        
        collaborators = new address[](ip.collaborators.length);
        shares = new uint256[](ip.collaborators.length);
        
        for (uint256 i = 0; i < ip.collaborators.length; i++) {
            collaborators[i] = ip.collaborators[i];
            shares[i] = ip.collaboratorShares[ip.collaborators[i]];
        }
    }
    
    /**
     * @dev Get tokens created by an address
     * @param creator Address of the creator
     * @return tokens Array of token IDs
     */
    function getCreatorTokens(address creator) external view returns (uint256[] memory) {
        return creatorTokens[creator];
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override required for multiple inheritance
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721Royalty, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
