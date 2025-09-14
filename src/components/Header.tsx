import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit3, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'AI Detector', path: '/ai-detector' },
    { name: 'Paraphraser', path: '/paraphraser' },
    { name: 'Grammar Checker', path: '/grammar-checker' },
    { name: 'Summarizer', path: '/summarizer' },
    { name: 'Plagiarism Checker', path: '/plagiarism-checker' },
    { name: 'AI Humanizer', path: '/ai-humanizer' },
    { name: 'Citation Generator', path: '/citation-generator' },
    { name: 'Translator', path: '/translator' },
    { name: 'Co-Writer', path: '/co-writer' }
  ];

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="header-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="logo-container z-50">
            <div className="logo-icon">
              <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="logo-text">Editore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onMouseEnter={() => setActiveItem(item.name)}
                onMouseLeave={() => setActiveItem('')}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="mobile-menu-button"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="mobile-menu-backdrop" onClick={toggleMobileMenu} />
        
        {/* Mobile Menu Panel */}
        <nav className={`mobile-menu-panel ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mobile-menu-header">
              <Link to="/" className="logo-container" onClick={toggleMobileMenu}>
                <div className="logo-icon">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <span className="logo-text">Editore</span>
              </Link>
            </div>

            {/* Menu Items */}
            <div className="mobile-menu-items">
              {menuItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`mobile-menu-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={toggleMobileMenu}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>{item.name}</span>
                  {location.pathname === item.path && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="mobile-menu-footer">
              <p>AI-powered writing tools</p>
            </div>
          </div>
        </nav>
      </div>

      {/* Header Spacer */}
      <div className="header-spacer" />
    </>
  );
};

export default Header;
