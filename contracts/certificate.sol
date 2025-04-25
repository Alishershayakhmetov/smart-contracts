// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    struct Certificate {
        string certificateId;
        string recipientIIN;
        string issuerIIN;
        IssuerType issuerType;
        string issuerHash;
        string certificateHash;
        uint256 dateOfIssue;
    }

    enum IssuerType {
        PERSON,
        ORGANIZATION
    }

    mapping(string => Certificate) public certificates;
    mapping(string => string) public certificateIdToTx;

    event CertificateIssued(
        string certificateId,
        string recipientIIN,
        string issuerIIN,
        IssuerType issuerType,
        string issuerHash,
        string certificateHash,
        uint256 dateOfIssue
    );

    function issueCertificate(
        string memory _certificateId,
        string memory _recipientIIN,
        string memory _issuerIIN,
        IssuerType _issuerType,
        string memory _issuerHash,
        string memory _certificateHash,
        uint256 _dateOfIssue
    ) public {
        require(bytes(_certificateId).length > 0, "Certificate ID required");

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            recipientIIN: _recipientIIN,
            issuerIIN: _issuerIIN,
            issuerType: _issuerType,
            issuerHash: _issuerHash,
            certificateHash: _certificateHash,
            dateOfIssue: _dateOfIssue
        });

        certificateIdToTx[_certificateId] = txHashToString();

        emit CertificateIssued(
            _certificateId,
            _recipientIIN,
            _issuerIIN,
            _issuerType,
            _issuerHash,
            _certificateHash,
            _dateOfIssue
        );
    }

    function txHashToString() internal view returns (string memory) {
        bytes32 txHash = blockhash(block.number - 1);
        return bytes32ToString(txHash);
    }

    function bytes32ToString(
        bytes32 _bytes32
    ) internal pure returns (string memory) {
        bytes memory bytesArray = new bytes(32);
        for (uint256 i; i < 32; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }
}
