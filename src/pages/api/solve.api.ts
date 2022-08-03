import ky from "ky";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const { formula } = req.query;
  if (!formula || Array.isArray(formula)) {
    res.status(400).end();
    return;
  }

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("formula", formula);
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
