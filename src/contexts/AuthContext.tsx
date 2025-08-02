import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const defaultAvatars = [
  '/avatars/seal1.png',
  '/avatars/seal2.png',
  '/avatars/seal3.png',
  '/avatars/seal4.png',
  '/avatars/seal5.png',
  '/avatars/seal6.png',
];

const getRandomAvatar = () => defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error?: any }>;
  signInAnonymously: (turnstileToken: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user && !session.user.user_metadata.avatar_url) {
          // Backfill avatar for existing users or set for new ones
          const { data, error } = await supabase.auth.updateUser({
            data: { avatar_url: getRandomAvatar() }
          });
          if (error) console.error('Error updating user avatar:', error);
          // Update local state with the new user data
          if (data.user) {
            setSession({ ...session, user: data.user });
            setUser(data.user);
          } else {
            setSession(session);
            setUser(session?.user ?? null);
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }

        setLoading(false);
        
        // Set up inactivity timer for anonymous users
        if (session?.user?.is_anonymous) {
          startInactivityTimer();
        } else {
          clearInactivityTimer();
        }
      }
    );

    // Sign out anonymous users when page unloads (prevents session persistence)
    const handleBeforeUnload = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.is_anonymous) {
        // Sign out anonymous user (cheaper than deletion)
        await supabase.auth.signOut();
      }
    };

    // Add event listeners for page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      clearInactivityTimer();
    };
  }, []);

  // Inactivity timer functions for anonymous users
  const startInactivityTimer = () => {
    clearInactivityTimer(); // Clear any existing timer
    
    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.is_anonymous) {
        console.log('Anonymous user inactive for 30 minutes, signing out...');
        await supabase.auth.signOut();
      }
    }, 30 * 60 * 1000); // 30 minutes
    
    setInactivityTimer(timer);
  };

  const clearInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }
  };

  const resetInactivityTimer = () => {
    if (user?.is_anonymous) {
      startInactivityTimer();
    }
  };

  // Reset timer on user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const resetTimer = () => {
      if (user?.is_anonymous) {
        startInactivityTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [user]);

  const signInWithGoogle = async () => {
    // Use production URL in production, localhost in development
    const redirectUrl = import.meta.env.PROD 
      ? 'https://sealtalk.app/' // Replace with your actual production domain
      : window.location.origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          avatar_url: getRandomAvatar(),
        }
      }
    });
    return { error };
  };

  const signInAnonymously = async (turnstileToken: string) => {
    try {
      setLoading(true);
      
      // Create a random email and password for anonymous user
      const randomId = Math.random().toString(36).substring(2, 15);
      const email = `anon-${randomId}@sealtalk.app`;
      const password = Math.random().toString(36) + Math.random().toString(36);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          captchaToken: turnstileToken, // Pass the token here for Supabase's built-in verification
          data: {
            display_name: 'Anonymous Seal',
            avatar_url: getRandomAvatar(),
            is_anonymous: true
          }
        }
      });

      if (error) throw error;
      
      // Sign in with the created account
      if (data.user) {
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Error in anonymous sign in:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateDisplayName = async (displayName: string) => {
    // Prevent anonymous users from updating their display name
    if (user?.is_anonymous) {
      throw new Error('Anonymous users cannot change their display name');
    }
    
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName }
    });
    if (error) throw error;
  };

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAnonymously,
    signOut,
    updateDisplayName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
