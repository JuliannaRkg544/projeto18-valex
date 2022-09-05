# projeto18-valex

## API 
- POST /card-creation (autenticada)
    - Rota para cadastrar um novo cartão
    - headers: {"x-api-key":$"hashApiKey"}
    - body: {
        "employeeid":$idColaborador,
        "cardtype":"$tipoDeNegócio"
    }

- POST /card/activation
    - Rota para ativar um cartão    
    - body: {
        "cardNumber": $"NúmeroDoCartão",
        "cardholderName":$"NomeDoColaborador",
        "expirationDate":$"DataExpiração",
        "cvc":$"CódigoCVC",
        "password":$"senha"
    }
- GET /card/balance/:idCartão
    - Rota para listar todos movimentos do cartão por número de id do cartão 
    
- PUT /card-block
    - Rota para bloquear um cartão pelo numero do cartão
    - body: {
        "cardNumber":$"numeroDoCartão",
        "password":$"senhadoCartão"
    }

- PUT /card-unblock
    - Rota para desbloquear um cartão numero do cartão
    - body: {
        "cardNumber":$"numeroDoCartão",
        "password":$"senhadoCartão"
    }

- POST /card-recharge (autenticada)
    - Rota para a empresa recarregar o cartão um usuário pelo número do cartão
    - headers: {"x-api-key":$"hashApiKey"}
    - body: {
        "cardNumber":$"numeroDoCartão",
        "rechargeValue":$"valorDeRecarga"
    }

- POST /card-shopping
    - Rota para registrar pagamentos pelo número do cartão    
    - body:
        "cardNumber":$"numeroDoCartão",
        "password":$"senhaDoCartão",
        "businessId":$"idDoTipoDeNegócioDoCartão",
        "purchaseValue":$"valorDaCompra"
         
