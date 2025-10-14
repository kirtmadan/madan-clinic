export interface InvoiceGenerationPayload {
  logo?: string;
  from: string;
  to: string;
  number?: number;
  items: {
    name: string;
    quantity: number;
    unit_cost: number;
    description?: string;
  }[];
  discounts?: number;
  fields?: {
    discounts?: boolean;
  };
  amount_paid?: number;
  notes?: string;
  notes_title?: string;
}

export const generateInvoice = async (payload: InvoiceGenerationPayload) => {
  const invoice = await fetch("/api/generate-invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...payload,
      currency: "INR",
    }),
  });

  const blob = await invoice.blob(); // convert ArrayBuffer to Blob
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "invoice.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
};
