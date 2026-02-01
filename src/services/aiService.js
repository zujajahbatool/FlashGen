import axios from 'axios';

export const generateFlashcards = async (text) => {
  try {
    console.log('Sending request to backend...');

    // First validate the API key on the server (helpful for clearer errors)
    try {
      const keyCheck = await axios.get('http://localhost:3001/api/validate-key', { timeout: 5000 });
      if (keyCheck.data && keyCheck.data.valid === false) {
        throw new Error(keyCheck.data.message || 'Invalid API key or API not enabled');
      }
    } catch (err) {
      // If validation failed due to network or server error, preserve original behavior but log a hint
      console.warn('API key validation failed or timed out:', err.message);
    }

    const response = await axios.post('http://localhost:3001/api/generate-flashcards', {
      text
    }, {
      timeout: 60000, // 60 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response received:', response.data);
    
    if (!response.data.flashcards || !Array.isArray(response.data.flashcards)) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data.flashcards;
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response) {
      // Server responded with error (include status and body for clarity)
      const status = error.response.status;
      let serverError = '';
      if (typeof error.response.data === 'string') {
        serverError = error.response.data;
      } else if (error.response.data && typeof error.response.data === 'object') {
        serverError = error.response.data.error || JSON.stringify(error.response.data);
      } else {
        serverError = error.response.statusText;
      }
      throw new Error(`Server error (${status}): ${serverError}`);
    } else if (error.request) {
      // No response received
      throw new Error('Cannot connect to server. Please make sure:\n1. The backend server is running (npm run server)\n2. Server is on port 3001\n3. Check console for any server errors');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. The text might be too long. Try with shorter content.');
    } else {
      // Other error
      throw new Error(error.message || 'Unknown error occurred');
    }
  }
};
