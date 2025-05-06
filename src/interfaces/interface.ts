import { IssuerType } from "@/generated/prisma";

export interface CertificateResponse {
    certificateDataFromDB?: CertificateDBData;
    error?: string;
    verification: {
        certificateHash: string;
        issuerHash: string;
        smartContractIssuerHash: any;
        smartContractCertificateHash: any;
    };
}

export interface CertificateDBData {
    id: string;
    issuerType: IssuerType;
    issuerIIN: string;
    certificateTheme: string;
    certificateBody: string;
    BIN?: string | null;
    organisationName?: string | null;
    issuer: {
        name: string;
        surname: string;
    };
    recipient: any;
}

export interface Certificate {
    id: string;
    createdAt: string;
    updatedAt: string;
    recipientIIN: string;
    issuerType: IssuerType;
    issuerIIN: string;
    organisationName?: string | null;
    BIN?: string | null;
    certificateTheme: string;
    certificateBody: string;
    dateOfIssue: string;
}

export interface CertificateDetails {
    certificateDataFromDB?: {
        id: string;
        recipientIIN: string;
        issuerIIN: string;
        issuerType: "PERSON" | "ORGANISATION";
        organisationName?: string;
        BIN?: string;
        certificateTheme: string;
        certificateBody: string;
        dateOfIssue: string;
        recipient: {
            name: string;
            surname: string;
            iin: string;
        };
        issuer: {
            name: string;
            surname: string;
            iin: string;
        };
    };

    error?: string;

    verification: {
        certificateHash: string;
        issuerHash: string;

        smartContractIssuerHash: string;
        smartContractCertificateHash: string;
    };
}
