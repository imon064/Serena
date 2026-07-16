import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { JournalProvider } from './context/JournalContext';

export const App: React.FC = () => {
  return (
    <JournalProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </JournalProvider>
  );
};

export default App;
