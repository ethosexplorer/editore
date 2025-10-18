import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AIDetectorPage from './pages/AIDetectorPage';
import ParaphraserPage from './pages/ParaphraserPage';
import GrammarCheckerPage from './pages/GrammarCheckerPage';
import SummarizerPage from './pages/SummarizerPage';
import PlagiarismCheckerPage from './pages/PlagiarismCheckerPage';
import AIHumanizerPage from './pages/AIHumanizerPage';
import CitationGeneratorPage from './pages/CitationGeneratorPage';
import TranslatorPage from './pages/TranslatorPage';
import CoWriterPage from './pages/CoWriterPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ai-detector" element={<AIDetectorPage />} />
            <Route path="/paraphraser" element={<ParaphraserPage />} />
            <Route path="/grammar-checker" element={<GrammarCheckerPage />} />
            <Route path="/summarizer" element={<SummarizerPage />} />
            <Route path="/plagiarism-checker" element={<PlagiarismCheckerPage />} />
            <Route path="/ai-humanizer" element={<AIHumanizerPage />} />
            <Route path="/citation-generator" element={<CitationGeneratorPage />} />
            <Route path="/translator" element={<TranslatorPage />} />
            <Route path="/co-writer" element={<CoWriterPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
