# 🤖 ChatBot Célio - Decolei.net

## 📋 Visão Geral

O ChatBot Célio é um assistente virtual inteligente da Decolei.net, desenvolvido com React e integrado com a API do Google Gemini. Ele foi criado para oferecer suporte automatizado aos usuários, ajudando com informações sobre pacotes, reservas, pagamentos e outras funcionalidades da plataforma.

## 🎯 Principais Melhorias Implementadas

### 🔧 **Melhorias Lógicas**

1. **Sistema de Cache Inteligente**
   - Cache local de respostas comuns
   - Reduz chamadas desnecessárias para a API
   - Melhora performance e experiência do usuário

2. **Rate Limiting**
   - Proteção contra spam (máx. 10 mensagens/minuto)
   - Mensagens de aviso amigáveis para o usuário

3. **Gestão de Estado Avançada**
   - Hooks personalizados para persistência
   - Salvamento automático de conversas
   - Configurações personalizáveis

4. **Contexto Inteligente**
   - Reconhece a página atual do usuário
   - Oferece ajuda contextual específica
   - Mantém histórico relevante da conversa

5. **Tratamento de Erros Robusto**
   - Fallbacks inteligentes quando a API falha
   - Mensagens de erro específicas e úteis
   - Respostas categorizadas por temas

### 🎨 **Melhorias Visuais**

1. **Design Moderno**
   - Interface redesenhada com Framer Motion
   - Gradientes e sombras sofisticadas
   - Bordas arredondadas e elementos modernos

2. **Animações Fluidas**
   - Entrada e saída suaves do chat
   - Animações de mensagens individuais
   - Indicadores de digitação animados
   - Botão flutuante com efeitos

3. **UX Aprimorada**
   - Sugestões de perguntas frequentes
   - Badges de mensagens não lidas
   - Função de minimizar/maximizar
   - Botão de reiniciar conversa
   - Auto-scroll para última mensagem
   - Focus automático no input

4. **Responsividade Melhorada**
   - Adaptação automática para mobile
   - Posicionamento inteligente
   - Tamanho otimizado para diferentes telas

5. **Recursos Visuais**
   - Ícones contextuais (Bot, Clock, CheckCircle)
   - Status "Online" visível
   - Timestamps formatados
   - Diferenciação clara entre mensagens

## 🛠️ Arquitetura Técnica

### **Componentes Principais**

- `ChatBot.jsx` - Componente principal do chat
- `ChatBotSettings.jsx` - Painel de configurações
- `useChatBot.js` - Hooks personalizados para funcionalidades

### **Serviços**

- `aiService.js` - Integração com APIs de IA (Google Gemini)
- Sistema de cache e rate limiting
- Fallbacks inteligentes

### **Hooks Personalizados**

- `useChatPersistence` - Persistência de conversas
- `useChatAnalytics` - Tracking de eventos
- `useChatSettings` - Configurações do usuário

## 🔑 Configuração

### **Variáveis de Ambiente**

Crie um arquivo `.env` baseado no `.env.example`:

```env
# API do Google Gemini
VITE_GEMINI_API_KEY=sua_chave_aqui

# Outras configurações
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Decolei.net
```

### **Instalação de Dependências**

```bash
npm install framer-motion lucide-react
```

## 📱 Funcionalidades

### **Para Usuários**

1. **Chat Inteligente**
   - Respostas contextuais sobre a Decolei.net
   - Ajuda com reservas, pagamentos e pacotes
   - Sugestões de perguntas frequentes

2. **Personalização**
   - Configurações de tema (claro/escuro/auto)
   - Sons de notificação
   - Controle de animações
   - Salvamento automático

3. **Histórico**
   - Conversas salvas localmente
   - Exportação de chat
   - Limpeza de histórico

### **Para Desenvolvedores**

1. **API Flexível**
   - Suporte a múltiplos provedores de IA
   - Sistema de fallback robusto
   - Cache configurável

2. **Analytics**
   - Tracking de eventos
   - Métricas de uso
   - Análise de conversas

3. **Manutenibilidade**
   - Código modular e limpo
   - Hooks reutilizáveis
   - Documentação completa

## 🎯 Respostas Inteligentes

O ChatBot categoriza perguntas automaticamente:

- **Saudações** - Apresentação e orientações iniciais
- **Reservas** - Processo completo passo a passo
- **Pagamentos** - Formas de pagamento disponíveis
- **Pacotes** - Informações sobre destinos e funcionalidades
- **Conta** - Perfil, histórico e avaliações
- **Suporte** - Contatos e ajuda técnica
- **Empresa** - Informações sobre a Decolei.net

## 🚀 Performance

### **Otimizações Implementadas**

1. **Lazy Loading** - Componentes carregados sob demanda
2. **Memoização** - Hooks e callbacks otimizados
3. **Cache Local** - Redução de chamadas de API
4. **Debounce** - Controle de rate limiting
5. **Cleanup** - Limpeza automática de recursos

### **Métricas de Performance**

- Tempo de resposta: < 2s (com cache)
- Tamanho do bundle: Otimizado com tree-shaking
- Animações: 60fps suaves
- Memória: Gestão eficiente de estado

## 🔒 Segurança

1. **API Keys** - Configuração via variáveis de ambiente
2. **Rate Limiting** - Proteção contra spam
3. **Sanitização** - Validação de inputs
4. **CORS** - Configuração adequada de origens

## 📊 Analytics & Monitoring

O sistema inclui tracking básico para:

- Mensagens enviadas/recebidas
- Tempo de sessão
- Perguntas mais frequentes
- Erros de API
- Taxa de satisfação

## 🐛 Debugging

### **Logs Detalhados**

```javascript
// Console logs para debugging
console.log('ChatBot Event:', eventName, data);
console.error('Erro na API:', error.message);
console.warn('Cache miss:', cacheKey);
```

### **Ferramentas de Debug**

- React DevTools
- Network tab para APIs
- Local Storage inspection
- Console logs contextuais

## 🤝 Como Contribuir

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as melhorias
4. **Teste** completamente
5. **Abra** um Pull Request

## 📝 Roadmap Futuro

### **Próximas Funcionalidades**

- [ ] Modo voz (Speech-to-Text)
- [ ] Integração com WhatsApp
- [ ] Dashboard de analytics
- [ ] A/B testing de respostas
- [ ] Multilíngue (EN/ES)
- [ ] Integração com CRM
- [ ] Chatbot para diferentes personas
- [ ] Feedback de satisfação
- [ ] Templates de resposta
- [ ] Integração com knowledge base

### **Melhorias Técnicas**

- [ ] WebSockets para chat em tempo real
- [ ] Service Worker para offline
- [ ] Progressive Web App (PWA)
- [ ] Testes automatizados E2E
- [ ] CI/CD pipeline
- [ ] Monitoring e alertas
- [ ] Caching distribuído
- [ ] API Gateway

## 📞 Suporte

Para dúvidas ou problemas:

- **Email:** decoleinet@gmail.com
- **Issues:** GitHub Issues
- **Documentação:** Wiki do projeto

---

**Desenvolvido com ❤️ pela equipe Decolei.net**
*Leonardo Amyntas, Eduardo Bezerra, Arthur Martins, Kamylla Reis e Leônidas Dantas*

*Turma Decola 6 - 2025 | Prof. Célio de Souza*
