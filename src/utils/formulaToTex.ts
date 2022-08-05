import { PropFormula } from "~/types";

export const formulaToTeX = (f: PropFormula): string => {
  switch (f[0]) {
    case "PROP":
      return String.raw`${f[1]}`;
    case "TOP":
      return String.raw`\top`;
    case "BOT":
      return String.raw`\bot`;
    case "NOT":
      return String.raw`\lnot ${formulaToTeX(f[1])}`;
    case "OR":
      return String.raw`\left( ${formulaToTeX(f[1])} \lor ${formulaToTeX(f[2])} \right)`;
    case "AND":
      return String.raw`\left( ${formulaToTeX(f[1])} \land ${formulaToTeX(f[2])} \right)`;
    case "IMP":
      return String.raw`\left( ${formulaToTeX(f[1])} \to ${formulaToTeX(f[2])} \right)`;
    case "EQ":
      return String.raw`\left( ${formulaToTeX(f[1])} \leftrightarrow ${formulaToTeX(f[2])} \right)`;
  }
};
