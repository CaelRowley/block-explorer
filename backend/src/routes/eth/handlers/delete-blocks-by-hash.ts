import type { Middleware } from "koa";
import { z } from "zod";

import { removeBlocksByHash } from "src/db/block";

const requestBodySchema = z.object({
  hashes: z.array(z.string()),
});

export const handleDeleteBlocksByHash: Middleware = async (
  ctx,
  next,
): Promise<void> => {
  try {
    const { hashes } = requestBodySchema.parse(ctx.request.body);
    // if (!Array.isArray(hashes)) {
    //   ctx.status = 400;
    //   ctx.body = {
    //     error: "Bad Request",
    //     message: "Request body must contain hashes: string[]",
    //   };
    //   return;
    // }

    const deletedBlocks = await removeBlocksByHash(hashes);
    if (!deletedBlocks) {
      ctx.status = 404;
      ctx.body = {
        error: "Not Found",
        message: `No blocks with hash ${hashes} not found.`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      data: deletedBlocks,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      ctx.status = 400;
      ctx.body = {
        error: error.errors,
        message: "Schema validation error.",
      };

      return;
    }

    ctx.status = 500;
    ctx.body = {
      error: "Internal Server Error",
      message: "An error occurred while deleting the block.",
    };

    return;
  }

  return next();
};
