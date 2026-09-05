// PostToolUse hook (see .claude/settings.json): run `ultracite fix` (Biome)
// on the file Claude just wrote. It never fails the tool call — lint output
// is informational. Vendored dirs (.agents, .claude) are skipped.
import { spawnSync } from "node:child_process";
import { isAbsolute, relative } from "node:path";

let input = "";
for await (const chunk of process.stdin) {
  input += chunk;
}

let filePath;
try {
  filePath = JSON.parse(input).tool_input?.file_path;
} catch {
  process.exit(0);
}
if (typeof filePath !== "string") {
  process.exit(0);
}

const rel = relative(process.cwd(), filePath).replaceAll("\\", "/");
const outsideRepo = rel.startsWith("..") || isAbsolute(rel);
const vendored = /^(\.agents|\.claude|node_modules)\//.test(rel);
const lintable = /\.(m?[jt]sx?|css|json|md|ya?ml)$/.test(rel);
if (outsideRepo || vendored || !lintable) {
  process.exit(0);
}

spawnSync(`pnpm exec ultracite fix "${rel}"`, { shell: true, stdio: "inherit" });
process.exit(0);
