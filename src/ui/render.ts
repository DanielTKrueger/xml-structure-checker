import type { Finding } from "../types";
import { messages } from "../i18n/en";
import { icons } from "../icons";
import { childrenOf, isElement, tagName, Node } from "../validator/dom-utils";
import { attachTooltip } from "./tooltip";

export function renderStatus(statusArea: HTMLElement, syntax: Finding[], structure: Finding[]) {
  statusArea.innerHTML = "";

  const mk = (ok: boolean, labelOk: string, labelErr: string) => {
    const div = document.createElement("div");
    div.className = `flex items-center gap-2 p-2 rounded border ${ok ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}`;
    div.innerHTML = `${ok ? icons.ok : icons.error} <span>${ok ? labelOk : labelErr}</span>`;
    return div;
  };

  statusArea.appendChild(mk(syntax.length === 0, messages.status.syntaxOk, messages.status.syntaxErr));
  statusArea.appendChild(mk(structure.length === 0, messages.status.structureOk, messages.status.structureErr));

  if (structure.length > 0) {
    const list = document.createElement("ul");
    list.className = "list-disc pl-5";
    for (const f of structure.slice(0, 50)) {
      const li = document.createElement("li");
      li.textContent = f.message;
      list.appendChild(li);
    }
    if (structure.length > 50) {
      const more = document.createElement("div");
      more.className = "text-sm text-gray-500 mt-1";
      more.textContent = `+${structure.length - 50} more…`;
      statusArea.appendChild(more);
    }
    statusArea.appendChild(list);
  }
}

function createToggle(): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "shrink-0 mr-1 text-gray-500 hover:text-gray-800";
  btn.innerHTML = icons.chevron;
  (btn.firstElementChild as HTMLElement).style.transform = "rotate(90deg)"; // expanded
  return btn;
}

export function renderTree(container: HTMLElement, root: Node, findings: Finding[]) {
  container.innerHTML = "";
  const mapByPath = new Map<string, Finding[]>();
  for (const f of findings) {
    mapByPath.set(JSON.stringify(f.nodePath), [...(mapByPath.get(JSON.stringify(f.nodePath)) ?? []), f]);
  }

  function nodeLabel(n: Node): string {
    if (isElement(n)) {
      const t = tagName(n)!;
      return `<${t}>`;
    }
    const name = (n as any).nodeName ?? "node";
    return name;
  }

  function renderRow(n: Node, path: number[], depth: number): HTMLElement {
    const row = document.createElement("div");
    row.className = "pl-2";
    const hasChildren = childrenOf(n).length > 0;

    const line = document.createElement("div");
    line.className = "flex items-start gap-1 py-1";

    // Toggle
    let toggle: HTMLButtonElement | null = null;
    if (hasChildren) {
      toggle = createToggle();
      line.appendChild(toggle);
    } else {
      const spacer = document.createElement("span");
      spacer.className = "inline-block w-4";
      line.appendChild(spacer);
    }

    // Label
    const label = document.createElement("span");
    const pathKey = JSON.stringify(path);
    const errs = mapByPath.get(pathKey) ?? [];

    label.className = `font-mono text-sm ${errs.length ? "text-red-700" : "text-gray-800"}`;
    label.innerHTML = nodeLabel(n);

    if (errs.length) {
      const badge = document.createElement("span");
      badge.className = "ml-2 inline-flex items-center text-red-700";
      badge.innerHTML = icons.error;
      line.appendChild(badge);

      // Tooltip with combined messages
      const ttHost = document.createElement("span");
      ttHost.className = "ml-1 cursor-help text-xs text-red-700 underline decoration-dotted";
      ttHost.textContent = "details";
      attachTooltip(ttHost, errs.map(e => `• ${e.message}`).join("\n"));
      line.appendChild(ttHost);
    }

    // Click-to-toggle on label & toggle
    const kidsWrap = document.createElement("div");
    kidsWrap.className = "ml-5 border-l pl-3";
    const expanded = { value: true };
    function setExpanded(val: boolean) {
      expanded.value = val;
      kidsWrap.style.display = val ? "block" : "none";
      if (toggle?.firstElementChild) {
        (toggle.firstElementChild as HTMLElement).style.transform = val ? "rotate(90deg)" : "rotate(0deg)";
      }
    }
    if (toggle) {
      toggle.addEventListener("click", () => setExpanded(!expanded.value));
      label.classList.add("cursor-pointer");
      label.title = messages.tooltips.clickToToggle;
      label.addEventListener("click", () => setExpanded(!expanded.value));
    }

    line.appendChild(label);
    row.appendChild(line);

    // Children
    for (let i = 0; i < childrenOf(n).length; i++) {
      const c = childrenOf(n)[i];
      kidsWrap.appendChild(renderRow(c, path.concat(i), depth + 1));
    }
    row.appendChild(kidsWrap);
    return row;
  }

  container.appendChild(renderRow(root, [], 0));
}
