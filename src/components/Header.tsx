import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit3 } from 'lucide-react';

const Header: React.FC = () => {
  const [activeItem, setActiveItem] = useState('');
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/85 backdrop-blur-[10px] border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg flex items-center justify-center">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Editore</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative text-sm font-medium transition-all duration-300 group ${
                location.pathname === item.path 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              onMouseEnter={() => setActiveItem(item.name)}
              onMouseLeave={() => setActiveItem('')}
            >
              {item.name}
              <div className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-300 ${
                activeItem === item.name || location.pathname === item.path ? 'w-full' : 'w-0'
              }`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-teal-400/10 to-blue-500/10 rounded-lg transition-all duration-300 ${
                activeItem === item.name || location.pathname === item.path ? 'opacity-100' : 'opacity-0'
              }`} />
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2">
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className="w-full h-0.5 bg-gray-700"></div>
            <div className="w-full h-0.5 bg-gray-700"></div>
            <div className="w-full h-0.5 bg-gray-700"></div>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
