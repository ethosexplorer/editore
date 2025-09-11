import React, { useState } from 'react';
import { Search, Upload, FileText, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const AIDetectorPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setResult({
        aiProbability: Math.random() * 100,
        humanProbability: Math.random() * 100,
        confidence: 85 + Math.random() * 15,
        sentences: text.split('.').filter(s => s.trim()).map((sentence, index) => ({
          text: sentence.trim(),
          aiProbability: Math.random() * 100,
          highlighted: Math.random() > 0.7
        }))
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Content Detector
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify AI-generated content with advanced detection algorithms. 
            Get detailed analysis and confidence scores for your text.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Input Text</h2>
              <label className="flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Upload File</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here or upload a document to analyze for AI-generated content..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500">
                {text.length} characters • {text.split(' ').filter(w => w).length} words
              </span>
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || isAnalyzing}
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
                    Analyze Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Detection Results</h2>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <FileText className="w-16 h-16 mb-4" />
                <p className="text-lg">Enter text to see AI detection results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">AI Probability</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {result.aiProbability.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${result.aiProbability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium">Confidence Score</span>
                  </div>
                  <span className="font-bold text-green-600">{result.confidence.toFixed(1)}%</span>
                </div>

                {/* Sentence Analysis */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Sentence Analysis</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {result.sentences.map((sentence: any, index: number) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg text-sm ${
                          sentence.highlighted 
                            ? 'bg-red-50 border-l-4 border-red-400' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="flex-1">{sentence.text}</span>
                          {sentence.highlighted && (
                            <AlertTriangle className="w-4 h-4 text-red-500 ml-2 flex-shrink-0" />
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          AI Probability: {sentence.aiProbability.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Detection</h3>
            <p className="text-gray-600 text-sm">State-of-the-art algorithms detect AI-generated content with high accuracy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Analysis</h3>
            <p className="text-gray-600 text-sm">Get sentence-by-sentence breakdown with confidence scores</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Accuracy</h3>
            <p className="text-gray-600 text-sm">Reliable results with confidence metrics for informed decisions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDetectorPage;