# uniteller-node
Модуль для интеграции node проекта с системой оплаты от [Uniteller](https://www.uniteller.ru/). В текущей версии доступно всего 2 метода:
1. getPaymentLink - запрос на получение платёжной ссылки
2. checkPaymentStatus - проверка статуса оплаты

Другие методы сервиса Uniteller будут добавлены в последующих версиях данного модуля.

## Install
```
npm i uniteller-node // or yarn add uniteller-node
```

## Usage
```
const Uniteller = require('uniteller-node')({
	UPID: '00000000',
	LOGIN: '0000',
	PASSWORD: 'YOUR PASSWORD',
	URL: 'UNITALLER CALLBACK URL',
	DEBUG: true or false
})

Uniteller.getPaymentLink({orderId: 'ORDERID', amount: 500})
Uniteller.getPaymentLink({amount: 500})
// если не указать параметр orderId в методе getPaymentLink, тогда orderId будет создан автоматически на стороне Uniteller и вернётся в ответе данного метода в параметре OrderID.

Uniteller.checkPaymentStatus({orderId: 'ORDERID'})
```
### Значения параметров для подключения модуля
Все параметры можно найти в вашем личном кабинете (ЛК) по адресу [https://lk.uniteller.ru/](https://lk.uniteller.ru/)

#### UPID - идентификатор точки продажи
Расположение параметра в ЛК [https://lk.uniteller.ru/#/upoints/filter](https://lk.uniteller.ru/#/upoints/filter)
Uniteller Point ID - состоит из цифр

#### LOGIN - логин параметров авторизации
! Не путайте с логином от личного кабинета.
Расположение параметра в ЛК [https://lk.uniteller.ru/#/authparams/](https://lk.uniteller.ru/#/authparams/)

#### PASSWORD - пароль параметров авторизации
! Не путайте с паролем от личного кабинета.
Расположение параметра в ЛК [https://lk.uniteller.ru/#/authparams/](https://lk.uniteller.ru/#/authparams/)

#### URL
Адрес куда будет перенаправлен пользователь, если он нажмёт на ссылку "вернуться в магазин"

#### DEBUG
Включение режима отладки