import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { log } from "../Functions/Logs";
import { Admin } from "../Models/Admin";;

export default async function loginAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		log('loginAdmin.ts', 'WARNING', 'admin wants to log in with bad object');
		res.status(400).send({ message: "Specify { email: string, password: sha512string }" });
		return;
	}

	const email = req.body.email;
	const password = req.body.password;

	if (typeof email != 'string') {
		log('loginAdmin.ts', 'WARNING', 'admin wants to log in with non-string email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (password.length != 128 || !regexSHA512.test(password)) {
		log('loginAdmin.ts', 'WARNING', 'admin ' + email + ' wants to log in with non-sha512 password');
		res.status(400).send({ message: 'The password must be in sha512' });
		return;
	}

	const user = await Admin.findOne({ email: email });
	if (!user) {
		log('loginAdmin.ts', 'WARNING', 'admin ' + email + ' not found');
		res.status(404).send({ message: 'Admin not found' });
		return;
	}

	if (user.password.toUpperCase() == password.toUpperCase()) {
		log('loginAdmin.ts', 'INFORMATION', 'admin ' + email + ' connected');
		res.send({ message: 'Logged in !' });
		return;
	} else {
		log('loginAdmin.ts', 'WARNING', 'admin loginAdminPassword@example.com wants to log in with wrong password');
		res.status(400).send({ message: 'Wrong confidentials' });
		return;
	}
}