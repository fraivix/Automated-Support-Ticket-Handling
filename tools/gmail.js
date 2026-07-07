import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
export const DEFAULT_GMAIL_QUERY = "newer_than:7d";

export async function fetchGmailMessages() {
  throw new Error("Gmail MCP retrieval is not implemented inside the local Node runtime yet.");
}

export function normaliseGmailMessage(message, threadMessages = []) {
  const headers = headersByName(message?.payload?.headers || []);
  const sender = parseSender(message?.sender || header(headers, "from"));

  return {
    messageId: String(message?.messageId || message?.id || ""),
    threadId: String(message?.threadId || ""),
    senderName: sender.name,
    senderEmail: sender.email,
    subject: String(message?.subject || header(headers, "subject") || "No Subject"),
    receivedDate: normaliseDate(message?.messageTimestamp || message?.internalDate || header(headers, "date")),
    fullBody: cleanBody(message?.messageText || decodePayloadBody(message?.payload)),
    threadContext: normaliseThreadContext(threadMessages),
    attachments: normaliseAttachments(message?.attachmentList || collectAttachments(message?.payload)),
  };
}

export function loadGmailConfig(envPath = path.join(PROJECT_ROOT, ".env")) {
  const env = readEnvFile(envPath);
  const query = (env.GMAIL_QUERY || "").trim();
  const errors = [];

  if (!query) errors.push("GMAIL_QUERY is required.");
  if (query && query !== DEFAULT_GMAIL_QUERY) {
    errors.push(`GMAIL_QUERY must be exactly ${DEFAULT_GMAIL_QUERY}.`);
  }

  return {
    query,
    errors,
  };
}

function normaliseThreadContext(messages) {
  if (!Array.isArray(messages)) return "";
  return messages
    .map((message) => {
      const normalised = normaliseGmailMessage(message, []);
      return [
        `[${normalised.receivedDate || "Unknown date"}]`,
        normalised.senderEmail || normalised.senderName || "Unknown sender",
        normalised.fullBody,
      ].join(" ").trim();
    })
    .filter(Boolean)
    .join("\n\n");
}

function headersByName(headers) {
  const map = new Map();
  for (const item of headers) {
    if (item?.name) map.set(item.name.toLowerCase(), item.value || "");
  }
  return map;
}

function header(headers, name) {
  return headers.get(name.toLowerCase()) || "";
}

function parseSender(value) {
  const input = String(value || "").trim();
  const match = input.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) {
    return {
      name: match[1].replace(/^["']|["']$/g, "").trim(),
      email: match[2].trim().toLowerCase(),
    };
  }

  const email = input.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
  return {
    name: email ? input.replace(email, "").trim() : input,
    email: email.toLowerCase(),
  };
}

function normaliseDate(value) {
  const number = Number(value);
  const date = Number.isFinite(number) && number > 0 ? new Date(number) : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function decodePayloadBody(payload) {
  if (!payload || typeof payload !== "object") return "";
  const plain = findBodyPart(payload, "text/plain");
  const html = findBodyPart(payload, "text/html");
  return decodeBase64Url(plain?.body?.data || html?.body?.data || payload.body?.data || "");
}

function findBodyPart(part, mimeType) {
  if (!part || typeof part !== "object") return null;
  if (part.mimeType === mimeType && part.body?.data) return part;
  for (const child of part.parts || []) {
    const found = findBodyPart(child, mimeType);
    if (found) return found;
  }
  return null;
}

function decodeBase64Url(value) {
  if (!value) return "";
  const base64 = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return Buffer.from(padded, "base64").toString("utf8");
}

function collectAttachments(part, attachments = []) {
  if (!part || typeof part !== "object") return attachments;
  if (part.filename && part.body?.attachmentId) {
    attachments.push({
      filename: part.filename,
      mimeType: part.mimeType || "",
      attachmentId: part.body.attachmentId,
      size: part.body.size || 0,
    });
  }
  for (const child of part.parts || []) collectAttachments(child, attachments);
  return attachments;
}

function normaliseAttachments(attachments) {
  if (!Array.isArray(attachments)) return [];
  return attachments.map((attachment) => ({
    filename: attachment.filename || attachment.name || "",
    mimeType: attachment.mimeType || attachment.mime_type || "",
    attachmentId: attachment.attachmentId || attachment.attachment_id || attachment.id || "",
    size: attachment.size || 0,
  }));
}

function cleanBody(value) {
  return String(value || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function readEnvFile(envPath) {
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

function runConnectionTest() {
  const config = loadGmailConfig();

  console.log("Gmail read-only connection check");
  console.log(`GMAIL_QUERY: ${config.query || "missing"}`);
  console.log("Read/unread scope: both");
  console.log("Total retrieval limit: none");
  console.log("External Gmail read: use Codex Composio MCP");

  if (config.errors.length) {
    for (const error of config.errors) console.error(error);
    process.exitCode = 1;
  }
}

if (process.argv.includes("--test-connection")) {
  runConnectionTest();
}
