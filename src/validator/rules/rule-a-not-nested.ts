import { Rule } from "./types";
import { isElement, tagName, childrenOf } from "../dom-utils";
import { messages } from "../../i18n/en";

export const ruleANotNested: Rule = {
  id: "A_NOT_NESTED",
  severity: "error",
  applies: (n) => isElement(n) && tagName(n) === "a",
  check: (n, path) => {
    const kids = childrenOf(n);
    const bad = kids.some(k => (k as any).tagName?.toLowerCase?.() === "a");
    if (bad) {
      return [{
        id: "A_NOT_NESTED",
        severity: "error",
        message: messages.rules.A_NOT_NESTED,
        nodePath: path,
        tagName: "a"
      }];
    }
    return [];
  }
};
