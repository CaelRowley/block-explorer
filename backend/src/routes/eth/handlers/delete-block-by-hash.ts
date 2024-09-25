import type { Middleware } from "koa";
import { z } from "zod";

import { removeBlockByHash } from "src/db/block";

const pathParamsSchema = z.object({
  hash: z.string(),
});

export const handleDeleteBlockByHash: Middleware = async (
  ctx,
  next,
): Promise<void> => {
  try {
    const { hash } = pathParamsSchema.parse(ctx.params);

    const block = await removeBlockByHash(hash);
    if (!block) {
      ctx.status = 404;
      ctx.body = {
        error: "Not Found",
        message: `Block with hash ${hash} not found.`,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = {
      data: block,
    };
  } catch (error) {
    console.error("Error deleting block:", error);

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
