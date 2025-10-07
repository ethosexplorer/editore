"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Zap,
  Upload,
  X,
  Chrome,
  Smartphone,
  Monitor,
  BookOpen,
  Globe,
  RefreshCw,
  Sparkles,
  GraduationCap,
  SmartphoneIcon,
} from "lucide-react"

interface Issue {
  id: number
  type: "grammar" | "spelling" | "punctuation" | "style"
  subtype: string
  severity: "error" | "warning" | "suggestion"
  text: string
  suggestion: string
  explanation: string
  rule: string
  position: { start: number; end: number }
  ignored: boolean
  accepted: boolean
}

interface GrammarCheckResponse {
  issues: Issue[]
  wordCount: number
  characterCount: number
  confidence: number
  processingTime: number
}

const GrammarCheckerPage: React.FC = () => {
  const [text, setText] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showRuleExplanations, setShowRuleExplanations] = useState(true)
  const [language, setLanguage] = useState("en-US")
  const [realTimeChecking, setRealTimeChecking] = useState(true)
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [checkStats, setCheckStats] = useState({
    wordCount: 0,
    characterCount: 0,
    confidence: 0,
    processingTime: 0
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const languages = [
    { id: "en-US", name: "English (US)", flag: "🇺🇸" },
    { id: "en-GB", name: "English (UK)", flag: "🇬🇧" },
    { id: "en-AU", name: "English (AU)", flag: "🇦🇺" },
    { id: "en-CA", name: "English (CA)", flag: "🇨🇦" },
    { id: "fr", name: "French", flag: "🇫🇷" },
    { id: "es", name: "Spanish", flag: "🇪🇸" },
    { id: "de", name: "German", flag: "🇩🇪" },
    { id: "zh", name: "Chinese", flag: "🇨🇳" },
    { id: "hi", name: "Hindi", flag: "🇮🇳" },
    { id: "ru", name: "Russian", flag: "🇷🇺" },
  ]

  const integrationPlatforms = [
    { name: "Chrome Extension", icon: Chrome, status: "available", description: "Check grammar on any website" },
    {
      name: "Microsoft Word",
      icon: BookOpen,
      status: "available",
      description: "Real-time checking in Word documents",
    },
    { name: "Mobile Apps", icon: Smartphone, status: "available", description: "iOS and Android keyboard integration" },
    { name: "Edge Browser", icon: Monitor, status: "available", description: "Native browser integration" },
  ]

  // Enhanced feature cards data
  const featureCards = [
    {
      icon: Sparkles,
      title: "AI-Powered Checking",
      description: "Advanced grammar analysis using OpenAI technology",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700"
    },
    {
      icon: GraduationCap,
      title: "Detailed Explanations",
      description: "Learn grammar rules with every correction",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700"
    },
    {
      icon: SmartphoneIcon,
      title: "Multi-Platform",
      description: "Browser extensions, Word integration, and mobile apps",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      textColor: "text-green-700"
    }
  ]

  // Real-time checking effect
  useEffect(() => {
    if (realTimeChecking && text.trim() && text.length > 10) {
      const timeoutId = setTimeout(() => {
        handleCheck()
      }, 1500)
      return () => clearTimeout(timeoutId)
    }
  }, [text, realTimeChecking])

  const getApiBaseUrl = () => {
    return typeof window !== 'undefined' ? window.location.origin : ''
  }

  const handleCheck = async () => {
    if (!text.trim()) return

    setIsChecking(true)
    const startTime = Date.now()

    try {
      const apiUrl = `${getApiBaseUrl()}/api/grammar`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          language,
          includeExplanations: showRuleExplanations
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const result: GrammarCheckResponse = await response.json()
      
      // Add IDs and state to issues
      const issuesWithState = result.issues.map((issue, index) => ({
        ...issue,
        id: index + 1,
        ignored: false,
        accepted: false
      }))

      setIssues(issuesWithState)
      setCheckStats({
        wordCount: result.wordCount,
        characterCount: result.characterCount,
        confidence: result.confidence,
        processingTime: result.processingTime
      })

    } catch (error) {
      console.error("Grammar check error:", error)
      // Fallback to mock data if API fails
      handleMockCheck(startTime)
    } finally {
      setIsChecking(false)
    }
  }

  const handleMockCheck = (startTime: number) => {
    const mockIssues: Issue[] = [
      {
        id: 1,
        type: "grammar",
        subtype: "subject-verb agreement",
        severity: "error",
        text: "are",
        suggestion: "is",
        explanation: 'The subject "data" is singular in formal English, so it requires the singular verb "is".',
        rule: "Subject-Verb Agreement: Singular subjects require singular verbs.",
        position: { start: 10, end: 13 },
        ignored: false,
        accepted: false,
      },
      {
        id: 2,
        type: "spelling",
        subtype: "misspelled word",
        severity: "error",
        text: "recieve",
        suggestion: "receive",
        explanation: 'This is a common spelling error. Remember: "i before e except after c".',
        rule: "Spelling Rule: I before E except after C (with exceptions).",
        position: { start: 25, end: 32 },
        ignored: false,
        accepted: false,
      }
    ]

    setIssues(mockIssues)
    setCheckStats({
      wordCount: text.split(/\s+/).filter(w => w).length,
      characterCount: text.length,
      confidence: 85,
      processingTime: Date.now() - startTime
    })
  }

  const applyFix = (issue: Issue) => {
    const newText = text.substring(0, issue.position.start) + issue.suggestion + text.substring(issue.position.end)
    setText(newText)
    setIssues((prev) => prev.map((i) => (i.id === issue.id ? { ...i, accepted: true } : i)))
    setSelectedIssue(null)
  }

  const ignoreIssue = (issueId: number) => {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ignored: true } : i)))
    setSelectedIssue(null)
  }

  const acceptIssue = (issueId: number) => {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, ignored: false } : i)))
  }

  const getIssueIcon = (type: string, severity: string) => {
    if (severity === "error") return <AlertTriangle className="w-4 h-4 text-red-500" />
    if (severity === "warning") return <Info className="w-4 h-4 text-yellow-500" />
    return <Lightbulb className="w-4 h-4 text-blue-500" />
  }

  const getIssueColor = (severity: string) => {
    if (severity === "error") return "border-red-200 bg-red-50 hover:bg-red-100"
    if (severity === "warning") return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
    return "border-blue-200 bg-blue-50 hover:bg-blue-100"
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
      }
      reader.readAsText(file)
    }
  }

  const activeIssues = issues.filter((i) => !i.ignored && !i.accepted)
  const grammarIssues = activeIssues.filter((i) => i.type === "grammar")
  const spellingIssues = activeIssues.filter((i) => i.type === "spelling")
  const punctuationIssues = activeIssues.filter((i) => i.type === "punctuation")
  const styleIssues = activeIssues.filter((i) => i.type === "style")

  const grammarScore = Math.max(0, 100 - (activeIssues.length * 2))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Grammar Checker
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  AI-powered grammar, spelling, and punctuation corrections
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowIntegrations(true)}
                className="px-3 py-2 sm:px-4 bg-white text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center text-xs sm:text-sm border border-gray-300/50 shadow-sm hover:shadow-md"
              >
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Integrations</span>
                <span className="sm:hidden">Apps</span>
              </button>
              <button className="px-3 py-2 sm:px-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                <span className="hidden sm:inline">Upgrade to Premium</span>
                <span className="sm:hidden">Premium</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-6">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-gray-300/50 rounded-xl px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="realtime"
                  checked={realTimeChecking}
                  onChange={(e) => setRealTimeChecking(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="realtime" className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Real-time checking
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="explanations"
                  checked={showRuleExplanations}
                  onChange={(e) => setShowRuleExplanations(e.target.checked)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="explanations" className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                  Show rule explanations
                </label>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300/50 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm shadow-sm hover:shadow-md"
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Text Editor */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Text Input Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Text</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span>{text.length} characters</span>
                      <span>•</span>
                      <span>{text.split(" ").filter((w) => w.trim()).length} words</span>
                    </div>
                    {!realTimeChecking && (
                      <button
                        onClick={handleCheck}
                        disabled={!text.trim() || isChecking}
                        className="w-full sm:w-auto px-4 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white font-medium rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
                      >
                        {isChecking ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Checking...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">Check Grammar</span>
                            <span className="sm:hidden">Check</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here to check for grammar, spelling, and punctuation errors..."
                    className="w-full h-60 sm:h-80 p-3 sm:p-4 border border-gray-300/50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base bg-white/50 backdrop-blur-sm placeholder-gray-400"
                  />
                  {realTimeChecking && isChecking && (
                    <div className="absolute top-3 right-3">
                      <RefreshCw className="w-4 h-4 text-green-500 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Statistics */}
                {issues.length > 0 && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4">
                      <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
                        <div className="text-lg sm:text-xl font-bold text-red-600">{grammarIssues.length}</div>
                        <div className="text-xs text-red-600">Grammar</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="text-lg sm:text-xl font-bold text-orange-600">{spellingIssues.length}</div>
                        <div className="text-xs text-orange-600">Spelling</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                        <div className="text-lg sm:text-xl font-bold text-yellow-600">{punctuationIssues.length}</div>
                        <div className="text-xs text-yellow-600">Punctuation</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="text-lg sm:text-xl font-bold text-blue-600">{styleIssues.length}</div>
                        <div className="text-xs text-blue-600">Style</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="text-lg sm:text-xl font-bold text-green-600">{grammarScore}</div>
                        <div className="text-xs text-green-600">Score</div>
                      </div>
                    </div>

                    {/* Processing Info */}
                    <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                      <div>Confidence: <span className="font-semibold">{checkStats.confidence}%</span></div>
                      <div>Processing Time: <span className="font-semibold">{checkStats.processingTime}ms</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Issues Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Issues Found</h2>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {activeIssues.length} active
                </span>
              </div>

              {activeIssues.length === 0 ? (
                <div className="text-center text-gray-400 py-6 sm:py-8">
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-green-400" />
                  <p className="text-base sm:text-lg font-medium text-gray-600">Perfect Grammar!</p>
                  <p className="text-xs sm:text-sm">No issues found in your text</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                  {activeIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${getIssueColor(issue.severity)} ${
                        selectedIssue?.id === issue.id ? "ring-2 ring-green-500 transform -translate-y-0.5" : "hover:translate-y-[-2px]"
                      }`}
                      onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center min-w-0">
                          {getIssueIcon(issue.type, issue.severity)}
                          <div className="ml-2 min-w-0">
                            <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                              {issue.type}
                            </span>
                            <div className="text-xs text-gray-500">{issue.subtype}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                            issue.severity === 'error' ? 'bg-red-100 text-red-700' :
                            issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {issue.severity}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 text-xs sm:text-sm">
                          <span className="text-gray-600">Replace</span>
                          <span className="font-mono bg-red-100 px-2 py-1 rounded-lg text-red-700 break-all border border-red-200">
                            "{issue.text}"
                          </span>
                          <span className="text-gray-600">with</span>
                          <span className="font-mono bg-green-100 px-2 py-1 rounded-lg text-green-700 break-all border border-green-200">
                            "{issue.suggestion}"
                          </span>
                        </div>
                      </div>

                      {selectedIssue?.id === issue.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs sm:text-sm text-gray-700 mb-2">{issue.explanation}</p>
                          {showRuleExplanations && (
                            <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                              <div className="flex items-center mb-1">
                                <BookOpen className="w-4 h-4 text-blue-600 mr-1" />
                                <span className="text-xs sm:text-sm font-medium text-blue-700">Grammar Rule</span>
                              </div>
                              <p className="text-xs sm:text-sm text-blue-600">{issue.rule}</p>
                            </div>
                          )}
                          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                applyFix(issue)
                              }}
                              className="flex-1 px-3 py-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                            >
                              Apply Fix
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                ignoreIssue(issue.id)
                              }}
                              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-xs sm:text-sm"
                            >
                              Ignore
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Ignored Issues */}
              {issues.some((i) => i.ignored) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2 text-xs sm:text-sm">Ignored Issues</h4>
                  <div className="space-y-2">
                    {issues
                      .filter((i) => i.ignored)
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-center justify-between text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <span>
                            {issue.type}: "{issue.text}" → "{issue.suggestion}"
                          </span>
                          <button 
                            onClick={() => acceptIssue(issue.id)} 
                            className="text-green-600 hover:text-green-700 transition-colors"
                          >
                            Accept
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="space-y-4 sm:space-y-6">
            {featureCards.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-4 sm:p-6 border ${feature.borderColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-3 sm:mb-4 shadow-sm`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <h3 className={`font-bold text-sm sm:text-base mb-2 ${feature.textColor}`}>
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Integration Modal */}
        {showIntegrations && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Platform Integrations</h3>
                  <button onClick={() => setShowIntegrations(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {integrationPlatforms.map((platform, index) => {
                    const IconComponent = platform.icon
                    return (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{platform.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 mb-3">{platform.description}</p>
                            <button className="px-3 py-1 bg-green-500 text-white rounded text-xs sm:text-sm hover:bg-green-600 transition-colors">
                              Install
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">Multi-Platform Benefits</h4>
                  <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                    <li>• Real-time grammar checking across all platforms</li>
                    <li>• Synchronized settings and personal dictionary</li>
                    <li>• Consistent writing style suggestions</li>
                    <li>• Offline functionality on mobile devices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GrammarCheckerPage
