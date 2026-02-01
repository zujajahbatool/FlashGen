import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY is not set in .env file!');
  console.error('Please create a .env file with: GEMINI_API_KEY=your_key_here');
  process.exit(1);
}

app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log(`📝 Generating flashcards for ${text.length} characters...`);

    // Use the stable v1beta2 text generation endpoint (compatible with standard API keys)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/gemini/2.5/flash:generateText?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: {
            text: `You are a study assistant. Analyze the following text and create flashcards.

CRITICAL: Return ONLY a valid JSON array. No markdown, no backticks, no explanations.
Format: [{"question": "...", "answer": "..."}, ...]

Rules:
- Create 10-15 flashcards covering the most important concepts
- Questions should be clear and concise
- Answers should be informative but brief
- Focus on key facts, definitions, and concepts
- Make questions test understanding, not just memorization

Text to analyze:
${text}`
          },
          temperature: 0.2,
          maxOutputTokens: 1024
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      let apiMessage = response.statusText;
      try {
        const parsed = JSON.parse(errorData);
        apiMessage = parsed?.error?.message || parsed?.message || apiMessage;
      } catch (e) {
        apiMessage = errorData || apiMessage;
      }
      console.error('❌ Gemini API Error:', apiMessage);
      return res.status(500).json({ 
        error: `API Error: ${apiMessage}. Check your API key and ensure the Generative Language API is enabled and billing is configured.` 
      });
    }

    const data = await response.json();

    // Support multiple response shapes (text-bison, legacy content shapes, etc.)
    let generatedText = '';
    if (data.candidates && data.candidates[0]) {
      generatedText = data.candidates[0].output ||
        (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text);
    } else if (data.output) {
      generatedText = data.output;
    } else if (typeof data === 'string') {
      generatedText = data;
    }

    if (!generatedText) {
      console.error('❌ Invalid API response:', JSON.stringify(data));
      return res.status(500).json({ error: 'Invalid response from AI' });
    }
    
    // Clean up response (remove markdown if present)
    let cleanText = generatedText.trim();
    cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    try {
      const flashcards = JSON.parse(cleanText);
      
      if (!Array.isArray(flashcards)) {
        throw new Error('Response is not an array');
      }

      if (flashcards.length === 0) {
        throw new Error('No flashcards generated');
      }

      // Validate flashcard structure
      const validFlashcards = flashcards.filter(card => 
        card.question && card.answer && 
        typeof card.question === 'string' && 
        typeof card.answer === 'string'
      );

      if (validFlashcards.length === 0) {
        throw new Error('No valid flashcards in response');
      }

      console.log(`✅ Generated ${validFlashcards.length} flashcards successfully`);
      res.json({ flashcards: validFlashcards });

    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('Raw response:', cleanText);
      return res.status(500).json({ 
        error: 'Failed to parse AI response. Please try again.' 
      });
    }

  } catch (error) {
    console.error('❌ Server Error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate flashcards' 
    });
  }
});

// Lightweight API key validation endpoint (useful for troubleshooting keys)
app.get('/api/validate-key', async (req, res) => {
  try {
    const testResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta2/models/gemini/2.5/flash:generateText?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: { text: 'Return the string: OK' }, maxOutputTokens: 5 })
      }
    );

    if (!testResp.ok) {
      const text = await testResp.text();
      let apiMessage = testResp.statusText;
      try {
        const parsed = JSON.parse(text);
        apiMessage = parsed?.error?.message || parsed?.message || apiMessage;
      } catch (e) {}
      return res.status(200).json({ valid: false, message: apiMessage });
    }

    return res.json({ valid: true });
  } catch (e) {
    console.error('Key validation error:', e);
    return res.status(500).json({ valid: false, message: e.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'FlashGen backend is running',
    apiKeyConfigured: !!GEMINI_API_KEY 
  });
});

// Return JSON 404 for unknown endpoints (helps client surface useful errors)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Central error handler to ensure JSON error responses
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`✅ FlashGen Backend Server`);
  console.log(`📡 Running on port ${PORT}`);
  console.log(`🔑 API Key: ${GEMINI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
  console.log('=================================');
});
