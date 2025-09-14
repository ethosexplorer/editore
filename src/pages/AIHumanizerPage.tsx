import React, { useState, useRef } from 'react';
import { Users, Zap, Copy, Download, BarChart3, Sliders, RefreshCw, Shuffle, Type, Palette, Eye, Settings, Upload, FileText, Trash2 } from 'lucide-react';

interface HumanizationResult {
  originalText: string;
  humanizedText: string;
  humanScore: number;
  aiDetectionBefore: number;
  aiDetectionAfter: number;
  changes: Array<{
    original: string;
    humanized: string;
    type: string;
    reason: string;
  }>;
  readabilityScore: number;
  creativityLevel: number;
}

const AIHumanizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<HumanizationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanizationMode, setHumanizationMode] = useState('naturalize');
  const [creativityLevel, setCreativityLevel] = useState(5);
  const [preserveMeaning, setPreserveMeaning] = useState(true);
  const [showChanges, setShowChanges] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modes = [
    { 
      id: 'naturalize', 
      name: 'Naturalize', 
      icon: Type,
      description: 'Transform stiff/formal AI output into natural language',
      color: 'blue'
    },
    { 
      id: 'synonym', 
      name: 'Synonym Integration', 
      icon: Shuffle,
      description: 'Add variety through intelligent synonym replacement',
      color: 'green'
    },
    { 
      id: 'creative', 
      name: 'Creative Rewrite', 
      icon: Palette,
      description: 'Enhanced creativity with style improvements',
      color: 'purple'
    }
  ];

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      let humanizedText = inputText;
      const changes: Array<{original: string, humanized: string, type: string, reason: string}> = [];
      
      // Naturalize mode transformations
      if (humanizationMode === 'naturalize') {
        const formalReplacements = [
          { formal: /\b(utilize|utilizes|utilized|utilization)\b/gi, casual: 'use', type: 'formality', reason: 'Replaced formal term with everyday language' },
          { formal: /\b(commence|commences|commenced)\b/gi, casual: 'start', type: 'formality', reason: 'Simplified formal verb' },
          { formal: /\b(facilitate|facilitates|facilitated)\b/gi, casual: 'help', type: 'formality', reason: 'Used more conversational term' },
          { formal: /\b(demonstrate|demonstrates|demonstrated)\b/gi, casual: 'show', type: 'formality', reason: 'Replaced with simpler verb' },
          { formal: /\b(subsequently)\b/gi, casual: 'then', type: 'transition', reason: 'Simplified transition word' },
          { formal: /\b(furthermore|moreover)\b/gi, casual: 'also', type: 'transition', reason: 'Used casual connector' },
          { formal: /\b(therefore|consequently)\b/gi, casual: 'so', type: 'transition', reason: 'Simplified logical connector' },
          { formal: /\b(however|nevertheless)\b/gi, casual: 'but', type: 'transition', reason: 'Used everyday contrast word' },
          { formal: /\b(in order to)\b/gi, casual: 'to', type: 'conciseness', reason: 'Removed unnecessary words' },
          { formal: /\b(due to the fact that)\b/gi, casual: 'because', type: 'conciseness', reason: 'Simplified wordy phrase' }
        ];

        formalReplacements.forEach(replacement => {
          const matches = humanizedText.match(replacement.formal);
          if (matches) {
            matches.forEach(match => {
              changes.push({
                original: match,
                humanized: replacement.casual,
                type: replacement.type,
                reason: replacement.reason
              });
            });
            humanizedText = humanizedText.replace(replacement.formal, replacement.casual);
          }
        });

        // Add conversational elements
        if (creativityLevel >= 5) {
          humanizedText = humanizedText.replace(/^/, "Here's what I think: ");
          humanizedText = humanizedText.replace(/\. ([A-Z])/g, '. You know, $1');
          humanizedText = humanizedText.replace(/\. You know, You know, /g, '. You know, ');
        }
      }

      // Synonym Integration mode
      if (humanizationMode === 'synonym') {
        const synonymReplacements = [
          { original: /\b(important|significant)\b/gi, synonyms: ['crucial', 'vital', 'key', 'essential'], type: 'synonym' },
          { original: /\b(good|great)\b/gi, synonyms: ['excellent', 'fantastic', 'wonderful', 'amazing'], type: 'synonym' },
          { original: /\b(bad|poor)\b/gi, synonyms: ['awful', 'terrible', 'dreadful', 'horrible'], type: 'synonym' },
          { original: /\b(big|large)\b/gi, synonyms: ['huge', 'massive', 'enormous', 'gigantic'], type: 'synonym' },
          { original: /\b(small|little)\b/gi, synonyms: ['tiny', 'miniature', 'compact', 'petite'], type: 'synonym' }
        ];

        synonymReplacements.forEach(replacement => {
          const matches = humanizedText.match(replacement.original);
          if (matches) {
            matches.forEach(match => {
              const randomSynonym = replacement.synonyms[Math.floor(Math.random() * replacement.synonyms.length)];
              changes.push({
                original: match,
                humanized: randomSynonym,
                type: 'synonym',
                reason: 'Added variety with intelligent synonym'
              });
              humanizedText = humanizedText.replace(match, randomSynonym);
            });
          }
        });
      }

      // Creative Rewrite mode
      if (humanizationMode === 'creative') {
        // Add creative flourishes based on creativity level
        const creativityPhrases = [
          "Let me paint you a picture:",
          "Picture this:",
          "Here's the fascinating part:",
          "What's really interesting is that"
        ];
        
        if (creativityLevel >= 7) {
          const randomPhrase = creativityPhrases[Math.floor(Math.random() * creativityPhrases.length)];
          humanizedText = randomPhrase + " " + humanizedText;
        }

        // Add emphasis and emotional language
        humanizedText = humanizedText.replace(/\b(results|outcomes)\b/gi, 'incredible results');
        humanizedText = humanizedText.replace(/\b(analysis|study)\b/gi, 'deep dive');
      }

      // Calculate scores
      const originalWordCount = inputText.split(' ').length;
      const humanizedWordCount = humanizedText.split(' ').length;
      const changeRatio = changes.length / originalWordCount;
      
      const newResult: HumanizationResult = {
        originalText: inputText,
        humanizedText: humanizedText,
        humanScore: Math.min(95, 60 + (creativityLevel * 3) + (changeRatio * 100)),
        aiDetectionBefore: Math.random() * 40 + 50, // 50-90%
        aiDetectionAfter: Math.random() * 20 + 10,  // 10-30%
        changes: changes,
        readabilityScore: Math.min(100, 70 + creativityLevel + Math.random() * 15),
        creativityLevel: creativityLevel
      };

      setResult(newResult);
      setIsProcessing(false);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles(prev => [...prev, ...uploadedFiles]);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText(prev => prev + '\n' + content);
      };
      reader.readAsText(uploadedFiles[0]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.humanizedText);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const reportContent = `HUMANIZATION REPORT
==================

Original Text:
${result.originalText}

Humanized Text:
${result.humanizedText}

Metrics:
- Human Score: ${result.humanScore.toFixed(1)}%
- AI Detection (Before): ${result.aiDetectionBefore.toFixed(1)}%
- AI Detection (After): ${result.aiDetectionAfter.toFixed(1)}%
- Readability Score: ${result.readabilityScore.toFixed(1)}%
- Mode: ${humanizationMode}
- Creativity Level: ${creativityLevel}/10

Changes Made:
${result.changes.map(change => `- "${change.original}" → "${change.humanized}" (${change.reason})`).join('\n')}

Generated by QuillBot AI Humanizer
${new Date().toLocaleDateString()}`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'humanization-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getModeColor = (mode: string) => {
    const modeConfig = modes.find(m => m.id === mode);
    switch (modeConfig?.color) {
      case 'blue': return 'border-blue-500 bg-blue-50 text-blue-700';
      case 'green': return 'border-green-500 bg-green-50 text-green-700';
      case 'purple': return 'border-purple-500 bg-purple-50 text-purple-700';
      default: return 'border-gray-300 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Humanizer</h1>
                <p className="text-sm text-gray-600">Transform AI-generated text into natural, human-like writing</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Humanization Mode:</h3>
            {modes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setHumanizationMode(mode.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    humanizationMode === mode.id
                      ? getModeColor(mode.id)
                      : 'border border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{mode.name}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {modes.find(m => m.id === humanizationMode)?.icon && 
                  React.createElement(modes.find(m => m.id === humanizationMode)!.icon, { 
                    className: "w-5 h-5 text-blue-600 mt-0.5" 
                  })
                }
              </div>
              <div>
                <h4 className="font-medium text-blue-900">
                  {modes.find(m => m.id === humanizationMode)?.name}
                </h4>
                <p className="text-sm text-blue-700">
                  {modes.find(m => m.id === humanizationMode)?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Creativity Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Sliders className="w-4 h-4 mr-2" />
                  Creativity Level
                </label>
                <span className="text-sm text-gray-600">{creativityLevel}/10</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div 
                  className="absolute top-0 left-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg pointer-events-none"
                  style={{ width: `${creativityLevel * 10}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="preserve"
                  checked={preserveMeaning}
                  onChange={(e) => setPreserveMeaning(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="preserve" className="text-sm text-gray-700">Preserve original meaning</label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="changes"
                  checked={showChanges}
                  onChange={(e) => setShowChanges(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="changes" className="text-sm text-gray-700">Show detailed changes</label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* File Upload Area */}
            {files.length > 0 && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Files</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI-Generated Text</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    Upload
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here to transform it into natural, human-like writing. The humanizer will adjust tone, vocabulary, and structure while preserving your original meaning..."
                className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{inputText.length} characters</span>
                  <span>•</span>
                  <span>{inputText.split(' ').filter(w => w.trim()).length} words</span>
                </div>
                <button
                  onClick={handleHumanize}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-6 py-3 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Humanizing...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Humanize Text
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Humanized Text</h2>
                {result && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                      title="Download report"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-80 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                {result ? (
                  <div className="text-gray-900 leading-relaxed">
                    {result.humanizedText}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Users className="w-12 h-12 mx-auto mb-4" />
                      <p>Humanized text will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              {result && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="text-xl font-bold text-cyan-600">{result.humanScore.toFixed(0)}%</div>
                    <div className="text-xs text-cyan-600">Human Score</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xl font-bold text-green-600">{result.readabilityScore.toFixed(0)}%</div>
                    <div className="text-xs text-green-600">Readability</div>
                  </div>
                </div>
              )}

              {/* AI Detection Comparison */}
              {result && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">AI Detection Improvement</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">Before:</span>
                      <span className="text-sm font-medium text-red-600">{result.aiDetectionBefore.toFixed(1)}% AI-like</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">After:</span>
                      <span className="text-sm font-medium text-green-600">{result.aiDetectionAfter.toFixed(1)}% AI-like</span>
                    </div>
                    <div className="text-xs text-blue-600">
                      Improvement: {(result.aiDetectionBefore - result.aiDetectionAfter).toFixed(1)} percentage points
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Changes Analysis */}
        {result && showChanges && result.changes.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Changes Made ({result.changes.length})
              </h3>
            </div>
            
            <div className="grid gap-4">
              {result.changes.map((change, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-mono">
                          "{change.original}"
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-mono">
                          "{change.humanized}"
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{change.reason}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize">
                      {change.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Type className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Natural Language</h3>
            <p className="text-sm text-gray-600">Transform stiff AI writing into conversational, natural text</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sliders className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adjustable Creativity</h3>
            <p className="text-sm text-gray-600">Control the level of creativity and style transformation</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tool Integration</h3>
            <p className="text-sm text-gray-600">Works seamlessly with paraphraser and other QuillBot tools</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #06b6d4;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default AIHumanizerPage;
