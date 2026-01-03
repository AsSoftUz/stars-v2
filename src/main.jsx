import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/home/home'
import Stars from './pages/stars/stars'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stars" element={<Stars />} />
        {/* <Route path="/premium" element={<Premium />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/topupbegin" element={<TopUpBegin />} />
        <Route path="/topup" element={<TopUp />} />
        <Route path="/tranzaction" element={<Tranzaction />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
