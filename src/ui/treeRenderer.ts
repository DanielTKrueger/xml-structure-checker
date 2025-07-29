import type { ParsedElement } from "../types/parserTypes";
import { escapeHTML } from "../utils/htmlTools";

export function renderTree(elements: ParsedElement[], container: HTMLElement): void {
  const stack: HTMLElement[] = [container];

  elements.forEach((el) => {
    const node = document.createElement("div");
    node.className = "ml-4 border-l border-gray-300 pl-2";

    if (el.type === "open") {
      const wrapper = document.createElement("div");
      wrapper.className = "cursor-pointer font-mono text-blue-700 hover:underline";
      wrapper.textContent = escapeHTML(el.raw);
      wrapper.addEventListener("click", () => {
        node.classList.toggle("hidden");
      });
      stack[stack.length - 1].appendChild(wrapper);

      const subTree = document.createElement("div");
      stack[stack.length - 1].appendChild(subTree);
      stack.push(subTree);
    } else if (el.type === "close") {
      stack.pop();
    } else {
      node.textContent = escapeHTML(el.raw);
      node.classList.add("font-mono", "text-gray-700");
      stack[stack.length - 1].appendChild(node);
    }
  });
}
