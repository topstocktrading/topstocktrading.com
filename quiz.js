
// TST Academy Quiz Engine
// Loaded separately to avoid template literal conflicts in members.html

const QUIZ_DATA = {

  beginner: {
    title: "Beginner Mastery Test",
    section: "beginner",
    passingScore: 75,
    questions: [
      { id:"b1", variants:[
        { q:"A long lower wick on a candle tells you:", choices:["Sellers pushed price down but buyers rejected the lows and pushed it back up","Buyers were in control the entire period","The stock had low volume","Sellers won and price closed at the lows"], answer:0, hint:"The wick shows where price went — the close shows who won." },
        { q:"What does a very long lower wick indicate about buyer and seller behavior?", choices:["Buyers stepped in aggressively and rejected the lower prices","Sellers dominated from open to close","The candle had no directional bias","Volume was above average during the period"], answer:0, hint:"A wick represents rejection. Long lower wick = buyers rejected lower prices." },
        { q:"Price dips sharply during a candle then closes near the high. What does the long lower wick tell you?", choices:["Buyers overwhelmed sellers at the lows and reclaimed control","Sellers are gaining strength","The stock is about to break down further","The move was driven by low float and should be avoided"], answer:0, hint:"Where price closes is who won. The wick just shows where it went and got rejected." }
      ]},
      { id:"b2", variants:[
        { q:"A Doji candlestick appearing after a long uptrend signals:", choices:["Potential reversal — neither buyers nor sellers won","Strong bullish continuation","A confirmed breakdown","High volume accumulation"], answer:0, hint:"Doji = indecision. After an extended move it warns momentum may be shifting." },
        { q:"What is a Doji and why does location matter?", choices:["Nearly same open and close — after an extended trend it warns of potential reversal","A candle with no wicks showing total conviction","A bearish candle that only forms at bottoms","A pattern that signals continuation regardless of where it appears"], answer:0, hint:"A Doji has almost no body. At the end of a trend it means neither side won — a warning." },
        { q:"You see a Doji after 5 consecutive green candles. What should you think?", choices:["Momentum may be slowing — watch for a potential reversal","Buy aggressively since the trend is clearly continuing","Ignore it — single candles have no predictive value","Sell immediately since a Doji is always bearish"], answer:0, hint:"After an extended move, indecision is a warning sign not a green light." }
      ]},
      { id:"b3", variants:[
        { q:"A bullish engulfing pattern is most significant when it appears:", choices:["Near a key support level where buyers are defending a known price","At the middle of a strong uptrend","After a gap up with no news catalyst","On low volume in a range-bound stock"], answer:0, hint:"Context matters. The same pattern means more at certain levels than others." },
        { q:"What is a bullish engulfing pattern and when is it most reliable?", choices:["Green candle that fully engulfs prior red candle — most powerful near support","Any green candle that closes above the prior candle's high","Two green candles in a row anywhere on the chart","A pattern that only works on daily charts near 52-week highs"], answer:0, hint:"Two candles, one swallows the other. The location determines reliability." },
        { q:"You see a green candle completely covering the prior red candle's body near a major support level. This is called:", choices:["Bullish engulfing — a sign of strong buying pressure at a key level","Marubozu — total buyer conviction from open to close","Hammer — buyers rejected lower prices","Doji — indecision at a critical level"], answer:0, hint:"It takes two candles — one red, one green that engulfs it." }
      ]},
      { id:"b4", variants:[
        { q:"A stock wicks above resistance but closes back below it. This means:", choices:["The level was tested and rejected — not a confirmed breakout","A valid breakout occurred and you should enter long","Sellers are weakening and a breakout is imminent","The level is irrelevant since price did touch it"], answer:0, hint:"A wick is a test. A close is acceptance. Which happened here?" },
        { q:"Why is a candle CLOSE above resistance more significant than a wick through it?", choices:["A close means the market accepted the new price level — a wick means it was rejected","Wicks are more powerful because they show buyers pushed to that level","Both are equally significant breakout signals","Closes only matter on daily charts — wicks are valid on intraday charts"], answer:0, hint:"Where price closes is where the majority agreed it belongs." },
        { q:"For a breakout to be valid, what must you see from the candle?", choices:["A full candle close above the resistance level with above-average volume","A wick touching the resistance level before pulling back","Price touching the level three times on the same candle","A gap above the resistance level at market open"], answer:0, hint:"Touches are not breakouts. Closes above are." }
      ]},
      { id:"b5", variants:[
        { q:"A stock breaks above resistance on half its average volume. You should:", choices:["Avoid or wait — low volume breakouts frequently fail and reverse","Enter immediately since less selling pressure means cleaner move","Enter with double size since the breakout has less resistance","Only enter if the stock is up more than 5% on the day"], answer:0, hint:"Volume tells you who is participating. No volume means no institutional conviction." },
        { q:"What does low volume on a breakout candle tell you?", choices:["Institutions are not participating — the move lacks conviction and may fail","The move is cleaner and more reliable since fewer sellers are present","It confirms the breakout since buying is overpowering selling","Low volume breakouts are always the best entries with tightest stops"], answer:0, hint:"Who drives sustained moves? Institutions. No volume means they are not involved." },
        { q:"You see a clean break above a 3-month resistance level but RVOL is 0.4x. What is your decision?", choices:["Skip it — 0.4x RVOL means far below average participation, high false breakout risk","Enter full size — the longer the resistance held the more powerful the breakout","Enter half size and add if volume picks up","Enter with a wide stop to give the low-volume move room to prove itself"], answer:0, hint:"0.4x RVOL means the stock is trading at 40% of its normal volume. Who is pushing this?" }
      ]},
      { id:"b6", variants:[
        { q:"During a valid bull flag consolidation, volume should:", choices:["Dry up and contract well below average — sellers are exhausted","Increase steadily to show buyers accumulating","Match the volume from the initial pole move","Spike on every red candle inside the flag"], answer:0, hint:"If sellers were truly pushing price down, volume would be high. Low volume means they are not." },
        { q:"What does declining volume during a flag pullback tell you?", choices:["Sellers are not aggressively pushing lower — the pullback is orderly profit-taking","The setup is invalid and you should wait for a different pattern","Buyers are losing interest and the stock will likely break down","Volume during consolidation is irrelevant — only breakout volume matters"], answer:0, hint:"Low volume on the pullback means weak selling. That sets up a stronger breakout." },
        { q:"A stock pulls back in a tight channel after a big move. Volume during the pullback is 0.3x average. This is:", choices:["Bullish — volume contraction during consolidation confirms a potential flag breakout","Bearish — low volume means buyers have abandoned the stock","Neutral — you need to see how it resolves before making any judgment","A sign the pattern is invalid since flags require above-average volume throughout"], answer:0, hint:"Volume drying up during a flag is exactly what you want to see." }
      ]},
      { id:"b7", variants:[
        { q:"A volume climax spike at the end of a sharp selloff most often signals:", choices:["Exhaustion — panic sellers have all exited at once, potential short-term bottom","Confirmation that the downtrend will continue even faster","A great short entry since volume confirms the bearish momentum","Institutional distribution — funds are dumping large positions"], answer:0, hint:"Once everyone who wants to sell has sold, who is left to push price lower?" },
        { q:"What is a volume climax and why does extreme volume at a turning point matter?", choices:["Extreme volume on a sharp move signals exhaustion of the dominant side — reversal risk increases","High volume always means the move will continue in the same direction","Volume spikes are random and have no predictive value for direction","A volume climax only matters on weekly charts — intraday climaxes are unreliable"], answer:0, hint:"Extreme volume means a lot of people acted at once. Think about what happens after." },
        { q:"A stock drops 15% in one session on 8x its average volume then closes near the high of that candle. What does this suggest?", choices:["Climax selling — panic exhausted, buyers absorbed the selling, potential reversal","The stock will gap down further tomorrow as selling pressure continues","Short immediately — high volume on a down day confirms the downtrend","The stock is now worthless and all technical signals are irrelevant"], answer:0, hint:"Closed near the high of a massive volume candle. Who won by the close?" }
      ]},
      { id:"b8", variants:[
        { q:"After breaking above a resistance level with conviction, that level becomes:", choices:["Support — former sellers now buy pullbacks to defend the level they traded at","Resistance again — it never loses its resistance properties","Irrelevant — once broken a level has no future significance","A target for the next resistance level above it"], answer:0, hint:"Think about the traders who were selling at that level. What do they do after it breaks above them?" },
        { q:"A stock breaks above $55 resistance on huge volume. On the next pullback to $55, you expect:", choices:["$55 to act as support — institutional buyers will defend the level they broke out from","$55 to remain resistance and push price back down again","$55 to be irrelevant since the breakout already happened","Price to gap below $55 since breakouts frequently reverse to their prior levels"], answer:0, hint:"Resistance that gets broken flips its role. This is one of the most reliable concepts in technical analysis." },
        { q:"Why does resistance often flip to support after a clean breakout?", choices:["Traders who sold there now buy pullbacks and institutions re-enter at the breakout level","Price has nowhere else to go so it defaults to the broken resistance level","Algorithms are programmed to buy exactly at prior resistance levels","It is a random coincidence that happens to work more often than not"], answer:0, hint:"Follow the money. Where do the traders who sold at that level want to buy now?" }
      ]},
      { id:"b9", variants:[
        { q:"A series of higher lows in a stock tells you:", choices:["Buyers are stepping in earlier each time — accumulation is happening and buyers are in control","Sellers are getting stronger as they hold at lower levels","The stock is range-bound with no clear direction","The trend is weakening and a reversal is imminent"], answer:0, hint:"Higher lows mean buyers keep stepping in at higher prices. That is demand increasing." },
        { q:"What does a higher low confirm about who is in control of a trend?", choices:["Buyers are gaining strength — they are not waiting for price to fall as far before buying","Sellers are becoming more aggressive with each pullback","Neither side has clear control — it is a sign of consolidation","The stock is overextended and about to reverse sharply"], answer:0, hint:"If buyers are buying at higher prices each time, demand is increasing not decreasing." },
        { q:"Stock pulls back to $48, bounces. Pulls back to $51, bounces. Pulls back to $54, bounces. What pattern is this?", choices:["Higher lows — buyers accumulating at progressively higher prices, bullish","Lower lows — sellers pushing the stock down with each pullback","A range — price is bouncing between two fixed levels","Distribution — institutions selling into every bounce"], answer:0, hint:"Each pullback found support at a higher level than the last. What does that mean?" }
      ]},
      { id:"b10", variants:[
        { q:"A lower high in a previously uptrending stock signals:", choices:["Sellers are stepping in earlier — buyers are losing control of the trend","Buyers are accumulating at lower prices — a buying opportunity","The stock is about to break out to new highs after this consolidation","A perfectly normal part of any healthy uptrend that should be ignored"], answer:0, hint:"If sellers are stepping in at lower and lower prices, what is happening to the trend?" },
        { q:"What does it mean when each rally in a stock reaches a lower peak than the previous one?", choices:["Sellers are getting more aggressive — warning that buyers are losing strength","Buyers are still in control and the uptrend is healthy","The stock is consolidating before a powerful breakout above the prior highs","A sign of institutional accumulation at lower and lower prices"], answer:0, hint:"Lower highs mean sellers are entering earlier each time. That is supply increasing." },
        { q:"Stock rallies to $60, pulls back, rallies to $58, pulls back, rallies to $55. If you are long, what is this telling you?", choices:["Exit or tighten stops — lower highs show buyers are losing control even before support breaks","Hold strong — small variations in rally peaks are normal and the trend is still up","Add to your position since the stock is coiling for a major breakout","Short the stock immediately since lower highs always lead to immediate breakdowns"], answer:0, hint:"Each rally reached a lower peak. Sellers are getting more aggressive. Act accordingly." }
      ]},
      { id:"b11", variants:[
        { q:"How do you avoid entering a fakeout on a breakout?", choices:["Wait for a full candle close above the level with above-average volume — not just a wick","Enter as soon as price touches the resistance level to get the best entry","Use a limit order at the resistance level and enter the moment it is hit","Only trade breakouts that occur in the first 30 minutes of the session"], answer:0, hint:"Two things confirm a real breakout: where the candle closes and who is showing up in volume." },
        { q:"A stock pokes above a key resistance level then immediately reverses back below it. This is:", choices:["A fakeout — price tested the level but was rejected, no breakout occurred","A valid breakout entry — the touch confirms buyers are in control","A double top pattern forming — short the next time it tests the level","A volume dry-up signal — wait for the next candle before deciding"], answer:0, hint:"Did price close above the level or just touch it briefly?" },
        { q:"What are the two most important filters that separate a real breakout from a false one?", choices:["Full candle close above the level AND volume above average on the breakout candle","Price above the level for more than 5 minutes AND the RSI above 60","Three consecutive candles above the level AND MACD crossing bullish","The breakout occurring before 11 AM AND no news catalyst present"], answer:0, hint:"Close and volume. That is it. Both need to show up." }
      ]},
      { id:"b12", variants:[
        { q:"The two components of a bull flag are:", choices:["Flag pole (sharp move up) and flag (tight pullback) — entry is on break above the flag highs","Base (consolidation) and breakout (sharp move) — entry is at the start of the base","Support and resistance — entry is on the bounce off support inside the flag","Volume spike and price surge — entry is during the volume spike itself"], answer:0, hint:"One component is the initial move, the other is the rest period. Where do you enter?" },
        { q:"Where is the entry point on a bull flag breakout?", choices:["On a break above the highest candle in the flag consolidation with volume confirming","At the very start of the flag pullback to get the best possible entry price","At the bottom of the flag pullback when price shows the first sign of stabilization","When price returns to the base of the flag pole — the origin of the original move"], answer:0, hint:"You enter when the consolidation is OVER and the move is RESUMING." },
        { q:"A stock spikes 15% in 20 minutes then pulls back in a tight range for 15 minutes on lower volume. This describes:", choices:["A bull flag — pole followed by tight pullback, entry on break above the flag highs","A head and shoulders pattern forming at the top","A double top — the initial spike and then a retest of the high","A VWAP reclaim setup — enter when price crosses back above VWAP"], answer:0, hint:"Sharp move followed by tight orderly pullback on declining volume. Classic pattern." }
      ]},
      { id:"b13", variants:[
        { q:"On a bull flag trade, the stop loss goes:", choices:["Below the lowest candle in the flag consolidation — if price returns there the pattern is invalid","Below the bottom of the flag pole — the entire move must be protected","A fixed 50 cents below your entry regardless of chart structure","At the prior day's low since that is the most significant nearby support"], answer:0, hint:"Your stop goes at the level that PROVES the trade idea is wrong." },
        { q:"Why does the stop on a bull flag go below the flag lows specifically?", choices:["Because if price returns below the flag low the pattern is invalidated and the thesis is wrong","Because the flag low is always the closest support level regardless of pattern","Because stops at the flag low give you exactly 1% risk on every trade","Because flag lows are where institutions always place their buy orders"], answer:0, hint:"The flag low is where the consolidation is. Below it means the consolidation failed." },
        { q:"You entered a bull flag breakout. Price pulls back into the flag and closes below the flag low. You should:", choices:["Exit immediately — the pattern is invalidated, the trade is wrong","Hold — pullbacks below the flag low are normal and price will recover","Add to your position — this is a better entry than the original breakout","Move your stop lower to give the trade more room to work"], answer:0, hint:"The stop exists for a reason. Below the flag low means the setup failed." }
      ]},
      { id:"b14", variants:[
        { q:"An ascending triangle shows:", choices:["Buyers making higher lows while sellers hold a fixed resistance — buyers eventually overwhelm sellers","Sellers making lower highs while buyers defend a fixed support level","Equal strength between buyers and sellers — resolves randomly in either direction","Institutional distribution at resistance — typically breaks down"], answer:0, hint:"One side is getting more aggressive. The other is holding a fixed line. Who wins?" },
        { q:"In an ascending triangle, what are buyers doing that makes this pattern typically bullish?", choices:["Making higher lows — they are willing to pay more each time, gradually overwhelming the fixed resistance","Selling aggressively at resistance to create the flat top","Waiting at a fixed support level for sellers to exhaust themselves","Accumulating below VWAP while institutions distribute at the flat resistance"], answer:0, hint:"Higher lows mean buyers are increasing their aggression with each attempt." },
        { q:"What does the flat resistance line in an ascending triangle tell you about sellers?", choices:["They have a fixed supply level but buyers are gradually overwhelming it with higher lows","They are getting stronger with each test and will eventually push price sharply lower","They have already exited and the flat line is just a technical artifact","Sellers at that level are weak and will disappear on the first real test"], answer:0, hint:"Fixed line means fixed supply. Rising lows means increasing demand. What happens when demand exceeds fixed supply?" }
      ]},
      { id:"b15", variants:[
        { q:"A large ask wall disappears as price approaches it. This is typically:", choices:["Bullish — the supply blocking price has been removed, path of least resistance is now higher","Bearish — a large seller filled their entire position and will now push price lower","Neutral — walls appear and disappear constantly and have no predictive value","Bearish — market makers are pulling liquidity ahead of a major sell program"], answer:0, hint:"If the wall blocking price upward disappears, what is now blocking price from moving higher?" },
        { q:"What does it mean when a massive sell wall on Level 2 vanishes right before price reaches it?", choices:["The seller pulled their order or it was a fake wall — price now has less resistance to move through","The seller filled all their shares and took their profit successfully","Market conditions changed and the order was canceled by the exchange","It confirms the resistance is real and price will reverse hard at that level"], answer:0, hint:"A wall that disappears means the supply that was blocking price is gone." },
        { q:"You are watching Level 2 and see 80,000 shares offered at $25. As price climbs to $24.90 the wall vanishes. You should think:", choices:["Bullish — that wall may have been spoofing and price may accelerate through $25 quickly","Bearish — that seller just dumped 80,000 shares at $25 and will push price down","Neutral — walls move around constantly and this has no significance","Short immediately since the wall disappearing means smart money is exiting"], answer:0, hint:"If 80,000 shares of resistance just disappeared, what changed about the supply picture?" }
      ]},
      { id:"b16", variants:[
        { q:"Large green prints consistently hitting the ask tells you:", choices:["Buyers are aggressively paying the ask — urgency and conviction signal strong demand","Sellers are offloading large positions at the best available price","The tape is showing equal buying and selling with no clear bias","Price is about to reverse because sellers are meeting the demand at the ask"], answer:0, hint:"Hitting the ask means you are so eager to own the stock you will not wait for a better price. What does that urgency signal?" },
        { q:"What does it mean when you see aggressive tape with large prints at the ask?", choices:["Motivated buyers are not waiting — they are paying whatever sellers are asking, a bullish signal","Market makers are filling retail orders at the ask — no directional significance","The stock is being manipulated — avoid it","Sellers are winning because they are setting the price at the ask level"], answer:0, hint:"When you pay the ask you are saying you need this right now. What does that tell you about demand?" },
        { q:"Time and sales shows large blocks repeatedly printing green at the ask price. You are watching a potential long setup. This tape action:", choices:["Confirms bullish momentum — institutions are buying aggressively, adds conviction to the long","Is irrelevant — time and sales data does not affect the validity of chart setups","Warns of a reversal — heavy buying at the ask exhausts demand quickly","Means you missed the move — large buyers finishing their purchases signals the move is over"], answer:0, hint:"Who buys at the ask? Someone who does not want to wait. What does that mean for direction?" }
      ]},
      { id:"b17", variants:[
        { q:"The 1% rule means:", choices:["Never risk more than 1% of your total account on a single trade","Only trade stocks moving more than 1% from their open","Limit daily losses to 1% of your starting balance regardless of trades taken","Take profits when any trade reaches 1% gain to protect capital consistently"], answer:0, hint:"The 1% rule is about how much you put at RISK on any single trade — not profit targets." },
        { q:"Why do professional traders risk only 1% per trade even on their highest conviction setups?", choices:["10 consecutive losses only cost 10% of the account — protects against career-ending drawdowns","They make more money at 1% risk than at higher risk percentages over time","Broker regulations require maximum 1% risk per position at most firms","1% risk automatically gives you 2:1 risk reward on every trade"], answer:0, hint:"Think about what 10 losing trades in a row does to your account at 1% vs 5% vs 10%." },
        { q:"You have a $20,000 account. The 1% rule means your maximum dollar risk on one trade is:", choices:["$200 — 1% of $20,000 regardless of how confident you are in the setup","$2,000 — 1% applies to the position size not the risk amount","$200 only on new setups — established patterns allow up to 2% risk","$200 per trade but you can take multiple trades to the same stock simultaneously"], answer:0, hint:"1% of $20,000. Do the simple math." }
      ]},
      { id:"b18", variants:[
        { q:"When you hit your daily max loss, you should:", choices:["Close your platform and stop trading immediately — no exceptions","Take one more trade to try to recover — you are already at the limit anyway","Reduce position size by half and continue trading more carefully","Switch to paper trading for the rest of the day to practice without risk"], answer:0, hint:"Your best risk management decisions are made before the market opens — not after you are already down." },
        { q:"Why does a daily max loss rule exist?", choices:["Your worst decisions come after losses — the rule stops you before a bad day becomes catastrophic","It is a broker requirement designed to protect the firm from excessive losses","It forces you to trade more aggressively in the morning to avoid hitting the limit","It ensures you never have a losing day since you stop before the loss gets too large"], answer:0, hint:"Think about the psychological state after taking losses. Are you at your sharpest?" },
        { q:"You set a $300 daily max loss before the market opened. At 10:15 AM you hit it. You should:", choices:["Close everything and walk away for the day — the number was set when your judgment was clear","Keep trading but only in the direction the market is moving","Take a 30-minute break then resume with smaller size","Call your broker to temporarily increase your daily limit so you can recover"], answer:0, hint:"You set that number before the market opened when your head was clear. Trust that version of yourself." }
      ]},
      { id:"b19", variants:[
        { q:"A 2:1 risk reward ratio means:", choices:["Your profit target is twice your stop loss — you can be wrong 40% of the time and still profit","You need to win twice as many trades as you lose to be profitable","You should only trade when the stock has already moved 2% in your favor","Your position size should be double your normal size on high-conviction setups"], answer:0, hint:"2:1 means your winner pays twice what your loser costs. Do the math on a series of trades." },
        { q:"Why does a 2:1 risk reward ratio allow profitability below a 50% win rate?", choices:["At 40% wins: 4 winners at $200 = $800, 6 losers at $100 = $600, net +$200 over 10 trades","Because the 2:1 ratio automatically increases your win rate above 50%","Because you take twice as many trades which creates more total winning trades","2:1 only works above 50% win rate — below 50% you need at least 3:1 or higher"], answer:0, hint:"Run the numbers on 10 trades at 40% win rate. 4 wins at $200, 6 losses at $100." },
        { q:"Why do experienced traders refuse trades with less than 2:1 risk reward?", choices:["Below 2:1 the math stops working — even a 50% win rate may not produce consistent profits","They are too conservative — lower risk reward setups are fine with higher win rates","The 2:1 rule only applies to options trading where premium decay must be overcome","It is a personal preference not a mathematical requirement for profitability"], answer:0, hint:"At 1:1 you need to win more than 50% just to break even. How much edge do you really have?" }
      ]},
      { id:"b20", variants:[
        { q:"The 11:30 AM to 2:00 PM window is most dangerous because:", choices:["Institutional volume drops, moves become choppy and random, momentum strategies stop working","Market makers manipulate prices during this period to trap retail traders","News events are most likely to hit during midday creating unpredictable gaps","Spreads widen to the point where it is mathematically impossible to profit"], answer:0, hint:"Remove institutional volume from the market. Who is left trading and what does their behavior look like?" },
        { q:"What specifically happens to price action during midday that makes it dangerous?", choices:["Without institutional participation moves are smaller, more random, and setups fail more often","Price action is actually cleaner during midday since volatility is lower","Only small cap stocks are dangerous during midday — large caps trade normally all day","Midday is dangerous only on options expiration days when gamma forces wild swings"], answer:0, hint:"Institutional volume drives clean directional moves. Without it, what drives price?" },
        { q:"You are up $500 at 11:45 AM. An experienced trader tells you to stop trading. The reason is:", choices:["Midday conditions are choppy and random — the odds of giving back profits are high","You have hit your daily profit target and should never trade after reaching it","Market rules require a mandatory break between 11:30 and 2:00 PM","Stopping at 11:45 is too conservative — power hour at 3 PM is still tradeable"], answer:0, hint:"Protecting a profitable morning from a choppy afternoon is a skill in itself." }
      ]}  ]
  },

  intermediate: {
    title: "Intermediate Mastery Test",
    section: "intermediate",
    passingScore: 75,
    questions: [
      { id:"i1", variants:[
        { q:"QQQ is down 1.5% and below VWAP all morning. You have a long setup on a tech stock. You should:", choices:["Skip or reduce size — trading long against a downtrending index dramatically lowers probability","Enter full size since individual stock setups work regardless of market direction","Enter with a wider stop since the index selloff will cause more volatility","Wait 30 minutes then enter since morning selloffs usually reverse"], answer:0, hint:"How hard is it to swim upstream when the whole market is selling?" },
        { q:"The Nasdaq is in a clear downtrend below VWAP. A tech stock shows a long setup. What is your decision?", choices:["Pass on the trade — the index headwind makes this a low-probability long","Take it immediately before the index recovers and the move becomes too extended","Take it with half size using the index as a trailing stop signal","Only take it if the stock has a catalyst that justifies trading against the market"], answer:0, hint:"Your setup's probability drops significantly when the tide is going out." },
        { q:"Why should overall index direction be checked before entering individual stock trades?", choices:["Most stocks follow the index — a downtrending index creates headwinds for longs and tailwinds for shorts","Index direction only matters for ETF traders — individual stocks are independent","Check it only on high VIX days when correlation between stocks and indexes is highest","Index direction matters for swing trades but is irrelevant for intraday setups"], answer:0, hint:"Individual stocks and their sector index are correlated. The index is the tide." }
      ]},
      { id:"i2", variants:[
        { q:"A stock is up 2% while the S&P 500 is down 1%. This demonstrates:", choices:["Exceptional relative strength — institutional demand is absorbing all selling pressure","A temporary anomaly that will correct once selling spreads to all stocks","A warning sign that the stock is about to reverse since it cannot sustain gains","Random noise — individual stocks and indexes disconnect constantly and meaninglessly"], answer:0, hint:"If a stock is green while everything is red, something is happening beneath the surface." },
        { q:"What does relative strength tell you about a stock in a down market?", choices:["Institutional demand is absorbing market selling — the stock will likely lead when the market recovers","The stock is thinly traded and not correlated to the market","Retail investors are irrationally holding the stock despite market weakness","The stock has no real catalyst and will eventually sell off with the broader market"], answer:0, hint:"Imagine the market turns around. Which stocks run hardest — the ones that held or the ones that sold off?" },
        { q:"When looking for trade candidates, why should relative strength be one of your primary filters?", choices:["Stocks resisting market selloffs have institutional buying behind them — strongest in weakness become strongest in rallies","Relative strength only matters for swing trades — intraday setups should focus purely on chart patterns","Stocks with relative strength are overextended and about to reverse","Relative strength is too subjective to be a reliable quantitative filter"], answer:0, hint:"The best stocks to own in a rally are the ones that refused to sell off when everything else did." }
      ]},
      { id:"i3", variants:[
        { q:"The VIX spikes from 14 to 28 overnight. Your first adjustment should be:", choices:["Reduce position size significantly — wider moves require wider stops and same size means double the risk","Increase size to capitalize on the larger intraday moves available","Trade the same as usual since volatility affects all traders equally","Stop trading entirely since high VIX days are always net losing days"], answer:0, hint:"Everything moves twice as fast. What happens to your dollar risk if you keep the same position size?" },
        { q:"What does a VIX doubling overnight tell you about the next trading session?", choices:["Stocks will move much faster in both directions — size down, widen stops, be more selective","It is a great opportunity to trade larger since moves will be bigger","The market will trend cleanly in one direction all day — high VIX means institutional conviction","VIX spikes are mean-reverting and the session will be calmer than the VIX suggests"], answer:0, hint:"Double the volatility means double the speed of moves in both directions." },
        { q:"On a high VIX day, why does your position size need to decrease even if your setups look the same?", choices:["Stops must be wider to avoid false triggers — same size with wider stops exceeds your 1% risk limit","Position size should never change based on market conditions — consistency is key","Higher volatility actually improves your risk reward so you can trade larger safely","VIX only affects options positions — stock position sizing is unaffected by volatility changes"], answer:0, hint:"Risk = position size × stop distance. If stop distance doubles, what must position size do?" }
      ]},
      { id:"i4", variants:[
        { q:"A stock consistently bounces off its 9 EMA on the 5-minute chart. How do you use this?", choices:["Buy pullbacks to the 9 EMA with a stop just below it — the stock's personality gives you a repeatable entry","Sell every time price touches the 9 EMA since it always reverses there","Avoid trading this stock since predictable patterns attract too many traders","Use the 9 EMA as a profit target — exit when price reaches it from below"], answer:0, hint:"If you know where a stock reliably finds support, how does that improve your entry?" },
        { q:"What does it mean when a stock has a personality that respects a specific moving average?", choices:["That average acts as dynamic support — you can use it as your entry trigger for tighter risk entries","The stock is being manipulated to always bounce at that level by market makers","You should only trade the stock when it is far from that average","The pattern will stop working soon since too many traders are aware of it"], answer:0, hint:"Stocks develop tendencies. Knowing a tendency gives you an edge." },
        { q:"Instead of chasing a breakout, a trader waits for a stock to pull back to its 9 EMA in an uptrend. Why?", choices:["Better entry price with tighter stop — waiting for the pullback improves risk reward significantly","Chasing breakouts is always better since momentum is confirmed at that point","The 9 EMA pullback entry only works on stocks with float below 10 million shares","Waiting for the pullback means you miss the strongest part of the move and should avoid this approach"], answer:0, hint:"Where would you rather enter — at the breakout high or at support with a tight stop?" }
      ]},
      { id:"i5", variants:[
        { q:"A stock has an average daily range of $3 and has already moved $2.80 today. A new long entry is:", choices:["Low probability — the stock has used most of its daily range and has little movement left","High probability — a stock that has already moved $2.80 has proven momentum","The best time to enter since the stock has confirmed its direction for the day","Fine as long as the setup is valid — daily range does not affect individual trade probability"], answer:0, hint:"Every stock has a daily energy budget. Once spent, the odds of another major move drop sharply." },
        { q:"What is average daily range and how do you use it in trade planning?", choices:["Typical daily high-to-low distance — avoid entering when most of the range has already been consumed","The average size of winning trades over the past 20 days — used to set profit targets","Distance from VWAP to the daily high — used to calculate how extended a stock is","The spread between the bid and ask averaged over a trading day — only relevant for scalpers"], answer:0, hint:"If a stock moves $3 per day on average and has already moved $2.80 — how much is left?" },
        { q:"You find a great-looking setup on a stock at 2:30 PM. It has already moved $4 from its low and averages $3 per day. You should:", choices:["Skip it or reduce size significantly — the stock is beyond its average daily range","Enter full size since the setup is valid regardless of how much it has already moved","Enter only if you can set a stop tight enough to limit risk to 0.5%","Enter since afternoon setups are always higher probability than morning setups"], answer:0, hint:"It has already exceeded its average daily energy. What are the odds of another big move?" }
      ]},
      { id:"i6", variants:[
        { q:"A stock is extended after running 30% from its base. Buying it is dangerous because:", choices:["Your stop must be very wide to be below support, creating excessive risk — and profit-taking creates sharp reversals","Extended stocks have confirmed momentum and are actually the safest entries","Only dangerous if the float is above 50 million shares — low float extended stocks are fine to buy","Extended means nothing without a catalyst — always check news before deciding"], answer:0, hint:"If the stock is far from support, where does your stop go? What happens to dollar risk?" },
        { q:"What makes buying an extended stock so risky compared to buying a proper setup?", choices:["Stop must be placed very wide below real support — large dollar risk — and early buyers taking profits create sharp reversals","Extended stocks always have catalysts that justify the entry regardless of distance from base","The risk is only psychological — the setup mechanics are identical to any other entry","Extended stocks are risky only for new traders — experienced traders can time the entries perfectly"], answer:0, hint:"Two problems: your stop needs to be huge, and people who bought lower are waiting to sell." },
        { q:"The correct approach after missing an extended move is:", choices:["Wait for a new base to form before entering — patience for the right entry, not chasing","Chase it with a tight stop since you need to capture what is left of the move","Short it immediately since extended stocks always reverse sharply","Enter half your normal size so the risk of chasing is cut in half"], answer:0, hint:"Extended stocks need to rest before the next move. Wait for the base." }
      ]},
      { id:"i7", variants:[
        { q:"What makes a gap with a catalyst behave differently from a gap without one?", choices:["Catalyst gaps are validated by institutions who react to real news — no-catalyst gaps tend to fade on open","Both behave identically — the gap percentage determines whether it holds or fades","No-catalyst gaps are more reliable since they are purely technical without news uncertainty","Catalyst gaps always reverse immediately after open while no-catalyst gaps continue higher"], answer:0, hint:"Who drives sustained moves in the market? Do they react to charts or to news?" },
        { q:"Two stocks gap up 8%. One beat earnings expectations. One has no news. How do you treat them differently?", choices:["Earnings beat gets Gap and Go consideration — no-news gap gets fade consideration after the open","Both are treated identically — the chart pattern matters more than the fundamental reason","The no-news gap is more interesting since it shows pure technical strength","Avoid both since gaps are always dangerous regardless of whether there is a catalyst"], answer:0, hint:"Institutional money chases real news. Without news, who is pushing the pre-market price?" },
        { q:"Why do no-catalyst gaps tend to fade quickly once the market opens?", choices:["They are driven by thin pre-market conditions — real volume at open reveals that demand does not support the move","Algorithms are programmed to fade all gaps at the open regardless of catalyst","No-catalyst gaps are actually stronger since they are not subject to buy-the-rumor-sell-the-news dynamics","They fade because retail traders cannot hold positions through the volatile open period"], answer:0, hint:"Pre-market is thin. Who is actually driving the move? What happens when real volume shows up?" }
      ]},
      { id:"i8", variants:[
        { q:"Before trading a pre-market gapper, the four things you must know are:", choices:["Catalyst, float, key levels (pre-market high and prior close), and pre-market volume","Just the catalyst and the percentage gap — other info can be gathered after open","Float, short interest, options chain, and analyst ratings","Pre-market high and prior close only — two levels are sufficient to trade any gapper"], answer:0, hint:"Why is it moving, how many shares exist, where are the key prices, who is participating?" },
        { q:"You find a stock gapping up 15% pre-market. What is the first thing you check?", choices:["The catalyst — what specific news is driving the move and is it real and significant","The float — low float stocks with big gaps are always the highest probability setups","The pre-market high — that level determines your entry regardless of the news","The options chain to see if unusual activity predicted the gap the day before"], answer:0, hint:"Before anything else — WHY is it moving? Is the reason legitimate?" },
        { q:"A gapper has a strong catalyst and a low float. What is still missing from your pre-market research?", choices:["Key price levels and pre-market volume — you need all four elements before trading","Nothing — catalyst and float are the only two factors that matter for gappers","Short interest — without knowing the short float you cannot trade any gapper","After-hours chart history — you need to see exactly when the news hit and how price reacted"], answer:0, hint:"You have two of four. What are the other two?" }
      ]},
      { id:"i9", variants:[
        { q:"A stock has already run 25% in the first hour. You should:", choices:["Remove it from your active watchlist and focus on fresh setups with unused daily range","Keep watching it closely since big movers often make a second major move in the afternoon","Short it immediately since extended stocks always reverse after their initial move","Enter a small position to stay involved in case the stock continues higher all day"], answer:0, hint:"A stock only has so much energy per day. Once it has moved, where is your attention better focused?" },
        { q:"Why should you remove a big mover from your active watchlist after it has made its move?", choices:["Its daily range is largely consumed — continuing to watch it pulls attention from fresh high-probability setups","Big movers deserve the most attention since they prove the most liquidity and participation","Removing it means you will miss the inevitable afternoon continuation move","You should always track your watchlist stocks for the full session regardless of how much they have moved"], answer:0, hint:"Attention is limited. Where is it most valuable — on a stock that has moved or one that has not yet?" },
        { q:"What is the danger of continuing to trade a stock that has already made its big move?", choices:["Overtrading it in the chop — getting chopped up on small noise after the real move is done","Missing the second leg which is often bigger than the first","Letting other stocks run while you are focused on a mover — opportunity cost only","There is no danger — high-volume stocks trade cleanly all day once they establish momentum"], answer:0, hint:"What does a stock look like after it has spent its daily energy? Is that good trading?" }
      ]},
      { id:"i10", variants:[
        { q:"Confluence in trading means:", choices:["Multiple independent factors all pointing to the same trade at the same time","Two moving averages crossing on the same chart","Any setup that has worked three or more times in the past week","A pattern confirmed by both price action and a single indicator"], answer:0, hint:"Each factor alone gives you some edge. Multiple factors pointing the same way multiply that edge." },
        { q:"An example of a high-confluence long setup would be:", choices:["Bull flag breakout at prior resistance turned support with above-average volume and QQQ above VWAP","Any green candle appearing when the stock is above its 50-day moving average","A stock gapping up regardless of catalyst with RVOL above 1.5x","Price touching the 9 EMA on three consecutive candles in an uptrend"], answer:0, hint:"Stack the factors. How many things are saying the same thing at the same time?" },
        { q:"Why does confluence increase the probability of a trade working?", choices:["Multiple independent reasons to be in the trade mean more forces pushing price in your direction","Confluence is a psychological trick — the actual probability is the same regardless of how many factors align","It reduces win rate but increases average winner size which improves overall expectancy","Confluence only matters in range-bound markets — trending markets do not require multiple confirmations"], answer:0, hint:"If five independent factors all agree, is that better than one factor alone?" }
      ]},
      { id:"i11", variants:[
        { q:"The difference between a setup and a signal is:", choices:["Setup is the condition that makes a trade possible — signal is the trigger confirming the move is happening","They are the same thing — setup and signal are interchangeable terms in trading","Setup is for swing traders and signal is for day traders — different timeframes use different terminology","A setup is a confirmed trade and a signal is a potential trade that needs more confirmation"], answer:0, hint:"A setup is the loaded gun. A signal is when it actually fires. When do you act?" },
        { q:"Why does entering on a setup instead of a signal cost most traders money?", choices:["You are entering before the move is confirmed — you are predicting rather than reacting to confirmed momentum","Setups always have better entries than signals — waiting for signals means buying at the high","Signals are less reliable than setups because they occur after the best price has passed","There is no difference in outcome — entry timing matters far less than stop placement"], answer:0, hint:"What has actually happened when you enter on a setup? What has happened when you wait for a signal?" },
        { q:"A bull flag is forming but has not broken out yet. The correct action is:", choices:["Wait for the breakout candle to close above the flag high before entering — that is your signal","Enter now since the setup is clear and waiting for the signal means a worse entry","Enter half size now and add the rest when the signal triggers","Enter immediately since the longer you wait the higher the entry will be"], answer:0, hint:"Has the move started yet? Or are you predicting that it will?" }
      ]},
      { id:"i12", variants:[
        { q:"Why do many experienced traders avoid trading in the first 5 minutes of market open?", choices:["Pre-market orders flood in, stop hunts occur, and real direction is unclear until the opening chaos settles","The first 5 minutes have the best setups but most traders lack the skill to execute them","Spreads are too wide in the first 5 minutes to enter positions profitably","FINRA regulations restrict pattern day traders from entering positions in the first 5 minutes"], answer:0, hint:"Think about how many orders have been sitting overnight waiting to hit at 9:30." },
        { q:"What makes the first 5 candles of the trading day uniquely dangerous?", choices:["Overnight order imbalances, stop hunts, and wild price swings before true direction is established","The first 5 candles define the trend for the rest of the day — entering early means predicting the trend","Market makers widen spreads to extreme levels only during the first 5 minutes","High-frequency traders dominate the first 5 minutes making it impossible for humans to compete"], answer:0, hint:"Every order from overnight is hitting at once. What does that do to price?" },
        { q:"What is the primary benefit of watching the first 5 candles without trading them?", choices:["You establish the opening range and directional bias before committing capital during the most unpredictable window","You avoid paying the wide spreads that only exist in the first 5 minutes","You get a better entry by waiting for the second candle pattern to confirm direction","Watching without trading is never beneficial — the first 5 minutes have the most opportunity"], answer:0, hint:"What information do those first 5 candles give you before you risk capital?" }
      ]},
      { id:"i13", variants:[
        { q:"The opening range is:", choices:["The high and low established in the first 15-30 minutes — a break above is bullish, break below is bearish","The gap between prior close and opening price used to set gap fill targets","The average of the first five candles used as a VWAP substitute early in the session","The distance from the pre-market high to pre-market low — only relevant for gap trades"], answer:0, hint:"The opening range is where the first battle of the day was fought. That battlefield becomes reference all day." },
        { q:"How do traders use the opening range throughout the rest of the day?", choices:["As a reference for directional bias — breaks above the OR high are bullish, breaks below the OR low are bearish","Only as a target for the first trade of the session — once broken it becomes irrelevant","As the primary support and resistance levels that override all other technical analysis for that day","The opening range is only useful in the first two hours — after midday different levels take over"], answer:0, hint:"The opening range high and low are levels the market established with high participation. They stay meaningful." },
        { q:"A stock establishes a $52.40 high and $51.20 low in the first 30 minutes. At 1:00 PM it breaks above $52.40 on volume. This is:", choices:["A bullish breakout above the opening range — a potential long entry with stop below $52.40","A bearish signal since price spent most of the day below the opening range high","Irrelevant since opening range levels lose their significance after the first two hours","A gap fill signal — price is now filling the gap from the opening range to pre-market levels"], answer:0, hint:"Break above the opening range high on volume. What does that tell you about direction?" }
      ]},
      { id:"i14", variants:[
        { q:"Experienced traders reduce size or stop trading from 11:30 AM to 2:00 PM because:", choices:["Institutional volume drops sharply — moves become random and choppy, momentum strategies fail more often","Market manipulation is most common during midday making it impossible to trade technically","News events are most likely to hit during lunch hours creating unpredictable gaps","Tax rules require institutional funds to pause trading during a midday window"], answer:0, hint:"Remove the institutions from the market. Who is left trading and what does their behavior look like?" },
        { q:"What specifically happens to price action during midday that makes setups less reliable?", choices:["Without institutional participation moves are smaller, more random, and breakouts fail at a much higher rate","Price action is actually cleaner during midday since retail traders are more disciplined than institutions","Only small cap stocks are unreliable during midday — large caps and ETFs trade normally all day","Midday is only dangerous on options expiration days when gamma forces extreme price movements"], answer:0, hint:"Institutional volume drives clean directional moves. Without it, what drives price?" },
        { q:"You are up $600 at 11:50 AM. The best decision is usually to:", choices:["Protect your gains — midday conditions are choppy and the odds of giving back profits are high","Keep trading aggressively since you are in a rhythm and should maximize the profitable session","Only take A+ setups at reduced size to stay in the game while managing risk","Continue trading at full size since your read on the market is clearly working today"], answer:0, hint:"Protecting a profitable morning from a choppy afternoon is a skill most traders never develop." }
      ]},
      { id:"i15", variants:[
        { q:"Power hour (3:00-4:00 PM) typically sees increased volume because:", choices:["Institutional funds make final position adjustments before close and index funds rebalance — creates strong directional moves","Retail traders return to their screens after lunch and create a surge in participation","Automated trading systems run their daily programs in the final hour of every session","Options traders close all intraday positions by 4:00 PM creating forced buying and selling"], answer:0, hint:"Think about what large funds need to do before the market closes every day." },
        { q:"What type of price action typically occurs during power hour?", choices:["Moves tend to accelerate in the direction of the day's existing trend as institutional orders hit the market","Power hour always reverses the day's trend as institutions take the opposite side of retail positions","Price action becomes completely random during power hour with no tradeable patterns","Power hour only produces significant moves on options expiration Fridays"], answer:0, hint:"Institutional orders flowing in the same direction as the day's trend. What happens to that trend?" },
        { q:"A stock has been strong all day. As power hour begins what do you typically expect?", choices:["Continued strength or acceleration — institutions making end-of-day adjustments tend to amplify existing trends","A sharp reversal as institutional funds take profits after holding all day","Completely neutral price action since institutions wait until after-hours to make large moves","A slowdown as volume decreases in the final hour while traders close their positions"], answer:0, hint:"Strong stocks in strong uptrends get institutional buying in power hour. What does that do to the trend?" }
      ]},
      { id:"i16", variants:[
        { q:"Selling into strength means:", choices:["Taking profits while buyers are still aggressive rather than waiting for exact targets and risking a reversal","Only selling when the stock is at a 52-week high showing maximum strength","Selling when the RSI is above 70 indicating overbought conditions","Holding through the entire move and only selling after the stock shows clear weakness"], answer:0, hint:"It is easier to sell when there are aggressive buyers. What happens to liquidity after the move is over?" },
        { q:"Why is selling into strength better than waiting for an exact price target?", choices:["You get better fills while buyers are aggressive — waiting for the exact target risks a reversal with worse liquidity","You always get a better price at the exact target since the stock must be strongest to reach it","Selling into strength is actually worse — you consistently leave money on the table by exiting early","It is only better for short sellers — long traders should always hold to their exact target"], answer:0, hint:"What does the bid-ask look like when a stock is moving hard versus when it has stopped?" },
        { q:"A stock is running hard toward your $55 target. It hits $54.80 and shows the first sign of slowing. You should:", choices:["Sell into the strength at $54.80 — better fill with active buyers than risking a reversal at $55","Wait for $55 exactly — exiting early trains you to take less than you planned","Hold until $55 then sell — your analysis was correct and you should honor the target","Add to the position since it is approaching the target with momentum behind it"], answer:0, hint:"Active buyers at $54.80 versus a reversal before $55. Which outcome is more common?" }
      ]},
      { id:"i17", variants:[
        { q:"You should switch from a fixed stop to a trailing stop when:", choices:["The trade has moved 1.5-2x your original risk in your favor and first target is hit — now protecting profits","As soon as you enter the trade — trailing stops are always better than fixed stops","After 30 minutes of holding — time-based switching is more reliable than price-based switching","When the stock approaches a major resistance level — protect profits before potential selling pressure"], answer:0, hint:"Once you have significant profit, the goal changes from managing risk to locking in gains." },
        { q:"What is a trailing stop and why is it more appropriate later in a trade than at entry?", choices:["A stop that moves with price to lock in gains — more appropriate later because you are now protecting profits not defining risk","A stop placed at a fixed percentage below the high of the day — used from the moment you enter","A stop only used by algorithmic traders — manual traders should always use fixed stops","A mental stop only — trailing stops should never be placed as actual orders with your broker"], answer:0, hint:"At entry you are defining risk. Later in a winning trade you are protecting gains. Different goal, different tool." },
        { q:"Your trade is up 2.5x your original risk. You move your stop from the original level to below the last swing low. This is:", choices:["A trailing stop — you are locking in gains while still giving the trade room to continue","A time stop — you are planning to exit after a fixed time regardless of price","A momentum stop — you are exiting on the first sign of momentum slowing","A breakeven stop — you are ensuring you cannot lose money on this trade"], answer:0, hint:"The stop moved with the price action to protect what you have built." }
      ]},
      { id:"i18", variants:[
        { q:"A stock fails to make a new high on a bounce. This signals:", choices:["Buyer momentum is weakening — the first sign of potential trend change, tighten stops on longs","A normal consolidation pattern before a powerful breakout to new highs","Nothing significant — stocks never go straight up and one failed attempt is noise","A perfect short entry — failed new highs always lead to immediate breakdowns"], answer:0, hint:"If buyers could not push it back to the previous high, what does that tell you about demand?" },
        { q:"Price reached $58, pulled back, bounced to $57.20, then started falling again. What does the failed new high tell you?", choices:["Sellers stepped in earlier — buyers lost enough strength to push back to the prior high — warning signal","Healthy consolidation — the stock is gathering energy for a move above $58","An excellent long entry since the slight pullback from $58 creates a better risk reward","The $57.20 level is now strong resistance and a short opportunity is forming there"], answer:0, hint:"Lower high means sellers stepped in earlier than last time. What direction is momentum going?" },
        { q:"If you are long a stock and it fails to make a new high on the second bounce attempt, you should:", choices:["Tighten your stop or begin taking partial profits — the trend structure is starting to deteriorate","Hold confidently — one failed new high is not enough data to change your position thesis","Add to your position since the slight weakness creates a better average entry price","Short the same stock immediately since failed new highs always precede sharp reversals"], answer:0, hint:"The first sign of trend deterioration is not always the last chance to act. Tighten accordingly." }
      ]},
      { id:"i19", variants:[
        { q:"The 9 EMA functions as dynamic support in an uptrend because:", choices:["Price repeatedly pulls back to touch it and bounces — rising with the trend it gives progressively better entries","It is a fixed level that institutions program into their buy algorithms at the start of each day","It calculates the exact midpoint between the high and low of the last 9 candles","The 9 EMA is where market makers place their buy programs to support trending stocks"], answer:0, hint:"Dynamic means it moves with the trend. How does that make it more useful than a static line?" },
        { q:"A stock in a strong 5-minute uptrend keeps touching the 9 EMA and bouncing. How do you use this?", choices:["Buy touches of the 9 EMA with a stop just below it — the stock's behavior gives you a tight, repeatable entry","Sell every time price touches the 9 EMA since it always reverses there — trade the touches as a short","Only use this information to confirm direction — never use the 9 EMA as an actual entry trigger","Wait for three consecutive bounces from the 9 EMA before entering to confirm the pattern is real"], answer:0, hint:"If you know where a stock reliably bounces, how does that create an opportunity?" },
        { q:"Why is a 9 EMA pullback entry often better than entering on the breakout?", choices:["Better price with tighter stop — waiting for the pullback to the 9 EMA means less risk and better risk reward","Breakout entries are always superior — momentum is confirmed and the move has proven itself","The 9 EMA entry is only better if the stock has been in an uptrend for at least 5 consecutive days","There is no difference — entry at the breakout or at the pullback produces identical risk reward outcomes"], answer:0, hint:"Would you rather enter at the top of a breakout candle or at support with a tight stop below it?" }
      ]},
      { id:"i20", variants:[
        { q:"The 9 EMA crossing below the 20 EMA on a 5-minute chart signals:", choices:["Bearish momentum shift — short-term price action weakening, tighten stops on longs or consider exit","A bullish signal — the two averages are compressing before an explosive move higher","Completely neutral — moving average crosses on 5-minute charts have no predictive value","A buy signal — the 9 EMA dipping below the 20 creates the best risk reward long entry"], answer:0, hint:"When the faster average falls below the slower one, what direction is short-term momentum pointing?" },
        { q:"What does it mean when the short-term moving average crosses below the medium-term average during a session?", choices:["Short-term price action has weakened below the broader trend — warns of potential trend change","The stock is consolidating before continuing higher — add to long positions on the cross","The stock is range-bound and the cross is just a technical artifact with no directional meaning","Buy the cross aggressively — stocks that dip their 9 below their 20 always reverse sharply upward"], answer:0, hint:"The faster average is now below the slower average. What does that say about recent price action?" },
        { q:"You are long a stock and see the 9 EMA cross below the 20 EMA mid-session. Your response:", choices:["Tighten stop or take partial profits — the momentum signal has turned bearish within the session","Hold with no changes since one moving average cross is not enough to alter your thesis","Add to the position since the cross is creating a better average entry price","Exit immediately since 9/20 EMA crosses always lead to significant drops the same session"], answer:0, hint:"The signal is telling you something changed. How do you respond without overreacting?" }
      ]},
      { id:"i21", variants:[
        { q:"Why do the 50 SMA and 200 SMA matter to intraday day traders?", choices:["Institutions use them as buy and sell reference points — approaching these on the daily chart creates real order flow","They do not matter — only intraday moving averages like the 9 and 20 EMA are relevant for day traders","They only matter on the last day of each month when funds rebalance based on these averages","They are useful only as directional filters — never as actual support or resistance levels for entries"], answer:0, hint:"These averages matter because of WHO watches them, not the math behind them." },
        { q:"A stock approaches its 200-day SMA on the daily chart. As a day trader, how does this affect you?", choices:["Expect a real price reaction — institutional sell orders cluster at major daily moving averages creating resistance","Ignore it completely — daily chart levels are irrelevant for intraday trading decisions","It signals a guaranteed bounce — the 200 SMA always provides support on the first test","Avoid trading the stock that day since major moving average tests always create unpredictable volatility"], answer:0, hint:"Institutions watch these levels. Where institutions place orders is where price reacts." },
        { q:"Why would a day trader going long run into trouble if they ignore a stock's 200-day SMA?", choices:["They might enter a long position right as massive institutional sell orders at the 200 SMA create a wall of resistance","The 200 SMA creates volatility that benefits long positions since big moves happen near major averages","Institutions never sell at the 200 SMA — they only use it as a buy signal","Day traders never hold long enough for daily chart levels to affect their intraday positions"], answer:0, hint:"If you do not see the wall, you will run straight into it." }
      ]},
      { id:"i22", variants:[
        { q:"A valid Gap and Go setup requires:", choices:["Real catalyst, above-average pre-market volume, and price holding above the pre-market high after the open","Gap size above 5%, float below 20 million, and sector confirmation from two similar stocks","Positive earnings, analyst upgrade, and RVOL above 3x in the first 10 minutes","Gap above prior day high, VWAP reclaim within 10 minutes, and RSI above 60 on the 5-minute chart"], answer:0, hint:"Why did it gap, who is participating, and is it still showing strength after the open?" },
        { q:"What separates a valid Gap and Go from a gap that will fade at the open?", choices:["Real specific catalyst, institutional pre-market volume, and the stock continuing to hold gains after open — not fading","The size of the gap — gaps above 10% always hold while gaps below 5% always fade","The float — any gap on a stock under 10 million shares is a valid Gap and Go regardless of other factors","The time the news hit — pre-midnight catalysts create stronger gaps than early morning catalysts"], answer:0, hint:"Three things make a Gap and Go valid. Which answer covers all three?" },
        { q:"A stock gaps up 12% on earnings but immediately fades below the pre-market high at the open. What does this tell you?", choices:["The Gap and Go is invalid — buyers are not defending the gap, it may become a fade-the-gap trade instead","Enter immediately since the fade is a gift — the stock will recover and continue higher","The catalyst was not strong enough — only gaps above 15% hold in the current market","Short immediately since any stock that fades below its pre-market high on earnings will drop hard"], answer:0, hint:"One of the three conditions for a Gap and Go failed. What does that mean for the trade thesis?" }
      ]},
      { id:"i23", variants:[
        { q:"A VWAP reclaim entry is high probability because:", choices:["VWAP is the institutional benchmark — when price reclaims it, institutional buyers are re-entering and defending the level","VWAP reclaims always lead to moves of at least 2x the distance from the VWAP to the prior low","It only works on stocks with above-average float where institutional presence is guaranteed","VWAP reclaims are high probability only in the first 30 minutes when VWAP is most accurate"], answer:0, hint:"VWAP is where institutions measure their performance. What does it mean when price gets back above that benchmark?" },
        { q:"What is the entry trigger and stop placement on a VWAP reclaim trade?", choices:["Enter on first candle close above VWAP with volume — stop goes below VWAP where the thesis breaks","Enter the moment price touches VWAP — stop goes 2% below the entry price","Enter when price has been above VWAP for at least 3 consecutive candles — stop at VWAP","Enter on the candle that loses VWAP — stop below the prior swing low with target at VWAP reclaim"], answer:0, hint:"Entry is confirmation of the reclaim. Stop is where the reclaim would be proven false." },
        { q:"What makes a VWAP reclaim different from any other support level bounce?", choices:["VWAP represents where the most volume has traded — institutional funds use it as their benchmark making it self-fulfilling","VWAP reclaims are statistically superior to all other support bounces due to algorithmic volume at that level","There is no meaningful difference — VWAP is just another support level no different from a horizontal price level","VWAP reclaims are only significant on heavily traded ETFs like SPY and QQQ — not individual stocks"], answer:0, hint:"Why do institutions specifically watch VWAP? What does that watching create?" }
      ]},
      { id:"i24", variants:[
        { q:"What conditions make a dip buy valid instead of catching a falling knife?", choices:["Trend still intact, price showing stabilization at a defined support level before you enter — not still in freefall","Any pullback of more than 5% from the day's high qualifies as a valid dip buy in a strong uptrend","Buy the dip immediately when price drops to VWAP regardless of how fast it fell","Dip buys are only valid after 10 AM — pre-10 AM dips are always falling knives"], answer:0, hint:"A dip buy needs a floor to stand on. Without stabilization at support you are guessing." },
        { q:"What is the specific difference between a dip buy and catching a falling knife?", choices:["A dip buy has a defined support level and price stabilizing — a falling knife is still in freefall with no support nearby","A dip buy is any entry below the day's high — a falling knife is when the stock is down more than 10%","A dip buy is long — a falling knife is when you accidentally go short on a rising stock","There is no meaningful difference — the terms describe the same action with different emotional connotations"], answer:0, hint:"One has a floor. The other does not. That floor is what makes it a trade and not a guess." },
        { q:"A stock you like has dropped 12% in 20 minutes and is still actively selling off. Your move is:", choices:["Wait — no stabilization and no defined support means this is a falling knife, not a dip buy","Buy immediately since 12% down is an extreme reading and mean reversion is highly probable","Short it since the momentum is clearly bearish and you should follow the direction","Set a limit order 5% below current price since it will likely continue dropping before reversing"], answer:0, hint:"Still actively selling off with no stabilization. Which condition of a valid dip buy is missing?" }
      ]},
      { id:"i25", variants:[
        { q:"The FOMC announces at 2:00 PM today. You should:", choices:["Trade lighter in the morning, take profits early, go flat by 1:30 PM, then wait 15-30 minutes after the announcement before re-entering","Trade normally until 2:00 PM then double size to capitalize on post-announcement volatility","Avoid trading the entire day since FOMC days are always unpredictable and no setups are valid","Only trade after the announcement — morning trading on FOMC days is completely unaffected by the upcoming news"], answer:0, hint:"Binary events create binary outcomes. How do you protect yourself when you cannot predict which way it goes?" },
        { q:"Why is holding a position through an FOMC announcement considered high risk?", choices:["The market can move violently in either direction regardless of the actual decision — even a correct guess can be punished","FOMC announcements always move the market in the direction opposite to the prior trend","Only leveraged positions like options are risky through FOMC — stock positions are safe to hold","FOMC risk only exists for interest rate sensitive stocks like banks — tech and growth stocks are unaffected"], answer:0, hint:"The announcement can cause violent moves in both directions. Which direction? Nobody knows." },
        { q:"After the FOMC announcement causes an initial violent spike, the correct approach is:", choices:["Wait 15-30 minutes for the volatility to settle before entering new positions in the post-announcement direction","Enter immediately in the direction of the initial spike since that always becomes the sustained direction","Short the initial spike since FOMC announcements always reverse after the initial reaction","Exit all remaining positions immediately since the session is over after a major announcement"], answer:0, hint:"Initial reactions are often whipsaw. Let the dust settle before committing capital." }
      ]}  ]
  },

options: {
    title: "Options Mastery Test",
    section: "options",
    passingScore: 75,
    questions: [
      { id:"op1", variants:[
        { q:"What does buying a call option give you the right to do?", choices:["Sell 100 shares at the strike price before expiration","Buy 100 shares at the strike price before expiration","Receive a dividend payment","Short the stock at market price"], answer:1, hint:"A call gives you the right to BUY. A put gives you the right to SELL." },
        { q:"You buy a $50 call on a stock currently at $48. This option is:", choices:["In the money","Out of the money","At the money","Deep in the money"], answer:1, hint:"Strike price above current price on a call = out of the money. You need the stock to move to your strike first." },
        { q:"A call option expires worthless when:", choices:["The stock closes above the strike price","The stock closes below the strike price at expiration","You sell it before expiration","Implied volatility increases"], answer:1, hint:"Calls only have value if the stock is above the strike at expiration. Below = worthless." }
      ]},
      { id:"op2", variants:[
        { q:"Delta of 0.50 on a call option means:", choices:["The option will expire in 50 days","For every $1 the stock moves up, the option gains roughly $0.50","The option has a 50% chance of being worthless","You need 50 shares to hedge it"], answer:1, hint:"Delta measures how much the option price moves per $1 move in the underlying stock." },
        { q:"Which Greek measures the rate at which an option loses value as time passes?", choices:["Delta","Gamma","Theta","Vega"], answer:2, hint:"Theta is time decay. Every day that passes costs you money as an option buyer." },
        { q:"You are long calls and there are 3 days to expiration. Theta is working:", choices:["In your favor since less time means more urgency","Against you aggressively since decay accelerates near expiration","Neutrally since theta only matters on puts","In your favor only if implied volatility is rising"], answer:1, hint:"Theta decay is not linear. It accelerates dramatically in the final days before expiration." }
      ]},
      { id:"op3", variants:[
        { q:"Implied volatility (IV) measures:", choices:["How much the stock has moved historically","The market's expectation of future price movement baked into option premiums","The number of days until expiration","Whether the option is in or out of the money"], answer:1, hint:"IV is forward-looking. High IV = expensive options. Low IV = cheap options." },
        { q:"You buy calls right before an earnings announcement when IV is very high. The stock moves up 5% but your options lose value. Why?", choices:["You bought puts by mistake","IV crush — implied volatility collapsed after the announcement removing premium from your options","The delta was too low","You should have bought weekly options instead"], answer:1, hint:"This is IV crush. The event removes uncertainty. Options become cheaper even if the stock moves your way." },
        { q:"When is it generally better to BUY options versus SELL options?", choices:["When implied volatility is very high","When implied volatility is very low — options are cheap and you have room to expand","Always buy, never sell","When you expect the stock to stay flat"], answer:1, hint:"Buy options when IV is low = cheap premium. Sell options when IV is high = collect expensive premium." }
      ]},
      { id:"op4", variants:[
        { q:"A $5 option contract controls how many shares?", choices:["5 shares","50 shares","100 shares","500 shares"], answer:2, hint:"Every standard option contract represents 100 shares. So a $5 option costs $500 total." },
        { q:"You buy a call with a strike of $100 and the stock is at $110 at expiration. Your intrinsic value is:", choices:["$0","$5","$10","$110"], answer:2, hint:"Intrinsic value = stock price minus strike price for calls. $110 - $100 = $10 per share = $1,000 per contract." },
        { q:"What is the maximum loss when BUYING an option?", choices:["Unlimited","The full premium paid","The difference between strike and current price","50% of the premium paid"], answer:1, hint:"As a buyer your maximum loss is always capped at what you paid for the option. That is your defined risk." }
      ]},
      { id:"op5", variants:[
        { q:"LEAPs are options with expiration dates:", choices:["Within the current week","Within 30 days","More than one year away","Exactly 90 days out"], answer:2, hint:"LEAPs = Long-term Equity Anticipation Securities. They give you a long runway for your thesis to play out." },
        { q:"Why are LEAPs useful for directional trades on strong companies?", choices:["They have higher delta than short-term options","They give you time for the thesis to develop without theta destroying your position quickly","They are always cheaper than short-term options","They cannot expire worthless"], answer:1, hint:"LEAPs are slower theta decay. You have a year or more for the stock to move your way." },
        { q:"The biggest risk of buying far out-of-the-money options is:", choices:["Limited upside potential","You need a very large move just to break even and they expire worthless most of the time","They are too expensive","The broker requires special approval"], answer:1, hint:"OTM options are cheap for a reason. The stock needs a massive move just to reach your strike. Most expire at zero." }
      ]},
      { id:"op6", variants:[
        { q:"Proper position sizing for options means risking no more than:", choices:["50% of your account on any single option trade","5-10% of your account on any single option position","Whatever the broker allows based on margin","The same dollar amount as your stock trades regardless of leverage"], answer:1, hint:"Options can go to zero. Never risk more than you can afford to lose completely. 5-10% per trade is the discipline." },
        { q:"You have a $20,000 account and want to buy call options. Using a 5% risk rule your maximum loss on this trade should be:", choices:["$2,000","$1,000","$500","$200"], answer:1, hint:"5% of $20,000 = $1,000. That is the maximum premium you should spend because options can go to zero." },
        { q:"Which approach has better defined risk?", choices:["Buying 10 contracts of a $0.50 option","Buying 2 contracts of a $2.50 option","Both have the same risk","Neither has defined risk"], answer:0, hint:"Same total cost at $500 each. But 10 contracts at $0.50 is riskier because it is further OTM and more likely to expire worthless." }
      ]}
    ]
  },

  longterm: {
    title: "Long-Term Investing Mastery Test",
    section: "longterm",
    passingScore: 75,
    questions: [
      { id:"lt1", variants:[
        { q:"The primary goal of fundamental analysis is to:", choices:["Predict short-term price movements","Determine the intrinsic value of a business to decide if the current price is a good deal","Find stocks with high volume and momentum","Identify breakout patterns on weekly charts"], answer:1, hint:"Fundamentals answer: is this a good business and is it priced fairly? Everything else follows." },
        { q:"A stock with a P/E ratio of 8 versus an industry average of 25 suggests:", choices:["The stock is overvalued and should be avoided","The stock may be undervalued or there is a serious problem with the business","The company has high growth potential","The stock will definitely outperform"], answer:1, hint:"Low P/E versus peers is a starting point not a conclusion. It means dig deeper — cheap or broken?" },
        { q:"Revenue growth year over year of 30% with improving profit margins tells you:", choices:["The company is growing and becoming more efficient — a positive fundamental signal","The company is spending too much","Growth without profitability is always a red flag","This only matters for tech stocks"], answer:0, hint:"Revenue growth plus expanding margins = the business is scaling efficiently. That is what you want to own." }
      ]},
      { id:"lt2", variants:[
        { q:"The best time to buy a fundamentally strong stock using technical analysis is:", choices:["At all-time highs regardless of chart structure","At a key support level or during a controlled pullback to a major moving average","When it has already moved up 50% from its base","Immediately when you complete your fundamental research"], answer:1, hint:"Fundamentals tell you WHAT to buy. Technicals tell you WHEN. Waiting for a good entry improves your R:R significantly." },
        { q:"A stock you researched and love fundamentally drops 15% on no news. You should:", choices:["Sell immediately to avoid further losses","Panic and assume you missed something","Revisit your thesis — if nothing changed this could be a better buying opportunity","Add aggressively to your position immediately"], answer:2, hint:"Price drops without news changes are often gifts. But always re-check the thesis first before adding." },
        { q:"Technical analysis adds value to long-term investing by helping you:", choices:["Replace fundamental research entirely","Time your entries and exits to avoid buying at extended highs or adding during breakdowns","Identify daily momentum for quick trades","Determine earnings per share growth rates"], answer:1, hint:"Buying a great company at the wrong price still costs you. Technicals help you not overpay." }
      ]},
      { id:"lt3", variants:[
        { q:"Portfolio diversification primarily helps you:", choices:["Maximize returns by owning more stocks","Reduce the impact of any single position going wrong on your total portfolio","Eliminate all market risk","Trade more frequently with lower risk per trade"], answer:1, hint:"Diversification does not maximize returns. It reduces the damage a single bad call can do to your overall portfolio." },
        { q:"You own 15 stocks all in the same sector. Your portfolio is:", choices:["Well diversified because you own 15 different companies","Not diversified — sector concentration means they will all move together in a downturn","Too small to be considered a real portfolio","Optimally positioned for sector rotation"], answer:1, hint:"True diversification means different sectors, different business types. 15 tech stocks is not diversification." },
        { q:"When should you SELL a long-term position?", choices:["Whenever the stock drops more than 5%","When the original thesis is broken, the company fundamentals deteriorate, or you find a clearly better opportunity","When it has been 12 months since you bought it","Only after it doubles so you take profits"], answer:1, hint:"Sell when the reason you bought it is no longer true. Not because of price alone." }
      ]},
      { id:"lt4", variants:[
        { q:"A company with strong revenue growth but consistent net losses is:", choices:["Always a bad investment and should be avoided","A potential investment if growth is accelerating and the path to profitability is clear","Always a great buy since growth is all that matters","Only appropriate for day traders not long-term investors"], answer:1, hint:"Many great companies lost money early. Amazon lost money for years. Context and trajectory matter more than current profits." },
        { q:"The difference between short-term capital gains and long-term capital gains tax rates creates an incentive to:", choices:["Trade as frequently as possible to compound faster","Hold positions for more than one year to qualify for the lower long-term rate","Sell all positions before year end regardless of performance","Only buy dividend stocks"], answer:1, hint:"Positions held over 12 months qualify for long-term capital gains rates which are significantly lower than ordinary income rates." },
        { q:"Dollar cost averaging means:", choices:["Buying exactly $1 worth of stock per trade","Investing a fixed dollar amount at regular intervals regardless of price","Only buying when price drops below your average cost","Averaging down on losing positions"], answer:1, hint:"DCA removes the pressure of timing the market perfectly. You buy more shares when cheap and fewer when expensive." }
      ]}
    ]
  },

  advanced: {
    title: "Advanced Concepts Mastery Test",
    section: "advanced",
    passingScore: 80,
    questions: [
      { id:"adv1", variants:[
        { q:"Pre-market preparation should always include:", choices:["Checking social media for hot tickers","Building a watchlist based on overnight news, gap ups and downs, and confirming setups with pre-defined entry levels and risk","Opening positions pre-market on your best ideas","Waiting for the market to open with no preparation"], answer:1, hint:"Your edge on open comes from preparation. Walking in without a plan means reacting instead of executing." },
        { q:"The most important thing to define BEFORE entering any trade is:", choices:["The price target","Your maximum loss — where you are getting out if wrong","The expected hold time","What other traders think about the setup"], answer:1, hint:"Risk first. Always. If you do not know your exit on the losing side before you enter, you are gambling." },
        { q:"A personal playbook should contain:", choices:["Every trading setup that exists regardless of whether you trade it","Only the specific setups you have tested and have positive expectancy in — your actual edge","General market rules from books","The setups your favorite trader uses"], answer:1, hint:"Your playbook is your edge. It should only contain what YOU have proven works for YOU. Not someone else's setups." }
      ]},
      { id:"adv2", variants:[
        { q:"Real price action reading means understanding:", choices:["What the indicators on your chart are telling you","How price is behaving in real time — where buyers and sellers are stepping in and out — not what the indicator says","The exact pattern name for every candle formation","What the chart will do next based on historical patterns"], answer:1, hint:"Price action is raw. It is the auction between buyers and sellers happening in real time. Indicators just describe what already happened." },
        { q:"A stock consolidates for 3 weeks in a tight range with declining volume then breaks out on 3x average volume. This tells you:", choices:["Sellers dried up during consolidation and buyers stepped in aggressively on the break — high conviction move","The stock is about to reverse since it moved too far too fast","Volume spikes always mean distribution and selling","The pattern is only valid if it occurs above the 200 day moving average"], answer:0, hint:"Volume contraction during consolidation = sellers gave up. Volume expansion on breakout = buyers in control." },
        { q:"The difference between a Level 1 and Level 2 trader is:", choices:["Level 2 traders use more indicators","Level 2 traders have moved beyond following rules to understanding WHY the rules work — they read the market not the pattern","Level 2 traders trade larger size","Level 2 traders have been trading for more than 5 years"], answer:1, hint:"Pattern recognition is Level 1. Understanding the supply and demand logic behind the pattern is Level 2." }
      ]},
      { id:"adv3", variants:[
        { q:"You have had 3 consecutive losing days. The most advanced response is:", choices:["Take a larger position on your next trade to recover faster","Cut your size in half and only take your A+ setups until you find your rhythm again","Stop trading for a full month","Switch strategies since your current approach is not working"], answer:1, hint:"Drawdowns call for smaller size not larger size. Protect capital first. Get back to green slowly with only your best setups." },
        { q:"A setup that works 70% of the time with a 1:1 R:R is:", choices:["A strong edge worth trading aggressively","Barely profitable and one slippage from breakeven — you need better R:R or higher win rate","Not worth trading since the win rate is not high enough","Better than a setup with 50% win rate and 3:1 R:R"], answer:1, hint:"EV = (0.70 × 1R) - (0.30 × 1R) = +0.40R. Barely positive. One bad streak erases weeks of gains. Better to improve R:R." },
        { q:"Your biggest edge as a retail trader over institutional traders is:", choices:["Access to better data and technology","Size — you can enter and exit positions without moving the market and can trade setups too small for institutions","More experience","Higher leverage limits"], answer:1, hint:"Institutions cannot trade small caps or small positions. Your size is your superpower. Use setups they cannot touch." }
      ]},
      { id:"adv4", variants:[
        { q:"Advanced small cap trading requires understanding that halts:", choices:["Only occur when a stock is going down","Can occur in either direction — circuit breaker halts happen on both big up and down moves — and create the most dangerous reentry points","Are always buying opportunities","Signal the end of a move"], answer:1, hint:"Halts create false breakouts and dangerous reentries. The move before the halt is often not the move that follows." },
        { q:"When building your advanced playbook, the most important metric to track per setup is:", choices:["Win rate alone","Expected value — the combination of win rate and average R:R ratio that tells you if you actually have edge","Number of trades taken","How the setup looks visually"], answer:1, hint:"Win rate without R:R means nothing. EV is the only honest measure of whether your setup has a real edge." },
        { q:"A trader with a 45% win rate averaging 2.5R on winners and 1R on losers has:", choices:["A losing edge since they win less than half their trades","A strong positive edge — EV = (0.45 × 2.5R) - (0.55 × 1R) = +0.575R per trade","A breakeven edge","An edge that only works in trending markets"], answer:1, hint:"Do the EV math. Win rate alone means nothing. 45% win rate with 2.5:1 R:R is a very profitable system over time." }
      ]},
      { id:"adv5", variants:[
        { q:"In a choppy low-volume market day the best advanced approach is:", choices:["Trade more frequently to find what is working","Reduce size significantly or sit out — choppy markets destroy P&L for active traders","Switch to swing trading for the day","Only trade the first 30 minutes then stop"], answer:0, hint:"Not every day is tradeable. Recognizing a choppy day early and protecting capital is an advanced skill most traders never develop." },
        { q:"The purpose of reviewing your trades every week is:", choices:["To feel good about your winners","To identify patterns in your mistakes and wins so you can reinforce what works and eliminate what does not","To calculate your tax liability","To update your social media with your performance"], answer:1, hint:"Weekly review is how you build your edge over time. Without it you repeat mistakes indefinitely." },
        { q:"Advanced swing traders hold positions overnight because:", choices:["They are lazy and do not want to monitor intraday","The daily chart is their primary timeframe and multi-day moves need time to develop — they accept overnight risk as part of the strategy","They cannot access their brokerage during market hours","Overnight holds are always safer than intraday"], answer:1, hint:"Swing traders trade the daily chart. The big moves play out over days and weeks. You cannot capture that in a single session." }
      ]}
    ]
  },

  swingtrading: {
    title: "Swing Trading Mastery Test",
    section: "swingtrading",
    passingScore: 75,
    questions: [
      { id:"sw1", variants:[
        { q:"The primary chart timeframe for swing trading decisions is:", choices:["1-minute chart for precise entries","Daily chart for setup identification with weekly chart for broader trend context","15-minute chart","Monthly chart only"], answer:1, hint:"Swing trading is about capturing moves that play out over days to weeks. The daily chart is your primary tool." },
        { q:"A swing trade breakout setup requires a candle close:", choices:["At any price above recent highs with any volume","Above a clearly defined resistance level with above-average volume on the daily chart","Above the 50-day moving average regardless of prior resistance","At a new 52-week high only"], answer:1, hint:"On the daily chart, a close above resistance with volume confirms real buying pressure not a false breakout." },
        { q:"The ideal holding period for a swing trade is:", choices:["Less than one day","2 to 10 trading days depending on the setup and how price is behaving","Exactly 30 days","Until the stock hits a round number"], answer:1, hint:"Swing trades are not day trades and not long-term holds. They capture the medium-term move over days to a couple weeks." }
      ]},
      { id:"sw2", variants:[
        { q:"Overnight risk in swing trading refers to:", choices:["The risk of your broker going bankrupt","The risk that news or events outside market hours gap the stock against your position","The risk of overtrading the next morning","The risk of missing a gap up on your position"], answer:1, hint:"When you hold overnight you cannot exit if bad news hits. The stock opens gapping against you. That is overnight risk." },
        { q:"How do you manage overnight risk properly on a swing trade?", choices:["Never hold overnight under any circumstances","Size smaller than intraday trades and choose setups where the risk is defined and the thesis is clear before close","Set a very tight stop that will trigger at open","Only swing trade stocks above $100"], answer:1, hint:"You cannot eliminate overnight risk but you can manage it with appropriate sizing and setup quality." },
        { q:"An earnings play as a swing trade means:", choices:["Only buying after earnings are reported","Buying a setup before the earnings announcement speculating on a positive surprise and moving up or out before the report drops","Holding all positions through earnings regardless of size","Buying puts as a hedge before every earnings report"], answer:1, hint:"Earnings plays are high-risk high-reward. Many traders take profits before the announcement to avoid IV crush and binary outcome risk." }
      ]},
      { id:"sw3", variants:[
        { q:"A momentum swing trade is best entered when:", choices:["The stock is already up 50% and showing no signs of slowing","The stock has strong fundamentals, is trending on the daily chart, and is pulling back to a moving average or support in an orderly fashion","The stock just reported bad earnings but looks cheap","Volume is below average suggesting less selling pressure"], answer:1, hint:"The best momentum swings are found on pullbacks within strong uptrends. Not at the extension." },
        { q:"When scanning for swing trades you should primarily look for:", choices:["Stocks at 52-week lows that might bounce","Stocks with strong relative strength versus the market, consolidating near highs with above-average volume on up days","Any stock that is trending on social media","Stocks with the highest short interest"], answer:1, hint:"Relative strength plus healthy consolidation equals a stock that wants to go higher. That is your swing trading target." },
        { q:"The stop loss on a swing trade should be placed:", choices:["Exactly 5% below your entry regardless of chart structure","Below the key level that defines the setup — if that level breaks the reason you bought is no longer valid","At your average cost to guarantee no loss","Above the recent high so it cannot be triggered"], answer:1, hint:"Your stop is not about a fixed percentage. It is about the level that invalidates your thesis. Structure determines your stop." }
      ]},
      { id:"sw4", variants:[
        { q:"Scaling out of a winning swing trade means:", choices:["Adding shares as price rises","Selling a portion of your position at different target levels to lock in gains while letting the remainder run","Selling the entire position at once at your target","Never selling until you hit your maximum target price"], answer:1, hint:"Scaling out is how you capture gains without giving everything back. Sell partial at first target, trail the rest." },
        { q:"An IBS (Inside Bar Setup) in swing trading signals:", choices:["A stock with very high short interest preparing to squeeze","Volatility contraction and coiling energy — when price breaks the prior bar's range in either direction it can move fast","A failed breakout pattern to short","A pattern that only works on low float stocks"], answer:1, hint:"Inside bars are tight consolidation. Price compresses energy. The break of the mother bar high or low is your trigger." },
        { q:"Position sizing for swing trades should be:", choices:["Larger than day trades since you have more time for the trade to work","Smaller than your average day trade to account for overnight gap risk and wider stops based on daily chart structure","The same dollar amount regardless of stop distance","Based purely on how confident you feel about the setup"], answer:1, hint:"Daily chart stops are wider than intraday stops. Wider stop = smaller size to keep your dollar risk consistent." }
      ]}
    ]
  },

  psychology: {
    title: "Psychology and Mindset Mastery Test",
    section: "psychology",
    passingScore: 75,
    questions: [
      { id:"psy1", variants:[
        { q:"Revenge trading is best described as:", choices:["A valid strategy for recovering from losses quickly","Taking the next trade immediately after a loss driven by emotion and the need to make money back rather than a quality setup","Trading in a competitive manner against other traders","A pattern used by professional traders to reset after losses"], answer:1, hint:"Revenge trading is driven by ego and loss aversion. Your next trade is not based on a setup — it is based on anger. That is dangerous." },
        { q:"After a significant loss the most effective action is:", choices:["Immediately take a larger trade to recover the money and reset your P&L","Step away from the screen for at least 15-30 minutes before making any new trading decision","Call your broker to discuss what went wrong","Review your watchlist and take the next available setup immediately"], answer:1, hint:"Mandatory cooldown after a big loss is the single most effective behavioral tool in trading. It breaks the emotional reaction loop." },
        { q:"You are on a 5-trade losing streak. The correct response is:", choices:["Double your size on the next trade since you are due for a win","Continue trading your normal size since losing streaks are random and will self-correct","Cut your size in half or stop entirely and only resume with your highest conviction setups","Switch to a completely different strategy immediately"], answer:2, hint:"Losing streaks are the time to go smaller not bigger. Protect your capital. Get back to green slowly with only A+ setups." }
      ]},
      { id:"psy2", variants:[
        { q:"FOMO — fear of missing out — most commonly leads traders to:", choices:["Wait patiently for better setups to develop","Chase extended moves that have already happened — entering late with poor risk/reward","Take fewer trades with more selective criteria","Improve their watchlist building process"], answer:1, hint:"FOMO makes you enter after the move has already happened. You buy the top. The risk/reward is terrible every time." },
        { q:"Base hits over home runs is a principle that means:", choices:["Only trade stocks under $10","Consistent smaller gains that compound over time beat infrequent home run attempts that usually fail","Never take large position sizes even on your best setups","Trade baseball stocks during the season"], answer:1, hint:"1% per day compounded over a year is life-changing. Chasing 50% gains on single trades leads to account blowups not wealth." },
        { q:"Overtrading is most commonly driven by:", choices:["Having too many great setups on the watchlist","Boredom, the need to feel active, or trying to force trades when the market is not giving clean setups","Trading during highly liquid market conditions","Using a scanner that returns too many results"], answer:1, hint:"Overtrading is a psychological problem not a market problem. The market does not force you to take bad trades. You do." }
      ]},
      { id:"psy3", variants:[
        { q:"Your win rate is 60% but you are losing money overall. The most likely cause is:", choices:["Your entries are consistently wrong and need to be refined","Your average loss is significantly larger than your average winner — you cut winners early and let losers run","The market is in a difficult phase and will improve","You need a better scanner to find higher quality setups"], answer:1, hint:"Positive win rate plus negative P&L means one thing: your average loss is bigger than your average win. Fix exits not entries." },
        { q:"A trading plan is only useful if:", choices:["It is written by an experienced professional trader","You follow it consistently even when your emotions are pulling you in a different direction","It includes at least 10 different setups","It is updated after every single trading session"], answer:1, hint:"Everyone has a plan until the market moves. A plan only has value when you follow it under pressure. That is the whole point." },
        { q:"How does journaling your trades primarily improve your trading?", choices:["It satisfies broker reporting requirements","It creates a data-driven record of your actual behavior versus your intended behavior — revealing patterns you cannot see in the moment","It helps you track your tax liability more accurately","It is required to participate in TST Academy mentorship"], answer:1, hint:"You cannot fix what you cannot see. Your journal is a mirror. It shows you what you are actually doing versus what you think you are doing." }
      ]},
      { id:"psy4", variants:[
        { q:"The playbook mindset means:", choices:["Copying the exact trades from a successful trader's playbook","Only taking setups you have defined in advance with clear rules — if it is not in your playbook it is not your trade","Trading every setup you know whenever it appears","Being flexible and adapting your strategy to whatever the market is doing each day"], answer:1, hint:"Your playbook is your filter. If the setup is not in your playbook you have no edge in that trade. Walk away." },
        { q:"Accepting a loss quickly and moving on without emotional attachment is called:", choices:["Being careless about risk","Emotional detachment — the ability to see a loss as a cost of doing business not a personal failure","Overconfidence in your remaining positions","A sign you do not care enough about your trading"], answer:1, hint:"Trading losses are business expenses. Every great trader loses regularly. The skill is in how you respond — or how quickly you do not." },
        { q:"When your P&L is positive and you take one more trade that turns your day red, the root cause is almost always:", choices:["The market was unpredictable and there was nothing you could do","Not having a daily profit target rule — you did not know when to stop and greed or boredom kept you in","A setup that looked exactly like your best pattern","Position sizing that was too small on your winners"] , answer:1, hint:"Green-to-red days have a clear cause: no stop point. Define your daily profit target. When you hit it you are done." }
      ]},
      { id:"psy5", variants:[
        { q:"The most destructive trading behavior during a losing streak is:", choices:["Taking a break from trading to reset mentally","Increasing position size to recover losses faster — turning a manageable drawdown into a potential account wipeout","Reviewing your recent trades to find the pattern in your mistakes","Reducing your watchlist to only your best setups"], answer:1, hint:"Sizing up during a losing streak is how accounts blow up. You are not thinking clearly during a streak. Smaller size protects you." },
        { q:"Screen time in trading primarily builds:", choices:["The ability to predict exactly where price will go next","Pattern recognition — your brain learns what setups look like, how they behave, and what feels different about the ones that work","Faster reaction speed for scalping","Better technical indicator interpretation skills"], answer:1, hint:"Screen time builds intuition. You cannot shortcut it. After thousands of hours your reads become instinctive not mechanical." },
        { q:"The difference between a trader who lasts five years and one who blows up in six months is most often:", choices:["Intelligence and natural talent","Risk management and emotional control — the ability to survive the inevitable losing streaks without destroying the account","Access to better trading tools and data","The size of their starting capital"], answer:1, hint:"Talent is common. Discipline is rare. The traders who survive long enough to get good are the ones who protect their capital first." }
      ]}
    ]
  },
};
;

// ============================================================
// QUIZ ENGINE
// ============================================================

window.TST_QUIZ = {

  getQuiz: function(sectionId) {
    return QUIZ_DATA[sectionId] || null;
  },

  getAttempts: function(sectionId) {
    if (!window.BEHAVIOR) return 0;
    var rec = (window.BEHAVIOR.quizzes || []).find(function(q){ return q.section === sectionId; });
    return rec ? (rec.attempts || 0) : 0;
  },

  isPassed: function(sectionId) {
    if (!window.BEHAVIOR) return false;
    var rec = (window.BEHAVIOR.quizzes || []).find(function(q){ return q.section === sectionId; });
    return rec ? (rec.passed || false) : false;
  },

  getScore: function(sectionId) {
    if (!window.BEHAVIOR) return 0;
    var rec = (window.BEHAVIOR.quizzes || []).find(function(q){ return q.section === sectionId; });
    return rec ? (rec.score || 0) : 0;
  },

  pickVariant: function(question, attempt) {
    return question.variants[attempt % question.variants.length];
  },

  render: function(sectionId) {
    var quiz = this.getQuiz(sectionId);
    if (!quiz) return '';
    var attempt = this.getAttempts(sectionId);
    var passed = this.isPassed(sectionId);
    var score = this.getScore(sectionId);
    var self = this;

    var qHtml = quiz.questions.map(function(q, i) {
      var v = self.pickVariant(q, attempt);
      var choicesHtml = v.choices.map(function(c, ci) {
        return '<label class="quiz-choice" data-ci="' + ci + '">' +
          '<input type="radio" name="tq_' + sectionId + '_' + i + '" value="' + ci + '">' +
          '<span class="quiz-choice-letter">' + String.fromCharCode(65 + ci) + '</span>' +
          '<span class="quiz-choice-text">' + c + '</span>' +
        '</label>';
      }).join('');
      return '<div class="quiz-q" data-qi="' + i + '" data-qid="' + q.id + '">' +
        '<div class="quiz-q-num">Question ' + (i+1) + ' of ' + quiz.questions.length + '</div>' +
        '<div class="quiz-q-text">' + v.q + '</div>' +
        '<div class="quiz-choices">' + choicesHtml + '</div>' +
      '</div>';
    }).join('');

    var passedBadge = passed
      ? '<div class="quiz-passed-badge">PASSED ' + score + '%</div>'
      : '';

    return '<div class="quiz-container" id="quizCont_' + sectionId + '" data-section="' + sectionId + '">' +
      '<div class="quiz-header">' +
        '<div class="quiz-title">' + quiz.title + '</div>' +
        '<div class="quiz-meta">' + quiz.questions.length + ' questions &nbsp;·&nbsp; Pass score: ' + quiz.passingScore + '% &nbsp;·&nbsp; Answers revealed at end</div>' +
        passedBadge +
      '</div>' +
      '<div class="quiz-progress"><div class="quiz-progress-bar" id="qpb_' + sectionId + '" style="width:0%"></div></div>' +
      '<div class="quiz-questions" id="quizQs_' + sectionId + '">' + qHtml + '</div>' +
      '<div class="quiz-actions">' +
        '<button class="quiz-submit-btn" onclick="TST_QUIZ.submit(\'' + sectionId + '\')">Submit Answers</button>' +
        '<div class="quiz-warning" id="qwarn_' + sectionId + '" style="display:none">Please answer all questions before submitting.</div>' +
      '</div>' +
      '<div class="quiz-results" id="qres_' + sectionId + '" style="display:none"></div>' +
    '</div>';
  },

  submit: function(sectionId) {
    var quiz = this.getQuiz(sectionId);
    if (!quiz) return;
    var attempt = this.getAttempts(sectionId);
    var container = document.getElementById('quizCont_' + sectionId);
    var self = this;

    var answers = [];
    var allAnswered = true;
    var qDivs = container.querySelectorAll('.quiz-q');
    qDivs.forEach(function(qDiv, i) {
      var sel = qDiv.querySelector('input[type=radio]:checked');
      if (!sel) { allAnswered = false; answers.push(null); }
      else answers.push(parseInt(sel.value));
    });

    if (!allAnswered) {
      document.getElementById('qwarn_' + sectionId).style.display = 'block';
      return;
    }
    document.getElementById('qwarn_' + sectionId).style.display = 'none';

    var correct = 0;
    var results = [];
    quiz.questions.forEach(function(q, i) {
      var v = self.pickVariant(q, attempt);
      var isCorrect = answers[i] === v.answer;
      if (isCorrect) correct++;
      results.push({ q: v.q, userAns: v.choices[answers[i]], correctAns: v.choices[v.answer], isCorrect: isCorrect, hint: v.hint });
    });

    var score = Math.round((correct / quiz.questions.length) * 100);
    var passed = score >= quiz.passingScore;

    if (!window.BEHAVIOR) window.BEHAVIOR = { quizzes: [] };
    if (!window.BEHAVIOR.quizzes) window.BEHAVIOR.quizzes = [];
    var existing = window.BEHAVIOR.quizzes.findIndex(function(q){ return q.section === sectionId; });
    var record = { section: sectionId, score: score, passed: passed, attempts: attempt + 1, date: new Date().toISOString() };
    if (existing >= 0) window.BEHAVIOR.quizzes[existing] = record;
    else window.BEHAVIOR.quizzes.push(record);

    this.saveResult(sectionId, score, passed, attempt + 1);

    container.querySelectorAll('input[type=radio]').forEach(function(r){ r.disabled = true; });

    qDivs.forEach(function(qDiv, i) {
      var v = self.pickVariant(quiz.questions[i], attempt);
      var choices = qDiv.querySelectorAll('.quiz-choice');
      choices.forEach(function(c, ci) {
        if (ci === v.answer) c.classList.add('quiz-choice-correct');
        else if (ci === answers[i] && !results[i].isCorrect) c.classList.add('quiz-choice-wrong');
      });
    });

    var wrong = results.filter(function(r){ return !r.isCorrect; });
    var wrongHtml = wrong.length > 0
      ? '<div class="quiz-review"><div class="quiz-review-title">Review These Questions</div>' +
        wrong.map(function(r) {
          return '<div class="quiz-wrong-item">' +
            '<div class="quiz-wrong-q">&#x2717; ' + r.q + '</div>' +
            '<div class="quiz-wrong-yours">Your answer: <span class="quiz-wrong-ans">' + r.userAns + '</span></div>' +
            '<div class="quiz-wrong-correct">Correct answer: <span class="quiz-correct-ans">' + r.correctAns + '</span></div>' +
            '<div class="quiz-hint-text">&#x1F4A1; ' + r.hint + '</div>' +
          '</div>';
        }).join('') + '</div>'
      : '<div class="quiz-perfect">Perfect score. Outstanding work.</div>';

    var retakeBtn = !passed
      ? '<button class="quiz-retake-btn" onclick="TST_QUIZ.retake(\'' + sectionId + '\')">Retake Quiz</button>'
      : '<div class="quiz-congrats">Section complete. Continue to the next section.</div>';

    var resultsDiv = document.getElementById('qres_' + sectionId);
    resultsDiv.innerHTML =
      '<div class="quiz-score-card ' + (passed ? 'quiz-passed' : 'quiz-failed') + '">' +
        '<div class="quiz-score-num">' + score + '%</div>' +
        '<div class="quiz-score-label">' + (passed ? 'PASSED' : 'NOT PASSED YET') + '</div>' +
        '<div class="quiz-score-sub">' + correct + ' of ' + quiz.questions.length + ' correct &nbsp;·&nbsp; Need ' + quiz.passingScore + '% to pass</div>' +
      '</div>' +
      wrongHtml + retakeBtn;

    resultsDiv.style.display = 'block';
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('qpb_' + sectionId).style.width = '100%';
  },

  retake: function(sectionId) {
    var parent = document.getElementById('quizCont_' + sectionId);
    if (!parent) return;
    var container = parent.parentElement;
    parent.outerHTML = this.render(sectionId);
    var newCont = document.getElementById('quizCont_' + sectionId);
    if (newCont) newCont.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  saveResult: async function(sectionId, score, passed, attempts) {
    try {
      if (!window.supabase) return;
      var authResult = await window.supabase.auth.getUser();
      var user = authResult.data ? authResult.data.user : null;
      if (!user) return;
      await window.supabase.from('quiz_results').upsert({
        user_id: user.id,
        section: sectionId,
        score: score,
        passed: passed,
        attempts: attempts,
        updated_at: new Date().toISOString()
      });
    } catch(e) { console.log('Quiz save error:', e); }
  }
};

// Track progress bar as user selects answers
document.addEventListener('change', function(e) {
  if (!e.target || e.target.type !== 'radio') return;
  var container = e.target.closest('.quiz-container');
  if (!container) return;
  var sectionId = container.dataset.section;
  var total = container.querySelectorAll('.quiz-q').length;
  var answered = container.querySelectorAll('input[type=radio]:checked').length;
  var pbar = document.getElementById('qpb_' + sectionId);
  if (pbar) pbar.style.width = Math.round((answered / total) * 100) + '%';
});// BEGINNER QUESTIONS
const beginnerQuestions = [
  {
    q: "What does a long lower wick on a candle tell you about buyer and seller behavior during that period?",
    variants: [
      "What does a long lower wick on a candle reveal about what happened during that time period?",
      "If a candle has a very long lower wick, what does that tell you about the battle between buyers and sellers?",
      "A candle closes near its high but has a very long lower wick. What happened during that period?"
    ],
    a: "Sellers pushed price down significantly during the period but buyers stepped in aggressively and rejected those lower prices, pushing price back up before the candle closed. The wick represents the range that was tested and rejected.",
    hint: "Think about what the wick represents — it shows where price went but was not accepted.",
    options: [
      "Sellers pushed price down but buyers rejected the lower prices and pushed it back up before the close",
      "Buyers were in control the entire period and price only moved upward",
      "The stock had low volume and did not move much during that period",
      "Sellers won the battle and price closed near the lows"
    ],
    correct: 0
  },
  {
    q: "What is a Doji and what does it signal when it appears after an extended trend?",
    variants: [
      "A candle has an almost identical open and close with wicks on both sides. What type of candle is this and what does it mean after a long uptrend?",
      "What does a Doji candlestick look like and why is its location on the chart important?",
      "After a stock has been trending up for several days a Doji appears. What should you take from this?"
    ],
    a: "A Doji has nearly the same open and close price, creating a very small body with wicks on both sides. It signals indecision — neither buyers nor sellers won that period. When it appears after an extended trend it is a warning that momentum is slowing and a reversal may be coming.",
    hint: "The body of a Doji is almost nonexistent. Think about what it means when neither side wins.",
    options: [
      "A candle with nearly the same open and close signaling indecision — potential reversal warning after an extended trend",
      "A large green candle signaling that buyers are fully in control and the trend will continue",
      "A candle that only forms at the bottom of downtrends as a reversal signal",
      "A candle with no wicks showing total conviction from one side"
    ],
    correct: 0
  },
  {
    q: "What is a bullish engulfing pattern and why is it more significant near a support level?",
    variants: [
      "Describe a bullish engulfing pattern and explain why location matters when evaluating it.",
      "A large green candle completely covers the previous red candle's body. What is this pattern called and when is it most meaningful?",
      "What makes a bullish engulfing pattern high probability versus low probability?"
    ],
    a: "A bullish engulfing pattern is two candles — a red candle followed by a green candle that completely engulfs the prior red candle's body. It shows a powerful shift from selling to buying pressure. Near a support level it is more significant because buyers are defending a known price level, making the reversal more likely to hold.",
    hint: "Context matters. The same pattern means more at certain price levels than others.",
    options: [
      "Two candles where a green candle completely covers the prior red body — most significant near support where buyers are defending a known level",
      "A single large green candle that appears at the top of an uptrend signaling continuation",
      "Two green candles in a row — more significant the further from support they appear",
      "A pattern that only works on daily charts and is not reliable on intraday timeframes"
    ],
    correct: 0
  },
  {
    q: "Why is a candle CLOSE above resistance more significant than a wick through it?",
    variants: [
      "A stock wicks above a resistance level but closes back below it. Is this a breakout? Why or why not?",
      "What is the difference between a wick through resistance and a candle close above resistance?",
      "You are watching a key resistance level. Price pokes above it briefly then pulls back. What does this tell you?"
    ],
    a: "A wick through resistance means price briefly tested that level but was rejected — sellers won and pushed price back below. A close above resistance means the market accepted that price level, buyers overpowered sellers, and the level has been genuinely broken. Closing price is where the majority of participants agreed to end the period.",
    hint: "Where price closes is where the market decided it belongs. A wick is just a test.",
    options: [
      "A close above resistance shows the market accepted the new price level — a wick just means it was tested and rejected",
      "A wick above resistance is actually more significant because it shows buyers pushed price higher",
      "Both are equally significant — any touch of resistance is a valid breakout signal",
      "Neither matters — you should only trade breakouts on the daily chart"
    ],
    correct: 0
  },
  {
    q: "A stock breaks above resistance on half its average volume. What does this tell you and what should you do?",
    variants: [
      "You see a breakout above a key level but notice volume is well below average. How do you evaluate this setup?",
      "What does low volume on a breakout candle tell you about the move's reliability?",
      "A stock clears resistance for the first time in weeks but volume is 0.5x the average. Do you take the trade?"
    ],
    a: "Low volume on a breakout is a major red flag. It means institutions are not participating — the move is being driven by retail traders or algorithms and lacks real conviction. These breakouts frequently fail and reverse back below resistance. You should wait for volume to confirm the move before entering or avoid the trade entirely.",
    hint: "Volume tells you who is participating. No institutional volume means no conviction.",
    options: [
      "Low volume breakout lacks institutional conviction and is likely to fail — wait for volume confirmation or skip it",
      "Low volume is actually better because it means less selling pressure and the move is cleaner",
      "Volume does not matter on breakouts — price action alone is sufficient for entry",
      "Take the trade immediately before volume picks up and the stock gets crowded"
    ],
    correct: 0
  },
  {
    q: "What should volume look like during a flag consolidation for the setup to be valid?",
    variants: [
      "During the pullback phase of a bull flag, what should you observe happening to volume?",
      "How does volume behavior during a flag consolidation confirm or invalidate the setup?",
      "A stock pulls back after a big move. Volume during the pullback is spiking higher than the initial move. Is this a valid flag setup?"
    ],
    a: "Volume should dry up significantly during the flag consolidation — dropping well below average. This shows that sellers are not aggressively pushing price lower and the pullback is orderly profit-taking rather than genuine distribution. When volume contracts during the flag it sets up a high-probability breakout when buyers return with force.",
    hint: "If sellers were truly in control during the pullback, volume would be high. Low volume means they are not.",
    options: [
      "Volume should dry up and contract during the flag — low volume confirms sellers are exhausted and buyers will return",
      "Volume should increase during the flag to confirm that buyers are actively accumulating",
      "Volume during the flag does not matter — only the breakout volume is relevant",
      "Volume should match the initial move to show equal participation on both sides"
    ],
    correct: 0
  },
  {
    q: "What does a volume climax spike often signal at the end of a sharp move?",
    variants: [
      "A stock has been selling off hard for 3 days and on day 4 volume spikes to 10x the average on another sharp drop. What might this signal?",
      "What is a volume climax and why does extreme volume often appear at turning points?",
      "You see an enormous volume spike on a sharp move down. What should you be thinking about?"
    ],
    a: "A volume climax spike — extreme volume on a sharp move — often signals exhaustion of the dominant side. On a selloff it means panic sellers are all exiting at once, which frequently marks a short-term bottom because once all the sellers have sold there is no one left to push price lower. It does not guarantee a reversal but it is a significant warning that the move is mature.",
    hint: "Extreme volume means a lot of participants acted at once. Think about what happens when everyone who wants to sell has already sold.",
    options: [
      "Exhaustion of the dominant side — on a selloff it signals panic selling may be climaxing and a reversal could be near",
      "Confirmation that the trend is healthy and will continue strongly in the same direction",
      "A signal to add to your position in the direction of the move",
      "A meaningless event that happens randomly and should be ignored"
    ],
    correct: 0
  },
  {
    q: "What happens to a resistance level once it is broken with conviction and strong volume?",
    variants: [
      "A stock has been rejected at $55 three times. It finally breaks above $55 on huge volume. What does $55 now represent?",
      "Explain the concept of resistance flipping to support after a breakout.",
      "After a clean breakout above a major resistance level, where would you look to buy a pullback?"
    ],
    a: "Former resistance becomes support. Once a level is broken with conviction, the traders who were selling there are now buyers on any pullback because they want to defend the price they already committed to. Institutions also frequently buy pullbacks to broken resistance levels. This is why the first pullback after a breakout is often a high-probability entry.",
    hint: "Think about what the traders who were selling at that level do after it breaks above them.",
    options: [
      "Former resistance becomes support — traders who sold there now buy pullbacks to defend that level",
      "The broken resistance level becomes meaningless and should be ignored going forward",
      "Resistance remains resistance — a breakout above it is usually temporary and price will return below",
      "The level becomes an area of uncertainty with no predictive value in either direction"
    ],
    correct: 0
  },
  {
    q: "What is a higher low and what does a series of higher lows tell you about who is in control?",
    variants: [
      "A stock pulls back to $48 then rallies, then pulls back to $51, then rallies again. What pattern is forming and what does it mean?",
      "Define a higher low and explain its significance in identifying trend strength.",
      "You notice each pullback in a stock is finding support at a higher price than the last pullback. What does this tell you?"
    ],
    a: "A higher low occurs when a pullback finds support at a higher price than the previous pullback. A series of higher lows means buyers are stepping in earlier and earlier — they are not waiting for price to fall as far before buying. This shows accumulation and confirms that buyers are in control. It is one of the key characteristics of a healthy uptrend.",
    hint: "If buyers keep stepping in at higher and higher prices, what does that tell you about demand?",
    options: [
      "Buyers are stepping in earlier each time — it signals accumulation and confirms buyers are in control of the trend",
      "The stock is becoming increasingly risky because it is making higher highs and could reverse at any time",
      "Higher lows are only significant on weekly charts — intraday higher lows have no predictive value",
      "It means sellers are getting stronger because they are defending lower price levels each time"
    ],
    correct: 0
  },
  {
    q: "What is a lower high and what does it tell you about the health of an uptrend?",
    variants: [
      "A stock rallies to $60, pulls back, rallies to $58, pulls back, rallies to $55. What pattern is forming and what does it mean?",
      "You are long a stock and notice each rally is reaching a lower peak than the previous one. What should you be thinking?",
      "Define a lower high and explain why it is a warning signal even if price has not broken a support level yet."
    ],
    a: "A lower high occurs when a bounce or rally fails at a lower price than the previous bounce. It means sellers are getting more aggressive — they are stepping in earlier to sell before price can reach the previous high. A series of lower highs in what was an uptrend is a significant warning that buyers are losing control, even before any support level breaks.",
    hint: "If sellers keep stepping in at lower and lower prices, demand is weakening. What does that mean for the trend?",
    options: [
      "Sellers are stepping in earlier each time — warns that buyer momentum is fading even if support has not broken yet",
      "Lower highs are a normal part of any healthy uptrend and should not cause concern",
      "It signals that the stock is consolidating before a major breakout to new highs",
      "Lower highs only matter if price is also making lower lows at the same time"
    ],
    correct: 0
  },
  {
    q: "What is the difference between a breakout and a fakeout and how do you avoid entering a fakeout?",
    variants: [
      "A stock breaks above a key resistance level and you enter long. Ten minutes later it reverses back below the level. What happened and how could you have avoided it?",
      "How do you distinguish a genuine breakout from a fakeout before you enter the trade?",
      "What are the two most important criteria that separate a real breakout from a false one?"
    ],
    a: "A breakout is a genuine move above resistance accepted by the market — confirmed by a candle close above the level and above-average volume. A fakeout is when price briefly pierces a level but quickly reverses back below it. You avoid fakeouts by waiting for a full candle close above the level rather than entering on a wick, and requiring volume to be above average on the breakout candle.",
    hint: "Two things confirm a real breakout: where the candle closes and whether volume is showing up.",
    options: [
      "Wait for a candle close above the level with above-average volume — a wick through on low volume is usually a fakeout",
      "Enter immediately when price touches resistance so you get the best possible entry before the breakout",
      "Fakeouts only happen on low-quality stocks — blue chip stocks always have genuine breakouts",
      "Use a stop loss above the resistance level to protect against fakeouts after you enter"
    ],
    correct: 0
  },
  {
    q: "What are the two components of a bull flag and where is the entry point?",
    variants: [
      "Break down the structure of a bull flag pattern and identify where you would enter the trade.",
      "A stock surges 15% in an hour then pulls back tightly for 20 minutes in a channel. What pattern is forming and where do you enter?",
      "Describe a bull flag from start to finish including the exact entry trigger."
    ],
    a: "A bull flag has two components — the flag pole (the sharp initial move up driven by a catalyst and volume) and the flag (the tight orderly pullback that follows on lower volume). The entry point is a break above the highest candle in the flag consolidation, confirmed by a volume spike showing buyers are returning.",
    hint: "One component shows the strength of the move, the other is the rest period before continuation.",
    options: [
      "Flag pole (sharp move up) and flag (tight pullback) — entry is on a break above the flag highs with volume",
      "The breakout candle and the retest — entry is when price retests the original breakout level",
      "The accumulation zone and the markup phase — entry is at the very start of the accumulation",
      "Support and resistance — entry is when price bounces off the support level inside the flag"
    ],
    correct: 0
  },
  {
    q: "Where does the stop loss go on a bull flag trade and why?",
    variants: [
      "You enter a bull flag breakout. Where exactly do you place your stop and what is the reasoning behind that level?",
      "Why does the stop on a bull flag go below the flag lows and not somewhere else?",
      "A bull flag breaks out and you enter. Price pulls back into the flag. At what point is the trade officially wrong?"
    ],
    a: "The stop goes below the lowest candle in the flag consolidation. If price returns below the flag low the pattern is invalidated — the pullback was not a healthy flag, buyers have lost control, and the breakout has failed. Placing the stop at the flag low is technically logical because that is the exact level where the trade thesis breaks down.",
    hint: "Your stop should go at the level that PROVES your trade idea is wrong.",
    options: [
      "Below the lowest candle in the flag — if price returns there the pattern is invalidated and the thesis is wrong",
      "Below the bottom of the flag pole — the entire move must be protected",
      "A fixed dollar amount below your entry regardless of chart structure",
      "At the prior day's low since that is the most significant support level"
    ],
    correct: 0
  },
  {
    q: "What does an ascending triangle tell you about the battle between buyers and sellers?",
    variants: [
      "A stock keeps hitting the same resistance level while making higher lows below it. What pattern is forming and what does it reveal?",
      "Explain the psychology behind an ascending triangle — what are buyers doing and what are sellers doing?",
      "Why does an ascending triangle typically resolve to the upside?"
    ],
    a: "An ascending triangle shows buyers getting more aggressive — making higher lows, meaning they are willing to pay more each time — while sellers are defending a fixed resistance level. Eventually buyers overwhelm the fixed supply at resistance. The pattern typically resolves bullishly because buyers are clearly gaining strength while sellers are holding a static line that is gradually being eroded.",
    hint: "One side is getting stronger while the other is holding a fixed level. That imbalance has to resolve somehow.",
    options: [
      "Buyers are getting more aggressive with higher lows while sellers hold a fixed level — buyers eventually overwhelm resistance",
      "Sellers are gaining strength as they successfully hold resistance and will eventually push price sharply lower",
      "Both buyers and sellers are equally matched and the pattern resolves randomly in either direction",
      "The pattern shows institutional distribution at resistance and almost always resolves to the downside"
    ],
    correct: 0
  },
  {
    q: "What does it mean when a large wall on the ask disappears as price approaches it?",
    variants: [
      "You see 50,000 shares offered at $25.00 on Level 2. As price gets close that wall suddenly vanishes. What does this tell you?",
      "A massive ask wall disappears right before price reaches it. Is this bullish or bearish and why?",
      "On Level 2 you notice a huge sell order at a key resistance level evaporates as price approaches. How do you interpret this?"
    ],
    a: "When a large ask wall disappears as price approaches it, it is typically a bullish signal. It means the seller who placed that order either pulled it because they no longer want to sell at that price or it was a fake wall designed to scare buyers — a tactic called spoofing. The disappearance of resistance often leads to a sharp move up because there is now less supply blocking the way.",
    hint: "If the wall was real supply and it disappeared, what does that mean for the path of least resistance?",
    options: [
      "Typically bullish — the supply that was blocking price has been removed, clearing the path for a move higher",
      "Bearish — it means a large seller has filled their entire position and price will now drop sharply",
      "Neutral — walls appear and disappear constantly and have no predictive value",
      "Bearish — it means a market maker is pulling liquidity ahead of a major sell program"
    ],
    correct: 0
  },
  {
    q: "What does aggressive tape — large prints hitting the ask repeatedly — tell you about direction?",
    variants: [
      "You are watching the time and sales and see large green prints hitting the ask over and over. What does this tell you about what is happening in the stock?",
      "How do you read the tape to determine if a move is real versus fading?",
      "Large blocks are printing at the ask price consistently. What does this signal about buyer conviction?"
    ],
    a: "Large prints hitting the ask means buyers are so eager to own the stock that they are paying the sellers asking price rather than waiting for a better price. This shows urgency and conviction from the buying side. Consistent aggressive buying at the ask is a bullish signal — it tells you institutions or motivated buyers are accumulating and not waiting around.",
    hint: "When you hit the ask instead of bidding below it, you are saying you need to own this right now. What does that urgency signal?",
    options: [
      "Buyers are aggressively paying the ask — shows urgency and conviction, bullish signal of strong demand",
      "Sellers are offloading large positions at the ask to get out quickly before price drops",
      "The tape is showing equal buying and selling activity with no clear directional bias",
      "Large prints at the ask mean price is about to reverse because sellers are meeting the demand"
    ],
    correct: 0
  },
  {
    q: "What is the 1% rule and why does it exist?",
    variants: [
      "Explain the 1% rule in trading and the mathematical reason it is essential for account survival.",
      "Why do professional traders limit their risk to 1% per trade even when they are highly confident in a setup?",
      "What is the purpose of the 1% rule and what problem does it solve?"
    ],
    a: "The 1% rule means never risking more than 1% of your total account on a single trade. It exists because it makes account survival mathematically near-impossible to violate — even 10 consecutive losses only cost you 10% of your account. At higher risk percentages a losing streak can end your trading career. It also removes emotional attachment to individual trades because no single trade can devastate your account.",
    hint: "Think about what happens to your account after 10 losing trades in a row at different risk percentages.",
    options: [
      "Never risk more than 1% per trade — ensures 10 consecutive losses only cost 10% of your account, protecting you from career-ending drawdowns",
      "Only trade stocks that have moved more than 1% from their opening price to ensure enough volatility",
      "Limit your daily trading activity to 1 hour per day to avoid overtrading and emotional decisions",
      "Never let a single trade account for more than 1% of your daily volume to avoid moving the market"
    ],
    correct: 0
  },
  {
    q: "What is a daily max loss rule and what should you do the moment you hit it?",
    variants: [
      "You set a $300 daily max loss before the market opened. You hit it at 10:15 AM. What do you do?",
      "Why is a daily max loss rule considered one of the most important risk management tools for a trader?",
      "Explain the purpose of a daily max loss limit and what happens psychologically when traders ignore it."
    ],
    a: "A daily max loss rule is a hard dollar limit you set before the market opens — the maximum you are willing to lose in one day. The moment you hit it you close your platform and stop trading for the day, no exceptions. It exists because your worst trading decisions happen after you have already taken losses — revenge trading, oversizing, emotional entries. The daily max loss rule stops the bleeding before a bad day becomes a catastrophic one.",
    hint: "Your best risk management decisions are made before the market opens, not after you are already down.",
    options: [
      "Close your platform and stop trading immediately — your judgment is impaired after losses and the rule exists to prevent catastrophic days",
      "Take one more trade to try to recover the losses since you are already at your limit anyway",
      "Reduce your position size by half and continue trading more carefully for the rest of the day",
      "Switch to paper trading for the rest of the day to practice without risking more real money"
    ],
    correct: 0
  },
  {
    q: "What is a 2:1 risk reward ratio and why does it matter even if your win rate is below 50%?",
    variants: [
      "Explain how a 2:1 risk reward ratio can make a trader profitable even when they lose more trades than they win.",
      "You risk $100 on every trade and target $200. Your win rate is 40%. Are you profitable and why?",
      "Why do professional traders refuse to take trades with less than 2:1 risk reward regardless of how confident they feel?"
    ],
    a: "A 2:1 risk reward ratio means your target profit is twice your potential loss on every trade. It matters at a below-50% win rate because the math still works in your favor — if you win 40% of trades risking $100 to make $200, you make $200 on 4 wins and lose $100 on 6 losses, netting +$200 over 10 trades. It builds a mathematical edge that does not require you to be right most of the time.",
    hint: "Do the math on 10 trades at 40% win rate with 2:1 risk reward. Add up the wins and losses.",
    options: [
      "Your profit target is twice your stop loss — at 40% win rate you are still profitable because winners outweigh losers mathematically",
      "A 2:1 ratio only works when your win rate is above 50% — below that the math does not work out",
      "The ratio only matters on swing trades — for day trades you should target at least 5:1 risk reward",
      "Risk reward ratios are personal preference — some traders prefer 1:1 ratios with higher win rates"
    ],
    correct: 0
  },
  {
    q: "Why is the period between 11:30 AM and 2:00 PM considered the most dangerous time to trade and what should you do differently during that window?",
    variants: [
      "A new trader asks why experienced traders often stop trading around 11:30 AM. What do you tell them?",
      "What happens to volume and volatility during midday and how should that change your behavior?",
      "You are up $400 at 11:45 AM. What should you think about doing and why?"
    ],
    a: "Midday is the most dangerous trading period because institutional volume drops dramatically, spreads widen, and price moves become choppy and random rather than directional. Setups that work in the morning stop working at midday because there is not enough real participation to sustain moves. Most experienced traders either stop trading entirely from 11:30 to 2:00 PM or dramatically reduce their size. If you are profitable in the morning the best move is often to protect those gains and wait for the afternoon session.",
    hint: "What happens when institutional volume leaves the market? Who is left trading and what does their behavior look like?",
    options: [
      "Volume drops, moves become choppy and random — most experienced traders stop or reduce size significantly during this window",
      "Midday is actually the best time to trade because volatility is lower and setups are cleaner and more reliable",
      "The only change needed is to use tighter stops since price moves are smaller during midday",
      "Midday danger only applies to small cap stocks — large caps like SPY and QQQ trade normally all day"
    ],
    correct: 0
  }
];

// INTERMEDIATE QUESTIONS
const intermediateQuestions = [
  {
    q: "QQQ is down 1.5% and trending below VWAP all morning. You have a long setup forming on a tech stock. What should you do and why?",
    variants: [
      "The Nasdaq is selling off hard and below VWAP. A tech stock on your watchlist shows a long setup. Do you take it?",
      "You have a strong long setup on an individual stock but the market is clearly in a downtrend this morning. How do you handle this?",
      "Market is red across the board and QQQ is below VWAP. Your setup triggers on a tech name. What is your decision?"
    ],
    a: "Skip the trade or dramatically reduce size. When the index is trending below VWAP in a downtrend, the tide is going out — most individual stocks, especially tech, will struggle to move up against that pressure. Even a perfect setup has a much lower probability of working when the overall market is selling. You only take high-probability trades, and fighting the index is not one of them.",
    hint: "Think about how hard it is for a single stock to swim upstream when the whole market is selling.",
    options: [
      "Skip or reduce size significantly — trading long against a downtrending index dramatically lowers your probability",
      "Take the trade with full size since individual stock setups can work regardless of market direction",
      "Take the trade but use a wider stop since the market selloff may cause more volatility",
      "Wait exactly 30 minutes then take the trade since morning selloffs usually reverse by mid-morning"
    ],
    correct: 0
  },
  {
    q: "What does it mean when a stock is holding green while the overall market is selling off and why is this significant?",
    variants: [
      "The S&P 500 is down 1% but a stock on your watchlist is up 2%. What does this tell you about that stock?",
      "Define relative strength in the context of day trading and explain why it matters when selecting trades.",
      "You notice a stock refusing to sell off despite heavy market pressure. What does this signal?"
    ],
    a: "A stock holding green while the market sells off is showing exceptional relative strength — it means there is genuine institutional demand absorbing all the selling pressure. This is one of the most bullish signals you can see because if the stock is this strong when the market is weak, imagine how far it can run when the market turns around. Relative strength is one of the best filters for finding the strongest trade candidates each day.",
    hint: "If a stock is green while everything else is red, something significant is happening beneath the surface.",
    options: [
      "Exceptional relative strength — institutional demand is absorbing selling pressure and the stock will likely lead when the market recovers",
      "A temporary anomaly that will correct once the market stabilizes and selling pressure spreads to all stocks",
      "A warning sign that the stock is about to reverse hard since it cannot sustain its gains against a down market",
      "It means the stock is thinly traded and not correlated to the market — not useful for trading decisions"
    ],
    correct: 0
  },
  {
    q: "The VIX spikes from 14 to 28 overnight. How should this change your trading behavior the next morning?",
    variants: [
      "You wake up and the VIX has doubled overnight. What adjustments do you make to your trading plan?",
      "What does a VIX spike tell you about market conditions and how do you adapt?",
      "Fear index doubles overnight. Walk through how this changes your approach to the next trading session."
    ],
    a: "A VIX spike means volatility has doubled — stocks will move much faster and further in both directions. You should reduce position size significantly because your stops need to be wider to avoid being shaken out by noise, and wider stops with normal size means much more dollar risk. You should also be more selective with setups, avoid chasing moves, and be prepared for whipsaw price action that invalidates setups quickly.",
    hint: "If everything is moving twice as fast, what happens to your risk if you keep the same position size?",
    options: [
      "Reduce size significantly — wider moves mean wider stops and normal size would risk much more than 1% of your account",
      "Increase size to take advantage of the larger moves and potentially make more money from the volatility",
      "Trade exactly the same since volatility affects all traders equally and your edge remains the same",
      "Stop trading entirely since high VIX days are always losing days for retail traders"
    ],
    correct: 0
  },
  {
    q: "You notice a stock consistently respects its 9 EMA on the 5-minute chart every single day. How do you use this information?",
    variants: [
      "A stock has bounced off the 9 EMA on the 5-minute chart 15 times in the past two weeks. What do you do with this data?",
      "What does it mean when a stock has a personality that respects a specific moving average?",
      "You have studied a stock and noticed it treats the 9 EMA as perfect support in uptrends. How does this change your entries?"
    ],
    a: "You use the 9 EMA as your entry trigger — buying pullbacks to that level in an uptrend rather than chasing breakouts. Stocks develop personalities and when one consistently respects a specific level it creates a repeatable, high-probability entry. You wait for price to pull back and touch or come close to the 9 EMA, then enter on the first sign of a bounce with your stop just below it. This gives you a tighter stop and better risk reward than entering on a breakout.",
    hint: "If you know exactly where a stock tends to find support, how can you use that to get a better entry?",
    options: [
      "Use the 9 EMA as your entry trigger — buy pullbacks to that level with a stop just below it for tighter risk",
      "Avoid trading that stock since predictable patterns attract too many traders and stop runs are more common",
      "Use the 9 EMA as a sell signal — when price returns to the EMA it means the uptrend is ending",
      "Only use this information on daily charts since intraday EMA patterns are too inconsistent to trade"
    ],
    correct: 0
  },
  {
    q: "What is average daily range and how do you use it to set realistic price targets?",
    variants: [
      "How does knowing a stock's average daily range help you set price targets on your trades?",
      "A stock has an average daily range of $3. It has already moved $2.80 today. How does this affect a new long entry?",
      "Explain how average daily range prevents traders from setting unrealistic targets."
    ],
    a: "Average daily range is the typical dollar distance a stock travels from its daily low to daily high. If a stock averages $3 of movement per day and has already moved $2.80, it is unlikely to move another $3 — it is near its range limit. You use this to set realistic targets and to avoid entering trades late in the day when most of the range has already been consumed. Chasing a stock that has already used up its daily range is one of the most common beginner mistakes.",
    hint: "Every stock has a daily energy budget. Once it is spent, the odds of another big move drop sharply.",
    options: [
      "It tells you how much movement is left in the day — avoid entering when most of the average range has already been used",
      "Use it as a minimum price target — only take trades where your target exceeds the average daily range",
      "Average daily range only matters for swing trades — day traders should ignore it entirely",
      "Double the average daily range to set your target since strong catalyst days always exceed average ranges"
    ],
    correct: 0
  },
  {
    q: "What does it mean when a stock is extended and why is it dangerous to buy in that condition?",
    variants: [
      "A stock is up 25% from its opening price and still moving. What does extended mean in this context and what is the risk?",
      "Why do experienced traders avoid buying stocks that are already significantly extended from their base?",
      "Define extended in trading terms and explain the specific risk it creates for buyers."
    ],
    a: "Extended means a stock has moved far from its base or last consolidation point — it has already run significantly and is far above any logical support level. Buying extended means your stop has to be very wide to be below meaningful support, which means large dollar risk, or you place a tight stop that gets hit by normal fluctuations. Extended stocks also tend to attract profit-taking from early buyers which creates sharp reversals. The rule is let it consolidate and form a new base before entering.",
    hint: "If a stock is far from support, where does your stop go? And what happens when early buyers decide to take profits?",
    options: [
      "Too far from support — stop must be very wide creating excessive risk, and profit-taking from early buyers causes sharp reversals",
      "Extended stocks are the best entries because momentum is confirmed and the move has proven itself",
      "Extended only applies to stocks above their 52-week high — stocks below that level are never considered extended",
      "Buy extended stocks with a tighter than normal stop since the momentum will protect you from major reversals"
    ],
    correct: 0
  },
  {
    q: "What is a catalyst and why does a gap with a catalyst behave differently than a gap without one?",
    variants: [
      "Two stocks gap up 8% at the open. One has earnings that beat expectations. The other has no news. How do you treat them differently?",
      "Explain why the presence or absence of a catalyst dramatically changes how you trade a gap.",
      "What is the difference between a catalyst gap and a sympathy or low-float gap with no news?"
    ],
    a: "A catalyst is a specific news event — earnings beat, FDA approval, major contract, analyst upgrade — that provides a fundamental reason for the move. A catalyst gap tends to hold and continue because institutional buyers validate the news and keep stepping in. A gap without a catalyst is often driven by thin pre-market conditions and tends to fade quickly once the market opens and real volume arrives. Always know the catalyst before trading a gap.",
    hint: "Institutions react to real news. Without news, who is actually driving the pre-market move?",
    options: [
      "Catalyst gaps tend to hold and continue — institutions validate real news. No-catalyst gaps often fade once real volume arrives",
      "Gaps without catalysts are more tradeable because they are purely technical without the unpredictability of news reactions",
      "Both gaps behave identically — the percentage of the gap is what determines whether it holds or fades",
      "Catalyst gaps are more dangerous because the news is already priced in and the stock immediately reverses"
    ],
    correct: 0
  },
  {
    q: "What is a pre-market gapper and what four things should you know about it before the market opens?",
    variants: [
      "You find a stock gapping up 12% in pre-market. What four pieces of information do you research before the open?",
      "Walk through your pre-market research process for a significant gapper on your watchlist.",
      "What is the minimum information you need about a gapper before you are prepared to trade it at the open?"
    ],
    a: "A pre-market gapper is a stock moving significantly above or below the prior close before 9:30 AM. Before trading it you need to know: 1) The catalyst — what specific news is driving the move and is it real and significant? 2) The float — how many shares are available to trade and will this create volatility? 3) Key levels — where is the pre-market high, prior day close, and any major support or resistance? 4) Volume — is pre-market volume already elevated confirming institutional interest?",
    hint: "Four things: why is it moving, how many shares exist, where are the key prices, and who is participating?",
    options: [
      "Catalyst, float, key levels (pre-market high, prior close), and pre-market volume — all four before the open",
      "Just the catalyst and the percentage gap — the other information can be gathered after the market opens",
      "The float, the short interest, the options chain, and the analyst ratings — fundamental data is most important",
      "Pre-market high and the prior close — these two levels are sufficient to trade any gapper safely"
    ],
    correct: 0
  },
  {
    q: "Why should you remove a stock from your active watchlist once it has already made its big move for the day?",
    variants: [
      "A stock on your watchlist ran 20% in the first 30 minutes. Should it stay on your active watchlist? Why or why not?",
      "What is the danger of continuing to watch and trade a stock that has already made its major move?",
      "Explain the concept of daily range in the context of removing stocks from your watchlist."
    ],
    a: "Once a stock has made its big move it has likely consumed most of its average daily range — the energy for the day is spent. Continuing to watch it pulls your attention away from fresh setups that have not moved yet. Traders who keep watching stocks that have already run tend to overtrade them, chasing every small bounce and breakdown and getting chopped up in the noise. Fresh setups are always higher probability than trying to squeeze more out of a stock that has already moved.",
    hint: "A stock only has so much movement in a day. Once it has moved, where is a better place to focus your attention?",
    options: [
      "It has consumed its daily range and watching it pulls focus from fresh setups — higher probability trades exist elsewhere",
      "Keep it on the watchlist since stocks that move big in the morning often have a second major move in the afternoon",
      "Remove it only if it reverses — if it continues grinding higher it still has potential and deserves attention",
      "Always keep movers on your watchlist regardless of how much they have moved since they attract the most volume"
    ],
    correct: 0
  },
  {
    q: "What is confluence and give an example of three things that would create confluence on a long setup?",
    variants: [
      "Define confluence in trading and explain why more confluence factors increase the probability of a trade working.",
      "What does it mean when multiple factors align on the same trade and how does this affect your conviction?",
      "Give a specific example of a high-confluence long setup using at least three confirming factors."
    ],
    a: "Confluence means multiple independent factors are all pointing to the same trade at the same time, stacking the odds in your favor. An example of a high-confluence long setup: price is at a bull flag breakout level AND that level is also a prior resistance turned support AND VWAP is below price confirming bullish bias AND the overall market QQQ is trending above VWAP. Each factor alone is decent — all four together create a significantly higher probability setup.",
    hint: "Each factor alone gives you some edge. Multiple factors pointing the same direction multiply that edge.",
    options: [
      "Multiple independent factors aligning — e.g. bull flag breakout at key support with volume and QQQ above VWAP all at once",
      "Two moving averages crossing on the same chart — this is the most reliable form of confluence available",
      "Any setup where both the daily and weekly chart show the same candlestick pattern at the same time",
      "Confluence means the setup has worked at least three times in the past — historical repetition confirms the pattern"
    ],
    correct: 0
  },
  {
    q: "What is the difference between a setup and a signal and why does entering on a setup instead of a signal cost most traders money?",
    variants: [
      "Explain the difference between identifying a setup and waiting for a signal — and why most traders jump in too early.",
      "A bull flag is forming but has not broken out yet. Is this a setup or a signal? When do you enter?",
      "Why do experienced traders wait for a signal rather than entering the moment they identify a setup?"
    ],
    a: "A setup is the conditions that make a trade possible — a stock forming a flag, approaching support, or consolidating near resistance. A signal is the trigger that tells you the move is actually happening — the breakout candle closing above the flag with volume. Entering on a setup means entering before the trade has proven itself, which means you are guessing at the outcome. Entering on a signal means the move has started and you are joining confirmed momentum with defined risk.",
    hint: "A setup is the loaded gun. A signal is when it actually fires. When do you act?",
    options: [
      "Setup is the condition, signal is the trigger — entering on setup means guessing, entering on signal means confirmed momentum",
      "They are the same thing — a setup is just another word for a signal in most trading contexts",
      "Enter on the setup to get a better price since waiting for the signal means you always buy at the high",
      "Setups are for swing traders and signals are for day traders — different timeframes use different terminology"
    ],
    correct: 0
  },
  {
    q: "What is the first 5 candles rule and why do many experienced traders avoid trading during that window?",
    variants: [
      "Why do some experienced traders refuse to take trades in the first 5 minutes of market open?",
      "Explain what happens during the first 5 candles of the trading day and why it creates a dangerous environment.",
      "What makes the first 5 minutes of the trading day uniquely risky compared to the rest of the session?"
    ],
    a: "The first 5 candles on a 1-minute chart — the first 5 minutes after the open — represent the most chaotic and unpredictable period of the day. Pre-market orders flood in, stop hunts occur, and price can move violently in both directions before finding its real direction. Many experienced traders watch the first 5 candles to understand the opening range and directional bias without committing capital during the most unpredictable window. Acting too fast in the first 5 minutes is one of the leading causes of unnecessary morning losses.",
    hint: "Think about how many orders have been queued up overnight just waiting to hit the market at 9:30.",
    options: [
      "First 5 minutes are the most chaotic — pre-market orders flood in, stop hunts occur, and real direction is unclear until the dust settles",
      "The first 5 candles represent the highest probability trades of the day since volume and volatility are at their peak",
      "The rule only applies on earnings days — on normal days the first 5 minutes are fine to trade",
      "Experienced traders avoid the first 5 candles because spreads are too wide to enter positions profitably"
    ],
    correct: 0
  },
  {
    q: "What is the opening range and how do traders use it as a reference point throughout the day?",
    variants: [
      "Define the opening range and explain how it is used to make trading decisions later in the session.",
      "A stock establishes a high of $52.40 and a low of $51.20 in the first 30 minutes. How do you use these levels?",
      "Why is the opening range considered one of the most important reference points for intraday traders?"
    ],
    a: "The opening range is the high and low established in the first 15 to 30 minutes of trading. It represents the initial battle between buyers and sellers after the open. Traders use it as a reference throughout the day — a break above the opening range high with volume is bullish and signals potential for continuation upward. A break below the opening range low is bearish. Price often rotates between these levels during midday and breaks out of the range in the afternoon.",
    hint: "The opening range is where the first significant battle of the day was fought. That battlefield becomes reference for the rest of the day.",
    options: [
      "High and low of first 15-30 minutes — break above is bullish, break below is bearish, levels act as reference all day",
      "The range between the prior day close and the opening price — used to determine gap fill targets",
      "The distance between VWAP and the first candle close — used to set intraday profit targets",
      "A fixed range of 50 cents above and below the opening price used as default stop placement"
    ],
    correct: 0
  },
  {
    q: "Why do experienced traders reduce size or stop trading entirely during the 11:30 AM to 2:00 PM window?",
    variants: [
      "What specifically happens to market conditions between 11:30 AM and 2:00 PM that makes it the most dangerous trading window?",
      "You are profitable at 11:45 AM. An experienced trader tells you to stop trading. Why?",
      "Describe the characteristics of midday trading and why the strategies that work at the open stop working then."
    ],
    a: "During midday institutional volume drops significantly as large funds go to lunch and pause activity. Without institutional participation the bid-ask spreads widen, moves become smaller and more random, and the clean directional trends that create good setups disappear. Strategies that work at the open — momentum, breakouts, VWAP plays — stop working reliably because there is not enough real volume to sustain moves. Most experienced traders protect their morning profits by sitting out this window rather than giving them back on choppy trades.",
    hint: "Remove the institutions from the market and what is left? Who is still trading and what does their behavior look like?",
    options: [
      "Institutional volume drops sharply — spreads widen, moves become random, and momentum strategies stop working reliably",
      "Midday is dangerous because breaking news is most likely to hit during lunch hours creating unpredictable gaps",
      "The algo programs that run at the open shut down at 11:30 making price action purely retail-driven and more predictable",
      "Tax regulations require institutional funds to stop trading during midday to prevent market manipulation"
    ],
    correct: 0
  },
  {
    q: "What is power hour and what typically drives the increased volume and volatility in the final hour?",
    variants: [
      "Define power hour and explain the mechanics behind why the final hour of trading is often the most active.",
      "Why does volume typically surge in the last hour of the trading day and what types of moves does this create?",
      "What causes power hour and how should you adjust your trading approach during 3:00 to 4:00 PM?"
    ],
    a: "Power hour is the final hour of trading from 3:00 to 4:00 PM ET. Volume surges during this period because institutional funds are making final position adjustments before the close, index funds are rebalancing, and traders are closing or adjusting positions rather than holding overnight. This creates strong directional moves that tend to follow the direction the stock or market has been trending all day. Stocks that have been strong all day often make their strongest move in the final hour.",
    hint: "Think about what large funds need to do before the close and how all those orders hitting the market at once creates movement.",
    options: [
      "Final hour volume surge from institutional rebalancing and position adjustments — tends to accelerate the day's existing trend",
      "Power hour is random volatility caused by retail traders making impulsive end-of-day decisions",
      "Increased volume from after-hours traders entering positions early before the market closes",
      "Power hour only occurs on expiration Fridays when options traders are forced to cover positions"
    ],
    correct: 0
  },
  {
    q: "What does selling into strength mean and why is it better than waiting for your exact target?",
    variants: [
      "Explain the concept of selling into strength and why professional traders prefer it over holding for a fixed target.",
      "A stock is running hard toward your target. Do you wait for the exact number or sell now? Why?",
      "Why do experienced traders take profits while a stock is still moving rather than waiting for it to stop?"
    ],
    a: "Selling into strength means taking profits while price is still moving in your favor — while the bid is active and buyers are still aggressive — rather than waiting for price to hit your exact target and reverse. By the time price hits your target it may be losing momentum, spread is widening, and you may end up getting a worse fill than if you sold into the move. Selling into strength gets you out at strong prices with minimal slippage and removes the emotional greed of holding for more.",
    hint: "It is easier to sell when there are aggressive buyers. What happens to liquidity once the move is over?",
    options: [
      "Taking profits while buyers are still aggressive gives better fills and avoids the reversal that often happens right at targets",
      "Always wait for your exact target — selling early trains you to take less than you planned and hurts profitability",
      "Selling into strength only applies to options — for stock positions always hold to the exact target price",
      "Sell into strength only when the position is losing — for winning trades always hold until the target is reached"
    ],
    correct: 0
  },
  {
    q: "What is a trailing stop and when should you switch from a fixed stop to a trailing stop?",
    variants: [
      "Define a trailing stop and explain the specific trigger that tells you to switch from your original stop to a trailing stop.",
      "Your trade is working and price has moved significantly past your entry. How do you use a trailing stop to protect profits?",
      "When does it make sense to move from a fixed stop at your original risk level to a trailing stop?"
    ],
    a: "A trailing stop is a stop that moves up with price as the trade goes in your favor — locking in more profit as the stock rises while still giving the trade room to breathe. You switch from a fixed stop to a trailing stop when the trade has moved enough to justify protecting profits — typically after hitting your first target or after price has moved at least 1.5 to 2 times your original risk in your favor. At that point you trail the stop below recent candle lows or key levels rather than holding your original entry stop.",
    hint: "Once you have significant profit, the goal changes from managing risk to locking in gains. That is when the trailing stop takes over.",
    options: [
      "A stop that moves with price — switch to it after hitting first target or moving 1.5-2x your risk in your favor to lock in gains",
      "A stop placed a fixed dollar amount below current price regardless of chart structure — used from the moment you enter",
      "Switch to a trailing stop as soon as you are breakeven since protecting capital is always the priority",
      "Trailing stops are only for swing trades — intraday traders should always use fixed stops at their original level"
    ],
    correct: 0
  },
  {
    q: "What does it mean when a stock fails to make a new high on a bounce after a strong move up and why is it a warning signal?",
    variants: [
      "A stock made a high of $55, pulled back, bounced back up to $54.20, then started pulling back again. What does this tell you?",
      "Explain the significance of a failed new high attempt after a strong upward move.",
      "Price cannot reclaim its previous high on the second attempt. What does this reveal about buying and selling pressure?"
    ],
    a: "When a stock cannot make a new high on a bounce it means buyers are losing strength — they could not push price back to where it was before. This is the first sign of a potential trend reversal. It creates a lower high which is the beginning of a downtrend structure. If you are long this is a signal to tighten your stop or begin taking profits. If you are watching it as a potential short, a failed new high followed by a break below the last pullback low is a solid short setup.",
    hint: "If buyers could not push it back to the previous high, what does that tell you about who is gaining the upper hand?",
    options: [
      "Buying pressure is weakening — creates a lower high which is the first sign of potential trend reversal, time to tighten stops",
      "A positive sign showing the stock is consolidating before a powerful breakout to new highs",
      "Completely normal and expected — stocks never go straight up and failed new highs are part of every healthy uptrend",
      "Only significant if it happens three times in a row — one failed new high attempt is not enough data to act on"
    ],
    correct: 0
  },
  {
    q: "What is the 9 EMA and how do day traders use it as a dynamic support level during an uptrend?",
    variants: [
      "Explain how the 9 EMA functions as dynamic support during an intraday uptrend.",
      "A stock is in a strong uptrend on the 5-minute chart and keeps touching the 9 EMA before bouncing. How do you trade this?",
      "What makes the 9 EMA more useful than a horizontal support level for intraday trading?"
    ],
    a: "The 9 EMA is the 9-period exponential moving average — one of the most watched short-term momentum indicators for day traders. In a strong uptrend on the 5-minute chart price repeatedly pulls back to touch the 9 EMA and bounces. Day traders use these touches as entry points — buying the dip to the 9 EMA with a stop just below it. Unlike horizontal support which is static, the 9 EMA is dynamic and rises with the trend, giving you progressively better entries as the stock moves higher.",
    hint: "A moving average moves with the stock. How does that make it more useful than a fixed horizontal line?",
    options: [
      "9 EMA rises with the trend providing dynamic support — traders buy touches of it with tight stops just below for high-probability entries",
      "The 9 EMA is a sell signal — when price touches it in an uptrend it means momentum is fading and you should exit",
      "Use the 9 EMA only as a directional filter — never as an actual entry or exit trigger on intraday charts",
      "The 9 EMA is only useful on daily charts — on intraday charts it moves too fast to be a reliable support level"
    ],
    correct: 0
  },
  {
    q: "What does it mean when the 9 EMA crosses below the 20 EMA on a 5-minute chart mid-session?",
    variants: [
      "You are watching a stock and notice the 9 EMA has crossed below the 20 EMA on the 5-minute chart. What does this signal?",
      "Explain the bearish significance of a 9 EMA crossing below the 20 EMA during the trading session.",
      "The short-term moving average crosses below the medium-term moving average on your chart. What action do you consider?"
    ],
    a: "When the 9 EMA crosses below the 20 EMA it is a bearish momentum signal — the short-term average is now below the medium-term average meaning recent price action is weaker than the broader trend. On a 5-minute chart mid-session this warns that the stock is losing upside momentum and may be transitioning from uptrend to downtrend. If you are long it is a warning to tighten stops or exit. It does not guarantee a reversal but it tells you the momentum has shifted.",
    hint: "When the faster moving average falls below the slower one, which direction is short-term momentum pointing?",
    options: [
      "Bearish momentum shift — short-term price action weakening below medium-term trend, tighten stops on longs or consider exit",
      "A bullish signal showing the stock is compressing before a powerful breakout above both moving averages",
      "Completely neutral — moving average crosses on 5-minute charts are too noisy to use as trading signals",
      "A buy signal — when the 9 EMA dips below the 20 EMA it creates the best risk reward entry in an uptrend"
    ],
    correct: 0
  },
  {
    q: "Why do the 50 SMA and 200 SMA matter to day traders even though they are long-term averages?",
    variants: [
      "As a day trader focused on intraday moves, why should you care about the 50-day and 200-day moving averages?",
      "A stock approaches its 200-day moving average on the daily chart. How does this affect your intraday trading plan?",
      "Explain why long-term moving averages create meaningful support and resistance for short-term traders."
    ],
    a: "The 50 SMA and 200 SMA matter because institutions use them as reference points for buying and selling decisions. When a stock approaches a major moving average on the daily chart it attracts a huge concentration of institutional orders — some buying at that level as support and some selling into it as resistance. This creates real price reactions that day traders can trade around. A day trader ignoring a major daily moving average may take a long position right into a massive institutional sell wall.",
    hint: "These averages matter because of WHO watches them, not just what they show mathematically.",
    options: [
      "Institutions use them as buy and sell reference points — approaching these levels on the daily chart creates real institutional order flow day traders can trade around",
      "They do not matter for day traders at all — only swing traders and investors need to watch long-term moving averages",
      "They only matter on the last trading day of each month when funds rebalance based on these averages",
      "Use them only as directional filters — buy above 200 SMA, sell below it, without using them as specific entry levels"
    ],
    correct: 0
  },
  {
    q: "What are the three conditions that must be present for a valid Gap and Go setup?",
    variants: [
      "Walk through the three criteria you check before taking a Gap and Go trade at the open.",
      "A stock gaps up 8% at the open. What three things do you confirm before entering a Gap and Go?",
      "What separates a valid Gap and Go setup from a gap that will fade and reverse?"
    ],
    a: "Three conditions for a valid Gap and Go: 1) A real catalyst — the gap must have a specific fundamental reason behind it such as earnings beat, FDA approval, or major news. Random gaps without news tend to fade. 2) Above-average pre-market volume — institutional participation must be confirmed before the open. 3) Price holding above the pre-market high after the open — the stock must continue to show strength by not fading back below where it gapped from, confirming buyers remain in control after the open.",
    hint: "Why did it gap, who is participating, and is it still holding strength after the open?",
    options: [
      "Real catalyst, above-average pre-market volume, and price holding above pre-market high after the open",
      "Gap size above 5%, pre-market high above prior day high, and float below 50 million shares",
      "Positive earnings, analyst upgrade, and sector confirmation from at least two other stocks in the same space",
      "Gap above prior day close, VWAP reclaim within first 10 minutes, and RSI above 60 on the 5-minute chart"
    ],
    correct: 0
  },
  {
    q: "What is a VWAP reclaim entry and what makes it a high-probability setup?",
    variants: [
      "Describe a VWAP reclaim setup and explain the specific conditions that make it worth trading.",
      "A stock drops below VWAP early in the session then claws its way back above it with strong volume. What setup is forming and why is it significant?",
      "What is the logic behind a VWAP reclaim trade and where do you enter and stop?"
    ],
    a: "A VWAP reclaim entry occurs when a stock drops below VWAP, then recovers and closes a candle back above it with strong volume. It is high probability because VWAP is where institutions benchmark their orders — when a stock reclaims VWAP it means institutional buyers are stepping back in and defending that level. The entry is on the first candle that closes above VWAP, the stop goes below VWAP, and the target is the next significant resistance level. It is one of the cleanest intraday entries because the risk is clearly defined.",
    hint: "VWAP is the institutional benchmark. What happens when institutions decide to start buying again after a dip?",
    options: [
      "Stock drops below VWAP then closes back above it with volume — institutional buyers re-entering gives it high probability with clear defined risk",
      "Stock touches VWAP for the first time all day — the first touch of VWAP is always the strongest entry signal",
      "Stock stays above VWAP all day without ever testing it — entering on the first pullback toward VWAP",
      "VWAP reclaim only works in the first 30 minutes — after that institutions have already completed their orders"
    ],
    correct: 0
  },
  {
    q: "What is a dip buy and what conditions must be present for it to be valid rather than catching a falling knife?",
    variants: [
      "Explain the difference between a valid dip buy and catching a falling knife.",
      "A stock you like has pulled back 8% from its high. What conditions do you need to see before buying the dip?",
      "What separates a high-probability dip buy from an emotional entry into a stock that is still in freefall?"
    ],
    a: "A valid dip buy requires three things: 1) The overall trend must still be intact — you are buying a pullback within an uptrend, not a broken downtrend. 2) Price must show stabilization — the selling must slow down and ideally show a base or consolidation before you enter, not still actively selling off. 3) There should be a defined support level to buy near — a prior high, moving average, or VWAP — so you have a logical stop. Catching a falling knife is entering while price is still in freefall with no sign of stabilization and no nearby support.",
    hint: "A dip buy needs a floor to stand on. Without stabilization and a support level you are guessing at the bottom.",
    options: [
      "Trend intact, price stabilizing at a defined support level — without all three you are catching a falling knife not buying a dip",
      "Any pullback of more than 5% from the day's high qualifies as a valid dip buy in a strong uptrending stock",
      "Buy the dip immediately when price drops to VWAP regardless of how fast it fell or whether it is still falling",
      "Dip buys are only valid after the first hour of trading — pre-10 AM dips are always falling knives"
    ],
    correct: 0
  },
  {
    q: "You see that the FOMC announcement is at 2:00 PM today. How does this change your trading plan for that day?",
    variants: [
      "The Fed is announcing its rate decision at 2:00 PM. Walk through how this affects your trading for the entire day.",
      "What specific adjustments do you make to your trading plan on FOMC announcement days?",
      "How does a major scheduled news event like the Fed announcement change your risk management and timing?"
    ],
    a: "On FOMC days you make several adjustments: trade lighter size in the morning knowing that any gains can be wiped out by the 2:00 PM announcement, take profits earlier rather than holding into the announcement, stop trading or go flat by 1:30 PM before the release, and avoid holding any position through the announcement since the market can move violently in either direction regardless of the actual news. After the announcement you wait for the initial volatility to settle — usually 15 to 30 minutes — before looking for new setups in the new direction.",
    hint: "Binary events create binary outcomes. How do you protect yourself when you cannot predict which way it will go?",
    options: [
      "Trade smaller morning, take profits early, go flat by 1:30 PM, wait 15-30 minutes after announcement for volatility to settle before re-entering",
      "Trade normally until 2:00 PM then double your size to take advantage of the increased post-announcement volatility",
      "Avoid trading entirely for the full day since FOMC days are always unpredictable and no setups are tradeable",
      "Only trade after the announcement — morning trading on FOMC days is fine since the news has not hit yet"
    ],
    correct: 0
  }
];


