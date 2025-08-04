import StarRating from './StarRating';
import { API_BASE_URL } from '../services/api';

const placeholderImg = 'https://placehold.co/600x400/374151/FFFFFF/png?text=Decolei.net';

export default function Card({ pacote }) {
    const temAvaliacoes = pacote.totalAvaliacoes > 0;

    // LÓGICA CORRIGIDA PARA A IMAGEM DO CARD
    const getImagemDoCard = () => {
        if (!pacote.imagens || pacote.imagens.length === 0) {
            return placeholderImg; // Retorna placeholder se não houver mídia
        }

        // Tenta encontrar a primeira mídia que NÃO é um vídeo
        const primeiraImagem = pacote.imagens.find(midia => !midia.isVideo);
        
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl w-full h-full flex flex-col">
            <img
                src={imagemDoCard}
                alt={`Imagem do pacote para ${pacote.destino}`}
                onError={(e) => { e.currentTarget.src = placeholderImg; }}
                className="w-full h-40 object-cover"
            />
            <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{pacote.titulo}</h3>
                    <p className="text-xs text-gray-500">{pacote.destino}</p>
                    <div className="flex items-center mt-1">
                        <StarRating rating={pacote.mediaAvaliacoes} />
                        {temAvaliacoes && (
                            <span className="text-xs text-gray-500 ml-1">
                                ({pacote.totalAvaliacoes})
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-2">
    <p className="text-lg font-extrabold text-gray-900">
        R$ {pacote.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
    <p className="text-xs text-gray-500 -mt-1">por pessoa</p>
</div>
            </div>
        </div>
    );
}