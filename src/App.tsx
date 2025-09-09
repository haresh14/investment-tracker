import type { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: FC = () => {
  // For now, we'll show the dashboard directly
  // Later we'll implement proper authentication
  const isAuthenticated = true; // Placeholder

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-base-100">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated ? <Dashboard /> : <Login />} 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;