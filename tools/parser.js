export const TICKET_FIELDS = Object.freeze([
  "receivedDate",
  "customerName",
  "customerEmail",
  "emailSubject",
  "productService",
  "issueCategory",
  "priority",
  "sentiment",
  "orderAccountReference",
  "issueSummary",
  "suggestedNextAction",
  "suggestedReply",
  "status",
]);

export const PROCESSED_TICKET_TEMPLATE = Object.freeze({
  shouldProcess: true,
  skipReason: null,
  receivedDate: "",
  customerName: "",
  customerEmail: "",
  emailSubject: "",
  productService: "",
  issueCategory: "",
  priority: "",
  sentiment: "",
  orderAccountReference: "",
  issueSummary: "",
  suggestedNextAction: "",
  suggestedReply: "",
  status: "",
});

export const SKIPPED_TICKET_TEMPLATE = Object.freeze({
  shouldProcess: false,
  skipReason: "Reason the email should not become a support ticket",
});

export const PRODUCT_SERVICE_VALUES = Object.freeze([
  "Home Internet",
  "Mobile or Mobile Broadband",
  "Modem or Hardware",
  "Home Phone or VoIP",
  "Business Internet or Communications",
  "Enterprise or Wholesale Services",
  "Account and Billing",
  "Other Aussie Broadband Service",
]);

export const ISSUE_CATEGORY_VALUES = Object.freeze([
  "No Internet or Outage",
  "Slow Speed or Dropouts",
  "Wi-Fi, Modem, or Hardware",
  "Installation or Activation",
  "Mobile, SIM, Data, or Roaming",
  "Billing, Payment, or Invoice",
  "Plan Change or Relocation",
  "Cancellation or Account Closure",
  "Phone, VoIP, or Porting",
  "Account, Portal, or Authorisation",
  "Refund, Credit, or Compensation",
  "Financial Hardship",
  "Complaint or Negative Feedback",
  "Privacy or Security",
  "General Product Question",
  "Other Support",
]);

export const PRIORITY_VALUES = Object.freeze(["High", "Normal", "Low"]);

export const SENTIMENT_VALUES = Object.freeze([
  "Positive",
  "Neutral",
  "Confused",
  "Frustrated",
  "Distressed",
  "Angry",
]);

export const STATUS_VALUES = Object.freeze([
  "New",
  "Waiting for Customer",
  "Escalated",
  "In Progress",
  "Resolved",
]);

export async function parseSupportEmail() {
  throw new Error("Live AI parsing is not implemented yet.");
}

export function normaliseTicket(ticket) {
  if (!isPlainObject(ticket)) return ticket;

  const normalised = {};
  for (const [field, value] of Object.entries(ticket)) {
    normalised[field] = normaliseField(field, value);
  }

  if (normalised.shouldProcess === true) {
    if (isBlank(normalised.customerName)) normalised.customerName = "Unknown Customer";
    if (isBlank(normalised.emailSubject)) normalised.emailSubject = "No Subject";
    if (isBlank(normalised.orderAccountReference)) normalised.orderAccountReference = "Not provided";
  }

  return normalised;
}

export function validateTicket(ticket) {
  const errors = [];

  if (!isPlainObject(ticket)) {
    return {
      valid: false,
      errors: [{ field: "ticket", message: "Ticket must be an object" }],
      ticket: null,
    };
  }

  const normalised = normaliseTicket(ticket);

  if (typeof normalised.shouldProcess !== "boolean") {
    errors.push({
      field: "shouldProcess",
      message: "shouldProcess must be a boolean",
    });
  }

  if (normalised.shouldProcess === false) {
    validateUnexpectedFields(normalised, ["shouldProcess", "skipReason"], errors);

    if (typeof normalised.skipReason !== "string" || isBlank(normalised.skipReason)) {
      errors.push({
        field: "skipReason",
        message: "Skipped emails must include a non-empty skipReason",
      });
    }

    return result(errors, normalised);
  }

  if (normalised.shouldProcess === true) {
    validateUnexpectedFields(normalised, ["shouldProcess", "skipReason", ...TICKET_FIELDS], errors);
    validateProcessedTicket(normalised, errors);
  }

  return result(errors, normalised);
}

function validateProcessedTicket(ticket, errors) {
  for (const field of TICKET_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(ticket, field)) {
      errors.push({ field, message: `${field} is required` });
      continue;
    }

    if (typeof ticket[field] !== "string" || isBlank(ticket[field])) {
      errors.push({ field, message: `${field} must be a non-empty string` });
    }
  }

  if (typeof ticket.customerEmail === "string" && !isBlank(ticket.customerEmail) && !isValidEmail(ticket.customerEmail)) {
    errors.push({ field: "customerEmail", message: "Customer email must be a valid email address" });
  }

  if (typeof ticket.receivedDate === "string" && !isBlank(ticket.receivedDate) && !isValidDate(ticket.receivedDate)) {
    errors.push({ field: "receivedDate", message: "Received date must be a valid date" });
  }

  validateControlledValue(errors, "productService", ticket.productService, PRODUCT_SERVICE_VALUES, "Invalid Product / Service value");
  validateControlledValue(errors, "issueCategory", ticket.issueCategory, ISSUE_CATEGORY_VALUES, "Invalid Issue Category value");
  validateControlledValue(errors, "priority", ticket.priority, PRIORITY_VALUES, "Invalid priority value");
  validateControlledValue(errors, "sentiment", ticket.sentiment, SENTIMENT_VALUES, "Invalid sentiment value");
  validateControlledValue(errors, "status", ticket.status, STATUS_VALUES, "Invalid status value");
}

function validateControlledValue(errors, field, value, allowedValues, message) {
  if (typeof value !== "string" || isBlank(value)) return;
  if (!allowedValues.includes(value)) errors.push({ field, message });
}

function validateUnexpectedFields(ticket, allowedFields, errors) {
  const allowed = new Set(allowedFields);
  for (const field of Object.keys(ticket)) {
    if (!allowed.has(field)) {
      errors.push({ field, message: `${field} is not part of the parser output contract` });
    }
  }
}

function normaliseField(field, value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (field === "suggestedReply") {
    return trimmed
      .split(/\r?\n/)
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  }
  return trimmed.replace(/\s+/g, " ");
}

function result(errors, ticket) {
  return {
    valid: errors.length === 0,
    errors,
    ticket: errors.length === 0 ? ticket : null,
  };
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isBlank(value) {
  return String(value ?? "").trim() === "";
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}
