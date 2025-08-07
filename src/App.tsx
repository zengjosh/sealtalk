import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MessagesProvider } from './contexts/MessagesContext';
import { AuthForm } from './components/AuthForm';
import { ChatRoom } from './components/ChatRoom';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { LandingPage } from './components/LandingPage';
import { User } from './types/chat';

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );
}

// Protected route component for authenticated users
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !authUser) {
      // Redirect to signin if not authenticated
      navigate('/signin', { replace: true });
    }
  }, [authUser, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!authUser) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}

// Sign-in page component
function SignInPage() {
  const { user: authUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && authUser) {
      // Redirect to chat if already authenticated
      navigate('/chat', { replace: true });
    }
  }, [authUser, loading, navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (authUser) {
    return null; // Will redirect in useEffect
  }

  return <AuthForm />;
}

// Chat page component
function ChatPage() {
  const { user: authUser, updateDisplayName } = useAuth();
  const [chatUser, setChatUser] = useState<User | null>(null);

  // Convert Supabase user to chat user format
  useEffect(() => {
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
      }
    }
  };

  if (!chatUser) {
    return <LoadingSpinner />;
  }

  return (
    <MessagesProvider>
      <ChatRoom user={chatUser} onUserChange={handleUserChange} />
    </MessagesProvider>
  );
}

// Privacy policy page component
function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const handleBack = () => {
    // Navigate back to appropriate page based on auth status
    navigate(authUser ? '/chat' : '/signin');
  };

  return <PrivacyPolicy onBack={handleBack} />;
}

// Main app content with routing
function AppContent() {
  return (
    <Routes>
      {/* Landing page at root */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Public routes */}
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      
      {/* Protected routes */}
      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
      
      {/* Catch all - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <AppContent />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;