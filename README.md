# Block Explorer

A basic block explorer that connects to an eth node websocket to pull the latest blocks and stores them in an sql db. The frontend provides a table to display all blocks in the db efficiently with server side pagination and sorting.

## Prerequisites

- [Docker](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pNpM](https://pnpm.io/) or [npm](https://www.npmjs.com/)

## Environment Variables

## Backend
_Check backend/.env.sample_

- **PORT**: _The port the server runs on._
- **DATABASE_URL**: _The URL connection to a PostgreSQL database server._
- **NODE_URL**: _HTTP connection to Ethereum node._
- **NODE_SOCKET**: _WebSocket connection to Ethereum node._

## Frontend
_Check frontend/.env.sample_

- **VITE_BACKEND_URL**: _The base url for the backend service._

## Getting Started

### Backend

1. Navigate to the backend project `cd backend`

1. Create `.env` file beside `.env.sample` and set env vars

1. Start Postgres DB (Or point DATABASE_URL to an existing deployment)

```bash
docker-compose -f docker-compose.yml up
```

3. Install dependencies `pnpm install` or `npm install`

3. Run server `pnpm start` or `npm start`

### Frontend

1. Navigate to the frontend project `cd frontend`

1. Create `.env` file beside `.env.sample` and set env vars

1. Install dependencies `pnpm install` or `npm install`

1. Run server `pnpm start` or `npm start`


## Database Table Structure

`blocks` table:

| Column        | Type      | Key       | Description                                                                            |
|---------------|-----------|-----------|----------------------------------------------------------------------------------------|
| hash          | char(66)  | Primary   | The hash of the block header.                                                          |
| size          | numeric   |           | Size of the block in bytes.                                                            |
| number        | numeric   |           | Numeric identifier of the block within the blockchain.                                 |
| timestamp     | numeric   |           | Timestamp of when the block was mined, in seconds since the epoch.                     |
| nonce         | varchar   |           | A 64-bit hash used in mining to demonstrate PoW for a block. No longer used for PoS.   |
| gas_limit     | numeric   |           | Maximum gas allowed for transactions in the block.                                     |
