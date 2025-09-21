"use client"

import type React from "react"
import { useState } from "react"
import { FileText, Zap, Copy, Download, Upload, Trash2, Eye, Settings, List, Type, Target } from "lucide-react"

const SummarizerPage: React.FC = () => {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [summaryMode, setSummaryMode] = useState("paragraph")
  const [summaryLength, setSummaryLength] = useState("short")
  const [files, setFiles] = useState<File[]>([])
  const [bulkSummaries, setBulkSummaries] = useState<{ fileName: string; summary: string }[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [showKeywords, setShowKeywords] = useState(false)

  const modeOptions = [
    { id: "paragraph", name: "Paragraph", icon: Type, description: "Standard paragraph format" },
    { id: "bullet", name: "Bullet Points", icon: List, description: "Key points as bullets" },
    { id: "custom", name: "Custom", icon: Target, description: "Custom formatting options" },
  ]

  const lengthOptions = [
    { id: "short", name: "Short", description: "2-3 sentences" },
    { id: "medium", name: "Medium", description: "4-6 sentences" },
    { id: "long", name: "Long", description: "7-10 sentences" },
  ]

  const extractKeywords = (text: string): string[] => {
    const words = text
      .toLowerCase()
      .split(/\W+/)
      .filter(
        (word) =>
          word.length > 4 &&
          ![
            "the",
            "and",
            "for",
            "are",
            "but",
            "not",
            "you",
            "all",
            "can",
            "had",
            "her",
            "was",
            "one",
            "our",
            "out",
            "day",
            "get",
            "has",
            "him",
            "his",
            "how",
            "its",
            "may",
            "new",
            "now",
            "old",
            "see",
            "two",
            "who",
            "boy",
            "did",
            "man",
            "way",
          ].includes(word),
      )

    const frequency: Record<string, number> = {}
    words.forEach((word) => {
      frequency[word] = (frequency[word] || 0) + 1
    })

    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word)
  }

  const handleSummarize = async () => {
    const wordCount = inputText
      .trim()
      .split(/\s+/)
      .filter((w) => w).length
    if (!inputText.trim() && files.length === 0) return
    if (wordCount < 40 && files.length === 0) {
      alert("Please enter at least 40 words for analysis.")
      return
    }

    setIsProcessing(true)

    // Extract keywords
    const extractedKeywords = extractKeywords(inputText)
    setKeywords(extractedKeywords)

    setTimeout(() => {
      const sentences = inputText.split(/[.!?]+/).filter((s) => s.trim())
      const summaryCount = summaryLength === "short" ? 2 : summaryLength === "medium" ? 4 : 7
      const selectedSentences = sentences.slice(0, summaryCount)

      let formattedSummary = ""
      if (summaryMode === "bullet") {
        formattedSummary = selectedSentences.map((s) => `• ${s.trim()}`).join("\n")
      } else if (summaryMode === "custom") {
        formattedSummary = selectedSentences.map((s, i) => `${i + 1}. ${s.trim()}`).join("\n")
      } else {
        formattedSummary = selectedSentences.join(". ") + "."
      }

      setSummary(formattedSummary)

      if (files.length > 0) {
        const bulkData = files.map((file) => ({
          fileName: file.name,
          summary: selectedSentences.slice(0, Math.floor(summaryCount / files.length)).join(". ") + ".",
        }))
        setBulkSummaries(bulkData)
      }
      setIsProcessing(false)
    }, 2000)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length > 0) {
      setFiles([...files, ...uploadedFiles])
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputText((prev) => prev + "\n" + ((e.target?.result as string) || ""))
      }
      reader.readAsText(uploadedFiles[0])
    }
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter((f) => f.name !== fileName))
    setBulkSummaries(bulkSummaries.filter((s) => s.fileName !== fileName))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "summary.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCompressionRatio = () => {
    if (!inputText || !summary) return 0
    return Math.round((1 - summary.length / inputText.length) * 100)
  }

  const paraphraseSummary = () => {
    if (!summary) return
    setIsProcessing(true)
    setTimeout(() => {
      const paraphrased = summary.replace(/\b(is|are|was|were)\b/g, (match) => {
        const alternatives = { is: "becomes", are: "represent", was: "existed as", were: "functioned as" }
        return alternatives[match as keyof typeof alternatives] || match
      })
      setSummary(paraphrased)
      setIsProcessing(false)
    }, 1500)
  }

  const wordCount = inputText
    .trim()
    .split(/\s+/)
    .filter((w) => w).length
  const sentenceCount = summary ? summary.split(/[.!?]+/).filter((s) => s.trim()).length : 0
  const summaryWordCount = summary ? summary.split(/\s+/).filter((w) => w).length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Summarizer</h1>
            </div>
            <button className="px-3 py-2 sm:px-4 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-xs sm:text-sm">
              <span className="hidden sm:inline">Upgrade to Premium</span>
              <span className="sm:hidden">Premium</span>
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Modes:</h3>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {modeOptions.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSummaryMode(mode.id)}
                  className={`px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                    summaryMode === mode.id
                      ? "bg-green-100 text-green-700 border-2 border-green-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Length Slider */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <span className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">Summary Length:</span>
            <div className="flex items-center space-x-4 flex-1">
              <span className="text-xs sm:text-sm text-gray-600">Short</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={summaryLength === "short" ? 0 : summaryLength === "medium" ? 1 : 2}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    setSummaryLength(value === 0 ? "short" : value === 1 ? "medium" : "long")
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div
                  className="absolute top-0 left-0 h-2 bg-green-500 rounded-lg"
                  style={{ width: `${(summaryLength === "short" ? 0 : summaryLength === "medium" ? 1 : 2) * 50}%` }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm text-gray-600">Long</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* File Upload Area */}
            {files.length > 0 && (
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{file.name}</span>
                      </div>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
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
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    1. User Registration & Onboarding
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center px-2 py-1 sm:px-3 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer">
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Upload
                    <input
                      type="file"
                      accept=".txt,.doc,.docx,.pdf"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Flow:

User Sign-Up:

Email & Password / OAuth Login (Google, LinkedIn, SSO)

Two-Factor Authentication (2FA) setup

Profile Setup:

Basic Details: Name, Role, Organization, Compliance Level

User Type Selection: Individual / Team / Developer"
                className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm"
              />

              {/* Keywords Section */}
              {keywords.length > 0 && (
                <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-700">Select keywords</h4>
                    <button
                      onClick={() => setShowKeywords(!showKeywords)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  {showKeywords && (
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 sm:px-3 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded-full cursor-pointer hover:bg-blue-200"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">{wordCount}</span> words
                </div>
                <button
                  onClick={handleSummarize}
                  disabled={!inputText.trim() || isProcessing}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Summarize
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="h-60 sm:h-80 p-3 sm:p-4 border border-gray-200 rounded-lg bg-gray-50 overflow-y-auto">
                {summary ? (
                  <div className="text-gray-900 leading-relaxed whitespace-pre-line text-xs sm:text-sm">{summary}</div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <FileText className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4" />
                      <p className="text-xs sm:text-sm">Summary will appear here</p>
                    </div>
                  </div>
                )}
              </div>

              {summary && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-600">
                    <span>
                      <span className="font-medium">{sentenceCount}</span> sentences
                    </span>
                    <span>•</span>
                    <span>
                      <span className="font-medium">{summaryWordCount}</span> words
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                    <button
                      onClick={paraphraseSummary}
                      className="px-3 py-2 sm:px-4 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-xs sm:text-sm"
                    >
                      Paraphrase Summary
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download as file"
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk Summaries */}
        {bulkSummaries.length > 0 && (
          <div className="mt-4 sm:mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Bulk Summaries</h3>
            <div className="space-y-3">
              {bulkSummaries.map((item, index) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-900 mb-2 text-sm sm:text-base">{item.fileName}</div>
                  <p className="text-xs sm:text-sm text-gray-600">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}

export default SummarizerPage
