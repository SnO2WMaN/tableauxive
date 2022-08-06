import chromium from "chrome-aws-lambda";
import ky from "ky";
import { NextApiHandler } from "next";
import ReactDOMServer from "react-dom/server";

import { SolveApiResult } from "~/types";

import { HtmlTemplate } from "./HtmlTemplate";

const handler: NextApiHandler = async (req, res) => {
  const { width: reqWidth, height: reqHeight, formula: reqFormula } = req.query;
  if (!reqFormula || Array.isArray(reqFormula)) {
    res.status(400).end();
    return;
  }
  if (reqWidth && (Array.isArray(reqWidth) || parseInt(reqWidth) === NaN)) {
    res.status(400).end();
    return;
  }
  if (reqHeight && (Array.isArray(reqHeight) || parseInt(reqHeight) === NaN)) {
    res.status(400).end();
    return;
  }

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.set("formula", reqFormula);
  const apiRes = await ky.get(apiUrl.toString(), { timeout: 30000, throwHttpErrors: false });
  if (apiRes.status === 400) {
    res.status(400).end();
    return;
  } else if (200 < apiRes.status) {
    res.status(500).end();
    return;
  }
  const { branch, formula, valid } = await apiRes.json<SolveApiResult>();

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    defaultViewport: {
      ...chromium.defaultViewport,
      width: reqWidth ? parseInt(reqWidth) : 900,
      height: reqHeight ? parseInt(reqHeight) : 640,
    },
  });
  const page = await browser.newPage();
  const html = ReactDOMServer.renderToStaticMarkup(<HtmlTemplate branch={branch} formula={formula} valid={valid} />);
  await page.setContent(html, { waitUntil: "networkidle0" });
  const image = await page.screenshot({ type: "png" });

  // res.setHeader("Content-Type", "text/html; charset=UTF-8");
  // res.send(html);
  // return;

  res.status(200);
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=86400, public, stale-while-revalidate");
  res.send(image);
  return;
};

export default handler;
