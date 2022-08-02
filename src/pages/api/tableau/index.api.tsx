/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @next/next/no-head-element */

import chromium from "chrome-aws-lambda";
import ky from "ky";
import { NextApiHandler } from "next";
import ReactDOMServer from "react-dom/server";

import { Branch } from "~/components/Branch";
import { Branch as BranchType } from "~/tableau/result";
import pkgjson from "~~/package.json";

export const HtmlTemplate: React.FC<{ branch: BranchType }> = ({ branch }) => (
  <html style={{ height: "100%" }}>
    <head>
      <link
        rel="stylesheet"
        href={`https://cdn.jsdelivr.net/npm/the-new-css-reset@${pkgjson.dependencies["the-new-css-reset"]}`}
      />
      <link
        rel="stylesheet"
        href={`https://cdn.jsdelivr.net/npm/katex@${pkgjson.dependencies["katex"]}/dist/katex.min.css`}
      />
    </head>
    <body>
      <div style={{ padding: "16px 16px" }}>
        <Branch branch={branch} />
      </div>
    </body>
  </html>
);

const handler: NextApiHandler = async (req, res) => {
  const { width: widthRaw, height: heightRaw, formula } = req.query;
  if (!formula || Array.isArray(formula)) {
    res.status(400).end();
    return;
  }
  if (widthRaw && (Array.isArray(widthRaw) || parseInt(widthRaw) === NaN)) {
    res.status(400).end();
    return;
  }
  if (heightRaw && (Array.isArray(heightRaw) || parseInt(heightRaw) === NaN)) {
    res.status(400).end();
    return;
  }

  const width = widthRaw ? parseInt(widthRaw) : 900;
  const height = heightRaw ? parseInt(heightRaw) : 640;

  const apiUrl = new URL("/solve", process.env.LOGIKSOLVA_ENDPOINT);
  apiUrl.searchParams.append("formula", formula);
  const apiRes = await ky.get(apiUrl.toString(), { timeout: 30000 });
  if (apiRes.status === 400) {
    res.status(400).end();
    return;
  } else if (200 < apiRes.status) {
    res.status(500).end();
    return;
  }
  const json = await apiRes.json<BranchType>();

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    defaultViewport: {
      width,
      height,
    },
  });
  const page = await browser.newPage();
  const html = ReactDOMServer.renderToStaticMarkup(<HtmlTemplate branch={json} />);
  await page.setContent(html, { waitUntil: "networkidle0" });
  const image = await page.screenshot({ type: "png" });

  // res.setHeader("Content-Type", "text/html; charset=UTF-8");
  // res.send(html);
  // return;

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=86400, public, stale-while-revalidate");
  res.send(image);
  return;
};

export default handler;
