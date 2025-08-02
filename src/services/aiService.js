// Serviço para integração com APIs de IA

// Configurações das APIs
const AI_CONFIGS = {
    openai: {
        apiUrl: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        maxTokens: 150
    },
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

        const systemContext = `Você é um assistente virtual da Decolei.net, uma agência de turismo brasileira moderna. 

INFORMAÇÕES DA EMPRESA:
- Agência de turismo com foco em experiência digital
- Website responsivo (mobile-first) 
- Sistema completo de reservas online

PRINCIPAIS FUNCIONALIDADES:
• PACOTES: Busca por destino, preço, datas | Detalhes completos | Sistema de avaliações
• RESERVAS: Seleção de datas | Dados dos viajantes | Cálculo automático de valores
• PAGAMENTOS: Cartão (aprovação instantânea) | PIX (instantâneo) | Boleto (~1min para confirmação)
• CONTA CLIENTE: Histórico de reservas | Status de pagamentos | Avaliações pós-viagem
• SUPORTE: Busca por nome/email/reserva | Recuperação de senha por email

COMO AJUDAR:
- Seja prestativo e direto
- Foque em soluções práticas  
- Use informações específicas da Decolei.net
- Direcione problemas técnicos ao suporte humano
- Sempre em português brasileiro`;

        const prompt = `${systemContext}

Histórico da conversa:
${conversationHistory.slice(-5).map(msg => `${msg.isBot ? 'Assistente' : 'Cliente'}: ${msg.text}`).join('\n')}

Cliente: ${userMessage}

Resposta do Assistente Decolei.net:`;

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
    // Método para configurar o provedor de IA
    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
    }
}

export default new AIService();
