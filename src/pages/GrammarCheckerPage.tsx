import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, Lightbulb, Zap, Upload, Eye, X, Chrome, Smartphone, Monitor, BookOpen, Globe, Settings, RefreshCw } from 'lucide-react';

interface Issue {
  id: number;
  type: 'grammar' | 'spelling' | 'punctuation';
  subtype: string;
  severity: 'error' | 'warning' | 'suggestion';
  text: string;
  suggestion: string;
  explanation: string;
  rule: string;
  position: { start: number; end: number };
  ignored: boolean;
  accepted: boolean;
}

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showRuleExplanations, setShowRuleExplanations] = useState(true);
  const [language, setLanguage] = useState('en-US');
  const [realTimeChecking, setRealTimeChecking] = useState(true);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const languages = [
    { id: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { id: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { id: 'en-AU', name: 'English (AU)', flag: '🇦🇺' },
    { id: 'en-CA', name: 'English (CA)', flag: '🇨🇦' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'ru', name: 'Russian', flag: '🇷🇺' }
  ];

  const integrationPlatforms = [
    { name: 'Chrome Extension', icon: Chrome, status: 'available', description: 'Check grammar on any website' },
    { name: 'Microsoft Word', icon: BookOpen, status: 'available', description: 'Real-time checking in Word documents' },
    { name: 'Mobile Apps', icon: Smartphone, status: 'available', description: 'iOS and Android keyboard integration' },
    { name: 'Edge Browser', icon: Monitor, status: 'available', description: 'Native browser integration' }
  ];

  // Real-time checking effect
  useEffect(() => {
    if (realTimeChecking && text.trim()) {
      const timeoutId = setTimeout(() => {
        handleCheck();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [text, realTimeChecking]);

  const handleCheck = async () => {
    if (!text.trim()) return;

    setIsChecking(true);
    setTimeout(() => {
      const mockIssues: Issue[] = [
        {
          id: 1,
          type: 'grammar',
          subtype: 'subject-verb agreement',
          severity: 'error',
          text: 'are',
          suggestion: 'is',
          explanation: 'The subject "data" is singular in formal English, so it requires the singular verb "is".',
          rule: 'Subject-Verb Agreement: Singular subjects require singular verbs.',
          position: { start: 10, end: 13 },
          ignored: false,
          accepted: false
        },
        {
          id: 2,
          type: 'spelling',
          subtype: 'misspelled word',
          severity: 'error',
          text: 'recieve',
          suggestion: 'receive',
          explanation: 'This is a common spelling error. Remember: "i before e except after c".',
          rule: 'Spelling Rule: I before E except after C (with exceptions).',
          position: { start: 25, end: 32 },
          ignored: false,
          accepted: false
        },
        {
          id: 3,
          type: 'punctuation',
          subtype: 'comma splice',
          severity: 'error',
          text: ', it',
          suggestion: '; it',
          explanation: 'A comma splice occurs when two independent clauses are joined by only a comma. Use a semicolon instead.',
          rule: 'Punctuation Rule: Use semicolons to separate independent clauses.',
          position: { start: 45, end: 49 },
          ignored: false,
          accepted: false
        },
        {
          id: 4,
          type: 'spelling',
          subtype: 'homophone confusion',
          severity: 'warning',
          text: 'there',
          suggestion: 'their',
          explanation: 'Context suggests you mean "their" (possessive) rather than "there" (location).',
          rule: 'Homophone Usage: There (place), Their (possessive), They\'re (they are).',
          position: { start: 60, end: 65 },
          ignored: false,
          accepted: false
        },
        {
          id: 5,
          type: 'grammar',
          subtype: 'word misuse',
          severity: 'warning',
          text: 'who',
          suggestion: 'whom',
          explanation: 'Use "whom" when the pronoun is the object of a verb or preposition.',
          rule: 'Pronoun Usage: Who (subject) vs. Whom (object).',
          position: { start: 75, end: 78 },
          ignored: false,
          accepted: false
        },
        {
          id: 6,
          type: 'grammar',
          subtype: 'consecutive nouns',
          severity: 'suggestion',
          text: 'data analysis report',
          suggestion: 'data-analysis report',
          explanation: 'Consider hyphenating consecutive nouns when they function as a compound modifier.',
          rule: 'Style Guide: Hyphenate compound modifiers before nouns.',
          position: { start: 85, end: 104 },
          ignored: false,
          accepted: false
        },
        {
          id: 7,
          type: 'punctuation',
          subtype: 'unnecessary preposition',
          severity: 'suggestion',
          text: 'off of',
          suggestion: 'off',
          explanation: 'The preposition "of" is unnecessary after "off".',
          rule: 'Preposition Usage: Avoid redundant prepositions.',
          position: { start: 110, end: 116 },
          ignored: false,
          accepted: false
        },
        {
          id: 8,
          type: 'grammar',
          subtype: 'possessive plural',
          severity: 'error',
          text: 'students\'s',
          suggestion: 'students\'',
          explanation: 'For plural nouns ending in "s", add only an apostrophe for possession.',
          rule: 'Possessive Rules: Plural nouns ending in "s" take only an apostrophe.',
          position: { start: 125, end: 135 },
          ignored: false,
          accepted: false
        }
      ];
      setIssues(mockIssues);
      setIsChecking(false);
    }, realTimeChecking ? 500 : 2000);
  };

  const applyFix = (issue: Issue) => {
    const newText = text.substring(0, issue.position.start) + issue.suggestion + text.substring(issue.position.end);
    setText(newText);
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, accepted: true } : i));
    setSelectedIssue(null);
  };

  const ignoreIssue = (issueId: number) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, ignored: true } : i));
    setSelectedIssue(null);
  };

  const acceptIssue = (issueId: number) => {
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, ignored: false } : i));
  };

  const getIssueIcon = (type: string, severity: string) => {
    if (severity === 'error') return <AlertTriangle className="w-4 h-4 text-red-500" />;
    if (severity === 'warning') return <Info className="w-4 h-4 text-yellow-500" />;
    return <Lightbulb className="w-4 h-4 text-blue-500" />;
  };

  const getIssueColor = (severity: string) => {
    if (severity === 'error') return 'border-red-200 bg-red-50 hover:bg-red-100';
    if (severity === 'warning') return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
    return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  const activeIssues = issues.filter(i => !i.ignored && !i.accepted);
  const grammarIssues = activeIssues.filter(i => i.type === 'grammar');
  const spellingIssues = activeIssues.filter(i => i.type === 'spelling');
  const punctuationIssues = activeIssues.filter(i => i.type === 'punctuation');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Grammar Checker</h1>
                <p className="text-sm text-gray-600">Real-time grammar, spelling, and punctuation corrections</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowIntegrations(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center"
              >
                <Globe className="w-4 h-4 mr-2" />
                Integrations
              </button>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-green-500"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="realtime"
                  checked={realTimeChecking}
                  onChange={(e) => setRealTimeChecking(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="realtime" className="text-sm text-gray-700">Real-time checking</label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="explanations"
                  checked={showRuleExplanations}
                  onChange={(e) => setShowRuleExplanations(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="explanations" className="text-sm text-gray-700">Show rule explanations</label>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Text Editor */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Your Text</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{text.length} characters</span>
                  <span>•</span>
                  <span>{text.split(' ').filter(w => w.trim()).length} words</span>
                  {!realTimeChecking && (
                    <button
                      onClick={handleCheck}
                      disabled={!text.trim() || isChecking}
                      className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
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
                  )}
                </div>
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here to check for grammar, spelling, and punctuation errors..."
                  className="w-full h-80 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {realTimeChecking && isChecking && (
                  <div className="absolute top-2 right-2">
                    <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Statistics */}
            {issues.length > 0 && (
              <div className="px-6 pb-6">
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xl font-bold text-red-600">{grammarIssues.length}</div>
                    <div className="text-xs text-red-600">Grammar</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-xl font-bold text-orange-600">{spellingIssues.length}</div>
                    <div className="text-xs text-orange-600">Spelling</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-xl font-bold text-yellow-600">{punctuationIssues.length}</div>
                    <div className="text-xs text-yellow-600">Punctuation</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xl font-bold text-green-600">
                      {Math.max(0, 100 - activeIssues.length * 3)}
                    </div>
                    <div className="text-xs text-green-600">Score</div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Grammar Issues:</span>
                    <span>{grammarIssues.map(i => i.subtype).join(', ') || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Spelling Issues:</span>
                    <span>{spellingIssues.map(i => i.subtype).join(', ') || 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Punctuation Issues:</span>
                    <span>{punctuationIssues.map(i => i.subtype).join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Issues Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Issues Found</h2>
              <span className="text-sm text-gray-500">{activeIssues.length} active</span>
            </div>

            {activeIssues.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium">Perfect Grammar!</p>
                <p className="text-sm">No issues found in your text</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activeIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getIssueColor(issue.severity)} ${
                      selectedIssue?.id === issue.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        {getIssueIcon(issue.type, issue.severity)}
                        <div className="ml-2">
                          <span className="font-medium text-gray-900 capitalize">{issue.type}</span>
                          <div className="text-xs text-gray-500">{issue.subtype}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 capitalize">
                          {issue.severity}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center flex-wrap gap-1 text-sm">
                        <span className="text-gray-600">Replace</span>
                        <span className="font-mono bg-red-100 px-2 py-1 rounded text-red-700">
                          "{issue.text}"
                        </span>
                        <span className="text-gray-600">with</span>
                        <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-700">
                          "{issue.suggestion}"
                        </span>
                      </div>
                    </div>

                    {selectedIssue?.id === issue.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-700 mb-2">{issue.explanation}</p>
                        {showRuleExplanations && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <div className="flex items-center mb-1">
                              <BookOpen className="w-4 h-4 text-blue-600 mr-1" />
                              <span className="text-sm font-medium text-blue-700">Grammar Rule</span>
                            </div>
                            <p className="text-sm text-blue-600">{issue.rule}</p>
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); applyFix(issue); }}
                            className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                          >
                            Apply Fix
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); ignoreIssue(issue.id); }}
                            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            Ignore
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Ignored Issues */}
            {issues.some(i => i.ignored) && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ignored Issues</h4>
                <div className="space-y-2">
                  {issues.filter(i => i.ignored).map(issue => (
                    <div key={issue.id} className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      <span>{issue.type}: "{issue.text}" → "{issue.suggestion}"</span>
                      <button
                        onClick={() => acceptIssue(issue.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        Accept
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration Modal */}
        {showIntegrations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Platform Integrations</h3>
                  <button
                    onClick={() => setShowIntegrations(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {integrationPlatforms.map((platform, index) => {
                    const IconComponent = platform.icon;
                    return (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{platform.name}</h4>
                            <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
                            <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                              Install
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Multi-Platform Benefits</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Real-time grammar checking across all platforms</li>
                    <li>• Synchronized settings and personal dictionary</li>
                    <li>• Consistent writing style suggestions</li>
                    <li>• Offline functionality on mobile devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-Time Checking</h3>
            <p className="text-sm text-gray-600">Instant corrections as you type across all platforms</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Explanations</h3>
            <p className="text-sm text-gray-600">Learn grammar rules with every correction</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multi-Platform</h3>
            <p className="text-sm text-gray-600">Browser extensions, Word integration, and mobile apps</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarCheckerPage;
