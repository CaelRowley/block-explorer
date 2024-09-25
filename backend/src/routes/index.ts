import Router from "@koa/router";

import helloRouter from "./hello";

const router = new Router();
router.use("/hello", helloRouter.routes());

export default router;
