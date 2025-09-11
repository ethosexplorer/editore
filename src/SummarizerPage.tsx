import React, { useState } from 'react';
import { FileText, Zap, Copy, Download, BarChart3 } from 'lucide-react';

const SummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryType, setSummaryType] = useState('extractive');

  const lengthOptions = [
    { id: 'short', name: 'Short', description: '2-3 sentences' },
    { id: 'medium', name: 'Medium', description: '4-6 sentences' },
    { id: 'long', name: 'Long', description: '7-10 sentences' }
  ];

  const typeOptions = [
    { id: 'extractive', name: 'Extractive', description: 'Key sentences from original' },
    { id: 'abstractive', name: 'Abstractive', description: 'Rewritten summary' }
  ];

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      const sentences = inputText.split('.').filter(s => s.trim());
      const summaryCount = summaryLength === 'short' ? 2 : summaryLength === 'medium' ? 4 : 6;
      const selectedSentences = sentences.slice(0, summaryCount);
      setSummary(selectedSentences.join('. ') + '.');
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    a.click();
  };

  const getCompressionRatio = () => {
    if (!inputText || !summary) return 0;
    return Math.round((1 - summary.length / inputText.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Summarizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extract key points and create concise summaries from long texts. 
            Perfect for research, articles, and documents.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Summary Length */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Length</h3>
              <div className="space-y-3">
                {lengthOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="length"
                      value={option.id}
                      checked={summaryLength === option.id}
                      onChange={(e) => setSummaryLength(e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Type</h3>
              <div className="space-y-3">
                {typeOptions.map((option) => (
                  <label key={option.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={option.id}
                      checked={summaryType === option.id}
                      onChange={(e) => setSummaryType(e.target.value)}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Original Text</h2>
              <span className="text-sm text-gray-500">
                {inputText.length} characters • {inputText.split(' ').filter(w => w).length} words
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long text here to generate a concise summary..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Summarizing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Summary
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
              {summary && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Download as file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-80 p-4 border border-gray-200 rounded-2xl bg-gray-50">
              {summary ? (
                <div className="h-full overflow-y-auto">
                  <p className="text-gray-900 leading-relaxed">{summary}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p>Summary will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {summary && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-lg font-bold text-purple-600">
                    {summary.split(' ').filter(w => w).length}
                  </div>
                  <div className="text-xs text-purple-600">Words</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <div className="text-lg font-bold text-indigo-600">
                    {summary.split('.').filter(s => s.trim()).length}
                  </div>
                  <div className="text-xs text-indigo-600">Sentences</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">
                    {getCompressionRatio()}%
                  </div>
                  <div className="text-xs text-green-600">Compressed</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Extraction</h3>
            <p className="text-gray-600 text-sm">AI identifies and extracts the most important information</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customizable Length</h3>
            <p className="text-gray-600 text-sm">Choose summary length that fits your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Processing</h3>
            <p className="text-gray-600 text-sm">Get summaries in seconds, not minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizerPage;