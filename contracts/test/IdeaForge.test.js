const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdeaForge Platform", function () {
  let forgeToken, ipNFT, ideaForgeCore, ideaForgeDAO, revenueSplitter, timelockController;
  let owner, user1, user2, validator, platform;
  let deploymentInfo;

  beforeEach(async function () {
    [owner, user1, user2, validator, platform] = await ethers.getSigners();

    // Deploy ForgeToken
    const ForgeToken = await ethers.getContractFactory("ForgeToken");
    forgeToken = await ForgeToken.deploy();
    await forgeToken.deployed();

    // Deploy IPNFT
    const IPNFT = await ethers.getContractFactory("IPNFT");
    ipNFT = await IPNFT.deploy();
    await ipNFT.deployed();

    // Deploy RevenueSplitter
    const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
    revenueSplitter = await RevenueSplitter.deploy(
      owner.address, // DAO
      platform.address, // Platform
      owner.address, // Validator pool
      forgeToken.address,
      ethers.constants.AddressZero // WETH
    );
    await revenueSplitter.deployed();

    // Deploy IdeaForgeCore
    const IdeaForgeCore = await ethers.getContractFactory("IdeaForgeCore");
    ideaForgeCore = await IdeaForgeCore.deploy(
      ipNFT.address,
      forgeToken.address,
      platform.address
    );
    await ideaForgeCore.deployed();

    // Deploy TimelockController
    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelockController = await TimelockController.deploy(
      0, // Min delay
      [owner.address], // Proposers
      [owner.address], // Executors
      owner.address // Admin
    );
    await timelockController.deployed();

    // Deploy IdeaForgeDAO
    const IdeaForgeDAO = await ethers.getContractFactory("IdeaForgeDAO");
    ideaForgeDAO = await IdeaForgeDAO.deploy(
      forgeToken.address,
      timelockController.address,
      owner.address
    );
    await ideaForgeDAO.deployed();

    // Set up roles
    await ipNFT.grantRole(await ipNFT.MINTER_ROLE(), ideaForgeCore.address);
    await revenueSplitter.grantRole(await revenueSplitter.DISTRIBUTOR_ROLE(), ideaForgeCore.address);
    await ideaForgeCore.grantRole(await ideaForgeCore.VALIDATOR_ROLE(), validator.address);
    await ideaForgeCore.grantRole(await ideaForgeCore.MINTER_ROLE(), owner.address);

    // Update addresses
    await revenueSplitter.updateRecipients(ideaForgeDAO.address, platform.address, owner.address);
    await ideaForgeDAO.setContractAddresses(ideaForgeCore.address, revenueSplitter.address);
  });

  describe("ForgeToken", function () {
    it("Should have correct initial supply", async function () {
      const totalSupply = await forgeToken.totalSupply();
      expect(totalSupply).to.equal(ethers.utils.parseEther("1000000000")); // 1 billion tokens
    });

    it("Should allow staking", async function () {
      const stakeAmount = ethers.utils.parseEther("1000");
      await forgeToken.connect(user1).stake(stakeAmount);
      
      const stakingBalance = await forgeToken.stakingBalance(user1.address);
      expect(stakingBalance).to.equal(stakeAmount);
    });

    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.utils.parseEther("1000");
      await forgeToken.connect(user1).stake(stakeAmount);
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [365 * 24 * 60 * 60]); // 1 year
      await ethers.provider.send("evm_mine");
      
      const rewards = await forgeToken.calculateRewards(user1.address);
      expect(rewards).to.be.gt(0);
    });
  });

  describe("IdeaForgeCore", function () {
    it("Should allow idea submission", async function () {
      const tx = await ideaForgeCore.connect(user1).submitIdea(
        "Test Idea",
        "This is a test idea description",
        "Technology",
        "QmTestHash123",
        "QmMetadataHash123",
        { value: ethers.utils.parseEther("0.001") }
      );
      
      await expect(tx)
        .to.emit(ideaForgeCore, "IdeaSubmitted")
        .withArgs(0, user1.address, "Test Idea", "Technology", "QmTestHash123");
    });

    it("Should allow idea approval", async function () {
      // Submit idea first
      await ideaForgeCore.connect(user1).submitIdea(
        "Test Idea",
        "This is a test idea description",
        "Technology",
        "QmTestHash123",
        "QmMetadataHash123",
        { value: ethers.utils.parseEther("0.001") }
      );

      // Approve idea
      const tx = await ideaForgeCore.connect(validator).approveIdea(
        0,
        85,
        "High quality idea with good potential"
      );
      
      await expect(tx)
        .to.emit(ideaForgeCore, "IdeaApproved")
        .withArgs(0, validator.address, 85);
    });

    it("Should mint IP-NFT for approved idea", async function () {
      // Submit and approve idea
      await ideaForgeCore.connect(user1).submitIdea(
        "Test Idea",
        "This is a test idea description",
        "Technology",
        "QmTestHash123",
        "QmMetadataHash123",
        { value: ethers.utils.parseEther("0.001") }
      );

      await ideaForgeCore.connect(validator).approveIdea(
        0,
        85,
        "High quality idea"
      );

      // Mint IP-NFT
      const tx = await ideaForgeCore.connect(owner).mintIPNFT(
        0,
        "https://ipfs.io/ipfs/QmTestMetadata",
        500 // 5% royalty
      );
      
      await expect(tx)
        .to.emit(ideaForgeCore, "IPNFTMinted")
        .withArgs(0, 0, user1.address);
    });
  });

  describe("IPNFT", function () {
    beforeEach(async function () {
      // Submit and approve idea first
      await ideaForgeCore.connect(user1).submitIdea(
        "Test Idea",
        "This is a test idea description",
        "Technology",
        "QmTestHash123",
        "QmMetadataHash123",
        { value: ethers.utils.parseEther("0.001") }
      );

      await ideaForgeCore.connect(validator).approveIdea(0, 85, "Good idea");
      await ideaForgeCore.connect(owner).mintIPNFT(
        0,
        "https://ipfs.io/ipfs/QmTestMetadata",
        500
      );
    });

    it("Should have correct metadata", async function () {
      const ipData = await ipNFT.getIPData(0);
      expect(ipData.creator).to.equal(user1.address);
      expect(ipData.aiScore).to.equal(85);
      expect(ipData.category).to.equal("Technology");
    });

    it("Should allow adding collaborators", async function () {
      await ipNFT.connect(user1).addCollaborator(user2.address, 2000); // 20% share
      
      const [collaborators, shares] = await ipNFT.getCollaborators(0);
      expect(collaborators[0]).to.equal(user2.address);
      expect(shares[0]).to.equal(2000);
    });

    it("Should handle licensing", async function () {
      const licensePrice = ethers.utils.parseEther("1.0");
      
      const tx = await ipNFT.connect(user2).licenseIP(0, licensePrice, {
        value: licensePrice
      });
      
      await expect(tx)
        .to.emit(ipNFT, "IPNFTLicensed")
        .withArgs(0, user2.address, licensePrice);
    });
  });

  describe("RevenueSplitter", function () {
    it("Should distribute revenue correctly", async function () {
      const amount = ethers.utils.parseEther("10.0");
      
      const tx = await revenueSplitter.connect(owner).distributeRevenue(
        user1.address,
        amount,
        0 // ETH payment method
      );
      
      await expect(tx)
        .to.emit(revenueSplitter, "RevenueDistributed")
        .withArgs(user1.address, amount, 0, 0, 0, 0);
    });

    it("Should track creator earnings", async function () {
      const amount = ethers.utils.parseEther("10.0");
      await revenueSplitter.connect(owner).distributeRevenue(
        user1.address,
        amount,
        0
      );
      
      const earnings = await revenueSplitter.getCreatorEarnings(user1.address);
      expect(earnings).to.be.gt(0);
    });
  });

  describe("IdeaForgeDAO", function () {
    it("Should create proposals", async function () {
      const tx = await ideaForgeDAO.connect(user1).proposeWithMetadata(
        [ideaForgeCore.address],
        [0],
        [ideaForgeCore.interface.encodeFunctionData("pause")],
        "Pause the platform",
        0, // GENERAL proposal type
        "Emergency Pause",
        "https://example.com/proposal"
      );
      
      await expect(tx)
        .to.emit(ideaForgeDAO, "ProposalCreated")
        .withArgs(0, user1.address, 0, "Emergency Pause");
    });

    it("Should handle voting", async function () {
      // Create proposal
      await ideaForgeDAO.connect(user1).proposeWithMetadata(
        [ideaForgeCore.address],
        [0],
        [ideaForgeCore.interface.encodeFunctionData("pause")],
        "Pause the platform",
        0,
        "Emergency Pause",
        ""
      );

      // Vote on proposal
      const tx = await ideaForgeDAO.connect(owner).castVote(0, 1); // For
      await expect(tx).to.not.be.reverted;
    });
  });

  describe("Integration Tests", function () {
    it("Should complete full workflow", async function () {
      // 1. User submits idea
      await ideaForgeCore.connect(user1).submitIdea(
        "Revolutionary AI Algorithm",
        "A new approach to machine learning",
        "Technology",
        "QmAIHash123",
        "QmAIMetadata123",
        { value: ethers.utils.parseEther("0.001") }
      );

      // 2. Validator approves idea
      await ideaForgeCore.connect(validator).approveIdea(
        0,
        95,
        "Excellent technical innovation"
      );

      // 3. Mint IP-NFT
      await ideaForgeCore.connect(owner).mintIPNFT(
        0,
        "https://ipfs.io/ipfs/QmAIMetadata",
        750 // 7.5% royalty
      );

      // 4. Add collaborator
      await ipNFT.connect(user1).addCollaborator(user2.address, 3000); // 30%

      // 5. License the IP
      const licensePrice = ethers.utils.parseEther("5.0");
      await ipNFT.connect(platform).licenseIP(0, licensePrice, {
        value: licensePrice
      });

      // 6. Verify final state
      const ipData = await ipNFT.getIPData(0);
      expect(ipData.isLicensed).to.be.true;
      expect(ipData.licensePrice).to.equal(licensePrice);
    });
  });
});
