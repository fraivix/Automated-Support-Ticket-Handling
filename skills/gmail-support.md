# Gmail Support

Use this skill to retrieve and prepare Gmail messages for AI support analysis.

## Workflow

1. Retrieve all Gmail messages within the configured scope.
2. Include both read and unread messages unless the user specifies otherwise.
3. Follow pagination until no matching messages remain.
4. Read the full message body, not only the subject or snippet.
5. For threads, use the newest customer-written message and retain relevant context.
6. Normalise each message into a clean AI input.
7. Return retrieval totals and any failures.

## Retrieval Scope

Use a time-based Gmail query, such as:

* messages received since the last successful run, or
* a configured lookback period such as `newer\_than:7d`

Do not use a small fixed production limit such as 5, 10, or 20 messages.

A limit may be used only for preview or debugging.

## Normalised Email

Return:

* message ID
* thread ID
* sender name
* sender email
* subject
* received date
* full body
* thread context
* attachment metadata

Keep message and thread IDs only for internal duplicate checking.

## Rules

* Gmail utilities only retrieve, decode, and normalise data.
* Do not decide whether an email is a support request.
* Do not classify issue category, priority, sentiment, or customer intent.
* Do not generate summaries or suggested replies.
* Do not write to Google Sheets.
* Do not skip separate emails only because they share the same sender.
* Do not analyse a snippet when the full body cannot be retrieved.
* Report failed retrievals clearly and continue with other messages when safe.

## Run Summary

Report:

* pages fetched
* messages fetched
* messages normalised
* failed messages

