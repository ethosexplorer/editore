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
        className={`fixed top-0 left-0 right-0 z-50 h-16 lg:h-20 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-[16px] border-b border-black/10 shadow-lg"
            : "bg-white/90 backdrop-blur-[12px] border-b border-black/8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 z-50 flex-shrink-0">
            <motion.div
              className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </motion.div>
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Editore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative text-sm font-semibold transition-all duration-300 group px-3 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 ${
                  location.pathname === item.path
                    ? "text-blue-600 bg-gradient-to-r from-blue-50 to-teal-50"
                    : "text-gray-700 hover:text-gray-900"
                }`}
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem("")}
              >
                {item.name}
                <div
                  className={`absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-300 ${
                    activeItem === item.name || location.pathname === item.path
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="xl:hidden p-2.5 z-50 rounded-xl hover:bg-gray-100 transition-all duration-200"
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
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
            className="fixed inset-0 z-40 xl:hidden"
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
              className="absolute top-16 lg:top-20 left-0 right-0 bottom-0 bg-white"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Menu Items */}
              <nav className="px-4 sm:px-6 py-6">
                <div className="grid gap-1 max-h-[calc(100vh-200px)]">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-4 rounded-xl transition-all duration-300 ${
                          location.pathname === item.path
                            ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 border border-blue-100"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={toggleMobileMenu}
                      >
                        <span className="font-medium">{item.name}</span>
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
              <div className="px-4 sm:px-6 py-6 mt-auto border-t border-gray-100">
                <div className="flex items-center justify-center space-x-2 text-gray-500">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-3 h-3 text-white" />
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
