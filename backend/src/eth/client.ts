import axios from "axios";

export const fetchBlock = async (
  url: string,
  id: string = "latest",
): Promise<any> => {
  const data = {
    jsonrpc: "2.0",
    method: "eth_getBlockByNumber",
    params: [id, false],
    id: 1,
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const block = response?.data?.result;
    console.log(block)
    return block
  } catch (error) {
    console.error("Error fetching block:", error);
    throw error;
  }
};