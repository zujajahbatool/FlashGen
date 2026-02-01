# 🔧 Troubleshooting Guide

## File Upload Issues

### Issue: "Failed to parse file" or "Error parsing PDF"

**Root Cause**: PDF.js worker loading issues in browser

**Note about worker version mismatch**:
- If you see an error like: `API version "5.4.530" does not match the Worker version "5.4.296"`, the PDF.js library and the worker file are from different versions. This causes runtime failures when parsing PDFs.

**Fixes**:
- Delete `node_modules` and run `npm install` to ensure dependencies are consistent.
- If hosting the worker via CDN, ensure the worker URL uses the same version as `pdfjs-dist` (or use the app's dynamic worker versioning which selects the installed version).
- As a quick workaround, convert the PDF to .docx or .txt and upload that instead.

**Solutions**:

1. **Quick Fix - Use Alternative File Format**
   - Convert PDF to DOCX (works better): Use online tools like CloudConvert
   - Or copy text from PDF and paste directly
   - Or save PDF as .txt file

2. **For DOCX Files** (Most Reliable)
   - Open your PDF in Word or Google Docs
   - Save as .docx
   - Upload the .docx file ✅

3. **For Text Files** (Always Works)
   - Copy all text from your document
   - Paste into the text area
   - Click "Generate Flashcards" ✅

### Issue: "No text could be extracted"

**Causes**:
- PDF is scanned images (not text)
- Document is empty
- Document contains only images

**Solutions**:
- Use OCR software to convert scanned PDF to text
- Check if document actually has text content
- Try copying text manually

### Issue: File uploads but shows 0 characters

**Solution**:
```
1. Check file is not corrupted
2. Try opening file in its native app first
3. Re-save file in compatible format
4. Use .txt format as safest option
```

## NestHub Display Issues

### Issue: Content doesn't fit on screen

**Your Nest Hub Resolution**:
- Nest Hub: 1024 x 600
- Nest Hub Max: 1280 x 800

**The app now automatically adjusts for these screens!**

**If still having issues**:
1. Refresh the page (Ctrl+R or Cmd+R)
2. Try zooming out (Ctrl+- or Cmd+-)
3. Clear browser cache

### Issue: Need to scroll to see all content

**Fixed in latest version!** The app now:
- Limits height to viewport
- Adds scrolling only where needed
- Optimizes spacing for smart displays

## Backend Server Issues

### Issue: "Cannot connect to server"

**Check this**:
```bash
# Terminal 1 - Is backend running?
npm run server

# You should see:
✅ FlashGen Backend Server
📡 Running on port 3001
🔑 API Key: Configured ✓
```

**If not running**:
1. Open terminal in project folder
2. Run: `npm run server`
3. Keep this terminal open
4. Open NEW terminal for frontend

### Issue: "API Error" or "Invalid API key"

**Check your .env file**:
```
# Should look like this (no spaces, no quotes)
GEMINI_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrs

# NOT like this:
GEMINI_API_KEY = "AIzaSy..."  ❌
GEMINI_API_KEY: AIzaSy...     ❌
```

**Steps to fix**:
1. Get new API key from: https://makersuite.google.com/app/apikey
2. Edit .env file (create if missing)
3. Paste: `GEMINI_API_KEY=your_actual_key`
4. Save file
5. RESTART backend server

## Generation Issues

### Issue: Takes too long / Never completes

**Reasons**:
- Text is too long (>10,000 characters)
- API is rate limited
- Internet connection issues

**Solutions**:
1. Try with shorter text (500-2000 characters)
2. Wait 1 minute and try again
3. Check internet connection
4. Check backend terminal for errors

### Issue: Generated cards are low quality

**Tips for better results**:
- Use well-formatted study notes
- Include clear definitions and concepts
- Aim for 500-2000 characters
- Structured content works best
- Include topic headers

## Browser Compatibility

### Works Best In:
✅ Chrome/Edge (Recommended)
✅ Firefox
✅ Safari
✅ Nest Hub Browser

### Known Issues:
⚠️ Some older browsers may have PDF parsing issues
⚠️ Internet Explorer: Not supported

## Quick Diagnostics

Run these checks in order:

### 1. Backend Check
```bash
npm run server
```
Expected output:
```
✅ FlashGen Backend Server
📡 Running on port 3001
🔑 API Key: Configured ✓
```

### 2. Frontend Check
```bash
npm run dev
```
Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Browser Console Check
Open browser console (F12), look for errors:
- Red errors about CORS? → Backend not running
- 401 errors? → API key issue
- Worker errors? → Use .docx or .txt instead of PDF

### 4. Test with Simple Text
Paste this to test if generation works:
```
Photosynthesis is the process where plants convert sunlight into energy. 
It requires water, carbon dioxide, and light. The main product is glucose 
and oxygen. Chlorophyll is the green pigment that captures light energy.
```

If this works, your setup is fine - the issue is with file parsing.

## File Format Workarounds

### PDF Not Working?
1. **Best**: Open in Word → Save as .docx → Upload
2. **Easy**: Copy all text → Paste in textarea
3. **Quick**: Use online PDF to TXT converter

### PPTX Not Working?
1. **Best**: File → Export → Word Document → Upload .docx
2. **Easy**: Copy text from slides → Paste in textarea
3. **Quick**: File → Save As → Plain Text (.txt)

### DOCX Not Working?
1. **Try**: File → Save As → Plain Text (.txt)
2. **Or**: Copy all content → Paste in textarea

## Getting Help

### What to Check Before Asking:
✅ Backend running on port 3001?
✅ Frontend running on port 5173?
✅ .env file has valid API key?
✅ Tried with simple text input?
✅ Checked browser console for errors?

### Information to Provide:
- Error message (exact text)
- File type you're uploading
- Browser console errors (F12)
- Backend terminal output
- Steps you've tried

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "Cannot connect to server" | Backend not running | Start: `npm run server` |
| "API Error" | Bad API key | Check .env file |
| "Failed to parse file" | File parsing issue | Use .docx or paste text |
| "No text could be extracted" | Empty/scanned file | Convert to text format |
| "Please provide more text" | Less than 50 chars | Add more content |
| "File is too large" | Over 10MB | Use smaller file |
| "Unsupported file type" | Wrong format | Use .txt/.pdf/.docx/.pptx |

## Advanced Tips

### For Developers:

**Enable Debug Logging**:
```javascript
// In fileParser.js, look for:
console.log(`Parsing file: ${fileName}`)
// All parsing steps are logged
```

**Check Network Tab**:
1. Open DevTools (F12)
2. Go to Network tab
3. Upload file
4. Look for failed requests

**Test API Directly**:
```bash
# Test if API key works
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta2/models/gemini/2.5/flash:generateText?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"prompt":{"text":"Hello"},"maxOutputTokens":50}'
```

## Still Stuck?

### Last Resort Checklist:
1. ✅ Delete node_modules
2. ✅ Run `npm install` again
3. ✅ Create fresh .env file
4. ✅ Restart both servers
5. ✅ Try in different browser
6. ✅ Try on different device

### Use Textarea Input:
**If file upload continues to fail**, just:
1. Open your document
2. Copy all text (Ctrl+A, Ctrl+C)
3. Paste in textarea (Ctrl+V)
4. Click "Generate Flashcards"

This ALWAYS works! ✅

---

**Remember**: When in doubt, use the textarea with copied text - it's the most reliable method!
