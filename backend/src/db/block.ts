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
