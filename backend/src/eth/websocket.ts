import WebSocket from "ws";
import { insertBlock } from "src/db/block";
import { fetchBlock } from "src/eth/client";

export const connectToEthSocket = async (
  socketAddress: string,
  clientUrl: string,
) => {
  const ws = new WebSocket(socketAddress);

  ws.on("open", () => {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_subscribe",
        params: ["newHeads"],
        id: 1,
      }),
    );
    console.info("WebSocket connected");
  });

  ws.on("message", async (data) => {
    const message = JSON.parse(data.toString());
    if (message.method === "eth_subscription") {
      const newBlock = message.params.result;
      const block = await fetchBlock(clientUrl, newBlock.number);
      try {
        insertBlock(block);
      } catch (error) {
        console.error(error);
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.info("WebSocket closed");
  });
};
