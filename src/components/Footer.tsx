import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Twitter, Facebook, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    Product: [
      { name: 'AI Detector', path: '/ai-detector' },
      { name: 'Paraphraser', path: '/paraphraser' },
      { name: 'Grammar Checker', path: '/grammar-checker' },
      { name: 'Plagiarism Checker', path: '/plagiarism-checker' },
      { name: 'AI Humanizer', path: '/ai-humanizer' },
      { name: 'Citation Generator', path: '/citation-generator' }
    ],
    Company: [
      { name: 'About Us', path: '#' },
      { name: 'Careers', path: '#' },
      { name: 'Press', path: '#' },
      { name: 'Blog', path: '#' },
      { name: 'Contact', path: '#' }
    ],
    Resources: [
      { name: 'Help Center', path: '#' },
      { name: 'API Documentation', path: '#' },
      { name: 'Writing Guide', path: '#' },
      { name: 'Templates', path: '#' },
      { name: 'Webinars', path: '#' }
    ],
    Legal: [
      { name: 'Privacy Policy', path: '#' },
      { name: 'Terms of Service', path: '#' },
      { name: 'Cookie Policy', path: '#' },
      { name: 'GDPR', path: '#' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3a86ff 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #00c896 0%, transparent 50%)`
        }} />
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <motion.div
          className="border-b border-white/10 py-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-24">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(58, 134, 255, 0.3)' }}
              >
                <Mail className="w-5 h-5 text-teal-400" />
                <span className="text-white/90 font-medium">Stay Updated</span>
              </motion.div>

              <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                Get the Latest Writing Tips & AI Updates
              </h3>
              <p className="text-white/70 mb-8 leading-relaxed">
                Join our newsletter for exclusive writing guides, feature updates, and AI writing insights delivered to your inbox.
              </p>

              {/* Newsletter Form */}
              <motion.form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="relative flex-1 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    required
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-blue-500 opacity-0 pointer-events-none"
                    animate={{
                      opacity: [0, 0.5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 whitespace-nowrap"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 10px 30px rgba(58, 134, 255, 0.4)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubscribed}
                >
                  <span>{isSubscribed ? 'Subscribed!' : 'Subscribe'}</span>
                  {!isSubscribed && (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </motion.button>
              </motion.form>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-24">
            <div className="grid lg:grid-cols-6 gap-8 lg:gap-12">
              {/* Brand Section */}
              <motion.div
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">E</span>
                  </div>
                  <span className="text-2xl font-bold">Editore</span>
                </div>

                <p className="text-white/70 leading-relaxed mb-6">
                  Empowering writers worldwide with cutting-edge AI technology.
                  Transform your writing process and achieve excellence with our comprehensive suite of intelligent tools.
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
                        whileHover={{
                          scale: 1.1,
                          boxShadow: '0 0 20px rgba(58, 134, 255, 0.4)'
                        }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>

              {/* Footer Links */}
              {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.8 }}
                >
                  <h4 className="text-lg font-semibold mb-6 text-white">
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, linkIndex) => (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: (categoryIndex * 0.1) + (linkIndex * 0.05), duration: 0.5 }}
                        >
                          {link.path.startsWith('#') ? (
                            <motion.a
                              href={link.path}
                              className="group flex items-center text-white/70 hover:text-white transition-colors duration-300 relative"
                              whileHover={{ x: 5 }}
                            >
                              <span className="relative">
                                {link.name}
                                <motion.div
                                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 group-hover:w-full transition-all duration-300"
                                />
                              </span>
                              <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.a>
                          ) : (
                            <a
                              href={link.path}
                              className="group flex items-center text-white/70 hover:text-white transition-colors duration-300 relative"
                            >
                              <motion.span
                                whileHover={{ x: 5 }}
                                className="relative"
                              >
                                {link.name}
                                <motion.div
                                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 group-hover:w-full transition-all duration-300"
                                />
                              </motion.span>
                            </a>
                          )}
                        </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-white/10 py-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-24">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-white/50 text-sm">
                © 2024 Editore. All rights reserved. Made with ❤️ for writers worldwide.
              </p>

              <div className="flex items-center space-x-6 text-sm">
                <motion.span
                  className="text-white/50"
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  Powered by Advanced AI
                </motion.span>

                <motion.div
                  className="w-2 h-2 bg-teal-400 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
