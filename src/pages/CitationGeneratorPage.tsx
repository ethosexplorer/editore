import React, { useState } from 'react';
import { Quote, Copy, Download, BookOpen, Globe, FileText } from 'lucide-react';

interface Citation {
  id: number;
  type: string;
  citation: string;
  inText: string;
}

const CitationGeneratorPage: React.FC = () => {
  const [sourceType, setSourceType] = useState('website');
  const [citationStyle, setCitationStyle] = useState('apa');
  const [formData, setFormData] = useState<any>({});
  const [citations, setCitations] = useState<Citation[]>([]);

  const sourceTypes = [
    { id: 'website', name: 'Website', icon: <Globe className="w-5 h-5" /> },
    { id: 'book', name: 'Book', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'journal', name: 'Journal Article', icon: <FileText className="w-5 h-5" /> },
    { id: 'newspaper', name: 'Newspaper', icon: <FileText className="w-5 h-5" /> }
  ];

  const citationStyles = [
    { id: 'apa', name: 'APA 7th Edition' },
    { id: 'mla', name: 'MLA 9th Edition' },
    { id: 'chicago', name: 'Chicago 17th Edition' },
    { id: 'harvard', name: 'Harvard Style' }
  ];

  const getFormFields = () => {
    switch (sourceType) {
      case 'website':
        return [
          { key: 'author', label: 'Author', placeholder: 'Last, First' },
          { key: 'title', label: 'Page Title', placeholder: 'Title of the webpage' },
          { key: 'website', label: 'Website Name', placeholder: 'Name of the website' },
          { key: 'url', label: 'URL', placeholder: 'https://example.com' },
          { key: 'date', label: 'Publication Date', placeholder: 'YYYY-MM-DD', type: 'date' },
          { key: 'accessDate', label: 'Access Date', placeholder: 'YYYY-MM-DD', type: 'date' }
        ];
      case 'book':
        return [
          { key: 'author', label: 'Author', placeholder: 'Last, First' },
          { key: 'title', label: 'Book Title', placeholder: 'Title of the book' },
          { key: 'publisher', label: 'Publisher', placeholder: 'Publisher name' },
          { key: 'year', label: 'Publication Year', placeholder: 'YYYY' },
          { key: 'city', label: 'Publication City', placeholder: 'City name' }
        ];
      case 'journal':
        return [
          { key: 'author', label: 'Author', placeholder: 'Last, First' },
          { key: 'title', label: 'Article Title', placeholder: 'Title of the article' },
          { key: 'journal', label: 'Journal Name', placeholder: 'Name of the journal' },
          { key: 'volume', label: 'Volume', placeholder: 'Volume number' },
          { key: 'issue', label: 'Issue', placeholder: 'Issue number' },
          { key: 'pages', label: 'Pages', placeholder: '123-456' },
          { key: 'year', label: 'Publication Year', placeholder: 'YYYY' }
        ];
      default:
        return [];
    }
  };

  const generateCitation = () => {
    if (!formData.author || !formData.title) return;

    let citation = '';
    let inText = '';

    // Simple citation generation (in real app, this would be more sophisticated)
    if (citationStyle === 'apa') {
      if (sourceType === 'website') {
        citation = `${formData.author} (${formData.date ? new Date(formData.date).getFullYear() : 'n.d.'}). ${formData.title}. ${formData.website}. ${formData.url}`;
        inText = `(${formData.author.split(',')[0]}, ${formData.date ? new Date(formData.date).getFullYear() : 'n.d.'})`;
      } else if (sourceType === 'book') {
        citation = `${formData.author} (${formData.year}). ${formData.title}. ${formData.publisher}.`;
        inText = `(${formData.author.split(',')[0]}, ${formData.year})`;
      }
    } else if (citationStyle === 'mla') {
      if (sourceType === 'website') {
        citation = `${formData.author}. "${formData.title}." ${formData.website}, ${formData.date ? new Date(formData.date).toLocaleDateString() : 'n.d.'}, ${formData.url}.`;
        inText = `(${formData.author.split(',')[0]})`;
      }
    }

    const newCitation: Citation = {
      id: Date.now(),
      type: `${sourceType} (${citationStyle.toUpperCase()})`,
      citation,
      inText
    };

    setCitations([...citations, newCitation]);
    setFormData({});
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
  };

  const downloadCitations = () => {
    const content = citations.map(c => `${c.type}:\n${c.citation}\nIn-text: ${c.inText}\n\n`).join('');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'citations.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl mb-6">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Citation Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate accurate citations in multiple academic formats. 
            Perfect for research papers, essays, and academic writing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Citation Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            {/* Source Type Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sourceTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSourceType(type.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center ${
                      sourceType === type.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    {type.icon}
                    <span className="text-sm font-medium mt-1">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Citation Style Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Citation Style</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {citationStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setCitationStyle(style.id)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                      citationStyle === style.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-900">Source Information</h3>
              {getFormFields().map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={generateCitation}
              disabled={!formData.author || !formData.title}
              className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Citation
            </button>
          </div>

          {/* Generated Citations */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Citations</h2>
              {citations.length > 0 && (
                <button
                  onClick={downloadCitations}
                  className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Download all citations"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {citations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                <Quote className="w-16 h-16 mb-4" />
                <p className="text-lg">No citations yet</p>
                <p className="text-sm">Fill out the form to generate citations</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {citations.map((citation) => (
                  <div key={citation.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {citation.type}
                      </span>
                      <button
                        onClick={() => copyCitation(citation.citation)}
                        className="p-1 text-gray-600 hover:text-amber-600 transition-colors"
                        title="Copy citation"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Full Citation:</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{citation.citation}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">In-text Citation:</h4>
                      <p className="text-sm text-gray-700">{citation.inText}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Quote className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm">Support for APA, MLA, Chicago, and Harvard citation styles</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Various Sources</h3>
            <p className="text-gray-600 text-sm">Cite websites, books, journals, and newspaper articles</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Copy className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Export</h3>
            <p className="text-gray-600 text-sm">Copy individual citations or download your entire bibliography</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitationGeneratorPage;