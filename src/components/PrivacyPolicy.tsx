import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Eye, Lock, Users, Globe, Mail } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          className="flex items-center mb-8"
          variants={itemVariants}
        >
          <motion.button
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to App</span>
          </motion.button>
        </motion.div>

        {/* Title Section */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how SealTalk collects, uses, and protects your information.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Information We Collect */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Eye className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Information</h3>
                <p>When you create an account, we collect your email address, display name, and profile picture (if provided via Google OAuth).</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Chat Messages</h3>
                <p>We store your chat messages to provide the service. Messages are associated with your account and visible to other users in the chat.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Anonymous Users</h3>
                <p>For anonymous users, we only collect minimal information needed for the chat service and automatically delete sessions after inactivity.</p>
              </div>
            </div>
          </motion.section>

          {/* How We Use Information */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 text-gray-600 dark:text-gray-300">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Provide and maintain the chat service</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Authenticate users and prevent unauthorized access</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Display your messages and profile information to other users</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Improve our service and user experience</p>
              </div>
            </div>
          </motion.section>

          {/* Data Security */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Lock className="w-6 h-6 text-purple-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Data Security
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Security Measures Include:</h4>
                <ul className="space-y-1 text-purple-800 dark:text-purple-300">
                  <li>• Encrypted data transmission (HTTPS)</li>
                  <li>• Secure authentication via Supabase</li>
                  <li>• Regular security updates and monitoring</li>
                  <li>• Limited data retention for anonymous users</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Third-Party Services */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-orange-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Third-Party Services
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>SealTalk uses the following third-party services:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Supabase</h4>
                  <p className="text-sm">Database and authentication services</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Google OAuth</h4>
                  <p className="text-sm">Optional sign-in authentication</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cloudflare Turnstile</h4>
                  <p className="text-sm">Bot protection for anonymous users</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Your Rights */}
          <motion.section 
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Your Rights
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>You have the right to:</p>
              <div className="grid gap-3">
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <span>Access and update your account information</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <span>Request account deletion by contacting us at privacy@sealtalk.app</span>
                </div>
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <span>Use the service anonymously with limited data collection</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Contact */}
          <motion.section 
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white"
            variants={itemVariants}
          >
            <div className="flex items-center mb-6">
              <Mail className="w-6 h-6 mr-3" />
              <h2 className="text-2xl font-semibold">
                Questions or Concerns?
              </h2>
            </div>
            <p className="mb-4 opacity-90">
              If you have any questions about this Privacy Policy or how we handle your data, please don't hesitate to reach out.
            </p>
            <motion.button
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'mailto:privacy@sealtalk.app'}
            >
              Contact Us
            </motion.button>
          </motion.section>
        </div>

        {/* Footer */}
        <motion.div 
          className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          <p className="text-gray-500 dark:text-gray-400">
            © 2025 sealtalk. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
