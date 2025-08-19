import * as parse5 from "parse5";

export type Node = parse5.DefaultTreeAdapterMap["node"];
export type Element = parse5.DefaultTreeAdapterMap["element"];

export function isElement(n: Node): n is Element {
  return (n as any).tagName !== undefined;
}

export function getAttr(el: Element, name: string): string | undefined {
  const a = el.attrs?.find(x => x.name === name);
  return a?.value;
}

export function childrenOf(n: Node): Node[] {
  // document -> childNodes; element -> childNodes; template content -> content
  const asAny = n as any;
  if (asAny.content && asAny.content.childNodes) return asAny.content.childNodes;
  return asAny.childNodes ?? [];
}

export function walk(node: Node, fn: (node: Node, path: number[]) => void, path: number[] = []) {
  fn(node, path);
  const children = childrenOf(node);
  for (let i = 0; i < children.length; i++) {
    walk(children[i], fn, path.concat(i));
  }
}

export function tagName(n: Node): string | undefined {
  return isElement(n) ? (n.tagName || "").toLowerCase() : undefined;
}

export function isVoidElement(t: string): boolean {
  return [
    "area","base","br","col","embed","hr","img","input",
    "link","meta","param","source","track","wbr"
  ].includes(t);
}
