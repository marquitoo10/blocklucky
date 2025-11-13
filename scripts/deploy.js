const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const BlockLucky = await hre.ethers.getContractFactory("BlockLucky");
  const contract = await BlockLucky.deploy(
    hre.ethers.parseEther("0.01"),
    3
  );
  await contract.waitForDeployment();
  console.log(contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
