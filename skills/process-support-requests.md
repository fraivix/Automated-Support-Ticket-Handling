# Process Support Requests

Use this skill to run the end-to-end support ticket workflow.

## Workflow

1. Use `gmail-support.md` to retrieve and normalise all Gmail messages within the configured scope.
2. Send each full email and relevant thread context to the AI.
3. Use `ticket-schema.md` to decide whether the email should be processed or skipped and to apply business rules, company policies, priority, escalation, verification, status, and reply boundaries.
4. For valid requests, return one structured ticket.
5. Use `google-sheets.md` to validate the 13 fields, check duplicates, append new tickets to the `Tickets` sheet, and apply sheet formatting.
6. Continue safely when one message fails.
7. Return a short summary: fetched, processed, skipped, written, duplicates, and failed.

## Rules

- Include both read and unread emails unless the user specifies otherwise.
- For each thread, analyse the newest customer-written message and use older messages only as context.
- Create one ticket per thread unless separate issues clearly require different handling.
- Utility code must only retrieve, normalise, validate, and move data; the AI applies `ticket-schema.md` to interpret customer language.
- Do not send replies or make account changes automatically.
- Require human review before refunds, credits, compensation, cancellations, account changes, complaint outcomes, hardship decisions, or privacy and security actions.
- If one step fails, report the error clearly and continue processing other messages when safe.

