# Control Finance

<br>

## Drescrição do projeto

<p>
O <strong>Control Finance</strong> foi desenvolvido para oferecer uma forma simples e eficiente de gerenciar as finanças pessoais. Seu principal objetivo é centralizar todos os gastos do usuário em um único lugar, proporcionando uma visão clara e organizada das despesas.
  
Um exemplo comum que gera confusão é quando uma compra feita no cartão de crédito só é processada dias ou até semanas depois, dificultando o controle sobre o quanto já foi gasto e quanto ainda está disponível.

Essa API busca minimizar esse tipo de frustração, registrando cada compra realizada e organizando automaticamente as faturas com todos os lançamentos, tanto os atuais quanto os futuros. Dessa forma, o usuário pode acompanhar suas finanças com mais precisão e tomar decisões mais conscientes sobre seus gastos.
</p>

<br>

## Principais responsabilidades da API
  
- Gerenciar as compras realizadas pelo usuário.
- Categorizas cada compra.
- Criar aplicações de reservas, semelhantes às caixinhas das instituições financeiras.
- Apresentar as movimentações realizadas.

<br>

## Tecnologias utilizadas

- Node.js
- TypeScripty
- Prisma
- Docker-compose
- PostgreSQL
- Jest

<br>

## Instalação do projeto

<br>

<p>
  Faça a instalação das depêndencias do projeto: 
</p>

  ```
    npm install
  ```

<p>
  Para poder trabalhar com este projeto, é necessário ter o docker em sua máquina para poder criar a imagem do postgreSql no docker-compose. Já com o docker instalado, execute o seguinte comando no diretorio do projeto para criar a image do banco:
</p>


- Para windows:
  ```
  
    docker-compose up -d
  
  ```

- Para linux:
  ```
  
    sudo docker-compose up -d
  
  ```

  <br>

<p>
  Após ter criado a imagem docker, você deve executar as migrations para inicializar o banco, execute no diretorio do projeto o seguinte comando:
</p>

```

  npx prisma migrate dev

```
  



  

















