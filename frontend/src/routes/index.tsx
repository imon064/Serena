import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/Login';
import RegisterPage from '../pages/Register';
import JournalCalendar from '../pages/Journal/Calendar';
import NewJournalEntry from '../pages/Journal/NewEntry';
import JournalDetail from '../pages/Journal/Detail';
import JournalEdit from '../pages/Journal/Edit';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/journal" element={<JournalCalendar />} />
      <Route path="/journal/new" element={<NewJournalEntry />} />
      <Route path="/journal/detail/:date" element={<JournalDetail />} />
      <Route path="/journal/edit/:date" element={<JournalEdit />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
