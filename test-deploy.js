console.log("Testing hardhat environment...");

const hre = require("hardhat");

async function main() {
  try {
    console.log("✓ Hardhat loaded successfully");
    console.log("✓ Network:", hre.network.name);
    console.log("✓ Chain ID:", (await hre.ethers.provider.getNetwork()).chainId);

    const signers = await hre.ethers.getSigners();
    console.log("✓ Signers available:", signers.length);

    if (signers.length > 0) {
      const balance = await hre.ethers.provider.getBalance(signers[0].address);
      console.log("✓ First signer balance:", hre.ethers.formatEther(balance), "ETH");
      console.log("✓ First signer address:", signers[0].address);
    }

    console.log("🎉 Hardhat environment test passed!");
  } catch (error) {
    console.error("❌ Hardhat environment test failed:", error.message);
    process.exit(1);
  }
}

main();
