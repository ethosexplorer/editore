import React, { useState, useRef } from 'react';
import { RefreshCw, Copy, Download, Globe, Upload, FileText, Crown, CheckCircle, BookOpen, Lightbulb, X, Menu } from 'lucide-react';

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState('standard');
  const [synonymLevel, setSynonymLevel] = useState(50);
  const [language, setLanguage] = useState('en-US');
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [synonyms, setSynonyms] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QuillBot modes - 2 free, 7 premium
  const allModes = [
    { 
      id: 'standard', 
      name: 'Standard', 
      description: 'Basic rephrasing that maintains original meaning', 
      premium: false
    },
    { 
      id: 'fluency', 
      name: 'Fluency', 
      description: 'Smooths awkward phrasing and improves readability', 
      premium: false
    },
    { 
      id: 'formal', 
      name: 'Formal', 
      description: 'Professional tone for business writing', 
      premium: true
    },
    { 
      id: 'simple', 
      name: 'Simple', 
      description: 'Uses simpler vocabulary', 
      premium: true
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Unique and imaginative variations', 
      premium: true
    },
    { 
      id: 'expand', 
      name: 'Expand', 
      description: 'Lengthens text by adding detail', 
      premium: true
    },
    { 
      id: 'shorten', 
      name: 'Shorten', 
      description: 'Condenses text while preserving meaning', 
      premium: true
    },
    { 
      id: 'academic', 
      name: 'Academic', 
      description: 'Scholarly tone with advanced vocabulary', 
      premium: true
    },
    { 
      id: 'custom', 
      name: 'Custom', 
      description: 'User-defined style preferences', 
      premium: true
    },
  ];

  const languages = [
    { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { id: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { id: 'en-AU', name: 'English (AU)', flag: '🇦🇺' },
    { id: 'en-CA', name: 'English (CA)', flag: '🇨🇦' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
    { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' },
    { id: 'da', name: 'Danish', flag: '🇩🇰' },
    { id: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { id: 'it', name: 'Italian', flag: '🇮🇹' },
    { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { id: 'ko', name: 'Korean', flag: '🇰🇷' },
    { id: 'pl', name: 'Polish', flag: '🇵🇱' },
    { id: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
    { id: 'pt-PT', name: 'Portuguese (Portugal)', flag: '🇵🇹' },
    { id: 'sv', name: 'Swedish', flag: '🇸🇪' },
    { id: 'tr', name: 'Turkish', flag: '🇹🇷' },
    { id: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { id: 'th', name: 'Thai', flag: '🇹🇭' },
    { id: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { id: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
    { id: 'ro', name: 'Romanian', flag: '🇷🇴' }
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;

    const selectedMode = allModes.find(m => m.id === mode);
    if (selectedMode?.premium && !isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      let paraphrased = inputText;
      
      switch (mode) {
        case 'standard':
          paraphrased = inputText
            .replace(/\b(and|but|or|so)\b/gi, (match) => {
              const conjunctions = { 
                and: 'as well as', 
                but: 'however', 
                or: 'alternatively',
                so: 'therefore'
              };
              return conjunctions[match.toLowerCase() as keyof typeof conjunctions] || match;
            });
          break;
          
        case 'fluency':
          paraphrased = inputText
            .replace(/\b(very|really|quite)\s+(\w+)/gi, 'particularly $2')
            .replace(/\b(big|large)\b/gi, 'substantial')
            .replace(/\b(small|little)\b/gi, 'modest');
          break;
          
        case 'formal':
          paraphrased = inputText
            .replace(/\b(gonna|going to)\b/gi, 'will')
            .replace(/\b(wanna|want to)\b/gi, 'wish to')
            .replace(/\b(can't|cannot)\b/gi, 'is unable to')
            .replace(/\b(use)\b/gi, 'utilize');
          break;
          
        case 'simple':
          paraphrased = inputText
            .replace(/\b(utilize|employ)\b/gi, 'use')
            .replace(/\b(commence|initiate)\b/gi, 'start')
            .replace(/\b(demonstrate|exhibit)\b/gi, 'show');
          break;
          
        case 'creative':
          const creativeWords = {
            good: ['excellent', 'remarkable', 'outstanding'],
            bad: ['terrible', 'dreadful', 'awful'],
            big: ['enormous', 'gigantic', 'massive'],
            small: ['tiny', 'minuscule', 'compact']
          };
          Object.entries(creativeWords).forEach(([word, alternatives]) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            paraphrased = paraphrased.replace(regex, () => {
              return alternatives[Math.floor(Math.random() * alternatives.length)];
            });
          });
          break;
          
        case 'expand':
          paraphrased = inputText.replace(/\./g, ', providing additional context and detail.');
          break;
          
        case 'shorten':
          const sentences = inputText.split('.');
          paraphrased = sentences
            .map(sentence => sentence.split(' ').slice(0, Math.floor(sentence.split(' ').length * 0.7)).join(' '))
            .join('.');
          break;
          
        case 'academic':
          paraphrased = inputText
            .replace(/\b(use|used)\b/gi, 'employ')
            .replace(/\b(show|shows)\b/gi, 'demonstrate')
            .replace(/\b(help|helps)\b/gi, 'facilitate');
          break;
      }

      if (synonymLevel > 70) {
        const synonymMap: { [key: string]: string[] } = {
          important: ['crucial', 'vital', 'essential'],
          beautiful: ['stunning', 'gorgeous', 'magnificent'],
          difficult: ['challenging', 'complex', 'demanding'],
          interesting: ['fascinating', 'captivating', 'intriguing']
        };
        
        Object.entries(synonymMap).forEach(([word, alternatives]) => {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          if (Math.random() > 0.5) {
            paraphrased = paraphrased.replace(regex, () => {
              return alternatives[Math.floor(Math.random() * alternatives.length)];
            });
          }
        });
      }

      setOutputText(paraphrased);
      setIsProcessing(false);
    }, 2000);
  };

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const cleanWord = word.replace(/[^\w]/g, '');
    
    const synonymDatabase: { [key: string]: string[] } = {
      good: ['excellent', 'great', 'fine', 'superb'],
      bad: ['poor', 'terrible', 'awful', 'dreadful'],
      big: ['large', 'huge', 'enormous', 'massive'],
      small: ['tiny', 'little', 'minute', 'compact'],
      use: ['utilize', 'employ', 'apply', 'deploy'],
      make: ['create', 'produce', 'generate', 'build'],
      important: ['crucial', 'vital', 'essential', 'significant'],
      beautiful: ['stunning', 'gorgeous', 'lovely', 'attractive'],
      difficult: ['challenging', 'hard', 'tough', 'complex'],
      easy: ['simple', 'effortless', 'straightforward', 'basic']
    };
    
    setSelectedWord(cleanWord);
    const wordSynonyms = synonymDatabase[cleanWord.toLowerCase() as keyof typeof synonymDatabase] || 
                        ['similar', 'equivalent', 'comparable'];
    setSynonyms(wordSynonyms);
  };

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      const regex = new RegExp(`\\b${selectedWord}\\b`, 'gi');
      const newText = outputText.replace(regex, synonym);
      setOutputText(newText);
      setSelectedWord(null);
      setSynonyms([]);
    }
  };

  const getSynonymLevelDescription = () => {
    if (synonymLevel < 25) return 'Low creativity';
    if (synonymLevel < 50) return 'Balanced approach';
    if (synonymLevel < 75) return 'High creativity';
    return 'Maximum creativity';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Paraphraser</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">AI-powered text rephrasing for improved clarity and originality</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button className="px-3 py-2 sm:px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center text-xs sm:text-sm">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Integrations</span>
                <span className="sm:hidden">Apps</span>
              </button>
              <button 
                onClick={() => setIsPremium(!isPremium)}
                className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">{isPremium ? 'Free Version' : 'Upgrade to Premium'}</span>
                <span className="sm:hidden">{isPremium ? 'Free' : 'Premium'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className="flex items-center justify-between p-3 sm:p-4 lg:hidden">
            <h3 className="text-sm font-medium text-gray-700">Settings</h3>
            <button
              onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileSettingsOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
          
          <div className={`${mobileSettingsOpen ? 'block' : 'hidden'} lg:block p-3 sm:p-4`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-4 sm:gap-6">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    {languages.map(lang => (
                      <option key={lang.id} value={lang.id}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Synonym Level:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={synonymLevel}
                    onChange={(e) => setSynonymLevel(Number(e.target.value))}
                    className="flex-1 sm:w-16 lg:w-20 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 min-w-max">{getSynonymLevelDescription()}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Mode:</span>
                  <select
                    value={mode}
                    onChange={(e) => {
                      const selectedMode = allModes.find(m => m.id === e.target.value);
                      if (selectedMode?.premium && !isPremium) {
                        setShowUpgradeModal(true);
                      } else {
                        setMode(e.target.value);
                      }
                    }}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 min-w-0"
                  >
                    {allModes.map(modeOption => (
                      <option key={modeOption.id} value={modeOption.id}>
                        {modeOption.name} {modeOption.premium && !isPremium ? '(Premium)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm transition-colors"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Upload Document</span>
                <span className="sm:hidden">Upload</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Text</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span>{inputText.length} characters</span>
                    <span>•</span>
                    <span>{inputText.split(' ').filter(w => w.trim()).length} words</span>
                  </div>
                  <button
                    onClick={handleParaphrase}
                    disabled={!inputText.trim() || isProcessing}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Paraphrase</span>
                        <span className="sm:hidden">Process</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here to rephrase for improved clarity, tone, and originality..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      setInputText(content);
                    };
                    reader.readAsText(file);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Paraphrased Text</h2>
              {outputText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(outputText)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([outputText], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'paraphrased-text.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {outputText ? (
              <div className="space-y-4">
                <div
                  ref={outputRef}
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-60 sm:min-h-80 max-h-80 sm:max-h-96 overflow-y-auto cursor-pointer"
                  onClick={() => {
                    setSelectedWord(null);
                    setSynonyms([]);
                  }}
                >
                  <div className="relative">
                    <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
                      {outputText.split(' ').map((word, index) => (
                        <span
                          key={index}
                          onClick={(e) => handleWordClick(word, e)}
                          className="hover:bg-blue-100 rounded px-1 transition-colors duration-200 cursor-pointer"
                          title="Click for synonyms"
                        >
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                    {selectedWord && synonyms.length > 0 && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-3 mt-2 left-0 right-0">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Synonyms for "{selectedWord}"
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {synonyms.map((synonym, idx) => (
                            <button
                              key={idx}
                              onClick={() => replaceWord(synonym)}
                              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-full text-sm font-medium text-blue-700 transition-colors"
                            >
                              {synonym}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <div>Mode: {allModes.find(m => m.id === mode)?.name}</div>
                  <div>Language: {languages.find(l => l.id === language)?.name}</div>
                  <div>Creativity Level: {synonymLevel}%</div>
                  <div className="text-xs text-blue-600 mt-2">💡 Click any word above for synonyms</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <RefreshCw className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" />
                <p className="text-base sm:text-lg font-medium">Perfect Rephrasing!</p>
                <p className="text-sm">Your paraphrased text will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center">
                <Crown className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  This mode requires a premium subscription. Upgrade to access all 9 paraphrasing modes.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsPremium(true);
                      setShowUpgradeModal(false);
                      setMode(mode);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                  >
                    Try Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">9 Writing Modes</h3>
            <p className="text-xs sm:text-sm text-gray-600">From Standard to Creative - find the perfect tone</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Smart Synonyms</h3>
            <p className="text-xs sm:text-sm text-gray-600">Click any word for instant synonym suggestions</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">25+ Languages</h3>
            <p className="text-xs sm:text-sm text-gray-600">Support for global languages and English variants</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;
