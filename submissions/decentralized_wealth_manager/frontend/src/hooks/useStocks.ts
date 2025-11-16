"use client";

import { useMemo } from "react";

import type { StockCategory } from "@/data/stocks";
import { stocks } from "@/data/stocks";

export function useStocks(filter?: StockCategory) {
    return useMemo(() => {
        if (!filter) return stocks;
        return stocks.filter((stock) => stock.category.includes(filter));
    }, [filter]);
}

