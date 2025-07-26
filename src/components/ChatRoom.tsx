import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Header } from './Header';
import { User } from '../types/chat';
import { useMessages } from '../contexts/MessagesContext';

interface ChatRoomProps {
  user: User;
  onUserChange: (name: string) => void;
}

export function ChatRoom({ user, onUserChange }: ChatRoomProps) {
  const { messages, sendMessage, loading } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header currentUser={user} onUserChange={onUserChange} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Loading messages...</div>
          </div>
        ) : (
          messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const nextMessage = messages[index + 1];

            const isSameSenderAsPrevious = previousMessage?.sender_id === message.sender_id;
            const isSameSenderAsNext = nextMessage?.sender_id === message.sender_id;

            let groupPosition: 'single' | 'start' | 'middle' | 'end' = 'single';
            if (isSameSenderAsPrevious && isSameSenderAsNext) {
              groupPosition = 'middle';
            } else if (isSameSenderAsPrevious) {
              groupPosition = 'end';
            } else if (isSameSenderAsNext) {
              groupPosition = 'start';
            }

            const isGrouped = groupPosition === 'middle' || groupPosition === 'end';

            // Convert Supabase message format to component format
            const formattedMessage = {
              id: message.id,
              content: message.content,
              sender: message.sender_name,
              timestamp: new Date(message.created_at),
              avatar: message.sender_avatar
            };
            
            return (
              <MessageBubble
                key={message.id}
                message={formattedMessage}
                isOwn={message.sender_id === user.id}
                isGrouped={isGrouped}
                groupPosition={groupPosition}
              />
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}