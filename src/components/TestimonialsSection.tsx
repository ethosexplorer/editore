import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Content Marketing Manager',
      company: 'TechFlow Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Editore has revolutionized our content creation process. The AI suggestions are incredibly accurate, and our team\'s productivity has increased by 40%. It\'s like having a professional editor available 24/7.',
      highlight: 'Increased productivity by 40%'
    },
    {
      id: 2,
      name: 'Dr. Michael Rodriguez',
      role: 'Professor of English Literature',
      company: 'Stanford University',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'As an educator, I\'ve seen how Editore helps students improve their writing skills dramatically. The grammar checker and style suggestions are pedagogically sound and help students learn, not just correct mistakes.',
      highlight: 'Pedagogically sound approach'
    },
    {
      id: 3,
      name: 'Emily Thompson',
      role: 'Graduate Student',
      company: 'MIT',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Writing my thesis became so much easier with Editore. The plagiarism checker gave me confidence, and the citation generator saved me hours of formatting. I couldn\'t have finished without it.',
      highlight: 'Saved hours of work'
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Freelance Writer',
      company: 'Independent',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'The AI humanizer feature is a game-changer. It helps me refine AI-generated drafts to match my unique voice perfectly. My clients love the consistent quality, and I can take on more projects.',
      highlight: 'Perfect voice matching'
    },
    {
      id: 5,
      name: 'Lisa Park',
      role: 'Marketing Director',
      company: 'GrowthLab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Our entire marketing team uses Editore for campaign copy, blog posts, and social media content. The consistency in brand voice across all channels has improved significantly.',
      highlight: 'Consistent brand voice'
    }
  ];

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const prevTestimonial = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: index * 0.1,
          type: 'spring',
          stiffness: 200,
          damping: 10
        }}
      >
        <Star
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      </motion.div>
    ));
  };

  return (
    <section className="py-20 lg:py-32 bg-primary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-24">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-text-primary mb-6 tracking-tight">
            Loved by Writers Worldwide
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied users who have transformed their writing with Editore's AI-powered tools.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <motion.button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-green rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 -ml-6"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-green rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 -mr-6"
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(58, 134, 255, 0.5)' }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Testimonial Cards */}
          <div className="relative h-96 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -300, scale: 0.8 }}
                transition={{ 
                  duration: 0.6,
                  ease: 'easeInOut'
                }}
              >
                <div className="bg-card-bg rounded-3xl p-8 shadow-card max-w-2xl w-full relative">
                  {/* Quote Icon */}
                  <motion.div
                    className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-green rounded-full flex items-center justify-center"
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
                    <Quote className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Star Rating */}
                  <div className="flex items-center space-x-1 mb-6">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>

                  {/* Testimonial Text */}
                  <motion.blockquote
                    className="text-lg text-text-primary leading-relaxed mb-6 italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    "{testimonials[currentIndex].text}"
                  </motion.blockquote>

                  {/* Highlight Badge */}
                  <motion.div
                    className="inline-block bg-gradient-to-r from-accent-blue/10 to-accent-green/10 border border-accent-blue/20 rounded-full px-4 py-2 mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  >
                    <span className="text-accent-blue font-medium text-sm">
                      {testimonials[currentIndex].highlight}
                    </span>
                  </motion.div>

                  {/* Author Info */}
                  <motion.div
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent-blue/20">
                      <img
                        src={testimonials[currentIndex].avatar}
                        alt={testimonials[currentIndex].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {testimonials[currentIndex].role} • {testimonials[currentIndex].company}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setAutoPlay(false);
                  setCurrentIndex(index);
                  setTimeout(() => setAutoPlay(true), 5000);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-accent-blue shadow-lg scale-125' 
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

export default TestimonialsSection;
