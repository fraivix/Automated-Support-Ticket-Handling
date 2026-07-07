import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normaliseTicket, TICKET_FIELDS, validateTicket } from "./parser.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");

export const SHEET_HEADERS = Object.freeze([
  "Received Date",
  "Customer Name",
  "Customer Email",
  "Email Subject",
  "Product / Service",
  "Issue Category",
  "Priority",
  "Sentiment",
  "Order / Account Reference",
  "Issue Summary",
  "Suggested Next Action",
  "Suggested Reply",
  "Status",
]);

export function validateTicketHeaders(headers) {
  const errors = [];

  if (!Array.isArray(headers)) {
    return {
      valid: false,
      errors: [{ index: null, message: "Headers must be an array" }],
    };
  }

  if (headers.length !== SHEET_HEADERS.length) {
    errors.push({
      index: null,
      message: `Expected ${SHEET_HEADERS.length} headers but received ${headers.length}`,
    });
  }

  const maxLength = Math.max(headers.length, SHEET_HEADERS.length);
  for (let index = 0; index < maxLength; index += 1) {
    const expected = SHEET_HEADERS[index];
    const actual = headers[index];
    if (actual !== expected) {
      errors.push({
        index,
        expected,
        actual,
        message: `Header ${index + 1} must be ${expected ?? "absent"}`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function ticketToSheetRow(ticket) {
  const validation = validateTicket(ticket);
  if (!validation.valid) {
    throw new Error(`Invalid ticket: ${validation.errors.map((error) => `${error.field}: ${error.message}`).join("; ")}`);
  }

  if (validation.ticket.shouldProcess !== true) {
    throw new Error("Skipped tickets cannot be mapped to a sheet row.");
  }

  return TICKET_FIELDS.map((field) => validation.ticket[field]);
}

export function normaliseDuplicateValue(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

export function createFallbackDuplicateKey(ticket) {
  const normalised = normaliseTicket(ticket);
  return [
    normalised.customerEmail,
    normalised.emailSubject,
    normalised.receivedDate,
    normalised.issueSummary,
  ].map(normaliseDuplicateValue).join("|");
}

export function isDuplicateTicket(ticket, existingTickets) {
  if (!Array.isArray(existingTickets)) return false;

  const targetKey = createFallbackDuplicateKey(ticket);
  return existingTickets.some((existingTicket) => (
    createFallbackDuplicateKey(existingTicket) === targetKey
  ));
}

export async function writeTicketToSheet() {
  throw new Error("Google Sheets integration is not implemented yet.");
}

export function loadGoogleSheetConfig(envPath = path.join(PROJECT_ROOT, ".env")) {
  const env = readEnvFile(envPath);
  const sheetId = env.GOOGLE_SHEET_ID || "";
  const sheetTab = env.GOOGLE_SHEET_TAB || "";
  const errors = [];

  if (!sheetId.trim()) errors.push("GOOGLE_SHEET_ID is required.");
  if (!sheetTab.trim()) errors.push("GOOGLE_SHEET_TAB is required.");

  return {
    sheetId: sheetId.trim(),
    sheetTab: sheetTab.trim(),
    errors,
  };
}

function readEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};

  const env = {};
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    env[key] = value;
  }
  return env;
}

function runConnectionTest() {
  const config = loadGoogleSheetConfig();
  const headerValidation = validateTicketHeaders(SHEET_HEADERS);

  console.log("Google Sheets read-only connection check");
  console.log(`GOOGLE_SHEET_ID configured: ${config.sheetId ? "yes" : "no"}`);
  console.log(`GOOGLE_SHEET_TAB: ${config.sheetTab || "missing"}`);
  console.log(`Expected header count: ${SHEET_HEADERS.length}`);
  console.log(`Local header contract: ${headerValidation.valid ? "valid" : "invalid"}`);
  console.log("External spreadsheet read: use Codex Composio MCP");

  if (config.errors.length || !headerValidation.valid) {
    for (const error of config.errors) console.error(error);
    for (const error of headerValidation.errors) console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv.includes("--test-connection")) {
  runConnectionTest();
}
