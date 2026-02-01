import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - pick the same version as the installed pdfjs-dist to avoid worker/version mismatch
// If pdfjs-dist exposes a version, use it; otherwise fall back to a sensible recent version
const workerVersion = (pdfjsLib && pdfjsLib.version) ? pdfjsLib.version : '5.4.530';
const workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${workerVersion}/build/pdf.worker.min.mjs`;
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
console.log(`PDF.js worker set to version ${workerVersion} at ${workerSrc}`);

export const parseFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    console.log(`Parsing file: ${fileName}, type: ${fileType}, size: ${file.size}`);

    // Text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      console.log('Parsing as TXT file');
      const text = await file.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Text file is empty');
      }
      return text;
    }

    // DOCX files
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        || fileName.endsWith('.docx')) {
      console.log('Parsing as DOCX file');
      try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (!result.value || result.value.trim().length === 0) {
          throw new Error('No text could be extracted from DOCX file');
        }
        
        console.log(`Extracted ${result.value.length} characters from DOCX`);
        return result.value;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        throw new Error(`DOCX parsing failed: ${docxError.message}. File may be corrupted or password-protected.`);
      }
    }

    // PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('Parsing as PDF file');
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          useWorkerFetch: false,
          isEvalSupported: false,
          useSystemFonts: true
        });
        
        const pdf = await loadingTask.promise;
        console.log(`PDF loaded: ${pdf.numPages} pages`);
        
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          try {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map(item => item.str)
              .filter(str => str.trim().length > 0)
              .join(' ');
            
            if (pageText.trim().length > 0) {
              fullText += pageText + '\n\n';
            }
            
            console.log(`Page ${i}: ${pageText.length} characters`);
          } catch (pageError) {
            console.warn(`Error on page ${i}:`, pageError);
            // Continue with other pages
          }
        }
        
        if (!fullText || fullText.trim().length === 0) {
          throw new Error('No text could be extracted from PDF. It may be scanned images or protected.');
        }
        
        console.log(`Total extracted: ${fullText.length} characters from PDF`);
        return fullText;
        
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        const baseMsg = `PDF parsing failed: ${pdfError.message}. Ensure the PDF contains text, not just scanned images.`;
        // Provide extra guidance when worker/version mismatches occur
        if (pdfError && pdfError.message && pdfError.message.includes('does not match')) {
          throw new Error(`${baseMsg} This often happens when the PDF.js worker version doesn't match the library version. Try running: \n  1) Delete node_modules and run 'npm install' to ensure consistent versions.\n  2) If hosting worker via CDN, ensure the worker URL uses the same version as pdfjs-dist (current: ${pdfjsLib.version || 'unknown'}).`);
        }
        throw new Error(baseMsg);
      }
    }

    // PPTX files
    if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
        || fileName.endsWith('.pptx')) {
      console.log('Parsing as PPTX file');
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        // Dynamically import JSZip only when needed
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        let text = '';
        const slideFiles = Object.keys(zip.files).filter(name => 
          name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
        );
        
        if (slideFiles.length === 0) {
          throw new Error('No slides found in PPTX file');
        }
        
        console.log(`Found ${slideFiles.length} slides`);
        
        for (const slideName of slideFiles) {
          try {
            const content = await zip.files[slideName].async('text');
            // Extract text from XML using multiple patterns
            const textMatches = [
              ...content.matchAll(/<a:t[^>]*>([^<]+)<\/a:t>/g),
              ...content.matchAll(/<a:p[^>]*>([^<]+)<\/a:p>/g)
            ];
            
            if (textMatches) {
              for (const match of textMatches) {
                const cleanText = match[1].trim();
                if (cleanText.length > 0) {
                  text += cleanText + ' ';
                }
              }
              text += '\n\n';
            }
          } catch (slideError) {
            console.warn(`Error parsing slide ${slideName}:`, slideError);
            // Continue with other slides
          }
        }
        
        if (!text || text.trim().length === 0) {
          throw new Error('No text could be extracted from PPTX slides');
        }
        
        console.log(`Extracted ${text.length} characters from PPTX`);
        return text;
        
      } catch (pptxError) {
        console.error('PPTX parsing error:', pptxError);
        throw new Error(`PPTX parsing failed: ${pptxError.message}`);
      }
    }

    throw new Error(`Unsupported file type: ${fileName}. Please use .txt, .pdf, .docx, or .pptx files`);
    
  } catch (error) {
    console.error('File parsing error:', error);
    
    // Re-throw with user-friendly message
    if (error.message.includes('Unsupported') || 
        error.message.includes('parsing failed') ||
        error.message.includes('No text')) {
      throw error; // Already user-friendly
    }
    
    throw new Error(`Failed to parse file: ${error.message || 'Unknown error'}`);
  }
};

