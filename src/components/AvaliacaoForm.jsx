import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import avaliacoesService from '../services/avaliacoesServices';

// Componente para texto que só é lido por leitores de tela.
const VisuallyHidden = ({ children }) => (
  <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0" style={{ clip: 'rect(0, 0, 0, 0)' }}>
    {children}
  </span>
);

export default function AvaliacaoForm({ pacoteId, onAvaliacaoSubmit }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [hoverNota, setHoverNota] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nota === 0) {
      setError('Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await avaliacoesService.criarAvaliacao({
        pacoteViagem_Id: pacoteId,
        usuario_Id: user.id,
        nota: nota,
        comentario: comentario,
      });
      alert('Avaliação enviada com sucesso! Ela ficará pendente até ser aprovada por um administrador.');
      onAvaliacaoSubmit();
    } catch (err) {
      const apiError = err.response?.data?.erro || "Ocorreu um erro ao enviar sua avaliação.";
      setError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <fieldset className="mb-2">
        <legend className="block text-sm font-medium text-gray-700 mb-1">Sua nota:</legend>
        <div role="radiogroup" className="flex items-center">
          {[1, 2, 3, 4, 5].map((starValue) => (
            <React.Fragment key={starValue}>
              <VisuallyHidden>
                <input
                  type="radio"
                  id={`star-${pacoteId}-${starValue}`}
                  name={`rating-${pacoteId}`}
                  value={starValue}
                  checked={nota === starValue}
                  onChange={() => setNota(starValue)}
                />
              </VisuallyHidden>
              <label
                htmlFor={`star-${pacoteId}-${starValue}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoverNota(starValue)}
                onMouseLeave={() => setHoverNota(0)}
              >
                <Star
                  className={`transition-colors ${(hoverNota || nota) >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  aria-hidden="true"
                />
                <VisuallyHidden>{starValue} estrela{starValue > 1 ? 's' : ''}</VisuallyHidden>
              </label>
            </React.Fragment>
          ))}
          <span className="ml-3 text-sm text-gray-600">{nota > 0 ? `${nota} estrela(s)` : 'Selecione sua nota'}</span>
        </div>
      </fieldset>

      <label htmlFor={`comentario-${pacoteId}`} className="block text-sm font-medium text-gray-700 mb-1">Seu comentário:</label>
      <textarea
        id={`comentario-${pacoteId}`}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Conte como foi sua experiência..."
        className="w-full p-2 border rounded-md"
        rows="3"
        required
        aria-describedby={`comentario-desc-${pacoteId}`}
      />
      <p id={`comentario-desc-${pacoteId}`} className="text-xs text-gray-500 mt-1">Seu comentário é muito importante para nós.</p>

      {error && <p className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
        {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
      </button>
    </form>
  );
};
