import type { Middleware } from "koa";

import { insertTestBlocks } from "src/db/seed";

export const handleSeedFakeBlocks: Middleware = async (
  ctx,
  next,
): Promise<void> => {
  try {
    await insertTestBlocks(100);
    ctx.status = 200;
    ctx.body = {
      message: "100 fake blocks seeded",
    };
  } catch (error) {
    console.error("Error creating blocks:", error);
    ctx.status = 500;
    ctx.body = {
      error: "Internal Server Error",
      message: "An error occurred while seeding blocks.",
    };
    return;
  }

  return next();
};
