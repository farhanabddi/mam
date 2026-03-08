import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Notice the "../" which tells it to go up one folder to find AppRoutes
import AppRoutes from '../routes/AppRoutes';

// Notice the "../" here too, to go up and then into the contexts folder
import { AuthProvider } from '../contexts/AuthContext'; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;