import StarRating from './StarRating';
import { API_BASE_URL } from '../services/api';
import { MapPin } from 'lucide-react';

const placeholderImg = 'https://placehold.co/600x400/374151/FFFFFF/png?text=Decolei.net';

export default function Card({ pacote }) {
  const temAvaliacoes = pacote.totalAvaliacoes > 0;

  // LÓGICA CORRIGIDA PARA A IMAGEM DO CARD
  const getImagemDoCard = () => {
    if (!pacote.imagens || pacote.imagens.length === 0) {
      return placeholderImg; // Retorna placeholder se não houver mídia
    }

    // Tenta encontrar a primeira mídia que NÃO é um vídeo
    const primeiraImagem = pacote.imagens.find((midia) => !midia.isVideo);

    if (primeiraImagem) {
      return `${API_BASE_URL}/${primeiraImagem.url}`;
    }

    // Se só houver vídeos, pega a thumbnail do primeiro vídeo
    const primeiroVideo = pacote.imagens[0];
    const urlParts = primeiroVideo.url.split('/embed/');
    const videoId = urlParts.length > 1 ? urlParts[1].split('?')[0] : null;
    return videoId ? `https://www.youtube.com/embed/2{videoId}/0.jpg` : placeholderImg;
  };

  const imagemDoCard = getImagemDoCard();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl w-full h-full flex flex-col border border-gray-100 group hover:-translate-y-1 min-h-[420px]">
      <div className="relative overflow-hidden">
        <img
          src={imagemDoCard}
          alt={`Imagem do pacote para ${pacote.destino}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = placeholderImg;
          }}
          className="w-full h-48 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Badge de preço */}
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg transform transition-transform duration-300 group-hover:scale-105">
          R${' '}
          {pacote.valor?.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        {temAvaliacoes && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg transform transition-transform duration-300 group-hover:scale-105">
            ⭐ {pacote.mediaAvaliacoes}
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between min-h-[200px]">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 min-h-[56px]">
            {pacote.titulo}
          </h3>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <MapPin size={14} className="text-gray-400" />
            {pacote.destino}
          </p>
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={pacote.mediaAvaliacoes} />
            {temAvaliacoes && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {pacote.totalAvaliacoes} {pacote.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                A partir de
              </p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                R${' '}
                {pacote.valor?.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-400 -mt-1">por pessoa</p>
            </div>
            <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Ver mais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
