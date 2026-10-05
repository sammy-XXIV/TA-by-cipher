// node setup.test.mjs — tests setupConflict() pulled straight out of index.html
import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8')
const src = html.match(/function setupConflict\([\s\S]*?\r?\n}\r?\n/)?.[0]
assert.ok(src, 'setupConflict() not found in index.html')
const setupConflict = new Function(`${src}; return setupConflict`)()

// ENA 1H, 2026-10-05: above EMAs, below VWAP, MACD bearish → conflicting, no setup
assert.match(setupConflict({ cp: 0.2490, e20: 0.2473, e50: 0.2441, vwap: 0.2553, macd: -0.0005, rsi: 54 }), /VWAP/)
// everything bullish → a setup
assert.equal(setupConflict({ cp: 110, e20: 105, e50: 100, vwap: 104, macd: 1, rsi: 62 }), null)
// everything bearish → a setup
assert.equal(setupConflict({ cp: 90, e20: 95, e50: 100, vwap: 96, macd: -1, rsi: 38 }), null)
// trend + VWAP agree, momentum merely flat (not opposed) → still a setup
assert.equal(setupConflict({ cp: 110, e20: 105, e50: 100, vwap: 104, macd: -0.1, rsi: 55 }), null)
// trend up but momentum clearly down → conflict
assert.match(setupConflict({ cp: 110, e20: 105, e50: 100, vwap: 104, macd: -1, rsi: 40 }), /momentum/i)
console.log('setupConflict: all pass')

// oiRead(): what open interest vs price says about a move
const oiSrc = html.match(/function oiRead\([\s\S]*?\r?\n}\r?\n/)?.[0]
assert.ok(oiSrc, 'oiRead() not found in index.html')
const oiRead = new Function(`${oiSrc}; return oiRead`)()
assert.match(oiRead(8.5, 5.2), /NEW LONGS/)
assert.match(oiRead(-4, 5), /SHORT COVERING/)
assert.match(oiRead(6, -5), /NEW SHORTS/)
assert.match(oiRead(-6, -5), /LONG LIQUIDATION/)
assert.match(oiRead(1, 5), /flat/i)
assert.equal(oiRead(null, 5), null)
console.log('oiRead: all pass')

// sessionVwap(): VWAP anchored at 00:00 UTC of the latest candle's day
const vwSrc = html.match(/function sessionVwap\([\s\S]*?\r?\n}\r?\n/)?.[0]
assert.ok(vwSrc, 'sessionVwap() not found in index.html')
const sessionVwap = new Function(`${vwSrc}; return sessionVwap`)()
const H = 3_600_000, D0 = Date.UTC(2026, 9, 5)
const cs = [
  { t: D0 - 2 * H, high: 100, low: 100, close: 100, vol: 1000 },  // yesterday: must be ignored
  { t: D0 - H,     high: 100, low: 100, close: 100, vol: 1000 },
  { t: D0,         high: 12,  low: 9,   close: 12,  vol: 10 },     // typical price 11
  { t: D0 + H,     high: 15,  low: 12,  close: 15,  vol: 30 },     // typical price 14
]
assert.equal(sessionVwap(cs), (11 * 10 + 14 * 30) / 40)
assert.equal(sessionVwap([{ high: 1, low: 1, close: 1, vol: 1 }]), null)   // no timestamps → caller falls back
console.log('sessionVwap: all pass')

// crowdingRead(): which side is crowded, from Binance positioning + funding (% per 8h)
const crSrc = html.match(/function crowdingRead\([\s\S]*?\r?\n}\r?\n/)?.[0]
assert.ok(crSrc, 'crowdingRead() not found in index.html')
const crowdingRead = new Function(`${crSrc}; return crowdingRead`)()
const cys = { accounts_long_pct: 73.0, accounts_long_pct_24h: 71.7, top_long_pct: 59.5, top_long_pct_24h: 58.9, taker_ratio_4h: 0.94 }
assert.match(crowdingRead(cys, 0.005), /CROWDED LONGS/)
assert.match(crowdingRead(cys, 0.005), /73% of accounts long \(rising/)
assert.match(crowdingRead({ ...cys, accounts_long_pct: 30, accounts_long_pct_24h: 35, top_long_pct: 45 }, -0.01), /CROWDED SHORTS/)
assert.match(crowdingRead({ ...cys, accounts_long_pct: 52, top_long_pct: 55 }, -0.05), /CROWDED SHORTS/)       // funding alone
const nil = { accounts_long_pct: 46.1, accounts_long_pct_24h: 37.3, top_long_pct: 53.9, top_long_pct_24h: 63.7, taker_ratio_4h: 1.0 }
assert.match(crowdingRead(nil, 0.005), /BALANCED/)
assert.match(crowdingRead({ ...cys, top_long_pct: 42 }, 0.005), /top traders lean the other way/)
assert.equal(crowdingRead(null, 0.005), null)
console.log('crowdingRead: all pass')
