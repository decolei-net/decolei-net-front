import { useState, useEffect, useCallback } from 'react';

// Hook personalizado para persistir conversas do chatbot
export const useChatPersistence = () => {
  const STORAGE_KEY = 'decolei_chatbot_messages';
  const MAX_STORED_MESSAGES = 50; // Limite para evitar excesso de dados

  const loadMessages = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens salvas:', error);
    }

    // Mensagem inicial padrão
    return [
      {
        id: 1,
        text: 'Olá! Sou o Célio, assistente virtual da Decolei.net! 👋 Como posso te ajudar hoje?',
        isBot: true,
        timestamp: new Date(),
      },
    ];
  }, []);

  const saveMessages = useCallback((messages) => {
    try {
      // Limita o número de mensagens salvas para economizar espaço
      const messagesToSave = messages.slice(-MAX_STORED_MESSAGES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  }, []);

  const clearMessages = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar mensagens:', error);
    }
  }, []);

  return {
    loadMessages,
    saveMessages,
    clearMessages,
  };
};

// Hook para analytics simples do chatbot
export const useChatAnalytics = () => {
  const trackEvent = useCallback((eventName, data = {}) => {
    // Implementar tracking de eventos aqui
    // Pode ser Google Analytics, Mixpanel, etc.
    console.log(`ChatBot Event: ${eventName}`, data);

    // Exemplo de métricas que podemos rastrear:
    // - Mensagens enviadas pelo usuário
    // - Tempo de sessão
    // - Perguntas mais frequentes
    // - Taxa de satisfação
  }, []);

  const trackMessageSent = useCallback(
    (message, isBot = false) => {
      trackEvent('message_sent', {
        message_length: message.length,
        is_bot_message: isBot,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent],
  );

  const trackChatOpened = useCallback(() => {
    trackEvent('chat_opened', {
      timestamp: new Date().toISOString(),
    });
  }, [trackEvent]);

  const trackChatClosed = useCallback(
    (sessionDuration) => {
      trackEvent('chat_closed', {
        session_duration: sessionDuration,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackMessageSent,
    trackChatOpened,
    trackChatClosed,
  };
};

// Hook para configurações do chatbot
export const useChatSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light', // light | dark | auto
    soundEnabled: true,
    animationsEnabled: true,
    showTypingIndicator: true,
    autoSave: true,
    maxMessages: 100,
  });

  useEffect(() => {
    // Carregar configurações salvas
    try {
      const saved = localStorage.getItem('decolei_chatbot_settings');
      if (saved) {
        setSettings((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  }, []);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [key]: value };

      // Salvar automaticamente
      try {
        localStorage.setItem('decolei_chatbot_settings', JSON.stringify(newSettings));
      } catch (error) {
        console.error('Erro ao salvar configurações:', error);
      }

      return newSettings;
    });
  }, []);

  return {
    settings,
    updateSetting,
  };
};
