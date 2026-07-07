import assert from "node:assert/strict";
import {
  normaliseTicket,
  parseSupportEmail,
  validateTicket,
} from "../tools/parser.js";

const validTicket = Object.freeze({
  shouldProcess: true,
  skipReason: null,
  receivedDate: "2026-07-06T08:15:00+10:00",
  customerName: "Priya Nair",
  customerEmail: "priya.nair@harbourlegal.com.au",
  emailSubject: "No internet at our office since this morning",
  productService: "Business Internet or Communications",
  issueCategory: "No Internet or Outage",
  priority: "High",
  sentiment: "Frustrated",
  orderAccountReference: "ABB-482917",
  issueSummary:
    "The office internet has been completely unavailable since approximately 8:15 am, affecting 14 staff and access to cloud phones and client files.",
  suggestedNextAction:
    "Check for a known outage, verify the business service status, and escalate for urgent technical review if no outage is recorded.",
  suggestedReply:
    "Hi Priya,\n\nThank you for letting us know. We understand that the outage is affecting your team's access to cloud phones and client files. We'll first check for a known outage and verify the service status. If no outage is recorded, the service should be escalated for urgent technical review.\n\nKind regards,\nSupport Team",
  status: "Escalated",
});

function cloneTicket(overrides = {}) {
  return { ...validTicket, ...overrides };
}

function errorFields(result) {
  return result.errors.map((error) => error.field);
}

let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

test("valid processed support ticket", () => {
  const result = validateTicket(cloneTicket());
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.ticket.customerEmail, validTicket.customerEmail);
});

test("valid skipped email", () => {
  const result = validateTicket({
    shouldProcess: false,
    skipReason: "Newsletter with no customer support request.",
  });
  assert.equal(result.valid, true);
  assert.equal(result.ticket.shouldProcess, false);
});

test("missing required field", () => {
  const ticket = cloneTicket();
  delete ticket.issueSummary;
  const result = validateTicket(ticket);
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("issueSummary"));
});

test("invalid Product / Service value", () => {
  const result = validateTicket(cloneTicket({ productService: "Business Fibre" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("productService"));
});

test("invalid Issue Category", () => {
  const result = validateTicket(cloneTicket({ issueCategory: "Office Outage" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("issueCategory"));
});

test("invalid Priority", () => {
  const result = validateTicket(cloneTicket({ priority: "Urgent" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("priority"));
});

test("invalid Sentiment", () => {
  const result = validateTicket(cloneTicket({ sentiment: "Annoyed" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("sentiment"));
});

test("invalid Status", () => {
  const result = validateTicket(cloneTicket({ status: "Queued" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("status"));
});

test("invalid customer email", () => {
  const result = validateTicket(cloneTicket({ customerEmail: "not-an-email" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("customerEmail"));
});

test("invalid received date", () => {
  const result = validateTicket(cloneTicket({ receivedDate: "not-a-date" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("receivedDate"));
});

test("multiple validation errors returned together", () => {
  const result = validateTicket(cloneTicket({
    customerEmail: "invalid",
    receivedDate: "invalid",
    productService: "Other",
    priority: "Critical",
  }));
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 4);
  assert.ok(errorFields(result).includes("customerEmail"));
  assert.ok(errorFields(result).includes("receivedDate"));
  assert.ok(errorFields(result).includes("productService"));
  assert.ok(errorFields(result).includes("priority"));
});

test("safe fallback values", () => {
  const result = validateTicket(cloneTicket({
    customerName: " ",
    emailSubject: "",
    orderAccountReference: undefined,
  }));
  assert.equal(result.valid, true);
  assert.equal(result.ticket.customerName, "Unknown Customer");
  assert.equal(result.ticket.emailSubject, "No Subject");
  assert.equal(result.ticket.orderAccountReference, "Not provided");
});

test("unexpected fields are rejected", () => {
  const result = validateTicket(cloneTicket({ messageId: "gmail-message-id" }));
  assert.equal(result.valid, false);
  assert.ok(errorFields(result).includes("messageId"));
});

test("normalisation trims and preserves meaningful reply line breaks", () => {
  const normalised = normaliseTicket(cloneTicket({
    customerName: "  Priya   Nair  ",
    suggestedReply: "  Hi Priya,  \n\n\n  Thanks   for writing.  ",
  }));
  assert.equal(normalised.customerName, "Priya Nair");
  assert.equal(normalised.suggestedReply, "Hi Priya,\n\nThanks for writing.");
});

test("live AI parsing placeholder throws clearly", async () => {
  await assert.rejects(
    () => parseSupportEmail({}),
    /Live AI parsing is not implemented yet\./,
  );
});

console.log(`${passed} parser tests passed`);
