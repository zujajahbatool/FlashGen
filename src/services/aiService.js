import axios from 'axios';

export const generateFlashcards = async (text) => {
  try {
    console.log('Sending request to backend...');

    // Validate API key first
    try {
      const keyCheck = await axios.get('/api/validate-key', { timeout: 5000 });
      if (keyCheck.data && keyCheck.data.valid === false) {
        throw new Error(keyCheck.data.message || 'Invalid API key or API not enabled. Please check your Gemini API key.');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK') {
        throw new Error('Cannot connect to server. Please check that the backend is running and try again.');
      }
      console.warn('API key validation check:', err.message);
    }

    const response = await axios.post('/api/generate-flashcards', {
      text: text.trim()
    }, {
      timeout: 90000, // 90 second timeout for longer texts
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response received:', response.data);
    
    if (!response.data.flashcards || !Array.isArray(response.data.flashcards)) {
      throw new Error('Invalid response format from server');
    }
    
    if (response.data.flashcards.length === 0) {
      throw new Error('No flashcards were generated. Please try with different or more detailed content.');
    }
    
    return response.data.flashcards;
  } catch (error) {
    console.error('Full error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      let serverError = '';
      
      if (typeof error.response.data === 'string') {
        serverError = error.response.data;
      } else if (error.response.data && typeof error.response.data === 'object') {
        serverError = error.response.data.error || JSON.stringify(error.response.data);
      } else {
        serverError = error.response.statusText;
      }
      
      // Provide helpful error messages
      if (status === 500) {
        throw new Error(`Server error: ${serverError}\n\nTips:\n• Check if your API key is valid\n• Ensure Gemini API is enabled in your Google Cloud Console\n• Try with shorter text if the content is very long`);
      } else if (status === 400) {
        throw new Error(`Invalid request: ${serverError}`);
      } else if (status === 401 || status === 403) {
        throw new Error(`Authentication error: ${serverError}\n\nPlease check your Gemini API key in the .env file.`);
      } else {
        throw new Error(`Server error (${status}): ${serverError}`);
      }
    } else if (error.request) {
      // No response received - connection issue
      throw new Error('Cannot connect to server. Please check that the backend is running and try again.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      throw new Error('Request timeout. The content might be too long or complex.\n\nTips:\n• Try with shorter text (500-2000 characters works best)\n• Check your internet connection\n• Ensure the backend server is running properly');
    } else if (error.message.includes('Cannot connect')) {
      // Re-throw connection errors
      throw error;
    } else {
      // Other errors
      throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
  }
};