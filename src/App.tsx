import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PersonaSection from './components/PersonaSection';
import VideoSection from './components/VideoSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import AIDetector from './pages/AIDetector';
import Paraphraser from './pages/Paraphraser';
import GrammarChecker from './pages/GrammarChecker';
import Summarizer from './pages/Summarizer';
import PlagiarismChecker from './pages/PlagiarismChecker';
import AIHumanizer from './pages/AIHumanizer';
import CitationGenerator from './pages/CitationGenerator';
import Translator from './pages/Translator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary font-area">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <FeaturesSection />
              <PersonaSection />
              <VideoSection />
              <TestimonialsSection />
            </>
          } />
          <Route path="/ai-detector" element={<AIDetector />} />
          <Route path="/paraphraser" element={<Paraphraser />} />
          <Route path="/grammar-checker" element={<GrammarChecker />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/plagiarism-checker" element={<PlagiarismChecker />} />
          <Route path="/ai-humanizer" element={<AIHumanizer />} />
          <Route path="/citation-generator" element={<CitationGenerator />} />
          <Route path="/translator" element={<Translator />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
