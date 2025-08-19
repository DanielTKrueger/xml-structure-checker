import type { Finding } from "../../types";
import type { Node } from "../dom-utils";

export interface RuleContext {
  root: Node;
  html: string;
}

export interface Rule {
  id: string;
  severity: "error" | "warning";
  applies(node: Node): boolean;
  check(node: Node, path: number[], ctx: RuleContext): Finding[];
}
