const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting IdeaForge deployment...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy ForgeToken
  console.log("\n📝 Deploying ForgeToken...");
  const ForgeToken = await ethers.getContractFactory("ForgeToken");
  const forgeToken = await ForgeToken.deploy();
  await forgeToken.deployed();
  console.log("ForgeToken deployed to:", forgeToken.address);

  // Deploy IPNFT
  console.log("\n🎨 Deploying IPNFT...");
  const IPNFT = await ethers.getContractFactory("IPNFT");
  const ipNFT = await IPNFT.deploy();
  await ipNFT.deployed();
  console.log("IPNFT deployed to:", ipNFT.address);

  // Deploy RevenueSplitter
  console.log("\n💰 Deploying RevenueSplitter...");
  const RevenueSplitter = await ethers.getContractFactory("RevenueSplitter");
  const revenueSplitter = await RevenueSplitter.deploy(
    deployer.address, // DAO address (temporary)
    deployer.address, // Platform address (temporary)
    deployer.address, // Validator pool address (temporary)
    forgeToken.address,
    ethers.constants.AddressZero // WETH address (set to zero for now)
  );
  await revenueSplitter.deployed();
  console.log("RevenueSplitter deployed to:", revenueSplitter.address);

  // Deploy IdeaForgeCore
  console.log("\n🏗️ Deploying IdeaForgeCore...");
  const IdeaForgeCore = await ethers.getContractFactory("IdeaForgeCore");
  const ideaForgeCore = await IdeaForgeCore.deploy(
    ipNFT.address,
    forgeToken.address,
    deployer.address // Fee recipient
  );
  await ideaForgeCore.deployed();
  console.log("IdeaForgeCore deployed to:", ideaForgeCore.address);

  // Deploy TimelockController for DAO
  console.log("\n⏰ Deploying TimelockController...");
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelockController = await TimelockController.deploy(
    0, // Minimum delay (0 for testing)
    [deployer.address], // Proposers
    [deployer.address], // Executors
    deployer.address // Admin
  );
  await timelockController.deployed();
  console.log("TimelockController deployed to:", timelockController.address);

  // Deploy IdeaForgeDAO
  console.log("\n🗳️ Deploying IdeaForgeDAO...");
  const IdeaForgeDAO = await ethers.getContractFactory("IdeaForgeDAO");
  const ideaForgeDAO = await IdeaForgeDAO.deploy(
    forgeToken.address,
    timelockController.address,
    deployer.address // Treasury address
  );
  await ideaForgeDAO.deployed();
  console.log("IdeaForgeDAO deployed to:", ideaForgeDAO.address);

  // Grant roles
  console.log("\n🔐 Setting up roles...");
  
  // Grant MINTER_ROLE to IdeaForgeCore
  await ipNFT.grantRole(await ipNFT.MINTER_ROLE(), ideaForgeCore.address);
  console.log("Granted MINTER_ROLE to IdeaForgeCore");

  // Grant DISTRIBUTOR_ROLE to IdeaForgeCore
  await revenueSplitter.grantRole(await revenueSplitter.DISTRIBUTOR_ROLE(), ideaForgeCore.address);
  console.log("Granted DISTRIBUTOR_ROLE to IdeaForgeCore");

  // Update DAO addresses
  await revenueSplitter.updateRecipients(
    ideaForgeDAO.address,
    deployer.address, // Platform
    deployer.address  // Validator pool
  );
  console.log("Updated revenue splitter recipients");

  // Set contract addresses in DAO
  await ideaForgeDAO.setContractAddresses(
    ideaForgeCore.address,
    revenueSplitter.address
  );
  console.log("Set contract addresses in DAO");

  // Create deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer.address,
    contracts: {
      ForgeToken: forgeToken.address,
      IPNFT: ipNFT.address,
      IdeaForgeCore: ideaForgeCore.address,
      IdeaForgeDAO: ideaForgeDAO.address,
      RevenueSplitter: revenueSplitter.address,
      TimelockController: timelockController.address
    },
    timestamp: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  // Save deployment info
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to: ${deploymentFile}`);

  // Generate environment variables
  const envVars = `
# Contract Addresses for ${hre.network.name.toUpperCase()}
NEXT_PUBLIC_FORGE_TOKEN_ADDRESS=${forgeToken.address}
NEXT_PUBLIC_IP_NFT_ADDRESS=${ipNFT.address}
NEXT_PUBLIC_IDEA_FORGE_CORE_ADDRESS=${ideaForgeCore.address}
NEXT_PUBLIC_DAO_ADDRESS=${ideaForgeDAO.address}
NEXT_PUBLIC_REVENUE_SPLITTER_ADDRESS=${revenueSplitter.address}
NEXT_PUBLIC_TIMELOCK_ADDRESS=${timelockController.address}
  `.trim();

  const envFile = path.join(deploymentsDir, `${hre.network.name}.env`);
  fs.writeFileSync(envFile, envVars);
  console.log(`📄 Environment variables saved to: ${envFile}`);

  console.log("\n✅ Deployment completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`   ForgeToken: ${forgeToken.address}`);
  console.log(`   IPNFT: ${ipNFT.address}`);
  console.log(`   IdeaForgeCore: ${ideaForgeCore.address}`);
  console.log(`   IdeaForgeDAO: ${ideaForgeDAO.address}`);
  console.log(`   RevenueSplitter: ${revenueSplitter.address}`);
  console.log(`   TimelockController: ${timelockController.address}`);

  // Verify contracts on PolygonScan (if not localhost)
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("\n🔍 Verifying contracts on PolygonScan...");
    try {
      await hre.run("verify:verify", {
        address: forgeToken.address,
        constructorArguments: [],
      });
      console.log("✅ ForgeToken verified");
    } catch (error) {
      console.log("❌ ForgeToken verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: ipNFT.address,
        constructorArguments: [],
      });
      console.log("✅ IPNFT verified");
    } catch (error) {
      console.log("❌ IPNFT verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
