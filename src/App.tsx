import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserSetup } from './components/UserSetup';
import { ChatRoom } from './components/ChatRoom';
import { User } from './types/chat';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleUserSetup = (name: string) => {
    setUser({
      name,
      avatar: name[0].toUpperCase()
    });
  };

  return (
    <ThemeProvider>
      <div className="App">
        {!user ? (
          <UserSetup onUserSetup={handleUserSetup} />
        ) : (
          <ChatRoom user={user} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;