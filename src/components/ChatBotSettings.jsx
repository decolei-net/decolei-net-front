import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Palette,
  RotateCcw,
  Download,
  Trash2,
  Info,
} from 'lucide-react';
import { useChatSettings, useChatPersistence } from '../hooks/useChatBot';

export default function ChatBotSettings({ isOpen, onClose, onReset }) {
  const { settings, updateSetting } = useChatSettings();
  const { clearMessages } = useChatPersistence();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!isOpen) return null;

  const handleClearChat = () => {
    if (showConfirmClear) {
      clearMessages();
      onReset();
      setShowConfirmClear(false);
      onClose();
    } else {
      setShowConfirmClear(true);
    }
  };

  const exportChat = () => {
    // Implementar exportação do histórico de chat
    console.log('Exportando chat...');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Settings size={20} className="mr-2 text-blue-600" />
            <h2 className="text-lg font-semibold">Configurações do Chat</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        {/* Configurações */}
        <div className="space-y-6">
          {/* Tema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Palette size={16} className="inline mr-2" />
              Tema
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'Claro', icon: Sun },
                { value: 'dark', label: 'Escuro', icon: Moon },
                { value: 'auto', label: 'Auto', icon: Palette },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSetting('theme', value)}
                  className={`
                                        p-3 rounded-lg border text-sm font-medium transition-all
                                        ${
                                          settings.theme === value
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                >
                  <Icon size={16} className="mx-auto mb-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Som */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {settings.soundEnabled ? (
                  <Volume2 size={16} className="inline mr-2" />
                ) : (
                  <VolumeX size={16} className="inline mr-2" />
                )}
                Sons de notificação
              </span>
              <button
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`
                                    w-12 h-6 rounded-full transition-colors relative
                                    ${settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                                `}
              >
                <div
                  className={`
                                    w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                    ${settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                                `}
                />
              </button>
            </label>
          </div>

          {/* Animações */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Animações</span>
              <button
                onClick={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
                className={`
                                    w-12 h-6 rounded-full transition-colors relative
                                    ${settings.animationsEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                                `}
              >
                <div
                  className={`
                                    w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                    ${settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}
                                `}
                />
              </button>
            </label>
          </div>

          {/* Indicador de digitação */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Mostrar quando estou digitando
              </span>
              <button
                onClick={() => updateSetting('showTypingIndicator', !settings.showTypingIndicator)}
                className={`
                                    w-12 h-6 rounded-full transition-colors relative
                                    ${settings.showTypingIndicator ? 'bg-blue-600' : 'bg-gray-300'}
                                `}
              >
                <div
                  className={`
                                    w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                    ${settings.showTypingIndicator ? 'translate-x-6' : 'translate-x-0.5'}
                                `}
                />
              </button>
            </label>
          </div>

          {/* Salvamento automático */}
          <div>
            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Salvar conversa automaticamente
              </span>
              <button
                onClick={() => updateSetting('autoSave', !settings.autoSave)}
                className={`
                                    w-12 h-6 rounded-full transition-colors relative
                                    ${settings.autoSave ? 'bg-blue-600' : 'bg-gray-300'}
                                `}
              >
                <div
                  className={`
                                    w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                    ${settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'}
                                `}
                />
              </button>
            </label>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
          {/* Reiniciar conversa */}
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw size={16} className="mr-2" />
            Reiniciar Conversa
          </button>

          {/* Exportar conversa */}
          <button
            onClick={exportChat}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Exportar Conversa
          </button>

          {/* Limpar histórico */}
          <button
            onClick={handleClearChat}
            className={`
                            w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors
                            ${
                              showConfirmClear
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'border border-red-300 text-red-600 hover:bg-red-50'
                            }
                        `}
          >
            <Trash2 size={16} className="mr-2" />
            {showConfirmClear ? 'Confirmar Exclusão' : 'Limpar Histórico'}
          </button>

          {showConfirmClear && (
            <p className="text-xs text-red-600 text-center">Esta ação não pode ser desfeita</p>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <Info size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Sobre o Célio</p>
              <p className="text-xs">
                Assistente IA da Decolei.net desenvolvido para ajudar com informações sobre pacotes,
                reservas e suporte.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
