import Router from "@koa/router";
import type { Middleware } from "koa";

const router = new Router();

import { getBlockByHash } from "src/db/block";

const handleGetBlockByHash: Middleware = async (ctx, next): Promise<void> => {
  try {
    const { hash } = ctx.params;

    const block = await getBlockByHash(hash);
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
    console.error("Error getting block:", error);

    ctx.status = 500;
    ctx.body = {
      error: "Internal Server Error",
      message: "An error occurred while fetching the block.",
    };
    return;
  }

  return next();
};

router.get("/block/:hash", handleGetBlockByHash);

export default router;
