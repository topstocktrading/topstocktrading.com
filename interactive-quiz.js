// ============================================================
// TST INTERACTIVE TRADE QUIZ — v2
// Procedurally generated realistic chart patterns
// No live API dependency — every pattern renders exactly right, every time
// ============================================================

window.TST_INTERACTIVE_QUIZ = (function() {

  // ─────────────────────────────────────────
  // CANDLE PATTERN GENERATORS
  // Each returns { candles: [...], volume: [...] } with realistic OHLCV shape
  // ─────────────────────────────────────────

  function seededRandom(seed) {
    var s = seed
    return function() {
      s = (s * 9301 + 49297) % 233280
      return s / 233280
    }
  }

  // Box-Muller transform for normally-distributed randomness — real price moves
  // cluster around small values with occasional larger ones, not uniform random
  function gaussianRandom(rand) {
    var u = 0, v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    var val = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    // Clamp to +/-2 standard deviations — prevents rare extreme draws from
    // producing an out-of-proportion candle that visually "gaps" from its neighbors
    return Math.max(-2, Math.min(2, val))
  }

  // Generates one realistic candle given a starting price, a drift (trend bias),
  // and a volatility scale. Occasionally produces counter-trend candles naturally —
  // this is what makes real charts look organic instead of a robotic staircase.
  function generateOneCandle(rand, openPrice, drift, volatility) {
    var noise = gaussianRandom(rand) * volatility
    var close = openPrice + drift + noise
    var bodyHigh = Math.max(openPrice, close)
    var bodyLow = Math.min(openPrice, close)
    var wickUp = Math.abs(gaussianRandom(rand)) * volatility * 0.35
    var wickDown = Math.abs(gaussianRandom(rand)) * volatility * 0.35
    return {
      open: openPrice,
      close: close,
      high: bodyHigh + wickUp,
      low: bodyLow - wickDown,
    }
  }

  function buildPhase(rand, startPrice, startTime, interval, count, avgDrift, volatility, volBase, volTrendPct) {
    var candles = []
    var price = startPrice
    var t = startTime
    for (var i = 0; i < count; i++) {
      // Vary drift candle-to-candle so it's not a perfectly straight staircase —
      // some candles push harder, some pull back slightly, matching real price noise
      var driftThisCandle = avgDrift * (0.4 + rand() * 1.2) * (rand() > 0.15 ? 1 : -0.6)
      var c = generateOneCandle(rand, price, driftThisCandle, volatility)
      // Volume trends smoothly across the phase (up or down) with natural noise, not a hard cliff
      var progress = count > 1 ? i / (count - 1) : 0
      var volTrendMultiplier = 1 + (volTrendPct * progress)
      var volNoise = 0.75 + rand() * 0.5
      var volume = Math.max(5000, Math.round(volBase * volTrendMultiplier * volNoise))
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: volume })
      price = c.close
      t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  // Like buildPhase but volatility narrows linearly over the phase — used for
  // triangles and pennants where the range visibly converges toward a point
  function buildConvergingPhase(rand, startPrice, startTime, interval, count, avgDrift, volStart, volEnd, volBase, volTrendPct) {
    var candles = []
    var price = startPrice
    var t = startTime
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

  // Builds one directional leg toward a target price over a candle count —
  // used to construct head-and-shoulders peaks/troughs with controlled shape
  function buildLegToTarget(rand, startPrice, targetPrice, startTime, interval, count, volatility, volBase) {
    var candles = []
    var price = startPrice
    var t = startTime
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

    // Generates a clean bull flag: uptrend leg -> tight consolidation on declining volume -> breakout on volume spike
  function generateBullFlag(opts) {
    var rand = seededRandom(opts.seed || 42)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime
    var price = startPrice
    var all = []

    // Phase 1: uptrend leg — moderate drift, moderate volatility, volume elevated and steady
    var leg = buildPhase(rand, price, t, interval, opts.legCandles || 16, 0.22, 0.14, 210000, 0.15)
    all = all.concat(leg.candles)
    price = leg.endPrice; t = leg.endTime

    // Phase 2: consolidation — near-zero drift (sideways), tight volatility, volume DECLINES steadily
    var flag = buildPhase(rand, price, t, interval, opts.flagCandles || 13, 0.005, 0.035, 95000, -0.60)
    all = all.concat(flag.candles)
    price = flag.endPrice; t = flag.endTime

    // Phase 3: breakout — strong drift, moderate-high volatility, volume spikes hard
    var breakout = buildPhase(rand, price, t, interval, opts.breakoutCandles || 9, 0.20, 0.16, 260000, 0.35)
    all = all.concat(breakout.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: leg.candles.length - 1 },
        ideal: { start: leg.candles.length + flag.candles.length - 2, end: leg.candles.length + flag.candles.length + 2 },
        tooLate: { start: leg.candles.length + flag.candles.length + 5, end: all.length - 1 },
      }
    }
  }

  function generateFailedBreakout(opts) {
    var rand = seededRandom(opts.seed || 77)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime
    var price = startPrice
    var all = []

    // Uptrend leg — same as good example
    var leg = buildPhase(rand, price, t, interval, 13, 0.20, 0.14, 190000, 0.10)
    all = all.concat(leg.candles)
    price = leg.endPrice; t = leg.endTime

    // Consolidation — volume stays FLAT/elevated instead of declining — the key tell
    var flag = buildPhase(rand, price, t, interval, 11, 0.00, 0.04, 115000, 0.10)
    all = all.concat(flag.candles)
    price = flag.endPrice; t = flag.endTime

    // Weak breakout attempt — small drift, low volume (no conviction)
    var fakeBreak = buildPhase(rand, price, t, interval, 5, 0.10, 0.10, 85000, -0.10)
    all = all.concat(fakeBreak.candles)
    price = fakeBreak.endPrice; t = fakeBreak.endTime

    // Reversal — strong negative drift, volume spikes on the way down
    var reversal = buildPhase(rand, price, t, interval, 7, -0.30, 0.18, 240000, 0.30)
    all = all.concat(reversal.candles)

    return all
  }

  // TRENDLINE BREAK — uptrend respecting a rising trendline, then a break below it.
  // This is a bearish/short-entry pattern: ideal entry is right as price closes below
  // the established trendline with momentum, confirming the break is real.
  function generateTrendlineBreak(opts) {
    var rand = seededRandom(opts.seed || 101)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Uptrend respecting a rising trendline — steady higher lows
    var up = buildPhase(rand, price, t, interval, 18, 0.16, 0.10, 170000, 0.05)
    all = all.concat(up.candles); price = up.endPrice; t = up.endTime

    // Late-stage uptrend loses momentum — smaller candles, still slightly up (trendline getting tested)
    var fade = buildPhase(rand, price, t, interval, 6, 0.04, 0.08, 130000, -0.15)
    all = all.concat(fade.candles); price = fade.endPrice; t = fade.endTime

    var breakZoneStart = all.length

    // The break — sharp move down through the trendline, volume picks up (real break)
    var breakDown = buildPhase(rand, price, t, interval, 5, -0.22, 0.16, 210000, 0.40)
    all = all.concat(breakDown.candles); price = breakDown.endPrice; t = breakDown.endTime

    var breakZoneEnd = all.length - 1

    // Continuation down — confirms it wasn't a fakeout
    var cont = buildPhase(rand, price, t, interval, 8, -0.18, 0.14, 190000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: breakZoneStart - 1 },
        ideal: { start: breakZoneStart, end: breakZoneStart + 2 },
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 },
      }
    }
  }

  // HEAD AND SHOULDERS — left shoulder, higher head, right shoulder, then neckline break down.
  // Ideal entry is on the neckline break confirming the reversal — not during shoulder formation.
  function generateHeadShoulders(opts) {
    var rand = seededRandom(opts.seed || 202)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var neckline = startPrice

    // Left shoulder — up then back down to neckline
    var ls_up = buildLegToTarget(rand, price, price + 2.2, t, interval, 6, 0.10, 160000)
    all = all.concat(ls_up.candles); price = ls_up.endPrice; t = ls_up.endTime
    var ls_down = buildLegToTarget(rand, price, neckline + 0.2, t, interval, 6, 0.10, 130000)
    all = all.concat(ls_down.candles); price = ls_down.endPrice; t = ls_down.endTime

    // Head — up higher than left shoulder, then back down to neckline
    var h_up = buildLegToTarget(rand, price, price + 3.8, t, interval, 7, 0.12, 200000)
    all = all.concat(h_up.candles); price = h_up.endPrice; t = h_up.endTime
    var h_down = buildLegToTarget(rand, price, neckline + 0.1, t, interval, 7, 0.12, 150000)
    all = all.concat(h_down.candles); price = h_down.endPrice; t = h_down.endTime

    // Right shoulder — up similar to left shoulder (weaker than head), then down toward neckline
    var rs_up = buildLegToTarget(rand, price, price + 2.0, t, interval, 6, 0.10, 140000)
    all = all.concat(rs_up.candles); price = rs_up.endPrice; t = rs_up.endTime
    var rs_down = buildLegToTarget(rand, price, neckline, t, interval, 6, 0.10, 130000)
    all = all.concat(rs_down.candles); price = rs_down.endPrice; t = rs_down.endTime

    var neckZoneStart = all.length

    // Neckline break — decisive move below, volume spikes (real confirmation)
    var breakDown = buildPhase(rand, price, t, interval, 5, -0.24, 0.15, 220000, 0.45)
    all = all.concat(breakDown.candles); price = breakDown.endPrice; t = breakDown.endTime

    var neckZoneEnd = all.length - 1

    // Continuation down
    var cont = buildPhase(rand, price, t, interval, 7, -0.16, 0.13, 180000, 0.10)
    all = all.concat(cont.candles)

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: neckZoneStart - 1 },
        ideal: { start: neckZoneStart, end: neckZoneStart + 2 },
        tooLate: { start: neckZoneEnd + 4, end: all.length - 1 },
      }
    }
  }

  // ASCENDING TRIANGLE — rising lows against a flat resistance ceiling, then breakout above it.
  // Ideal entry is the breakout above the flat resistance with volume confirmation.
  function generateAscendingTriangle(opts) {
    var rand = seededRandom(opts.seed || 303)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []
    var resistance = startPrice + 3

    // Three rising-low touches against flat resistance
    for (var wave = 0; wave < 3; wave++) {
      var toResistance = buildLegToTarget(rand, price, resistance - (0.15 * rand()), t, interval, 5, 0.08, 130000)
      all = all.concat(toResistance.candles); price = toResistance.endPrice; t = toResistance.endTime
      var lowTarget = resistance - 2.4 + (wave * 0.6) // each low is higher than the last
      var toLow = buildLegToTarget(rand, price, lowTarget, t, interval, 5, 0.08, 110000)
      all = all.concat(toLow.candles); price = toLow.endPrice; t = toLow.endTime
    }

    var breakZoneStart = all.length

    // Breakout above resistance on volume
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
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 },
      }
    }
  }

  // PENNANT — strong move (flagpole), then a symmetrically NARROWING consolidation
  // (converging highs and lows, unlike a flag's parallel channel), then breakout continuation.
  function generatePennant(opts) {
    var rand = seededRandom(opts.seed || 404)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Flagpole — sharp strong move up
    var pole = buildPhase(rand, price, t, interval, 10, 0.30, 0.16, 230000, 0.10)
    all = all.concat(pole.candles); price = pole.endPrice; t = pole.endTime

    // Pennant — volatility narrows steadily (converging triangle), volume declines
    var pennant = buildConvergingPhase(rand, price, t, interval, 12, 0.01, 0.09, 0.02, 90000, -0.55)
    all = all.concat(pennant.candles); price = pennant.endPrice; t = pennant.endTime

    var breakZoneStart = all.length

    // Breakout continuation in the same direction as the flagpole, volume returns
    var breakout = buildPhase(rand, price, t, interval, 8, 0.20, 0.15, 250000, 0.40)
    all = all.concat(breakout.candles)

    var breakZoneEnd = all.length - 1

    return {
      candles: all,
      zones: {
        tooEarly: { start: 0, end: pole.candles.length + Math.floor(pennant.candles.length * 0.7) - 1 },
        ideal: { start: breakZoneStart, end: breakZoneStart + 2 },
        tooLate: { start: breakZoneEnd + 4, end: all.length - 1 },
      }
    }
  }

    // PANIC REVERSAL — sharp climactic selloff, exhaustion (huge volume, long lower wicks),
  // then sharp reversal. Tests recognizing seller exhaustion vs a panic that keeps going.
  function generatePanicReversal(opts) {
    var rand = seededRandom(opts.seed || 505)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var stable = buildPhase(rand, price, t, interval, 6, 0.01, 0.05, 90000, 0)
    all = all.concat(stable.candles); price = stable.endPrice; t = stable.endTime

    // Climactic selloff — big drops, volume explodes (exhaustion signature)
    var panic = buildPhase(rand, price, t, interval, 8, -0.35, 0.22, 280000, 0.60)
    all = all.concat(panic.candles); price = panic.endPrice; t = panic.endTime

    // Sharp reversal — sellers exhausted, buyers step in on continued high volume
    var reversal = buildPhase(rand, price, t, interval, 8, 0.28, 0.16, 240000, 0.10)
    all = all.concat(reversal.candles)

    return { candles: all, zones: null }
  }

  // PULLBACK VS BREAKDOWN — healthy pullback to support within an uptrend that HOLDS,
  // vs one that breaks down. This version shows the HOLDING (bullish) version.
  function generateHealthyPullback(opts) {
    var rand = seededRandom(opts.seed || 606)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var up = buildPhase(rand, price, t, interval, 14, 0.20, 0.13, 180000, 0.05)
    all = all.concat(up.candles); price = up.endPrice; t = up.endTime

    // Pullback — controlled, low volume decline, then holds and bounces
    var pullback = buildPhase(rand, price, t, interval, 8, -0.10, 0.08, 100000, -0.30)
    all = all.concat(pullback.candles); price = pullback.endPrice; t = pullback.endTime

    var bounce = buildPhase(rand, price, t, interval, 9, 0.22, 0.14, 200000, 0.35)
    all = all.concat(bounce.candles)

    return { candles: all, zones: null }
  }

  // ACCUMULATION — quiet base building with volume upticks on green days,
  // light volume on red days (smart money buying quietly beneath the surface)
  function generateAccumulation(opts) {
    var rand = seededRandom(opts.seed || 707)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    // Sideways base with asymmetric volume — heavier on up candles, light on down candles
    var rand2 = rand
    for (var i = 0; i < 22; i++) {
      var drift = (rand2() > 0.5 ? 1 : -0.8) * (0.02 + rand2() * 0.06)
      var c = generateOneCandle(rand2, price, drift, 0.06)
      var isUp = c.close >= c.open
      var vol = isUp ? (140000 + rand2() * 60000) : (60000 + rand2() * 30000)
      all.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.round(vol) })
      price = c.close; t += interval
    }
    var breakout = buildPhase(rand2, price, t, interval, 6, 0.18, 0.13, 220000, 0.40)
    all = all.concat(breakout.candles)

    return { candles: all, zones: null }
  }

  // STOP HUNT — price wicks below an obvious support level then immediately reclaims it,
  // vs a real breakdown that continues. This version is the STOP HUNT (fakeout) version.
  function generateStopHunt(opts) {
    var rand = seededRandom(opts.seed || 808)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var range = buildPhase(rand, price, t, interval, 14, 0.01, 0.06, 100000, 0)
    all = all.concat(range.candles); price = range.endPrice; t = range.endTime

    // Sharp wick below support on a volume spike (stop hunt), single candle mostly
    var wickDown = generateOneCandle(rand, price, -0.35, 0.10)
    var huntVol = 180000 + rand() * 60000
    all.push({ time: t, open: wickDown.open, high: wickDown.high, low: wickDown.low - 0.4, close: price - 0.05, volume: Math.round(huntVol) })
    t += interval

    // Immediate reclaim — sharp move back above the level
    var reclaim = buildPhase(rand, price - 0.05, t, interval, 9, 0.24, 0.13, 210000, 0.25)
    all = all.concat(reclaim.candles)

    return { candles: all, zones: null }
  }

  // FOMO ENTRY — shows a stock that has already extended significantly, to test
  // whether the student recognizes a chase versus a valid entry
  function generateExtendedChase(opts) {
    var rand = seededRandom(opts.seed || 909)
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var t = startTime, price = startPrice, all = []

    var leg1 = buildPhase(rand, price, t, interval, 12, 0.22, 0.14, 180000, 0.15)
    all = all.concat(leg1.candles); price = leg1.endPrice; t = leg1.endTime
    var leg2 = buildPhase(rand, price, t, interval, 10, 0.26, 0.15, 210000, 0.10)
    all = all.concat(leg2.candles); price = leg2.endPrice; t = leg2.endTime
    var leg3 = buildPhase(rand, price, t, interval, 8, 0.30, 0.17, 190000, -0.10)
    all = all.concat(leg3.candles)

    return { candles: all, zones: null }
  }

    // ─────────────────────────────────────────
  // QUESTION BANK
  // ─────────────────────────────────────────
  var QUESTIONS = [
    // ─── ZONE-CLICK QUESTIONS (click the chart to enter) ───
    {
      id: 'iq_zone_flag',
      title: 'Click Your Entry — Bull Flag',
      type: 'zone',
      generator: 'bullFlag',
      seed: 42,
      question: 'This stock is showing a flag pattern. Click directly on the chart where YOU would enter this trade.',
      zoneFeedback: {
        tooEarly: 'Too early — you entered during the initial move before any consolidation formed. There was no confirmed setup yet, just a strong candle. Entering here means no defined risk level and no confirmation the move continues.',
        ideal: 'Strong entry — you caught the breakout right as it confirmed, just as price cleared the consolidation with volume behind it. Confirmed structure, defined risk below the flag low, volume confirming real buyers stepped in.',
        tooLate: 'Too late — the move already extended significantly before you clicked. Chasing here means poor risk/reward: your stop has to be far away to make sense, and most of the move is already behind you.'
      }
    },
    {
      id: 'iq_zone_trendline',
      title: 'Click Your Entry — Trendline Break',
      type: 'zone',
      generator: 'trendlineBreak',
      seed: 101,
      question: 'This stock was respecting a rising trendline and just broke below it. Click where you would enter a SHORT.',
      zoneFeedback: {
        tooEarly: 'Too early — the trendline was still intact when you clicked. Shorting an uptrend before it actually breaks means fighting the trend with no confirmation.',
        ideal: 'Strong entry — you shorted right as price closed below the trendline with volume picking up, confirming real sellers stepped in rather than a temporary dip.',
        tooLate: 'Too late — the breakdown already extended significantly. Your risk/reward is poor here since the easy move down already happened.'
      }
    },
    {
      id: 'iq_zone_hs',
      title: 'Click Your Entry — Head & Shoulders',
      type: 'zone',
      generator: 'headShoulders',
      seed: 202,
      question: 'This is a classic head and shoulders top. Click where you would enter a SHORT on the neckline break.',
      zoneFeedback: {
        tooEarly: 'Too early — this was still during shoulder formation. The pattern was not confirmed yet, and price could have simply continued higher instead of reversing.',
        ideal: 'Strong entry — this is the neckline break, the moment the pattern actually confirms. Volume picked up here, confirming the reversal rather than another bounce.',
        tooLate: 'Too late — the breakdown already ran. Entering here means chasing a move that mostly already happened, with a stop that no longer makes sense relative to the reward.'
      }
    },
    {
      id: 'iq_zone_triangle',
      title: 'Click Your Entry — Ascending Triangle',
      type: 'zone',
      generator: 'ascendingTriangle',
      seed: 303,
      question: 'This stock is making higher lows against flat resistance. Click where you would enter LONG.',
      zoneFeedback: {
        tooEarly: 'Too early — price was still below resistance, inside the triangle. There was no breakout confirmation yet, just another touch of the same ceiling that had already rejected price multiple times.',
        ideal: 'Strong entry — this is the breakout above resistance with volume. The higher lows show buyers stepping in earlier each time, and the volume confirms real conviction on the break.',
        tooLate: 'Too late — you clicked well after the breakout already ran. Risk/reward is poor chasing here.'
      }
    },
    {
      id: 'iq_zone_pennant',
      title: 'Click Your Entry — Pennant',
      type: 'zone',
      generator: 'pennant',
      seed: 404,
      question: 'This stock just made a strong move, then formed a tightening pennant. Click where you would enter the continuation.',
      zoneFeedback: {
        tooEarly: 'Too early — the pennant was still narrowing and had not broken out yet. Entering mid-consolidation means no confirmation the continuation is actually starting.',
        ideal: 'Strong entry — this is the breakout from the pennant, continuing the same direction as the initial move with volume returning. This is the highest-probability moment: the pattern confirmed and volume backs it.',
        tooLate: 'Too late — the continuation move already ran by the time you clicked. The best risk/reward window already passed.'
      }
    },

    // ─── MULTIPLE CHOICE QUESTIONS ───
    {
      id: 'iq_mc_failedbreakout',
      title: 'Setup Identification',
      generator: 'failedBreakout',
      seed: 77,
      question: 'This stock shows an uptrend into a consolidation, followed by a breakout attempt. What is happening here, and what should you do?',
      choices: [
        'This is a clean flag setup — buy the breakout',
        'Volume stayed flat or rose during consolidation instead of declining, and the breakout has weak volume — this is a low-conviction move likely to fail',
        'The pattern is identical to a healthy flag, the ticker is the only difference',
        'Volume does not matter for this decision — only price structure matters'
      ],
      correct: 1,
      explanation: 'This is a failed breakout. Volume during consolidation did NOT decline the way it should in a healthy flag — it stayed elevated, meaning real selling pressure was present, not just quiet pausing. The breakout also came on weak volume, meaning no real conviction was behind the move. Both signals together predicted the reversal that followed.'
    },
    {
      id: 'iq_mc_panic',
      title: 'Panic Selloff Recognition',
      generator: 'panicReversal',
      seed: 505,
      question: 'This stock just had a sharp selloff. Based on the volume and price action at the bottom, what would you expect next?',
      choices: [
        'The selloff will continue indefinitely — there is no reason to expect a bounce',
        'This shows signs of climactic selling exhaustion — the sharp volume spike into the low, followed by an equally sharp reversal, suggests sellers ran out and buyers stepped in aggressively',
        'Volume is irrelevant here — only the number of red candles matters',
        'You should short this stock immediately since it just went down'
      ],
      correct: 1,
      explanation: 'This is a climactic exhaustion pattern. The selloff accelerated into a volume spike — a sign of panic selling reaching its peak — and was immediately followed by an equally strong reversal on continued high volume. That combination (climax + immediate strong reversal) is the signature of sellers being exhausted, not the start of a continued crash.'
    },
    {
      id: 'iq_mc_pullback',
      title: 'Pullback vs Breakdown',
      generator: 'healthyPullback',
      seed: 606,
      question: 'This stock pulled back after an uptrend. Based on the volume during the pullback and what followed, how would you classify this?',
      choices: [
        'This is a trend reversal — the uptrend is over, avoid this stock',
        'This is a healthy pullback within an uptrend — volume declined during the pullback (no real selling pressure) and price held before resuming higher',
        'The pullback proves the stock is now bearish long-term',
        'Pullback depth alone tells you everything you need — the percentage decline is all that matters'
      ],
      correct: 1,
      explanation: 'This is a healthy pullback, not a reversal. Volume declined during the pullback, meaning there was no real selling pressure driving it down — it was simply a pause. Price held at a logical level and resumed the uptrend on renewed volume. Low volume pullbacks within an uptrend are normal and often buyable, not warning signs.'
    },
    {
      id: 'iq_mc_accumulation',
      title: 'Accumulation vs Distribution',
      generator: 'accumulation',
      seed: 707,
      question: 'This stock has been trading sideways for a while. Looking at the volume pattern on up days versus down days, what is likely happening?',
      choices: [
        'Nothing meaningful — sideways price action with no volume pattern is always meaningless',
        'This shows signs of accumulation — volume is heavier on up days and lighter on down days, suggesting smart money is buying quietly while retail sells into weakness',
        'This is clearly distribution and the stock is about to collapse',
        'Only the price range matters here, not the volume distribution'
      ],
      correct: 1,
      explanation: 'This is accumulation. Even though price looks range-bound, the volume tells the real story — heavier volume on green days and lighter volume on red days means buyers are stepping in with size while sellers are thin. That asymmetry is a classic sign of quiet accumulation before a move higher, which is exactly what followed with the breakout on volume.'
    },
    {
      id: 'iq_mc_stophunt',
      title: 'Stop Hunt vs Real Breakdown',
      generator: 'stopHunt',
      seed: 808,
      question: 'Price briefly wicked below an obvious support level on a volume spike, then immediately reclaimed it. What does this tell you?',
      choices: [
        'This confirms a real breakdown — the level is broken, you should be short',
        'This is likely a stop hunt — a sharp wick through an obvious level followed by an immediate reclaim often means stops were run before the real move higher',
        'Volume spikes always mean the breakdown is real and will continue',
        'The wick means nothing — only the closing price of the day matters'
      ],
      correct: 1,
      explanation: 'This is a textbook stop hunt. Obvious support levels attract clustered stop orders. A sharp wick through the level on a volume spike, immediately followed by a strong reclaim, is the signature of stops being run as liquidity before the real move — not a genuine breakdown. If it were a real breakdown, price would have continued lower instead of sharply reversing back above the level.'
    },
    {
      id: 'iq_mc_fomo',
      title: 'Recognizing an Extended Chase',
      generator: 'extendedChase',
      seed: 909,
      question: 'This stock has been running for a while and just posted another strong green candle. What is the disciplined move here?',
      choices: [
        'Buy immediately — strong momentum means it will keep going forever',
        'This move is already significantly extended across multiple legs up with no real pullback or consolidation — chasing here is exactly the FOMO entry that produces poor risk/reward. Wait for a pullback or pass entirely',
        'The number of green candles in a row guarantees continuation',
        'Extended moves are always safe to buy since the trend is your friend no matter what'
      ],
      correct: 1,
      explanation: 'This is a textbook FOMO setup, not a valid entry. The stock has already run through multiple legs with no real consolidation or pullback along the way — meaning there is no defined risk level and the easy money has already been made by whoever got in early. Chasing extended moves like this is one of the most common mistakes driven by fear of missing out rather than an actual edge.'
    }
  ]

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
    if (q.generator === 'trendlineBreak') return generateTrendlineBreak(opts)
    if (q.generator === 'headShoulders') return generateHeadShoulders(opts)
    if (q.generator === 'ascendingTriangle') return generateAscendingTriangle(opts)
    if (q.generator === 'pennant') return generatePennant(opts)
    if (q.generator === 'failedBreakout') return { candles: generateFailedBreakout(opts), zones: null }
    if (q.generator === 'panicReversal') return generatePanicReversal(opts)
    if (q.generator === 'healthyPullback') return generateHealthyPullback(opts)
    if (q.generator === 'accumulation') return generateAccumulation(opts)
    if (q.generator === 'stopHunt') return generateStopHunt(opts)
    if (q.generator === 'extendedChase') return generateExtendedChase(opts)
    return generateBullFlag(opts)
  }

  function getZoneForIndex(zones, idx) {
    if (!zones) return null
    if (idx >= zones.ideal.start && idx <= zones.ideal.end) return 'ideal'
    if (idx >= zones.tooEarly.start && idx <= zones.tooEarly.end) return 'tooEarly'
    if (idx >= zones.tooLate.start && idx <= zones.tooLate.end) return 'tooLate'
    return 'tooEarly' // anything between defined zones defaults to too early (mid-consolidation, no confirmation yet)
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

    // Mark the user's click and the ideal zone on the chart so they can visually compare
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
