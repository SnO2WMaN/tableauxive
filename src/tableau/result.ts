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

export const branch: Branch = {
  nodes: [
    {
      type: "NOT",
      in: {
        type: "IMPLICT",
        left: {
          type: "AND",
          left: { type: "PROP", id: "P" },
          right: {
            type: "IMPLICT",
            left: { type: "PROP", id: "P" },
            right: { type: "PROP", id: "Q" },
          },
        },
        right: { type: "PROP", id: "Q" },
      },
    },
    {
      type: "AND",
      left: { type: "PROP", id: "P" },
      right: {
        type: "IMPLICT",
        left: { type: "PROP", id: "P" },
        right: { type: "PROP", id: "Q" },
      },
    },
    { type: "NOT", in: { type: "PROP", id: "Q" } },
    { type: "PROP", id: "P" },
    {
      type: "IMPLICT",
      left: { type: "PROP", id: "P" },
      right: { type: "PROP", id: "Q" },
    },
    {
      type: "OR",
      left: { type: "NOT", in: { type: "PROP", id: "P" } },
      right: { type: "PROP", id: "Q" },
    },
  ],
  stack: [],
  skip: [],
  props: { Q: { "0": true }, P: { "1": true } },
  valid: undefined,
  left: {
    nodes: [{ type: "NOT", in: { type: "PROP", id: "P" } }],
    stack: [],
    skip: [],
    props: { Q: { "0": true }, P: { "0": true, "1": true } },
    valid: false,
    left: null,
    right: null,
  },
  right: {
    nodes: [{ type: "PROP", id: "Q" }],
    stack: [],
    skip: [],
    props: { Q: { "0": true, "1": true }, P: { "1": true } },
    valid: false,
    left: null,
    right: null,
  },
};
