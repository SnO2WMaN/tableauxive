import ky from "ky";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  const apiRes = await ky.get(apiUrl.toString(), { timeout: 30000, throwHttpErrors: false });
  if (200 < apiRes.status) {
    res.status(500).end();
    return;
  }

  const json = await apiRes.json();
  res
    .setHeader("Content-Type", "application/json")
    .json(json);
  return;
};

export default handler;
