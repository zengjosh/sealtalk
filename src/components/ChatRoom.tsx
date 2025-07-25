import React, { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Header } from './Header';
import { Message, User } from '../types/chat';

interface ChatRoomProps {
  user: User;
}

const SAMPLE_MESSAGES: Omit<Message, 'id'>[] = [
  {
    content: "Hey everyone! Welcome to our chat room 👋",
    sender: "Alice",
    timestamp: new Date(Date.now() - 3600000),
    avatar: "A"
  },
  {
    content: "This looks amazing! Love the dark mode 🌙",
    sender: "Bob",
    timestamp: new Date(Date.now() - 3300000),
    avatar: "B"
  },
  {
    content: "The design is so clean and modern. Great work!",
    sender: "Charlie",
    timestamp: new Date(Date.now() - 3000000),
    avatar: "C"
  }
];

export function ChatRoom({ user }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(
    SAMPLE_MESSAGES.map((msg, index) => ({
      ...msg,
      id: `sample-${index}`
    }))
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate other users sending messages occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        const responses = [
          "That's interesting!",
          "I agree with that 👍",
          "Has anyone tried the new features?",
          "This chat is working perfectly!",
          "Great to see everyone here!",
          "The responsiveness is impressive 📱",
          "Love the smooth animations ✨"
        ];
        
        const users = ["David", "Emma", "Frank", "Grace"];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const newMessage: Message = {
          id: `auto-${Date.now()}`,
          content: randomResponse,
          sender: randomUser,
          timestamp: new Date(),
          avatar: randomUser[0]
        };
        
        setMessages(prev => [...prev, newMessage]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: user.name,
      timestamp: new Date(),
      avatar: user.avatar
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender === user.name}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}