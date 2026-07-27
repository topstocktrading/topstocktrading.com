// TST Interactive Quiz — 20 questions
// 10 zone-click + 10 multiple choice

const QUIZ_QUESTIONS = [

// ── ZONE QUESTIONS (q1-q10) ──────────────────────────────────────────────

{
  id:'q1', type:'zone',
  title:'Bull Flag — Where Do You Enter?',
  instruction:'This stock just broke out of a bull flag. Click where you would enter.',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:140,h:148,l:139,c:147,v:3200},
      {o:147,h:156,l:146,c:155,v:3900},
      {o:155,h:164,l:154,c:163,v:4100},
      {o:163,h:172,l:162,c:171,v:3800},
      // flag consolidation
      {o:171,h:173,l:169,c:170,v:980},
      {o:170,h:172,l:167,c:169,v:860},
      {o:169,h:171,l:167,c:168,v:820},
      {o:168,h:170,l:166,c:169,v:800},
      // breakout
      {o:169,h:180,l:168,c:179,v:4200},
      {o:179,h:185,l:178,c:184,v:3600},
      {o:184,h:189,l:183,c:188,v:3100},
    ];
    const minP=136, maxP=193;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // Flag resistance line
    const y = priceToY(173,minP,maxP,H);
    ctx.strokeStyle='rgba(251,191,36,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W)+4*cSlot(W,candles.length), y);
    ctx.lineTo(cLeft(W)+8*cSlot(W,candles.length), y); ctx.stroke(); ctx.setLineDash([]);
    drawLabel(ctx,'Bull Flag Breakout',W,H);
  },
  zones:{early:[0.0,0.48], ideal:[0.52,0.72], late:[0.72,1.0]},
  feedback:{
    early:'Too early — the flag hasn\'t broken out yet. The breakout candle is your signal.',
    ideal:'Correct. Entry on the breakout candle above flag resistance with volume expansion.',
    late:'Too late — you\'re chasing. The risk/reward is poor this far from the breakout.'
  }
},

{
  id:'q2', type:'zone',
  title:'Opening Range Breakout — Entry Point?',
  instruction:'The first 6 candles set the opening range. The stock breaks out. Where do you enter?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:184,h:188,l:182,c:185,v:2600},
      {o:185,h:189,l:183,c:186,v:2400},
      {o:186,h:189,l:184,c:185,v:2200},
      {o:185,h:190,l:184,c:188,v:2300},
      {o:188,h:190,l:185,c:186,v:2100},
      {o:186,h:191,l:185,c:187,v:2000},
      // breakout
      {o:187,h:198,l:186,c:197,v:5400},
      {o:197,h:203,l:196,c:202,v:4700},
      {o:202,h:207,l:200,c:206,v:4000},
    ];
    const minP=179, maxP=211;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const orbHigh=191, orbLow=182;
    const yH=priceToY(orbHigh,minP,maxP,H), yL=priceToY(orbLow,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),yH); ctx.lineTo(W-10,yH); ctx.stroke();
    ctx.strokeStyle='rgba(239,68,68,0.4)';
    ctx.beginPath(); ctx.moveTo(cLeft(W),yL); ctx.lineTo(W-10,yL); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.7)'; ctx.font='9px sans-serif';
    ctx.fillText('ORB HIGH',cLeft(W)+4,yH-4);
    drawLabel(ctx,'Opening Range Breakout',W,H);
  },
  zones:{early:[0.0,0.50], ideal:[0.54,0.72], late:[0.72,1.0]},
  feedback:{
    early:'Still inside the opening range — no breakout confirmed yet.',
    ideal:'Correct. Entry on the breakout candle above ORB high on volume.',
    late:'Too late — two candles past the breakout. Entry here is chasing.'
  }
},

{
  id:'q3', type:'zone',
  title:'Support Retest — Where Do You Buy?',
  instruction:'Price broke out, pulled back to old resistance now acting as support. Where do you enter?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:61,h:64,l:60,c:63,v:1800},
      {o:63,h:66,l:62,c:65,v:2000},
      {o:65,h:68,l:64,c:67,v:2300},
      {o:67,h:71,l:66,c:70,v:3200},
      {o:70,h:77,l:69,c:76,v:5100},
      // pullback to support
      {o:76,h:78,l:72,c:73,v:2600},
      {o:73,h:74,l:70,c:71,v:2100},
      {o:71,h:72,l:69,c:70,v:1800},
      {o:70,h:72,l:69,c:71,v:1700},
      // bounce
      {o:71,h:75,l:70,c:74,v:2800},
      {o:74,h:79,l:73,c:78,v:3500},
    ];
    const minP=57, maxP=83;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(70,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.7)'; ctx.font='9px sans-serif';
    ctx.fillText('Old resistance → now support',cLeft(W)+4,suppY-4);
    drawLabel(ctx,'Breakout Retest',W,H);
  },
  zones:{early:[0.0,0.58], ideal:[0.62,0.78], late:[0.78,1.0]},
  feedback:{
    early:'Price is still pulling back to the level — wait for it to hold and show a reversal candle.',
    ideal:'Correct. Buy the bounce off old resistance now acting as support.',
    late:'The bounce has already moved significantly — poor risk/reward here.'
  }
},

{
  id:'q4', type:'zone',
  title:'Bear Flag — Short Entry?',
  instruction:'A bear flag formed after the downward move. Where do you enter the short?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      // pole down
      {o:96,h:97,l:89,c:90,v:3900},
      {o:90,h:91,l:83,c:84,v:4200},
      {o:84,h:85,l:78,c:79,v:3800},
      // flag bounce up
      {o:79,h:83,l:78,c:82,v:1100},
      {o:82,h:85,l:81,c:84,v:950},
      {o:84,h:86,l:82,c:85,v:880},
      {o:85,h:87,l:83,c:84,v:820},
      // breakdown
      {o:84,h:85,l:76,c:77,v:4600},
      {o:77,h:78,l:71,c:72,v:4000},
    ];
    const minP=68, maxP=101;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // flag support line
    const suppY=priceToY(78,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath();
    ctx.moveTo(cLeft(W)+3*cSlot(W,candles.length), suppY);
    ctx.lineTo(cLeft(W)+7*cSlot(W,candles.length), suppY);
    ctx.stroke(); ctx.setLineDash([]);
    drawLabel(ctx,'Bear Flag Breakdown',W,H);
  },
  zones:{early:[0.0,0.54], ideal:[0.58,0.74], late:[0.74,1.0]},
  feedback:{
    early:'Still inside the flag — no breakdown signal yet. Wait for the break below flag support.',
    ideal:'Correct. Short entry on the break below flag support on volume.',
    late:'Most of the move is already done — chasing here gives poor risk/reward.'
  }
},

{
  id:'q5', type:'zone',
  title:'Morning Flush — Where Do You Buy?',
  instruction:'Stock with a strong catalyst flushed hard at open then showed a reversal candle. Entry?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:48,h:55,l:47,c:50,v:4900},
      {o:50,h:51,l:43,c:44,v:7400},
      {o:44,h:45,l:39,c:40,v:8200},
      {o:40,h:42,l:38,c:41,v:5800}, // flush low + hammer
      // recovery
      {o:41,h:47,l:40,c:46,v:6200},
      {o:46,h:52,l:45,c:51,v:5500},
      {o:51,h:56,l:50,c:55,v:4400},
      {o:55,h:59,l:54,c:58,v:3800},
    ];
    const minP=35, maxP=63;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // VWAP line approximate
    const vwapY=priceToY(44,minP,maxP,H);
    ctx.strokeStyle='rgba(168,85,247,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),vwapY); ctx.lineTo(W-10,vwapY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(168,85,247,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('VWAP',cLeft(W)+4,vwapY-4);
    drawLabel(ctx,'Morning Flush Recovery',W,H);
  },
  zones:{early:[0.0,0.36], ideal:[0.40,0.58], late:[0.58,1.0]},
  feedback:{
    early:'Do not try to catch the falling knife — the flush is still happening.',
    ideal:'Correct. Entry on the reclaim of VWAP after the flush low forms.',
    late:'The recovery is well underway — risk/reward is poor this far from the entry signal.'
  }
},

{
  id:'q6', type:'zone',
  title:'Hammer at Support — Entry?',
  instruction:'A hammer candle formed at key support after a downtrend. Where do you enter?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:88,h:91,l:87,c:89,v:2100},
      {o:89,h:90,l:84,c:85,v:2500},
      {o:85,h:86,l:80,c:81,v:2800},
      {o:81,h:82,l:76,c:77,v:3100},
      {o:77,h:78,l:66,c:75,v:5200}, // hammer
      {o:75,h:81,l:74,c:80,v:3800},
      {o:80,h:86,l:79,c:85,v:3200},
      {o:85,h:90,l:84,c:89,v:2800},
    ];
    const minP=62, maxP=95;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(75,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(251,191,36,0.8)'; ctx.font='9px sans-serif';
    const hamX=cLeft(W)+4*cSlot(W,candles.length)+cSlot(W,candles.length)/2;
    ctx.fillText('HAMMER',hamX-18,priceToY(69,minP,maxP,H));
    drawLabel(ctx,'Hammer Reversal at Support',W,H);
  },
  zones:{early:[0.0,0.44], ideal:[0.48,0.64], late:[0.64,1.0]},
  feedback:{
    early:'The hammer needs to complete first, then wait for the next candle to confirm.',
    ideal:'Correct. Entry on the confirmation candle after the hammer — next green close above the hammer high.',
    late:'The move from the hammer is already significant. Better entry was at confirmation.'
  }
},

{
  id:'q7', type:'zone',
  title:'Head & Shoulders — Short Entry?',
  instruction:'A Head & Shoulders pattern completed. Where do you enter the short?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    // Left shoulder, head, right shoulder
    const pts = [
      {o:58,h:60,l:57,c:59},
      {o:59,h:74,l:58,c:73},
      {o:73,h:74,l:61,c:62},
      {o:62,h:63,l:61,c:62},
      {o:62,h:86,l:61,c:85},
      {o:85,h:86,l:61,c:62},
      {o:62,h:63,l:61,c:62},
      {o:62,h:74,l:61,c:73},
      {o:73,h:74,l:59,c:60},
      // neckline break
      {o:60,h:61,l:53,c:54},
      {o:54,h:55,l:48,c:49},
    ];
    const candles = pts.map((p,i)=>({...p, v:2000+i*200}));
    const minP=44, maxP=92;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const neckY=priceToY(61,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.8)'; ctx.lineWidth=1.5; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),neckY); ctx.lineTo(W-10,neckY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('NECKLINE',cLeft(W)+4,neckY-4);
    drawLabel(ctx,'Head & Shoulders',W,H);
  },
  zones:{early:[0.0,0.58], ideal:[0.62,0.78], late:[0.78,1.0]},
  feedback:{
    early:'The H&S needs to complete with a neckline break. Wait for the confirmation.',
    ideal:'Correct. Short entry on the neckline break with volume.',
    late:'Breakdown has already moved significantly — risk/reward is poor.'
  }
},

{
  id:'q8', type:'zone',
  title:'Ascending Triangle — Buy the Breakout?',
  instruction:'An ascending triangle compressed for several candles. Where do you enter?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:67,h:72,l:66,c:71,v:1900},
      {o:71,h:77,l:70,c:73,v:3400},
      {o:73,h:75,l:68,c:69,v:2100},
      {o:69,h:73,l:68,c:72,v:2300},
      {o:72,h:77,l:71,c:74,v:2700},
      {o:74,h:77,l:73,c:75,v:2200},
      {o:75,h:77,l:74,c:76,v:2000},
      {o:76,h:77,l:75,c:76,v:1900},
      // breakout
      {o:76,h:85,l:75,c:84,v:5400},
      {o:84,h:90,l:83,c:89,v:4600},
    ];
    const minP=63, maxP=95;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const resY=priceToY(77,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),resY); ctx.lineTo(W-10,resY); ctx.stroke();
    ctx.strokeStyle='rgba(0,210,122,0.5)';
    ctx.beginPath();
    ctx.moveTo(cLeft(W), priceToY(66,minP,maxP,H));
    ctx.lineTo(cLeft(W)+8*cSlot(W,candles.length), priceToY(75,minP,maxP,H));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.7)'; ctx.font='9px sans-serif';
    ctx.fillText('FLAT RESISTANCE',cLeft(W)+4,resY-4);
    drawLabel(ctx,'Ascending Triangle',W,H);
  },
  zones:{early:[0.0,0.58], ideal:[0.62,0.76], late:[0.76,1.0]},
  feedback:{
    early:'Still inside the triangle — wait for the break above flat resistance on volume.',
    ideal:'Correct. Entry on the breakout candle with volume expansion.',
    late:'The breakout already moved significantly — buying here is chasing.'
  }
},

{
  id:'q9', type:'zone',
  title:'Lower High — Short Setup',
  instruction:'The stock is making lower highs in a downtrend. Where do you enter the short?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:82,h:87,l:81,c:86,v:2200},
      {o:86,h:90,l:75,c:76,v:3900},
      {o:76,h:82,l:75,c:81,v:2300},
      {o:81,h:84,l:76,c:77,v:2000},
      // lower high forms
      {o:77,h:81,l:76,c:80,v:1900},
      {o:80,h:83,l:79,c:80,v:1700},
      // rollover
      {o:80,h:81,l:72,c:73,v:3700},
      {o:73,h:74,l:66,c:67,v:4100},
    ];
    const minP=62, maxP=95;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // Draw lower highs trendline
    ctx.strokeStyle='rgba(239,68,68,0.5)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(cLeft(W)+1*cSlot(W,candles.length)+cSlot(W,candles.length)/2, priceToY(90,minP,maxP,H));
    ctx.lineTo(cLeft(W)+5*cSlot(W,candles.length)+cSlot(W,candles.length)/2, priceToY(83,minP,maxP,H));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.7)'; ctx.font='8px sans-serif';
    ctx.fillText('LH',cLeft(W)+1*cSlot(W,candles.length)+2,priceToY(90,minP,maxP,H)-8);
    ctx.fillText('LH',cLeft(W)+4*cSlot(W,candles.length)+2,priceToY(83,minP,maxP,H)-8);
    drawLabel(ctx,'Lower High Short Setup',W,H);
  },
  zones:{early:[0.0,0.44], ideal:[0.48,0.64], late:[0.64,1.0]},
  feedback:{
    early:'Wait for the lower high to fully form — the bounce needs to peak and roll over.',
    ideal:'Correct. Short at the confirmed lower high as price begins to roll over.',
    late:'The rollover has already started — you missed the optimal entry.'
  }
},

{
  id:'q10', type:'zone',
  title:'Washout Low — Where Do You Buy?',
  instruction:'Stock washed out below support on massive volume then showed a strong reversal candle. Entry?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:74,h:77,l:73,c:76,v:1900},
      {o:76,h:78,l:75,c:77,v:2100},
      {o:77,h:79,l:76,c:78,v:2000},
      // washout
      {o:78,h:79,l:63,c:65,v:9400},
      {o:65,h:66,l:62,c:64,v:7100},
      // reversal
      {o:64,h:72,l:63,c:71,v:6200},
      {o:71,h:77,l:70,c:76,v:4800},
      {o:76,h:80,l:75,c:79,v:3900},
    ];
    const minP=58, maxP=84;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(74,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.5)'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.6)'; ctx.font='9px sans-serif';
    ctx.fillText('Support',cLeft(W)+4,suppY-4);
    drawLabel(ctx,'Washout & Recovery',W,H);
  },
  zones:{early:[0.0,0.40], ideal:[0.44,0.60], late:[0.60,1.0]},
  feedback:{
    early:'Do not buy into the washout — wait for the forced selling to exhaust.',
    ideal:'Correct. Entry on the strong reclaim candle after the washout low.',
    late:'The recovery is already well underway — risk/reward is poor here.'
  }
},

// ── MULTIPLE CHOICE QUESTIONS (q11-q20) ──────────────────────────────────

{
  id:'q11', type:'mc',
  title:'Identify This Pattern',
  instruction:'What pattern is shown and what does it signal?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:70,h:74,l:69,c:73,v:2000},
      {o:73,h:77,l:72,c:76,v:2400},
      {o:76,h:80,l:75,c:79,v:2800},
      {o:79,h:85,l:78,c:84,v:3400},
      // fake breakout above 85 then reversal
      {o:84,h:91,l:83,c:85,v:3200},
      {o:85,h:87,l:75,c:76,v:5100},
      {o:76,h:77,l:70,c:71,v:4200},
      {o:71,h:72,l:65,c:66,v:3800},
    ];
    const minP=61, maxP=96;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const resY=priceToY(85,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.7)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),resY); ctx.lineTo(W-10,resY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('RESISTANCE $85',cLeft(W)+4,resY-4);
    drawLabel(ctx,'What Is Happening Here?',W,H);
  },
  choices:[
    'Bull flag breakout — buy the momentum',
    'Fake breakout (bull trap) — sellers took over at resistance',
    'Ascending triangle completion — strong continuation signal',
    'Normal consolidation — price will attempt the level again soon'
  ],
  correct:1,
  feedback:'This is a bull trap. Price briefly broke above resistance then immediately reversed on high volume. The large red candle after the "breakout" is a kill candle. Every buyer on the breakout is now trapped.'
},

{
  id:'q12', type:'mc',
  title:'Reading Volume',
  instruction:'Price is rising but what does this volume pattern tell you?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:60,h:65,l:59,c:64,v:5200},
      {o:64,h:70,l:63,c:69,v:4800},
      {o:69,h:75,l:68,c:74,v:4100},
      {o:74,h:80,l:73,c:79,v:3300},
      {o:79,h:85,l:78,c:84,v:2400},
      {o:84,h:90,l:83,c:89,v:1600},
      {o:89,h:94,l:88,c:93,v:1100},
    ];
    const minP=55, maxP=99;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx,'Price Rising — Volume Pattern?',W,H);
  },
  choices:[
    'Bullish — rising price with any volume is a good sign',
    'Neutral — volume is not relevant to this type of move',
    'Warning — rising price on declining volume signals weakening momentum',
    'Bearish reversal guaranteed — always sell when volume drops'
  ],
  correct:2,
  feedback:'Volume divergence. Price is making new highs but each candle has less volume than the last. Fewer participants are willing to buy at higher prices. This is an exhaustion signal — the move is likely running out of fuel.'
},

{
  id:'q13', type:'mc',
  title:'Green to Red — What Does It Mean?',
  instruction:'Stock opened above yesterday\'s close but reversed. What does this signal?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:57,h:63,l:56,c:62,v:2200,'label':'Day 1'},
      {o:65,h:70,l:57,c:58,v:5100,'label':'Day 2'},
    ];
    const minP=52, maxP=75;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const prevCloseY=priceToY(62,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.7)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),prevCloseY); ctx.lineTo(W-10,prevCloseY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('Prior close $62',cLeft(W)+4,prevCloseY-5);
    ctx.fillStyle='rgba(239,68,68,0.8)';
    ctx.fillText('Opened $65 → closed $58',cLeft(W)+4,prevCloseY+16);
    drawLabel(ctx,'Green to Red Reversal',W,H);
  },
  choices:[
    'Bullish — the large wick shows buyers defended the stock aggressively',
    'Neutral — opening gaps fill regularly, no edge here',
    'Bearish — buyers who opened long are all underwater, sellers in control',
    'Buy signal — the stock is now oversold after today\'s decline'
  ],
  correct:2,
  feedback:'Green to red is a bearish signal. The stock opened in green territory and sellers pushed it below the prior close. Every buyer from the open is now losing money. This trapping of buyers accelerates the decline.'
},

{
  id:'q14', type:'mc',
  title:'What Is This Candle?',
  instruction:'Identify this candle and what it signals in context.',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:72,h:75,l:71,c:74,v:2000},
      {o:74,h:78,l:73,c:77,v:2300},
      {o:77,h:82,l:76,c:81,v:2700},
      {o:81,h:86,l:80,c:85,v:3100},
      // shooting star
      {o:85,h:98,l:84,c:86,v:4200},
      {o:86,h:88,l:80,c:81,v:3600},
      {o:81,h:82,l:75,c:76,v:3200},
    ];
    const minP=68, maxP=103;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const slot=cSlot(W,candles.length);
    const lp=cLeft(W);
    ctx.strokeStyle='rgba(251,191,36,0.8)'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(lp+4*slot+slot/2, priceToY(91,minP,maxP,H), 14, 0, Math.PI*2); ctx.stroke();
    drawLabel(ctx,'Name This Candle',W,H);
  },
  choices:[
    'Hammer — bullish reversal, buyers rejected the low',
    'Doji — indecision, neither side won',
    'Shooting star — bearish reversal, sellers rejected the high',
    'Marubozu — maximum conviction, strong continuation signal'
  ],
  correct:2,
  feedback:'Shooting star. Small body at the bottom, long upper wick (2x+ the body). After an uptrend it signals sellers took control and rejected the highs aggressively. A bearish reversal signal at resistance.'
},

{
  id:'q15', type:'mc',
  title:'Parabolic Move — What Do You Do?',
  instruction:'A stock has gone nearly vertical. You are already long from much lower. What is the right move?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:50,h:53,l:49,c:52,v:1600},
      {o:52,h:56,l:51,c:55,v:1900},
      {o:55,h:60,l:54,c:59,v:2500},
      {o:59,h:67,l:58,c:66,v:3400},
      {o:66,h:77,l:65,c:76,v:5200},
      {o:76,h:92,l:75,c:91,v:8400},
      {o:91,h:110,l:90,c:109,v:13000},
      {o:109,h:112,l:80,c:83,v:11000},
    ];
    const minP=45, maxP=118;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx,'Parabolic Move — Now What?',W,H);
  },
  choices:[
    'Hold — parabolic stocks always go higher before they top',
    'Add to the position — the momentum is undeniable',
    'Scale out aggressively — parabolic moves always end violently',
    'Set a tight stop and let it run — protect the gain without exiting'
  ],
  correct:2,
  feedback:'When a stock goes parabolic, scale out. The last candle here shows exactly what happens — a massive run followed by a collapse in the same session. The final buyers always get destroyed. You do not need to sell at the top — selling before the collapse is enough.'
},

{
  id:'q16', type:'mc',
  title:'Accumulation or Distribution?',
  instruction:'Price is in a tight range on above-average volume. What is most likely happening?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:70,h:73,l:69,c:72,v:5800},
      {o:72,h:74,l:70,c:71,v:6100},
      {o:71,h:74,l:70,c:73,v:5600},
      {o:73,h:75,l:70,c:71,v:6400},
      {o:71,h:74,l:69,c:73,v:5900},
      {o:73,h:75,l:70,c:72,v:6200},
      {o:72,h:74,l:70,c:73,v:5700},
      // breakout
      {o:73,h:82,l:72,c:81,v:9800},
    ];
    const minP=66, maxP=87;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const topY=priceToY(75,minP,maxP,H), botY=priceToY(69,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.4)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),topY); ctx.lineTo(cLeft(W)+7*cSlot(W,candles.length),topY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cLeft(W),botY); ctx.lineTo(cLeft(W)+7*cSlot(W,candles.length),botY); ctx.stroke();
    ctx.setLineDash([]);
    drawLabel(ctx,'Tight Range + High Volume',W,H);
  },
  choices:[
    'Distribution — smart money selling into retail buyers',
    'Accumulation — institutions absorbing supply without moving price up',
    'Indecision — no edge, avoid this stock',
    'Consolidation before a breakdown — look for the short'
  ],
  correct:1,
  feedback:'Accumulation. Price is NOT falling despite high volume — that means a large buyer is absorbing every share offered. They cannot move price up yet without alerting the market. The breakout on the final candle confirms it.'
},

{
  id:'q17', type:'mc',
  title:'Healthy Pullback or Breakdown?',
  instruction:'After a strong move up, price pulls back. Is this healthy or a breakdown?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:58,h:62,l:57,c:61,v:3100},
      {o:61,h:67,l:60,c:66,v:3900},
      {o:66,h:73,l:65,c:72,v:4500},
      // pullback — low volume, shallow
      {o:72,h:73,l:69,c:70,v:1600},
      {o:70,h:71,l:68,c:69,v:1400},
      {o:69,h:70,l:67,c:68,v:1300},
      {o:68,h:70,l:67,c:69,v:1400},
    ];
    const minP=54, maxP=78;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx,'Pullback After Uptrend',W,H);
  },
  choices:[
    'Breakdown — any red candles after a move means the trend is over',
    'Healthy pullback — price retracing on declining volume after a strong move',
    'Distribution — the volume on the pullback means sellers are in control',
    'Cannot tell — need to see more candles before making a judgment'
  ],
  correct:1,
  feedback:'Healthy pullback. The price retraced only partially from the move and — crucially — the volume dried up on the down candles. When volume contracts on a pullback, sellers are not aggressive. This is the setup to buy the dip.'
},

{
  id:'q18', type:'mc',
  title:'Three Pushes Up — What Comes Next?',
  instruction:'Three distinct pushes higher, each smaller than the last. What does this warn about?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:54,h:56,l:53,c:55,v:1800},
      {o:55,h:65,l:54,c:64,v:4400},
      {o:64,h:66,l:60,c:61,v:2100},
      {o:61,h:63,l:60,c:62,v:1900},
      {o:62,h:70,l:61,c:69,v:3300},
      {o:69,h:71,l:65,c:66,v:1800},
      {o:66,h:68,l:65,c:67,v:1700},
      {o:67,h:73,l:66,c:72,v:2400},
      {o:72,h:74,l:63,c:64,v:5000},
    ];
    const minP=50, maxP=79;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const lp=cLeft(W), slot=cSlot(W,candles.length);
    ctx.strokeStyle='rgba(0,210,122,0.5)'; ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(lp+1*slot+slot/2, priceToY(64,minP,maxP,H));
    ctx.lineTo(lp+4*slot+slot/2, priceToY(69,minP,maxP,H));
    ctx.lineTo(lp+7*slot+slot/2, priceToY(72,minP,maxP,H));
    ctx.stroke();
    ctx.fillStyle='rgba(200,200,200,0.6)'; ctx.font='8px sans-serif';
    ctx.fillText('+10',lp+1*slot+4, priceToY(60,minP,maxP,H));
    ctx.fillText('+7',lp+4*slot+4, priceToY(65,minP,maxP,H));
    ctx.fillText('+5',lp+7*slot+4, priceToY(68,minP,maxP,H));
    drawLabel(ctx,'Three Pushes Up',W,H);
  },
  choices:[
    'Continuation — three pushes confirms a strong trend, add to your position',
    'Exhaustion — diminishing momentum on each push signals a likely reversal',
    'Neutral — three pushes is the normal number of waves in any trend',
    'Buy signal — the fourth push will be the strongest of the sequence'
  ],
  correct:1,
  feedback:'Three pushes up with diminishing size is a classic exhaustion signal. Each push gained less ground and on lower volume. Buyers are running out of conviction. The last candle here shows the reversal. This is a signal to stop buying and prepare to exit or fade.'
},

{
  id:'q19', type:'mc',
  title:'Stop Loss Hunt — What Happened?',
  instruction:'Price briefly broke below a key level then immediately reversed. What happened?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:72,h:75,l:71,c:74,v:1900},
      {o:74,h:76,l:73,c:75,v:2100},
      {o:75,h:77,l:74,c:76,v:2200},
      // hunt: spike below support then recover
      {o:76,h:77,l:67,c:75,v:6800},
      {o:75,h:79,l:74,c:78,v:3400},
      {o:78,h:82,l:77,c:81,v:3000},
      {o:81,h:84,l:80,c:83,v:2600},
    ];
    const minP=63, maxP=89;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(72,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1.2; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(cLeft(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.7)'; ctx.font='9px sans-serif';
    ctx.fillText('SUPPORT',cLeft(W)+4,suppY-4);
    ctx.fillStyle='rgba(251,191,36,0.8)';
    ctx.fillText('↓ SPIKE',cLeft(W)+3*cSlot(W,candles.length)+4, priceToY(68,minP,maxP,H));
    drawLabel(ctx,'Below Support Then Reversal',W,H);
  },
  choices:[
    'Real breakdown — the support level has failed and should be shorted',
    'Random volatility — no meaningful signal here',
    'Stop loss hunt — algorithms ran price through retail stops then reversed',
    'Accumulation — institutions were buying the dip below support'
  ],
  correct:2,
  feedback:'Stop loss hunt. Retail stops were clustered just below $72 support. Algorithms pushed price through those stops, triggered the forced selling, absorbed the shares at low prices, then reversed immediately. The long lower wick with an immediate full recovery is the tell.'
},

{
  id:'q20', type:'mc',
  title:'V-Shape — Buy or Wait?',
  instruction:'A stock crashed 25% and is recovering sharply. Do you buy the V recovery?',
  draw: function(ctx,W,H) {
    drawGrid(ctx,W,H);
    const candles = [
      {o:80,h:82,l:79,c:81,v:1800},
      {o:81,h:83,l:80,c:82,v:2000},
      {o:82,h:84,l:70,c:72,v:8200},
      {o:72,h:73,l:61,c:63,v:9600},
      {o:63,h:65,l:60,c:64,v:7400},
      {o:64,h:72,l:63,c:71,v:5800},
      {o:71,h:79,l:70,c:78,v:4900},
      {o:78,h:84,l:77,c:83,v:4000},
    ];
    const minP=56, maxP=89;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx,'V-Shape Recovery',W,H);
  },
  choices:[
    'Yes — buy aggressively on the way up, the bottom is clearly in',
    'Yes — V-shapes always continue, this is a low-risk entry',
    'Wait — many V-shapes become W-shapes, let it base first then buy the breakout',
    'Short it — V-shape recoveries always fail and make new lows'
  ],
  correct:2,
  feedback:'Wait for the base. Many apparent V-recoveries form a W — the stock recovers, stalls, retests the lows, and shakes out all the V-buyers before the real move higher. The right entry is when the recovery stalls, forms a tight consolidation, and breaks out of that base on volume. You miss the very bottom — that is the cost of avoiding the W trap.'
}

]; // end QUIZ_QUESTIONS

// ── HELPERS ──────────────────────────────────────────────────────────────

function cLeft(W){ return 44; }
function cRight(W){ return 12; }
function cTop(H){ return 20; }
function cBot(H){ return 44; }
function cW(W){ return W-cLeft(W)-cRight(W); }
function cH(H){ return H-cTop(H)-cBot(H); }
function cSlot(W,n){ return cW(W)/n; }

function priceToY(p,minP,maxP,H){
  return cTop(H) + ((maxP-p)/(maxP-minP))*cH(H);
}

function drawGrid(ctx,W,H){
  ctx.fillStyle='#111712'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#1a231a'; ctx.lineWidth=0.5;
  for(let i=0;i<=5;i++){
    const y=cTop(H)+(cH(H)/5)*i;
    ctx.beginPath(); ctx.moveTo(cLeft(W),y); ctx.lineTo(W-cRight(W),y); ctx.stroke();
  }
  for(let i=0;i<=4;i++){
    const x=cLeft(W)+(cW(W)/4)*i;
    ctx.beginPath(); ctx.moveTo(x,cTop(H)); ctx.lineTo(x,H-cBot(H)); ctx.stroke();
  }
}

function drawCandles(ctx,candles,minP,maxP,W,H){
  const n=candles.length;
  const slot=cSlot(W,n);
  const maxVol=Math.max(...candles.map(c=>c.v||0));

  candles.forEach((c,i)=>{
    const x=cLeft(W)+i*slot+slot*0.12;
    const cw=slot*0.76;
    const isGreen=c.c>=c.o;
    const color=isGreen?'#22c55e':'#ef4444';

    // Volume bar
    const volH=maxVol>0?(c.v/maxVol)*36:0;
    ctx.fillStyle=isGreen?'rgba(34,197,94,0.25)':'rgba(239,68,68,0.25)';
    ctx.fillRect(x, H-cBot(H)-volH+6, cw, volH);

    // Wick
    ctx.strokeStyle=color; ctx.lineWidth=1.2;
    ctx.beginPath();
    ctx.moveTo(x+cw/2, priceToY(c.h,minP,maxP,H));
    ctx.lineTo(x+cw/2, priceToY(c.l,minP,maxP,H));
    ctx.stroke();

    // Body
    const bodyTop=priceToY(Math.max(c.o,c.c),minP,maxP,H);
    const bodyBot=priceToY(Math.min(c.o,c.c),minP,maxP,H);
    const bodyH=Math.max(bodyBot-bodyTop,1.5);
    ctx.fillStyle=color;
    ctx.fillRect(x,bodyTop,cw,bodyH);
  });

  // Price axis
  ctx.fillStyle='#4a6a4a'; ctx.font='9px monospace'; ctx.textAlign='right';
  for(let i=0;i<=5;i++){
    const p=minP+((maxP-minP)/5)*(5-i);
    const y=cTop(H)+(cH(H)/5)*i;
    ctx.fillText('$'+p.toFixed(0), cLeft(W)-3, y+3);
  }
  ctx.textAlign='left';
}

function drawLabel(ctx,text,W,H){
  ctx.fillStyle='rgba(200,212,200,0.75)'; ctx.font='bold 11px sans-serif'; ctx.textAlign='center';
  ctx.fillText(text, W/2, 14);
  ctx.textAlign='left';
}

// ── QUIZ ENGINE ──────────────────────────────────────────────────────────

window.TST_INTERACTIVE_QUIZ = {
  current: 0,
  score: 0,
  answered: [],

  render: function(container) {
    if (typeof container === 'string') container = document.getElementById(container);
    if (!container) return;
    container.innerHTML = `
      <div style="background:#111712;border-radius:12px;padding:20px;max-width:680px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <div style="font-family:Rajdhani,sans-serif;font-size:18px;font-weight:700;color:#f0f4f1;" id="quiz-q-title"></div>
          <div style="font-size:12px;color:#6b7c6e;" id="quiz-progress"></div>
        </div>
        <div style="font-size:13px;color:#8aad8a;margin-bottom:10px;" id="quiz-instruction"></div>
        <canvas id="quiz-canvas" style="width:100%;border-radius:8px;display:block;"></canvas>
        <div id="quiz-choices" style="margin-top:10px;"></div>
        <div id="quiz-feedback" style="margin-top:10px;display:none;background:#0c100d;border-radius:8px;padding:14px;font-size:13px;color:#c8d4c8;line-height:1.7;border-left:3px solid #4ab44a;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
          <div style="font-size:13px;color:#6b7c6e;" id="quiz-score-display"></div>
          <button id="quiz-next-btn" onclick="TST_INTERACTIVE_QUIZ.next()" style="display:none;background:#22c55e;color:#000;border:none;border-radius:8px;padding:9px 22px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">Next →</button>
        </div>
      </div>`;
    this.canvas = document.getElementById('quiz-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.loadQuestion();
  },

  loadQuestion: function() {
    const q = QUIZ_QUESTIONS[this.current];
    document.getElementById('quiz-q-title').textContent = q.title;
    document.getElementById('quiz-instruction').textContent = q.instruction;
    document.getElementById('quiz-progress').textContent = `${this.current+1} / ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-next-btn').style.display = 'none';
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.current}`;

    const W = this.canvas.offsetWidth || 620;
    const H = Math.round(W * 0.52);
    this.canvas.width = W;
    this.canvas.height = H;
    this.canvas.style.cursor = q.type === 'zone' ? 'crosshair' : 'default';

    q.draw(this.ctx, W, H);

    if (q.type === 'zone') {
      this.canvas.onclick = (e) => this.handleZoneClick(e, q);
      document.getElementById('quiz-choices').innerHTML =
        '<div style="font-size:12px;color:#4a6a4a;text-align:center;padding:8px;">👆 Click on the chart where you would enter</div>';
    } else {
      this.canvas.onclick = null;
      this.renderChoices(q);
    }
  },

  handleZoneClick: function(e, q) {
    if (this.answered[this.current]) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
    const pct = clickX / this.canvas.width;
    const W = this.canvas.width, H = this.canvas.height;

    let result = 'late';
    if (pct >= q.zones.early[0] && pct <= q.zones.early[1]) result = 'early';
    else if (pct >= q.zones.ideal[0] && pct <= q.zones.ideal[1]) result = 'ideal';

    this.answered[this.current] = true;
    if (result === 'ideal') this.score++;

    // Draw click marker only — no zone labels
    const ctx = this.ctx;
    const isRight = result === 'ideal';
    ctx.strokeStyle = isRight ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(clickX, clickY, 10, 0, Math.PI*2); ctx.stroke();
    // Vertical line
    ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(clickX, cTop(H)); ctx.lineTo(clickX, H-cBot(H)); ctx.stroke();
    ctx.setLineDash([]);
    // Show entry zone in subtle colors AFTER click
    const iz = q.zones.ideal;
    ctx.fillStyle = 'rgba(0,210,122,0.08)';
    ctx.fillRect(iz[0]*W, cTop(H), (iz[1]-iz[0])*W, cH(H));

    this.showFeedback(q.feedback[result], isRight);
  },

  renderChoices: function(q) {
    const div = document.getElementById('quiz-choices');
    div.innerHTML = q.choices.map((c,i) => `
      <div onclick="TST_INTERACTIVE_QUIZ.handleChoice(${i})" id="qc-${i}"
        style="background:#0c100d;border:1px solid #1e2820;border-radius:8px;padding:11px 15px;margin-bottom:7px;cursor:pointer;font-size:13px;color:#c8d4c8;line-height:1.5;">
        <span style="color:#4ab44a;font-weight:700;margin-right:8px;">${String.fromCharCode(65+i)}.</span>${c}
      </div>`).join('');
  },

  handleChoice: function(idx) {
    if (this.answered[this.current]) return;
    const q = QUIZ_QUESTIONS[this.current];
    this.answered[this.current] = true;
    const isRight = idx === q.correct;
    if (isRight) this.score++;

    q.choices.forEach((_,i) => {
      const el = document.getElementById('qc-'+i);
      if (!el) return;
      el.style.cursor = 'default';
      if (i === q.correct) { el.style.borderColor='#22c55e'; el.style.background='rgba(34,197,94,0.07)'; }
      else if (i === idx && !isRight) { el.style.borderColor='#ef4444'; el.style.background='rgba(239,68,68,0.07)'; }
    });

    this.showFeedback(q.feedback, isRight);
  },

  showFeedback: function(text, correct) {
    const fb = document.getElementById('quiz-feedback');
    fb.style.borderLeftColor = correct ? '#22c55e' : '#ef4444';
    fb.textContent = text;
    fb.style.display = 'block';
    document.getElementById('quiz-next-btn').style.display = 'block';
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.current+1}`;
  },

  next: function() {
    this.current++;
    if (this.current >= QUIZ_QUESTIONS.length) { this.showResults(); return; }
    this.loadQuestion();
  },

  showResults: function() {
    const pct = Math.round((this.score / QUIZ_QUESTIONS.length) * 100);
    const passed = pct >= 75;
    const wrap = document.getElementById('quiz-canvas').closest('div');
    if (!wrap) return;
    wrap.innerHTML = `
      <div style="text-align:center;padding:40px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">${passed?'🎯':'📚'}</div>
        <div style="font-family:Rajdhani,sans-serif;font-size:36px;font-weight:700;color:${passed?'#22c55e':'#fbbf24'};margin-bottom:8px;">${pct}%</div>
        <div style="font-size:15px;color:#f0f4f1;margin-bottom:6px;">${this.score} of ${QUIZ_QUESTIONS.length} correct</div>
        <div style="font-size:13px;color:#6b7c6e;margin-bottom:28px;line-height:1.7;max-width:400px;margin-left:auto;margin-right:auto;">
          ${passed ? 'Strong pattern recognition across all setup types.' : 'Review the lessons for any patterns you missed, then retake.'}
        </div>
        <button onclick="TST_INTERACTIVE_QUIZ.restart()" style="background:#22c55e;color:#000;border:none;border-radius:8px;padding:12px 28px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:15px;cursor:pointer;">Retake Quiz</button>
      </div>`;
    if (window.TST_QUIZ && typeof TST_QUIZ.saveResult === 'function') {
      TST_QUIZ.saveResult('interactive-quiz', pct, passed);
    }
  },

  restart: function() {
    this.current = 0; this.score = 0; this.answered = [];
    const c = document.getElementById('interactiveQuizContainer');
    if (c) this.render(c);
  }
};
