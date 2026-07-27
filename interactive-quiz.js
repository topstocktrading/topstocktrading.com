// TST Interactive Quiz — 20 questions with real canvas chart rendering
// 10 zone-click questions + 10 multiple choice questions

const QUIZ_QUESTIONS = [

// ── ZONE-CLICK QUESTIONS (1-10) ──────────────────────────────────────────

{
  id: 'q1', type: 'zone',
  title: 'Bull Flag Breakout',
  instruction: 'Click the ideal entry point for this bull flag breakout.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    // Flagpole — strong green candles
    const pole = [
      {o:142,h:148,l:140,c:147,v:3200},
      {o:147,h:155,l:146,c:154,v:3800},
      {o:154,h:163,l:153,c:162,v:4200},
      {o:162,h:172,l:161,c:171,v:3900},
    ];
    // Flag — tight consolidation, slightly down
    const flag = [
      {o:171,h:173,l:169,c:170,v:1100},
      {o:170,h:172,l:168,c:169,v:900},
      {o:169,h:171,l:167,c:170,v:850},
      {o:170,h:172,l:168,c:169,v:820},
      {o:169,h:171,l:167,c:168,v:800},
    ];
    // Breakout
    const breakout = [
      {o:168,h:178,l:167,c:177,v:4100},
      {o:177,h:183,l:176,c:182,v:3600},
    ];
    const all = [...pole,...flag,...breakout];
    const prices = all.flatMap(c=>[c.h,c.l]);
    const minP=Math.min(...prices)-4, maxP=Math.max(...prices)+4;
    const candles = [...pole,...flag,...breakout];
    drawCandles(ctx,candles,minP,maxP,W,H);
    // Flag resistance line
    const flagHigh = 173;
    const y = priceToY(flagHigh,minP,maxP,H);
    ctx.strokeStyle='rgba(251,191,36,0.6)'; ctx.lineWidth=1.5; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W)+(pole.length)*candleSlot(W,candles.length), y);
    ctx.lineTo(W-10, y); ctx.stroke(); ctx.setLineDash([]);
    // Zone markers
    drawZoneLabel(ctx, W, H, 'TOO EARLY', 0.52, 0.62);
    drawZoneLabel(ctx, W, H, 'IDEAL ENTRY', 0.62, 0.72);
    drawZoneLabel(ctx, W, H, 'TOO LATE', 0.72, 0.85);
    drawLabel(ctx, 'Bull Flag', W, H);
  },
  zones: { early: [0.52,0.62], ideal: [0.62,0.75], late: [0.75,0.88] },
  feedback: { early:'Too early — the flag hasn\'t broken out yet. Wait for price to close above the flag high on volume.', ideal:'Perfect entry! Price has broken above the flag resistance on a strong volume candle — classic bull flag breakout.', late:'Too late — you\'re chasing. The best risk/reward was at the breakout candle, not several candles later.' }
},

{
  id: 'q2', type: 'zone',
  title: 'Opening Range Breakout',
  instruction: 'Click the ideal entry for this Opening Range Breakout (ORB).',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:185,h:188,l:183,c:186,v:2800},
      {o:186,h:189,l:184,c:185,v:2600},
      {o:185,h:188,l:183,c:187,v:2400},
      {o:187,h:189,l:184,c:186,v:2200},
      {o:186,h:190,l:185,c:188,v:2300},
      {o:188,h:190,l:186,c:187,v:2100},
      {o:187,h:196,l:186,c:195,v:5200},
      {o:195,h:200,l:194,c:199,v:4800},
      {o:199,h:203,l:197,c:202,v:4100},
    ];
    const minP=181, maxP=206;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // ORB lines
    ctx.strokeStyle='rgba(0,210,122,0.7)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    const yHigh = priceToY(190,minP,maxP,H);
    ctx.beginPath(); ctx.moveTo(leftPad(W),yHigh); ctx.lineTo(W-10,yHigh); ctx.stroke();
    ctx.strokeStyle='rgba(239,68,68,0.5)';
    const yLow = priceToY(183,minP,maxP,H);
    ctx.beginPath(); ctx.moveTo(leftPad(W),yLow); ctx.lineTo(W-10,yLow); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('ORB HIGH: $190',leftPad(W)+4, yHigh-4);
    ctx.fillStyle='rgba(239,68,68,0.8)';
    ctx.fillText('ORB LOW: $183',leftPad(W)+4, yLow+12);
    drawZoneLabel(ctx, W, H, 'SETTING UP', 0.08, 0.48);
    drawZoneLabel(ctx, W, H, 'IDEAL', 0.56, 0.68);
    drawZoneLabel(ctx, W, H, 'TOO LATE', 0.72, 0.88);
    drawLabel(ctx, 'Opening Range Breakout (ORB)', W, H);
  },
  zones: { early: [0.08,0.52], ideal: [0.56,0.70], late: [0.70,0.88] },
  feedback: { early:'That\'s still inside the opening range — no breakout signal yet. Wait for price to break and close above ORB high on volume.', ideal:'Correct! Entry on the breakout candle above the ORB high with volume expansion — textbook ORB entry.', late:'Too late. You want to enter on the breakout candle itself, not two candles after.' }
},

{
  id: 'q3', type: 'zone',
  title: 'Consolidation Retest',
  instruction: 'A breakout happened, then a pullback to prior resistance now acting as support. Click the ideal entry.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:62,h:65,l:61,c:64,v:1800},
      {o:64,h:66,l:63,c:65,v:1900},
      {o:65,h:68,l:64,c:67,v:2200},
      {o:67,h:70,l:66,c:70,v:3100},
      {o:70,h:76,l:69,c:75,v:4800},
      {o:75,h:78,l:73,c:74,v:2800},
      {o:74,h:76,l:70,c:71,v:2200},
      {o:71,h:72,l:69,c:70,v:1900},
      {o:70,h:71,l:69,c:70,v:1700},
      {o:70,h:74,l:69,c:73,v:2600},
      {o:73,h:78,l:72,c:77,v:3400},
    ];
    const minP=59, maxP=81;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const yRes = priceToY(70,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.7)'; ctx.lineWidth=1.5; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),yRes); ctx.lineTo(W-10,yRes); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('Support (old resistance)',leftPad(W)+4, yRes-4);
    drawZoneLabel(ctx, W, H, 'BREAKOUT', 0.3, 0.42);
    drawZoneLabel(ctx, W, H, 'PULLBACK', 0.44, 0.62);
    drawZoneLabel(ctx, W, H, 'IDEAL RETEST', 0.62, 0.74);
    drawZoneLabel(ctx, W, H, 'LATE', 0.76, 0.88);
    drawLabel(ctx, 'Consolidation Retest', W, H);
  },
  zones: { early: [0.3,0.58], ideal: [0.62,0.76], late: [0.76,0.90] },
  feedback: { early:'Not the retest entry — the stock just broke out or is still pulling back. Wait for the touch of the prior resistance level.', ideal:'Excellent! You bought the retest of prior resistance now acting as support — this is the ideal risk/reward entry with a tight stop below the level.', late:'The retest already happened and price has moved away. Entry here gives you poor risk/reward.' }
},

{
  id: 'q4', type: 'zone',
  title: 'Bear Flag Breakdown',
  instruction: 'Click the ideal short entry on this bear flag.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const pole = [
      {o:95,h:96,l:88,c:89,v:3800},
      {o:89,h:90,l:82,c:83,v:4200},
      {o:83,h:84,l:77,c:78,v:3900},
    ];
    const flag = [
      {o:78,h:81,l:77,c:80,v:1100},
      {o:80,h:82,l:79,c:81,v:900},
      {o:81,h:83,l:80,c:82,v:850},
      {o:82,h:84,l:81,c:83,v:800},
      {o:83,h:84,l:81,c:82,v:820},
    ];
    const breakdown = [
      {o:82,h:83,l:75,c:76,v:4600},
      {o:76,h:77,l:70,c:71,v:4100},
    ];
    const all=[...pole,...flag,...breakdown];
    const minP=68, maxP=99;
    drawCandles(ctx,all,minP,maxP,W,H);
    const flagLow=77;
    const y=priceToY(flagLow,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.7)'; ctx.lineWidth=1.5; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W)+pole.length*candleSlot(W,all.length),y);
    ctx.lineTo(W-10,y); ctx.stroke(); ctx.setLineDash([]);
    drawZoneLabel(ctx, W, H, 'POLE', 0.06, 0.24);
    drawZoneLabel(ctx, W, H, 'FLAG', 0.26, 0.56);
    drawZoneLabel(ctx, W, H, 'IDEAL SHORT', 0.58, 0.72);
    drawZoneLabel(ctx, W, H, 'LATE', 0.74, 0.88);
    drawLabel(ctx, 'Bear Flag Breakdown', W, H);
  },
  zones: { early: [0.06,0.54], ideal: [0.58,0.73], late: [0.73,0.90] },
  feedback: { early:'Too early — you\'re shorting into the flag consolidation, not the breakdown. Wait for price to break below the flag support on volume.', ideal:'Correct! Short entry on the breakdown below the flag support with volume confirmation — ideal bear flag short.', late:'Too late — you\'re chasing the move after most of the profit has already been made.' }
},

{
  id: 'q5', type: 'zone',
  title: 'Head & Shoulders Breakdown',
  instruction: 'Click the ideal entry for this Head & Shoulders breakdown.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const pts = [
      {p:60,v:1800},{p:75,v:2200},{p:63,v:1900},
      {p:85,v:3100},{p:64,v:2000},
      {p:76,v:2100},{p:61,v:4800},
      {p:55,v:3600},{p:50,v:3200},
    ];
    const candles = pts.map((pt,i) => {
      const next = pts[i+1];
      const o = i===0?58:pts[i-1].p;
      const c = pt.p;
      return {o,h:Math.max(o,c)+2,l:Math.min(o,c)-2,c,v:pt.v};
    });
    candles.pop();
    const minP=46, maxP=90;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const neckY=priceToY(62,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.8)'; ctx.lineWidth=2; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),neckY); ctx.lineTo(W-10,neckY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('NECKLINE',leftPad(W)+4,neckY-4);
    drawZoneLabel(ctx, W, H, 'LS', 0.06, 0.22);
    drawZoneLabel(ctx, W, H, 'HEAD', 0.24, 0.44);
    drawZoneLabel(ctx, W, H, 'RS', 0.46, 0.58);
    drawZoneLabel(ctx, W, H, 'IDEAL SHORT', 0.60, 0.76);
    drawZoneLabel(ctx, W, H, 'LATE', 0.78, 0.90);
    drawLabel(ctx, 'Head & Shoulders', W, H);
  },
  zones: { early: [0.06,0.56], ideal: [0.60,0.78], late: [0.78,0.92] },
  feedback: { early:'The Head & Shoulders pattern needs to complete first. Wait for price to break below the neckline.', ideal:'Perfect! Short entry on the neckline break — the H&S pattern is confirmed and the measured move is projected below.', late:'The breakdown has already moved significantly. Entry here is chasing with poor risk/reward.' }
},

{
  id: 'q6', type: 'zone',
  title: 'Support Bounce (3rd Test)',
  instruction: 'Price is testing support for the third time. Click the ideal long entry.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:72,h:78,l:71,c:77,v:2100},
      {o:77,h:80,l:70,c:71,v:3200},
      {o:71,h:73,l:70,c:72,v:2400},
      {o:72,h:77,l:71,c:76,v:2800},
      {o:76,h:80,l:75,c:79,v:2200},
      {o:79,h:82,l:78,c:80,v:1900},
      {o:80,h:83,l:70,c:71,v:3800},
      {o:71,h:73,l:70,c:72,v:2600},
      {o:72,h:76,l:70,c:75,v:2900},
      {o:75,h:82,l:74,c:81,v:3400},
      {o:81,h:85,l:80,c:84,v:2800},
    ];
    const minP=67, maxP=88;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(70,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.8)'; ctx.lineWidth=2; ctx.setLineDash([5,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('SUPPORT $70',leftPad(W)+4,suppY-4);
    const slot=candleSlot(W,candles.length);
    const lp=leftPad(W);
    ctx.fillStyle='rgba(0,210,122,0.5)'; ctx.font='8px sans-serif';
    ctx.fillText('1st test',lp+1*slot,suppY+14);
    ctx.fillText('2nd test',lp+6*slot,suppY+14);
    ctx.fillText('3rd test',lp+8*slot,suppY+14);
    drawZoneLabel(ctx, W, H, 'BOUNCE', 0.56, 0.68);
    drawZoneLabel(ctx, W, H, 'IDEAL', 0.68, 0.78);
    drawZoneLabel(ctx, W, H, 'LATE', 0.80, 0.90);
    drawLabel(ctx, 'Support Bounce — 3rd Test', W, H);
  },
  zones: { early: [0.06,0.62], ideal: [0.62,0.78], late: [0.78,0.92] },
  feedback: { early:'Wait for the support level to be tested and show a rejection. The reversal candle is your signal.', ideal:'Correct! Entry on the rejection candle at support — the hammer/wick shows buyers stepped in aggressively. Stop below $70.', late:'The bounce has already moved away from support. Entry here gives you poor risk/reward versus waiting for the next test.' }
},

{
  id: 'q7', type: 'zone',
  title: 'Doji Top Reversal',
  instruction: 'A doji forms after an extended run. Click where you would enter the short.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:55,h:58,l:54,c:57,v:1800},
      {o:57,h:61,l:56,c:60,v:2200},
      {o:60,h:65,l:59,c:64,v:2800},
      {o:64,h:69,l:63,c:68,v:3200},
      {o:68,h:73,l:67,c:72,v:3600},
      {o:72,h:77,l:71,c:76,v:3200},
      {o:76,h:79,l:72,c:73,v:4100}, // doji at top
      {o:73,h:74,l:68,c:69,v:3800},
      {o:69,h:70,l:64,c:65,v:3200},
      {o:65,h:66,l:60,c:61,v:2800},
    ];
    const minP=51, maxP=83;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const slot=candleSlot(W,candles.length);
    const lp=leftPad(W);
    ctx.strokeStyle='rgba(251,191,36,0.8)'; ctx.lineWidth=2;
    const dojiX=lp+6*slot+slot/2;
    const dojiY=priceToY(76,minP,maxP,H);
    ctx.beginPath(); ctx.arc(dojiX,dojiY,12,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(251,191,36,0.9)'; ctx.font='9px sans-serif';
    ctx.fillText('DOJI',dojiX-12,dojiY-16);
    drawZoneLabel(ctx, W, H, 'RUN UP', 0.06, 0.52);
    drawZoneLabel(ctx, W, H, 'DOJI', 0.52, 0.62);
    drawZoneLabel(ctx, W, H, 'IDEAL SHORT', 0.62, 0.74);
    drawZoneLabel(ctx, W, H, 'LATE', 0.76, 0.88);
    drawLabel(ctx, 'Doji Top Reversal', W, H);
  },
  zones: { early: [0.06,0.56], ideal: [0.62,0.76], late: [0.76,0.90] },
  feedback: { early:'Don\'t short into the run — wait for the doji to confirm and then for price to begin breaking down.', ideal:'Correct! Short entry after the doji is confirmed and price begins moving below it. The doji showed indecision and exhaustion at the top.', late:'The reversal move is already underway. Entry here gives up too much profit.' }
},

{
  id: 'q8', type: 'zone',
  title: 'Hammer Reversal',
  instruction: 'A hammer candle forms at support after a downtrend. Click the ideal long entry.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:88,h:90,l:84,c:85,v:2200},
      {o:85,h:86,l:80,c:81,v:2600},
      {o:81,h:82,l:76,c:77,v:2900},
      {o:77,h:78,l:72,c:73,v:3200},
      {o:73,h:74,l:65,c:72,v:4800}, // hammer
      {o:72,h:78,l:71,c:77,v:3600},
      {o:77,h:83,l:76,c:82,v:3200},
      {o:82,h:87,l:81,c:86,v:2800},
    ];
    const minP=62, maxP=93;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const suppY=priceToY(72,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),suppY); ctx.lineTo(W-10,suppY); ctx.stroke();
    ctx.setLineDash([]);
    const slot=candleSlot(W,candles.length);
    const lp=leftPad(W);
    ctx.strokeStyle='rgba(251,191,36,0.9)'; ctx.lineWidth=2;
    const hamX=lp+4*slot+slot/2;
    const hamY=priceToY(72,minP,maxP,H);
    ctx.beginPath(); ctx.arc(hamX,hamY+8,14,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(251,191,36,0.9)'; ctx.font='9px sans-serif';
    ctx.fillText('HAMMER',hamX-20,hamY+30);
    drawZoneLabel(ctx, W, H, 'DOWNTREND', 0.06, 0.42);
    drawZoneLabel(ctx, W, H, 'HAMMER', 0.42, 0.52);
    drawZoneLabel(ctx, W, H, 'IDEAL', 0.52, 0.64);
    drawZoneLabel(ctx, W, H, 'LATE', 0.68, 0.82);
    drawLabel(ctx, 'Hammer Reversal', W, H);
  },
  zones: { early: [0.06,0.48], ideal: [0.52,0.66], late: [0.66,0.84] },
  feedback: { early:'Don\'t buy before the hammer is complete or confirmed. The hammer needs to form first, then you need the next candle to confirm.', ideal:'Correct! Entry on the confirmation candle after the hammer — the next green candle closing above the hammer high confirms buyers have taken control.', late:'The move away from the hammer is already significant. Better entry was available at the confirmation candle.' }
},

{
  id: 'q9', type: 'zone',
  title: 'Lower High Lower Low (Short Setup)',
  instruction: 'Price has established a downtrend with lower highs. Click the ideal short entry.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:80,h:85,l:79,c:84,v:2100},
      {o:84,h:88,l:76,c:77,v:3800},
      {o:77,h:82,l:76,c:81,v:2200},
      {o:81,h:83,l:77,c:78,v:2000},
      {o:78,h:80,l:70,c:71,v:3600},
      {o:71,h:77,l:70,c:76,v:2100},
      {o:76,h:78,l:72,c:73,v:1900},
      {o:73,h:75,l:64,c:65,v:4100},
      {o:65,h:70,l:64,c:69,v:2200},
    ];
    const minP=61, maxP=92;
    drawCandles(ctx,candles,minP,maxP,W,H);
    // Draw lower highs
    ctx.strokeStyle='rgba(239,68,68,0.6)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    const lp=leftPad(W); const slot=candleSlot(W,candles.length);
    ctx.beginPath();
    ctx.moveTo(lp+1*slot+slot/2, priceToY(88,minP,maxP,H));
    ctx.lineTo(lp+3*slot+slot/2, priceToY(83,minP,maxP,H));
    ctx.lineTo(lp+5*slot+slot/2, priceToY(77,minP,maxP,H));
    ctx.lineTo(lp+7*slot+slot/2, priceToY(70,minP,maxP,H));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='8px sans-serif';
    ctx.fillText('LH',lp+1*slot, priceToY(88,minP,maxP,H)-6);
    ctx.fillText('LH',lp+3*slot, priceToY(83,minP,maxP,H)-6);
    ctx.fillText('LH',lp+5*slot, priceToY(77,minP,maxP,H)-6);
    drawZoneLabel(ctx, W, H, 'DOWNTREND', 0.06, 0.48);
    drawZoneLabel(ctx, W, H, 'IDEAL SHORT', 0.50, 0.64);
    drawZoneLabel(ctx, W, H, 'LATE', 0.68, 0.82);
    drawLabel(ctx, 'LHLL Downtrend Short', W, H);
  },
  zones: { early: [0.06,0.46], ideal: [0.50,0.66], late: [0.66,0.84] },
  feedback: { early:'Wait for the next lower high to form — that\'s the short entry. You need confirmation that the bounce has peaked.', ideal:'Correct! Short entry at the lower high — price has bounced but failed to make a new high, confirming the downtrend is intact.', late:'You missed the optimal lower high entry. Wait for the next bounce to form a new lower high.' }
},

{
  id: 'q10', type: 'zone',
  title: 'Ascending Triangle Breakout',
  instruction: 'Click the ideal entry for this ascending triangle breakout.',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:68,h:72,l:67,c:71,v:1900},
      {o:71,h:76,l:70,c:72,v:3200},
      {o:72,h:74,l:68,c:69,v:2100},
      {o:69,h:73,l:68,c:72,v:2300},
      {o:72,h:76,l:71,c:73,v:2800},
      {o:73,h:76,l:72,c:74,v:2200},
      {o:74,h:76,l:73,c:75,v:2000},
      {o:75,h:76,l:74,c:75,v:1900},
      {o:75,h:83,l:74,c:82,v:5100},
      {o:82,h:87,l:81,c:86,v:4200},
    ];
    const minP=64, maxP=91;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const resY=priceToY(76,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.7)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),resY); ctx.lineTo(W-10,resY); ctx.stroke();
    ctx.strokeStyle='rgba(0,210,122,0.7)';
    const lp=leftPad(W); const slot=candleSlot(W,candles.length);
    ctx.beginPath();
    ctx.moveTo(lp,priceToY(67,minP,maxP,H));
    ctx.lineTo(lp+8*slot,priceToY(74,minP,maxP,H));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('FLAT RESISTANCE $76',lp+4,resY-5);
    ctx.fillStyle='rgba(0,210,122,0.8)';
    ctx.fillText('Rising lows',lp+4,priceToY(66,minP,maxP,H));
    drawZoneLabel(ctx, W, H, 'TRIANGLE', 0.06, 0.64);
    drawZoneLabel(ctx, W, H, 'IDEAL', 0.64, 0.76);
    drawZoneLabel(ctx, W, H, 'LATE', 0.78, 0.90);
    drawLabel(ctx, 'Ascending Triangle Breakout', W, H);
  },
  zones: { early: [0.06,0.60], ideal: [0.64,0.78], late: [0.78,0.92] },
  feedback: { early:'Still inside the triangle — wait for the breakout above flat resistance on strong volume.', ideal:'Perfect! Entry on the breakout above flat resistance with a volume spike — the ascending triangle is confirmed.', late:'The breakout has already moved significantly past the entry point. Wait for a pullback to the breakout level.' }
},

// ── MULTIPLE CHOICE QUESTIONS (11-20) ────────────────────────────────────

{
  id: 'q11', type: 'mc',
  title: 'Fake Breakout',
  instruction: 'What is happening in this chart?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:72,h:75,l:71,c:74,v:2100},
      {o:74,h:77,l:73,c:76,v:2400},
      {o:76,h:79,l:75,c:78,v:2800},
      {o:78,h:83,l:77,c:79,v:3200}, // spike above
      {o:79,h:80,l:72,c:73,v:4100}, // reversal
      {o:73,h:74,l:68,c:69,v:3600},
      {o:69,h:70,l:65,c:66,v:3100},
    ];
    const minP=62, maxP=87;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const resY=priceToY(79,minP,maxP,H);
    ctx.strokeStyle='rgba(239,68,68,0.8)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),resY); ctx.lineTo(W-10,resY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(239,68,68,0.9)'; ctx.font='9px sans-serif';
    ctx.fillText('RESISTANCE $79',leftPad(W)+4,resY-5);
    drawLabel(ctx, 'Identify This Pattern', W, H);
  },
  choices: [
    'A bull flag breakout — buy the momentum',
    'A fake breakout (bull trap) — price failed to hold above resistance',
    'An ascending triangle completing — strong buy signal',
    'Normal consolidation — price will try again'
  ],
  correct: 1,
  feedback: 'Correct! This is a fake breakout (bull trap). Price briefly broke above resistance but immediately reversed back below it on high volume. Buyers who entered on the breakout are now trapped. The short entry is when price closes back below the resistance level.'
},

{
  id: 'q12', type: 'mc',
  title: 'Green to Red Reversal',
  instruction: 'The stock opened above yesterday\'s close but is now reversing. What does this signal?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:58,h:64,l:57,c:63,v:2200,'label':'Yesterday'},
      {o:66,h:70,l:58,c:59,v:4800,'label':'Today'},
    ];
    const minP=54, maxP=74;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const prevCloseY=priceToY(63,minP,maxP,H);
    ctx.strokeStyle='rgba(0,210,122,0.8)'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.moveTo(leftPad(W),prevCloseY); ctx.lineTo(W-10,prevCloseY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.9)'; ctx.font='9px sans-serif';
    ctx.fillText('Yesterday close: $63',leftPad(W)+4,prevCloseY-5);
    ctx.fillStyle='rgba(239,68,68,0.9)';
    ctx.fillText('Today opened above ($66) → closed below ($59)',leftPad(W)+4,prevCloseY+15);
    drawLabel(ctx, 'Green to Red — What Now?', W, H);
  },
  choices: [
    'Bullish signal — the large wick shows buyers are supporting the stock',
    'Neutral — opening gaps fill regularly and this is expected',
    'Bearish signal — buyers failed to hold the open, sellers in control',
    'Buy signal — the stock is oversold after today\'s decline'
  ],
  correct: 2,
  feedback: 'Correct! Green to red is a bearish signal. The stock opened above the prior close (green territory) but sellers overwhelmed buyers and drove price below yesterday\'s close. Every buyer from the open is now underwater. This signals distribution and often leads to continued selling, especially if it occurs after a multi-day run.'
},

{
  id: 'q13', type: 'mc',
  title: 'The Kill Candle',
  instruction: 'What is this large red candle called and what does it signal?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:68,h:72,l:67,c:71,v:1800},
      {o:71,h:75,l:70,c:74,v:2100},
      {o:74,h:78,l:73,c:77,v:2400},
      {o:77,h:82,l:76,c:81,v:2800},
      {o:81,h:84,l:65,c:67,v:7200}, // kill candle
      {o:67,h:68,l:62,c:63,v:3600},
    ];
    const minP=59, maxP=88;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const slot=candleSlot(W,candles.length);
    const lp=leftPad(W);
    ctx.strokeStyle='rgba(239,68,68,0.9)'; ctx.lineWidth=2;
    const killX=lp+4*slot+slot/2;
    ctx.beginPath(); ctx.arc(killX,priceToY(75,minP,maxP,H),16,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='rgba(239,68,68,0.9)'; ctx.font='9px sans-serif';
    ctx.fillText('?',killX-2,priceToY(75,minP,maxP,H)+4);
    drawLabel(ctx, 'Name This Candle', W, H);
  },
  choices: [
    'Evening star — three-candle reversal pattern starting the decline',
    'Kill candle — large red reversal bar that destroys the prior trend on heavy volume',
    'Bearish harami — small candle inside a large prior candle',
    'Shooting star — long upper wick showing rejection'
  ],
  correct: 1,
  feedback: 'Correct! This is a kill candle — a large, high-volume red candle that reverses a significant portion of the prior move. It signals that sellers have taken aggressive control and the trend has likely changed. The high volume is key: it shows institutional selling, not retail noise. After a kill candle, assume the prior uptrend is over until proven otherwise.'
},

{
  id: 'q14', type: 'mc',
  title: 'Weak Second Leg',
  instruction: 'The second leg of this rally is smaller than the first. What does this warn about?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:60,h:62,l:59,c:61,v:1800},
      {o:61,h:65,l:60,c:64,v:3200},
      {o:64,h:70,l:63,c:69,v:4100},
      {o:69,h:72,l:67,c:68,v:2800},
      {o:68,h:70,l:64,c:65,v:2200},
      {o:65,h:67,l:64,c:66,v:1900},
      {o:66,h:69,l:65,c:68,v:2100},
      {o:68,h:71,l:67,c:70,v:1800}, // weak 2nd leg peak
      {o:70,h:71,l:65,c:66,v:3200},
    ];
    const minP=56, maxP=76;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const lp=leftPad(W); const slot=candleSlot(W,candles.length);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(lp+1*slot,priceToY(61,minP,maxP,H));
    ctx.lineTo(lp+2*slot+slot/2,priceToY(69,minP,maxP,H));
    ctx.stroke();
    ctx.strokeStyle='rgba(239,68,68,0.6)';
    ctx.beginPath();
    ctx.moveTo(lp+5*slot,priceToY(65,minP,maxP,H));
    ctx.lineTo(lp+7*slot+slot/2,priceToY(70,minP,maxP,H));
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='8px sans-serif';
    ctx.fillText('+9pts',lp+1*slot+6,priceToY(65,minP,maxP,H));
    ctx.fillStyle='rgba(239,68,68,0.8)';
    ctx.fillText('+5pts',lp+5*slot+6,priceToY(67,minP,maxP,H));
    drawLabel(ctx, 'Weak Second Leg Warning', W, H);
  },
  choices: [
    'The stock needs rest before continuing higher — a normal consolidation',
    'A buying opportunity — dips should be bought aggressively',
    'Momentum is deteriorating — buyers are losing conviction, reversal likely',
    'Volume patterns suggest institutional accumulation — bullish'
  ],
  correct: 2,
  feedback: 'Correct! A weak second leg — where the second push to new highs is smaller than the first — signals deteriorating momentum. Buyers are becoming less aggressive. The second leg took more time to go less distance on lower volume. This is a warning that the trend is exhausting. It does not mean sell immediately, but it means tighten your stop, reduce size, and prepare for a reversal.'
},

{
  id: 'q15', type: 'mc',
  title: 'Parabolic Exhaustion',
  instruction: 'A stock has gone parabolic. What should you do?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:50,h:52,l:49,c:51,v:1600},
      {o:51,h:54,l:50,c:53,v:1900},
      {o:53,h:57,l:52,c:56,v:2400},
      {o:56,h:62,l:55,c:61,v:3200},
      {o:61,h:70,l:60,c:69,v:4800},
      {o:69,h:82,l:68,c:81,v:7200},
      {o:81,h:98,l:80,c:97,v:11000},
      {o:97,h:101,l:74,c:76,v:9800},
    ];
    const minP=46, maxP=105;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx, 'Parabolic Move — What Now?', W, H);
  },
  choices: [
    'Buy aggressively — the momentum is undeniable and will continue',
    'Add to your position — parabolic stocks always go higher before they stop',
    'Never buy into a parabola — if already long, scale out as it accelerates',
    'Use a wide stop to hold through the volatility'
  ],
  correct: 2,
  feedback: 'Correct! Parabolic moves always end badly for the last buyers. When a stock goes vertical, it is the final phase driven by FOMO. The last candle in this example shows exactly what happens: a massive run up followed by a collapse in the same session. If you are already long, scale out as the move accelerates — you do not need to sell at the top. Never buy into a parabola.'
},

{
  id: 'q16', type: 'mc',
  title: 'V-Shape Recovery Risk',
  instruction: 'A stock crashed and is sharply recovering in a V-shape. What is the primary risk of buying this?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:80,h:82,l:79,c:81,v:1800},
      {o:81,h:83,l:80,c:82,v:2100},
      {o:82,h:84,l:70,c:72,v:7800},
      {o:72,h:74,l:62,c:64,v:9200},
      {o:64,h:66,l:60,c:65,v:6800},
      {o:65,h:72,l:64,c:71,v:5200},
      {o:71,h:79,l:70,c:78,v:4800},
      {o:78,h:83,l:77,c:82,v:3600},
    ];
    const minP=57, maxP=87;
    drawCandles(ctx,candles,minP,maxP,W,H);
    drawLabel(ctx, 'V-Shape Recovery', W, H);
  },
  choices: [
    'None — V-shape recoveries are the safest pattern to buy',
    'The recovery may form a W (double bottom) before truly reversing, trapping buyers',
    'Volume is too high — high volume reversals always fail',
    'The stock is now overbought and will definitely retrace'
  ],
  correct: 1,
  feedback: 'Correct! The primary risk of buying a V-shape is that it becomes a W. Many apparent V-recoveries stall, pull back to test the lows, and shake out buyers before the real recovery begins. The safest approach is to wait for the recovery to stall, form a base, and break out of that base on volume — rather than buying on the way up into the V.'
},

{
  id: 'q17', type: 'mc',
  title: 'Accumulation vs Distribution',
  instruction: 'Which of these volume patterns signals accumulation (institutional buying)?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    // Two scenarios side by side
    const half = W/2 - 10;
    const leftCandles = [
      {o:70,h:72,l:68,c:69,v:5800},
      {o:69,h:71,l:68,c:69,v:4900},
      {o:69,h:72,l:68,c:70,v:5200},
      {o:70,h:73,l:69,c:72,v:6100},
    ];
    const rightCandles = [
      {o:70,h:75,l:69,c:74,v:4200},
      {o:74,h:79,l:73,c:78,v:3800},
      {o:78,h:82,l:77,c:80,v:3100},
      {o:80,h:83,l:79,c:81,v:2400},
    ];
    const minP=65, maxP=87;
    ctx.save();
    drawGridHalf(ctx, 0, W, H);
    drawCandlesHalf(ctx, leftCandles, minP, maxP, 0, W, H);
    ctx.fillStyle='rgba(100,160,100,0.8)'; ctx.font='10px sans-serif'; ctx.textAlign='center';
    ctx.fillText('A: Tight range, high volume',W/4,H-8);
    drawGridHalf(ctx, W/2, W, H);
    drawCandlesHalf(ctx, rightCandles, minP, maxP, W/2, W, H);
    ctx.fillStyle='rgba(100,160,100,0.8)'; ctx.font='10px sans-serif';
    ctx.fillText('B: Rising price, falling volume',W*3/4,H-8);
    ctx.restore();
    drawLabel(ctx, 'Which is Accumulation?', W, H);
  },
  choices: [
    'Chart B — rising price with declining volume shows buyers in control',
    'Chart A — tight price range with high volume signals institutions absorbing supply',
    'Neither — both show distribution patterns',
    'Both charts show the same thing — volume does not matter'
  ],
  correct: 1,
  feedback: 'Correct! Chart A shows accumulation. When price consolidates in a tight range on above-average volume, it signals that large buyers are absorbing all the available supply (selling) without letting price fall. They are "accumulating" quietly. Chart B (rising price, falling volume) actually suggests the opposite — weakening buying pressure, which is often a warning sign the move may stall.'
},

{
  id: 'q18', type: 'mc',
  title: 'Morning Flush Setup',
  instruction: 'A stock with a strong catalyst flushes in the first 15 minutes. What does the morning flush set up?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:48,h:56,l:47,c:50,v:4800},
      {o:50,h:51,l:43,c:44,v:7200},
      {o:44,h:45,l:40,c:41,v:8100},
      {o:41,h:42,l:39,c:41,v:5200},
      {o:41,h:46,l:40,c:45,v:6100},
      {o:45,h:51,l:44,c:50,v:5400},
      {o:50,h:55,l:49,c:54,v:4200},
      {o:54,h:58,l:53,c:57,v:3600},
    ];
    const minP=36, maxP=60;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const lp=leftPad(W); const slot=candleSlot(W,candles.length);
    ctx.fillStyle='rgba(239,68,68,0.5)'; ctx.font='8px sans-serif'; ctx.textAlign='center';
    ctx.fillText('FLUSH',lp+1*slot+slot,priceToY(41,minP,maxP,H)+12);
    ctx.fillStyle='rgba(0,210,122,0.5)';
    ctx.fillText('RECOVERY',lp+5*slot+slot,priceToY(48,minP,maxP,H));
    drawLabel(ctx, 'Morning Flush Recovery', W, H);
  },
  choices: [
    'Nothing — morning flushes always lead to continued selling all day',
    'A long opportunity when price reclaims a key level after the flush',
    'A short opportunity — flush stocks always set lower highs',
    'A gap fill trade back to the previous close'
  ],
  correct: 1,
  feedback: 'Correct! The morning flush sets up a long opportunity when price reclaims a key level (VWAP, opening range low, or prior support) on volume after the flush is complete. The flush forces out weak holders through stop losses and panic selling. Once that selling is exhausted, only buyers remain — and the reversal can be powerful. The key: wait for the reclaim candle, don\'t try to catch the bottom.'
},

{
  id: 'q19', type: 'mc',
  title: 'Healthy Pullback vs Breakdown',
  instruction: 'Which chart shows a healthy pullback (buying opportunity) vs a breakdown (avoid)?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const leftCandles = [
      {o:60,h:65,l:59,c:64,v:3200},
      {o:64,h:70,l:63,c:69,v:4100},
      {o:69,h:72,l:65,c:66,v:2100},
      {o:66,h:68,l:63,c:64,v:1800},
      {o:64,h:66,l:63,c:65,v:1600},
    ];
    const rightCandles = [
      {o:60,h:65,l:59,c:64,v:3200},
      {o:64,h:70,l:63,c:69,v:4100},
      {o:69,h:70,l:60,c:61,v:5800},
      {o:61,h:62,l:55,c:56,v:6200},
      {o:56,h:57,l:50,c:51,v:5900},
    ];
    const minP=47, maxP=75;
    ctx.save();
    drawGridHalf(ctx,0,W,H);
    drawCandlesHalf(ctx,leftCandles,minP,maxP,0,W,H);
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='9px sans-serif'; ctx.textAlign='center';
    ctx.fillText('A: Pulls back 5%, low vol',W/4,H-8);
    drawGridHalf(ctx,W/2,W,H);
    drawCandlesHalf(ctx,rightCandles,minP,maxP,W/2,W,H);
    ctx.fillStyle='rgba(239,68,68,0.8)'; ctx.font='9px sans-serif';
    ctx.fillText('B: Drops 20%, high vol',W*3/4,H-8);
    ctx.restore();
    drawLabel(ctx,'Pullback or Breakdown?',W,H);
  },
  choices: [
    'A = breakdown, B = healthy pullback',
    'Both are breakdowns — any decline after a run should be sold',
    'A = healthy pullback, B = breakdown',
    'Both are healthy pullbacks — dips are always buying opportunities'
  ],
  correct: 2,
  feedback: 'Correct! Chart A is a healthy pullback: price pulls back 5% on declining volume after a move — normal digestion. Buyers are in control, sellers are not aggressive. Chart B is a breakdown: price drops 20% on increasing volume — sellers are in control. The key difference is volume. Healthy pullbacks see volume dry up on the decline. Breakdowns see volume expand on the decline.'
},

{
  id: 'q20', type: 'mc',
  title: 'Three Pushes Up',
  instruction: 'Three distinct pushes to higher highs, each smaller than the last. What does this signal?',
  draw: function(ctx, W, H) {
    drawGrid(ctx, W, H);
    const candles = [
      {o:55,h:57,l:54,c:56,v:1800},
      {o:56,h:64,l:55,c:63,v:4200},
      {o:63,h:65,l:60,c:61,v:2100},
      {o:61,h:63,l:60,c:62,v:1900},
      {o:62,h:69,l:61,c:68,v:3400},
      {o:68,h:70,l:65,c:66,v:1800},
      {o:66,h:68,l:65,c:67,v:1700},
      {o:67,h:72,l:66,c:71,v:2600},
      {o:71,h:73,l:64,c:65,v:4800},
    ];
    const minP=51, maxP=77;
    drawCandles(ctx,candles,minP,maxP,W,H);
    const lp=leftPad(W); const slot=candleSlot(W,candles.length);
    ctx.strokeStyle='rgba(0,210,122,0.6)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    ctx.moveTo(lp+1*slot+slot/2,priceToY(63,minP,maxP,H));
    ctx.lineTo(lp+4*slot+slot/2,priceToY(68,minP,maxP,H));
    ctx.lineTo(lp+7*slot+slot/2,priceToY(71,minP,maxP,H));
    ctx.stroke();
    ctx.fillStyle='rgba(0,210,122,0.8)'; ctx.font='8px sans-serif';
    ctx.fillText('Push 1',lp+1*slot-6,priceToY(63,minP,maxP,H)-8);
    ctx.fillText('Push 2',lp+4*slot-6,priceToY(68,minP,maxP,H)-8);
    ctx.fillText('Push 3',lp+7*slot-6,priceToY(71,minP,maxP,H)-8);
    const plus1 = 63-56; const plus2 = 68-62; const plus3 = 71-67;
    ctx.fillStyle='rgba(100,180,100,0.7)'; ctx.font='7px sans-serif';
    ctx.fillText('+'+plus1+'pts',lp+1*slot+4,priceToY(59,minP,maxP,H));
    ctx.fillText('+'+plus2+'pts',lp+4*slot+4,priceToY(64,minP,maxP,H));
    ctx.fillStyle='rgba(239,68,68,0.7)';
    ctx.fillText('+'+plus3+'pts',lp+7*slot+4,priceToY(68,minP,maxP,H));
    drawLabel(ctx,'Three Pushes Up',W,H);
  },
  choices: [
    'Continuation signal — three pushes confirm a strong uptrend, buy the next dip',
    'Exhaustion signal — diminishing momentum on each push suggests reversal ahead',
    'Neutral — three pushes is a normal number of waves in any trend',
    'Buy signal — the third push always leads to a fourth, larger push'
  ],
  correct: 1,
  feedback: 'Correct! Three pushes up with diminishing size is a classic exhaustion signal. Each push took more time and produced less gain than the previous one. Momentum is deteriorating. Buyers are becoming less aggressive. The third push often fails to hold and leads to a sharp reversal. This does not mean short immediately — wait for confirmation of the reversal before acting. But it is a clear signal to stop buying and tighten your stop.'
}

]; // end QUIZ_QUESTIONS

// ── DRAWING HELPERS ──────────────────────────────────────────────────────

function leftPad(W) { return 48; }
function rightPad(W) { return 20; }
function topPad(H) { return 24; }
function bottomPad(H) { return 52; }
function chartW(W) { return W - leftPad(W) - rightPad(W); }
function chartH(H) { return H - topPad(H) - bottomPad(H); }
function candleSlot(W, n) { return chartW(W) / n; }

function priceToY(price, minP, maxP, H) {
  const range = maxP - minP;
  const ratio = (maxP - price) / range;
  return topPad(H) + ratio * chartH(H);
}

function xForCandle(idx, W, n) {
  const slot = candleSlot(W, n);
  return leftPad(W) + idx * slot + slot * 0.15;
}

function drawGrid(ctx, W, H) {
  ctx.fillStyle = '#111712';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#1a221a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 5; i++) {
    const y = topPad(H) + (chartH(H) / 5) * i;
    ctx.beginPath(); ctx.moveTo(leftPad(W), y); ctx.lineTo(W - rightPad(W), y); ctx.stroke();
  }
}

function drawGridHalf(ctx, startX, W, H) {
  const hw = W/2 - 8;
  ctx.fillStyle = '#111712';
  ctx.fillRect(startX, 0, hw, H);
  ctx.strokeStyle = '#1a221a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 5; i++) {
    const y = topPad(H) + (chartH(H) / 5) * i;
    ctx.beginPath(); ctx.moveTo(startX+8, y); ctx.lineTo(startX+hw, y); ctx.stroke();
  }
}

function drawCandles(ctx, candles, minP, maxP, W, H) {
  const n = candles.length;
  const slot = candleSlot(W, n);
  const maxVol = Math.max(...candles.map(c => c.v));

  candles.forEach((c, i) => {
    const x = xForCandle(i, W, n);
    const cw = slot * 0.7;
    const isGreen = c.c >= c.o;
    const color = isGreen ? '#22c55e' : '#ef4444';

    // Volume bar
    const volH = (c.v / maxVol) * 36;
    ctx.fillStyle = isGreen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
    ctx.fillRect(x, H - bottomPad(H) - volH + 8, cw, volH);

    // Wick
    ctx.strokeStyle = color; ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x + cw/2, priceToY(c.h, minP, maxP, H));
    ctx.lineTo(x + cw/2, priceToY(c.l, minP, maxP, H));
    ctx.stroke();

    // Body
    const bodyTop = priceToY(Math.max(c.o, c.c), minP, maxP, H);
    const bodyBot = priceToY(Math.min(c.o, c.c), minP, maxP, H);
    const bodyH = Math.max(bodyBot - bodyTop, 1.5);
    ctx.fillStyle = color;
    ctx.fillRect(x, bodyTop, cw, bodyH);
  });

  // Price labels
  ctx.fillStyle = '#4a6a4a'; ctx.font = '9px monospace'; ctx.textAlign = 'right';
  for (let i = 0; i <= 5; i++) {
    const price = minP + ((maxP - minP) / 5) * (5 - i);
    const y = topPad(H) + (chartH(H) / 5) * i;
    ctx.fillText('$' + price.toFixed(0), leftPad(W) - 3, y + 3);
  }
  ctx.textAlign = 'left';
}

function drawCandlesHalf(ctx, candles, minP, maxP, startX, W, H) {
  const hw = W/2 - 8;
  const n = candles.length;
  const slot = hw / n;
  const maxVol = Math.max(...candles.map(c => c.v));

  candles.forEach((c, i) => {
    const x = startX + 8 + i * slot + slot * 0.15;
    const cw = slot * 0.7;
    const isGreen = c.c >= c.o;
    const color = isGreen ? '#22c55e' : '#ef4444';

    const volH = (c.v / maxVol) * 30;
    ctx.fillStyle = isGreen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)';
    ctx.fillRect(x, H - bottomPad(H) - volH + 8, cw, volH);

    ctx.strokeStyle = color; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x+cw/2, priceToY(c.h,minP,maxP,H));
    ctx.lineTo(x+cw/2, priceToY(c.l,minP,maxP,H));
    ctx.stroke();

    const bodyTop = priceToY(Math.max(c.o,c.c),minP,maxP,H);
    const bodyBot = priceToY(Math.min(c.o,c.c),minP,maxP,H);
    ctx.fillStyle = color;
    ctx.fillRect(x, bodyTop, cw, Math.max(bodyBot-bodyTop,1.5));
  });
}

function drawZoneLabel(ctx, W, H, text, x1pct, x2pct) {
  const x1 = x1pct * W;
  const x2 = x2pct * W;
  const y = H - 6;
  const color = text.includes('IDEAL') ? 'rgba(0,210,122,0.8)' :
                text.includes('LATE') ? 'rgba(239,68,68,0.6)' :
                text.includes('EARLY') || text.includes('TOO EARLY') ? 'rgba(251,191,36,0.6)' :
                'rgba(100,120,100,0.5)';
  ctx.fillStyle = color; ctx.font = 'bold 8px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(text, (x1+x2)/2, y);
  // Tick marks
  ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x1, H-14); ctx.lineTo(x1, H-10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x2, H-14); ctx.lineTo(x2, H-10); ctx.stroke();
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(x1, H-12); ctx.lineTo(x2, H-12); ctx.stroke();
  ctx.textAlign = 'left';
}

function drawLabel(ctx, text, W, H) {
  ctx.fillStyle = 'rgba(200,212,200,0.8)'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(text, W/2, 16);
  ctx.textAlign = 'left';
}

// ── QUIZ ENGINE ──────────────────────────────────────────────────────────

window.TST_INTERACTIVE_QUIZ = {
  current: 0,
  score: 0,
  answered: [],
  canvas: null,
  ctx: null,

  init: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    this.render(container);
  },

  render: function(container) {
    container.innerHTML = `
      <div style="background:#111712;border-radius:12px;padding:24px;max-width:680px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <div style="font-family:Rajdhani,sans-serif;font-size:20px;font-weight:700;color:#f0f4f1;" id="quiz-q-title"></div>
          <div style="font-size:12px;color:#6b7c6e;" id="quiz-progress"></div>
        </div>
        <div style="font-size:13px;color:#8aad8a;margin-bottom:12px;" id="quiz-instruction"></div>
        <canvas id="quiz-canvas" style="width:100%;border-radius:8px;cursor:crosshair;display:block;"></canvas>
        <div id="quiz-choices" style="margin-top:12px;"></div>
        <div id="quiz-feedback" style="margin-top:12px;display:none;background:#0c100d;border-radius:8px;padding:14px;font-size:13px;color:#c8d4c8;line-height:1.7;border-left:3px solid #4ab44a;"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
          <div style="font-size:13px;color:#6b7c6e;" id="quiz-score-display"></div>
          <button id="quiz-next-btn" onclick="TST_INTERACTIVE_QUIZ.next()" style="display:none;background:#22c55e;color:#000;border:none;border-radius:8px;padding:10px 24px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:14px;cursor:pointer;">Next Question →</button>
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
    document.getElementById('quiz-progress').textContent = `Question ${this.current + 1} of ${QUIZ_QUESTIONS.length}`;
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-next-btn').style.display = 'none';
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.current}`;

    // Set canvas size
    const W = this.canvas.offsetWidth || 640;
    const H = Math.round(W * 0.56);
    this.canvas.width = W;
    this.canvas.height = H;

    // Draw the chart
    q.draw(this.ctx, W, H);

    // Set up interaction
    if (q.type === 'zone') {
      this.canvas.style.cursor = 'crosshair';
      this.canvas.onclick = (e) => this.handleZoneClick(e, q);
      document.getElementById('quiz-choices').innerHTML = '';
    } else {
      this.canvas.style.cursor = 'default';
      this.canvas.onclick = null;
      this.renderChoices(q);
    }
  },

  handleZoneClick: function(e, q) {
    if (this.answered[this.current]) return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / this.canvas.width;
    const W = this.canvas.width;
    const H = this.canvas.height;

    let result = 'late';
    if (pct >= q.zones.early[0] && pct <= q.zones.early[1]) result = 'early';
    else if (pct >= q.zones.ideal[0] && pct <= q.zones.ideal[1]) result = 'ideal';

    // Draw click marker
    const ctx = this.ctx;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const isIdeal = result === 'ideal';

    ctx.strokeStyle = isIdeal ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(clickX, clickY, 10, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(clickX, 20); ctx.lineTo(clickX, H-20); ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]);

    this.answered[this.current] = true;
    if (isIdeal) this.score++;

    const feedback = document.getElementById('quiz-feedback');
    feedback.style.borderLeftColor = isIdeal ? '#22c55e' : '#ef4444';
    feedback.textContent = q.feedback[result];
    feedback.style.display = 'block';
    document.getElementById('quiz-next-btn').style.display = 'block';
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.current + 1}`;
  },

  renderChoices: function(q) {
    const div = document.getElementById('quiz-choices');
    div.innerHTML = q.choices.map((c, i) => `
      <div onclick="TST_INTERACTIVE_QUIZ.handleChoice(${i})" id="choice-${i}" style="background:#0c100d;border:1px solid #1e2820;border-radius:8px;padding:12px 16px;margin-bottom:8px;cursor:pointer;font-size:13px;color:#c8d4c8;line-height:1.5;transition:border-color 0.2s;">
        <span style="color:#4ab44a;font-weight:700;margin-right:8px;">${String.fromCharCode(65+i)}.</span>${c}
      </div>`).join('');
  },

  handleChoice: function(idx) {
    if (this.answered[this.current]) return;
    const q = QUIZ_QUESTIONS[this.current];
    this.answered[this.current] = true;
    const isCorrect = idx === q.correct;
    if (isCorrect) this.score++;

    // Color the choices
    q.choices.forEach((_, i) => {
      const el = document.getElementById('choice-'+i);
      if (i === q.correct) { el.style.borderColor = '#22c55e'; el.style.background = 'rgba(34,197,94,0.08)'; }
      else if (i === idx && !isCorrect) { el.style.borderColor = '#ef4444'; el.style.background = 'rgba(239,68,68,0.08)'; }
      el.style.cursor = 'default';
    });

    const feedback = document.getElementById('quiz-feedback');
    feedback.style.borderLeftColor = isCorrect ? '#22c55e' : '#ef4444';
    feedback.textContent = q.feedback;
    feedback.style.display = 'block';
    document.getElementById('quiz-next-btn').style.display = 'block';
    document.getElementById('quiz-score-display').textContent = `Score: ${this.score}/${this.current + 1}`;
  },

  next: function() {
    this.current++;
    if (this.current >= QUIZ_QUESTIONS.length) {
      this.showResults();
      return;
    }
    this.loadQuestion();
  },

  showResults: function() {
    const pct = Math.round((this.score / QUIZ_QUESTIONS.length) * 100);
    const passed = pct >= 75;
    const container = document.querySelector('#quiz-canvas').parentElement;
    container.innerHTML = `
      <div style="text-align:center;padding:40px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">${passed ? '🎯' : '📚'}</div>
        <div style="font-family:Rajdhani,sans-serif;font-size:32px;font-weight:700;color:${passed?'#22c55e':'#fbbf24'};margin-bottom:8px;">${pct}%</div>
        <div style="font-size:16px;color:#f0f4f1;margin-bottom:8px;">${this.score} of ${QUIZ_QUESTIONS.length} correct</div>
        <div style="font-size:13px;color:#6b7c6e;margin-bottom:24px;line-height:1.7;">${passed ? 'Excellent work. You demonstrated strong pattern recognition across bullish, bearish, and reversal setups.' : 'Keep studying the chart patterns and setups. Review the lessons for any patterns you missed, then retake the quiz.'}</div>
        <button onclick="TST_INTERACTIVE_QUIZ.restart()" style="background:#22c55e;color:#000;border:none;border-radius:8px;padding:12px 28px;font-family:Rajdhani,sans-serif;font-weight:700;font-size:15px;cursor:pointer;">Retake Quiz</button>
      </div>`;
    // Save to Supabase
    if (window.TST_QUIZ && typeof TST_QUIZ.saveResult === 'function') {
      TST_QUIZ.saveResult('interactive-quiz', pct, passed);
    }
  },

  restart: function() {
    this.current = 0; this.score = 0; this.answered = [];
    const container = document.getElementById('quiz-canvas')?.parentElement || document.querySelector('[id*="quiz"]');
    if (container) this.render(container);
  }
};
