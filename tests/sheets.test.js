import assert from "node:assert/strict";
import { validateTicket } from "../tools/parser.js";
import {
  createFallbackDuplicateKey,
  isDuplicateTicket,
  normaliseDuplicateValue,
  SHEET_HEADERS,
  ticketToSheetRow,
  validateTicketHeaders,
} from "../tools/sheets.js";
import { sampleTickets } from "./fixtures/sample-tickets.js";

const ticket = sampleTickets[0].ticket;

let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

test("exact headers are valid", () => {
  assert.equal(validateTicketHeaders([...SHEET_HEADERS]).valid, true);
});

test("missing headers are invalid", () => {
  const result = validateTicketHeaders(SHEET_HEADERS.slice(0, 12));
  assert.equal(result.valid, false);
});

test("extra headers are invalid", () => {
  const result = validateTicketHeaders([...SHEET_HEADERS, "Message ID"]);
  assert.equal(result.valid, false);
});

test("changed headers are invalid", () => {
  const headers = [...SHEET_HEADERS];
  headers[2] = "Email";
  const result = validateTicketHeaders(headers);
  assert.equal(result.valid, false);
});

test("ticket maps to exactly 13 cells in documented order", () => {
  const row = ticketToSheetRow(ticket);
  assert.equal(row.length, 13);
  assert.deepEqual(row, [
    ticket.receivedDate,
    ticket.customerName,
    ticket.customerEmail,
    ticket.emailSubject,
    ticket.productService,
    ticket.issueCategory,
    ticket.priority,
    ticket.sentiment,
    ticket.orderAccountReference,
    ticket.issueSummary,
    ticket.suggestedNextAction,
    ticket.suggestedReply,
    ticket.status,
  ]);
});

test("reply line breaks are preserved", () => {
  const row = ticketToSheetRow(ticket);
  assert.ok(row[11].includes("\n\n"));
});

test("invalid tickets are rejected", () => {
  assert.throws(
    () => ticketToSheetRow({ ...ticket, priority: "Critical" }),
    /Invalid ticket:/,
  );
});

test("skipped tickets are rejected", () => {
  assert.throws(
    () => ticketToSheetRow({ shouldProcess: false, skipReason: "Not support." }),
    /Skipped tickets cannot be mapped/,
  );
});

test("duplicate values are normalised", () => {
  assert.equal(normaliseDuplicateValue("  A\nB\tC  "), "a b c");
});

test("duplicate keys use fallback fields", () => {
  assert.equal(
    createFallbackDuplicateKey(ticket),
    [
      ticket.customerEmail,
      ticket.emailSubject,
      ticket.receivedDate,
      ticket.issueSummary,
    ].map(normaliseDuplicateValue).join("|"),
  );
});

test("duplicate tickets are detected", () => {
  const existing = [{ ...ticket, customerName: "Different Display Name" }];
  assert.equal(isDuplicateTicket(ticket, existing), true);
});

test("same sender alone is not a duplicate", () => {
  const existing = [{
    ...ticket,
    emailSubject: "Different issue",
    receivedDate: "2026-07-07T08:15:00+10:00",
    issueSummary: "A different support issue from the same sender.",
  }];
  assert.equal(isDuplicateTicket(ticket, existing), false);
});

test("all fixture tickets validate before row mapping", () => {
  for (const fixture of sampleTickets) {
    assert.equal(validateTicket(fixture.ticket).valid, true, fixture.name);
    assert.equal(ticketToSheetRow(fixture.ticket).length, 13, fixture.name);
  }
});

console.log(`${passed} sheets tests passed`);
