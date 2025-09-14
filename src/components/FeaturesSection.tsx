import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, RefreshCw, CheckCircle, FileText, Shield, Users, Quote, Languages, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const scrollRef = useRef(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const features = [
    {
      icon: Search,
      title: 'AI Detector',
      path: '/ai-detector',
      description: 'Identify AI-generated content with advanced detection algorithms and detailed analysis reports.',
      animation: 'Sleek horizontal scanning light passes over text',
      shortDesc: 'Detect AI-generated content instantly'
    },
    {
      icon: RefreshCw,
      title: 'Paraphraser',
      path: '/paraphraser',
      description: 'Rewrite content while maintaining original meaning with intelligent paraphrasing technology.',
      animation: 'Words morph with smooth transformations',
      shortDesc: 'Rewrite content intelligently'
    },
    {
      icon: CheckCircle,
      title: 'Grammar Checker',
      path: '/grammar-checker',
      description: 'Catch grammar mistakes, spelling errors, and improve writing clarity with real-time suggestions.',
      animation: 'Red underlines pop/fade as corrections are applied',
      shortDesc: 'Fix grammar and spelling errors'
    },
    {
      icon: FileText,
      title: 'Summarizer',
      path: '/summarizer',
      description: 'Extract key points and create concise summaries from lengthy documents and articles.',
      animation: 'Text folds into sticky-note style cards',
      shortDesc: 'Create concise summaries'
    },
    {
      icon: Shield,
      title: 'Plagiarism Checker',
      path: '/plagiarism-checker',
      description: 'Ensure originality with comprehensive plagiarism detection across billions of web pages.',
      animation: 'Radar scan sweeps across highlighted text',
      shortDesc: 'Check content originality'
    },
    {
      icon: Users,
      title: 'AI Humanizer',
      path: '/ai-humanizer',
      description: 'Transform AI-generated content to sound more natural and human-like.',
      animation: 'Text morphs into polished sentences',
      shortDesc: 'Make AI text sound human'
    },
    {
      icon: Quote,
      title: 'Citation Generator',
      path: '/citation-generator',
      description: 'Generate accurate citations in APA, MLA, Chicago, and other academic formats instantly.',
      animation: 'Auto-typing animation for citations',
      shortDesc: 'Generate academic citations'
    },
    {
      icon: Languages,
      title: 'Translator',
      path: '/translator',
      description: 'Translate content between 100+ languages with context-aware AI translation.',
      animation: 'Words flip horizontally as language changes',
      shortDesc: 'Translate 100+ languages'
    }
  ];

  const getVisibleCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    const visibleCount = getVisibleCount();
    return Math.max(0, features.length - visibleCount);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (getMaxIndex() + 1));
  };

  const prevSlide = () => {
    const maxIndex = getMaxIndex();
    setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
  };

  const getVisibleFeatures = () => {
    const visibleCount = getVisibleCount();
    const visible = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % features.length;
      visible.push({ ...features[index], position: i });
    }
    return visible;
  };

  // Mobile Grid Layout
  if (isMobile) {
    return (
      <section className="py-12 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              AI Writing Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Enhance your content creation with our AI-powered tools.
            </p>
          </motion.div>

          {/* Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Link to={feature.path} className="block">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.shortDesc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Desktop and Tablet Carousel Layout
  return (
    <section className="py-16 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-24">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 tracking-tight">
            Powerful AI Writing Tools
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of writing with our comprehensive suite of AI-powered tools designed to enhance every aspect of your content creation.
          </p>
        </motion.div>

        {/* Features Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-0 lg:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-0 lg:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </motion.button>

          {/* Feature Cards */}
          <div className={`flex items-center justify-center px-8 lg:px-16 ${
            isTablet ? 'space-x-4' : 'space-x-6 lg:space-x-8'
          }`}>
            <AnimatePresence mode="wait">
              {getVisibleFeatures().map((feature, index) => {
                const Icon = feature.icon;
                const isCenter = !isTablet && feature.position === 1;
                const isTabletCard = isTablet;

                return (
                  <motion.div
                    key={`${feature.title}-${currentIndex}`}
                    className={`bg-white rounded-3xl shadow-lg transition-all duration-500 ${
                      isTabletCard
                        ? 'w-72 h-80 p-6'
                        : isCenter
                        ? 'w-80 h-96 p-8 opacity-100 scale-110 shadow-2xl'
                        : 'w-72 h-88 p-8 opacity-80 scale-90'
                    }`}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{
                      opacity: isTabletCard ? 1 : (isCenter ? 1 : 0.8),
                      scale: isTabletCard ? 1 : (isCenter ? 1.1 : 0.9),
                      y: 0
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    whileHover={{
                      scale: isTabletCard ? 1.05 : (isCenter ? 1.15 : 0.95),
                      y: -10,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                    }}
                  >
                    <Link to={feature.path} className="block h-full">
                      <motion.div className="flex flex-col items-center text-center h-full">
                        <motion.div
                          className={`${
                            isTabletCard ? 'w-14 h-14 mb-4' : 'w-16 h-16 mb-6'
                          } bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl flex items-center justify-center`}
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
                          <Icon className={`${isTabletCard ? 'w-7 h-7' : 'w-8 h-8'} text-white`} />
                        </motion.div>

                        <h3 className={`${
                          isTabletCard ? 'text-xl mb-3' : 'text-2xl mb-4'
                        } font-bold text-gray-900`}>
                          {feature.title}
                        </h3>

                        <p className={`text-gray-600 leading-relaxed flex-grow ${
                          isTabletCard ? 'text-sm mb-4' : 'mb-6'
                        }`}>
                          {isTabletCard ? feature.shortDesc : feature.description}
                        </p>

                        {!isTabletCard && (
                          <motion.div
                            className="text-sm text-teal-600 font-medium bg-teal-50 rounded-full px-4 py-2"
                            whileHover={{ scale: 1.05 }}
                          >
                            {feature.animation}
                          </motion.div>
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 lg:mt-12 space-x-2">
            {Array.from({ length: getMaxIndex() + 1 }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
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
