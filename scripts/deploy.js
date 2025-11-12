const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  const BlockLucky = await hre.ethers.getContractFactory("BlockLucky");
  const contract = await BlockLucky.deploy(
    hre.ethers.parseEther("0.01"), // prix du ticket
    3                              // nombre max de joueurs
  );

  await contract.waitForDeployment();
  console.log("BlockLucky deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
