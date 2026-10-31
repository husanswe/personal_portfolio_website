import test from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl } from "../src/lib/site-url";

test("a configured canonical domain takes priority and resolves to its origin", () => {
  assert.equal(getSiteUrl({ SITE_URL: " https://portfolio.example/path?preview=yes ", VERCEL_PROJECT_PRODUCTION_URL: "production.example" }).href, "https://portfolio.example/");
});

test("preview builds share the production URL when Vercel provides it", () => {
  assert.equal(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "production.example", VERCEL_URL: "preview.example" }).href, "https://production.example/");
});

test("blank settings fall back to the deployment URL or local preview", () => {
  assert.equal(getSiteUrl({ SITE_URL: " ", VERCEL_URL: "preview.example" }).href, "https://preview.example/");
  assert.equal(getSiteUrl({}).href, "http://127.0.0.1:3000/");
});

test("unsafe URL schemes and credentials cannot become sharing URLs", () => {
  assert.throws(() => getSiteUrl({ SITE_URL: "ftp://portfolio.example" }));
  assert.throws(() => getSiteUrl({ SITE_URL: "https://user:password@portfolio.example" }));
});
