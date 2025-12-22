import { ethers } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log("Deploying AthleteRegistration contract...");

  const AthleteRegistration = await ethers.getContractFactory("AthleteRegistration");
  console.log("Contract factory created");

  const athleteRegistration = await AthleteRegistration.deploy();
  console.log("Deployment transaction sent");

  await athleteRegistration.waitForDeployment();
  console.log("Contract deployed, waiting for confirmation");

  const address = await athleteRegistration.getAddress();
  console.log(`AthleteRegistration contract deployed to: ${address}`);

  // Save deployment info
  const deploymentDir = path.join(__dirname, '..', 'deployments', 'localhost');

  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir, { recursive: true });
  }

  const deploymentInfo = {
    address: address,
    abi: AthleteRegistration.interface.format('json'),
    receipt: await athleteRegistration.deploymentTransaction()?.wait()
  };

  const filePath = path.join(deploymentDir, 'AthleteRegistration.json');
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));

  console.log(`Deployment info saved to: ${filePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
