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
      // WebApp ni kengaytiramiz (to'liq ekranda ochilishi uchun)
      tg.expand();
      
      const root = document.documentElement;

      const updateColors = () => {
        const theme = tg.themeParams;
        root.style.setProperty('--tg-bg-color', theme.bg_color || '#232E3C');
        root.style.setProperty('--tg-text-color', theme.text_color || '#FFFFFF');
        root.style.setProperty('--tg-hint-color', theme.hint_color || '#999999');
        root.style.setProperty('--tg-link-color', theme.link_color || '#248bda');
        root.style.setProperty('--tg-button-color', theme.button_color || '#248bda');
        root.style.setProperty('--tg-button-text-color', theme.button_text_color || '#ffffff');
        root.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color || '#248bda');
        
        // Header va App fonini ham Telegram rangiga moslaymiz
        tg.setHeaderColor(theme.bg_color || 'bg_color');
        tg.setBackgroundColor(theme.bg_color || 'bg_color');
      };

      // Birinchi marta ishga tushiramiz
      updateColors();

      // Mavzu o'zgarganda (Dark/Light) avtomat yangilanishi uchun
      tg.onEvent('themeChanged', updateColors);
      
      return () => tg.offEvent('themeChanged', updateColors);
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