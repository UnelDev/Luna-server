# Luna server

## Database

The Luna database is a [Mongo](https://www.mongodb.com) database. The interface between MongoDB and NodeJS server is [Mongoose](https://mongoosejs.com), a high level interface.

## Server

The server is the core of the Luna project, it uses MongoDB via Mongoose to provide its data. The server receives the requests via its REST API, after which it processes the requests by checking the compliance of the data. Once confirmed, it can search and send the processed data.

## REST API

The API works through ExpressJS.

Here is a list of possible queries:

### /api/CreateUser

Type:

```json
{
	name: String,
	email: String,
	password: Sha512 String
}
```

Expected response:  'User ' + email + ' created'

See [this](./RouterFuction/createUser.ts) for errors and other cases.

### /api/ChangePassword

Type:

```json
{
	email: String,
	newPassword: Sha512 String,
	oldPassword: Sha512 String
}
```

Expected response : ‘New password is effective’

See [this](./RouterFuction/changePassword.ts) for errors and other cases.

### /api/ChangeAdminPassword

Type:

```json
{
	email: String,
	oldPassword: Sha512 String,
	newPassword: Sha512 String
}
```

Expected response : ‘Operation success’

See [this](./RouterFuction/changeAdminPassword.ts) for errors and other cases.

### /api/CreateAdmin

Type:

```json
{
	name: String,
	email: String,
	password: Sha512 String,
	login: {
		email: String,
		password: Sha512 String
}
```

Expected response : 'Admin ' + email + ' created'

See [this](./RouterFuction/createAdmin.ts) for errors and other cases.

### /api/DeleteAdmin

Type:

```json
{
	email: String,
	login: {
		email: String,
		password: Sha512 String
	}
}
```

Expected response : 'admin ' + email + ' deleted'

See [this](./RouterFuction/deletAdmin.ts) for errors and other cases.

### /api/DeleteUser

Type:

```json
{	
	email: String,
	login: {
		email: String,
		password: Sha512 String
	}
}
```

Expected response : 'user ' + email + ' deleted'

See [this](./RouterFuction/deletUser.ts) for errors and other cases.

### /api/CreateBox

Type:

```json
{
	name: String,
	placement: String,
	size: 3,
	slot: [null, null, null] | [[idUser String, date], [idUser String, date], [idUser String, date]],
	login: {
		email: String,
		password: Sha512 String
	}
}
```

Expected response : 'Box ' + name + ' created'

See [this](./RouterFuction/createBox.ts) for errors and other cases.

### /api/Assign

Type:

```json
{
	id: IdBox String,
	IDOfUser: idUser String,
	numberOfSlot: number,
	login: {
		email: String,
		password: Sha512 String
}
```

Expected response : Slot attributed with success

See [this](./RouterFuction/assign.ts) for errors and other cases.

### /api/Unassign

Type:

```json
{
	id: IdBox String,
	numberOfSlot: Number,
	login: {
		email: String,
		password: Sha512 String
}
```

Expected response: Slot unassigned with sucess

See [this](./RouterFuction/unassign.ts) for errors and other cases.

### /api/Login

Type:

```json
{
	email: string,
	password: sha512 string
}
```

best response Logged in !

other response see [this](./RouterFuction/Login.ts)

### url/api/LoginAdmin

type:

```json
{
	email: string,
	password: sha512 string
}
```

best response Logged in !

other response see [this](./RouterFuction/LoginAdmin.ts)