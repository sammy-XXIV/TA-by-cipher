# CIPHER

AI-powered crypto technical analysis, live at **[tradewithcipher.online](https://tradewithcipher.online)**.

CIPHER aggregates live market data from multiple exchanges, renders candlestick charts with indicators, and runs AI trade analysis that produces a clear signal card — direction, entry, target, stop, risk/reward — no account needed.

> ⚠ **Not financial advice.** All signals are AI-generated and for educational purposes only.

## Features

- **Live markets** — top-100 tokens aggregated from CoinGecko, Binance, Bybit, OKX, MEXC, Hyperliquid, and DexScreener, with search and manual MEXC ticker lookup
- **Charts** — candlestick chart with EMA 20/50, Bollinger Bands, RSI, and MACD across 5M–1W timeframes
- **AI analysis** — one-tap trade analysis (SAFE or DEGEN mode) powered by Claude via the backend; results render as a shareable signal card with a price rail showing stop, entry, and target
- **Signal tracking** — validity timer, entry-zone monitoring, invalidation and reversal detection, analysis history log
- **Market scanner** — sectioned MEXC scan: volume spikes, top gainers, reversal watch, BTC laggards, breakout and bounce candidates, sector leaders
- **Whale monitor** — large-transaction feed with buy/sell/DEX/alert filters
- **Motion** — boot intro, ambient node field, staggered list reveals, animated signal card (GSAP); honours `prefers-reduced-motion`
- **Responsive** — slide-page app on mobile, two-pane sidebar layout on desktop; your page, token, timeframe, and tab survive refresh

## Architecture

| Piece | Tech | Where |
|---|---|---|
| Frontend (this repo) | Static HTML/CSS/JS | GitHub Pages → tradewithcipher.online |
| API backend | Python / Flask | Railway (`/ticker`, `/candles`, `/analyze`, `/mexc-scan`) |

The frontend holds no secrets: the AI key lives only in backend environment variables.

## Pages

- `index.html` — the app: markets, charts, AI analysis, scanner, whales

## Local development

Any static file server works:

```bash
python -m http.server 8000
# open http://localhost:8000/index.html
```

The page talks to the production backend, so analyses from localhost are live actions.

---

Made by **SAMMY** · [tradewithcipher.online](https://tradewithcipher.online)
