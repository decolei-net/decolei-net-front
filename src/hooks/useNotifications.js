// Hook para notificações do sistema
import { useState, useEffect } from 'react';

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Simular notificações baseadas no contexto do usuário logado
      const mockNotifications = [
        {
          id: 1,
          type: 'reserva',
          title: 'Pagamento Pendente',
          message: 'Sua reserva para Salvador expira em 2 horas. Complete o pagamento.',
          time: '15 min atrás',
          read: false,
          icon: '⚠️',
          action: 'Pagar Agora',
          priority: 'high',
        },
        {
          id: 2,
          type: 'avaliacao',
          title: 'Avaliação Aprovada',
          message: 'Sua avaliação sobre o Hotel Bahia foi aprovada pelo administrador.',
          time: '1 hora atrás',
          read: false,
          icon: '✅',
          priority: 'medium',
        },
        {
          id: 3,
          type: 'reserva',
          title: 'Reserva Confirmada',
          message: 'Sua reserva #BR2025001 para Rio de Janeiro foi confirmada!',
          time: '3 horas atrás',
          read: false,
          icon: '🎉',
          action: 'Ver Detalhes',
          priority: 'medium',
        },
        {
          id: 4,
          type: 'promocao',
          title: 'Oferta Especial',
          message: 'Pacotes para Nordeste com 35% OFF. Válido até meia-noite!',
          time: '5 horas atrás',
          read: true,
          icon: '🔥',
          action: 'Ver Ofertas',
          priority: 'low',
        },
        {
          id: 5,
          type: 'sistema',
          title: 'Documentos Expirados',
          message: 'Seu RG está próximo do vencimento. Atualize seus dados.',
          time: '1 dia atrás',
          read: true,
          icon: '📄',
          action: 'Atualizar',
          priority: 'medium',
        },
        {
          id: 6,
          type: 'avaliacao',
          title: 'Avalie sua Viagem',
          message: 'Como foi sua experiência em Gramado? Sua opinião é importante.',
          time: '2 dias atrás',
          read: true,
          icon: '⭐',
          action: 'Avaliar',
          priority: 'low',
        },
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter((n) => !n.read).length);
    } else {
      // Para usuários não logados - notificações promocionais
      const guestNotifications = [
        {
          id: 1,
          type: 'promocao',
          title: 'Cadastre-se e Ganhe!',
          message: 'Novos usuários ganham 20% de desconto na primeira viagem.',
          time: 'agora',
          read: false,
          icon: '🎁',
          action: 'Cadastrar',
          priority: 'high',
        },
        {
          id: 2,
          type: 'info',
          title: 'Melhores Destinos',
          message: 'Conheça os 10 destinos mais procurados do Brasil.',
          time: '1 hora atrás',
          read: false,
          icon: '🏖️',
          action: 'Ver Destinos',
          priority: 'low',
        },
      ];

      setNotifications(guestNotifications);
      setUnreadCount(guestNotifications.filter((n) => !n.read).length);
    }
  }, [user]);

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
