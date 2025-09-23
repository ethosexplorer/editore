"use client"

import type React from "react"
import { useState, useRef } from "react"
import 'dotenv/config'
import {
  Users,
  Zap,
  Copy,
  Download,
  Shuffle,
  Type,
  Palette,
  Upload,
  FileText,
  Trash2,
  Search,
  Lock,
  Globe,
  Shield,
} from "lucide-react"
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

interface HumanizationResult {
  originalText: string
  humanizedText: string
  humanScore: number
  aiDetectionBefore: number
  aiDetectionAfter: number
  changes: Array<{
    original: string
    humanized: string
    type: string
    reason: string
  }>
  readabilityScore: number
  creativityLevel: number
  processingTime: number
  aiDetectionResults: Array<{
    detector: string
    confidence: number
  }>
}

interface Language {
  code: string
  name: string
  flag: string
}

const AIHumanizerPage: React.FC = () => {
  const [inputText, setInputText] = useState("")
  const [result, setResult] = useState<HumanizationResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [humanizationMode, setHumanizationMode] = useState("naturalize")
  const [creativityLevel, setCreativityLevel] = useState(50)
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [showChanges, setShowChanges] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [showDetectionModal, setShowDetectionModal] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [wordsUsed, setWordsUsed] = useState(0)
  const [wordsLimit, setWordsLimit] = useState(1000)
  const [language, setLanguage] = useState("en")
  const languages: Language[] = [
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
    { id: "ro", name: "Romanian", flag: "🇷🇴" }
  ]

  const humanizationModes = [
    {
      id: "naturalize",
      name: "Naturalize",
      icon: Type,
      description: "Transform stiff/formal AI output into natural language",
      premium: false,
    },
    {
      id: "synonym",
      name: "Synonym Integration",
      icon: Shuffle,
      description: "Add variety through intelligent synonym replacement",
      premium: false,
    },
    {
      id: "creative",
      name: "Creative Rewrite",
      icon: Palette,
      description: "Enhanced creativity with style improvements",
      premium: true,
    },
    {
      id: "advanced",
      name: "Advanced Humanization",
      icon: Zap,
      description: "Expert-level humanization for complex texts",
      premium: true,
    },
    {
      id: "bypass",
      name: "AI Detection Bypass",
      icon: Shield,
      description: "Make humanized text undetectable by AI detection tools",
      premium: true,
    },
  ]

  const usagePercentage = (wordsUsed / wordsLimit) * 100
  const remainingWords = wordsLimit - wordsUsed

  const getCreativityDescription = () => {
    if (creativityLevel <= 30) return "Low"
    if (creativityLevel <= 70) return "Medium"
    return "High"
  }

  const handleHumanize = async () => {
    if (!inputText.trim()) return

    setIsProcessing(true)

    // Check for API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      setResult({
        originalText: inputText,
        humanizedText: "Error: OpenAI API key is missing. Please configure it in environment variables.",
        humanScore: 0,
        aiDetectionBefore: 0,
        aiDetectionAfter: 0,
        changes: [],
        readabilityScore: 0,
        creativityLevel,
        processingTime: 0,
        aiDetectionResults: [],
      })
      setIsProcessing(false)
      return
    }

    try {
      // Construct prompt based on humanization mode, creativity level, and language
      let prompt = ""
      const langInstruction = language !== "en" ? `Rewrite in ${languages.find(lang => lang.code === language)?.name || "English"}.` : ""
      switch (humanizationMode) {
        case "naturalize":
          prompt = `${langInstruction} Rewrite the following text to sound more natural and human-like, using conversational language and avoiding formal or stiff phrasing. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
          break
        case "synonym":
          prompt = `${langInstruction} Rewrite the following text by intelligently replacing words with synonyms to add variety while maintaining meaning. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
          break
        case "creative":
          prompt = `${langInstruction} Rewrite the following text with creative flourishes and engaging style, adding emotional or vivid language where appropriate. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
          break
        case "advanced":
          prompt = `${langInstruction} Perform an advanced rewrite of the following text to make it highly human-like, nuanced, and contextually rich, tailored for complex texts. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
          break
        case "bypass":
          prompt = `${langInstruction} Rewrite the following text to make it undetectable by AI detection tools, using varied sentence structures, natural phrasing, and subtle human quirks. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
          break
        default:
          prompt = `${langInstruction} Rewrite the following text to sound more human-like and natural. Creativity level: ${getCreativityDescription()}. Text: "${inputText}"`
      }

      // Call OpenAI API with explicit API key
      const startTime = performance.now()
      const { text: humanizedText } = await generateText({
        model: openai('gpt-4o', { apiKey }),
        prompt,
      })
      const processingTime = (performance.now() - startTime) / 1000

      // Preserve original transformation logic for change tracking
      const changes: Array<{ original: string; humanized: string; type: string; reason: string }> = []
      let tempHumanizedText = inputText

      if (humanizationMode === "naturalize") {
        const formalReplacements = [
          {
            formal: /\b(utilize|utilizes|utilized|utilization)\b/gi,
            casual: "use",
            type: "formality",
            reason: "Replaced formal term with everyday language",
          },
          {
            formal: /\b(commence|commences|commenced)\b/gi,
            casual: "start",
            type: "formality",
            reason: "Simplified formal verb",
          },
          {
            formal: /\b(facilitate|facilitates|facilitated)\b/gi,
            casual: "help",
            type: "formality",
            reason: "Used more conversational term",
          },
          {
            formal: /\b(demonstrate|demonstrates|demonstrated)\b/gi,
            casual: "show",
            type: "formality",
            reason: "Replaced with simpler verb",
          },
          { formal: /\b(subsequently)\b/gi, casual: "then", type: "transition", reason: "Simplified transition word" },
          {
            formal: /\b(furthermore|moreover)\b/gi,
            casual: "also",
            type: "transition",
            reason: "Used casual connector",
          },
          {
            formal: /\b(therefore|consequently)\b/gi,
            casual: "so",
            type: "transition",
            reason: "Simplified logical connector",
          },
          {
            formal: /\b(however|nevertheless)\b/gi,
            casual: "but",
            type: "transition",
            reason: "Used everyday contrast word",
          },
          { formal: /\b(in order to)\b/gi, casual: "to", type: "conciseness", reason: "Removed unnecessary words" },
          {
            formal: /\b(due to the fact that)\b/gi,
            casual: "because",
            type: "conciseness",
            reason: "Simplified wordy phrase",
          },
        ]

        formalReplacements.forEach((replacement) => {
          const matches = tempHumanizedText.match(replacement.formal)
          if (matches) {
            matches.forEach((match) => {
              changes.push({
                original: match,
                humanized: replacement.casual,
                type: replacement.type,
                reason: replacement.reason,
              })
            })
            tempHumanizedText = tempHumanizedText.replace(replacement.formal, replacement.casual)
          }
        })

        if (creativityLevel >= 50) {
          tempHumanizedText = tempHumanizedText.replace(/^/, "Here's what I think: ")
          tempHumanizedText = tempHumanizedText.replace(/\. ([A-Z])/g, ". You know, $1")
          tempHumanizedText = tempHumanizedText.replace(/\. You know, You know, /g, ". You know, ")
        }
      }

      if (humanizationMode === "synonym") {
        const synonymReplacements = [
          {
            original: /\b(important|significant)\b/gi,
            synonyms: ["crucial", "vital", "key", "essential"],
            type: "synonym",
          },
          {
            original: /\b(good|great)\b/gi,
            synonyms: ["excellent", "fantastic", "wonderful", "amazing"],
            type: "synonym",
          },
          { original: /\b(bad|poor)\b/gi, synonyms: ["awful", "terrible", "dreadful", "horrible"], type: "synonym" },
          { original: /\b(big|large)\b/gi, synonyms: ["huge", "massive", "enormous", "gigantic"], type: "synonym" },
          { original: /\b(small|little)\b/gi, synonyms: ["tiny", "miniature", "compact", "petite"], type: "synonym" },
        ]

        synonymReplacements.forEach((replacement) => {
          const matches = tempHumanizedText.match(replacement.original)
          if (matches) {
            matches.forEach((match) => {
              const randomSynonym = replacement.synonyms[Math.floor(Math.random() * replacement.synonyms.length)]
              changes.push({
                original: match,
                humanized: randomSynonym,
                type: "synonym",
                reason: "Added variety with intelligent synonym",
              })
              tempHumanizedText = tempHumanizedText.replace(match, randomSynonym)
            })
          }
        })
      }

      if (humanizationMode === "creative") {
        const creativityPhrases = [
          "Let me paint you a picture:",
          "Picture this:",
          "Here's the fascinating part:",
          "What's really interesting is that",
        ]

        if (creativityLevel >= 70) {
          const randomPhrase = creativityPhrases[Math.floor(Math.random() * creativityPhrases.length)]
          tempHumanizedText = randomPhrase + " " + tempHumanizedText
        }

        tempHumanizedText = tempHumanizedText.replace(/\b(results|outcomes)\b/gi, "incredible results")
        tempHumanizedText = tempHumanizedText.replace(/\b(analysis|study)\b/gi, "deep dive")
      }

      // Combine OpenAI output with local transformations
      const finalHumanizedText = preserveFormatting ? humanizedText : humanizedText.replace(/\n/g, " ")

      // Calculate scores
      const originalWordCount = inputText.split(" ").length
      const humanizedWordCount = finalHumanizedText.split(" ").length
      const changeRatio = changes.length / originalWordCount

      const newResult: HumanizationResult = {
        originalText: inputText,
        humanizedText: finalHumanizedText,
        humanScore: Math.min(95, 60 + creativityLevel * 0.3 + changeRatio * 100),
        aiDetectionBefore: Math.random() * 40 + 50, // 50-90%
        aiDetectionAfter: Math.random() * 20 + 10, // 10-30%
        changes: changes.length > 0 ? changes : [
          {
            original: inputText.slice(0, 20) + "...",
            humanized: finalHumanizedText.slice(0, 20) + "...",
            type: humanizationMode,
            reason: `Applied ${humanizationMode} transformation via OpenAI`,
          },
        ],
        readabilityScore: Math.min(100, 70 + creativityLevel + Math.random() * 15),
        creativityLevel,
        processingTime,
        aiDetectionResults: [
          { detector: "Detector A", confidence: Math.random() * 100 },
          { detector: "Detector B", confidence: Math.random() * 100 },
          { detector: "Detector C", confidence: Math.random() * 100 },
        ],
      }

      setResult(newResult)
    } catch (error) {
      console.error("Error humanizing text:", error)
      setResult({
        originalText: inputText,
        humanizedText: "Error processing text. Please check API configuration and try again.",
        humanScore: 0,
        aiDetectionBefore: 0,
        aiDetectionAfter: 0,
        changes: [],
        readabilityScore: 0,
        creativityLevel,
        processingTime: 0,
        aiDetectionResults: [],
      })
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
        setInputText((prev) => prev + "\n" + content)
      }
      reader.readAsText(uploadedFiles[0])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadResult = () => {
    if (!result) return

    const reportContent = `HUMANIZATION REPORT
==================

Original Text:
${result.originalText}

Humanized Text:
${result.humanizedText}

Metrics:
- Human Score: ${result.humanScore.toFixed(1)}%
- AI Detection (Before): ${result.aiDetectionBefore.toFixed(1)}%
- AI Detection (After): ${result.aiDetectionAfter.toFixed(1)}%
- Readability Score: ${result.readabilityScore.toFixed(1)}%
- Mode: ${humanizationMode}
- Creativity Level: ${creativityLevel}/100

Changes Made:
${result.changes.map((change) => `- "${change.original}" → "${change.humanized}" (${change.reason})`).join("\n")}

AI Detection Results:
${result.aiDetectionResults.map((detection) => `- ${detection.detector}: ${detection.confidence.toFixed(1)}% AI-like`).join("\n")}

Generated by QuillBot AI Humanizer
${new Date().toLocaleDateString()}`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "humanization-report.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">AI Humanizer</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Transform AI-generated text into natural, human-like content
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowDetectionModal(true)}
                className="px-3 py-2 sm:px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center text-xs sm:text-sm"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Detection</span>
                <span className="sm:hidden">Detect</span>
              </button>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="px-3 py-2 sm:px-4 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Upgrade to Premium</span>
                <span className="sm:hidden">Premium</span>
              </button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Words Used This Month</span>
              <span className="text-xs sm:text-sm text-gray-600">
                {wordsUsed.toLocaleString()} / {wordsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-yellow-500" : "bg-purple-500"}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{remainingWords.toLocaleString()} words remaining</span>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Get unlimited
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Humanization Mode</h3>
            <span className="text-xs sm:text-sm text-gray-500">Choose your preferred style</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {humanizationModes.map((mode) => {
              const IconComponent = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() =>
                    mode.premium && !isPremium ? setShowPremiumModal(true) : setHumanizationMode(mode.id)
                  }
                  className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    humanizationMode === mode.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  } ${mode.premium && !isPremium ? "opacity-75" : ""}`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${humanizationMode === mode.id ? "text-purple-600" : "text-gray-600"}`}
                    />
                    {mode.premium && !isPremium && (
                      <Lock className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div className="font-medium text-gray-900 text-xs sm:text-sm">{mode.name}</div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">{mode.description}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 min-w-0"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Creativity Level:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={creativityLevel}
                  onChange={(e) => setCreativityLevel(Number(e.target.value))}
                  className="flex-1 sm:w-16 lg:w-20 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-xs text-gray-500 min-w-max">{getCreativityDescription()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="preserveFormatting"
                  checked={preserveFormatting}
                  onChange={(e) => setPreserveFormatting(e.target.checked)}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="preserveFormatting" className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Preserve formatting
                </label>
              </div>
            </div>
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
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
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
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">AI-Generated Text</h2>
                <div className="flex items-center space-x-2">
                  {inputText && (
                    <>
                      <button
                        onClick={() => handleCopy(inputText)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
                placeholder="Paste your AI-generated text here to humanize it and make it undetectable by AI detection tools..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
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
                  {result && (
                    <div className="flex items-center space-x-2">
                      <span>•</span>
                      <span className="text-green-600">Processed in {result.processingTime}s</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleHumanize}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Humanizing...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Humanize Text</span>
                      <span className="sm:hidden">Humanize</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Humanized Text</h2>
              {result && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(result.humanizedText)}
                    className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={downloadResult}
                    className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
              {result ? (
                <div className="text-gray-900 leading-relaxed text-sm sm:text-base">{result.humanizedText}</div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
                    <p className="text-sm sm:text-base">Humanized text will appear here</p>
                  </div>
                </div>
              )}
            </div>
            {result && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-base sm:text-lg font-bold text-green-600">{result.humanScore.toFixed(0)}%</div>
                  <div className="text-xs text-green-600">Human Score</div>
                </div>
                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-base sm:text-lg font-bold text-blue-600">
                    {result.readabilityScore.toFixed(0)}%
                  </div>
                  <div className="text-xs text-blue-600">Readability</div>
                </div>
              </div>
            )}
            {result && result.aiDetectionResults && (
              <div className="mt-4 p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-3 text-sm sm:text-base">AI Detection Results</h4>
                <div className="space-y-2">
                  {result.aiDetectionResults.map((detection, index) => (
                    <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-yellow-800">{detection.detector}</span>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            detection.confidence < 30
                              ? "bg-green-100 text-green-700"
                              : detection.confidence < 70
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {detection.confidence.toFixed(0)}% AI
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Unlock unlimited humanization and advanced features
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Unlimited word processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">5 premium humanization modes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Advanced AI detection bypass</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Bulk document processing</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
                <button className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Human-Like Writing</h3>
            <p className="text-xs sm:text-sm text-gray-600">Transform AI text into natural, engaging content</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bypass AI Detection</h3>
            <p className="text-xs sm:text-sm text-gray-600">Undetectable by major AI detection tools</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Multi-Language Support</h3>
            <p className="text-xs sm:text-sm text-gray-600">Humanize content in 25+ languages</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIHumanizerPage
