import katex from "katex";
import React from "react";

import { BranchType, PropFormula } from "~/types";

export const MkTexExp = (f: PropFormula): string => {
  switch (f[0]) {
    case "PROP":
      return String.raw`${f[1]}`;
    case "TOP":
      return String.raw`\top`;
    case "BOT":
      return String.raw`\bot`;
    case "NOT":
      return String.raw`\lnot ${MkTexExp(f[1])}`;
    case "OR":
      return String.raw`\left( ${MkTexExp(f[1])} \lor ${MkTexExp(f[2])} \right)`;
    case "AND":
      return String.raw`\left( ${MkTexExp(f[1])} \land ${MkTexExp(f[2])} \right)`;
    case "IMP":
      return String.raw`\left( ${MkTexExp(f[1])} \to ${MkTexExp(f[2])} \right)`;
    case "EQ":
      return String.raw`\left( ${MkTexExp(f[1])} \leftrightarrow ${MkTexExp(f[2])} \right)`;
  }
};

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
              dangerouslySetInnerHTML={{ __html: katex.renderToString(MkTexExp(formula), { displayMode: false }) }}
            />
          </li>
        ))}
      </ol>
      {(branch.junction) && (
        <>
          <div style={{ gridColumn: "span 2", height: "24px" }}>
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
