"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { RefreshCw, Copy, Download, Crown, ChevronUp, ChevronDown, Zap, Settings, FileText, BarChart3, Sparkles, CheckCircle, AlertCircle } from "lucide-react"

// Define types for API response
interface ApiResult {
  original: string;
  paraphrased: string;
  changedWords: Array<{
    original: string;
    replacement: string;
    position: number;
  }>;
  originalityScore: number;
  readabilityScore: number;
  processingTime: number;
  modeUsed: string;
  language: string;
}

interface SynonymResponse {
  synonyms: string[];
  originalWord: string;
  context: string;
}

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState("standard")
  const [synonymLevel, setSynonymLevel] = useState(50)
  const [language, setLanguage] = useState("en-US")
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [synonymPosition, setSynonymPosition] = useState({ top: 0, left: 0 })
  const [isPremium, setIsPremium] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [apiResult, setApiResult] = useState<ApiResult | null>(null)
  const [changedWords, setChangedWords] = useState<any[]>([])
  const [currentSentence, setCurrentSentence] = useState(0)
  const [loadingSynonyms, setLoadingSynonyms] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [originalityScore, setOriginalityScore] = useState<number | null>(null)
  const [readabilityScore, setReadabilityScore] = useState<number | null>(null)
  const [processingTime, setProcessingTime] = useState<number | null>(null)
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" })
  const outputRef = useRef<HTMLDivElement>(null)
  const synonymBoxRef = useRef<HTMLDivElement>(null)

  const allModes = [
    { id: "standard", name: "Standard", premium: false, icon: "🔄", description: "Balanced paraphrasing with meaning preservation" },
    { id: "fluency", name: "Fluency", premium: false, icon: "💬", description: "Improve readability and flow" },
    { id: "formal", name: "Formal", premium: true, icon: "👔", description: "Professional and business-appropriate tone" },
    { id: "simple", name: "Simple", premium: true, icon: "📝", description: "Simplify complex language" },
    { id: "creative", name: "Creative", premium: true, icon: "🎨", description: "Creative rewriting with stylistic changes" },
    { id: "expand", name: "Expand", premium: true, icon: "📈", description: "Add more details and elaboration" },
    { id: "shorten", name: "Shorten", premium: true, icon: "📉", description: "Make more concise and to the point" },
    { id: "academic", name: "Academic", premium: true, icon: "🎓", description: "Academic writing with proper terminology" },
    { id: "casual", name: "Casual", premium: true, icon: "😊", description: "Everyday conversational tone" },
  ]

  const languages = [
    { id: "en-US", name: "English", flag: "🇺🇸" },
    { id: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { id: "es", name: "Spanish", flag: "🇪🇸" },
    { id: "fr", name: "French", flag: "🇫🇷" },
    { id: "de", name: "German", flag: "🇩🇪" },
    { id: "it", name: "Italian", flag: "🇮🇹" },
    { id: "pt", name: "Portuguese", flag: "🇵🇹" },
  ]

  const WORD_LIMIT = isPremium ? 2000 : 500

  // Update word and character count
  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(w => w)
    setWordCount(inputText.trim() ? words.length : 0)
    setCharCount(inputText.length)
  }, [inputText])

  // Close synonym box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (synonymBoxRef.current && !synonymBoxRef.current.contains(event.target as Node)) {
        setSelectedWord(null)
        setSynonyms([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show toast notification
  const showToastMessage = (message: string, type: "success" | "error" = "success") => {
    setShowToast({ show: true, message, type })
    setTimeout(() => setShowToast({ show: false, message: "", type: "success" }), 3000)
  }

  // Mock paraphrase API function
  const mockParaphraseAPI = async (text: string, mode: string, synonymLevel: number, language: string): Promise<ApiResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simple paraphrasing logic (in a real app, this would call your actual API)
    const words = text.split(' ');
    const changedWords = [];
    
    // Determine change intensity based on synonym level
    const changeIntensity = synonymLevel / 100;
    const wordsToChange = Math.max(1, Math.floor(words.length * changeIntensity * 0.3));

    // Mock word replacements based on mode
    const replacements: { [key: string]: string[] } = {
      standard: ['modified', 'adjusted', 'altered', 'revised'],
      fluency: ['improved', 'enhanced', 'refined', 'polished'],
      formal: ['utilize', 'implement', 'facilitate', 'endeavor'],
      simple: ['use', 'make', 'help', 'try'],
      creative: ['transform', 'reimagine', 'rework', 'recast'],
      academic: ['hypothesize', 'postulate', 'corroborate', 'substantiate'],
      casual: ['gonna', 'wanna', 'cool', 'awesome']
    };

    const paraphrasedWords = [...words];
    for (let i = 0; i < wordsToChange; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const originalWord = words[randomIndex].replace(/[^\w]/g, '');
      
      if (originalWord.length > 3) {
        const modeReplacements = replacements[mode] || replacements.standard;
        const replacement = modeReplacements[Math.floor(Math.random() * modeReplacements.length)];
        
        paraphrasedWords[randomIndex] = paraphrasedWords[randomIndex].replace(
          originalWord, 
          replacement
        );
        
        changedWords.push({
          original: originalWord,
          replacement: replacement,
          position: randomIndex
        });
      }
    }

    const paraphrasedText = paraphrasedWords.join(' ');

    return {
      original: text,
      paraphrased: paraphrasedText,
      changedWords,
      originalityScore: Math.min(100, Math.floor(70 + Math.random() * 25)),
      readabilityScore: Math.min(100, Math.floor(65 + Math.random() * 30)),
      processingTime: 1800 + Math.floor(Math.random() * 1200),
      modeUsed: mode,
      language: language
    };
  };

  // Mock synonyms API function
  const mockSynonymsAPI = async (word: string, sentence: string, context: string, language: string): Promise<SynonymResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const synonymLists: { [key: string]: string[] } = {
      'hello': ['hi', 'greetings', 'salutations', 'howdy', 'welcome'],
      'good': ['excellent', 'great', 'wonderful', 'superb', 'outstanding'],
      'bad': ['poor', 'terrible', 'awful', 'subpar', 'inferior'],
      'big': ['large', 'huge', 'enormous', 'massive', 'gigantic'],
      'small': ['tiny', 'little', 'miniature', 'compact', 'petite'],
      'happy': ['joyful', 'pleased', 'delighted', 'content', 'ecstatic'],
      'sad': ['unhappy', 'depressed', 'melancholy', 'gloomy', 'downcast'],
      'beautiful': ['gorgeous', 'stunning', 'lovely', 'attractive', 'picturesque'],
      'ugly': ['unattractive', 'hideous', 'unsightly', 'repulsive', 'grotesque'],
      'smart': ['intelligent', 'clever', 'bright', 'brilliant', 'knowledgeable']
    };

    const defaultSynonyms = ['alternative', 'substitute', 'replacement', 'equivalent', 'variation'];

    return {
      synonyms: synonymLists[word.toLowerCase()] || defaultSynonyms,
      originalWord: word,
      context: sentence
    };
  };

  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      showToastMessage("Please enter some text to paraphrase", "error")
      return
    }

    if (wordCount > WORD_LIMIT) {
      showToastMessage(`Text exceeds ${WORD_LIMIT} word limit. Current: ${wordCount} words`, "error")
      return
    }

    const selectedMode = allModes.find((m) => m.id === mode)
    if (selectedMode?.premium && !isPremium) {
      setShowUpgradeModal(true)
      return
    }

    setIsProcessing(true)
    setApiResult(null)
    setChangedWords([])
    setCurrentSentence(0)
    setOriginalityScore(null)
    setReadabilityScore(null)
    setProcessingTime(null)

    const startTime = Date.now()

    try {
      // In a real application, you would use:
      // const response = await fetch('/api/paraphrase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     text: inputText,
      //     mode: mode,
      //     synonymLevel: synonymLevel,
      //     language: language,
      //   }),
      // })
      // const result = await response.json()

      // Using mock API for demonstration
      const result = await mockParaphraseAPI(inputText, mode, synonymLevel, language);
      
      setOutputText(result.paraphrased)
      setApiResult(result)
      setChangedWords(result.changedWords || [])
      setOriginalityScore(result.originalityScore)
      setReadabilityScore(result.readabilityScore)
      
      const endTime = Date.now()
      setProcessingTime(endTime - startTime)
      
      showToastMessage("Text paraphrased successfully!")

      // Log API result for debugging
      console.log("API Result:", result);

    } catch (error) {
      console.error("Paraphrasing error:", error)
      showToastMessage("Failed to paraphrase text. Please try again.", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWordClick = async (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    
    const cleanWord = word.replace(/[^\w'-]/g, "")
    if (cleanWord.length < 2) return

    const rect = event.currentTarget.getBoundingClientRect()
    setSynonymPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    })

    setSelectedWord(cleanWord)
    setLoadingSynonyms(true)
    
    const sentences = getSentences(outputText)
    const currentSentenceText = sentences[currentSentence] || outputText

    try {
      // In a real application, you would use:
      // const response = await fetch('/api/synonyms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     word: cleanWord,
      //     sentence: currentSentenceText,
      //     context: outputText,
      //     language: language,
      //   }),
      // })
      // const result = await response.json()

      // Using mock API for demonstration
      const result = await mockSynonymsAPI(cleanWord, currentSentenceText, outputText, language);
      setSynonyms(result.synonyms || [])

    } catch (error) {
      console.error("Synonyms error:", error)
      setSynonyms(["alternative", "substitute", "replacement", "equivalent"])
    } finally {
      setLoadingSynonyms(false)
    }
  }

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      const regex = new RegExp(`\\b${selectedWord}\\b`, "gi")
      const newText = outputText.replace(regex, synonym)
      setOutputText(newText)
      setSelectedWord(null)
      setSynonyms([])
      
      // Update API result with the manual change
      if (apiResult) {
        const updatedApiResult = {
          ...apiResult,
          paraphrased: newText,
          changedWords: [
            ...apiResult.changedWords,
            {
              original: selectedWord,
              replacement: synonym,
              position: -1 // Indicates manual change
            }
          ]
        };
        setApiResult(updatedApiResult);
        setChangedWords(updatedApiResult.changedWords);
      }
      
      showToastMessage(`Replaced "${selectedWord}" with "${synonym}"`)
    }
  }

  const getSentences = (text: string) => {
    return text.match(/[^.!?]+[.!?]+/g) || [text]
  }

  const isWordChanged = (word: string) => {
    const cleanWord = word.replace(/[^\w'-]/g, "").toLowerCase()
    return changedWords.some(cw => 
      cw.original?.toLowerCase() === cleanWord ||
      cw.replacement?.toLowerCase() === cleanWord
    )
  }

  const renderOutputText = () => {
    const sentences = getSentences(outputText)
    const currentSentenceText = sentences[currentSentence] || ""
    
    return currentSentenceText.split(/(\s+)/).map((part, index) => {
      if (/^\s+$/.test(part)) return part
      
      const cleanWord = part.replace(/[^\w'-]/g, "")
      if (cleanWord.length === 0) return part

      const isChanged = isWordChanged(cleanWord)
      const punctuation = part.match(/[^\w'-]+$/)?.[0] || ""
      const wordOnly = part.replace(/[^\w'-]+$/, "")

      return (
        <span
          key={index}
          onClick={(e) => handleWordClick(wordOnly, e)}
          className={`cursor-pointer transition-all rounded px-0.5 ${
            isChanged 
              ? "text-blue-700 bg-blue-50 border-b-2 border-blue-500 font-medium" 
              : "hover:bg-gray-100 hover:text-gray-800"
          }`}
          title="Click for synonyms"
        >
          {wordOnly}{punctuation}
        </span>
      )
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
      showToastMessage("Copied to clipboard!")
    } catch (err) {
      showToastMessage("Failed to copy text", "error")
    }
  }

  const downloadText = () => {
    const element = document.createElement("a")
    const file = new Blob([outputText], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = "paraphrased-text.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    showToastMessage("Text downloaded!")
  }

  // Function to view API result details (for debugging)
  const viewApiResultDetails = () => {
    if (apiResult) {
      console.log("Full API Result:", apiResult);
      alert(`API Result Details:\nMode: ${apiResult.modeUsed}\nLanguage: ${apiResult.language}\nChanged Words: ${apiResult.changedWords.length}\nOpen console for full details.`);
    }
  }

  const sentences = getSentences(outputText)
  const isOverLimit = wordCount > WORD_LIMIT

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  AI Paraphraser
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  Rewrite text while preserving meaning with advanced AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-slate-600">
                <div className="flex items-center space-x-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center space-x-1 bg-slate-100 px-3 py-1.5 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                  <span>{charCount} chars</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsPremium(!isPremium)}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center text-sm shadow-sm ${
                  isPremium 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md"
                    : "bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-800 hover:to-slate-900"
                }`}
              >
                <Crown className="w-4 h-4 mr-2" />
                <span>{isPremium ? "Premium" : "Upgrade"}</span>
              </button>

              {/* Debug button to view API result */}
              {apiResult && (
                <button
                  onClick={viewApiResultDetails}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg"
                  title="View API Result Details"
                >
                  Debug
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        {outputText && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{originalityScore || 0}%</div>
                <div className="text-xs text-slate-500 mt-1">Originality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{readabilityScore || 0}%</div>
                <div className="text-xs text-slate-500 mt-1">Readability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{changedWords.length}</div>
                <div className="text-xs text-slate-500 mt-1">Words Changed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{processingTime ? `${processingTime}ms` : '-'}</div>
                <div className="text-xs text-slate-500 mt-1">Processing Time</div>
              </div>
            </div>
            {apiResult && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500 text-center">
                Mode: <span className="font-medium">{apiResult.modeUsed}</span> • 
                Language: <span className="font-medium">{apiResult.language}</span> • 
                API Time: <span className="font-medium">{apiResult.processingTime}ms</span>
              </div>
            )}
          </div>
        )}

        {/* Rest of the component remains the same */}
        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          {/* Language Selection */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700">Language:</span>
                <div className="flex flex-wrap gap-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                        language === lang.id
                          ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 border border-transparent"
                      }`}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-sm font-medium text-slate-700">Mode:</span>
                  <div className="flex flex-wrap gap-2">
                    {allModes.map((modeOption) => (
                      <button
                        key={modeOption.id}
                        onClick={() => {
                          if (modeOption.premium && !isPremium) {
                            setShowUpgradeModal(true)
                          } else {
                            setMode(modeOption.id)
                          }
                        }}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all relative group ${
                          mode === modeOption.id
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                            : modeOption.premium && !isPremium
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        <span className="mr-2">{modeOption.icon}</span>
                        {modeOption.name}
                        {modeOption.premium && !isPremium && (
                          <Crown className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
                        )}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {modeOption.description}
                          {modeOption.premium && !isPremium && " (Premium)"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Synonym Slider */}
              <div className="flex items-center space-x-4 bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Synonyms:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={synonymLevel}
                    onChange={(e) => setSynonymLevel(Number(e.target.value))}
                    className="w-24 sm:w-32 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-sm text-blue-600 font-medium w-8">{synonymLevel}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-slate-600" />
                  Original Text
                </h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={isOverLimit ? "text-red-600 font-medium" : "text-slate-600"}>
                    {wordCount} / {WORD_LIMIT} words
                  </span>
                  {isOverLimit && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here to paraphrase..."
                className="w-full h-96 min-h-96 p-4 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 leading-relaxed text-base"
              />

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
                <button
                  onClick={() => setInputText("")}
                  disabled={!inputText.trim()}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Clear Text
                </button>
                
                <button
                  onClick={handleParaphrase}
                  disabled={!inputText.trim() || isProcessing || isOverLimit}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Paraphrase Text
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-slate-600" />
                  Paraphrased Text
                </h3>
                <div className="flex items-center space-x-2">
                  {outputText && (
                    <>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={downloadText}
                        className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col">
              {outputText ? (
                <>
                  <div
                    ref={outputRef}
                    className="w-full h-96 min-h-96 p-4 border border-slate-300 rounded-lg overflow-y-auto text-slate-700 leading-relaxed bg-white text-base"
                    onClick={() => {
                      setSelectedWord(null)
                      setSynonyms([])
                    }}
                  >
                    {renderOutputText()}
                  </div>

                  {/* Sentence Navigation */}
                  {sentences.length > 1 && (
                    <div className="flex items-center justify-center space-x-4 pt-4 border-t border-slate-200 mt-4">
                      <button
                        onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                        disabled={currentSentence === 0}
                        className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-slate-600 font-medium">
                        Sentence {currentSentence + 1} of {sentences.length}
                      </span>
                      <button
                        onClick={() => setCurrentSentence(Math.min(sentences.length - 1, currentSentence + 1))}
                        disabled={currentSentence === sentences.length - 1}
                        className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Stats Bar */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200 mt-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        Changed words
                      </span>
                      <span className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Synonyms available
                      </span>
                    </div>
                    <span className="text-slate-400">
                      Click any word for synonyms
                    </span>
                  </div>
                </>
              ) : (
                <div className="w-full h-96 min-h-96 flex items-center justify-center text-slate-400 border border-slate-300 rounded-lg bg-slate-50">
                  <div className="text-center">
                    <RefreshCw className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Paraphrased text will appear here</p>
                    <p className="text-xs mt-1">Enter text and click "Paraphrase Text"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Synonym Dropdown */}
        {selectedWord && synonyms.length > 0 && (
          <div
            ref={synonymBoxRef}
            className="fixed bg-white border border-slate-300 rounded-lg shadow-xl py-2 z-50"
            style={{
              top: `${synonymPosition.top}px`,
              left: `${synonymPosition.left}px`,
              minWidth: '180px',
              maxWidth: '220px'
            }}
          >
            <div className="px-3 py-2 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-700">Synonyms for "{selectedWord}"</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loadingSynonyms ? (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading synonyms...
                </div>
              ) : (
                synonyms.map((synonym, idx) => (
                  <button
                    key={idx}
                    onClick={() => replaceWord(synonym)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors text-slate-700 hover:text-blue-700 flex items-center"
                  >
                    <span className="flex-1">{synonym}</span>
                    {isWordChanged(synonym) && (
                      <CheckCircle className="w-3 h-3 text-green-500 ml-2" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Upgrade to Premium</h3>
                <p className="text-slate-600 mb-6">
                  Unlock all paraphrasing modes and advanced features for professional writing.
                </p>
                <div className="space-y-3 mb-6 text-left">
                  <div className="flex items-center space-x-3 text-slate-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>All 9 paraphrasing modes</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Advanced synonym suggestions</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Higher word limits (2,000 words)</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span>Detailed analytics & insights</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      setIsPremium(true)
                      setShowUpgradeModal(false)
                      showToastMessage("Welcome to Premium!")
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 font-medium shadow-sm transition-all"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast.show && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transition-all duration-300 ${
            showToast.type === "success" 
              ? "bg-green-500 text-white" 
              : "bg-red-500 text-white"
          }`}>
            {showToast.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{showToast.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParaphraserPage