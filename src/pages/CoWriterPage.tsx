import React, { useState, useRef, useEffect } from 'react';
import { Edit, Lightbulb, Zap, Save, Download, Settings, Users } from 'lucide-react';

interface Suggestion {
  id: number;
  type: 'completion' | 'improvement' | 'idea';
  text: string;
  position: number;
}

const CoWriterPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [writingMode, setWritingMode] = useState('creative');
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const writingModes = [
    { id: 'creative', name: 'Creative', description: 'Imaginative and expressive writing' },
    { id: 'professional', name: 'Professional', description: 'Business and formal writing' },
    { id: 'academic', name: 'Academic', description: 'Research and scholarly writing' },
    { id: 'casual', name: 'Casual', description: 'Conversational and informal writing' }
  ];

  const generateSuggestions = async () => {
    if (!content.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI suggestions
    setTimeout(() => {
      const mockSuggestions: Suggestion[] = [
        {
          id: 1,
          type: 'completion',
          text: 'Furthermore, this approach allows for greater flexibility in implementation.',
          position: content.length
        },
        {
          id: 2,
          type: 'improvement',
          text: 'Consider rephrasing this sentence for better clarity.',
          position: Math.max(0, content.length - 50)
        },
        {
          id: 3,
          type: 'idea',
          text: 'You might want to add an example here to illustrate your point.',
          position: content.length
        }
      ];
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1500);
  };

  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.type === 'completion') {
      setContent(content + ' ' + suggestion.text);
    } else if (suggestion.type === 'improvement') {
      // For demo purposes, just append the suggestion
      setContent(content + ' [Improved: ' + suggestion.text + ']');
    }
    setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
    setSelectedSuggestion(null);
  };

  const handleSave = () => {
    localStorage.setItem('cowriter-content', content);
    alert('Content saved locally!');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'co-writer-document.txt';
    a.click();
  };

  useEffect(() => {
    // Load saved content
    const saved = localStorage.getItem('cowriter-content');
    if (saved) {
      setContent(saved);
    }
  }, []);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'completion': return <Edit className="w-4 h-4" />;
      case 'improvement': return <Zap className="w-4 h-4" />;
      case 'idea': return <Lightbulb className="w-4 h-4" />;
      default: return <Edit className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'completion': return 'border-blue-200 bg-blue-50 text-blue-700';
      case 'improvement': return 'border-green-200 bg-green-50 text-green-700';
      case 'idea': return 'border-yellow-200 bg-yellow-50 text-yellow-700';
      default: return 'border-gray-200 bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl mb-6">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Co-Writer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered writing assistant for collaborative content creation. 
            Get real-time suggestions, improvements, and creative ideas.
          </p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Settings className="w-5 h-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Writing Mode:</span>
              </div>
              <select
                value={writingMode}
                onChange={(e) => setWritingMode(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {writingModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={generateSuggestions}
                disabled={!content.trim() || isGenerating}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Get Suggestions
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Writing Area */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Document</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{content.length} characters</span>
                <span>{content.split(' ').filter(w => w).length} words</span>
                <span>{content.split('\n').length} lines</span>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your content here. The AI will provide suggestions and help you improve your writing as you go..."
              className="w-full h-96 p-6 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-lg leading-relaxed"
            />

            {/* Writing Stats */}
            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-violet-50 rounded-xl">
                <div className="text-lg font-bold text-violet-600">
                  {Math.ceil(content.split(' ').filter(w => w).length / 200)}
                </div>
                <div className="text-xs text-violet-600">Pages</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-xl">
                <div className="text-lg font-bold text-purple-600">
                  {content.split('.').filter(s => s.trim()).length}
                </div>
                <div className="text-xs text-purple-600">Sentences</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="text-lg font-bold text-blue-600">
                  {content.split('\n\n').filter(p => p.trim()).length}
                </div>
                <div className="text-xs text-blue-600">Paragraphs</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="text-lg font-bold text-green-600">
                  {Math.ceil(content.split(' ').filter(w => w).length / 200)}
                </div>
                <div className="text-xs text-green-600">Read Time (min)</div>
              </div>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-violet-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">AI Suggestions</h2>
            </div>
            
            {suggestions.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <Lightbulb className="w-12 h-12 mx-auto mb-4" />
                <p className="text-sm">Write some content and click "Get Suggestions" to see AI recommendations</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${getSuggestionColor(suggestion.type)} ${
                      selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-violet-500' : ''
                    }`}
                    onClick={() => setSelectedSuggestion(suggestion)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        {getSuggestionIcon(suggestion.type)}
                        <span className="ml-2 font-semibold capitalize text-sm">
                          {suggestion.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3 leading-relaxed">{suggestion.text}</p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applySuggestion(suggestion);
                      }}
                      className="w-full px-3 py-2 bg-white/80 hover:bg-white rounded-lg transition-colors text-sm font-medium"
                    >
                      Apply Suggestion
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Writing Tips */}
            <div className="mt-8 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">💡 Writing Tip</h3>
              <p className="text-sm text-gray-600">
                {writingMode === 'creative' && "Use vivid imagery and emotional language to engage your readers."}
                {writingMode === 'professional' && "Keep sentences clear and concise. Use active voice when possible."}
                {writingMode === 'academic' && "Support your arguments with evidence and maintain formal tone."}
                {writingMode === 'casual' && "Write as if you're talking to a friend. Use contractions and simple words."}
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Edit className="w-6 h-6 text-violet-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Assistance</h3>
            <p className="text-gray-600 text-sm">Get AI suggestions and improvements as you write</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Creative Ideas</h3>
            <p className="text-gray-600 text-sm">Overcome writer's block with AI-generated ideas</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Adaptive Modes</h3>
            <p className="text-gray-600 text-sm">Switch between writing styles for different contexts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoWriterPage;