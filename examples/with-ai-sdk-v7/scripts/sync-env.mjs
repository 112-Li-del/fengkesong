import {
  appendFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const developmentFiles = [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env",
];

function readVariables(contents) {
  return Object.fromEntries(
    Object.entries(parseEnv(contents)).map(([key, value]) => [
      key.replace(/^export\s+/, ""),
      value,
    ]),
  );
}

export function readDevelopmentEnv(directory, environment = process.env) {
  const values = { ...environment };
  for (const file of developmentFiles) {
    const path = join(directory, file);
    if (!existsSync(path)) continue;
    for (const [key, value] of Object.entries(
      readVariables(readFileSync(path, "utf8")),
    )) {
      if (values[key] === undefined) values[key] = value;
    }
  }
  return values;
}

export function syncEnvFiles(directory, environment = process.env) {
  const template = readFileSync(join(directory, ".env.example"), "utf8");
  if (/^(?:<<<<<<< |=======|>>>>>>> )/m.test(template))
    throw new Error("配置模板存在冲突标记，请先解决 .env.example 冲突。");
  const parsed = readVariables(template);
  const keys = [
    ...new Set(
      [...template.matchAll(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/gm)]
        .map((match) => match[1])
        .filter((key) => Object.hasOwn(parsed, key)),
    ),
  ];
  const values = readDevelopmentEnv(directory, environment);
  const added = keys.filter((key) => values[key] === undefined);
  if (!added.length) return { added };
  const localPath = join(directory, ".env.local");
  const newline =
    existsSync(localPath) && readFileSync(localPath, "utf8").includes("\r\n")
      ? "\r\n"
      : "\n";
  const block = [
    "",
    "# 从 .env.example 补齐的配置项；填写说明见该模板，填写后重启开发服务。",
    ...added.map((key) => key + "="),
    "",
  ].join(newline);
  if (existsSync(localPath)) appendFileSync(localPath, block);
  else writeFileSync(localPath, block, { flag: "wx", mode: 0o600 });
  return { added };
}

export function configurationMessages(values) {
  const filled = (key) => Boolean(values[key]?.trim());
  const missing = (keys) => keys.filter((key) => !filled(key)).join(", ");
  const modelKeys = ["OPENAI_API_KEY", "OPENAI_BASE_URL", "OPENAI_MODEL"];
  const legacyModel = !filled("OPENAI_API_KEY") && filled("DEEPSEEK_API_KEY");
  const modelMissing = missing(modelKeys);
  const mapMissing = missing(["AMAP_JS_API_KEY", "AMAP_JS_SECURITY_CODE"]);
  const weather =
    filled("QWEATHER_API_HOST") &&
    (filled("QWEATHER_API_KEY") || filled("QWEATHER_JWT"));
  return [
    "[配置] 聊天：" +
      (legacyModel
        ? "使用旧版 DEEPSEEK 配置"
        : modelMissing
          ? "待填写 " + modelMissing
          : "配置项已填写"),
    "[配置] 地图：" + (mapMissing ? "待填写 " + mapMissing : "配置项已填写"),
    "[配置] 地图助手查询：" +
      (filled("AMAP_WEB_SERVICE_KEY")
        ? "配置项已填写"
        : "待填写 AMAP_WEB_SERVICE_KEY"),
    "[配置] 和风天气：" +
      (weather
        ? "配置项已填写，实际数据源仍需接口验证"
        : "未配置完整，天气使用 Open-Meteo 备用源（不含和风分钟降水、生活指数）"),
    "[配置] 仅检查变量是否填写，不验证密钥、额度或接口权限；不输出配置值。",
  ];
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    if (!process.argv.includes("--check")) {
      const { added } = syncEnvFiles(projectDirectory);
      console.log(
        added.length
          ? "[配置] 已补齐空白配置项：" +
              added.join(", ") +
              "。已有配置保持原样，请自行填写新项目。"
          : "[配置] 配置项名称已齐全，未修改本地文件。",
      );
    }
    for (const message of configurationMessages(
      readDevelopmentEnv(projectDirectory),
    ))
      console.log(message);
  } catch {
    console.error(
      "[配置] 无法同步或读取配置，请检查 .env.example 是否存在、是否有冲突标记，以及 .env.local 的读写权限。",
    );
    process.exitCode = 1;
  }
}
