import React, { useState } from 'react';
import SuperDocEditor from '../components/SuperDocEditor';

import { 
  FileText, 
  BookOpen, 
  Search, 
  Zap, 
  CheckCircle, 
  Users, 
  Download,
  Brain,
  Target,
  BarChart3,
  Shield,
  Lightbulb,
  Quote,
  Settings,
  Play,
  Edit3,
  Eye,
  ChevronRight,
  Sparkles,
  RefreshCw,
  PenTool,
  Star,
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Table,
  MoreHorizontal,
  X,
  Menu,
  Home,
  Layout,
  Type,
  HelpCircle,
  MessageSquare,
  Share2,
  Printer,
  Copy,
  Scissors,
  Clipboard,
  ChevronDown,
  Globe,
  Clock,
  User
} from 'lucide-react';

function CoWriterPage() {
  const [activeTab, setActiveTab] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [grammarChecking, setGrammarChecking] = useState(true);
  const [toneOptimizerOpen, setToneOptimizerOpen] = useState(false);

  const menuTabs = [
    { name: 'File', icon: FileText },
    { name: 'Home', icon: Home },
    { name: 'Insert', icon: Layout },
    { name: 'Layout', icon: Type },
    { name: 'References', icon: Quote },
    { name: 'Review', icon: Eye },
    { name: 'View', icon: Settings },
    { name: 'Help', icon: HelpCircle },
    { name: 'ResearchBot', icon: Brain, special: true }
  ];

  const homeTools = [
    { name: 'Save', icon: Save, group: 'file' },
    { name: 'Undo', icon: Undo, group: 'edit' },
    { name: 'Redo', icon: Redo, group: 'edit' },
    { name: 'Copy', icon: Copy, group: 'clipboard' },
    { name: 'Cut', icon: Scissors, group: 'clipboard' },
    { name: 'Paste', icon: Clipboard, group: 'clipboard' },
    { name: 'Bold', icon: Bold, group: 'format' },
    { name: 'Italic', icon: Italic, group: 'format' },
    { name: 'Underline', icon: Underline, group: 'format' },
    { name: 'Left', icon: AlignLeft, group: 'align' },
    { name: 'Center', icon: AlignCenter, group: 'align' },
    { name: 'Right', icon: AlignRight, group: 'align' },
    { name: 'Bullets', icon: List, group: 'list' },
    { name: 'Numbers', icon: ListOrdered, group: 'list' }
  ];

  const researchBotTools = [
    { name: 'Paper Templates', icon: FileText, description: 'Pre-structured sections with AI guidance', color: 'bg-blue-500', action: 'paperTemplate' },
    { name: 'Tone Optimizer', icon: Edit3, description: 'Convert to formal academic style', color: 'bg-green-500' },
    { name: 'Paraphraser', icon: RefreshCw, description: 'Plagiarism-safe rewriting', color: 'bg-purple-500' },
    { name: 'Citations', icon: Quote, description: 'Auto-generate APA, MLA, IEEE formats', color: 'bg-indigo-500' },
    { name: 'Literature Summarizer', icon: BookOpen, description: 'Extract key findings from PDFs', color: 'bg-teal-500' },
    { name: 'Citation Finder', icon: Search, description: 'Find relevant papers automatically', color: 'bg-orange-500' },
    { name: 'Title Generator', icon: Sparkles, description: 'AI-suggested titles and abstracts', color: 'bg-pink-500' },
    { name: 'Results Helper', icon: BarChart3, description: 'Convert results to discussion', color: 'bg-cyan-500' },
    { name: 'Format Export', icon: Download, description: 'Export to journal templates', color: 'bg-emerald-500' },
    { name: 'Grammar Check', icon: CheckCircle, description: 'Academic-focused corrections', color: 'bg-red-500' },
    { name: 'Track Changes', icon: Eye, description: 'Show AI edits with accept/reject', color: 'bg-violet-500' },
    { name: 'Collaboration', icon: Users, description: 'Real-time co-writing', color: 'bg-amber-500' }
  ];

  const premiumTools = [
    { name: 'Research Gaps', icon: Target, description: 'Identify unstudied areas', color: 'bg-rose-500', premium: true },
    { name: 'Hypothesis Generator', icon: Lightbulb, description: 'AI research questions', color: 'bg-lime-500', premium: true },
    { name: 'Data Interpreter', icon: Brain, description: 'Generate analysis text', color: 'bg-sky-500', premium: true },
    { name: 'Plagiarism Check', icon: Shield, description: 'Similarity index checker', color: 'bg-slate-500', premium: true }
  ];

  // Handle research bot tool clicks
  const handleToolClick = (toolName, action) => {
    if (action === 'paperTemplate') {
      // Call the paper template function from SuperDocEditor
      if ((window).loadPaperTemplate) {
        (window).loadPaperTemplate();
      }
    } else if (toolName === 'Tone Optimizer') {
      setToneOptimizerOpen(true);
    }
    // Add other tool actions here as needed
  };

  // Handle tone optimizer changes
  const handleToneOptimizerApply = (originalText, optimizedText) => {
    // In a real implementation, you would replace the text in the document
    console.log('Applying tone optimization:', { originalText, optimizedText });
    // For now, we'll just log it - you could integrate this with the SuperDocEditor
  };

  const ToolGroup = ({ title, tools, className = "" }) => (
    <div className={`border-r border-gray-200 px-2 last:border-r-0 ${className}`}>
      <div className="text-xs text-gray-600 mb-1 font-medium">{title}</div>
      <div className="flex space-x-1">
        {tools.map((tool, index) => (
          <button
            key={index}
            className="p-2 hover:bg-gray-100 rounded transition-colors flex flex-col items-center min-w-[40px]"
            title={tool.name}
          >
            <tool.icon size={16} className="text-gray-700" />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white px-4 py-1 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-1 rounded">
              <Brain size={16} />
            </div>
            <span className="font-semibold hidden sm:inline">ResearchBot AI</span>
            <span className="font-semibold sm:hidden">RB AI</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Document1</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs hidden sm:inline">Saved</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <button className="hover:bg-blue-700 px-2 py-1 rounded text-xs hidden md:inline">Comments</button>
          <button className="hover:bg-blue-700 px-2 py-1 rounded text-xs">Share</button>
          <div className="flex items-center space-x-2">
            <User size={16} />
            <span className="text-xs hidden sm:inline">John Doe</span>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-2 md:px-4 overflow-x-auto">
          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden mr-2 hover:bg-gray-100 rounded"
          >
            <Menu size={20} />
          </button>
          
          {/* Desktop menu */}
          <div className="hidden md:flex">
            {menuTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.name
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${tab.special ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon size={16} />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex overflow-x-auto space-x-1">
            {menuTabs.slice(0, 4).map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.name
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                } ${tab.special ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <tab.icon size={16} />
                  <span className="text-xs">{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 p-2">
            <div className="grid grid-cols-2 gap-2">
              {menuTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 text-sm font-medium rounded transition-colors ${
                    activeTab === tab.name
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${tab.special ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-2 md:px-4 py-2 overflow-x-auto">
        {activeTab === 'Home' && (
          <div className="flex items-center space-x-2 md:space-x-4 min-w-max">
            <ToolGroup title="File" tools={homeTools.filter(t => t.group === 'file')} />
            <ToolGroup title="Clipboard" tools={homeTools.filter(t => t.group === 'clipboard')} />
            <ToolGroup title="Font" tools={homeTools.filter(t => t.group === 'format')} />
            <ToolGroup title="Paragraph" tools={homeTools.filter(t => t.group === 'align' || t.group === 'list')} />
          </div>
        )}

        {activeTab === 'ResearchBot' && (
          <div className="space-y-6">
            {/* Main Research Tools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Core Research Tools</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {researchBotTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => handleToolClick(tool.name, tool.action)}
                    className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <div className={`${tool.color} text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform`}>
                      <tool.icon size={20} />
                    </div>
                    <span className="text-xs font-medium text-gray-800 text-center">{tool.name}</span>
                    <span className="text-xs text-gray-500 text-center mt-1 leading-tight hidden sm:block">{tool.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Tools */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Star className="text-yellow-500" size={16} />
                <h3 className="text-sm font-semibold text-gray-700">Premium Research Tools</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">PRO</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {premiumTools.map((tool, index) => (
                  <button
                    key={index}
                    className="flex flex-col items-center p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all group relative"
                  >
                    <div className={`${tool.color} text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform relative`}>
                      <tool.icon size={20} />
                      <Star className="absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full p-0.5" size={12} />
                    </div>
                    <span className="text-xs font-medium text-gray-800 text-center">{tool.name}</span>
                    <span className="text-xs text-gray-600 text-center mt-1 leading-tight hidden sm:block">{tool.description}</span>
                  </button>
                ))}
              </div>
              
              {/* Upgrade Banner */}
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-sm sm:text-base">Unlock Premium Research Tools</h4>
                    <p className="text-xs text-purple-100">Advanced AI features for serious researchers</p>
                  </div>
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Document Area */}
        <div className="flex-1 bg-gray-100 p-2 md:p-8 overflow-y-auto">
          <SuperDocEditor onPaperTemplateClick={() => {}} />
        </div>

        {/* Right Sidebar - AI Assistant */}
        {sidebarOpen && (
          <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col max-h-96 lg:max-h-none">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Brain size={20} />
                </div>
                <span className="font-semibold text-gray-900">AI Assistant</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Grammar Checker Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="font-medium text-gray-900">Grammar Checker</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">Real-time</span>
                  <button 
                    onClick={() => setGrammarChecking(!grammarChecking)}
                    className={`w-10 h-6 rounded-full transition-colors ${grammarChecking ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${grammarChecking ? 'translate-x-5' : 'translate-x-1'} mt-1`}></div>
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                3 suggestions available
              </div>
              <div className="space-y-2">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800 mb-1">
                        Consider replacing "revolutionized" with more formal academic language
                      </p>
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                          Accept
                        </button>
                        <button className="text-xs border border-gray-300 px-2 py-1 rounded hover:bg-gray-50">
                          Ignore
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-3">Quick Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setToneOptimizerOpen(true)}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="text-blue-600 mb-1" size={16} />
                  <span className="text-xs text-blue-800 block">Tone Optimizer</span>
                </button>
                <button 
                  onClick={() => handleToolClick('Paraphraser')}
                  className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <RefreshCw className="text-purple-600 mb-1" size={16} />
                  <span className="text-xs text-purple-800 block">Paraphraser</span>
                </button>
                <button className="p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors">
                  <Quote className="text-green-600 mb-1" size={16} />
                  <span className="text-xs text-green-800 block">Citations</span>
                </button>
                <button className="p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors">
                  <Search className="text-orange-600 mb-1" size={16} />
                  <span className="text-xs text-orange-800 block">Find Sources</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 bottom-4 lg:top-1/2 lg:transform lg:-translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
          >
            <Brain size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CoWriterPage;
