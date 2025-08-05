import React from 'react';

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full h-full flex flex-col border border-gray-100 animate-pulse">
      <div className="relative overflow-hidden">
        {/* Skeleton da imagem */}
        <div className="w-full h-48 bg-gray-200"></div>

        {/* Skeleton do badge de preço */}
        <div className="absolute top-4 left-4 bg-gray-300 rounded-full w-20 h-6"></div>

        {/* Skeleton do badge de avaliação */}
        <div className="absolute top-4 right-4 bg-gray-300 rounded-full w-12 h-5"></div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Skeleton do título */}
          <div className="bg-gray-200 rounded h-6 mb-2"></div>
          <div className="bg-gray-200 rounded h-6 w-2/3 mb-3"></div>

          {/* Skeleton da localização */}
          <div className="bg-gray-200 rounded h-4 w-1/2 mb-3"></div>

          {/* Skeleton das estrelas */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="bg-gray-200 rounded-full w-16 h-5"></div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Skeleton do preço */}
              <div className="bg-gray-200 rounded h-3 w-16 mb-1"></div>
              <div className="bg-gray-200 rounded h-8 w-20 mb-1"></div>
              <div className="bg-gray-200 rounded h-3 w-14"></div>
            </div>
            {/* Skeleton do botão */}
            <div className="bg-gray-300 rounded-xl w-20 h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
