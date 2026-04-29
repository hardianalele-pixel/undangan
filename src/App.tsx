import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Billing } from './pages/Billing';
import { Dashboard } from './pages/Dashboard';
import { CreateInvite } from './pages/CreateInvite';
import { InviteView } from './pages/InviteView';
import { Settings } from './pages/Settings';
import { Comments } from './pages/Comments';
import { GuestManager } from './pages/GuestManager';
import { CheckIn } from './pages/CheckIn';
import { KioskGuestBook } from './pages/KioskGuestBook';
import { BroadcastScreen } from './pages/BroadcastScreen';
import { getAuthState } from './utils/api';
import { ThemeProvider } from './contexts/ThemeContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = getAuthState();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Admin (Auth Required) */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreateInvite /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><CreateInvite /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/comments/:slug" element={<PrivateRoute><Comments /></PrivateRoute>} />
          <Route path="/guests/:slug" element={<PrivateRoute><GuestManager /></PrivateRoute>} />

          {/* Public - Usher Check-in */}
          <Route path="/checkin/:slug" element={<CheckIn />} />

          {/* Public - Kiosk Guest Book */}
          <Route path="/kiosk/:slug" element={<KioskGuestBook />} />

          {/* Public - Broadcast Screen */}
          <Route path="/broadcast/:slug" element={<BroadcastScreen />} />

          {/* Public - Invitation View */}
          <Route path="/:slug" element={<InviteView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
