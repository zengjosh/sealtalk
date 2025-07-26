import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Settings, Moon, Sun, Lock, Check, X, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/chat';
import { QuoteOfTheDay } from './QuoteOfTheDay';

interface SettingsDropdownProps {
  currentUser: User;
  onUserChange: (name: string) => void;
}

const sidebarVariants: Variants = {
  open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

const overlayVariants: Variants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

const itemVariants: Variants = {
  open: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const containerVariants: Variants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
};

export function SettingsDropdown({ currentUser, onUserChange }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser.name);
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditingUsername(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isEditingUsername) {
      setNewUsername(currentUser.name);
    }
  }, [isEditingUsername, currentUser.name]);

  const handleUsernameSubmit = () => {
    if (newUsername.trim() && newUsername.trim() !== currentUser.name) {
      onUserChange(newUsername.trim());
    }
    setIsEditingUsername(false);
  };

  const handleUsernameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUsernameSubmit();
    else if (e.key === 'Escape') setIsEditingUsername(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9, rotate: -15 }}
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
              />
              <motion.div
                variants={sidebarVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="flex-grow p-6 space-y-6"
                >
                  <motion.div variants={itemVariants} className="text-center">
                    <img src={currentUser.avatar} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-gray-200 dark:border-gray-700 mx-auto" />
                    <div className="mt-4">
                      {isEditingUsername ? (
                        <div className="space-y-2 w-full">
                          <input
                            type="text"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            onKeyDown={handleUsernameKeyPress}
                            className="w-5/6 mx-auto px-3 py-2 text-lg font-semibold text-center bg-gray-100 dark:bg-gray-700 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                            autoFocus
                            maxLength={30}
                          />
                          <div className="flex justify-center space-x-2">
                            <motion.button onClick={handleUsernameSubmit} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600" whileTap={{ scale: 0.9 }}><Check size={18} /></motion.button>
                            <motion.button onClick={() => setIsEditingUsername(false)} className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600" whileTap={{ scale: 0.9 }}><X size={18} /></motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end justify-center space-x-2">
                          <p className="text-lg font-semibold text-gray-900 dark:text-white text-center truncate">{currentUser.name}</p>
                          {currentUser.is_anonymous ? (
                            <motion.button onClick={signOut} className="p-1 text-gray-500" title="Create an account to edit" whileTap={{ scale: 0.9 }}><Lock size={18} /></motion.button>
                          ) : (
                            <motion.button
                            onClick={() => setIsEditingUsername(true)}
                            className="text-xs text-gray-500 hover:underline focus:outline-none"
                            title="Change username"
                            whileTap={{ scale: 0.95 }}
                          >
                            (edit)
                          </motion.button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <QuoteOfTheDay variants={itemVariants} />

                  <motion.button
                    variants={itemVariants}
                    onClick={toggleTheme}
                    className="w-full px-4 py-3 text-left flex items-center space-x-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {isDark ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-gray-600" />}
                    <span className="text-lg text-gray-700 dark:text-gray-300">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </motion.button>
                </motion.div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <motion.button
                    variants={itemVariants}
                    onClick={signOut}
                    className="w-full px-4 py-3 text-left flex items-center space-x-4 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50"
                    title="Sign Out"
                  >
                    <LogOut className="w-6 h-6 text-red-500" />
                    <span className="text-lg text-red-500">Sign Out</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
