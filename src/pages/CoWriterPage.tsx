import React, { useState } from 'react';
import SuperDocEditor from '../components/SuperDocEditor';
import { 
  FileText, 
  PenTool, 
  RefreshCw, 
  Quote, 
  BookOpen, 
  Search, 
  Lightbulb, 
  MessageSquare,
  Download,
  CheckCircle,
  Users,
  Target,
  HelpCircle,
  Database,
  Shield,
  Home,
  Layout,
  Eye,
  Settings,
  Share2,
  MessageCircle,
  Edit3,
  ChevronDown,
  X,
  RotateCcw,
  Flag,
  Menu,
  Zap,
  Globe,
  Clock
} from 'lucide-react';

function CoWriterPage() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

  const leftFeatures = [
    {
      category: "Essential Research Paper Features",
      items: [
        {
          number: 1,
          title: "Research Paper Templates",
          description: "Pre-structured sections: Abstract, Introduction, Literature Review, Methodology, Results, Discussion, Conclusion. AI guides users what to write in each part.",
          icon: <FileText className="w-4 h-4" />
        },
        {
          number: 2,
          title: "Academic Tone Optimizer",
          description: "AI rewrites text into formal academic style. Detects casual wording and suggests academic replacements.",
          icon: <PenTool className="w-4 h-4" />
        },
        {
          number: 3,
          title: "Plagiarism-Safe Rewriting",
          description: "Helps reduce similarity index by paraphrasing while preserving meaning.",
          icon: <RefreshCw className="w-4 h-4" />
        },
        {
          number: 4,
          title: "Citation & Reference Generator",
          description: "Auto-generate citations (APA, MLA, IEEE, Chicago, etc.). Turn plain text references into formatted bibliography.",
          icon: <Quote className="w-4 h-4" />
        }
      ]
    },
    {
      category: "Advanced AI-Powered Features",
      items: [
        {
          number: 5,
          title: "Smart Literature Summarizer",
          description: "Upload PDFs/journal articles → AI extracts key findings, contributions, and limitations. Saves hours of reading.",
          icon: <BookOpen className="w-4 h-4" />
        },
        {
          number: 6,
          title: "AI-Powered Citation Finder",
          description: "Suggests relevant papers and sources while writing. Integrates with PubMed, Semantic Scholar, CrossRef, or arXiv.",
          icon: <Search className="w-4 h-4" />
        },
        {
          number: 7,
          title: "Abstract & Title Generator",
          description: "Write the paper → AI suggests professional titles and concise abstracts.",
          icon: <Lightbulb className="w-4 h-4" />
        },
        {
          number: 8,
          title: "Results to Discussion Helper",
          description: "Input results/tables → AI drafts interpretations in academic language.",
          icon: <MessageSquare className="w-4 h-4" />
        }
      ]
    }
  ];

  const rightFeatures = [
    {
      category: "Productivity & Formatting Features",
      items: [
        {
          number: 9,
          title: "Journal Format Export",
          description: "Export directly in templates for IEEE, Elsevier, Springer, Nature, etc.",
          icon: <Download className="w-4 h-4" />
        },
        {
          number: 10,
          title: "Grammar, Style, & Clarity Checker (Academic-Focused)",
          description: "Detects passive voice, vague terms, and suggests precise alternatives.",
          icon: <CheckCircle className="w-4 h-4" />
        },
        {
          number: 11,
          title: "Track Changes in Word",
          description: "Show AI edits with 'accept/reject' just like a human editor.",
          icon: <Edit3 className="w-4 h-4" />
        },
        {
          number: 12,
          title: "Collaboration Mode",
          description: "Research groups can co-write with AI assistance in real time.",
          icon: <Users className="w-4 h-4" />
        }
      ]
    },
    {
      category: "Bonus Differentiators (Premium)",
      items: [
        {
          number: 13,
          title: "Research Gap Identifier",
          description: "From uploaded literature, AI highlights what hasn't been studied yet.",
          icon: <Target className="w-4 h-4" />
        },
        {
          number: 14,
          title: "Hypothesis & Question Generator",
          description: "Based on topic, AI suggests possible research questions/hypotheses.",
          icon: <HelpCircle className="w-4 h-4" />
        },
        {
          number: 15,
          title: "Data Interpretation Assistant",
          description: "Enter dataset/graph summary → AI generates descriptive analysis text.",
          icon: <Database className="w-4 h-4" />
        },
        {
          number: 16,
          title: "Plagiarism Checker Integration (via API)",
          description: "Show similarity index before submission.",
          icon: <Shield className="w-4 h-4" />
        }
      ]
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-blue-600 text-white px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>🌐 onedrive.live.com/personal/9fe3fa989213c861/...</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>Document...</span>
          <X className="w-4 h-4" />
        </div>
      </div>

      {/* Office Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Document</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <div className="flex items-center bg-gray-100 rounded px-3 py-1">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search for tools, help, and more (Alt + Q)"
                className="bg-transparent text-sm outline-none w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-blue-600 text-sm font-medium">Buy Microsoft 365</button>
            <Settings className="w-5 h-5 text-gray-600" />
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">N</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ribbon Menu */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-1">
          <div className="flex space-x-6 text-sm">
            <span className="text-gray-600">File</span>
            <span className="text-gray-900 font-medium border-b-2 border-blue-600 pb-2">Home</span>
            <span className="text-gray-600">Insert</span>
            <span className="text-gray-600">Layout</span>
            <span className="text-gray-600">References</span>
            <span className="text-gray-600">Review</span>
            <span className="text-gray-600">View</span>
            <span className="text-gray-600">Help</span>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Editore Tool</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">Comments</span>
            <button className="text-sm text-gray-600">Catch up</button>
            <button className="text-sm text-gray-600">Editing</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <div className="bg-green-50 border border-green-200 rounded p-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xs text-gray-600">Launch</div>
                <div className="text-xs font-medium">Editore Tool</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar - Features */}
        {leftSidebarOpen && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Editore Features</h3>
                <button onClick={() => setLeftSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-600">Essential & AI-Powered Tools</p>
            </div>
            
            <div className="flex-1 p-4 space-y-6">
              {leftFeatures.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    {category.category}
                  </h4>
                  <div className="space-y-3">
                    {category.items.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 text-sm mb-1">
                            {feature.number}. {feature.title}
                          </h5>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Document Area */}
        <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
          <SuperDocEditor />
        </div>

        {/* Right Sidebar - More Features */}
        {rightSidebarOpen && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Advanced Tools</h3>
                <button onClick={() => setRightSidebarOpen(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-600">Productivity & Premium Features</p>
            </div>
            
            <div className="flex-1 p-4 space-y-6">
              {rightFeatures.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    {category.category}
                  </h4>
                  <div className="space-y-3">
                    {category.items.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          {feature.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-gray-900 text-sm mb-1">
                            {feature.number}. {feature.title}
                          </h5>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Grammar Checker Section */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Grammar Checker</span>
                <div className="ml-auto flex items-center">
                  <Flag className="w-4 h-4 mr-1" />
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <span>Real-time checking</span>
                <div className="ml-auto">
                  <div className="w-8 h-4 bg-green-500 rounded-full relative">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                  </div>
                </div>
              </div>

              <div className="text-center py-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1 text-sm">Select text to check</h4>
                <p className="text-xs text-gray-600">Only the text you select will be checked</p>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:bg-blue-50 p-2 rounded">
                <Edit3 className="w-4 h-4" />
                <span className="text-sm">Open Paraphraser</span>
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                For a better experience, <span className="text-blue-600">log in</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-blue-600 text-white px-4 py-1 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span>Page 1 of 1</span>
          <span>156 words</span>
          <span>English (U.S.)</span>
          <span>Editor Suggestions: Showing</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>100%</span>
          <Eye className="w-4 h-4" />
          <span>Fit</span>
          <span>Give Feedback to Microsoft</span>
          <span>11:48 AM</span>
          <span>9/19/2025</span>
        </div>
      </div>

      {/* Toggle buttons for collapsed sidebars */}
      {!leftSidebarOpen && (
        <button 
          onClick={() => setLeftSidebarOpen(true)}
          className="fixed left-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-2 rounded-r-lg shadow-lg z-10"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}
      
      {!rightSidebarOpen && (
        <button 
          onClick={() => setRightSidebarOpen(true)}
          className="fixed right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-l-lg shadow-lg z-10"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default CoWriterPage;
