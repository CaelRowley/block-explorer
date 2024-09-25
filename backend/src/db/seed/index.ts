import { insertBlock } from "src/db/block";
import Decimal from "decimal.js";
import { v4 as uuidv4 } from "uuid";

export const insertTestBlocks = async (count: number) => {
  for (let i = 0; i < count; i++) {
    try {
      await insertBlock({
        hash: `0x${uuidv4()}`,
        size: new Decimal(Math.floor(Math.random() * 100000)),
        number: new Decimal(i * 10000),
        timestamp: new Decimal(Date.now()),
        nonce: new Decimal(0),
        gasLimit: new Decimal(30000000),
      });
    } catch (error) {
      console.error(error);
    }
  }
};
