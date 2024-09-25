import type { Middleware } from "koa";

import { removeAllBlocks } from "src/db/block";

export const handleDeletAllBlocks: Middleware = async (
  ctx,
  next,
): Promise<void> => {
  try {
    const deletedBlocks = await removeAllBlocks();
    ctx.status = 200;
    ctx.body = {
      data: deletedBlocks,
    };
  } catch (error) {
    console.error("Error deleting blocks:", error);

    ctx.status = 500;
    ctx.body = {
      error: "Internal Server Error",
      message: "An error occurred while deleting the blocks.",
    };
    return;
  }

  return next();
};
