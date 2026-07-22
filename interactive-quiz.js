// ============================================================
// TST INTERACTIVE TRADE QUIZ
// Real historical chart data — identify good vs bad setups
// ============================================================

window.TST_INTERACTIVE_QUIZ = (function() {

  var POLY_KEY = 'r4QqeZK_UrcI_6JPgVybHQbSzktLumdP';

  // ─────────────────────────────────────────
  // QUESTION BANK — real ticker/date/time examples
  // Each question pulls live chart data at render time
  // ─────────────────────────────────────────
  var QUESTIONS = [
    {
      id: 'iq_1',
      ticker: 'NVDA',
      date: '2026-07-08',
      focusTime: '13:20', // 1:20 PM ET
      timeframe: 2, // 2-minute candles
      windowMinutesBefore: 40,
      windowMinutesAfter: 20,
      question: 'NVDA is showing this pattern into 1:20 PM. Based on the price action, what would you do?',
      choices: [
        'Big move up, healthy consolidation on lower volume, then breakout — this is a buyable flag breakout',
        'This is already too extended — the move already happened, do not chase',
        'The consolidation is too tight — this looks like a dead stock, skip it',
        'Volume is declining which means buyers are losing interest — avoid'
      ],
      correct: 0,
      explanation: 'This was a clean flag breakout. Big move up established the trend, price consolidated on declining volume (a healthy sign — sellers are not stepping in, buyers are just pausing), and the breakout on renewed volume confirmed continuation. Declining volume during consolidation is normal and bullish, not a warning sign — it shows sellers are not present, not that buyers left.'
    },
  ]

  function decodeOptionSymbol(ticker) {
    var underlying = ticker.replace(/\d{6}[CP]\d+$/, '') || ticker
    return underlying
  }

  function loadLightweightCharts(callback) {
    if (window.LightweightCharts) { callback(); return }
    var script = document.createElement('script')
    script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js'
    script.onload = callback
    document.head.appendChild(script)
  }

  async function fetchCandles(ticker, dateStr, timeframeMinutes) {
    var underlying = decodeOptionSymbol(ticker)
    var url = 'https://api.polygon.io/v2/aggs/ticker/' + underlying +
      '/range/' + timeframeMinutes + '/minute/' + dateStr + '/' + dateStr +
      '?adjusted=true&sort=asc&limit=500&apiKey=' + POLY_KEY

    var resp = await fetch(url)
    if (!resp.ok) throw new Error('Polygon response: ' + resp.status)
    var data = await resp.json()
    if (!data.results || data.results.length === 0) throw new Error('No data for ' + dateStr)

    var candles = data.results.map(function(bar) {
      return { time: Math.floor(bar.t / 1000), open: bar.o, high: bar.h, low: bar.l, close: bar.c, volume: bar.v }
    })

    // Filter to regular market hours (13:00-21:30 UTC covers both EDT/EST safely)
    candles = candles.filter(function(c) {
      var d = new Date(c.time * 1000)
      var utcMins = d.getUTCHours() * 60 + d.getUTCMinutes()
      return utcMins >= 780 && utcMins <= 1290
    })

    return candles
  }

  function filterToWindow(candles, dateStr, focusTime, minsBefore, minsAfter) {
    var parts = focusTime.split(':')
    var focusDate = new Date(dateStr + 'T' + focusTime + ':00-04:00') // assume EDT, close enough for display window
    var focusSec = Math.floor(focusDate.getTime() / 1000)
    var startSec = focusSec - (minsBefore * 60)
    var endSec = focusSec + (minsAfter * 60)
    return candles.filter(function(c) { return c.time >= startSec && c.time <= endSec })
  }

  function renderChart(containerId, candles) {
    var container = document.getElementById(containerId)
    if (!container) return
    container.innerHTML = ''

    var chart = LightweightCharts.createChart(container, {
      width: container.clientWidth,
      height: 380,
      layout: { background: { color: '#111712' }, textColor: '#8a9a8c' },
      grid: { vertLines: { color: '#1a2018' }, horzLines: { color: '#1a2018' } },
      timeScale: { timeVisible: true, secondsVisible: false, borderColor: '#1e2820' },
      rightPriceScale: { borderColor: '#1e2820' },
      crosshair: { mode: 0 },
    })

    var series = chart.addCandlestickSeries({
      upColor: '#22c55e', downColor: '#ef4444',
      borderUpColor: '#22c55e', borderDownColor: '#ef4444',
      wickUpColor: '#22c55e', wickDownColor: '#ef4444',
    })
    series.setData(candles)
    chart.timeScale().fitContent()

    window.addEventListener('resize', function() {
      chart.applyOptions({ width: container.clientWidth })
    })
  }

  async function renderQuestion(sectionEl, q, onAnswered) {
    sectionEl.innerHTML =
      '<div class="iq-question-wrap">' +
        '<div class="iq-header">' +
          '<div class="iq-ticker">' + q.ticker + '</div>' +
          '<div class="iq-meta">' + q.date + ' · ' + q.focusTime + ' ET · ' + q.timeframe + '-min chart</div>' +
        '</div>' +
        '<div class="iq-chart-container" id="chart-' + q.id + '"><div class="iq-loading">Loading real market data...</div></div>' +
        '<div class="iq-question-text">' + q.question + '</div>' +
        '<div class="iq-choices" id="choices-' + q.id + '"></div>' +
        '<div class="iq-explanation" id="explain-' + q.id + '" style="display:none;"></div>' +
      '</div>'

    var choicesEl = document.getElementById('choices-' + q.id)
    q.choices.forEach(function(choice, i) {
      var btn = document.createElement('div')
      btn.className = 'iq-choice'
      btn.dataset.idx = i
      btn.innerHTML = '<span class="iq-choice-letter">' + String.fromCharCode(65+i) + '</span><span>' + choice + '</span>'
      btn.onclick = function() { handleAnswer(q, i, choicesEl, onAnswered) }
      choicesEl.appendChild(btn)
    })

    try {
      loadLightweightCharts(async function() {
        try {
          var allCandles = await fetchCandles(q.ticker, q.date, q.timeframe)
          var windowed = filterToWindow(allCandles, q.date, q.focusTime, q.windowMinutesBefore, q.windowMinutesAfter)
          if (windowed.length === 0) windowed = allCandles // fallback to full day if window filter too narrow
          renderChart('chart-' + q.id, windowed)
        } catch(err) {
          document.getElementById('chart-' + q.id).innerHTML = '<div class="iq-error">Could not load chart data: ' + err.message + '</div>'
        }
      })
    } catch(err) {
      document.getElementById('chart-' + q.id).innerHTML = '<div class="iq-error">Chart library failed to load.</div>'
    }
  }

  function handleAnswer(q, chosenIdx, choicesEl, onAnswered) {
    var allChoices = choicesEl.querySelectorAll('.iq-choice')
    allChoices.forEach(function(el, i) {
      el.onclick = null
      el.classList.remove('selected')
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
        setTimeout(function() {
          currentIdx++
          showQuestion(currentIdx)
        }, 3500)
      })
    }

    showQuestion(currentIdx)
  }

  return { render: render, QUESTIONS: QUESTIONS }
})()
