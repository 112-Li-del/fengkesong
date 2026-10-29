import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

for (const value of ["", "   ", "https://api.deepseek.com"]) {
  test(`model SDK loads with ${value.trim() ? "configured" : "blank"} base URL (${JSON.stringify(value)})`, () => {
    const result = spawnSync(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        `
      import assert from "node:assert/strict";
      await import("./next.config.js");
      const { createOpenAI } = await import("@ai-sdk/openai");
      assert.equal(process.env.OPENAI_BASE_URL, ${value.trim() ? JSON.stringify(value) : "undefined"});
      createOpenAI({apiKey: "test-placeholder", baseURL: "https://api.deepseek.com"}).chat("test-model");
    `,
      ],
      {
        cwd: new URL("../", import.meta.url),
        env: { ...process.env, OPENAI_BASE_URL: value },
        encoding: "utf8",
      },
    );
    assert.equal(result.status, 0, result.stderr);
  });
}
