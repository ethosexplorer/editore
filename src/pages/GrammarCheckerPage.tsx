import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Copy, Download, Settings, Zap, Globe, Upload, FileText, Info } from 'lucide-react';

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

  // Animated background gradient
  useEffect(() => {
    const interval = setInterval(() => {
      document.body.style.background = `linear-gradient(45deg, ${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 animate-gradient-shift">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-teal-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse-slow delay-1000"></div>

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full shadow-lg mb-6 animate-bounce-slow">
            <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Creative Paraphraser
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Unleash your words with flair in 20+ languages—customize, create, and shine!
          </p>
          <button
            onClick={togglePremium}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-md hover:shadow-xl hover:scale-110 transition-all duration-500 transform-gpu"
          >
            {isPremium ? 'Switch to Free' : 'Unlock Premium'}
          </button>
          <p className="mt-2 text-sm text-gray-600">Access exclusive modes with Premium!</p>
        </div>

        {/* Settings Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 sm:mb-12 border border-gray-200 shadow-lg rotate-1 hover:rotate-0 transition-all duration-500">
          <div className="flex items-center mb-4 sm:mb-6">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 mr-2 sm:mr-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Paraphrase Controls
            </h3>
          </div>
          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Pick Your Style
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3 sm:gap-4">
                {allModes.map((modeOption) => (
                  <button
                    key={modeOption.id}
                    onClick={() => setMode(modeOption.id)}
                    disabled={modeOption.premium && !isPremium}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-500 hover:shadow-xl ${
                      mode === modeOption.id
                        ? 'border-teal-600 bg-teal-50'
                        : modeOption.premium && !isPremium
                        ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'border-gray-200 hover:border-teal-400'
                    } hover:scale-105`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                      {modeOption.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">{modeOption.description}</div>
                    {modeOption.premium && !isPremium && (
                      <div className="text-xs sm:text-sm text-pink-600 mt-1">Premium</div>
                    )}
                  </button>
                ))}
              </div>
              {!isPremium && (
                <p className="text-xs sm:text-sm text-gray-600 mt-3">Go Premium for all styles!</p>
              )}
            </div>
            {/* Synonym Slider */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Creativity Dial
              </h4>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-700 mt-2">
                {creativityLevel < 30 ? 'Subtle' : creativityLevel > 70 ? 'Wild' : 'Balanced'}
              </div>
            </div>
            {/* Language Selection */}
            <div>
              <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Language Globe
              </h4>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-teal-50 transition-all duration-500">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600 animate-spin-slow" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 p-2 sm:p-3 bg-transparent border-0 focus:ring-2 focus:ring-teal-500 outline-none text-gray-900"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-white">{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 relative z-10">
          {/* Input Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 skew-x-2 hover:skew-x-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Your Canvas
              </h2>
              <span className="text-sm sm:text-base text-gray-600">
                {inputText.length} chars
              </span>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleTrySample}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-300 to-purple-300 text-white rounded-full hover:bg-blue-400 transition-all duration-500 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Spark Sample</span>
                </button>
                <button
                  onClick={handlePasteText}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-300 to-teal-300 text-white rounded-full hover:bg-green-400 transition-all duration-500 flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Paste Magic</span>
                </button>
              </div>
              <label className="block w-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 rounded-full hover:from-gray-300 hover:to-gray-400 transition-all duration-500 cursor-pointer flex items-center justify-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadDoc}
                  accept=".txt,.doc,.docx,.pdf"
                  className="hidden"
                />
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Upload Adventure</span>
              </label>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or drop your text here to begin the magic..."
              className="w-full h-60 sm:h-80 p-5 sm:p-6 bg-gray-50/80 border-2 border-teal-200 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-teal-400 text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={handleParaphrase}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 flex items-center justify-center space-x-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Weaving Magic...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Paraphrase Now!</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 -skew-x-2 hover:skew-x-0">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Transformed Text
              </h2>
              {outputText && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopyAll}
                    className="p-2 sm:p-3 bg-gray-50 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-all duration-500"
                    title="Copy All"
                  >
                    <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 sm:p-3 bg-gray-50 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-all duration-500"
                    title="Download"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="h-60 sm:h-80 p-5 sm:p-6 bg-gray-50/80 border-2 border-teal-200 rounded-xl overflow-y-auto"
            >
              {outputText ? (
                <div className="relative">
                  <p className="text-gray-900 leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                    {outputText.split(' ').map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-teal-100 rounded-full px-2 py-1 transition-all duration-500 hover:scale-110"
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  {selectedWord && synonyms.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-md p-3 sm:p-4 mt-2 left-0 animate-slide-up">
                      <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                        Synonym Sparks for "{selectedWord}"
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {synonyms.map((synonym, idx) => (
                          <button
                            key={idx}
                            onClick={() => replaceWord(synonym)}
                            className="px-2 sm:px-3 py-1 sm:py-2 bg-purple-100 hover:bg-purple-200 rounded-full text-sm sm:text-base transition-all duration-500 hover:scale-110"
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
                    <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 animate-spin-slow" />
                    <p className="text-lg sm:text-xl" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                      Await your creative rewrite!
                    </p>
                  </div>
                </div>
              )}
            </div>
            {outputText && (
              <div className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">
                {outputText.length} chars • Mode: {allModes.find(m => m.id === mode)?.name} • Language: {languages.find(l => l.id === language)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 relative z-10">
          {[
            { icon: RefreshCw, title: '10+ Styles', desc: 'Endless mode options' },
            { icon: Zap, title: 'Creativity Boost', desc: 'Tune your flair' },
            { icon: Globe, title: 'Global Reach', desc: '20+ languages' },
            { icon: Copy, title: 'Word Magic', desc: 'Instant synonyms' },
            { icon: Upload, title: 'File Fun', desc: 'Upload your docs' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="text-center p-4 sm:p-6 bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-gray-200 hover:bg-gradient-to-br from-teal-100 to-blue-100 hover:shadow-lg transition-all duration-500 rotate-2 hover:rotate-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-float">
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                {title}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
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
