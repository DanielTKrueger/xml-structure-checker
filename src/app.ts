import "./style.css";
import { messages } from "./i18n/en";
import { validate } from "./validator";
import { renderStatus, renderTree } from "./ui/render";

const el = {
  title: document.getElementById("title")!,
  inputPanelTitle: document.getElementById("inputPanelTitle")!,
  urlLabel: document.getElementById("urlLabel")!,
  fetchBtn: document.getElementById("fetchBtn") as HTMLButtonElement,
  sourceLabel: document.getElementById("sourceLabel")!,
  helperText: document.getElementById("helperText")!,
  validateBtn: document.getElementById("validateBtn") as HTMLButtonElement,
  resultsTitle: document.getElementById("resultsTitle")!,
  treeTitle: document.getElementById("treeTitle")!,
  urlInput: document.getElementById("urlInput") as HTMLInputElement,
  sourceInput: document.getElementById("sourceInput") as HTMLTextAreaElement,
  statusArea: document.getElementById("statusArea")!,
  treeContainer: document.getElementById("treeContainer")!
};

// i18n inject
el.title.textContent = messages.app.title;
el.inputPanelTitle.textContent = messages.app.inputPanelTitle;
el.urlLabel.textContent = messages.app.urlLabel;
el.fetchBtn.textContent = messages.app.fetchBtn;
el.sourceLabel.textContent = messages.app.sourceLabel;
el.helperText.textContent = messages.app.helperText;
el.validateBtn.textContent = messages.app.validateBtn;
el.resultsTitle.textContent = messages.app.resultsTitle;
el.treeTitle.textContent = messages.app.treeTitle;

async function fetchViaProxy(url: string): Promise<string> {
  const u = new URL("/proxy", window.location.origin);
  u.searchParams.set("url", url);
  const res = await fetch(u.toString(), { method: "GET" });
  if (!res.ok) throw new Error("Proxy error");
  return await res.text();
}

el.fetchBtn.addEventListener("click", async () => {
  const url = el.urlInput.value.trim();
  if (!url) return;
  const previous = el.fetchBtn.textContent;
  el.fetchBtn.textContent = messages.status.fetchInProgress;
  try {
    const html = await fetchViaProxy(url);
    el.sourceInput.value = html;
  } catch {
    alert(messages.status.fetchFailed);
  } finally {
    el.fetchBtn.textContent = previous!;
  }
});

function runValidation(html: string) {
  const result = validate(html);
  renderStatus(el.statusArea, result.syntaxFindings, result.structureFindings);
  renderTree(el.treeContainer, result.ast, [...result.syntaxFindings, ...result.structureFindings]);
}

el.validateBtn.addEventListener("click", () => {
  const html = el.sourceInput.value;
  runValidation(html);
});

// Optional: small demo content
el.sourceInput.value = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Demo</title>
</head>
<body>
  <a href="#"><a>nested</a></a>
  <img src="x.png"><!-- missing alt -->
  <div id="dup"></div><p id="dup"></p>
</body>
</html>`;
