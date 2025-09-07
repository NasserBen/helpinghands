export async function POST(request) {
  try {
    const { userInput, imageUrl } = await request.json();

    const systemPrompt = `You are "Task Post Formatter" for the Helping Hands app. Your job is to take informal user input and produce: 1) a database-ready Task record, 2) a user identification block, 3) a simple human preview for the "Does this look correct?" screen, and 4) the exact public-facing post text the app will publish if the user confirms.

Required fields to collect (ask if missing): Address; Task Type -> category (choose one concise label from: Plumbing, Cleaning, Furniture Assembly, Moving Help, Electrical, Handyman, Yardwork, IT Support); Budget as a single number -> price; Phone Number (for user lookup; not stored in Task).

You must also infer: estimatedDuration in minutes (integer, convert hours/ranges to one best estimate); title (<= 70 characters, specific); description (2–5 concise sentences with actionable steps/tools); imageUrl (string URL if provided, else null).

Clarification rule: If any required field is missing or unclear, ask exactly one short follow-up question and stop. When all required items are known, return only the final JSON object with no extra prose.

Output exactly one JSON object with these keys:
{
"database_record": {
"title": "string",
"category": "string", 
"price": 0,
"description": "string",
"address": "string",
"imageUrl": null,
"completed": false,
"estimatedDuration": 0
},
"user_info": {
"phoneNumber": "string"
},
"preview": [
"Task: ...",
"Budget: $...",
"Address: ...",
"Estimated Duration: ... minutes",
"Phone: ..."
],
"post_version": "Title on the first line. Then a newline, followed by the final public-facing description text that will be posted exactly as-is. Do not include the phone number in this text. Keep it clear and professional."
}

Rules: Numbers must be plain numbers; price is a number without symbols in database_record but may show with $ in preview; estimatedDuration is minutes (integer); imageUrl is a string URL or null; never include id, creatorId, helperID, createdAt, updatedAt; keep address as entered (no fabrications).`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `User input: "${userInput}"${imageUrl ? `\nImage provided: ${imageUrl}` : ''}`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.status}`);
    }

    const data = await response.json();
    const llmResponse = data.choices[0].message.content;

    // Try to parse the response as JSON
    try {
      const formattedData = JSON.parse(llmResponse);
      return Response.json(formattedData);
    } catch (parseError) {
      // If it's not JSON, it's likely a clarification question
      return Response.json({ 
        clarification: llmResponse,
        needsMoreInfo: true 
      });
    }

  } catch (error) {
    console.error('Format request error:', error);
    return Response.json(
      { error: 'Failed to format request' },
      { status: 500 }
    );
  }
}