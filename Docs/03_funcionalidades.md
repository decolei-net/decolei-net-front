# Principais Funcionalidades do Frontend

A aplicação frontend do Decolei.net é a interface principal que implementa a maioria dos requisitos funcionais, permitindo aos usuários e à equipe da agência interagir com o sistema de forma eficiente e intuitiva. As funcionalidades chave são:

### 1. Gestão de Usuários e Autenticação
* **Cadastro de Cliente:** Permite que novos usuários criem uma conta completa para acessar os serviços da agência.
* **Login e Logout:** Oferece um fluxo de login e logout seguro para clientes e perfis administrativos.
* **Recuperação de Senha:** Funcionalidade para redefinir a senha do usuário em caso de esquecimento.
* **Área do Cliente:** Uma área exclusiva onde o cliente pode visualizar seu perfil e o histórico de suas reservas e pagamentos.

### 2. Exploração e Visualização de Pacotes de Viagem
* **Listagem de Pacotes:** Exibe uma lista completa dos pacotes de viagem disponíveis.
* **Busca e Filtros:** Permite que os usuários busquem pacotes por destino, preço e datas, facilitando a busca.
* **Visualização Detalhada:** Exibe todas as informações de um pacote, incluindo descrição, fotos, datas disponíveis, valor e destino.
* **Sistema de Avaliações:** Integra avaliações de clientes nos cards dos pacotes, exibindo média de notas e total de avaliações.
* **Histórico de Pacotes Vistos:** Mantém um registro local dos pacotes visualizados pelo usuário, exibindo-os na seção "Vistos recentemente" da página inicial.
* **Paginação Inteligente:** Sistema de paginação que divide os resultados em páginas de 24 itens para melhor performance e usabilidade.

### 3. Processo de Reserva de Viagem
* **Seleção de Pacote e Data:** A interface permite que o cliente escolha um pacote e uma data de viagem disponíveis.
* **Preenchimento de Dados:** Um formulário para que o cliente insira os dados dos viajantes para a reserva.
* **Cálculo de Valores:** Exibe o cálculo automático de valores como taxas e total da reserva.

### 4. Fluxo de Pagamentos
* **Escolha de Forma de Pagamento:** Permite que o cliente escolha entre diferentes formas de pagamento (cartão de crédito, débito, boleto, PIX) para finalizar a reserva.
* **Confirmação e Comprovante:** Exibe uma tela de confirmação após o pagamento e informa sobre o envio do comprovante por e-mail.

### 5. Módulos Administrativos e de Atendente
* **Painel com Métricas:** Uma interface para administradores visualizarem métricas importantes da agência, como vendas por destino e período.
* **Gerenciamento de Entidades:** Formulários e tabelas para administradores gerenciarem pacotes, reservas e usuários.
* **Suporte ao Cliente:** Interface de busca para atendentes consultarem dados de clientes e reservas para oferecer suporte.
* **Moderação de Avaliações:** Um painel para que administradores possam aprovar ou rejeitar avaliações de clientes.

### 6. Usabilidade e Experiência do Usuário
* **Design Responsivo (Mobile-first):** A aplicação foi desenvolvida para se adaptar e funcionar perfeitamente em dispositivos móveis, garantindo acesso de qualquer lugar.
* **Navegação Intuitiva:** A interface de usuário é desenhada para ser simples e acessível, com uma navegação clara e eficiente.
* **ChatBot com Inteligência Artificial:** Assistente virtual integrado que oferece suporte automatizado aos usuários, com conhecimento específico sobre os processos da Decolei.net e capacidade de integração com APIs de IA como Google Gemini.

### 7. Sistema de Inteligência Artificial e Suporte Automatizado
* **ChatBot Flutuante:** Interface de chat acessível na maioria das páginas através de um botão flutuante no canto inferior direito. O ChatBot é automaticamente ocultado nas páginas de autenticação (login, cadastro e reset de senha) para não interferir no processo de autenticação.
* **Respostas Contextuais:** Sistema inteligente que fornece respostas baseadas na documentação oficial da empresa e nos processos específicos da Decolei.net.
* **Integração Multi-API:** Suporte para  API de IA (Google Gemini).
* **Base de Conhecimento Específica:** Treinamento específico com informações sobre:
  - Processos de reserva e pagamento
  - Formas de pagamento aceitas e prazos de confirmação
  - Funcionalidades da área do cliente
  - Procedimentos de cancelamento e suporte
  - Sistema de avaliações pós-viagem
* **Histórico de Conversa:** Mantém contexto da conversa para respostas mais precisas e personalizadas.