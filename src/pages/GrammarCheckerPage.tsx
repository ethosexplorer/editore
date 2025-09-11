import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Info, Lightbulb, Zap } from 'lucide-react';

interface Issue {
  id: number;
  type: 'grammar' | 'spelling' | 'style' | 'punctuation';
  severity: 'error' | 'warning' | 'suggestion';
  text: string;
  suggestion: string;
  explanation: string;
  position: { start: number; end: number };
}

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;
    
    setIsChecking(true);
    // Simulate API call with mock issues
    setTimeout(() => {
      const mockIssues: Issue[] = [
        {
          id: 1,
          type: 'grammar',
          severity: 'error',
          text: 'are',
          suggestion: 'is',
          explanation: 'Subject-verb disagreement. The subject is singular, so the verb should be "is".',
          position: { start: 10, end: 13 }
        },
        {
          id: 2,
          type: 'spelling',
          severity: 'error',
          text: 'recieve',
          suggestion: 'receive',
          explanation: 'Common spelling error. Remember: "i before e except after c".',
          position: { start: 25, end: 32 }
        },
        {
          id: 3,
          type: 'style',
          severity: 'suggestion',
          text: 'very good',
          suggestion: 'excellent',
          explanation: 'Consider using a more specific adjective for stronger impact.',
          position: { start: 45, end: 54 }
        }
      ];
      setIssues(mockIssues);
      setIsChecking(false);
    }, 2000);
  };

  const applyFix = (issue: Issue) => {
    const newText = text.substring(0, issue.position.start) + 
                   issue.suggestion + 
                   text.substring(issue.position.end);
    setText(newText);
    setIssues(issues.filter(i => i.id !== issue.id));
    setSelectedIssue(null);
  };

  const getIssueIcon = (type: string, severity: string) => {
    if (severity === 'error') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (severity === 'warning') return <Info className="w-4 h-4 text-yellow-500" />;
    return <Lightbulb className="w-4 h-4 text-blue-500" />;
  };

  const getIssueColor = (severity: string) => {
    if (severity === 'error') return 'border-red-200 bg-red-50';
    if (severity === 'warning') return 'border-yellow-200 bg-yellow-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Grammar Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced grammar and style checking with real-time suggestions. 
            Perfect your writing with AI-powered corrections.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Text Editor */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Text</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {text.length} characters • {text.split(' ').filter(w => w).length} words
                </span>
                <button
                  onClick={handleCheck}
                  disabled={!text.trim() || isChecking}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isChecking ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Checking...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Check Grammar
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to check for grammar, spelling, and style issues..."
              className="w-full h-96 p-4 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg leading-relaxed"
            />

            {/* Statistics */}
            {issues.length > 0 && (
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">
                    {issues.filter(i => i.severity === 'error').length}
                  </div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">
                    {issues.filter(i => i.severity === 'warning').length}
                  </div>
                  <div className="text-sm text-yellow-600">Warnings</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {issues.filter(i => i.severity === 'suggestion').length}
                  </div>
                  <div className="text-sm text-blue-600">Suggestions</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.max(0, 100 - issues.length * 5)}
                  </div>
                  <div className="text-sm text-green-600">Score</div>
                </div>
              </div>
            )}
          </div>

          {/* Issues Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Issues Found</h2>
            
            {issues.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No issues found</p>
                <p className="text-sm">Your text looks great!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${getIssueColor(issue.severity)} ${
                      selectedIssue?.id === issue.id ? 'ring-2 ring-emerald-500' : ''
                    }`}
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getIssueIcon(issue.type, issue.severity)}
                        <span className="ml-2 font-semibold text-gray-900 capitalize">
                          {issue.type}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 capitalize">
                        {issue.severity}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-gray-600">Replace </span>
                      <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-700">
                        "{issue.text}"
                      </span>
                      <span className="text-gray-600"> with </span>
                      <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
                        "{issue.suggestion}"
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{issue.explanation}</p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyFix(issue);
                      }}
                      className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
                    >
                      Apply Fix
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Detection</h3>
            <p className="text-gray-600 text-sm">Catch grammar, spelling, punctuation, and style issues</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Suggestions</h3>
            <p className="text-gray-600 text-sm">Get contextual recommendations with explanations</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">One-Click Fixes</h3>
            <p className="text-gray-600 text-sm">Apply corrections instantly with detailed explanations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarCheckerPage;