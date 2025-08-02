import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MessagesProvider } from './contexts/MessagesContext';
import { AuthForm } from './components/AuthForm';
import { ChatRoom } from './components/ChatRoom';
import { User } from './types/chat';

function AppContent() {
  const { user: authUser, loading, updateDisplayName } = useAuth();
  const [chatUser, setChatUser] = useState<User | null>(null);

  // Convert Supabase user to chat user format
  React.useEffect(() => {
    if (authUser) {
      const displayName = authUser.user_metadata?.display_name || 
                         authUser.email?.split('@')[0] || 
                         'Anonymous User';
      
      setChatUser({
        id: authUser.id,
        name: displayName,
        avatar: authUser.user_metadata.avatar_url || displayName[0].toUpperCase(),
        is_anonymous: authUser.is_anonymous || authUser.user_metadata?.is_anonymous
      });
    } else {
      setChatUser(null);
    }
  }, [authUser]);

  const handleUserChange = async (name: string) => {
    if (chatUser && !chatUser.is_anonymous) {
      try {
        await updateDisplayName(name);
        setChatUser({
          ...chatUser,
          name,
        });
      } catch (error) {
        console.error('Failed to update display name:', error);
        // Optionally show an error message to the user
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!authUser || !chatUser) {
    return <AuthForm />;
  }

  return (
    <MessagesProvider>
      <ChatRoom user={chatUser} onUserChange={handleUserChange} />
    </MessagesProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <AppContent />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;