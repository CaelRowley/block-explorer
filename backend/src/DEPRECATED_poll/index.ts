import { fetchBlock } from "src/eth/client";
import { insertBlock } from "src/db/block";

const fetchAndInsertBlock = async (url: string) => {
  console.log("Polling...");
  const block = await fetchBlock(url);
  try {
    insertBlock(block);
  } catch (error) {
    console.error(error);
  }
};

export const startPoll = async (url: string, interval: number) => {
  setInterval(() => fetchAndInsertBlock(url), interval);
};
