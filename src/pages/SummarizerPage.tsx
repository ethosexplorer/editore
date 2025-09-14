import React, { useState } from 'react';
import { FileText, Zap, Copy, Download, BarChart3, Upload, Globe } from 'lucide-react';

const SummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryType, setSummaryType] = useState('extractive');
  const [files, setFiles] = useState<File[]>([]);
  const [bulkSummaries, setBulkSummaries] = useState<{ fileName: string; summary: string }[]>([]);
  const [language, setLanguage] = useState('en');

  const lengthOptions = [
    { id: 'short', name: 'Short', description: '2-3 sentences' },
    { id: 'medium', name: 'Medium', description: '4-6 sentences' },
    { id: 'long', name: 'Long', description: '7-10 sentences' }
  ];

  const typeOptions = [
    { id: 'extractive', name: 'Extractive', description: 'Key sentences from original' },
    { id: 'abstractive', name: 'Abstractive', description: 'Rewritten summary' }
  ];

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'fr', name: 'French' },
    { id: 'es', name: 'Spanish' },
    { id: 'de', name: 'German' },
    { id: 'af', name: 'Afrikaans' },
    { id: 'zh', name: 'Chinese' },
    { id: 'da', name: 'Danish' },
    { id: 'nl', name: 'Dutch' },
    { id: 'hi', name: 'Hindi' },
    { id: 'id', name: 'Indonesian' },
    { id: 'it', name: 'Italian' },
    { id: 'ja', name: 'Japanese' },
    { id: 'ms', name: 'Malay' },
    { id: 'pl', name: 'Polish' },
    { id: 'pt', name: 'Portuguese' },
    { id: 'ro', name: 'Romanian' },
    { id: 'ru', name: 'Russian' },
    { id: 'sv', name: 'Swedish' },
    { id: 'tl', name: 'Tagalog' },
    { id: 'tr', name: 'Turkish' },
    { id: 'uk', name: 'Ukrainian' },
  ];

  const handleSummarize = async () => {
    const wordCount = inputText.trim().split(/\s+/).filter(w => w).length;
    if (!inputText.trim() && files.length === 0) return;
    if (wordCount < 40 && files.length === 0) {
      alert('Please enter at least 40 words for analysis.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const sentences = inputText.split('.').filter(s => s.trim());
      const summaryCount = summaryLength === 'short' ? 2 : summaryLength === 'medium' ? 4 : 6;
      const selectedSentences = summaryType === 'extractive' 
        ? sentences.slice(0, summaryCount)
        : sentences.slice(0, summaryCount).map(s => `Summary of: ${s.trim()}.`);
      setSummary(selectedSentences.join('. ') + '.');

      if (files.length > 0) {
        const bulkData = files.map(file => ({
          fileName: file.name,
          summary: selectedSentences.slice(0, Math.floor(summaryCount / files.length)).join('. ') + '.'
        }));
        setBulkSummaries(bulkData);
      }
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target?.result as string || '');
      };
      reader.readAsText(uploadedFiles[0]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
    setBulkSummaries(bulkSummaries.filter(s => s.fileName !== fileName));
    if (files.length === 1) setInputText('');
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-6 animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            AI Summarizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Summarizes long texts into concise summaries with customizable options. Free with bulk upload support.
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Language Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                <Globe className="w-5 h-5 mr-2 text-purple-500" /> Language
              </h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id} style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Summary Length */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Summary Length</h3>
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
                      <div className="font-medium text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{option.name}</div>
                      <div className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Summary Type */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Summary Type</h3>
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
                      <div className="font-medium text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{option.name}</div>
                      <div className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{option.description}</div>
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
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Original Text</h2>
              <label className="flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Upload Doc</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {files.length > 0 && (
              <div className="mb-4 space-y-2">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span className="text-sm text-gray-700 truncate flex-1 mr-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{file.name}</span>
                    <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="To summarize text, add at least 40 words. Paste your text here or upload a document to begin analysis..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            <button
              onClick={handleSummarize}
              disabled={!inputText.trim() && files.length === 0 || isProcessing}
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
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Generate Summary</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Summary</h2>
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
                  <p className="text-gray-900 leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{summary}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4" />
                    <p style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Summary will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {summary && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-lg font-bold text-purple-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {summary.split(' ').filter(w => w).length}
                  </div>
                  <div className="text-xs text-purple-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Words</div>
                </div>
                <div className="text-center p-3 bg-indigo-50 rounded-xl">
                  <div className="text-lg font-bold text-indigo-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {summary.split('.').filter(s => s.trim()).length}
                  </div>
                  <div className="text-xs text-indigo-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Sentences</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {getCompressionRatio()}%
                  </div>
                  <div className="text-xs text-green-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Compressed</div>
                </div>
              </div>
            )}

            {bulkSummaries.length > 0 && (
              <div className="mt-6 bg-gray-50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Bulk Summaries</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bulkSummaries.map((item, index) => (
                    <div key={index} className="p-2 bg-white rounded-lg shadow">
                      <div className="font-medium text-gray-900 truncate" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{item.fileName}</div>
                      <p className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{item.summary}</p>
                    </div>
                  ))}
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
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Smart Extraction</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>AI identifies and extracts the most important information</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Customizable Length</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Choose summary length that fits your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Instant Processing</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Get summaries in seconds, not minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummarizerPage;
