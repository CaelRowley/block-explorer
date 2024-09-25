import * as dotenv from "dotenv";
dotenv.config();

import { startServer } from "src/server";
import { connectToEthSocket } from "src/eth/websocket";

const missingVars = [
  "PORT",
  "DATABASE_URL",
  "NODE_URL",
  "NODE_SOCKET",
].filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing env vars: ${missingVars.join(", ")}`);
}

const PORT = Number(process.env.PORT!);
const NODE_URL = process.env.NODE_URL!;
const NODE_SOCKET = process.env.NODE_SOCKET!;

startServer(PORT).catch((error) => {
  console.error(error);
});

connectToEthSocket(NODE_SOCKET, NODE_URL);
