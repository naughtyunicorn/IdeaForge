// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ForgeToken
 * @dev ERC-20 token with voting capabilities for IdeaForge DAO
 * @author TRTSKCS
 */
contract ForgeToken is ERC20, ERC20Votes, Ownable, Pausable {
    uint256 public constant INITIAL_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_SUPPLY = 10000000000 * 10**18; // 10 billion max supply
    
    // Staking rewards
    uint256 public stakingRewardRate = 100; // 1% annual reward rate (in basis points)
    uint256 public constant REWARD_PRECISION = 10000;
    
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public stakingStartTime;
    mapping(address => uint256) public lastClaimTime;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event StakingRewardRateUpdated(uint256 newRate);
    
    constructor() ERC20("IdeaForge Token", "FORGE") EIP712("IdeaForge", "1") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    /**
     * @dev Stake tokens to earn rewards and gain voting power
     * @param amount Amount of tokens to stake
     */
    function stake(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Claim any pending rewards first
        if (stakingBalance[msg.sender] > 0) {
            _claimRewards();
        }
        
        _transfer(msg.sender, address(this), amount);
        stakingBalance[msg.sender] += amount;
        stakingStartTime[msg.sender] = block.timestamp;
        lastClaimTime[msg.sender] = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens
     * @param amount Amount of tokens to unstake
     */
    function unstake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(stakingBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        // Claim any pending rewards first
        _claimRewards();
        
        stakingBalance[msg.sender] -= amount;
        _transfer(address(this), msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
    
    /**
     * @dev Claim staking rewards
     */
    function claimRewards() external {
        require(stakingBalance[msg.sender] > 0, "No staked tokens");
        _claimRewards();
    }
    
    /**
     * @dev Internal function to calculate and claim rewards
     */
    function _claimRewards() internal {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            lastClaimTime[msg.sender] = block.timestamp;
            _mint(msg.sender, rewards);
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    /**
     * @dev Calculate pending rewards for a staker
     * @param staker Address of the staker
     * @return rewards Amount of pending rewards
     */
    function calculateRewards(address staker) public view returns (uint256) {
        if (stakingBalance[staker] == 0) return 0;
        
        uint256 timeStaked = block.timestamp - lastClaimTime[staker];
        uint256 rewards = (stakingBalance[staker] * stakingRewardRate * timeStaked) / 
                         (REWARD_PRECISION * 365 days);
        
        return rewards;
    }
    
    /**
     * @dev Update staking reward rate (only owner)
     * @param newRate New reward rate in basis points
     */
    function updateStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 1000, "Reward rate too high"); // Max 10%
        stakingRewardRate = newRate;
        emit StakingRewardRateUpdated(newRate);
    }
    
    /**
     * @dev Mint new tokens (only owner, up to max supply)
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    /**
     * @dev Pause token transfers (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to handle pausing
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Override _afterTokenTransfer to handle voting power
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Override _mint to handle voting power
     */
    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }
    
    /**
     * @dev Override _burn to handle voting power
     */
    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
        super._burn(account, amount);
    }
}
