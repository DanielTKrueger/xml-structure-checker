export type ParsedElement =
  | { type: "open"; name: string; raw: string }
  | { type: "close"; name: string; raw: string }
  | { type: "selfclosing"; name: string; raw: string }
  | { type: "text"; name: string; raw: string };

export interface ParseResult {
  valid: boolean;
  elements: ParsedElement[];
  error?: string;
}

export interface StructureValidationResult {
  valid: boolean;
  error?: string;
}
