import React from 'react';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';

export default function App() {
  return (
    <MainLayout>
      <DashboardPage />
    </MainLayout>
  );
}
