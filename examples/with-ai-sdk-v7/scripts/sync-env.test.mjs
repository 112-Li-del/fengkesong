import {
  mkdtempSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  syncEnvFiles,
  readDevelopmentEnv,
  configurationMessages,
} from "./sync-env.mjs";

const directories = [];
function fixture(template, local) {
  const directory = mkdtempSync(join(tmpdir(), "qixia-env-"));
  directories.push(directory);
  writeFileSync(join(directory, ".env.example"), template);
  if (local !== undefined) writeFileSync(join(directory, ".env.local"), local);
  return directory;
}
afterEach(() => {
  for (const directory of directories.splice(0))
    rmSync(directory, { recursive: true, force: true });
});
describe("team environment configuration", () => {
  it("appends missing empty fields without changing keys, comments, custom values or line endings", () => {
    const original =
      '# personal settings\r\nOPENAI_API_KEY="personal-secret"\r\nexport AMAP_JS_API_KEY=\r\nCUSTOM="first\nsecond"';
    const directory = fixture(
      "OPENAI_API_KEY=\nAMAP_JS_API_KEY=\nAMAP_JS_SECURITY_CODE=\n",
      original,
    );
    expect(syncEnvFiles(directory, {}).added).toEqual([
      "AMAP_JS_SECURITY_CODE",
    ]);
    const result = readFileSync(join(directory, ".env.local"), "utf8");
    expect(result.startsWith(original + "\r\n")).toBe(true);
    expect(result).toContain("AMAP_JS_SECURITY_CODE=\r\n");
    expect(syncEnvFiles(directory, {}).added).toEqual([]);
    expect(readFileSync(join(directory, ".env.local"), "utf8")).toBe(result);
  });
  it("creates local blanks without copying any value from the shared template", () => {
    const directory = fixture(
      "QWEATHER_API_KEY=template-value-must-not-be-copied\nQWEATHER_API_HOST=host\n",
    );
    expect(syncEnvFiles(directory, {}).added).toEqual([
      "QWEATHER_API_KEY",
      "QWEATHER_API_HOST",
    ]);
    const result = readFileSync(join(directory, ".env.local"), "utf8");
    expect(result).toContain("QWEATHER_API_KEY=\n");
    expect(result).not.toContain("template-value");
    expect(result).not.toContain("=host");
  });
  it("does not shadow credentials supplied by another development env file or the process", () => {
    const directory = fixture(
      "AMAP_JS_API_KEY=\nQWEATHER_API_KEY=\nQWEATHER_API_HOST=\n",
    );
    writeFileSync(
      join(directory, ".env.development"),
      "AMAP_JS_API_KEY=provided-elsewhere\n",
    );
    expect(
      syncEnvFiles(directory, {
        QWEATHER_API_KEY: "process-secret",
        QWEATHER_API_HOST: "process-host",
      }).added,
    ).toEqual([]);
    expect(existsSync(join(directory, ".env.local"))).toBe(false);
    writeFileSync(join(directory, ".env.local"), "AMAP_JS_API_KEY=local\n");
    writeFileSync(
      join(directory, ".env.development.local"),
      "AMAP_JS_API_KEY=dev-local\n",
    );
    expect(readDevelopmentEnv(directory, {}).AMAP_JS_API_KEY).toBe("dev-local");
    expect(
      readDevelopmentEnv(directory, { AMAP_JS_API_KEY: "process" })
        .AMAP_JS_API_KEY,
    ).toBe("process");
  });
  it("reports optional fallback and missing map names without exposing values", () => {
    const messages = configurationMessages({
      OPENAI_API_KEY: "never-log-me",
      OPENAI_BASE_URL: "https://private-host",
      OPENAI_MODEL: "private-model",
    });
    expect(messages.join("\n")).toContain("AMAP_JS_API_KEY");
    expect(messages.join("\n")).toContain("Open-Meteo");
    for (const value of [
      "never-log-me",
      "https://private-host",
      "private-model",
    ])
      expect(messages.join("\n")).not.toContain(value);
    expect(
      configurationMessages({
        QWEATHER_API_HOST: "private",
        QWEATHER_JWT: "private-token",
      }).join("\n"),
    ).toContain("实际数据源仍需接口验证");
  });
  it("rejects a conflicted template before writing any local file", () => {
    const directory = fixture(
      "<<<<<<< HEAD\nAMAP_JS_API_KEY=\n=======\nQWEATHER_API_KEY=\n>>>>>>> branch\n",
    );
    expect(() => syncEnvFiles(directory, {})).toThrow("冲突");
    expect(existsSync(join(directory, ".env.local"))).toBe(false);
  });
});
