const CACHE_KEY = 'truely_home_content';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface HomeContent {
  tip: {
    title: string;
    body: string;
    category: 'savings' | 'loans' | 'investment' | 'general' | 'tax';
  };
  rateInsight: string; // e.g. "FD rates are at a 2-year high — good time to lock in"
  generatedAt: number;
}

export const getHomeContent = async (): Promise<HomeContent> => {
  // Check cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as HomeContent;
      if (Date.now() - parsed.generatedAt < CACHE_DURATION) {
        return parsed;
      }
    }
  } catch {}

  // Fetch fresh from Gemini
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const month = new Date().getMonth() + 1;
  const isTaxSeason = month >= 1 && month <= 3;
  const isFestivalSeason = month >= 9 && month <= 11;

  const prompt = `You are a financial advisor for Indian users on an app called Truely Money.
Today is ${today}.
${isTaxSeason ? 'It is tax season in India (Jan-Mar) — consider tax-saving tips.' : ''}
${isFestivalSeason ? 'It is festival season in India — consider spending/saving tips.' : ''}

Generate a daily financial tip and rate insight for Indian users. Return ONLY valid JSON, no markdown, no explanation:
{
  "tip": {
    "title": "short catchy title under 8 words",
    "body": "2-3 sentence practical tip for Indian users, mention specific numbers or percentages where relevant",
    "category": one of ["savings", "loans", "investment", "general", "tax"]
  },
  "rateInsight": "one sentence market insight about current Indian interest rate environment, max 15 words"
}`;

  const fetchWithModel = async (modelName: string): Promise<HomeContent> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch from model ${modelName}: ${response.status}`);
    }
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const jsonMatch = text.replace(/```json|```/g, '').trim().match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON');
    const parsed = JSON.parse(jsonMatch[0]) as Omit<HomeContent, 'generatedAt'>;
    return { ...parsed, generatedAt: Date.now() } as HomeContent;
  };

  try {
    const result = await fetchWithModel('gemini-3.5-flash');
    localStorage.setItem(CACHE_KEY, JSON.stringify(result));
    return result;
  } catch (e) {
    console.warn('Failed with gemini-3.5-flash, trying fallback model gemini-1.5-flash', e);
    try {
      const result = await fetchWithModel('gemini-1.5-flash');
      localStorage.setItem(CACHE_KEY, JSON.stringify(result));
      return result;
    } catch (e2) {
      console.error('Fallback model also failed', e2);
      throw e2;
    }
  }
};
