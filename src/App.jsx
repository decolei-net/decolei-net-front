import { useState } from 'react'
import './index.css'
import Card from './components/Card.jsx'

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
    <>
      <div className="">
        <Card data={packageData} />
      </div>
    </>
  )
}

export default App
