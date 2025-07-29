import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import React, { useState } from 'react';
import Card from './components/Card.jsx';
import Suporte from './Pages/Suporte/Suporte.jsx';

function App() {
  const packageData = {
    imageUrl: 'https://placehold.co/250x150/png',
    title: 'Pacote de Viagem para a Praia',
    rating: 5.0,
    startDate: '20/12/2024',
    endDate: '30/12/2024',
    price: 2500.00,
    packageUrl: '/pacotes/praia'
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota principal com o Card */}
        <Route
          path="/"
          element={
            <div className="flex justify-center p-10 bg-gray-100 min-h-screen">
              <Card data={packageData} />
            </div>
          }
        />

        {/* Rota para a tela de suporte */}
        <Route path="/suporte" element={<Suporte />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

