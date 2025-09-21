import React, { useState, useRef } from 'react';
import { Search, Upload, FileText, AlertTriangle, CheckCircle, Zap, Globe, Info, Download, Eye, Shield, BarChart3, Brain, Cpu, User, Lock, Trash2, Menu, X } from 'lucide-react';

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
  detailedAnalysis: {
    vocabulary: number;
    syntax: number;
    coherence: number;
    creativity: number;
  };
}

const AIDetectorPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [bulkResults, setBulkResults] = useState<Array<{fileName: string, result: AnalysisResult}>>([]);
  const [language, setLanguage] = useState('en');
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' },
    { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const handleAnalyze = async () => {
    const wordCount = text.trim().split(/\s+/).filter(w => w).length;
    if (!text.trim() && files.length === 0) return;
    if (wordCount < 40 && files.length === 0) {
      alert('Please enter at least 40 words for analysis.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate semantic analysis
    setTimeout(() => {
      const aiGenerated = Math.random() * 60 + 10; // 10-70%
      const aiRefined = Math.random() * 30 + 5;    // 5-35%
      const humanWritten = Math.max(0, 100 - aiGenerated - aiRefined);

      const newResult: AnalysisResult = {
        overallScore: aiGenerated + aiRefined,
        aiGenerated,
        aiRefined,
        humanWritten,
        predictabilityScore: Math.random() * 100,
        formulaicPatterns: Math.random() * 100,
        wordCount,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).map((sentence, index) => ({
          text: sentence.trim(),
          aiProbability: Math.random() * 100,
          highlighted: Math.random() > 0.6,
          patterns: ['repetitive structure', 'formulaic transitions', 'predictable vocabulary'].filter(() => Math.random() > 0.7)
        })),
        detailedAnalysis: {
          vocabulary: Math.random() * 100,
          syntax: Math.random() * 100,
          coherence: Math.random() * 100,
          creativity: Math.random() * 100
        }
      };
      
      setResult(newResult);

      // Handle bulk analysis
      if (files.length > 0) {
        const bulkData = files.map(file => ({
          fileName: file.name,
          result: {
            ...newResult,
            aiGenerated: Math.random() * 60 + 10,
            aiRefined: Math.random() * 30 + 5,
            wordCount: Math.floor(Math.random() * 1000) + 100
          }
        }));
        setBulkResults(bulkData);
      }

      setIsAnalyzing(false);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles(prev => [...prev, ...uploadedFiles]);
      
      // Process first file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(prev => prev + '\n' + content);
      };
      reader.readAsText(uploadedFiles[0]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setBulkResults(prev => prev.filter((_, i) => i !== index));
  };

  const downloadReport = () => {
    if (!result) return;
    
    const reportContent = `AI DETECTION REPORT
==================

Overall Analysis:
- AI Generated: ${result.aiGenerated.toFixed(1)}%
- AI Refined: ${result.aiRefined.toFixed(1)}%
- Human Written: ${result.humanWritten.toFixed(1)}%
- Overall AI Score: ${result.overallScore.toFixed(1)}%

Semantic Analysis:
- Predictability Score: ${result.predictabilityScore.toFixed(1)}%
- Formulaic Patterns: ${result.formulaicPatterns.toFixed(1)}%

Detailed Metrics:
- Vocabulary Diversity: ${result.detailedAnalysis.vocabulary.toFixed(1)}%
- Syntax Complexity: ${result.detailedAnalysis.syntax.toFixed(1)}%
- Coherence Score: ${result.detailedAnalysis.coherence.toFixed(1)}%
- Creativity Index: ${result.detailedAnalysis.creativity.toFixed(1)}%

Word Count: ${result.wordCount}
Language: ${languages.find(l => l.id === language)?.name}

Generated by QuillBot AI Detector
${new Date().toLocaleDateString()}
Privacy Mode: ${privacyMode ? 'Enabled (No content stored)' : 'Disabled'}`;
    
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
    if (score >= 70) return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />;
    if (score >= 40) return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Detector</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Identify AI-generated and AI-refined content with advanced semantic analysis</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <div className="flex items-center space-x-2 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-green-600 font-medium hidden sm:inline">Privacy Protected</span>
                <span className="text-green-600 font-medium sm:hidden">Protected</span>
              </div>
              <button className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs sm:text-sm">
                <span className="hidden sm:inline">Upgrade to Premium</span>
                <span className="sm:hidden">Premium</span>
              </button>
            </div>
          </div>
          
          {/* Privacy Notice */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start sm:items-center space-x-2">
              <Lock className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs sm:text-sm">
                <span className="text-green-800 font-medium">Privacy Mode Active: </span>
                <span className="text-green-700">Your content is analyzed locally and never stored on our servers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 min-w-0"
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
                <label htmlFor="detailed" className="text-xs sm:text-sm text-gray-700">Show detailed analysis</label>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm transition-colors"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Bulk Upload</span>
                <span className="sm:hidden">Upload</span>
              </button>
              
              {result && (
                <button
                  onClick={downloadReport}
                  className="flex items-center px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden sm:inline">Download Report</span>
                  <span className="sm:hidden">Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* File Upload Area */}
            {files.length > 0 && (
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files ({files.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg border">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-gray-900 block truncate">{file.name}</span>
                          <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Text Analysis</h2>
                <p className="text-sm text-gray-600">Paste content or upload documents for AI detection analysis</p>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze for AI-generated content. Minimum 40 words required for accurate detection..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <span>{text.length} characters</span>
                  <span>•</span>
                  <span>{text.split(' ').filter(w => w.trim()).length} words</span>
                  {files.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-blue-600">{files.length} files uploaded</span>
                    </>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!text.trim() || isAnalyzing}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Detect AI Content</span>
                      <span className="sm:hidden">Detect AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sentence-by-sentence Analysis */}
            {result && showDetailedAnalysis && (
              <div className="p-4 sm:p-6 pt-0">
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Sentence Analysis
                  </h3>
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
                    <div className="space-y-2 text-sm">
                      {result.sentences.map((sentence, index) => (
                        <div
                          key={index}
                          className={`p-2 sm:p-3 rounded ${
                            sentence.highlighted 
                              ? 'bg-red-100 border-l-4 border-red-500' 
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-2">
                            <span className="flex-1 text-xs sm:text-sm">{sentence.text}</span>
                            <span className={`text-xs px-2 py-1 rounded-full self-start ${
                              sentence.aiProbability > 70 ? 'bg-red-100 text-red-700' :
                              sentence.aiProbability > 40 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {sentence.aiProbability.toFixed(0)}% AI
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
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Detection Results</h2>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center h-60 sm:h-80 text-gray-400">
                <Brain className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-center text-sm sm:text-base px-4">Upload documents or enter text to analyze for AI-generated content</p>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center justify-center"><Shield className="w-3 h-3 mr-1" />Privacy protected analysis</div>
                  <div className="flex items-center justify-center"><BarChart3 className="w-3 h-3 mr-1" />Detailed semantic scoring</div>
                  <div className="flex items-center justify-center"><FileText className="w-3 h-3 mr-1" />Bulk document support</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Overall AI Score */}
                <div className={`p-4 sm:p-6 rounded-lg border-2 ${getScoreColor(result.overallScore)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getScoreIcon(result.overallScore)}
                      <span className="ml-2 font-semibold text-sm sm:text-base">Overall AI Detection</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold">
                        {result.overallScore.toFixed(1)}%
                      </div>
                      <div className="text-xs opacity-75">AI-influenced</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.overallScore >= 70 ? 'bg-red-500' : 
                        result.overallScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${result.overallScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-3 sm:space-y-4">
                  {/* AI Generated */}
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                    <Cpu className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">AI-Generated Content</span>
                        <span className="text-base sm:text-lg font-bold text-red-600">{result.aiGenerated.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.aiGenerated}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Refined */}
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">AI-Refined Content</span>
                        <span className="text-base sm:text-lg font-bold text-yellow-600">{result.aiRefined.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-yellow-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.aiRefined}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Human Written */}
                  <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900 text-sm sm:text-base">Human-Written Content</span>
                        <span className="text-base sm:text-lg font-bold text-green-600">{result.humanWritten.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.humanWritten}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Semantic Analysis */}
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center text-sm sm:text-base">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Semantic Analysis
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Predictability:</span>
                      <span className="font-medium text-blue-800">{result.predictabilityScore.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Formulaic Patterns:</span>
                      <span className="font-medium text-blue-800">{result.formulaicPatterns.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                {showDetailedAnalysis && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">Detailed Metrics</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vocabulary Diversity:</span>
                        <span className="font-medium">{result.detailedAnalysis.vocabulary.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Syntax Complexity:</span>
                        <span className="font-medium">{result.detailedAnalysis.syntax.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coherence:</span>
                        <span className="font-medium">{result.detailedAnalysis.coherence.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Creativity Index:</span>
                        <span className="font-medium">{result.detailedAnalysis.creativity.toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics */}
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-bold text-gray-900">{result.wordCount}</div>
                    <div className="text-xs text-gray-600">Words Analyzed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-base sm:text-lg font-bold text-gray-900">{result.sentences.length}</div>
                    <div className="text-xs text-gray-600">Sentences</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Results */}
            {bulkResults.length > 0 && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">Bulk Analysis Results</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {bulkResults.map((item, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 text-sm truncate mr-2">{item.fileName}</span>
                        <span className="text-base sm:text-lg font-bold text-blue-600 flex-shrink-0">{item.result.overallScore.toFixed(0)}%</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>AI Generated:</span>
                          <span className="text-red-600">{item.result.aiGenerated.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>AI Refined:</span>
                          <span className="text-yellow-600">{item.result.aiRefined.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Words:</span>
                          <span>{item.result.wordCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Advanced Detection</h3>
            <p className="text-xs sm:text-sm text-gray-600">Semantic analysis identifies AI patterns and predictability in writing</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bulk Processing</h3>
            <p className="text-xs sm:text-sm text-gray-600">Upload multiple documents for comprehensive analysis reports</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Privacy Protected</h3>
            <p className="text-xs sm:text-sm text-gray-600">No content stored on servers for complete privacy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectorPage;
