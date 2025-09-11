import React, { useState } from 'react';
import { Shield, Upload, AlertTriangle, CheckCircle, ExternalLink, Zap } from 'lucide-react';

interface PlagiarismResult {
  overallScore: number;
  uniqueContent: number;
  sources: Array<{
    id: number;
    url: string;
    title: string;
    similarity: number;
    matchedText: string;
  }>;
  highlightedText: Array<{
    text: string;
    isPlagiarized: boolean;
    sourceId?: number;
  }>;
}

const PlagiarismCheckerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    // Simulate API call
    setTimeout(() => {
      const mockResult: PlagiarismResult = {
        overallScore: Math.random() * 30 + 70, // 70-100% unique
        uniqueContent: Math.random() * 30 + 70,
        sources: [
          {
            id: 1,
            url: 'https://example.com/article1',
            title: 'Sample Article About Writing',
            similarity: Math.random() * 15 + 5,
            matchedText: 'This is a sample matched text from the source.'
          },
          {
            id: 2,
            url: 'https://example.com/blog2',
            title: 'Writing Best Practices Blog',
            similarity: Math.random() * 10 + 3,
            matchedText: 'Another example of matched content.'
          }
        ],
        highlightedText: text.split(' ').map((word, index) => ({
          text: word,
          isPlagiarized: Math.random() > 0.85,
          sourceId: Math.random() > 0.5 ? 1 : 2
        }))
      };
      setResult(mockResult);
      setIsChecking(false);
    }, 3000);
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-6 h-6 text-green-600" />;
    return <AlertTriangle className="w-6 h-6 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plagiarism Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive plagiarism detection across billions of sources. 
            Ensure originality and academic integrity in your writing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Check Your Content</h2>
              <label className="flex items-center px-4 py-2 bg-gray-100 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Upload File</span>
                <input
                  type="file"
                  accept=".txt,.doc,.docx,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here or upload a document to check for plagiarism..."
              className="w-full h-80 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />

            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-500">
                {text.length} characters • {text.split(' ').filter(w => w).length} words
              </span>
              <button
                onClick={handleCheck}
                disabled={!text.trim() || isChecking}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isChecking ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Checking...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Check Plagiarism
                  </>
                )}
              </button>
            </div>

            {/* Highlighted Text */}
            {result && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Text Analysis</h3>
                <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50 max-h-60 overflow-y-auto">
                  <div className="leading-relaxed">
                    {result.highlightedText.map((segment, index) => (
                      <span
                        key={index}
                        className={`${
                          segment.isPlagiarized 
                            ? 'bg-red-200 text-red-800 px-1 rounded' 
                            : ''
                        }`}
                        title={segment.isPlagiarized ? `Matches source ${segment.sourceId}` : ''}
                      >
                        {segment.text}{' '}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Results</h2>
            
            {!result ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <Shield className="w-16 h-16 mb-4" />
                <p className="text-lg">Enter text to check for plagiarism</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className={`p-6 rounded-2xl ${getScoreColor(result.overallScore)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getScoreIcon(result.overallScore)}
                      <span className="ml-2 font-semibold">Uniqueness Score</span>
                    </div>
                    <span className="text-3xl font-bold">
                      {result.overallScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        result.overallScore >= 90 ? 'bg-green-500' : 
                        result.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.overallScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.uniqueContent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">Unique Content</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-900">
                      {result.sources.length}
                    </div>
                    <div className="text-sm text-gray-600">Sources Found</div>
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Matching Sources</h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {result.sources.map((source) => (
                      <div key={source.id} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{source.title}</h4>
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                            {source.similarity.toFixed(1)}%
                          </span>
                        </div>
                        <a 
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-sm mb-2"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Source
                        </a>
                        <p className="text-xs text-gray-600 italic">"{source.matchedText}"</p>
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
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Comprehensive Scanning</h3>
            <p className="text-gray-600 text-sm">Check against billions of web pages and academic sources</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Reports</h3>
            <p className="text-gray-600 text-sm">Get highlighted matches with source links and similarity scores</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Academic Integrity</h3>
            <p className="text-gray-600 text-sm">Ensure originality and maintain academic standards</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismCheckerPage;