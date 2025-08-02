# Instruções de Instalação e Execução do Frontend

Esta seção detalha os passos necessários para configurar o ambiente de desenvolvimento e executar o frontend do Decolei.net localmente.

### Pré-requisitos

Certifique-se de que as seguintes ferramentas estejam instaladas em sua máquina:

* **Node.js:** Versão `18` ou superior é recomendada.
* **npm:** O gerenciador de pacotes do Node.js.
* **Git:** Para clonar o repositório.

### Passos para Configuração e Execução

1.  **Clonar o Repositório:**
    * Abra seu terminal e navegue até o diretório onde deseja armazenar o projeto.
    * Clone o repositório do frontend:
        ```bash
        git clone [https://github.com/decolei-net/decolei-net-front.git](https://github.com/decolei-net/decolei-net-front.git)
        ```
    * Navegue para a pasta do projeto:
        ```bash
        cd decolei-net-front
        ```

2.  **Instalar as Dependências:**
    * Use o `npm` para instalar todas as dependências do projeto listadas no `package.json`:
        ```bash
        npm install
        ```
    * **Observação:** É uma boa prática executar este comando sempre que você fizer um `git pull` para garantir que todas as novas dependências estejam instaladas.

3.  **Configurar a URL da API do Backend:**
    * Crie um arquivo `.env` na raiz do projeto (na mesma pasta do `package.json`).
    * Adicione a URL do backend, substituindo `[PORTA_DA_API]` pela porta real em que seu backend está rodando:
        ```
        VITE_API_URL=https://localhost:[PORTA_DA_API]/api
        ```
    * **Atenção:** Certifique-se de que o backend esteja em execução para que o frontend possa se comunicar com ele.

4.  **Executar o Projeto:**
    * Use o comando para iniciar o servidor de desenvolvimento do Vite:
        ```bash
        npm run dev
        ```
    * O console indicará que o servidor está rodando, e você poderá acessar a aplicação em:
        `http://localhost:5173` (ou outra porta, dependendo da sua configuração).

### Scripts e Ferramentas Adicionais

* **Build para Produção:**
    ```bash
    npm run build
    ```
    * Este comando gera os arquivos otimizados para produção na pasta `dist/`.

* **Executar Testes:**
    ```bash
    npm test
    ```
    * Inicia o Vitest para executar os testes automatizados do projeto.

* **Executar o Storybook:**
    ```bash
    npm run storybook
    ```
    * Inicia a ferramenta Storybook para visualizar e documentar os componentes isoladamente. A URL padrão é `http://localhost:6006`.