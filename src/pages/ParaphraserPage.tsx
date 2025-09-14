import React, { useState } from 'react';
import { FileText, Zap, Copy, Download, Upload, Trash2, Settings, List, Type, Wand2 } from 'lucide-react';

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('standard');
  const [synonymLevel, setSynonymLevel] = useState(2);

  const freeModes = [
    { id: 'standard', name: 'Standard', description: 'Balanced rephrasing with clarity' },
    { id: 'fluency', name: 'Fluency', description: 'Improves grammar and readability' },
  ];

  const premiumModes = [
    { id: 'formal', name: 'Formal', description: 'Polished and professional tone' },
    { id: 'simple', name: 'Simple', description: 'Easier-to-read version' },
    { id: 'creative', name: 'Creative', description: 'More expressive alternatives' },
    { id: 'expand', name: 'Expand', description: 'Adds length and detail' },
    { id: 'shorten', name: 'Shorten', description: 'Concise version of text' },
    { id: 'custom', name: 'Custom', description: 'User-controlled settings' },
  ];

  const handleParaphrase = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      const words = inputText.split(/\s+/);
      const paraphrased = words
        .map((word, idx) =>
          idx % (5 - synonymLevel) === 0 ? word.toUpperCase() : word
        )
        .join(' ');

      setOutputText(paraphrased);
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
    a.download = 'paraphrase.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paraphraser</h1>
                <p className="text-sm text-gray-600">
                  Rephrases text to improve clarity, tone, and originality while
                  preserving meaning. Supports 25+ languages for sentences,
                  paragraphs, or full documents.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Modes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {[...freeModes, ...premiumModes].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-lg border transition-colors text-left ${
                  mode === m.id
                    ? 'bg-blue-100 border-blue-400 text-blue-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-gray-500">{m.description}</div>
                {premiumModes.some((pm) => pm.id === m.id) && (
                  <span className="inline-block mt-1 text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Synonym Slider */}
          <div>
            <span className="text-sm font-medium text-gray-900">
              Synonym Slider:
            </span>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500">Accurate</span>
              <input
                type="range"
                min="1"
                max="4"
                value={synonymLevel}
                onChange={(e) => setSynonymLevel(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <span className="text-xs text-gray-500">Creative</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here..."
                className="w-full h-80 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {inputText.trim().split(/\s+/).filter(Boolean).length}
                  </span>{' '}
                  words
                </div>
                <button
                  onClick={handleParaphrase}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Paraphrasing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Paraphrase
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="h-80 p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
                {outputText ? (
                  <div className="text-gray-900 leading-relaxed whitespace-pre-line text-sm">
                    {outputText}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-sm">Paraphrased text will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {outputText && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    {freeModes.length} free modes, {premiumModes.length} premium modes • Synonym Slider enabled • 25+ languages
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download as file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
            <li>✅ Multiple Modes – 2 free, 7 premium</li>
            <li>✅ Synonym Slider – adjust from accurate to creative</li>
            <li>✅ Clickable Synonyms – word-level replacement</li>
            <li>✅ Language Support – 25+ options incl. US/UK English</li>
            <li>✅ Tool Integration – works with Grammar Checker, Summarizer, etc.</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ParaphraserPage;
