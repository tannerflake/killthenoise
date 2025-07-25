import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Integrations from './pages/Integrations';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/integrations" element={<Integrations />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 