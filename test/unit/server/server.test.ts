// test/unit/server/server.test.ts
import request from "supertest";
import { app } from "../../../server/server";

// Mock undici.fetch
jest.mock("undici", () => ({
  fetch: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // silence error logs
});

afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});


import { fetch } from "undici";

describe("server.ts routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /health should return ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("GET /fetch without url should return 400", async () => {
    const res = await request(app).get("/fetch");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Missing 'url'/);
  });

  it("GET /fetch with invalid url should return 400", async () => {
    const res = await request(app).get("/fetch?url=not_a_url");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid URL/);
  });

  it("GET /fetch with unsupported protocol should return 400", async () => {
    const res = await request(app).get("/fetch?url=ftp://example.com");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Only http\/https/);
  });

  it("GET /fetch with valid URL should proxy response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: async () => "<html><body>hello</body></html>",
    });

    const res = await request(app).get("/fetch?url=http://example.com");
    expect(res.status).toBe(200);
    expect(res.text).toContain("hello");
  });

  it("GET /fetch when fetch fails should return error", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const res = await request(app).get("/fetch?url=http://example.com");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Failed to fetch/);
  });

  it("GET /fetch when fetch throws should return 500", async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error("network error"));

    const res = await request(app).get("/fetch?url=http://example.com");
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/Internal server error/);
  });
});
