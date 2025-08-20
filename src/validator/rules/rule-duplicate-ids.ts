import { Rule } from "./types";
import { walk, isElement, getAttr } from "../dom-utils";
import { messages } from "../../i18n/en";
import type { Finding } from "../../types";

export const ruleDuplicateIds: Rule = {
  id: "DUPLICATE_IDS",
  severity: "error",
  applies: () => true,
  check: (node, _path, ctx) => {
    // only process at root, otherwise we'd spam
    if (node !== ctx.root) return [];

    const idMap = new Map<string, number[][]>(); // id -> list of paths

    walk(ctx.root, (n, path) => {
      if (isElement(n)) {
        const id = getAttr(n, "id");
        if (id) {
          const paths = idMap.get(id) ?? [];
          paths.push(path);
          idMap.set(id, paths);
        }
      }
    });

    const findings: Finding[] = [];
    for (const [id, paths] of idMap.entries()) {
      if (paths.length > 1) {
        findings.push({
          id: "DUPLICATE_IDS",
          severity: "error",
          message: `${messages.rules.DUPLICATE_IDS(id)} (appears ${paths.length} times)`,
          nodePath: paths[0] // attach the first occurrence; could also pick all
        });
      }
    }

    return findings;
  }
};
