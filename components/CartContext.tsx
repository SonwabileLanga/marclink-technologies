"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  brand: string;
  model: string;
  type: string;
  price: number;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  total: number;
};

const CartCtx = createContext<CartState | null>(null);

function keyOf(item: { brand: string; model: string; type: string }): string {
  return `${item.brand}|${item.model}|${item.type}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart:lcd");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart:lcd", JSON.stringify(items));
  }, [items]);

  const api: CartState = useMemo(() => ({
    items,
    add: (item: Omit<CartItem, "qty">) => {
      const id = keyOf(item);
      setItems((prev: CartItem[]) => {
        const found = prev.find((p: CartItem) => keyOf(p) === id);
        if (found) return prev.map((p: CartItem) => (keyOf(p) === id ? { ...p, qty: p.qty + 1 } : p));
        return [...prev, { ...item, qty: 1 }];
      });
    },
    remove: (id: string) => setItems((prev: CartItem[]) => prev.filter((p: CartItem) => keyOf(p) !== id)),
    setQty: (id: string, qty: number) => setItems((prev: CartItem[]) => prev.map((p: CartItem) => (keyOf(p) === id ? { ...p, qty } : p))),
    clear: () => setItems([]),
    total: items.reduce((sum: number, it: CartItem) => sum + it.qty * it.price, 0),
  }), [items]);

  return <CartCtx.Provider value={api}>{children}</CartCtx.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("CartProvider missing");
  return ctx;
}

