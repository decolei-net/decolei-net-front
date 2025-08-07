import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  RotateCcw,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import aiService from '../services/aiService';

export default function ChatBot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou o Célio, assistente virtual da Decolei.net! 👋 Como posso te ajudar hoje?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Páginas onde o ChatBot não deve aparecer
  const hiddenPages = ['/login', '/cadastro', '/reset-password'];

  // Se estiver em uma página onde deve ser ocultado, não renderiza o componente
  if (hiddenPages.includes(location.pathname)) {
    return null;
  }

  // Auto-scroll para última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus no input quando abrir
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  // Contagem de mensagens não lidas
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.isBot) {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Resetar contador quando abrir
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Sugestões rápidas
  const quickSuggestions = [
    'Como fazer uma reserva?',
    'Quais formas de pagamento?',
    'Ver pacotes disponíveis',
    'Como avaliar um pacote?',
    'Falar com suporte',
  ];

  const handleSendMessage = async (messageText = null) => {
    const message = messageText || inputMessage;
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      // Integração com API real de IA com contexto da página
      const response = await aiService.sendMessage(message, messages, location.pathname);

      const botResponse = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Erro ao obter resposta da IA:', error);

      // Fallback para resposta local em caso de erro
      const botResponse = {
        id: Date.now() + 1,
        text: '🤖 Ops! Estou com dificuldades técnicas momentâneas. Você pode tentar novamente ou entrar em contato com nosso suporte em decoleinet@gmail.com. Como posso ajudá-lo de outra forma?',
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Olá! Sou o Célio, assistente virtual da Decolei.net! 👋 Como posso te ajudar hoje?',
        isBot: true,
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Animações
  const chatButtonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const chatWindowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      originX: 1,
      originY: 1,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  };

  return (
    <>
      {/* Botão Flutuante */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 300 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          variants={chatButtonVariants}
          whileHover="hover"
          whileTap="tap"
          className={`
                        relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg
                        transition-all duration-300
                        ${
                          isOpen
                            ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                        }
                        text-white border-4 border-white
                    `}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle size={24} />
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles size={12} className="text-yellow-300" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Badge de mensagens não lidas */}
          <AnimatePresence>
            {unreadCount > 0 && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Caixa de Diálogo */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
                            fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-2xl z-50
                            flex flex-col border border-gray-200 overflow-hidden
                            ${isMinimized ? 'h-16' : 'h-[600px]'}
                            transition-all duration-300
                        `}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="mr-3"
                >
                  <Bot size={20} />
                </motion.div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    Célio - Assistente IA
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="ml-2"
                    >
                      <CheckCircle2 size={14} className="text-green-300" />
                    </motion.div>
                  </h3>
                  <p className="text-xs text-blue-100">Decolei.net • Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetChat}
                  className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
                  title="Reiniciar conversa"
                >
                  <RotateCcw size={16} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <Minimize2 size={16} />
                </motion.button>
              </div>
            </div>

            {/* Área de Mensagens */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`
                                                    max-w-xs p-3 rounded-2xl text-sm shadow-md
                                                    ${
                                                      message.isBot
                                                        ? 'bg-white text-gray-800 border border-gray-200'
                                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                                                    }
                                                `}
                      >
                        <div className="flex items-start">
                          {message.isBot && (
                            <Bot size={16} className="mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-line">{message.text}</p>
                            <div
                              className={`text-xs mt-2 flex items-center ${
                                message.isBot ? 'text-gray-500' : 'text-blue-100'
                              }`}
                            >
                              <Clock size={10} className="mr-1" />
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Indicador de digitação */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white text-gray-800 max-w-xs p-3 rounded-2xl text-sm shadow-md border border-gray-200">
                        <div className="flex items-center">
                          <Bot size={16} className="mr-2 text-blue-600" />
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-blue-400 rounded-full"
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            Célio está digitando...
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sugestões rápidas */}
                <AnimatePresence>
                  {showSuggestions && messages.length === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-2"
                    >
                      <p className="text-xs text-gray-500 text-center">Perguntas frequentes:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input de Mensagem */}
            {!isMinimized && (
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    disabled={isTyping}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`
                                            p-3 rounded-full transition-all
                                            ${
                                              !inputMessage.trim() || isTyping
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg'
                                            }
                                        `}
                  >
                    <Send size={16} />
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
