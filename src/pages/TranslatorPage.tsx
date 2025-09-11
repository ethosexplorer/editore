import React, { useState } from 'react';
import { Globe, ArrowRightLeft, Copy, Volume2, Zap } from 'lucide-react';

const TranslatorPage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
  ];

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    // Simulate API call
    setTimeout(() => {
      // Simple mock translation
      const mockTranslations: { [key: string]: string } = {
        'en-es': 'Hola, este es un texto traducido al español.',
        'en-fr': 'Bonjour, ceci est un texte traduit en français.',
        'en-de': 'Hallo, dies ist ein ins Deutsche übersetzter Text.',
        'es-en': 'Hello, this is a text translated to English.',
        'fr-en': 'Hello, this is a text translated to English.',
      };
      
      const key = `${sourceLang}-${targetLang}`;
      setTranslatedText(mockTranslations[key] || `[Translated from ${sourceLang} to ${targetLang}] ${sourceText}`);
      setIsTranslating(false);
    }, 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSpeak = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  };

  const getLanguageName = (code: string) => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return languages.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Translator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Translate content across 100+ languages with context awareness. 
            Perfect for global communication and content localization.
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapLanguages}
              className="mt-6 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Source Text */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getLanguageFlag(sourceLang)}</span>
                <h2 className="text-2xl font-bold text-gray-900">{getLanguageName(sourceLang)}</h2>
              </div>
              <div className="flex space-x-2">
                {sourceText && (
                  <>
                    <button
                      onClick={() => handleSpeak(sourceText, sourceLang)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopy(sourceText)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500">
                {sourceText.length} characters • {sourceText.split(' ').filter(w => w).length} words
              </span>
              <button
                onClick={handleTranslate}
                disabled={!sourceText.trim() || isTranslating}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isTranslating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Translating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Translate
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Translated Text */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-2">{getLanguageFlag(targetLang)}</span>
                <h2 className="text-2xl font-bold text-gray-900">{getLanguageName(targetLang)}</h2>
              </div>
              <div className="flex space-x-2">
                {translatedText && (
                  <>
                    <button
                      onClick={() => handleSpeak(translatedText, targetLang)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Listen"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleCopy(translatedText)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="h-80 p-4 border border-gray-200 rounded-2xl bg-gray-50">
              {translatedText ? (
                <div className="h-full overflow-y-auto">
                  <p className="text-gray-900 leading-relaxed text-lg">{translatedText}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-4" />
                    <p>Translation will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {translatedText && (
              <div className="mt-6 text-sm text-gray-500">
                {translatedText.length} characters • {translatedText.split(' ').filter(w => w).length} words
              </div>
            )}
          </div>
        </div>

        {/* Quick Translations */}
        <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Phrases</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Hello, how are you?',
              'Thank you very much',
              'Where is the bathroom?',
              'I need help',
              'How much does this cost?',
              'What time is it?'
            ].map((phrase, index) => (
              <button
                key={index}
                onClick={() => setSourceText(phrase)}
                className="p-4 text-left border border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
              >
                <span className="text-gray-900">{phrase}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">100+ Languages</h3>
            <p className="text-gray-600 text-sm">Support for major world languages with high accuracy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Text-to-Speech</h3>
            <p className="text-gray-600 text-sm">Listen to translations with natural pronunciation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Swap</h3>
            <p className="text-gray-600 text-sm">Quickly switch between source and target languages</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorPage;