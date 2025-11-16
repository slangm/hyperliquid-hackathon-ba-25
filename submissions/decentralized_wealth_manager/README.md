## HyperFi SuperApp

### Summary
- **Product Vision:** HyperFi is a fintech-style superapp that wraps HypurrFi + HyperEVM rails to offer tokenized U.S. stocks (RAWs), structured vaults, automated savings, and copy-trading agents.
- **Primary Persona:** Global middle-class savers without direct access to U.S. markets who expect Web2 simplicity (email/social login, MPC wallets, clean UX).
- **Hackathon Scope:** Ship one live product—**HyperFi Savings Account** (leveraged HypurrFi vault)—and surface wireframes for upcoming modules (Trade.xyz equities, Ondo RWAs, copy agents).

### System Overview
| Layer | Responsibilities | Stack |
| --- | --- | --- |
| UX Web App | Mobile-first hyper-branded UX, savings dashboard, roadmap tiles, paper trading fixtures | Next.js (App Router), Tailwind/shadcn, Wagmi/vIem, Framer Motion, Recharts |
| Strategy Contracts | Vault adapter, leverage controls, share accounting, rebalance hooks | Foundry, Solidity, HyperEVM mainnet |
| Data + Services | Cache APY + oracle feeds, emit alerts, prep Trade.xyz paper trades | Node/Express (future), Redis cache |

### Current Live Product — HyperFi Savings Account
- Backed by the deployed `HypurrLeveragedVault` contract (see **Deployment** below).
- UX flow: Deposit → Loop → Monitor (live Wagmi hooks) with fintech copy + risk guardrails.
- Safety rails: Target LTV tuned via owner controls, rebalance hooks for keepers (future).

### Coming Soon Modules
- **Trade.xyz RAWs (Paper):** Browse top equities, preview buy tickets, simulate fills.
- **Ondo Top 100 Stocks (Paper):** Static baskets representing tokenized RWA exposure.
- **Structured Vault Suite:** Fixed-yield, range-bound ETH, BTC trend, and Pre-IPO baskets.
- **Copy Agents:** Tokenized PnL bots (AI momentum, arbitrage) with performance history.
- **Trade Tab:** Spot/perp charts, grid/DCA presets, connected to Hyperliquid orderbooks.

### HypurrFi Integration
- Use official HyperEVM contract set for pooled markets, UI data, and oracle:
  - `Pool`: `0xceCcE0EB9DD2Ef7996e01e25DD70e461F918A14b`
  - `PoolAddressesProvider`: `0xA73ff12D177D8F1Ec938c3ba0e87D33524dD5594`
  - `UiPoolDataProvider`: `0x7b883191011AEAe40581d3Fa1B112413808C9c00`
  - `HyFiOracle`: `0x9BE2ac1ff80950DCeb816842834930887249d9A8`
- Adapter contract responsibilities:
  - Accepts USDC/USDXL deposits, supplies to Pool, borrows against target LTVs, loops to reach preset leverage profiles.
  - Tracks vault-wide health factor; exposes `rebalance()` and `emergencyDeleverage()` for keeper scripts.
  - Emits structured events consumed by frontend monitor cards.

### UX Flow
1. **Onboard:** Web2 login, choose custody mode (self-custody vs MPC smart wallet), sync wallet.
2. **Home Dashboard:** Portfolio value, allocation pie, quick actions, highlight for Savings Account.
3. **Save Tab:** Live vault card, APY stats, deposit/withdraw CTA, risk explainer.
4. **Roadmap Tiles:** “Ondo Top 100 Stocks (Paper)”, “Trade.xyz Spot Basket (Paper)”, “BTC Hedge Vault”, “Copy Agents”.

### Branding
- HyperFi palette: Aqua `#53F4D0`, Midnight `#0A0F14`, Solar Yellow `#F6C744`, Stone Grey `#B8BEC6`.
- Assets sourced from `hypurrfi/brand-assets` plus custom HF logo (H+F fusion).
- Mobile-first layout inspired by fintech apps with neon gradients + glassmorphism.

### Deployment
- **Vault contract:** `HypurrLeveragedVault`
- **Network:** HyperEVM mainnet (chain ID 999)
- **Address:** `0x98055D5c1Fa769222B723AE3f4Da4f43e7340190`
- **Tx hash:** `0x836b5a7a1738936f4a3abef727709745e57d576433488fc3dca1163c0d1e8420`
- **Config snapshot:** USDC asset `0xb88339CB7199b77E23DB6E890353E22632Ba630f`, aToken `0x280535137Dd84080d97d0826c577B4019d8e1BEb`, variable debt token `0x27949Aaed7FA3231fAd190B7C035f557f82Dabdc`, target LTV 40%, max LTV 75%, rebalance threshold 5%.

### Known Issues
> **Hypurr Pool rejects contract supplies (pending fix).**  
> When the HyperFi Savings vault (contract) calls `Pool.supply()` on the USDC reserve (`0xb883…630f`), Hypurr’s `SupplyLogic` reverts with `panic(0x11)` before leverage logic executes. Example tx: `0xb4ccf2bc80bd84e2d994b798a3ca6d7072294dcd6d4ffaf26ea4c1a1acdd8fb3`. Direct wallet deposits via Hypurr’s UI succeed. Issue escalated to HypurrFi—until resolved, deposits must be initiated through their UI or kept in demo/paper mode.

### Optional Polish
- Hook roadmap tiles directly to Trade.xyz and Ondo REST APIs once live so paper data updates automatically.
- Add lightweight analytics (track page/time + CTA taps) to help demo scoring and user research.

### Demo Checklist
- Frontend: Next.js mobile-first app (run `npm run dev` or deploy via Vercel).
- Savings Account: Live Wagmi component pointing to `0x9805…40190` (alerts users about current supply limitation).
- Roadmap tiles: Trade.xyz equities, Ondo Top 100, Copy Agents, BTC Hedge vault.
- Contracts: Foundry project + deployment script `DeployHypurrVault.s.sol`.

