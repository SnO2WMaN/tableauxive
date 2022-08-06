/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @next/next/no-head-element */

import katex from "katex";

import { Branch } from "~/components/Branch";
import { BranchType, PropFormula } from "~/types";
import { formulaToTeX } from "~/utils/formulaToTex";
import pkgjson from "~~/package.json";

export const HtmlTemplate: React.FC<{ formula: PropFormula; valid: boolean; branch: BranchType }> = (
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
