import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, FileText, Layout, X, Loader2, AlertCircle, Check, Download } from 'lucide-react';

// Paper template content for different formats
const PAPER_TEMPLATES = {
  ieee: `<div style="column-count: 2; column-gap: 20px; font-family: 'Times New Roman', serif; font-size: 10pt;">
<h1 style="text-align: center; column-span: all; font-size: 14pt; margin-bottom: 12pt;">Title of Your Research Paper</h1>

<div style="text-align: center; column-span: all; margin-bottom: 12pt;">
<strong>Author Name¹, Co-Author Name²</strong><br>
¹Department, University, City, Country<br>
²Department, University, City, Country<br>
Email: author@email.com
</div>

<p style="font-weight: bold;">Abstract—</p>
<p style="text-align: justify; margin-bottom: 12pt;"><em>[AI Guidance: Write a 150-250 word abstract in a single paragraph. Start with the problem, describe your approach, summarize results, and state conclusions. Use past tense for completed work, present tense for general truths.]</em></p>

<p style="font-weight: bold;">Index Terms—</p>
<p style="margin-bottom: 12pt;">[List 4-6 keywords separated by commas]</p>

<h2 style="font-size: 12pt; margin-top: 12pt;">I. INTRODUCTION</h2>
<p style="text-align: justify;"><em>[AI Guidance: Start with broad context, narrow to specific problem. Include: (1) Background, (2) Problem statement, (3) Research objectives, (4) Paper organization. Use "Section II describes..., Section III presents..." format.]</em></p>

<h2 style="font-size: 12pt; margin-top: 12pt;">II. RELATED WORK</h2>
<p style="text-align: justify;"><em>[AI Guidance: Organize chronologically or thematically. Cite recent IEEE papers. Use "[1]" citation format. Compare approaches and identify gaps your work addresses.]</em></p>

<h2 style="font-size: 12pt; margin-top: 12pt;">III. METHODOLOGY</h2>
<p style="text-align: justify;"><em>[AI Guidance: Describe your approach systematically. Use subsections (A, B, C) for different components. Include mathematical formulations, algorithms, or system architecture.]</em></p>

<h3 style="font-size: 11pt;">A. Subsection Title</h3>
<p style="text-align: justify;">[Technical details here]</p>

<h3 style="font-size: 11pt;">B. Another Subsection</h3>
<p style="text-align: justify;">[More technical content]</p>

<h2 style="font-size: 12pt; margin-top: 12pt;">IV. RESULTS AND DISCUSSION</h2>
<p style="text-align: justify;"><em>[AI Guidance: Present results objectively with figures and tables. Number them sequentially. Reference as "Fig. 1" or "Table I". Interpret findings and compare with existing work.]</em></p>

<h2 style="font-size: 12pt; margin-top: 12pt;">V. CONCLUSION</h2>
<p style="text-align: justify;"><em>[AI Guidance: Summarize contributions, state limitations, suggest future work. Keep concise (1-2 paragraphs).]</em></p>

<h2 style="font-size: 12pt; margin-top: 12pt; column-span: all;">REFERENCES</h2>
<p style="font-size: 9pt;">[1] A. Author, "Title of paper," <em>IEEE Trans. Journal Name</em>, vol. X, no. Y, pp. ZZ-ZZ, Month Year.</p>
</div>`,

  apa: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto;">
<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12pt;">Title of Your Research Paper: A Clear and Descriptive Heading</h1>

<div style="text-align: center; margin-bottom: 24pt;">
<strong>Your Name</strong><br>
Department of Your Field, Your University
</div>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Author Note</h2>
<p><em>[AI Guidance: Include ORCID iD, acknowledgments, disclosures, and contact information.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Abstract</h2>
<p><em>[AI Guidance: Write 150-250 words in a single paragraph. Include research topic, questions, participants, methods, findings, implications, and keywords. No indentation.]</em></p>

<p><strong>Keywords:</strong> term1, term2, term3, term4</p>

<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-top: 24pt;">Title of Your Research Paper: A Clear and Descriptive Heading</h1>
<p><em>[AI Guidance: Begin with an attention-grabbing opening. Provide background, state the problem, review relevant literature briefly, state hypotheses or research questions, and explain the study's significance.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Literature Review</h2>
<p><em>[AI Guidance: Organize thematically, not chronologically. Use level headings. Cite as (Author, Year) or Author (Year). Synthesize sources, don't just list them.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Method</h2>
<p><em>[AI Guidance: Use past tense. Include subsections for Participants, Materials, Procedure, and Design. Provide enough detail for replication.]</em></p>

<h3 style="font-size: 11pt; font-weight: bold; margin-top: 8pt;">Participants</h3>
<p>[Demographic information, recruitment method, sample size]</p>

<h3 style="font-size: 11pt; font-weight: bold; margin-top: 8pt;">Materials</h3>
<p>[Instruments, measures, apparatus used]</p>

<h3 style="font-size: 11pt; font-weight: bold; margin-top: 8pt;">Procedure</h3>
<p>[Step-by-step description of what participants did]</p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Results</h2>
<p><em>[AI Guidance: Report statistics with proper APA formatting: t(df) = X.XX, p = .XXX. Use tables and figures. Describe findings objectively without interpretation.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Discussion</h2>
<p><em>[AI Guidance: Start with a brief summary of findings. Interpret results, relate to hypotheses, compare with previous research, discuss limitations, suggest practical applications and future research directions.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Conclusion</h2>
<p><em>[AI Guidance: Synthesize main points, emphasize contribution to field, end with strong closing statement.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">References</h2>
<p>Author, A. A., & Author, B. B. (Year). Title of article. <em>Title of Journal, Volume</em>(Issue), pages. https://doi.org/xxx</p>
</div>`,

  mla: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2; max-width: 800px; margin: 0 auto; padding: 20px;">
<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12pt;">Title of Your Research Paper</h1>

<div style="text-align: left; margin-bottom: 24pt;">
<p>Your Name<br>
Professor's Name<br>
Course Name<br>
Date</p>
</div>

<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12pt;">Title of Your Research Paper</h1>

<p><em>[AI Guidance: Start your introduction with an engaging hook. Provide context, state your thesis clearly, and outline your main arguments. MLA uses present tense for discussing literature and ideas.]</em></p>

<p>[Body paragraphs with topic sentences and supporting evidence. Use signal phrases for citations: According to Smith, "quote" (23). Or paraphrase (Smith 23).]</p>

<p><em>[AI Guidance: Each paragraph should have a clear topic sentence, supporting evidence with citations, analysis connecting evidence to thesis, and smooth transitions to next paragraph.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt; text-align: left;">Major Section Heading</h2>
<p><em>[AI Guidance: For longer papers, use headings to organize major sections. Headings in MLA are simply formatted in the same font as text, flush left.]</em></p>

<p>[In your analysis, engage critically with sources. Don't just summarize—interpret, evaluate, and synthesize. Show how sources relate to each other and to your argument.]</p>

<p><em>[AI Guidance: Conclude by restating your thesis in light of evidence presented. Synthesize main points without merely repeating them. End with significance—why does this matter?]</em></p>

<h2 style="text-align: center; font-size: 12pt; font-weight: bold; margin-top: 24pt;">Works Cited</h2>
<p>Author Last Name, First Name. "Title of Article." <em>Title of Journal</em>, vol. #, no. #, Year, pp. ##-##. Database Name, DOI or URL.</p>
</div>`,

  chicago: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; max-width: 800px; margin: 0 auto;">
<h1 style="text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 12pt;">Title of Your Research Paper: A Comprehensive Analysis</h1>

<div style="text-align: center; margin-bottom: 24pt;">
<p>By<br>
<strong>Your Full Name</strong></p>

<p>A Thesis/Paper Submitted in Partial Fulfillment<br>
of the Requirements for the Degree of [Degree Name]</p>

<p>Department of [Your Department]<br>
[Your University]<br>
[City, State]<br>
[Month, Year]</p>
</div>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Abstract</h2>
<p><em>[AI Guidance: Write 150-300 words. Single paragraph summarizing research question, methodology, key findings, and conclusions. Use past tense for completed research.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">Table of Contents</h2>
<ul style="list-style-type: none; padding-left: 0;">
<li>Abstract.....................................................................................ii</li>
<li>Chapter 1: Introduction..............................................................1</li>
<li>Chapter 2: Literature Review.....................................................5</li>
<li>Chapter 3: Methodology..........................................................15</li>
<li>Chapter 4: Results...................................................................25</li>
<li>Chapter 5: Discussion.............................................................35</li>
<li>Chapter 6: Conclusion............................................................45</li>
<li>Bibliography............................................................................50</li>
</ul>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 1: Introduction</h1>
<p><em>[AI Guidance: Begin with broad context, narrow to specific research question. Include: (1) Background and context, (2) Statement of the problem, (3) Research objectives, (4) Significance of the study, (5) Scope and limitations.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">1.1 Background</h2>
<p>[Provide historical context and current state of knowledge]</p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 12pt;">1.2 Problem Statement</h2>
<p>[Clearly articulate the research problem or gap]</p>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 2: Literature Review</h1>
<p><em>[AI Guidance: Organize thematically or chronologically. Use Chicago notes-bibliography style. Footnote citations appear as superscript numbers.]</em></p>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 3: Methodology</h1>
<p><em>[AI Guidance: Describe research design, data collection methods, analytical procedures, and ethical considerations. Use past tense.]</em></p>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 4: Results</h1>
<p><em>[AI Guidance: Present findings systematically. Use tables and figures numbered consecutively. Reference in text: "as shown in Table 1".]</em></p>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 5: Discussion</h1>
<p><em>[AI Guidance: Interpret results, relate to research questions, compare with previous studies, discuss implications and limitations.]</em></p>

<h1 style="font-size: 14pt; font-weight: bold; margin-top: 24pt;">Chapter 6: Conclusion</h1>
<p><em>[AI Guidance: Summarize main findings, restate significance, discuss broader implications, and suggest practical applications.]</em></p>

<h2 style="font-size: 12pt; font-weight: bold; margin-top: 24pt;">Bibliography</h2>
<p>Last Name, First Name. <em>Title of Book</em>. Place of Publication: Publisher, Year.</p>
<p>Last Name, First Name. "Title of Article." <em>Title of Journal Volume</em>, no. Issue (Year): page range.</p>
</div>`,
};

// Load external libraries dynamically
const loadPDFJS = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.onload = () => {
      // Configure PDF.js worker
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
      resolve((window as any).pdfjsLib);
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js'));
    document.head.appendChild(script);
  });
};

const loadMammoth = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).mammoth) {
      resolve((window as any).mammoth);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
    script.onload = () => resolve((window as any).mammoth);
    script.onerror = () => reject(new Error('Failed to load Mammoth'));
    document.head.appendChild(script);
  });
};

// Load TinyMCE from CDN
const loadTinyMCE = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).tinymce) {
      resolve((window as any).tinymce);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
    script.referrerPolicy = 'origin';
    
    script.onload = () => {
      resolve((window as any).tinymce);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load TinyMCE'));
    };
    
    document.head.appendChild(script);
  });
};

const SuperDocEditor = ({ onPaperTemplateClick }: { onPaperTemplateClick?: () => void }) => {
  const [docContent, setDocContent] = useState('');
  const [fileName, setFileName] = useState('research-paper.docx');
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'ieee' | 'apa' | 'mla' | 'chicago'>('apa');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [editorReady, setEditorReady] = useState(false);
  const editorRef = useRef<any>(null);
  const [tinyMCELoaded, setTinyMCELoaded] = useState(false);

  // Format configuration
  const formats = [
    {
      id: 'ieee' as const,
      name: 'IEEE',
      fullName: 'Institute of Electrical and Electronics Engineers',
      description: 'Two-column layout, numbered citations [1], technical/engineering focus',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
    },
    {
      id: 'apa' as const,
      name: 'APA',
      fullName: 'American Psychological Association',
      description: 'Single column, (Author, Year) citations, social sciences focus',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
    },
    {
      id: 'mla' as const,
      name: 'MLA',
      fullName: 'Modern Language Association',
      description: 'Single column, (Author Page#) citations, humanities focus',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
    },
    {
      id: 'chicago' as const,
      name: 'Chicago',
      fullName: 'Chicago Manual of Style',
      description: 'Single column, footnote citations, history/humanities focus',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
    },
  ];

  // Load TinyMCE on component mount
  useEffect(() => {
    loadTinyMCE()
      .then((tinymce) => {
        setTinyMCELoaded(true);
        
        tinymce.init({
          selector: '#tiny-editor',
          height: 600,
          menubar: 'file edit view insert format tools table',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic underline strikethrough | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'forecolor backcolor | removeformat | help',
          content_style: 'body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; }',
          setup: (editor: any) => {
            editorRef.current = editor;
            
            editor.on('init', () => {
              setEditorReady(true);
              if (docContent) {
                editor.setContent(docContent);
              }
            });
            
            editor.on('change', () => {
              setDocContent(editor.getContent());
            });
          }
        });
      })
      .catch((error) => {
        console.error('Failed to load TinyMCE:', error);
        setUploadError('Failed to load editor. Please refresh the page.');
      });

    return () => {
      if (editorRef.current) {
        editorRef.current.remove();
      }
    };
  }, []);

  // Update editor content when docContent changes externally
  useEffect(() => {
    if (editorRef.current && editorReady && docContent) {
      editorRef.current.setContent(docContent);
    }
  }, [docContent, editorReady]);

  // Handle paper template loading
  const handlePaperTemplate = () => {
    setShowFormatSelector(true);
  };

  // Load template with selected format
  const loadTemplateWithFormat = (formatId: 'ieee' | 'apa' | 'mla' | 'chicago') => {
    setSelectedFormat(formatId);
    setDocContent(PAPER_TEMPLATES[formatId]);
    setFileName(`research-paper-${formatId}.docx`);
    setTemplateLoaded(true);
    setShowFormatSelector(false);
  };

  // Expose the template function to parent component
  useEffect(() => {
    if (onPaperTemplateClick) {
      (window as any).loadPaperTemplate = handlePaperTemplate;
    }
  }, [onPaperTemplateClick]);

  // Extract text from PDF using PDF.js
  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const pdfjsLib = await loadPDFJS();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }

      return fullText.trim();
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF. The file may be corrupted or scanned.');
    }
  };

  // Extract text from Word document using Mammoth
  const extractTextFromWord = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    try {
      const mammoth = await loadMammoth();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.value) {
        return result.value;
      } else {
        throw new Error('No content extracted from Word document');
      }
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Failed to extract text from Word document. The file may be corrupted.');
    }
  };

  // Handle file upload with proper text extraction
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setFileName(file.name);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const arrayBuffer = await file.arrayBuffer();

      if (fileExtension === 'txt') {
        const text = new TextDecoder('utf-8').decode(arrayBuffer);
        const htmlContent = text.split('\n').map(line => 
          line.trim() ? `<p>${line.trim()}</p>` : '<br>'
        ).join('');
        setDocContent(htmlContent);
        setTemplateLoaded(false);
      } 
      else if (fileExtension === 'docx' || fileExtension === 'doc') {
        const htmlContent = await extractTextFromWord(arrayBuffer);
        setDocContent(htmlContent);
        setTemplateLoaded(false);
      }
      else if (fileExtension === 'pdf') {
        const textContent = await extractTextFromPDF(arrayBuffer);
        const htmlContent = textContent.split('\n\n').map(para => 
          para.trim() ? `<p>${para.trim()}</p>` : ''
        ).join('');
        setDocContent(htmlContent);
        setTemplateLoaded(false);
      }
      else {
        setUploadError(`Unsupported file type: .${fileExtension}. Please upload .txt, .docx, .doc, or .pdf files.`);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'An error occurred while processing the file. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  // Handle save
  const handleSave = () => {
    if (!editorRef.current) return;
    
    const content = editorRef.current.getContent();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.\w+$/, '.html');
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle save as Word
  const handleSaveAsWord = () => {
    if (!editorRef.current) return;
    
    const content = editorRef.current.getContent();
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${fileName}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          p { margin: 0 0 12pt 0; }
          h1, h2, h3 { margin: 18pt 0 6pt 0; }
        </style>
      </head>
      <body>
        ${content}
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { 
      type: 'application/msword' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.\w+$/, '.doc');
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentFormat = formats.find(f => f.id === selectedFormat);

  return (
    <div className="h-full flex flex-col">
      {/* Document toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">{fileName}</span>
          </div>
          {templateLoaded && currentFormat && (
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${currentFormat.bgColor} ${currentFormat.textColor} border ${currentFormat.borderColor}`}>
              {currentFormat.name} Format
            </span>
          )}
          {isUploading && (
            <span className="flex items-center space-x-2 text-xs text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing file...</span>
            </span>
          )}
          {!tinyMCELoaded && (
            <span className="flex items-center space-x-2 text-xs text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading editor...</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <label className={`flex items-center space-x-2 px-3 py-1.5 rounded cursor-pointer transition-colors ${
            isUploading 
              ? 'bg-gray-100 cursor-not-allowed opacity-50' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload</span>
            <input
              type="file"
              accept=".txt,.doc,.docx,.pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
            />
          </label>
          
          <button 
            onClick={handleSave}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save HTML</span>
          </button>

          <button 
            onClick={handleSaveAsWord}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Save as Word</span>
          </button>
        </div>
      </div>

      {/* Upload Error Message */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-medium">Upload Error</p>
              <div className="text-sm text-red-700 mt-1 whitespace-pre-line">{uploadError}</div>
            </div>
            <button
              onClick={() => setUploadError('')}
              className="text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Format Selection Bar */}
      {showFormatSelector && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Select Paper Format</span>
            </h3>
            <button
              onClick={() => setShowFormatSelector(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => loadTemplateWithFormat(format.id)}
                className={`relative p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                  selectedFormat === format.id
                    ? `${format.borderColor} ${format.bgColor} shadow-lg ring-2 ring-offset-2`
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {selectedFormat === format.id && (
                  <div className="absolute -top-2 -right-2">
                    <div className={`bg-gradient-to-r ${format.color} text-white rounded-full p-1`}>
                      <Check className="w-4 h-4" />
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col items-start space-y-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${format.color} text-white`}>
                    {format.name}
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {format.fullName}
                  </div>
                  <div className="text-xs text-gray-500 leading-relaxed">
                    {format.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TinyMCE Editor */}
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <div className="bg-white rounded-lg shadow-lg" style={{ minHeight: '600px' }}>
          <textarea id="tiny-editor" className="hidden"></textarea>
          {!tinyMCELoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading editor...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperDocEditor;