
// TST Academy — Profile System
// Trade Journal, Performance Dashboard, Admin Panel
// Loaded separately from members.html

// ============================================================
// SUPABASE HELPERS
// ============================================================

function getSupabase() {
  // Use auth.js client if available, fall back to window.supabase
  if (window.getSupabaseClient) return window.getSupabaseClient();
  if (window._supabaseClient) return window._supabaseClient;
  if (window.supabase && window.supabase.auth) return window.supabase;
  return null;
}

async function getUser() {
  // Check cached user first (set by auth.js on successful login)
  if (window._currentUser) return window._currentUser;
  // Try Supabase client
  var client = getSupabase();
  if (!client) return null;
  try {
    var r = await client.auth.getUser();
    if (r.data && r.data.user) {
      window._currentUser = r.data.user;
      return r.data.user;
    }
    // Try session as fallback
    var s = await client.auth.getSession();
    if (s.data && s.data.session && s.data.session.user) {
      window._currentUser = s.data.session.user;
      return s.data.session.user;
    }
    return null;
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
    // First run the original behavioral dashboard
    if (window.showProfileDashboard_original) {
      window.showProfileDashboard_original();
    }
    // Then append trade journal tabs below
    var mc = document.getElementById('mc');
    if (!mc) return;
    var journalDiv = document.createElement('div');
    journalDiv.className = 'profile-page';
    journalDiv.style.cssText = 'margin-top:32px;border-top:1px solid var(--border);padding-top:32px;';
    journalDiv.innerHTML =
      '<div class="profile-header">' +
        '<div class="profile-header-label">TST Academy</div>' +
        '<h2 class="profile-header-title">Trade Journal</h2>' +
      '</div>' +
      '<div class="profile-tabs">' +
        '<button class="profile-tab active" onclick="TST_JOURNAL.switchTab(\'journal\', this)">Journal</button>' +
        '<button class="profile-tab" onclick="TST_JOURNAL.switchTab(\'performance\', this)">Performance</button>' +
      '</div>' +
      '<div id="profileTabContent">' +
        TST_JOURNAL.renderJournalTab() +
      '</div>';
    mc.appendChild(journalDiv);
    setTimeout(function(){ TST_JOURNAL.loadTrades(); }, 300);
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
    // Wire up drag/drop after render
    setTimeout(function(){ if(window.TST_CSV) TST_CSV.setupDragDrop(); }, 100);
    var setupTypes = ['TST Flag Breakout','TST Dip Buy','TST Breakout','TST Reversal','TST Momentum','TST Liquidity Sweep','TST Gap Play','TST V-Shape Recovery','TST VWAP Reclaim','TST Opening Drive','Other'];
    var exitReasons = ['Stop Hit','Target Hit','Manual Exit - Profit','Manual Exit - Loss','Time Exit','Trailing Stop','Other'];
    var setupOpts = setupTypes.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('');
    var exitOpts = exitReasons.map(function(r){ return '<option value="'+r+'">'+r+'</option>'; }).join('');

    return '<div class="profile-section">' +
      // LOG NEW TRADE FORM
      TST_CSV.renderImportUI() +
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
    if (!user) {
      // Last resort - try getting session directly
      var client2 = getSupabase();
      if (client2) {
        try {
          var sess = await client2.auth.getSession();
          if (sess.data && sess.data.session) {
            window._currentUser = sess.data.session.user;
            user = sess.data.session.user;
          }
        } catch(e2) {}
      }
      if (!user) {
        errDiv.textContent = 'Session error - please refresh the page and log in again.';
        errDiv.style.display = 'block';
        return;
      }
    }

    var mult = direction === 'Long' ? 1 : -1;
    // Detect options contract (ticker contains digits like QQQ260616C00720000)
    var isOpt = /\d{6}[CP]\d+/.test(ticker);
    var cMult = isOpt ? 100 : 1;
    var pnl = (exitPrice - actualEntry) * mult * qty * cMult;
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
      var result = await getSupabase().from('trades').insert([trade]);
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
      var result = await getSupabase().from('trades').select('*').eq('user_id', user.id).order('entry_time', {ascending: false}).limit(50);
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
        '<td>'+(t.source==='csv'&&t.entry_time?'<button class="chart-view-btn" onclick="TST_CHART.openChart(this,\'' +t.ticker+ '\',\'' +t.entry_time+ '\',\'' +(t.exit_time||'')+ '\','+t.actual_entry+','+t.exit_price+','+(t.planned_stop||'null')+',\'' +t.direction+ '\','+t.pnl+',\'' +(t.id||'')+ '\',\'' +(t.setup_type||'Untagged')+ '\')">' +(t.setup_type&&t.setup_type!=='Untagged'?'📈':'📈 Tag')+ '</button>':'')+'</td>' +
        '</tr>';
      }).join('');
      wrap.innerHTML = '<div class="trade-table-wrap"><table class="trade-table">' +
        '<thead><tr><th>Ticker</th><th>Direction</th><th>Setup</th><th>Entry</th><th>Exit</th><th>P&L</th><th>Hold</th><th>Result</th><th></th></tr></thead>' +
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
      var result = await getSupabase().from('trades').select('*').eq('user_id', user.id);
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

  ADMIN_EMAIL: 'h@topstocktrading.com',

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
      var result = await getSupabase().from('trades').select('user_id, ticker, setup_type, pnl, entry_time, created_at').order('created_at', {ascending: false}).limit(500);
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

      var quizResult = await getSupabase().from('quiz_results').select('*').order('updated_at', {ascending:false}).limit(200);
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
  // Save original and override
  var origShowProfile = window.showProfileDashboard;
  window.showProfileDashboard_original = origShowProfile;
  window.showProfileDashboard = function() {
    var mc = document.getElementById('mc');
    if (!mc) { if (origShowProfile) origShowProfile(); return; }
    TST_JOURNAL.renderProfilePage();
    // Load overview stats
    setTimeout(async function() {
      var user = await getUser();
      if (!user) return;
      try {
        var result = await getSupabase().from('trades').select('pnl, setup_type').eq('user_id', user.id);
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


// ============================================================
// CSV IMPORT — Webull + major brokerages
// ============================================================

var TST_CSV = {

  // Detect brokerage from CSV headers
  detectBrokerage: function(headers) {
    var h = headers.join(',').toLowerCase();
    if (h.includes('filled time') && h.includes('avg price')) return 'webull';
    if (h.includes('exec time') && h.includes('spread')) return 'td';
    if (h.includes('activity date') && h.includes('trans code')) return 'robinhood';
    if (h.includes('date/time') && h.includes('quantity') && h.includes('t. price')) return 'ibkr';
    return 'unknown';
  },

  // Parse Webull options/stock CSV
  parseWebull: function(rows, headers) {
    var trades = [];
    var hi = {};
    headers.forEach(function(h, i) { hi[h.trim()] = i; });

    // Group by symbol to match buys and sells
    var bySymbol = {};
    rows.forEach(function(row) {
      if (!row || row.length < 5) return;
      var status = (row[hi['Status']] || '').trim();
      if (status !== 'Filled') return;
      var symbol = (row[hi['Symbol']] || '').trim();
      var side = (row[hi['Side']] || '').trim();
      var qty = parseInt(row[hi['Filled']] || row[hi['Qty']] || '0');
      var price = parseFloat((row[hi['Avg Price']] || row[hi['Price']] || '0').replace('@','').trim());
      var timeStr = (row[hi['Filled Time']] || row[hi['Time']] || '').trim();
      if (!symbol || !qty || !price || !timeStr) return;
      if (!bySymbol[symbol]) bySymbol[symbol] = {buys:[], sells:[]};
      var entry = {qty: qty, price: price, time: timeStr};
      if (side === 'Buy') bySymbol[symbol].buys.push(entry);
      else if (side === 'Sell') bySymbol[symbol].sells.push(entry);
    });

    // Match buys to sells
    Object.keys(bySymbol).forEach(function(symbol) {
      var d = bySymbol[symbol];
      if (!d.buys.length || !d.sells.length) return;

      d.buys.sort(function(a,b){ return new Date(a.time) - new Date(b.time); });
      d.sells.sort(function(a,b){ return new Date(a.time) - new Date(b.time); });

      var totalBuyQty = d.buys.reduce(function(s,b){ return s+b.qty; }, 0);
      var totalSellQty = d.sells.reduce(function(s,b){ return s+b.qty; }, 0);
      var avgBuy = d.buys.reduce(function(s,b){ return s+b.price*b.qty; },0) / totalBuyQty;
      var avgSell = d.sells.reduce(function(s,b){ return s+b.price*b.qty; },0) / totalSellQty;
      var matchedQty = Math.min(totalBuyQty, totalSellQty);
      // Detect if this is an options contract (long symbol with digits+C/P+digits)
      var isOption = /^[A-Z]+\d{6}[CP]\d+$/.test(symbol);
      var contractMult = isOption ? 100 : 1;
      var pnl = Math.round((avgSell - avgBuy) * matchedQty * contractMult * 100) / 100;

      // Parse times
      var entryTime = TST_CSV.parseWebullTime(d.buys[0].time);
      var exitTime = TST_CSV.parseWebullTime(d.sells[d.sells.length-1].time);
      var holdMins = entryTime && exitTime ? Math.round((exitTime - entryTime) / 60000) : null;

      trades.push({
        ticker: symbol,
        direction: 'Long',
        actual_entry: Math.round(avgBuy * 10000) / 10000,
        exit_price: Math.round(avgSell * 10000) / 10000,
        qty: matchedQty,
        pnl: pnl,
        entry_time: entryTime ? entryTime.toISOString() : null,
        exit_time: exitTime ? exitTime.toISOString() : null,
        hold_minutes: holdMins,
        source: 'csv',
        is_option: isOption,
        // Fields student fills in
        setup_type: 'Untagged',
        exit_reason: pnl > 0 ? 'Target Hit' : 'Stop Hit',
        notes: null,
        planned_entry: null,
        planned_stop: null,
        actual_stop: null,
        planned_qty: matchedQty
      });
    });

    return trades;
  },

  parseWebullTime: function(str) {
    if (!str) return null;
    try {
      // Format: "01/02/2026 09:35:58 EST" or "EDT"
      var clean = str.replace(' EST','').replace(' EDT','').replace(' CST','').replace(' PST','').trim();
      // MM/DD/YYYY HH:MM:SS
      var parts = clean.split(' ');
      if (parts.length >= 2) {
        var dateParts = parts[0].split('/');
        var timeParts = parts[1].split(':');
        if (dateParts.length === 3 && timeParts.length === 3) {
          return new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[0]) - 1,
            parseInt(dateParts[1]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1]),
            parseInt(timeParts[2])
          );
        }
      }
      return new Date(str);
    } catch(e) { return null; }
  },

  // Main CSV parser entry point
  parseCSV: function(text) {
    var lines = text.trim().split('\n');
    if (lines.length < 2) return {error: 'File appears empty.'};

    var headers = lines[0].split(',').map(function(h){ return h.replace(/"/g,'').trim(); });
    var brokerage = TST_CSV.detectBrokerage(headers);

    var rows = lines.slice(1).map(function(line) {
      // Handle quoted commas
      var result = [];
      var inQuote = false;
      var current = '';
      for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (ch === '"') { inQuote = !inQuote; continue; }
        if (ch === ',' && !inQuote) { result.push(current.trim()); current = ''; continue; }
        current += ch;
      }
      result.push(current.trim());
      return result;
    }).filter(function(r){ return r.some(function(c){ return c.length > 0; }); });

    var trades = [];
    if (brokerage === 'webull') {
      trades = TST_CSV.parseWebull(rows, headers);
    } else {
      return {error: 'Brokerage not recognized. Currently supporting Webull CSV exports. More brokerages coming soon.'};
    }

    if (!trades.length) return {error: 'No completed trades found in this file. Make sure you are exporting filled orders.'};
    return {trades: trades, brokerage: brokerage};
  },

  // Render the import UI
  renderImportUI: function() {
    return '<div class="csv-import-wrap" id="csvImportWrap">' +
      '<div class="csv-import-header">' +
        '<div class="csv-import-title">Import from Brokerage</div>' +
        '<div class="csv-import-sub">Export your order history from Webull and upload it here. Trades import automatically with entry/exit prices, P&L, and timestamps. You just add the setup type and notes.</div>' +
      '</div>' +
      '<div class="csv-drop-zone" id="csvDropZone" onclick="document.getElementById(\'csvFileInput\').click()">' +
        '<div class="csv-drop-icon">📂</div>' +
        '<div class="csv-drop-title">Click to upload CSV</div>' +
        '<div class="csv-drop-sub">Webull order export · Drag and drop or click to browse</div>' +
        '<input type="file" id="csvFileInput" accept=".csv" style="display:none" onchange="TST_CSV.handleFile(this.files[0])">' +
      '</div>' +
      '<div id="csvPreview" style="display:none"></div>' +
    '</div>';
  },

  handleFile: function(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var result = TST_CSV.parseCSV(e.target.result);
      if (result.error) {
        TST_CSV.showPreviewError(result.error);
      } else {
        TST_CSV.showPreview(result.trades, result.brokerage);
      }
    };
    reader.readAsText(file);

    // Drag visual feedback
    var dz = document.getElementById('csvDropZone');
    if (dz) dz.style.borderColor = 'var(--green)';
  },

  showPreviewError: function(msg) {
    var preview = document.getElementById('csvPreview');
    if (!preview) return;
    preview.style.display = 'block';
    preview.innerHTML = '<div class="csv-error">'+msg+'</div>';
  },

  showPreview: function(trades, brokerage) {
    var preview = document.getElementById('csvPreview');
    if (!preview) return;

    var setupTypes = ['TST Flag Breakout','TST Dip Buy','TST Breakout','TST Reversal','TST Momentum','TST Liquidity Sweep','TST Gap Play','TST V-Shape Recovery','TST VWAP Reclaim','TST Opening Drive','Other'];
    var setupOpts = setupTypes.map(function(s){ return '<option value="'+s+'">'+(s==='Other'?'— Select Setup —':s)+'</option>'; }).join('');

    var rows = trades.map(function(t, i) {
      var pnlColor = t.pnl > 0 ? '#22c55e' : '#ef4444';
      var pnlStr = (t.pnl >= 0 ? '+' : '') + '$' + Math.abs(t.pnl).toFixed(2);
      var dateStr = t.entry_time ? new Date(t.entry_time).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—';
      var timeStr = t.entry_time ? new Date(t.entry_time).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '';
      return '<tr>' +
        '<td><div class="trade-ticker">'+t.ticker+'</div><div class="trade-date">'+dateStr+' '+timeStr+'</div></td>' +
        '<td style="color:'+pnlColor+';font-weight:700;">'+pnlStr+'</td>' +
        '<td>$'+t.actual_entry.toFixed(2)+' → $'+t.exit_price.toFixed(2)+'</td>' +
        '<td>'+(t.hold_minutes !== null ? t.hold_minutes+'m' : '—')+'</td>' +
        '<td><span style="font-size:11px;color:var(--muted);">Tag via chart</span></td>' +
      '</tr>';
    }).join('');

    // Store trades in memory for later
    window._csvPendingTrades = trades;

    preview.style.display = 'block';
    preview.innerHTML =
      '<div class="csv-preview-header">' +
        '<div class="csv-preview-count">'+trades.length+' trades found from '+brokerage.charAt(0).toUpperCase()+brokerage.slice(1)+'</div>' +
        '<div class="csv-preview-sub">Add setup types below, then confirm to import all trades.</div>' +
      '</div>' +
      '<div class="trade-table-wrap" style="margin-bottom:16px;">' +
        '<table class="trade-table">' +
          '<thead><tr><th>Trade</th><th>P&L</th><th>Entry → Exit</th><th>Hold</th><th>Setup</th></tr></thead>' +
          '<tbody>'+rows+'</tbody>' +
        '</table>' +
      '</div>' +
      '<div style="display:flex;gap:12px;">' +
        '<button class="btn-primary-green" onclick="TST_CSV.confirmImport()">Import All '+trades.length+' Trades</button>' +
        '<button class="btn-outline-green" onclick="TST_CSV.cancelImport()">Cancel</button>' +
      '</div>' +
      '<div id="csvImportStatus" style="margin-top:12px;font-size:13px;display:none;"></div>';
  },

  confirmImport: async function() {
    var trades = window._csvPendingTrades;
    if (!trades || !trades.length) return;

    var user = await getUser();
    if (!user) {
      var client3 = getSupabase();
      if (client3) {
        try {
          var sess2 = await client3.auth.getSession();
          if (sess2.data && sess2.data.session) {
            window._currentUser = sess2.data.session.user;
            user = sess2.data.session.user;
          }
        } catch(e3) {}
      }
      if (!user) {
        var status2 = document.getElementById('csvImportStatus');
        if (status2) { status2.style.display='block'; status2.style.color='#ef4444'; status2.textContent='Session expired - please refresh and log in again.'; }
        return;
      }
    }

    var status = document.getElementById('csvImportStatus');
    if (status) { status.style.display = 'block'; status.style.color = 'var(--muted)'; status.textContent = 'Importing trades...'; }

    // Setup type will be tagged from chart modal after import
    // Default to 'Untagged' so student knows to tag it

    // Add user_id and created_at
    var toInsert = trades.map(function(t) {
      return Object.assign({}, t, {
        user_id: user.id,
        created_at: new Date().toISOString()
      });
    });

    try {
      var result = await getSupabase().from('trades').insert(toInsert);
      if (result.error) throw result.error;
      if (status) { status.style.color = '#22c55e'; status.textContent = trades.length + ' trades imported successfully!'; }
      window._csvPendingTrades = null;
      setTimeout(function() {
        var preview = document.getElementById('csvPreview');
        if (preview) preview.style.display = 'none';
        TST_JOURNAL.loadTrades();
      }, 1500);
    } catch(e) {
      if (status) { status.style.color = '#ef4444'; status.textContent = 'Error: ' + (e.message || 'Unknown error'); }
    }
  },

  cancelImport: function() {
    window._csvPendingTrades = null;
    var preview = document.getElementById('csvPreview');
    if (preview) { preview.style.display = 'none'; preview.innerHTML = ''; }
    var dz = document.getElementById('csvDropZone');
    if (dz) dz.style.borderColor = '';
  },

  setupDragDrop: function() {
    var dz = document.getElementById('csvDropZone');
    if (!dz) return;
    dz.addEventListener('dragover', function(e){ e.preventDefault(); dz.style.borderColor = 'var(--green)'; dz.style.background = 'rgba(34,197,94,0.05)'; });
    dz.addEventListener('dragleave', function(){ dz.style.borderColor = ''; dz.style.background = ''; });
    dz.addEventListener('drop', function(e){
      e.preventDefault();
      dz.style.borderColor = '';
      dz.style.background = '';
      var file = e.dataTransfer.files[0];
      if (file && file.name.endsWith('.csv')) TST_CSV.handleFile(file);
    });
  }
};

// ============================================================
// CHART VIEWER — Shows candlestick chart with entry/exit arrows
// Uses TradingView Lightweight Charts (free, open source)
// ============================================================

var TST_CHART = {

  // Only show chart button for CSV-imported trades
  renderChartBtn: function(trade) {
    if (trade.source !== 'csv' || !trade.entry_time) return '';
    return '<button class="chart-view-btn" onclick="TST_CHART.openChart(\''+trade.id+'\', \''+trade.ticker+'\', \''+trade.entry_time+'\', \''+trade.exit_time+'\', '+trade.actual_entry+', '+trade.exit_price+', '+(trade.planned_stop||'null')+', \''+trade.direction+'\', '+trade.pnl+')" title="View Chart">📈</button>';
  },

  openChart: function(btn, ticker, entryTime, exitTime, entryPrice, exitPrice, stopPrice, direction, pnl, tradeId, currentSetup) {
    var id = ticker + '_' + entryTime;
    var tradeId = tradeId || id;
    // Create modal
    var modal = document.createElement('div');
    modal.id = 'chartModal';
    modal.className = 'chart-modal';
    modal.innerHTML =
      '<div class="chart-modal-inner">' +
        '<div class="chart-modal-header">' +
          '<div>' +
            '<div class="chart-modal-ticker">'+ticker+'</div>' +
            '<div class="chart-modal-meta">'+direction+' &nbsp;·&nbsp; Entry: $'+entryPrice+' &nbsp;·&nbsp; Exit: $'+exitPrice+' &nbsp;·&nbsp; <span style="color:'+(pnl>=0?'#22c55e':'#ef4444')+';font-weight:700;">'+(pnl>=0?'+':'')+'$'+Math.abs(pnl).toFixed(2)+'</span></div>' +
          '</div>' +
          '<button class="chart-modal-close" onclick="TST_CHART.closeChart()">✕</button>' +
        '</div>' +
        '<div id="chartContainer" class="chart-container">' +
          '<div class="chart-loading">Loading chart data...</div>' +
        '</div>' +
        '<div class="chart-legend">' +
          '<span class="legend-item"><span style="color:#22c55e">▲</span> Entry $'+entryPrice+'</span>' +
          '<span class="legend-item"><span style="color:#ef4444">▼</span> Exit $'+exitPrice+'</span>' +
          (stopPrice ? '<span class="legend-item"><span style="color:#f59e0b">─ ─</span> Stop $'+stopPrice+'</span>' : '') +
        '</div>' +
        '<div class="chart-tag-row" id="chartTagRow_'+tradeId+'">' +
          '<div class="chart-tag-label">Tag Setup:</div>' +
          '<select class="chart-setup-select" id="chartSetup_'+tradeId+'" onchange="TST_CHART.saveSetup(\''+tradeId+'\', this.value)">' +
          '<option value=\"Untagged\">Untagged</option><option value=\"TST Flag Breakout\">TST Flag Breakout</option><option value=\"TST Dip Buy\">TST Dip Buy</option><option value=\"TST Breakout\">TST Breakout</option><option value=\"TST Reversal\">TST Reversal</option><option value=\"TST Momentum\">TST Momentum</option><option value=\"TST Liquidity Sweep\">TST Liquidity Sweep</option><option value=\"TST Gap Play\">TST Gap Play</option><option value=\"TST V-Shape Recovery\">TST V-Shape Recovery</option><option value=\"TST VWAP Reclaim\">TST VWAP Reclaim</option><option value=\"TST Opening Drive\">TST Opening Drive</option><option value=\"Other\">Other</option>' +
          '</select>' +
          '<span class="chart-tag-saved" id="chartTagSaved_'+tradeId+'" style="display:none;color:var(--green);font-size:12px;">✓ Saved</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Load Lightweight Charts then fetch data
    TST_CHART.fetchAndRender(ticker, entryTime, exitTime, entryPrice, exitPrice, stopPrice, direction);

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) TST_CHART.closeChart();
    });
  },

  closeChart: function() {
    var modal = document.getElementById('chartModal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
  },

  loadLightweightCharts: function(callback) {
    if (window.LightweightCharts) { callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
    script.onload = callback;
    document.head.appendChild(script);
  },

  saveSetup: async function(tradeId, setupType) {
    try {
      var client = getSupabase();
      if (!client) return;
      await client.from('trades').update({setup_type: setupType}).eq('id', tradeId);
      var savedEl = document.getElementById('chartTagSaved_' + tradeId);
      if (savedEl) {
        savedEl.style.display = 'inline';
        setTimeout(function(){ savedEl.style.display = 'none'; }, 2000);
      }
      // Refresh trade list in background
      if (window.TST_JOURNAL) setTimeout(function(){ TST_JOURNAL.loadTrades(); }, 500);
    } catch(e) {
      console.log('Setup save error:', e);
    }
  },

  fetchAndRender: async function(ticker, entryTime, exitTime, entryPrice, exitPrice, stopPrice, direction) {
    var container = document.getElementById('chartContainer');
    if (!container) return;

    // Strip options suffix to get underlying: QQQ260616C00720000 -> QQQ
    var underlying = ticker.replace(/\d{6}[CP]\d+$/, '') || ticker;

    var entryDate = new Date(entryTime);
    var period1 = Math.floor(entryDate.getTime()/1000) - 7200;
    var period2 = Math.floor(entryDate.getTime()/1000) + 28800;

    container.innerHTML = '<div class="chart-loading">Loading chart data...</div>';
    container.style.height = '420px';

    try {
      // Direct Yahoo Finance fetch - works from browser without proxy
      var urls = [
        'https://query1.finance.yahoo.com/v8/finance/chart/' + underlying + '?interval=1m&period1=' + period1 + '&period2=' + period2 + '&includePrePost=false',
        'https://query2.finance.yahoo.com/v8/finance/chart/' + underlying + '?interval=1m&period1=' + period1 + '&period2=' + period2 + '&includePrePost=false'
      ];

      var parsed = null;
      for (var i = 0; i < urls.length; i++) {
        try {
          var resp = await fetch(urls[i], {
            headers: { 'Accept': 'application/json' },
            mode: 'cors'
          });
          if (resp.ok) {
            parsed = await resp.json();
            break;
          }
        } catch(e) { continue; }
      }

      if (!parsed || !parsed.chart || !parsed.chart.result || !parsed.chart.result[0]) {
        throw new Error('No data returned');
      }

      var chartData = parsed.chart.result[0];
      var timestamps = chartData.timestamp;
      var quote = chartData.indicators.quote[0];

      if (!timestamps || timestamps.length === 0) {
        throw new Error('No candles for this date');
      }

      // Filter to market hours only (9:30-16:00 ET)
      var candles = [];
      for (var j = 0; j < timestamps.length; j++) {
        var o = quote.open[j], h = quote.high[j], l = quote.low[j], c = quote.close[j];
        if (o === null || h === null || l === null || c === null) continue;
        var d = new Date(timestamps[j] * 1000);
        var hr = d.getUTCHours() - 5; // EST offset (approximate)
        if (hr < 9 || hr >= 16) continue;
        candles.push({ time: timestamps[j], open: o, high: h, low: l, close: c });
      }

      if (candles.length === 0) throw new Error('No market hours data');

      // Load Lightweight Charts then render
      if (!window.LightweightCharts) {
        await new Promise(function(resolve, reject) {
          var s = document.createElement('script');
          s.src = 'https://unpkg.com/lightweight-charts@4.1.3/dist/lightweight-charts.standalone.production.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      container.innerHTML = '';
      container.style.height = '380px';

      var chart = LightweightCharts.createChart(container, {
        width: container.clientWidth,
        height: 380,
        layout: { background: { color: '#0a0f0d' }, textColor: '#6b7c6e' },
        grid: { vertLines: { color: '#1e2820' }, horzLines: { color: '#1e2820' } },
        crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
        rightPriceScale: { borderColor: '#1e2820' },
        timeScale: { borderColor: '#1e2820', timeVisible: true, secondsVisible: false }
      });

      var series = chart.addCandlestickSeries({
        upColor: '#22c55e', downColor: '#ef4444',
        borderUpColor: '#22c55e', borderDownColor: '#ef4444',
        wickUpColor: '#22c55e', wickDownColor: '#ef4444'
      });

      series.setData(candles);

      // Add entry/exit markers
      var markers = [];
      var entryTs = Math.floor(new Date(entryTime).getTime() / 1000);

      // Find closest candle to entry time
      var closestEntry = candles.reduce(function(prev, curr) {
        return Math.abs(curr.time - entryTs) < Math.abs(prev.time - entryTs) ? curr : prev;
      });

      markers.push({
        time: closestEntry.time,
        position: direction === 'Long' ? 'belowBar' : 'aboveBar',
        color: '#22c55e',
        shape: direction === 'Long' ? 'arrowUp' : 'arrowDown',
        text: 'ENTRY $' + entryPrice,
        size: 2
      });

      if (exitTime) {
        var exitTs = Math.floor(new Date(exitTime).getTime() / 1000);
        var closestExit = candles.reduce(function(prev, curr) {
          return Math.abs(curr.time - exitTs) < Math.abs(prev.time - exitTs) ? curr : prev;
        });
        markers.push({
          time: closestExit.time,
          position: direction === 'Long' ? 'aboveBar' : 'belowBar',
          color: '#ef4444',
          shape: direction === 'Long' ? 'arrowDown' : 'arrowUp',
          text: 'EXIT $' + exitPrice,
          size: 2
        });
      }

      series.setMarkers(markers);

      // Stop line
      if (stopPrice && candles.length) {
        var stopSeries = chart.addLineSeries({
          color: '#f59e0b', lineWidth: 1,
          lineStyle: 2,
          priceLineVisible: false, lastValueVisible: false
        });
        stopSeries.setData([
          { time: candles[0].time, value: stopPrice },
          { time: candles[candles.length-1].time, value: stopPrice }
        ]);
      }

      chart.timeScale().fitContent();

    } catch(e) {
      container.innerHTML =
        '<div class="chart-no-data">' +
          '<div style="font-size:24px;margin-bottom:12px;">📊</div>' +
          '<div style="font-weight:600;margin-bottom:8px;">Chart data unavailable</div>' +
          '<div style="font-size:13px;line-height:1.7;margin-bottom:16px;">Could not load 1-minute data for ' + underlying + '.<br>This can happen for older dates or when the data provider is unavailable.</div>' +
          '<a href="https://finance.yahoo.com/chart/' + underlying + '" target="_blank" style="color:var(--green);font-size:13px;">View on Yahoo Finance →</a>' +
        '</div>';
    }
  }
};

