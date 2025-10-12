import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoice = await fetch("https://invoice-generator.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_INVOICE_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const res = await invoice.arrayBuffer();

    return new NextResponse(res, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          invoice.headers.get("Content-Disposition") || "inline",
      },
    });
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ error: error.message });
  }
}
