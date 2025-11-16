"use client";

import { useMemo } from "react";

import { allocation, portfolioChange, portfolioValue } from "@/data/portfolio";

export function usePortfolio() {
    return useMemo(
        () => ({
            totalValue: portfolioValue,
            changePct: portfolioChange,
            allocation,
        }),
        [],
    );
}

