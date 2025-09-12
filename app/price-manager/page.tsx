import React from "react";
import PriceManager from "@/components/PriceManager";

export default function Page(): JSX.Element {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Price Manager</h1>
      <p className="text-gray-600 mb-6">Upload your CSV, add R30 automatically, search/filter, and export.</p>
      <PriceManager />
    </main>
  );
}

