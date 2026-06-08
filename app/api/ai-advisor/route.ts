import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/data-fetcher';

export async function POST(req: Request) {
  try {
    const { income, age, occupation, dependents, financialGoal, customPrompt, language } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return NextResponse.json(
        { error: 'Gemini API Key is not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Load ALL products dynamically (including savings, loans, current, FDs, credit cards, govt schemes, insurance)
    const activeProducts = await getProducts();

    // Prepare a slimmed-down context of LEDGER products to keep prompt token size low
    const productContext = activeProducts.map((p) => ({
      id: p.id,
      category: p.category,
      name: p.name,
      lender: p.lender,
      description: p.description,
      metrics: p.metrics,
      highlights: p.highlights,
    }));

    let userProfileSection = '';
    if (customPrompt && customPrompt.trim().length > 0) {
      userProfileSection = `User Profile Description:\n"${customPrompt.trim()}"`;
    } else {
      userProfileSection = `User Financial Profile:
- Age: ${age} years old
- Monthly Net Income: ₹${income}
- Employment / Occupation: ${occupation}
- Dependents / Family Members: ${dependents}
- Primary Financial Goal: ${financialGoal}`;
    }

    const targetLang = language === 'hi' ? 'Hindi' : language === 'hinglish' ? 'Hinglish (Hindi written in Latin script/English script, e.g. "Aapko interest rate 8.25% milega jo ki market mein best hai")' : 'English';

    const prompt = `
You are a expert, helpful AI Financial Advisor for LEDGER, an anonymous Indian banking products comparison portal.
Analyze the user's financial profile/description and match them with exactly 3 to 4 of the most suitable products from our official product database.

${userProfileSection}

Available LEDGER Database Products:
${JSON.stringify(productContext)}

Your Output Rules:
1. Recommend ONLY products that actually exist in the database above. Match by "id".
2. Match products that align with their situation.
3. Return a JSON object containing a "recommendations" array.
4. Each recommendation object must contain exactly:
   - "productId": The exact "id" string of the product from the database.
   - "matchReason": A highly personalized 1-2 sentence explanation of why this product fits their specific situation. Address details from their description or profile. Write this reason entirely in the ${targetLang} language.
   - "estimatedValue": A short estimate of the savings, return, or core metric (e.g. "Earn up to 8.50% interest", "Flexible zero-balance account", "Surcharge waived"). Write this estimated value in the ${targetLang} language.

Return ONLY the raw JSON structure, adhering strictly to responseMimeType config. Do not include markdown code block backticks.
`;

    // Direct fetch call to Gemini API to avoid bloated library installation issues
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API request failed:', errText);
      return NextResponse.json({ error: 'Gemini API call failed' }, { status: 502 });
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.error('Invalid response structure from Gemini:', data);
      return NextResponse.json({ error: 'Invalid response from AI model' }, { status: 502 });
    }

    // Parse the structured JSON response returned by the model
    const parsedData = JSON.parse(rawText.trim());
    
    // Map recommendations to include the full dynamic product object
    const matchedRecommendations = (parsedData.recommendations || []).map((rec: any) => {
      const fullProduct = activeProducts.find((p) => p.id === rec.productId);
      return {
        ...rec,
        product: fullProduct || null
      };
    }).filter((rec: any) => rec.product !== null);

    return NextResponse.json({ recommendations: matchedRecommendations });
  } catch (error: any) {
    console.error('AI Advisor Handler Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
