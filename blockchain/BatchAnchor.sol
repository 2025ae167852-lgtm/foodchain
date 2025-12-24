// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BatchAnchor {
    struct Batch {
        string batchId;
        string[] eventHashes;
        string certificateHash;
        address owner;
    }

    mapping(string => Batch) public batches;
    mapping(address => string[]) public ownerBatches;

    event BatchCreated(string batchId, address indexed owner);
    event EventAnchored(string batchId, string eventHash);
    event CertificateAnchored(string batchId, string certificateHash);

    modifier onlyOwner(string memory batchId) {
        require(batches[batchId].owner == msg.sender, "Not batch owner");
        _;
    }

    function createBatch(string memory batchId) public {
        require(batches[batchId].owner == address(0), "Batch exists");
        batches[batchId].batchId = batchId;
        batches[batchId].owner = msg.sender;
        ownerBatches[msg.sender].push(batchId);
        emit BatchCreated(batchId, msg.sender);
    }

    function anchorEvent(string memory batchId, string memory eventHash) public onlyOwner(batchId) {
        batches[batchId].eventHashes.push(eventHash);
        emit EventAnchored(batchId, eventHash);
    }

    function anchorCertificate(string memory batchId, string memory certificateHash) public onlyOwner(batchId) {
        batches[batchId].certificateHash = certificateHash;
        emit CertificateAnchored(batchId, certificateHash);
    }

    function getBatchEvents(string memory batchId) public view returns (string[] memory) {
        return batches[batchId].eventHashes;
    }

    function getOwnerBatches(address owner) public view returns (string[] memory) {
        return ownerBatches[owner];
    }
}
