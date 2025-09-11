import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2 } from 'lucide-react';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  return (
    <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
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
            See AI Writing in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Watch how Editore transforms your writing process with intelligent suggestions, 
            real-time corrections, and seamless collaboration features.
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glowing Frame */}
          <motion.div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3a86ff, #00c896, #3a86ff)',
              padding: '3px'
            }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(58, 134, 255, 0.4)',
                '0 0 50px rgba(0, 200, 150, 0.6)',
                '0 0 30px rgba(58, 134, 255, 0.4)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 60px rgba(58, 134, 255, 0.8)'
            }}
          >
            {/* Video Element */}
            <div 
              className="relative bg-black rounded-3xl aspect-video cursor-pointer group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {/* Video Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl flex items-center justify-center">
                {/* Demo Content Overlay */}
                <div className="absolute inset-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div className="flex-1 bg-white/10 rounded-full h-6 flex items-center px-3">
                        <span className="text-white/60 text-sm">editore.ai/demo</span>
                      </div>
                    </div>
                    
                    {/* Simulated Writing Interface */}
                    <div className="space-y-3">
                      <div className="h-2 bg-white/20 rounded w-3/4" />
                      <div className="h-2 bg-white/20 rounded w-full" />
                      <div className="h-2 bg-teal-400/60 rounded w-1/2" />
                      <div className="h-2 bg-white/20 rounded w-2/3" />
                    </div>
                  </div>
                </div>

                {/* Play Button */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.button
                      className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-300"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        y: [0, -5, 0]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        scale: { duration: 0.3 },
                        y: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                      
                      {/* Ripple Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white/50"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.8, 0, 0.8]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Video Controls */}
                <AnimatePresence>
                  {(showControls || isPlaying) && (
                    <motion.div
                      className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsPlaying(!isPlaying);
                        }}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" fill="white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        )}
                      </button>
                      
                      <div className="flex-1 bg-white/20 rounded-full h-1 relative">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full"
                          animate={{ width: isPlaying ? '100%' : '0%' }}
                          transition={{ duration: isPlaying ? 30 : 0 }}
                        />
                      </div>
                      
                      <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Volume2 className="w-5 h-5 text-white" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { title: 'Real-time Suggestions', desc: 'Get instant feedback as you type' },
              { title: 'Smart Corrections', desc: 'AI-powered grammar and style improvements' },
              { title: 'Seamless Integration', desc: 'Works with your favorite writing tools' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20"
                whileHover={{ 
                  y: -5,
                  boxShadow: '0 10px 30px rgba(58, 134, 255, 0.2)'
                }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
