import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home/home'
import Stars from './pages/stars/stars'
import Premium from './pages/premium/premium'
import Settings from './pages/settings/settings'
import Referal from './pages/referal/referal'
import Topup from './pages/topUp/topup'
import './index.css'

// Asosiy App komponentini yaratamiz
const App = () => {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const updateTheme = () => {
        // 'dark' yoki 'light' ni olib, html tegiga yozadi
        document.documentElement.setAttribute('data-theme', tg.colorScheme);
      };

      updateTheme();
      tg.onEvent('themeChanged', updateTheme);
      return () => tg.offEvent('themeChanged', updateTheme);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/stars" element={<Stars />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/referal" element={<Referal />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/topup" element={<Topup />} />
    </Routes>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)