import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
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
  User,
  ChevronUp,
  Loader2,
  AlertCircle,
  Check,
  Upload,
  Database,
  TrendingUp,
  MapPin
} from 'lucide-react';

// Define TypeScript interfaces
interface GrammarIssue {
  type: string;
  subtype: string;
  severity: 'error' | 'warning' | 'suggestion';
  text: string;
  suggestion: string;
  explanation: string;
  rule: string;
  position: {
    start: number;
    end: number;
  };
  message?: string; // Some APIs might return message instead of explanation
}

interface ToneOptimizerState {
  original: string;
  optimized: string;
  open: boolean;
}

interface ParaphraserState {
  original: string;
  paraphrased: string;
  open: boolean;
}

interface CitationResult {
  fullCitation: string;
  inTextCitation: string;
  format: string;
  sourceType: string;
  verified: boolean;
}

interface CitationItem {
  author: string;
  title: string;
  journal: string;
  year: string;
  doi: string;
  relevance: number;
}

interface CitationFinderResult {
  citations: CitationItem[];
  query: string;
  field: string;
  totalFound: number;
  processingTime: number;
}

// New interfaces for premium tools
interface ResearchGap {
  id: string;
  topic: string;
  description: string;
  potentialImpact: 'high' | 'medium' | 'low';
  methodology: string[];
  keywords: string[];
}

interface ResearchQuestion {
  id: string;
  question: string;
  type: 'descriptive' | 'comparative' | 'causal' | 'exploratory';
  complexity: 'basic' | 'intermediate' | 'advanced';
  methodology: string[];
}

interface JournalConference {
  id: string;
  name: string;
  type: 'journal' | 'conference';
  impactFactor?: number;
  acceptanceRate: string;
  focusAreas: string[];
  publisher: string;
  matchScore: number;
  deadline?: string;
  website: string;
}

interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  source: string;
  variables: string[];
  uploadDate: string;
}

// Extend the Window interface to include loadPaperTemplate
declare global {
  interface Window {
    loadPaperTemplate?: () => void;
  }
}

// Create a wrapper component that can expose methods
interface EditorWrapperRef {
  replaceSelection: (text: string) => void;
  insertCitation: (citation: CitationResult) => void;
  getSelectedText: () => string;
  clearContent: () => void;
}

interface EditorWrapperProps {
  onPaperTemplateClick: () => void;
  onTextSelect?: (text: string) => void;
}

const EditorWrapper = forwardRef<EditorWrapperRef, EditorWrapperProps>((props, ref) => {
  const editorRef = useRef<any>(null);
  
  // Function to clear editor content
  const clearContent = useCallback(() => {
    // This would need to be implemented based on your SuperDocEditor API
    // For now, we'll use a simple approach
    if (editorRef.current) {
      // If SuperDocEditor has a clear method, call it
      // Otherwise, we'll need to implement this differently
      console.log('Clear editor content');
    }
  }, []);

  useImperativeHandle(ref, () => ({
    replaceSelection: (text: string) => {
      // For now, we'll use a simple approach to insert text
      // In a real implementation, you would integrate with your editor
      console.log('Replace selection with:', text);
    },
    insertCitation: (citation: CitationResult) => {
      // Implement citation insertion logic
      console.log('Insert citation:', citation);
      const citationText = `[${citation.fullCitation}]`;
    },
    getSelectedText: () => {
      const selectedText = window.getSelection()?.toString().trim() || '';
      // If we have an onTextSelect callback, call it
      if (props.onTextSelect && selectedText) {
        props.onTextSelect(selectedText);
      }
      return selectedText;
    },
    clearContent: clearContent
  }));

  // Cast SuperDocEditor to any component type so we can forward a ref safely
  const AnySuperDocEditor = SuperDocEditor as unknown as React.ComponentType<any>;

  return (
    <AnySuperDocEditor
      ref={editorRef}
      onPaperTemplateClick={props.onPaperTemplateClick}
      // Pass any additional props needed to ensure empty content
    />
  );
});

EditorWrapper.displayName = 'EditorWrapper';

function CoWriterPage() {
  const [activeTab, setActiveTab] = useState('Home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [grammarChecking, setGrammarChecking] = useState(true);
  const [toneOptimizerOpen, setToneOptimizerOpen] = useState<ToneOptimizerState | null>(null);
  const [paraphraserOpen, setParaphraserOpen] = useState<ParaphraserState | null>(null);
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [citationsFinderOpen, setCitationsFinderOpen] = useState(false);
  const [citationResults, setCitationResults] = useState<CitationFinderResult | null>(null);
  const [selectedCitations, setSelectedCitations] = useState<CitationItem[]>([]);
  const [citationFormat, setCitationFormat] = useState('apa');
  const [loading, setLoading] = useState(false);
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  // New state variables for premium tools
  const [dataAssistantOpen, setDataAssistantOpen] = useState(false);
  const [researchGapsOpen, setResearchGapsOpen] = useState(false);
  const [researchQuestionsOpen, setResearchQuestionsOpen] = useState(false);
  const [journalMatcherOpen, setJournalMatcherOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [researchGaps, setResearchGaps] = useState<ResearchGap[]>([]);
  const [researchQuestions, setResearchQuestions] = useState<ResearchQuestion[]>([]);
  const [journalMatches, setJournalMatches] = useState<JournalConference[]>([]);
  const [researchTopic, setResearchTopic] = useState('');
  
  // Use our wrapper component ref instead
  const editorWrapperRef = useRef<EditorWrapperRef>(null);

  // Handle text selection - this will be called when getSelectedText is used
  const handleTextSelect = (text: string) => {
    setSelectedText(text);
  };

  // Clear editor content on component mount
  React.useEffect(() => {
    // Clear editor content when component mounts
    if (editorWrapperRef.current) {
      editorWrapperRef.current.clearContent();
    }
  }, []);

  // API base URL function - same as your other components
  const getApiBaseUrl = () => {
    // For development - adjust based on your environment
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000';
    }
    // For production - use your deployed server URL
    return ''; // Empty string for same-origin requests
  }

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
    { name: 'Save', icon: Save, group: 'file', action: () => handleSave() },
    { name: 'Undo', icon: Undo, group: 'edit', action: () => handleUndo() },
    { name: 'Redo', icon: Redo, group: 'edit', action: () => handleRedo() },
    { name: 'Copy', icon: Copy, group: 'clipboard', action: () => handleCopy() },
    { name: 'Cut', icon: Scissors, group: 'clipboard', action: () => handleCut() },
    { name: 'Paste', icon: Clipboard, group: 'clipboard', action: () => handlePaste() },
    { name: 'Bold', icon: Bold, group: 'format', action: () => handleBold() },
    { name: 'Italic', icon: Italic, group: 'format', action: () => handleItalic() },
    { name: 'Underline', icon: Underline, group: 'format', action: () => handleUnderline() },
    { name: 'Left', icon: AlignLeft, group: 'align', action: () => handleAlignLeft() },
    { name: 'Center', icon: AlignCenter, group: 'align', action: () => handleAlignCenter() },
    { name: 'Right', icon: AlignRight, group: 'align', action: () => handleAlignRight() },
    { name: 'Bullets', icon: List, group: 'list', action: () => handleBullets() },
    { name: 'Numbers', icon: ListOrdered, group: 'list', action: () => handleNumbers() }
  ];

  const researchBotTools = [
    { 
      name: 'Summarize', 
      icon: Zap, 
      description: 'AI-powered text summarization', 
      color: 'bg-yellow-500',
      action: 'summarize'
    },
    { 
      name: 'Paper Templates', 
      icon: FileText, 
      description: 'Pre-structured sections with AI guidance', 
      color: 'bg-blue-500', 
      action: 'paperTemplate'
    },
    { 
      name: 'Tone Optimizer', 
      icon: Edit3, 
      description: 'Convert to formal academic style', 
      color: 'bg-green-500',
      action: 'toneOptimizer'
    },
    { 
      name: 'Paraphraser', 
      icon: RefreshCw, 
      description: 'Plagiarism-safe rewriting', 
      color: 'bg-purple-500',
      action: 'paraphraser'
    },
    { 
      name: 'Grammar Check', 
      icon: CheckCircle, 
      description: 'Academic-focused corrections', 
      color: 'bg-red-500',
      action: 'grammarCheck'
    },
    { 
      name: 'Humanize', 
      icon: Users, 
      description: 'Make AI text sound human', 
      color: 'bg-pink-500',
      action: 'humanize'
    },
    { 
      name: 'Citations & Reference Manager', 
      icon: Quote, 
      description: 'Auto-generate APA, MLA, IEEE formats', 
      color: 'bg-indigo-500',
      action: 'citations'
    },
    { 
      name: 'AI Detector', 
      icon: Shield, 
      description: 'Check if text is AI-generated', 
      color: 'bg-gray-500',
      action: 'aiDetect'
    },
    { 
      name: 'DataSet Assistant', 
      icon: Download, 
      description: 'Upload, Summarize, Visualize, Cite', 
      color: 'bg-orange-500',
      action: 'dataSetAssistant'
    },
    { 
      name: 'Journal Export Format', 
      icon: Download, 
      description: 'Export to journal templates', 
      color: 'bg-emerald-500',
      action: 'journalExport'
    }
  ];

  const premiumTools = [
    { 
      name: 'Citations Finder', 
      icon: Search, 
      description: 'AI suggests relevant papers and articles', 
      color: 'bg-indigo-500',
      action: 'citationsFinder'
    },
    { 
      name: 'Plagiarism Check', 
      icon: Shield, 
      description: 'Similarity index checker', 
      color: 'bg-slate-500', 
      premium: true,
      action: 'plagiarismCheck'
    },
    { 
      name: 'Research Gaps', 
      icon: Target, 
      description: 'Identify unstudied areas', 
      color: 'bg-rose-500', 
      premium: true,
      action: 'researchGaps'
    },
    { 
      name: 'Research Question Generator', 
      icon: Lightbulb, 
      description: 'AI research questions', 
      color: 'bg-lime-500', 
      premium: true,
      action: 'researchQuestions'
    },
    { 
      name: 'Conference & Journal Matcher', 
      icon: MapPin, 
      description: 'Finds best publication outlets', 
      color: 'bg-cyan-500', 
      premium: true,
      action: 'journalMatcher'
    },
  ];

  // API Integration Functions using fetch - UPDATED TO REMOVE ALERTS
  const handleToneOptimizer = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to optimize');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/paraphrase`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          mode: 'formal', // Using formal mode for academic tone optimization
          synonymLevel: 30, // Lower synonym level for tone optimization
          language: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.paraphrased) {
        setToneOptimizerOpen({
          original: text,
          optimized: result.paraphrased,
          open: true
        });
      }
    } catch (error) {
      console.error('Tone optimization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParaphraser = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to paraphrase');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/paraphrase`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          mode: 'standard',
          synonymLevel: 70,
          language: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.paraphrased) {
        setParaphraserOpen({
          original: text,
          paraphrased: result.paraphrased,
          open: true
        });
      }
    } catch (error) {
      console.error('Paraphrasing failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrammarCheck = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to check');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/grammar-check`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'en-US',
          includeExplanations: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Ensure issues array has proper structure
      const issues: GrammarIssue[] = Array.isArray(result.issues) 
        ? result.issues.map((issue: any) => ({
            type: issue.type || 'unknown',
            subtype: issue.subtype || '',
            severity: issue.severity || 'suggestion',
            text: issue.text || '',
            suggestion: issue.suggestion || '',
            explanation: issue.explanation || issue.message || '',
            rule: issue.rule || '',
            position: issue.position || { start: 0, end: 0 },
            message: issue.message || issue.explanation || ''
          }))
        : [];
      
      setGrammarIssues(issues);
      setActiveTool('grammar');
    } catch (error) {
      console.error('Grammar check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitations = async (sourceInfo: string, format: string = 'apa', sourceType: string = 'website') => {
    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/citation`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: sourceInfo,
          format: format,
          sourceType: sourceType
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result: CitationResult = await response.json();
      
      if (result.fullCitation && editorWrapperRef.current) {
        editorWrapperRef.current.insertCitation(result);
        setCitationsOpen(false);
      }
    } catch (error) {
      console.error('Citation generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCitationsFinder = async (query: string, maxResults: number = 5, field: string = 'general') => {
    if (!query.trim()) {
      console.log('Please enter a research topic');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/citation-finder`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          maxResults: maxResults,
          field: field
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result: CitationFinderResult = await response.json();
      
      setCitationResults(result);
      setSelectedCitations([]); // Reset selected citations
      setCitationsFinderOpen(true);
      setActiveTool('citations-finder');
    } catch (error) {
      console.error('Citations finder failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlagiarismCheck = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to check');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/plagiarism-check`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      setActiveTool('plagiarism');
      // Log plagiarism results instead of showing alert
      console.log('Plagiarism Check Complete:', {
        overallScore: result.overallScore,
        uniqueContent: result.uniqueContent,
        processingTime: result.processingTime
      });
    } catch (error) {
      console.error('Plagiarism check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHumanizeText = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to humanize');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/humanize`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputText: text,
          humanizationMode: 'casual',
          creativityLevel: 75,
          language: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.humanizedText && editorWrapperRef.current) {
        editorWrapperRef.current.replaceSelection(result.humanizedText);
      }
    } catch (error) {
      console.error('Text humanization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to summarize');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/summarize`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          length: 'medium',
          mode: 'paragraph',
          language: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.summary && editorWrapperRef.current) {
        editorWrapperRef.current.replaceSelection(result.summary);
      }
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIDetection = async (text: string) => {
    if (!text.trim()) {
      console.log('Please select some text to analyze');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/ai-detect`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: 'en'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      
      // Log AI detection results instead of showing alert
      console.log('AI Detection Results:', {
        aiProbability: result.aiProbability,
        humanProbability: result.humanProbability,
        confidence: result.confidence
      });
    } catch (error) {
      console.error('AI detection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Data Assistant Functions
  const handleDataAssistant = async () => {
    setDataAssistantOpen(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
      console.log('Files uploaded:', files);
    }
  };

  const handleDatasetAnalysis = async (file: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const apiUrl = `${getApiBaseUrl()}/api/analyze-dataset`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Dataset analysis complete:', result);
      
      if (editorWrapperRef.current) {
        const analysisText = `Dataset Analysis for ${file.name}:\n\n` +
          `• Variables: ${result.variables?.join(', ') || 'N/A'}\n` +
          `• Sample Size: ${result.sampleSize || 'N/A'}\n` +
          `• Data Types: ${result.dataTypes?.join(', ') || 'N/A'}\n` +
          `• Summary Statistics: ${result.summary || 'Available'}`;
        
        editorWrapperRef.current.replaceSelection(analysisText);
      }
    } catch (error) {
      console.error('Dataset analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Research Gaps Functions
  const handleResearchGaps = async () => {
    setResearchGapsOpen(true);
  };

  const analyzeResearchGaps = async (topic: string) => {
    if (!topic.trim()) {
      console.log('Please enter a research topic');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/research-gaps`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          maxGaps: 5
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setResearchGaps(result.gaps || []);
      console.log('Research gaps analysis complete');
    } catch (error) {
      console.error('Research gaps analysis failed:', error);
      // Mock data for demonstration
      const mockGaps: ResearchGap[] = [
        {
          id: '1',
          topic: 'AI in Healthcare',
          description: 'Limited research on ethical implications of AI diagnostics in rural healthcare settings',
          potentialImpact: 'high',
          methodology: ['Mixed Methods', 'Case Studies', 'Surveys'],
          keywords: ['AI Ethics', 'Rural Healthcare', 'Diagnostic Algorithms']
        },
        {
          id: '2',
          topic: 'Machine Learning',
          description: 'Gap in interpretability of deep learning models for clinical decision support',
          potentialImpact: 'medium',
          methodology: ['Experimental Research', 'Model Analysis', 'Clinical Trials'],
          keywords: ['Interpretable AI', 'Clinical Decision Support', 'Model Transparency']
        }
      ];
      setResearchGaps(mockGaps);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Research Questions Functions
  const handleResearchQuestions = async () => {
    setResearchQuestionsOpen(true);
  };

  const generateResearchQuestions = async (topic: string) => {
    if (!topic.trim()) {
      console.log('Please enter a research topic');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/research-questions`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          count: 5
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setResearchQuestions(result.questions || []);
      console.log('Research questions generated');
    } catch (error) {
      console.error('Research questions generation failed:', error);
      // Mock data for demonstration
      const mockQuestions: ResearchQuestion[] = [
        {
          id: '1',
          question: 'How does the implementation of AI-powered diagnostic tools affect patient outcomes in primary care settings?',
          type: 'causal',
          complexity: 'advanced',
          methodology: ['Randomized Controlled Trials', 'Longitudinal Studies']
        },
        {
          id: '2',
          question: 'What are the key factors influencing healthcare professionals\' adoption of AI technologies?',
          type: 'exploratory',
          complexity: 'intermediate',
          methodology: ['Surveys', 'Interviews', 'Thematic Analysis']
        }
      ];
      setResearchQuestions(mockQuestions);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Journal Matcher Functions
  const handleJournalMatcher = async () => {
    setJournalMatcherOpen(true);
  };

  const findJournalMatches = async (topic: string, field: string = 'general') => {
    if (!topic.trim()) {
      console.log('Please enter a research topic');
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${getApiBaseUrl()}/api/journal-matcher`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          field: field,
          maxResults: 5
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setJournalMatches(result.matches || []);
      console.log('Journal matches found');
    } catch (error) {
      console.error('Journal matching failed:', error);
      // Mock data for demonstration
      const mockMatches: JournalConference[] = [
        {
          id: '1',
          name: 'Nature Medicine',
          type: 'journal',
          impactFactor: 87.241,
          acceptanceRate: '8%',
          focusAreas: ['Clinical Medicine', 'Biomedical Research', 'Healthcare Innovation'],
          publisher: 'Nature Publishing Group',
          matchScore: 95,
          website: 'https://www.nature.com/nm/'
        },
        {
          id: '2',
          name: 'Journal of Medical Internet Research',
          type: 'journal',
          impactFactor: 7.076,
          acceptanceRate: '25%',
          focusAreas: ['Digital Health', 'Telemedicine', 'Health Informatics'],
          publisher: 'JMIR Publications',
          matchScore: 88,
          website: 'https://www.jmir.org/'
        }
      ];
      setJournalMatches(mockMatches);
    } finally {
      setLoading(false);
    }
  };

  // Handle citation selection
  const handleCitationSelect = (citation: CitationItem) => {
    setSelectedCitations(prev => {
      const isSelected = prev.some(c => c.doi === citation.doi);
      if (isSelected) {
        return prev.filter(c => c.doi !== citation.doi);
      } else {
        return [...prev, citation];
      }
    });
  };

  // Generate citations for selected items and close all modals
  const handleGenerateSelectedCitations = async () => {
    if (selectedCitations.length === 0) {
      console.log('Please select at least one citation to generate');
      return;
    }

    setLoading(true);
    try {
      const generatedCitations: CitationResult[] = [];

      // Generate citation for each selected item
      for (const citation of selectedCitations) {
        const sourceInfo = `${citation.author}. ${citation.title}. ${citation.journal}, ${citation.year}. ${citation.doi}`;
        
        const apiUrl = `${getApiBaseUrl()}/api/citation`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            source: sourceInfo,
            format: citationFormat,
            sourceType: 'journal'
          }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result: CitationResult = await response.json();
        generatedCitations.push(result);
      }

      // Insert all citations into the document
      if (editorWrapperRef.current && generatedCitations.length > 0) {
        const allCitations = generatedCitations.map(citation => citation.fullCitation).join('\n\n');
        editorWrapperRef.current.replaceSelection(allCitations);
      }

      // Close all modals
      setCitationsFinderOpen(false);
      setCitationsOpen(false);
      setCitationResults(null);
      setSelectedCitations([]);
      
      console.log(`Successfully generated ${generatedCitations.length} citations in ${citationFormat.toUpperCase()} format!`);
      
    } catch (error) {
      console.error('Citation generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle single citation selection and auto-insert
  const handleSingleCitationSelect = async (citation: CitationItem) => {
    setLoading(true);
    try {
      const sourceInfo = `${citation.author}. ${citation.title}. ${citation.journal}, ${citation.year}. ${citation.doi}`;
      
      const apiUrl = `${getApiBaseUrl()}/api/citation`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: sourceInfo,
          format: citationFormat,
          sourceType: 'journal'
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result: CitationResult = await response.json();
      
      // Insert citation into the document
      if (editorWrapperRef.current) {
        editorWrapperRef.current.replaceSelection(result.fullCitation);
      }

      // Close all modals
      setCitationsFinderOpen(false);
      setCitationsOpen(false);
      setCitationResults(null);
      setSelectedCitations([]);
      
      console.log(`Citation generated and inserted in ${citationFormat.toUpperCase()} format!`);
      
    } catch (error) {
      console.error('Citation generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Close all citation modals
  const closeAllCitationModals = () => {
    setCitationsFinderOpen(false);
    setCitationsOpen(false);
    setCitationResults(null);
    setSelectedCitations([]);
  };

  // Updated Tool handler function to use the wrapper methods without alerts
  const handleToolClick = (action: string) => {
    const selectedText = editorWrapperRef.current?.getSelectedText() || '';
    
    switch (action) {
      case 'toneOptimizer':
        handleToneOptimizer(selectedText);
        break;
      case 'paraphraser':
        handleParaphraser(selectedText);
        break;
      case 'grammarCheck':
        handleGrammarCheck(selectedText);
        break;
      case 'citations':
        setCitationsOpen(true);
        break;
      case 'citationsFinder':
        setCitationsFinderOpen(true);
        break;
      case 'plagiarismCheck':
        handlePlagiarismCheck(selectedText);
        break;
      case 'humanize':
        handleHumanizeText(selectedText);
        break;
      case 'summarize':
        handleSummarize(selectedText);
        break;
      case 'aiDetect':
        handleAIDetection(selectedText);
        break;
      case 'journalMatcher':
        handleJournalMatcher();
        break;
      case 'researchQuestions':
        handleResearchQuestions();
        break;
      case 'paperTemplate':
        if (window.loadPaperTemplate) {
          window.loadPaperTemplate();
        } else {
          console.log('Paper template functionality is not available at the moment.');
        }
        break;
      case 'dataSetAssistant':
        handleDataAssistant();
        break;
      case 'researchGaps':
        handleResearchGaps();
        break;
      case 'literatureSummarizer':
        console.log('Literature Summarizer clicked');
        break;
      case 'trackChanges':
        console.log('Track Changes clicked');
        break;
      case 'journalExport':
        console.log('Journal Export clicked');
        break;
      default:
        console.log(`Tool action ${action} clicked`);
    }
  };

  // Editor action handlers (placeholder implementations)
  function handleSave() { console.log('Save'); }
  function handleUndo() { console.log('Undo'); }
  function handleRedo() { console.log('Redo'); }
  function handleCopy() { console.log('Copy'); }
  function handleCut() { console.log('Cut'); }
  function handlePaste() { console.log('Paste'); }
  function handleBold() { console.log('Bold'); }
  function handleItalic() { console.log('Italic'); }
  function handleUnderline() { console.log('Underline'); }
  function handleAlignLeft() { console.log('Align Left'); }
  function handleAlignCenter() { console.log('Align Center'); }
  function handleAlignRight() { console.log('Align Right'); }
  function handleBullets() { console.log('Bullets'); }
  function handleNumbers() { console.log('Numbers'); }

  // Helper functions for applying changes
  const applyToneOptimization = () => {
    if (toneOptimizerOpen && editorWrapperRef.current) {
      editorWrapperRef.current.replaceSelection(toneOptimizerOpen.optimized);
      setToneOptimizerOpen(null);
    }
  };

  const applyParaphrase = () => {
    if (paraphraserOpen && editorWrapperRef.current) {
      editorWrapperRef.current.replaceSelection(paraphraserOpen.paraphrased);
      setParaphraserOpen(null);
    }
  };

  // Helper function to insert research gap into document
  const insertResearchGap = (gap: ResearchGap) => {
    if (editorWrapperRef.current) {
      const gapText = `Research Gap: ${gap.topic}\n\n` +
        `Description: ${gap.description}\n\n` +
        `Potential Impact: ${gap.potentialImpact.toUpperCase()}\n` +
        `Suggested Methodologies: ${gap.methodology.join(', ')}\n` +
        `Keywords: ${gap.keywords.join(', ')}\n\n`;
      
      editorWrapperRef.current.replaceSelection(gapText);
    }
  };

  // Helper function to insert research question into document
  const insertResearchQuestion = (question: ResearchQuestion) => {
    if (editorWrapperRef.current) {
      const questionText = `Research Question (${question.type}, ${question.complexity}):\n` +
        `${question.question}\n\n` +
        `Suggested Methodologies: ${question.methodology.join(', ')}\n\n`;
      
      editorWrapperRef.current.replaceSelection(questionText);
    }
  };

  // Helper function to insert journal match into document
  const insertJournalMatch = (journal: JournalConference) => {
    if (editorWrapperRef.current) {
      const journalText = `Recommended ${journal.type.toUpperCase()}: ${journal.name}\n\n` +
        `Match Score: ${journal.matchScore}%\n` +
        `Impact Factor: ${journal.impactFactor || 'N/A'}\n` +
        `Acceptance Rate: ${journal.acceptanceRate}\n` +
        `Focus Areas: ${journal.focusAreas.join(', ')}\n` +
        `Publisher: ${journal.publisher}\n` +
        `Website: ${journal.website}\n\n`;
      
      editorWrapperRef.current.replaceSelection(journalText);
    }
  };

  const ToolGroup = ({ title, tools, className = "" }: { title: string; tools: any[]; className?: string }) => (
    <div className={`border-r border-gray-200 px-1 sm:px-2 last:border-r-0 ${className}`}>
      <div className="text-xs text-gray-600 mb-1 font-medium hidden sm:block">{title}</div>
      <div className="flex space-x-0.5 sm:space-x-1">
        {tools.map((tool, index) => (
          <button
            key={index}
            onClick={tool.action}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded transition-colors flex flex-col items-center min-w-[32px] sm:min-w-[40px]"
            title={tool.name}
          >
            <tool.icon size={14} className="text-gray-700 sm:w-4 sm:h-4" />
          </button>
        ))}
      </div>
    </div>
  );

  // Helper function to get issue message
  const getIssueMessage = (issue: GrammarIssue): string => {
    return issue.message || issue.explanation || `Consider fixing: ${issue.text}`;
  };

  // Modal Components
  const ToneOptimizerModal = () => {
    if (!toneOptimizerOpen?.open) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tone Optimizer</h3>
            <button onClick={() => setToneOptimizerOpen(null)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Original Text</h4>
              <div className="bg-gray-50 p-3 rounded border text-sm">
                {toneOptimizerOpen.original}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Optimized Text</h4>
              <div className="bg-green-50 p-3 rounded border text-sm">
                {toneOptimizerOpen.optimized}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button 
              onClick={() => setToneOptimizerOpen(null)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={applyToneOptimization}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ParaphraserModal = () => {
    if (!paraphraserOpen?.open) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Paraphraser</h3>
            <button onClick={() => setParaphraserOpen(null)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Original Text</h4>
              <div className="bg-gray-50 p-3 rounded border text-sm">
                {paraphraserOpen.original}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Paraphrased Text</h4>
              <div className="bg-purple-50 p-3 rounded border text-sm">
                {paraphraserOpen.paraphrased}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button 
              onClick={() => setParaphraserOpen(null)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={applyParaphrase}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CitationsModal = () => {
    const [source, setSource] = useState('');
    const [format, setFormat] = useState('apa');
    const [sourceType, setSourceType] = useState('website');

    const handleGenerateCitation = async () => {
      if (!source.trim()) {
        console.log('Please enter source information');
        return;
      }

      await handleCitations(source, format, sourceType);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generate Citation</h3>
            <button onClick={() => setCitationsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Information
              </label>
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter book title, website URL, or article details..."
                className="w-full p-2 border border-gray-300 rounded resize-none"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Citation Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                  <option value="harvard">Harvard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source Type
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="website">Website</option>
                  <option value="book">Book</option>
                  <option value="journal">Journal</option>
                  <option value="image">Image</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button 
              onClick={() => setCitationsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleGenerateCitation}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Generate Citation'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CitationsFinderModal = () => {
    const [query, setQuery] = useState('');
    const [field, setField] = useState('general');
    const [maxResults, setMaxResults] = useState(5);

    const handleSearchCitations = async () => {
      if (!query.trim()) {
        console.log('Please enter a research topic');
        return;
      }

      await handleCitationsFinder(query, maxResults, field);
    };

    const handleSelectAllCitations = () => {
      if (citationResults) {
        if (selectedCitations.length === citationResults.citations.length) {
          setSelectedCitations([]);
        } else {
          setSelectedCitations([...citationResults.citations]);
        }
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Find Academic Citations</h3>
            <button onClick={closeAllCitationModals} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          {!citationResults ? (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Research Topic
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your research topic or keywords..."
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field
                  </label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value="general">General</option>
                    <option value="computer">Computer Science</option>
                    <option value="medicine">Medicine</option>
                    <option value="psychology">Psychology</option>
                    <option value="education">Education</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Results
                  </label>
                  <select
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  >
                    <option value={3}>3</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={closeAllCitationModals}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSearchCitations}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>Search Citations</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* Header with selection info and format */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h4 className="font-medium text-gray-700">
                      Found {citationResults.totalFound} citations for "{citationResults.query}"
                    </h4>
                    <span className="text-sm text-gray-500">
                      {selectedCitations.length} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={citationFormat}
                      onChange={(e) => setCitationFormat(e.target.value)}
                      className="text-sm border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="apa">APA</option>
                      <option value="mla">MLA</option>
                      <option value="chicago">Chicago</option>
                      <option value="harvard">Harvard</option>
                    </select>
                    <button 
                      onClick={() => {
                        setCitationResults(null);
                        setSelectedCitations([]);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      New Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Citations List with Scrollable Area */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto p-4">
                  <div className="space-y-3">
                    {citationResults.citations.map((citation, index) => {
                      const isSelected = selectedCitations.some(c => c.doi === citation.doi);
                      return (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                              : 'bg-white border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => handleSingleCitationSelect(citation)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                                isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                              }`}>
                                {isSelected && <Check size={14} className="text-white" />}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  citation.relevance >= 80 ? 'bg-green-100 text-green-800' :
                                  citation.relevance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {citation.relevance}% relevant
                                </span>
                                <span className="text-xs text-gray-500">{citation.year}</span>
                              </div>
                              <h5 className="font-medium text-gray-800 mb-1 line-clamp-2">{citation.title}</h5>
                              <p className="text-sm text-gray-600 mb-1">{citation.author}</p>
                              <p className="text-sm text-gray-500 mb-2">{citation.journal}</p>
                              <p className="text-xs text-blue-600 truncate">{citation.doi}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer with actions */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={handleSelectAllCitations}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {selectedCitations.length === citationResults.citations.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <span className="text-sm text-gray-600">
                      {selectedCitations.length} citation(s) selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={closeAllCitationModals}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleGenerateSelectedCitations}
                      disabled={selectedCitations.length === 0 || loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      {loading && <Loader2 className="animate-spin" size={16} />}
                      <span>Generate {selectedCitations.length} Citation(s)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // NEW: Data Assistant Modal
  const DataAssistantModal = () => {
    if (!dataAssistantOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">DataSet Assistant</h3>
            <button onClick={() => setDataAssistantOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <h4 className="font-medium text-gray-700 mb-2">Upload Your Dataset</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Supported formats: CSV, Excel, JSON, SPSS (.sav)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="dataset-upload"
                  accept=".csv,.xlsx,.xls,.json,.sav"
                />
                <label
                  htmlFor="dataset-upload"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                >
                  <Upload size={16} className="mr-2" />
                  Choose Files
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Uploaded Files</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Database className="text-blue-600" size={20} />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDatasetAnalysis(file)}
                          disabled={loading}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Analyzing...' : 'Analyze'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Analysis Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <BarChart3 className="text-blue-600 mb-2" size={24} />
                  <h5 className="font-medium text-blue-800">Statistical Analysis</h5>
                  <p className="text-sm text-blue-600 mt-1">
                    Generate descriptive statistics and correlation analysis
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="text-green-600 mb-2" size={24} />
                  <h5 className="font-medium text-green-800">Visualization</h5>
                  <p className="text-sm text-green-600 mt-1">
                    Create charts and graphs for data exploration
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex justify-end space-x-2">
            <button 
              onClick={() => setDataAssistantOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Research Gaps Modal
  const ResearchGapsModal = () => {
    if (!researchGapsOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Research Gaps Analyzer</h3>
            <button onClick={() => setResearchGapsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Input Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Topic
                  </label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="Enter your research topic or field..."
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <button 
                  onClick={() => analyzeResearchGaps(researchTopic)}
                  disabled={loading || !researchTopic.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>Analyze Research Gaps</span>
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto p-6">
              {researchGaps.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Identified Research Gaps</h4>
                  {researchGaps.map((gap, index) => (
                    <div key={gap.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-800">{gap.topic}</h5>
                        <span className={`text-xs px-2 py-1 rounded ${
                          gap.potentialImpact === 'high' ? 'bg-red-100 text-red-800' :
                          gap.potentialImpact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {gap.potentialImpact.toUpperCase()} Impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {gap.keywords.map((keyword, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          Methods: {gap.methodology.join(', ')}
                        </div>
                        <button
                          onClick={() => insertResearchGap(gap)}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Insert to Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Target className="mx-auto text-gray-400 mb-4" size={48} />
                  <p>Enter a research topic to identify potential research gaps</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Research Questions Modal
  const ResearchQuestionsModal = () => {
    if (!researchQuestionsOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Research Question Generator</h3>
            <button onClick={() => setResearchQuestionsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Input Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Topic
                  </label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    placeholder="Enter your research topic or field..."
                    className="w-full p-3 border border-gray-300 rounded-lg"
                  />
                </div>
                <button 
                  onClick={() => generateResearchQuestions(researchTopic)}
                  disabled={loading || !researchTopic.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>Generate Research Questions</span>
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto p-6">
              {researchQuestions.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Generated Research Questions</h4>
                  {researchQuestions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-800 flex-1">{question.question}</h5>
                        <div className="flex space-x-2 ml-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            question.type === 'causal' ? 'bg-purple-100 text-purple-800' :
                            question.type === 'comparative' ? 'bg-blue-100 text-blue-800' :
                            question.type === 'exploratory' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {question.type}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            question.complexity === 'advanced' ? 'bg-red-100 text-red-800' :
                            question.complexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {question.complexity}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        Suggested Methods: {question.methodology.join(', ')}
                      </div>
                      <button
                        onClick={() => insertResearchQuestion(question)}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Insert to Document
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Lightbulb className="mx-auto text-gray-400 mb-4" size={48} />
                  <p>Enter a research topic to generate relevant research questions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Journal Matcher Modal
  const JournalMatcherModal = () => {
    const [field, setField] = useState('general');

    if (!journalMatcherOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Conference & Journal Matcher</h3>
            <button onClick={() => setJournalMatcherOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Input Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Topic
                    </label>
                    <input
                      type="text"
                      value={researchTopic}
                      onChange={(e) => setResearchTopic(e.target.value)}
                      placeholder="Enter your research topic..."
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field
                    </label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="general">General</option>
                      <option value="computer">Computer Science</option>
                      <option value="medicine">Medicine</option>
                      <option value="psychology">Psychology</option>
                      <option value="education">Education</option>
                      <option value="engineering">Engineering</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={() => findJournalMatches(researchTopic, field)}
                  disabled={loading || !researchTopic.trim()}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  <span>Find Publication Outlets</span>
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex-1 overflow-y-auto p-6">
              {journalMatches.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Recommended Publication Outlets</h4>
                  {journalMatches.map((journal, index) => (
                    <div key={journal.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-800">{journal.name}</h5>
                          <p className="text-sm text-gray-600">{journal.publisher} • {journal.type.toUpperCase()}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            journal.matchScore >= 90 ? 'text-green-600' :
                            journal.matchScore >= 80 ? 'text-yellow-600' :
                            'text-blue-600'
                          }`}>
                            {journal.matchScore}%
                          </div>
                          <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Impact Factor:</span>
                          <div className="font-medium">{journal.impactFactor || 'N/A'}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Acceptance Rate:</span>
                          <div className="font-medium">{journal.acceptanceRate}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Focus Areas:</span>
                          <div className="font-medium">{journal.focusAreas.slice(0, 2).join(', ')}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Website:</span>
                          <a href={journal.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                            Visit
                          </a>
                        </div>
                      </div>

                      <button
                        onClick={() => insertJournalMatch(journal)}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Insert to Document
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
                  <p>Enter your research topic to find the best publication outlets</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
      <div className="bg-blue-600 text-white px-2 sm:px-4 py-1 flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="flex items-center space-x-2">
            <div className="bg-white text-blue-600 p-1 rounded">
              <Brain size={14} className="sm:w-4 sm:h-4" />
            </div>
            <span className="font-semibold truncate">ResearchBot AI</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline truncate">Document1</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-4">
          <button className="hover:bg-blue-700 px-2 py-1 rounded text-xs">
            Share
          </button>
          <div className="flex items-center space-x-1">
            <User size={14} className="sm:w-4 sm:h-4" />
            <span className="text-xs hidden xs:inline">John</span>
          </div>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-white border-b border-gray-200">
        {/* Mobile Menu Toggle */}
        <div className="flex items-center justify-between px-2 py-2 sm:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
          >
            <Menu size={18} />
            <span className="text-sm font-medium">{activeTab}</span>
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Brain size={18} className="text-blue-600" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center px-4 overflow-x-auto scrollbar-hide">
          {menuTabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 lg:px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.name
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              } ${tab.special ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600' : ''}`}
            >
              <div className="flex items-center space-x-1 lg:space-x-2">
                <tab.icon size={16} />
                <span className="hidden md:inline">{tab.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200 p-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1">
              {menuTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-3 text-sm font-medium rounded transition-colors text-left ${
                    activeTab === tab.name
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${tab.special ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon size={18} />
                    <span>{tab.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2">
        {activeTab === 'Home' && (
          <div className="overflow-x-auto">
            <div className="flex items-center space-x-2 min-w-max">
              <ToolGroup title="File" tools={homeTools.filter(t => t.group === 'file')} />
              <ToolGroup title="Clipboard" tools={homeTools.filter(t => t.group === 'clipboard')} />
              <ToolGroup title="Font" tools={homeTools.filter(t => t.group === 'format')} />
              <ToolGroup title="Paragraph" tools={homeTools.filter(t => t.group === 'align' || t.group === 'list')} />
            </div>
          </div>
        )}

        {activeTab === 'ResearchBot' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Main Research Tools */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Core Research Tools</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {researchBotTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => handleToolClick(tool.action)}
                    disabled={loading}
                    className="flex flex-col items-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group min-h-[80px] sm:min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`${tool.color} text-white p-1.5 sm:p-2 rounded-lg mb-1 sm:mb-2 group-hover:scale-110 transition-transform`}>
                      <tool.icon size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-800 text-center leading-tight">{tool.name}</span>
                    <span className="text-xs text-gray-500 text-center mt-1 leading-tight hidden sm:block">{tool.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Tools */}
            <div>
              <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                <Star className="text-yellow-500" size={16} />
                <h3 className="text-sm font-semibold text-gray-700">Premium Research Tools</h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">PRO</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {premiumTools.map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => handleToolClick(tool.action)}
                    disabled={loading}
                    className="flex flex-col items-center p-2 sm:p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 hover:from-purple-100 hover:to-blue-100 transition-all group relative min-h-[80px] sm:min-h-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`${tool.color} text-white p-1.5 sm:p-2 rounded-lg mb-1 sm:mb-2 group-hover:scale-110 transition-transform relative`}>
                      <tool.icon size={16} className="sm:w-5 sm:h-5" />
                      <Star className="absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full p-0.5" size={10} />
                    </div>
                    <span className="text-xs font-medium text-gray-800 text-center leading-tight">{tool.name}</span>
                    <span className="text-xs text-gray-600 text-center mt-1 leading-tight hidden sm:block">{tool.description}</span>
                  </button>
                ))}
              </div>
              
              {/* Upgrade Banner */}
              <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="text-center sm:text-left">
                    <h4 className="font-semibold text-sm">Unlock Premium Research Tools</h4>
                    <p className="text-xs text-purple-100 mt-1">Advanced AI features for serious researchers</p>
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
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Document Area */}
        <div className="flex-1 bg-gray-100 p-2 sm:p-4 lg:p-8 overflow-y-auto">
          <EditorWrapper 
            ref={editorWrapperRef}
            onPaperTemplateClick={() => {}}
            onTextSelect={handleTextSelect}
          />
        </div>

        {/* Mobile AI Assistant Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Mobile Sidebar Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Brain size={18} />
                  </div>
                  <span className="font-semibold text-gray-900">AI Assistant</span>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Mobile Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Grammar Checker Section */}
                {grammarIssues.length > 0 && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="text-green-600" size={18} />
                        <span className="font-medium text-gray-900 text-sm">Grammar Checker</span>
                      </div>
                      <button 
                        onClick={() => setGrammarChecking(!grammarChecking)}
                        className={`w-10 h-6 rounded-full transition-colors ${grammarChecking ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${grammarChecking ? 'translate-x-5' : 'translate-x-1'} mt-1`}></div>
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{grammarIssues.length} suggestions available</div>
                    {grammarIssues.slice(0, 2).map((issue, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-2">
                        <div className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800 mb-2">
                              {getIssueMessage(issue)}
                            </p>
                            <div className="flex space-x-2">
                              <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700">
                                Accept
                              </button>
                              <button className="text-xs border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
                                Ignore
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Tools */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Quick Tools</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleToolClick('toneOptimizer')}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 className="text-blue-600 mb-2" size={18} />
                      <span className="text-sm text-blue-800 block font-medium">Tone Optimizer</span>
                    </button>
                    <button 
                      onClick={() => handleToolClick('paraphraser')}
                      className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                    >
                      <RefreshCw className="text-purple-600 mb-2" size={18} />
                      <span className="text-sm text-purple-800 block font-medium">Paraphraser</span>
                    </button>
                    <button 
                      onClick={() => handleToolClick('citations')}
                      className="p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <Quote className="text-green-600 mb-2" size={18} />
                      <span className="text-sm text-green-800 block font-medium">Citations</span>
                    </button>
                    <button 
                      onClick={() => handleToolClick('citationsFinder')}
                      className="p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                    >
                      <Search className="text-orange-600 mb-2" size={18} />
                      <span className="text-sm text-orange-800 block font-medium">Find Sources</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Right Sidebar */}
        {sidebarOpen && (
          <div className="hidden sm:flex w-80 bg-white border-l border-gray-200 flex-col">
            {/* Desktop Sidebar Header */}
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

            {/* Desktop Grammar Checker */}
            {grammarIssues.length > 0 && (
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="text-green-600" size={20} />
                    <span className="font-medium text-gray-900">Grammar Checker</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Real-time</span>
                    <button 
                      onClick={() => setGrammarChecking(!grammarChecking)}
                      className={`w-10 h-6 rounded-full transition-colors ${grammarChecking ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${grammarChecking ? 'translate-x-5' : 'translate-x-1'} mt-1`}></div>
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">{grammarIssues.length} suggestions available</div>
                {grammarIssues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 mb-1">
                          {getIssueMessage(issue)}
                        </p>
                        <div className="flex space-x-2">
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
                ))}
              </div>
            )}

            {/* Desktop Quick Tools */}
            <div className="p-4 flex-1 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-3">Quick Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleToolClick('toneOptimizer')}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <Edit3 className="text-blue-600 mb-1" size={16} />
                  <span className="text-xs text-blue-800 block">Tone Optimizer</span>
                </button>
                <button 
                  onClick={() => handleToolClick('paraphraser')}
                  className="p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <RefreshCw className="text-purple-600 mb-1" size={16} />
                  <span className="text-xs text-purple-800 block">Paraphraser</span>
                </button>
                <button 
                  onClick={() => handleToolClick('citations')}
                  className="p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <Quote className="text-green-600 mb-1" size={16} />
                  <span className="text-xs text-green-800 block">Citations</span>
                </button>
                <button 
                  onClick={() => handleToolClick('citationsFinder')}
                  className="p-3 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                >
                  <Search className="text-orange-600 mb-1" size={16} />
                  <span className="text-xs text-orange-800 block">Find Sources</span>
                </button>
                <button 
                  onClick={() => handleToolClick('summarize')}
                  className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors"
                >
                  <Zap className="text-yellow-600 mb-1" size={16} />
                  <span className="text-xs text-yellow-800 block">Summarize</span>
                </button>
                <button 
                  onClick={() => handleToolClick('humanize')}
                  className="p-3 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 transition-colors"
                >
                  <Users className="text-pink-600 mb-1" size={16} />
                  <span className="text-xs text-pink-800 block">Humanize</span>
                </button>
                <button 
                  onClick={() => handleToolClick('aiDetect')}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <Shield className="text-gray-600 mb-1" size={16} />
                  <span className="text-xs text-gray-800 block">AI Detect</span>
                </button>
                <button 
                  onClick={() => handleToolClick('plagiarismCheck')}
                  className="p-3 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Shield className="text-red-600 mb-1" size={16} />
                  <span className="text-xs text-red-800 block">Plagiarism</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistant Toggle Button - Mobile & Desktop */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed right-4 bottom-4 sm:right-4 sm:top-1/2 sm:transform sm:-translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          >
            <Brain size={20} />
          </button>
        )}
      </div>

      {/* Modals - Only render when needed */}
      {toneOptimizerOpen?.open && <ToneOptimizerModal />}
      {paraphraserOpen?.open && <ParaphraserModal />}
      {citationsOpen && <CitationsModal />}
      {citationsFinderOpen && <CitationsFinderModal />}
      {dataAssistantOpen && <DataAssistantModal />}
      {researchGapsOpen && <ResearchGapsModal />}
      {researchQuestionsOpen && <ResearchQuestionsModal />}
      {journalMatcherOpen && <JournalMatcherModal />}
    </div>
  );
}

export default CoWriterPage;