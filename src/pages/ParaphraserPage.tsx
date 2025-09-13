import React, { useState, useRef } from 'react';
import { RefreshCw, Copy, Download, Settings, Zap, Globe } from 'lucide-react';

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('standard');
  const [creativityLevel, setCreativityLevel] = useState(50); // Synonym Slider (0-100)
  const [language, setLanguage] = useState('en-US'); // Language selection
  const [selectedWord, setSelectedWord] = useState<string | null>(null); // For clickable synonyms
  const [synonyms, setSynonyms] = useState<string[]>([]); // Synonym suggestions
  const outputRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: 'standard', name: 'Standard', description: 'Balanced rewriting' },
    { id: 'fluency', name: 'Fluency', description: 'Improves readability' },
    { id: 'formal', name: 'Formal', description: 'Professional tone' },
    { id: 'simple', name: 'Simple', description: 'Simplifies language' },
    { id: 'creative', name: 'Creative', description: 'Unique variations' },
    { id: 'expand', name: 'Expand', description: 'Lengthens text' },
    { id: 'shorten', name: 'Shorten', description: 'Condenses text' },
    { id: 'custom', name: 'Custom', description: 'User-defined style' },
  ];

  const languages = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-GB', name: 'English (UK)' },
    { id: 'es', name: 'Spanish' },
    { id: 'fr', name: 'French' },
    { id: 'zh', name: 'Chinese' },
    // Add more languages as needed (QuillBot supports 25+)
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    // Simulate API call with mode and creativity level
    setTimeout(() => {
      let paraphrased = inputText;
      if (mode === 'standard') {
        paraphrased = inputText
          .replace(/\b(the|a|an)\b/gi, (match) => {
            const alternatives = ['the', 'a', 'an'];
            return alternatives[Math.floor(Math.random() * alternatives.length)];
          })
          .replace(/\b(and|but|or)\b/gi, (match) => {
            const alternatives = { 'and': 'as well as', 'but': 'however', 'or': 'alternatively' };
            return alternatives[match.toLowerCase() as keyof typeof alternatives] || match;
          });
      } else if (mode === 'fluency') {
        paraphrased = inputText.replace(/(\w+ly)\s(\w+)/gi, '$2 $1'); // Example fluency tweak
      } else if (mode === 'formal') {
        paraphrased = inputText.replace(/\b(gonna|wanna)\b/gi, 'going to');
      } else if (mode === 'simple') {
        paraphrased = inputText.replace(/\b(complex|complicated)\b/gi, 'simple');
      } else if (mode === 'creative') {
        paraphrased = inputText.replace(/\b(good|great)\b/gi, creativityLevel > 50 ? 'excellent' : 'fine');
      } else if (mode === 'expand') {
        paraphrased = inputText.replace(/\b(\w+)\b/gi, '$1 extensively');
      } else if (mode === 'shorten') {
        paraphrased = inputText.split(' ').slice(0, Math.floor(inputText.split(' ').length * 0.8)).join(' ');
      } else if (mode === 'custom') {
        paraphrased = inputText.replace(/\b(\w+)\b/gi, creativityLevel > 50 ? '$1 creatively' : '$1');
      }

      // Adjust based on language (mock example)
      if (language !== 'en-US') {
        paraphrased = `[Translated to ${language}] ${paraphrased}`;
      }

      setOutputText(paraphrased + ` [Paraphrased using ${mode} mode, creativity: ${creativityLevel}%]`);
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
    URL.revokeObjectURL(url);
  };

  const handleWordClick = (word: string) => {
    // Mock synonym suggestions
    const mockSynonyms = {
      good: ['great', 'excellent', 'fine', 'superb'],
      big: ['large', 'huge', 'enormous', 'massive'],
    };
    setSelectedWord(word);
    setSynonyms(mockSynonyms[word.toLowerCase() as keyof typeof mockSynonyms] || ['similar', 'alike']);
  };

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      const newText = outputText.replace(selectedWord, synonym);
      setOutputText(newText);
      setSelectedWord(null);
      setSynonyms([]);
    }
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
            Rewrite content in over 25 languages with customizable modes, tones, and creativity levels.
          </p>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Paraphrasing Options</h3>
          </div>
          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Mode</h4>
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
            {/* Synonym Slider */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Creativity Level</h4>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-500 mt-2">
                Creativity: {creativityLevel}% {creativityLevel < 30 ? '(Accurate)' : creativityLevel > 70 ? '(Highly Creative)' : '(Balanced)'}
              </div>
            </div>
            {/* Language Selection */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Language</h4>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-gray-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
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
            <div
              ref={outputRef}
              className="h-80 p-4 border border-gray-200 rounded-2xl bg-gray-50 overflow-y-auto"
            >
              {outputText ? (
                <div className="relative">
                  <p className="text-gray-900 leading-relaxed">
                    {outputText.split(' ').map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-teal-100 rounded px-1"
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  {selectedWord && synonyms.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Synonyms for "{selectedWord}"</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {synonyms.map((synonym, idx) => (
                          <button
                            key={idx}
                            onClick={() => replaceWord(synonym)}
                            className="px-2 py-1 bg-teal-50 hover:bg-teal-100 rounded text-sm"
                          >
                            {synonym}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
                {outputText.length} characters • Mode: {modes.find(m => m.id === mode)?.name} • Language: {languages.find(l => l.id === language)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Modes</h3>
            <p className="text-gray-600 text-sm">Choose from 8 modes, including Custom, to match your style</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Synonym Slider</h3>
            <p className="text-gray-600 text-sm">Adjust creativity for precise or unique paraphrasing</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multilingual</h3>
            <p className="text-gray-600 text-sm">Supports over 25 languages for global use</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Clickable Synonyms</h3>
            <p className="text-gray-600 text-sm">Fine-tune output with word-level synonym suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;
