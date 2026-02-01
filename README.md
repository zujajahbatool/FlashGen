# ⚡ FlashGen - AI-Powered Flashcard Generator

**Enhanced Version with Improved UI/UX & Gemini 2.5 Flash Integration**

A modern, beautifully designed web application that transforms your study materials into interactive flashcards using Google's Gemini 2.5 Flash AI model.

## 🎨 What's New in This Version

### ✨ Major Improvements

1. **Fixed API Integration**
   - ✅ Now using **Gemini 2.5 Flash** (gemini-2.5-flash-preview) - no more bad request errors
   - ✅ Correct API endpoint implementation
   - ✅ Better error handling with helpful messages
   - ✅ API key validation on startup
   - ✅ 90-second timeout for longer content

2. **Natural Scrollbars**
   - ✅ Beautiful, native-looking scrollbars throughout the app
   - ✅ Properly positioned on the right edge
   - ✅ Smooth gradient colors matching the theme
   - ✅ WebKit and Firefox support

3. **Study-Focused Design**
   - 🎯 **Calming color scheme**: Deep blues and teals for focus
   - 📚 **Active learning colors**: Warm golds for answers, greens for progress
   - 🧘 **Serene gradients**: Creating a peaceful study environment
   - ✨ **Professional polish**: Subtle textures, shadows, and animations

4. **Enhanced Responsiveness**
   - 📱 Perfect on all devices (mobile, tablet, desktop)
   - 🔄 Smooth transitions and interactions
   - 👆 Touch-friendly controls
   - 🎨 Adaptive layouts

5. **Better User Experience**
   - 💡 Helpful error messages with troubleshooting tips
   - ⚡ Faster feedback and loading states
   - 🎯 Clear visual hierarchy
   - ♿ Improved accessibility

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Get Your Gemini API Key**
   ```
   1. Visit https://makersuite.google.com/app/apikey
   2. Sign in with your Google account
   3. Click "Create API Key"
   4. Copy the generated key
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   ⚠️ **Important**: Replace with your real API key!

4. **Start the Backend Server** (Terminal 1)
   ```bash
   npm run server
   ```
   
   You should see:
   ```
   =================================
   ✅ FlashGen Backend Server
   📡 Running on port 3001
   🔑 API Key: Configured ✓
   🤖 Model: Gemini 2.5 Flash
   =================================
   ```

5. **Start the Frontend** (Terminal 2)
   ```bash
   npm run dev
   ```
   
   Open your browser to: `http://localhost:5173`

## 📖 Usage

### Method 1: Paste Text
1. Copy your study notes or educational content
2. Paste it into the text area (minimum 50 characters, ideal: 500-2000)
3. Click "✨ Generate Flashcards"

### Method 2: Upload File
1. Click "📎 Upload a file"
2. Select a `.txt`, `.pdf`, `.docx`, or `.pptx` file
3. Wait for file confirmation
4. Click "✨ Generate Flashcards"

### Studying
- 👆 Click any card to flip between question and answer
- ◀️ Use "Previous" and "Next" to navigate
- ✅ Mark cards as "Learned" to track progress
- 📥 Download as PDF for offline studying
- 🔄 Start over to reinforce learning

## 🎨 Design Philosophy

### Color Scheme - Study Environment Theme

**Primary Colors:**
- **Deep Focus Blue** (#4a7ba7 → #6ea8d4): Questions - promotes concentration
- **Knowledge Gold** (#f39c12 → #feca57): Answers - warm and encouraging
- **Success Green** (#27ae60 → #82e0aa): Learned cards - positive reinforcement

**Background:**
- Calming gradient from deep blue to soft teal
- Creates a serene, distraction-free study space
- Reduces eye strain during long study sessions

**Interactive Elements:**
- Smooth transitions for focused experience
- Subtle shadows for depth without distraction
- Hover effects that guide without overwhelming

## 🔧 Troubleshooting

### "Server not found" Error

**Solution:**
1. Ensure backend is running: `npm run server`
2. Check terminal for "Server running on port 3001"
3. Verify no other app is using port 3001
4. Try restarting both servers

### API Errors

**If you see "Bad Request" or "API Error":**

1. **Check your API key:**
   - Open `.env` file
   - Ensure format: `GEMINI_API_KEY=your_key` (no spaces or quotes)
   - Verify key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Ensure API is enabled:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable "Generative Language API"
   - Check billing is configured (free tier available)

3. **Try generating a new API key:**
   - Sometimes keys expire or have issues
   - Create a fresh key and update `.env`
   - Restart the backend server

### File Upload Issues

| Problem | Solution |
|---------|----------|
| PDF not working | Ensure it's text-based, not scanned images. Try .docx instead |
| No text extracted | File may be corrupted. Try copying text manually |
| File too large | Keep files under 10MB. Use .txt for large content |
| Format not supported | Use .txt, .pdf, .docx, or .pptx only |

### Performance Issues

**If generation is slow:**
- Reduce text length (500-2000 characters is optimal)
- Check your internet connection
- Ensure backend server isn't overloaded
- Try closing other applications

## 📱 Responsive Design

Works perfectly on:
- 📱 **Mobile phones** (320px - 767px)
- 📱 **Tablets** (768px - 1024px)
- 💻 **Laptops** (1025px - 1399px)
- 🖥️ **Desktops** (1400px+)
- 🏠 **Smart Displays** (Google Nest Hub, etc.)

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite (Rolldown)
- CSS3 with modern gradients and animations
- Axios for API calls

### Backend
- Node.js
- Express 5
- Google Gemini 2.5 Flash API

### File Parsing
- Mammoth (DOCX)
- PDF.js (PDF)
- JSZip (PPTX)

## 🎯 Best Practices

### For Best Results

1. **Content Quality**
   - Use well-structured notes with clear concepts
   - Include definitions, explanations, and examples
   - Minimum 50 characters, ideal 500-2000
   - Break very long content into sections

2. **File Preparation**
   - PDF: Must be text-based (not scanned images)
   - Word/PowerPoint: Clean up formatting first
   - Remove unnecessary images or graphics
   - Keep file size under 10MB

3. **Studying Tips**
   - Review all cards before marking as learned
   - Use the flip feature to actively recall
   - Download PDF for offline review
   - Reset and repeat for spaced repetition

## 🔐 Privacy & Security

- ✅ Files processed locally in your browser
- ✅ Only text sent to Gemini API for generation
- ✅ No data stored on servers
- ✅ API key kept secure in .env (never committed to git)
- ✅ HTTPS recommended for production

## 🐛 Known Limitations

1. **Large Files**: Files over 5MB may be slow to process
2. **Scanned PDFs**: Won't work - needs OCR conversion first
3. **Complex Layouts**: Some PPTX layouts may not extract all text
4. **API Rate Limits**: Gemini API has free tier limits
5. **Internet Required**: Needs connection for AI generation

## 📝 File Format Support

### ✅ Supported Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Text | .txt | Plain text files - most reliable |
| PDF | .pdf | Must be text-based, not scanned |
| Word | .docx | Modern Word documents (not .doc) |
| PowerPoint | .pptx | Modern PowerPoint (not .ppt) |

### ❌ Not Supported

- .doc (old Word) - convert to .docx
- .ppt (old PowerPoint) - convert to .pptx
- Image files (.jpg, .png) - use OCR first
- Scanned PDFs - convert or use text extraction tool

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Environment Variables

For production, set:
```
GEMINI_API_KEY=your_production_key
NODE_ENV=production
PORT=3001
```

## 🤝 Contributing

Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
- 📖 Improve documentation

## 📄 License

MIT License - free for personal and educational use.

## 🙏 Acknowledgments

- Google Gemini Team for the amazing AI API
- React team for the powerful framework
- All open-source contributors
- The study community for feedback and ideas

## 📞 Support

### Quick Checklist

Before asking for help:
- ✅ Backend server running on port 3001?
- ✅ Frontend running on port 5173?
- ✅ .env file has valid API key?
- ✅ Tried with simple text input?
- ✅ Checked browser console (F12) for errors?
- ✅ Checked backend terminal for messages?

### Getting Help

1. Check this README's troubleshooting section
2. Look at browser console errors (F12)
3. Check backend terminal output
4. Verify all dependencies installed (`npm install`)
5. Try with a fresh API key

---

## 🎓 Study Smart, Not Hard!

Made with ❤️ for students worldwide

**Version 2.0** - Enhanced UI/UX Edition  
Last Updated: February 2026

### 🌟 Key Features at a Glance

- ✨ AI-powered flashcard generation
- 🎨 Beautiful, calming study-focused design
- 📱 Fully responsive on all devices
- 📁 Multiple file format support
- 📊 Progress tracking with visual counters
- 📥 PDF export for offline studying
- 🎯 Natural, accessible UI
- ⚡ Fast and reliable
- 🔒 Privacy-focused
- 🆓 Free to use

**Start studying smarter today!** 🚀