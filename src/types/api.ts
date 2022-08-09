import { PropInference, PropTableau } from "./prop";

export type SolveApiResult = {
  type: "prop";
  valid: boolean;
  tableau: PropTableau;
  inference: PropInference;
};
