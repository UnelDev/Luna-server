import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { Log } from "../Functions/Logs";

import { Admin } from "../Models/Admin";

export default async function loginAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		Log('loginAdmin.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" })
		return;
	}

	const email = req.body.email;
	const password = req.body.password;

	if (typeof email != 'string') {
		Log('loginAdmin.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (password.length != 128 || !regexSHA512.test(password)) {
		Log('loginAdmin.ts', 'WARNING', 'Invalid format for password');
		res.status(400).send({ message: 'The password must be in sha512' })
		return;
	}

	const user = await Admin.findOne({ email: email });
	if (!user) {
		Log('loginAdmin.ts', 'WARNING', 'Admin not found');
		res.status(404).send({ message: 'Admin not found' });
		return;
	}

	if (user.password.toUpperCase() == password.toUpperCase()) {
		Log('loginAdmin.ts', 'INFORMATION', 'Admin "' + email + '" logged in');
		res.send({ message: 'Logged in !' });
		return;
	} else {
		Log('loginAdmin.ts', 'WARNING', 'Wrong confidentials');
		res.status(400).send({ message: 'Wrong confidentials' });
		return;
	}
}