import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import JournalCalendar from '../pages/Journal/Calendar';
import NewJournalEntry from '../pages/Journal/NewEntry';
import JournalDetail from '../pages/Journal/Detail';
import JournalEdit from '../pages/Journal/Edit';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/journal"
        element={
          <ProtectedRoute>
            <JournalCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/new"
        element={
          <ProtectedRoute>
            <NewJournalEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/detail/:date"
        element={
          <ProtectedRoute>
            <JournalDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journal/edit/:date"
        element={
          <ProtectedRoute>
            <JournalEdit />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
