import React, { useState, useRef } from 'react';
import { RefreshCw, Copy, Download, Settings, Zap, Globe, Upload, FileText } from 'lucide-react';

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('standard');
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [language, setLanguage] = useState('en-US');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allModes = [
    { id: 'standard', name: 'Standard', description: 'Balanced rewriting', premium: false },
    { id: 'fluency', name: 'Fluency', description: 'Improve readability', premium: false },
    { id: 'formal', name: 'Formal', description: 'Professional tone', premium: true },
    { id: 'academic', name: 'Academic', description: 'Scholarly tone', premium: true },
    { id: 'simple', name: 'Simple', description: 'Simplifies language', premium: true },
    { id: 'creative', name: 'Creative', description: 'Unique variations', premium: true },
    { id: 'expand', name: 'Expand', description: 'Lengthens text', premium: true },
    { id: 'shorten', name: 'Shorten', description: 'Condenses text', premium: true },
    { id: 'humanize', name: 'Humanize', description: 'More natural tone', premium: true },
    { id: 'custom', name: 'Custom', description: 'User-defined style', premium: true },
  ];

  const modes = allModes.filter(m => !m.premium || isPremium);

  const languages = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-GB', name: 'English (UK)' },
    { id: 'en-AU', name: 'English (AU)' },
    { id: 'en-CA', name: 'English (CA)' },
    { id: 'fr', name: 'French' },
    { id: 'es', name: 'Spanish' },
    { id: 'de', name: 'German' },
    { id: 'zh', name: 'Chinese' },
    { id: 'hi', name: 'Hindi' },
    { id: 'ru', name: 'Russian' },
    { id: 'da', name: 'Danish' },
    { id: 'nl', name: 'Dutch' },
    { id: 'it', name: 'Italian' },
    { id: 'ja', name: 'Japanese' },
    { id: 'ko', name: 'Korean' },
    { id: 'ms', name: 'Malay' },
    { id: 'no', name: 'Norwegian' },
    { id: 'pl', name: 'Polish' },
    { id: 'pt-BR', name: 'Portuguese (BR)' },
    { id: 'ro', name: 'Romanian' },
    { id: 'sv', name: 'Swedish' },
    { id: 'tl', name: 'Tagalog' },
    { id: 'tr', name: 'Turkish' },
    { id: 'uk', name: 'Ukrainian' },
    { id: 'vi', name: 'Vietnamese' },
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      let paraphrased = inputText;
      if (mode === 'standard') {
        paraphrased = inputText
          .replace(/\b(the|a|an)\b/gi, (match) => ['the', 'a', 'an'][Math.floor(Math.random() * 3)])
          .replace(/\b(and|but|or)\b/gi, (match) => ({ and: 'as well as', but: 'however', or: 'alternatively' }[match.toLowerCase()] || match));
      } else if (mode === 'fluency') {
        paraphrased = inputText.replace(/(\w+ly)\s(\w+)/gi, '$2 $1');
      } else if (mode === 'formal') {
        paraphrased = inputText.replace(/\b(gonna|wanna)\b/gi, 'going to');
      } else if (mode === 'academic') {
        paraphrased = inputText.replace(/\b(use|utilize)\b/gi, 'employ');
      } else if (mode === 'simple') {
        paraphrased = inputText.replace(/\b(complex|complicated)\b/gi, 'simple');
      } else if (mode === 'creative') {
        paraphrased = inputText.replace(/\b(good|great)\b/gi, creativityLevel > 50 ? 'excellent' : 'fine');
      } else if (mode === 'expand') {
        paraphrased = inputText.replace(/\b(\w+)\b/gi, '$1 extensively');
      } else if (mode === 'shorten') {
        paraphrased = inputText.split(' ').slice(0, Math.floor(inputText.split(' ').length * 0.8)).join(' ');
      } else if (mode === 'humanize') {
        paraphrased = inputText.replace(/\b(however|therefore)\b/gi, 'but');
      } else if (mode === 'custom') {
        paraphrased = inputText.replace(/\b(\w+)\b/gi, creativityLevel > 50 ? '$1 creatively' : '$1');
      }

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
    const mockSynonyms = {
      good: ['great', 'excellent', 'fine', 'superb'],
      big: ['large', 'huge', 'enormous', 'massive'],
      use: ['utilize', 'employ', 'apply', 'deploy'],
    };
    setSelectedWord(word);
    setSynonyms(mockSynonyms[word.toLowerCase() as keyof typeof mockSynonyms] || ['similar', 'alike']);
  };

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      const newText = outputText.replace(new RegExp('\\b' + selectedWord + '\\b', 'gi'), synonym);
      setOutputText(newText);
      setSelectedWord(null);
      setSynonyms([]);
    }
  };

  const handleTrySample = () => {
    setInputText('This is a sample text to demonstrate the paraphrasing capabilities of QuillBot. It helps in rewriting content while preserving the original meaning.');
  };

  const handlePasteText = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleUploadDoc = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.type === 'application/pdf')) {
      const reader = new FileReader();
      reader.onload = (e) => setInputText(e.target?.result as string);
      reader.readAsText(file);
    }
  };

  const handleCopyAll = () => handleCopy();

  const togglePremium = () => setIsPremium(!isPremium);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full shadow-md mb-4 animate-pulse-slow">
            <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            AI Paraphraser
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Easily rephrase text in 20+ languages with simple controls. Start now!
          </p>
          <button
            onClick={togglePremium}
            className="mt-4 px-5 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            {isPremium ? 'Switch to Free' : 'Try Premium'}
          </button>
          <p className="mt-2 text-sm text-gray-600">Unlock more features with Premium!</p>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200 shadow-sm">
          <div className="flex items-center mb-3 sm:mb-4">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Settings
            </h3>
          </div>
          <div className="space-y-4">
            {/* Mode Selection */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Select Mode
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {allModes.map((modeOption) => (
                  <button
                    key={modeOption.id}
                    onClick={() => setMode(modeOption.id)}
                    disabled={modeOption.premium && !isPremium}
                    className={`p-2 sm:p-3 rounded-md border-2 transition-all duration-200 hover:shadow-md ${
                      mode === modeOption.id
                        ? 'border-emerald-600 bg-emerald-50'
                        : modeOption.premium && !isPremium
                        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 hover:border-emerald-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                      {modeOption.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{modeOption.description}</div>
                    {modeOption.premium && !isPremium && (
                      <div className="text-xs sm:text-sm text-sky-600 mt-1">Premium</div>
                    )}
                  </button>
                ))}
              </div>
              {!isPremium && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">Upgrade for all modes!</p>
              )}
            </div>
            {/* Synonym Slider */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Creativity Level
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full h-1.5 bg-gradient-to-r from-emerald-300 to-sky-300 rounded-full appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-700 mt-1">
                {creativityLevel < 30 ? 'Low' : creativityLevel > 70 ? 'High' : 'Medium'}
              </div>
            </div>
            {/* Language Selection */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Language
              </h4>
              <div className="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 p-1 sm:p-2 bg-transparent border-0 focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-white">{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Input Text
              </h2>
              <span className="text-sm text-gray-600">
                {inputText.length} chars
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleTrySample}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-all duration-200 flex items-center justify-center space-x-1"
                >
                  <FileText className="w-4 h-4" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Sample Text</span>
                </button>
                <button
                  onClick={handlePasteText}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-sky-100 text-sky-800 rounded-lg hover:bg-sky-200 transition-all duration-200 flex items-center justify-center space-x-1"
                >
                  <Upload className="w-4 h-4" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Paste Text</span>
                </button>
              </div>
              <label className="block w-full px-3 sm:px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadDoc}
                  accept=".txt,.doc,.docx,.pdf"
                  className="hidden"
                />
                <Upload className="w-4 h-4" />
                <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Upload File</span>
              </label>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to paraphrase..."
              className="w-full h-48 sm:h-64 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleParaphrase}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-3 sm:mt-4 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Processing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Paraphrase</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Paraphrased Text
              </h2>
              {outputText && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyAll}
                    className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200"
                    title="Copy All"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-700 transition-all duration-200"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="h-48 sm:h-64 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto"
            >
              {outputText ? (
                <div className="relative">
                  <p className="text-gray-900 leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {outputText.split(' ').map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-emerald-100 rounded px-1 transition-colors duration-200"
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  {selectedWord && synonyms.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-md p-2 sm:p-3 mt-1 left-0 animate-fade-in">
                      <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                        Synonyms for "{selectedWord}"
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {synonyms.map((synonym, idx) => (
                          <button
                            key={idx}
                            onClick={() => replaceWord(synonym)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 rounded text-sm transition-all duration-200"
                          >
                            {synonym}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 animate-spin-slow" />
                    <p className="text-lg sm:text-xl" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                      Your text will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
            {outputText && (
              <div className="mt-2 sm:mt-3 text-sm text-gray-600">
                {outputText.length} chars • Mode: {allModes.find(m => m.id === mode)?.name} • Language: {languages.find(l => l.id === language)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {[
            { icon: RefreshCw, title: 'Multiple Modes', desc: 'Various styles to choose' },
            { icon: Zap, title: 'Adjust Creativity', desc: 'Control the vibe' },
            { icon: Globe, title: '20+ Languages', desc: 'Worldwide support' },
            { icon: Copy, title: 'Synonym Help', desc: 'Enhance with ease' },
            { icon: Upload, title: 'File Support', desc: 'Upload your docs' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:bg-emerald-50 hover:shadow-md transition-all duration-200">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                {title}
              </h3>
              <p className="text-sm text-gray-700" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;
