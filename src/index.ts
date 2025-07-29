import "./style.css";
import { parseDocument } from "./parser/documentParser";
import { validateStructure } from "./parser/structureValidator";
import { renderTree } from "./ui/treeRenderer";
import { escapeHTML } from "./utils/htmlTools";

window.addEventListener("DOMContentLoaded", () => {
  const parseButton = document.getElementById("parse-button") as HTMLButtonElement;
  const inputArea = document.getElementById("input-area") as HTMLTextAreaElement;
  const outputArea = document.getElementById("output") as HTMLDivElement;
  const syntaxFeedback = document.getElementById("syntax-feedback") as HTMLHeadingElement;
  const structureFeedback = document.getElementById("structure-feedback") as HTMLHeadingElement;

  parseButton.addEventListener("click", () => {
    const input = inputArea.value;

    // Clear output
    outputArea.innerHTML = "";
    syntaxFeedback.textContent = "";
    structureFeedback.textContent = "";

    const parseResult = parseDocument(input);
    syntaxFeedback.textContent = parseResult.valid
      ? "✓ Valid document syntax"
      : `✗ Syntax error: ${escapeHTML(parseResult.error ?? "Unknown error")}`;
    syntaxFeedback.className = parseResult.valid ? "text-green-600 font-bold text-lg" : "text-red-600 font-bold text-lg";

    if (!parseResult.valid) return;

    const structureResult = validateStructure(parseResult.elements);
    structureFeedback.textContent = structureResult.valid
      ? "✓ Document structure is valid"
      : `✗ Structure error: ${escapeHTML(structureResult.error ?? "Unknown error")}`;
    structureFeedback.className = structureResult.valid ? "text-green-600 font-bold text-lg" : "text-red-600 font-bold text-lg";

    renderTree(parseResult.elements, outputArea);
  });
});
