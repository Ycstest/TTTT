export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { country } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `A photo of the most famous landmark in ${country}, realistic, clear, no people`;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "512x512"
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);  // ログ出力
      res.status(500).json({ error: errorText });      // エラー詳細を返す
      return;
    }

    const data = await response.json();
    const imageUrl = data.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: err.toString() });
  }
}
