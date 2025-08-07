// Configurações das APIs
const AI_CONFIGS = {
  gemini: {
    apiUrl:
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    model: 'gemini-2.0-flash',
  },
  // outras APIs aqui
};

class AIService {
  constructor() {
    this.provider = 'gemini'; // Configurável via .env
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAfK6cwBaI5THD7lbKgS8rOZKtmKjbKi-g';
    this.cache = new Map(); // Cache para respostas comuns
    this.rateLimiter = {
      requests: [],
      maxRequests: 10,
      timeWindow: 60000, // 1 minuto
    };
  }

  // Rate limiting
  checkRateLimit() {
    const now = Date.now();
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      (time) => now - time < this.rateLimiter.timeWindow,
    );

    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    this.rateLimiter.requests.push(now);
  }

  // Sistema de cache
  getCacheKey(message, context = []) {
    const contextString = context
      .slice(-3)
      .map((msg) => msg.text)
      .join('|');
    return `${message.toLowerCase().trim()}|${contextString}`;
  }

  getCachedResponse(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      // 1 hora
      return cached.response;
    }
    return null;
  }

  setCachedResponse(key, response) {
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  // Método principal para enviar mensagem para a IA
  async sendMessage(userMessage, conversationHistory = [], pageContext = null) {
    try {
      // Rate limiting
      this.checkRateLimit();

      // Verificar cache primeiro
      const cacheKey = this.getCacheKey(userMessage, conversationHistory);
      const cachedResponse = this.getCachedResponse(cacheKey);

      if (cachedResponse) {
        return cachedResponse;
      }

      // Verificar se a chave de API está configurada
      if (!this.apiKey) {
        console.warn(`Chave de API não configurada para ${this.provider}. Usando fallback.`);
        return this.getFallbackResponse(userMessage, pageContext);
      }

      const response = await this.sendToGemini(userMessage, conversationHistory, pageContext);

      // Cachear a resposta
      this.setCachedResponse(cacheKey, response);

      return response;
    } catch (error) {
      console.error(`Erro na API de IA (${this.provider}):`, error.message);

      // Mensagens de erro mais específicas
      if (error.message === 'RATE_LIMIT_EXCEEDED') {
        return '⏳ Calma aí! Você está enviando muitas mensagens. Aguarde um minutinho antes de continuar nossa conversa.';
      } else if (error.message.includes('401')) {
        console.error('❌ Chave de API inválida. Verifique sua configuração no arquivo .env');
      } else if (error.message.includes('429')) {
        console.error('⚠️ Limite de requisições excedido. Tente novamente em alguns minutos.');
        return '⏳ Estou um pouco sobrecarregado no momento. Que tal tentar novamente em alguns minutos?';
      } else if (error.message.includes('403')) {
        console.error('🚫 Acesso negado. Verifique as permissões da sua chave de API.');
      }

      // SEMPRE retorna uma resposta de fallback quando há erro
      return this.getFallbackResponse(userMessage, pageContext);
    }
  }

  async sendToGemini(userMessage, conversationHistory, pageContext) {
    if (!this.apiKey) {
      throw new Error('API Key do Gemini não configurada');
    }

    // Contexto adicional baseado na página atual
    const contextualInfo = pageContext ? this.getPageContext(pageContext) : '';

    const systemContext = `Você é Célio, assistente virtual da Decolei.net, uma agência de turismo brasileira moderna.

INFORMAÇÕES DA EMPRESA:
- Agência de turismo com foco em experiência digital, uma api que não esta no ar
- Website responsivo (mobile-first)
- Sistema completo de reservas online
- Desenvolvido por: Leonardo Amyntas Machado de Freitas Filho, Eduardo da Silva Bezerra, Arthur Henrique Martins Santos, Kamylla Reis de Araújo Silva e Leônidas Dantas de Castro Netto
- Turma Decola 6 - 2025, Trilha Prof. Celio de Souza

CONTATO E SUPORTE:
- Email: decoleinet@gmail.com
- Página de Suporte: Acesse através do rodapé do site ou digite "suporte" no chat
- Desenvolvedores: Disponível no rodapé da página principal

PROCESSO DE RESERVA (FLUXO COMPLETO):
1. Cliente navega na HOME e vê pacotes em destaque
2. Clica no pacote desejado para ver detalhes completos
3. Clica em "Reservar e Pagar" na página de detalhes
4. É redirecionado para tela de ADICIONAR VIAJANTES, ele adiciona se quiser e o usuario ja esta incluso, n ão precisa ser adicionado
5. Depois vai para PAGAMENTO com as opções disponíveis

PRINCIPAIS FUNCIONALIDADES:
• PACOTES: Busca por destino, preço, datas | Detalhes completos | Sistema de avaliações
• RESERVAS: Adicionar viajantes (titular + acompanhantes) | Cálculo automático de valores
• PAGAMENTOS: Cartão (aprovação instantânea) | PIX (instantâneo) | Boleto (~1min para confirmação)
• CONTA CLIENTE: Histórico de reservas | Status de pagamentos | Avaliações pós-viagem
• AVALIAÇÃO: O cliente pode avaliar um pacote na aba de perfil após o termino dele(data de fim do pacote/reserva)
• SUPORTE: Busca por nome/email/reserva | Recuperação de senha por email

${contextualInfo}

COMO AJUDAR:
- Apresente-se como Celio quando cumprimentado
- Quando perguntado sobre seu nome, explique que é uma homenagem ao professor Celio de Souza da Impacta em parceirai com a Avanade, responsável pela trilha: REACT.JS - C# - ASP.NET do programa Decola tech 6 2025 da avanade
- Seja prestativo e objetivo (max 200 palavras)
- Foque em soluções práticas
- Use informações específicas da Decolei.net
- Direcione problemas técnicos ao suporte humano (decoleinet@gmail.com)
- Sempre em português brasileiro
- Para dúvidas sobre desenvolvedores, mencione que estão listados no rodapé (nomes completos)`;

    const prompt = `${systemContext}

Histórico da conversa:
${conversationHistory
  .slice(-5)
  .map((msg) => `${msg.isBot ? 'Assistente' : 'Cliente'}: ${msg.text}`)
  .join('\n')}

Cliente: ${userMessage}

Célio (Assistente Decolei.net):`;

    const response = await fetch(`${AI_CONFIGS.gemini.apiUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API Gemini:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('Nenhuma resposta gerada pelo Gemini');
    }

    return (
      data.candidates[0]?.content?.parts[0]?.text ||
      this.getFallbackResponse(userMessage, pageContext)
    );
  }

  // Contexto baseado na página atual
  getPageContext(pathname) {
    const contexts = {
      '/': 'CONTEXTO ATUAL: Usuário está na página inicial vendo pacotes em destaque.',
      '/pacotes': 'CONTEXTO ATUAL: Usuário está navegando pelos pacotes disponíveis.',
      '/reserva': 'CONTEXTO ATUAL: Usuário está no processo de reserva.',
      '/pagamento': 'CONTEXTO ATUAL: Usuário está na página de pagamento.',
      '/perfil': 'CONTEXTO ATUAL: Usuário está em sua área pessoal/perfil.',
      '/admin': 'CONTEXTO ATUAL: Usuário está na área administrativa.',
      '/dashboard': 'CONTEXTO ATUAL: Usuário está no dashboard.',
    };

    return contexts[pathname] || '';
  }

  // Método de fallback quando a IA não está disponível
  getFallbackResponse(userMessage, pageContext = null) {
    const message = userMessage.toLowerCase();

    // Contexto da página atual para respostas mais específicas
    const contextualHelp = pageContext ? this.getContextualHelp(pageContext) : '';

    // Verificar se a mensagem contém saudação + pergunta sobre reserva
    const temSaudacao =
      message.includes('bom dia') ||
      message.includes('boa tarde') ||
      message.includes('boa noite') ||
      message.includes('olá') ||
      message.includes('oi') ||
      message.includes('hello');
    const perguntaReserva =
      message.includes('reserva') || message.includes('reservar') || message.includes('booking');

    if (temSaudacao && perguntaReserva) {
      return `Olá! Sou Célio, assistente virtual da Decolei.net! 👋

Para fazer uma reserva é muito simples:

🎯 PASSO A PASSO:
1️⃣ Navegue pela página inicial (HOME)
2️⃣ Clique no pacote que mais te interessar
3️⃣ Na página de detalhes, clique "Reservar e Pagar"
4️⃣ Adicione viajantes (você já está incluído!)
5️⃣ Escolha sua forma de pagamento

💳 Formas de pagamento:
• Cartão: Aprovação instantânea
• PIX: Pagamento instantâneo
• Boleto: Confirmação em ~1 minuto

${contextualHelp}

Precisa de ajuda com algum passo específico?`;
    }

    // Respostas categorizadas e melhoradas
    if (this.isGreeting(message)) {
      return `Olá! Sou Célio, assistente virtual da Decolei.net! 👋

Como posso te ajudar hoje? Posso auxiliar com:
• 🎒 Informações sobre pacotes
• 📝 Processo de reservas
• 💳 Formas de pagamento
• 👤 Conta e histórico
• 🆘 Suporte técnico

${contextualHelp}`;
    }

    if (this.isAboutReservation(message)) {
      return `📋 Como fazer uma reserva na Decolei.net:

FLUXO COMPLETO:
1️⃣ Navegue pelos pacotes na página inicial
2️⃣ Clique no pacote desejado para ver detalhes
3️⃣ Clique em "Reservar e Pagar"
4️⃣ Adicione viajantes (você já está incluído!)
5️⃣ Escolha a forma de pagamento

${contextualHelp}

Alguma dúvida específica sobre este processo?`;
    }

    // Continua com as outras categorias...
    if (this.isAboutPayment(message)) {
      return this.getPaymentInfo();
    }

    if (this.isAboutPackages(message)) {
      return this.getPackageInfo();
    }

    if (this.isAboutEvaluation(message)) {
      return this.getEvaluationInfo();
    }

    if (this.isAboutAccount(message)) {
      return this.getAccountInfo();
    }

    if (this.isAboutSupport(message)) {
      return this.getSupportInfo();
    }

    if (this.isAboutIdentity(message)) {
      return this.getIdentityInfo();
    }

    if (this.isAboutCompany(message)) {
      return this.getCompanyInfo();
    }

    if (this.isAboutPrice(message)) {
      return this.getPriceInfo();
    }

    if (this.isAboutTravelers(message)) {
      return this.getTravelersInfo();
    }

    if (this.isGoodbye(message)) {
      return `Por nada! Foi um prazer ajudar! 😊

Se precisar de mais alguma coisa sobre a Decolei.net, estarei aqui.
✈️ Boa viagem e até a próxima!`;
    }

    // Resposta padrão melhorada
    return `🤖 Ops! Estou com dificuldades técnicas momentâneas...

Mas posso ajudar com:
• 🎒 Pacotes de turismo e destinos
• 📝 Processo de reservas passo a passo
• 💳 Formas de pagamento (Cartão, PIX, Boleto)
• ⭐ Sistema de avaliações
• 👤 Conta e histórico de reservas
• 🆘 Contato e suporte técnico

Para questões específicas: decoleinet@gmail.com

${contextualHelp}

💬 Reformule sua pergunta que tentarei ajudar melhor!`;
  }

  // Métodos auxiliares para categorização
  isGreeting(message) {
    return /\b(olá|oi|hello|bom dia|boa tarde|boa noite|hey)\b/.test(message);
  }

  isAboutReservation(message) {
    return /\b(reserva|reservar|booking|agendar)\b/.test(message);
  }

  isAboutPayment(message) {
    return /\b(pagamento|pagar|cartão|pix|boleto|forma.*pag)\b/.test(message);
  }

  isAboutPackages(message) {
    return /\b(pacote|viagem|destino|turismo|trip)\b/.test(message);
  }

  isAboutEvaluation(message) {
    return /\b(avaliação|avaliar|review|comentário|estrela)\b/.test(message);
  }

  isAboutAccount(message) {
    return /\b(conta|perfil|histórico|minhas reservas|login)\b/.test(message);
  }

  isAboutSupport(message) {
    return /\b(suporte|ajuda|problema|dúvida|erro)\b/.test(message);
  }

  isAboutIdentity(message) {
    return /\b(quem|nome|célio|celio|você|seu nome)\b/.test(message);
  }

  isAboutCompany(message) {
    return /\b(empresa|decolei|sobre|quem somos|história)\b/.test(message);
  }

  isAboutPrice(message) {
    return /\b(preço|valor|custo|quanto|dinheiro)\b/.test(message);
  }

  isAboutTravelers(message) {
    return /\b(viajante|acompanhante|adicionar pessoa|grupo)\b/.test(message);
  }

  isGoodbye(message) {
    return /\b(obrigado|valeu|tchau|até logo|bye|thanks)\b/.test(message);
  }

  // Métodos para respostas específicas
  getPaymentInfo() {
    return `💳 Formas de pagamento na Decolei.net:

• Cartão: Aprovação instantânea ⚡
• PIX: Pagamento instantâneo 🚀
• Boleto: Confirmação em ~1 minuto ⏱️

Vantagens:
✅ Processo seguro e transparente
✅ Sem taxas ocultas
✅ Confirmação automática

Qual método você gostaria de saber mais detalhes?`;
  }

  getPackageInfo() {
    return `🎒 Pacotes na Decolei.net:

Funcionalidades:
🔍 Busca por destino, preço e datas
📸 Detalhes completos com fotos
⭐ Sistema de avaliações de clientes
💰 Preços transparentes

Como encontrar:
• Navegue pela página inicial
• Use nossos filtros inteligentes
• Veja pacotes em destaque

Procurando algum destino específico?`;
  }

  getEvaluationInfo() {
    return `⭐ Sistema de Avaliações:

Como funciona:
📅 Após o término da viagem
👤 Acesse seu perfil para avaliar
💬 Compartilhe sua experiência
👀 Veja avaliações de outros clientes

Benefícios:
✅ Ajuda outros viajantes
✅ Melhora nossos serviços
✅ Transparência total

Sua opinião é muito importante para nós! 🙏`;
  }

  getAccountInfo() {
    return `👤 Sua conta Decolei.net:

Acesso completo a:
📋 Histórico de reservas
💳 Status de pagamentos
⭐ Suas avaliações pós-viagem
⚙️ Gerenciamento de dados pessoais

Para acessar:
🔐 Faça login na sua conta

Precisa de ajuda com login ou recuperação de senha?`;
  }

  getSupportInfo() {
    return `🆘 Suporte Decolei.net:

Canais disponíveis:
📧 Email: decoleinet@gmail.com
🌐 Página de Suporte: Acesse pelo rodapé
👨‍💻 Desenvolvedores: Informações no rodapé

Para que posso ajudar agora:
• Informações gerais sobre reservas
• Dúvidas sobre pacotes
• Orientações sobre o site

Para questões técnicas específicas, recomendo o email de suporte!`;
  }

  getIdentityInfo() {
    return `🤖 Sou Célio, assistente virtual da Decolei.net!

Sobre meu nome:
👨‍🏫 Homenagem ao Professor Célio de Souza da Impacta
🤝 Em parceria com a Avanade
🎯 Responsável pela trilha REACT.JS - C# - ASP.NET
📚 Programa Decola Tech 6 2025

Desenvolvido por:
Leonardo Amyntas, Eduardo Bezerra, Arthur Martins, Kamylla Reis e Leônidas Dantas

Como posso te ajudar hoje? 😊`;
  }

  getCompanyInfo() {
    return `🏢 A Decolei.net:

Sobre nós:
✈️ Agência de turismo brasileira moderna
📱 Foco em experiência digital
📱 Website responsivo (mobile-first)
🔧 Sistema completo de reservas online
⭐ Sistema de avaliações pós-viagem

Desenvolvida pela:
🎓 Turma Decola 6 - 2025
👨‍🏫 Trilha do Prof. Célio de Souza

Como posso ajudar você a planejar sua próxima viagem? 🌎`;
  }

  getPriceInfo() {
    return `💰 Preços na Decolei.net:

Nossos diferenciais:
✅ Preços transparentes sem taxas ocultas
🧮 Cálculo automático por viajante
💸 Opções para todos os orçamentos
🎉 Promoções especiais em pacotes selecionados

Onde ver:
📱 Navegue pelos pacotes
🔍 Use nossos filtros de preço
💎 Confira ofertas especiais

Procurando algo dentro de um orçamento específico?`;
  }

  getTravelersInfo() {
    return `👥 Adicionando viajantes:

Como funciona:
✅ Você (titular) já está incluído automaticamente
➕ Adicione quantos acompanhantes precisar
📝 Campos individuais para cada pessoa
💰 Valor calculado automaticamente

Super simples e intuitivo!

Alguma dúvida sobre como adicionar acompanhantes?`;
  }

  getContextualHelp(pathname) {
    const helps = {
      '/': '\n💡 Dica: Você está na página inicial! Explore os pacotes em destaque abaixo.',
      '/pacotes': '\n💡 Dica: Use os filtros para encontrar o pacote perfeito para você!',
      '/reserva': '\n💡 Dica: Você está no processo de reserva. Siga os passos para finalizar!',
      '/pagamento': '\n💡 Dica: Escolha sua forma de pagamento preferida para finalizar.',
      '/perfil': '\n💡 Dica: Aqui você pode ver seu histórico e deixar avaliações.',
      '/admin': '\n💡 Dica: Área administrativa - gerencie pacotes e usuários.',
      '/dashboard': '\n💡 Dica: Acompanhe as métricas e estatísticas importantes.',
    };

    return helps[pathname] || '';
  }

  // Método para configurar o provedor de IA
  setProvider(provider, apiKey) {
    this.provider = provider;
    this.apiKey = apiKey;
  }
}

export default new AIService();
