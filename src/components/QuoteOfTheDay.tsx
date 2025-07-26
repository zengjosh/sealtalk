
import { motion } from 'framer-motion';
import { Quote, AlertCircle } from 'lucide-react';
import { useDailyQuote } from '../hooks/useDailyQuote';

interface QuoteOfTheDayProps {
  variants?: any;
}

export function QuoteOfTheDay({ variants }: QuoteOfTheDayProps) {
  const { quote, loading, error } = useDailyQuote();

  if (loading) {
    return (
      <motion.div 
        variants={variants}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-blue-200 dark:border-gray-600"
      >
        <div className="flex items-center space-x-2 mb-3">
          <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Quote of the Day</h3>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 dark:bg-gray-500 rounded mb-2"></div>
          <div className="h-4 bg-blue-200 dark:bg-gray-500 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-blue-200 dark:bg-gray-500 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        variants={variants}
        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4 border border-red-200 dark:border-red-700"
      >
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Quote of the Day</h3>
        </div>
        <p className="text-sm text-red-700 dark:text-red-300">
          Unable to load today's quote. It will refresh automatically tomorrow.
        </p>
      </motion.div>
    );
  }

  if (!quote) {
    return null;
  }

  return (
    <motion.div 
      variants={variants}
      className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 border border-blue-200 dark:border-gray-600"
    >
      <div className="flex items-center space-x-2 mb-3">
        <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Quote of the Day</h3>
      </div>
      
      <blockquote className="relative">
        <div className="absolute -top-2 -left-1 text-3xl text-blue-300 dark:text-blue-500 opacity-50">"</div>
        <p className="text-sm text-gray-700 dark:text-gray-200 italic leading-relaxed pl-4 pr-2">
          {quote.quote}
        </p>
        <div className="absolute -bottom-2 -right-1 text-3xl text-blue-300 dark:text-blue-500 opacity-50">"</div>
      </blockquote>
      
      <div className="mt-3 text-right">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          — {quote.author}
        </p>
      </div>
    </motion.div>
  );
}
