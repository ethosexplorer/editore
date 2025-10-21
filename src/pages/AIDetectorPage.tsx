import React, { useState, useRef } from 'react';
import { Search, Upload, FileText, AlertTriangle, CheckCircle, Globe, Info, Download, Eye, Shield, Brain, Cpu, User, Trash2 } from 'lucide-react';

interface AnalysisResult {
  overallScore: number;
  aiGenerated: number;
  aiRefined: number;
  humanWritten: number;
  predictabilityScore: number;
  formulaicPatterns: number;
  wordCount: number;
  sentences: Array<{
    text: string;
    aiProbability: number;
    highlighted: boolean;
    patterns: string[];
  }>;
  highlightedText: string;
  detailedAnalysis: {
    vocabulary: number;
    syntax: number;
    coherence: number;
    creativity: number;
  };
  note?: string;
}

const AIDetectorPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [language, setLanguage] = useState('en');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { id: "en-US", name: "English (US)", flag: "🇺🇸" },
    { id: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { id: "en-AU", name: "English (AU)", flag: "🇦🇺" },
    { id: "en-CA", name: "English (CA)", flag: "🇨🇦" },
    { id: "fr", name: "French", flag: "🇫🇷" },
    { id: "es", name: "Spanish", flag: "🇪🇸" },
    { id: "de", name: "German", flag: "🇩🇪" },
    { id: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { id: "hi", name: "Hindi", flag: "🇮🇳" },
    { id: "ru", name: "Russian", flag: "🇷🇺" },
    { id: "da", name: "Danish", flag: "🇩🇰" },
    { id: "nl", name: "Dutch", flag: "🇳🇱" },
    { id: "it", name: "Italian", flag: "🇮🇹" },
    { id: "ja", name: "Japanese", flag: "🇯🇵" },
    { id: "ko", name: "Korean", flag: "🇰🇷" },
    { id: "pl", name: "Polish", flag: "🇵🇱" },
    { id: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
    { id: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
    { id: "sv", name: "Swedish", flag: "🇸🇪" },
    { id: "tr", name: "Turkish", flag: "🇹🇷" },
    { id: "ar", name: "Arabic", flag: "🇸🇦" },
    { id: "th", name: "Thai", flag: "🇹🇭" },
    { id: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { id: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { id: "ro", name: "Romanian", flag: "🇷🇴" },
  ];

  const getApiBaseUrl = () => {
    // Use the same base URL logic as your other components
    return ''
  }

  const handleAnalyze = async () => {
    const wordCount = text.trim().split(/\s+/).filter(w => w).length;
    if (!text.trim()) {
      alert('Please enter some text to analyze.');
      return;
    }
    if (wordCount < 10) {
      alert('Please enter at least 10 words for accurate analysis.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const apiUrl = `${getApiBaseUrl()}/api/ai-detect`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const analysisResult: AnalysisResult = await response.json();
      setResult(analysisResult);

    } catch (error) {
      console.error('Analysis error:', error);
      alert('Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles(prev => [...prev, ...uploadedFiles]);
      
      // Read the first file and set as text
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(uploadedFiles[0]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const downloadReport = () => {
    if (!result) return;

    const reportContent = `AI DETECTION REPORT
==================

Overall Analysis:
- AI Generated: ${result.aiGenerated}%
- AI Refined: ${result.aiRefined}%
- Human Written: ${result.humanWritten}%
- Overall AI Score: ${result.overallScore}%

Text Analysis:
- Predictability Score: ${result.predictabilityScore}%
- Formulaic Patterns: ${result.formulaicPatterns}%

Detailed Metrics:
- Vocabulary Diversity: ${result.detailedAnalysis.vocabulary}%
- Syntax Complexity: ${result.detailedAnalysis.syntax}%
- Coherence Score: ${result.detailedAnalysis.coherence}%
- Creativity Index: ${result.detailedAnalysis.creativity}%

Word Count: ${result.wordCount}
Language: ${languages.find(l => l.id === language)?.name}

${result.note ? `Note: ${result.note}` : ''}

Generated by AI Detector
${new Date().toLocaleDateString()}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-detection-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 70) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (score >= 40) return <Info className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const renderHighlightedText = (highlightedText: string) => {
    return highlightedText.split('***').map((part, index) => {
      if (index % 2 === 1) {
        // AI-detected parts (odd indices between *** markers)
        return (
          <mark key={index} className="bg-red-200 text-red-900 px-1 rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Detector</h1>
                <p className="text-sm text-gray-600">Advanced AI-generated content detection using OpenAI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-green-600 font-medium">Privacy Protected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="detailed"
                  checked={showDetailedAnalysis}
                  onChange={(e) => setShowDetailedAnalysis(e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="detailed" className="text-sm text-gray-700">Show detailed analysis</label>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </button>
              
              {result && (
                <button
                  onClick={downloadReport}
                  className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            {files.length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files ({files.length})</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Text Analysis</h2>
                <p className="text-sm text-gray-600">Paste content or upload documents for AI detection analysis</p>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze for AI-generated content. Minimum 10 words required for accurate detection..."
                className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{text.length} characters</span>
                  <span>•</span>
                  <span>{text.split(' ').filter(w => w.trim()).length} words</span>
                  {files.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">{files.length} files</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-base"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Detect AI Content
                    </>
                  )}
                </button>
              </div>
            </div>

            {result && (
              <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  AI Detection Results
                </h3>
                
                {result.note && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">{result.note}</p>
                  </div>
                )}
                
                {/* Highlighted Text Display */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">Text with AI Content Highlighted</h4>
                  <div className="p-3 bg-white rounded border text-sm leading-relaxed whitespace-pre-wrap">
                    {renderHighlightedText(result.highlightedText)}
                  </div>
                  <div className="mt-2 flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-red-200 rounded mr-2"></div>
                    <span>Highlighted text indicates AI-generated content</span>
                  </div>
                </div>

                {showDetailedAnalysis && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Sentence Analysis</h4>
                    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                      <div className="space-y-2 text-sm">
                        {result.sentences.map((sentence, index) => (
                          <div
                            key={index}
                            className={`p-2 rounded ${
                              sentence.highlighted 
                                ? 'bg-red-100 border-l-4 border-red-500' 
                                : 'bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <span className="flex-1">{sentence.text}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                sentence.aiProbability > 70 ? 'bg-red-100 text-red-700' :
                                sentence.aiProbability > 40 ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {sentence.aiProbability}% AI
                              </span>
                            </div>
                            {sentence.patterns.length > 0 && (
                              <div className="text-xs text-gray-600 mt-1">
                                Patterns: {sentence.patterns.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Detection Results</h2>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <Brain className="w-16 h-16 mb-4" />
                <p className="text-center px-4">Enter text to analyze for AI-generated content</p>
                <p className="text-center text-sm mt-2">Uses OpenAI for advanced pattern detection</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className={`p-6 rounded-lg border-2 ${getScoreColor(result.overallScore)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getScoreIcon(result.overallScore)}
                      <span className="ml-2 font-semibold">Overall AI Detection</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {result.overallScore}%
                      </div>
                      <div className="text-xs opacity-75">AI-influenced</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        result.overallScore >= 70 ? 'bg-red-500' : 
                        result.overallScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.overallScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Breakdown Scores */}
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <Cpu className="w-5 h-5 text-red-500 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">AI-Generated</span>
                        <span className="font-bold text-red-600">{result.aiGenerated}%</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${result.aiGenerated}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Brain className="w-5 h-5 text-yellow-500 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">AI-Refined</span>
                        <span className="font-bold text-yellow-600">{result.aiRefined}%</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${result.aiRefined}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <User className="w-5 h-5 text-green-500 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Human-Written</span>
                        <span className="font-bold text-green-600">{result.humanWritten}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${result.humanWritten}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{result.wordCount}</div>
                    <div className="text-xs text-gray-600">Words</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{result.sentences.length}</div>
                    <div className="text-xs text-gray-600">Sentences</div>
                  </div>
                </div>

                {showDetailedAnalysis && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3">Detailed Analysis</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Vocabulary:</span>
                        <span className="font-medium">{result.detailedAnalysis.vocabulary}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Syntax:</span>
                        <span className="font-medium">{result.detailedAnalysis.syntax}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Coherence:</span>
                        <span className="font-medium">{result.detailedAnalysis.coherence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Creativity:</span>
                        <span className="font-medium">{result.detailedAnalysis.creativity}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectorPage;
