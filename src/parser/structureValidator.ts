import type { ParsedElement, StructureValidationResult } from "../types/parserTypes";

export function validateStructure(elements: ParsedElement[]): StructureValidationResult {
  const stack: string[] = [];

  for (const el of elements) {
    if (el.type === "open") {
      stack.push(el.name);
    } else if (el.type === "close") {
      const expected = stack.pop();
      if (expected !== el.name) {
        return {
          valid: false,
          error: `Mismatched closing tag: expected </${expected ?? "(none)"}>, but found </${el.name}>.`,
        };
      }
    }
  }

  if (stack.length > 0) {
    return {
      valid: false,
      error: `Unclosed tag: <${stack[stack.length - 1]}>`,
    };
  }

  return { valid: true };
}
