import type { ParsedElement, ParseResult } from "../types/parserTypes";

export function parseDocument(source: string): ParseResult {
  const regex = /<\/?[a-zA-Z][^>]*>|[^<]+/g;
  const elements: ParsedElement[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(source)) !== null) {
    const raw = match[0].trim();
    if (!raw) continue;

    if (raw.startsWith("</")) {
      const name = raw.slice(2, -1).trim();
      elements.push({ type: "close", name, raw });
    } else if (raw.startsWith("<")) {
      const isSelfClosing = raw.endsWith("/>");
      const nameMatch = raw.match(/^<\s*([^\s>/]+)/);
      if (!nameMatch) {
        return { valid: false, elements: [], error: `Invalid tag syntax: ${raw}` };
      }
      const name = nameMatch[1];
      elements.push({
        type: isSelfClosing ? "selfclosing" : "open",
        name,
        raw,
      });
    } else {
      elements.push({ type: "text", name: "#text", raw });
    }
  }

  return { valid: true, elements };
}
