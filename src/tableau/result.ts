export type Prop = { type: "PROP"; id: string };
export type Not = { type: "NOT"; in: PropFormula };
export type And = { type: "AND"; left: PropFormula; right: PropFormula };
export type Or = { type: "OR"; left: PropFormula; right: PropFormula };
export type Implict = { type: "IMPLICT"; left: PropFormula; right: PropFormula };
export type Eq = { type: "EQ"; left: PropFormula; right: PropFormula };

export type PropFormula =
  | Prop
  | Not
  | And
  | Or
  | Implict
  | Eq;

export type PropsTable = Record<string, { 0?: true; 1?: true }>;
export type Branch =
  | {
    nodes: PropFormula[];
    stack: PropFormula[];
    skip: (Or)[];
    props: PropsTable;
    valid?: boolean;
    left: null;
    right: null;
  }
  | {
    nodes: PropFormula[];
    stack: [];
    skip: [];
    props: PropsTable;
    valid?: boolean;
    left: Branch;
    right: Branch;
  };
