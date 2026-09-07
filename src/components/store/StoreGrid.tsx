"use client";

import { useState } from "react";
import { products, type Brand } from "@/content/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

const filters: { id: Brand | "all"; label: string }[] = [
  { id: "all", label: "Tudo" },
  { id: "cross", label: "CROSS" },
  { id: "up", label: "UP" },
  { id: "go", label: "GO" },
];

export function StoreGrid() {
  const [brand, setBrand] = useState<Brand | "all">("all");
  const list = brand === "all" ? products : products.filter((p) => p.brand === brand);
  return (
    <div>
      <div role="tablist" aria-label="Filtrar por marca" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={brand === f.id}
            type="button"
            onClick={() => setBrand(f.id)}
            className={cn(
              "rounded-pill border-2 border-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
              brand === f.id ? "bg-ink text-yellow" : "bg-transparent text-ink hover:bg-ink/10",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} i={i} />
        ))}
      </div>
      {list.length === 0 && <p className="text-ink/60">Nenhum produto nessa categoria por enquanto.</p>}
    </div>
  );
}
