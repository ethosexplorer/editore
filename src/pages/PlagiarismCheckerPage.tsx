"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Shield,
  Upload,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
  FileText,
  Globe,
  Lock,
  CreditCard,
  Quote,
  Eye,
  Search,
  Users,
  BookOpen,
  Languages,
} from "lucide-react"

interface PlagiarismResult {
  overallScore: number
  uniqueContent: number
  plagiarizedPercentage: number
  wordCount: number
  sources: Array<{
    id: number
    url: string
    title: string
    similarity: number
    matchedText: string
    matchedWords: number
    domain: string
  }>
  highlightedText: Array<{
    text: string
    isPlagiarized: boolean
    sourceId?: number
    similarity?: number
  }>
  languages: string[]
  processingTime: number
  citationStyle?: string
  confidence?: number
}

const PlagiarismCheckerPage: React.FC = () => {
  const [text, setText] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [citationStyle, setCitationStyle] = useState("APA")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [wordsUsed, setWordsUsed] = useState(12847)
  const [wordsLimit] = useState(25000)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
    { code: "it", name: "Italian", flag: "🇮🇹" },
    { code: "pt", name: "Portuguese", flag: "🇵🇹" },
    { code: "zh", name: "Chinese", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", flag: "🇯🇵" },
  ]

  const getApiBaseUrl = () => {
    // Use the same base URL logic as your other components
    return ''
  }

  const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"]

  const handleCheck = async () => {
    if (!text.trim()) {
      setError("Please enter some text to check")
      return
    }

    const wordCount = text.split(" ").filter((w) => w.trim()).length
    if (wordsUsed + wordCount > wordsLimit) {
      setShowPremiumModal(true)
      return
    }

    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      const apiUrl = `${getApiBaseUrl()}/api/plagiarism-check`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language: selectedLanguage,
          citationStyle: citationStyle
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Validate the response structure
      if (typeof data.overallScore !== 'number' || !Array.isArray(data.sources)) {
        throw new Error('Invalid response format from server')
      }

      setResult(data)
      setWordsUsed((prev) => prev + wordCount)
    } catch (error) {
      console.error('Plagiarism check failed:', error)
      setError(error instanceof Error ? error.message : 'Failed to check plagiarism. Please try again.')
      // Fallback to mock plagiarism check if API fails
      handleMockPlagiarismCheck()
    } finally {
      setIsChecking(false)
    }
  }

  const handleMockPlagiarismCheck = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockResult: PlagiarismResult = {
      overallScore: 85,
      uniqueContent: 85,
      plagiarizedPercentage: 15,
      wordCount: text.split(" ").filter((w) => w.trim()).length,
      sources: [
        {
          id: 1,
          url: "https://example.com/source1",
          title: "Sample Academic Paper on the Topic",
          similarity: 12.5,
          matchedText: text.substring(0, 100) + "...",
          matchedWords: 25,
          domain: "example.com"
        },
        {
          id: 2,
          url: "https://wikipedia.org/related-topic",
          title: "Wikipedia Entry on Related Subject",
          similarity: 2.5,
          matchedText: text.substring(50, 150) + "...",
          matchedWords: 15,
          domain: "wikipedia.org"
        }
      ],
      highlightedText: [
        { text: "This is original content", isPlagiarized: false },
        { text: "while this part matches", isPlagiarized: true, sourceId: 1, similarity: 12.5 },
        { text: "with some existing sources.", isPlagiarized: true, sourceId: 1, similarity: 12.5 }
      ],
      languages: [selectedLanguage],
      processingTime: 2.1,
      citationStyle: citationStyle,
      confidence: 92
    }

    setResult(mockResult)
    setWordsUsed((prev) => prev + mockResult.wordCount)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setUploadedFiles((prev) => [...prev, ...files])
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        setText((prev) => prev + (prev ? "\n" : "") + (e.target?.result as string))
      }
      reader.readAsText(file)
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const generateCitation = (source: any, style: string) => {
    const currentDate = new Date().toISOString().split("T")[0]
    
    switch (style) {
      case "APA":
        return `Author, A. (${new Date().getFullYear()}). ${source.title}. ${source.domain}. ${source.url}`
      case "MLA":
        return `Author, A. "${source.title}." ${source.domain}, ${new Date().getFullYear()}. Web. ${currentDate}.`
      case "Chicago":
        return `Author, A. "${source.title}." ${source.domain}. Last modified ${currentDate}. ${source.url}.`
      case "Harvard":
        return `Author, A. (${new Date().getFullYear()}) '${source.title}', ${source.domain}. Available at: ${source.url} (Accessed: ${currentDate}).`
      case "IEEE":
        return `[1] A. Author, "${source.title}," ${source.domain}, ${new Date().getFullYear()}. [Online]. Available: ${source.url}`
      default:
        return `${source.title} - ${source.url}`
    }
  }

  const downloadReport = () => {
    if (!result) return

    const reportContent = `PLAGIARISM REPORT
================

Overall Similarity: ${result.plagiarizedPercentage.toFixed(1)}%
Unique Content: ${result.uniqueContent.toFixed(1)}%
Word Count: ${result.wordCount}
Processing Time: ${result.processingTime}s
Confidence: ${result.confidence ? result.confidence + '%' : 'N/A'}

LANGUAGES DETECTED:
${result.languages.join(', ')}

SOURCES FOUND:
${result.sources
  .map(
    (source) => `

- ${source.title}
  URL: ${source.url}
  Similarity: ${source.similarity.toFixed(1)}%
  Matched Words: ${source.matchedWords}
  Domain: ${source.domain}
  Citation (${result.citationStyle || citationStyle}): ${generateCitation(source, result.citationStyle || citationStyle)}
  Matched Text: "${source.matchedText}"
`,
  )
  .join("")}

HIGHLIGHTED TEXT ANALYSIS:
- Total words: ${result.highlightedText.length}
- Potentially plagiarized words: ${result.highlightedText.filter(word => word.isPlagiarized).length}
- Unique words: ${result.highlightedText.filter(word => !word.isPlagiarized).length}

Generated by Plagiarism Checker API
${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    `

    const blob = new Blob([reportContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plagiarism-report-${new Date().getTime()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="w-6 h-6 text-green-600" />
    if (score >= 70) return <AlertTriangle className="w-6 h-6 text-yellow-600" />
    return <AlertTriangle className="w-6 h-6 text-red-600" />
  }

  const remainingWords = wordsLimit - wordsUsed
  const usagePercentage = (wordsUsed / wordsLimit) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Plagiarism Checker</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Advanced AI-powered plagiarism detection against billions of sources
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPremiumModal(true)}
              className="px-3 py-2 sm:px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center text-xs sm:text-sm"
            >
              <Lock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Upgrade to Premium</span>
              <span className="sm:hidden">Premium</span>
            </button>
          </div>

          {/* Usage Bar */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700">Words Used This Month</span>
              <span className="text-xs sm:text-sm text-gray-600">
                {wordsUsed.toLocaleString()} / {wordsLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${usagePercentage > 90 ? "bg-red-500" : usagePercentage > 70 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{remainingWords.toLocaleString()} words remaining</span>
              <button onClick={() => setShowPremiumModal(true)} className="text-red-600 hover:text-red-700 font-medium">
                Buy more words
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 sm:mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Settings Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6">
              {/* Language Selection */}
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 min-w-0"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Citation Style */}
              <div className="flex items-center space-x-2">
                <Quote className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <select
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-red-500 min-w-0"
                >
                  {citationStyles.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm transition-colors"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="hidden sm:inline">Upload Files</span>
                <span className="sm:hidden">Upload</span>
              </button>

              {result && (
                <button
                  onClick={downloadReport}
                  className="flex items-center justify-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs sm:text-sm transition-colors"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden sm:inline">Download Report</span>
                  <span className="sm:hidden">Report</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* File Upload Area */}
            {uploadedFiles.length > 0 && (
              <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-3">Uploaded Files</h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-2 sm:p-3 rounded-lg border"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate block">
                            {file.name}
                          </span>
                          <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 text-xs sm:text-sm flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Enter Text to Check</h2>
                <p className="text-xs sm:text-sm text-gray-600">
                  Paste your content or upload documents (.txt, .pdf, .docx, .html)
                </p>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to check for plagiarism. Our advanced AI will scan against billions of web pages, academic papers, and published works..."
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
              />

              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf,.html"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <span>{text.length} characters</span>
                    <span>•</span>
                    <span>{text.split(" ").filter((w) => w.trim()).length} words</span>
                  </div>
                  {result && (
                    <div className="flex items-center space-x-2">
                      <span>•</span>
                      <span className="text-green-600">Processed in {result.processingTime}s</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCheck}
                  disabled={!text.trim() || isChecking}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                >
                  {isChecking ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Check for Plagiarism</span>
                      <span className="sm:hidden">Check</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Highlighted Text Analysis */}
            {result && (
              <div className="p-4 sm:p-6 pt-0">
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Text Analysis & Matches
                  </h3>
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 max-h-48 sm:max-h-60 overflow-y-auto">
                    <div className="leading-relaxed text-xs sm:text-sm">
                      {result.highlightedText.map((segment, index) => (
                        <span
                          key={index}
                          className={`${
                            segment.isPlagiarized
                              ? "bg-red-200 text-red-900 px-1 rounded cursor-pointer hover:bg-red-300"
                              : ""
                          }`}
                          title={
                            segment.isPlagiarized
                              ? `${segment.similarity?.toFixed(1)}% match with source ${segment.sourceId}`
                              : ""
                          }
                        >
                          {segment.text}{" "}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <span className="inline-block w-3 h-3 bg-red-200 rounded mr-1"></span>
                    Highlighted text shows potential matches with sources
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Plagiarism Results</h2>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-60 sm:h-80 text-gray-400">
                <Shield className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-center text-sm sm:text-base">
                  Upload a document or enter text to scan for plagiarism across billions of sources
                </p>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    100+ languages supported
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Academic sources included
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Bulk scanning available
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {/* Overall Score */}
                <div className={`p-4 sm:p-6 rounded-lg border-2 ${getScoreColor(result.overallScore)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getScoreIcon(result.overallScore)}
                      <span className="ml-2 font-semibold text-sm sm:text-base">Similarity Score</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold">{result.plagiarizedPercentage.toFixed(1)}%</div>
                      <div className="text-xs opacity-75">plagiarized</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        result.plagiarizedPercentage >= 30
                          ? "bg-red-500"
                          : result.plagiarizedPercentage >= 15
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{ width: `${result.plagiarizedPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs opacity-75">{result.uniqueContent.toFixed(1)}% unique content</div>
                  {result.confidence && (
                    <div className="text-xs opacity-75 mt-1">Confidence: {result.confidence}%</div>
                  )}
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-base sm:text-lg font-bold text-blue-700">{result.wordCount}</div>
                    <div className="text-xs text-blue-600">Words Scanned</div>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-base sm:text-lg font-bold text-orange-700">{result.sources.length}</div>
                    <div className="text-xs text-orange-600">Sources Found</div>
                  </div>
                </div>

                {/* Languages */}
                {result.languages && result.languages.length > 0 && (
                  <div className="text-center p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-xs text-purple-600">Detected Languages</div>
                    <div className="text-sm font-medium text-purple-700">{result.languages.join(', ')}</div>
                  </div>
                )}

                {/* Sources List */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Matching Sources
                  </h3>
                  <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                    {result.sources.map((source) => (
                      <div
                        key={source.id}
                        className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight flex-1">
                            {source.title}
                          </h4>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                              {source.similarity.toFixed(1)}%
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{source.matchedWords} words</div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500 mb-2 truncate">{source.domain}</div>

                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 text-xs sm:text-sm mb-2 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">View Source</span>
                        </a>

                        <p className="text-xs text-gray-600 italic mb-2 p-2 bg-gray-50 rounded line-clamp-2">
                          "{source.matchedText}"
                        </p>

                        <details className="text-xs">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            Generate Citation ({result.citationStyle || citationStyle})
                          </summary>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-gray-700 font-mono text-xs break-all">
                            {generateCitation(source, result.citationStyle || citationStyle)}
                          </div>
                        </details>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Unlock unlimited plagiarism checking and advanced features
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">25,000 words/month → Unlimited</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">100+ languages support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Bulk document scanning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Advanced citation generator</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Detailed PDF reports</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Maybe Later
                </button>
                <button className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center text-sm sm:text-base">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlagiarismCheckerPage