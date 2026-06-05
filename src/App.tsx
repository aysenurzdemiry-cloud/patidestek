/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="patidestek-theme">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

