# Decolei.net Frontend

Este projeto é uma aplicação web desenvolvida em React, utilizando Tailwind CSS para estilização.

## Pré-requisitos

- Node.js (recomendado versão 18 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Instale as dependências:
   ```sh
   npm install
   ```
2. Sempre que der git pull, lembre-se de dar npm install

## Executando o projeto

Para rodar o ambiente de desenvolvimento:

```sh
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador para visualizar a aplicação.

## Scripts disponíveis

- `npm start` — Executa o app em modo desenvolvimento
- `npm run build` — Gera build de produção na pasta `build`
- `npm test` — Executa os testes automatizados

## Testes

Para rodar os testes:

```sh
npm test
```

## Storybook

O Storybook permite visualizar e documentar componentes isolados do seu projeto React.

### Instalação

Se ainda não estiver instalado, execute:

```sh
npm install --save-dev storybook @storybook/react
npx storybook init
```

### Executando o Storybook

Para iniciar o Storybook:

```sh
npm run storybook
```

O Storybook abrirá em [http://localhost:6006](http://localhost:6006).

### Como usar

- Crie arquivos com extensão `.stories.js` ou `.stories.jsx` na pasta `src/` para cada componente que deseja documentar.
- Exemplo de story:
  ```js
  // src/components/Button.stories.jsx
  import Button from './Button';
  export default { title: 'Button', component: Button };
  export const Default = () => <Button>Texto</Button>;
  ```

Consulte a [Documentação do Storybook](https://storybook.js.org/docs/react/get-started/introduction) para mais detalhes.

## Personalização

- As configurações do Tailwind estão em `tailwind.config.js`.
- Os arquivos principais do app estão na pasta `src/`.
- Para alterar variáveis de cor, edite o arquivo `src/App.css` ou as configurações do Tailwind.

## Dicas

- Caso precise instalar novas dependências, utilize `npm install <nome-do-pacote>`.
- Para produção, utilize `npm run build` e faça o deploy do conteúdo da pasta `build`.

## Documentação

- [Documentação do React](https://react.dev/)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs/installation)

- [Documentação do Storybook](https://storybook.js.org/docs/react/get-started/introduction)

Em caso de dúvidas, consulte os arquivos de configuração ou a documentação oficial das ferramentas utilizadas.

## Recomendações de Extensões para VS Code

Para facilitar o desenvolvimento e garantir padronização, instale as seguintes extensões no VS Code:

- **ESLint** (dbaeumer.vscode-eslint): Lint para JavaScript/React.
- **Prettier - Code formatter** (esbenp.prettier-vscode): Formatação automática de código.
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss): Autocompletar e dicas do Tailwind.
- **Simple React Snippets** (burkeholland.simple-react-snippets): Snippets para React.
- **GitLens — Git supercharged** (eamodio.gitlens): Ferramentas avançadas para Git.
- **VSCode Storybook** (storybook.vscode-storybook): Integração e navegação de stories do Storybook.
- **Jest** (Orta.vscode-jest): Rodar e visualizar testes do Jest.
- **Import Cost** (wix.vscode-import-cost): Mostra o tamanho dos pacotes importados.
- **Path Intellisense** (christian-kohler.path-intellisense): Autocompleta caminhos de arquivos.
- **Auto Rename Tag** (formulahendry.auto-rename-tag): Renomeia automaticamente tags HTML/JSX.
- **Bracket Pair Colorizer 2** (CoenraadS.bracket-pair-colorizer-2): Colore pares de colchetes.
- **EditorConfig for VS Code** (EditorConfig.EditorConfig): Respeita configurações de formatação do projeto.

Essas extensões ajudam na produtividade, organização e qualidade do código.

## Padrão de commits

Neste repositório, o padrão de commit segue o **[Conventional Commits](https://www.conventionalcommits.org/pt-br)**.

- `feat` — Commits do tipo feat indicam que seu código está incluindo uma **nova funcionalidade** (relacionado ao MINOR do versionamento semântico).

- `fix` — Commits do tipo fix indicam que seu código está **corrigindo um problema** (bug), (relacionado ao PATCH do versionamento semântico).

- `docs` — Commits do tipo docs indicam que houve **alteração na documentação**, como no Readme do repositório. (Não inclui mudanças de código).

- `test` — Commits do tipo test são usados quando há **alterações em testes**, seja criando, alterando ou excluindo testes unitários. (Não inclui mudanças de código)

- `build` — Commits do tipo build são usados para modificações em **arquivos de build e dependências**.

- `perf` — Commits do tipo perf identificam mudanças de código relacionadas à **performance**.

- `style` — Commits do tipo style indicam mudanças relacionadas à **formatação do código**, ponto e vírgula, espaços, lint... (Não inclui mudanças de código).

- `refactor` — Commits do tipo refactor referem-se a **refatorações que não alteram a funcionalidade**, como mudança na forma de processar uma parte da tela, mas mantendo a mesma funcionalidade, ou melhorias de performance por revisão de código.

- `chore` — Commits do tipo chore indicam **atualizações de tarefas de build**, configurações administrativas, pacotes... como adicionar um pacote ao gitignore. (Não inclui mudanças de código)

- `ci` — Commits do tipo ci indicam mudanças relacionadas à **integração contínua** (_continuous integration_).
