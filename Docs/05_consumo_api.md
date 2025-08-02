# Comunicação com a API Backend e Fluxo de Usuário

Este documento combina a explicação técnica de como o frontend se comunica com a API backend com um guia narrativo sobre a jornada de cada perfil de usuário na aplicação.

### 1. Configuração do Cliente HTTP (Axios)

A biblioteca `Axios` é usada para fazer todas as requisições HTTP para a API. A configuração base para o cliente HTTP se encontra em `src/services/api.js`.

* **Configuração da URL Base:** O `api.js` deve definir a URL base do backend para que todas as requisições não precisem repetir o endereço. Exemplo:
    ```javascript
    import axios from 'axios';

    const api = axios.create({
      baseURL: 'https://localhost:[PORTA_DA_API]/api',
    });

    export default api;
    ```
    * **Observação:** A URL base pode ser configurada usando variáveis de ambiente (`.env`) para facilitar a troca entre ambientes de desenvolvimento e produção.

### 2. Fluxo de Autenticação com JWT

O sistema utiliza tokens JWT (JSON Web Tokens) para autenticação. O fluxo é gerenciado pela lógica na pasta `src/services` e no estado global do Redux.

* **Login:** A função de login (em `src/services/authService.js`) faz uma requisição `POST` para o endpoint de login do backend.
* **Armazenamento do Token:** Após uma resposta bem-sucedida, o token JWT recebido é armazenado localmente no navegador (ex: `localStorage`) e no estado global do Redux (`authSlice`).
* **Inclusão do Token:** Para requisições que precisam de autenticação, o token é incluído no cabeçalho `Authorization: Bearer [TOKEN]` de forma centralizada nos serviços.
* **Decodificação do Token:** O `jwt-decode` é usado para ler o token e extrair informações do usuário (como o ID, email e a `role`), que são salvas no estado do Redux para uso em toda a aplicação.

### 3. Estrutura da Lógica de Requisições (`/services`)

A pasta `src/services` centraliza todas as interações com a API, isolando a lógica de negócio dos componentes da interface. Cada arquivo de serviço é responsável por um domínio específico, como visto abaixo:

* `authService.js`: Gerencia o fluxo de login, logout, registro e recuperação de senha.
* `pacoteService.js`: Lida com todas as requisições relacionadas a pacotes de viagem (listar, buscar, criar, atualizar).
* `reservaService.js`: Gerencia as requisições para criar, visualizar e atualizar reservas.
* `pagamentoService.js`: Lida com as requisições para processar pagamentos.
* `avaliacoesService.js`: Gerencia as requisições para registrar e moderar avaliações.
* `usuarioService.js`: Lida com a busca e o gerenciamento de dados de usuários.
* `imagemService.js`: Gerencia o upload e a manipulação de imagens.
* `aiService.js`: Gerencia a comunicação com APIs de inteligência artificial (OpenAI GPT e Google Gemini) para o sistema de ChatBot, incluindo sistema de fallback para respostas inteligentes quando as APIs externas não estão disponíveis.

### 4. Integração com APIs de Inteligência Artificial

O sistema inclui um serviço especializado para comunicação com APIs de IA que alimenta o ChatBot da aplicação:

* **Motor de IA::** Google Gemini, implementado através do `aiService.js`.
* **Contexto Especializado:** As consultas são enviadas com contexto específico sobre a agência de viagens, permitindo respostas mais precisas e relevantes.

Essa abordagem garante que a lógica de comunicação com a API seja consistente, reutilizável e fácil de manter.

---

## Fluxo de Usuário e Jornada na Aplicação

Este guia descreve a jornada do usuário em cada perfil (Cliente, Atendente e Administrador), focando nas ações que eles podem realizar e como o sistema se comporta em cada etapa.

### 1. Jornada do Cliente

A jornada do cliente é focada na autonomia, permitindo que ele gerencie todo o ciclo de uma viagem, desde a busca até a avaliação.

1.  **Registro e Login:**
    * Um novo cliente acessa a tela de cadastro para criar sua conta.
    * Se já tem cadastro, ele faz o login. Em caso de esquecimento da senha, ele pode iniciar o processo de recuperação informando seu e-mail. O sistema envia uma notificação por e-mail com um botão de redefinição, que o redireciona para uma tela segura para criar uma nova senha. Após isso, ele pode fazer login com a nova senha.

2.  **Exploração de Pacotes:**
    * Na tela inicial (Home), o cliente visualiza uma lista de pacotes de viagem.
    * Ele pode usar filtros para procurar por um destino, faixa de preço ou datas específicas que se encaixem em suas preferências.

3.  **Detalhes e Reserva:**
    * Ao encontrar um pacote de interesse, ele clica para ver os detalhes completos, incluindo descrição, midias, datas...
    * A partir dessa tela, ele clica para fazer a reserva.

4.  **Pagamento e Confirmação:**
    * É direcionado para a tela de pagamento. Ele insere os dados dos demais viajantes e pode escolher entre as formas de pagamento disponíveis: Cartão de Crédito, Débito, Pix ou Boleto.
    * **Para Cartões e Pix:** O pagamento é aprovado instantaneamente, desde que as informações do cartão (com pelo menos 12 dígitos) estejam corretas. O cliente recebe um e-mail de confirmação imediata.
    * **Para Boleto:** A reserva fica com status "Pendente". O cliente recebe um e-mail com o comprovante de pagamento pendente e, após 1 minuto (simulando a compensação bancária), ele recebe um segundo e-mail confirmando que o pagamento foi aprovado.

5.  **Pós-Viagem e Avaliação:**
    * A qualquer momento, o cliente pode acessar sua área de usuário para ver o histórico e o status de suas reservas e pagamentos.
    * Após o término da viagem (passada a data final do pacote), ele pode avaliar o pacote, dando uma nota e deixando um comentário.

### 2. Jornada do Atendente

O atendente tem um fluxo focado em oferecer suporte ao cliente e monitorar as reservas.

1.  **Login:**
    * O atendente acessa a tela de login com suas credenciais específicas.
    * Após o login, ele é direcionado para um painel de atendente.

2.  **Suporte e Acompanhamento:**
    * No painel, ele pode ver uma lista completa de todas as reservas e seus status.
    * Ele pode usar a funcionalidade de busca para encontrar um cliente ou uma reserva específica, seja por nome, e-mail ou número de reserva, para oferecer suporte rápido.

### 3. Jornada do Administrador

O administrador tem a visão e o controle completos da agência, com acesso a todas as funcionalidades.

1.  **Login e Painel:**
    * O administrador faz login com suas credenciais e é direcionado para um painel de controle completo.
    * Lá, ele pode visualizar métricas e relatórios importantes (como vendas por destino ou período) para entender o desempenho da agência.

2.  **Gestão de Conteúdo e Usuários:**
    * Ele tem acesso a formulários para cadastrar, editar ou excluir pacotes de viagem, mantendo o catálogo da agência sempre atualizado.
    * Ele pode registrar novos usuários, incluindo outros administradores ou atendentes.

3.  **Monitoramento e Relatórios:**
    * O administrador pode exportar relatórios de vendas, pacotes e reservas em PDF.
    * Ele tem acesso completo à moderação de avaliações, podendo aprovar, rejeitar ou editar comentários de clientes.