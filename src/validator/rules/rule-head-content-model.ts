import { Rule } from "./types";
import { isElement, tagName, childrenOf } from "../dom-utils";
import { messages } from "../../i18n/en";

const allowedHead = new Set([
  "base","link","meta","noscript","script","style","template","title"
]);

export const ruleHeadContentModel: Rule = {
  id: "HEAD_CONTENT",
  severity: "error",
  applies: (n) => isElement(n) && tagName(n) === "head",
  check: (n, _path) => {
    const findings: any[] = [];
    for (let i = 0; i < childrenOf(n).length; i++) {
      const c = childrenOf(n)[i] as any;
      const t = c.tagName?.toLowerCase?.();
      if (t && !allowedHead.has(t)) {
        findings.push({
          id: "HEAD_CONTENT",
          severity: "error",
          message: messages.rules.HEAD_CONTENT(t),
          nodePath: _path.concat(i),
          tagName: t
        });
      }
    }
    return findings;
  }
};
