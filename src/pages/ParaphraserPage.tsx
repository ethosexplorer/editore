"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { RefreshCw, Copy, Download, Globe, Upload, Crown, BookOpen, Lightbulb, X, Menu, BarChart3, ChevronUp, ChevronDown } from "lucide-react"

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
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)
  const [apiResult, setApiResult] = useState<any>(null)
  const [changedWords, setChangedWords] = useState<any[]>([])
  const [currentSentence, setCurrentSentence] = useState(0)
  const [loadingSynonyms, setLoadingSynonyms] = useState(false)
  const outputRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const synonymBoxRef = useRef<HTMLDivElement>(null)

  const allModes = [
    { id: "standard", name: "Standard", premium: false, icon: "🔄" },
    { id: "fluency", name: "Fluency", premium: false, icon: "💬" },
    { id: "formal", name: "Formal", premium: true, icon: "👔" },
    { id: "simple", name: "Simple", premium: true, icon: "📝" },
    { id: "creative", name: "Creative", premium: true, icon: "🎨" },
    { id: "expand", name: "Expand", premium: true, icon: "📈" },
    { id: "shorten", name: "Shorten", premium: true, icon: "📉" },
    { id: "academic", name: "Academic", premium: true, icon: "🎓" },
    { id: "custom", name: "Custom", premium: true, icon: "⚙️" },
  ]

  const languages = [
    { id: "en-US", name: "English (US)", flag: "🇺🇸" },
    { id: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { id: "es", name: "Spanish", flag: "🇪🇸" },
    { id: "fr", name: "French", flag: "🇫🇷" },
    { id: "de", name: "German", flag: "🇩🇪" },
  ]

  const WORD_LIMIT = 125

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

  const handleParaphrase = async () => {
    if (!inputText.trim()) return

    const wordCount = inputText.trim().split(/\s+/).length
    if (wordCount > WORD_LIMIT) {
      alert(`Text exceeds ${WORD_LIMIT} word limit. Current: ${wordCount} words`)
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
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          mode: mode,
          synonymLevel: synonymLevel,
          language: language,
        }),
      })

      const result = await response.json()
      
      setOutputText(result.paraphrased || result.original)
      setApiResult(result)
      setChangedWords(result.changedWords || [])

    } catch (error) {
      console.error("Paraphrasing error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWordClick = async (word: string, event: React.MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation()
    
    const cleanWord = word.replace(/[^\w'-]/g, "")
    if (cleanWord.length < 2) return

    // Get click position
    const rect = event.currentTarget.getBoundingClientRect()
    setSynonymPosition({
      top: rect.bottom + window.scrollY + 5,
      left: rect.left + window.scrollX
    })

    setSelectedWord(cleanWord)
    setLoadingSynonyms(true)
    
    // Get the full sentence for context
    const sentences = getSentences(outputText)
    const currentSentenceText = sentences[currentSentence] || outputText

    try {
      const response = await fetch('/api/synonyms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: cleanWord,
          sentence: currentSentenceText,
          context: outputText,
          language: language,
        }),
      })

      const result = await response.json()
      setSynonyms(result.synonyms || [])
    } catch (error) {
      console.error("Synonyms error:", error)
      setSynonyms(["alternative", "substitute", "replacement"])
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
      if (/^\s+$/.test(part)) return part // whitespace
      
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
              ? "text-red-600 underline decoration-red-400" 
              : "hover:bg-blue-100"
          }`}
          title="Click for synonyms"
        >
          {wordOnly}{punctuation}
        </span>
      )
    })
  }

  const sentences = getSentences(outputText)
  const wordCount = inputText.trim().split(/\s+/).filter(w => w).length
  const isOverLimit = wordCount > WORD_LIMIT

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  AI Paraphraser
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block mt-1">
                  QuillBot-style paraphrasing tool
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPremium(!isPremium)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center text-sm shadow-lg"
            >
              <Crown className="w-4 h-4 mr-2" />
              <span>{isPremium ? "Premium Active" : "Upgrade to Premium"}</span>
            </button>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="bg-white rounded-t-2xl shadow-lg border-x border-t border-green-100 p-3">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                  language === lang.id
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white shadow-lg border-x border-green-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Modes:</span>
              <div className="flex items-center space-x-2 overflow-x-auto">
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
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap relative ${
                      mode === modeOption.id
                        ? "text-green-700 border-b-2 border-green-600"
                        : "text-gray-600 hover:text-gray-900"
                    } ${modeOption.premium && !isPremium ? "opacity-60" : ""}`}
                  >
                    {modeOption.name}
                    {modeOption.premium && !isPremium && (
                      <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Synonym Slider */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Synonyms:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={synonymLevel}
                onChange={(e) => setSynonymLevel(Number(e.target.value))}
                className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <span className="text-sm text-green-600 font-medium w-8">{synonymLevel}%</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-2 gap-0 bg-white shadow-lg border-x border-b border-green-100 rounded-b-2xl">
          {/* Input Section */}
          <div className="border-r border-gray-200">
            <div className="p-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-96 p-4 border-0 resize-none focus:outline-none text-base leading-relaxed"
              />

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className={isOverLimit ? "text-red-600 font-medium" : ""}>
                    {wordCount} / {WORD_LIMIT} Words
                  </span>
                </div>
                <button
                  onClick={handleParaphrase}
                  disabled={!inputText.trim() || isProcessing || isOverLimit}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm shadow-md"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    "Rephrase"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="relative">
            <div className="p-4">
              {outputText ? (
                <>
                  <div
                    ref={outputRef}
                    className="w-full h-96 p-4 text-base leading-relaxed overflow-y-auto"
                    onClick={() => {
                      setSelectedWord(null)
                      setSynonyms([])
                    }}
                  >
                    {renderOutputText()}
                  </div>

                  {/* Sentence Navigation */}
                  {sentences.length > 1 && (
                    <div className="flex items-center justify-center space-x-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                        disabled={currentSentence === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-600">
                        {currentSentence + 1} / {sentences.length} Sentences
                      </span>
                      <button
                        onClick={() => setCurrentSentence(Math.min(sentences.length - 1, currentSentence + 1))}
                        disabled={currentSentence === sentences.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Stats Bar */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                        Changed Words
                      </span>
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
                        Structural Changes
                      </span>
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                        Longest Unchanged Words
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(outputText)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm">Your paraphrased text will appear here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Synonym Dropdown - QuillBot Style */}
        {selectedWord && synonyms.length > 0 && (
          <div
            ref={synonymBoxRef}
            className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl py-2 z-50"
            style={{
              top: `${synonymPosition.top}px`,
              left: `${synonymPosition.left}px`,
              minWidth: '180px',
              maxWidth: '220px'
            }}
          >
            <div className="max-h-64 overflow-y-auto">
              {loadingSynonyms ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Loading...
                </div>
              ) : (
                synonyms.map((synonym, idx) => (
                  <button
                    key={idx}
                    onClick={() => replaceWord(synonym)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors text-gray-800"
                  >
                    {synonym}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8">
              <div className="text-center">
                <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                <p className="text-gray-600 mb-6">
                  Unlock all paraphrasing modes with Premium
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsPremium(true)
                      setShowUpgradeModal(false)
                    }}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParaphraserPage
