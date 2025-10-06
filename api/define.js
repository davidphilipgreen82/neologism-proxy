// api/define.js

export default async function handler(req, res) {
  try {
    const body = await req.json?.() || req.body || {};
    const phrase = body.phrase;

    if (!phrase) {
      return res.status(400).json({ error: "Missing phrase" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an academic design theorist who writes clear one-line definitions of nuanced concepts." },
          { role: "user", content: `Define the concept '${phrase}', drawing on the meaning of each individual term, but alluding to something more than the sum of those parts.` }
        ],
        temperature: 0.9,
        max_tokens: 120
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
