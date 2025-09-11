import React, { useState } from 'react';
import { RefreshCw, Copy, Download, Settings, Zap } from 'lucide-react';

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('standard');

  const modes = [
    { id: 'standard', name: 'Standard', description: 'Balanced rewriting' },
    { id: 'fluency', name: 'Fluency', description: 'Improve readability' },
    { id: 'formal', name: 'Formal', description: 'Professional tone' },
    { id: 'creative', name: 'Creative', description: 'Unique variations' }
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const paraphrased = inputText
        .replace(/\b(the|a|an)\b/gi, (match) => {
          const alternatives = ['the', 'a', 'an'];
          return alternatives[Math.floor(Math.random() * alternatives.length)];
        })
        .replace(/\b(and|but|or)\b/gi, (match) => {
          const alternatives = { 'and': 'as well as', 'but': 'however', 'or': 'alternatively' };
          return alternatives[match.toLowerCase() as keyof typeof alternatives] || match;
        });
      
      setOutputText(paraphrased + ' [Paraphrased using ' + mode + ' mode]');
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paraphrased-text.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-6">
            <RefreshCw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Paraphraser
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rewrite your content while maintaining the original meaning. 
            Choose from multiple modes to match your writing style.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Paraphrasing Mode</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {modes.map((modeOption) => (
              <button
                key={modeOption.id}
                onClick={() => setMode(modeOption.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  mode === modeOption.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">{modeOption.name}</div>
                <div className="text-sm text-gray-600">{modeOption.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Original Text</h2>
              <span className="text-sm text-gray-500">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text you want to paraphrase..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />

            <button
              onClick={handleParaphrase}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Paraphrasing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Paraphrase Text
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Paraphrased Text</h2>
              {outputText && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    title="Download as file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-80 p-4 border border-gray-200 rounded-2xl bg-gray-50">
              {outputText ? (
                <div className="h-full overflow-y-auto">
                  <p className="text-gray-900 leading-relaxed">{outputText}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4" />
                    <p>Paraphrased text will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {outputText && (
              <div className="mt-4 text-sm text-gray-500">
                {outputText.length} characters • Mode: {modes.find(m => m.id === mode)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Modes</h3>
            <p className="text-gray-600 text-sm">Choose from different paraphrasing styles to match your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">Get paraphrased content in seconds with AI-powered processing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Export</h3>
            <p className="text-gray-600 text-sm">Copy to clipboard or download your paraphrased text</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;