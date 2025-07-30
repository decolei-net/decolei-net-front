    // src/Pages/Reserva/SuaTelaDeReserva.jsx
    import React from 'react';
    import { useParams } from 'react-router-dom';

    const SuaTelaDeReserva = () => {
      const { id } = useParams(); // Para pegar o ID do pacote da URL

      return (
        <div className="flex items-center justify-center min-h-screen bg-blue-100 text-blue-800 p-4 rounded-md">
          <p className="text-xl font-semibold">Tela de Reserva do Pacote ID: {id} (Em Implementação)</p>
        </div>
      );
    };

    export default SuaTelaDeReserva;
    