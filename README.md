# Luna server

## data base

the Luna data base Is a [mongodb](https://www.mongodb.com) data base, she works with a nosql architecture. the interface between mongodb and node js server is [mongoose](https://mongoosejs.com), mongoose is a hight level interface.

## server

the server is the core of the Luna project, it uses mongodb through mongoose to provide its data. the server receives requests through its rest api, after that it processes the requests by checking the conformity of the data. once compliance is confirmed, he can search and send the processed data.

## REST api

the API remains functional with express.

here is a list of possible requests:

### url/api/newUsers

type:

```json
{
	name: string,
	email: string,
	password: Sha512 string
}
```

best response:  'User ' + email + ' created'

other response: see [this](./RouterFuction/createUser.ts)

### url/api/changePassword

type:

```json
{
	email: string,
	newPassword: Sha512 string,
	oldPassword: Sha512 string
}
```

best response : ‘new password is effective’

other response: see [this](./RouterFuction/changePassword.ts)

### url/api/newAdmin

type:

```json
{
	name: string,
	email: string,
	password: Sha512 string,
	login: {
		email: string,
		password: Sha512 string
}
```

best response: 'Admin ' + email + ' created'

other response : see [this](./RouterFuction/createAdmin.ts)

### url/api/deletAdmin

type:

```json
{
	email: string,
	login: {
		email: string,
		password: sha512 string
	}
}
```

best response: 'admin ' + email + ' deleted'

other response: see [this](./RouterFuction/deletAdmin.ts)

### url/api/deletUser

type:

```json
{	
	email: string,
	login: {
		email: string,
		password: Sha512 string
	}
}
```

best response: 'user ' + email + ' deleted'

other response: see [this](./RouterFuction/deletUser.ts)

### url/api/newBox

type:

```json
{
	name: string,
	placment: string,
	size: 3,
	slot: [null, null, null] | [[idUser string, date], [idUser string, date], [idUser string, date]],
	login: {
		email: string,
		password: sha512 string
	}
}
```

best response: 'the ' + name + ' boxe has been creted'

other response : see [this](./RouterFuction/createBox.ts)

### url/api/assign

type:

```json
{
	id: IdBox string,
	IDOfUser: idUser string,
	numberOfSlot: number,
	login: {
		email: string,
		password: sha512 string
}
```

best response: slot attributed with sucess

other response see [this](./RouterFuction/assign.ts)

### url/api/unassign

type:

```json
{
	id: IdBox string,
	numberOfSlot: number,
	login: {
		email: string,
		password: sha512 string
}
```

best response: slot unassigned with sucess

other response see [this](./RouterFuction/unassign.ts)

### url/api/login

type:

```json
{
	email: string,
	password: sha512 string
}
```

best response Logged in !

other response see [this](./RouterFuction/Login.ts)

### url/api/loginAdmin

type:

```json
{
	email: string,
	password: sha512 string
}
```

best response Logged in !

other response see [this](./RouterFuction/LoginAdmin.ts)