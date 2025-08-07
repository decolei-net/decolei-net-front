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
            return this.getFallbackResponse(userMessage);
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
            
            // SEMPRE retorna uma resposta de fallback quando há erro
            return this.getFallbackResponse(userMessage);
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

    // Método de fallback quando a IA não está disponível
    getFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Verificar se a mensagem contém saudação + pergunta sobre reserva
        const temSaudacao = message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite') || message.includes('olá') || message.includes('oi') || message.includes('hello');
        const perguntaReserva = message.includes('reserva') || message.includes('reservar') || message.includes('booking');
        
        if (temSaudacao && perguntaReserva) {
            return `Olá! Sou Célio, assistente virtual da Decolei.net!

Para fazer uma reserva é muito simples. Aqui está o fluxo completo:

PASSO A PASSO PARA RESERVAR:
1. Navegue pela página inicial (HOME) e veja os pacotes em destaque
2. Clique no pacote que mais te interessar para ver todos os detalhes
3. Na página de detalhes do pacote, clique no botão "Reservar e Pagar"
4. Você será redirecionado para a tela "Adicionar Viajantes"
   - Você (titular) já está incluído automaticamente
   - Adicione acompanhantes se necessário
5. Depois vá para a tela de PAGAMENTO e escolha sua forma preferida:
   - Cartão: Aprovação instantânea
   - PIX: Pagamento instantâneo
   - Boleto: Confirmação em aproximadamente 1 minuto

O sistema calcula automaticamente o valor total baseado no número de viajantes. Precisa de ajuda com algum passo específico?`;
        }
        
        // Respostas baseadas no contexto da empresa
        if (message.includes('olá') || message.includes('oi') || message.includes('hello') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
            return `Olá! Sou Célio, assistente virtual da Decolei.net!
            
Estou aqui para ajudar com informações sobre nossos pacotes de turismo e o processo de reservas. Como posso te ajudar hoje?`;
        }
        
        if (message.includes('reserva') || message.includes('reservar') || message.includes('booking')) {
            return `Para fazer uma reserva na Decolei.net é muito simples:
            
FLUXO COMPLETO DE RESERVA:
1. Navegue pelos pacotes na página inicial
2. Clique no pacote desejado para ver os detalhes
3. Clique em "Reservar e Pagar"
4. Adicione viajantes (você já está incluído!)
5. Escolha a forma de pagamento

Precisa de ajuda com algum passo específico?`;
        }
        
        if (message.includes('pagamento') || message.includes('pagar') || message.includes('cartão') || message.includes('pix') || message.includes('boleto')) {
            return `Na Decolei.net oferecemos as seguintes opções de pagamento:
            
• Cartão: Aprovação instantânea
• PIX: Pagamento instantâneo  
• Boleto: Confirmação em aproximadamente 1 minuto

Qual método você gostaria de saber mais detalhes?`;
        }
        
        if (message.includes('pacote') || message.includes('viagem') || message.includes('destino') || message.includes('turismo')) {
            return `Na Decolei.net você encontra pacotes incríveis!
            
Funcionalidades dos pacotes:
• Busca por destino, preço e datas
• Detalhes completos com fotos e descrição
• Sistema de avaliações de outros clientes
• Preços transparentes sem surpresas

Navegue pela nossa página inicial para ver os pacotes em destaque ou use nossos filtros para encontrar a viagem perfeita!`;
        }
        
        if (message.includes('avaliação') || message.includes('avaliar') || message.includes('review') || message.includes('comentário')) {
            return `Sistema de Avaliações da Decolei.net:
            
Como funciona:
• Após o término da sua viagem, você pode avaliar
• Acesse seu perfil para deixar sua avaliação
• Ajude outros viajantes com sua experiência
• Veja avaliações de outros clientes antes de reservar

Sua opinião é muito importante para nós!`;
        }
        
        if (message.includes('conta') || message.includes('perfil') || message.includes('histórico') || message.includes('minhas reservas')) {
            return `Na sua conta Decolei.net você tem acesso a:
            
• Histórico completo de reservas
• Status de pagamentos
• Suas avaliações pós-viagem
• Gerenciamento de dados pessoais

Faça login para acessar todas essas funcionalidades!`;
        }
        
        if (message.includes('suporte') || message.includes('ajuda') || message.includes('problema') || message.includes('dúvida')) {
            return `Para suporte técnico ou dúvidas específicas:
            
• Email: decoleinet@gmail.com
• Página de Suporte: Acesse através do rodapé do site
• Desenvolvedores: Informações disponíveis no rodapé

Estou aqui para ajudar no que posso, mas para questões técnicas recomendo entrar em contato com nossa equipe!`;
        }
        
        if (message.includes('quem') || message.includes('nome') || message.includes('célio') || message.includes('celio') || message.includes('você')) {
            return `Sou Célio, assistente virtual da Decolei.net!
            
Meu nome é uma homenagem ao Professor Célio de Souza da Impacta, em parceria com a Avanade, responsável pela trilha REACT.JS - C# - ASP.NET do programa Decola Tech 6 2025.

Fui desenvolvido pela equipe: Leonardo Amyntas, Eduardo Bezerra, Arthur Martins, Kamylla Reis e Leônidas Dantas.`;
        }
        
        if (message.includes('empresa') || message.includes('decolei') || message.includes('sobre') || message.includes('quem somos')) {
            return `A Decolei.net é uma agência de turismo brasileira moderna!
            
• Foco em experiência digital
• Website responsivo (mobile-first)
• Sistema completo de reservas online
• Sistema de avaliações pós-viagem

Desenvolvida pela Turma Decola 6 - 2025, na trilha do Prof. Célio de Souza. Como posso ajudar você a planejar sua próxima viagem?`;
        }
        
        if (message.includes('preço') || message.includes('valor') || message.includes('custo') || message.includes('quanto')) {
            return `Sobre preços na Decolei.net:
            
Nossos diferenciais:
• Preços transparentes sem taxas ocultas
• Cálculo automático de valores por viajante
• Opções para todos os orçamentos
• Promoções especiais em pacotes selecionados

Navegue pelos pacotes para ver preços atualizados e encontrar as melhores ofertas!`;
        }
        
        if (message.includes('viajante') || message.includes('acompanhante') || message.includes('adicionar pessoa')) {
            return `Adicionando viajantes na Decolei.net:
            
Como funciona:
• Você (titular) já está incluído automaticamente
• Adicione quantos acompanhantes precisar
• Cada pessoa tem campos individuais
• O valor é calculado automaticamente

O sistema é bem simples e intuitivo!`;
        }
        
        if (message.includes('obrigado') || message.includes('valeu') || message.includes('tchau') || message.includes('até logo')) {
            return `Por nada! Foi um prazer ajudar!
            
Se precisar de mais alguma coisa sobre a Decolei.net, estarei aqui. Boa viagem e até a próxima!`;
        }
        
        // Resposta padrão para qualquer outra mensagem
        return `Desculpe, no momento estou com dificuldades técnicas para processar sua mensagem completamente.
        
Mas posso ajudar com informações sobre:
• Pacotes de turismo e destinos
• Processo de reservas passo a passo
• Formas de pagamento (Cartão, PIX, Boleto)
• Sistema de avaliações
• Conta e histórico de reservas
• Contato e suporte técnico

Para questões específicas, entre em contato: decoleinet@gmail.com

Digite sua pergunta de forma mais específica que tentarei ajudar melhor!`;
    }

    // Método para configurar o provedor de IA
    setProvider(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
    }
}

export default new AIService();
