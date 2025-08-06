import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useSelector } from 'react-redux';
import { MessageCircle, Send, HelpCircle, Clock, CheckCircle } from 'lucide-react';

function Suporte() {
  const [assunto, setAssunto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Obtenha o usuário e seu papel (role) do estado do Redux
  const { user, role } = useSelector((state) => state.auth);

  // Proteção de acesso: só "CLIENTE" pode continuar
  useEffect(() => {
    // Verifique a "role" e se o papel não for 'CLIENTE', redirecione
    if (role !== 'CLIENTE') {
      navigate('/login'); // Redireciona para o login
    }
  }, [role, navigate]);

  // Função para enviar o e-mail usando EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use os dados do usuário que já estão no estado do Redux
      const nomeDoCliente = user?.nomeCompleto;
      const emailDoCliente = user?.email;

      await emailjs.send(
        'service_y4i40bq',
        'template_n81dn6m',
        {
          title: assunto,
          message: descricao,
          name: nomeDoCliente,
          email: emailDoCliente,
        },
        'xSZEIlBs4odQmajYw',
      );

      console.log('Email enviado com sucesso!');
      setMensagemEnviada(true);
      setAssunto('');
      setDescricao('');
      setTimeout(() => setMensagemEnviada(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      alert('Erro ao enviar e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ">
      {/* Hero Section */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Fale com o
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {' '}
                Suporte
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Nossa equipe está pronta para ajudar você! Envie sua dúvida e responderemos em breve.
            </p>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-6 py-12">
        {/* Mensagem de Sucesso */}
        {mensagemEnviada && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Mensagem enviada com sucesso!
                </h3>
                <p className="text-green-700">
                  Sua dúvida foi enviada com sucesso! Em breve nossa equipe entrará em contato.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Cards informativos */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Clock size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resposta Rápida</h3>
            <p className="text-gray-600 text-sm">Respondemos suas dúvidas em até 24 horas</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <MessageCircle size={24} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Suporte Especializado</h3>
            <p className="text-gray-600 text-sm">Equipe treinada para resolver suas questões</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
              <HelpCircle size={24} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ajuda Completa</h3>
            <p className="text-gray-600 text-sm">Assistência para reservas, pagamentos e mais</p>
          </div>
        </div>

        {/* Formulário de Contato */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Como podemos ajudar?</h2>
            <p className="text-gray-600 text-lg">
              Descreva sua dúvida ou problema e nossa equipe entrará em contato
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="assunto" className="block text-sm font-semibold text-gray-700 mb-2">
                Assunto
              </label>
              <input
                id="assunto"
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full h-12 px-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Ex: Problema no pagamento, Dúvida sobre reserva..."
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full min-h-36 px-4 py-3 text-base border border-gray-300 rounded-xl resize-y focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                placeholder="Descreva sua dúvida com o máximo de detalhes possível. Quanto mais informações você fornecer, melhor poderemos ajudá-lo..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Enviar Mensagem
                </>
              )}
            </button>
          </form>

          {/* Informações de contato alternativas */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Outras formas de contato
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-1">Emergências 24h</h4>
                <p className="text-gray-600 text-sm">Para situações urgentes durante viagens</p>
                <p className="font-mono text-blue-600 mt-2">0800 123 4567</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-1">Atendimento Comercial</h4>
                <p className="text-gray-600 text-sm">Segunda a sexta, 8h às 18h</p>
                <p className="font-mono text-blue-600 mt-2">(11) 3456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Suporte;
