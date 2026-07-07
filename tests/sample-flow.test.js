import assert from "node:assert/strict";
import { validateTicket } from "../tools/parser.js";
import { ticketToSheetRow } from "../tools/sheets.js";
import { sampleTickets } from "./fixtures/sample-tickets.js";

const expectedOutcomes = Object.freeze({
  "business-critical outage": {
    productService: "Business Internet or Communications",
    issueCategory: "No Internet or Outage",
    priority: "High",
    status: "Escalated",
  },
  "slow speed/dropouts": {
    productService: "Home Internet",
    issueCategory: "Slow Speed or Dropouts",
    priority: "Normal",
    status: "New",
  },
  "duplicate billing charge": {
    productService: "Account and Billing",
    issueCategory: "Billing, Payment, or Invoice",
    priority: "Normal",
    status: "New",
  },
  "missed installation": {
    productService: "Home Internet",
    issueCategory: "Installation or Activation",
    priority: "Normal",
    status: "New",
  },
  "cancellation request": {
    productService: "Home Internet",
    issueCategory: "Cancellation or Account Closure",
    priority: "Normal",
    status: "Waiting for Customer",
  },
});

let passed = 0;

function test(name, fn) {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

function combinedText(ticket) {
  return [
    ticket.orderAccountReference,
    ticket.issueSummary,
    ticket.suggestedNextAction,
    ticket.suggestedReply,
  ].join("\n");
}

test("all five sample fixtures produce valid rows and expected outcomes", () => {
  assert.equal(sampleTickets.length, 5);

  for (const fixture of sampleTickets) {
    const validation = validateTicket(fixture.ticket);
    assert.equal(validation.valid, true, fixture.name);
    assert.equal(ticketToSheetRow(fixture.ticket).length, 13, fixture.name);

    const expected = expectedOutcomes[fixture.name];
    assert.equal(fixture.ticket.productService, expected.productService, fixture.name);
    assert.equal(fixture.ticket.issueCategory, expected.issueCategory, fixture.name);
    assert.equal(fixture.ticket.priority, expected.priority, fixture.name);
    assert.equal(fixture.ticket.status, expected.status, fixture.name);
  }
});

test("fixtures do not promise refunds", () => {
  for (const { name, ticket } of sampleTickets) {
    assert.doesNotMatch(combinedText(ticket), /\b(refund|credit|reversal).*\b(will|approved|guaranteed|processed)\b/i, name);
  }
});

test("fixtures do not guarantee technician dates", () => {
  for (const { name, ticket } of sampleTickets) {
    assert.doesNotMatch(combinedText(ticket), /\b(guaranteed|confirmed)\b.*\b(technician|appointment|date|time)\b/i, name);
  }
});

test("cancellation fixture requires primary-account-holder verification and 2FA", () => {
  const cancellation = sampleTickets.find((fixture) => fixture.name === "cancellation request").ticket;
  assert.match(combinedText(cancellation), /primary account holder|primary-account-holder/i);
  assert.match(combinedText(cancellation), /2FA/i);
});

test("fixtures do not invent account numbers", () => {
  for (const { name, ticket } of sampleTickets) {
    assert.doesNotMatch(combinedText(ticket), /\b(ABB|ACC|INV)-\d{4,}\b/i, name);
  }
});

console.log(`${passed} sample flow tests passed`);
