## HyperEVM Strategy Contracts

This Foundry workspace contains the HypurrFi leveraged yield vault plus deployment tooling for HyperEVM testnet.

### 1. Prerequisites
- Install [Foundry](https://book.getfoundry.sh/) (`foundryup`).
- Copy `env.example` to `.env` (or export the variables in your shell) and fill in:
  - `HYPER_RPC_URL` → your HyperEVM testnet RPC (e.g., the provided Alchemy URL).
  - `USDC_ASSET` → the USDC token contract on HyperEVM testnet.
  - `TARGET_LTV_BPS`, `MAX_LTV_BPS`, `REBALANCE_THRESHOLD_BPS` → vault risk params.
  - Optional `VAULT_OWNER` → address that should control the vault (defaults to deployer).

### 2. Secure the Private Key (Keystore)
Foundry can encrypt your deployer key so you never commit raw secrets:

```bash
cd submissions/decentralized_wealth_manager/contracts
mkdir -p wallets
cast wallet import hypurr-deployer \
  --interactive \
  --keystore wallets/hypurr-deployer.json
```

When prompted, paste your private key (e.g., `8306...321`) and set a password. The resulting JSON keystore is ignored by git via `.gitignore`. To automate the import without pasting the key into history, set an env var and pipe it into `cast wallet import --private-key "$PRIVATE_KEY"` from your shell instead of `--interactive`.

Use the keystore in scripts with the `--account hypurr-deployer --password <(printf 'your-password')` flags. Never commit the keystore or password files.

### 3. Configure RPC + Foundry
Foundry reads RPC aliases from `foundry.toml`. After exporting `HYPER_RPC_URL`, you can reference it as `hyper_testnet`:

```bash
export HYPER_RPC_URL="https://hyperliquid-testnet.g.alchemy.com/v2/your-key"
```

### 4. Run Tests
```bash
forge test
```

### 5. Deploy Hypurr Leveraged Vault
Fill out the `.env` variables, ensure the keystore exists, then:

```bash
forge script script/DeployHypurrVault.s.sol \
  --rpc-url hyper_testnet \
  --account hypurr-deployer \
  --broadcast \
  --verify
```

Flags:
- `--account hypurr-deployer` pulls from the encrypted keystore you created.
- Add `--sender <address>` if the deployer differs from the keystore default.
- Omit `--broadcast` for a dry run / gas estimate.

### 6. Updating Vault Parameters
The deployment script pulls `TARGET_LTV_BPS`, `MAX_LTV_BPS`, and `REBALANCE_THRESHOLD_BPS` from the environment, so you can experiment with safer or riskier leverage presets without modifying Solidity.

### 7. Helpful Commands
```bash
forge build                      # compile contracts
forge fmt                        # format solidity
forge snapshot                   # produce gas snapshot
cast call <addr> <sig> <args>    # quick chain queries
cast wallet list                 # view imported keystore aliases
```

Keep all secrets in your local environment—only commit the sample `env.example`, not the real values.***
