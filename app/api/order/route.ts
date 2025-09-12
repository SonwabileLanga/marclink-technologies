import { NextResponse } from "next/server";

type OrderItem = {
  brand: string;
  model: string;
  type: string;
  qty: number;
  unitPrice: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer, items } = body as { customer: { name: string; phone?: string; email?: string }; items: OrderItem[] };
    if (!customer?.name || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, message: "Invalid order" }, { status: 400 });
    }

    const total = items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);
    const lines = items
      .map((it) => `${it.brand} - ${it.model} (${it.type}) x${it.qty} @ R${it.unitPrice.toFixed(0)} = R${(it.qty * it.unitPrice).toFixed(0)}`)
      .join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif">
        <h2>New Website Order</h2>
        <p><strong>Customer:</strong> ${customer.name}</p>
        <p><strong>Phone:</strong> ${customer.phone || "-"}</p>
        <p><strong>Email:</strong> ${customer.email || "-"}</p>
        <pre style="background:#f6f6f6;padding:12px;border-radius:6px">${lines}</pre>
        <p><strong>Total:</strong> R${total.toFixed(0)}</p>
      </div>
    `;

    // Send via Resend if available
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY || "re_Qh7XM1dz_Q1S2duxoytb5Nct7JbqUgaTt");
      await resend.emails.send({
        from: "orders@resend.dev",
        to: "safariemanuel60@gmail.com",
        subject: `New Order - ${customer.name}`,
        html,
      });
    } catch (err) {
      console.error("Resend not configured or failed", err);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}

