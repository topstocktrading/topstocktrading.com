
// TST Academy — Profile System
// Trade Journal, Performance Dashboard, Admin Panel
// Loaded separately from members.html

// ============================================================
// SUPABASE HELPERS
// ============================================================

async function getUser() {
  if (!window.supabase) return null;
  try {
    var r = await window.supabase.auth.getUser();
    return r.data ? r.data.user : null;
  } catch(e) { return null; }
}

async function getUserEmail() {
  var u = await getUser();
  return u ? u.email : null;
}

// ============================================================
// TRADE JOURNAL
// ============================================================

var TST_JOURNAL = {

  // Render the full My Profile page with tabs
  renderProfilePage: function() {
    var html = '<div class="profile-page">' +
      '<div class="profile-header">' +
        '<div class="profile-header-label">TST Academy</div>' +
        '<h2 class="profile-header-title">My Profile</h2>' +
      '</div>' +
      '<div class="profile-tabs">' +
        '<button class="profile-tab active" onclick="TST_JOURNAL.switchTab(\'overview\', this)">Overview</button>' +
        '<button class="profile-tab" onclick="TST_JOURNAL.switchTab(\'journal\', this)">Trade Journal</button>' +
        '<button class="profile-tab" onclick="TST_JOURNAL.switchTab(\'performance\', this)">Performance</button>' +
        '<button class="profile-tab" onclick="TST_JOURNAL.switchTab(\'behavioral\', this)">Behavioral Profile</button>' +
      '</div>' +
      '<div class="profile-tab-content" id="profileTabContent">' +
        this.renderOverview() +
      '</div>' +
    '</div>';
    return html;
  },

  switchTab: function(tab, btn) {
    document.querySelectorAll('.profile-tab').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    var content = document.getElementById('profileTabContent');
    if (!content) return;
    if (tab === 'overview') content.innerHTML = TST_JOURNAL.renderOverview();
    if (tab === 'journal') { content.innerHTML = TST_JOURNAL.renderJournalTab(); TST_JOURNAL.loadTrades(); }
    if (tab === 'performance') { content.innerHTML = TST_JOURNAL.renderPerformanceTab(); TST_JOURNAL.loadPerformance(); }
    if (tab === 'behavioral') content.innerHTML = TST_JOURNAL.renderBehavioralTab();
  },

  // ============================================================
  // OVERVIEW TAB
  // ============================================================
  renderOverview: function() {
    return '<div class="profile-section">' +
      '<div class="overview-grid">' +
        '<div class="overview-card">' +
          '<div class="ov-card-label">Total Trades Logged</div>' +
          '<div class="ov-card-num" id="ovTotalTrades">—</div>' +
          '<div class="ov-card-sub">in your journal</div>' +
        '</div>' +
        '<div class="overview-card">' +
          '<div class="ov-card-label">Overall Win Rate</div>' +
          '<div class="ov-card-num" id="ovWinRate">—</div>' +
          '<div class="ov-card-sub">across all setups</div>' +
        '</div>' +
        '<div class="overview-card">' +
          '<div class="ov-card-label">Total P&L</div>' +
          '<div class="ov-card-num" id="ovPnl">—</div>' +
          '<div class="ov-card-sub">all logged trades</div>' +
        '</div>' +
        '<div class="overview-card">' +
          '<div class="ov-card-label">Best Setup</div>' +
          '<div class="ov-card-num ov-small" id="ovBestSetup">—</div>' +
          '<div class="ov-card-sub">highest win rate</div>' +
        '</div>' +
      '</div>' +
      '<div class="overview-actions">' +
        '<button class="btn-primary-green" onclick="TST_JOURNAL.switchTab(\'journal\', document.querySelectorAll(\'.profile-tab\')[1])">Log a Trade</button>' +
        '<button class="btn-outline-green" onclick="TST_JOURNAL.switchTab(\'performance\', document.querySelectorAll(\'.profile-tab\')[2])">View Performance</button>' +
      '</div>' +
    '</div>';
  },

  // ============================================================
  // JOURNAL TAB
  // ============================================================
  renderJournalTab: function() {
    var setupTypes = ['TST Flag Breakout','TST Dip Buy','TST Breakout','TST Reversal','TST Momentum','TST Liquidity Sweep','TST Gap Play','TST V-Shape Recovery','TST VWAP Reclaim','TST Opening Drive','Other'];
    var exitReasons = ['Stop Hit','Target Hit','Manual Exit - Profit','Manual Exit - Loss','Time Exit','Trailing Stop','Other'];
    var setupOpts = setupTypes.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('');
    var exitOpts = exitReasons.map(function(r){ return '<option value="'+r+'">'+r+'</option>'; }).join('');

    return '<div class="profile-section">' +
      // LOG NEW TRADE FORM
      '<div class="journal-form-wrap">' +
        '<div class="journal-form-title">Log a Trade</div>' +
        '<div class="journal-form" id="tradeForm">' +
          '<div class="form-row">' +
            '<div class="form-field">' +
              '<label>Ticker Symbol</label>' +
              '<input type="text" id="f_ticker" placeholder="QQQ" maxlength="10" style="text-transform:uppercase">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Direction</label>' +
              '<select id="f_direction"><option value="Long">Long</option><option value="Short">Short</option></select>' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Setup Type</label>' +
              '<select id="f_setup">'+setupOpts+'</select>' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field">' +
              '<label>Entry Date & Time</label>' +
              '<input type="datetime-local" id="f_entry_time">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Exit Date & Time</label>' +
              '<input type="datetime-local" id="f_exit_time">' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field">' +
              '<label>Planned Entry $</label>' +
              '<input type="number" id="f_planned_entry" placeholder="0.00" step="0.01">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Actual Entry $</label>' +
              '<input type="number" id="f_actual_entry" placeholder="0.00" step="0.01">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Exit Price $</label>' +
              '<input type="number" id="f_exit_price" placeholder="0.00" step="0.01">' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field">' +
              '<label>Planned Stop $</label>' +
              '<input type="number" id="f_planned_stop" placeholder="0.00" step="0.01">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Actual Stop $</label>' +
              '<input type="number" id="f_actual_stop" placeholder="0.00" step="0.01">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Exit Reason</label>' +
              '<select id="f_exit_reason">'+exitOpts+'</select>' +
            '</div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field">' +
              '<label>Shares / Contracts</label>' +
              '<input type="number" id="f_qty" placeholder="100" step="1">' +
            '</div>' +
            '<div class="form-field">' +
              '<label>Planned Shares / Contracts</label>' +
              '<input type="number" id="f_planned_qty" placeholder="100" step="1">' +
            '</div>' +
          '</div>' +
          '<div class="form-field" style="grid-column:1/-1">' +
            '<label>Notes (optional)</label>' +
            '<textarea id="f_notes" placeholder="What were you thinking? What did you see?" rows="3" style="width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-size:14px;resize:vertical;font-family:inherit;"></textarea>' +
          '</div>' +
          '<div id="formError" style="color:#ef4444;font-size:13px;display:none;margin-top:8px;"></div>' +
          '<div style="display:flex;gap:12px;margin-top:20px;">' +
            '<button class="btn-primary-green" onclick="TST_JOURNAL.submitTrade()">Log Trade</button>' +
            '<button class="btn-outline-green" onclick="TST_JOURNAL.clearForm()">Clear</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // TRADE HISTORY
      '<div class="journal-history">' +
        '<div class="journal-history-title">Trade History</div>' +
        '<div id="tradeHistoryWrap"><div class="loading-state">Loading your trades...</div></div>' +
      '</div>' +
    '</div>';
  },

  submitTrade: async function() {
    var ticker = document.getElementById('f_ticker').value.trim().toUpperCase();
    var direction = document.getElementById('f_direction').value;
    var setup = document.getElementById('f_setup').value;
    var entryTime = document.getElementById('f_entry_time').value;
    var exitTime = document.getElementById('f_exit_time').value;
    var plannedEntry = parseFloat(document.getElementById('f_planned_entry').value);
    var actualEntry = parseFloat(document.getElementById('f_actual_entry').value);
    var exitPrice = parseFloat(document.getElementById('f_exit_price').value);
    var plannedStop = parseFloat(document.getElementById('f_planned_stop').value);
    var actualStop = parseFloat(document.getElementById('f_actual_stop').value);
    var exitReason = document.getElementById('f_exit_reason').value;
    var qty = parseInt(document.getElementById('f_qty').value);
    var plannedQty = parseInt(document.getElementById('f_planned_qty').value);
    var notes = document.getElementById('f_notes').value.trim();
    var errDiv = document.getElementById('formError');

    if (!ticker || !entryTime || !actualEntry || !exitPrice || !qty) {
      errDiv.textContent = 'Please fill in: Ticker, Entry Time, Actual Entry, Exit Price, and Shares.';
      errDiv.style.display = 'block';
      return;
    }
    errDiv.style.display = 'none';

    var user = await getUser();
    if (!user) { errDiv.textContent = 'Not logged in.'; errDiv.style.display = 'block'; return; }

    var mult = direction === 'Long' ? 1 : -1;
    var pnl = (exitPrice - actualEntry) * mult * qty;
    var holdMins = null;
    if (entryTime && exitTime) {
      holdMins = Math.round((new Date(exitTime) - new Date(entryTime)) / 60000);
    }
    var slippage = isNaN(plannedEntry) ? null : (actualEntry - plannedEntry) * mult;
    var dollarRisk = isNaN(plannedStop) ? null : Math.abs(actualEntry - plannedStop) * qty;

    var trade = {
      user_id: user.id,
      ticker: ticker,
      direction: direction,
      setup_type: setup,
      entry_time: entryTime,
      exit_time: exitTime || null,
      planned_entry: isNaN(plannedEntry) ? null : plannedEntry,
      actual_entry: actualEntry,
      exit_price: exitPrice,
      planned_stop: isNaN(plannedStop) ? null : plannedStop,
      actual_stop: isNaN(actualStop) ? null : actualStop,
      exit_reason: exitReason,
      qty: qty,
      planned_qty: isNaN(plannedQty) ? null : plannedQty,
      pnl: Math.round(pnl * 100) / 100,
      hold_minutes: holdMins,
      slippage: slippage ? Math.round(slippage * 10000) / 10000 : null,
      dollar_risk: dollarRisk ? Math.round(dollarRisk * 100) / 100 : null,
      notes: notes || null,
      created_at: new Date().toISOString()
    };

    try {
      var result = await window.supabase.from('trades').insert([trade]);
      if (result.error) throw result.error;
      TST_JOURNAL.clearForm();
      TST_JOURNAL.loadTrades();
      var btn = document.querySelector('.btn-primary-green');
      if (btn) { btn.textContent = 'Trade Logged!'; setTimeout(function(){ btn.textContent = 'Log Trade'; }, 2000); }
    } catch(e) {
      errDiv.textContent = 'Error saving trade: ' + (e.message || 'Unknown error');
      errDiv.style.display = 'block';
    }
  },

  clearForm: function() {
    ['f_ticker','f_entry_time','f_exit_time','f_planned_entry','f_actual_entry','f_exit_price','f_planned_stop','f_actual_stop','f_qty','f_planned_qty','f_notes'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
  },

  loadTrades: async function() {
    var wrap = document.getElementById('tradeHistoryWrap');
    if (!wrap) return;
    var user = await getUser();
    if (!user) { wrap.innerHTML = '<div class="loading-state">Please log in to view trades.</div>'; return; }
    try {
      var result = await window.supabase.from('trades').select('*').eq('user_id', user.id).order('entry_time', {ascending: false}).limit(50);
      if (result.error) throw result.error;
      var trades = result.data || [];
      if (!trades.length) {
        wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">📊</div><div class="empty-title">No trades logged yet</div><div class="empty-sub">Log your first trade above to start tracking your performance.</div></div>';
        return;
      }
      var rows = trades.map(function(t) {
        var pnlColor = t.pnl > 0 ? '#22c55e' : t.pnl < 0 ? '#ef4444' : '#6b7c6e';
        var pnlStr = (t.pnl >= 0 ? '+' : '') + '$' + t.pnl.toFixed(2);
        var dateStr = t.entry_time ? new Date(t.entry_time).toLocaleDateString('en-US', {month:'short', day:'numeric'}) : '—';
        var timeStr = t.entry_time ? new Date(t.entry_time).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}) : '';
        var winLoss = t.pnl > 0 ? 'WIN' : t.pnl < 0 ? 'LOSS' : 'BE';
        var winColor = t.pnl > 0 ? '#22c55e' : t.pnl < 0 ? '#ef4444' : '#6b7c6e';
        return '<tr class="trade-row">' +
          '<td><div class="trade-ticker">'+t.ticker+'</div><div class="trade-date">'+dateStr+' '+timeStr+'</div></td>' +
          '<td><span class="trade-direction '+t.direction.toLowerCase()+'">'+t.direction+'</span></td>' +
          '<td><span class="trade-setup">'+t.setup_type+'</span></td>' +
          '<td>$'+t.actual_entry+'</td>' +
          '<td>$'+t.exit_price+'</td>' +
          '<td style="color:'+pnlColor+';font-weight:700;">'+pnlStr+'</td>' +
          '<td>'+(t.hold_minutes !== null ? t.hold_minutes+'m' : '—')+'</td>' +
          '<td><span class="trade-result" style="color:'+winColor+'">'+winLoss+'</span></td>' +
        '</tr>';
      }).join('');
      wrap.innerHTML = '<div class="trade-table-wrap"><table class="trade-table">' +
        '<thead><tr><th>Ticker</th><th>Direction</th><th>Setup</th><th>Entry</th><th>Exit</th><th>P&L</th><th>Hold</th><th>Result</th></tr></thead>' +
        '<tbody>'+rows+'</tbody>' +
      '</table></div>';
    } catch(e) {
      wrap.innerHTML = '<div class="loading-state">Error loading trades: ' + (e.message || 'Unknown') + '</div>';
    }
  },

  // ============================================================
  // PERFORMANCE TAB
  // ============================================================
  renderPerformanceTab: function() {
    return '<div class="profile-section">' +
      '<div id="perfContent"><div class="loading-state">Loading performance data...</div></div>' +
    '</div>';
  },

  loadPerformance: async function() {
    var wrap = document.getElementById('perfContent');
    if (!wrap) return;
    var user = await getUser();
    if (!user) { wrap.innerHTML = '<div class="loading-state">Please log in.</div>'; return; }
    try {
      var result = await window.supabase.from('trades').select('*').eq('user_id', user.id);
      if (result.error) throw result.error;
      var trades = result.data || [];
      if (trades.length < 3) {
        wrap.innerHTML = '<div class="empty-state"><div class="empty-icon">📈</div><div class="empty-title">Not enough data yet</div><div class="empty-sub">Log at least 3 trades to see your performance breakdown.</div></div>';
        return;
      }

      var wins = trades.filter(function(t){ return t.pnl > 0; });
      var losses = trades.filter(function(t){ return t.pnl < 0; });
      var totalPnl = trades.reduce(function(s,t){ return s + t.pnl; }, 0);
      var winRate = Math.round(wins.length / trades.length * 100);
      var avgWin = wins.length ? wins.reduce(function(s,t){ return s+t.pnl; },0)/wins.length : 0;
      var avgLoss = losses.length ? losses.reduce(function(s,t){ return s+t.pnl; },0)/losses.length : 0;

      // By setup
      var bySetup = {};
      trades.forEach(function(t) {
        if (!bySetup[t.setup_type]) bySetup[t.setup_type] = {wins:0,losses:0,pnl:0,count:0};
        bySetup[t.setup_type].count++;
        bySetup[t.setup_type].pnl += t.pnl;
        if (t.pnl > 0) bySetup[t.setup_type].wins++;
        else if (t.pnl < 0) bySetup[t.setup_type].losses++;
      });

      // By hour
      var byHour = {};
      trades.forEach(function(t) {
        if (!t.entry_time) return;
        var h = new Date(t.entry_time).getHours();
        if (!byHour[h]) byHour[h] = {wins:0,losses:0,pnl:0,count:0};
        byHour[h].count++;
        byHour[h].pnl += t.pnl;
        if (t.pnl > 0) byHour[h].wins++;
        else if (t.pnl < 0) byHour[h].losses++;
      });

      // Setup rows
      var setupRows = Object.keys(bySetup).sort(function(a,b){ return bySetup[b].count - bySetup[a].count; }).map(function(s) {
        var d = bySetup[s];
        var wr = Math.round(d.wins/d.count*100);
        var pnlStr = (d.pnl>=0?'+':'')+'$'+Math.round(d.pnl);
        var pnlColor = d.pnl > 0 ? '#22c55e' : '#ef4444';
        var wrColor = wr >= 60 ? '#22c55e' : wr >= 45 ? '#f59e0b' : '#ef4444';
        return '<tr><td>'+s+'</td><td>'+d.count+'</td>' +
          '<td style="color:'+wrColor+';font-weight:700;">'+wr+'%</td>' +
          '<td style="color:'+pnlColor+';font-weight:700;">'+pnlStr+'</td></tr>';
      }).join('');

      // Hour rows
      var hourLabels = {9:'9 AM',10:'10 AM',11:'11 AM',12:'12 PM',13:'1 PM',14:'2 PM',15:'3 PM',16:'4 PM'};
      var hourRows = Object.keys(byHour).sort(function(a,b){ return a-b; }).map(function(h) {
        var d = byHour[h];
        var wr = Math.round(d.wins/d.count*100);
        var pnlStr = (d.pnl>=0?'+':'')+'$'+Math.round(d.pnl);
        var pnlColor = d.pnl > 0 ? '#22c55e' : '#ef4444';
        var wrColor = wr >= 60 ? '#22c55e' : wr >= 45 ? '#f59e0b' : '#ef4444';
        return '<tr><td>'+(hourLabels[h]||h+':00')+'</td><td>'+d.count+'</td>' +
          '<td style="color:'+wrColor+';font-weight:700;">'+wr+'%</td>' +
          '<td style="color:'+pnlColor+';font-weight:700;">'+pnlStr+'</td></tr>';
      }).join('');

      var pnlColor = totalPnl >= 0 ? '#22c55e' : '#ef4444';
      var pnlStr = (totalPnl>=0?'+':'')+'$'+Math.abs(totalPnl).toFixed(2);

      wrap.innerHTML =
        '<div class="perf-stats-grid">' +
          '<div class="perf-stat"><div class="perf-stat-label">Total Trades</div><div class="perf-stat-num">'+trades.length+'</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Win Rate</div><div class="perf-stat-num" style="color:'+(winRate>=55?'#22c55e':winRate>=45?'#f59e0b':'#ef4444')+'">'+winRate+'%</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Total P&L</div><div class="perf-stat-num" style="color:'+pnlColor+'">'+pnlStr+'</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Avg Winner</div><div class="perf-stat-num" style="color:#22c55e">+$'+avgWin.toFixed(0)+'</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Avg Loser</div><div class="perf-stat-num" style="color:#ef4444">$'+avgLoss.toFixed(0)+'</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Win/Loss Ratio</div><div class="perf-stat-num">'+(losses.length ? (Math.abs(avgWin/avgLoss)).toFixed(2) : '—')+'</div></div>' +
        '</div>' +
        '<div class="perf-tables-grid">' +
          '<div class="perf-table-wrap">' +
            '<div class="perf-table-title">Performance by Setup</div>' +
            '<table class="trade-table">' +
              '<thead><tr><th>Setup</th><th>Trades</th><th>Win Rate</th><th>P&L</th></tr></thead>' +
              '<tbody>'+setupRows+'</tbody>' +
            '</table>' +
          '</div>' +
          '<div class="perf-table-wrap">' +
            '<div class="perf-table-title">Performance by Time of Day</div>' +
            '<table class="trade-table">' +
              '<thead><tr><th>Hour</th><th>Trades</th><th>Win Rate</th><th>P&L</th></tr></thead>' +
              '<tbody>'+hourRows+'</tbody>' +
            '</table>' +
          '</div>' +
        '</div>';

    } catch(e) {
      wrap.innerHTML = '<div class="loading-state">Error: ' + (e.message || 'Unknown') + '</div>';
    }
  },

  // ============================================================
  // BEHAVIORAL PROFILE TAB
  // ============================================================
  renderBehavioralTab: function() {
    return '<div class="profile-section">' +
      '<div class="behavioral-locked">' +
        '<div class="locked-icon">🔬</div>' +
        '<div class="locked-title">Behavioral Profile</div>' +
        '<div class="locked-body">Your behavioral engine is actively collecting data as you log trades. Pattern detection activates after your first 20 trades.<br><br>Behavioral profile analysis — including pattern detection, archetype assignment, and intervention recommendations — is available to Mentorship and 10K members.<br><br><strong>Continue logging your trades</strong> — the data is being saved and will power your full behavioral profile the moment you unlock this tier.</div>' +
        '<div id="behavioralPreview" style="margin-top:24px;"></div>' +
      '</div>' +
    '</div>';
  }
};

// ============================================================
// ADMIN PANEL
// ============================================================

var TST_ADMIN = {

  ADMIN_EMAIL: 'topstocktrading@gmail.com',

  isAdmin: async function() {
    var email = await getUserEmail();
    return email === this.ADMIN_EMAIL;
  },

  render: async function() {
    var isAdmin = await this.isAdmin();
    if (!isAdmin) return '<div class="profile-section"><div class="loading-state">Access denied.</div></div>';

    return '<div class="profile-page">' +
      '<div class="profile-header">' +
        '<div class="profile-header-label" style="color:#f59e0b">Admin Panel</div>' +
        '<h2 class="profile-header-title">Student Dashboard</h2>' +
      '</div>' +
      '<div id="adminContent"><div class="loading-state">Loading students...</div></div>' +
    '</div>';
  },

  load: async function() {
    var wrap = document.getElementById('adminContent');
    if (!wrap) return;
    try {
      var result = await window.supabase.from('trades').select('user_id, ticker, setup_type, pnl, entry_time, created_at').order('created_at', {ascending: false}).limit(500);
      if (result.error) throw result.error;
      var trades = result.data || [];

      // Group by user
      var byUser = {};
      trades.forEach(function(t) {
        if (!byUser[t.user_id]) byUser[t.user_id] = {trades:[], totalPnl:0, wins:0};
        byUser[t.user_id].trades.push(t);
        byUser[t.user_id].totalPnl += t.pnl || 0;
        if ((t.pnl||0) > 0) byUser[t.user_id].wins++;
      });

      var quizResult = await window.supabase.from('quiz_results').select('*').order('updated_at', {ascending:false}).limit(200);
      var quizzes = quizResult.data || [];
      var quizByUser = {};
      quizzes.forEach(function(q){ if(!quizByUser[q.user_id]) quizByUser[q.user_id] = []; quizByUser[q.user_id].push(q); });

      var rows = Object.keys(byUser).map(function(uid) {
        var d = byUser[uid];
        var tc = d.trades.length;
        var wr = tc ? Math.round(d.wins/tc*100) : 0;
        var pnl = d.totalPnl;
        var pnlStr = (pnl>=0?'+':'')+'$'+Math.abs(pnl).toFixed(0);
        var pnlColor = pnl >= 0 ? '#22c55e' : '#ef4444';
        var wrColor = wr >= 55 ? '#22c55e' : wr >= 45 ? '#f59e0b' : '#ef4444';
        var shortId = uid.substring(0,8)+'...';
        var qCount = quizByUser[uid] ? quizByUser[uid].filter(function(q){return q.passed;}).length : 0;
        var lastTrade = d.trades[0] ? new Date(d.trades[0].created_at).toLocaleDateString() : '—';
        return '<tr>' +
          '<td><span class="admin-uid">'+shortId+'</span></td>' +
          '<td>'+tc+'</td>' +
          '<td style="color:'+wrColor+';font-weight:700;">'+wr+'%</td>' +
          '<td style="color:'+pnlColor+';font-weight:700;">'+pnlStr+'</td>' +
          '<td>'+qCount+' passed</td>' +
          '<td>'+lastTrade+'</td>' +
        '</tr>';
      }).join('');

      var totalStudents = Object.keys(byUser).length;
      var totalTrades = trades.length;
      var totalPnlAll = trades.reduce(function(s,t){ return s+(t.pnl||0); }, 0);

      wrap.innerHTML =
        '<div class="admin-stats-row">' +
          '<div class="admin-stat"><div class="admin-stat-label">Active Students</div><div class="admin-stat-num">'+totalStudents+'</div></div>' +
          '<div class="admin-stat"><div class="admin-stat-label">Total Trades Logged</div><div class="admin-stat-num">'+totalTrades+'</div></div>' +
          '<div class="admin-stat"><div class="admin-stat-label">Aggregate P&L</div><div class="admin-stat-num" style="color:'+(totalPnlAll>=0?'#22c55e':'#ef4444')+'">'+(totalPnlAll>=0?'+':'')+'$'+Math.abs(totalPnlAll).toFixed(0)+'</div></div>' +
        '</div>' +
        '<div class="perf-table-wrap" style="margin-top:24px;">' +
          '<div class="perf-table-title">All Students</div>' +
          '<table class="trade-table">' +
            '<thead><tr><th>Student ID</th><th>Trades</th><th>Win Rate</th><th>P&L</th><th>Quizzes</th><th>Last Active</th></tr></thead>' +
            '<tbody>'+rows+'</tbody>' +
          '</table>' +
        '</div>';
    } catch(e) {
      wrap.innerHTML = '<div class="loading-state">Error: ' + (e.message||'Unknown') + '</div>';
    }
  }
};

// ============================================================
// HOOK INTO MEMBERS.HTML
// Override showProfileDashboard to use our new system
// ============================================================

window.addEventListener('load', function() {
  // Override the existing showProfileDashboard function
  var origShowProfile = window.showProfileDashboard;
  window.showProfileDashboard = function() {
    var mc = document.getElementById('mc');
    if (!mc) { if (origShowProfile) origShowProfile(); return; }
    mc.innerHTML = TST_JOURNAL.renderProfilePage();
    // Load overview stats
    setTimeout(async function() {
      var user = await getUser();
      if (!user) return;
      try {
        var result = await window.supabase.from('trades').select('pnl, setup_type').eq('user_id', user.id);
        if (result.error) return;
        var trades = result.data || [];
        if (!trades.length) return;
        var wins = trades.filter(function(t){ return t.pnl > 0; });
        var wr = Math.round(wins.length/trades.length*100);
        var totalPnl = trades.reduce(function(s,t){ return s+t.pnl; }, 0);
        var bySetup = {};
        trades.forEach(function(t){
          if(!bySetup[t.setup_type]) bySetup[t.setup_type]={wins:0,count:0};
          bySetup[t.setup_type].count++;
          if(t.pnl>0) bySetup[t.setup_type].wins++;
        });
        var bestSetup = Object.keys(bySetup).sort(function(a,b){
          return (bySetup[b].wins/bySetup[b].count)-(bySetup[a].wins/bySetup[a].count);
        })[0];
        var pnlColor = totalPnl >= 0 ? '#22c55e' : '#ef4444';
        var wrColor = wr >= 55 ? '#22c55e' : wr >= 45 ? '#f59e0b' : '#ef4444';
        var el;
        el = document.getElementById('ovTotalTrades'); if(el) el.textContent = trades.length;
        el = document.getElementById('ovWinRate'); if(el){ el.textContent = wr+'%'; el.style.color = wrColor; }
        el = document.getElementById('ovPnl'); if(el){ el.textContent = (totalPnl>=0?'+':'')+'$'+Math.abs(totalPnl).toFixed(0); el.style.color = pnlColor; }
        el = document.getElementById('ovBestSetup'); if(el && bestSetup) el.textContent = bestSetup.replace('TST ','');
      } catch(e) {}
    }, 100);
    if (window.scrollTo) window.scrollTo(0,0);
  };
});
