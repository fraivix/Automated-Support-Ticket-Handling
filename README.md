# Aussie Broadband Support Ticket Workspace

Turn Gmail support emails into categorised, prioritised, and clearly structured Google Sheets tickets for faster decision-making and human review. The workflow runs through Codex, while Composio MCP connects Gmail and Google Sheets.

## What's in here

```text
workspace/
├── skills/                         What the agent knows how to do
│   ├── gmail-support.md                Retrieve and normalise Gmail messages
│   ├── google-sheets.md                Validate, write, format, and verify tickets
│   └── process-support-requests.md     Run the complete support workflow
├── tools/                          Local validation and workflow helpers
│   ├── gmail.js                        Gmail message normalisation helpers
│   ├── parser.js                       Ticket parsing and validation
│   ├── sheets.js                       Row mapping and duplicate checks
│   └── index.js                        Local workflow coordination
├── tests/                          Local tests
│   ├── fixtures/
│   ├── parser.test.js
│   ├── sheets.test.js
│   └── sample-flow.test.js
├── sample-emails/                  Realistic support examples
├── 1-research.md                   Company and policy research
├── 2-ticket-schema.md              Business decision rules
├── 3-deliverable.md                Client-facing project summary
├── package.json
├── .env
└── README.md
```

## Quick start

1. Create a local `.env` file:

```env
   GOOGLE\\\_SHEET\\\_ID=your\\\_google\\\_sheet\\\_id
   GOOGLE\\\_SHEET\\\_TAB=Tickets
   GMAIL\\\_QUERY=newer\\\_than:7d
   ```

2. Connect Gmail and Google Sheets to Composio.
3. Open Codex in this project folder.
4. Run the preview with a prompt like:

> Run the complete Gmail-to-Google-Sheets support workflow in preview mode using the existing Composio MCP connections. Retrieve all matching Gmail messages, include read and unread emails, read the full body, apply 2-ticket-schema.md, validate every ticket, and check duplicates. Do not write to Google Sheets and do not modify Gmail.

5. Review the preview, then run production:

> Run the approved production workflow once through the existing Codex Composio MCP connections. Keep Gmail read-only, apply 2-ticket-schema.md, validate every ticket, check duplicates, and append valid non-duplicate tickets to the Tickets sheet. Apply the formatting rules from skills/google-sheets.md and verify the final result.

## Skills

### 1\. Read Gmail messages

The Gmail skill retrieves every message matching the configured query.

It:

* includes read and unread emails;
* reads the full message body;
* follows pagination until all matching emails are retrieved;
* keeps Gmail read-only;
* skips newsletters, promotions, spam, and unrelated messages.

Example prompt:

> Read all Gmail messages matching newer\\\_than:7d, include read and unread messages, and keep Gmail read-only.

### 2\. Create and review tickets

The workflow applies the business rules in `2-ticket-schema.md`.

It decides:

* whether the email is a valid support request;
* Product / Service;
* Issue Category;
* Priority;
* Sentiment;
* Status;
* Issue Summary;
* Suggested Next Action;
* Suggested Reply.

Sensitive decisions remain under human review.

Example prompt:

> Review the retrieved support emails, apply 2-ticket-schema.md, and prepare valid 13-field tickets for human review.

### 3\. Write to Google Sheets

The Google Sheets skill validates, deduplicates, writes, formats, and verifies the tickets.

It:

* writes exactly 13 visible columns;
* checks duplicate Gmail Message IDs;
* preserves existing rows;
* applies dropdowns;
* adds thin table borders;
* keeps data rows white;
* applies colours only to Priority, Sentiment, and Status;
* freezes the header row;
* verifies that no ticket values changed during formatting.

Example prompt:

> Write the approved non-duplicate tickets to the Tickets sheet and apply all formatting and verification rules from skills/google-sheets.md.

## Workflow

```text
Gmail
  ↓
Read full messages
  ↓
Skip irrelevant emails
  ↓
Apply ticket rules
  ↓
Validate 13 fields
  ↓
Check duplicates
  ↓
Preview for review
  ↓
Write approved tickets
  ↓
Format and verify Google Sheets
  ↓
Human review
```

## Local tools

You do not use npm to run the live Gmail-to-Sheets production workflow.

Use npm only for local checks and tests:

```bash
npm install
npm run check
npm test
```

The live preview and production workflow are run directly through Codex using Composio MCP.

## Updating the workflow

Everything important is stored in editable Markdown files:

* **Business rules, customer names, priority, status, and safe replies** — `2-ticket-schema.md`
* **Gmail retrieval and read-only behaviour** — `skills/gmail-support.md`
* **Sheet columns, allowed values, borders, dropdowns, and formatting** — `skills/google-sheets.md`
* **Workflow order and execution instructions** — `skills/process-support-requests.md`

Most business changes should be made in these Markdown files instead of being hard-coded in JavaScript.

## Google Sheets format

The `Tickets` tab must contain exactly these 13 visible columns:

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

The sheet should use:

* a bold header row;
* regular white data rows;
* wrapped text;
* top alignment;
* thin light-grey borders;
* filters;
* a frozen header row;
* dropdowns in Product / Service, Issue Category, Priority, Sentiment, and Status;
* conditional colours only in Priority, Sentiment, and Status.

## Duplicate handling

The primary duplicate key is:

```text
Gmail Message ID
```

Thread ID is used only to connect related follow-up messages.

A new message in an existing thread is not automatically a duplicate.

When Gmail identifiers are unavailable, the fallback check uses:

* Customer Email;
* Email Subject;
* Received Date;
* Issue Summary.

Internal Gmail identifiers must not appear in the visible `Tickets` columns.

## Safety

The workflow does not automatically:

* send Gmail replies;
* mark emails as read;
* archive, label, or delete emails;
* approve refunds or credits;
* promise compensation;
* complete cancellations;
* change account details;
* disclose private customer information;
* make final hardship or complaint decisions;
* guarantee technician dates or restoration times.

Suggested replies and actions are drafts for human review.

## Requirements

* Codex
* Composio MCP configured in Codex
* Gmail connected through Composio
* Google Sheets connected through Composio
* Access to the target spreadsheet
* A `Tickets` tab with the exact 13 headers
* Node.js for local checks and tests

