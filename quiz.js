
// TST Academy Quiz Engine
// Loaded separately to avoid template literal conflicts in members.html

const QUIZ_DATA = {

  beginner: {
    title: "Beginner Mastery Test",
    section: "beginner",
    passingScore: 75,
    questions: [
      { id:"b_c1", variants:[
        { q:"A green candlestick means price:", choices:["Opened higher than it closed","Closed higher than it opened","Did not move","Had high volume"], answer:1, hint:"Green means buyers won. Price went UP from open to close." },
        { q:"What does the body of a candlestick represent?", choices:["The highest and lowest price","The opening and closing price","Total volume traded","The average price"], answer:1, hint:"The body shows open and close. Wicks show the full range." },
        { q:"A candle closes at $52, opens at $50. What color is it?", choices:["Red","Green","Black","White"], answer:1, hint:"Close higher than open equals green candle." }
      ]},
      { id:"b_c2", variants:[
        { q:"What does a long upper wick tell you?", choices:["Strong buying pressure","Price reached a high but sellers pushed it back down","Volume was above average","The stock will gap up tomorrow"], answer:1, hint:"Long upper wick means buyers tried to push higher but sellers rejected the move." },
        { q:"A candle with a long upper wick and small body near the bottom is called a:", choices:["Hammer","Shooting Star","Doji","Engulfing"], answer:1, hint:"Shooting star has a long upper wick. Sellers slammed it back from the highs." },
        { q:"Which candle pattern signals potential bearish reversal after an uptrend?", choices:["Hammer","Bullish Engulfing","Shooting Star","Morning Star"], answer:2, hint:"Shooting star is a bearish reversal signal. Long upper wick after an uptrend." }
      ]},
      { id:"b_c3", variants:[
        { q:"A Doji candle means:", choices:["Strong buyers","Strong sellers","Indecision - open and close are nearly the same","Very high volume"], answer:2, hint:"Doji means indecision. Open and close are almost identical. Neither side won." },
        { q:"What does a hammer candlestick signal?", choices:["Bearish continuation","Potential bullish reversal - sellers tried but buyers stepped in","Strong downtrend","High volume"], answer:1, hint:"Hammer has a long lower wick. Sellers pushed it down hard but buyers recovered it." },
        { q:"A bullish engulfing pattern occurs when:", choices:["A small red candle follows a large red candle","A small red candle is completely covered by the next green candle","Two green candles appear in a row","A green candle follows a gap down"], answer:1, hint:"Bullish engulfing means the green candle completely wraps around the prior red candle." }
      ]},
      { id:"b_c4", variants:[
        { q:"Which timeframe shows one candle per day?", choices:["1-minute chart","5-minute chart","Daily chart","Weekly chart"], answer:2, hint:"Daily chart means one candle represents one full trading day." },
        { q:"A red candle on a 5-minute chart means:", choices:["The stock fell over 5 days","Price closed lower than it opened during that 5-minute period","Volume was declining","The market was closed"], answer:1, hint:"Red candle means close lower than open for whatever period that candle represents." },
        { q:"What does the lower wick show?", choices:["The opening price","The closing price","The lowest price reached during that period","The average price"], answer:2, hint:"Lower wick shows the lowest point price reached before recovering." }
      ]},
      { id:"b_v1", variants:[
        { q:"Price is rising but volume is declining. This suggests:", choices:["Strong uptrend with conviction","Healthy consolidation","Weakening momentum - the move may not have legs","A breakout is imminent"], answer:2, hint:"Rising price plus falling volume means losing conviction. The move is running out of participants." },
        { q:"A stock breaks out to a new high. Volume should:", choices:["Decrease - sellers are leaving","Expand - buyers are stepping in with conviction","Stay flat","Be irrelevant"], answer:1, hint:"Real breakouts need volume. Expansion confirms buyers mean it." },
        { q:"What does a climax volume spike often signal?", choices:["The start of a new uptrend","Continuation of the current move","Exhaustion - the move may be ending","Low interest in the stock"], answer:2, hint:"Climax volume means massive spike as the last buyers rush in. Often signals exhaustion." }
      ]},
      { id:"b_v2", variants:[
        { q:"A stock has an RVOL of 0.3x. You should:", choices:["Buy immediately - it is ready to move","Be very cautious - volume is far below average","Short it","Ignore and trade normally"], answer:1, hint:"RVOL 0.3x means only 30 percent of normal volume. No participation. Skip it." },
        { q:"Relative Volume of 5x means:", choices:["Price moved 5 percent today","The stock is trading 5 times its average volume","There are 5 buyers for every seller","5 million shares traded"], answer:1, hint:"RVOL 5x means today is 5 times busier than the average day for this stock." },
        { q:"Which RVOL would you most want to see on a day trade candidate?", choices:["0.5x","1.0x","0.8x","3.0x or higher"], answer:3, hint:"Higher RVOL means more participation which means better chance of a meaningful move." }
      ]},
      { id:"b_v3", variants:[
        { q:"During a flag consolidation, volume should:", choices:["Expand significantly","Remain the same","Dry up as sellers exhaust","Be impossible to read"], answer:2, hint:"Healthy flag means declining volume during consolidation. Sellers are running out." },
        { q:"Price action without volume is best described as:", choices:["A strong signal","A reliable setup","A rumor - confirmation requires participation","Always bullish"], answer:2, hint:"Volume is conviction. No volume means no conviction. Do not trust the move." },
        { q:"Green volume bars generally indicate:", choices:["The stock will gap up tomorrow","More shares traded on up-candles","Institutional selling","A bearish reversal"], answer:1, hint:"Green volume bars mean buying activity dominated that candle period." }
      ]},
      { id:"b_ms1", variants:[
        { q:"An uptrend is defined by:", choices:["Random price movement","Higher highs and higher lows","Lower highs and lower lows","Flat price action"], answer:1, hint:"Uptrend means each peak is higher than the last and each pullback bottom is higher than the last." },
        { q:"A downtrend is defined by:", choices:["Higher highs and higher lows","Lower highs and lower lows","Alternating highs and lows","Increasing volume"], answer:1, hint:"Downtrend means each rally fails at a lower level and each drop goes to a new low." },
        { q:"When a stock makes a lower high on a bounce, this signals:", choices:["The uptrend is accelerating","Sellers are getting more aggressive - trend may be weakening","A breakout is coming","Volume is increasing"], answer:1, hint:"Lower high means buyers cannot push it as far as before. Sellers are stepping in earlier." }
      ]},
      { id:"b_ms2", variants:[
        { q:"A range-bound market means:", choices:["The stock is in a strong uptrend","Price is oscillating between support and resistance without a clear trend","Volume is very high","The stock just had earnings"], answer:1, hint:"Range-bound means stuck between two levels. Buy the floor, sell the ceiling." },
        { q:"In an uptrend, each pullback should:", choices:["Go lower than the last pullback low","Stay above the previous pullback low","Have no pullbacks","Fill the gap"], answer:1, hint:"Healthy uptrend means higher lows. Each dip should be shallower than the last." },
        { q:"What does it mean when price breaks a key support level with high volume?", choices:["Bullish - price will recover quickly","Bearish - sellers have overwhelmed buyers at this level","Neutral - volume does not matter","Buy immediately"], answer:1, hint:"Support break with volume means genuine breakdown. Sellers mean it. Do not catch the knife." }
      ]},
      { id:"b_ms3", variants:[
        { q:"Resistance is:", choices:["A level where buyers consistently step in","A level where sellers consistently stop the advance","The 200-day moving average","The VWAP level"], answer:1, hint:"Resistance is the ceiling. Sellers overwhelm buyers at this level preventing further advance." },
        { q:"When resistance is broken, it often becomes:", choices:["Resistance again","Irrelevant","Support for future pullbacks","A sell signal"], answer:2, hint:"Broken resistance flips to support. Buyers who missed the breakout buy the retest." },
        { q:"A stock consolidates between $45 and $50. Where is resistance?", choices:["$45","$47.50","$50","Below $45"], answer:2, hint:"The top of the consolidation range is resistance. That is where sellers have been active." }
      ]},
      { id:"b_l2_1", variants:[
        { q:"Level 2 shows you:", choices:["Only the last price traded","All pending buy and sell orders at different price levels","Historical price data","A stock earnings history"], answer:1, hint:"Level 2 is the order book. You see all bids and asks waiting to be filled." },
        { q:"The bid price is:", choices:["The highest price a seller will accept","The lowest price a buyer will pay","The highest price a buyer is willing to pay","The last traded price"], answer:2, hint:"Bid is what buyers will pay. Ask is what sellers want. Spread is the difference." },
        { q:"A large block of shares on the ask is called:", choices:["A hammer","A wall","A squeeze","A catalyst"], answer:1, hint:"A wall is a large seller on the ask blocking further advance. Watch if it absorbs or disappears." }
      ]},
      { id:"b_l2_2", variants:[
        { q:"On the tape, prints hitting the ASK indicate:", choices:["Aggressive selling","Aggressive buying - buyers are paying the seller price","Neutral trading","Low volume"], answer:1, hint:"Hitting the ask means aggressive buyers. They want in now and are paying up for it." },
        { q:"What does a wide bid-ask spread signal?", choices:["High liquidity","Low liquidity - fewer participants, harder to get in and out","Strong buying pressure","Upcoming news"], answer:1, hint:"Wide spread means low liquidity. Costs more to enter and exit. Be careful with size." },
        { q:"Reading the tape helps you identify:", choices:["Next week price","Whether buyers or sellers are more aggressive right now","Earnings reports","Dividends"], answer:1, hint:"Tape shows who is more aggressive in real time. Buyers hitting asks or sellers hitting bids." }
      ]},
      { id:"b_ls1", variants:[
        { q:"Going long means:", choices:["Buying expecting price to fall","Buying expecting price to rise","Selling borrowed shares","Trading after hours"], answer:1, hint:"Long means buy low, sell higher. You profit when price goes up." },
        { q:"Going short means:", choices:["Buying expecting price to rise","Selling borrowed shares expecting price to fall","Holding a stock for a long time","Trading small size"], answer:1, hint:"Short means borrow shares, sell them, buy back cheaper later. You profit when price falls." },
        { q:"Which direction profits when a stock falls from $50 to $40?", choices:["Long position","Short position","Both equally","Neither"], answer:1, hint:"Short sellers profit when price falls. They sold at $50 and can cover at $40." }
      ]},
      { id:"b_ls2", variants:[
        { q:"The maximum loss on a long position is:", choices:["Unlimited","100 percent of the investment","$1,000","Your stop loss amount"], answer:1, hint:"Long max loss is 100 percent. Stock can only go to zero. Short has theoretically unlimited loss." },
        { q:"A short squeeze occurs when:", choices:["Short sellers profit enormously","A heavily shorted stock rises rapidly forcing shorts to buy back shares","The market gaps down","Volume dries up"], answer:1, hint:"Short squeeze means stock runs hard, shorts forced to cover, adding more buying pressure." },
        { q:"Short selling requires:", choices:["Only a cash account","Borrowing shares from your broker to sell","No margin","A special news catalyst"], answer:1, hint:"To short, you borrow shares from your broker, sell them, then buy back later." }
      ]},
      { id:"b_rm1", variants:[
        { q:"You have a $10,000 account and risk 1 percent per trade. Your max loss per trade is:", choices:["$10","$100","$1,000","$500"], answer:1, hint:"1 percent of $10,000 equals $100. Never risk more than 1 to 2 percent on any single trade." },
        { q:"You have a $5,000 account and risk 2 percent per trade. Your max loss per trade is:", choices:["$50","$500","$100","$1,000"], answer:2, hint:"2 percent of $5,000 equals $100. Position sizing keeps losses manageable." },
        { q:"Your account is $20,000. You risk 1 percent. Entry is $50, stop is $49. How many shares?", choices:["100 shares","200 shares","400 shares","50 shares"], answer:1, hint:"$200 risk divided by $1 risk per share equals 200 shares." }
      ]},
      { id:"b_rm2", variants:[
        { q:"The purpose of a daily max loss rule is:", choices:["To make more money faster","To prevent one bad day from destroying weeks of gains","To limit the number of trades","To guarantee profits"], answer:1, hint:"Daily max loss stops the avalanche. One bad trade becomes a bad day, not a bad week." },
        { q:"You hit your daily max loss. What do you do?", choices:["Take one more trade to make it back","Double your size","Stop trading for the day - no exceptions","Switch to a different strategy"], answer:2, hint:"Hit your daily max loss means done for the day. No exceptions. The market is open tomorrow." },
        { q:"A 2:1 risk/reward trade means:", choices:["You risk $2 to make $1","You risk $1 to make $2","You always win twice","Your stop is twice your target"], answer:1, hint:"2:1 means target is twice your stop. Risk $100 to make $200." }
      ]},
      { id:"b_rm3", variants:[
        { q:"At 2:1 risk/reward, what win rate do you need to be profitable?", choices:["75%","60%","Just above 33%","50%"], answer:2, hint:"At 2:1 you only need to win 1 in 3 trades. Win $200, lose $100 twice equals breakeven." },
        { q:"Paper trading is:", choices:["Writing trade ideas in a notebook","Trading with simulated money to practice without real risk","A type of options strategy","Only for beginners"], answer:1, hint:"Paper trading means practice with fake money. Real market, real prices, no real loss." },
        { q:"Which is the most important rule of risk management?", choices:["Always use market orders","Never use a stop loss","Define your risk before you enter every trade","Only trade when volume is high"], answer:2, hint:"Know your risk before you enter. Stop placement is not optional. It is the foundation." }
      ]},
      { id:"b_rm4", variants:[
        { q:"Your stop is $1 below entry and ATR is $3. Your stop is:", choices:["Well placed","Too wide","Too tight - likely to get stopped out by normal price noise","Perfect for all trades"], answer:2, hint:"Stop at 0.33x ATR is far too tight. Normal daily volatility will stop you out on a valid trade." },
        { q:"Position size should decrease when:", choices:["You are on a winning streak","You are in a drawdown or markets are choppy","Volume is high","The setup looks perfect"], answer:1, hint:"In drawdowns cut size. Protect capital and confidence. Scale back up when results confirm." },
        { q:"The wash sale rule means:", choices:["You must wash your hands before trading","You cannot claim a tax loss if you rebuy the same stock within 30 days","All day trading losses are tax free","You must hold stocks for 30 days"], answer:1, hint:"Wash sale means sell at a loss, buy back within 30 days, and the IRS disallows the loss deduction." }
      ]}
    ]
  },

  intermediate: {
    title: "Intermediate Mastery Test",
    section: "intermediate",
    passingScore: 75,
    questions: [
      { id:"i_ps1", variants:[
        { q:"SPY drops 2% in the first hour. What should you do with your long setups?", choices:["Trade normally","Be more selective - the market headwind reduces win rate on longs","Double your size to compensate","Switch entirely to swing trades"], answer:1, hint:"Market tailwind matters. Trading longs into a falling SPY means fighting the tide." },
        { q:"QQQ is above VWAP and trending up. Your tech stock long setup is:", choices:["Lower probability","Higher probability - market context supports the direction","Irrelevant to QQQ","Automatically a winner"], answer:1, hint:"QQQ above VWAP means institutional buying in tech. Your tech long has the wind at its back." },
        { q:"What is the most important index to watch if you trade large cap tech stocks?", choices:["IWM","DOW","QQQ","VIX"], answer:2, hint:"QQQ tracks the top 100 NASDAQ companies heavy in tech. Essential reference for tech trading." }
      ]},
      { id:"i_ps2", variants:[
        { q:"The VIX is at 32. How should you adjust your trading?", choices:["Trade larger - more volatility means more profit","Trade smaller with wider stops - market is very volatile","Stop trading completely","Only trade options"], answer:1, hint:"VIX above 30 means high fear. Widen stops, reduce size. Setups are less predictable." },
        { q:"IWM is falling while SPY is rising. This indicates:", choices:["Small caps will catch up soon - buy IWM","Risk appetite is narrowing - large caps holding but small caps being sold","A great day to trade small caps","Sector rotation into small caps"], answer:1, hint:"Small caps lagging means risk-off undertone. Money moving to safety of large caps." },
        { q:"Sector rotation means:", choices:["Changing your trading strategy","Money flowing from one sector to another as conditions change","Rotating between brokers","Changing position size"], answer:1, hint:"Sector rotation means institutional money leaving one area and entering another." }
      ]},
      { id:"i_wl1", variants:[
        { q:"How many stocks should be on your active daily watchlist?", choices:["As many as possible","50-100","2-3 high conviction names","Just 1"], answer:2, hint:"2-3 stocks maximum. Deep focus on fewer names beats shallow coverage of many." },
        { q:"Before the market opens, for each watchlist stock you should know:", choices:["Only the chart pattern","Your bias, entry trigger, where you are wrong, and where you take profits","Just the news catalyst","Only the volume"], answer:1, hint:"Pre-market game plan: bias plus entry trigger plus invalidation plus target. All four, every stock." },
        { q:"The best time to build your watchlist is:", choices:["After the market opens","During trading hours","The night before or pre-market before 9:30 AM","It does not matter when"], answer:2, hint:"Pre-market preparation equals execution during the session. Reactive trading is your enemy." }
      ]},
      { id:"i_conf1", variants:[
        { q:"What is the difference between a setup and a signal?", choices:["They are the same thing","Setup means conditions forming. Signal means the trigger that says act now","Signal comes before the setup","Setup is for options, signal is for stocks"], answer:1, hint:"Setup means I see an opportunity forming. Signal means confirmation it is time to enter." },
        { q:"Confirmation on a breakout means:", choices:["The stock moved 10%","A candle closes above resistance with expanding volume","Your mentor approves the trade","RSI is above 50"], answer:1, hint:"Confirmation means price closes above the level AND volume expands. Both required." },
        { q:"Which is the most reliable breakout confirmation?", choices:["A wick above resistance","A full candle close above resistance on above-average volume","Price touching resistance and bouncing","A gap above resistance on low volume"], answer:1, hint:"Full candle close plus volume equals real breakout. Wicks and low-volume breaks are likely fakeouts." }
      ]},
      { id:"i_conf2", variants:[
        { q:"Confluence means:", choices:["One strong signal is enough to trade","Multiple independent signals pointing in the same direction at the same time","Trading multiple stocks simultaneously","Combining day trading and swing trading"], answer:1, hint:"Confluence means 3 different reasons to enter the same trade. More signals equals higher probability." },
        { q:"A stock is at prior support, on the 50-day MA, and RSI is oversold. This represents:", choices:["One weak signal","High confluence - three independent signals at the same level","A reason to short","A signal to ignore"], answer:1, hint:"Three independent signals at one level means high confluence long setup." },
        { q:"Which entry has more confluence?", choices:["A breakout above resistance only","A breakout above resistance with above-average volume in a leading sector on an up-market day","A breakout on any volume","A breakout on declining volume"], answer:1, hint:"More supporting factors equals more confluence equals higher probability." }
      ]},
      { id:"i_tod1", variants:[
        { q:"Between 11:30 AM and 2:00 PM, most traders should:", choices:["Increase trading activity","Trade aggressively with large size","Reduce activity significantly - lowest volume and highest fakeout risk","Trade only small caps"], answer:2, hint:"Midday means chop. Volume dries up. Fakeouts are common. Professionals sit on their hands." },
        { q:"The opening range is the high and low of:", choices:["The first week of trading","The first 5-30 minutes of the session","Pre-market only","The previous day"], answer:1, hint:"Opening range means the first 5-30 minutes. These levels are key reference points all day." },
        { q:"Power hour is:", choices:["The first hour after open","The last hour of trading from 3 to 4 PM when volume returns","The middle of the day","Pre-market"], answer:1, hint:"Power hour is 3 to 4 PM. Institutions rebalance, volume surges, strong setups often resume." }
      ]},
      { id:"i_sell1", variants:[
        { q:"Selling into key levels means:", choices:["Always sell at the exact top","Taking profits as price approaches known resistance rather than waiting for a reversal","Selling only after price reverses","Never selling early"], answer:1, hint:"Sell into strength at resistance. Do not wait for the reversal to confirm. By then it is too late." },
        { q:"When scaling out of a winner, you should:", choices:["Sell everything at once at the first sign of resistance","Sell partial at first target, move stop to breakeven, hold the rest","Hold everything until your target or stop","Sell only if the stock turns red"], answer:1, hint:"Scale out means take partial profits, lock in gains, remove risk on remainder. Best of both worlds." },
        { q:"A stock hits your target. You should:", choices:["Hold for more - it might keep going","Execute your pre-planned exit - the plan was set before emotions got involved","Ask your broker what to do","Wait for volume to dry up"], answer:1, hint:"When your target hits your pre-market plan executes. Greed kills profits." }
      ]},
      { id:"i_ps3", variants:[
        { q:"The First 5 Candles rule suggests:", choices:["Enter immediately at 9:30 AM","Watch the first 5 minutes to read market character before trading","Trade only the first 5 minutes","All 5 candles must be green to buy"], answer:1, hint:"First 5 candles mean market intelligence. Read before you act. Rushing causes the worst entries." },
        { q:"A Gap and Go setup requires:", choices:["A gap with no catalyst","A gap on a strong catalyst that holds the gap level in the first 5-10 minutes with volume","Any stock that opens higher","A gap that immediately fills"], answer:1, hint:"Gap and Go means strong catalyst plus gap holds plus volume confirms. Three elements required." },
        { q:"VWAP reclaim as a long entry means:", choices:["Shorting when price returns to VWAP","Entering long after price drops below VWAP then recovers back above it with volume","Buying when price is far above VWAP","Waiting for VWAP to slope upward"], answer:1, hint:"VWAP reclaim means price dipped below, buyers stepped in, reclaimed VWAP. Institutional interest confirmed." }
      ]},
      { id:"i_econ1", variants:[
        { q:"On FOMC announcement days, most experienced traders:", choices:["Trade full size aggressively","Reduce size, widen stops, or avoid trading around the announcement","Only trade options","Buy SPY calls"], answer:1, hint:"FOMC means extreme volatility in both directions. Reduce size until the dust settles." },
        { q:"CPI data comes in much higher than expected. What likely happens to tech stocks?", choices:["They rally sharply","They sell off - high inflation means Fed raises rates which is bad for growth stocks","They do not move","They gap up at the open"], answer:1, hint:"High inflation means higher rates expected which means growth stocks compress valuations and sell off." },
        { q:"The economic calendar tells you:", choices:["Which stocks to buy every day","When major market-moving reports are scheduled so you can prepare","Earnings dates only","When the market is closed"], answer:1, hint:"Economic calendar is your daily heads up on what could move the market. Check it every morning." }
      ]}
    ]
  },

  smallcaps: {
    title: "Small Cap Readiness Test",
    section: "smallcaps",
    passingScore: 75,
    questions: [
      { id:"sc_sq1", variants:[
        { q:"A short squeeze is most likely to occur when:", choices:["Short interest is very low","A heavily shorted stock with low float gets a positive catalyst and rises rapidly","The market gaps down","Volume is below average"], answer:1, hint:"Short squeeze means high short interest plus positive catalyst plus forced covering equals explosive upside." },
        { q:"Short interest of 50% means:", choices:["50% of shares are owned by institutions","50% of the float has been sold short","The stock has declined 50%","Only 50 traders own the stock"], answer:1, hint:"Short interest is the percentage of float sold short. 50% is extremely high and means massive squeeze potential." },
        { q:"Days to Cover of 15 means:", choices:["The stock will peak in 15 days","It would take 15 days of average volume for all shorts to buy back their shares","15% of shares are short","The stock is halted for 15 days"], answer:1, hint:"High days to cover means shorts are trapped. They cannot exit quickly without pushing price up." }
      ]},
      { id:"sc_mp1", variants:[
        { q:"The morning panic in a small cap runner typically occurs:", choices:["At 3 PM power hour","During the first 30-60 minutes when early buyers take profits and stop losses trigger","Only on down market days","After earnings"], answer:1, hint:"Morning panic means early buyers sell, stops trigger, panic creates a fast flush then recovery." },
        { q:"How do you know a morning panic flush is over?", choices:["Price drops 50%","Volume explodes then dries up at the low as selling exhausts","The VIX spikes","RSI hits zero"], answer:1, hint:"Flush low means high volume spike then volume dries up. Sellers exhausted. Buyers step in." },
        { q:"The morning panic recovery entry is taken:", choices:["During the panic selloff","After stabilization - price bases at the low and begins reclaiming a key level with volume","At the exact low of the flush","Pre-market"], answer:1, hint:"Never catch the falling knife. Wait for base formation and reclaim before entering." }
      ]},
      { id:"sc_l2_1", variants:[
        { q:"On a thin small cap stock, a large order on the ask is called:", choices:["A catalyst","A wall - large seller blocking further advance","A short squeeze","A breakout"], answer:1, hint:"Wall means large seller at a price level. Stock struggles to break through until the wall is absorbed." },
        { q:"A fake wall on Level 2 disappears when:", choices:["The stock reverses","Price approaches it - it was placed to slow down buyers, not to actually sell","Volume dries up","The market closes"], answer:1, hint:"Fake wall is placed to scare buyers. When price gets close it vanishes. Real walls hold and absorb." },
        { q:"On a thin small cap, reading the tape is:", choices:["Less important than on large caps","More important - each print represents a more significant portion of the float","Impossible due to wide spreads","Only useful after hours"], answer:1, hint:"Thin stocks mean each large print matters more. The tape tells you who is in control." }
      ]},
      { id:"sc_sp1", variants:[
        { q:"A spread of $0.25 on a $5 stock represents:", choices:["0.5% cost","5% cost - you need a 5% move just to break even on exit","25 cents per share profit","Normal trading cost"], answer:1, hint:"$0.25 on $5 equals 5% spread. You are already down 5% the moment you enter. Factor this in." },
        { q:"On a small cap with a $0.50 wide spread, you should use:", choices:["Market orders only","Limit orders only - market orders can fill at terrible prices","Stop market orders","It does not matter"], answer:1, hint:"Wide spread plus market order equals nightmare fill. Always use limit orders on thin stocks." },
        { q:"Dilution risk means:", choices:["Your position size is too large","The company may issue new shares increasing supply and dropping the price","Too many traders are shorting the stock","The stock is going to reverse"], answer:1, hint:"Dilution means company sells new shares. More supply equals lower price. Check for shelf registrations." }
      ]},
      { id:"sc_float1", variants:[
        { q:"A stock with a 2 million share float is more volatile than a stock with 500 million shares because:", choices:["It has a lower price","Less supply means the same buying pressure moves price much further","Small cap companies always have news","The spreads are always tighter"], answer:1, hint:"Low float means less supply. Same demand pushes price much harder and faster. More explosive." },
        { q:"Float rotation occurs when:", choices:["The company changes its management","The stock daily volume exceeds its total float meaning every share has changed hands at least once","The float decreases","Institutional investors buy the float"], answer:1, hint:"Float rotation means volume greater than float. The same shares trading repeatedly. Very volatile conditions." },
        { q:"A parabolic move in a small cap almost always ends with:", choices:["A gradual decline","A violent reversal - the blow-off top when the last buyer is in","A stable consolidation","A gap up the next day"], answer:1, hint:"Parabolic blow-off means climax candle, last buyers in, sellers overwhelm, violent reversal." }
      ]}
    ]
  },

  options: {
    title: "Options Knowledge Test",
    section: "options",
    passingScore: 75,
    questions: [
      { id:"o_de1", variants:[
        { q:"A call option gives you the right to:", choices:["Sell 100 shares at the strike price","Buy 100 shares at the strike price before expiration","Short the stock","Collect dividends"], answer:1, hint:"Call means right to buy at the strike price. Put means right to sell." },
        { q:"A put option increases in value when:", choices:["The stock rises","The stock falls below the strike price","Volume increases","Implied volatility decreases"], answer:1, hint:"Put is a bearish bet. Put gains value when stock falls toward or below the strike." },
        { q:"You buy a call with a $50 strike when the stock is at $48. The call is:", choices:["In the money","At the money","Out of the money","Expired"], answer:2, hint:"OTM call means strike is above current price. Stock needs to rise above $50 to have intrinsic value." }
      ]},
      { id:"o_de2", variants:[
        { q:"An option expiring next Friday is worth less than the same option expiring in 3 months because:", choices:["The strike price is different","Less time means less time for the stock to move in your favor","The stock price changed","IV is always lower near expiration"], answer:1, hint:"Time value decays. Less time to expiration means less chance of a big move means lower premium." },
        { q:"Theta measures:", choices:["How much an option moves per $1 of stock movement","How much an option loses in value per day due to time decay","Sensitivity to volatility","Probability of expiring in the money"], answer:1, hint:"Theta is daily time decay. Every day that passes your option loses value. Theta works against buyers." },
        { q:"IV crush after earnings means:", choices:["The stock drops sharply after earnings","Implied volatility collapses after the uncertainty is resolved reducing option prices","Your options triple in value","You should always buy options before earnings"], answer:1, hint:"IV crush means volatility priced in before earnings collapses after. Even correct direction can lose money." }
      ]},
      { id:"o_sp1", variants:[
        { q:"Delta of 0.50 means:", choices:["50% probability of profit","The option moves $0.50 for every $1 the stock moves","The option expires in 50 days","50 shares of exposure"], answer:1, hint:"Delta is directional sensitivity. 0.50 delta means option moves 50 cents per $1 stock move." },
        { q:"An in-the-money call has a delta closest to:", choices:["0.10","0.30","0.50","0.90"], answer:3, hint:"Deep ITM options move almost like the stock. Delta approaches 1.0 which means 100 cents per $1 move." },
        { q:"You want an options position that behaves most like owning 100 shares. You should buy:", choices:["Far out-of-the-money calls with low delta","Deep in-the-money calls with high delta near 1.0","At-the-money puts","Weekly options expiring tomorrow"], answer:1, hint:"High delta moves like stock. Deep ITM means delta near 1.0 which means almost dollar for dollar." }
      ]},
      { id:"o_0dte1", variants:[
        { q:"The 3:40 0DTE rule works because:", choices:["Market makers lower prices at 3:40","Near-the-money 0DTE options have almost no time value left so small moves create huge percentage gains","SPY always moves after 3:40","Volume disappears at 3:40"], answer:1, hint:"0DTE near expiry means pure intrinsic value. A $2 move on SPY can turn a $0.10 option into $2.00." },
        { q:"How much should you risk on a single 0DTE options trade?", choices:["25% of account","10% of account","1-2% of account - treat it as defined risk that can go to zero","50% - high reward needs high risk"], answer:2, hint:"0DTE can go to zero instantly. Size it like a lottery ticket. 1-2% max. Huge upside, defined loss." },
        { q:"The best 0DTE setups at 3:40 PM have:", choices:["Unclear direction","A clear directional trend established in the final hour with no major resistance nearby","Very low volume","High VIX"], answer:1, hint:"Clear trend plus momentum plus no resistance means 0DTE has a real chance to run in your direction." }
      ]},
      { id:"o_sp2", variants:[
        { q:"A credit spread means you:", choices:["Pay premium to enter the trade","Collect premium upfront and profit if the stock stays range-bound","Lose money if the stock does not move","Have unlimited risk"], answer:1, hint:"Credit spread means seller. You collect premium. Time works for you. Max loss is defined and capped." },
        { q:"A covered call involves:", choices:["Owning 100 shares and selling a call against them to generate income","Buying a call without owning shares","Selling a put and a call simultaneously","Only options no stock"], answer:0, hint:"Covered call means own stock plus sell call. Income generation strategy. Upside capped at the strike." },
        { q:"Before buying any options, what should you always check?", choices:["The CEO Twitter account","Implied Volatility - buying high IV means overpaying for premium","The stock dividend","Only the chart"], answer:1, hint:"High IV means expensive premium. You can be right about direction and still lose to IV crush." }
      ]},
      { id:"o_sp3", variants:[
        { q:"For a swing trade lasting 5-7 days, the best options expiration is:", choices:["0DTE","This Friday expiration","2-3 weeks out - gives the trade time without extreme theta decay","6 months out"], answer:2, hint:"2-3 weeks gives your swing trade time to develop without theta destroying you daily." },
        { q:"The expected move on an options chain tells you:", choices:["How much the stock will definitely move","What the market is pricing in as the likely move by expiration","Your guaranteed profit","Nothing useful"], answer:1, hint:"Expected move is the ATM straddle price. Market consensus on the magnitude of the move." },
        { q:"Rolling an options position means:", choices:["Closing it for a loss","Closing the current contract and opening a new one at a later expiration to give more time","Doubling your position size","Converting to a different strategy"], answer:1, hint:"Rolling means extend time. If thesis is intact but timing was off roll out to give the trade more runway." }
      ]}
    ]
  },

  swingtrading: {
    title: "Swing Trading Mastery Test",
    section: "swingtrading",
    passingScore: 75,
    questions: [
      { id:"sw_1", variants:[
        { q:"Swing trading differs from day trading because:", choices:["You never use charts","Positions are held for multiple days to weeks rather than closing by end of session","You use larger accounts only","It requires no stop losses"], answer:1, hint:"Swing trading means hold overnight and potentially for days or weeks. Day trading means close by EOD." },
        { q:"The primary chart for swing trading entries is:", choices:["1-minute chart","5-minute chart","Daily chart","Tick chart"], answer:2, hint:"Daily chart is the swing trader home base. Shows multi-day trends and key levels clearly." },
        { q:"Overnight risk means:", choices:["Trading is risky at night","You cannot control news or events between sessions that may gap the stock against you","All positions must close at 8 PM","Overnight margin requirements are lower"], answer:1, hint:"Overnight means earnings, news, macro events can gap your stock through your stop. Size for this risk." }
      ]},
      { id:"sw_2", variants:[
        { q:"A swing breakout entry requires:", choices:["Breaking any intraday level","A close above a multi-day or multi-week resistance level on the daily chart with volume","Only a 1% move","Earnings catalyst only"], answer:1, hint:"Swing breakout means daily chart close above resistance. Not intraday. Not a wick. A full close." },
        { q:"For a swing trade, where does the stop typically go?", choices:["Below the intraday low","Below the key daily support level or prior swing low wide enough for daily volatility","$0.50 below entry always","At VWAP"], answer:1, hint:"Swing stops must be wider. Below the daily structure level that invalidates the thesis." },
        { q:"An earnings play swing trade is MOST risky because:", choices:["Earnings are always bad","Binary outcome - can gap 20% either direction making stops ineffective","Volume is always low on earnings","You need special margin"], answer:1, hint:"Earnings means binary event. Even with a stop a 20% gap against you executes well below your price." }
      ]},
      { id:"sw_3", variants:[
        { q:"A momentum swing trade targets:", choices:["A stock already in a confirmed uptrend pulling back to the 20-day or 50-day MA","Stocks hitting 52-week lows","High short interest stocks only","Stocks with no catalyst"], answer:0, hint:"Momentum swing means strong trend plus healthy pullback to moving average equals high probability continuation." },
        { q:"Before holding a swing trade overnight you should:", choices:["Check nothing - just hold","Check if earnings are tonight, major macro events, and if the thesis is still intact","Always reduce position by half","Add to the position"], answer:1, hint:"Pre-close checklist: thesis intact? Earnings tonight? Major news? Size appropriate for overnight risk?" },
        { q:"IBS in swing trading means:", choices:["Trading inside a consolidation pattern","A smaller range candle that fits entirely within the prior day range signaling a potential breakout","Only trading between 10 AM and 2 PM","An institutional buying setup"], answer:1, hint:"Inside bar means smaller daily candle inside prior day. Coiling energy. Breakout of the inside bar is the entry." }
      ]},
      { id:"sw_4", variants:[
        { q:"Position sizing for swing trades compared to day trades should be:", choices:["Larger since you hold longer","Smaller since you are carrying overnight gap risk","Exactly the same","Based on feelings about the trade"], answer:1, hint:"Swing means overnight gap risk. If stock gaps 10% against you stop does not protect you. Size down." },
        { q:"Managing overnight risk is best done by:", choices:["Using margin aggressively","Correct position sizing so an adverse gap hurts but does not destroy your account","Only trading with cash","Never holding past 3 PM"], answer:1, hint:"Size is your overnight risk manager. Position small enough that a bad gap is uncomfortable not catastrophic." },
        { q:"A news-driven swing trade is strongest when:", choices:["The news is weak and ambiguous","The catalyst is significant enough to attract multiple days of new buyers","The stock is already extended 40% before you enter","Volume is below average"], answer:1, hint:"Strong catalyst means multiple days of new participants entering. Day 1 and Day 2 continuation are the plays." }
      ]},
      { id:"sw_5", variants:[
        { q:"How to scan for swing trades on the daily chart:", choices:["Look for the most volatile stocks","Filter for stocks in uptrends pulling back to moving averages on declining volume with catalysts upcoming","Find stocks at all-time lows","Only trade S&P 500 stocks"], answer:1, hint:"Swing scan: uptrend plus healthy pullback plus declining volume on dip plus catalyst or strong setup pattern." },
        { q:"Using weekly options for a swing trade is beneficial because:", choices:["They are always cheaper","Defined risk - max loss is premium paid - and leverage amplifies the move","They never expire","They have no theta decay"], answer:1, hint:"Weekly options for swings means leveraged exposure with defined risk. Cannot lose more than premium paid." },
        { q:"When does a swing trader typically check their positions?", choices:["Every minute during market hours","Pre-market and after market close - not constantly during the day","Only on Fridays","Once a week"], answer:1, hint:"Swing trading requires far less screen time. Check pre-market and after close. Not intraday watching." }
      ]}
    ]
  },

  psychology: {
    title: "Psychology and Mindset Test",
    section: "psychology",
    passingScore: 75,
    questions: [
      { id:"ps_1", variants:[
        { q:"Revenge trading is:", choices:["A valid recovery strategy","Taking the next trade immediately after a loss with the goal of making the money back - driven by emotion not setups","Trading in a competitive manner","Shorting stocks that previously moved against you"], answer:1, hint:"Revenge trading is an emotional response to loss. Your next trade is driven by anger not a setup." },
        { q:"The most reliable action after a significant losing trade is:", choices:["Immediately take a larger trade to recover","Implement a 10-15 minute mandatory cooldown before any new entry","Call your broker","Switch to a different strategy"], answer:1, hint:"Cooldown after a loss is the single biggest behavioral improvement most traders can make." },
        { q:"Your win rate is 60% but you are losing money overall. The most likely cause is:", choices:["Your entries are wrong","Your average loser is significantly larger than your average winner - early exits and no stop discipline","The market is rigged","You need a different scanner"], answer:1, hint:"Positive win rate plus negative P&L means early exits on winners and holding losers too long." }
      ]},
      { id:"ps_2", variants:[
        { q:"Overtrading is characterized by:", choices:["Taking only the best setups","Taking too many trades including marginal setups driven by boredom or FOMO","Trading during power hour","Using too much margin"], answer:1, hint:"Overtrading means quantity over quality. More trades does not equal more money. Less and better wins." },
        { q:"Base hits over home runs means:", choices:["Only trade small caps","Consistent small gains compound better over time than swinging for massive wins","Never take large position sizes","Trade baseball stocks only"], answer:1, hint:"Consistency beats home runs. 1% daily compounds to life-changing returns. Chasing big wins destroys accounts." },
        { q:"When in a drawdown, you should:", choices:["Increase size to recover faster","Stop trading for a month","Reduce size, take only A-plus setups, focus on process not P&L until confidence returns","Try a completely new strategy"], answer:2, hint:"Drawdown means reduce size plus higher standards plus process focus. Not more size, not revenge. Protect and rebuild." }
      ]},
      { id:"ps_3", variants:[
        { q:"The Playbook Mindset means:", choices:["Following a rigid system regardless of conditions","Having pre-defined setups, rules, and conditions so you execute rather than decide in real time","Only reading trading books","Making decisions based on feelings"], answer:1, hint:"Playbook means decisions made in advance. When your setup appears you execute. No hesitation, no overthinking." },
        { q:"FOMO in trading causes:", choices:["Better trade selection","Chasing moves that have already happened - entering late with high risk and low reward","More disciplined entries","Lower position sizes"], answer:1, hint:"FOMO means chasing. Entering after the move at the worst price with everyone else who is also late." },
        { q:"Sitting in cash when there are no clear setups is:", choices:["Lazy and unprofitable","A losing strategy","A valid and often profitable position - no trade is always better than a bad trade","Only for beginners"], answer:2, hint:"Cash is a position. Waiting for your setup is discipline. Forcing trades is how you give back gains." }
      ]},
      { id:"ps_4", variants:[
        { q:"Trading through a drawdown successfully requires:", choices:["Larger position sizes to make it back faster","More trading to find the next winner","Patience, reduced size, and strict adherence to rules even when confidence is low","Switching to paper trading permanently"], answer:2, hint:"Drawdown survival means size down plus high standards plus patience. The money comes back when process is right." },
        { q:"The most common cause of account blowups is:", choices:["Using limit orders","Bad entries","Behavioral patterns - revenge trading, stop removal, oversizing after wins","Trading too few times"], answer:2, hint:"Most blowups are behavioral not technical. Remove the behaviors, you remove the blowup risk." },
        { q:"Checking your P&L constantly during a trade will most often cause you to:", choices:["Make better decisions","Exit winning trades too early due to fear of giving back profits","Hold losing trades longer","Improve your stop placement"], answer:1, hint:"P&L watching leads to emotional exits. Price action should drive your decisions not your floating P&L." }
      ]}
    ]
  }
};

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


