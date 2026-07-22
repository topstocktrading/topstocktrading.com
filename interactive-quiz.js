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

  // Generates a clean bull flag: uptrend leg -> tight consolidation on declining volume -> breakout on volume spike
  function generateBullFlag(opts) {
    var rand = seededRandom(opts.seed || 42)
    var candles = []
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var price = startPrice
    var t = startTime
    var i = 0

    // Phase 1: uptrend leg (15 candles, strong up move)
    var legCandles = opts.legCandles || 15
    for (var p1 = 0; p1 < legCandles; p1++) {
      var move = (0.15 + rand() * 0.35) // strong upward bias
      var open = price
      var close = price + move
      var high = close + rand() * 0.15
      var low = open - rand() * 0.08
      var vol = 180000 + rand() * 120000 // high volume on the move
      candles.push({ time: t, open: open, high: high, low: low, close: close, volume: Math.round(vol) })
      price = close
      t += interval
      i++
    }

    var flagHigh = price
    var flagLow = price - (price * 0.02) // tight 2% range

    // Phase 2: consolidation (12 candles, tight range, DECLINING volume — the key signal)
    var flagCandles = opts.flagCandles || 12
    for (var p2 = 0; p2 < flagCandles; p2++) {
      var range = (flagHigh - flagLow)
      var open2 = flagLow + rand() * range
      var close2 = flagLow + rand() * range
      var high2 = Math.max(open2, close2) + rand() * (range * 0.15)
      var low2 = Math.min(open2, close2) - rand() * (range * 0.15)
      // Volume declines steadily through consolidation — this is the pattern signal
      var volDeclineFactor = 1 - (p2 / flagCandles) * 0.65
      var vol2 = (90000 * volDeclineFactor) + rand() * 20000
      candles.push({ time: t, open: open2, high: high2, low: low2, close: close2, volume: Math.round(vol2) })
      t += interval
      i++
    }

    // Phase 3: breakout (8 candles, volume spike, price pushes above flag high)
    var breakoutCandles = opts.breakoutCandles || 8
    var breakoutPrice = flagHigh
    for (var p3 = 0; p3 < breakoutCandles; p3++) {
      var move3 = (0.10 + rand() * 0.30)
      var open3 = breakoutPrice
      var close3 = breakoutPrice + move3
      var high3 = close3 + rand() * 0.12
      var low3 = open3 - rand() * 0.05
      // Volume spikes hard on breakout — confirms the move
      var volSpike = 220000 + rand() * 180000
      candles.push({ time: t, open: open3, high: high3, low: low3, close: close3, volume: Math.round(volSpike) })
      breakoutPrice = close3
      t += interval
      i++
    }

    return candles
  }

  function generateFailedBreakout(opts) {
    var rand = seededRandom(opts.seed || 77)
    var candles = []
    var startPrice = opts.startPrice || 100
    var startTime = opts.startTime || Math.floor(Date.now()/1000) - 3600
    var interval = (opts.timeframeMinutes || 2) * 60
    var price = startPrice
    var t = startTime

    // Uptrend leg
    for (var p1 = 0; p1 < 12; p1++) {
      var move = (0.12 + rand() * 0.25)
      var open = price, close = price + move
      var high = close + rand() * 0.12, low = open - rand() * 0.06
      var vol = 150000 + rand() * 80000
      candles.push({ time: t, open: open, high: high, low: low, close: close, volume: Math.round(vol) })
      price = close; t += interval
    }

    var flagHigh = price, flagLow = price - (price * 0.025)

    // Consolidation with FLAT/RISING volume — no real pause, this is the tell
    for (var p2 = 0; p2 < 10; p2++) {
      var range = flagHigh - flagLow
      var open2 = flagLow + rand() * range, close2 = flagLow + rand() * range
      var high2 = Math.max(open2,close2) + rand()*(range*0.2), low2 = Math.min(open2,close2) - rand()*(range*0.2)
      var vol2 = 100000 + rand() * 40000 // volume stays elevated, does not decline
      candles.push({ time: t, open: open2, high: high2, low: low2, close: close2, volume: Math.round(vol2) })
      t += interval
    }

    // Fake breakout then reversal on LOW volume (no real buying behind it)
    var bp = flagHigh
    for (var p3 = 0; p3 < 4; p3++) {
      var move3 = (0.08 + rand()*0.15)
      var open3 = bp, close3 = bp + move3
      var vol3 = 70000 + rand()*20000 // weak volume on the breakout attempt
      candles.push({ time: t, open: open3, high: close3+rand()*0.08, low: open3-rand()*0.04, close: close3, volume: Math.round(vol3) })
      bp = close3; t += interval
    }
    // Reversal — dumps back through the flag on heavy volume
    for (var p4 = 0; p4 < 6; p4++) {
      var moveDown = (0.20 + rand()*0.35)
      var open4 = bp, close4 = bp - moveDown
      var vol4 = 200000 + rand()*100000
      candles.push({ time: t, open: open4, high: open4+rand()*0.05, low: close4-rand()*0.1, close: close4, volume: Math.round(vol4) })
      bp = close4; t += interval
    }

    return candles
  }

  // ─────────────────────────────────────────
  // QUESTION BANK
  // ─────────────────────────────────────────
  var QUESTIONS = [
    {
      id: 'iq_1',
      title: 'Setup Identification',
      generator: 'bullFlag',
      seed: 42,
      question: 'This stock is showing this pattern. Based on the price action and volume, what would you do?',
      choices: [
        'Big move up, healthy consolidation on declining volume, then breakout — this is a buyable flag breakout',
        'This is already too extended — the move already happened, do not chase',
        'The consolidation is too tight — this looks like a dead stock, skip it',
        'Volume is declining which means buyers are losing interest — avoid'
      ],
      correct: 0,
      explanation: 'This is a clean flag breakout. The initial move establishes the trend, price consolidates on declining volume (sellers are not stepping in — buyers are just pausing, which is healthy not bearish), and the breakout on renewed volume confirms continuation. Declining volume during consolidation is normal and bullish — it shows an absence of selling pressure, not a loss of interest.'
    },
    {
      id: 'iq_2',
      title: 'Setup Identification',
      generator: 'failedBreakout',
      seed: 77,
      question: 'This stock also shows an uptrend into a consolidation, followed by a breakout attempt. What is different here, and what should you do?',
      choices: [
        'This is the same clean flag setup as before — buy the breakout',
        'Volume stayed flat or rose during consolidation instead of declining, and the breakout has weak volume — this is a low-conviction move likely to fail',
        'The pattern is identical to a good flag, the only difference is the ticker',
        'Volume does not matter for this decision — only price structure matters'
      ],
      correct: 1,
      explanation: 'This is a failed breakout. Notice the volume during consolidation did NOT decline the way it should in a healthy flag — it stayed elevated, meaning real selling pressure was present the whole time, not just quiet pausing. The breakout itself also came on weak volume, meaning there was no real conviction behind the move. Both signals together predicted the reversal that followed. This is exactly why volume during consolidation is one of the most important things to check before trusting a breakout.'
    },
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
    if (q.generator === 'failedBreakout') return generateFailedBreakout(opts)
    return generateBullFlag(opts)
  }

  function renderChart(containerId, candles) {
    var container = document.getElementById(containerId)
    if (!container) return
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

    window.addEventListener('resize', function() {
      chart.applyOptions({ width: container.clientWidth })
    })
  }

  function renderQuestion(sectionEl, q, onAnswered) {
    sectionEl.innerHTML =
      '<div class="iq-question-wrap">' +
        '<div class="iq-header">' +
          '<div class="iq-ticker">' + q.title + '</div>' +
          '<div class="iq-meta">Illustrative pattern · 2-min chart</div>' +
        '</div>' +
        '<div class="iq-chart-container" id="chart-' + q.id + '"><div class="iq-loading">Rendering chart...</div></div>' +
        '<div class="iq-question-text">' + q.question + '</div>' +
        '<div class="iq-choices" id="choices-' + q.id + '"></div>' +
        '<div class="iq-explanation" id="explain-' + q.id + '" style="display:none;"></div>' +
      '</div>'

    var choicesEl = document.getElementById('choices-' + q.id)
    q.choices.forEach(function(choice, i) {
      var btn = document.createElement('div')
      btn.className = 'iq-choice'
      btn.innerHTML = '<span class="iq-choice-letter">' + String.fromCharCode(65+i) + '</span><span>' + choice + '</span>'
      btn.onclick = function() { handleAnswer(q, i, choicesEl, onAnswered) }
      choicesEl.appendChild(btn)
    })

    loadLightweightCharts(function() {
      var candles = generateCandles(q)
      renderChart('chart-' + q.id, candles)
    })
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

    var currentIdx = 0
    var correctCount = 0

    function showQuestion(idx) {
      if (idx >= QUESTIONS.length) {
        container.innerHTML =
          '<div class="iq-complete">' +
            '<div class="iq-complete-emoji">🎯</div>' +
            '<div class="iq-complete-title">Quiz Complete</div>' +
            '<div class="iq-complete-score">' + correctCount + ' of ' + QUESTIONS.length + ' correct</div>' +
          '</div>'
        return
      }
      renderQuestion(container, QUESTIONS[idx], function(correct) {
        if (correct) correctCount++
        setTimeout(function() { currentIdx++; showQuestion(currentIdx) }, 4000)
      })
    }

    showQuestion(currentIdx)
  }

  return { render: render, QUESTIONS: QUESTIONS }
})()
