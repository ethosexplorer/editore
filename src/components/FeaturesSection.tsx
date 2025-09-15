import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, RefreshCw, CheckCircle, FileText, Shield, Users, Quote, Languages, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('desktop');
  const scrollRef = useRef(null);

  // Enhanced screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('mobile');
      else if (width < 768) setScreenSize('sm');
      else if (width < 1024) setScreenSize('tablet');
      else if (width < 1280) setScreenSize('lg');
      else setScreenSize('desktop');
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
      shortDesc: 'Detect AI-generated content instantly',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: RefreshCw,
      title: 'Paraphraser',
      path: '/paraphraser',
      description: 'Rewrite content while maintaining original meaning with intelligent paraphrasing technology.',
      animation: 'Words morph with smooth transformations',
      shortDesc: 'Rewrite content intelligently',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: CheckCircle,
      title: 'Grammar Checker',
      path: '/grammar-checker',
      description: 'Catch grammar mistakes, spelling errors, and improve writing clarity with real-time suggestions.',
      animation: 'Red underlines pop/fade as corrections are applied',
      shortDesc: 'Fix grammar and spelling errors',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: FileText,
      title: 'Summarizer',
      path: '/summarizer',
      description: 'Extract key points and create concise summaries from lengthy documents and articles.',
      animation: 'Text folds into sticky-note style cards',
      shortDesc: 'Create concise summaries',
      color: 'from-orange-500 to-amber-400'
    },
    {
      icon: Shield,
      title: 'Plagiarism Checker',
      path: '/plagiarism-checker',
      description: 'Ensure originality with comprehensive plagiarism detection across billions of web pages.',
      animation: 'Radar scan sweeps across highlighted text',
      shortDesc: 'Check content originality',
      color: 'from-red-500 to-rose-400'
    },
    {
      icon: Users,
      title: 'AI Humanizer',
      path: '/ai-humanizer',
      description: 'Transform AI-generated content to sound more natural and human-like.',
      animation: 'Text morphs into polished sentences',
      shortDesc: 'Make AI text sound human',
      color: 'from-indigo-500 to-blue-400'
    },
    {
      icon: Quote,
      title: 'Citation Generator',
      path: '/citation-generator',
      description: 'Generate accurate citations in APA, MLA, Chicago, and other academic formats instantly.',
      animation: 'Auto-typing animation for citations',
      shortDesc: 'Generate academic citations',
      color: 'from-teal-500 to-cyan-400'
    },
    {
      icon: Languages,
      title: 'Translator',
      path: '/translator',
      description: 'Translate content between 100+ languages with context-aware AI translation.',
      animation: 'Words flip horizontally as language changes',
      shortDesc: 'Translate 100+ languages',
      color: 'from-violet-500 to-purple-400'
    }
  ];

  const getVisibleCount = () => {
    switch (screenSize) {
      case 'mobile': return 1;
      case 'sm': return 1;
      case 'tablet': return 2;
      case 'lg': return 3;
      default: return 3;
    }
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

  // Mobile and Small Screen Grid Layout
  if (screenSize === 'mobile' || screenSize === 'sm') {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
              AI Writing Tools
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Enhance your content creation with our AI-powered tools.
            </p>
          </motion.div>

          {/* Mobile Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                  }}
                >
                  <Link to={feature.path} className="block">
                    <div className="flex flex-col items-center text-center">
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
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

  // Desktop and Tablet Carousel Layout with Enhanced Shadowing
  return (
    <section className="py-16 lg:py-24 xl:py-32 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16 xl:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 lg:mb-6 tracking-tight">
            Powerful AI Writing Tools
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of writing with our comprehensive suite of AI-powered tools designed to enhance every aspect of your content creation.
          </p>
        </motion.div>

        {/* Features Carousel */}
        <div className="relative">
          {/* Enhanced Navigation Arrows */}
          <motion.button
            onClick={prevSlide}
            className="absolute left-0 lg:-left-4 xl:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 group"
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 30px rgba(59, 130, 246, 0.3)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-0 lg:-right-4 xl:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 group"
            whileHover={{ 
              scale: 1.15, 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 30px rgba(59, 130, 246, 0.3)' 
            }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
          </motion.button>

          {/* Feature Cards with Enhanced Shadowing */}
          <div className={`flex items-center justify-center px-8 lg:px-16 xl:px-20 ${
            screenSize === 'tablet' ? 'space-x-6' : 'space-x-8 lg:space-x-10 xl:space-x-12'
          }`}>
            <AnimatePresence mode="wait">
              {getVisibleFeatures().map((feature, index) => {
                const Icon = feature.icon;
                const isCenter = screenSize !== 'tablet' && feature.position === 1;
                const isLeft = feature.position === 0;
                const isRight = feature.position === 2 || (screenSize === 'tablet' && feature.position === 1);
                const isTablet = screenSize === 'tablet';

                return (
                  <motion.div
                    key={`${feature.title}-${currentIndex}`}
                    className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/30 transition-all duration-700 ${
                      isTablet
                        ? 'w-80 h-[420px] p-8'
                        : isCenter
                        ? 'w-96 h-[480px] p-10 shadow-2xl z-10'
                        : 'w-80 h-[440px] p-8 shadow-xl'
                    }`}
                    initial={{ opacity: 0, scale: 0.8, y: 60 }}
                    animate={{
                      opacity: isTablet ? 1 : (isCenter ? 1 : 0.85),
                      scale: isTablet ? 1 : (isCenter ? 1.1 : 0.95),
                      y: 0,
                      boxShadow: isCenter 
                        ? '0 30px 80px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.1)' 
                        : isLeft || isRight
                        ? '0 20px 60px rgba(0,0,0,0.15), 0 5px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)'
                        : '0 15px 40px rgba(0,0,0,0.1)'
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 60 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    whileHover={{
                      scale: isTablet ? 1.05 : (isCenter ? 1.15 : 1.02),
                      y: isCenter ? -15 : -10,
                      boxShadow: isCenter 
                        ? '0 40px 100px rgba(0,0,0,0.25), 0 15px 40px rgba(0,0,0,0.15), 0 0 50px rgba(59, 130, 246, 0.2)' 
                        : '0 30px 80px rgba(0,0,0,0.2), 0 10px 30px rgba(0,0,0,0.1), 0 0 40px rgba(59, 130, 246, 0.15)'
                    }}
                    style={{
                      filter: isCenter ? 'none' : (isLeft || isRight) ? 'brightness(0.95) saturate(0.9)' : 'brightness(0.9)'
                    }}
                  >
                    {/* Enhanced shadow overlay for side cards */}
                    {(isLeft || isRight) && !isTablet && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-black/5 to-black/10 pointer-events-none"></div>
                    )}

                    <Link to={feature.path} className="block h-full relative z-10">
                      <motion.div className="flex flex-col items-center text-center h-full">
                        <motion.div
                          className={`${
                            isTablet ? 'w-16 h-16 mb-6' : isCenter ? 'w-20 h-20 mb-8' : 'w-16 h-16 mb-6'
                          } bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden`}
                          animate={{
                            boxShadow: [
                              `0 10px 30px ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : feature.color.includes('purple') ? 'rgba(147, 51, 234, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                              `0 15px 40px ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.6)' : feature.color.includes('purple') ? 'rgba(147, 51, 234, 0.6)' : 'rgba(16, 185, 129, 0.6)'}`,
                              `0 10px 30px ${feature.color.includes('blue') ? 'rgba(59, 130, 246, 0.4)' : feature.color.includes('purple') ? 'rgba(147, 51, 234, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                            ]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                          whileHover={{ 
                            scale: 1.1,
                            rotate: 10,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                          }}
                        >
                          {/* Animated background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <Icon className={`${isTablet ? 'w-8 h-8' : isCenter ? 'w-10 h-10' : 'w-8 h-8'} text-white relative z-10`} />
                        </motion.div>

                        <h3 className={`${
                          isTablet ? 'text-xl mb-4' : isCenter ? 'text-3xl mb-6' : 'text-xl mb-4'
                        } font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300`}>
                          {feature.title}
                        </h3>

                        <p className={`text-gray-600 leading-relaxed flex-grow ${
                          isTablet ? 'text-sm mb-6' : isCenter ? 'text-base mb-8' : 'text-sm mb-6'
                        } ${isCenter ? '' : 'opacity-90'}`}>
                          {isTablet ? feature.shortDesc : feature.description}
                        </p>

                        {!isTablet && isCenter && (
                          <motion.div
                            className="text-sm text-blue-600 font-medium bg-blue-50 rounded-full px-4 py-2 border border-blue-100"
                            whileHover={{ scale: 1.05, backgroundColor: 'rgb(219 234 254)' }}
                            transition={{ duration: 0.2 }}
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

          {/* Enhanced Carousel Indicators */}
          <div className="flex justify-center mt-10 lg:mt-12 xl:mt-16 space-x-3">
            {Array.from({ length: getMaxIndex() + 1 }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-lg'
                    : 'w-3 h-3 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={false}
                animate={{
                  scale: index === currentIndex ? 1.1 : 1,
                  boxShadow: index === currentIndex ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
