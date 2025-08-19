import { isElement, tagName, getAttr } from "../dom-utils";
import { Rule, RuleContext } from "./types";
import { messages } from "../../i18n/en";
import type { Finding } from "../../types";

const requiredAttrMap: Record<string, string[]> = {
  img: ["alt"],
  html: ["lang"],
  meta: [], // special-case: either charset or (http-equiv + content) etc., keep simple baseline:
};

export const ruleRequiredAttrs: Rule = {
  id: "REQUIRED_ATTRS",
  severity: "warning",
  applies: (n) => isElement(n),
  check: (n, path, _ctx: RuleContext) => {
    const t = tagName(n);
    if (!t) return [];
    const req = requiredAttrMap[t];
    if (!req) return [];

    const findings: Finding[] = [];
    for (const attr of req) {
      const val = getAttr(n as any, attr);
      if (!val || val.trim() === "") {
        findings.push({
          id: "REQUIRED_ATTRS",
          severity: "warning",
          message: messages.rules.REQUIRED_ATTRS(t, attr),
          nodePath: path,
          tagName: t,
          attrName: attr
        });
      }
    }
    return findings;
  }
};
