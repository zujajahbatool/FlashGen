# ⚡ FlashGen - AI-Powered Flashcard Generator

A modern, responsive web application that automatically generates flashcards from your study materials using AI.

## ✨ Features

- 🤖 **AI-Powered Generation**: Uses Google's Gemini AI to create intelligent flashcards
- 📁 **Multiple File Formats**: Supports .txt, .pdf, .docx, and .pptx files
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🎴 **Interactive Flashcards**: Flip cards with smooth animations
- 📊 **Progress Tracking**: Keep track of learned cards
- 📥 **PDF Export**: Download your flashcards as a PDF
- 🎨 **Modern UI**: Beautiful gradient designs with smooth transitions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the backend server** (in one terminal)
   ```bash
   npm run server
   ```
   
   You should see: `Server running on port 3001`

5. **Start the frontend** (in another terminal)
   ```bash
   npm run dev
   ```
   
   Open your browser to `http://localhost:5173`

## 📖 Usage

### Method 1: Paste Text
1. Copy your study notes or educational content
2. Paste it into the text area (minimum 50 characters)
3. Click "Generate Flashcards"

### Method 2: Upload File
1. Click "Upload a file"
2. Select a .txt, .pdf, .docx, or .pptx file
3. Click "Generate Flashcards"

### Studying
- Click on any card to flip between question and answer
- Use "Previous" and "Next" buttons to navigate
- Mark cards as "Learned" to track progress
- Download as PDF for offline studying

## 🔧 Troubleshooting

### File Upload Issues

**Problem**: File uploads but no text is extracted

**Solutions**:
- ✅ **PDF Issues**: PDFs may fail due to worker loading. Convert to .docx or copy text manually
- ✅ **Best Practice**: Use .docx files (most reliable) or paste text directly
- ✅ **Scanned PDFs**: Won't work - needs OCR conversion first
- ✅ **Alternative**: Copy text from your document and paste in the textarea

### Quick Fixes

| Problem | Solution |
|---------|----------|
| PDF not working | Convert to .docx or copy/paste text |
| "Cannot connect" | Ensure backend is running (`npm run server`) |
| API errors | Check .env file has valid GEMINI_API_KEY |
| Empty extraction | File may be images only - try .txt format |

**💡 Pro Tip**: The textarea method (copy/paste) is the most reliable and always works!

For detailed troubleshooting, see [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 📱 Responsive Design

FlashGen is fully responsive and works on:

- 📱 **Mobile phones** (320px - 767px)
- 📱 **Tablets** (768px - 1024px)  
- 💻 **Laptops** (1025px - 1399px)
- 🖥️ **Desktops** (1400px+)
- 🏠 **Smart Displays**:
  - Google Nest Hub (1024 x 600) ✅
  - Google Nest Hub Max (1280 x 800) ✅
  - Other landscape displays

**Special Optimizations for Nest Hub**:
- Content fits within viewport (no scrolling needed)
- Compact spacing for smart display use
- Touch-friendly controls
- Auto-adjusting text sizes

Optimized for both portrait and landscape orientations.

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite (Rolldown)
- CSS3 with responsive design
- Axios for API calls

### Backend
- Node.js
- Express 5
- Google Gemini AI API

### File Parsing
- Mammoth (DOCX)
- PDF.js (PDF)
- JSZip (PPTX)

## 📝 File Format Support

### ✅ Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Text | .txt | Plain text files |
| PDF | .pdf | Must be text-based, not scanned images |
| Word | .docx | Modern Word documents |
| PowerPoint | .pptx | Modern PowerPoint presentations |

### ❌ Not Supported

- .doc (old Word format) - convert to .docx
- .ppt (old PowerPoint) - convert to .pptx
- Image files (.jpg, .png)
- Scanned PDFs without OCR

## 🎯 Best Practices

### For Best Results

1. **Content Quality**
   - Use clear, well-structured notes
   - Include definitions, concepts, and explanations
   - Minimum 50 characters, ideal 500-2000 characters

2. **File Preparation**
   - Ensure PDFs are text-based, not scanned
   - Clean up formatting in Word/PowerPoint
   - Remove unnecessary images or graphics
   - Keep file size under 10MB

3. **Studying Tips**
   - Review all cards once before marking as learned
   - Use the flip feature to test yourself
   - Download PDF for offline review
   - Start over to reinforce learning

## 🔐 Privacy & Security

- Files are processed locally in your browser
- Text is only sent to Gemini API for flashcard generation
- No data is stored on our servers
- API key is kept secure in .env file

## 🐛 Known Issues

- Very large files (>5MB) may take longer to process
- Complex PPTX layouts might not extract all text
- Some special characters may not display correctly

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use for personal or educational purposes.

## 🙏 Acknowledgments

- Google Gemini AI for flashcard generation
- React team for the amazing framework
- All open-source library contributors

## 📞 Support

If you encounter issues:

1. Check this README's troubleshooting section
2. Look at console errors (F12 in browser)
3. Check backend terminal for server errors
4. Verify all dependencies are installed
5. Ensure API key is valid

---

Made with ❤️ for students worldwide
