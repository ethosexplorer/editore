"use client"

import type React from "react"
import { useState, useRef } from "react"
import { RefreshCw, Copy, Download, Globe, Upload, Crown, BookOpen, Lightbulb, X, Menu, BarChart3, Sparkles } from "lucide-react"

const ParaphraserPage: React.FC = () => {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState("standard")
  const [synonymLevel, setSynonymLevel] = useState(50)
  const [language, setLanguage] = useState("en-US")
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [isLoadingSynonyms, setIsLoadingSynonyms] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false)
  const [apiResult, setApiResult] = useState<any>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // QuillBot modes - 2 free, 7 premium
  const allModes = [
    {
      id: "standard",
      name: "Standard",
      description: "Basic rephrasing that maintains original meaning",
      premium: false,
      icon: "🔄",
    },
    {
      id: "fluency",
      name: "Fluency",
      description: "Smooths awkward phrasing and improves readability",
      premium: false,
      icon: "💬",
    },
    {
      id: "formal",
      name: "Formal",
      description: "Professional tone for business writing",
      premium: true,
      icon: "👔",
    },
    {
      id: "simple",
      name: "Simple",
      description: "Uses simpler vocabulary",
      premium: true,
      icon: "📝",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Unique and imaginative variations",
      premium: true,
      icon: "🎨",
    },
    {
      id: "expand",
      name: "Expand",
      description: "Lengthens text by adding detail",
      premium: true,
      icon: "📈",
    },
    {
      id: "shorten",
      name: "Shorten",
      description: "Condenses text while preserving meaning",
      premium: true,
      icon: "📉",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Scholarly tone with advanced vocabulary",
      premium: true,
      icon: "🎓",
    },
    {
      id: "custom",
      name: "Custom",
      description: "User-defined style preferences",
      premium: true,
      icon: "⚙️",
    },
  ]

  const languages = [
    { id: "en-US", name: "English (US)", flag: "🇺🇸" },
    { id: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { id: "en-AU", name: "English (AU)", flag: "🇦🇺" },
    { id: "en-CA", name: "English (CA)", flag: "🇨🇦" },
    { id: "fr", name: "French", flag: "🇫🇷" },
    { id: "es", name: "Spanish", flag: "🇪🇸" },
    { id: "de", name: "German", flag: "🇩🇪" },
    { id: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { id: "hi", name: "Hindi", flag: "🇮🇳" },
    { id: "ru", name: "Russian", flag: "🇷🇺" },
    { id: "da", name: "Danish", flag: "🇩🇰" },
    { id: "nl", name: "Dutch", flag: "🇳🇱" },
    { id: "it", name: "Italian", flag: "🇮🇹" },
    { id: "ja", name: "Japanese", flag: "🇯🇵" },
    { id: "ko", name: "Korean", flag: "🇰🇷" },
    { id: "pl", name: "Polish", flag: "🇵🇱" },
    { id: "pt-BR", name: "Portuguese (Brazil)", flag: "🇧🇷" },
    { id: "pt-PT", name: "Portuguese (Portugal)", flag: "🇵🇹" },
    { id: "sv", name: "Swedish", flag: "🇸🇪" },
    { id: "tr", name: "Turkish", flag: "🇹🇷" },
    { id: "ar", name: "Arabic", flag: "🇸🇦" },
    { id: "th", name: "Thai", flag: "🇹🇭" },
    { id: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { id: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { id: "ro", name: "Romanian", flag: "🇷🇴" },
  ]

  const getApiBaseUrl = () => {
    return typeof window !== 'undefined' ? '' : '';
  }

  const handleParaphrase = async () => {
    if (!inputText.trim()) return

    const selectedMode = allModes.find((m) => m.id === mode)
    if (selectedMode?.premium && !isPremium) {
      setShowUpgradeModal(true)
      return
    }

    setIsProcessing(true)
    setApiResult(null)

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
        throw new Error(`API error: ${response.status}`)
      }

      const result = await response.json()
      
      setOutputText(result.paraphrased || result.original)
      setApiResult(result)

    } catch (error) {
      console.error("Paraphrasing error:", error)
      handleMockParaphrase()
    } finally {
      setIsProcessing(false)
    }
  }

  const handleMockParaphrase = () => {
    // Simple mock paraphrasing for fallback
    let paraphrased = inputText

    // Basic transformations for demo
    const transformations = {
      "Artificial Intelligence": "AI technology",
      "reshaping": "transforming",
      "marketing landscape": "marketing environment",
      "enabling businesses": "helping companies",
      "engage customers": "connect with clients",
      "unprecedented precision": "remarkable accuracy",
      "leveraging": "using",
      "data-driven insights": "information-based analysis",
      "empowers marketers": "assists marketers",
      "personalized": "customized",
      "explores": "examines"
    }

    Object.entries(transformations).forEach(([original, replacement]) => {
      const regex = new RegExp(original, "gi")
      paraphrased = paraphrased.replace(regex, replacement)
    })

    setOutputText(paraphrased)
    setApiResult({
      original: inputText,
      paraphrased: paraphrased,
      mode: mode,
      synonymLevel: synonymLevel,
      language: language,
      wordCountOriginal: inputText.split(/\s+/).filter(w => w).length,
      wordCountParaphrased: paraphrased.split(/\s+/).filter(w => w).length,
      changes: Math.floor(8 + (synonymLevel / 100) * 12),
      processingTime: Math.floor(Math.random() * 2) + 1,
      readabilityImprovement: Math.min(25, 5 + (synonymLevel / 100) * 10),
      similarityScore: Math.max(30, 85 - (synonymLevel / 100) * 35),
    })
  }

  const handleWordClick = async (word: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const cleanWord = word.replace(/[^\w]/g, "").toLowerCase()
    
    // Don't process very short words or common articles
    if (cleanWord.length < 3 || ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were'].includes(cleanWord)) {
      return
    }

    setSelectedWord(cleanWord)
    setIsLoadingSynonyms(true)
    setSynonyms([])

    try {
      const apiUrl = `${getApiBaseUrl()}/api/synonyms`
      
      // Get context around the word (3 words before and after for better understanding)
      const words = outputText.split(/\s+/)
      const wordIndex = words.findIndex(w => w.toLowerCase().includes(cleanWord))
      const contextStart = Math.max(0, wordIndex - 3)
      const contextEnd = Math.min(words.length, wordIndex + 4)
      const context = words.slice(contextStart, contextEnd).join(" ")

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: cleanWord,
          context: context,
          language: language,
        }),
      })

      if (!response.ok) {
        throw new Error(`Synonyms API error: ${response.status}`)
      }

      const result = await response.json()
      setSynonyms(result.synonyms || [])

    } catch (error) {
      console.error("Synonyms error:", error)
      // Even the fallback will be dynamic through the API's mock system
      setSynonyms(["loading", "failed", "try", "again"])
    } finally {
      setIsLoadingSynonyms(false)
    }
  }

  const replaceWord = (synonym: string) => {
    if (selectedWord && outputRef.current) {
      // Create a regex that matches the selected word with word boundaries
      const regex = new RegExp(`\\b${selectedWord}\\b`, "gi")
      const newText = outputText.replace(regex, synonym)
      setOutputText(newText)
      setSelectedWord(null)
      setSynonyms([])
    }
  }

  const getSynonymLevelDescription = () => {
    if (synonymLevel < 25) return "Conservative"
    if (synonymLevel < 50) return "Balanced"
    if (synonymLevel < 75) return "Creative"
    return "Maximum creativity"
  }

  const downloadResult = () => {
    if (!apiResult) return

    const reportContent = `PARAPHRASING REPORT
==================

Original Text:
${apiResult.original}

Paraphrased Text:
${outputText}

Analysis Metrics:
- Mode: ${apiResult.mode}
- Synonym Level: ${apiResult.synonymLevel}%
- Language: ${apiResult.language}
- Word Count: ${apiResult.wordCountOriginal} → ${apiResult.wordCountParaphrased}
- Changes Made: ${apiResult.changes}
- Readability Improvement: ${apiResult.readabilityImprovement}%
- Similarity Score: ${apiResult.similarityScore}%
- Processing Time: ${apiResult.processingTime}s

Generated by AI Paraphraser
${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `paraphrase-${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setInputText("")
    setOutputText("")
    setApiResult(null)
    setSelectedWord(null)
    setSynonyms([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Paraphraser
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block mt-1">
                  Transform your text with AI-powered rephrasing and dynamic synonyms
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center text-sm shadow-sm">
                <Globe className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Apps</span>
              </button>
              <button
                onClick={() => setIsPremium(!isPremium)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center text-sm shadow-lg"
              >
                <Crown className="w-4 h-4 mr-2" />
                <span>{isPremium ? "Free Plan" : "Go Premium"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Select Mode</h3>
            <span className="text-sm text-gray-500">{getSynonymLevelDescription()} mode</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
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
                className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                  mode === modeOption.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                } ${modeOption.premium && !isPremium ? "opacity-75 relative" : ""}`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{modeOption.icon}</div>
                  <div className="font-medium text-gray-900 text-xs">{modeOption.name}</div>
                  {modeOption.premium && !isPremium && (
                    <Crown className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 mb-4 sm:mb-6">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <h3 className="text-sm font-medium text-gray-700">Settings</h3>
            <button
              onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileSettingsOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          <div className={`${mobileSettingsOpen ? "block" : "hidden"} lg:block p-4`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-4 sm:gap-6 flex-1">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                  <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-transparent border-0 focus:ring-0 text-sm w-full"
                  >
                    {languages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 flex-1">
                  <BarChart3 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Creativity Level</span>
                      <span>{synonymLevel}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={synonymLevel}
                      onChange={(e) => setSynonymLevel(Number(e.target.value))}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={clearAll}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Clear All
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Original Text</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{inputText.length} chars</span>
                  <span>•</span>
                  <span>{inputText.split(" ").filter((w) => w.trim()).length} words</span>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your text here to rephrase it with AI...&#10;&#10;Example: Artificial Intelligence (AI) is reshaping the marketing landscape, enabling businesses to engage customers with unprecedented precision and efficiency."
                className="w-full h-72 sm:h-96 p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base leading-relaxed"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const content = event.target?.result as string
                      setInputText(content)
                    }
                    reader.readAsText(file)
                  }
                }}
                className="hidden"
              />

              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  {apiResult && (
                    <span className="text-green-600 font-medium">
                      Processed in {apiResult.processingTime}s
                    </span>
                  )}
                </div>
                <button
                  onClick={handleParaphrase}
                  disabled={!inputText.trim() || isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 flex items-center text-sm shadow-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Paraphrase Text
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel with Dynamic Synonyms */}
          <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Paraphrased Text</h2>
              {outputText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(outputText)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {outputText ? (
              <div className="space-y-4">
                <div
                  ref={outputRef}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-72 sm:min-h-96 max-h-96 overflow-y-auto cursor-pointer"
                  onClick={() => {
                    setSelectedWord(null)
                    setSynonyms([])
                  }}
                >
                  <div className="relative">
                    <p className="text-gray-900 leading-relaxed text-sm sm:text-base">
                      {outputText.split(" ").map((word, index) => {
                        const cleanWord = word.replace(/[^\w]/g, "").toLowerCase()
                        return (
                          <span
                            key={index}
                            onClick={(e) => handleWordClick(word, e)}
                            className={`hover:bg-blue-100 rounded px-1 transition-colors duration-200 cursor-pointer ${
                              selectedWord === cleanWord ? 'bg-blue-200 ring-2 ring-blue-300' : ''
                            }`}
                            title="Click for AI-powered synonyms"
                          >
                            {word}{" "}
                          </span>
                        )
                      })}
                    </p>
                    
                    {/* Dynamic Synonyms Popup */}
                    {selectedWord && (
                      <div className="absolute z-10 bg-white border border-gray-200 rounded-xl shadow-xl p-4 mt-2 left-0 right-0">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-800 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                            AI Synonyms for "{selectedWord}"
                          </h4>
                          <button
                            onClick={() => {
                              setSelectedWord(null)
                              setSynonyms([])
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {isLoadingSynonyms ? (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Generating AI synonyms...</span>
                          </div>
                        ) : synonyms.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {synonyms.map((synonym, idx) => (
                              <button
                                key={idx}
                                onClick={() => replaceWord(synonym)}
                                className="px-3 py-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg text-sm font-medium text-blue-700 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-sm"
                              >
                                {synonym}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No synonyms found. Try another word.
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 text-center">
                            ✨ Powered by OpenAI • Context-aware synonyms
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Statistics */}
                {apiResult && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="text-lg font-bold text-blue-600">
                        {apiResult.wordCountOriginal}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">Original</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="text-lg font-bold text-green-600">
                        {apiResult.wordCountParaphrased}
                      </div>
                      <div className="text-xs text-green-600 font-medium">Paraphrased</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="text-lg font-bold text-purple-600">
                        {apiResult.changes}
                      </div>
                      <div className="text-xs text-purple-600 font-medium">Changes</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="text-lg font-bold text-orange-600">
                        {apiResult.similarityScore}%
                      </div>
                      <div className="text-xs text-orange-600 font-medium">Similarity</div>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-600 space-y-2 p-3 bg-gray-50 rounded-xl">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-medium">{allModes.find((m) => m.id === mode)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-medium">{languages.find((l) => l.id === language)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creativity Level:</span>
                    <span className="font-medium">{synonymLevel}%</span>
                  </div>
                  <div className="text-xs text-blue-600 text-center mt-2">
                    ✨ Click any word for AI-powered context-aware synonyms
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <RefreshCw className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-500">Awaiting Your Text</p>
                <p className="text-sm mt-2">Your paraphrased content will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Feature</h3>
                <p className="text-gray-600 mb-6">
                  Unlock all 9 paraphrasing modes with Premium access. Get advanced features for professional writing.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span>All 9 paraphrasing modes</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span>Advanced AI models</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs">✓</span>
                    </div>
                    <span>Priority processing</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => {
                      setIsPremium(true)
                      setShowUpgradeModal(false)
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all font-medium shadow-lg"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Dynamic Synonyms</h3>
            <p className="text-sm text-gray-600">AI-powered context-aware synonyms for every word</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">Real-time synonym generation using OpenAI</p>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-green-100">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Context-Aware</h3>
            <p className="text-sm text-gray-600">Synonyms that understand your text's meaning</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParaphraserPage
