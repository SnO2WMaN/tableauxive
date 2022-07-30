import chromium from "chrome-aws-lambda";
import { NextApiHandler } from "next";

export const handler: NextApiHandler = async (req, res) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    headless: true,
    defaultViewport: { ...chromium.defaultViewport },
  });
  const page = await browser.newPage();
  await page.goto("https://example.com", { waitUntil: "networkidle0" });
  const image = await page.screenshot({ type: "png" });

  res.setHeader("X-Robots-Tag", "noindex");
  res.setHeader("Link", `<https://example.com>; rel="canonical"`);
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "max-age=86400, public, stale-while-revalidate");
  res.send(image);
};
