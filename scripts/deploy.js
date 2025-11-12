const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying BlockLucky with account:", deployer.address);

  const BlockLucky = await hre.ethers.getContractFactory("BlockLucky");
  const contract = await BlockLucky.deploy(
    hre.ethers.parseEther("0.01"), // prix du ticket = 0.01 ETH
    3                               // nombre max de joueurs
  );

  await contract.waitForDeployment();
  console.log("BlockLucky deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
