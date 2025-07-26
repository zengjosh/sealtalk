import { Message } from '../types/chat';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGrouped: boolean;
  groupPosition: 'single' | 'start' | 'middle' | 'end';
}

export function MessageBubble({ message, isOwn, isGrouped, groupPosition }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getBubbleStyles = (position: typeof groupPosition) => {
    // All bubbles are now evenly rounded. We only adjust the margin for grouped messages.
    switch (position) {
      case 'middle':
      case 'end':
        return 'mt-px'; // Use a 1px margin for a very small gap.
      default:
        return ''; // No extra margin for single or start messages.
    }
  };

  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="flex max-w-[95vw] flex-row items-start space-x-3">
        {/* Avatar: Render only if not grouped */}
        <div className={`w-10 h-10 flex-shrink-0 ${isGrouped ? 'invisible' : ''}`}>
          {!isGrouped && (
            <img src={message.avatar} alt="avatar" className="w-10 h-10 rounded-full mt-2" />
          )}
        </div>

        <div className="flex flex-col items-start">
          {/* Sender & Time: Render only if not grouped */}
          {!isGrouped && (
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {message.sender}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}

          <div
            className={`px-4 py-2 rounded-2xl shadow-sm break-words ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'} ${getBubbleStyles(groupPosition)}`}
          >
            <p className={`text-sm leading-relaxed break-words break-all whitespace-pre-wrap ${isOwn ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}