import Router from "@koa/router";
import type { Middleware } from "koa";

import { handleGetBlockByHash } from "./handlers/get-block-by-hash";

const router = new Router();

router.get("/block/:hash", handleGetBlockByHash);

export default router;
