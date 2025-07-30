import StarRating from './StarRating';

const placeholderImg = 'https://placehold.co/600x400/374151/FFFFFF/png?text=Decolei.net';

export default function Card({ pacote }) {
    const temAvaliacoes = pacote.totalAvaliacoes > 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl w-full h-full flex flex-col">
            <img
                src={pacote.imagemURL || placeholderImg}
                alt={`Imagem do pacote para ${pacote.destino}`}
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
