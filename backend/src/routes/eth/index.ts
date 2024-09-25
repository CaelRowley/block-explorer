import Router from "@koa/router";
import type { Middleware } from "koa";

import { handleGetBlockByHash } from "./handlers/get-block-by-hash";
import { handleGetBlocks } from "./handlers/get-blocks";
import { handleDeleteBlockByHash } from "./handlers/delete-block-by-hash";
import { handleSeedFakeBlocks } from "./handlers/seed-fake-blocks";
import { handleDeletAllBlocks } from "./handlers/delete-all-blocks";
import { handleDeleteBlocksByHash } from "./handlers/delete-blocks-by-hash";

const router = new Router();

router.get("/block/:hash", handleGetBlockByHash);
router.get("/blocks", handleGetBlocks);
router.post("/blocks/seed-fake", handleSeedFakeBlocks);
router.delete("/block/:hash", handleDeleteBlockByHash);
router.delete("/blocks", handleDeleteBlocksByHash);
router.delete("/blocks/all", handleDeletAllBlocks);

export default router;
