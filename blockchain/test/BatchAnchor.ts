import { ethers } from "hardhat";
import { expect } from "chai";

describe("BatchAnchor", function () {
  it("Should deploy and create a batch", async function () {
    const [owner] = await ethers.getSigners();
    const BatchAnchor = await ethers.getContractFactory("BatchAnchor");
    const contract = await BatchAnchor.deploy();
    await contract.deployed();

    await contract.createBatch("BATCH-001");
    const batch = await contract.batches("BATCH-001");
    expect(batch.owner).to.equal(owner.address);
  });
});
