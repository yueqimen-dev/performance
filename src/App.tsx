import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Performance from './pages/Performance';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/content-strategy" element={<Placeholder />} />
          <Route path="/reddit-management" element={<Placeholder />} />
          <Route path="/product-listing" element={<Placeholder />} />
          <Route path="/tech-assessment" element={<Placeholder />} />
          <Route path="/website-seo" element={<Placeholder />} />
          <Route path="/explore" element={<Placeholder />} />
          <Route path="*" element={<Placeholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
