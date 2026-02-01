# 🚀 Quick Setup Guide

## Step-by-Step Installation

### 1. Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Install the Project

Open terminal and run:

```bash
# Navigate to the project folder
cd flashgen

# Install dependencies
npm install
```

### 3. Configure API Key

Create a `.env` file in the root folder:

```
GEMINI_API_KEY=paste_your_actual_key_here
```

**Important**: Replace `paste_your_actual_key_here` with your real API key!

### 4. Start the Application

You need TWO terminal windows:

**Terminal 1 - Backend:**
```bash
npm run server
```
✅ You should see: "Server running on port 3001"

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Your browser should open to: http://localhost:5173

## ✅ Verify It's Working

1. The app should load in your browser
2. Try pasting some text (at least 50 characters)
3. Click "Generate Flashcards"
4. You should see flashcards appear!

## 🐛 Troubleshooting

### "Cannot connect to server"
- ✅ Make sure backend is running (`npm run server`)
- ✅ Check terminal 1 for "Server running on port 3001"

### "API Error"
- ✅ Check your .env file has the correct API key
- ✅ Make sure there are no spaces in the .env file
- ✅ Restart the backend after changing .env

### File Upload Not Working
- ✅ Make sure file is .txt, .pdf, .docx, or .pptx
- ✅ File must be under 10MB
- ✅ PDF must be text-based (not scanned image)

### "Please provide more text"
- ✅ Need at least 50 characters
- ✅ Try pasting more content

## 📁 Supported Files

✅ .txt (Plain text)
✅ .pdf (Text-based PDFs)  
✅ .docx (Word documents)
✅ .pptx (PowerPoint presentations)

❌ Scanned PDFs
❌ Image files
❌ Old .doc or .ppt formats

## 💡 Tips for Best Results

- Use clear, educational content
- 500-2000 characters works best
- Clean formatting helps
- More structured text = better flashcards

## 🎯 Test Content

Try this sample text to test:

```
Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to create oxygen and energy in the form of sugar. During photosynthesis, plants take in carbon dioxide and water from the air and soil. The plant then releases oxygen back into the air, and stores energy within glucose molecules. Chlorophyll is the green pigment in plants that absorbs light energy. The light-dependent reactions take place in the thylakoid membrane. The light-independent reactions (Calvin cycle) take place in the stroma.
```

## 📱 Mobile Use

FlashGen works great on phones and tablets!
- Same URL works on mobile
- Fully responsive design
- Touch-friendly controls

## Need More Help?

Check the full README.md for:
- Detailed troubleshooting
- Complete feature list
- Advanced usage tips
- API documentation

---

**Ready to start studying smarter? Let's go! 🚀**
