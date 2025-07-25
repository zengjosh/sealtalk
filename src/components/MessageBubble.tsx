import React from 'react';
import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-start mb-4 animate-fadeIn">
      <div className="flex max-w-[95vw] flex-row items-start space-x-3">
        <div className={`w-10 h-10 rounded-full mt-2 ${isOwn ? 'bg-gradient-to-br from-green-400 to-blue-500' : 'bg-gradient-to-br from-blue-400 to-purple-500'} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
          {message.avatar}
        </div>

        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {message.sender}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatTime(message.timestamp)}
            </span>
          </div>

          <div
            className={`px-4 py-2 rounded-2xl ${isOwn
              ? 'bg-blue-500 text-white rounded-bl-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
              } shadow-sm break-words`}
          >
            <p className={`text-sm leading-relaxed break-words break-all whitespace-pre-wrap ${isOwn ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}