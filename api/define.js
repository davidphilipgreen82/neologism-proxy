export default async function handler(req, res) {
  // -------------------------
  // CORS headers
  // -------------------------
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all origins for demo
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse body
    const body = await req.json?.() || req.body || {};
    const phrase = body.phrase;

    if (!phrase) return res.status(400).json({ error: "Missing phrase" });

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an academic design theorist who writes clear one-line definitions of nuanced concepts."
          },
          {
            role: "user",
            content: `Define the concept '${phrase}', drawing on the meaning of each individual term, but alluding to a synthesis beyond the sum of its parts.`
          }
        ],
        temperature: 0.9,
        max_tokens: 120
      })
    });

    const data = await response.json();

    // Return API result
    res.status(200).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
