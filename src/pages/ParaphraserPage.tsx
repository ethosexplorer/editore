import React, { useState, useRef } from 'react';
import { RefreshCw, Copy, Download, Settings, Zap, Globe, Upload, FileText, BookOpen } from 'lucide-react';

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
  const [citationText, setCitationText] = useState('');
  const [citationOutput, setCitationOutput] = useState('');

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

  const languages = [
    { id: 'en-US', name: 'English (US)' },
    { id: 'en-GB', name: 'English (UK)' },
    { id: 'fr', name: 'French' },
    { id: 'es', name: 'Spanish' },
    { id: 'de', name: 'German' },
    { id: 'zh', name: 'Chinese' },
    { id: 'hi', name: 'Hindi' },
    { id: 'ru', name: 'Russian' },
  ];

  const handleParaphrase = async () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      let paraphrased = inputText + ' [Paraphrased in ' + mode + ' mode]';
      setOutputText(paraphrased);
      setIsProcessing(false);
    }, 2000);
  };

  const handleCopy = () => navigator.clipboard.writeText(outputText);

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
    };
    setSelectedWord(word);
    setSynonyms(mockSynonyms[word.toLowerCase() as keyof typeof mockSynonyms] || []);
  };

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      const newText = outputText.replace(new RegExp('\\b' + selectedWord + '\\b', 'gi'), synonym);
      setOutputText(newText);
      setSelectedWord(null);
      setSynonyms([]);
    }
  };

  const handleCitationGenerate = () => {
    if (!citationText.trim()) return;
    setCitationOutput(`Generated citation for: "${citationText}"`);
  };

  const togglePremium = () => setIsPremium(!isPremium);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">AI Paraphraser</h1>

        {/* Input */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 p-3 border rounded"
            placeholder="Enter text to paraphrase..."
          />
          <button
            onClick={handleParaphrase}
            disabled={isProcessing}
            className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded"
          >
            {isProcessing ? 'Processing...' : 'Paraphrase'}
          </button>
        </div>

        {/* Output */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-3">Paraphrased Text</h2>
          <div ref={outputRef} className="h-32 overflow-y-auto border p-3 rounded bg-gray-50">
            {outputText ? (
              outputText.split(' ').map((word, index) => (
                <span
                  key={index}
                  onClick={() => handleWordClick(word)}
                  className="cursor-pointer hover:bg-emerald-100 px-1"
                >
                  {word}{' '}
                </span>
              ))
            ) : (
              <p className="text-gray-400">Your paraphrased text will appear here...</p>
            )}
          </div>
          {outputText && (
            <div className="mt-3 flex space-x-2">
              <button onClick={handleCopy} className="px-3 py-2 bg-gray-100 rounded">Copy</button>
              <button onClick={handleDownload} className="px-3 py-2 bg-gray-100 rounded">Download</button>
            </div>
          )}
        </div>

        {/* Citation Helper */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-3">
            <BookOpen className="w-5 h-5 text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold">AI Citation Helper</h2>
          </div>
          <textarea
            value={citationText}
            onChange={(e) => setCitationText(e.target.value)}
            className="w-full h-24 p-3 border rounded mb-3"
            placeholder="Enter source details or text for citation..."
          />
          <button
            onClick={handleCitationGenerate}
            className="px-4 py-2 bg-sky-500 text-white rounded"
          >
            Generate Citation
          </button>
          {citationOutput && (
            <div className="mt-3 p-3 bg-gray-50 border rounded">
              <p className="text-gray-800">{citationOutput}</p>
              <button
                onClick={() => navigator.clipboard.writeText(citationOutput)}
                className="mt-2 px-3 py-1 bg-gray-100 rounded"
              >
                Copy Citation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParaphraserPage;
