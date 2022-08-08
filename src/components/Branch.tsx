import katex from "katex";
import React from "react";

import { BranchType } from "~/types";
import { toTexPropFormula } from "~/utils/toTeX";

export const Branch: React.FC<{ branch: BranchType }> = ({ branch }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        columnGap: "24px",
        rowGap: "8px",
        alignItems: "start",
      }}
    >
      <ol
        style={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
          rowGap: "2px",
        }}
      >
        {branch.nodes.map((formula, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{ flexGrow: 1, textAlign: "center", padding: "0 8px" }}
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(toTexPropFormula(formula), { displayMode: false }),
              }}
            />
          </li>
        ))}
      </ol>
      {(branch.junction) && (
        <>
          <div style={{ gridColumn: "span 2", height: "16px" }}>
            <svg style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
              <line x1="25%" y1="100%" x2="50%" y2="0%" stroke="black" />
              <line x1="50%" y1="0%" x2="75%" y2="100%" stroke="black" />
            </svg>
          </div>
          <Branch branch={branch.junction[0]}></Branch>
          <Branch branch={branch.junction[1]}></Branch>
        </>
      )}
    </div>
  );
};
