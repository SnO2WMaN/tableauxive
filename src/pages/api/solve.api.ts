import ky from "ky";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const { inference } = req.query;
  if (!inference || Array.isArray(inference)) {
    res.status(400).end();
    return;
  }

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("logic", "prop");
  apiUrl.searchParams.set("inference", inference);
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
