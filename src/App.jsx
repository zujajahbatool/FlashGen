import { useState, useEffect } from 'react';
import axios from 'axios';
import { generateFlashcards } from './services/aiService';
import { parseFile } from './services/fileParser';
import FlashCard from './components/FlashCard';
import ProgressCounter from './components/ProgressCounter';
import jsPDF from 'jspdf';
import './App.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCard, setCurrentCard] = useState(0);
  const [learnedCards, setLearnedCards] = useState(new Set());
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // API key validation state
  const [apiKeyChecked, setApiKeyChecked] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(null); // null = unknown, true/false
  const [apiKeyMessage, setApiKeyMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    const checkKey = async () => {
      try {
        const resp = await axios.get('http://localhost:3001/api/validate-key', { timeout: 7000 });
        if (cancelled) return;
        if (resp.data && resp.data.valid === true) {
          setApiKeyValid(true);
          setApiKeyMessage('API key configured');
        } else {
          setApiKeyValid(false);
          setApiKeyMessage(resp.data?.message || 'Invalid or expired API key');
        }
      } catch (err) {
        if (cancelled) return;
        setApiKeyValid(false);
        setApiKeyMessage(err.response?.data?.message || err.message || 'Key validation failed');
      } finally {
        if (!cancelled) setApiKeyChecked(true);
      }
    };

    checkKey();
    return () => { cancelled = true; };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate file type
    const validExtensions = ['.txt', '.pdf', '.docx', '.pptx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setError(`Invalid file type. Please upload: ${validExtensions.join(', ')}`);
      e.target.value = ''; // Reset file input
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      e.target.value = '';
      return;
    }

    try {
      setLoading(true);
      setUploadedFileName(file.name);
      
      const text = await parseFile(file);
      
      if (!text || text.trim().length === 0) {
        throw new Error('No text could be extracted from the file');
      }

      setInputText(text);
      setSuccess(`✓ File "${file.name}" uploaded successfully! (${text.length} characters extracted)`);
      
    } catch (error) {
      console.error('File parsing error:', error);
      setError(`Error parsing file: ${error.message}`);
      setUploadedFileName('');
      e.target.value = ''; // Reset file input
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text or upload a file');
      return;
    }

    if (inputText.trim().length < 50) {
      setError('Please provide more text (at least 50 characters) for better flashcard generation');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const cards = await generateFlashcards(inputText);
      
      if (!cards || cards.length === 0) {
        throw new Error('No flashcards were generated. Please try different content.');
      }

      setFlashcards(cards);
      setCurrentCard(0);
      setLearnedCards(new Set());
      setSuccess(`✓ Generated ${cards.length} flashcards!`);
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message || 'Error generating flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const markAsLearned = () => {
    setLearnedCards(new Set([...learnedCards, currentCard]));
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      const maxWidth = 170;

      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('FlashGen - Study Cards', margin, yPosition);
      yPosition += 10;

      // Date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 15;

      // Cards
      flashcards.forEach((card, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Question
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        const questionLines = doc.splitTextToSize(`Q${index + 1}: ${card.question}`, maxWidth);
        doc.text(questionLines, margin, yPosition);
        yPosition += questionLines.length * 7 + 5;

        // Answer
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        const answerLines = doc.splitTextToSize(`A: ${card.answer}`, maxWidth);
        doc.text(answerLines, margin, yPosition);
        yPosition += answerLines.length * 6 + 12;

        // Separator line
        doc.setDrawColor(200);
        doc.line(margin, yPosition - 5, margin + maxWidth, yPosition - 5);
        yPosition += 5;
      });

      doc.save('flashcards.pdf');
      setSuccess('✓ PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      setError('Error generating PDF. Please try again.');
    }
  };

  const resetApp = () => {
    setFlashcards([]);
    setInputText('');
    setUploadedFileName('');
    setCurrentCard(0);
    setLearnedCards(new Set());
    setError('');
    setSuccess('');
  };

  return (
    <div className="app">
      <header>
        <h1>⚡ FlashGen</h1>
        <p>AI-Powered Flashcard Generator</p>
      </header>

      {/* API key validation banner */}
      {apiKeyChecked && apiKeyValid === false && (
        <div className="api-banner error">
          Server error: {apiKeyMessage || 'API key invalid. Please check or regenerate your key and ensure billing is configured.'}
        </div>
      )}

      {apiKeyChecked && apiKeyValid === true && (
        <div className="api-banner success" style={{display:'none'}}>API key OK</div>
      )}

      {flashcards.length === 0 ? (
        <div className="input-section">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError('');
            }}
            placeholder="Paste your study notes here... (minimum 50 characters)

For example:
- Course notes
- Study material
- Article text
- Any educational content"
            rows={15}
            disabled={loading}
          />
          
          <div className="file-upload">
            <label htmlFor="file-input" className="file-label">
              📎 {uploadedFileName || 'Upload a file (.txt, .pdf, .docx, .pptx)'}
            </label>
            <input
              id="file-input"
              type="file"
              accept=".txt,.pdf,.docx,.pptx"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={loading}
            />
            {uploadedFileName && (
              <div className="file-name">
                Selected: {uploadedFileName}
              </div>
            )}
          </div>

          <button 
            onClick={handleGenerate} 
            disabled={loading || !inputText.trim()}
            className="generate-btn"
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                {uploadedFileName ? 'Parsing file...' : 'Generating...'}
              </>
            ) : (
              '✨ Generate Flashcards'
            )}
          </button>

          <div style={{ marginTop: '15px', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
            💡 Tip: Upload a document or paste at least 50 characters for best results
          </div>
        </div>
      ) : (
        <div className="flashcard-section">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <ProgressCounter 
            learned={learnedCards.size} 
            total={flashcards.length} 
          />

          <FlashCard
            question={flashcards[currentCard].question}
            answer={flashcards[currentCard].answer}
            isLearned={learnedCards.has(currentCard)}
          />

          <div className="controls">
            <button onClick={prevCard} disabled={currentCard === 0}>
              ← Previous
            </button>
            <button 
              onClick={markAsLearned} 
              className="learned-btn"
              disabled={learnedCards.has(currentCard)}
            >
              {learnedCards.has(currentCard) ? '✓ Learned' : '✓ Mark as Learned'}
            </button>
            <button onClick={nextCard} disabled={currentCard === flashcards.length - 1}>
              Next →
            </button>
          </div>

          <div className="card-indicator">
            Card {currentCard + 1} of {flashcards.length}
            {learnedCards.has(currentCard) && ' • ✓ Learned'}
          </div>

          <button onClick={resetApp} className="reset-btn">
            🔄 Start Over
          </button>

          <button onClick={downloadPDF} className="download-btn">
            📥 Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
