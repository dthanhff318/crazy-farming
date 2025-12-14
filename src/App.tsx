import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './lib/supabase';
import { queryClient } from './lib/queryClient';
import { Login } from './pages/Login';
import { Game } from './pages/Game';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <p className="text-xl font-semibold text-farm-brown-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/"
            element={user ? <Game user={user} /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
