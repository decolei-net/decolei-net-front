import React from 'react';
// Importando os ícones
import { FaStar, FaCalendarAlt } from 'react-icons/fa';

export default function Card({ data }) {
  // Dados de exemplo para visualização, caso a prop 'data' não seja passada
  const {
    imageUrl = 'https://placehold.co/250x150/png',
    title = 'Título do Pacote de Viagem com um Nome Bem Longo para Testar a Quebra de Linha',
    rating = 4.9,
    startDate = '01/08/2024',
    endDate = '10/08/2024',
    price = 1500.00,
    packageUrl = '#' // URL de destino do pacote
  } = data || {};

  return (
    <a className="flex w-full max-w-[250px] max-h-[500px] rounded-2xl border !text-[#000] !border-[#000]" href='{packageUrl}'>
      <div className="flex flex-col items-left space-y-10 p-4">
        <img href={packageUrl} className="w-full object-cover rounded-t-lg" src={imageUrl} alt={`Imagem do pacote ${title}`} />

        <h6 className="">{title}</h6>

        <div className="flex items-center text-[#fee600]">
          <strong className='text-[#000]'>{rating}</strong>
          <FaStar />
        </div>

        <div className="flex flex-row items-center">
          <FaCalendarAlt />
          <p>{startDate} - {endDate}</p>
        </div>

        <h3 className='text-[#2E6190]'>
          R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </a>
  );
}
