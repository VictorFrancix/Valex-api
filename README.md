<p align="center">
  <img  src="https://cdn.iconscout.com/icon/free/png-256/credit-card-2650080-2196542.png">
</p>
<h1 align="center">
  Valex
</h1>
<div align="center">

  <h3>Built With</h3>

  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" height="30px"/>  
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express.js&logoColor=white" height="30px"/>
  <img src="https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" height="30px"/>
  <!-- Badges source: https://dev.to/envoy_/150-badges-for-github-pnk -->
</div>

</p>

## Usage

```bash
$ git clone https://github.com/VictorFrancix/valex-api

$ cd valex-api

$ npm install

$ npm run dev
```

## 🛸 Routes:

```yml
- POST /cards (autenticada)
    - Rota para cadastrar um novo cartão
    - headers: {
        "x-api-key": "$APIKey"
    }
    - body: {
        "employeeId": $id,
        "type": "groceries", "restaurants", "transport", "education" ou "health"
}
```
```yml
- PATCH /cards/:cardId/activate
    - Rota para ativar um cartão
    - headers: {}
    - body: {
        "cvc": "$cvc",
        "password": "$password"
    }
```
```yml
- GET /transactions/:cardId
    - Rota para listar as transações e saldo de um cartão
    - headers: {}
    - body: {}
```
```yml
- PATCH /cards/:cardId/block
    - Rota para bloquear um cartão
    - headers: {}
    - body: {
        "password": "$password"
    }
```
```yml
- PATCH /cards/:cardId/unlock
    - Rota para desbloquear um cartão
    - headers: {}
    - body: {
        "password": "$password"
    }
```
```yml
- POST /recharge (autenticada)
    - Rota para recarregar um cartão
    - headers: {
        "x-api-key": "$APIKey"
    }
    - body: {
        "cardId": $id,
        "amount": $amount
    }
```
```yml
- POST /payment
    - Rota para efetuar uma compra
    - headers: {}
    - body: {
        "cardId": $id,
        "password": "$password",
        "businessId": $id,
        "amount": $amount
    }
```
