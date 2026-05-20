export interface Fund {
  id: string;
  name: string;
  invested: number;
  investedFormatted: string;
  todayChange: number;
  todayChangeFormatted: string;
  cagr: number;
  cagrFormatted: string;
  category: 'stable' | 'growth' | 'volatile';
}

export const FUNDS: Fund[] = [
  {
    id: '1',
    name: 'Mirae Asset Midcap 150',
    invested: 184000,
    investedFormatted: '₹1,84,000',
    todayChange: -3.2,
    todayChangeFormatted: '−3.2%',
    cagr: 18.4,
    cagrFormatted: '18.4% CAGR',
    category: 'volatile',
  },
  {
    id: '2',
    name: 'Axis Bluechip Fund',
    invested: 84000,
    investedFormatted: '₹84,000',
    todayChange: -0.4,
    todayChangeFormatted: '−0.4%',
    cagr: 12.1,
    cagrFormatted: '12.1% CAGR',
    category: 'stable',
  },
  {
    id: '3',
    name: 'Parag Parikh Flexi Cap',
    invested: 210000,
    investedFormatted: '₹2,10,000',
    todayChange: -1.1,
    todayChangeFormatted: '−1.1%',
    cagr: 21.3,
    cagrFormatted: '21.3% CAGR',
    category: 'growth',
  },
  {
    id: '4',
    name: 'SBI Gold ETF',
    invested: 106230,
    investedFormatted: '₹1,06,230',
    todayChange: 0.8,
    todayChangeFormatted: '+0.8%',
    cagr: 9.2,
    cagrFormatted: '9.2% CAGR',
    category: 'stable',
  },
];

export const PORTFOLIO_TOTAL = '₹5,84,230';
export const PORTFOLIO_CHANGE = '−₹12,430 today (−2.1%)';

export const QUICK_STATS = [
  { label: '4 funds', icon: 'layers' },
  { label: '2 SIPs active', icon: 'repeat' },
  { label: 'Goal: 68%', icon: 'target' },
];

export const MARKET_TICKER = 'Sensex −1.8%  |  Nifty −1.6%  |  Gold +0.3%';

export const SYSTEM_PROMPT = `You are Portfolio Whisperer, an AI financial companion inside Pivot Money. The user's portfolio is: Mirae Asset Midcap 150 (₹1,84,000, −3.2% today), Axis Bluechip Fund (₹84,000, −0.4% today, fund manager recently changed), Parag Parikh Flexi Cap (₹2,10,000, −1.1% today), SBI Gold ETF (₹1,06,230, +0.8% today). Total portfolio value: ₹5,84,230. Today's loss: ₹12,430.

Answer questions about THIS portfolio only. Be direct, calm, and plain-language. Never say 'buy' or 'sell'. Always explain the why behind numbers. Keep responses under 4 sentences. Sound like a knowledgeable friend, not a disclaimer machine.`;

export const INITIAL_MESSAGES = [
  {
    id: 'msg-1',
    role: 'assistant' as const,
    content:
      "Your Midcap 150 fund fell 3.2% today. This is tied to the RBI's surprise rate hold — midcaps are rate-sensitive. Your large-cap allocation held steady and cushioned the impact. Nothing to panic about.",
    type: 'purple' as const,
  },
  {
    id: 'msg-2',
    role: 'assistant' as const,
    content:
      "Heads up: Axis Bluechip's fund manager changed last month. Historically this causes 60-day underperformance. You hold ₹84,000 in it.",
    type: 'teal' as const,
  },
];

export const QUICK_REPLIES = [
  'Should I stop my SIP?',
  "What's driving gold up?",
  'Am I over-exposed?',
];

export const PANIC_MESSAGE = {
  id: 'panic-msg',
  role: 'assistant' as const,
  content:
    "I noticed you've checked in a few times today. That's completely normal on volatile days — but here's the truth: your portfolio is built for exactly this. Midcap dips like today's have historically recovered within 45–90 days. The worst thing to do right now is nothing different from your plan.",
  type: 'panic' as const,
};

// Fixed Q&A pairs for local chatbot fallback (works without API key)
export const FIXED_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['stop', 'sip', 'pause sip', 'cancel sip'],
    response:
      "Stopping your SIP during a dip is like leaving the gym after one tough day. Your SIPs in Mirae Midcap 150 and Parag Parikh Flexi Cap are actually buying more units at lower prices right now — that's rupee cost averaging working in your favor. Stay the course.",
  },
  {
    keywords: ['gold', 'driving gold', 'gold up', 'gold etf', 'sbi gold'],
    response:
      "Gold is up 0.8% today because investors are moving to safe-haven assets after the RBI's rate hold surprised markets. Your SBI Gold ETF (₹1,06,230) is acting as a natural hedge — it's doing exactly what it's supposed to do when equities dip.",
  },
  {
    keywords: ['over-exposed', 'overexposed', 'exposure', 'risk', 'too much risk', 'diversif'],
    response:
      "Your allocation is 40% stable, 35% growth, and 25% volatile — that's a reasonable split. The midcap exposure (₹1,84,000 in Mirae) adds volatility but also drives your best returns at 18.4% CAGR. You're not over-exposed, but if dips bother you, we can discuss rebalancing.",
  },
  {
    keywords: ['midcap', 'mirae', 'midcap 150', 'mirae asset'],
    response:
      "Your Mirae Asset Midcap 150 (₹1,84,000) fell 3.2% today — the sharpest dip in your portfolio. This is because midcaps are rate-sensitive, and the RBI's surprise rate hold spooked the segment. But at 18.4% CAGR, this fund has historically bounced back within 45–90 days after similar dips.",
  },
  {
    keywords: ['axis', 'bluechip', 'fund manager', 'manager change'],
    response:
      "Your Axis Bluechip Fund (₹84,000) had a fund manager change last month. Historically, new managers take 60–90 days to settle in, and there's often a brief underperformance period. The fund only dipped 0.4% today though — it's holding steady. Worth monitoring over the next 2 months.",
  },
  {
    keywords: ['parag', 'parikh', 'flexi', 'flexi cap'],
    response:
      "Parag Parikh Flexi Cap (₹2,10,000) is your largest holding and your best performer at 21.3% CAGR. It dipped 1.1% today, but this fund's global diversification usually cushions it well. It's the backbone of your portfolio — no concerns here.",
  },
  {
    keywords: ['retirement', 'goal', 'at risk', 'corpus', 'target'],
    response:
      "Your retirement goal of ₹2,00,00,000 by 2045 is currently tracking at ₹1,71,00,000 — that's 14.5% short. The gap is mainly because of recent market corrections. Increasing your SIP by just ₹3,200/month would bring you back on track. Small adjustments now have a big compounding effect over 19 years.",
  },
  {
    keywords: ['portfolio', 'summary', 'total', 'how much', 'value', 'worth'],
    response:
      "Your total portfolio is ₹5,84,230 across 4 funds. Today's loss is ₹12,430 (−2.1%), driven mainly by the midcap correction. Your portfolio is split across stable (40%), growth (35%), and volatile (25%) segments — a healthy mix for long-term wealth creation.",
  },
  {
    keywords: ['market', 'sensex', 'nifty', 'crash', 'falling', 'down'],
    response:
      "Markets are down today — Sensex fell 1.8% and Nifty 1.6% — mainly due to the RBI's surprise rate hold. This impacts rate-sensitive sectors like midcaps and banking. Your portfolio lost ₹12,430 today, but these macro-driven dips typically recover within weeks. Gold (+0.3%) is your cushion.",
  },
  {
    keywords: ['what should i do', 'advice', 'suggest', 'recommend', 'help'],
    response:
      "On days like today, the best move is usually no move. Your portfolio is well-diversified, your SIPs are doing their job, and the dips are within normal range. If your retirement goal concerns you, consider bumping up your SIP by ₹3,200/month — that's the one actionable step that makes a real difference.",
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
    response:
      "Hey Arjun! Your portfolio is at ₹5,84,230 today — down ₹12,430 (−2.1%) from yesterday. The dip is mainly from your midcap fund. Want me to break down what happened, or do you have a specific question?",
  },
  {
    keywords: ['thank', 'thanks', 'okay', 'got it', 'understood'],
    response:
      "Happy to help! Remember — volatile days are uncomfortable but completely normal. Your portfolio is built for the long game. Feel free to check in anytime you need clarity. 💪",
  },
];

/**
 * Matches user input against fixed responses using keyword matching.
 * Returns the best matching response, or a default fallback.
 */
export const getLocalResponse = (input: string): string => {
  const lower = input.toLowerCase();

  let bestMatch: { score: number; response: string } = { score: 0, response: '' };

  for (const entry of FIXED_RESPONSES) {
    const matchCount = entry.keywords.filter((kw) => lower.includes(kw)).length;
    if (matchCount > bestMatch.score) {
      bestMatch = { score: matchCount, response: entry.response };
    }
  }

  if (bestMatch.score > 0) {
    return bestMatch.response;
  }

  // Default fallback for unmatched queries
  return "That's a great question. Based on your portfolio of ₹5,84,230 across 4 funds, today's 2.1% dip is within the normal range of market fluctuations. Your diversification across large-cap, flexi-cap, midcap, and gold is working as intended. Is there a specific fund or goal you'd like me to look at?";
};

export const GOAL_DATA = {
  name: 'Retirement corpus',
  target: '₹2,00,00,000',
  targetYear: 2045,
  currentTrajectory: '₹1,71,00,000',
  shortfall: '−14.5%',
  status: 'At risk — increase SIP by ₹3,200/month to get back on track',
  autoMessage: 'My retirement goal is at risk. What should I do?',
};
