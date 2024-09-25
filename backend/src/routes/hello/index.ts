import Router from "@koa/router";
import type { Middleware } from "koa";

const router = new Router();

const handleHello: Middleware = async (ctx, next): Promise<void> => {
  ctx.status = 200;
  ctx.body = {
    message: "Hello!",
  };

  return next();
};

router.get("/", handleHello);

export default router;
