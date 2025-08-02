// Serviço para integração com APIs de IA

// Configurações das APIs
const AI_CONFIGS = {
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
        model: 'gemini-1.5-flash'
    },
    // Adicione outras APIs aqui
};

class AIService {
    constructor() {
        this.provider =  'gemini'; // Configurável via .env
        this.apiKey = "AIzaSyC1EYbykZ1xz_bkL0Qg1M-N8D-KTO0P6II"
    }

  

    // Método principal para enviar mensagem para a IA
    async sendMessage(userMessage, conversationHistory = []) {
        // Verificar se a chave de API está configurada
        if (!this.apiKey) {
            console.warn(`Chave de API não configurada para ${this.provider}. Usando fallback.`);
       
        }

        try {
           
                    return await this.sendToGemini(userMessage, conversationHistory);
                
        
        } catch (error) {
            console.error(`Erro na API de IA (${this.provider}):`, error.message);
            
            // Mensagens de erro mais específicas
            if (error.message.includes('401')) {
                console.error('❌ Chave de API inválida. Verifique sua configuração no arquivo .env');
            } else if (error.message.includes('429')) {
                console.error('⚠️ Limite de requisições excedido. Tente novamente em alguns minutos.');
            } else if (error.message.includes('403')) {
                console.error('🚫 Acesso negado. Verifique as permissões da sua chave de API.');
            }
            
        }
    }

    async sendToGemini(userMessage, conversationHistory) {
        if (!this.apiKey) {
            throw new Error('API Key do Gemini não configurada');
        }

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

COMO AJUDAR:
- Apresente-se como Celio quando cumprimentado
- Quando perguntado sobre seu nome, explique que é uma homenagem ao professor Celio de Souza da Impacta em parceirai com a Avanade, responsável pela trilha: REACT.JS - C# - ASP.NET do programa Decola tech 6 2025 da avanade
- Seja prestativo e direto
- Foque em soluções práticas
- Use informações específicas da Decolei.net
- Direcione problemas técnicos ao suporte humano (decoleinet@gmail.com)
- Sempre em português brasileiro
- Para dúvidas sobre desenvolvedores, mencione que estão listados no rodapé (nomes completos)`;

        const prompt = `${systemContext}

Histórico da conversa:
${conversationHistory.slice(-5).map(msg => `${msg.isBot ? 'Assistente' : 'Cliente'}: ${msg.text}`).join('\n')}

Cliente: ${userMessage}

Célio (Assistente Decolei.net):`;

        const response = await fetch(`${AI_CONFIGS.gemini.apiUrl}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 250
                }
            })
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

        return data.candidates[0]?.content?.parts[0]?.text || this.getFallbackResponse(userMessage);
    }

    // Sistema de fallback inteligente quando APIs não estão disponíveis
    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Cumprimentos e apresentação
        if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('ola') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
            return "Olá! Sou o Célio, assistente virtual da Decolei.net! 🌎 Uma homenagem ao nosso querido professor Célio de Souza da Impacta. Como posso te ajudar hoje?";
        }
        
        // Quem é você / nome
        if (lowerMessage.includes('quem é você') || lowerMessage.includes('qual seu nome') || lowerMessage.includes('como se chama') || lowerMessage.includes('celio') || lowerMessage.includes('célio')) {
            return "Eu sou o Célio, o assistente virtual da Decolei.net! Meu nome é uma homenagem ao professor Célio de Souza da Impacta. Estou aqui para te ajudar com tudo sobre viagens e nossa plataforma!";
        }
        
        // Por que esse nome / homenagem
        if (lowerMessage.includes('por que célio') || lowerMessage.includes('por que celio') || lowerMessage.includes('porque esse nome') || lowerMessage.includes('homenagem') || lowerMessage.includes('professor célio') || lowerMessage.includes('professor celio')) {
            return "Meu nome é uma homenagem ao professor Célio de Souza da Impacta! Ele é o professor responsável pela trilha do nosso grupo (Decola 6 - 2025). Os desenvolvedores escolheram esse nome para honrar sua dedicação e ensino. Uma forma carinhosa de reconhecer seu trabalho! 👨‍🏫✨";
        }
        
        // Processo de reserva
        if (lowerMessage.includes('reserva') || lowerMessage.includes('reservar') || lowerMessage.includes('como fazer reserva')) {
            return "Para fazer uma reserva é bem simples! 1️⃣ Navegue pelos pacotes na página inicial 2️⃣ Clique no pacote que te interessar 3️⃣ Clique em 'Reservar e Pagar' 4️⃣ Adicione viajantes se quiser 5️⃣ Finalize o pagamento. Precisa de ajuda com algum passo específico?";
        }
        
        // Preços e valores
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo') || lowerMessage.includes('quanto custa')) {
            return "Os preços dos nossos pacotes variam conforme destino, época do ano e tipo de acomodação. Use os filtros na página inicial para encontrar pacotes dentro do seu orçamento. Posso te ajudar a encontrar algo específico?";
        }
        
        // Pagamento
        if (lowerMessage.includes('pagamento') || lowerMessage.includes('pagar') || lowerMessage.includes('formas de pagamento')) {
            return "Aceitamos Cartão de Crédito, Débito, PIX (aprovação instantânea) e Boleto (confirmação em ~1 minuto). O processo é 100% seguro e você receberá confirmação por email. Alguma dúvida específica sobre pagamento?";
        }
        
        // Viajantes / acompanhantes
        if (lowerMessage.includes('viajante') || lowerMessage.includes('acompanhante') || lowerMessage.includes('adicionar pessoa')) {
            return "Você pode adicionar acompanhantes durante o processo de reserva! Depois de clicar em 'Reservar', haverá uma tela para incluir os dados dos demais viajantes. O titular (você) já fica incluído automaticamente.";
        }
        
        // Contato e suporte
        if (lowerMessage.includes('contato') || lowerMessage.includes('suporte') || lowerMessage.includes('ajuda') || lowerMessage.includes('problema')) {
            return "Para suporte humano: 📧 decoleinet@gmail.com ou acesse nossa Página de Suporte através do rodapé do site. Estou aqui para ajudar no que posso!";
        }
        
        // Desenvolvedores / equipe
        if (lowerMessage.includes('desenvolvedor') || lowerMessage.includes('quem fez') || lowerMessage.includes('equipe') || lowerMessage.includes('criador')) {
            return "A Decolei.net foi desenvolvida por: Leonardo Amyntas, Eduardo da Silva, Arthur Henrique, Kamylla Reis e Leônidas Dantas - Turma Decola 6, Trilha Prof. Célio de Souza! Você pode ver os nomes completos no rodapé do site.";
        }
        
        // Destinos
        if (lowerMessage.includes('destino') || lowerMessage.includes('viagem') || lowerMessage.includes('lugar') || lowerMessage.includes('onde viajar')) {
            return "Temos pacotes para destinos incríveis no Brasil e no mundo! Use a barra de pesquisa na página inicial para encontrar um destino específico ou navegue pelos nossos destaques. Tem algum lugar dos sonhos em mente? 🏖️🏔️";
        }
        
        // Cancelamento
        if (lowerMessage.includes('cancelar') || lowerMessage.includes('cancelamento') || lowerMessage.includes('desistir')) {
            return "Para cancelamentos, acesse 'Minha Conta' no menu superior e gerencie suas reservas, ou entre em contato com nosso suporte em decoleinet@gmail.com. Posso te ajudar a navegar até sua conta?";
        }
        
        // Avaliações
        if (lowerMessage.includes('avaliação') || lowerMessage.includes('avaliar') || lowerMessage.includes('comentário') || lowerMessage.includes('nota')) {
            return "Após sua viagem, você pode avaliar o pacote na sua área de usuário! Suas avaliações ajudam outros viajantes a escolherem os melhores destinos. Que legal contribuir com a comunidade! ⭐";
        }
        
        // Resposta padrão
        return "Posso te ajudar com informações sobre reservas, pagamentos, destinos, preços e muito mais! Para suporte especializado, entre em contato com nossa equipe em decoleinet@gmail.com. O que você gostaria de saber? 😊";
    }

    // Método para configurar o provedor de IA
    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
    }
}

export default new AIService();
