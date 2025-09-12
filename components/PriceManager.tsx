"use client";

import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, JSX } from "react";
import { parseCsv, rowsToCsv, type PriceRow } from "./price-utils";

type SortKey = "brand" | "model" | "type" | "price" | "updated";

export default function PriceManager(): JSX.Element {
  const [rows, setRows] = useState<PriceRow[]>([]);
  const [addRand, setAddRand] = useState<number>(30);
  const [query, setQuery] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("brand");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo<PriceRow[]>(() => {
    const q = query.trim().toLowerCase();
    const b = brand.trim().toLowerCase();
    let out: PriceRow[] = rows;
    if (b) out = out.filter((r: PriceRow) => r.brand.toLowerCase().includes(b));
    if (q) out = out.filter((r: PriceRow) => `${r.model} ${r.type}`.toLowerCase().includes(q));
    const sorted = [...out].sort((a, b2) => {
      let av: number | string = "";
      let bv: number | string = "";
      if (sortKey === "updated") {
        av = a.price + addRand;
        bv = b2.price + addRand;
      } else {
        av = (a as any)[sortKey];
        bv = (b2 as any)[sortKey];
      }
      if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return sorted;
  }, [rows, brand, query, sortKey, sortAsc, addRand]);

  function onUpload(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text: string) => setRows(parseCsv(text)));
  }

  function clearAll(): void {
    setRows([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function downloadCsv(updatedOnly = false): void {
    const data = rowsToCsv(rows, updatedOnly, addRand);
    const blob = new Blob([data], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = updatedOnly ? "prices-updated.csv" : "prices.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label className="text-sm">Upload CSV (brand,model,type,price)</label>
          <input ref={fileRef} type="file" accept=".csv" onChange={onUpload} className="border p-2 rounded" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Add amount (R)</label>
          <input
            type="number"
            value={addRand}
            onChange={(e) => setAddRand(Number(e.target.value || 0))}
            className="border p-2 rounded w-32"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm">Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Samsung, Huawei..." className="border p-2 rounded w-48" />
        </div>
        <div className="flex flex-col flex-1 min-w-56">
          <label className="text-sm">Search model/type</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="A04, iPhone 11..." className="border p-2 rounded" />
        </div>
        <div className="flex gap-2 ml-auto">
          <button onClick={() => downloadCsv(false)} className="border rounded px-3 py-2 bg-white hover:bg-gray-50">Export CSV</button>
          <button onClick={() => downloadCsv(true)} className="border rounded px-3 py-2 bg-white hover:bg-gray-50">Export with updated_price</button>
          <button onClick={clearAll} className="border rounded px-3 py-2">Clear</button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th label="Brand" sortKey="brand" activeKey={sortKey} asc={sortAsc} onChange={(k, a) => { setSortKey(k); setSortAsc(a); }} />
              <Th label="Model" sortKey="model" activeKey={sortKey} asc={sortAsc} onChange={(k, a) => { setSortKey(k); setSortAsc(a); }} />
              <Th label="Type" sortKey="type" activeKey={sortKey} asc={sortAsc} onChange={(k, a) => { setSortKey(k); setSortAsc(a); }} />
              <Th label="Price" sortKey="price" activeKey={sortKey} asc={sortAsc} onChange={(k, a) => { setSortKey(k); setSortAsc(a); }} />
              <Th label={`Price + R${addRand}`} sortKey="updated" activeKey={sortKey} asc={sortAsc} onChange={(k, a) => { setSortKey(k); setSortAsc(a); }} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r: PriceRow, idx: number) => (
              <tr key={`${r.brand}-${r.model}-${idx}`} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 whitespace-nowrap">{r.brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.model}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.type}</td>
                <td className="px-3 py-2 text-right">R{r.price.toFixed(0)}</td>
                <td className="px-3 py-2 text-right font-medium">R{(r.price + addRand).toFixed(0)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>Upload a CSV to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details>
        <summary className="cursor-pointer">CSV format help</summary>
        <p className="text-sm text-gray-600 mt-2">Columns required: brand, model, type, price. Example:</p>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">{`brand,model,type,price\nSamsung,A04,ORG,110\nHuawei,P40 Lite,NORMAL,140`}</pre>
      </details>
    </div>
  );
}

function Th(props: { label: string; sortKey: SortKey; activeKey: SortKey; asc: boolean; onChange: (k: SortKey, asc: boolean) => void }): JSX.Element {
  const { label, sortKey, activeKey, asc, onChange } = props;
  const isActive = activeKey === sortKey;
  return (
    <th
      className="px-3 py-2 text-left font-semibold cursor-pointer select-none"
      onClick={() => onChange(sortKey, isActive ? !asc : true)}
    >
      <span>{label}</span>
      <span className="ml-1 text-gray-500">{isActive ? (asc ? "▲" : "▼") : ""}</span>
    </th>
  );
}

