import Router from "@koa/router";
import type { Middleware } from "koa";

import { handleGetBlockByHash } from "./handlers/get-block-by-hash";
import { handleGetBlocks } from "./handlers/get-blocks";
import { handleDeleteBlockByHash } from "./handlers/delete-block-by-hash";
import { handleSeedFakeBlocks } from "./handlers/seed-fake-blocks";

const router = new Router();

router.get("/block/:hash", handleGetBlockByHash);
router.delete("/block/:hash", handleDeleteBlockByHash);
router.get("/blocks", handleGetBlocks);
router.post("/blocks/seed-fake", handleSeedFakeBlocks);

export default router;
