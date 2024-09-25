import { fetchBlock } from "src/eth/client";
import { insertBlock } from "src/db/block";

export const startServer = async () => {
  const block = await fetchBlock(process.env.NODE_URL!)

  const dbBlock = await insertBlock(block)

  console.log(dbBlock)
};
