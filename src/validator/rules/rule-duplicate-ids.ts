import { Rule } from "./types";
import { walk, isElement, getAttr } from "../dom-utils";
import { messages } from "../../i18n/en";
import type { Finding } from "../../types";

export const ruleDuplicateIds: Rule = {
  id: "DUPLICATE_IDS",
  severity: "error",
  applies: () => true,
  check: (_n, _path, ctx) => {
    const idMap = new Map<string, number[]>();
    const findings: Finding[] = [];

    walk(ctx.root, (node, path) => {
      if (isElement(node)) {
        const id = getAttr(node, "id");
        if (id) {
          const p = idMap.get(id);
          if (p) {
            findings.push({
              id: "DUPLICATE_IDS",
              severity: "error",
              message: messages.rules.DUPLICATE_IDS(id),
              nodePath: path
            });
          } else {
            idMap.set(id, path);
          }
        }
      }
    });

    return findings;
  }
};
