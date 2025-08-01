import StarRating from './StarRating';
// Adicione o import da sua URL base da API
import { API_BASE_URL } from '../services/api'; // <-- AJUSTE O CAMINHO SE NECESSÁRIO

const placeholderImg = 'https://placehold.co/600x400/374151/FFFFFF/png?text=Decolei.net';

export default function Card({ pacote }) {
    const temAvaliacoes = pacote.totalAvaliacoes > 0;

    // Lógica para pegar a primeira imagem da lista ou usar o placeholder
    const imagemDoCard = 
        pacote.imagens && pacote.imagens.length > 0
            ? `${API_BASE_URL}/${pacote.imagens[0]}` // Pega a primeira imagem da lista
            : placeholderImg; // Usa o placeholder se não houver imagens

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl w-full h-full flex flex-col">
            <img
                // A fonte da imagem agora é a nossa variável 'imagemDoCard'
                src={imagemDoCard}
                alt={`Imagem do pacote para ${pacote.destino}`}
                // O 'onError' continua sendo uma boa prática
                onError={(e) => { e.currentTarget.src = placeholderImg; }}
                className="w-full h-40 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-md font-bold text-gray-800 truncate">{pacote.titulo}</h3>
                    <div className="flex items-center mt-2">
                        <StarRating rating={pacote.mediaAvaliacoes} />
                        {temAvaliacoes && (
                            <span className="text-xs text-gray-500 ml-2">
                                ({pacote.totalAvaliacoes})
                            </span>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <p className="text-xl font-extrabold text-gray-900">
                        R$ {pacote.valor?.toFixed(2).replace('.', ',')}
                    </p>
                    <p className="text-xs text-gray-500 -mt-1">por pessoa</p>
                </div>
            </div>
        </div>
    );
}