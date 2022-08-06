/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @next/next/no-head-element */

import chromium from "chrome-aws-lambda";
import katex from "katex";
import ky from "ky";
import { NextApiHandler } from "next";

import { Branch } from "~/components/Branch";
import { BranchType, PropFormula, SolveApiResult } from "~/types";
import { formulaToTeX } from "~/utils/formulaToTex";
import pkgjson from "~~/package.json";

const HtmlTemplate: React.FC<{ formula: PropFormula; valid: boolean; branch: BranchType }> = (
  { branch, formula, valid: validity },
) => (
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
    <body style={{ padding: "16px 16px", backgroundColor: "white" }}>
      <p style={{ width: "100%", textAlign: "left" }}>
        <span
          dangerouslySetInnerHTML={{ __html: katex.renderToString(formulaToTeX(formula), { displayMode: false }) }}
        />{" "}
        is {validity ? <span>valid</span> : <span>invalid</span>}
        .
      </p>
      <div
        style={{
          marginBlockStart: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
        }}
      >
        <Branch branch={branch} />
      </div>
    </body>
  </html>
);

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
    defaultViewport: { ...chromium.defaultViewport },
  });
  const page = await browser.newPage();
  // const html = ReactDOMServer.renderToStaticMarkup(<HtmlTemplate branch={branch} formula={formula} valid={valid} />);
  await page.goto("https://example.com", { waitUntil: "networkidle0" });
  // await page.goto;
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
