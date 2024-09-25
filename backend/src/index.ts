import * as dotenv from "dotenv";
dotenv.config();

import { startServer } from "src/server";
import { startPoll } from "src/poll";

const PORT = Number(process.env.PORT!);
const NODE_URL = process.env.NODE_URL!;

startServer(PORT).catch((error) => {
  console.error(error);
});

startPoll(NODE_URL, 15000)