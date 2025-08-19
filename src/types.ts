export type Severity = "error" | "warning";

export interface Finding {
  id: string;
  severity: Severity;
  message: string;
  nodePath: number[]; // path in the tree for mapping UI nodes
  tagName?: string;
  attrName?: string;
}
