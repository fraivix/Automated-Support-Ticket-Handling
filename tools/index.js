import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadGmailConfig } from "./gmail.js";
import { loadGoogleSheetConfig } from "./sheets.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

function readEnvFile(envPath = path.join(PROJECT_ROOT, ".env")) {
  if (!fs.existsSync(envPath)) return {};

  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    env[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return env;
}

function main() {
  const env = readEnvFile();
  const runMode = env.RUN_MODE || "preview";
  const gmail = loadGmailConfig();
  const sheets = loadGoogleSheetConfig();
  const errors = [...gmail.errors, ...sheets.errors];

  console.log("Aussie Broadband support ticket workspace");
  console.log(`Run mode: ${runMode}`);
  console.log(`Gmail query: ${gmail.query || "missing"}`);
  console.log(`Google Sheet tab: ${sheets.sheetTab || "missing"}`);
  console.log("Ticket normalisation: implemented");
  console.log("Ticket validation: implemented");
  console.log("Sheet row mapping: implemented");
  console.log("Local runtime credentials: none");
  console.log("Codex Composio MCP: required for Gmail and Google Sheets operations");

  if (!["preview", "production"].includes(runMode)) {
    errors.push("RUN_MODE must be preview or production.");
  }

  if (runMode === "production") {
    errors.push("Production mode is intentionally not run automatically.");
  }

  if (runMode === "preview") {
    console.log("Preview mode: read-only; no Gmail state changes and no Google Sheets writes.");
  }

  if (errors.length) {
    for (const error of errors) console.error(error);
    process.exitCode = 1;
  }
}

main();
