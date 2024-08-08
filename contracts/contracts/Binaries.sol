// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// @title Binaries
contract Binaries {
    // State variables

    // cycle id counter
    uint256 cycleIdCounter;

    // cycle id -> cycle
    mapping(uint256 => Cycle) public cycles;

    // vote id counter
    uint256 voteIdCounter;

    // vote id -> vote
    mapping(uint256 => Vote) public votes;

    // Events

    event CycleCreated(
        uint256 indexed id,
        address indexed creator,
        uint256 startingBlock,
        uint256 blockLength,
        uint256 votePrice,
        string metadataURI
    );

    event VotePlaced(
        uint256 indexed id,
        uint256 indexed cycleId,
        Side side,
        uint256 amount
    );

    event VoteClaimed(uint256 indexed id, uint256 indexed cycleId, Side side);

    // Enums

    enum Side {
        Left,
        Right
    }

    // Structs

    /**
     * @dev Struct representing a cycle.
     * @param id The unique identifier for the cycle.
     * @param startingBlock The current cycle's starting block.
     * @param blockLength The length of the cycle in blocks.
     * @param votePrice The cost of one vote in wei.
     * @param creator The address of the cycle creator.
     * @param balance The total reward pool balance.
     * @param leftVoteCount The total number of votes for the left side.
     * @param rightVoteCount The total number of votes for the right side.
     * @param metadataURI The URI containing metadata for the cycle.
     */
    struct Cycle {
        uint256 id;
        uint256 startingBlock;
        uint256 blockLength;
        uint256 votePrice;
        uint256 balance;
        uint256 leftVoteCount;
        uint256 rightVoteCount;
        address creator;
        string metadataURI;
    }

    /**
     * @dev Struct representing a vote.
     * @param placer The address of the vote placer.
     * @param id The unique identifier for the vote.
     * @param cycleId The cycle id the vote is placed in.
     * @param amount The amount of votes placed.
     * @param claimed Whether the vote has been claimed.
     * @param side The side the vote is placed in.
     */
    struct Vote {
        address placer;
        uint256 id;
        uint256 cycleId;
        uint256 amount;
        bool claimed;
        Side side;
    }

    // Errors

    /**
     * @dev Error indicating that the cycle does not exist.
     * @param cycleId The id of the non-existent cycle.
     */
    error CycleDoesntExist(uint256 cycleId);

    /**
     * @dev Error indicating that the cycle has not ended yet.
     * @param cycleId The id of the cycle that has not ended.
     */
    error CycleDidntEnd(uint256 cycleId);

    /**
     * @dev Error indicating that the cycle should last at least one block.
     */
    error CycleShouldLastAtLeastOneBlock();

    /**
     * @dev Error indicating that the cycle vote price should be greater than zero.
     */
    error CycleVotePriceShouldBeGreaterThanZero();

    /**
     * @dev Error indicating that voting for the cycle is unavailable.
     * @param currentBlock The current block number.
     * @param startingBlock The starting block number of the cycle.
     * @param blockLength The length of the cycle in blocks.
     */
    error CycleVotingIsUnavailable(
        uint256 currentBlock,
        uint256 startingBlock,
        uint256 blockLength
    );

    /**
     * @dev Error indicating that the provided vote fee is invalid.
     * @param correctFee The correct vote fee.
     */
    error InvalidVoteFee(uint256 correctFee);

    /**
     * @dev Error indicating that the provided vote price is invalid.
     */
    error InvalidVotePrice();

    /**
     * @dev Error indicating that the vote does not exist.
     * @param voteId The id of the non-existent vote.
     */
    error VoteDoesntExist(uint256 voteId);

    /**
     * @dev Error indicating that the vote is not in the specified cycle.
     * @param voteId The id of the vote that is not in the specified cycle.
     */
    error VoteNotInCycle(uint256 voteId);

    /**
     * @dev Error indicating that the cycle has no votes.
     * @param cycleId The id of the cycle with no votes.
     */
    error CycleNoVotes(uint256 cycleId);

    /**
     * @dev Error indicating that the starting block for the cycle is invalid.
     */
    error InvalidVoteStartingBlock(uint256 startingBlock, uint256 currentBlock);

    /**
     * @notice Create a new cycle
     * @param _startingBlock the block number when the cycle starts
     * @param _blockLength the number of blocks the cycle lasts
     * @param _votePrice the price of a vote
     * @param _metadataURI the URI containing metadata for the cycle
     */
    function createCycle(
        uint256 _startingBlock,
        uint256 _blockLength,
        uint256 _votePrice,
        string memory _metadataURI
    ) public returns (uint256) {
        // Ensure the starting block is in the future
        if (_startingBlock <= block.number)
            revert InvalidVoteStartingBlock(_startingBlock, block.number);

        // Ensure the cycle lasts at least one block
        if (_blockLength < 1) revert CycleShouldLastAtLeastOneBlock();

        // Ensure the vote price is greater than zero
        if (_votePrice == 0) revert CycleVotePriceShouldBeGreaterThanZero();

        cycleIdCounter++;

        cycles[cycleIdCounter] = Cycle({
            id: cycleIdCounter,
            startingBlock: _startingBlock,
            blockLength: _blockLength,
            votePrice: _votePrice,
            balance: 0,
            leftVoteCount: 0,
            rightVoteCount: 0,
            creator: msg.sender,
            metadataURI: _metadataURI
        });

        emit CycleCreated(
            cycleIdCounter,
            msg.sender,
            _startingBlock,
            _blockLength,
            _votePrice,
            _metadataURI
        );

        return cycleIdCounter;
    }

    /**
     * @notice Place a vote for a side in a cycle
     * @param _cycleId the cycle id
     * @param _side the side to vote for
     */
    function placeVote(uint256 _cycleId, Side _side) public payable {
        Cycle storage cycle = cycles[_cycleId];

        // Ensure the cycle exists
        if (cycle.id == 0) revert CycleDoesntExist(_cycleId);

        // Ensure the cycle has not ended
        if (
            block.number < cycle.startingBlock ||
            block.number >= cycle.startingBlock + cycle.blockLength
        )
            revert CycleVotingIsUnavailable(
                block.number,
                cycle.startingBlock,
                cycle.blockLength
            );

        // Ensure the message value is divisible by the vote price
        if (msg.value % cycle.votePrice != 0)
            revert InvalidVoteFee(cycle.votePrice);

        unchecked {
            voteIdCounter++;
        }

        uint256 amount = msg.value / cycle.votePrice;
        votes[voteIdCounter] = Vote({
            placer: msg.sender,
            id: voteIdCounter,
            cycleId: _cycleId,
            amount: amount,
            claimed: false,
            side: _side
        });

        cycle.balance += msg.value;

        if (_side == Side.Left) {
            cycle.leftVoteCount += msg.value / cycle.votePrice;
        } else {
            cycle.rightVoteCount += msg.value / cycle.votePrice;
        }

        emit VotePlaced(voteIdCounter, _cycleId, _side, amount);
    }

    /**
     * @notice Get the winner for a cycle
     * @param _cycleId the cycle id
     */
    function getWinner(uint256 _cycleId) public view returns (Side) {
        Cycle storage cycle = cycles[_cycleId];

        // Ensure the cycle exists
        if (cycle.id == 0) revert CycleDoesntExist(_cycleId);

        // Ensure the cycle has ended
        if (block.number < cycle.startingBlock + cycle.blockLength)
            revert CycleDidntEnd(_cycleId);

        // Ensure the cycle has votes
        if (cycle.leftVoteCount == 0 && cycle.rightVoteCount == 0)
            revert CycleNoVotes(_cycleId);

        return
            cycle.rightVoteCount > cycle.leftVoteCount ? Side.Right : Side.Left;
    }

    /**
     * @notice Get the reward for a vote
     * @param _voteId the vote id
     */
    function getReward(uint256 _voteId) public view returns (uint256) {
        // Ensure the vote is placed
        if (votes[_voteId].id == 0) revert VoteDoesntExist(_voteId);

        Vote storage vote = votes[_voteId];
        Cycle storage cycle = cycles[vote.cycleId];

        // Ensure the vote is placed in the correct cycle
        if (vote.cycleId != cycle.id) revert VoteNotInCycle(_voteId);

        // Ensure the cycle has ended
        if (block.number < cycle.startingBlock + cycle.blockLength)
            revert CycleDidntEnd(vote.cycleId);

        // Ensure the side was the winner
        if (vote.side != getWinner(vote.cycleId)) return 0;

        // Calculate the reward based on the total balance and vote amount in relation to the cycle vote price
        return (vote.amount * cycle.balance) / cycle.votePrice;
    }

    /**
     * @notice Claim the reward for a vote
     * @param _voteId the vote id
     */
    function claimReward(uint256 _voteId) public {
        uint256 reward = getReward(_voteId);
        Vote storage vote = votes[_voteId];

        // Ensure the vote is for the correct side
        if (vote.side != getWinner(vote.cycleId)) return;

        // Ensure the vote has not been claimed
        if (vote.claimed) return;

        // Ensure the caller is the vote creator
        if (msg.sender != vote.placer) return;

        // Mark the vote as claimed
        vote.claimed = true;

        // Transfer the reward to the vote creator
        payable(msg.sender).transfer(reward);

        emit VoteClaimed(_voteId, vote.cycleId, vote.side);
    }

    /**
     * @notice Get the cycle details for a given cycle id
     * @param _cycleId the cycle id
     */
    function getCycle(uint256 _cycleId) public view returns (Cycle memory) {
        return cycles[_cycleId];
    }

    /**
     * @notice Get the vote details for a given vote id
     * @param _voteId the vote id
     */
    function getVote(uint256 _voteId) public view returns (Vote memory) {
        return votes[_voteId];
    }
}
