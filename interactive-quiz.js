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

  // ─────────────────────────────────────────
  // QUESTION BANK
  // ─────────────────────────────────────────
  var QUESTIONS = [
    {
      id: 'iq_zone_1',
      title: 'Click Your Entry',
      type: 'zone',
      generator: 'bullFlag',
      seed: 42,
      question: 'Click directly on the chart where YOU would enter this trade. There is no text answer — your click is your entry.',
      zoneFeedback: {
        tooEarly: 'Too early — you entered during the initial move before any consolidation formed. There was no confirmed setup yet, just a strong candle. Entering here means you have no defined risk level and no confirmation the move will continue.',
        ideal: 'Strong entry — you caught the breakout right as it confirmed, just as price cleared the consolidation with volume behind it. This is the highest probability entry: confirmed structure, defined risk below the flag low, and volume confirming real buyers stepped in.',
        tooLate: 'Too late — the move already extended significantly before you clicked. Chasing here means poor risk/reward: your stop has to be far away to make sense, and most of the move is already behind you.'
      }
    },
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
    if (q.generator === 'failedBreakout') return { candles: generateFailedBreakout(opts), zones: null }
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
