export type Product = {
  brand: string;
  model: string;
  type: string;
  basePrice: number;
};

// Seed products. Extend this list as needed.
export const products: Product[] = [
  { brand: "Samsung", model: "A01 BIG/SMALL", type: "ORG", basePrice: 120 },
  { brand: "Samsung", model: "A02", type: "ORG", basePrice: 110 },
  { brand: "Samsung", model: "A04", type: "ORG", basePrice: 110 },
  { brand: "Samsung", model: "A05", type: "ORG", basePrice: 130 },
  { brand: "Samsung", model: "A11", type: "ORG W/F", basePrice: 160 },
  { brand: "Samsung", model: "A21S", type: "ORG W/F", basePrice: 160 },
  { brand: "Samsung", model: "A31", type: "INCELL W/F", basePrice: 180 },
  { brand: "Samsung", model: "A50", type: "INCELL W/F", basePrice: 170 },
  { brand: "Samsung", model: "A53", type: "BIG OLED W/F", basePrice: 550 },

  { brand: "Huawei", model: "Y5 2019", type: "ORG", basePrice: 130 },
  { brand: "Huawei", model: "Y6 2019", type: "GOOD", basePrice: 130 },
  { brand: "Huawei", model: "Y9A", type: "COG", basePrice: 150 },
  { brand: "Huawei", model: "Nova 8i", type: "INCELL", basePrice: 200 },
  { brand: "Huawei", model: "P40 Lite", type: "NORMAL", basePrice: 140 },

  { brand: "iPhone", model: "iPhone 11", type: "INCELL", basePrice: 220 },
  { brand: "iPhone", model: "iPhone 11 Pro", type: "INCELL", basePrice: 300 },
  { brand: "iPhone", model: "iPhone 12", type: "INCELL", basePrice: 350 },
  { brand: "iPhone", model: "iPhone 13", type: "INCELL", basePrice: 400 },

  { brand: "Nokia", model: "C12", type: "COMBO", basePrice: 160 },
  { brand: "Vivo", model: "Y11", type: "COMBO", basePrice: 150 },
  { brand: "Tecno", model: "Spark 7", type: "COMBO", basePrice: 140 },
  { brand: "Redmi", model: "A2", type: "COMBO", basePrice: 150 },
  { brand: "Itel", model: "A60", type: "COMBO", basePrice: 150 },
];

export function getAllProductsSorted(): Product[] {
  return [...products].sort((a, b) => a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model));
}

