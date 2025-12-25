# Unified Farm Intelligence Platform (UFIP)

## Overview
Unified Farm is a full-stack platform for farm management, traceability, carbon tracking, and multi-role collaboration, leveraging blockchain and IPFS for trust and transpa

## Core Services
- **Farm Management & Calendar**: Farmers log activities, view advisories, and manage plots with map and calendar UI.
- **Blockchain Traceability**: All batch and event hashes are anchored on-chain for verifiable provenance.
- **Carbon & Certification**: Carbon calculations and certificates are generated per batch and anchored to blockchain.

## Key Features
- Role-based access control (Farmer, Processor, Retailer, Input Provider, Financial Provider, Regulator, Consumer)
- Map and calendar UI for geo-tagging and activity logging
- Weather integration and AI-powered advisories
- IPFS document/photo storage and QR code traceability
- Orchestration, audit logging, and reconciliation services

## Setup
1. Copy `.env.example` to `.env` and fill in credentials.
2. Install dependencies in all folders (`npm install`).
3. Run blockchain node and deploy contracts (see `blockchain/`).
4. Start backend (`npm run dev` in root or server/).
5. Start frontend (`npm run dev` in client/).

## Environment Variables
See `.env.example` for all required variables.

## Testing
- Run smart contract tests in `blockchain/`.
- Use seed scripts for test data.

## Security
- All sensitive operations require authentication and RBAC.
- Only hashes/CIDs are stored on-chain.

---
For full compliance, see the UFIP checklist in the project root.
# foodchain
