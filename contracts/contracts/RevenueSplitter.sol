// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./ForgeToken.sol";

/**
 * @title RevenueSplitter
 * @dev Handles revenue distribution among creators, DAO, and platform
 * @author TRTSKCS
 */
contract RevenueSplitter is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    
    // Revenue split configuration
    struct RevenueSplit {
        uint256 creatorShare;      // Creator's share in basis points
        uint256 daoShare;          // DAO's share in basis points
        uint256 platformShare;     // Platform's share in basis points
        uint256 validatorShare;    // Validator's share in basis points
        uint256 totalShares;       // Total shares (should equal 10000)
    }
    
    // Payment recipient addresses
    address public dao;
    address public platform;
    address public validatorPool;
    
    // Revenue split configuration
    RevenueSplit public defaultSplit;
    
    // Token addresses
    ForgeToken public forgeToken;
    IERC20 public weth; // Wrapped ETH for Polygon
    
    // Revenue tracking
    mapping(address => uint256) public creatorEarnings;
    mapping(address => uint256) public validatorEarnings;
    uint256 public totalPlatformRevenue;
    uint256 public totalDaoRevenue;
    
    // Payment methods
    enum PaymentMethod {
        ETH,
        FORGE_TOKEN,
        WETH
    }
    
    // Events
    event RevenueDistributed(
        address indexed creator,
        uint256 amount,
        PaymentMethod method,
        uint256 creatorShare,
        uint256 daoShare,
        uint256 platformShare
    );
    event CreatorEarningsClaimed(address indexed creator, uint256 amount);
    event ValidatorEarningsClaimed(address indexed validator, uint256 amount);
    event RevenueSplitUpdated(
        uint256 creatorShare,
        uint256 daoShare,
        uint256 platformShare,
        uint256 validatorShare
    );
    event PaymentMethodUpdated(PaymentMethod newMethod);
    
    constructor(
        address _dao,
        address _platform,
        address _validatorPool,
        address _forgeToken,
        address _weth
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);
        
        dao = _dao;
        platform = _platform;
        validatorPool = _validatorPool;
        forgeToken = ForgeToken(_forgeToken);
        weth = IERC20(_weth);
        
        // Default revenue split: 70% creator, 15% DAO, 10% platform, 5% validators
        defaultSplit = RevenueSplit({
            creatorShare: 7000,
            daoShare: 1500,
            platformShare: 1000,
            validatorShare: 500,
            totalShares: 10000
        });
    }
    
    /**
     * @dev Distribute revenue from IP-NFT sales
     * @param creator Address of the creator
     * @param amount Total amount to distribute
     * @param method Payment method
     */
    function distributeRevenue(
        address creator,
        uint256 amount,
        PaymentMethod method
    ) external onlyRole(DISTRIBUTOR_ROLE) nonReentrant whenNotPaused {
        require(creator != address(0), "Invalid creator address");
        require(amount > 0, "Amount must be greater than 0");
        
        RevenueSplit memory split = defaultSplit;
        
        // Calculate shares
        uint256 creatorAmount = (amount * split.creatorShare) / 10000;
        uint256 daoAmount = (amount * split.daoShare) / 10000;
        uint256 platformAmount = (amount * split.platformShare) / 10000;
        uint256 validatorAmount = (amount * split.validatorShare) / 10000;
        
        // Distribute payments based on method
        if (method == PaymentMethod.ETH) {
            _distributeETH(creator, creatorAmount, daoAmount, platformAmount, validatorAmount);
        } else if (method == PaymentMethod.FORGE_TOKEN) {
            _distributeForgeToken(creator, creatorAmount, daoAmount, platformAmount, validatorAmount);
        } else if (method == PaymentMethod.WETH) {
            _distributeWETH(creator, creatorAmount, daoAmount, platformAmount, validatorAmount);
        }
        
        // Update tracking
        creatorEarnings[creator] += creatorAmount;
        totalPlatformRevenue += platformAmount;
        totalDaoRevenue += daoAmount;
        
        emit RevenueDistributed(
            creator,
            amount,
            method,
            creatorAmount,
            daoAmount,
            platformAmount
        );
    }
    
    /**
     * @dev Distribute ETH payments
     */
    function _distributeETH(
        address creator,
        uint256 creatorAmount,
        uint256 daoAmount,
        uint256 platformAmount,
        uint256 validatorAmount
    ) internal {
        if (creatorAmount > 0) {
            payable(creator).transfer(creatorAmount);
        }
        if (daoAmount > 0) {
            payable(dao).transfer(daoAmount);
        }
        if (platformAmount > 0) {
            payable(platform).transfer(platformAmount);
        }
        if (validatorAmount > 0) {
            payable(validatorPool).transfer(validatorAmount);
        }
    }
    
    /**
     * @dev Distribute FORGE token payments
     */
    function _distributeForgeToken(
        address creator,
        uint256 creatorAmount,
        uint256 daoAmount,
        uint256 platformAmount,
        uint256 validatorAmount
    ) internal {
        if (creatorAmount > 0) {
            forgeToken.mint(creator, creatorAmount);
        }
        if (daoAmount > 0) {
            forgeToken.mint(dao, daoAmount);
        }
        if (platformAmount > 0) {
            forgeToken.mint(platform, platformAmount);
        }
        if (validatorAmount > 0) {
            forgeToken.mint(validatorPool, validatorAmount);
        }
    }
    
    /**
     * @dev Distribute WETH payments
     */
    function _distributeWETH(
        address creator,
        uint256 creatorAmount,
        uint256 daoAmount,
        uint256 platformAmount,
        uint256 validatorAmount
    ) internal {
        if (creatorAmount > 0) {
            weth.safeTransfer(creator, creatorAmount);
        }
        if (daoAmount > 0) {
            weth.safeTransfer(dao, daoAmount);
        }
        if (platformAmount > 0) {
            weth.safeTransfer(platform, platformAmount);
        }
        if (validatorAmount > 0) {
            weth.safeTransfer(validatorPool, validatorAmount);
        }
    }
    
    /**
     * @dev Claim creator earnings
     * @param amount Amount to claim
     */
    function claimCreatorEarnings(uint256 amount) external nonReentrant {
        require(creatorEarnings[msg.sender] >= amount, "Insufficient earnings");
        require(amount > 0, "Amount must be greater than 0");
        
        creatorEarnings[msg.sender] -= amount;
        
        // Transfer ETH to creator
        payable(msg.sender).transfer(amount);
        
        emit CreatorEarningsClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Claim validator earnings
     * @param amount Amount to claim
     */
    function claimValidatorEarnings(uint256 amount) external nonReentrant {
        require(validatorEarnings[msg.sender] >= amount, "Insufficient earnings");
        require(amount > 0, "Amount must be greater than 0");
        
        validatorEarnings[msg.sender] -= amount;
        
        // Transfer ETH to validator
        payable(msg.sender).transfer(amount);
        
        emit ValidatorEarningsClaimed(msg.sender, amount);
    }
    
    /**
     * @dev Update revenue split configuration (only admin)
     * @param creatorShare Creator's share in basis points
     * @param daoShare DAO's share in basis points
     * @param platformShare Platform's share in basis points
     * @param validatorShare Validator's share in basis points
     */
    function updateRevenueSplit(
        uint256 creatorShare,
        uint256 daoShare,
        uint256 platformShare,
        uint256 validatorShare
    ) external onlyRole(ADMIN_ROLE) {
        require(creatorShare + daoShare + platformShare + validatorShare == 10000, "Total must equal 10000");
        
        defaultSplit = RevenueSplit({
            creatorShare: creatorShare,
            daoShare: daoShare,
            platformShare: platformShare,
            validatorShare: validatorShare,
            totalShares: 10000
        });
        
        emit RevenueSplitUpdated(creatorShare, daoShare, platformShare, validatorShare);
    }
    
    /**
     * @dev Update recipient addresses (only admin)
     * @param _dao New DAO address
     * @param _platform New platform address
     * @param _validatorPool New validator pool address
     */
    function updateRecipients(
        address _dao,
        address _platform,
        address _validatorPool
    ) external onlyRole(ADMIN_ROLE) {
        if (_dao != address(0)) dao = _dao;
        if (_platform != address(0)) platform = _platform;
        if (_validatorPool != address(0)) validatorPool = _validatorPool;
    }
    
    /**
     * @dev Get creator's total earnings
     * @param creator Creator address
     * @return earnings Total earnings
     */
    function getCreatorEarnings(address creator) external view returns (uint256) {
        return creatorEarnings[creator];
    }
    
    /**
     * @dev Get validator's total earnings
     * @param validator Validator address
     * @return earnings Total earnings
     */
    function getValidatorEarnings(address validator) external view returns (uint256) {
        return validatorEarnings[validator];
    }
    
    /**
     * @dev Get total platform revenue
     * @return revenue Total platform revenue
     */
    function getTotalPlatformRevenue() external view returns (uint256) {
        return totalPlatformRevenue;
    }
    
    /**
     * @dev Get total DAO revenue
     * @return revenue Total DAO revenue
     */
    function getTotalDaoRevenue() external view returns (uint256) {
        return totalDaoRevenue;
    }
    
    /**
     * @dev Emergency withdraw (only admin)
     * @param token Token address (address(0) for ETH)
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (token == address(0)) {
            payable(msg.sender).transfer(amount);
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }
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
     * @dev Receive ETH
     */
    receive() external payable {}
}
