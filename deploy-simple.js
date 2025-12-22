console.log("Script starting...");

const ethers = require("ethers");

async function main() {
  try {
    console.log("Step 1: Connecting to local hardhat node...");

    // Connect to local hardhat node
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    console.log("Step 2: Provider created");

    const signer = await provider.getSigner();
    console.log("Step 3: Signer obtained");

    console.log("Step 4: Getting network info...");
    const network = await provider.getNetwork();
    console.log("Step 5: Connected to network:", network.chainId);

    const address = await signer.getAddress();
    console.log("Step 6: Signer address:", address);

    const balance = await provider.getBalance(address);
    console.log("Step 7: Deployer balance:", ethers.formatEther(balance));

    console.log("Step 8: All tests passed!");
  } catch (error) {
    console.error("Error occurred:", error.message);
    console.error("Stack:", error.stack);
  }
}

console.log("About to call main...");
main()
  .then(() => console.log("Main completed successfully"))
  .catch((error) => {
    console.error("Main failed:", error);
    process.exit(1);
  });

console.log("Script end reached");
