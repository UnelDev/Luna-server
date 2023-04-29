import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { log } from "../Functions/Logs";
import { User } from "../Models/User";

export default async function Login(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		log('login.ts', 'WARNING', 'login has been call with wrong body');
		res.status(400).send({ message: "Specify { email: string, password: sha512string }" })
		return;
	}

	const email = req.body.email;
	const password = req.body.password;

	if (typeof email != 'string') {
		log('login.ts', 'WARNING', 'user wants to log in with non-string email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (password.length != 128 || !regexSHA512.test(password)) {
		log('login.ts', 'WARNING', 'user loginPassword@example.com wants to log in with non-sha512 password');
		res.status(400).send({ message: 'The password must be in sha512' })
		return;
	}

	const user = await User.findOne({ email: email });
	if (!user) {
		log('login.ts', 'WARNING', 'user ' + email + ' not found');
		res.status(404).send({ message: 'User not found' });
		return;
	}

	if (user.password.toUpperCase() == password.toUpperCase()) {
		log('login.ts', 'INFORMATION', 'user ' + email + ' logined');
		res.send({ message: 'Logged in !' });
		return;
	} else {
		log('login.ts', 'WARNING', 'the user ' + email + ' wanted to connect without valid password');
		res.status(400).send({ message: 'Wrong confidentials' });
		return;
	}
}