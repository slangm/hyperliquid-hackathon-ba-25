"use client";

import { useMemo } from "react";

import { vaults } from "@/data/vaults";

export function useVaults() {
    return useMemo(() => vaults, []);
}

