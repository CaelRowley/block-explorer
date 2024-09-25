import { PrismaClient, Block } from "@prisma/client";
const prisma = new PrismaClient();

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
