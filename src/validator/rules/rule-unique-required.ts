import { Rule } from "./types";
import { walk, isElement, tagName } from "../dom-utils";
import { messages } from "../../i18n/en";

const uniques = ["title"]; // extend as needed

export const ruleUniqueRequired: Rule = {
  id: "UNIQUE_REQUIRED",
  severity: "warning",
  applies: () => true,
  check: (_n, _path, ctx) => {
    const counts = new Map<string, number>();
    walk(ctx.root, (node) => {
      if (isElement(node)) {
        const t = tagName(node)!;
        if (uniques.includes(t)) {
          counts.set(t, (counts.get(t) ?? 0) + 1);
        }
      }
    });
    const findings: any[] = [];
    for (const u of uniques) {
      if ((counts.get(u) ?? 0) !== 1) {
        findings.push({
          id: "UNIQUE_REQUIRED",
          severity: "warning",
          message: messages.rules.UNIQUE_REQUIRED(u),
          nodePath: [0], // generic/global
          tagName: u
        });
      }
    }
    return findings;
  }
};
