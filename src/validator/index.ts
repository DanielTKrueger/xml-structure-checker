import { parseHtml } from "./parser";
import { walk, isElement, tagName, Node } from "./dom-utils";
import type { Finding } from "../types";
import type { Rule, RuleContext } from "./rules/types";

import { ruleVoidNoChildren } from "./rules/rule-void-no-children";
import { ruleRequiredAttrs } from "./rules/rule-required-attrs";
import { ruleDuplicateIds } from "./rules/rule-duplicate-ids";
import { ruleANotNested } from "./rules/rule-a-not-nested";
import { ruleHeadContentModel } from "./rules/rule-head-content-model";
import { ruleUniqueRequired } from "./rules/rule-unique-required";

export interface ValidationResult {
  syntaxFindings: Finding[];
  structureFindings: Finding[];
  ast: Node;
}

const rules: Rule[] = [
  ruleVoidNoChildren,
  ruleRequiredAttrs,
  ruleDuplicateIds,
  ruleANotNested,
  ruleHeadContentModel,
  ruleUniqueRequired
];

export function validate(html: string): ValidationResult {
  const { document } = parseHtml(html);

  const ctx: RuleContext = { root: document as any, html };
  const allFindings: Finding[] = [];

  // Apply rules; never stop on first error.
  walk(document as any, (node, path) => {
    for (const r of rules) {
      try {
        if (r.applies(node)) {
          const f = r.check(node, path, ctx);
          if (f?.length) allFindings.push(...f);
        }
      } catch (e) {
        // A rule error should not break the whole run.
        allFindings.push({
          id: `RULE_ERROR_${r.id}`,
          severity: "warning",
          message: `Rule "${r.id}" threw an error: ${String(e)}`,
          nodePath: path
        });
      }
    }
  });

  // Using parse5 means "syntax" at tokenizer/tree-builder level is largely normalized.
  // We’ll categorize:
  // - Findings directly tied to tokens/elements as "structure"
  // - We can also funnel any parser-native errors to "syntax" (limited availability).
  // For now, keep all custom-rule issues under "structure".
  const syntaxFindings: Finding[] = []; // placeholder: parse5 parser errors if available
  const structureFindings: Finding[] = allFindings;

  return { syntaxFindings, structureFindings, ast: document as any };
}
