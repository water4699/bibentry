import { task } from "hardhat/config.js";

task("test-task", "Test task")
  .setAction(async (taskArgs, hre) => {
    console.log("Test task executed successfully!");
  });
