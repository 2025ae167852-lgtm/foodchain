import { ethers } from "hardhat";

async function main() {
  const BatchAnchor = await ethers.getContractFactory("BatchAnchor");
  const contract = await BatchAnchor.deploy();
  await contract.deployed();
  console.log("BatchAnchor deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
