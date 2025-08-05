// Configurações das APIs
const AI_CONFIGS = {
    gemini: {
        apiUrl: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
        model: 'gemini-1.5-flash'
    },
    // outras APIs aqui
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
- Seja prestativo 
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

    // Método para configurar o provedor de IA
    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
    }
}

export default new AIService();
