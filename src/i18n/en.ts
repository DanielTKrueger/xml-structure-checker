export const messages = {
  app: {
    title: "HTML Structure & Syntax Validator",
    inputPanelTitle: "Input",
    urlLabel: "Fetch from URL",
    fetchBtn: "Fetch",
    sourceLabel: "Paste HTML Source",
    helperText: "Your input remains on this page. You can revalidate without reloading.",
    validateBtn: "Validate",
    resultsTitle: "Results",
    treeTitle: "Document Tree",
  },
  status: {
    syntaxOk: "Syntax: OK",
    syntaxErr: "Syntax: Issues detected",
    structureOk: "Structure: OK",
    structureErr: "Structure: Issues detected",
    fetchInProgress: "Fetching…",
    fetchFailed: "Failed to fetch the URL.",
    proxyBadUrl: "URL is not allowed or invalid.",
  },
  tooltips: {
    clickToToggle: "Click to expand/collapse",
  },
  rules: {
    VOID_NO_CHILDREN: (tag: string) => `Void element <${tag}> must not have children.`,
    REQUIRED_ATTRS: (tag: string, attr: string) => `<${tag}> requires attribute "${attr}".`,
    DUPLICATE_IDS: (id: string) => `Duplicate id "${id}".`,
    A_NOT_NESTED: "Anchor elements must not be nested inside anchors.",
    HEAD_CONTENT: (disallowed: string) => `Disallowed element in <head>: <${disallowed}>.`,
    UNIQUE_REQUIRED: (tag: string) => `Exactly one <${tag}> is required.`,
  }
};
