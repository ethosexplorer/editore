import React, { useState } from 'react';
import { Users, Zap, Copy, Download, BarChart3 } from 'lucide-react';

const AIHumanizerPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanizationLevel, setHumanizationLevel] = useState('balanced');

  const levels = [
    { id: 'light', name: 'Light', description: 'Minimal changes, preserve structure' },
    { id: 'balanced', name: 'Balanced', description: 'Natural flow with clarity' },
    { id: 'aggressive', name: 'Aggressive', description: 'Maximum humanization' }
  ];

  const handleHumanize = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      let humanized = inputText;
      
      // Simple humanization simulation
      humanized = humanized
        .replace(/\b(utilize|utilizes|utilized)\b/gi, 'use')
        .replace(/\b(commence|commences|commenced)\b/gi, 'start')
        .replace(/\b(facilitate|facilitates|facilitated)\b/gi, 'help')
        .replace(/\b(demonstrate|demonstrates|demonstrated)\b/gi, 'show')
        .replace(/\b(subsequently)\b/gi, 'then')
        .replace(/\b(furthermore)\b/gi, 'also')
        .replace(/\b(therefore)\b/gi, 'so')
        .replace(/\b(however)\b/gi, 'but');

      // Add some conversational elements based on level
      if (humanizationLevel === 'balanced' || humanizationLevel === 'aggressive') {
        humanized = humanized.replace(/\. /g, '. You know, ');
        humanized = humanized.replace(/You know, You know, /g, 'You know, ');
      }

      if (humanizationLevel === 'aggressive') {
        humanized = "Here's the thing: " + humanized;
        humanized = humanized.replace(/\b(important|significant)\b/gi, 'really important');
      }

      setOutputText(humanized + ' [Humanized using ' + humanizationLevel + ' mode]');
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
    a.download = 'humanized-text.txt';
    a.click();
  };

  const getHumanScore = () => {
    if (!outputText) return 0;
    // Simulate human score based on changes made
    const baseScore = 65;
    const levelBonus = humanizationLevel === 'light' ? 10 : humanizationLevel === 'balanced' ? 20 : 30;
    return Math.min(95, baseScore + levelBonus + Math.random() * 10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Humanizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform AI-generated text to sound more natural and human-like. 
            Perfect for making content feel authentic and engaging.
          </p>
        </div>

        {/* Humanization Level */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Humanization Level</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setHumanizationLevel(level.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  humanizationLevel === level.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">{level.name}</div>
                <div className="text-sm text-gray-600">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI-Generated Text</h2>
              <span className="text-sm text-gray-500">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here to make it sound more human and natural..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />

            <button
              onClick={handleHumanize}
              disabled={!inputText.trim() || isProcessing}
              className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Humanizing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Humanize Text
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Humanized Text</h2>
              {outputText && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="Download as file"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="h-80 p-4 border border-gray-200 rounded-2xl bg-gray-50">
              {outputText ? (
                <div className="h-full overflow-y-auto">
                  <p className="text-gray-900 leading-relaxed">{outputText}</p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Users className="w-12 h-12 mx-auto mb-4" />
                    <p>Humanized text will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {outputText && (
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-cyan-50 rounded-xl">
                  <div className="text-lg font-bold text-cyan-600">
                    {getHumanScore().toFixed(0)}%
                  </div>
                  <div className="text-xs text-cyan-600">Human Score</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-lg font-bold text-blue-600">
                    {outputText.split(' ').filter(w => w).length}
                  </div>
                  <div className="text-xs text-blue-600">Words</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-lg font-bold text-green-600">
                    {levels.find(l => l.id === humanizationLevel)?.name}
                  </div>
                  <div className="text-xs text-green-600">Level</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Before/After Comparison */}
        {outputText && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Transformation Examples</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-red-600 mb-3">❌ AI-like (Before)</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <span className="font-mono text-red-700">"utilize advanced methodologies"</span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <span className="font-mono text-red-700">"facilitate optimal outcomes"</span>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <span className="font-mono text-red-700">"subsequently implement"</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 mb-3">✅ Human-like (After)</h4>
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-mono text-green-700">"use smart approaches"</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-mono text-green-700">"help get better results"</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-mono text-green-700">"then put into action"</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Natural Language</h3>
            <p className="text-gray-600 text-sm">Transform robotic AI text into natural, conversational language</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Customizable Levels</h3>
            <p className="text-gray-600 text-sm">Choose the right level of humanization for your content</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Preserve Meaning</h3>
            <p className="text-gray-600 text-sm">Maintain original message while improving readability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHumanizerPage;