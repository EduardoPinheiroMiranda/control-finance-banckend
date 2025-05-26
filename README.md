# 💰 Control Finance API

## 📄 Descrição do Projeto

O **Control Finance** é uma API desenvolvida para oferecer uma maneira simples e eficiente de gerenciar finanças pessoais. Seu principal objetivo é centralizar todos os gastos do usuário em um único lugar, proporcionando uma visão clara, organizada e atualizada das despesas.

Um problema comum no controle financeiro é quando uma compra realizada no cartão de crédito só aparece na fatura dias ou até semanas depois, dificultando o acompanhamento dos gastos e do saldo disponível.

Essa API foi criada justamente para resolver esse tipo de problema. Ela permite registrar cada compra no momento em que é realizada, organizar automaticamente as faturas (atuais e futuras) e oferecer uma visão detalhada das movimentações. Assim, o usuário tem total controle sobre suas finanças e pode tomar decisões mais conscientes.

<br>

---

## 🚀 Funcionalidades da API

- ✅ Gerenciar compras realizadas pelo usuário.
- ✅ Categorizar cada compra.
- ✅ Criar aplicações de reservas (semelhantes às "caixinhas" dos bancos digitais).
- ✅ Apresentar todas as movimentações financeiras (entradas, saídas e reservas).

<br>

---

## 🛠️ Tecnologias Utilizadas

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker e Docker Compose
- Jest (testes)

<br>

---

## ⚙️ Instalação e Configuração do Projeto

### 🔧 Pré-requisitos

- **Node.js** (v18 ou superior)
- **Docker** e **Docker Compose** instalados na máquina
- **NPM** ou **Yarn**

### 📥 Instalação das dependências

Execute no terminal:

```bash
npm install
```

### 🐳 Subindo o banco de dados com Docker

No diretório raiz do projeto, execute:

- ### Windows

```bash
docker-compose up -d
```


- ### Linux

```bash
sudo docker-compose up -d
```

### 🗄️ Executando as migrations do banco

Após o container do banco estar rodando, execute:

```bash
npx prisma migrate dev
```
    
- Esse comando cria o banco de dados e executa as migrations necessárias para iniciar o projeto.

<br>

---
## 💻 Scripts Disponíveis


| Comando              | Descrição                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`        | Inicia o servidor em modo desenvolvimento                                                                                 |
| `npm run test`       | Executa todos os testes do projeto                                                                                        |
| `npm run test:watch` | Executa os testes em modo observação, reiniciando ao detectar alterações no código                                        |
| `npm run test:debug` | Permite executar os testes com o debugger do VSCode. Após rodar, pressione `Ctrl + F5` no VSCode para iniciar a depuração |

<br>

----
## 🏗️ Estrutura Geral

```bash
📦 src
┣ 📂 @types              # Tipagens globais da aplicação
┣ 📂 cron-jobs           # Jobs agendados (ex.: verificações recorrentes, atualizações)
┣ 📂 env                 # Configuração e validação das variáveis de ambiente
┣ 📂 errors              # Definição de erros e exceptions personalizados
┣ 📂 factories           # Factories para instanciar dependências.
┣ 📂 http                # Camada HTTP (entrada da aplicação)
┃ ┣ 📂 controllers       # Controllers: recebem as requisições e retornam respostas
┃ ┗ 📂 routes            # Definição e organização das rotas
┣ 📂 libs                # Bibliotecas externas ou helpers integrados (ex.: integração com serviços externos)
┣ 📂 middlewares         # Middlewares globais (ex.: autenticação, logs, validações)
┣ 📂 repositories        # Camada de acesso aos dados (banco de dados, cache, etc.)
┣ 📂 services            # Regras de negócio e casos de uso
┣ 📂 utils               # Funções utilitárias e helpers gerais
┣ 📜 app.ts              # Arquivo principal de configuração da aplicação (middlewares, rotas, etc.)
┗ 📜 server.ts           # Ponto de entrada do servidor (starta a aplicação)
```