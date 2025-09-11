import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, RefreshCw, CheckCircle, FileText, Shield, Users, Quote, Languages, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const features = [
    {
      icon: Search,
      title: 'AI Detector',
      path: '/ai-detector',
      description: 'Identify AI-generated content with advanced detection algorithms and detailed analysis reports.',
      animation: 'Sleek horizontal scanning light passes over text'
    },
    {
      icon: RefreshCw,
      title: 'Paraphraser',
      path: '/paraphraser',
      description: 'Rewrite content while maintaining original meaning with intelligent paraphrasing technology.',
      animation: 'Words morph with smooth transformations'
    },
    {
      icon: CheckCircle,
      title: 'Grammar Checker',
      path: '/grammar-checker',
      description: 'Catch grammar mistakes, spelling errors, and improve writing clarity with real-time suggestions.',
      animation: 'Red underlines pop/fade as corrections are applied'
    },
    {
      icon: FileText,
      title: 'Summarizer',
      path: '/summarizer',
      description: 'Extract key points and create concise summaries from lengthy documents and articles.',
      animation: 'Text folds into sticky-note style cards'
    },
    {
      icon: Shield,
      title: 'Plagiarism Checker',
      path: '/plagiarism-checker',
      description: 'Ensure originality with comprehensive plagiarism detection across billions of web pages.',
      animation: 'Radar scan sweeps across highlighted text'
    },
    {
      icon: Users,
      title: 'AI Humanizer',
      path: '/ai-humanizer',
      description: 'Transform AI-generated content to sound more natural and human-like.',
      animation: 'Text morphs into polished sentences'
    },
    {
      icon: Quote,
      title: 'Citation Generator',
      path: '/citation-generator',
      description: 'Generate accurate citations in APA, MLA, Chicago, and other academic formats instantly.',
      animation: 'Auto-typing animation for citations'
    },
    {
      icon: Languages,
      title: 'Translator',
      path: '/translator',
      description: 'Translate content between 100+ languages with context-aware AI translation.',
      animation: 'Words flip horizontally as language changes'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, features.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, features.length - 2)) % Math.max(1, features.length - 2));
  };

  const getVisibleFeatures = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % features.length;
      visible.push({ ...features[index], position: i });
    }
    return visible;
  };

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Powerful AI Writing Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of writing with our comprehensive suite of AI-powered tools designed to enhance every aspect of your content creation.
          </p>
        </motion.div>

        {/* Features Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Feature Cards */}
          <div className="flex items-center justify-center space-x-8 px-16">
            <AnimatePresence mode="wait">
              {getVisibleFeatures().map((feature, index) => {
                const Icon = feature.icon;
                const isCenter = feature.position === 1;

                return (
                  <motion.div
                    key={`${feature.title}-${currentIndex}`}
                    className={`bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 ${
                      isCenter
                        ? 'w-80 h-96 opacity-100 scale-110 shadow-2xl'
                        : 'w-72 h-88 opacity-80 scale-90'
                    }`}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{
                      opacity: isCenter ? 1 : 0.8,
                      scale: isCenter ? 1.1 : 0.9,
                      y: 0
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    whileHover={{
                      scale: isCenter ? 1.15 : 0.95,
                      y: -10,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Link to={feature.path} className="block h-full">
                      <motion.div
                        className="flex flex-col items-center text-center h-full"
                      >
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center mb-6"
                          animate={{
                            boxShadow: [
                              '0 0 20px rgba(58, 134, 255, 0.3)',
                              '0 0 30px rgba(0, 200, 150, 0.4)',
                              '0 0 20px rgba(58, 134, 255, 0.3)'
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {feature.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                          {feature.description}
                        </p>

                        <motion.div
                          className="text-sm text-teal-600 font-medium bg-teal-50 rounded-full px-4 py-2"
                          whileHover={{ scale: 1.05 }}
                        >
                          {feature.animation}
                        </motion.div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-12 space-x-2">
            {Array.from({ length: Math.max(1, features.length - 2) }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
