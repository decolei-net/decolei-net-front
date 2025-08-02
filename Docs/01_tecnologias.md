# Tecnologias Utilizadas no Frontend

O frontend do Decolei.net é construído sobre uma pilha de tecnologias modernas do ecossistema JavaScript, escolhidas para garantir uma experiência de desenvolvimento eficiente e um produto final de alta qualidade.

### Core e Ferramentas de Build

* **React:**
    * **O que é:** Uma biblioteca JavaScript para construir interfaces de usuário baseada em componentes.
    * **Por que foi escolhido:** A abordagem baseada em componentes facilita a construção de interfaces complexas de forma modular, reutilizável e escalável, ideal para uma aplicação como a de uma agência de viagens.

* **Vite:**
    * **O que é:** Uma ferramenta de build (como um servidor de desenvolvimento local) que oferece um ambiente de desenvolvimento extremamente rápido para projetos modernos de JavaScript.
    * **Por que foi escolhido:** O Vite acelera o tempo de carregamento da aplicação durante o desenvolvimento e otimiza o build final para produção, resultando em maior produtividade para a equipe e melhor performance para o usuário final.

* **Tailwind CSS:**
    * **O que é:** Um framework de CSS que fornece classes de utilidade prito para a criação rápida de interfaces personalizadas e responsivas.
    * **Por que foi escolhido:** A metodologia de "utility-first" do Tailwind permite estilizar a aplicação diretamente no código JSX, eliminando a necessidade de escrever CSS complexo e tornando o design mais consistente e rápido de implementar.

### Gerenciamento de Estado

* **Redux Toolkit & React Redux:**
    * **O que é:** Uma biblioteca para gerenciar o estado global da aplicação de forma previsível. O Redux Toolkit simplifica a configuração do Redux, e o React Redux conecta o Redux à interface do React.
    * **Por que foi escolhido:** Permite o compartilhamento de dados entre componentes de forma eficiente e centralizada, o que é essencial para aplicações complexas com muitos módulos (pacotes, reservas, usuários).

### Comunicação com a API

* **Axios:**
    * **O que é:** Um cliente HTTP baseado em Promises, usado para fazer requisições para a API backend.
    * **Por que foi escolhido:** Facilita a comunicação com a API RESTful, oferecendo uma sintaxe clara para requisições assíncronas, gerenciamento de erros e interceptadores para tratamento de tokens (JWT).

* **jwt-decode:**
    * **O que é:** Uma pequena biblioteca para decodificar tokens JWT (JSON Web Tokens) no lado do cliente.
    * **Por que foi escolhido:** Permite que a aplicação frontend acesse de forma segura as informações do usuário (como nome, email, e role) armazenadas no token, sem a necessidade de fazer requisições adicionais à API.

### Componentes e Animações

* **lucide-react:**
    * **O que é:** Uma biblioteca de ícones vetoriais leves e personalizáveis para React.
    * **Por que foi escolhido:** Permite a inclusão de ícones modernos e de alta qualidade em toda a interface de forma consistente e com baixo impacto na performance.

* **framer-motion:**
    * **O que é:** Uma biblioteca de animação para o React, focada em tornar as animações simples e poderosas.
    * **Por que foi escolhido:** Adiciona vida à interface, permitindo a criação de animações suaves e interativas para aprimorar a experiência do usuário.

### Testes e Qualidade de Código

* **Vitest:**
    * **O que é:** Um framework de testes unitários para o ecossistema JavaScript.
    * **Por que foi escolhido:** Oferece uma experiência de teste rápida e eficiente, com sintaxe similar ao Jest, mas otimizado para funcionar com o Vite.

* **Storybook:**
    * **O que é:** Uma ferramenta para o desenvolvimento, teste e documentação de componentes de interface isoladamente.
    * **Por que foi escolhido:** Permite que a equipe construa e documente componentes de forma isolada, facilitando a reutilização, a colaboração entre desenvolvedores e designers, e garantindo a consistência visual em toda a aplicação.

* **Playwright:**
    * **O que é:** Uma biblioteca de automação para testes de ponta a ponta (end-to-end), usada para simular a interação de um usuário com o navegador.
    * **Por que foi escolhido:** Permite a validação de fluxos complexos da aplicação (como login, busca de pacotes e reserva), garantindo que a experiência do usuário final funcione como esperado.

* **ESLint & Prettier:**
    * **O que é:** Ferramentas de análise estática e formatação de código. O ESLint ajuda a encontrar erros e problemas de estilo, enquanto o Prettier formata o código de forma consistente.
    * **Por que foi escolhido:** Essenciais para manter a qualidade, a legibilidade e a consistência do código ao longo do desenvolvimento.

### Inteligência Artificial e ChatBot

* **Google Gemini API:**
    * **O que é:** API de inteligência artificial do Google que oferece capacidades avançadas de processamento de linguagem natural através do modelo Gemini.
    * **Por que foi escolhido:** Funciona como alternativa ao OpenAI, garantindo redundância no serviço de IA e permitindo escolher o melhor modelo para diferentes tipos de consultas.

* **Fetch API:**
    * **O que é:** API nativa do JavaScript para realizar requisições HTTP de forma moderna e baseada em Promises.
    * **Por que foi escolhido:** Utilizada especificamente para comunicação com as APIs de IA, oferecendo uma abordagem mais leve que o Axios para essas requisições específicas.