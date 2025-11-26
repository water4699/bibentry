const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

// Read the compiled contract data
const contractPath = path.join(__dirname, 'artifacts', 'contracts', 'AthleteRegistration.sol', 'AthleteRegistration.json');

if (!fs.existsSync(contractPath)) {
  console.error('❌ Contract artifacts not found. Please run: npm run compile');
  process.exit(1);
}

const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

async function main() {
  console.log('🚀 Deploying AthleteRegistration to Sepolia...');

  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990');

  // Create wallet
  const privateKey = '079d46175e36992cc4ea3650fb2a24b04f30a5907d26022a664aca8221304283';
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`💰 Deployer: ${wallet.address}`);

  // Create contract factory
  const factory = new ethers.ContractFactory(contractData.abi, contractData.bytecode, wallet);

  try {
    console.log('🏗️ Deploying contract...');
    const contract = await factory.deploy();

    console.log('⏳ Waiting for deployment...');
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`✅ Contract deployed at: ${address}`);

    // Save deployment info
    const deploymentDir = path.join(__dirname, 'deployments', 'sepolia');
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true });
    }

    const deploymentInfo = {
      address: address,
      abi: contractData.abi,
      deployedAt: new Date().toISOString(),
      network: 'sepolia',
      chainId: 11155111,
      deployer: wallet.address,
      transactionHash: contract.deploymentTransaction()?.hash
    };

    const filePath = path.join(deploymentDir, 'AthleteRegistration.json');
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

    console.log(`💾 Deployment info saved to: ${filePath}`);

    // Update frontend files
    const frontendAbiDir = path.join(__dirname, 'frontend', 'abi');

    // Update ABI
    const abiContent = `export const AthleteRegistrationABI = ${JSON.stringify({ abi: contractData.abi }, null, 2)} as const;\n`;
    fs.writeFileSync(path.join(frontendAbiDir, 'AthleteRegistrationABI.ts'), abiContent);

    // Update addresses
    const addressesContent = `export const AthleteRegistrationAddresses = {
  "31337": { address: "0x0000000000000000000000000000000000000000", chainId: 31337, chainName: "hardhat" },
  "11155111": { address: "${address}", chainId: 11155111, chainName: "sepolia" }
};
`;
    fs.writeFileSync(path.join(frontendAbiDir, 'AthleteRegistrationAddresses.ts'), addressesContent);

    console.log('✅ Frontend files updated');

    console.log(`\n🎯 Deployment Summary:`);
    console.log(`   Contract: AthleteRegistration`);
    console.log(`   Address: ${address}`);
    console.log(`   Network: Sepolia (Chain ID: 11155111)`);
    console.log(`   Deployer: ${wallet.address}`);
    console.log(`   Transaction: ${contract.deploymentTransaction()?.hash}`);

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

main();
