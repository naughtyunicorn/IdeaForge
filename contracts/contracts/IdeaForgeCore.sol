// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./IPNFT.sol";
import "./ForgeToken.sol";

/**
 * @title IdeaForgeCore
 * @dev Core contract for idea submission and IP-NFT creation
 * @author TRTSKCS
 */
contract IdeaForgeCore is AccessControl, Pausable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    Counters.Counter private _ideaIdCounter;
    
    // Idea submission structure
    struct IdeaSubmission {
        uint256 ideaId;
        address submitter;
        string title;
        string description;
        string category;
        string contentHash; // IPFS hash
        string metadataHash; // IPFS metadata hash
        uint256 submissionTime;
        uint256 aiCredibilityScore;
        bool isApproved;
        bool isMinted;
        address validator;
        string validationNotes;
        uint256 mintedTokenId;
    }
    
    // Category management
    struct Category {
        string name;
        string description;
        uint256 submissionFee; // Fee in wei
        bool isActive;
        uint256 totalSubmissions;
    }
    
    mapping(uint256 => IdeaSubmission) public ideaSubmissions;
    mapping(string => Category) public categories;
    mapping(address => uint256[]) public userSubmissions;
    mapping(string => bool) public usedContentHashes;
    
    // Contract addresses
    IPNFT public ipNFT;
    ForgeToken public forgeToken;
    
    // Platform fees and settings
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public constant MAX_PLATFORM_FEE = 1000; // 10% max
    address public feeRecipient;
    uint256 public minSubmissionFee = 0.001 ether;
    
    // Events
    event IdeaSubmitted(
        uint256 indexed ideaId,
        address indexed submitter,
        string title,
        string category,
        string contentHash
    );
    event IdeaApproved(
        uint256 indexed ideaId,
        address indexed validator,
        uint256 aiCredibilityScore
    );
    event IdeaRejected(
        uint256 indexed ideaId,
        address indexed validator,
        string reason
    );
    event IPNFTMinted(
        uint256 indexed ideaId,
        uint256 indexed tokenId,
        address indexed creator
    );
    event CategoryAdded(
        string indexed categoryName,
        uint256 submissionFee,
        bool isActive
    );
    event CategoryUpdated(
        string indexed categoryName,
        uint256 submissionFee,
        bool isActive
    );
    event PlatformFeeUpdated(uint256 newFee);
    event FeeRecipientUpdated(address newRecipient);
    
    constructor(
        address _ipNFT,
        address _forgeToken,
        address _feeRecipient
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(VALIDATOR_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        
        ipNFT = IPNFT(_ipNFT);
        forgeToken = ForgeToken(_forgeToken);
        feeRecipient = _feeRecipient;
        
        // Initialize default categories
        _addCategory("Technology", "Tech innovations and software solutions", 0, true);
        _addCategory("Art", "Digital art, music, and creative works", 0, true);
        _addCategory("Business", "Business ideas and strategies", 0, true);
        _addCategory("Science", "Scientific research and discoveries", 0, true);
        _addCategory("Education", "Educational content and methodologies", 0, true);
    }
    
    /**
     * @dev Submit a new idea
     * @param title Title of the idea
     * @param description Detailed description
     * @param category Category of the idea
     * @param contentHash IPFS hash of the content
     * @param metadataHash IPFS hash of the metadata
     */
    function submitIdea(
        string memory title,
        string memory description,
        string memory category,
        string memory contentHash,
        string memory metadataHash
    ) external payable nonReentrant whenNotPaused {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");
        require(!usedContentHashes[contentHash], "Content hash already used");
        require(categories[category].isActive, "Category not active");
        
        uint256 submissionFee = categories[category].submissionFee;
        require(msg.value >= submissionFee, "Insufficient submission fee");
        
        uint256 ideaId = _ideaIdCounter.current();
        _ideaIdCounter.increment();
        
        IdeaSubmission storage submission = ideaSubmissions[ideaId];
        submission.ideaId = ideaId;
        submission.submitter = msg.sender;
        submission.title = title;
        submission.description = description;
        submission.category = category;
        submission.contentHash = contentHash;
        submission.metadataHash = metadataHash;
        submission.submissionTime = block.timestamp;
        submission.aiCredibilityScore = 0; // Will be set by AI validation
        submission.isApproved = false;
        submission.isMinted = false;
        
        usedContentHashes[contentHash] = true;
        userSubmissions[msg.sender].push(ideaId);
        categories[category].totalSubmissions++;
        
        // Refund excess payment
        if (msg.value > submissionFee) {
            payable(msg.sender).transfer(msg.value - submissionFee);
        }
        
        // Transfer fee to platform
        if (submissionFee > 0) {
            payable(feeRecipient).transfer(submissionFee);
        }
        
        emit IdeaSubmitted(ideaId, msg.sender, title, category, contentHash);
    }
    
    /**
     * @dev Approve an idea submission (only validators)
     * @param ideaId ID of the idea to approve
     * @param aiCredibilityScore AI credibility score (0-100)
     * @param validationNotes Notes from the validator
     */
    function approveIdea(
        uint256 ideaId,
        uint256 aiCredibilityScore,
        string memory validationNotes
    ) external onlyRole(VALIDATOR_ROLE) {
        require(ideaId < _ideaIdCounter.current(), "Idea does not exist");
        require(!ideaSubmissions[ideaId].isApproved, "Idea already approved");
        require(aiCredibilityScore <= 100, "Invalid AI score");
        
        IdeaSubmission storage submission = ideaSubmissions[ideaId];
        submission.isApproved = true;
        submission.aiCredibilityScore = aiCredibilityScore;
        submission.validator = msg.sender;
        submission.validationNotes = validationNotes;
        
        emit IdeaApproved(ideaId, msg.sender, aiCredibilityScore);
    }
    
    /**
     * @dev Reject an idea submission (only validators)
     * @param ideaId ID of the idea to reject
     * @param reason Reason for rejection
     */
    function rejectIdea(
        uint256 ideaId,
        string memory reason
    ) external onlyRole(VALIDATOR_ROLE) {
        require(ideaId < _ideaIdCounter.current(), "Idea does not exist");
        require(!ideaSubmissions[ideaId].isApproved, "Idea already approved");
        
        IdeaSubmission storage submission = ideaSubmissions[ideaId];
        submission.validator = msg.sender;
        submission.validationNotes = reason;
        
        emit IdeaRejected(ideaId, msg.sender, reason);
    }
    
    /**
     * @dev Mint IP-NFT for approved idea (only minters)
     * @param ideaId ID of the approved idea
     * @param tokenURI URI for the NFT metadata
     * @param royaltyFee Royalty fee in basis points
     */
    function mintIPNFT(
        uint256 ideaId,
        string memory tokenURI,
        uint96 royaltyFee
    ) external onlyRole(MINTER_ROLE) {
        require(ideaId < _ideaIdCounter.current(), "Idea does not exist");
        require(ideaSubmissions[ideaId].isApproved, "Idea not approved");
        require(!ideaSubmissions[ideaId].isMinted, "Already minted");
        
        IdeaSubmission storage submission = ideaSubmissions[ideaId];
        
        // Mint the IP-NFT
        uint256 tokenId = ipNFT.mintIPNFT(
            submission.submitter,
            tokenURI,
            submission.submitter,
            submission.category,
            submission.description,
            submission.aiCredibilityScore,
            royaltyFee,
            submission.contentHash
        );
        
        submission.isMinted = true;
        submission.mintedTokenId = tokenId;
        
        // Reward submitter with FORGE tokens
        uint256 rewardAmount = _calculateReward(submission.aiCredibilityScore);
        forgeToken.mint(submission.submitter, rewardAmount);
        
        emit IPNFTMinted(ideaId, tokenId, submission.submitter);
    }
    
    /**
     * @dev Add a new category (only admin)
     * @param name Name of the category
     * @param description Description of the category
     * @param submissionFee Fee for submissions in this category
     * @param isActive Whether the category is active
     */
    function addCategory(
        string memory name,
        string memory description,
        uint256 submissionFee,
        bool isActive
    ) external onlyRole(ADMIN_ROLE) {
        _addCategory(name, description, submissionFee, isActive);
    }
    
    /**
     * @dev Internal function to add category
     */
    function _addCategory(
        string memory name,
        string memory description,
        uint256 submissionFee,
        bool isActive
    ) internal {
        categories[name] = Category({
            name: name,
            description: description,
            submissionFee: submissionFee,
            isActive: isActive,
            totalSubmissions: 0
        });
        
        emit CategoryAdded(name, submissionFee, isActive);
    }
    
    /**
     * @dev Update category settings (only admin)
     * @param name Name of the category
     * @param submissionFee New submission fee
     * @param isActive Whether the category is active
     */
    function updateCategory(
        string memory name,
        uint256 submissionFee,
        bool isActive
    ) external onlyRole(ADMIN_ROLE) {
        require(bytes(categories[name].name).length > 0, "Category does not exist");
        
        categories[name].submissionFee = submissionFee;
        categories[name].isActive = isActive;
        
        emit CategoryUpdated(name, submissionFee, isActive);
    }
    
    /**
     * @dev Calculate reward amount based on AI credibility score
     * @param aiScore AI credibility score (0-100)
     * @return rewardAmount Amount of FORGE tokens to reward
     */
    function _calculateReward(uint256 aiScore) internal pure returns (uint256) {
        // Base reward: 100 FORGE tokens
        // Bonus: up to 100 additional tokens based on AI score
        uint256 baseReward = 100 * 10**18;
        uint256 bonusReward = (aiScore * 10**18) / 10; // 0-10 additional tokens
        return baseReward + bonusReward;
    }
    
    /**
     * @dev Get idea submission details
     * @param ideaId ID of the idea
     * @return submission Idea submission data
     */
    function getIdeaSubmission(uint256 ideaId) external view returns (IdeaSubmission memory) {
        require(ideaId < _ideaIdCounter.current(), "Idea does not exist");
        return ideaSubmissions[ideaId];
    }
    
    /**
     * @dev Get user's submissions
     * @param user Address of the user
     * @return submissions Array of idea IDs
     */
    function getUserSubmissions(address user) external view returns (uint256[] memory) {
        return userSubmissions[user];
    }
    
    /**
     * @dev Get category information
     * @param categoryName Name of the category
     * @return category Category data
     */
    function getCategory(string memory categoryName) external view returns (Category memory) {
        return categories[categoryName];
    }
    
    /**
     * @dev Update platform fee (only admin)
     * @param newFee New platform fee in basis points
     */
    function updatePlatformFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
        require(newFee <= MAX_PLATFORM_FEE, "Fee too high");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    /**
     * @dev Update fee recipient (only admin)
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyRole(ADMIN_ROLE) {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
    
    /**
     * @dev Pause the contract (only admin)
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only admin)
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Get total number of submissions
     * @return total Total number of submissions
     */
    function getTotalSubmissions() external view returns (uint256) {
        return _ideaIdCounter.current();
    }
}
