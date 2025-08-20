# HTML Structure & Syntax Validator

Modern, browser-based validator for HTML (HTML5) using TypeScript, Tailwind CSS, Webpack, and a minimal Node/Express proxy for URL fetching. Validation is extensible via pluggable rules on top of `parse5`.

## Features
- Paste HTML or fetch via URL (proxy avoids CORS)
- Non-stopping validation: collects all issues
- Syntax (parser-level) + Structure (rule-based) status
- Collapsible, modern tree with per-node error indicators + tooltips
- All UI text in `src/i18n/en.ts`

## Quick start

```bash
npm install
npm run dev
# open http://localhost:8080
