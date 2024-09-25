import * as dotenv from "dotenv";
dotenv.config();

import { startServer } from "src/server";

const PORT = Number(process.env.PORT!);

startServer(PORT).catch((error) => {
  console.error(error);
});
