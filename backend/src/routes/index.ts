import Router from "@koa/router";

import helloRouter from "./hello";
import ethRouter from "./eth";

const router = new Router();

router.use("/hello", helloRouter.routes());
router.use("/eth", ethRouter.routes());

export default router;
