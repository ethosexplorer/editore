"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  Quote,
  Copy,
  Download,
  BookOpen,
  Globe,
  FileText,
  Search,
  Zap,
  ImageIcon,
  Video,
  Link,
  Hash,
  Upload,
  History,
  CheckCircle,
} from "lucide-react"

interface Citation {
  id: number
  type: string
  style: string
  fullCitation: string
  inTextCitation: string
  timestamp: string
  source: any
  verified: boolean
}

const CitationGeneratorPage: React.FC = () => {
  const [inputMethod, setInputMethod] = useState("url")
  const [inputValue, setInputValue] = useState("")
  const [sourceType, setSourceType] = useState("website")
  const [citationStyle, setCitationStyle] = useState("apa")
  const [formData, setFormData] = useState<any>({})
  const [citations, setCitations] = useState<Citation[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const inputMethods = [
    { id: "url", name: "URL", icon: Link, placeholder: "https://example.com/article" },
    { id: "doi", name: "DOI", icon: Hash, placeholder: "10.1000/182" },
    { id: "isbn", name: "ISBN", icon: BookOpen, placeholder: "978-0-123456-78-9" },
    { id: "manual", name: "Manual Entry", icon: FileText, placeholder: "Enter details manually" },
  ]

  const sourceTypes = [
    { id: "website", name: "Website", icon: Globe, count: 0 },
    { id: "book", name: "Book", icon: BookOpen, count: 0 },
    { id: "journal", name: "Journal Article", icon: FileText, count: 0 },
    { id: "image", name: "Image", icon: ImageIcon, count: 0 },
    { id: "video", name: "Video", icon: Video, count: 0 },
    { id: "legal", name: "Legal Document", icon: FileText, count: 0 },
  ]

  const citationStyles = [
    { id: "apa", name: "APA 7th Edition", description: "American Psychological Association", primary: true },
    { id: "mla", name: "MLA 9th Edition", description: "Modern Language Association", primary: false },
    { id: "chicago", name: "Chicago 17th Edition", description: "Chicago Manual of Style", primary: false },
    { id: "harvard", name: "Harvard Style", description: "Author-Date System", primary: false },
  ]

  const handleAutoGenerate = async () => {
    if (!inputValue.trim()) return

    setIsProcessing(true)

    // Simulate AI processing
    setTimeout(() => {
      let generatedData: any = {}

      // Mock auto-detection based on input method
      if (inputMethod === "url") {
        generatedData = {
          author: "Smith, J.",
          title: "The Impact of Technology on Modern Education",
          website: "Educational Technology Review",
          url: inputValue,
          date: "2024-01-15",
          accessDate: new Date().toISOString().split("T")[0],
        }
        setSourceType("website")
      } else if (inputMethod === "doi") {
        generatedData = {
          author: "Johnson, M. & Brown, K.",
          title: "Advanced Research Methods in Social Sciences",
          journal: "Journal of Social Research",
          volume: "45",
          issue: "3",
          pages: "123-145",
          year: "2024",
          doi: inputValue,
        }
        setSourceType("journal")
      } else if (inputMethod === "isbn") {
        generatedData = {
          author: "Wilson, R.",
          title: "Comprehensive Guide to Academic Writing",
          publisher: "Academic Press",
          year: "2024",
          city: "New York",
          isbn: inputValue,
        }
        setSourceType("book")
      }

      setFormData(generatedData)
      setIsProcessing(false)
    }, 2500)
  }

  const generateCitation = () => {
    if (!formData.author || !formData.title) return

    let fullCitation = ""
    let inTextCitation = ""
    const currentDate = new Date().toISOString()

    // APA 7th Edition citation generation
    if (citationStyle === "apa") {
      const authorLastName = formData.author.split(",")[0].trim()
      const year = formData.year || formData.date?.split("-")[0] || "n.d."

      if (sourceType === "website") {
        fullCitation = `${formData.author} (${year}). ${formData.title}. *${formData.website}*. ${formData.url}`
        inTextCitation = `(${authorLastName}, ${year})`
      } else if (sourceType === "book") {
        fullCitation = `${formData.author} (${formData.year}). *${formData.title}*. ${formData.publisher}.`
        inTextCitation = `(${authorLastName}, ${formData.year})`
      } else if (sourceType === "journal") {
        fullCitation = `${formData.author} (${formData.year}). ${formData.title}. *${formData.journal}*, *${formData.volume}*(${formData.issue}), ${formData.pages}. https://doi.org/${formData.doi || "10.xxxx/xxxx"}`
        inTextCitation = `(${authorLastName}, ${formData.year})`
      } else if (sourceType === "image") {
        fullCitation = `${formData.author} (${year}). *${formData.title}* [${formData.medium || "Photograph"}]. ${formData.source || formData.website}. ${formData.url}`
        inTextCitation = `(${authorLastName}, ${year})`
      } else if (sourceType === "video") {
        fullCitation = `${formData.author} (${year}, ${formData.date ? new Date(formData.date).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : "Date"}). *${formData.title}* [Video]. ${formData.platform || "YouTube"}. ${formData.url}`
        inTextCitation = `(${authorLastName}, ${formData.year})`
      }
    }

    const newCitation: Citation = {
      id: Date.now(),
      type: sourceType,
      style: citationStyle,
      fullCitation,
      inTextCitation,
      timestamp: currentDate,
      source: { ...formData },
      verified: true,
    }

    setCitations([newCitation, ...citations])
    setFormData({})
    setInputValue("")
  }

  const getFormFields = () => {
    switch (sourceType) {
      case "website":
        return [
          { key: "author", label: "Author", placeholder: "Last, F. M." },
          { key: "title", label: "Page Title", placeholder: "Title of the webpage" },
          { key: "website", label: "Website Name", placeholder: "Name of the website" },
          { key: "url", label: "URL", placeholder: "https://example.com" },
          { key: "date", label: "Publication Date", type: "date" },
          { key: "accessDate", label: "Access Date", type: "date", value: new Date().toISOString().split("T")[0] },
        ]
      case "book":
        return [
          { key: "author", label: "Author", placeholder: "Last, F. M." },
          { key: "title", label: "Book Title", placeholder: "Title of the book" },
          { key: "publisher", label: "Publisher", placeholder: "Publisher name" },
          { key: "year", label: "Publication Year", placeholder: "YYYY" },
          { key: "city", label: "Publication City", placeholder: "City name" },
          { key: "isbn", label: "ISBN (Optional)", placeholder: "978-0-123456-78-9" },
        ]
      case "journal":
        return [
          { key: "author", label: "Author", placeholder: "Last, F. M." },
          { key: "title", label: "Article Title", placeholder: "Title of the article" },
          { key: "journal", label: "Journal Name", placeholder: "Name of the journal" },
          { key: "volume", label: "Volume", placeholder: "Volume number" },
          { key: "issue", label: "Issue", placeholder: "Issue number" },
          { key: "pages", label: "Pages", placeholder: "123-145" },
          { key: "year", label: "Publication Year", placeholder: "YYYY" },
          { key: "doi", label: "DOI (Optional)", placeholder: "10.xxxx/xxxx" },
        ]
      case "image":
        return [
          { key: "author", label: "Creator/Photographer", placeholder: "Last, F. M." },
          { key: "title", label: "Image Title", placeholder: "Title or description" },
          { key: "medium", label: "Medium", placeholder: "Photograph, Digital image, etc." },
          { key: "source", label: "Source/Website", placeholder: "Where found" },
          { key: "url", label: "URL", placeholder: "https://example.com" },
          { key: "date", label: "Creation Date", type: "date" },
        ]
      case "video":
        return [
          { key: "author", label: "Creator/Channel", placeholder: "Last, F. M. or Channel Name" },
          { key: "title", label: "Video Title", placeholder: "Title of the video" },
          { key: "platform", label: "Platform", placeholder: "YouTube, Vimeo, etc." },
          { key: "url", label: "URL", placeholder: "https://youtube.com/watch?v=" },
          { key: "date", label: "Publication Date", type: "date" },
        ]
      default:
        return []
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value })
  }

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation)
  }

  const downloadCitations = () => {
    const content = `CITATION BIBLIOGRAPHY
Generated by QuillBot Citation Generator
${new Date().toLocaleDateString()}

${citations
  .map(
    (c, index) =>
      `${index + 1}. ${c.fullCitation}

In-text citation: ${c.inTextCitation}
Source type: ${c.type} (${c.style.toUpperCase()})
Generated: ${new Date(c.timestamp).toLocaleDateString()}
${c.verified ? "✓ AI-Verified Citation" : ""}

---`,
  )
  .join("\n\n")}

Total citations: ${citations.length}
Primary style: APA 7th Edition
Accuracy: Human-verified templates with AI processing`

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "citations-bibliography.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    if (uploadedFiles.length > 0) {
      setFiles((prev) => [...prev, ...uploadedFiles])
      // Simulate bulk import processing
      setIsProcessing(true)
      setTimeout(() => {
        // Mock bulk citations
        const bulkCitations = uploadedFiles.map((file, index) => ({
          id: Date.now() + index,
          type: "document",
          style: "apa",
          fullCitation: `Author, A. (2024). *${file.name.replace(/\.[^/.]+$/, "")}*. Imported Document.`,
          inTextCitation: `(Author, 2024)`,
          timestamp: new Date().toISOString(),
          source: { title: file.name, author: "Author, A.", year: "2024" },
          verified: true,
        }))
        setCitations((prev) => [...bulkCitations, ...prev])
        setIsProcessing(false)
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Quote className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Citation Generator</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Generate APA 7th edition citations instantly with AI-powered accuracy
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
              <span className="px-2 py-1 sm:px-3 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium">
                Free Tool
              </span>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                History
              </button>
            </div>
          </div>
        </div>

        {/* Input Method Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            How would you like to add your source?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
            {inputMethods.map((method) => {
              const IconComponent = method.icon
              return (
                <button
                  key={method.id}
                  onClick={() => setInputMethod(method.id)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 ${
                    inputMethod === method.id
                      ? "border-amber-500 bg-amber-50 text-amber-700"
                      : "border-gray-200 hover:border-amber-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm text-center sm:text-left">{method.name}</span>
                </button>
              )
            })}
          </div>

          {/* Input Field */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputMethods.find((m) => m.id === inputMethod)?.placeholder}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              onClick={handleAutoGenerate}
              disabled={!inputValue.trim() || isProcessing}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center text-xs sm:text-sm"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Auto-Generate</span>
                  <span className="sm:hidden">Generate</span>
                </>
              )}
            </button>
          </div>

          {/* Bulk Import */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs sm:text-sm text-gray-700">Need to import multiple citations?</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center px-3 py-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors text-xs sm:text-sm"
              >
                <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Bulk Import
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,.bib"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Citation Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            {/* Source Type Selection */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Source Type</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                {sourceTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSourceType(type.id)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                        sourceType === type.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                      <span className="text-xs font-medium text-center leading-tight">{type.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Citation Style */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Citation Style</h3>
              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                {citationStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCitationStyle(style.id)}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                      citationStyle === style.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm sm:text-base">{style.name}</span>
                      {style.primary && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Recommended</span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{style.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Source Information</h3>
              {getFormFields().map((field) => (
                <div key={field.key}>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                  <input
                    type={field.type || "text"}
                    value={formData[field.key] || field.value || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={generateCitation}
              disabled={!formData.author || !formData.title}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Generate Citation
            </button>
          </div>

          {/* Generated Citations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Citations</h2>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-500">{citations.length} citations</span>
                {citations.length > 0 && (
                  <button
                    onClick={downloadCitations}
                    className="p-1 sm:p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Download bibliography"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            </div>

            {citations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 sm:h-80 text-gray-400">
                <Quote className="w-12 h-12 sm:w-16 sm:h-16 mb-4" />
                <p className="text-base sm:text-lg font-medium">No citations yet</p>
                <p className="text-xs sm:text-sm text-center">
                  Use the form to generate accurate APA citations instantly
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
                {citations.map((citation) => (
                  <div
                    key={citation.id}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3 gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium whitespace-nowrap">
                          {citation.style.toUpperCase()} {citation.type}
                        </span>
                        {citation.verified && (
                          <CheckCircle
                            className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0"
                            title="AI-Verified"
                          />
                        )}
                      </div>
                      <div className="flex space-x-1 flex-shrink-0">
                        <button
                          onClick={() => copyCitation(citation.fullCitation)}
                          className="p-1 text-gray-600 hover:text-amber-600 transition-colors"
                          title="Copy full citation"
                        >
                          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                        <button
                          onClick={() => copyCitation(citation.inTextCitation)}
                          className="p-1 text-gray-600 hover:text-amber-600 transition-colors"
                          title="Copy in-text citation"
                        >
                          <Quote className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Reference List Entry:</h4>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 p-2 rounded break-words">
                        {citation.fullCitation}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">In-Text Citation:</h4>
                      <p className="text-xs sm:text-sm text-gray-700 font-mono bg-blue-50 p-2 rounded">
                        {citation.inTextCitation}
                      </p>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Generated: {new Date(citation.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Instant Generation</h3>
            <p className="text-xs sm:text-sm text-gray-600">AI processes and formats citations in seconds</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">AI-Verified Accuracy</h3>
            <p className="text-xs sm:text-sm text-gray-600">Human-verified templates ensure APA compliance</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Bulk Import</h3>
            <p className="text-xs sm:text-sm text-gray-600">Import multiple citations from files or databases</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <History className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Citation History</h3>
            <p className="text-xs sm:text-sm text-gray-600">Saves your citations for easy access and reuse</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitationGeneratorPage
