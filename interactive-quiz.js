// ============================================================
// TST INTERACTIVE TRADE QUIZ — v4
// 20 questions — 10 zone-click, 10 multiple choice
// All patterns visible on raw candlestick chart, no indicators needed
// ============================================================

window.TST_INTERACTIVE_QUIZ = (function() {

  function seededRandom(seed) {
    var s = seed
    return function() { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  }

  function gaussianRandom(rand) {
    var u = 0, v = 0
    while (u === 0) u = rand()
    while (v === 0) v = rand()
    return Math.max(-2, Math.min(2, Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)))
  }

  function generateOneCandle(rand, openPrice, drift, volatility) {
    var noise = gaussianRandom(rand) * volatility
    var close = openPrice + drift + noise
    var bodyHigh = Math.max(openPrice, close)
    var bodyLow = Math.min(openPrice, close)
    return { open: openPrice, close: close, high: bodyHigh + Math.abs(gaussianRandom(rand)) * volatility * 0.35, low: bodyLow - Math.abs(gaussianRandom(rand)) * volatility * 0.35 }
  }

  function buildPhase(rand, startPrice, startTime, interval, count, avgDrift, volatility, volBase, volTrendPct) {
    var candles = [], price = startPrice, t = startTime
    for (var i = 0; i < count; i++) {
      var driftThisCandle = avgDrift * (0.4 + rand() * 1.2) * (rand() > 0.15 ? 1 : -0.6)
      var c = generateOneCandle(rand, price, driftThisCandle, volatility)
      var vol = Math.max(5000, Math.round(volBase * (1 + volTrendPct * (count > 1 ? i/(count-1) : 0)) * (0.75 + rand() * 0.5)))
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: vol })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  function buildLegToTarget(rand, startPrice, targetPrice, startTime, interval, count, volatility, volBase) {
    var candles = [], price = startPrice, t = startTime
    var totalMove = targetPrice - startPrice
    for (var i = 0; i < count; i++) {
      var c = generateOneCandle(rand, price, (totalMove / count) * (0.6 + rand() * 0.8), volatility)
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.max(5000, Math.round(volBase * (0.8 + rand() * 0.4))) })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  function buildConvergingPhase(rand, startPrice, startTime, interval, count, avgDrift, volStart, volEnd, volBase, volTrendPct) {
    var candles = [], price = startPrice, t = startTime
    for (var i = 0; i < count; i++) {
      var progress = count > 1 ? i / (count - 1) : 0
      var volatility = volStart + (volEnd - volStart) * progress
      var c = generateOneCandle(rand, price, avgDrift * (0.4 + rand() * 1.2) * (rand() > 0.15 ? 1 : -0.6), volatility)
      candles.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.max(5000, Math.round(volBase * (1 + volTrendPct * progress) * (0.75 + rand() * 0.5))) })
      price = c.close; t += interval
    }
    return { candles: candles, endPrice: price, endTime: t }
  }

  // ─── ZONE-CLICK GENERATORS (10) ───

  // 1. Bull Flag
  function generateBullFlag(opts) {
    var rand = seededRandom(opts.seed || 42), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var leg = buildPhase(rand, p, t, iv, 16, 0.22, 0.14, 210000, 0.15); all = all.concat(leg.candles); p = leg.endPrice; t = leg.endTime
    var flag = buildPhase(rand, p, t, iv, 13, 0.005, 0.035, 95000, -0.60); all = all.concat(flag.candles); p = flag.endPrice; t = flag.endTime
    var bo = buildPhase(rand, p, t, iv, 9, 0.20, 0.16, 260000, 0.35); all = all.concat(bo.candles)
    var ls = leg.candles.length, fs = flag.candles.length
    return { candles: all, zones: { tooEarly:{start:0,end:ls-1}, ideal:{start:ls+fs-2,end:ls+fs+2}, tooLate:{start:ls+fs+5,end:all.length-1} } }
  }

  // 2. Opening Range Breakout
  function generateORB(opts) {
    var rand = seededRandom(opts.seed || 150), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||1)*60, all = []
    // 5 tight candles establishing the range — low volume, small bodies
    var range = buildPhase(rand, p, t, iv, 5, 0.01, 0.04, 85000, 0); all = all.concat(range.candles); p = range.endPrice; t = range.endTime
    var breakStart = all.length
    // Breakout candle — large, high volume, closes well above range high
    var bo1 = buildPhase(rand, p, t, iv, 2, 0.28, 0.12, 280000, 0.30); all = all.concat(bo1.candles); p = bo1.endPrice; t = bo1.endTime
    var breakEnd = all.length - 1
    // Continuation — keeps going
    var cont = buildPhase(rand, p, t, iv, 10, 0.16, 0.10, 190000, 0.10); all = all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:breakStart-1}, ideal:{start:breakStart,end:breakStart+2}, tooLate:{start:breakEnd+4,end:all.length-1} } }
  }

  // 3. Consolidation Breakout Retest
  function generateConsolidationRetest(opts) {
    var rand = seededRandom(opts.seed || 250), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // Initial uptrend
    var up = buildPhase(rand, p, t, iv, 8, 0.18, 0.11, 170000, 0.10); all = all.concat(up.candles); p = up.endPrice; t = up.endTime
    // Consolidation at the top
    var cons = buildPhase(rand, p, t, iv, 8, 0.005, 0.03, 80000, -0.30); all = all.concat(cons.candles); p = cons.endPrice; t = cons.endTime
    // Breakout above consolidation
    var bo = buildPhase(rand, p, t, iv, 3, 0.25, 0.13, 250000, 0.40); all = all.concat(bo.candles); p = bo.endPrice; t = bo.endTime
    // Retest — pulls back to breakout level on low volume
    var retest = buildPhase(rand, p, t, iv, 5, -0.12, 0.08, 90000, -0.35); all = all.concat(retest.candles); p = retest.endPrice; t = retest.endTime
    var retestStart = all.length
    // Bounce off retest — ideal entry
    var bounce = buildPhase(rand, p, t, iv, 2, 0.20, 0.10, 200000, 0.20); all = all.concat(bounce.candles); p = bounce.endPrice; t = bounce.endTime
    var retestEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 7, 0.16, 0.11, 170000, 0.10); all = all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:retestStart-1}, ideal:{start:retestStart,end:retestStart+2}, tooLate:{start:retestEnd+4,end:all.length-1} } }
  }

  // 4. Bear Flag Breakdown
  function generateBearFlag(opts) {
    var rand = seededRandom(opts.seed || 350), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // Strong leg down — the flagpole
    var leg = buildPhase(rand, p, t, iv, 14, -0.22, 0.15, 220000, 0.15); all = all.concat(leg.candles); p = leg.endPrice; t = leg.endTime
    // Weak bounce — rising on low volume (bear flag)
    var flag = buildPhase(rand, p, t, iv, 10, 0.06, 0.04, 80000, -0.50); all = all.concat(flag.candles); p = flag.endPrice; t = flag.endTime
    var breakStart = all.length
    // Breakdown — resumes down with volume
    var bo = buildPhase(rand, p, t, iv, 3, -0.24, 0.16, 250000, 0.40); all = all.concat(bo.candles); p = bo.endPrice; t = bo.endTime
    var breakEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 8, -0.18, 0.13, 190000, 0.10); all = all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:leg.candles.length-1}, ideal:{start:breakStart,end:breakStart+2}, tooLate:{start:breakEnd+4,end:all.length-1} } }
  }

  // 5. Head & Shoulders
  function generateHeadShoulders(opts) {
    var rand = seededRandom(opts.seed || 202), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var neck = p
    var lsu = buildLegToTarget(rand, p, p+2.2, t, iv, 6, 0.10, 160000); all=all.concat(lsu.candles); p=lsu.endPrice; t=lsu.endTime
    var lsd = buildLegToTarget(rand, p, neck+0.2, t, iv, 6, 0.10, 130000); all=all.concat(lsd.candles); p=lsd.endPrice; t=lsd.endTime
    var hu = buildLegToTarget(rand, p, p+3.8, t, iv, 7, 0.12, 200000); all=all.concat(hu.candles); p=hu.endPrice; t=hu.endTime
    var hd = buildLegToTarget(rand, p, neck+0.1, t, iv, 7, 0.12, 150000); all=all.concat(hd.candles); p=hd.endPrice; t=hd.endTime
    var rsu = buildLegToTarget(rand, p, p+2.0, t, iv, 6, 0.10, 140000); all=all.concat(rsu.candles); p=rsu.endPrice; t=rsu.endTime
    var rsd = buildLegToTarget(rand, p, neck, t, iv, 6, 0.10, 130000); all=all.concat(rsd.candles); p=rsd.endPrice; t=rsd.endTime
    var neckZoneStart = all.length
    var bd = buildPhase(rand, p, t, iv, 5, -0.24, 0.15, 220000, 0.45); all=all.concat(bd.candles); p=bd.endPrice; t=bd.endTime
    var neckZoneEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 7, -0.16, 0.13, 180000, 0.10); all=all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:neckZoneStart-1}, ideal:{start:neckZoneStart,end:neckZoneStart+2}, tooLate:{start:neckZoneEnd+4,end:all.length-1} } }
  }

  // 6. Support Bounce (3rd test)
  function generateSupportBounce(opts) {
    var rand = seededRandom(opts.seed || 222), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var supportLevel = p
    var up1 = buildPhase(rand, p, t, iv, 8, 0.18, 0.10, 160000, 0.05); all=all.concat(up1.candles); p=up1.endPrice; t=up1.endTime
    var dn1 = buildLegToTarget(rand, p, supportLevel+0.1, t, iv, 7, 0.09, 110000); all=all.concat(dn1.candles); p=dn1.endPrice; t=dn1.endTime
    var up2 = buildPhase(rand, p, t, iv, 6, 0.14, 0.09, 130000, 0.05); all=all.concat(up2.candles); p=up2.endPrice; t=up2.endTime
    var dn2 = buildLegToTarget(rand, p, supportLevel+0.05, t, iv, 6, 0.09, 105000); all=all.concat(dn2.candles); p=dn2.endPrice; t=dn2.endTime
    var bounceStart = all.length
    var bounce = buildPhase(rand, p, t, iv, 2, 0.20, 0.10, 200000, 0.15); all=all.concat(bounce.candles); p=bounce.endPrice; t=bounce.endTime
    var bounceEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 8, 0.16, 0.12, 170000, 0.10); all=all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:bounceStart-1}, ideal:{start:bounceStart,end:bounceStart+2}, tooLate:{start:bounceEnd+4,end:all.length-1} } }
  }

  // 7. Doji at the Top
  function generateDojiTop(opts) {
    var rand = seededRandom(opts.seed || 450), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // Extended uptrend
    var up = buildPhase(rand, p, t, iv, 16, 0.19, 0.11, 180000, -0.10); all=all.concat(up.candles); p=up.endPrice; t=up.endTime
    // Doji — near-zero drift, tiny body, long wicks both sides
    var dojiCandle = generateOneCandle(rand, p, 0.01, 0.06)
    all.push({ time: t, open: p, high: p + 0.40, low: p - 0.38, close: p + 0.02, volume: Math.round(130000 * (0.8 + rand() * 0.4)) })
    t += iv; p = p + 0.02
    var dojiIdx = all.length - 1
    // Reversal follows the doji
    var reversal = buildPhase(rand, p, t, iv, 10, -0.20, 0.14, 210000, 0.20); all=all.concat(reversal.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:dojiIdx-1}, ideal:{start:dojiIdx,end:dojiIdx+2}, tooLate:{start:dojiIdx+6,end:all.length-1} } }
  }

  // 8. Hammer Reversal
  function generateHammer(opts) {
    var rand = seededRandom(opts.seed || 550), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // Downtrend
    var down = buildPhase(rand, p, t, iv, 14, -0.18, 0.12, 160000, 0.10); all=all.concat(down.candles); p=down.endPrice; t=down.endTime
    // Hammer candle — small body at the top, very long lower wick
    var hammerOpen = p
    var hammerClose = p + 0.08
    all.push({ time: t, open: hammerOpen, high: hammerClose + 0.10, low: hammerOpen - 0.55, close: hammerClose, volume: 240000 })
    t += iv; p = hammerClose
    var hammerIdx = all.length - 1
    // Recovery
    var recovery = buildPhase(rand, p, t, iv, 10, 0.20, 0.12, 200000, 0.15); all=all.concat(recovery.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:hammerIdx-1}, ideal:{start:hammerIdx,end:hammerIdx+2}, tooLate:{start:hammerIdx+6,end:all.length-1} } }
  }

  // 9. Lower High Lower Low (downtrend confirmation)
  function generateLHLL(opts) {
    var rand = seededRandom(opts.seed || 650), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // First high
    var up1 = buildPhase(rand, p, t, iv, 6, 0.20, 0.10, 160000, 0.05); all=all.concat(up1.candles); p=up1.endPrice; t=up1.endTime
    // First low
    var dn1 = buildPhase(rand, p, t, iv, 6, -0.22, 0.11, 180000, 0.10); all=all.concat(dn1.candles); p=dn1.endPrice; t=dn1.endTime
    // Lower high — doesn't reach first high
    var up2 = buildPhase(rand, p, t, iv, 5, 0.12, 0.09, 120000, -0.10); all=all.concat(up2.candles); p=up2.endPrice; t=up2.endTime
    var confirmStart = all.length
    // Lower low — breaks below first low = confirmation
    var dn2 = buildPhase(rand, p, t, iv, 3, -0.26, 0.14, 220000, 0.30); all=all.concat(dn2.candles); p=dn2.endPrice; t=dn2.endTime
    var confirmEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 7, -0.18, 0.12, 190000, 0.10); all=all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:confirmStart-1}, ideal:{start:confirmStart,end:confirmStart+2}, tooLate:{start:confirmEnd+4,end:all.length-1} } }
  }

  // 10. Ascending Triangle
  function generateAscendingTriangle(opts) {
    var rand = seededRandom(opts.seed || 303), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var resistance = p + 3
    for (var wave = 0; wave < 3; wave++) {
      var toR = buildLegToTarget(rand, p, resistance-(0.15*rand()), t, iv, 5, 0.08, 130000); all=all.concat(toR.candles); p=toR.endPrice; t=toR.endTime
      var toLow = buildLegToTarget(rand, p, resistance-2.4+(wave*0.6), t, iv, 5, 0.08, 110000); all=all.concat(toLow.candles); p=toLow.endPrice; t=toLow.endTime
    }
    var breakZoneStart = all.length
    var bo = buildPhase(rand, p, t, iv, 6, 0.22, 0.15, 230000, 0.45); all=all.concat(bo.candles); p=bo.endPrice; t=bo.endTime
    var breakZoneEnd = all.length - 1
    var cont = buildPhase(rand, p, t, iv, 7, 0.16, 0.14, 190000, 0.10); all=all.concat(cont.candles)
    return { candles: all, zones: { tooEarly:{start:0,end:breakZoneStart-1}, ideal:{start:breakZoneStart,end:breakZoneStart+2}, tooLate:{start:breakZoneEnd+4,end:all.length-1} } }
  }

  // ─── MULTIPLE CHOICE GENERATORS (10) ───

  function generateFakeBreakout(opts) {
    var rand = seededRandom(opts.seed || 77), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var leg = buildPhase(rand, p, t, iv, 13, 0.20, 0.14, 190000, 0.10); all=all.concat(leg.candles); p=leg.endPrice; t=leg.endTime
    var flag = buildPhase(rand, p, t, iv, 11, 0.00, 0.04, 115000, 0.10); all=all.concat(flag.candles); p=flag.endPrice; t=flag.endTime
    var fb = buildPhase(rand, p, t, iv, 5, 0.10, 0.10, 85000, -0.10); all=all.concat(fb.candles); p=fb.endPrice; t=fb.endTime
    var rev = buildPhase(rand, p, t, iv, 7, -0.30, 0.18, 240000, 0.30); all=all.concat(rev.candles)
    return { candles: all, zones: null }
  }

  function generateGreenToRed(opts) {
    var rand = seededRandom(opts.seed || 888), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var morn = buildPhase(rand, p, t, iv, 8, 0.20, 0.12, 200000, 0.10); all=all.concat(morn.candles); p=morn.endPrice; t=morn.endTime
    var stall = buildPhase(rand, p, t, iv, 5, 0.01, 0.06, 85000, -0.30); all=all.concat(stall.candles); p=stall.endPrice; t=stall.endTime
    var gtr = buildPhase(rand, p, t, iv, 9, -0.24, 0.14, 220000, 0.35); all=all.concat(gtr.candles)
    return { candles: all, zones: null }
  }

  function generateKillCandle(opts) {
    var rand = seededRandom(opts.seed || 999), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var up = buildPhase(rand, p, t, iv, 18, 0.19, 0.11, 180000, -0.15); all=all.concat(up.candles); p=up.endPrice; t=up.endTime
    var body = p * 0.035
    all.push({ time: t, open: p+0.15, high: p+0.30, low: p-body-0.20, close: p-body, volume: 380000 }); p=p-body; t+=iv
    var dn = buildPhase(rand, p, t, iv, 8, -0.18, 0.13, 200000, 0.10); all=all.concat(dn.candles)
    return { candles: all, zones: null }
  }

  function generateWeakSecondLeg(opts) {
    var rand = seededRandom(opts.seed || 1111), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // First leg — strong, 10 candles, high volume, clear upward move
    var leg1 = buildPhase(rand, p, t, iv, 10, 0.28, 0.13, 240000, 0.10); all=all.concat(leg1.candles); p=leg1.endPrice; t=leg1.endTime
    // Pullback — clear and visible, several candles down
    var pb = buildPhase(rand, p, t, iv, 6, -0.14, 0.09, 110000, -0.20); all=all.concat(pb.candles); p=pb.endPrice; t=pb.endTime
    // Second leg — NOTICEABLY shorter (6 candles vs 10), MUCH lower volume (half)
    // Force it to not reach the prior high
    var leg2Target = leg1.endPrice - 0.40 // explicitly stops below first leg high
    var leg2 = buildLegToTarget(rand, p, leg2Target, t, iv, 6, 0.08, 95000); all=all.concat(leg2.candles); p=leg2.endPrice; t=leg2.endTime
    // Reversal — clear rollover
    var rev = buildPhase(rand, p, t, iv, 10, -0.24, 0.14, 220000, 0.30); all=all.concat(rev.candles)
    return { candles: all, zones: null }
  }

  function generateParabolic(opts) {
    var rand = seededRandom(opts.seed || 1212), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var base = buildPhase(rand, p, t, iv, 8, 0.15, 0.10, 160000, 0.05); all=all.concat(base.candles); p=base.endPrice; t=base.endTime
    var acc1 = buildPhase(rand, p, t, iv, 5, 0.30, 0.14, 220000, 0.20); all=all.concat(acc1.candles); p=acc1.endPrice; t=acc1.endTime
    var acc2 = buildPhase(rand, p, t, iv, 4, 0.42, 0.18, 290000, 0.30); all=all.concat(acc2.candles); p=acc2.endPrice; t=acc2.endTime
    var climax = buildPhase(rand, p, t, iv, 2, 0.55, 0.20, 380000, 0.10); all=all.concat(climax.candles); p=climax.endPrice; t=climax.endTime
    var crash = buildPhase(rand, p, t, iv, 8, -0.38, 0.22, 300000, -0.10); all=all.concat(crash.candles)
    return { candles: all, zones: null }
  }

  function generateVShape(opts) {
    var rand = seededRandom(opts.seed || 1313), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var stable = buildPhase(rand, p, t, iv, 5, 0.01, 0.04, 90000, 0); all=all.concat(stable.candles); p=stable.endPrice; t=stable.endTime
    var flush = buildPhase(rand, p, t, iv, 6, -0.32, 0.20, 270000, 0.40); all=all.concat(flush.candles); p=flush.endPrice; t=flush.endTime
    all.push({ time: t, open: p, high: p+0.15, low: p-0.30, close: p+0.10, volume: 260000 }); p=p+0.10; t+=iv
    var recovery = buildPhase(rand, p, t, iv, 7, 0.30, 0.16, 250000, -0.10); all=all.concat(recovery.candles)
    return { candles: all, zones: null }
  }

  function generateAccumulation(opts) {
    var rand = seededRandom(opts.seed || 707), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    for (var i = 0; i < 22; i++) {
      var drift = (rand() > 0.5 ? 1 : -0.8) * (0.02 + rand() * 0.06)
      var c = generateOneCandle(rand, p, drift, 0.06)
      var isUp = c.close >= c.open
      all.push({ time: t, open: c.open, high: c.high, low: c.low, close: c.close, volume: Math.round(isUp ? 140000+rand()*60000 : 60000+rand()*30000) })
      p = c.close; t += iv
    }
    var bo = buildPhase(rand, p, t, iv, 6, 0.18, 0.13, 220000, 0.40); all=all.concat(bo.candles)
    return { candles: all, zones: null }
  }

  function generateMorningFlush(opts) {
    var rand = seededRandom(opts.seed || 1414), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var gapOpen = p + 2.5
    var open1 = generateOneCandle(rand, gapOpen, 0.25, 0.10)
    all.push({ time: t, open: gapOpen, high: open1.high, low: gapOpen-0.10, close: open1.close, volume: 300000 }); p=open1.close; t+=iv
    var push = buildPhase(rand, p, t, iv, 3, 0.14, 0.09, 220000, -0.10); all=all.concat(push.candles); p=push.endPrice; t=push.endTime
    var flush = buildPhase(rand, p, t, iv, 10, -0.28, 0.18, 280000, 0.20); all=all.concat(flush.candles); p=flush.endPrice; t=flush.endTime
    var bounce = buildPhase(rand, p, t, iv, 5, 0.08, 0.09, 110000, -0.20); all=all.concat(bounce.candles)
    return { candles: all, zones: null }
  }

  function generateHealthyPullback(opts) {
    var rand = seededRandom(opts.seed || 606), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    var up = buildPhase(rand, p, t, iv, 14, 0.20, 0.13, 180000, 0.05); all=all.concat(up.candles); p=up.endPrice; t=up.endTime
    var pb = buildPhase(rand, p, t, iv, 8, -0.10, 0.08, 100000, -0.30); all=all.concat(pb.candles); p=pb.endPrice; t=pb.endTime
    var bounce = buildPhase(rand, p, t, iv, 9, 0.22, 0.14, 200000, 0.35); all=all.concat(bounce.candles)
    return { candles: all, zones: null }
  }

  function generateThreePushes(opts) {
    var rand = seededRandom(opts.seed || 1515), p = opts.startPrice || 100, t = opts.startTime, iv = (opts.timeframeMinutes||2)*60, all = []
    // Three progressively weaker pushes up
    var push1 = buildPhase(rand, p, t, iv, 7, 0.26, 0.13, 220000, 0.10); all=all.concat(push1.candles); p=push1.endPrice; t=push1.endTime
    var pb1 = buildPhase(rand, p, t, iv, 4, -0.12, 0.09, 100000, -0.20); all=all.concat(pb1.candles); p=pb1.endPrice; t=pb1.endTime
    var push2 = buildPhase(rand, p, t, iv, 6, 0.16, 0.11, 160000, -0.10); all=all.concat(push2.candles); p=push2.endPrice; t=push2.endTime
    var pb2 = buildPhase(rand, p, t, iv, 4, -0.11, 0.09, 95000, -0.15); all=all.concat(pb2.candles); p=pb2.endPrice; t=pb2.endTime
    var push3 = buildPhase(rand, p, t, iv, 5, 0.08, 0.09, 90000, -0.20); all=all.concat(push3.candles); p=push3.endPrice; t=push3.endTime
    // Reversal
    var rev = buildPhase(rand, p, t, iv, 9, -0.22, 0.14, 230000, 0.30); all=all.concat(rev.candles)
    return { candles: all, zones: null }
  }

  // ─── QUESTION BANK ───
  var QUESTIONS = [
    // ZONE CLICK (10)
    {
      id:'iq_z1_bullflag', title:'Bull Flag Breakout — Find Your Entry', type:'zone', generator:'bullFlag', seed:42,
      question:'This stock formed a bull flag. Strong uptrend leg, then tight consolidation on declining volume. Click where you would enter long.',
      zoneFeedback:{
        tooEarly:'Too early — you entered during the initial move before any consolidation formed. No defined risk and no confirmation the move continues.',
        ideal:'Perfect entry — you caught the breakout right as price cleared the consolidation on volume. Confirmed structure, defined risk below the flag low.',
        tooLate:'Too late — the move already extended before you clicked. Chasing here means poor risk/reward.'
      }
    },
    {
      id:'iq_z2_orb', title:'Opening Range Breakout — Find Your Entry', type:'zone', generator:'orb', seed:150,
      question:'The first 5 candles established a tight range on the open. Now price is breaking above the range high on a volume surge. Click where you would enter long.',
      zoneFeedback:{
        tooEarly:'Too early — price was still inside the opening range when you clicked. You need the breakout candle to close above the range high before entering.',
        ideal:'Strong entry — you entered right on the breakout above the opening range with volume confirming conviction. This is the highest-probability window in an ORB setup.',
        tooLate:'Too late — the ORB move already ran. The edge is the first 1-2 candles after the breakout, not several candles into the continuation.'
      }
    },
    {
      id:'iq_z3_retest', title:'Consolidation Breakout Retest — Find Your Entry', type:'zone', generator:'consolidationRetest', seed:250,
      question:'This stock broke out of consolidation, then pulled back to retest the breakout level on low volume. Click where you would enter on the retest bounce.',
      zoneFeedback:{
        tooEarly:'Too early — the retest wasn\'t complete yet. Entering before price returns to the breakout level and confirms the hold means no structure to trade against.',
        ideal:'Strong entry — you entered right at the retest of the breakout level where prior resistance becomes support. Low volume on the pullback confirmed no real selling pressure.',
        tooLate:'Too late — the retest bounce already ran. The edge in a retest entry is as close to the level as possible, not after it moves away.'
      }
    },
    {
      id:'iq_z4_bearflag', title:'Bear Flag Breakdown — Find Your Entry', type:'zone', generator:'bearFlag', seed:350,
      question:'This stock dropped hard, then bounced weakly on low volume — a classic bear flag. Click where you would enter SHORT on the breakdown.',
      zoneFeedback:{
        tooEarly:'Too early — you shorted during the initial leg down before the flag formed. No setup yet, just chasing a move already in progress.',
        ideal:'Strong short entry — you entered right as price broke below the bear flag on volume. The weak low-volume bounce confirmed sellers were just pausing before continuing.',
        tooLate:'Too late — the breakdown already extended. The best short entry is the first candle breaking below the flag low, not after the move runs.'
      }
    },
    {
      id:'iq_z5_hs', title:'Head & Shoulders — Find Your Short Entry', type:'zone', generator:'headShoulders', seed:202,
      question:'Classic head and shoulders top — left shoulder, higher head, right shoulder that failed to match the head. Click where you would enter SHORT.',
      zoneFeedback:{
        tooEarly:'Too early — the pattern wasn\'t confirmed yet. Price could still have made another high during shoulder formation.',
        ideal:'Strong short entry — this is the neckline break confirming the reversal. Volume picked up on the break showing real sellers stepped in.',
        tooLate:'Too late — the breakdown already ran. The best entry is the neckline break itself.'
      }
    },
    {
      id:'iq_z6_support', title:'Support Bounce (3rd Test) — Find Your Entry', type:'zone', generator:'supportBounce', seed:222,
      question:'This stock has tested and held the same support level twice before. It\'s pulling back to that level a third time. Click where you would enter long on the bounce.',
      zoneFeedback:{
        tooEarly:'Too early — price was still falling toward support. You need confirmation the level is holding before entering.',
        ideal:'Strong entry — you entered on the rejection candle at support showing buyers defending the level for the third time. Three successful tests is a high-probability setup.',
        tooLate:'Too late — the bounce already ran off the lows. The edge is entering as close to support as possible with confirmation.'
      }
    },
    {
      id:'iq_z7_doji', title:'Doji at the Top — What Do You Do?', type:'zone', generator:'dojiTop', seed:450,
      question:'This stock has been trending up for a while and just printed a doji candle at the highs — equal open and close, long wicks both directions. Click where a SHORT entry makes sense.',
      zoneFeedback:{
        tooEarly:'Too early — the doji hadn\'t formed yet. The uptrend was still intact with no indecision signal.',
        ideal:'Strong entry — the doji at the top signals indecision after an extended move. Entering short on the next red candle after the doji is the classic confirmation entry.',
        tooLate:'Too late — the reversal already played out. The signal was the doji itself, not several candles into the sell-off.'
      }
    },
    {
      id:'iq_z8_hammer', title:'Hammer Reversal — Find Your Entry', type:'zone', generator:'hammer', seed:550,
      question:'After a sustained downtrend, a hammer candle appears — small body near the high, very long lower wick showing buyers rejected the lows hard. Click where you would enter long.',
      zoneFeedback:{
        tooEarly:'Too early — the downtrend was still intact. The hammer hadn\'t formed yet to signal a potential reversal.',
        ideal:'Strong entry — the hammer\'s long lower wick shows buyers stepped in aggressively at the lows. Entering on the next green candle after the hammer is the confirmation entry.',
        tooLate:'Too late — the recovery already ran from the hammer low. The entry was the candle after the hammer, not several candles into the bounce.'
      }
    },
    {
      id:'iq_z9_lhll', title:'Lower High Lower Low — Confirm the Downtrend', type:'zone', generator:'lhll', seed:650,
      question:'This chart shows a high, a sell-off to a low, then a bounce that failed to reach the prior high. Click where the downtrend is CONFIRMED with a lower low.',
      zoneFeedback:{
        tooEarly:'Too early — the lower high had formed but price hadn\'t broken below the prior low yet. That break is the confirmation — without it you\'re anticipating, not trading a confirmed trend.',
        ideal:'Strong entry — you identified the moment price broke below the prior low, confirming the lower high lower low structure. This is the textbook downtrend confirmation entry.',
        tooLate:'Too late — the confirmed downtrend already ran significantly. The entry is the break of the prior low, not after the move extends.'
      }
    },
    {
      id:'iq_z10_triangle', title:'Ascending Triangle — Find Your Entry', type:'zone', generator:'ascendingTriangle', seed:303,
      question:'Three higher lows against flat resistance. Buyers are stepping in sooner each time. Click where you would enter LONG on the breakout.',
      zoneFeedback:{
        tooEarly:'Too early — price was still inside the triangle below resistance. No breakout confirmation yet.',
        ideal:'Strong entry — the breakout above resistance with volume. Higher lows showed increasing urgency from buyers and the volume confirmed real conviction on the break.',
        tooLate:'Too late — the breakout already ran. The edge is the first candle clearing resistance with volume.'
      }
    },

    // MULTIPLE CHOICE (10)
    {
      id:'iq_mc1_fakebreakout', title:'Fake Breakout Recognition', generator:'fakeBreakout', seed:77,
      question:'This stock formed what looks like a flag and attempted a breakout. Look carefully at the volume during consolidation and the breakout candle. What is happening?',
      choices:['Clean flag setup — the breakout is valid, buy immediately','Volume stayed elevated during consolidation (should have declined) and the breakout came on weak volume — this is a failed breakout likely to reverse','The pattern is identical to a healthy flag','Volume never matters for flags — only price structure counts'],
      correct:1,
      explanation:'This is a failed breakout. In a healthy flag, volume DECLINES during consolidation — sellers are passive. Here volume stayed elevated meaning real selling pressure was present. The breakout then came on weak volume with no real buyers behind it. Both signals together predicted the reversal.'
    },
    {
      id:'iq_mc2_greenred', title:'Green to Red — What Does It Signal?', generator:'greenToRed', seed:888,
      question:'This stock opened strong, pushed higher, then volume dried up at the highs and price crossed back below the opening price — going red. What does this tell you?',
      choices:['Buy immediately — stocks always recover from intraday dips','This is a Green to Red reversal — early buyers are trapped, sellers are in control, and the path of least resistance is lower for the rest of the session','Green to Red moves always reverse back green by close','This only matters for swing traders'],
      correct:1,
      explanation:'Green to Red is one of the most reliable intraday warning signals. Early buyers are now underwater and will sell into any bounce. The sellers who shorted the high are profitable and not covering. Volume drying up at the highs showed distribution. Once it goes red, sellers have control.'
    },
    {
      id:'iq_mc3_killcandle', title:'Kill Candle — What Happens Next?', generator:'killCandle', seed:999,
      question:'This stock was in a steady uptrend then printed a massive red candle closing near its lows on the highest volume of the entire move. What does this tell you?',
      choices:['One candle means nothing — the uptrend will resume immediately','This is a kill candle — massive red body closing near the lows on explosive volume signals real sellers stepped in with size. The uptrend is likely over','High volume on a down candle is always bullish — buyers are absorbing supply','You should buy immediately since the selloff is overdone'],
      correct:1,
      explanation:'A kill candle is one of the clearest reversal signals. Large red body closing near lows plus volume that dwarfs everything before it means institutional sellers stepped in with size. The balance of power shifted from buyers to sellers and subsequent price action typically confirms the reversal.'
    },
    {
      id:'iq_mc4_weakleg', title:'Weak Second Leg — What Does It Mean?', generator:'weakSecondLeg', seed:1111,
      question:'This stock made a strong first leg up on heavy volume, pulled back, then attempted a second leg. The second leg is shorter and volume is significantly lower. What does this tell you?',
      choices:['The second leg being shorter means nothing — stocks move in random increments','A weak second leg with declining volume signals buyer exhaustion — each push attracts fewer buyers. A reversal is likely forming','Lower volume on the second leg is bullish — no one is selling','You should size up since the trend is clearly continuing'],
      correct:1,
      explanation:'Weak second legs are one of the most reliable early warning signals of a trend reversal. When the first leg is strong and high volume but the second attempt covers less ground on lower volume — buyers are losing conviction. They\'re paying up for a move attracting fewer participants. This is where disciplined traders tighten stops rather than add.'
    },
    {
      id:'iq_mc5_parabolic', title:'Parabolic Move — What Is the Risk?', generator:'parabolic', seed:1212,
      question:'This stock has been accelerating — each leg larger and faster than the last, with volume exploding on every push. It just printed its biggest candle yet. What is the highest-probability next move?',
      choices:['Buy aggressively — parabolic moves always continue for weeks','Parabolic moves end violently. The acceleration cannot be sustained — when the last buyer buys there is no one left to push it higher and the reversal happens with the same speed as the move up','Parabolic moves always consolidate sideways before continuing','Volume increasing confirms the trend continues indefinitely'],
      correct:1,
      explanation:'Parabolic moves are the most dangerous moment to be a new buyer. When a stock goes vertical — FOMO is driving the buying, not value. At some point the last buyer buys. The reversal from a parabolic move can be just as fast and violent as the move up — cascading stops from everyone who bought near the top.'
    },
    {
      id:'iq_mc6_vshape', title:'V-Shape Recovery — Real or Dead Cat?', generator:'vShape', seed:1313,
      question:'This stock flushed sharply on huge volume then immediately started recovering at the same speed on strong volume. How do you read this?',
      choices:['Never buy a stock that just dropped','The speed and volume of the recovery matching the selloff suggests a genuine V-shape — immediate aggressive buying means the selling was a liquidity flush, not a fundamental change','You should wait at least two weeks before buying anything that dropped','V-shapes never happen'],
      correct:1,
      explanation:'V-shape recoveries are real. The key difference from a dead cat bounce is the character of the recovery — when it\'s as aggressive as the selloff with volume still elevated, it means buyers stepped in with the same conviction sellers had. A dead cat is slow, grinds higher on low volume. A real V is sharp and immediate.'
    },
    {
      id:'iq_mc7_accumulation', title:'Accumulation or Distribution?', generator:'accumulation', seed:707,
      question:'This stock has been sideways for weeks. Look at volume on up days versus down days. What is most likely happening?',
      choices:['Sideways price action is always meaningless','Volume is heavier on green days and lighter on red days — this is accumulation. Smart money buying the dips while retail sells into weakness, coiling the spring before a breakout','This is clearly distribution — the stock is about to collapse','Only price range matters in consolidation'],
      correct:1,
      explanation:'Accumulation is what happens before a breakout — and the volume pattern reveals it before price does. When green days carry heavier volume than red days in a sideways range, buyers are absorbing supply. When supply runs out, the breakout happens on heavy volume — exactly what followed here.'
    },
    {
      id:'iq_mc8_morningflush', title:'Morning Flush — Buy the Dip or Stay Out?', generator:'morningFlush', seed:1414,
      question:'This stock gapped up strongly, pushed higher for a few candles, then flushed hard on massive volume giving back most of the gap. What is the correct read?',
      choices:['Buy immediately — gap ups always recover by end of day','This is a morning flush. The stock lured in gap buyers then flushed them hard. Without a clean base and reclaim of a key level, the safest move is to wait for structure — not catch the knife mid-flush','The flush is complete — the bigger the red candle the more bullish','Gap ups never fail so this is always a buy'],
      correct:1,
      explanation:'Morning flushes are one of the most common traps for beginners. A strong gap up creates FOMO — people buy the open. Instead, early sellers distribute into that excitement and the stock flushes hard. A flush alone does not make it buyable. You need a base to form, a reclaim of a key level on volume, and clear structure before entering.'
    },
    {
      id:'iq_mc9_pullback', title:'Healthy Pullback vs Breakdown — Which Is This?', generator:'healthyPullback', seed:606,
      question:'This stock was in a clear uptrend and pulled back. Look at volume during the pullback and how price reacted at the lows. How do you classify this?',
      choices:['Any pullback in an uptrend is a breakdown — sell immediately','This is a healthy pullback — volume declined during the selling (no real pressure) and price held at a logical level before resuming the uptrend on renewed volume. This is a buyable dip, not a reversal','Anything over 5% is a breakdown','Pullbacks are always followed by lower lows'],
      correct:1,
      explanation:'Not every pullback is a breakdown. A healthy pullback has three characteristics: volume declines during the selling, price holds at a meaningful level, and the recovery comes on increased volume. A real breakdown has the opposite — heavy volume on the sell and no holding of levels. This chart showed all characteristics of a healthy pullback.'
    },
    {
      id:'iq_mc10_threepushes', title:'Three Pushes Up — What Does It Signal?', generator:'threePushes', seed:1515,
      question:'This stock made three pushes higher. Each push was smaller than the last and came on lower volume. The third push barely moved. What does this pattern tell you?',
      choices:['Three pushes up is a very bullish sign — buy the third push aggressively','This is an exhaustion pattern — each push requiring less selling to stop it but also attracting fewer buyers. When the third push fails to extend the prior high it signals buyers are running out. A reversal is likely next','Lower volume means the move is safe — no one is selling','Three is a random number — this means nothing'],
      correct:1,
      explanation:'Three pushes up is a textbook exhaustion pattern. The first push is strong — real buyers with conviction. The second push is weaker — fewer buyers willing to pay up. The third push barely moves — almost no one left to buy. The market is showing you the pool of buyers is drying up. When the third push fails to make a new high or barely does, the next move is almost always a reversal.'
    }
  ]

  // ─── RENDERING ENGINE ───

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
    if (q.generator === 'orb') return generateORB(opts)
    if (q.generator === 'consolidationRetest') return generateConsolidationRetest(opts)
    if (q.generator === 'bearFlag') return generateBearFlag(opts)
    if (q.generator === 'headShoulders') return generateHeadShoulders(opts)
    if (q.generator === 'supportBounce') return generateSupportBounce(opts)
    if (q.generator === 'dojiTop') return generateDojiTop(opts)
    if (q.generator === 'hammer') return generateHammer(opts)
    if (q.generator === 'lhll') return generateLHLL(opts)
    if (q.generator === 'ascendingTriangle') return generateAscendingTriangle(opts)
    if (q.generator === 'fakeBreakout') return { candles: generateFakeBreakout(opts).candles, zones: null }
    if (q.generator === 'greenToRed') return generateGreenToRed(opts)
    if (q.generator === 'killCandle') return generateKillCandle(opts)
    if (q.generator === 'weakSecondLeg') return generateWeakSecondLeg(opts)
    if (q.generator === 'parabolic') return generateParabolic(opts)
    if (q.generator === 'vShape') return generateVShape(opts)
    if (q.generator === 'accumulation') return generateAccumulation(opts)
    if (q.generator === 'morningFlush') return generateMorningFlush(opts)
    if (q.generator === 'healthyPullback') return generateHealthyPullback(opts)
    if (q.generator === 'threePushes') return generateThreePushes(opts)
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
      width: container.clientWidth, height: 420,
      layout: { background: { color: '#111712' }, textColor: '#8a9a8c' },
      grid: { vertLines: { color: '#1a2018' }, horzLines: { color: '#1a2018' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1e2820' },
      rightPriceScale: { borderColor: '#1e2820', scaleMargins: { top: 0.1, bottom: 0.28 } },
      crosshair: { mode: 0 },
    })
    var series = chart.addCandlestickSeries({ upColor:'#22c55e', downColor:'#ef4444', borderUpColor:'#22c55e', borderDownColor:'#ef4444', wickUpColor:'#22c55e', wickDownColor:'#ef4444' })
    series.setData(candles)
    var volumeSeries = chart.addHistogramSeries({ priceFormat:{type:'volume'}, priceScaleId:'volume', color:'#3a4a3c' })
    chart.priceScale('volume').applyOptions({ scaleMargins:{top:0.78,bottom:0} })
    volumeSeries.setData(candles.map(function(c) { return { time:c.time, value:c.volume||0, color:c.close>=c.open?'rgba(34,197,94,0.5)':'rgba(239,68,68,0.5)' } }))
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
    window.addEventListener('resize', function() { chart.applyOptions({width:container.clientWidth}) })
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
    var markers = [{ time:candles[clickedIdx].time, position:'belowBar', color:isCorrect?'#22c55e':'#ef4444', shape:'arrowUp', text:'Your entry' }]
    if (!isCorrect && zones) {
      var idealMid = Math.floor((zones.ideal.start + zones.ideal.end) / 2)
      if (candles[idealMid]) markers.push({ time:candles[idealMid].time, position:'aboveBar', color:'#22c55e', shape:'arrowDown', text:'Ideal entry' })
    }
    series.setMarkers(markers)
    var explainEl = document.getElementById('explain-' + q.id)
    explainEl.style.display = 'block'
    explainEl.className = 'iq-explanation ' + (isCorrect ? 'iq-correct' : 'iq-incorrect')
    explainEl.innerHTML = '<div class="iq-result-label">' + (isCorrect ? '✓ Strong Entry' : '✗ Not the ideal spot') + '</div><div class="iq-explanation-text">' + (q.zoneFeedback[zoneHit] || q.zoneFeedback.tooEarly) + '</div>'
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
    explainEl.innerHTML = '<div class="iq-result-label">' + (isCorrect ? '✓ Correct' : '✗ Not quite') + '</div><div class="iq-explanation-text">' + q.explanation + '</div>'
    if (onAnswered) onAnswered(isCorrect)
  }

  function render(containerId) {
    var container = document.getElementById(containerId)
    if (!container) return
    var correctCount = 0, answeredCount = 0
    container.innerHTML = '<div id="iq-progress-bar" class="iq-progress-bar"></div><div id="iq-questions-stack" class="iq-questions-stack"></div>'
    var stack = document.getElementById('iq-questions-stack')
    function updateProgress() {
      var bar = document.getElementById('iq-progress-bar')
      if (!bar) return
      bar.innerHTML = '<div class="iq-progress-text">' + answeredCount + ' of ' + QUESTIONS.length + ' answered' + (answeredCount === QUESTIONS.length ? ' · Score: ' + correctCount + '/' + QUESTIONS.length : '') + '</div>'
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
