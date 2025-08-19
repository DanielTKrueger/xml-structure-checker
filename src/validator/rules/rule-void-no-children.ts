import { isElement, childrenOf, tagName } from "../dom-utils";
import { Rule } from "./types";
import { messages } from "../../i18n/en";

export const ruleVoidNoChildren: Rule = {
  id: "VOID_NO_CHILDREN",
  severity: "error",
  applies: (n) => isElement(n),
  check: (n, path) => {
    const t = tagName(n);
    if (!t) return [];
    if (!["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"].includes(t)) return [];
    const kids = childrenOf(n).filter(k => (k as any).nodeName !== "#text" || ((k as any).value ?? "").trim() !== "");
    if (kids.length > 0) {
      return [{
        id: "VOID_NO_CHILDREN",
        severity: "error",
        message: messages.rules.VOID_NO_CHILDREN(t),
        nodePath: path,
        tagName: t
      }];
    }
    return [];
  }
};
