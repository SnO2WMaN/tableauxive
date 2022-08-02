import katex from "katex";
import React from "react";

import { Branch as BranchType, PropFormula } from "~/tableau/result";

export const MkTexExp = (f: PropFormula): string => {
  switch (f.type) {
    case "PROP":
      return String.raw`${f.id}`;
    case "NOT":
      return String.raw`\lnot ${MkTexExp(f.in)}`;
    case "OR":
      return String.raw`\left( ${MkTexExp(f.left)} \lor ${MkTexExp(f.right)} \right)`;
    case "AND":
      return String.raw`\left( ${MkTexExp(f.left)} \land ${MkTexExp(f.right)} \right)`;
    case "IMPLICT":
      return String.raw`\left( ${MkTexExp(f.left)} \to ${MkTexExp(f.right)} \right)`;
    case "EQ":
      return String.raw`\left( ${MkTexExp(f.left)} \leftrightarrow ${MkTexExp(f.right)} \right)`;
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
      {branch.valid === true && (
        <div style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`\top`, { displayMode: false }) }} />
        </div>
      )}
      {branch.valid === false && (
        <div style={{ gridColumn: "span 2", textAlign: "center" }}>
          <span dangerouslySetInnerHTML={{ __html: katex.renderToString(String.raw`\bot`, { displayMode: false }) }} />
        </div>
      )}
      {(branch.left && branch.right) && (
        <>
          <div style={{ gridColumn: "span 2", height: "24px" }}>
            <svg style={{ width: "100%", height: "100%" }} xmlns="http://www.w3.org/2000/svg">
              <line x1="25%" y1="100%" x2="50%" y2="0%" stroke="black" />
              <line x1="50%" y1="0%" x2="75%" y2="100%" stroke="black" />
            </svg>
          </div>
          <Branch branch={branch.left}></Branch>
          <Branch branch={branch.right}></Branch>
        </>
      )}
    </div>
  );
};
