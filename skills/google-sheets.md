# Google Sheets

Validate, deduplicate, write, format, and verify support tickets in the `Tickets` sheet.

## Scope

This skill handles Google Sheets only.

It must not interpret emails or change AI-generated ticket decisions.

## Columns

Use exactly these 13 visible columns:

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

Do not add visible Gmail IDs, internal keys, notes, or processing columns.

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
4. Check duplicates.
5. Append or update safely.
6. Apply formatting and dropdowns.
7. Re-read and verify the result.
8. Return `written`, `duplicate`, `updated`, or `failed`.

The workflow is complete only after data and formatting verification pass.

## Duplicate Rules

Use Gmail Message ID as the primary duplicate key.

Use Thread ID only to connect follow-up messages.

A new message in an existing thread is not automatically a duplicate.

If Gmail IDs are unavailable, compare:

- Customer Email
- Email Subject
- Received Date
- Issue Summary

Normalise casing and whitespace.

Do not use only the sender or subject.

## Ranges

- Header: `A1:M1`
- Data: `A2:M`
- Product / Service: `E2:E`
- Issue Category: `F2:F`
- Priority: `G2:G`
- Sentiment: `H2:H`
- Status: `M2:M`

## Formatting

### Header

Apply to `A1:M1`:

- bold text;
- light background;
- wrapped text;
- vertical centre alignment;
- readable row height;
- filter enabled;
- row 1 frozen.

### Data

Apply to populated cells in `A2:M`:

- regular font weight;
- white background;
- top alignment;
- wrapped text;
- readable row height;
- no full-row colour;
- no inherited header fill.

Keep short columns compact.

Make these columns wider:

- Issue Summary
- Suggested Next Action
- Suggested Reply

Preserve the original Gmail timestamp and use one consistent date format.

## Borders

Apply thin, light-grey horizontal and vertical borders to:

`A1:M[last populated row]`

Do not use thick, dark, double, or decorative borders.

Do not format large empty areas.

## Dropdowns

Add exact-value dropdowns to:

- `E2:E` Product / Service
- `F2:F` Issue Category
- `G2:G` Priority
- `H2:H` Sentiment
- `M2:M` Status

Reject invalid values when supported.

Do not silently replace invalid values.

## Conditional Colours

Apply colour only to the controlled cell.

### Priority

- High = light red
- Normal = light yellow or orange
- Low = light green

### Sentiment

- Angry, Frustrated, Distressed = light red
- Confused = light yellow
- Neutral = light grey
- Positive = light green

### Status

- Escalated = light red
- Waiting for Customer = light yellow
- In Progress = light blue
- New = light grey
- Resolved = light green

All other data cells must remain white.

## Verification

After writing and formatting, confirm:

- the `Tickets` tab exists;
- all 13 headers are unchanged and correctly ordered;
- every row contains 13 values;
- the header is bold;
- data rows are not bold;
- row 1 is frozen;
- filters are enabled;
- all populated cells have thin borders;
- dropdowns exist in `E`, `F`, `G`, `H`, and `M`;
- non-controlled cells are white;
- no full-row colour remains;
- colours appear only in `G`, `H`, and `M`;
- no ticket value changed;
- no test row remains.

Return a short summary:

- Write result
- Rows added or updated
- Header validation
- Borders
- Dropdowns
- Conditional formatting
- Frozen row
- Filters
- Content preserved

## Tool Limitations

If a formatting feature is unsupported:

- do not silently skip it;
- preserve and write valid ticket data safely;
- report the exact unsupported feature;
- do not claim full formatting success;
- recommend applying the missing formatting manually.

## Rules

- Do not interpret customer language.
- Do not change AI-generated decisions.
- Do not invent or rewrite ticket content.
- Do not add, remove, rename, or reorder columns.
- Reject missing fields or invalid controlled values.
- Do not overwrite existing rows during formatting.
- Keep Gmail Message ID and Thread ID internal.
- Remove test rows from production.
- Formatting must not change ticket meaning.
- A successful write without verification is only a partial success.
