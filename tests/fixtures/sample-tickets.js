export const sampleTickets = Object.freeze([
  {
    name: "business-critical outage",
    ticket: {
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
      orderAccountReference: "Registered business site: Harbour Legal office",
      issueSummary:
        "The office internet has been completely unavailable since approximately 8:15 am, affecting 14 staff and access to cloud phones and client files.",
      suggestedNextAction:
        "Check for a known outage, verify the business service status, and escalate for urgent technical review if no outage is recorded.",
      suggestedReply:
        "Hi Priya,\n\nThank you for letting us know. We understand that the outage is affecting your team's access to cloud phones and client files. We'll first check for a known outage and verify the service status. If no outage is recorded, the service should be escalated for urgent technical review.\n\nKind regards,\nSupport Team",
      status: "Escalated",
    },
  },
  {
    name: "slow speed/dropouts",
    ticket: {
      shouldProcess: true,
      skipReason: null,
      receivedDate: "2026-07-06T09:40:00+10:00",
      customerName: "Daniel Morris",
      customerEmail: "daniel.morris@example.com.au",
      emailSubject: "Internet keeps dropping out",
      productService: "Home Internet",
      issueCategory: "Slow Speed or Dropouts",
      priority: "Normal",
      sentiment: "Frustrated",
      orderAccountReference: "Service address provided in email",
      issueSummary:
        "The customer reports repeated home internet dropouts and slower speeds over several days, with the service becoming unreliable for normal household use.",
      suggestedNextAction:
        "Run service and line diagnostics, review dropout history, and ask for any missing modem or connection details needed for troubleshooting.",
      suggestedReply:
        "Hi Daniel,\n\nThanks for the details. We can start by checking the service for dropouts and speed issues at the address provided. If more information is needed, we should ask only for details needed to continue troubleshooting, such as the modem model or test results.\n\nKind regards,\nSupport Team",
      status: "New",
    },
  },
  {
    name: "duplicate billing charge",
    ticket: {
      shouldProcess: true,
      skipReason: null,
      receivedDate: "2026-07-06T10:20:00+10:00",
      customerName: "Amelia Chen",
      customerEmail: "amelia.chen@example.com.au",
      emailSubject: "Charged twice for my invoice",
      productService: "Account and Billing",
      issueCategory: "Billing, Payment, or Invoice",
      priority: "Normal",
      sentiment: "Confused",
      orderAccountReference: "Invoice and charge dates mentioned by customer",
      issueSummary:
        "The customer reports a possible duplicate billing charge and wants confirmation before any payment outcome is decided.",
      suggestedNextAction:
        "Verify the invoice, amount, charge dates, and payment method before deciding whether any reversal, refund, or credit applies.",
      suggestedReply:
        "Hi Amelia,\n\nThanks for sending the billing details. The invoice, charge dates, and payment records should be checked before confirming the outcome. Any reversal, refund, or credit needs human payment review first.\n\nKind regards,\nSupport Team",
      status: "New",
    },
  },
  {
    name: "missed installation",
    ticket: {
      shouldProcess: true,
      skipReason: null,
      receivedDate: "2026-07-06T11:05:00+10:00",
      customerName: "Noah Patel",
      customerEmail: "noah.patel@example.com.au",
      emailSubject: "Technician missed installation appointment",
      productService: "Home Internet",
      issueCategory: "Installation or Activation",
      priority: "Normal",
      sentiment: "Frustrated",
      orderAccountReference: "Installation appointment details provided",
      issueSummary:
        "The customer reports that an nbn installation appointment was missed and needs the order and appointment notes checked.",
      suggestedNextAction:
        "Check the order and appointment notes, then provide the current installation status and next available steps using estimates only.",
      suggestedReply:
        "Hi Noah,\n\nThanks for letting us know the appointment was missed. The order and appointment notes should be checked before advising the current status and next available steps. Any timing provided should be an estimate, not a commitment.\n\nKind regards,\nSupport Team",
      status: "New",
    },
  },
  {
    name: "cancellation request",
    ticket: {
      shouldProcess: true,
      skipReason: null,
      receivedDate: "2026-07-06T12:30:00+10:00",
      customerName: "Grace Williams",
      customerEmail: "grace.williams@example.com.au",
      emailSubject: "Cancel my home internet service",
      productService: "Home Internet",
      issueCategory: "Cancellation or Account Closure",
      priority: "Normal",
      sentiment: "Neutral",
      orderAccountReference: "Registered email: grace.williams@example.com.au",
      issueSummary:
        "The customer requests cancellation of their home internet service and asks about final charges and modem return requirements.",
      suggestedNextAction:
        "Route the request to the cancellation process and ask the primary account holder to complete verification, including 2FA, before confirming any account closure or final charges.",
      suggestedReply:
        "Hi Grace,\n\nWe can help route the cancellation request. Closure must be completed by the primary account holder after verification, including 2FA, so cancellation cannot be confirmed from this email alone. Final charges and modem return requirements should be confirmed after review.\n\nKind regards,\nSupport Team",
      status: "Waiting for Customer",
    },
  },
]);
