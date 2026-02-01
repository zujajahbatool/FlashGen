import mammoth from 'mammoth';

// Simple PDF text extractor using pdf-parse
async function parsePDFSimple(arrayBuffer) {
  try {
    // Try using pdf-parse library (already in dependencies)
    const pdfParse = await import('pdf-parse/lib/pdf-parse.js');
    const data = await pdfParse.default(Buffer.from(arrayBuffer));
    return data.text;
  } catch (error) {
    console.error('pdf-parse failed:', error);
    throw new Error('PDF parsing library not available. Please convert PDF to text manually.');
  }
}

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
          throw new Error('No text found in DOCX file. The document may be empty or contain only images.');
        }
        
        console.log(`Extracted ${result.value.length} characters from DOCX`);
        return result.value;
      } catch (docxError) {
        console.error('DOCX parsing error:', docxError);
        throw new Error(`Cannot read DOCX file. It may be corrupted or password-protected.`);
      }
    }

    // PDF files - using simpler approach
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      console.log('Parsing as PDF file');
      try {
        const arrayBuffer = await file.arrayBuffer();
        const text = await parsePDFSimple(arrayBuffer);
        
        if (!text || text.trim().length === 0) {
          throw new Error('No text found in PDF. It may be scanned images. Try converting to Word (.docx) first.');
        }
        
        console.log(`Extracted ${text.length} characters from PDF`);
        return text;
        
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        throw new Error('PDF parsing failed. Try converting to .txt or .docx format.');
      }
    }

    // PPTX files
    if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' 
        || fileName.endsWith('.pptx')) {
      console.log('Parsing as PPTX file');
      try {
        const arrayBuffer = await file.arrayBuffer();
        
        const JSZip = (await import('jszip')).default;
        const zip = await JSZip.loadAsync(arrayBuffer);
        
        let text = '';
        const slideFiles = Object.keys(zip.files).filter(name => 
          name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
        );
        
        if (slideFiles.length === 0) {
          throw new Error('No slides found in PowerPoint file');
        }
        
        console.log(`Found ${slideFiles.length} slides`);
        
        for (const slideName of slideFiles) {
          try {
            const content = await zip.files[slideName].async('text');
            
            // Extract all text between <a:t> tags
            const textMatches = content.match(/<a:t[^>]*>([^<]+)<\/a:t>/g);
            
            if (textMatches) {
              for (const match of textMatches) {
                const cleanText = match.replace(/<\/?a:t[^>]*>/g, '').trim();
                if (cleanText.length > 0) {
                  text += cleanText + ' ';
                }
              }
              text += '\n\n';
            }
          } catch (slideError) {
            console.warn(`Error on slide ${slideName}:`, slideError);
          }
        }
        
        if (!text || text.trim().length === 0) {
          throw new Error('No text found in PowerPoint slides. Slides may contain only images.');
        }
        
        console.log(`Extracted ${text.length} characters from PPTX`);
        return text;
        
      } catch (pptxError) {
        console.error('PPTX parsing error:', pptxError);
        throw new Error('PowerPoint parsing failed. Try exporting slides as text first.');
      }
    }

    throw new Error(`File type not supported: ${fileName.split('.').pop()}. Please use .txt, .pdf, .docx, or .pptx`);
    
  } catch (error) {
    console.error('File parsing error:', error);
    
    // Pass through already formatted errors
    if (error.message.includes('supported') || 
        error.message.includes('failed') ||
        error.message.includes('No text') ||
        error.message.includes('Cannot read')) {
      throw error;
    }
    
    throw new Error(`Error reading file: ${error.message}`);
  }
};
