import * as parse5 from "parse5";

export interface Parsed {
  document: parse5.DefaultTreeAdapterMap["document"];
  errors: parse5.ParserError[];
}

export function parseHtml(html: string): Parsed {
  // parse5 v7: use parse() with sourceCodeLocationInfo
  const document = parse5.parse(html, { sourceCodeLocationInfo: true });

  // ⚠️ parse5 does not expose a public error list anymore
  // so we'll leave errors as empty for now or add custom rule-based validation later
  const errors: parse5.ParserError[] = [];

  return { document, errors };
}
