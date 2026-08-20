import { requestGemini } from './_gemini.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await requestGemini({
      contents: [{ parts: [{ text: 'Hello' }] }],
      generationConfig: { maxOutputTokens: 10 }
    });
    return res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Key validation error:', error);
    return res.status(200).json({ valid: false, message: error.message });
  }
}