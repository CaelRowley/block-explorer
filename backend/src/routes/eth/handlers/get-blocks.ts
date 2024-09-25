import type { Middleware } from "koa";
import { z } from "zod";

const queryParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().optional(),
  orderByField: z.string().optional(),
  orderByDirection: z.enum(["asc", "desc"]).optional(),
});

import { OrderBy } from "types/order-by";
import { getBlocks, getBlocksCount } from "src/db/block";

export const handleGetBlocks: Middleware = async (ctx, next): Promise<void> => {
  try {
    const {
      page,
      pageSize,
      orderByField = "timestamp",
      orderByDirection = "desc",
    } = queryParamsSchema.parse(ctx.request.query);

    const orderBy: OrderBy = {
      field: orderByField,
      direction: orderByDirection,
    };

    const blocks = await getBlocks(page, pageSize, orderBy);
    const blocksCount = await getBlocksCount();
    ctx.status = 200;
    ctx.body = {
      count: blocksCount,
      data: blocks,
    };
  } catch (error) {
    console.error("Error getting blocks:", error);

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
      message: "An error occurred while fetching blocks.",
    };

    return;
  }

  return next();
};
