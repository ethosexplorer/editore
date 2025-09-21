"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Globe,
  ArrowRightLeft,
  Copy,
  Volume2,
  Zap,
  Upload,
  FileText,
  Trash2,
  Settings,
  Star,
  Lock,
  Download,
  Eye,
  RotateCcw,
} from "lucide-react"

interface TranslationResult {
  originalText: string
  translatedText: string
  sourceLang: string
  targetLang: string
  mode: string
  accuracy: number
  fluency: number
  characterCount: number
  alternatives: string[]
  romanization?: string
}

const TranslatorPage: React.FC = () => {
  const [sourceText, setSourceText] = useState("")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [sourceLang, setSourceLang] = useState("auto")
  const [targetLang, setTargetLang] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationMode, setTranslationMode] = useState("standard")
  const [showAlternatives, setShowAlternatives] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [charactersUsed, setCharactersUsed] = useState(2847)
  const [characterLimit] = useState(5000)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { code: "auto", name: "Auto-detect", flag: "🌐" },
    { code: "af", name: "Afrikaans", flag: "🇿🇦" },
    { code: "ar", name: "Arabic", flag: "🇸🇦" },
    { code: "bn", name: "Bengali", flag: "🇧🇩" },
    { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" },
    { code: "zh-tw", name: "Chinese (Traditional)", flag: "🇹🇼" },
    { code: "hr", name: "Croatian", flag: "🇭🇷" },
    { code: "cs", name: "Czech", flag: "🇨🇿" },
    { code: "da", name: "Danish", flag: "🇩🇰" },
    { code: "nl", name: "Dutch", flag: "🇳🇱" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "et", name: "Estonian", flag: "🇪🇪" },
    { code: "tl", name: "Filipino", flag: "🇵🇭" },
    { code: "fi", name: "Finnish", flag: "🇫🇮" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "el", name: "Greek", flag: "🇬🇷" },
    { code: "gu", name: "Gujarati", flag: "🇮🇳" },
    { code: "he", name: "Hebrew", flag: "🇮🇱" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "hu", name: "Hungarian", flag: "🇭🇺" },
    { code: "is", name: "Icelandic", flag: "🇮🇸" },
    { code: "id", name: "Indonesian", flag: "🇮🇩" },
    { code: "ga", name: "Irish", flag: "🇮🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
    { code: "kn", name: "Kannada", flag: "🇮🇳" },
    { code: "ko", name: "Korean", flag: "🇰🇷" },
    { code: "lv", name: "Latvian", flag: "🇱🇻" },
    { code: "lt", name: "Lithuanian", flag: "🇱🇹" },
    { code: "ms", name: "Malay", flag: "🇲🇾" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", flag: "🇮🇳" },
    { code: "no", name: "Norwegian", flag: "🇳🇴" },
    { code: "pl", name: "Polish", flag: "🇵🇱" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "pt-br", name: "Portuguese (Brazil)", flag: "🇧🇷" },
    { code: "pa", name: "Punjabi", flag: "🇮🇳" },
    { code: "ro", name: "Romanian", flag: "🇷🇴" },
    { code: "ru", name: "Russian", flag: "🇷🇺" },
    { code: "sk", name: "Slovak", flag: "🇸🇰" },
    { code: "sl", name: "Slovenian", flag: "🇸🇮" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "sw", name: "Swahili", flag: "🇰🇪" },
    { code: "sv", name: "Swedish", flag: "🇸🇪" },
    { code: "ta", name: "Tamil", flag: "🇮🇳" },
    { code: "te", name: "Telugu", flag: "🇮🇳" },
    { code: "th", name: "Thai", flag: "🇹🇭" },
    { code: "tr", name: "Turkish", flag: "🇹🇷" },
    { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
    { code: "ur", name: "Urdu", flag: "🇵🇰" },
    { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
    { code: "cy", name: "Welsh", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  ]

  const translationModes = [
    {
      id: "standard",
      name: "Standard",
      description: "Balanced accuracy and fluency",
      premium: false,
      icon: Globe,
    },
    {
      id: "fluency",
      name: "Fluency",
      description: "Prioritizes natural flow",
      premium: false,
      icon: Zap,
    },
    {
      id: "formal",
      name: "Formal",
      description: "Professional tone",
      premium: true,
      icon: Settings,
    },
    {
      id: "simple",
      name: "Simple",
      description: "Easy to understand",
      premium: true,
      icon: Eye,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Expressive and engaging",
      premium: true,
      icon: Star,
    },
  ]

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    const newCharCount = sourceText.length
    if (charactersUsed + newCharCount > characterLimit) {
      setShowPremiumModal(true)
      return
    }

    setIsTranslating(true)

    setTimeout(() => {
      const detectedLang = sourceLang === "auto" ? "en" : sourceLang

      // Generate mock translations based on language pair
      const mockTranslations: { [key: string]: string } = {
        "en-es": "Hola, este es un texto traducido al español con alta precisión contextual.",
        "en-fr": "Bonjour, ceci est un texte traduit en français avec une précision contextuelle élevée.",
        "en-de": "Hallo, dies ist ein ins Deutsche übersetzter Text mit hoher kontextueller Genauigkeit.",
        "en-zh": "你好，这是翻译成中文的文本，具有很高的上下文准确性。",
        "en-hi": "नमस्ते, यह उच्च संदर्भ सटीकता के साथ हिंदी में अनुवादित पाठ है।",
        "es-en": "Hello, this is a text translated to English with high contextual accuracy.",
        "fr-en": "Hello, this is a text translated to English with high contextual accuracy.",
      }

      const key = `${detectedLang}-${targetLang}`
      let translatedText = mockTranslations[key] || `[Translated from ${detectedLang} to ${targetLang}] ${sourceText}`

      // Adjust translation based on mode
      if (translationMode === "formal") {
        translatedText = translatedText.replace(/hello/gi, "greetings").replace(/hi/gi, "good day")
      } else if (translationMode === "simple") {
        translatedText = translatedText.replace(/contextual accuracy/gi, "being correct")
      } else if (translationMode === "creative") {
        translatedText = "✨ " + translatedText + " ✨"
      }

      // Generate romanization for Chinese/Hindi
      let romanization
      if (targetLang === "zh") {
        romanization = "Nǐ hǎo, zhè shì fānyì chéng zhōngwén de wénběn, jùyǒu hěn gāo de shàngxiàwén zhǔnquè xìng."
      } else if (targetLang === "hi") {
        romanization = "Namaste, yah uchch sandarbh satatata ke saath hindee mein anuvaadit paath hai."
      }

      // Generate alternatives
      const alternatives = [
        translatedText.replace(/high/gi, "excellent"),
        translatedText.replace(/accuracy/gi, "precision"),
        translatedText.replace(/contextual/gi, "situational"),
      ]
        .filter((alt) => alt !== translatedText)
        .slice(0, 3)

      const newResult: TranslationResult = {
        originalText: sourceText,
        translatedText,
        sourceLang: detectedLang,
        targetLang,
        mode: translationMode,
        accuracy: Math.random() * 20 + 80, // 80-100%
        fluency: Math.random() * 15 + 85, // 85-100%
        characterCount: translatedText.length,
        alternatives,
        romanization,
      }

      setResult(newResult)
      setCharactersUsed((prev) => prev + newCharCount)
      setIsTranslating(false)
    }, 2500)
  }

  const swapLanguages = () => {
    if (sourceLang === "auto") return

    setSourceLang(targetLang)
    setTargetLang(sourceLang)

    if (result) {
      setSourceText(result.translatedText)
      setResult(null)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length > 0) {
      setFiles((prev) => [...prev, ...uploadedFiles])

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSourceText((prev) => prev + "\n" + content)
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

  const handleSpeak = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang === "zh" ? "zh-CN" : lang === "pt-br" ? "pt-BR" : lang
      speechSynthesis.speak(utterance)
    }
  }

  const downloadTranslation = () => {
    if (!result) return

    const reportContent = `TRANSLATION REPORT
==================

Original (${result.sourceLang.toUpperCase()}):
${result.originalText}

Translation (${result.targetLang.toUpperCase()}):
${result.translatedText}

${result.romanization ? `Romanization:\n${result.romanization}\n\n` : ""}Mode: ${result.mode}
Accuracy: ${result.accuracy.toFixed(1)}%
Fluency: ${result.fluency.toFixed(1)}%
Character Count: ${result.characterCount}

${result.alternatives.length > 0 ? `Alternative Translations:\n${result.alternatives.map((alt, i) => `${i + 1}. ${alt}`).join("\n")}\n\n` : ""}Generated by QuillBot AI Translator
${new Date().toLocaleDateString()}`

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "translation-report.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLanguageName = (code: string) => {
    return languages.find((lang) => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return languages.find((lang) => lang.code === code)?.flag || "🌐"
  }

  const remainingChars = characterLimit - charactersUsed
  const usagePercentage = (charactersUsed / characterLimit) * 100

  const quickPhrases = [
    { en: "Hello, how are you?", category: "greetings" },
    { en: "Thank you very much", category: "courtesy" },
    { en: "Where is the bathroom?", category: "directions" },
    { en: "I need help", category: "emergency" },
    { en: "How much does this cost?", category: "shopping" },
    { en: "What time is it?", category: "time" },
    { en: "I don't understand", category: "communication" },
    { en: "Could you repeat that?", category: "communication" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Translator</h1>
                <p className="text-sm text-gray-600">Translate across 52 languages with context awareness</p>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors flex items-center"
            >
              <Lock className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </button>
          </div>

          {/* Usage Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Characters Used (Free Plan)</span>
              <span className="text-sm text-gray-600">
                {charactersUsed.toLocaleString()} / {characterLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-yellow-500" : "bg-indigo-500"}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{remainingChars.toLocaleString()} characters remaining</span>
              <button
                onClick={() => setShowPremiumModal(true)}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Get unlimited
              </button>
            </div>
          </div>
        </div>

        {/* Translation Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Translation Mode</h3>
            <span className="text-xs sm:text-sm text-gray-500">Choose your preferred style</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {translationModes.map((mode) => {
              const IconComponent = mode.icon
              return (
                <button
                  key={mode.id}
                  onClick={() =>
                    mode.premium && !showPremiumModal ? setShowPremiumModal(true) : setTranslationMode(mode.id)
                  }
                  className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all ${
                    translationMode === mode.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  } ${mode.premium ? "opacity-75" : ""}`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <IconComponent
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${translationMode === mode.id ? "text-indigo-600" : "text-gray-600"}`}
                    />
                    {mode.premium && <Lock className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1" />}
                  </div>
                  <div className="font-medium text-gray-900 text-xs sm:text-sm">{mode.name}</div>
                  <div className="text-xs text-gray-500 mt-1 hidden sm:block">{mode.description}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapLanguages}
              disabled={sourceLang === "auto"}
              className="mt-4 sm:mt-6 p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-center"
              title="Swap languages"
            >
              <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>

            <div className="flex-1">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
              >
                {languages
                  .filter((lang) => lang.code !== "auto")
                  .map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Source Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* File Upload Area */}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-2">{getLanguageFlag(sourceLang)}</span>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{getLanguageName(sourceLang)}</h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-2 py-1 sm:px-3 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Upload
                  </button>
                  {sourceText && (
                    <>
                      <button
                        onClick={() => handleSpeak(sourceText, sourceLang)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Listen"
                      >
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(sourceText)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate across 52+ languages with AI-powered context awareness..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
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
                    <span>{sourceText.length} characters</span>
                    <span>•</span>
                    <span>{sourceText.split(" ").filter((w) => w).length} words</span>
                  </div>
                </div>
                <button
                  onClick={handleTranslate}
                  disabled={!sourceText.trim() || isTranslating}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                >
                  {isTranslating ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Translating...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Translate
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Translated Text */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-2">{getLanguageFlag(targetLang)}</span>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">{getLanguageName(targetLang)}</h2>
                </div>
                <div className="flex space-x-2">
                  {result && (
                    <>
                      <button
                        onClick={() => setShowAlternatives(!showAlternatives)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Show alternatives"
                      >
                        <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleSpeak(result.translatedText, targetLang)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Listen"
                      >
                        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(result.translatedText)}
                        className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={downloadTranslation}
                        className="p-1 sm:p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download report"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-y-auto">
                {result ? (
                  <div className="text-gray-900 leading-relaxed text-sm sm:text-base">{result.translatedText}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Globe className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
                      <p className="text-sm sm:text-base">Translation will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Translation Metrics */}
              {result && (
                <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-base sm:text-lg font-bold text-green-600">{result.accuracy.toFixed(0)}%</div>
                    <div className="text-xs text-green-600">Accuracy</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-base sm:text-lg font-bold text-blue-600">{result.fluency.toFixed(0)}%</div>
                    <div className="text-xs text-blue-600">Fluency</div>
                  </div>
                </div>
              )}

              {/* Romanization */}
              {result && result.romanization && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-yellow-800">Romanization</span>
                    <button
                      onClick={() => handleCopy(result.romanization!)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-yellow-700">{result.romanization}</p>
                </div>
              )}

              {/* Alternative Translations */}
              {result && showAlternatives && result.alternatives.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-3 text-sm sm:text-base">Alternative Translations</h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, index) => (
                      <div key={index} className="flex items-start justify-between p-2 bg-white rounded border gap-2">
                        <span className="text-xs sm:text-sm text-gray-700 flex-1">{alt}</span>
                        <button
                          onClick={() => handleCopy(alt)}
                          className="text-purple-600 hover:text-purple-800 flex-shrink-0"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Phrases */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Phrases</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {quickPhrases.map((phrase, index) => (
              <button
                key={index}
                onClick={() => setSourceText(phrase.en)}
                className="p-2 sm:p-3 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all text-xs sm:text-sm"
              >
                <span className="text-gray-900 block">{phrase.en}</span>
                <div className="text-xs text-gray-500 mt-1 capitalize">{phrase.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Unlock unlimited translations and advanced features
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Unlimited character translations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">9 premium translation modes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Custom tone and style options</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Bulk document translation</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
                <button className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">52+ Languages</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Comprehensive language support with cultural context awareness
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Context-Aware AI</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Preserves tone, style, and cultural nuances in translations
            </p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200 sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Audio & Romanization</h3>
            <p className="text-xs sm:text-sm text-gray-600">Text-to-speech and romanization for Chinese and Hindi</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslatorPage
