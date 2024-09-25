import { PrismaClient, Block } from "@prisma/client";
const prisma = new PrismaClient();
import type { OrderBy } from "types/order-by";

export const insertBlock = async (block: Block) => {
  try {
    const dbBlock = await prisma.block.create({
      data: block,
    });
    return dbBlock;
  } catch (error) {
    console.error("Error inserting block:", error);
    throw error;
  }
};

export const getBlockByHash = async (hash: string): Promise<Block | null> => {
  try {
    const block = await prisma.block.findFirst({
      where: {
        hash,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    return block;
  } catch (error) {
    console.error("Error getting block:", error);
    throw error;
  }
};

export const getBlocks = async (
  page: number | undefined,
  pageSize: number | undefined,
  orderBy: OrderBy,
): Promise<Array<Block>> => {
  try {
    const blocks = await prisma.block.findMany({
      orderBy: {
        [orderBy.field]: orderBy.direction,
      },
      skip: !!page && !!pageSize ? (page - 1) * pageSize : undefined,
      take: pageSize,
    });
    return blocks;
  } catch (error) {
    console.error("Error getting blocks:", error);
    throw error;
  }
};

export const getBlocksCount = async (): Promise<number> => {
  try {
    const blocksCount = await prisma.block.count();
    return blocksCount;
  } catch (error) {
    console.error("Error getting blocks count:", error);
    throw error;
  }
};

export const removeBlockByHash = async (hash: string) => {
  try {
    const deletedBlock = await prisma.block.delete({
      where: {
        hash: hash,
      },
    });
    return deletedBlock;
  } catch (error) {
    console.error("Error deleting block:", error);
    throw error;
  }
};
