import React, { useState, useRef } from 'react';
import { CheckCircle, AlertTriangle, Info, Lightbulb, Zap } from 'lucide-react';

interface Issue {
  id: number;
  type: 'grammar' | 'spelling' | 'punctuation';
  severity: 'error' | 'warning' | 'suggestion';
  text: string;
  suggestion: string;
  explanation: string;
  position: { start: number; end: number };
  ignored: boolean;
}

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [ignoredIssues, setIgnoredIssues] = useState<Set<number>>(new Set());
  const outputRef = useRef<HTMLDivElement>(null);

  const handleCheck = async () => {
    if (!text.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      const mockIssues: Issue[] = [
        {
          id: 1,
          type: 'grammar',
          severity: 'error',
          text: 'are',
          suggestion: 'is',
          explanation: 'Subject-verb disagreement. The singular subject requires "is".',
          position: { start: 10, end: 13 },
          ignored: false,
        },
        {
          id: 2,
          type: 'spelling',
          severity: 'error',
          text: 'recieve',
          suggestion: 'receive',
          explanation: 'Spelling error. Correct form is "receive" (i before e except after c).',
          position: { start: 25, end: 32 },
          ignored: false,
        },
        {
          id: 3,
          type: 'punctuation',
          severity: 'warning',
          text: ',',
          suggestion: ';',
          explanation: 'Comma splice detected. Use a semicolon to join independent clauses.',
          position: { start: 45, end: 46 },
          ignored: false,
        },
        {
          id: 4,
          type: 'grammar',
          severity: 'suggestion',
          text: 'very good',
          suggestion: 'excellent',
          explanation: 'Style suggestion: "excellent" adds more impact than "very good".',
          position: { start: 60, end: 69 },
          ignored: false,
        },
      ];
      setIssues(mockIssues);
      setIsChecking(false);
    }, 2000);
  };

  const applyFix = (issue: Issue) => {
    if (!issue.ignored) {
      const newText = text.substring(0, issue.position.start) + issue.suggestion + text.substring(issue.position.end);
      setText(newText);
      setIssues(issues.filter(i => i.id !== issue.id));
      setSelectedIssue(null);
    }
  };

  const toggleIgnore = (issueId: number) => {
    const newIgnored = new Set(ignoredIssues);
    if (newIgnored.has(issueId)) {
      newIgnored.delete(issueId);
    } else {
      newIgnored.add(issueId);
    }
    setIgnoredIssues(newIgnored);
    setIssues(issues.map(i => i.id === issueId ? { ...i, ignored: !i.ignored } : i));
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-sky-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full shadow-md mb-4 animate-pulse-slow">
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Grammar Checker
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto leading-relaxed" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
            Scans for errors in real-time, providing corrections and explanations to polish your writing. Works with browsers, Word, and mobile apps!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Text Editor */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Your Text
              </h2>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-sm text-gray-600">
                  {text.length} chars • {text.split(' ').filter(w => w).length} words
                </span>
                <button
                  onClick={handleCheck}
                  disabled={!text.trim() || isChecking}
                  className="px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200 flex items-center space-x-1"
                >
                  {isChecking ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                      <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Check Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here to check grammar, spelling, and punctuation..."
              className="w-full h-56 sm:h-72 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500"
            />

            {/* Statistics */}
            {issues.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 bg-red-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-red-600">
                    {issues.filter(i => i.severity === 'error').length}
                  </div>
                  <div className="text-xs sm:text-sm text-red-600">Errors</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-yellow-600">
                    {issues.filter(i => i.severity === 'warning').length}
                  </div>
                  <div className="text-xs sm:text-sm text-yellow-600">Warnings</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-blue-600">
                    {issues.filter(i => i.severity === 'suggestion').length}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600">Suggestions</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                  <div className="text-lg sm:text-xl font-bold text-green-600">
                    {Math.max(0, 100 - issues.length * 5)}
                  </div>
                  <div className="text-xs sm:text-sm text-green-600">Score</div>
                </div>
              </div>
            )}
          </div>

          {/* Issues Panel */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                Issues Found
              </h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                {showDetails ? 'Hide Details' : 'Show Options'}
              </button>
            </div>

            {issues.length === 0 ? (
              <div className="text-center text-gray-400 py-6 sm:py-8">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                <p className="text-base sm:text-lg" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>No issues found</p>
                <p className="text-sm" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>Your text is perfect!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 sm:max-h-72 overflow-y-auto">
                {issues.map((issue) => (
                  !issue.ignored && (
                    <div
                      key={issue.id}
                      className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${getIssueColor(issue.severity)} ${
                        selectedIssue?.id === issue.id ? 'ring-2 ring-emerald-500' : ''
                      }`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="flex items-start justify-between mb-1 sm:mb-2">
                        <div className="flex items-center">
                          {getIssueIcon(issue.type, issue.severity)}
                          <span className="ml-1 sm:ml-2 font-semibold text-gray-900 capitalize text-sm sm:text-base" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                            {issue.type}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <span className="text-xs sm:text-sm px-1 sm:px-2 py-0.5 bg-white rounded-full text-gray-600 capitalize">
                            {issue.severity}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleIgnore(issue.id); }}
                            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                          >
                            {ignoredIssues.has(issue.id) ? 'Accept' : 'Ignore'}
                          </button>
                        </div>
                      </div>

                      <div className="mb-1 sm:mb-2">
                        <span className="text-gray-600 text-sm sm:text-base">Replace </span>
                        <span className="font-mono bg-red-100 px-1 sm:px-2 py-0.5 rounded text-red-700 text-sm sm:text-base">
                          "{issue.text}"
                        </span>
                        <span className="text-gray-600 text-sm sm:text-base"> with </span>
                        <span className="font-mono bg-green-100 px-1 sm:px-2 py-0.5 rounded text-green-700 text-sm sm:text-base">
                          "{issue.suggestion}"
                        </span>
                      </div>

                      {showDetails && (
                        <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
                          {issue.explanation}
                        </p>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); applyFix(issue); }}
                        className="w-full px-3 sm:px-4 py-1 sm:py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors duration-200 text-sm"
                      >
                        Apply Fix
                      </button>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 sm:mt-12 grid md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Real-Time Checks
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Instant grammar, spelling, and punctuation fixes
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Smart Suggestions
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Detailed explanations with each correction
            </p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Multi-Platform
            </h3>
            <p className="text-sm text-gray-600" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif' }}>
              Works with Chrome, Edge, Word, iOS, and Android
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarCheckerPage;
