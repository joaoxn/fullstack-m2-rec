# TrainSys

**TrainSys** é uma ferramenta desenvolvida para **treinadores de academia**, com o objetivo de facilitar o **gerenciamento de alunos**, **treinos** e **exercícios**. Com o TrainSys, treinadores podem facilmente criar e organizar a estrutura e agenda de treinos para suas academias e alunos.

## Tecnologias Utilizadas

Este projeto foi construído utilizando:

- **Angular** como framework principal.
- **Angular Material** para componentes de UI.
- **NgMask** para manipulação de máscaras de input.
- **HTML**, **TypeScript** e **SCSS** para desenvolvimento front-end.
- **JSON Server** como simulação de um back-end, utilizando um arquivo `.json`.

## Como Executar o Projeto

Para rodar o TrainSys localmente, siga os passos abaixo:

1. **Clone o repositório e abra o terminal na raiz do projeto Angular.**
   
2. **Inicie o servidor local:**
   ```bash
   ng serve
   ```
   > **IMPORTANTE**: Certifique-se de ter o Angular CLI instalado. Caso não tenha, instale com o seguinte comando:
   ```bash
   npm install -g @angular/cli
   ```

3. **Inicie o servidor de dados JSON:**
   ```bash
   json-server ./src/db/db.json
   ```
   > **IMPORTANTE**: O JSON Server deve estar instalado. Para instalar, use o comando:
   ```bash
   npm install json-server
   ```

4. **Acesse o site** em `http://localhost:4200` e explore as funcionalidades!

## Funcionalidades

- **Página de Login e Cadastro**: Permite que usuários se cadastrem e façam login para acessar a plataforma.

- **Gerenciamento de Treinos**: Treinadores podem montar e ajustar treinos específicos para cada aluno.

- **Gerenciamento de Exercícios**: Treinadores podem adicioar ou remover exercícios existentes, para adicionar futuramente aos seus treinos. 

- **Gerenciamento de Alunos**: Treinadores podem criar, editar, visualizar ou remover alunos, com seus respectivos dados, e que poderá ter treinos montados na página de gerenciamento de treino.

## Possíveis Melhorias

O projeto foi pensado para ser facilmente expansível, e algumas melhorias futuras incluem:

- **Estado de conclusão dos treinos**: Adicionar a opção de marcar treinos como concluídos ou não.

- **Alertas interativos**: Implementar feedbacks visuais com **dialogs** ou **snackbars** para as ações do usuário.

- **Cadastro otimizado de treinos**: Permitir a criação de treinos reutilizáveis entre alunos e dias da semana, evitando a repetição de treinos idênticos.

## Demonstração

Assista a uma **demonstração do TrainSys** no vídeo abaixo:

[Ver Vídeo](https://drive.google.com/file/d/1bLMmaC-h0VYDK9EuWHhbaczB3yRnu6Ib/view?usp=sharing)
