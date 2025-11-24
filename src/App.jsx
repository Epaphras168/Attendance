// App.jsx
import React from 'react';
import AuthProvider from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { AppRouter } from './AppRouter';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="w-full min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </DataProvider>
    </AuthProvider>
  );
};

export default App; // <-- default export
