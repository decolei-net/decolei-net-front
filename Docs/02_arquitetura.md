# Arquitetura e Padrões de Design do Frontend

A arquitetura do frontend do Decolei.net é construída em torno de princípios de modularidade, reusabilidade e gerenciamento de estado centralizado, para garantir um código escalável e fácil de manter.

### 1. Arquitetura Orientada a Componentes (React)

* **O que é:** O projeto adota uma arquitetura orientada a componentes, onde cada parte da interface (botões, cards, menus) é um componente independente e reutilizável.
* **Por que foi escolhida:** Essa abordagem permite que a interface seja construída de forma modular, como blocos de montar. Isso facilita o desenvolvimento paralelo, a reutilização de código e o isolamento de funcionalidades, tornando a manutenção e a adição de novas features mais ágeis.

### 2. Gerenciamento de Estado Centralizado (Redux Toolkit)

* **O que é:** O Redux Toolkit é usado para criar um "estado global" que é acessível a todos os componentes da aplicação. Em vez de passar dados de forma complexa entre componentes, eles podem acessar as informações diretamente do estado central.
* **Por que foi escolhido:** Garante que o estado da aplicação (ex: dados do usuário logado, status das reservas) seja consistente em todos os lugares. Isso evita inconsistências e facilita o rastreamento e depuração de problemas.

### 3. Roteamento (React Router DOM)

* **O que é:** A biblioteca `react-router-dom` é utilizada para gerenciar a navegação entre as diferentes "páginas" da aplicação sem a necessidade de recarregar a página inteira no navegador.
* **Por que foi escolhido:** Proporciona uma experiência de usuário fluida e rápida, similar a uma aplicação nativa, e permite que cada página tenha sua própria URL para facilitar o compartilhamento e a navegação.

### 4. Estilização (Tailwind CSS)

* **O que é:** A estilização segue uma abordagem "utility-first" com o Tailwind CSS, onde classes pré-definidas são aplicadas diretamente no código JSX para estilizar os componentes.
* **Por que foi escolhido:** Acelera o processo de design e implementação, garante a consistência visual em toda a aplicação e facilita a criação de layouts responsivos sem a necessidade de arquivos CSS separados e complexos.

### 5. Estrutura de Pastas do Projeto

A organização de pastas do projeto `decolei-net-front` é um reflexo direto de sua arquitetura. A pasta `src/` contém a seguinte estrutura lógica:

* **`/assets`**: Contém arquivos estáticos como imagens, ícones e fontes.
* **`/components`**: Pasta dedicada a componentes pequenos e reutilizáveis, que podem ser usados em múltiplas páginas (ex: `Card`, `NavBar`, `Button`).
* **`/layouts`**: Contém componentes que definem o layout geral das páginas, como headers, sidebars e footers, que são reutilizados em vários lugares (ex: `AdminLayout`, `ClienteLayout`).
* **`/Pages`**: Contém as pastas para as "páginas" principais da aplicação, que são as telas completas que o usuário navega (ex: `/Login`, `/Dashboards`, `/Reserva`).
* **`/routes`**: Contém as configurações de roteamento da aplicação, que mapeiam as URLs para os componentes das páginas.
* **`/services`**: Responsável por toda a lógica de comunicação com a API backend, gerenciando requisições e respostas de forma centralizada (ex: `authService.js`, `pacoteService.js` utilizando Axios).
* **`/store`**: Contém a configuração do estado global da aplicação usando Redux Toolkit (ex: `authSlice.js` para o estado de autenticação).
* **`/stories`**: Contém a documentação e visualização isolada dos componentes via Storybook.