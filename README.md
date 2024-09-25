# Block Explorer

A basic block explorer that connects to an eth node websocket to pull the latest blocks and stores them in an sql db. The frontend provides a table to display all blocks in the db efficiently with server side pagination and sorting.

## Prerequisites

- [Docker](https://docs.docker.com/desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [pNpM](https://pnpm.io/) or [npm](https://www.npmjs.com/)

## Environment Variables

## Backend
_Check `backend/.env.sample`_

- **PORT**: _The port the server runs on._
- **DATABASE_URL**: _The URL connection to a PostgreSQL database server._
- **NODE_URL**: _HTTP connection to Ethereum node._
- **NODE_SOCKET**: _WebSocket connection to Ethereum node._

## Frontend
_Check `frontend/.env.sample`_

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

| Column        | Type            | Key       | Description                                                                            |
|---------------|-----------------|-----------|----------------------------------------------------------------------------------------|
| hash          | char(66)        | Primary   | The hash of the block header.                                                          |
| size          | numeric(78,0)   |           | Size of the block in bytes.                                                            |
| number        | numeric(78,0)   |           | Numeric identifier of the block within the blockchain.                                 |
| timestamp     | numeric(78,0)   |           | Timestamp of when the block was mined, in seconds since the epoch.                     |
| nonce         | numeric(78,0)   |           | A 64-bit hash used in mining to demonstrate PoW for a block. No longer used for PoS.   |
| gas_limit     | numeric(78,0)   |           | Maximum gas allowed for transactions in the block.                                     |

## Technical Decisions

### Backend

#### For fetching latest block data:
1. I used [Inura's websocket](https://docs.infura.io/api/learn/websockets) to fetch the latest block rather than polling because this would insure no blocks are missed and that I will always get the latest block as soon as its mined.
2. I am using the entire url `https://sepolia.infura.io/v3/${API_KEY}` for the `NODE_URL` and `NODE_SOCKET` because this will remove the dependency on Infura and allow you to connect to your own local node i.e `ws://localhost:3334` or another deployed node
   
#### For the database
1. I used [PostgreSQL](https://www.postgresql.org/) because its an easy to use with Docker and highly performant DB
2. Docker Compose was used to deploy the db because its easy to configure for local or production deployments
3. If I had more time I would have added indexing to the `timestamp` column in the db for faster querying

#### ORM
1. I used [Prisma](https://www.prisma.io/) because it pairs very nicely with TypeScript, you define the table Schema which can then run the migrations and autogenerate the TypeScript data types to use in your project for your db data
2. Prisma also provides very useful query builders for CRUD operations and server side pagination

#### Web Framework
1. [Koa](https://koajs.com/) is lightweight and follows a cascading middleware pattern that I find intuitive and easy to use
2. Though for a project this size any web framework would do
3. [Zod](https://zod.dev/) was used for schema vlidation on request parameters for type coercion and validation with nice error handling

#### Testing
1. The project was completed within the timeframe leaving no time for adequate testing considering that the tests are in TypeScript and and would all require mocking of db and https requests they were not super straightforward to implement in the short timeframe
2. If I had the time I would have used the [Mocha](https://mochajs.org/) test framework with [Chai](https://www.chaijs.com/) assertions and [supertest](https://github.com/ladjs/supertest) for mocking http requests

#### Security
1. Secret env vars are hidden and not leaked on any logs or requests
2. All the routes are publicly accessible, there is no allowlist or user auth or rate limits which could all be added to improve security

### Frontend
[Vite](https://vitejs.dev/) was used to build and run the project because its blazingly fast with out of the box TypeScript support. They also have a secure way of handling `.env` vars built in.

[Material-UI](https://mui.com/material-ui/) offers a large amount of premade components and has great documentation on how to use them. They also allow creating custom themes and styles which I did not use for this project.

[TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview) is almost essential for any React frontend. It handles fetching, polling, catching, syncing, re-rendering and server state out of the box and drastically simplifies your codebase.

[React Router](https://reactrouter.com/en/main) was used because it's easy to implement and I only needed a simple router, if at all.

For testing I would have added [Jest Snapshots](https://jestjs.io/docs/snapshot-testing). I would have also broken up some of the state management logic in util functions that could be unit tested.

With more timem a simple improvement to the UI would be to add an empty table for the `isPending` state rather than using `<CircularProgress />`, this would have prevented the screen from flickering when uncahced data is fetched from the backend. I would also have set up a proper wrapper container around the project to nicely position all components in the center of the screen.
