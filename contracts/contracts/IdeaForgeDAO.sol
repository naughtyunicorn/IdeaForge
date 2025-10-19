// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ForgeToken.sol";

/**
 * @title IdeaForgeDAO
 * @dev DAO governance contract using OpenZeppelin Governor
 * @author TRTSKCS
 */
contract IdeaForgeDAO is 
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    // Custom proposal types
    enum ProposalType {
        GENERAL,        // General governance proposal
        TREASURY,       // Treasury management
        PLATFORM,       // Platform parameter changes
        CATEGORY,       // Category management
        EMERGENCY       // Emergency actions
    }
    
    // Proposal metadata
    struct ProposalMetadata {
        ProposalType proposalType;
        string title;
        string description;
        string externalLink;
        uint256 createdAt;
        address proposer;
    }
    
    mapping(uint256 => ProposalMetadata) public proposalMetadata;
    
    // Treasury management
    address public treasury;
    uint256 public treasuryBalance;
    
    // Platform parameters that can be governed
    address public ideaForgeCore;
    address public revenueSplitter;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        ProposalType proposalType,
        string title
    );
    event TreasuryUpdated(address indexed newTreasury);
    event TreasuryBalanceUpdated(uint256 newBalance);
    event EmergencyActionExecuted(
        uint256 indexed proposalId,
        string action,
        address indexed executor
    );
    
    constructor(
        ForgeToken _token,
        TimelockController _timelock,
        address _treasury
    )
        Governor("IdeaForge DAO")
        GovernorSettings(
            1, // voting delay (1 block)
            172800, // voting period (2 days)
            0 // proposal threshold (0 tokens)
        )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {
        treasury = _treasury;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Create a new proposal with metadata
     * @param targets Array of target addresses
     * @param values Array of ETH values
     * @param calldatas Array of calldata
     * @param description Description of the proposal
     * @param proposalType Type of the proposal
     * @param title Title of the proposal
     * @param externalLink External link for more details
     */
    function proposeWithMetadata(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description,
        ProposalType proposalType,
        string memory title,
        string memory externalLink
    ) public returns (uint256) {
        uint256 proposalId = propose(targets, values, calldatas, description);
        
        proposalMetadata[proposalId] = ProposalMetadata({
            proposalType: proposalType,
            title: title,
            description: description,
            externalLink: externalLink,
            createdAt: block.timestamp,
            proposer: msg.sender
        });
        
        emit ProposalCreated(proposalId, msg.sender, proposalType, title);
        
        return proposalId;
    }
    
    /**
     * @dev Create a treasury management proposal
     * @param target Target contract address
     * @param value ETH value to send
     * @param calldata Calldata for the call
     * @param description Description of the proposal
     * @param title Title of the proposal
     */
    function proposeTreasuryAction(
        address target,
        uint256 value,
        bytes memory calldata,
        string memory description,
        string memory title
    ) external returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = target;
        values[0] = value;
        calldatas[0] = calldata;
        
        return proposeWithMetadata(
            targets,
            values,
            calldatas,
            description,
            ProposalType.TREASURY,
            title,
            ""
        );
    }
    
    /**
     * @dev Create a platform parameter change proposal
     * @param target Target contract address
     * @param calldata Calldata for the call
     * @param description Description of the proposal
     * @param title Title of the proposal
     */
    function proposePlatformChange(
        address target,
        bytes memory calldata,
        string memory description,
        string memory title
    ) external returns (uint256) {
        address[] memory targets = new address[](1);
        uint256[] memory values = new uint256[](1);
        bytes[] memory calldatas = new bytes[](1);
        
        targets[0] = target;
        values[0] = 0;
        calldatas[0] = calldata;
        
        return proposeWithMetadata(
            targets,
            values,
            calldatas,
            description,
            ProposalType.PLATFORM,
            title,
            ""
        );
    }
    
    /**
     * @dev Execute a proposal (only after timelock)
     * @param targets Array of target addresses
     * @param values Array of ETH values
     * @param calldatas Array of calldata
     * @param descriptionHash Hash of the description
     */
    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public payable override(Governor, GovernorTimelockControl) {
        super.execute(targets, values, calldatas, descriptionHash);
        
        // Update treasury balance after execution
        _updateTreasuryBalance();
    }
    
    /**
     * @dev Get proposal metadata
     * @param proposalId ID of the proposal
     * @return metadata Proposal metadata
     */
    function getProposalMetadata(uint256 proposalId) external view returns (ProposalMetadata memory) {
        return proposalMetadata[proposalId];
    }
    
    /**
     * @dev Get proposals by type
     * @param proposalType Type of proposals to filter
     * @param offset Starting index
     * @param limit Maximum number of proposals to return
     * @return proposalIds Array of proposal IDs
     */
    function getProposalsByType(
        ProposalType proposalType,
        uint256 offset,
        uint256 limit
    ) external view returns (uint256[] memory proposalIds) {
        // This is a simplified implementation
        // In a real scenario, you'd want to maintain an index
        uint256[] memory tempIds = new uint256[](limit);
        uint256 count = 0;
        
        for (uint256 i = offset; i < offset + limit && i < proposalCount(); i++) {
            if (proposalMetadata[i].proposalType == proposalType) {
                tempIds[count] = i;
                count++;
            }
        }
        
        proposalIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            proposalIds[i] = tempIds[i];
        }
    }
    
    /**
     * @dev Update treasury address (only admin)
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    /**
     * @dev Update treasury balance
     */
    function _updateTreasuryBalance() internal {
        if (treasury != address(0)) {
            treasuryBalance = treasury.balance;
            emit TreasuryBalanceUpdated(treasuryBalance);
        }
    }
    
    /**
     * @dev Set contract addresses (only admin)
     * @param _ideaForgeCore IdeaForgeCore contract address
     * @param _revenueSplitter RevenueSplitter contract address
     */
    function setContractAddresses(
        address _ideaForgeCore,
        address _revenueSplitter
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ideaForgeCore = _ideaForgeCore;
        revenueSplitter = _revenueSplitter;
    }
    
    /**
     * @dev Emergency action (only admin, for critical situations)
     * @param action Action to execute
     * @param target Target address
     * @param data Calldata
     */
    function emergencyAction(
        string memory action,
        address target,
        bytes memory data
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // This should be used only in extreme circumstances
        (bool success, ) = target.call(data);
        require(success, "Emergency action failed");
        
        emit EmergencyActionExecuted(0, action, msg.sender);
    }
    
    /**
     * @dev Get voting power of an account at a specific block
     * @param account Account address
     * @param blockNumber Block number
     * @return votingPower Voting power
     */
    function getVotingPower(address account, uint256 blockNumber) external view returns (uint256) {
        return getVotes(account, blockNumber);
    }
    
    /**
     * @dev Get current voting power of an account
     * @param account Account address
     * @return votingPower Current voting power
     */
    function getCurrentVotingPower(address account) external view returns (uint256) {
        return getVotes(account, block.number);
    }
    
    /**
     * @dev Override required by Solidity
     */
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }
    
    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }
    
    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }
    
    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }
    
    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor, IGovernor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }
    
    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }
    
    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }
    
    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }
    
    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
