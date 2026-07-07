# Google Sheets

Use this skill to validate, deduplicate, write, format, and verify support tickets in the `Tickets` sheet.

## Scope

This skill handles Google Sheets only.

It must not interpret customer language or change AI decisions.

It may:

- validate the sheet structure;
- validate controlled values;
- check duplicates;
- map ticket data;
- append or update rows safely;
- apply formatting and dropdowns;
- verify the final result.

## Columns

Use exactly these 13 visible columns in this order:

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

Do not add visible Gmail Message ID, Thread ID, notes, internal keys, or processing columns.

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

1. Confirm the `Tickets` tab exists.
2. Validate the exact 13-column header.
3. Validate required fields and controlled values.
4. Check whether the Gmail message already exists.
5. Treat a new message in an existing thread as a follow-up, not an automatic duplicate.
6. Append or update the ticket safely.
7. Apply formatting and dropdown validation.
8. Re-read and verify the sheet.
9. Return `written`, `duplicate`, `updated`, or `failed`.

The workflow is complete only after both data and formatting verification pass.

## Duplicate Checking

Use Gmail Message ID as the primary duplicate key.

Use Thread ID only to connect related follow-up messages.

If Gmail identifiers are unavailable, compare:

- Customer Email
- Email Subject
- Received Date
- Issue Summary

Normalise casing and whitespace before comparison.

Do not use only the sender or subject as a duplicate rule.

## Ranges

- Header: `A1:M1`
- Data: `A2:M`
- Product / Service: `E2:E`
- Issue Category: `F2:F`
- Priority: `G2:G`
- Sentiment: `H2:H`
- Status: `M2:M`

Apply formatting only to populated rows where possible.

## Formatting

### Header

Apply to `A1:M1`:

- bold text;
- light background;
- wrapped text;
- centred vertical alignment;
- readable row height;
- filter enabled;
- row 1 frozen.

### Data Rows

Apply to populated cells in `A2:M`:

- regular font weight;
- white background;
- top alignment;
- wrapped text;
- readable row height;
- no full-row colour;
- no inherited header fill;
- no bold data rows.

Do not change ticket values while formatting.

### Column Widths

Keep short fields compact.

Make these columns wider:

- Issue Summary
- Suggested Next Action
- Suggested Reply

Text must wrap instead of being cut off.

### Date Format

Use one consistent date and time format.

Preserve the original Gmail timestamp.

Do not replace it with the current time.

## Background Colours

Use white for all populated data cells in `A2:M`.

Only `A1:M1` may use a header background.

Conditional colours may appear only in:

- Priority `G`
- Sentiment `H`
- Status `M`

Do not colour entire ticket rows.

## Table Borders

Apply thin, light-grey borders to `A1:M[last populated row]`.

Requirements:

- include horizontal and vertical borders;
- keep borders consistent;
- do not use thick, dark, double, or decorative borders;
- do not format large empty areas;
- preserve all values and dropdowns.

## Dropdown Validation

Add dropdowns using the exact allowed values:

- `E2:E` Product / Service
- `F2:F` Issue Category
- `G2:G` Priority
- `H2:H` Sentiment
- `M2:M` Status

Reject invalid values when strict validation is supported.

Do not silently replace invalid values.

## Conditional Formatting

Apply colour only to the controlled cell.

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

## Verification

After writing and formatting, re-read the sheet and confirm:

- the `Tickets` tab exists;
- all 13 headers are unchanged and in the correct order;
- every written row contains 13 values;
- data rows are regular, not bold;
- the header is bold;
- row 1 is frozen;
- filters are enabled;
- every populated cell has thin borders;
- horizontal and vertical lines are visible;
- dropdowns exist in `E`, `F`, `G`, `H`, and `M`;
- non-controlled data cells are white;
- no full-row colour remains;
- conditional colours appear only in `G`, `H`, and `M`;
- no ticket value changed;
- no production test row remains.

Return a short summary:

- Write result: written
- Rows added: 8
- Header validation: passed
- Borders: passed
- Dropdowns: passed
- Conditional formatting: passed
- Frozen row: passed
- Filters: passed
- Content preserved: passed

## Tool Limitations

If a Google Sheets action is unsupported:

- do not silently skip it;
- write the ticket data safely;
- preserve all existing rows;
- report the unsupported feature;
- do not claim the sheet is fully formatted;
- recommend applying the missing formatting manually.

## Rules

- Do not interpret customer language.
- Do not change AI-generated ticket decisions.
- Do not invent or rewrite ticket content.
- Do not add, remove, rename, or reorder visible columns.
- Reject missing fields or invalid controlled values.
- Do not overwrite existing rows during formatting.
- Preserve all existing ticket content.
- Keep Gmail Message ID and Thread ID internal.
- Remove integration test rows from production.
- Formatting must never change ticket meaning.
- A successful write without verification is only a partial success.
