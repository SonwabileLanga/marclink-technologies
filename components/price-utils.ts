export type PriceRow = {
  brand: string;
  model: string;
  type: string;
  price: number;
};

// Simple CSV parser that supports quoted fields with commas.
export function parseCsv(csvText: string): PriceRow[] {
  const lines = csvText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  const brandIdx = header.indexOf("brand");
  const modelIdx = header.indexOf("model");
  const typeIdx = header.indexOf("type");
  const priceIdx = header.indexOf("price");

  const rows: PriceRow[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitCsvLine(lines[i]);
    const brand = safeGet(cols, brandIdx) ?? "";
    const model = safeGet(cols, modelIdx) ?? "";
    const type = safeGet(cols, typeIdx) ?? "";
    const priceStr = safeGet(cols, priceIdx) ?? "0";
    const price = Number(String(priceStr).replace(/[^0-9.\-]/g, "")) || 0;
    if (!brand && !model) continue;
    rows.push({ brand, model, type, price });
  }
  return rows;
}

export function rowsToCsv(rows: PriceRow[], includeUpdatedPrice = false, addAmount = 0): string {
  const header = includeUpdatedPrice
    ? ["brand", "model", "type", "price", "updated_price"]
    : ["brand", "model", "type", "price"];
  const body = rows
    .map((r) => {
      const base = [r.brand, r.model, r.type, formatMoney(r.price)];
      if (includeUpdatedPrice) {
        base.push(formatMoney(r.price + addAmount));
      }
      return base.map(csvEscape).join(",");
    })
    .join("\n");
  return `${header.join(",")}\n${body}`;
}

export function formatMoney(value: number): string {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
  return String(rounded);
}

function safeGet(arr: string[], idx: number): string | undefined {
  if (idx < 0) return undefined;
  return arr[idx];
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((v) => v.trim());
}

function csvEscape(value: string): string {
  const needsQuotes = /[",\n]/.test(value);
  let out = value.replace(/"/g, '""');
  if (needsQuotes) out = `"${out}"`;
  return out;
}

