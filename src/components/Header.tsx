"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Edit3, Menu, X, ChevronDown, Crown, Lock, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumCode, setPremiumCode] = useState("")
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [codeError, setCodeError] = useState("")
  const location = useLocation()

  const menuItems = [
    { name: "Paraphraser", path: "/paraphraser" },
    { name: "Grammar & Style", path: "/grammar-checker" },
    { name: "Summarizer", path: "/summarizer" },
    { name: "Originality Check", path: "/plagiarism-checker" },
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
      premium: true,
    },
    { name: "Translator", path: "/translator" },
  ]

  // Check if user is premium from localStorage on component mount
  useEffect(() => {
    const savedPremiumStatus = localStorage.getItem("editore_premium_user")
    if (savedPremiumStatus === "true") {
      setIsPremiumUser(true)
    }
  }, [])

  // Filter menu items based on user premium status
  const filteredMenuItems = menuItems.filter(item => {
    if (item.premium && !isPremiumUser) {
      return false
    }
    return true
  })

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
    if (isMobileMenuOpen || showPremiumModal) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen, showPremiumModal])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setOpenSubMenu(null)
  }

  const toggleSubMenu = (name: string) => {
    setOpenSubMenu(openSubMenu === name ? null : name)
  }

  // Handle premium menu click
  const handlePremiumMenuClick = (e: React.MouseEvent, itemName: string) => {
    if (!isPremiumUser) {
      e.preventDefault()
      e.stopPropagation()
      setShowPremiumModal(true)
      setPremiumCode("")
      setCodeError("")
    }
  }

  // Verify premium code
  const verifyPremiumCode = () => {
    if (premiumCode.trim() === "DellEditore") {
      setIsPremiumUser(true)
      localStorage.setItem("editore_premium_user", "true")
      setShowPremiumModal(false)
      setPremiumCode("")
      setCodeError("")
      // Show success message or trigger confetti
      alert("🎉 Premium access granted! You now have access to Research Writing tools.")
    } else {
      setCodeError("Invalid premium code. Please try again.")
    }
  }

  // Handle key press for code input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      verifyPremiumCode()
    }
  }

  // Reset premium status (for testing)
  const resetPremiumStatus = () => {
    setIsPremiumUser(false)
    localStorage.removeItem("editore_premium_user")
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
            {isPremiumUser && (
              <motion.div
                className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Crown className="w-3 h-3 text-white" />
                <span className="text-xs font-bold text-white">PREMIUM</span>
              </motion.div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-0 ml-16">
            {filteredMenuItems.map((item) => (
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
                    className={`relative text-sm font-semibold transition-all duration-300 group px-2 py-2.5 rounded-xl ${
                      activeItem === item.name 
                        ? "text-blue-600 bg-gradient-to-r from-blue-50 to-teal-50" 
                        : item.premium && !isPremiumUser
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-teal-50"
                    } flex items-center cursor-pointer`}
                    onClick={(e) => handlePremiumMenuClick(e, item.name)}
                  >
                    <div className="flex items-center">
                      {item.name}
                      {item.premium && !isPremiumUser && (
                        <Lock className="w-3 h-3 ml-1 text-gray-400" />
                      )}
                      {item.premium && isPremiumUser && (
                        <Crown className="w-3 h-3 ml-1 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4 ml-1" />
                    <AnimatePresence>
                      {activeItem === item.name && item.subItems && isPremiumUser && (
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
                          <div className="flex items-center">
                            <span className="font-medium">{item.name}</span>
                            {item.premium && !isPremiumUser && (
                              <Lock className="w-3 h-3 ml-2 text-gray-400" />
                            )}
                            {item.premium && isPremiumUser && (
                              <Crown className="w-3 h-3 ml-2 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
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
                                : item.premium && !isPremiumUser
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                            onClick={() => {
                              if (item.premium && !isPremiumUser) {
                                handlePremiumMenuClick({ preventDefault: () => {} } as React.MouseEvent, item.name)
                              } else {
                                toggleSubMenu(item.name)
                              }
                            }}
                            disabled={item.premium && !isPremiumUser}
                          >
                            <div className="flex items-center">
                              <span className="font-medium">{item.name}</span>
                              {item.premium && !isPremiumUser && (
                                <Lock className="w-3 h-3 ml-2 text-gray-400" />
                              )}
                              {item.premium && isPremiumUser && (
                                <Crown className="w-3 h-3 ml-2 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <ChevronDown
                              className={`w-5 h-5 transition-transform duration-200 ${
                                openSubMenu === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {openSubMenu === item.name && item.subItems && isPremiumUser && (
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
                  {isPremiumUser && (
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-2 py-1 rounded-full">
                      <Crown className="w-2 h-2 text-white" />
                      <span className="text-xs font-bold text-white">PREMIUM</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Access Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPremiumModal(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Premium Access Required
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  The <span className="font-semibold">Research Writing</span> tools are premium features. 
                  Enter your premium code to unlock access.
                </p>

                {/* Code Input */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={premiumCode}
                    onChange={(e) => {
                      setPremiumCode(e.target.value)
                      setCodeError("")
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter premium code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono text-lg"
                  />
                  {codeError && (
                    <motion.p
                      className="text-red-500 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {codeError}
                    </motion.p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={verifyPremiumCode}
                    disabled={!premiumCode.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl hover:from-blue-700 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Unlock Premium</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug button - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <button
          onClick={resetPremiumStatus}
          className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg text-xs opacity-50 hover:opacity-100"
        >
          Reset Premium
        </button>
      )}
    </>
  )
}

export default Header