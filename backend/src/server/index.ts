import Koa from "koa";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";

import router from "src/routes";

import { fetchBlock } from "src/eth/client";
import { insertBlock } from "src/db/block";

export const startServer = async (port: number) => {
  const block = await fetchBlock(process.env.NODE_URL!);
  const dbBlock = await insertBlock(block);
  console.log(dbBlock);

  const app = new Koa();

  app.use(cors());
  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(port);
  console.info(`Server running on http://localhost:${port}`);

  return app;
};
