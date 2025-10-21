"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { RefreshCw, Copy, Download, Crown, ChevronUp, ChevronDown, Zap, Settings, FileText, BarChart3, Sparkles, CheckCircle, AlertCircle, Upload, Trash2, Search, Lock, Globe, Shield } from "lucide-react"

// Make interfaces completely flexible
interface ApiResult {
  [key: string]: any; // Allow any properties from API
}

interface SynonymResponse {
  synonyms?: string[];
  originalWord?: string;
  context?: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
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
  const [files, setFiles] = useState<File[]>([])
  const [wordsUsed, setWordsUsed] = useState(0)
  const [wordsLimit, setWordsLimit] = useState(1000)
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" })
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  const languages: Language[] = [
    { code: "en-US", name: "English (US)", flag: "🇺🇸" },
    { code: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
  ]

  const WORD_LIMIT = isPremium ? 2000 : 500
  const usagePercentage = (wordsUsed / wordsLimit) * 100
  const remainingWords = wordsLimit - wordsUsed

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

  const getApiBaseUrl = () => {
    return ''
  }

  const handleParaphrase = async () => {
    console.log('Starting paraphrasing...')
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

    try {
      const apiUrl = `${getApiBaseUrl()}/api/paraphrase`
      console.log('Making request to:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          mode: mode,
          synonymLevel: synonymLevel,
          language: language,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} - ${response.statusText}`)
      }

      const result = await response.json()
      console.log('API Response received:', result)

      // Use the API response directly - NO VALIDATION
      setOutputText(result.paraphrased || result.output || result.result || inputText)
      setApiResult(result)
      setChangedWords(result.changedWords || [])
      setWordsUsed(prev => prev + inputText.split(" ").filter(w => w).length)

      showToastMessage("Text paraphrased successfully!")

    } catch (error) {
      console.error("Paraphrasing error:", error)
      showToastMessage("Failed to paraphrase text. Please try again.", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length > 0) {
      setFiles((prev) => [...prev, ...uploadedFiles])

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText((prev) => prev + (prev ? "\n" : "") + content)
      }
      reader.readAsText(uploadedFiles[0])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
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
      const apiUrl = `${getApiBaseUrl()}/api/synonyms`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: cleanWord,
          sentence: currentSentenceText,
          context: outputText,
          language: language,
        }),
      })

      if (!response.ok) {
        throw new Error(`Synonyms API error: ${response.status}`)
      }

      const result: SynonymResponse = await response.json()
      setSynonyms(result.synonyms || [])

    } catch (error) {
      console.error("Synonyms error:", error)
      setSynonyms([])
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
        const manualChange = {
          original: selectedWord,
          replacement: synonym,
          type: "manual"
        };
        
        const updatedApiResult = {
          ...apiResult,
          paraphrased: newText,
          changedWords: [...(apiResult.changedWords || []), manualChange]
        };
        
        setApiResult(updatedApiResult);
        setChangedWords(updatedApiResult.changedWords || []);
      }

      showToastMessage(`Replaced "${selectedWord}" with "${synonym}"`)
    }
  }

  const getSentences = (text: string) => {
    return text.match(/[^.!?]+[.!?]+/g) || [text]
  }

  const isWordChanged = (word: string) => {
    const cleanWord = word.replace(/[^\w'-]/g, "").toLowerCase()
    return changedWords.some((cw: any) => 
      cw.original?.toLowerCase() === cleanWord ||
      cw.replacement?.toLowerCase() === cleanWord
    )
  }

  const renderOutputText = () => {
    if (!outputText) return null;

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

  const downloadResult = () => {
    if (!apiResult) return

    const reportContent = `PARAPHRASING REPORT
==================

Original Text:
${apiResult.original || inputText}

Paraphrased Text:
${apiResult.paraphrased || outputText}

Metrics:
- Similarity Score: ${apiResult.similarityScore || 0}%
- Uniqueness Score: ${apiResult.uniquenessScore || 0}%
- Words Changed: ${apiResult.changes || apiResult.changedWords?.length || 0}
- Change Percentage: ${apiResult.changePercentage || 0}%
- Readability Improvement: ${((apiResult.readabilityImprovement || 0) * 100).toFixed(1)}%
- Mode: ${apiResult.mode || mode}
- Language: ${apiResult.language || language}
- Processing Time: ${apiResult.processingTime || 0}s

Changes Made:
${(apiResult.changedWords || []).map((change: any, index: number) => `- "${change.original}" → "${change.replacement}" (${change.type || 'synonym'})`).join("\n")}

Generated by AI Paraphraser
${new Date().toLocaleDateString()}`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "paraphrasing-report.txt"
    a.click()
    URL.revokeObjectURL(url)
    showToastMessage("Report downloaded!")
  }

  const sentences = getSentences(outputText)
  const isOverLimit = wordCount > WORD_LIMIT

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Paraphraser</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Rewrite text while preserving meaning with advanced AI
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button
                className="px-3 py-2 sm:px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center text-xs sm:text-sm"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Detection</span>
                <span className="sm:hidden">Detect</span>
              </button>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-3 py-2 sm:px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Upgrade to Premium</span>
                <span className="sm:hidden">Premium</span>
              </button>
            </div>
          </div>
          
          {/* Usage Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Words Used This Month</span>
              <span className="text-xs sm:text-sm text-gray-600">
                {wordsUsed.toLocaleString()} / {wordsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-yellow-500" : "bg-blue-500"}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{remainingWords.toLocaleString()} words remaining</span>
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Get unlimited
              </button>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Paraphrasing Mode</h3>
            <span className="text-xs sm:text-sm text-gray-500">Choose your preferred style</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
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
                className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  mode === modeOption.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                } ${modeOption.premium && !isPremium ? "opacity-75" : ""}`}
              >
                <div className="flex items-center justify-center mb-2">
                  <span className="text-base">{modeOption.icon}</span>
                  {modeOption.premium && !isPremium && (
                    <Lock className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div className="font-medium text-gray-900 text-xs sm:text-sm">{modeOption.name}</div>
                <div className="text-xs text-gray-500 mt-1 hidden sm:block">{modeOption.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 min-w-0"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Synonym Level */}
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Synonyms:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={synonymLevel}
                  onChange={(e) => setSynonymLevel(Number(e.target.value))}
                  className="flex-1 sm:w-16 lg:w-20 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 min-w-max">{synonymLevel}%</span>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm transition-colors"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {files.length > 0 && (
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Uploaded Files</h4>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Original Text</h2>
                <div className="flex items-center space-x-2">
                  {inputText && (
                    <>
                      <button
                        onClick={() => navigator.clipboard.writeText(inputText)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => setInputText("")}
                        className="p-1 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your text here to paraphrase..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span>{inputText.length} characters</span>
                    <span>•</span>
                    <span>{inputText.split(" ").filter((w) => w.trim()).length} words</span>
                  </div>
                  {apiResult && (
                    <div className="flex items-center space-x-2">
                      <span>•</span>
                      <span className="text-green-600">Processed in {apiResult.processingTime || 0}s</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleParaphrase}
                  disabled={!inputText.trim() || isProcessing || isOverLimit}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Paraphrase Text</span>
                      <span className="sm:hidden">Paraphrase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Paraphrased Text</h2>
              {outputText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>

            <div 
              ref={outputRef}
              className="h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto text-sm sm:text-base leading-relaxed"
              onClick={() => {
                setSelectedWord(null)
                setSynonyms([])
              }}
            >
              {outputText ? (
                renderOutputText()
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
                    <p className="text-sm sm:text-base">Paraphrased text will appear here</p>
                    <p className="text-xs text-gray-500 mt-2">Process your text to see the paraphrased version</p>
                  </div>
                </div>
              )}
            </div>

            {apiResult && (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-base sm:text-lg font-bold text-blue-600">
                      {apiResult.similarityScore || 0}%
                    </div>
                    <div className="text-xs text-blue-600">Similarity</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-base sm:text-lg font-bold text-green-600">
                      {apiResult.uniquenessScore || 0}%
                    </div>
                    <div className="text-xs text-green-600">Uniqueness</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-base sm:text-lg font-bold text-purple-600">
                      {apiResult.changes || apiResult.changedWords?.length || 0}
                    </div>
                    <div className="text-xs text-purple-600">Changes Made</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-base sm:text-lg font-bold text-amber-600">
                      {apiResult.processingTime || 0}s
                    </div>
                    <div className="text-xs text-amber-600">Processing Time</div>
                  </div>
                </div>

                {/* Sentence Navigation */}
                {sentences.length > 1 && (
                  <div className="flex items-center justify-center space-x-4 pt-4 border-t border-gray-200 mt-4">
                    <button
                      onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                      disabled={currentSentence === 0}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      Sentence {currentSentence + 1} of {sentences.length}
                    </span>
                    <button
                      onClick={() => setCurrentSentence(Math.min(sentences.length - 1, currentSentence + 1))}
                      disabled={currentSentence === sentences.length - 1}
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Synonym Dropdown */}
        {selectedWord && synonyms.length > 0 && (
          <div
            ref={synonymBoxRef}
            className="fixed bg-white border border-gray-300 rounded-lg shadow-xl py-2 z-50"
            style={{
              top: `${synonymPosition.top}px`,
              left: `${synonymPosition.left}px`,
              minWidth: '180px',
              maxWidth: '220px'
            }}
          >
            <div className="px-3 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-700">Synonyms for "{selectedWord}"</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loadingSynonyms ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                  Loading synonyms...
                </div>
              ) : (
                synonyms.map((synonym, idx) => (
                  <button
                    key={idx}
                    onClick={() => replaceWord(synonym)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-700 flex items-center"
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
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Unlock all paraphrasing modes and advanced features
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">All 9 paraphrasing modes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Unlimited word processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Advanced synonym suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Bulk document processing</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
                <button 
                  onClick={() => {
                    setIsPremium(true)
                    setShowUpgradeModal(false)
                    showToastMessage("Welcome to Premium!")
                  }}
                  className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
                >
                  Upgrade Now
                </button>
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

        {/* Features Grid */}
        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Smart Paraphrasing</h3>
            <p className="text-xs sm:text-sm text-gray-600">Rewrite text while preserving original meaning</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Multiple Modes</h3>
            <p className="text-xs sm:text-sm text-gray-600">Choose from 9 different paraphrasing styles</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Multi-Language</h3>
            <p className="text-xs sm:text-sm text-gray-600">Support for 14+ languages worldwide</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParaphraserPage