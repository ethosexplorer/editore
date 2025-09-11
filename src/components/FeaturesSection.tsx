import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  CheckCircle, 
  FileText, 
  Shield, 
  Users, 
  Quote, 
  Globe, 
  Edit,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation: string;
}

const FeaturesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const features: Feature[] = [
    {
      id: 'ai-detector',
      title: 'AI Detector',
      description: 'Identify AI-generated content with advanced detection algorithms',
      icon: <Search className="w-12 h-12" />,
      animation: 'Sleek horizontal scanning light passes over text'
    },
    {
      id: 'paraphraser',
      title: 'Paraphraser',
      description: 'Rewrite content while maintaining original meaning and context',
      icon: <RefreshCw className="w-12 h-12" />,
      animation: 'Words morph with smooth letter-to-letter transformations'
    },
    {
      id: 'grammar-checker',
      title: 'Grammar Checker',
      description: 'Advanced grammar and style checking with real-time suggestions',
      icon: <CheckCircle className="w-12 h-12" />,
      animation: 'Red underlines pop and fade as corrections are applied'
    },
    {
      id: 'summarizer',
      title: 'Summarizer',
      description: 'Extract key points and create concise summaries instantly',
      icon: <FileText className="w-12 h-12" />,
      animation: 'Text folds into sticky-note style cards'
    },
    {
      id: 'plagiarism-checker',
      title: 'Plagiarism Checker',
      description: 'Comprehensive plagiarism detection across billions of sources',
      icon: <Shield className="w-12 h-12" />,
      animation: 'Radar scan sweeps across highlighted text'
    },
    {
      id: 'ai-humanizer',
      title: 'AI Humanizer',
      description: 'Transform AI text to sound more natural and human-like',
      icon: <Users className="w-12 h-12" />,
      animation: 'Text morphs smoothly into polished sentences'
    },
    {
      id: 'citation-generator',
      title: 'Citation Generator',
      description: 'Generate accurate citations in multiple academic formats',
      icon: <Quote className="w-12 h-12" />,
      animation: 'Auto-typing animation for citations'
    },
    {
      id: 'translator',
      title: 'Translator',
      description: 'Translate content across 100+ languages with context awareness',
      icon: <Globe className="w-12 h-12" />,
      animation: 'Words flip horizontally as language changes'
    },
    {
      id: 'co-writer',
      title: 'Co-Writer',
      description: 'AI-powered writing assistant for collaborative content creation',
      icon: <Edit className="w-12 h-12" />,
      animation: 'Real-time live typing effect (like Google Docs)'
    }
  ];

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const gap = 32;
      const scrollPosition = index * (cardWidth + gap);
      scrollRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : features.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < features.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const cardWidth = 320;
        const gap = 32;
        const scrollLeft = scrollRef.current.scrollLeft;
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        setCurrentIndex(newIndex);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful AI Writing Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered writing tools designed to enhance 
            your productivity and improve your content quality.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Features Carousel */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-16"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`flex-shrink-0 w-80 h-96 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 group ${
                  index === currentIndex ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
                }`}
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>

                  <div className="text-sm text-gray-500 italic">
                    {feature.animation}
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-teal-400/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-400 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
