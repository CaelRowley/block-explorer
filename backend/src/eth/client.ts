import axios from "axios";
import Decimal from "decimal.js";

import type { Block } from "@prisma/client";

export const fetchBlock = async (
  url: string,
  id: string = "latest",
): Promise<Block> => {
  const data = {
    jsonrpc: "2.0",
    method: "eth_getBlockByNumber",
    params: [id, false],
    id: 1,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const block = response?.data?.result;
    return {
      hash: block.hash,
      size: new Decimal(block.size),
      number: new Decimal(block.number),
      timestamp: new Decimal(block.timestamp),
      nonce: new Decimal(block.nonce),
      gasLimit: new Decimal(block.gasLimit),
    };
  } catch (error) {
    console.error("Error fetching block:", error);
    throw error;
  }
};
