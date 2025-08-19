export function attachTooltip(el: HTMLElement, text: string) {
  let tip: HTMLDivElement | null = null;

  function show(e: MouseEvent) {
    tip = document.createElement("div");
    tip.className = "tooltip bg-gray-900 text-white text-xs rounded px-2 py-1 shadow";
    tip.textContent = text;
    document.body.appendChild(tip);
    position(e);
  }

  function position(e: MouseEvent) {
    if (!tip) return;
    tip.style.left = e.pageX + 12 + "px";
    tip.style.top = e.pageY + 12 + "px";
  }

  function hide() {
    if (tip && tip.parentNode) tip.parentNode.removeChild(tip);
    tip = null;
  }

  el.addEventListener("mouseenter", show);
  el.addEventListener("mousemove", position);
  el.addEventListener("mouseleave", hide);
}
