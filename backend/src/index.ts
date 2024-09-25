import * as dotenv from "dotenv";
dotenv.config();

import { fetchBlock } from "./eth/client";
fetchBlock(process.env.NODE_URL!)