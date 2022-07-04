import { expect } from "chai";
import { Signer, utils } from "ethers";
import { ethers } from "hardhat";
import { LoveLetter } from "../typechain";

describe("LoveLetter", () => {
  let love: LoveLetter;
  let sender: Signer;
  let receiver: Signer;
  let stranger: Signer;
  before(async () => {
    const LoveLetterFactory = await ethers.getContractFactory("LoveLetter");
    love = await LoveLetterFactory.deploy();
    await love.deployed();
    const accounts = await ethers.getSigners();
    sender = accounts[0];
    receiver = accounts[1];
    stranger = accounts[2];
  });

  it("Should deployed and initiated", async () => {
    expect(await love.totalLetters()).to.equal(0);
  });

  it("Should send successfully", async () => {
    expect(
      await love.connect(sender).send(await receiver.getAddress(), "Love chu", {
        value: utils.parseEther("1"),
      })
    ).to.emit(love, "Sent");
    expect(await love.readMessage(0)).to.equal("Love chu");
    expect(await love.checkOpened(0)).to.equal(false);
    expect(await love.getSender(0)).to.equal(await sender.getAddress());
    expect(await love.getReceiver(0)).to.equal(await receiver.getAddress());
    expect(await love.getEtherAmount(0)).to.equal(utils.parseEther("1"));
  });

  it("Should error if open by stranger", async () => {
    expect(love.connect(stranger).open(0)).to.revertedWith("Not receiver");
  });

  it("Should open successfully", async () => {
    const before = await receiver.getBalance();
    const tx = await love.connect(receiver).open(0);
    expect(tx).to.emit(love, "Opened");
    const gas = (await tx.wait()).gasUsed.mul(tx.gasPrice || 0);
    const after = await receiver.getBalance();
    expect(after.sub(before).add(gas)).to.equal(utils.parseEther("1"));
  });
});
