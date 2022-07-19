import { ethers } from "hardhat";

async function main() {
  const LoveLetter = await ethers.getContractFactory("LoveLetter");
  const loveLetter = await LoveLetter.deploy();

  await loveLetter.deployed();

  console.log("LoveLetter deployed to:", loveLetter.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
