import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { Log } from "../Functions/Logs";

import { User } from "../Models/User";

export default async function Login(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		Log('login.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" })
		return;
	}

	const email = req.body.email;
	const password = req.body.password;

	if (typeof email != 'string') {
		Log('login.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (password.length != 128 || !regexSHA512.test(password)) {
		Log('login.ts', 'WARNING', 'Invalid format for password');
		res.status(400).send({ message: 'The password must be in sha512' })
		return;
	}

	const user = await User.findOne({ email: email });
	if (!user) {
		Log('login.ts', 'WARNING', 'User not found');
		res.status(404).send({ message: 'User not found' });
		return;
	}

	if (user.password.toUpperCase() == password.toUpperCase()) {
		Log('login.ts', 'INFORMATION', 'User "' + email + '" logged in');
		res.send({ message: 'Logged in !' });
		return;
	} else {
		Log('login.ts', 'WARNING', 'Wrong confidentials');
		res.status(400).send({ message: 'Wrong confidentials' });
		return;
	}
}