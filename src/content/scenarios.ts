/**
 * Field-to-system scenarios played in the homepage hero console. Each one is
 * a message from the floor that ends as a confirmed record in a system of
 * record, across the three regions we work in. Illustrative, not client data.
 */

export type Scenario = {
  site: string;
  system: string;
  message: {
    from: string;
    channel: "WhatsApp text" | "Voice note" | "Photo" | "Phone call";
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
    site: "Plant, Nagpur",
    system: "SAP",
    message: {
      from: "Shift supervisor",
      channel: "Voice note",
      body: "Packing line B stopped. Bearing on the conveyor drive. Replaced it, running again now.",
    },
    confirm: { ask: "Supervisor confirms the cause", done: "Cause confirmed by the supervisor" },
    record: {
      title: "Downtime record",
      fields: [
        ["Asset", "Packing line B, conveyor drive"],
        ["Cause", "Bearing failure"],
        ["Action", "Bearing replaced, spare reordered"],
      ],
      status: "RUNNING",
    },
  },
  {
    site: "Project site, Lagos",
    system: "ERP",
    message: {
      from: "Store keeper",
      channel: "Photo",
      body: "Cement delivery at the gate. Short against the delivery note, photo attached.",
    },
    confirm: { ask: "Site engineer confirms the shortfall", done: "Shortfall confirmed by the site engineer" },
    record: {
      title: "Goods receipt",
      fields: [
        ["Material", "Cement, from the delivery note"],
        ["Variance", "Short delivery flagged"],
        ["Next step", "Supplier query drafted"],
      ],
      status: "QUERY RAISED",
    },
  },
  {
    site: "Warehouse, Ohio",
    system: "SALESFORCE",
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
];
