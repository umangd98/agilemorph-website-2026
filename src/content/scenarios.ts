/**
 * Scenarios played in the How we work console. Each one is a message from
 * wherever the work happens that ends as a confirmed record in the system the
 * team already runs, across different parts of a business. Illustrative, not
 * client data.
 */

export type Scenario = {
  site: string;
  system: string;
  message: {
    from: string;
    channel: "WhatsApp text" | "Voice note" | "Email" | "Phone call";
    body: string;
  };
  confirm: { ask: string; done: string };
  record: {
    title: string;
    fields: Array<[label: string, value: string]>;
    status: string;
  };
};

export const SCENARIOS: Scenario[] = [
  {
    site: "Sales",
    system: "HubSpot",
    message: {
      from: "Prospect",
      channel: "WhatsApp text",
      body: "Can you send pricing for the annual plan? We'd like to start next month.",
    },
    confirm: { ask: "Account owner approves the quote", done: "Quote approved by the account owner" },
    record: {
      title: "Deal",
      fields: [
        ["Contact", "Matched from the number"],
        ["Stage", "Quote requested"],
        ["Next step", "Quote drafted for review"],
      ],
      status: "DEAL UPDATED",
    },
  },
  {
    site: "Finance",
    system: "SAP",
    message: {
      from: "Supplier",
      channel: "Email",
      body: "Please find our invoice attached for the order delivered last week.",
    },
    confirm: { ask: "Finance approves a price mismatch", done: "Mismatch approved by finance" },
    record: {
      title: "Supplier invoice",
      fields: [
        ["Vendor", "Matched to the vendor record"],
        ["Check", "Matched to the purchase order"],
        ["Next step", "Queued for payment"],
      ],
      status: "INVOICE POSTED",
    },
  },
  {
    site: "Support",
    system: "Salesforce",
    message: {
      from: "Customer",
      channel: "Phone call",
      body: "Our order arrived damaged. We need a replacement before the weekend.",
    },
    confirm: { ask: "Support lead approves the replacement", done: "Replacement approved by the support lead" },
    record: {
      title: "Support case",
      fields: [
        ["Account", "Matched from the caller"],
        ["Issue", "Damaged on arrival"],
        ["Next step", "Replacement order created"],
      ],
      status: "CASE OPENED",
    },
  },
  {
    site: "Operations",
    system: "your ERP",
    message: {
      from: "Supervisor",
      channel: "Voice note",
      body: "Line B stopped for a bearing on the drive. Replaced it, running again now.",
    },
    confirm: { ask: "Supervisor confirms the cause", done: "Cause confirmed by the supervisor" },
    record: {
      title: "Downtime record",
      fields: [
        ["Asset", "Line B, drive"],
        ["Cause", "Bearing failure"],
        ["Action", "Bearing replaced, spare reordered"],
      ],
      status: "RUNNING",
    },
  },
];
