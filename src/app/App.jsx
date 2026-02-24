import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';

/**
 * Root Application Component
 * Responsible for initializing global providers (Routing, Auth, etc.)
 * Strictly no UI layout or business logic should reside here.
 */
const App = () => {
  return (
    <BrowserRouter>
      {/* TODO: AuthProvider will be injected here later to manage 
        the admin session required by Supabase RLS policies.
      */}
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;