import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import aiService from '../services/aiService';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Olá! Sou o assistente virtual da Decolei.net. Como posso te ajudar hoje?",
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsTyping(true);

        try {
            // Integração com API real de IA
            const response = await aiService.sendMessage(currentInput, messages);
            
            const botResponse = {
                id: Date.now() + 1,
                text: response,
                isBot: true,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Erro ao obter resposta da IA:', error);
            
            // Fallback para resposta local em caso de erro
            const botResponse = {
                id: Date.now() + 1,
                text: "Desculpe, estou com dificuldades técnicas no momento. Você pode tentar novamente ou entrar em contato com nosso suporte humano. Como posso ajudá-lo de outra forma?",
                isBot: true,
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, botResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const getBotResponse = (message) => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
            return "Os preços dos nossos pacotes variam de acordo com o destino e época do ano. Você pode usar os filtros na página inicial para encontrar pacotes dentro do seu orçamento. Posso te ajudar a encontrar algo específico?";
        } else if (lowerMessage.includes('reserva') || lowerMessage.includes('reservar')) {
            return "Para fazer uma reserva, você precisa estar logado na plataforma. Escolha o pacote desejado, clique em 'Reservar' e siga os passos do processo de pagamento. Precisa de ajuda com alguma etapa específica?";
        } else if (lowerMessage.includes('destino') || lowerMessage.includes('viagem') || lowerMessage.includes('lugar')) {
            return "Temos pacotes para diversos destinos incríveis! Você pode usar a barra de pesquisa para encontrar um destino específico ou navegar pelos nossos pacotes em destaque. Tem algum lugar em mente?";
        } else if (lowerMessage.includes('cancelar') || lowerMessage.includes('cancelamento')) {
            return "Para cancelamentos, você pode acessar 'Minha Conta' e gerenciar suas reservas, ou entrar em contato com nosso suporte através da página de Suporte. Posso te ajudar a navegar até lá?";
        } else if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar')) {
            return "Aceitamos diversas formas de pagamento, incluindo cartão de crédito, débito e PIX. O processo de pagamento é seguro e você receberá a confirmação por email. Tem alguma dúvida específica sobre pagamento?";
        } else if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola')) {
            return "Olá! Bem-vindo à Decolei.net! 🌎 Estou aqui para te ajudar a encontrar a viagem dos seus sonhos. O que você gostaria de saber?";
        } else {
            return "Entendi! Posso te ajudar com informações sobre nossos pacotes, reservas, preços, destinos e muito mais. Se preferir, você também pode navegar pelo site ou entrar em contato com nosso suporte humano. O que você gostaria de saber?";
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Botão Flutuante */}
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        flex items-center justify-center w-14 h-14 rounded-full shadow-lg
                        transition-all duration-300 transform hover:scale-110
                        ${isOpen 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }
                        text-white
                    `}
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </button>
            </div>

            {/* Caixa de Diálogo */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col border">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center">
                        <Bot size={20} className="mr-2" />
                        <div>
                            <h3 className="font-semibold">Assistente IA</h3>
                            <p className="text-xs text-blue-100">Decolei.net</p>
                        </div>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`
                                        max-w-xs p-3 rounded-lg text-sm
                                        ${message.isBot
                                            ? 'bg-gray-100 text-gray-800'
                                            : 'bg-blue-600 text-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-start">
                                        {message.isBot && (
                                            <Bot size={16} className="mr-2 mt-0.5 text-blue-600" />
                                        )}
                                        <div className="flex-1">
                                            <p>{message.text}</p>
                                            <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-blue-100'}`}>
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Indicador de digitação */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 max-w-xs p-3 rounded-lg text-sm">
                                    <div className="flex items-center">
                                        <Bot size={16} className="mr-2 text-blue-600" />
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input de Mensagem */}
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Digite sua mensagem..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim()}
                                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
