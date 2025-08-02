# Componentes Principais

A arquitetura do frontend é baseada em componentes que são desenvolvidos para serem reutilizáveis em diferentes partes da aplicação. A maioria desses componentes são documentados e visualizados isoladamente através do **Storybook** (disponível em `http://localhost:6006`).

### 1. Componentes de Layout (`/layouts`)

Estes componentes fornecem a estrutura e a base para as diferentes páginas da aplicação, garantindo uma interface consistente para cada perfil de usuário.

* `AdminLayout.jsx`: Define o layout principal para a área administrativa.
* `AtendenteLayout.jsx`: Define o layout específico para o perfil de atendente.
* `ClienteLayout.jsx`: O layout base para a área do cliente, com o histórico de reservas e dados de perfil.
* `AuthLayout.jsx`: O layout utilizado nas páginas de autenticação, como login e cadastro.

### 2. Componentes da Interface (`/components`)

Estes são blocos de construção genéricos e especializados que compõem as páginas.

* `NavBar.jsx`: Componente de navegação principal, presente na maioria das páginas.
* `SideBar.jsx`, `AdminSideBar.jsx`, `AtendenteSideBar.jsx`: Componentes de barra lateral, específicos para os diferentes perfis de usuário.
* `Card.jsx`: Um componente reutilizável para exibir informações de forma organizada, como os pacotes de viagem na tela inicial.
* `ClienteResumoCard.jsx`: Um card específico para mostrar informações resumidas de um cliente, provavelmente usado no painel de atendente.
* `TabelaHistoricoReservas.jsx`: Tabela para exibir o histórico de reservas de um cliente.
* `TabelaReservasBusca.jsx`: Tabela para listar reservas no painel de busca do administrador.
* `LogoutButton.jsx`: Botão para realizar o logout do usuário de forma segura.
* `ModalDetalhesReservas.jsx`: Componente de modal para exibir informações detalhadas de uma reserva.
* `StarRating.jsx`: Componente visual para exibir ou permitir a seleção de notas de 1 a 5, utilizado nas avaliações.
* `Pagination.jsx`: Componente de paginação para navegar entre grandes listas de dados.
* `FiltroStatusReserva.jsx`: Componente de filtro para a lista de reservas, permitindo filtrar por status.
* `ChatBot.jsx`: Componente de chat inteligente com IA que oferece suporte automatizado aos usuários. Apresenta um botão flutuante na interface e uma caixa de diálogo interativa para conversas em tempo real.

### 3. Componentes de Roteamento (`/routes`)

* `AppRoutes.jsx`: O componente principal que define as rotas da aplicação, mapeando as URLs para os componentes de página e garantindo que o layout e as permissões corretas sejam aplicados.
* `PrivateRoute.jsx` e `PublicRoute.jsx`: Componentes que controlam o acesso às rotas, garantindo que usuários autenticados acessem as páginas corretas e que usuários não autenticados sejam redirecionados.