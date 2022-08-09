import { PropFormula, PropInference } from "~/types/prop";

export const toTexPropFormula = (f: PropFormula): string => {
  switch (f[0]) {
    case "PROP":
      return String.raw`${f[1]}`;
    case "TOP":
      return String.raw`\top`;
    case "BOT":
      return String.raw`\bot`;
    case "NOT":
      return String.raw`\lnot ${toTexPropFormula(f[1])}`;
    case "OR":
      return String.raw`\left( ${toTexPropFormula(f[1])} \lor ${toTexPropFormula(f[2])} \right)`;
    case "AND":
      return String.raw`\left( ${toTexPropFormula(f[1])} \land ${toTexPropFormula(f[2])} \right)`;
    case "IMP":
      return String.raw`\left( ${toTexPropFormula(f[1])} \to ${toTexPropFormula(f[2])} \right)`;
    case "EQ":
      return String.raw`\left( ${toTexPropFormula(f[1])} \leftrightarrow ${toTexPropFormula(f[2])} \right)`;
  }
};

export const toTexPropInference = (i: PropInference): string => {
  const pr = i.premise.map((p) => `${toTexPropFormula(p)}`).join(",");
  const cq = toTexPropFormula(i.consequence);
  return String.raw`${pr} \models ${cq}`;
};
