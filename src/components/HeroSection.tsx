import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import SpiderCrawlAnimation from './SpiderCrawlAnimation';

const HeroSection: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = [
    "Revolutionize Your Writing",
    "AI Meets Human Creativity", 
    "Your Smart Writing Companion"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 20px 40px rgba(58, 134, 255, 0.3)",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#e1e8f2] via-[#f0f4f8] to-[#e1e8f2] flex items-center justify-center overflow-hidden">
      {/* Spider Crawl Animation Background */}
      <SpiderCrawlAnimation />
      
      {/* Animated Light Beams - Responsive positioning */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 3 }}
      >
        <motion.div 
          className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-1 bg-gradient-to-r from-transparent via-[#3a86ff] to-transparent transform rotate-45"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-48 sm:w-64 md:w-80 lg:w-96 h-1 bg-gradient-to-r from-transparent via-[#00c896] to-transparent transform -rotate-45"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </motion.div>

      {/* Floating Elements - Responsive sizes and positioning */}
      <motion.div 
        className="absolute top-10 sm:top-20 left-5 sm:left-10 w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-gradient-to-r from-[#3a86ff] to-[#00c896] rounded-full opacity-20"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-10 sm:w-12 md:w-16 h-10 sm:h-12 md:h-16 bg-gradient-to-r from-[#00c896] to-[#3a86ff] rounded-full opacity-20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-2 sm:left-5 w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-r from-[#3a86ff]/30 to-[#00c896]/30 rounded-full opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content - Responsive padding and max-width */}
      <motion.div 
        className="relative z-10 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Powered by AI Badge - Responsive sizing */}
        <motion.div 
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#00c896]/20 mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <motion.div 
            className="w-2 h-2 bg-[#00c896] rounded-full mr-2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-xs sm:text-sm font-medium text-[#1a1a1a]">⚡ Powered by Advanced AI</span>
        </motion.div>

        {/* Animated Headline - Responsive text sizes */}
        <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a1a1a] mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
            style={{ letterSpacing: '-0.02em' }}
          >
            <motion.span
              key={currentPhrase}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
              className="inline-block bg-gradient-to-r from-[#1a1a1a] via-[#3a86ff] to-[#00c896] bg-clip-text text-transparent"
              style={{
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 3s ease-in-out infinite'
              }}
            >
              {phrases[currentPhrase]}
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subtitle - Responsive text and spacing */}
        <motion.p 
          className="text-base sm:text-lg md:text-xl lg:text-xl text-[#4a4a4a] max-w-sm sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2 sm:px-0"
          variants={itemVariants}
        >
          Transform your writing process with cutting-edge AI technology. 
          From grammar checking to content generation, experience the future of writing.
        </motion.p>

        {/* Action Buttons - Responsive layout and sizing */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0"
          variants={itemVariants}
        >
          <motion.button 
            className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#3a86ff] to-[#00c896] text-white font-semibold rounded-full overflow-hidden shadow-lg text-sm sm:text-base"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#3a86ff]/80 to-[#00c896]/80"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center justify-center">
              Try Editore Free
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" />
              </motion.div>
            </span>
          </motion.button>
          
          <motion.button 
            className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#3a86ff]/30 text-[#1a1a1a] font-semibold rounded-full transition-all duration-300 hover:border-[#00c896] hover:bg-[#00c896]/5 hover:shadow-lg backdrop-blur-sm text-sm sm:text-base"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="flex items-center justify-center">
              <motion.div
                className="mr-2 w-5 sm:w-6 h-5 sm:h-6 border-2 border-[#3a86ff] rounded-full flex items-center justify-center"
                whileHover={{ 
                  borderColor: "#00c896",
                  backgroundColor: "#00c896",
                  color: "#ffffff"
                }}
              >
                <Play className="w-2.5 sm:w-3 h-2.5 sm:h-3 ml-0.5" />
              </motion.div>
              Explore Features
            </span>
          </motion.button>
        </motion.div>

        {/* Feature Highlights - Responsive grid and sizing */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0"
          variants={itemVariants}
        >
          {[
            { icon: "🤖", title: "AI-Powered", desc: "Advanced algorithms for intelligent writing assistance" },
            { icon: "⚡", title: "Real-time", desc: "Instant feedback and suggestions as you type" },
            { icon: "🎯", title: "Precision", desc: "Accurate grammar, style, and tone improvements" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="text-2xl sm:text-3xl mb-2 sm:mb-3"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="font-semibold text-[#1a1a1a] mb-1 sm:mb-2 text-sm sm:text-base">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-[#4a4a4a] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div 
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-[#3a86ff]/30 rounded-full flex justify-center"
          animate={{ borderColor: ["rgba(58, 134, 255, 0.3)", "rgba(0, 200, 150, 0.6)", "rgba(58, 134, 255, 0.3)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 sm:h-3 bg-[#00c896] rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Add CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
