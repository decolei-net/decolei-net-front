import React, { useState } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';

const NotificationDropdown = ({ notifications, unreadCount, onMarkAsRead, onMarkAllAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'promocao':
        return '🔥';
      case 'reserva':
        return '🎫';
      case 'avaliacao':
        return '⭐';
      case 'sistema':
        return '�';
      case 'info':
        return '🏖️';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type, priority = 'low') => {
    const baseClasses = 'border-l-4';

    if (priority === 'high') {
      return `${baseClasses} border-l-red-500 bg-red-50`;
    }

    switch (type) {
      case 'promocao':
        return `${baseClasses} border-l-orange-500 bg-orange-50`;
      case 'reserva':
        return `${baseClasses} border-l-green-500 bg-green-50`;
      case 'avaliacao':
        return `${baseClasses} border-l-yellow-500 bg-yellow-50`;
      case 'sistema':
        return `${baseClasses} border-l-blue-500 bg-blue-50`;
      case 'info':
        return `${baseClasses} border-l-purple-500 bg-purple-50`;
      default:
        return `${baseClasses} border-l-gray-500 bg-gray-50`;
    }
  };

  return (
    <div className="relative">
      {/* Botão de Notificação */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <>
          {/* Overlay para fechar ao clicar fora */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Bell size={18} />
                Notificações
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                    Marcar todas
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read
                        ? getNotificationColor(notification.type, notification.priority)
                        : 'bg-gray-50/50'
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        onMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0">{notification.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className={`font-medium text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}
                          >
                            {notification.title}
                            {notification.priority === 'high' && (
                              <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                Urgente
                              </span>
                            )}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-400 text-xs">{notification.time}</span>
                          {notification.action && (
                            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                              {notification.action}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                  <p>Nenhuma notificação</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 text-center">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver todas as notificações
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
