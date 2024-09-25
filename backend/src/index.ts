import * as dotenv from "dotenv";
dotenv.config();

import { startServer } from "src/server";

startServer().catch((error) => {
  console.error(error);
});