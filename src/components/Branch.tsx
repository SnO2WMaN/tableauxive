import { css } from "@emotion/css";
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
    <div>
      <ol className={css({ display: "flex", flexDirection: "column" })}>
        {branch.nodes.map((formula, i) => (
          <li key={i} className={css({ display: "flex", alignItems: "center" })}>
            <span>{i + 1}</span>
            <span
              className={css({ marginLeft: "8px" })}
              dangerouslySetInnerHTML={{ __html: katex.renderToString(MkTexExp(formula), { displayMode: false }) }}
            />
          </li>
        ))}
      </ol>
      <div className={css({ textAlign: "center" })}>
        {branch.valid === true && (
          <span
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(String.raw`\top`, { displayMode: false }),
            }}
          />
        )}
        {branch.valid === false
          && (
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(String.raw`\bot`, { displayMode: false }),
              }}
            />
          )}
      </div>
      {branch.left && branch.right && (
        <div
          className={css(
            { display: "flex", columnGap: "16px" },
          )}
        >
          <Branch branch={branch.left}></Branch>
          <Branch branch={branch.right}></Branch>
        </div>
      )}
    </div>
  );
};
