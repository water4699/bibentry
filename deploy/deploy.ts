import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("🚀 Deploying AthleteRegistration contract...");

  const deployedAthleteRegistration = await deploy("AthleteRegistration", {
    from: deployer,
    log: true,
  });

  console.log(`✅ AthleteRegistration contract deployed at: ${deployedAthleteRegistration.address}`);
};

export default func;
func.id = "deploy_athleteRegistration_v5"; // id required to prevent reexecution
func.tags = ["AthleteRegistration"];
