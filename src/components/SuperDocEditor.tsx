import React, { useState } from 'react';
import { Upload, Save, FileText, Wand2, AlertCircle, ArrowRight, Check, Copy, RefreshCw } from 'lucide-react';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Paper template content with AI guidance
const PAPER_TEMPLATE = `Research Paper Title
[AI Guidance: Create a clear, specific title that reflects your research question and main findings. Keep it concise (10-15 words) and avoid jargon.]

Abstract
[AI Guidance: Write a 150-250 word summary covering: (1) Research problem/objective, (2) Methods used, (3) Key findings, (4) Main conclusions. Write this section last, after completing your paper.]

Keywords: [List 3-6 relevant terms for indexing]

1. Introduction
[AI Guidance: Start broad, then narrow to your specific research question. Include: (1) Background context, (2) Problem statement, (3) Research objectives/questions, (4) Significance of the study, (5) Brief overview of methodology. End with a clear thesis statement.]

2. Literature Review
[AI Guidance: Organize by themes, not chronologically. For each theme: (1) Summarize existing research, (2) Identify gaps or contradictions, (3) Show how your work addresses these gaps. Use recent sources (last 5-10 years) and maintain critical analysis throughout.]

3. Methodology
[AI Guidance: Provide enough detail for replication. Include: (1) Research design/approach, (2) Participants/sample, (3) Data collection methods, (4) Data analysis procedures, (5) Ethical considerations. Justify your choices and acknowledge limitations.]

4. Results
[AI Guidance: Present findings objectively without interpretation. Use: (1) Clear subheadings for different analyses, (2) Tables and figures with descriptive captions, (3) Statistical significance where applicable. Report negative results too - they're valuable.]

5. Discussion
[AI Guidance: Interpret your results in context. Address: (1) How findings answer your research questions, (2) Comparison with previous studies, (3) Theoretical implications, (4) Practical applications, (5) Study limitations, (6) Future research directions.]

6. Conclusion
[AI Guidance: Concisely summarize: (1) Main findings, (2) Contribution to the field, (3) Practical implications. Avoid introducing new information. End with a strong closing statement about the significance of your work.]

References
[AI Guidance: Follow your required citation style (APA, MLA, etc.) consistently. Include all sources cited in your paper. Use reference management tools to ensure accuracy and proper formatting.]

Appendices (if applicable)
[AI Guidance: Include supplementary materials that support but don't interrupt the main text: raw data, detailed calculations, additional figures, survey instruments, etc.]`;

// Mock SuperDoc component since the actual package may not be available
const MockSuperDoc = ({ initialContent, onSave, onTemplateLoad, options, style, className, onTextSelect }: any) => {
  const [content, setContent] = useState(initialContent || '');

  // Update content when template is loaded
  React.useEffect(() => {
    if (onTemplateLoad) {
      setContent(initialContent);
    }
  }, [initialContent, onTemplateLoad]);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
  };

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    if (onTextSelect) {
      onTextSelect(selectedText);
    }
  };

  return (
    <div className={className} style={style}>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        {/* Mock Word-like toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center space-x-2">
          <button className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            <strong>B</strong>
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            <em>I</em>
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            <u>U</u>
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            • List
          </button>
          <button className="px-2 py-1 text-sm hover:bg-gray-200 rounded">
            Table
          </button>
          <div className="ml-auto">
            <button 
              onClick={handleSave}
              className="superdoc-save px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
        
        {/* Mock document editor */}
        <div className="p-6 bg-white" style={{ minHeight: '500px' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full border-none outline-none resize-none font-serif text-base leading-relaxed"
            style={{ minHeight: '450px' }}
            placeholder="Start typing your document here..."
          />
        </div>
      </div>
    </div>
  );
};

const SuperDocEditor = ({ onPaperTemplateClick }: { onPaperTemplateClick?: () => void }) => {
  const [docContent, setDocContent] = useState(``);
  const [fileName, setFileName] = useState('research-paper.docx');
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showToneOptimizer, setShowToneOptimizer] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState('');
  const [casualWords, setCasualWords] = useState<Array<{word: string, suggestion: string, context: string}>>([]);
  const [copied, setCopied] = useState(false);
  const [showParaphraser, setShowParaphraser] = useState(false);
  const [isParaphrasing, setIsParaphrasing] = useState(false);
  const [paraphrasedText, setParaphrasedText] = useState('');
  const [paraphraseCopied, setParaphraseCopied] = useState(false);

  // Common casual to academic word mappings
  const casualToAcademic = {
    'big': 'significant',
    'huge': 'substantial',
    'tiny': 'minimal',
    'lots of': 'numerous',
    'a lot of': 'considerable',
    'really': 'particularly',
    'very': 'highly',
    'pretty': 'relatively',
    'kind of': 'somewhat',
    'sort of': 'somewhat',
    'stuff': 'materials',
    'things': 'elements',
    'get': 'obtain',
    'got': 'obtained',
    'show': 'demonstrate',
    'find': 'determine',
    'found': 'determined',
    'look at': 'examine',
    'check': 'verify',
    'figure out': 'ascertain',
    'come up with': 'develop',
    'deal with': 'address',
    'good': 'effective',
    'bad': 'ineffective',
    'okay': 'acceptable',
    'nice': 'favorable',
    'weird': 'anomalous',
    'cool': 'innovative',
    'awesome': 'remarkable',
    'amazing': 'extraordinary',
    'crazy': 'unprecedented',
    'totally': 'completely',
    'basically': 'essentially',
    'obviously': 'evidently',
    'clearly': 'demonstrably',
    'of course': 'naturally',
    'I think': 'it is suggested',
    'I believe': 'it is proposed',
    'I feel': 'it appears',
    'we think': 'it is hypothesized',
    'we believe': 'it is postulated'
  };

  // Detect casual words in text
  const detectCasualWords = (text: string) => {
    const detected: Array<{word: string, suggestion: string, context: string}> = [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    Object.entries(casualToAcademic).forEach(([casual, academic]) => {
      const regex = new RegExp(`\\b${casual.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      sentences.forEach(sentence => {
        if (regex.test(sentence)) {
          const contextStart = Math.max(0, sentence.toLowerCase().indexOf(casual.toLowerCase()) - 20);
          const contextEnd = Math.min(sentence.length, sentence.toLowerCase().indexOf(casual.toLowerCase()) + casual.length + 20);
          const context = sentence.substring(contextStart, contextEnd).trim();
          
          detected.push({
            word: casual,
            suggestion: academic,
            context: `...${context}...`
          });
        }
      });
    });
    
    return detected;
  };

  // Handle tone optimization
  const handleToneOptimizer = async () => {
    // Get selected text or use entire document
    const textToOptimize = selectedText || docContent;
    if (!textToOptimize.trim()) return;
    
    setIsOptimizing(true);
    setShowToneOptimizer(true);
    
    try {
      // Detect casual words
      const detectedWords = detectCasualWords(textToOptimize);
      setCasualWords(detectedWords);
      
      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt: `Please rewrite the following text into formal academic style suitable for research papers. Focus on:
- Converting casual language to academic terminology
- Using precise, scholarly vocabulary
- Maintaining objectivity and formal tone
- Ensuring proper academic sentence structure
- Removing colloquialisms and informal expressions
- Converting first-person statements to third-person or passive voice where appropriate
- Using hedging language and appropriate qualifiers
- Ensuring claims are properly supported and objective

Original text: "${textToOptimize}"

Please provide only the rewritten text without explanations.`,
      });
      
      setOptimizedText(text);
    } catch (error) {
      console.error('Error optimizing tone:', error);
      setOptimizedText('Error: Unable to optimize text. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // Apply optimized text to document
  const applyOptimizedText = () => {
    if (selectedText && optimizedText) {
      // Replace selected text with optimized version
      const newContent = docContent.replace(selectedText, optimizedText);
      setDocContent(newContent);
    } else if (optimizedText) {
      // Replace entire document
      setDocContent(optimizedText);
    }
    setShowToneOptimizer(false);
    setOptimizedText('');
    setSelectedText('');
  };

  // Copy optimized text
  const copyOptimizedText = async () => {
    try {
      await navigator.clipboard.writeText(optimizedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Handle paraphrasing
  const handleParaphraser = async () => {
    // Get selected text or use entire document
    const textToParaphrase = selectedText || docContent;
    if (!textToParaphrase.trim()) return;
    
    setIsParaphrasing(true);
    setShowParaphraser(true);
    
    try {
      const { text } = await generateText({
        model: openai('gpt-4o'),
        prompt: `Please paraphrase the following text to reduce similarity index while preserving the original meaning and academic tone. Focus on:
- Changing sentence structure and word order
- Using appropriate synonyms where possible
- Maintaining all technical terms and key concepts
- Preserving the academic writing style and formality
- Keeping the same meaning and arguments
- Ensuring the text remains scholarly and professional

Original text: "${textToParaphrase}"

Please provide only the paraphrased text without explanations.`,
      });
      
      setParaphrasedText(text);
    } catch (error) {
      console.error('Error paraphrasing text:', error);
      setParaphrasedText('Error: Unable to paraphrase text. Please try again.');
    } finally {
      setIsParaphrasing(false);
    }
  };

  // Apply paraphrased text to document
  const applyParaphrasedText = () => {
    if (selectedText && paraphrasedText) {
      // Replace selected text with paraphrased version
      const newContent = docContent.replace(selectedText, paraphrasedText);
      setDocContent(newContent);
    } else if (paraphrasedText) {
      // Replace entire document
      setDocContent(paraphrasedText);
    }
    setShowParaphraser(false);
    setParaphrasedText('');
    setSelectedText('');
  };

  // Copy paraphrased text
  const copyParaphrasedText = async () => {
    try {
      await navigator.clipboard.writeText(paraphrasedText);
      setParaphraseCopied(true);
      setTimeout(() => setParaphraseCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Expose tone optimizer function to parent
  React.useEffect(() => {
    (window as any).handleToneOptimizer = handleToneOptimizer;
  }, [docContent, selectedText]);

  // Handle paper template loading
  const handlePaperTemplate = () => {
    setDocContent(PAPER_TEMPLATE);
    setFileName('research-paper-template.docx');
    setTemplateLoaded(true);
  };

  // Expose the template function to parent component
  React.useEffect(() => {
    if (onPaperTemplateClick) {
      // Store the function reference so parent can call it
      (window as any).loadPaperTemplate = handlePaperTemplate;
    }
  }, [onPaperTemplateClick]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        // For demo purposes, we'll just set some sample content
        // In a real implementation, you'd parse the .docx file
        setDocContent(e.target?.result as string || docContent);
      };
      reader.readAsText(file); // For demo - real implementation would use readAsArrayBuffer
    }
  };

  // Handle save action
  const handleSave = (doc: string) => {
    const blob = new Blob([doc], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    console.log('Document saved:', fileName);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Document toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-900">{fileName}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-sm">Upload .docx</span>
            <input
              type="file"
              accept=".docx,.doc"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <button 
            onClick={() => document.querySelector('.superdoc-save')?.click()}
            className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm">Save Document</span>
          </button>
          
{/*           <button 
            onClick={handleToneOptimizer}
            disabled={isOptimizing}
            className="flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded transition-colors"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Optimizing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span className="text-sm">Tone Optimizer</span>
              </>
            )}
          </button>
           */}
{/*           <button 
            onClick={handleParaphraser}
            disabled={isParaphrasing}
            className="flex items-center space-x-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded transition-colors"
          >
            {isParaphrasing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="text-sm">Paraphrasing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm">Paraphraser</span>
              </>
            )}
          </button> */}
        </div>
      </div>

      {/* SuperDoc Editor */}
      <div className="flex-1 p-4 bg-gray-100">
        <MockSuperDoc
          initialContent={docContent}
          onSave={handleSave}
          onTemplateLoad={templateLoaded}
          onTextSelect={setSelectedText}
          options={{
            toolbar: true,
            trackChanges: true,
            formats: ['bold', 'italic', 'underline', 'list', 'table'],
          }}
          className="h-full"
          style={{ height: '100%' }}
        />
      </div>

      {/* Tone Optimizer Modal */}
      {showToneOptimizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Wand2 size={24} />
                <h2 className="text-xl font-semibold">Tone Optimizer</h2>
              </div>
              <button 
                onClick={() => setShowToneOptimizer(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FileText size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Text */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      {selectedText ? 'Selected Text' : 'Document Content'}
                    </label>
                    {casualWords.length > 0 && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <AlertCircle size={14} />
                        <span>{casualWords.length} casual word{casualWords.length !== 1 ? 's' : ''} detected</span>
                      </div>
                    )}
                  </div>
                  <textarea
                    value={selectedText || docContent}
                    readOnly
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                  />
                  
                  {/* Casual Word Suggestions */}
                  {casualWords.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-orange-800 mb-2 flex items-center space-x-1">
                        <AlertCircle size={14} />
                        <span>Casual Language Detected</span>
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {casualWords.slice(0, 5).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded font-mono">
                              {item.word}
                            </span>
                            <ArrowRight size={12} className="text-orange-600" />
                            <span className="bg-green-200 text-green-800 px-2 py-1 rounded font-mono">
                              {item.suggestion}
                            </span>
                          </div>
                        ))}
                        {casualWords.length > 5 && (
                          <div className="text-xs text-orange-600 italic">
                            +{casualWords.length - 5} more suggestions available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optimized Text */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Academic Style Version
                  </label>
                  <div className="relative">
                    <textarea
                      value={optimizedText}
                      readOnly
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                      placeholder={isOptimizing ? "Optimizing text..." : "Optimized text will appear here..."}
                    />
                    {optimizedText && (
                      <button
                        onClick={copyOptimizedText}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                  {optimizedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={applyOptimizedText}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Apply to Document
                      </button>
                      <button
                        onClick={copyOptimizedText}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2">Academic Writing Tips:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use third person instead of first person</li>
                    <li>• Replace casual words with formal alternatives</li>
                    <li>• Use precise, technical vocabulary</li>
                    <li>• Avoid contractions and colloquial expressions</li>
                    <li>• Maintain objectivity and avoid emotional language</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-medium text-green-900 mb-2">Common Replacements:</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-red-100 px-1 rounded">big</span>
                      <ArrowRight size={12} />
                      <span className="font-mono bg-green-100 px-1 rounded">significant</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-red-100 px-1 rounded">show</span>
                      <ArrowRight size={12} />
                      <span className="font-mono bg-green-100 px-1 rounded">demonstrate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono bg-red-100 px-1 rounded">I think</span>
                      <ArrowRight size={12} />
                      <span className="font-mono bg-green-100 px-1 rounded">it is suggested</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paraphraser Modal */}
      {showParaphraser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <RefreshCw size={24} />
                <h2 className="text-xl font-semibold">Paraphraser - Plagiarism-Safe Rewriting</h2>
              </div>
              <button 
                onClick={() => setShowParaphraser(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FileText size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Text */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {selectedText ? 'Selected Text' : 'Document Content'}
                  </label>
                  <textarea
                    value={selectedText || docContent}
                    readOnly
                    className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                  />
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Paraphrasing Benefits:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Reduces similarity index for plagiarism checkers</li>
                      <li>• Maintains original meaning and academic tone</li>
                      <li>• Uses different sentence structures and vocabulary</li>
                      <li>• Preserves technical terms and key concepts</li>
                    </ul>
                  </div>
                </div>

                {/* Paraphrased Text */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Paraphrased Version
                  </label>
                  <div className="relative">
                    <textarea
                      value={paraphrasedText}
                      readOnly
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none bg-gray-50"
                      placeholder={isParaphrasing ? "Paraphrasing text..." : "Paraphrased text will appear here..."}
                    />
                    {paraphrasedText && (
                      <button
                        onClick={copyParaphrasedText}
                        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy to clipboard"
                      >
                        {paraphraseCopied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    )}
                  </div>
                  {paraphrasedText && (
                    <div className="flex space-x-2">
                      <button
                        onClick={applyParaphrasedText}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Apply to Document
                      </button>
                      <button
                        onClick={copyParaphrasedText}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tips and Information */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-medium text-purple-900 mb-2">How Paraphrasing Helps:</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Changes sentence structure and word order</li>
                    <li>• Replaces words with synonyms where appropriate</li>
                    <li>• Maintains academic tone and formality</li>
                    <li>• Preserves all original meaning and arguments</li>
                    <li>• Reduces similarity scores in plagiarism checkers</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h3 className="font-medium text-indigo-900 mb-2">Best Practices:</h3>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Always cite original sources even when paraphrasing</li>
                    <li>• Review paraphrased text for accuracy</li>
                    <li>• Ensure technical terms remain precise</li>
                    <li>• Check that the meaning hasn't changed</li>
                    <li>• Use paraphrasing ethically and responsibly</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperDocEditor;
