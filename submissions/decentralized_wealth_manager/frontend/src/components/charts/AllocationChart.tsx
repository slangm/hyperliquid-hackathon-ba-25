"use client";

import {
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from "recharts";

import { allocation } from "@/data/portfolio";

export function AllocationChart() {
    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        contentStyle={{
                            background: "#0A0F14",
                            borderRadius: "12px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "white",
                        }}
                    />
                    <Pie
                        data={allocation}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="transparent"
                    >
                        {allocation.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

