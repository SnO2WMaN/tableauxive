export type Top = ["TOP"];
export type Bot = ["BOT"];
export type Prop = ["PROP", string];
export type Not = ["NOT", PropFormula];
export type And = ["AND", PropFormula, PropFormula];
export type Or = ["OR", PropFormula, PropFormula];
export type Imp = ["IMP", PropFormula, PropFormula];
export type Eq = ["EQ", PropFormula, PropFormula];

export type PropFormula = Top | Bot | Prop | Not | And | Or | Imp | Eq;

export type PropsTable = Record<string, { 0?: true; 1?: true }>;
export type BranchType = {
  nodes: PropFormula[];
  stack: PropFormula[];
  skip: (Or | Imp | Eq)[];
  props: PropsTable;
  junction: null | [BranchType, BranchType];
};

export type SolveApiResult = { valid: boolean; branch: BranchType; formula: PropFormula };
