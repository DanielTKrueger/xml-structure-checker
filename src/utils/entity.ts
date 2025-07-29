export function escapeEntity(str: string): string {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
