// ============================================================
// TST INTERACTIVE TRADE QUIZ — v3
// 20 questions covering the most impactful chart concepts
// Procedurally generated — no live API dependency
// ============================================================

window.TST_INTERACTIVE_QUIZ = (function() {

  // ─────────────────────────────────────────
  // CORE GENERATORS
  // ─────────────────────────────────────────

  function seededRandom(seed) {
    var s = seed
    return function() {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  }

  function gaussianRandom(rand) {
    var u = 0, v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    var val = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    return Math.max(-2, Math.min(2, val))
  }

  function generateOneCandle(rand, openPrice, drift, volatility) {
    var noise = gaussianRandom(rand) * volatility
    var close = openPrice + drift + noise
    var bodyHigh = Math.max(openPrice, close)
    var bodyLow = Math.min(openPrice, close)
    var wickUp = Math.abs(gaussianRandom(rand)) * volatility * 0.35
    var wickDown = Math.abs(gaussianRandom(rand)) * volatility * 0.35
    return { open: openPrice, close: close, high: bodyHigh + wickUp, low: bodyLow - wickDown }
  }

  function buildPhase(rand, startPrice, startTime, interval, count, avgDrift, volatility, volBase, volTrendPct) {
    var candles = [], price = startPrice, t = startTime
    for (var i = 0; i < count; i++) {
      var driftThisCandle = avgDrift * (0.4 + rand() * 1.2) * (rand() > 0.15 ? 1 : -0.6)
      var c = generateOneCandle(rand, price, driftThisCandle, volatility)
      var progress = count > 1 ? i / (count - 1) : 0
      var volTrendMultiplier = 1 + (volTrendPct * progress)
      var volNoise = 0.75 + rand() * 0.5
      var volume = Math.max(5000, Math.round(volBase * volTrendMultiplier * volNoise))
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: volume })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  function buildConvergingPhase(rand, startPrice, startTime, interval, count, avgDrift, volStart, volEnd, volBase, volTrendPct) {
    var candles = [], price = startPrice, t = startTime
    for (var i = 0; i < count; i++) {
      var progress = count > 1 ? i / (count - 1) : 0
      var volatility = volStart + (volEnd - volStart) * progress
      var driftThisCandle = avgDrift * (0.4 + rand() * 1.2) * (rand() > 0.15 ? 1 : -0.6)
      var c = generateOneCandle(rand, price, driftThisCandle, volatility)
      var volNoise = 0.75 + rand() * 0.5
      var volume = Math.max(5000, Math.round(volBase * (1 + volTrendPct * progress) * volNoise))
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: volume })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  function buildLegToTarget(rand, startPrice, targetPrice, startTime, interval, count, volatility, volBase) {
    var candles = [], price = startPrice, t = startTime
    var totalMove = targetPrice - startPrice
    for (var i = 0; i < count; i++) {
      var stepDrift = (totalMove / count) * (0.6 + rand() * 0.8)
      var c = generateOneCandle(rand, price, stepDrift, volatility)
      var volNoise = 0.8 + rand() * 0.4
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.max(5000, Math.round(volBase * volNoise)) })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  // ─────────────────────────────────────────
  // PATTERN GENERATORS — all 20
  // ─────────────────────────────────────────

  // 1. BULL FLAG BREAKOUT
  function generateBullFlag(opts) {
    var rand = seededRandom(opts.seed || 42)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var leg = buildPhase(rand, price, t, interval, 16, 0.22, 0.14, 210000, 0.15)
    all = all.concat(leg.candles); price = leg.endPrice; t = leg.endTime

    var flag = buildPhase(rand, price, t, interval, 13, 0.005, 0.035, 95000, -0.60)
    all = all.concat(flag.candles); price = flag.endPrice; t = flag.endTime

    var breakout = buildPhase(rand, price, t, interval, 9, 0.20, 0.16, 260000, 0.35)
    all = all.concat(breakout.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: leg.candles.length - 1 },
        ideal: { start: leg.candles.length + flag.candles.length - 2, end: leg.candles.length + flag.candles.length + 2 },
        tooLate: { start: leg.candles.length + flag.candles.length + 5, end: all.length - 1 }
      }
    }
  }

  // 2. VWAP RECLAIM
  function generateVWAPReclaim(opts) {
    var rand = seededRandom(opts.seed || 111)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Trading above VWAP — steady uptrend
    var above = buildPhase(rand, price, t, interval, 10, 0.12, 0.09, 150000, 0.05)
    all = all.concat(above.candles); price = above.endPrice; t = above.endTime

    // Dip below VWAP — quick sell, declining volume (not a real breakdown)
    var dip = buildPhase(rand, price, t, interval, 7, -0.14, 0.10, 100000, -0.40)
    all = all.concat(dip.candles); price = dip.endPrice; t = dip.endTime

    var reclaimStart = all.length

    // Reclaim candle — strong green bar back above VWAP on elevated volume
    var reclaim = buildPhase(rand, price, t, interval, 2, 0.22, 0.08, 220000, 0.20)
    all = all.concat(reclaim.candles); price = reclaim.endPrice; t = reclaim.endTime

    var reclaimEnd = all.length - 1

    // Continuation above VWAP
    var cont = buildPhase(rand, price, t, interval, 8, 0.14, 0.10, 180000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: reclaimStart - 1 },
        ideal: { start: reclaimStart, end: reclaimStart + 2 },
        tooLate: { start: reclaimEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 3. SUPPORT & RESISTANCE BOUNCE
  function generateSupportBounce(opts) {
    var rand = seededRandom(opts.seed || 222)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var supportLevel = startPrice

    // First touch and bounce — establishes the level
    var up1 = buildPhase(rand, price, t, interval, 8, 0.18, 0.10, 160000, 0.05)
    all = all.concat(up1.candles); price = up1.endPrice; t = up1.endTime
    var down1 = buildLegToTarget(rand, price, supportLevel + 0.1, t, interval, 7, 0.09, 110000)
    all = all.concat(down1.candles); price = down1.endPrice; t = down1.endTime

    // Second approach — tests support again
    var up2 = buildPhase(rand, price, t, interval, 6, 0.14, 0.09, 130000, 0.05)
    all = all.concat(up2.candles); price = up2.endPrice; t = up2.endTime
    var down2 = buildLegToTarget(rand, price, supportLevel + 0.05, t, interval, 6, 0.09, 105000)
    all = all.concat(down2.candles); price = down2.endPrice; t = down2.endTime

    var bounceStart = all.length

    // The bounce — strong rejection off support with volume
    var bounce = buildPhase(rand, price, t, interval, 2, 0.20, 0.10, 200000, 0.15)
    all = all.concat(bounce.candles); price = bounce.endPrice; t = bounce.endTime

    var bounceEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 8, 0.16, 0.12, 170000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: bounceStart - 1 },
        ideal: { start: bounceStart, end: bounceStart + 2 },
        tooLate: { start: bounceEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 4. BREAKOUT FROM CONSOLIDATION (Blue Sky)
  function generateBreakoutConsolidation(opts) {
    var rand = seededRandom(opts.seed || 333)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Long tight base — very low volatility, low volume (coiling)
    var base = buildPhase(rand, price, t, interval, 20, 0.002, 0.03, 70000, -0.20)
    all = all.concat(base.candles); price = base.endPrice; t = base.endTime

    var breakStart = all.length

    // Explosive breakout — large candle, massive volume spike (no overhead supply)
    var breakout = buildPhase(rand, price, t, interval, 3, 0.28, 0.14, 310000, 0.50)
    all = all.concat(breakout.candles); price = breakout.endPrice; t = breakout.endTime

    var breakEnd = all.length - 1

    // Blue sky continuation — no resistance, steady grind higher
    var cont = buildPhase(rand, price, t, interval, 10, 0.18, 0.12, 210000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: breakStart - 1 },
        ideal: { start: breakStart, end: breakStart + 2 },
        tooLate: { start: breakEnd + 5, end: all.length - 1 }
      }
    }
  }

  // 5. HEAD & SHOULDERS
  function generateHeadShoulders(opts) {
    var rand = seededRandom(opts.seed || 202)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var neckline = startPrice

    var ls_up = buildLegToTarget(rand, price, price + 2.2, t, interval, 6, 0.10, 160000)
    all = all.concat(ls_up.candles); price = ls_up.endPrice; t = ls_up.endTime
    var ls_down = buildLegToTarget(rand, price, neckline + 0.2, t, interval, 6, 0.10, 130000)
    all = all.concat(ls_down.candles); price = ls_down.endPrice; t = ls_down.endTime

    var h_up = buildLegToTarget(rand, price, price + 3.8, t, interval, 7, 0.12, 200000)
    all = all.concat(h_up.candles); price = h_up.endPrice; t = h_up.endTime
    var h_down = buildLegToTarget(rand, price, neckline + 0.1, t, interval, 7, 0.12, 150000)
    all = all.concat(h_down.candles); price = h_down.endPrice; t = h_down.endTime

    var rs_up = buildLegToTarget(rand, price, price + 2.0, t, interval, 6, 0.10, 140000)
    all = all.concat(rs_up.candles); price = rs_up.endPrice; t = rs_up.endTime
    var rs_down = buildLegToTarget(rand, price, neckline, t, interval, 6, 0.10, 130000)
    all = all.concat(rs_down.candles); price = rs_down.endPrice; t = rs_down.endTime

    var neckZoneStart = all.length

    var breakDown = buildPhase(rand, price, t, interval, 5, -0.24, 0.15, 220000, 0.45)
    all = all.concat(breakDown.candles); price = breakDown.endPrice; t = breakDown.endTime

    var neckZoneEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 7, -0.16, 0.13, 180000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: neckZoneStart - 1 },
        ideal: { start: neckZoneStart, end: neckZoneStart + 2 },
        tooLate: { start: neckZoneEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 6. DOUBLE TOP
  function generateDoubleTop(opts) {
    var rand = seededRandom(opts.seed || 444)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var topLevel = startPrice + 3.5
    var neckline = startPrice + 0.5

    // First push to top
    var up1 = buildLegToTarget(rand, price, topLevel, t, interval, 8, 0.12, 190000)
    all = all.concat(up1.candles); price = up1.endPrice; t = up1.endTime

    // Pullback to neckline
    var pb = buildLegToTarget(rand, price, neckline, t, interval, 7, 0.10, 130000)
    all = all.concat(pb.candles); price = pb.endPrice; t = pb.endTime

    // Second push — slightly weaker, barely reaches prior top
    var up2 = buildLegToTarget(rand, price, topLevel - 0.15, t, interval, 8, 0.10, 160000)
    all = all.concat(up2.candles); price = up2.endPrice; t = up2.endTime

    // Rejection — starts to roll over
    var reject = buildPhase(rand, price, t, interval, 4, -0.12, 0.09, 140000, 0.10)
    all = all.concat(reject.candles); price = reject.endPrice; t = reject.endTime

    var breakStart = all.length

    // Neckline break — confirms the double top
    var neckBreak = buildPhase(rand, price, t, interval, 4, -0.22, 0.14, 230000, 0.40)
    all = all.concat(neckBreak.candles); price = neckBreak.endPrice; t = neckBreak.endTime

    var breakEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 7, -0.16, 0.12, 180000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: breakStart - 1 },
        ideal: { start: breakStart, end: breakStart + 2 },
        tooLate: { start: breakEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 7. GAP AND GO
  function generateGapAndGo(opts) {
    var rand = seededRandom(opts.seed || 555)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Pre-gap base (previous day close area)
    var preGap = buildPhase(rand, price, t, interval, 6, 0.01, 0.04, 80000, 0)
    all = all.concat(preGap.candles); price = preGap.endPrice; t = preGap.endTime

    // The gap — price jumps up significantly (simulated as a strong first candle)
    var gapOpen = price + 2.8
    var gapCandle = generateOneCandle(rand, gapOpen, 0.30, 0.12)
    all.push({ time: t, open: gapOpen, high: gapCandle.high, low: Math.max(gapOpen - 0.20, gapCandle.low), close: gapCandle.close, volume: 320000 })
    price = gapCandle.close; t += interval

    var goStart = all.length

    // Gap and go — continues higher off the open with strong volume
    var go = buildPhase(rand, price, t, interval, 3, 0.22, 0.12, 280000, 0.30)
    all = all.concat(go.candles); price = go.endPrice; t = go.endTime

    var goEnd = all.length - 1

    // Later fade — opportunity passes
    var fade = buildPhase(rand, price, t, interval, 9, -0.10, 0.12, 140000, 0.10)
    all = all.concat(fade.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: goStart - 2 },
        ideal: { start: goStart, end: goStart + 2 },
        tooLate: { start: goEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 8. TRENDLINE BREAK
  function generateTrendlineBreak(opts) {
    var rand = seededRandom(opts.seed || 101)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var up = buildPhase(rand, price, t, interval, 18, 0.16, 0.10, 170000, 0.05)
    all = all.concat(up.candles); price = up.endPrice; t = up.endTime

    var fade = buildPhase(rand, price, t, interval, 6, 0.04, 0.08, 130000, -0.15)
    all = all.concat(fade.candles); price = fade.endPrice; t = fade.endTime

    var breakZoneStart = all.length

    var breakDown = buildPhase(rand, price, t, interval, 5, -0.22, 0.16, 210000, 0.40)
    all = all.concat(breakDown.candles); price = breakDown.endPrice; t = breakDown.endTime

    var breakZoneEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 8, -0.18, 0.14, 190000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: breakZoneStart - 1 },
        ideal: { start: breakZoneStart, end: breakZoneStart + 2 },
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 9. FIBONACCI RETRACEMENT HOLD
  function generateFibRetracement(opts) {
    var rand = seededRandom(opts.seed || 666)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Strong move up — establishes the range for Fib measurement
    var moveUp = buildPhase(rand, price, t, interval, 14, 0.24, 0.13, 200000, 0.10)
    all = all.concat(moveUp.candles); price = moveUp.endPrice; t = moveUp.endTime
    var topPrice = price

    // Pullback to 61.8% retracement — controlled, low volume
    var fibTarget = startPrice + (topPrice - startPrice) * 0.382 // 61.8% retrace from top = 38.2% of move remaining
    var pullback = buildLegToTarget(rand, price, fibTarget + 0.2, t, interval, 10, 0.09, 95000)
    all = all.concat(pullback.candles); price = pullback.endPrice; t = pullback.endTime

    var bounceStart = all.length

    // Bounce off Fib — strong rejection, volume returns
    var bounce = buildPhase(rand, price, t, interval, 2, 0.22, 0.11, 210000, 0.20)
    all = all.concat(bounce.candles); price = bounce.endPrice; t = bounce.endTime

    var bounceEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 9, 0.18, 0.12, 190000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: bounceStart - 1 },
        ideal: { start: bounceStart, end: bounceStart + 2 },
        tooLate: { start: bounceEnd + 4, end: all.length - 1 }
      }
    }
  }

  // 10. ASCENDING TRIANGLE
  function generateAscendingTriangle(opts) {
    var rand = seededRandom(opts.seed || 303)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var resistance = startPrice + 3

    for (var wave = 0; wave < 3; wave++) {
      var toResistance = buildLegToTarget(rand, price, resistance - (0.15 * rand()), t, interval, 5, 0.08, 130000)
      all = all.concat(toResistance.candles); price = toResistance.endPrice; t = toResistance.endTime
      var lowTarget = resistance - 2.4 + (wave * 0.6)
      var toLow = buildLegToTarget(rand, price, lowTarget, t, interval, 5, 0.08, 110000)
      all = all.concat(toLow.candles); price = toLow.endPrice; t = toLow.endTime
    }

    var breakZoneStart = all.length

    var breakout = buildPhase(rand, price, t, interval, 6, 0.22, 0.15, 230000, 0.45)
    all = all.concat(breakout.candles); price = breakout.endPrice; t = breakout.endTime

    var breakZoneEnd = all.length - 1

    var cont = buildPhase(rand, price, t, interval, 7, 0.16, 0.14, 190000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: breakZoneStart - 1 },
        ideal: { start: breakZoneStart, end: breakZoneStart + 2 },
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 }
      }
    }
  }

  // MC GENERATORS (multiple choice — no zones needed)

  // 11. FAKE BREAKOUT / STOP HUNT
  function generateFakeBreakout(opts) {
    var rand = seededRandom(opts.seed || 77)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var leg = buildPhase(rand, price, t, interval, 13, 0.20, 0.14, 190000, 0.10)
    all = all.concat(leg.candles); price = leg.endPrice; t = leg.endTime

    // Consolidation — volume stays FLAT (not declining — key tell)
    var flag = buildPhase(rand, price, t, interval, 11, 0.00, 0.04, 115000, 0.10)
    all = all.concat(flag.candles); price = flag.endPrice; t = flag.endTime

    // Weak breakout — small drift, low volume (no conviction)
    var fakeBreak = buildPhase(rand, price, t, interval, 5, 0.10, 0.10, 85000, -0.10)
    all = all.concat(fakeBreak.candles); price = fakeBreak.endPrice; t = fakeBreak.endTime

    // Reversal — strong red candles, volume spikes on the way down
    var reversal = buildPhase(rand, price, t, interval, 7, -0.30, 0.18, 240000, 0.30)
    all = all.concat(reversal.candles)

    return { candles: all, zones: null }
  }

  // 12. GREEN TO RED REVERSAL
  function generateGreenToRed(opts) {
    var rand = seededRandom(opts.seed || 888)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Opens strong — moves well above prior close
    var morning = buildPhase(rand, price, t, interval, 8, 0.20, 0.12, 200000, 0.10)
    all = all.concat(morning.candles); price = morning.endPrice; t = morning.endTime

    // Stall at highs — volume drying up (distribution)
    var stall = buildPhase(rand, price, t, interval, 5, 0.01, 0.06, 85000, -0.30)
    all = all.concat(stall.candles); price = stall.endPrice; t = stall.endTime

    // Cross back below open (goes red) — volume picks up on the sell
    var gtr = buildPhase(rand, price, t, interval, 9, -0.24, 0.14, 220000, 0.35)
    all = all.concat(gtr.candles)

    return { candles: all, zones: null }
  }

  // 13. KILL CANDLE
  function generateKillCandle(opts) {
    var rand = seededRandom(opts.seed || 999)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Extended uptrend — multiple legs, volume declining slightly
    var up = buildPhase(rand, price, t, interval, 18, 0.19, 0.11, 180000, -0.15)
    all = all.concat(up.candles); price = up.endPrice; t = up.endTime

    // Kill candle — massive red bar, closes near lows, volume explodes
    var body = price * 0.035
    var killCandle = { time: t, open: price + 0.15, high: price + 0.30, low: price - body - 0.20, close: price - body, volume: 380000 }
    all.push(killCandle); price = killCandle.close; t += interval

    // Continuation — confirms the reversal
    var down = buildPhase(rand, price, t, interval, 8, -0.18, 0.13, 200000, 0.10)
    all = all.concat(down.candles)

    return { candles: all, zones: null }
  }

  // 14. WEAK SECOND LEG = REVERSAL WARNING
  function generateWeakSecondLeg(opts) {
    var rand = seededRandom(opts.seed || 1111)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // First leg — strong, high volume
    var leg1 = buildPhase(rand, price, t, interval, 10, 0.26, 0.14, 230000, 0.10)
    all = all.concat(leg1.candles); price = leg1.endPrice; t = leg1.endTime

    // Pullback
    var pb = buildPhase(rand, price, t, interval, 6, -0.10, 0.09, 110000, -0.20)
    all = all.concat(pb.candles); price = pb.endPrice; t = pb.endTime

    // Second leg — shorter range, much lower volume (the key warning signal)
    var leg2 = buildPhase(rand, price, t, interval, 8, 0.12, 0.10, 95000, -0.25)
    all = all.concat(leg2.candles); price = leg2.endPrice; t = leg2.endTime

    // Reversal — sellers take over
    var reversal = buildPhase(rand, price, t, interval, 9, -0.22, 0.14, 210000, 0.30)
    all = all.concat(reversal.candles)

    return { candles: all, zones: null }
  }

  // 15. EXHAUSTION / PARABOLIC MOVE
  function generateParabolic(opts) {
    var rand = seededRandom(opts.seed || 1212)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Normal uptrend
    var base = buildPhase(rand, price, t, interval, 8, 0.15, 0.10, 160000, 0.05)
    all = all.concat(base.candles); price = base.endPrice; t = base.endTime

    // Acceleration — each leg gets steeper and faster (parabolic)
    var acc1 = buildPhase(rand, price, t, interval, 5, 0.30, 0.14, 220000, 0.20)
    all = all.concat(acc1.candles); price = acc1.endPrice; t = acc1.endTime

    var acc2 = buildPhase(rand, price, t, interval, 4, 0.42, 0.18, 290000, 0.30)
    all = all.concat(acc2.candles); price = acc2.endPrice; t = acc2.endTime

    // Climax candle — biggest green bar, highest volume
    var climax = buildPhase(rand, price, t, interval, 2, 0.55, 0.20, 380000, 0.10)
    all = all.concat(climax.candles); price = climax.endPrice; t = climax.endTime

    // Sharp reversal — exhaustion, sellers overwhelm
    var crash = buildPhase(rand, price, t, interval, 8, -0.38, 0.22, 300000, -0.10)
    all = all.concat(crash.candles)

    return { candles: all, zones: null }
  }

  // 16. V-SHAPE RECOVERY
  function generateVShape(opts) {
    var rand = seededRandom(opts.seed || 1313)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Stable start
    var stable = buildPhase(rand, price, t, interval, 5, 0.01, 0.04, 90000, 0)
    all = all.concat(stable.candles); price = stable.endPrice; t = stable.endTime

    // Sharp flush — fast and deep
    var flush = buildPhase(rand, price, t, interval, 6, -0.32, 0.20, 270000, 0.40)
    all = all.concat(flush.candles); price = flush.endPrice; t = flush.endTime

    // V-bottom — single candle holds with a long lower wick
    var bottom = generateOneCandle(rand, price, 0.05, 0.08)
    all.push({ time: t, open: bottom.open, high: bottom.high, low: bottom.low - 0.30, close: price + 0.10, volume: 260000 })
    price = price + 0.10; t += interval

    // Strong recovery — equal speed to the selloff
    var recovery = buildPhase(rand, price, t, interval, 7, 0.30, 0.16, 250000, -0.10)
    all = all.concat(recovery.candles)

    return { candles: all, zones: null }
  }

  // 17. ACCUMULATION
  function generateAccumulation(opts) {
    var rand = seededRandom(opts.seed || 707)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    for (var i = 0; i < 22; i++) {
      var drift = (rand() > 0.5 ? 1 : -0.8) * (0.02 + rand() * 0.06)
      var c = generateOneCandle(rand, price, drift, 0.06)
      var isUp = c.close >= c.open
      var vol = isUp ? (140000 + rand() * 60000) : (60000 + rand() * 30000)
      all.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.round(vol) })
      price = c.close; t += interval
    }

    var breakout = buildPhase(rand, price, t, interval, 6, 0.18, 0.13, 220000, 0.40)
    all = all.concat(breakout.candles)

    return { candles: all, zones: null }
  }

  // 18. MORNING FLUSH
  function generateMorningFlush(opts) {
    var rand = seededRandom(opts.seed || 1414)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Strong gap up open — first candle big green
    var gapOpen = price + 2.5
    var open1 = generateOneCandle(rand, gapOpen, 0.25, 0.10)
    all.push({ time: t, open: gapOpen, high: open1.high, low: gapOpen - 0.10, close: open1.close, volume: 300000 })
    price = open1.close; t += interval

    // One more push higher — lures in buyers
    var push = buildPhase(rand, price, t, interval, 3, 0.14, 0.09, 220000, -0.10)
    all = all.concat(push.candles); price = push.endPrice; t = push.endTime

    // Flush begins — sellers crush it, volume massive
    var flush = buildPhase(rand, price, t, interval, 10, -0.28, 0.18, 280000, 0.20)
    all = all.concat(flush.candles); price = flush.endPrice; t = flush.endTime

    // Bounce attempt — weak, lower volume (dead cat)
    var bounce = buildPhase(rand, price, t, interval, 5, 0.08, 0.09, 110000, -0.20)
    all = all.concat(bounce.candles)

    return { candles: all, zones: null }
  }

  // 19. HEALTHY PULLBACK vs BREAKDOWN
  function generateHealthyPullback(opts) {
    var rand = seededRandom(opts.seed || 606)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var up = buildPhase(rand, price, t, interval, 14, 0.20, 0.13, 180000, 0.05)
    all = all.concat(up.candles); price = up.endPrice; t = up.endTime

    var pullback = buildPhase(rand, price, t, interval, 8, -0.10, 0.08, 100000, -0.30)
    all = all.concat(pullback.candles); price = pullback.endPrice; t = pullback.endTime

    var bounce = buildPhase(rand, price, t, interval, 9, 0.22, 0.14, 200000, 0.35)
    all = all.concat(bounce.candles)

    return { candles: all, zones: null }
  }

  // 20. PENNANT
  function generatePennant(opts) {
    var rand = seededRandom(opts.seed || 404)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var pole = buildPhase(rand, price, t, interval, 10, 0.30, 0.16, 230000, 0.10)
    all = all.concat(pole.candles); price = pole.endPrice; t = pole.endTime

    var pennant = buildConvergingPhase(rand, price, t, interval, 12, 0.01, 0.09, 0.02, 90000, -0.55)
    all = all.concat(pennant.candles); price = pennant.endPrice; t = pennant.endTime

    var breakZoneStart = all.length

    var breakout = buildPhase(rand, price, t, interval, 8, 0.20, 0.15, 250000, 0.40)
    all = all.concat(breakout.candles)

    var breakZoneEnd = all.length - 1

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: pole.candles.length + Math.floor(pennant.candles.length * 0.7) - 1 },
        ideal: { start: breakZoneStart, end: breakZoneStart + 2 },
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 }
      }
    }
  }

  // ─────────────────────────────────────────
  // QUESTION BANK — 20 questions
  // ─────────────────────────────────────────
  var QUESTIONS = [

    // ─── ZONE CLICK (10) ───
    {
      id: 'iq_z1_bullflag',
      title: 'Bull Flag Breakout — Find Your Entry',
      type: 'zone',
      generator: 'bullFlag',
      seed: 42,
      question: 'This stock just formed a bull flag. The uptrend leg ran hard, then price consolidated tightly on declining volume. Click directly on the chart where you would enter this trade.',
      zoneFeedback: {
        tooEarly: 'Too early — you entered during the initial move before any consolidation formed. There was no confirmed setup yet. Entering here means no defined risk and no confirmation the move continues.',
        ideal: 'Perfect entry — you caught the breakout right as price cleared the consolidation on volume. Confirmed structure, defined risk below the flag low, real buyers stepping in.',
        tooLate: 'Too late — the move already extended before you clicked. Chasing here means poor risk/reward and most of the move is behind you.'
      }
    },
    {
      id: 'iq_z2_vwap',
      title: 'VWAP Reclaim — Find Your Entry',
      type: 'zone',
      generator: 'vwapReclaim',
      seed: 111,
      question: 'This stock was trending above VWAP, dipped below it on light volume, then reclaimed it sharply. Click where you would enter long on the VWAP reclaim.',
      zoneFeedback: {
        tooEarly: 'Too early — price was still below VWAP when you clicked. You need the reclaim candle to close back above VWAP with volume before entering. Below VWAP is no man\'s land.',
        ideal: 'Strong entry — you entered right as price reclaimed VWAP on elevated volume. The low-volume dip showed no real selling pressure and the reclaim confirmed buyers took control.',
        tooLate: 'Too late — the reclaim already ran by the time you clicked. The best entry is the reclaim candle itself, not several candles later.'
      }
    },
    {
      id: 'iq_z3_support',
      title: 'Support Bounce — Find Your Entry',
      type: 'zone',
      generator: 'supportBounce',
      seed: 222,
      question: 'This stock has tested and held the same support level twice. Price is pulling back to that level a third time. Click where you would enter long on the bounce.',
      zoneFeedback: {
        tooEarly: 'Too early — price was still falling toward support when you clicked. You need confirmation that the level is actually holding before entering. Catching a falling knife is not a support bounce.',
        ideal: 'Strong entry — you entered on the rejection candle at support showing buyers defending the level. Three successful tests of support with a clean bounce entry is one of the highest probability setups.',
        tooLate: 'Too late — the bounce already ran well off the lows by the time you clicked. The edge is entering as close to support as possible with confirmation, not chasing it higher.'
      }
    },
    {
      id: 'iq_z4_bluesky',
      title: 'Blue Sky Breakout — Find Your Entry',
      type: 'zone',
      generator: 'breakoutConsolidation',
      seed: 333,
      question: 'This stock coiled in a tight base for weeks with very low volume. Now it\'s breaking out above ALL prior resistance with massive volume. Click where you would enter.',
      zoneFeedback: {
        tooEarly: 'Too early — price was still inside the base, below resistance. There was no breakout confirmation yet. Buying inside a base is anticipating the move, not trading the setup.',
        ideal: 'Excellent entry — you entered right on the breakout candle with volume confirming real conviction. Blue sky setups have no overhead resistance — this is where size is appropriate.',
        tooLate: 'Too late — the initial breakout candle already extended significantly. In a blue sky setup the best risk/reward is the first breakout candle, not several candles into the move.'
      }
    },
    {
      id: 'iq_z5_hs',
      title: 'Head & Shoulders — Find Your Short Entry',
      type: 'zone',
      generator: 'headShoulders',
      seed: 202,
      question: 'Classic head and shoulders top has formed — left shoulder, higher head, right shoulder that failed to match the head. Click where you would enter SHORT.',
      zoneFeedback: {
        tooEarly: 'Too early — the pattern was not confirmed yet. During shoulder formation price could easily have made another new high. Shorting before the neckline breaks means fighting a pattern that hasn\'t confirmed.',
        ideal: 'Strong short entry — this is the neckline break where the pattern confirms. Volume picked up on the break showing real sellers stepped in. This is the moment the reversal is confirmed, not before.',
        tooLate: 'Too late — the breakdown already ran. The best short entry is the neckline break itself. Entering here means chasing a move that\'s already extended.'
      }
    },
    {
      id: 'iq_z6_doubletop',
      title: 'Double Top — Find Your Short Entry',
      type: 'zone',
      generator: 'doubleTop',
      seed: 444,
      question: 'This stock made a high, pulled back, then rallied back to nearly the same high but couldn\'t break through. Now it\'s rolling over. Click where you would enter SHORT.',
      zoneFeedback: {
        tooEarly: 'Too early — the double top wasn\'t confirmed yet. At the second peak, price could still break through and continue. The pattern is only confirmed when the neckline breaks.',
        ideal: 'Strong short entry — you entered on the neckline break confirming the double top. Two failed attempts at the same level with a decisive break of the prior low is the confirmation signal.',
        tooLate: 'Too late — the breakdown already extended. The edge in a double top is the neckline break, not chasing the move after it runs.'
      }
    },
    {
      id: 'iq_z7_gapgo',
      title: 'Gap and Go — Find Your Entry',
      type: 'zone',
      generator: 'gapAndGo',
      seed: 555,
      question: 'This stock gapped up significantly at the open on news. The first candle is strong. Click where you would enter to trade the Gap and Go strategy.',
      zoneFeedback: {
        tooEarly: 'Too early — you clicked before the gap candle. You can\'t enter before the open. The Gap and Go entry is the first candle or the first pullback right after open, not pre-market.',
        ideal: 'Strong entry — you entered in the first candles right after the gap with momentum and volume confirming the move. Early, controlled, with the trend.',
        tooLate: 'Too late — Gap and Go trades have a short window. Once the stock fades from its morning highs the setup is over. You missed the move.'
      }
    },
    {
      id: 'iq_z8_trendline',
      title: 'Trendline Break — Find Your Short Entry',
      type: 'zone',
      generator: 'trendlineBreak',
      seed: 101,
      question: 'This stock was respecting a rising trendline for a long time. It just closed below it with increasing volume. Click where you would enter SHORT.',
      zoneFeedback: {
        tooEarly: 'Too early — the trendline was still intact. Shorting a stock respecting an uptrend before it breaks means fighting the trend with no confirmation.',
        ideal: 'Strong short entry — you shorted right as price closed below the trendline with volume confirming real sellers. This is the break, not a temporary dip.',
        tooLate: 'Too late — the breakdown already ran significantly. The best risk/reward on a trendline break is right at the break, not after it extends.'
      }
    },
    {
      id: 'iq_z9_fib',
      title: 'Fibonacci Retracement Hold — Find Your Entry',
      type: 'zone',
      generator: 'fibRetracement',
      seed: 666,
      question: 'This stock made a strong move up then pulled back roughly 60% of the move — right to the 61.8% Fibonacci level. Click where you would enter long on the Fib hold.',
      zoneFeedback: {
        tooEarly: 'Too early — price was still pulling back when you clicked. Entering during a pullback before it holds a key level means you have no confirmation. Wait for the rejection.',
        ideal: 'Strong entry — you entered right at the Fibonacci hold with a bounce candle confirming buyers defended the level. The 61.8% retrace is the deepest common pullback in an uptrend — a hold here is high probability.',
        tooLate: 'Too late — the bounce off the Fib level already ran. The edge is the bounce candle itself, not several candles after the recovery.'
      }
    },
    {
      id: 'iq_z10_pennant',
      title: 'Pennant Continuation — Find Your Entry',
      type: 'zone',
      generator: 'pennant',
      seed: 404,
      question: 'This stock made a sharp strong move up (the flagpole), then formed a tightening pennant as price coiled on declining volume. Click where you would enter the continuation.',
      zoneFeedback: {
        tooEarly: 'Too early — the pennant was still forming and hadn\'t broken out yet. Mid-consolidation entries have no confirmation and poor risk definition.',
        ideal: 'Strong entry — this is the breakout from the pennant continuing the original direction. Volume returned and price cleared the consolidation range — the highest-probability entry point.',
        tooLate: 'Too late — the continuation already ran. The edge in a pennant is the breakout candle itself.'
      }
    },

    // ─── MULTIPLE CHOICE (10) ───
    {
      id: 'iq_mc1_fakebreakout',
      title: 'Fake Breakout Recognition',
      generator: 'fakeBreakout',
      seed: 77,
      question: 'This stock formed what looks like a flag pattern and attempted a breakout. Look carefully at the volume during consolidation and the breakout candle. What is happening?',
      choices: [
        'Clean flag setup — the breakout is valid, buy immediately',
        'Volume stayed elevated during consolidation (should have declined) and the breakout came on weak volume — this is a low-conviction move likely to fail',
        'The pattern is identical to a healthy flag — just a different ticker',
        'Volume never matters for flags — only the price structure counts'
      ],
      correct: 1,
      explanation: 'This is a failed breakout. In a healthy flag, volume DECLINES during consolidation — sellers are passive, just pausing. Here volume stayed elevated, meaning real selling pressure was present throughout. The breakout then came on weak volume with no real buyers behind it. Both signals together predicted the reversal. Always check volume during consolidation and at the breakout moment — price alone is not enough.'
    },
    {
      id: 'iq_mc2_greenred',
      title: 'Green to Red — What Does It Signal?',
      generator: 'greenToRed',
      seed: 888,
      question: 'This stock opened strong and pushed higher for the first part of the session. Then volume dried up at the highs and price crossed back below the opening price — going red on the day. What does this tell you?',
      choices: [
        'Buy immediately — stocks always recover from intraday dips',
        'This is a Green to Red reversal — early buyers are trapped, sellers are now in control, and the path of least resistance is lower for the rest of the session',
        'Green to Red moves are always just noise — they reverse back green by close',
        'This only matters for swing traders, not day traders'
      ],
      correct: 1,
      explanation: 'Green to Red is one of the most reliable intraday warning signals. When a stock opens positive, makes early buyers feel great, then crosses back below the prior close — those early buyers are now underwater and will sell into any bounce. The sellers who shorted the high are profitable and not covering. Volume drying up at the highs told you distribution was happening. Once it goes red, the sellers have control for the session.'
    },
    {
      id: 'iq_mc3_killcandle',
      title: 'Kill Candle — What Happens Next?',
      generator: 'killCandle',
      seed: 999,
      question: 'This stock was in a steady uptrend then printed a massive red candle closing near its lows on the highest volume of the entire move. What does this candle tell you and what would you expect next?',
      choices: [
        'One candle means nothing — the uptrend will resume immediately',
        'This is a kill candle — massive red body closing near the lows on explosive volume signals that real sellers stepped in aggressively. The uptrend is likely over and lower prices are ahead',
        'High volume on a down candle is always bullish — it means buyers are absorbing supply',
        'You should buy immediately since the selloff is overdone'
      ],
      correct: 1,
      explanation: 'A kill candle is one of the clearest reversal signals in technical analysis. The combination of a large red body (sellers dominated the entire candle from open to close), a close near the lows (no recovery attempt by buyers), and volume that dwarfs everything before it — tells you institutional sellers stepped in with size. This is not a dip to buy. The balance of power shifted from buyers to sellers on this candle and subsequent price action typically confirms the reversal.'
    },
    {
      id: 'iq_mc4_weakleg',
      title: 'Weak Second Leg — What Does It Mean?',
      generator: 'weakSecondLeg',
      seed: 1111,
      question: 'This stock made a strong first leg up with heavy volume, pulled back, then attempted a second leg. The second leg is noticeably shorter and volume is significantly lower than the first leg. What does this tell you?',
      choices: [
        'The second leg being shorter means nothing — stocks move in random increments',
        'A weak second leg with declining volume signals buyer exhaustion — each push is requiring less seller resistance but also attracting fewer buyers. A reversal is likely forming',
        'Lower volume on the second leg is bullish — it means no one is selling',
        'You should size up here since the trend is clearly continuing'
      ],
      correct: 1,
      explanation: 'Weak second legs are one of the most reliable early warning signals of a trend reversal. When the first leg up is strong and high volume but the second attempt covers less ground on lower volume — buyers are losing conviction. They\'re paying up for a move that\'s attracting fewer and fewer participants. The sellers don\'t even need to be aggressive — the buyers are simply running out. This is where disciplined traders start tightening stops or looking for exits rather than adding to positions.'
    },
    {
      id: 'iq_mc5_parabolic',
      title: 'Parabolic Move — What Is the Risk?',
      generator: 'parabolic',
      seed: 1212,
      question: 'This stock has been accelerating — each leg up is larger and faster than the last, with volume exploding on every push. It just printed its biggest candle yet. What is the highest-probability next move?',
      choices: [
        'Buy aggressively — parabolic moves always continue for weeks',
        'Parabolic moves end violently. The acceleration cannot be sustained — when the last buyer buys, there is no one left to push it higher and the reversal happens with the same speed as the move up',
        'Parabolic moves always consolidate sideways before continuing — this is safe to hold',
        'Volume increasing on each candle confirms the trend will continue indefinitely'
      ],
      correct: 1,
      explanation: 'Parabolic moves are the most dangerous moment to be a new buyer. When a stock accelerates to vertical — each candle bigger than the last, volume exploding — it means FOMO is driving the buying, not fundamental value. At some point the last buyer buys. There is no more fuel. The reversal from a parabolic move can be just as fast and violent as the move up — because everyone who bought near the top has the same stop loss and it creates a cascade when it breaks. The correct move is to take profits into parabolic strength, not to chase it.'
    },
    {
      id: 'iq_mc6_vshape',
      title: 'V-Shape Recovery — Real or Dead Cat?',
      generator: 'vShape',
      seed: 1313,
      question: 'This stock flushed sharply on huge volume then immediately started recovering at the same speed it sold off. The recovery is also on strong volume. How do you read this?',
      choices: [
        'Never buy a stock that just dropped — it will always go lower',
        'The speed and volume of the recovery matching the selloff suggests a genuine V-shape, not a dead cat bounce. Real V-shapes show immediate aggressive buying — not a slow grind — meaning the selling was a liquidity flush, not a fundamental change',
        'You should wait at least two weeks before buying anything that dropped',
        'V-shapes never happen — all recoveries are slow grinds'
      ],
      correct: 1,
      explanation: 'V-shape recoveries are real and they show up regularly in liquid stocks. The key difference between a real V and a dead cat bounce is the character of the recovery — specifically how fast and how much volume accompanies it. When the recovery is as aggressive as the selloff, with volume still elevated, it means buyers stepped in with the same conviction the sellers had. A dead cat bounce is slow, grinds higher on low volume, and runs out of steam quickly. A real V recovery is sharp and immediate. Price and volume together tell the story.'
    },
    {
      id: 'iq_mc7_accumulation',
      title: 'Accumulation or Distribution?',
      generator: 'accumulation',
      seed: 707,
      question: 'This stock has been going sideways for weeks. Look carefully at the volume on up days versus down days. What is most likely happening beneath the surface?',
      choices: [
        'Sideways price action with any volume pattern is always meaningless — wait for a clear breakout with no prior analysis',
        'Volume is heavier on green days and lighter on red days — this is accumulation. Smart money is buying the dips quietly while retail sells into weakness, coiling the spring before a breakout',
        'This is clearly distribution — the stock is about to collapse',
        'Only the price range matters in consolidation — volume is irrelevant'
      ],
      correct: 1,
      explanation: 'Accumulation is what happens before a breakout — and the volume pattern is how you identify it before price tips its hand. When green days carry heavier volume than red days in a sideways range, it means buyers are absorbing supply. Every time sellers push it down, buyers step in with size. Every time it ticks up, sellers are thin. That asymmetry builds pressure under the surface. When supply finally runs out, the breakout happens on heavy volume — exactly what followed here.'
    },
    {
      id: 'iq_mc8_morningflush',
      title: 'Morning Flush — Buy the Dip or Stay Out?',
      generator: 'morningFlush',
      seed: 1414,
      question: 'This stock gapped up strongly at open, pushed higher for a few candles attracting buyers, then flushed hard on massive volume and gave back most of the gap. What is the correct read?',
      choices: [
        'Buy immediately at the low — gap ups always recover by end of day',
        'This is a morning flush or gap fill trap. The stock lured in gap buyers then flushed them out hard. Without a clean base and reclaim of a key level, the safest move is to wait for structure — not catch the knife on the way down',
        'The flush is complete — the bigger the red candle the more bullish the setup',
        'Gap ups never fail so this is always a buy'
      ],
      correct: 1,
      explanation: 'Morning flushes are one of the most common traps for beginners. A strong gap up creates excitement and FOMO — people buy the open expecting a Gap and Go. Instead, early sellers distribute into that excitement and the stock flushes hard. The key lesson: a flush alone does not make it buyable. You need to see a base form at the lows, a reclaim of a key level (like VWAP or the gap fill level) on volume, and clear structure before entering. Buying a flush mid-move means catching a knife with no defined risk level.'
    },
    {
      id: 'iq_mc9_pullback',
      title: 'Healthy Pullback vs Breakdown — Which Is This?',
      generator: 'healthyPullback',
      seed: 606,
      question: 'This stock was in a clear uptrend and pulled back. Look at the volume during the pullback and how price reacted at the lows. How do you classify this move?',
      choices: [
        'Any pullback in an uptrend is a breakdown — sell immediately',
        'This is a healthy pullback — volume declined during the selling (no real pressure) and price held at a logical level before resuming the uptrend on renewed volume. This is a buyable dip, not a reversal',
        'The percentage of the pullback is all that matters — anything over 5% is a breakdown',
        'Pullbacks are always followed by lower lows — never buy them'
      ],
      correct: 1,
      explanation: 'Not every pullback is a breakdown and learning to tell the difference is one of the most valuable skills in trading. A healthy pullback has three characteristics: volume declines during the selling (weak sellers, no panic), price holds at a meaningful level (prior support, moving average, Fib level), and the recovery comes on increased volume with momentum. A real breakdown has the opposite — heavy volume on the sell, no holding of levels, and weak bounces that fail. This chart showed all the characteristics of a healthy pullback that set up a long entry for disciplined traders.'
    },
    {
      id: 'iq_mc10_ascending',
      title: 'Ascending Triangle — What Happens at the Breakout?',
      generator: 'ascendingTriangle',
      seed: 303,
      question: 'This stock has made three higher lows against the same flat resistance level — each time buyers are stepping in sooner. It just broke above that resistance on heavy volume. What does this signal?',
      choices: [
        'Three failed attempts at resistance means the stock will definitely reverse lower',
        'This is a classic ascending triangle breakout — higher lows show buyers gaining urgency each time and when resistance finally breaks with volume, it often leads to a sustained move equal to the height of the triangle',
        'Flat resistance levels always hold — the breakout is a fakeout',
        'Volume at the breakout is irrelevant — only the pattern shape matters'
      ],
      correct: 1,
      explanation: 'The ascending triangle is one of the most reliable continuation patterns because the structure tells a clear story: buyers are getting more aggressive with each pullback (higher lows) while sellers defend the same price ceiling. Each time it tests resistance, sellers have to step in earlier to stop it. When sellers finally run out of inventory and buyers push through with volume, the breakout is real — not a fakeout. The measured move target is typically the height of the triangle added to the breakout point, giving you a defined profit target as well as a risk level below the last higher low.'
    }
  ]

  // ─────────────────────────────────────────
  // RENDERING ENGINE — unchanged from v2
  // ─────────────────────────────────────────

  function loadLightweightCharts(callback) {
    if (window.LightweightCharts) { callback(); return }
    var script = document.createElement('script')
    script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js'
    script.onload = callback
    document.head.appendChild(script)
  }

  function generateCandles(q) {
    var opts = { seed: q.seed, startPrice: 100 + (q.seed % 50), startTime: Math.floor(Date.now()/1000) - 7200, timeframeMinutes: 2 }
    if (q.generator === 'bullFlag') return generateBullFlag(opts)
    if (q.generator === 'vwapReclaim') return generateVWAPReclaim(opts)
    if (q.generator === 'supportBounce') return generateSupportBounce(opts)
    if (q.generator === 'breakoutConsolidation') return generateBreakoutConsolidation(opts)
    if (q.generator === 'headShoulders') return generateHeadShoulders(opts)
    if (q.generator === 'doubleTop') return generateDoubleTop(opts)
    if (q.generator === 'gapAndGo') return generateGapAndGo(opts)
    if (q.generator === 'trendlineBreak') return generateTrendlineBreak(opts)
    if (q.generator === 'fibRetracement') return generateFibRetracement(opts)
    if (q.generator === 'pennant') return generatePennant(opts)
    if (q.generator === 'fakeBreakout') return { candles: generateFakeBreakout(opts).candles, zones: null }
    if (q.generator === 'greenToRed') return generateGreenToRed(opts)
    if (q.generator === 'killCandle') return generateKillCandle(opts)
    if (q.generator === 'weakSecondLeg') return generateWeakSecondLeg(opts)
    if (q.generator === 'parabolic') return generateParabolic(opts)
    if (q.generator === 'vShape') return generateVShape(opts)
    if (q.generator === 'accumulation') return generateAccumulation(opts)
    if (q.generator === 'morningFlush') return generateMorningFlush(opts)
    if (q.generator === 'healthyPullback') return generateHealthyPullback(opts)
    if (q.generator === 'ascendingTriangle') return generateAscendingTriangle(opts)
    return generateBullFlag(opts)
  }

  function getZoneForIndex(zones, idx) {
    if (!zones) return null
    if (idx >= zones.ideal.start && idx <= zones.ideal.end) return 'ideal'
    if (idx >= zones.tooEarly.start && idx <= zones.tooEarly.end) return 'tooEarly'
    if (idx >= zones.tooLate.start && idx <= zones.tooLate.end) return 'tooLate'
    return 'tooEarly'
  }

  function renderChart(containerId, candles, onCandleClick) {
    var container = document.getElementById(containerId)
    if (!container) return null
    container.innerHTML = ''

    var chart = LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: 420,
      layout: { background: { color: '#111712' }, textColor: '#8a9a8c' },
      grid: { vertLines: { color: '#1a2018' }, horzLines: { color: '#1a2018' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1e2820' },
      rightPriceScale: { borderColor: '#1e2820', scaleMargins: { top: 0.1, bottom: 0.28 } },
      crosshair: { mode: 0 },
    })

    var series = chart.addCandlestickSeries({
      upColor: '#22c55e', downColor: '#ef4444',
      borderUpColor: '#22c55e', borderDownColor: '#ef4444',
      wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    })
    series.setData(candles)

    var volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      color: '#3a4a3c',
    })
    chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.78, bottom: 0 } })
    var volumeData = candles.map(function(c) {
      return { time: c.time, value: c.volume || 0, color: c.close >= c.open ? 'rgba(34,197,94,0.5)' : 'rgba(239,68,68,0.5)' }
    })
    volumeSeries.setData(volumeData)

    chart.timeScale().fitContent()

    if (onCandleClick) {
      chart.subscribeClick(function(param) {
        if (!param.time) return
        var idx = candles.findIndex(function(c) { return c.time === param.time })
        if (idx === -1) return
        onCandleClick(idx, series, candles)
      })
      container.style.cursor = 'crosshair'
    }

    window.addEventListener('resize', function() {
      chart.applyOptions({ width: container.clientWidth })
    })

    return series
  }

  function renderQuestion(sectionEl, q, onAnswered) {
    var isZone = q.type === 'zone'

    sectionEl.innerHTML =
      '<div class="iq-question-wrap">' +
        '<div class="iq-header">' +
          '<div class="iq-ticker">' + q.title + '</div>' +
          '<div class="iq-meta">Illustrative pattern · 2-min chart' + (isZone ? ' · Click the chart to answer' : '') + '</div>' +
        '</div>' +
        '<div class="iq-chart-container" id="chart-' + q.id + '"><div class="iq-loading">Rendering chart...</div></div>' +
        '<div class="iq-question-text">' + q.question + '</div>' +
        (isZone ? '' : '<div class="iq-choices" id="choices-' + q.id + '"></div>') +
        '<div class="iq-explanation" id="explain-' + q.id + '" style="display:none;"></div>' +
      '</div>'

    if (!isZone) {
      var choicesEl = document.getElementById('choices-' + q.id)
      q.choices.forEach(function(choice, i) {
        var btn = document.createElement('div')
        btn.className = 'iq-choice'
        btn.innerHTML = '<span class="iq-choice-letter">' + String.fromCharCode(65+i) + '</span><span>' + choice + '</span>'
        btn.onclick = function() { handleAnswer(q, i, choicesEl, onAnswered) }
        choicesEl.appendChild(btn)
      })
    }

    loadLightweightCharts(function() {
      var result = generateCandles(q)
      var candles = result.candles
      var zones = result.zones

      if (isZone) {
        var answered = false
        renderChart('chart-' + q.id, candles, function(clickedIdx, series) {
          if (answered) return
          answered = true
          handleZoneAnswer(q, clickedIdx, candles, zones, series, onAnswered)
        })
      } else {
        renderChart('chart-' + q.id, candles)
      }
    })
  }

  function handleZoneAnswer(q, clickedIdx, candles, zones, series, onAnswered) {
    var zoneHit = getZoneForIndex(zones, clickedIdx)
    var isCorrect = zoneHit === 'ideal'

    var markers = []
    markers.push({
      time: candles[clickedIdx].time,
      position: 'belowBar',
      color: isCorrect ? '#22c55e' : '#ef4444',
      shape: 'arrowUp',
      text: 'Your entry',
    })
    if (!isCorrect && zones) {
      var idealMid = Math.floor((zones.ideal.start + zones.ideal.end) / 2)
      if (candles[idealMid]) {
        markers.push({
          time: candles[idealMid].time,
          position: 'aboveBar',
          color: '#22c55e',
          shape: 'arrowDown',
          text: 'Ideal entry',
        })
      }
    }
    series.setMarkers(markers)

    var explainEl = document.getElementById('explain-' + q.id)
    explainEl.style.display = 'block'
    explainEl.className = 'iq-explanation ' + (isCorrect ? 'iq-correct' : 'iq-incorrect')
    var feedbackText = q.zoneFeedback[zoneHit] || q.zoneFeedback.tooEarly
    explainEl.innerHTML =
      '<div class="iq-result-label">' + (isCorrect ? '✓ Strong Entry' : '✗ Not the ideal spot') + '</div>' +
      '<div class="iq-explanation-text">' + feedbackText + '</div>'

    if (onAnswered) onAnswered(isCorrect)
  }

  function handleAnswer(q, chosenIdx, choicesEl, onAnswered) {
    var allChoices = choicesEl.querySelectorAll('.iq-choice')
    allChoices.forEach(function(el, i) {
      el.onclick = null
      if (i === q.correct) el.classList.add('correct')
      else if (i === chosenIdx) el.classList.add('incorrect')
    })

    var explainEl = document.getElementById('explain-' + q.id)
    var isCorrect = chosenIdx === q.correct
    explainEl.style.display = 'block'
    explainEl.className = 'iq-explanation ' + (isCorrect ? 'iq-correct' : 'iq-incorrect')
    explainEl.innerHTML =
      '<div class="iq-result-label">' + (isCorrect ? '✓ Correct' : '✗ Not quite') + '</div>' +
      '<div class="iq-explanation-text">' + q.explanation + '</div>'

    if (onAnswered) onAnswered(isCorrect)
  }

  function render(containerId) {
    var container = document.getElementById(containerId)
    if (!container) return

    var correctCount = 0
    var answeredCount = 0

    container.innerHTML = '<div id="iq-progress-bar" class="iq-progress-bar"></div><div id="iq-questions-stack" class="iq-questions-stack"></div>'
    var stack = document.getElementById('iq-questions-stack')

    function updateProgress() {
      var bar = document.getElementById('iq-progress-bar')
      if (!bar) return
      bar.innerHTML = '<div class="iq-progress-text">' + answeredCount + ' of ' + QUESTIONS.length + ' answered' +
        (answeredCount === QUESTIONS.length ? ' · Score: ' + correctCount + '/' + QUESTIONS.length : '') + '</div>'
    }

    QUESTIONS.forEach(function(q, i) {
      var qEl = document.createElement('div')
      qEl.className = 'iq-stack-item'
      qEl.id = 'iq-stack-item-' + q.id
      stack.appendChild(qEl)

      var numberBadge = document.createElement('div')
      numberBadge.className = 'iq-question-number'
      numberBadge.textContent = 'Question ' + (i + 1) + ' of ' + QUESTIONS.length
      qEl.appendChild(numberBadge)

      var qBody = document.createElement('div')
      qEl.appendChild(qBody)

      renderQuestion(qBody, q, function(correct) {
        if (correct) correctCount++
        answeredCount++
        updateProgress()
      })
    })

    updateProgress()
  }

  return { render: render, QUESTIONS: QUESTIONS }
})()
