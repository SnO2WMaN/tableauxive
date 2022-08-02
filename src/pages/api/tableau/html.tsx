/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @next/next/no-head-element */

import { Branch } from "~/components/Branch";
import { Branch as BranchType } from "~/tableau/result";
import pkgjson from "~~/package.json";

export const App: React.FC<{ branch: BranchType }> = ({ branch }) => (
  <html>
    <head>
      <link
        rel="stylesheet"
        href={`https://cdn.jsdelivr.net/npm/katex@${pkgjson.dependencies.katex}/dist/katex.min.css`}
      >
      </link>
    </head>
    <body>
      <Branch branch={branch} />
    </body>
  </html>
);
