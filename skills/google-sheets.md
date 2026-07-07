# Google Sheets

Use this skill to validate, deduplicate, write, format, and verify support tickets in the `Tickets` sheet.

## Purpose

This skill handles Google Sheets only. It must not interpret customer language or change AI decisions.

Its responsibilities are to validate the sheet, check duplicates, map ticket data, write rows safely, apply formatting and dropdowns, and verify the result.

## Columns

Use exactly these 13 visible columns, in this order:

1. Received Date
2. Customer Name
3. Customer Email
4. Email Subject
5. Product / Service
6. Issue Category
7. Priority
8. Sentiment
9. Order / Account Reference
10. Issue Summary
11. Suggested Next Action
12. Suggested Reply
13. Status

Do not add visible Gmail Message ID, Thread ID, internal ticket key, notes, or processing columns.

## Allowed Values

### Product / Service

- Home Internet
- Mobile or Mobile Broadband
- Modem or Hardware
- Home Phone or VoIP
- Business Internet or Communications
- Enterprise or Wholesale Services
- Account and Billing
- Other Aussie Broadband Service

### Issue Category

- No Internet or Outage
- Slow Speed or Dropouts
- Wi-Fi, Modem, or Hardware
- Installation or Activation
- Mobile, SIM, Data, or Roaming
- Billing, Payment, or Invoice
- Plan Change or Relocation
- Cancellation or Account Closure
- Phone, VoIP, or Porting
- Account, Portal, or Authorisation
- Refund, Credit, or Compensation
- Financial Hardship
- Complaint or Negative Feedback
- Privacy or Security
- General Product Question
- Other Support

### Priority

- High
- Normal
- Low

### Sentiment

- Positive
- Neutral
- Confused
- Frustrated
- Distressed
- Angry

### Status

- New
- Waiting for Customer
- Escalated
- In Progress
- Resolved

## Workflow

1. Confirm the `Tickets` sheet exists.
2. Read and validate the exact 13-column header.
3. Validate all required ticket fields and controlled values.
4. Check whether the exact Gmail message has already been written.
5. Treat a new message in an existing thread as a follow-up, not an automatic duplicate.
6. Append or update the ticket safely.
7. Apply all required formatting and dropdown validation.
8. Re-read the sheet and verify the result.
9. Return `written`, `duplicate`, `updated`, or `failed`.

The workflow is not complete until both the data write and formatting verification have passed.

## Duplicate Checking

Use Gmail Message ID as the primary duplicate key.

Use Thread ID only to connect related follow-up messages.

If Gmail identifiers are unavailable, compare:

- Customer Email
- Email Subject
- Received Date
- Issue Summary

Normalise whitespace and casing before comparison.

Do not use only the sender or subject as a duplicate rule.

## Sheet Ranges

- Header: `A1:M1`
- Data: `A2:M`
- Product / Service: `E2:E`
- Issue Category: `F2:F`
- Priority: `G2:G`
- Sentiment: `H2:H`
- Status: `M2:M`

Apply formatting to populated rows where possible.

## Required Formatting

### Header

Apply to `A1:M1`:

- bold text;
- clean light background;
- wrapped text;
- centred vertically;
- readable row height;
- filter enabled;
- row 1 frozen.

### Data Rows

Apply to populated rows in `A2:M`:

- regular font weight;
- clean white background;
- top alignment;
- wrapped text;
- readable row height;
- light borders;
- no full-row colour;
- no inherited header fill;
- no bold data rows.

Do not change ticket values while formatting.

### Column Widths

Keep short fields compact and make long-text columns wider.

Long-text columns include:

- Issue Summary
- Suggested Next Action
- Suggested Reply

Text must wrap instead of being cut off.

### Date Formatting

Use one consistent date and time format.

Do not replace the original Gmail timestamp with the current time.


## Background Colour Rules

Use a clean white background for all populated data cells in `A2:M`.

Only the header row `A1:M1` may use a light background colour.

Do not apply a full-row background colour to ticket rows.

Conditional colours may appear only in:

- Priority column `G`
- Sentiment column `H`
- Status column `M`

All other populated data cells must remain white.

After formatting, verify that:

- no populated data row has a full-row fill colour;
- all non-controlled data cells use a white background;
- only `G`, `H`, and `M` contain conditional colours;
- formatting did not change any ticket value.


## Table Borders

Apply thin, light borders to every populated cell in the ticket table.

Use borders across the populated range from `A1:M[last populated row]`.

Requirements:

- use thin, light-grey borders;
- include both horizontal and vertical borders;
- keep borders consistent across the header and data rows;
- do not use thick, dark, double, or decorative borders;
- do not apply borders to large empty areas outside the populated table;
- preserve all ticket values and existing dropdowns.

The goal is to make each row and column easy to scan while keeping the sheet clean.

After formatting, verify that:

- every populated cell has a visible border;
- both row and column boundaries are visible;
- no populated data cell is missing a border;
- no heavy or decorative border was added;
- no ticket value changed.

## Required Dropdown Validation

Add dropdowns using the exact allowed values.

- `E2:E` Product / Service
- `F2:F` Issue Category
- `G2:G` Priority
- `H2:H` Sentiment
- `M2:M` Status

Reject invalid values when strict validation is supported.

Do not silently replace invalid values.

## Conditional Formatting

Apply colour only to the controlled cell, not the entire row.

### Priority

- High = light red
- Normal = light yellow or orange
- Low = light green

### Sentiment

- Angry = light red
- Frustrated = light red
- Distressed = light red
- Confused = light yellow
- Neutral = light grey
- Positive = light green

### Status

- Escalated = light red
- Waiting for Customer = light yellow
- In Progress = light blue
- New = light grey
- Resolved = light green
```

## Tool Limitations

If the available Google Sheets tool cannot apply a required feature, do not silently skip it.

Report the limitation clearly.

When formatting actions are unsupported:

- still write the ticket data safely;
- preserve all existing rows;
- report exactly which formatting actions were not completed;
- recommend applying the missing formatting manually once in Google Sheets;
- do not claim the sheet is fully formatted.

## Rules

- Do not interpret customer language.
- Do not change Product / Service, Issue Category, Priority, Sentiment, Summary, Next Action, Suggested Reply, or Status.
- Do not invent or rewrite ticket content.
- Do not add, remove, rename, or reorder visible columns.
- Reject rows with missing required data or invalid controlled values.
- Do not overwrite existing rows during setup or formatting.
- Preserve all existing ticket content.
- Integration tests must not remain in the production `Tickets` sheet.
- Gmail Message ID and Thread ID must remain internal.
- Formatting must never change ticket meaning.
- A successful data write without formatting verification is only a partial success.
