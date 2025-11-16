export type StockCategory = "tech" | "ai" | "dividend" | "pre-ipo";

export type StockItem = {
    ticker: string;
    name: string;
    price: number;
    changePct: number;
    category: StockCategory[];
    dividendYield?: number;
};

export const stocks: StockItem[] = [
    {
        ticker: "NVDA",
        name: "NVIDIA",
        price: 121.22,
        changePct: 1.52,
        dividendYield: 0.03,
        category: ["tech", "ai"],
    },
    {
        ticker: "AAPL",
        name: "Apple",
        price: 201.44,
        changePct: 0.87,
        dividendYield: 0.61,
        category: ["tech", "dividend"],
    },
    {
        ticker: "SPACEX",
        name: "SpaceX (RAW)",
        price: 78.11,
        changePct: 4.3,
        category: ["pre-ipo", "ai"],
    },
    {
        ticker: "OPENAI",
        name: "OpenAI (RAW)",
        price: 32.7,
        changePct: 2.1,
        category: ["ai", "pre-ipo"],
    },
    {
        ticker: "NVDAAI",
        name: "AI Compute Basket",
        price: 52.19,
        changePct: 3.6,
        category: ["ai"],
    },
];

