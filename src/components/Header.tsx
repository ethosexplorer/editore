"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Edit3, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const menuItems = [
    { name: "AI Detector", path: "/ai-detector" },
    { name: "Paraphraser", path: "/paraphraser" },
    { name: "Grammar Checker", path: "/grammar-checker" },
    { name: "Summarizer", path: "/summarizer" },
    { name: "Plagiarism Checker", path: "/plagiarism-checker" },
    { name: "AI Humanizer", path: "/ai-humanizer" },
    { name: "Citation Generator", path: "/citation-generator" },
    { name: "Translator", path: "/translator" },
    { name: "Research Paper", path: "/co-writer" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 lg:h-20 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-[12px] border-b border-black/10 shadow-sm"
            : "bg-white/85 backdrop-blur-[10px] border-b border-black/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-50 flex-shrink-0">
            <motion.div
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
            </motion.div>
            <span className="hidden xs:block text-base sm:text-lg lg:text-xl font-bold text-gray-900">Editore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex xl:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 2xl:space-x-8 overflow-x-auto">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-xs lg:text-sm font-medium transition-all duration-300 group px-2 lg:px-3 py-2 rounded-lg whitespace-nowrap flex-shrink-0 ${
                  location.pathname === item.path ? "text-blue-600" : "text-gray-700 hover:text-gray-900"
                }`}
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem("")}
              >
                <span className="lg:hidden">{item.name.split(" ")[0]}</span>
                <span className="hidden lg:inline">{item.name}</span>
                <div
                  className={`absolute -bottom-1 left-2 lg:left-3 right-2 lg:right-3 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 ${
                    activeItem === item.name || location.pathname === item.path
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  }`}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-500/10 rounded-lg transition-all duration-300 ${
                    activeItem === item.name || location.pathname === item.path ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-1.5 sm:p-2 z-50 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute top-14 sm:top-16 lg:top-20 left-0 right-0 bottom-0 bg-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Menu Items */}
              <nav className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                <div className="grid gap-1 max-h-[calc(100vh-160px)] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 sm:px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 min-h-[48px] ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 border border-blue-100"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <span className="font-medium text-sm sm:text-base">{item.name}</span>
                        {location.pathname === item.path && (
                          <motion.div
                            className="ml-auto w-2 h-2 bg-blue-500 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </nav>

              {/* Footer */}
              <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">Editore</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
