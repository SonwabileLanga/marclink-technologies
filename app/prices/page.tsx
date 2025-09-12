"use client";

import React, { useEffect, useMemo, useState } from "react";
import { parseCsv, type PriceRow } from "@/components/price-utils";

export default function Page(): JSX.Element {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [brand, setBrand] = useState<string>("");
  const [q, setQ] = useState<string>("");

  useEffect(() => {
    fetch("/prices.csv")
      .then((r) => r.text())
      .then((txt) => setRows(parseCsv(txt)))
      .catch(() => setRows([]));
  }, []);

  const filtered = useMemo(() => {
    const b = brand.trim().toLowerCase();
    const query = q.trim().toLowerCase();
    let out = rows;
    if (b) out = out.filter((r) => r.brand.toLowerCase().includes(b));
    if (query) out = out.filter((r) => `${r.model} ${r.type}`.toLowerCase().includes(query));
    return out;
  }, [rows, brand, q]);

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Price List</h1>
      <p className="text-gray-600 mb-4">Search by brand/model. Prices include R30 markup.</p>
      <div className="flex gap-3 mb-4">
        <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand" className="border p-2 rounded w-48" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Model/type" className="border p-2 rounded flex-1" />
      </div>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Brand</th>
              <th className="px-3 py-2 text-left">Model</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={`${r.brand}-${r.model}-${idx}`} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 whitespace-nowrap">{r.brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.model}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.type}</td>
                <td className="px-3 py-2 text-right">R{(r.price + 30).toFixed(0)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>Prices not available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

