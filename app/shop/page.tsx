"use client";

import { useEffect, useMemo, useState } from "react";
import type { JSX } from "react";
import { getAllProductsSorted } from "@/data/products";
import { CartProvider, useCart } from "@/components/CartContext";

function ShopInner(): JSX.Element {
  const [rows, setRows] = useState(getAllProductsSorted());
  const [brand, setBrand] = useState<string>("");
  const [q, setQ] = useState<string>("");
  const { add, items, total } = useCart();

  useEffect(() => {
    setRows(getAllProductsSorted());
  }, []);

  const filtered = useMemo(() => {
    const b = brand.trim().toLowerCase();
    const query = q.trim().toLowerCase();
    return rows
      .filter((r) => (b ? r.brand.toLowerCase().includes(b) : true))
      .filter((r) => (query ? `${r.model} ${r.type}`.toLowerCase().includes(query) : true));
  }, [rows, brand, q]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-sm">Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Samsung, Huawei..." className="border p-2 rounded w-48" />
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-sm">Search</label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Model or type" className="border p-2 rounded" />
        </div>
        <div className="ml-auto text-right">
          <div className="font-medium">Cart: {items.reduce((s, i) => s + i.qty, 0)} items</div>
          <div>Total: R{total.toFixed(0)}</div>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Brand</th>
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Price</th>
              <th className="px-3 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: any, idx: number) => (
              <tr key={`${r.brand}-${r.model}-${idx}`} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 whitespace-nowrap">{r.brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.model}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.type}</td>
                <td className="px-3 py-2 text-right">R{(r.basePrice + 30).toFixed(0)}</td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => add({ brand: r.brand, model: r.model, type: r.type, price: r.basePrice + 30 })}
                    className="border rounded px-3 py-1 bg-white hover:bg-gray-50"
                  >
                    Add to cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CartSummary />
    </div>
  );
}

function CartSummary(): JSX.Element {
  const { items, remove, setQty, clear, total } = useCart();
  return (
    <div className="border rounded p-4">
      <h2 className="font-semibold mb-3">Cart</h2>
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-2 py-2 text-left">Item</th>
                  <th className="px-2 py-2 text-right">Unit</th>
                  <th className="px-2 py-2 text-right">Qty</th>
                  <th className="px-2 py-2 text-right">Total</th>
                  <th className="px-2 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const id = `${it.brand}|${it.model}|${it.type}`;
                  return (
                    <tr key={id}>
                      <td className="px-2 py-2">{it.brand} {it.model} ({it.type})</td>
                      <td className="px-2 py-2 text-right">R{it.price.toFixed(0)}</td>
                      <td className="px-2 py-2 text-right">
                        <input type="number" min={1} value={it.qty} onChange={(e) => setQty(id, Number(e.target.value || 1))} className="border p-1 rounded w-20 text-right" />
                      </td>
                      <td className="px-2 py-2 text-right">R{(it.qty * it.price).toFixed(0)}</td>
                      <td className="px-2 py-2 text-right">
                        <button onClick={() => remove(id)} className="text-red-600">Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button onClick={clear} className="border rounded px-3 py-2">Clear cart</button>
            <div className="text-right">
              <div className="font-medium">Subtotal: R{total.toFixed(0)}</div>
              <CheckoutButton />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CheckoutButton(): JSX.Element {
  const { items, clear, total } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const canCheckout = items.length > 0 && name.trim().length > 1;

  async function submit(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: { name, phone, email }, items: items.map((i) => ({ brand: i.brand, model: i.model, type: i.type, qty: i.qty, unitPrice: i.price })) }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Order sent! Total R${total.toFixed(0)}. We will contact you.`);
        clear();
        setName(""); setPhone(""); setEmail("");
      } else {
        alert("Failed to send order");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 space-y-2">
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="border p-2 rounded flex-1" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="border p-2 rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="border p-2 rounded" />
      </div>
      <button disabled={!canCheckout || loading} onClick={submit} className="border rounded px-4 py-2 bg-black text-white disabled:opacity-50">
        {loading ? "Sending..." : "Send order"}
      </button>
    </div>
  );
}

export default function Page(): JSX.Element {
  return (
    <CartProvider>
      <main>
        <h1 className="text-2xl font-bold p-6 pb-0">Shop LCD Parts</h1>
        <ShopInner />
      </main>
    </CartProvider>
  );
}

