import React, { useState } from 'react';

function Suporte() {
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagemEnviada, setMensagemEnviada] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensagemEnviada(true);
    setAssunto('');
    setDescricao('');
    setTimeout(() => setMensagemEnviada(false), 5000);
  };

  return (
    <div className="flex items-start justify-center min-h-[80vh] bg-gray-100 pt-10">
      <div className="w-full max-w-3xl border border-gray-300 bg-white shadow-lg rounded-lg p-10">
        <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-3 tracking-wide">
          Fale com o Suporte
        </h2>
        <p className="text-center text-gray-500 mb-6 text-base">
          Precisa de ajuda? Preencha o formulário abaixo e nossa equipe responderá em breve.
        </p>

        {mensagemEnviada && (
          <div className="mb-6 text-green-700 bg-green-100 border border-green-300 p-4 rounded text-center font-medium">
            Sua dúvida foi enviada com sucesso! Em breve nossa equipe entrará em contato.
          </div>
        )}

        {/* Formulário sem borda extra */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-base font-medium mb-1">Assunto da Dúvida</label>
            <input
              type="text"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Problema no pagamento"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-base font-medium mb-1">Descrição</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full h-36 px-4 py-2 text-base border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descreva sua dúvida com o máximo de detalhes..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-lg py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Suporte;
