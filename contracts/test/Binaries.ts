import { expect } from "chai";
import hre from "hardhat";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";

describe("Binaries Contract Tests", function () {
  // A deployment function to set up the initial state
  const deploy = async () => {
    const [deployerClient] = await hre.viem.getWalletClients();
    const deployer = deployerClient.account.address;
    const binaries = await hre.viem.deployContract("Binaries");
    return { binaries, deployer };
  };

  describe("createCycle", function () {
    it("should create a cycle", async function () {
      const { binaries, deployer } = await loadFixture(deploy);

      const params: [bigint, bigint, bigint, string] = [
        10n,
        5n,
        1n,
        "metadataURI" as string,
      ];

      // Create a cycle
      const { result: cycleId } = await binaries.simulate.createCycle(params);
      await binaries.write.createCycle(params);

      // Get the created cycle
      const result = await binaries.read.cycles([cycleId]);
      const [
        id,
        startingBlock,
        blockLength,
        votePrice,
        balance,
        leftVoteCount,
        rightVoteCount,
        creator,
        metadataURI,
      ] = result;

      // Assert that the cycle was created with the correct parameters
      expect(id).to.equal(cycleId);
      expect(startingBlock).to.equal(10n);
      expect(blockLength).to.equal(5n);
      expect(votePrice).to.equal(1n);
      expect(balance).to.equal(0n);
      expect(leftVoteCount).to.equal(0n);
      expect(rightVoteCount).to.equal(0n);
      expect(creator.toLowerCase()).to.equal(deployer);
      expect(metadataURI).to.equal("metadataURI");
    });

    it("should revert if startingBlock is in the past", async function () {
      const { binaries } = await loadFixture(deploy);

      const client = await hre.viem.getPublicClient();
      const startBlock = (await client.getBlock()).number;
      const blockLength = startBlock + 5n;
      const params: [bigint, bigint, bigint, string] = [
        startBlock,
        blockLength,
        1n,
        "metadataURI" as string,
      ];

      await expect(binaries.write.createCycle(params)).to.be.rejectedWith(
        "InvalidVoteStartingBlock(1, 2)",
      );
    });

    it("should revert if blockLength is less than 1", async function () {
      const { binaries } = await loadFixture(deploy);

      const params: [bigint, bigint, bigint, string] = [
        10n,
        0n,
        1n,
        "metadataURI" as string,
      ];

      await expect(binaries.write.createCycle(params)).to.be.rejectedWith(
        "CycleShouldLastAtLeastOneBlock",
      );
    });

    it("should revert if votePrice is zero", async function () {
      const { binaries } = await loadFixture(deploy);

      const params: [bigint, bigint, bigint, string] = [
        10n,
        5n,
        0n,
        "metadataURI" as string,
      ];

      await expect(binaries.write.createCycle(params)).to.be.rejectedWith(
        "CycleVotePriceShouldBeGreaterThanZero",
      );
    });
  });

  describe("placeVote", function () {
    it("should place a vote for the left side", async function () {
      const { binaries } = await loadFixture(deploy);

      const client = await hre.viem.getPublicClient();
      const startBlock = (await client.getBlock()).number + 2n;

      const cycleParams: [bigint, bigint, bigint, string] = [
        startBlock,
        5n,
        1n,
        "metadataURI" as string,
      ];

      // Create a cycle
      const { result: cycleId } =
        await binaries.simulate.createCycle(cycleParams);
      await binaries.write.createCycle(cycleParams);

      // Place a vote for the left side
      await binaries.write.placeVote([cycleId, 0]);

      // Get the cycle after placing the vote
      const [, , , , , leftVoteCount] = await binaries.read.cycles([cycleId]);

      // Assert that the vote was placed for the left side
      expect(leftVoteCount).to.equal(1n);
    });

    it("should place a vote for the right side", async function () {
      const { binaries } = await loadFixture(deploy);

      const client = await hre.viem.getPublicClient();
      const startBlock = (await client.getBlock()).number + 2n;

      const cycleParams: [bigint, bigint, bigint, string] = [
        startBlock,
        5n,
        1n,
        "metadataURI" as string,
      ];

      // Create a cycle
      const { result: cycleId } =
        await binaries.simulate.createCycle(cycleParams);
      await binaries.write.createCycle(cycleParams);

      // Place a vote for the right side
      await binaries.write.placeVote([cycleId, 1]);

      // Get the cycle after placing the vote
      const [, , , , , , rightVoteCount] = await binaries.read.cycles([
        cycleId,
      ]);

      // Assert that the vote was placed for the right side
      expect(rightVoteCount).to.equal(1n);
    });

    it("should revert if cycle does not exist", async function () {
      const { binaries } = await loadFixture(deploy);

      await expect(binaries.write.placeVote([1n, 0])).to.be.rejectedWith(
        "CycleDoesntExist",
      );
    });

    it("should revert if cycle has ended", async function () {
      const { binaries } = await loadFixture(deploy);

      const cycleParams: [bigint, bigint, bigint, string] = [
        10n,
        1n,
        1n,
        "metadataURI" as string,
      ];

      // Create a cycle
      const { result: cycleId } =
        await binaries.simulate.createCycle(cycleParams);
      await binaries.write.createCycle(cycleParams);

      // Advance the block to make the cycle end
      const client = await hre.viem.getTestClient();
      await client.mine({ blocks: 12 });

      await expect(binaries.write.placeVote([cycleId, 0])).to.be.rejectedWith(
        "CycleVotingIsUnavailable",
      );
    });

    it("should revert if message value is not divisible by vote price", async function () {
      const { binaries } = await loadFixture(deploy);

      const pubClient = await hre.viem.getPublicClient();
      const startBlock = (await pubClient.getBlock()).number + 1n;

      const cycleParams: [bigint, bigint, bigint, string] = [
        startBlock,
        5n,
        1n,
        "metadataURI" as string,
      ];

      // Advance the block to make the cycle end
      const client = await hre.viem.getTestClient();
      await client.mine({ blocks: 12 });

      // Create a cycle
      const { result: cycleId } =
        await binaries.simulate.createCycle(cycleParams);
      await binaries.write.createCycle(cycleParams);

      // Try to place a vote with incorrect message value
      await expect(
        binaries.write.placeVote([cycleId, 0], { value: 2n }),
      ).to.be.rejectedWith("InvalidVoteFee");
    });
  });
});
