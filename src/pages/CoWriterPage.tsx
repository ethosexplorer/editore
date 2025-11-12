import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react';
import { 
  FileText, BookOpen, Search, Zap, CheckCircle, Users, Download, Brain,
  Target, BarChart3, Shield, Lightbulb, Quote, Settings, Play, Edit3,
  Eye, ChevronRight, Sparkles, RefreshCw, PenTool, Star, Save, Undo,
  Redo, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link, Image, Table, MoreHorizontal, X, Menu, Home,
  Layout, Type, HelpCircle, MessageSquare, Share2, Printer, Copy,
  Scissors, Clipboard, ChevronDown, Globe, Clock, User, ChevronUp,
  Loader2, AlertCircle, Check, Upload, Database, TrendingUp, MapPin
} from 'lucide-react';

// Paper Templates
const PAPER_TEMPLATES = {
  ieee: `<div style="column-count: 2; column-gap: 20px; font-family: 'Times New Roman', serif; font-size: 10pt;">
<h1 style="text-align: center; column-span: all; font-size: 14pt; margin-bottom: 12pt;">Title of Your Research Paper</h1>
<div style="text-align: center; column-span: all; margin-bottom: 12pt;">
<strong>Author Name¹, Co-Author Name²</strong><br>
¹Department, University, City, Country<br>
²Department, University, City, Country<br>
Email: author@email.com
</div>
<p style="font-weight: bold;">Abstract—</p>
<p style="text-align: justify; margin-bottom: 12pt;"><em>[AI Guidance: Write a 150-250 word abstract in a single paragraph. Start with the problem, describe your approach, summarize results, and state conclusions. Use past tense for completed work, present tense for general truths.]</em></p>
<h2 style="font-size: 12pt; margin-top: 12pt;">I. INTRODUCTION</h2>
<p style="text-align: justify;"><em>[AI Guidance: Start with broad context, narrow to specific problem. Include: (1) Background, (2) Problem statement, (3) Research objectives, (4) Paper organization.]</em></p>
</div>`,
  apa: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
<h1 style="text-align: center; font-size: 14pt; font-weight: bold;">Title of Your Research Paper</h1>
<div style="text-align: center; margin-bottom: 24pt;">
<strong>Your Name</strong><br>
Department, University
</div>
<h2 style="font-size: 12pt; font-weight: bold;">Abstract</h2>
<p><em>[AI Guidance: Write 150-250 words in a single paragraph. Include research topic, questions, participants, methods, findings, and implications.]</em></p>
<h2 style="font-size: 12pt; font-weight: bold;">Introduction</h2>
<p><em>[AI Guidance: Begin with an attention-grabbing opening. Provide background, state the problem, and explain significance.]</em></p>
</div>`,
  mla: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 2;">
<h1 style="text-align: center; font-size: 14pt;">Title of Your Research Paper</h1>
<p><em>[AI Guidance: Start your introduction with an engaging hook. Provide context, state your thesis clearly, and outline main arguments. MLA uses present tense for discussing literature.]</em></p>
</div>`,
  chicago: `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5;">
<h1 style="text-align: center; font-size: 14pt;">Title of Your Research Paper</h1>
<div style="text-align: center; margin-bottom: 24pt;">
<p>By<br><strong>Your Name</strong></p>
</div>
<h2 style="font-size: 12pt; font-weight: bold;">Abstract</h2>
<p><em>[AI Guidance: Write 150-300 words. Single paragraph summarizing research question, methodology, key findings, and conclusions.]</em></p>
</div>`
};

// Load TinyMCE
const loadTinyMCE = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).tinymce) {
      resolve((window as any).tinymce);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
    script.referrerPolicy = 'origin';
    script.onload = () => resolve((window as any).tinymce);
    script.onerror = () => reject(new Error('Failed to load TinyMCE'));
    document.head.appendChild(script);
  });
};

// SuperDocEditor Component
const SuperDocEditor = forwardRef((props: any, ref) => {
  const [docContent, setDocContent] = useState('');
  const [fileName, setFileName] = useState('research-paper.docx');
  const [showFormatSelector, setShowFormatSelector] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'ieee' | 'apa' | 'mla' | 'chicago'>('apa');
  const [tinyMCELoaded, setTinyMCELoaded] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef<any>(null);

  const formats = [
    { id: 'ieee' as const, name: 'IEEE', description: 'Two-column, numbered citations', color: 'from-blue-500 to-cyan-500' },
    { id: 'apa' as const, name: 'APA', description: '(Author, Year) citations', color: 'from-purple-500 to-pink-500' },
    { id: 'mla' as const, name: 'MLA', description: '(Author Page#) citations', color: 'from-green-500 to-emerald-500' },
    { id: 'chicago' as const, name: 'Chicago', description: 'Footnote citations', color: 'from-orange-500 to-red-500' },
  ];

  useEffect(() => {
    loadTinyMCE()
      .then((tinymce) => {
        setTinyMCELoaded(true);
        tinymce.init({
          selector: '#tiny-editor',
          height: '100%',
          menubar: false,
          plugins: ['advlist', 'autolink', 'lists', 'link', 'charmap', 'preview', 'searchreplace', 'code', 'insertdatetime', 'table', 'wordcount'],
          toolbar: 'undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | removeformat',
          content_style: 'body { font-family: Times New Roman, serif; font-size: 12pt; line-height: 1.6; padding: 20px; }',
          setup: (editor: any) => {
            editorRef.current = editor;
            editor.on('init', () => {
              if (docContent) editor.setContent(docContent);
            });
            editor.on('change', () => setDocContent(editor.getContent()));
          }
        });
      })
      .catch(console.error);

    return () => {
      if (editorRef.current) editorRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && tinyMCELoaded && docContent) {
      editorRef.current.setContent(docContent);
    }
  }, [docContent, tinyMCELoaded]);

  useImperativeHandle(ref, () => ({
    replaceSelection: (text: string) => {
      if (editorRef.current) {
        editorRef.current.insertContent(`<p>${text}</p>`);
      }
    },
    insertCitation: (citation: any) => {
      if (editorRef.current) {
        editorRef.current.insertContent(`<p>[${citation.fullCitation}]</p>`);
      }
    },
    getSelectedText: () => editorRef.current?.selection.getContent({ format: 'text' }) || '',
    clearContent: () => editorRef.current?.setContent(''),
    getContent: () => editorRef.current?.getContent() || '',
    setContent: (content: string) => editorRef.current?.setContent(content)
  }));

  const loadTemplateWithFormat = (formatId: 'ieee' | 'apa' | 'mla' | 'chicago') => {
    setSelectedFormat(formatId);
    setDocContent(PAPER_TEMPLATES[formatId]);
    setFileName(`research-paper-${formatId}.docx`);
    setShowFormatSelector(false);
  };

  const handleSave = () => {
    if (!editorRef.current) return;
    const content = editorRef.current.getContent();
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.\w+$/, '.html');
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');
    setFileName(file.name);

    try {
      const text = await file.text();
      const htmlContent = text.split('\n').map(line => 
        line.trim() ? `<p>${line.trim()}</p>` : '<br>'
      ).join('');
      setDocContent(htmlContent);
    } catch (error) {
      setUploadError('Failed to read file');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">{fileName}</span>
          {isUploading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowFormatSelector(!showFormatSelector)}
            className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Layout className="w-3 h-3" />
            <span>Template</span>
          </button>
          <label className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>Upload</span>
            <input type="file" accept=".txt,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>
          <button onClick={handleSave} className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
            <Save className="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Format Selector */}
      {showFormatSelector && (
        <div className="bg-gray-50 border-b border-gray-200 p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold">Select Format</h3>
            <button onClick={() => setShowFormatSelector(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => loadTemplateWithFormat(format.id)}
                className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-300 bg-white transition-all"
              >
                <div className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${format.color} text-white mb-1`}>
                  {format.name}
                </div>
                <div className="text-xs text-gray-600">{format.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-50 border-b border-red-200 p-2 flex items-center space-x-2 flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-xs text-red-700">{uploadError}</span>
          <button onClick={() => setUploadError('')} className="ml-auto text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editor */}
      <div className="flex-1 bg-gray-100 p-3 overflow-hidden min-h-0">
        <div className="bg-white rounded shadow-lg h-full overflow-hidden">
          {!tinyMCELoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading editor...</p>
              </div>
            </div>
          ) : (
            <textarea id="tiny-editor" className="hidden"></textarea>
          )}
        </div>
      </div>
    </div>
  );
});

SuperDocEditor.displayName = 'SuperDocEditor';

function CoWriterPage() {
  const [activeTab, setActiveTab] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [researchBotOpen, setResearchBotOpen] = useState(false); // NEW: Toggle state
  const editorRef = useRef<any>(null);

  const menuTabs = [
    { name: 'File', icon: FileText },
    { name: 'Home', icon: Home },
    { name: 'Insert', icon: Layout },
    { name: 'Layout', icon: Type },
    { name: 'References', icon: Quote },
    { name: 'Review', icon: Eye },
    { name: 'View', icon: Settings },
    { name: 'Help', icon: HelpCircle },
  ];

  // ResearchBot is now separate as a toggle button
  const handleResearchBotToggle = () => {
    setResearchBotOpen(!researchBotOpen);
    setActiveTab('Home'); // Reset active tab when toggling
  };

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
    { name: 'Summarize', icon: Zap, description: 'AI-powered text summarization', color: 'bg-yellow-500' },
    { name: 'Paper Templates', icon: FileText, description: 'Pre-structured sections', color: 'bg-blue-500' },
    { name: 'Tone Optimizer', icon: Edit3, description: 'Formal academic style', color: 'bg-green-500' },
    { name: 'Paraphraser', icon: RefreshCw, description: 'Plagiarism-safe rewriting', color: 'bg-purple-500' },
    { name: 'Grammar Check', icon: CheckCircle, description: 'Academic corrections', color: 'bg-red-500' },
    { name: 'Humanize', icon: Users, description: 'Make AI text human', color: 'bg-pink-500' },
    { name: 'Citations', icon: Quote, description: 'Auto-generate formats', color: 'bg-indigo-500' },
    { name: 'AI Detector', icon: Shield, description: 'Check AI-generated', color: 'bg-gray-500' },
    { name: 'DataSet Assistant', icon: Download, description: 'Upload & Visualize', color: 'bg-orange-500' },
    { name: 'Journal Export', icon: Download, description: 'Export templates', color: 'bg-emerald-500' }
  ];

  const premiumTools = [
    { name: 'Citations Finder', icon: Search, description: 'AI suggests papers', color: 'bg-indigo-500' },
    { name: 'Plagiarism Check', icon: Shield, description: 'Similarity checker', color: 'bg-slate-500' },
    { name: 'Research Gaps', icon: Target, description: 'Identify unstudied areas', color: 'bg-rose-500' },
    { name: 'Research Questions', icon: Lightbulb, description: 'AI research questions', color: 'bg-lime-500' },
    { name: 'Journal Matcher', icon: MapPin, description: 'Best publication outlets', color: 'bg-cyan-500' },
  ];

  const ToolGroup = ({ title, tools }: { title: string; tools: any[] }) => (
    <div className="border-r border-gray-200 px-2 last:border-r-0">
      <div className="text-xs text-gray-600 mb-1 font-medium hidden sm:block">{title}</div>
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
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex items-center space-x-3">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <span className="text-gray-700">Processing...</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-blue-600 text-white px-4 py-1.5 flex items-center justify-between text-sm flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="bg-white text-blue-600 p-1 rounded">
            <Brain size={16} />
          </div>
          <span className="font-semibold">ResearchBot AI</span>
          <span className="hidden sm:inline">• Document1</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="hover:bg-blue-700 px-2 py-1 rounded text-xs">Share</button>
          <div className="flex items-center space-x-1">
            <User size={16} />
            <span className="text-xs hidden sm:inline">John</span>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between px-2 sm:px-4">
          <div className="flex items-center overflow-x-auto scrollbar-hide">
            {menuTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.name
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon size={16} />
                  <span className="hidden md:inline">{tab.name}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* ResearchBot Toggle Button */}
          <button
            onClick={handleResearchBotToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ml-2 flex-shrink-0 ${
              researchBotOpen
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
            }`}
          >
            <Brain size={18} />
            <span className="hidden sm:inline">ResearchBot</span>
            {researchBotOpen && <Check size={16} />}
          </button>
        </div>
      </div>

      {/* Toolbar - FIXED HEIGHT, NO VERTICAL SCROLL */}
      <div className="bg-gray-50 border-b border-gray-200 flex-shrink-0" style={{ maxHeight: '200px' }}>
        {activeTab === 'Home' && !researchBotOpen && (
          <div className="px-4 py-2 overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <ToolGroup title="File" tools={homeTools.filter(t => t.group === 'file')} />
              <ToolGroup title="Clipboard" tools={homeTools.filter(t => t.group === 'clipboard')} />
              <ToolGroup title="Font" tools={homeTools.filter(t => t.group === 'format')} />
              <ToolGroup title="Paragraph" tools={homeTools.filter(t => t.group === 'align' || t.group === 'list')} />
            </div>
          </div>
        )}

        {researchBotOpen && (
          <div className="h-full overflow-x-auto overflow-y-hidden px-4 py-3">
            <div className="flex space-x-4 min-w-max">
              {/* Core Research Tools - Horizontal Scroll */}
              <div className="flex-shrink-0">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Core Tools</h3>
                <div className="flex space-x-2">
                  {researchBotTools.map((tool, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all w-24 flex-shrink-0"
                    >
                      <div className={`${tool.color} text-white p-1.5 rounded-lg mb-1`}>
                        <tool.icon size={16} />
                      </div>
                      <span className="text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Premium Tools - Horizontal Scroll */}
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="text-yellow-500" size={12} />
                  <h3 className="text-xs font-semibold text-gray-700">Premium</h3>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded-full font-medium">PRO</span>
                </div>
                <div className="flex space-x-2">
                  {premiumTools.map((tool, index) => (
                    <button
                      key={index}
                      className="flex flex-col items-center p-2 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all w-24 flex-shrink-0 relative"
                    >
                      <div className={`${tool.color} text-white p-1.5 rounded-lg mb-1 relative`}>
                        <tool.icon size={16} />
                        <Star className="absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full p-0.5" size={8} />
                      </div>
                      <span className="text-xs font-medium text-gray-800 text-center leading-tight line-clamp-2">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upgrade CTA - Compact */}
              <div className="flex-shrink-0 w-64">
                <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-3 flex flex-col justify-center">
                  <h4 className="font-semibold text-xs mb-1">Unlock Premium</h4>
                  <p className="text-xs text-purple-100 mb-2">Advanced AI features</p>
                  <button className="bg-white text-purple-600 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100">
                    Start Free Trial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show message when other tabs are selected and ResearchBot is not open */}
        {activeTab !== 'Home' && !researchBotOpen && (
          <div className="px-4 py-3 text-center text-sm text-gray-500">
            {activeTab} tools will appear here
          </div>
        )}
      </div>

      {/* Main Content Area - FILLS REMAINING HEIGHT */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Document Area */}
        <div className="flex-1 overflow-hidden min-w-0">
          <SuperDocEditor ref={editorRef} />
        </div>

        {/* Desktop Right Sidebar - FULL HEIGHT, INTERNAL SCROLL ONLY */}
        {sidebarOpen && (
          <div className="hidden sm:flex w-80 bg-white border-l border-gray-200 flex-col flex-shrink-0 overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
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

            {/* Sidebar Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
              <h3 className="font-medium text-gray-900 mb-3">Quick Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                  <Edit3 className="text-blue-600 mb-1" size={16} />
                  <span className="text-xs text-blue-800 block">Tone Optimizer</span>
                </button>
                <button className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors">
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
                <button className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                  <Zap className="text-yellow-600 mb-1" size={16} />
                  <span className="text-xs text-yellow-800 block">Summarize</span>
                </button>
                <button className="p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors">
                  <Users className="text-pink-600 mb-1" size={16} />
                  <span className="text-xs text-pink-800 block">Humanize</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Toggle Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 hidden sm:flex"
          >
            <Brain size={20} />
          </button>
        )}

        {/* Mobile AI Assistant Toggle */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 bottom-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 sm:hidden"
          >
            <Brain size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default CoWriterPage;