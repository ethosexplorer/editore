"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Edit3, Menu, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const location = useLocation()

  const menuItems = [
    { name: "Paraphraser", path: "/paraphraser" },
    { name: "Grammar & Style", path: "/grammar-style" },
    { name: "Summarizer", path: "/summarizer" },
    { name: "Originality Check", path: "/originality-check" },
    {
      name: "AI Content Tools",
      subItems: [
        { name: "AI Detector", path: "/ai-detector" },
        { name: "AI Humanizer", path: "/ai-humanizer" },
      ],
    },
    {
      name: "Research Writing",
      subItems: [
        { name: "Research Assistant", path: "/co-writer" },
        { name: "Citation Generator", path: "/citation-generator" },
        { name: "Journal Templates", path: "/co-writer" },
      ],
    },
    { name: "Translator", path: "/translator" },
  ]

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu and submenus when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setOpenSubMenu(null)
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
    setOpenSubMenu(null) // Close submenus when toggling mobile menu
  }

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name)
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
          <nav className="hidden xl:flex items-center space-x-0 ml-16">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem("")}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`relative text-sm font-semibold transition-all duration-300 group px-2 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 ${
                      location.pathname === item.path
                        ? "text-blue-600 bg-gradient-to-r from-blue-50 to-teal-50"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {item.name}
                    <div
                      className={`absolute -bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full transition-all duration-300 ${
                        activeItem === item.name || location.pathname === item.path
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0"
                      }`}
                    />
                  </Link>
                ) : (
                  <div
                    className={`relative text-sm font-semibold transition-all duration-300 group px-2 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50 ${
                      activeItem === item.name ? "text-blue-600 bg-gradient-to-r from-blue-50 to-teal-50" : "text-gray-700 hover:text-gray-900"
                    } flex items-center cursor-pointer`}
                  >
                    {item.name}
                    <ChevronDown className="w-4 h-4 ml-1" />
                    <AnimatePresence>
                      {activeItem === item.name && item.subItems && (
                        <motion.div
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm font-medium transition-all duration-200 ${
                                location.pathname === subItem.path
                                  ? "text-blue-600 bg-blue-50"
                                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
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
              className="absolute top-16 lg:top-20 left-0 right-0 bottom-0 bg-white overflow-y-auto"
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
                      {item.path ? (
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
                      ) : (
                        <div>
                          <button
                            className={`flex items-center justify-between w-full px-4 py-4 rounded-xl transition-all duration-300 ${
                              openSubMenu === item.name
                                ? "bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 border border-blue-100"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => toggleSubMenu(item.name)}
                          >
                            <span className="font-medium">{item.name}</span>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-200 ${
                                openSubMenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {openSubMenu === item.name && item.subItems && (
                              <motion.div
                                className="pl-6 pt-1 pb-2"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {item.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className={`block px-4 py-3 text-sm transition-all duration-200 ${
                                      location.pathname === subItem.path
                                        ? "text-blue-600 bg-blue-50"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                    onClick={toggleMobileMenu}
                                  >
                                    {subItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
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
