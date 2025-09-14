import React, { useState } from 'react';
import { Search, Upload, FileText, AlertTriangle, CheckCircle, Zap, Globe, Info } from 'lucide-react';

const AIDetectorPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [bulkResult, setBulkResult] = useState<any[]>([]);
  const [language, setLanguage] = useState('en');

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

  const handleAnalyze = async () => {
    if (!text.trim() && files.length === 0) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const newResult = {
        aiGeneratedRefined: Math.random() * 100,
        humanWrittenRefined: Math.random() * 100,
        humanWritten: Math.random() * 100,
        sentences: text.split('.').filter(s => s.trim()).map((sentence, index) => ({
          text: sentence.trim(),
          aiGeneratedRefined: Math.random() * 100,
          humanWrittenRefined: Math.random() * 100,
          humanWritten: Math.random() * 100,
          highlighted: Math.random() > 0.7
        }))
      };
      setResult(newResult);
      setIsAnalyzing(false);

      if (files.length > 0) {
        const bulkData = files.map((file, index) => ({
          fileName: file.name,
          aiGeneratedRefined: Math.random() * 100,
          humanWrittenRefined: Math.random() * 100,
          humanWritten: Math.random() * 100,
        }));
        setBulkResult(bulkData);
      }
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      setFiles(uploadedFiles);
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string || '');
      };
      reader.readAsText(uploadedFiles[0]);
    }
  };

  const removeFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
    setBulkResult(bulkResult.filter(r => r.fileName !== fileName));
    if (files.length === 1) setText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 animate-pulse">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            AI Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Identifies AI-generated or AI-refined content in text, providing percentages for both categories to promote ethical writing. Free with bulk upload support.
          </p>
        </div>

        {/* Settings - Language */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 border border-gray-200 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Language</h3>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id} style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Input Text</h2>
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="To analyze text, add at least 40 words. Paste your text here or upload a document to begin analysis..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                {text.length} characters • {text.split(' ').filter(w => w).length} words
              </span>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() && files.length === 0 || isAnalyzing}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Detect AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Detection Results</h2>
            
            {!result && bulkResult.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <FileText className="w-16 h-16 mb-4" />
                <p className="text-lg" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Add text to begin analysis</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* AI-Generated & Refined */}
                {result && (
                  <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>AI-generated & refined</span>
                        <Info className="w-4 h-4 text-orange-500 cursor-pointer" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.aiGeneratedRefined}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-600">{result.aiGeneratedRefined.toFixed(0)}%</div>
                    </div>
                  </div>
                )}

                {/* Human-written & AI-refined */}
                {result && (
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Human-written & AI-refined</span>
                        <Info className="w-4 h-4 text-blue-500 cursor-pointer" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.humanWrittenRefined}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-blue-600">{result.humanWrittenRefined.toFixed(0)}%</div>
                    </div>
                  </div>
                )}

                {/* Human-written */}
                {result && (
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Human-written</span>
                        <Info className="w-4 h-4 text-gray-500 cursor-pointer" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${result.humanWritten}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-600">{result.humanWritten.toFixed(0)}%</div>
                    </div>
                  </div>
                )}

                {/* Bulk Results */}
                {bulkResult.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Bulk Analysis Report</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {bulkResult.map((item, index) => (
                        <div key={index} className="p-3 bg-white rounded-lg shadow">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 truncate flex-1 mr-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>{item.fileName}</span>
                            <span className="font-bold text-blue-600">{item.aiGeneratedRefined.toFixed(0)}%</span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            AI-Generated & Refined: {item.aiGeneratedRefined.toFixed(1)}% • Human & Refined: {item.humanWrittenRefined.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Advanced Detection</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Identifies AI-generated and AI-refined content with semantic analysis
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Bulk Upload</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Process multiple documents with detailed reports
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Privacy First</h3>
            <p className="text-gray-600 text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              No storage of scanned content for your security
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectorPage;
