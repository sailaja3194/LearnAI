async function askAI(messages) {
  const key = process.env.AI_API_KEY;
  if (!key) return null;
  const base = (process.env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: process.env.AI_MODEL || 'gpt-4o-mini', messages, temperature: 0.6 })
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider error (${response.status}): ${detail.slice(0, 300)}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}
module.exports = { askAI };
