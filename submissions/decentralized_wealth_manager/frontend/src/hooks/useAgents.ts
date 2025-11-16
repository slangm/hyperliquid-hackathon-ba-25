"use client";

import { useMemo } from "react";

import { agents } from "@/data/agents";

export function useAgents() {
    return useMemo(() => agents, []);
}

