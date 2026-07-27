// TST Academy Profile System v3

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


// ============================================================
// TST ACADEMY — MAIN PROFILE DASHBOARD SYSTEM
// Tabs: Dashboard, Journal, Trading Data, Notes, Message Center
// ============================================================

var TST_PROFILE = {

  // Tier detection — extend this when Stripe is live
  getUser: async function() {
    try {
      var client = getSupabase();
      if (!client) return null;
      var r = await client.auth.getUser();
      return r.data && r.data.user ? r.data.user : null;
    } catch(e) { return null; }
  },

  getTier: async function() {
    var user = await getUser();
    if (!user) return 'none';
    // Admin gets all access
    if (user.email === 'h@topstocktrading.com') return '10k';
    // Check Supabase for tier — defaults to 'base' until Stripe sets it
    try {
      var client = getSupabase();
      var result = await client.from('user_tiers').select('tier').eq('user_id', user.id).single();
      if (result.data && result.data.tier) return result.data.tier;
    } catch(e) {}
    return 'base';
  },

  // Main render — called by showProfileDashboard override
  render: async function() {
    var mc = document.getElementById('mc');
    if (!mc) return;

    var tier = await this.getTier();

    var tenKTabHtml = tier === '10k'
      ? '<button class="tst-tab" style="color:#d4af37;" onclick="TST_PROFILE.switchTab(\'tenk\', this)">⭐ 10K Members</button>'
      : '';



    mc.innerHTML =
      '<div style="max-width:880px;">' +
        '<div style="display:flex;gap:0;border-bottom:1px solid #1e2820;margin-bottom:28px;flex-wrap:wrap;" id="tstProfileTabs">' +
          '<button class="tst-tab active" onclick="TST_PROFILE.switchTab(\'dashboard\', this)">Dashboard</button>' +
          '<button class="tst-tab" onclick="TST_PROFILE.switchTab(\'journal\', this)">Journal</button>' +
          '<button class="tst-tab" onclick="TST_PROFILE.switchTab(\'trading\', this)">Trading Data</button>' +
          '<button class="tst-tab" onclick="TST_PROFILE.switchTab(\'notes\', this)">My Notes</button>' +
          tenKTabHtml +
        '</div>' +
        '<div id="tstTabBody">' +
          '<div style="text-align:center;padding:48px;color:#6b7c6e;">Loading dashboard...</div>' +
        '</div>' +
      '</div>';

    this.loadTab('dashboard', tier);
  },

  switchTab: function(tab, btn) {
    document.querySelectorAll('.tst-tab').forEach(function(b){ b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    TST_PROFILE.getTier().then(function(tier){ TST_PROFILE.loadTab(tab, tier); });
  },

  loadTab: async function(tab, tier) {
    var body = document.getElementById('tstTabBody');
    if (!body) return;
    if (tab === 'dashboard') await this.renderDashboard(body, tier);
    if (tab === 'journal')   await this.renderJournal(body, tier);
    if (tab === 'trading')   await this.renderTrading(body, tier);
    if (tab === 'notes')     await this.renderNotes(body, tier);
    if (tab === 'messages')  await this.renderMessages(body, tier);
    if (tab === 'tenk')      await this.renderTenK(body, tier);
  },

  // ============================================================
  // TAB 1 — DASHBOARD
  // ============================================================
  renderDashboard: async function(body, tier) {
    body.innerHTML = '<div style="text-align:center;padding:48px;color:#6b7c6e;font-size:14px;">Loading dashboard...</div>';
    var user = await getUser();
    if (!user) { body.innerHTML = '<div style="text-align:center;padding:48px;color:#6b7c6e;">Please log in.</div>'; return; }

    try {
      var client = getSupabase();
      var tradesRes = await client.from('trades').select('*').eq('user_id', user.id);
      var trades = tradesRes.data || [];
      var quizRes = await client.from('quiz_results').select('*').eq('user_id', user.id);
      var quizzes = quizRes.data || [];

      // Course progress
      var completedLessons = Object.keys((window.BEHAVIOR||{}).lessonTimes||{}).length;
      var totalLessons = 0;
      if (window.COURSE) window.COURSE.forEach(function(s){ if(s.modules) s.modules.forEach(function(m){ if(m.subs) totalLessons+=m.subs.length; else totalLessons++; }); });
      var progress = totalLessons > 0 ? Math.round(completedLessons/totalLessons*100) : 0;

      // Quiz stats
      var passedQuizzes = quizzes.filter(function(q){ return q.passed; });
      var failedQuizzes = quizzes.filter(function(q){ return !q.passed; });

      // Trade stats
      var wins = trades.filter(function(t){ return (t.pnl||0)>0; });
      var losses = trades.filter(function(t){ return (t.pnl||0)<0; });
      var totalPnl = trades.reduce(function(s,t){ return s+(t.pnl||0); },0);
      var winRate = trades.length ? Math.round(wins.length/trades.length*100) : null;
      var avgWin = wins.length ? wins.reduce(function(s,t){ return s+(t.pnl||0); },0)/wins.length : 0;
      var avgLoss = losses.length ? Math.abs(losses.reduce(function(s,t){ return s+(t.pnl||0); },0)/losses.length) : 0;

      // Best setup
      var bySetup = {};
      trades.forEach(function(t){
        var s=t.setup_type;
        if(!s||s==='Untagged'||s==='Other') return;
        if(!bySetup[s]) bySetup[s]={wins:0,total:0};
        bySetup[s].total++;
        if((t.pnl||0)>0) bySetup[s].wins++;
      });
      var bestSetup=null, bestWR=0;
      Object.keys(bySetup).forEach(function(s){ var wr=bySetup[s].wins/bySetup[s].total; if(bySetup[s].total>=2&&wr>bestWR){bestWR=wr;bestSetup=s;} });

      // Worst hour
      var byHour={};
      trades.forEach(function(t){
        if(!t.entry_time) return;
        var h=new Date(t.entry_time).getHours();
        if(!byHour[h]) byHour[h]={wins:0,total:0,pnl:0};
        byHour[h].total++;byHour[h].pnl+=(t.pnl||0);
        if((t.pnl||0)>0) byHour[h].wins++;
      });
      var worstHour=null,worstPnl=0;
      Object.keys(byHour).forEach(function(h){ if(byHour[h].total>=2&&byHour[h].pnl<worstPnl){worstPnl=byHour[h].pnl;worstHour=h;} });

      // Briefing
      var briefing=[];
      if(!trades.length) {
        briefing.push('No trades logged yet. Upload your Webull CSV in the Journal tab to start tracking your performance.');
      } else {
        if(winRate>=55) briefing.push('Win rate of '+winRate+'% is above average — you are identifying valid setups.');
        else if(winRate>=45) briefing.push('Win rate of '+winRate+'% is near breakeven — focus on setup quality before increasing size.');
        else briefing.push('Win rate of '+winRate+'% needs improvement — review your entry criteria in the course.');
        if(totalPnl>0) briefing.push('Net profitable at +$'+totalPnl.toFixed(0)+' across '+trades.length+' logged trades. Keep the process tight.');
        else briefing.push('Net down $'+Math.abs(totalPnl).toFixed(0)+' across '+trades.length+' trades. Focus on cutting losers faster and protecting winners.');
        if(bestSetup) briefing.push('Strongest setup: '+bestSetup.replace('TST ','')+' with '+Math.round(bestWR*100)+'% win rate. Lean into this and take fewer trades in setups where you underperform.');
        if(worstHour!==null){ var hl=parseInt(worstHour)<12?worstHour+':00 AM':(parseInt(worstHour)-12||12)+':00 PM'; briefing.push(hl+' trades are dragging your P&L. Consider reducing size or sitting out that window entirely.'); }
        if(avgLoss>avgWin*1.3&&losses.length>=3) briefing.push('Average loss ($'+avgLoss.toFixed(0)+') exceeds average win ($'+avgWin.toFixed(0)+'). Tighten your stop placement — this single fix can make you consistently profitable at your current win rate.');
      }
      if(progress>0&&progress<100) briefing.push('Course is '+progress+'% complete. Prioritize finishing the remaining lessons.');

      // Colors
      var pnlC=totalPnl>=0?'#22c55e':'#ef4444';
      var wrC=winRate>=55?'#22c55e':winRate>=45?'#f59e0b':'#ef4444';
      var pnlStr=totalPnl>=0?'+$'+totalPnl.toFixed(0):'-$'+Math.abs(totalPnl).toFixed(0);

      // CARD STYLE
      var cs='background:#111712;border:1px solid #1e2820;border-radius:14px;padding:22px;';
      var labelS='font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:10px;font-family:Rajdhani,sans-serif;';
      var numS='font-family:Rajdhani,sans-serif;font-size:38px;font-weight:900;line-height:1;margin-bottom:4px;';
      var subS='font-size:12px;color:#6b7c6e;';

      body.innerHTML =
        // ROW 1 — Course progress full width
        '<div style="'+cs+'margin-bottom:16px;">' +
          '<div style="'+labelS+'">Course Progress</div>' +
          '<div style="display:flex;align-items:center;gap:16px;">' +
            '<div style="flex:1;height:8px;background:#1e2820;border-radius:4px;overflow:hidden;">' +
              '<div style="height:100%;width:'+progress+'%;background:#22c55e;border-radius:4px;transition:width .6s;"></div>' +
            '</div>' +
            '<div style="font-family:Rajdhani,sans-serif;font-weight:700;font-size:18px;color:#22c55e;">'+progress+'%</div>' +
          '</div>' +
          '<div style="margin-top:10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
            '<span style="font-size:12px;color:#6b7c6e;">'+completedLessons+' of '+totalLessons+' lessons visited</span>' +
            (passedQuizzes.length?'<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(34,197,94,.1);color:#22c55e;">'+passedQuizzes.length+' quizzes passed</span>':'') +
            (failedQuizzes.length?'<span style="font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(245,158,11,.1);color:#f59e0b;">'+failedQuizzes.length+' need review</span>':'') +
          '</div>' +
        '</div>' +

        // ROW 2 — 3 trading stat cards
        (trades.length > 0 ?
          '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px;">' +
            '<div style="'+cs+'">' +
              '<div style="'+labelS+'">Win Rate</div>' +
              '<div style="'+numS+'color:'+wrC+'">'+winRate+'%</div>' +
              '<div style="'+subS+'">'+trades.length+' trades logged</div>' +
            '</div>' +
            '<div style="'+cs+'">' +
              '<div style="'+labelS+'">Total P&L</div>' +
              '<div style="'+numS+'color:'+pnlC+'">'+pnlStr+'</div>' +
              '<div style="'+subS+'">all logged trades</div>' +
            '</div>' +
            '<div style="'+cs+'">' +
              '<div style="'+labelS+'">Best Setup</div>' +
              '<div style="font-family:Rajdhani,sans-serif;font-size:22px;font-weight:700;color:#f0f4f1;line-height:1.2;margin-bottom:4px;">'+(bestSetup?bestSetup.replace('TST ',''):'—')+'</div>' +
              '<div style="'+subS+'">'+(bestSetup?Math.round(bestWR*100)+'% win rate':'Tag trades to unlock')+'</div>' +
            '</div>' +
          '</div>'
        :
          '<div style="'+cs+'margin-bottom:16px;text-align:center;padding:32px;">' +
            '<div style="font-size:36px;margin-bottom:12px;">📊</div>' +
            '<div style="font-family:Rajdhani,sans-serif;font-size:18px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">No trades logged yet</div>' +
            '<div style="font-size:13px;color:#6b7c6e;margin-bottom:20px;">Import your Webull CSV in the Journal tab to start tracking performance.</div>' +
            '<button onclick=\'TST_PROFILE.switchTab("journal", document.querySelectorAll(".tst-tab")[1])\' style="background:#22c55e;color:#000;border:none;border-radius:8px;padding:10px 24px;font-family:Rajdhani,sans-serif;font-size:14px;font-weight:700;cursor:pointer;">Go to Journal →</button>' +
          '</div>'
        ) +

        // ROW 3 — Your Briefing
        '<div style="'+cs+'border-left:3px solid #22c55e;">' +
          '<div style="'+labelS+'color:#22c55e;">Your Briefing</div>' +
          '<div style="display:flex;flex-direction:column;gap:12px;margin-top:4px;">' +
            briefing.map(function(line){
              return '<div style="display:flex;align-items:flex-start;gap:12px;">' +
                '<div style="width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0;margin-top:7px;"></div>' +
                '<span style="font-size:14px;color:#f0f4f1;line-height:1.7;">'+line+'</span>' +
              '</div>';
            }).join('') +
          '</div>' +
        '</div>';

    } catch(e) {
      body.innerHTML = '<div style="text-align:center;padding:48px;color:#ef4444;">Error loading dashboard: '+(e.message||'Unknown')+'</div>';
    }
  },

  // ============================================================
  // TAB 2 — JOURNAL
  // ============================================================
  renderJournal: async function(body, tier) {
    var setupTypes = ['Untagged','TST Flag Breakout','TST Dip Buy','TST Breakout','TST Reversal','TST Momentum','TST Liquidity Sweep','TST Gap Play','TST V-Shape Recovery','TST VWAP Reclaim','TST Opening Drive','Other'];
    var exitReasons = ['Stop Hit','Target Hit','Manual Exit - Profit','Manual Exit - Loss','Time Exit','Trailing Stop','Other'];
    var setupOpts = setupTypes.map(function(s){ return '<option value="'+s+'">'+s+'</option>'; }).join('');
    var exitOpts = exitReasons.map(function(r){ return '<option value="'+r+'">'+r+'</option>'; }).join('');

    setTimeout(function(){ if(window.TST_CSV) TST_CSV.setupDragDrop(); TST_PROFILE.loadTrades(); }, 200);

    body.innerHTML =
      TST_CSV.renderImportUI() +
      '<div class="journal-form-wrap">' +
        '<div class="journal-form-title">Log a Trade Manually</div>' +
        '<div class="journal-form">' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Ticker Symbol</label><input type="text" id="f_ticker" placeholder="QQQ" maxlength="10" style="text-transform:uppercase"></div>' +
            '<div class="form-field"><label>Direction</label><select id="f_direction"><option value="Long">Long</option><option value="Short">Short</option></select></div>' +
            '<div class="form-field"><label>Setup Type</label><select id="f_setup">'+setupOpts+'</select></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Entry Date & Time</label><input type="datetime-local" id="f_entry_time"></div>' +
            '<div class="form-field"><label>Exit Date & Time</label><input type="datetime-local" id="f_exit_time"></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Actual Entry $</label><input type="number" id="f_actual_entry" placeholder="0.00" step="0.01"></div>' +
            '<div class="form-field"><label>Exit Price $</label><input type="number" id="f_exit_price" placeholder="0.00" step="0.01"></div>' +
            '<div class="form-field"><label>Exit Reason</label><select id="f_exit_reason">'+exitOpts+'</select></div>' +
          '</div>' +
          '<div class="form-row">' +
            '<div class="form-field"><label>Planned Entry $</label><input type="number" id="f_planned_entry" placeholder="0.00" step="0.01"></div>' +
            '<div class="form-field"><label>Planned Stop $</label><input type="number" id="f_planned_stop" placeholder="0.00" step="0.01"></div>' +
            '<div class="form-field"><label>Shares / Contracts</label><input type="number" id="f_qty" placeholder="1" step="1"></div>' +
          '</div>' +
          '<div class="form-field"><label>Notes</label><textarea id="f_notes" placeholder="What did you see? Why did you take it?" rows="3" style="width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-size:14px;resize:vertical;font-family:inherit;outline:none;"></textarea></div>' +
          '<div id="formError" style="color:#ef4444;font-size:13px;display:none;margin-top:8px;"></div>' +
          '<div style="display:flex;gap:12px;margin-top:16px;">' +
            '<button class="btn-primary-green" onclick="TST_PROFILE.submitTrade()">Log Trade</button>' +
            '<button class="btn-outline-green" onclick="TST_PROFILE.clearForm()">Clear</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="journal-history">' +
        '<div class="journal-history-title">Trade History</div>' +
        '<div id="tradeHistoryWrap"><div class="tst-loading">Loading trades...</div></div>' +
      '</div>';
  },

  submitTrade: async function() {
    var ticker = (document.getElementById('f_ticker')||{}).value || '';
    var direction = (document.getElementById('f_direction')||{}).value || 'Long';
    var setup = (document.getElementById('f_setup')||{}).value || 'Other';
    var entryTime = (document.getElementById('f_entry_time')||{}).value || '';
    var exitTime = (document.getElementById('f_exit_time')||{}).value || '';
    var actualEntry = parseFloat((document.getElementById('f_actual_entry')||{}).value || '0');
    var exitPrice = parseFloat((document.getElementById('f_exit_price')||{}).value || '0');
    var exitReason = (document.getElementById('f_exit_reason')||{}).value || 'Other';
    var plannedEntry = parseFloat((document.getElementById('f_planned_entry')||{}).value || '0');
    var plannedStop = parseFloat((document.getElementById('f_planned_stop')||{}).value || '0');
    var qty = parseInt((document.getElementById('f_qty')||{}).value || '1');
    var notes = (document.getElementById('f_notes')||{}).value || '';
    var errDiv = document.getElementById('formError');

    ticker = ticker.trim().toUpperCase();
    if (!ticker || !entryTime || !actualEntry || !exitPrice || !qty) {
      if (errDiv) { errDiv.textContent = 'Please fill in: Ticker, Entry Time, Actual Entry, Exit Price, and Shares.'; errDiv.style.display = 'block'; }
      return;
    }
    if (errDiv) errDiv.style.display = 'none';

    var user = await getUser();
    if (!user) {
      if (errDiv) { errDiv.textContent = 'Please log in first.'; errDiv.style.display = 'block'; }
      return;
    }

    var mult = direction === 'Long' ? 1 : -1;
    var isOpt = /\d{6}[CP]\d+/.test(ticker);
    var cMult = isOpt ? 100 : 1;
    var pnl = Math.round((exitPrice - actualEntry) * mult * qty * cMult * 100) / 100;
    var holdMins = entryTime && exitTime ? Math.round((new Date(exitTime) - new Date(entryTime)) / 60000) : null;
    var slippage = !isNaN(plannedEntry) && plannedEntry ? (actualEntry - plannedEntry) * mult : null;
    var dollarRisk = !isNaN(plannedStop) && plannedStop ? Math.abs(actualEntry - plannedStop) * qty : null;

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
      actual_stop: null,
      exit_reason: exitReason,
      qty: qty,
      planned_qty: qty,
      pnl: pnl,
      hold_minutes: holdMins,
      slippage: slippage,
      dollar_risk: dollarRisk,
      notes: notes.trim() || null,
      source: 'manual',
      is_option: isOpt,
      created_at: new Date().toISOString()
    };

    try {
      var client = getSupabase();
      var result = await client.from('trades').insert([trade]);
      if (result.error) throw result.error;
      TST_PROFILE.clearForm();
      TST_PROFILE.loadTrades();
      var btn = document.querySelector('.btn-primary-green');
      if (btn) { var orig = btn.textContent; btn.textContent = 'Trade Logged!'; setTimeout(function(){ btn.textContent = orig; }, 2000); }
    } catch(e) {
      if (errDiv) { errDiv.textContent = 'Error: ' + (e.message||'Unknown'); errDiv.style.display = 'block'; }
    }
  },

  clearForm: function() {
    ['f_ticker','f_entry_time','f_exit_time','f_actual_entry','f_exit_price','f_planned_entry','f_planned_stop','f_qty','f_notes'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.value = '';
    });
  },

  loadTrades: async function() {
    var wrap = document.getElementById('tradeHistoryWrap');
    if (!wrap) return;
    var user = await getUser();
    if (!user) { wrap.innerHTML = '<div class="tst-empty">Please log in to view trades.</div>'; return; }
    try {
      var client = getSupabase();
      var result = await client.from('trades').select('*').eq('user_id', user.id).order('entry_time', {ascending: false}).limit(100);
      if (result.error) throw result.error;
      var trades = result.data || [];
      if (!trades.length) {
        wrap.innerHTML = '<div class="tst-empty"><div class="empty-icon">📊</div><div class="empty-title">No trades logged yet</div><div class="empty-sub">Import your Webull CSV above or log a trade manually.</div></div>';
        return;
      }
      var rows = trades.map(function(t) {
        var pnlColor = (t.pnl||0) > 0 ? '#22c55e' : (t.pnl||0) < 0 ? '#ef4444' : '#6b7c6e';
        var pnlStr = ((t.pnl||0) >= 0 ? '+' : '') + '$' + Math.abs(t.pnl||0).toFixed(2);
        var dateStr = t.entry_time ? new Date(t.entry_time).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : '—';
        var timeStr = t.entry_time ? new Date(t.entry_time).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) : '';
        var winLoss = (t.pnl||0) > 0 ? 'WIN' : (t.pnl||0) < 0 ? 'LOSS' : 'BE';
        var winColor = (t.pnl||0) > 0 ? '#22c55e' : (t.pnl||0) < 0 ? '#ef4444' : '#6b7c6e';
        var setupTag = t.setup_type && t.setup_type !== 'Untagged' ? t.setup_type.replace('TST ','') : '<span style="color:#f59e0b;font-size:11px;">Untagged</span>';
        var chartBtn = '';
        return '<tr>' +
          '<td><div class="trade-ticker">' + t.ticker + '</div><div class="trade-date">' + dateStr + ' ' + timeStr + '</div></td>' +
          '<td><span class="trade-direction ' + t.direction.toLowerCase() + '">' + t.direction + '</span></td>' +
          '<td>' + setupTag + '</td>' +
          '<td>$' + (t.actual_entry||0) + '</td>' +
          '<td>$' + (t.exit_price||0) + '</td>' +
          '<td style="color:' + pnlColor + ';font-weight:700;">' + pnlStr + '</td>' +
          '<td>' + (t.hold_minutes !== null && t.hold_minutes !== undefined ? t.hold_minutes + 'm' : '—') + '</td>' +
          '<td><span class="trade-result" style="color:' + winColor + '">' + winLoss + '</span></td>' +
          '<td>' + chartBtn + '</td>' +
        '</tr>';
      }).join('');
      wrap.innerHTML = '<div class="trade-table-wrap"><table class="trade-table">' +
        '<thead><tr><th>Trade</th><th>Dir</th><th>Setup</th><th>Entry</th><th>Exit</th><th>P&L</th><th>Hold</th><th>Result</th><th></th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table></div>';
    } catch(e) {
      wrap.innerHTML = '<div class="tst-empty">Error: ' + (e.message||'Unknown') + '</div>';
    }
  },

  // ============================================================
  // TAB 3 — TRADING DATA
  // ============================================================
  renderTrading: async function(body, tier) {
    body.innerHTML = '<div class="tst-loading">Loading trading data...</div>';
    var user = await getUser();
    if (!user) { body.innerHTML = '<div class="tst-empty">Please log in.</div>'; return; }

    try {
      var client = getSupabase();
      var result = await client.from('trades').select('*').eq('user_id', user.id);
      if (result.error) throw result.error;
      var trades = result.data || [];

      if (trades.length < 3) {
        body.innerHTML = '<div class="tst-empty"><div class="empty-icon">📈</div><div class="empty-title">Not enough data yet</div><div class="empty-sub">Log at least 3 trades to see your full performance breakdown.</div></div>';
        return;
      }

      var wins = trades.filter(function(t){ return (t.pnl||0) > 0; });
      var losses = trades.filter(function(t){ return (t.pnl||0) < 0; });
      var totalPnl = trades.reduce(function(s,t){ return s + (t.pnl||0); }, 0);
      var winRate = Math.round(wins.length / trades.length * 100);
      var avgWin = wins.length ? wins.reduce(function(s,t){ return s+(t.pnl||0); },0)/wins.length : 0;
      var avgLoss = losses.length ? losses.reduce(function(s,t){ return s+(t.pnl||0); },0)/losses.length : 0;

      // By setup
      var bySetup = {};
      trades.forEach(function(t) {
        var s = t.setup_type || 'Untagged';
        if (!bySetup[s]) bySetup[s] = {wins:0,total:0,pnl:0};
        bySetup[s].total++; bySetup[s].pnl += (t.pnl||0);
        if ((t.pnl||0) > 0) bySetup[s].wins++;
      });

      // By hour
      var byHour = {};
      trades.forEach(function(t) {
        if (!t.entry_time) return;
        var h = new Date(t.entry_time).getHours();
        if (!byHour[h]) byHour[h] = {wins:0,total:0,pnl:0};
        byHour[h].total++; byHour[h].pnl += (t.pnl||0);
        if ((t.pnl||0) > 0) byHour[h].wins++;
      });

      // By day of week
      var byDay = {0:{n:'Sun',wins:0,total:0,pnl:0},1:{n:'Mon',wins:0,total:0,pnl:0},2:{n:'Tue',wins:0,total:0,pnl:0},3:{n:'Wed',wins:0,total:0,pnl:0},4:{n:'Thu',wins:0,total:0,pnl:0},5:{n:'Fri',wins:0,total:0,pnl:0},6:{n:'Sat',wins:0,total:0,pnl:0}};
      trades.forEach(function(t) {
        if (!t.entry_time) return;
        var d = new Date(t.entry_time).getDay();
        byDay[d].total++; byDay[d].pnl += (t.pnl||0);
        if ((t.pnl||0) > 0) byDay[d].wins++;
      });

      function makeTableRows(obj, keyLabel) {
        return Object.keys(obj).sort(function(a,b){ return obj[b].total - obj[a].total; }).filter(function(k){ return obj[k].total > 0; }).map(function(k) {
          var d = obj[k];
          var wr = d.total ? Math.round(d.wins/d.total*100) : 0;
          var pnlStr = (d.pnl>=0?'+':'') + '$' + Math.abs(d.pnl).toFixed(0);
          var wrColor = wr >= 60 ? '#22c55e' : wr >= 45 ? '#f59e0b' : '#ef4444';
          var pnlColor = d.pnl >= 0 ? '#22c55e' : '#ef4444';
          var label = keyLabel === 'hour' ? (parseInt(k) < 12 ? k+':00 AM' : (parseInt(k)-12||12)+':00 PM') : keyLabel === 'day' ? d.n : k.replace('TST ','');
          return '<tr><td>' + label + '</td><td>' + d.total + '</td><td style="color:'+wrColor+';font-weight:700;">' + wr + '%</td><td style="color:'+pnlColor+';font-weight:700;">' + pnlStr + '</td></tr>';
        }).join('');
      }

      var pnlColor = totalPnl >= 0 ? '#22c55e' : '#ef4444';
      var wrColor = winRate >= 55 ? '#22c55e' : winRate >= 45 ? '#f59e0b' : '#ef4444';

      var behavioralHTML = '';
      if (tier === 'base') {
        behavioralHTML = '<div class="dash-card dash-full tst-locked-card">' +
          '<div class="tst-lock-icon">🔬</div>' +
          '<div class="tst-lock-title">Behavioral Analysis</div>' +
          '<div class="tst-lock-body">Pattern detection, archetype assignment, and intervention recommendations are available on the Mentorship plan ($500/month). Your data is being collected — upgrade any time to unlock.</div>' +
          '<button class="btn-primary-green" style="margin-top:16px;">Upgrade to Mentorship</button>' +
        '</div>';
      } else {
        behavioralHTML = '<div class="dash-card dash-full"><div class="dash-card-label">Behavioral Profile</div><div style="color:var(--muted);font-size:14px;padding:16px 0;">Behavioral engine activates after 20 trades. Keep logging your trades.</div></div>';
      }

      body.innerHTML =
        '<div class="perf-stats-grid">' +
          '<div class="perf-stat"><div class="perf-stat-label">Trades</div><div class="perf-stat-num">' + trades.length + '</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Win Rate</div><div class="perf-stat-num" style="color:'+wrColor+'">' + winRate + '%</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Total P&L</div><div class="perf-stat-num" style="color:'+pnlColor+'">' + (totalPnl>=0?'+':'') + '$' + Math.abs(totalPnl).toFixed(0) + '</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Avg Winner</div><div class="perf-stat-num" style="color:#22c55e">+$' + avgWin.toFixed(0) + '</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Avg Loser</div><div class="perf-stat-num" style="color:#ef4444">$' + Math.abs(avgLoss).toFixed(0) + '</div></div>' +
          '<div class="perf-stat"><div class="perf-stat-label">Win/Loss Ratio</div><div class="perf-stat-num">' + (losses.length && avgLoss ? Math.abs(avgWin/avgLoss).toFixed(2) : '—') + '</div></div>' +
        '</div>' +
        '<div class="perf-tables-grid">' +
          '<div class="perf-table-wrap"><div class="perf-table-title">By Setup</div><table class="trade-table"><thead><tr><th>Setup</th><th>Trades</th><th>Win %</th><th>P&L</th></tr></thead><tbody>' + makeTableRows(bySetup, 'setup') + '</tbody></table></div>' +
          '<div class="perf-table-wrap"><div class="perf-table-title">By Time of Day</div><table class="trade-table"><thead><tr><th>Hour</th><th>Trades</th><th>Win %</th><th>P&L</th></tr></thead><tbody>' + makeTableRows(byHour, 'hour') + '</tbody></table></div>' +
          '<div class="perf-table-wrap"><div class="perf-table-title">By Day of Week</div><table class="trade-table"><thead><tr><th>Day</th><th>Trades</th><th>Win %</th><th>P&L</th></tr></thead><tbody>' + makeTableRows(byDay, 'day') + '</tbody></table></div>' +
        '</div>' +
        behavioralHTML;

    } catch(e) {
      body.innerHTML = '<div class="tst-empty">Error: ' + (e.message||'Unknown') + '</div>';
    }
  },

  // ============================================================
  // TAB 4 — NOTES
  // ============================================================
  renderNotes: async function(body, tier) {
    body.innerHTML = '<div class="tst-loading">Loading notes...</div>';
    var user = await getUser();
    if (!user) { body.innerHTML = '<div class="tst-empty">Please log in.</div>'; return; }

    // Load existing note
    var noteContent = '';
    try {
      var client = getSupabase();
      var result = await client.from('user_notes').select('content').eq('user_id', user.id).single();
      if (result.data) noteContent = result.data.content || '';
    } catch(e) {}

    body.innerHTML =
      '<div style="max-width:800px;">' +
        '<div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:#f0f4f1;margin-bottom:6px;letter-spacing:0.5px;">My Trading Notes</div>' +
        '<div style="font-size:13px;color:#6b7c6e;margin-bottom:20px;line-height:1.6;">Write anything here — your trading rules, setup criteria, observations, lessons learned. Saves to your account.</div>' +
        '<textarea id="notesEditor" placeholder="Write your notes here..." style="width:100%;min-height:480px;background:#111712;border:1.5px solid #1e2820;border-radius:12px;padding:20px;color:#f0f4f1;font-size:15px;line-height:1.7;resize:vertical;font-family:inherit;outline:none;display:block;box-sizing:border-box;">' + noteContent + '</textarea>' +
        '<div style="display:flex;align-items:center;margin-top:14px;gap:16px;">' +
          '<button onclick="TST_PROFILE.saveNotes()" style="background:#22c55e;color:#000;border:none;border-radius:10px;padding:12px 28px;font-family:Rajdhani,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.5px;cursor:pointer;">Save Notes</button>' +
          '<span id="notesSaveStatus" style="font-size:13px;color:#6b7c6e;"></span>' +
        '</div>' +
      '</div>';
  },

  saveNotes: async function() {
    var editor = document.getElementById('notesEditor');
    var status = document.getElementById('notesSaveStatus');
    if (!editor) return;
    var user = await getUser();
    if (!user) return;
    try {
      var client = getSupabase();
      await client.from('user_notes').upsert({
        user_id: user.id,
        content: editor.value,
        updated_at: new Date().toISOString()
      });
      if (status) { status.textContent = '✓ Saved'; setTimeout(function(){ status.textContent = ''; }, 2000); }
    } catch(e) {
      if (status) { status.style.color = '#ef4444'; status.textContent = 'Error saving.'; }
    }
  },
  // ==============================================
  // TAB 6 — 10K MEMBERS ONLY
  // ==============================================
  renderTenK: async function(body, tier) {
    body.innerHTML = '<div class="tst-loading">Loading your 10K dashboard...</div>';
    var user = await getUser();
    if (!user) { body.innerHTML = '<div class="tst-empty">Please log in.</div>'; return; }
    if (tier !== '10k') { body.innerHTML = '<div class="tst-empty" style="padding:48px;text-align:center;color:#6b7c6e;">This section is only available to TST Playbook members.</div>'; return; }

    var client = getSupabase();
    var messages = [];
    var playbook = null;
    var booking = null;
    var quizzes = [];

    try { var msgRes = await client.from('messages').select('*').eq('user_id', user.id).order('created_at', {ascending: false}).limit(20); messages = msgRes.data || []; } catch(e) {}
    try { var pbRes = await client.from('playbooks').select('*').eq('user_id', user.id).single(); if (pbRes.data) playbook = pbRes.data; } catch(e) {}
    try { var bkRes = await client.from('bookings').select('*').eq('user_id', user.id).order('created_at', {ascending: false}).limit(1).maybeSingle(); if (bkRes.data) booking = bkRes.data; } catch(e) {}
    try { var qRes = await client.from('quiz_results').select('*').eq('user_id', user.id); quizzes = qRes.data || []; } catch(e) {}

    // Messages HTML
    var messagesHtml = messages.length === 0
      ? '<div style="font-size:13px;color:#6b7c6e;padding:16px 0;">No messages yet. Ask anything below.</div>'
      : messages.map(function(m) {
          var isMine = m.sender === 'member';
          return '<div style="margin-bottom:12px;display:flex;flex-direction:column;align-items:' + (isMine ? 'flex-end' : 'flex-start') + ';">' +
            '<div style="max-width:85%;background:' + (isMine ? '#1a2e1a' : '#111a18') + ';border:1px solid ' + (isMine ? '#2d5a2d' : '#1e2820') + ';border-radius:10px;padding:12px 16px;">' +
              '<div style="font-size:13px;color:#c8d4c8;line-height:1.6;">' + m.content + '</div>' +
              '<div style="font-size:10px;color:#3a5a3a;margin-top:4px;">' + (isMine ? 'You' : 'TST') + ' · ' + new Date(m.created_at).toLocaleDateString() + '</div>' +
            '</div></div>';
        }).join('');

    // Playbook HTML
    var playbookHtml = playbook && playbook.content
      ? '<div style="font-size:12px;color:#6b7c6e;margin-bottom:12px;">Version ' + playbook.version + ' · Updated ' + new Date(playbook.updated_at).toLocaleDateString() + '</div>' +
        '<div style="background:#0c100d;border-radius:8px;padding:20px;font-size:14px;color:#c8d4c8;line-height:1.8;">' + playbook.content + '</div>'
      : '<div style="background:#0c100d;border-radius:10px;padding:24px;text-align:center;">' +
          '<div style="font-size:28px;margin-bottom:10px;">📋</div>' +
          '<div style="font-size:15px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">Your Playbook Is Being Built</div>' +
          '<div style="font-size:13px;color:#6b7c6e;line-height:1.7;max-width:400px;margin:0 auto;">Your personalized trading playbook will be created once you complete the course and log enough trades for analysis. Keep logging trades in your Journal.</div>' +
        '</div>';

    // Behavioral profile HTML from quiz data
    var behavioralHtml = '';
    if (quizzes.length === 0) {
      behavioralHtml = '<div style="text-align:center;padding:20px;"><div style="font-size:28px;margin-bottom:10px;">🧠</div><div style="font-size:14px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">Profile Being Built</div><div style="font-size:13px;color:#6b7c6e;">Complete course section quizzes to generate your behavioral profile.</div></div>';
    } else {
      var avgScore = Math.round(quizzes.reduce(function(s,q){ return s+q.score; },0) / quizzes.length);
      var totalRetakes = quizzes.reduce(function(s,q){ return s+(q.attempts-1); },0);
      var avgAttempts = (quizzes.reduce(function(s,q){ return s+q.attempts; },0) / quizzes.length).toFixed(1);
      var weakSections = quizzes.filter(function(q){ return q.score < 75 || q.attempts > 2; });
      var tendencies = [];
      if (quizzes.some(function(q){ return q.section==='beginner' && q.attempts>1; })) tendencies.push({icon:'⚠️',label:'Foundation Gaps',desc:'You required multiple attempts on beginner concepts. Revisit the beginner section before advancing.',color:'#ef4444'});
      if (quizzes.some(function(q){ return q.section==='psychology' && q.attempts>1; })) tendencies.push({icon:'🧠',label:'Emotional Awareness Developing',desc:'Psychology concepts required extra reinforcement — very common. Your awareness of this is the first step.',color:'#fbbf24'});
      if (quizzes.some(function(q){ return (q.section==='intermediate'||q.section==='smallcaps') && q.attempts>1; })) tendencies.push({icon:'📊',label:'Setup Recognition Building',desc:'Extra repetition needed on intermediate setups. Log trades with specific setup types to accelerate pattern recognition.',color:'#fbbf24'});
      if (avgScore >= 85) tendencies.push({icon:'🎯',label:'High Retention',desc:'Your average score of '+avgScore+'% indicates strong retention. Traders who retain concepts well execute more consistently under pressure.',color:'#22c55e'});
      if (quizzes.some(function(q){ return (q.section==='beginner'||q.section==='intermediate') && q.score>=90 && q.attempts===1; })) tendencies.push({icon:'✅',label:'Strong Technical Foundation',desc:'Strong first-attempt grasp of core concepts. This suggests good pattern intuition.',color:'#22c55e'});
      if (tendencies.length === 0) tendencies.push({icon:'📈',label:'Profile In Progress',desc:'Complete more sections to generate a fuller behavioral profile.',color:'#6b7280'});

      behavioralHtml =
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">' +
          '<div style="text-align:center;background:#0c100d;border-radius:8px;padding:10px;"><div style="font-size:20px;font-weight:700;color:#4ab44a;">' + avgScore + '%</div><div style="font-size:9px;color:#6b7c6e;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Avg Score</div></div>' +
          '<div style="text-align:center;background:#0c100d;border-radius:8px;padding:10px;"><div style="font-size:20px;font-weight:700;color:#4ab44a;">' + quizzes.length + '</div><div style="font-size:9px;color:#6b7c6e;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Sections</div></div>' +
          '<div style="text-align:center;background:#0c100d;border-radius:8px;padding:10px;"><div style="font-size:20px;font-weight:700;color:' + (parseFloat(avgAttempts)>1.5?'#fbbf24':'#4ab44a') + ';">' + avgAttempts + 'x</div><div style="font-size:9px;color:#6b7c6e;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Avg Attempts</div></div>' +
        '</div>' +
        tendencies.map(function(t){
          return '<div style="background:#0c100d;border-left:3px solid ' + t.color + ';border-radius:0 8px 8px 0;padding:12px 14px;margin-bottom:8px;">' +
            '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;"><span>' + t.icon + '</span><span style="font-size:13px;font-weight:700;color:#f0f4f1;">' + t.label + '</span></div>' +
            '<div style="font-size:12px;color:#8aad8a;line-height:1.6;">' + t.desc + '</div></div>';
        }).join('') +
        (weakSections.length>0 ? '<div style="margin-top:12px;"><div style="font-size:10px;font-weight:700;letter-spacing:2px;color:#ef4444;text-transform:uppercase;margin-bottom:8px;">Focus Areas</div>' +
          weakSections.map(function(q){ return '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a221a;"><span style="font-size:13px;color:#c8d4c8;">' + q.section.charAt(0).toUpperCase()+q.section.slice(1) + '</span><span style="font-size:12px;color:#ef4444;font-weight:700;">' + q.score + '% · ' + q.attempts + ' attempts</span></div>'; }).join('') + '</div>' : '');
    }

    // Quarterly review HTML
    var reviewHtml = booking
      ? '<div style="font-size:13px;color:#6b7c6e;margin-bottom:8px;">Last request: ' + new Date(booking.created_at).toLocaleDateString() + ' · <span style="color:' + (booking.status==='complete'?'#22c55e':'#d4af37') + ';font-weight:700;">' + booking.status + '</span></div>' +
        (booking.tst_response ? '<div style="background:#0c100d;border-left:3px solid #4ab44a;border-radius:0 8px 8px 0;padding:12px 14px;margin-top:10px;"><div style="font-size:10px;color:#4ab44a;font-weight:700;letter-spacing:1px;margin-bottom:4px;">TST RESPONSE</div><div style="font-size:13px;color:#c8d4c8;line-height:1.6;">' + booking.tst_response + '</div></div>' : '')
      : '<div style="font-size:13px;color:#6b7c6e;margin-bottom:12px;">Submit a request when you are ready for your quarterly review. We will go through your trades, patterns, and progress and send you a written summary.</div>';

    body.innerHTML =
      '<div style="max-width:840px;">' +
        '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;"><span style="font-size:22px;">⭐</span><div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:#d4af37;letter-spacing:0.5px;">10K Playbook Dashboard</div></div>' +
        '<div style="font-size:13px;color:#6b7c6e;margin-bottom:28px;line-height:1.6;">Your exclusive benefits — personalized playbook, behavioral profile, quarterly reviews, personalized content, and direct messaging.</div>' +

        // MESSAGES
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;margin-bottom:20px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Messages</div>' +
          '<div style="max-height:280px;overflow-y:auto;margin-bottom:14px;">' + messagesHtml + '</div>' +
          '<div style="display:flex;gap:10px;">' +
            '<textarea id="tenk-msg-input" placeholder="Ask anything — trades, setups, course questions..." style="flex:1;background:#0c100d;border:1px solid #1e2820;border-radius:8px;padding:10px;color:#f0f4f1;font-size:13px;font-family:inherit;resize:none;height:56px;outline:none;"></textarea>' +
            '<button onclick="TST_PROFILE.sendTenkMessage()" style="background:#4ab44a;color:#080d08;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;flex-shrink:0;">Send</button>' +
          '</div>' +
          '<div style="font-size:11px;color:#3a5a3a;margin-top:6px;">Priority access — responses not guaranteed after your first year.</div>' +
        '</div>' +

        // PLAYBOOK
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;margin-bottom:20px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Your Personal Playbook</div>' +
          playbookHtml +
        '</div>' +

        // BEHAVIORAL PROFILE
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;margin-bottom:20px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Behavioral Profile</div>' +
          '<div style="background:#111a12;border-radius:10px;padding:16px;">' + behavioralHtml + '</div>' +
        '</div>' +

        // PERSONALIZED CONTENT
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;margin-bottom:20px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Personalized Content</div>' +
          '<div style="background:#0c100d;border-radius:10px;padding:24px;text-align:center;">' +
            '<div style="font-size:28px;margin-bottom:10px;">🎬</div>' +
            '<div style="font-size:15px;font-weight:700;color:#f0f4f1;margin-bottom:8px;">Your Trade Review Video</div>' +
            '<div style="font-size:13px;color:#6b7c6e;line-height:1.7;max-width:440px;margin:0 auto 12px;">After your first quarterly review we will record a personalized video analyzing your actual trades — your specific patterns, edge, and mistakes. No one else sees this video.</div>' +
            '<div style="font-size:11px;color:#3a5a3a;font-style:italic;">Available after your first quarterly review</div>' +
          '</div>' +
        '</div>' +

        // QUARTERLY REVIEW
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;margin-bottom:20px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Quarterly Review</div>' +
          reviewHtml +
          '<button onclick="TST_PROFILE.submitQuarterlyReview()" style="margin-top:14px;background:transparent;border:1.5px solid #4ab44a;color:#4ab44a;border-radius:8px;padding:10px 20px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:13px;cursor:pointer;">Request Quarterly Review →</button>' +
        '</div>' +

        // INCLUDED
        '<div style="background:#111712;border:1.5px solid #1e2820;border-radius:14px;padding:24px;">' +
          '<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#6b7c6e;margin-bottom:14px;">Included With Your Membership</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
            '<div style="background:#0c100d;border:1px solid #1e2820;border-radius:10px;padding:14px;"><div style="font-size:14px;font-weight:700;color:#f0f4f1;margin-bottom:4px;">TradeGrader Pro</div><div style="font-size:11px;color:#6b7c6e;margin-bottom:8px;">AI-powered trade grading and behavioral analysis — 1 year included</div><a href="https://trade-grader.vercel.app" target="_blank" style="font-size:11px;color:#22c55e;font-weight:700;text-decoration:none;">Access TradeGrader →</a></div>' +
            '<div style="background:#0c100d;border:1px solid #1e2820;border-radius:10px;padding:14px;"><div style="font-size:14px;font-weight:700;color:#f0f4f1;margin-bottom:4px;">SMS Trade Alerts</div><div style="font-size:11px;color:#6b7c6e;margin-bottom:8px;">12 months of swing and long term trade alerts included</div><span style="font-size:11px;color:#d4af37;">Setup via Messages tab</span></div>' +
          '</div>' +
        '</div>' +

      '</div>';
  },

,

  sendTenkMessage: async function() {
    var input = document.getElementById('tenk-msg-input');
    var content = input ? input.value.trim() : '';
    if (!content) return;
    var user = await getUser();
    if (!user) return;
    try {
      var client = getSupabase();
      await client.from('messages').insert({ user_id: user.id, sender: 'member', content: content });
      input.value = '';
      var tier = await TST_PROFILE.getTier();
      TST_PROFILE.loadTab('tenk', tier);
    } catch(e) { console.error('Message error:', e); }
  },

  submitQuarterlyReview: async function() {
    var user = await getUser();
    if (!user) return;
    var quarter = 'Q' + (Math.ceil((new Date().getMonth()+1)/3)) + ' ' + new Date().getFullYear();
    try {
      var client = getSupabase();
      await client.from('bookings').insert({ user_id: user.id, quarter: quarter, status: 'pending', member_notes: 'Quarterly review requested' });
      alert('Review request submitted. We will get back to you shortly.');
      var tier = await TST_PROFILE.getTier();
      TST_PROFILE.loadTab('tenk', tier);
    } catch(e) { console.error('Booking error:', e); }
  },

  
  renderMessages: async function(body, tier) {
    body.innerHTML = '<div class="tst-loading">Loading messages...</div>';
    var user = await getUser();
    if (!user) { body.innerHTML = '<div class="tst-empty">Please log in.</div>'; return; }

    var isAdmin = user.email === 'h@topstocktrading.com';

    try {
      var client = getSupabase();

      if (isAdmin) {
        // Admin sees all conversations
        var result = await client.from('messages').select('*').order('created_at', {ascending: false}).limit(100);
        var msgs = result.data || [];
        var byUser = {};
        msgs.forEach(function(m) {
          if (!byUser[m.user_id]) byUser[m.user_id] = [];
          byUser[m.user_id].push(m);
        });

        var threadHTML = Object.keys(byUser).map(function(uid) {
          var userMsgs = byUser[uid];
          var latest = userMsgs[0];
          return '<div class="msg-thread-item" onclick="TST_PROFILE.openThread(\'' + uid + '\')">' +
            '<div class="msg-thread-name">' + uid.substring(0,8) + '...</div>' +
            '<div class="msg-thread-preview">' + (latest.content||'').substring(0,60) + '</div>' +
            '<div class="msg-thread-time">' + new Date(latest.created_at).toLocaleDateString() + '</div>' +
          '</div>';
        }).join('') || '<div class="tst-empty">No messages yet.</div>';

        body.innerHTML =
          '<div style="max-width:760px;">' +
            '<div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:#f0f4f1;margin-bottom:4px;letter-spacing:0.5px;">Message Center</div>' +
            '<div style="font-size:13px;color:#6b7c6e;margin-bottom:24px;">All student conversations</div>' +
            '<div style="background:#111712;border:1px solid #1e2820;border-radius:12px;overflow:hidden;">' + threadHTML + '</div>' +
          '</div>';

      } else if (tier === '10k' || tier === 'mentorship') {
        // Students can send and receive messages
        var result2 = await client.from('messages').select('*').eq('user_id', user.id).order('created_at', {ascending: true}).limit(100);
        var msgs2 = result2.data || [];

        var msgHTML = msgs2.map(function(m) {
          var isMe = m.sender === 'student';
          return '<div class="msg-bubble ' + (isMe ? 'msg-mine' : 'msg-theirs') + '">' +
            '<div class="msg-bubble-label">' + (isMe ? 'You' : 'TST Academy') + '</div>' +
            '<div class="msg-bubble-content">' + m.content + '</div>' +
            '<div class="msg-bubble-time">' + new Date(m.created_at).toLocaleString() + '</div>' +
          '</div>';
        }).join('') || '<div style="text-align:center;padding:32px;color:var(--muted);font-size:14px;">No messages yet. Send your first message below.</div>';

        body.innerHTML =
          '<div style="max-width:760px;">' +
            '<div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:#f0f4f1;margin-bottom:4px;letter-spacing:0.5px;">Message Center</div>' +
            '<div style="font-size:13px;color:#6b7c6e;margin-bottom:24px;">Direct line to TST Academy — responses within 24-48 hours</div>' +
            '<div id="msgThreadBody" style="min-height:300px;max-height:500px;overflow-y:auto;padding:16px 0;display:flex;flex-direction:column;gap:12px;margin-bottom:20px;">' + msgHTML + '</div>' +
            '<div style="margin-top:8px;">' +
              '<textarea id="msgInput" placeholder="Ask a question, request a trade review, or share what you are working on..." rows="3" style="width:100%;background:#111712;border:1.5px solid #1e2820;border-radius:10px;padding:14px;color:#f0f4f1;font-size:14px;resize:vertical;font-family:inherit;outline:none;box-sizing:border-box;"></textarea>' +
              '<button onclick="TST_PROFILE.sendMessage()" style="margin-top:10px;background:#22c55e;color:#000;border:none;border-radius:10px;padding:12px 28px;font-family:Rajdhani,sans-serif;font-size:15px;font-weight:700;cursor:pointer;">Send Message</button>' +
            '</div>' +
          '</div>';

        // Scroll to bottom
        setTimeout(function(){
          var tb = document.getElementById('msgThreadBody');
          if (tb) tb.scrollTop = tb.scrollHeight;
        }, 100);

      } else {
        // Base tier
        body.innerHTML =
          '<div style="max-width:760px;">' +
            '<div style="font-family:Rajdhani,sans-serif;font-size:28px;font-weight:700;color:#f0f4f1;margin-bottom:4px;letter-spacing:0.5px;">Message Center</div>' +
            '<div style="font-size:13px;color:#6b7c6e;margin-bottom:32px;">Direct line to TST Academy</div>' +
            '<div style="background:#111712;border:1px solid #1e2820;border-radius:16px;padding:48px;text-align:center;">' +
              '<div style="font-size:40px;margin-bottom:16px;">💬</div>' +
              '<div style="font-family:Rajdhani,sans-serif;font-size:22px;font-weight:700;color:#f0f4f1;margin-bottom:12px;">Direct Messaging</div>' +
              '<div style="font-size:14px;color:#6b7c6e;line-height:1.8;max-width:480px;margin:0 auto 24px;">Direct messaging with TST Academy is available on the Mentorship plan. Ask questions, request trade reviews, and get personal feedback on your trading.</div>' +
              '<button style="background:#22c55e;color:#000;border:none;border-radius:10px;padding:12px 28px;font-family:Rajdhani,sans-serif;font-size:15px;font-weight:700;cursor:pointer;">Upgrade to Mentorship</button>' +
            '</div>' +
          '</div>';
      }
    } catch(e) {
      body.innerHTML = '<div class="tst-empty">Error: ' + (e.message||'Unknown') + '</div>';
    }
  },

  sendMessage: async function() {
    var input = document.getElementById('msgInput');
    if (!input || !input.value.trim()) return;
    var user = await getUser();
    if (!user) return;
    try {
      var client = getSupabase();
      await client.from('messages').insert([{
        user_id: user.id,
        content: input.value.trim(),
        sender: 'student',
        created_at: new Date().toISOString()
      }]);
      input.value = '';
      await TST_PROFILE.renderMessages(document.getElementById('tstTabBody'), await TST_PROFILE.getTier());
    } catch(e) { alert('Error sending message: ' + (e.message||'Unknown')); }
  },

  openThread: async function(userId) {
    var body = document.getElementById('tstTabBody');
    if (!body) return;
    var client = getSupabase();
    var result = await client.from('messages').select('*').eq('user_id', userId).order('created_at', {ascending: true});
    var msgs = result.data || [];

    var msgHTML = msgs.map(function(m) {
      var isStudent = m.sender === 'student';
      return '<div class="msg-bubble ' + (isStudent ? 'msg-mine' : 'msg-theirs') + '">' +
        '<div class="msg-bubble-label">' + (isStudent ? 'Student' : 'TST Academy') + '</div>' +
        '<div class="msg-bubble-content">' + m.content + '</div>' +
        '<div class="msg-bubble-time">' + new Date(m.created_at).toLocaleString() + '</div>' +
      '</div>';
    }).join('');

    body.innerHTML =
      '<div class="msg-wrap">' +
        '<button class="btn-outline-green" style="margin-bottom:20px;" onclick="TST_PROFILE.switchTab(\'messages\', null)">← Back</button>' +
        '<div class="msg-thread-body">' + msgHTML + '</div>' +
        '<div class="msg-compose">' +
          '<textarea id="adminReplyInput" placeholder="Reply to this student..." rows="3" style="width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:10px;padding:12px;color:var(--text);font-size:14px;resize:vertical;font-family:inherit;outline:none;"></textarea>' +
          '<button class="btn-primary-green" style="margin-top:10px;" onclick="TST_PROFILE.adminReply(\'' + userId + '\')">Send Reply</button>' +
        '</div>' +
      '</div>';
  },

  adminReply: async function(userId) {
    var input = document.getElementById('adminReplyInput');
    if (!input || !input.value.trim()) return;
    var client = getSupabase();
    await client.from('messages').insert([{
      user_id: userId,
      content: input.value.trim(),
      sender: 'admin',
      created_at: new Date().toISOString()
    }]);
    input.value = '';
    await TST_PROFILE.openThread(userId);
  }
};

// Override showProfileDashboard
window.addEventListener('load', function() {
  var orig = window.showProfileDashboard;
  window.showProfileDashboard_original = orig;
  window.showProfileDashboard = function() {
    TST_PROFILE.render();
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


window.TST_PROFILE = TST_PROFILE;


