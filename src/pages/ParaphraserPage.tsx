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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-8 animate-pulse-slow">
            <RefreshCw className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            AI Paraphraser
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>
            Transform your text with elegance in over 20 languages using customizable modes and creative controls. Ad-free and accessible without sign-up.
          </p>
          <button
            onClick={togglePremium}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
          >
            {isPremium ? 'Downgrade to Free' : 'Upgrade to Premium'}
          </button>
        </div>

        {/* Settings Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
          <div className="flex items-center mb-6">
            <Settings className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>Paraphrasing Options</h3>
          </div>
          <div className="space-y-8">
            {/* Mode Selection */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Select Mode</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-4">
                {allModes.map((modeOption) => (
                  <button
                    key={modeOption.id}
                    onClick={() => setMode(modeOption.id)}
                    disabled={modeOption.premium && !isPremium}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-sm hover:shadow-md ${
                      mode === modeOption.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : modeOption.premium && !isPremium
                        ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-200 hover:border-indigo-400'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{modeOption.name}</div>
                    <div className="text-xs text-gray-600">{modeOption.description}</div>
                    {modeOption.premium && !isPremium && (
                      <div className="text-xs text-purple-600 mt-1">Premium</div>
                    )}
                  </button>
                ))}
              </div>
              {!isPremium && (
                <p className="text-xs text-gray-500 mt-4">Unlock all modes with Premium!</p>
              )}
            </div>
            {/* Synonym Slider */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Synonyms Slider</h4>
              <input
                type="range"
                min="0"
                max="100"
                value={creativityLevel}
                onChange={(e) => setCreativityLevel(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-sm text-gray-600 mt-2">
                {creativityLevel < 30 ? 'Accurate' : creativityLevel > 70 ? 'Creative' : 'Balanced'}
              </div>
            </div>
            {/* Language Selection */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Language</h4>
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <Globe className="w-6 h-6 text-indigo-600" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="flex-1 p-2 bg-transparent border-0 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-white">{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:scale-101 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Original Text</h2>
              <span className="text-sm text-gray-600">
                {inputText.length} characters
              </span>
            </div>
            <div className="space-y-4 mb-6">
              <div className="flex space-x-3">
                <button
                  onClick={handleTrySample}
                  className="flex-1 px-5 py-3 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Try Sample Text</span>
                </button>
                <button
                  onClick={handlePasteText}
                  className="px-5 py-3 bg-green-100 text-green-800 rounded-xl hover:bg-green-200 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Paste Text</span>
                </button>
              </div>
              <label className="block w-full px-5 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadDoc}
                  accept=".txt,.doc,.docx,.pdf"
                  className="hidden"
                />
                <Upload className="w-5 h-5" />
                <span>Upload Doc</span>
              </label>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="To rewrite text, enter or paste it here and press 'Paraphrase'..."
              className="w-full h-80 p-6 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={handleParaphrase}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-6 px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-102 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Paraphrasing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Paraphrase</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 transform hover:scale-101 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Paraphrased Text</h2>
              {outputText && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCopyAll}
                    className="p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300"
                    title="Copy All"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-300"
                    title="Download as file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="h-80 p-6 bg-gray-50 border border-gray-200 rounded-2xl overflow-y-auto"
            >
              {outputText ? (
                <div className="relative">
                  <p className="text-gray-900 leading-relaxed">
                    {outputText.split(' ').map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:bg-indigo-100 rounded px-1 transition-colors duration-200"
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </p>
                  {selectedWord && synonyms.length > 0 && (
                    <div className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-lg p-4 mt-2 left-0 animate-fade-in">
                      <h4 className="text-md font-medium text-gray-800 mb-2">Synonyms for "{selectedWord}"</h4>
                      <div className="flex flex-wrap gap-2">
                        {synonyms.map((synonym, idx) => (
                          <button
                            key={idx}
                            onClick={() => replaceWord(synonym)}
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm transition-all duration-200"
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
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin-slow" />
                    <p className="text-lg">Paraphrased text will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {outputText && (
              <div className="mt-4 text-sm text-gray-600">
                {outputText.length} characters • Mode: {allModes.find(m => m.id === mode)?.name} • Language: {languages.find(l => l.id === language)?.name}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-5 gap-8">
          {[
            { icon: RefreshCw, title: '10+ Modes', desc: 'Free and premium modes for every style' },
            { icon: Zap, title: 'Synonyms Slider', desc: 'Adjust creativity for precise or unique output' },
            { icon: Globe, title: '20+ Languages', desc: 'Rephrase in multiple languages' },
            { icon: Copy, title: 'Clickable Synonyms', desc: 'AI-powered thesaurus for word choices' },
            { icon: Upload, title: 'Upload Docs', desc: 'Paraphrase .txt, .doc, .pdf files' },
          ].map(({ icon: Icon, title, desc }, idx) => (
            <div key={idx} className="text-center p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 hover:bg-indigo-50 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "'Lora', serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;
