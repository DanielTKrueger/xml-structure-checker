import express, { Request, Response } from "express";
import { fetch } from "undici";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for frontend
app.use(cors());

// Serve static client files
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Proxy endpoint
app.get("/fetch", async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({ error: "Missing 'url' query parameter" });
    return;
  }

  try {
    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      res.status(400).json({ error: "Invalid URL format" });
      return;
    }

    if (!["http:", "https:"].includes(parsed.protocol)) {
      res.status(400).json({ error: "Only http/https URLs are allowed" });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    const response = await fetch(parsed.toString(), { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
      return;
    }

    const text = await response.text();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(text);
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      res.status(504).json({ error: "Fetch request timed out" });
    } else {
      console.error("Proxy error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Fallback for SPA: serve index.html
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
