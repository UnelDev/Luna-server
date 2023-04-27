import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Admin } from "../models/admin";

export default async function loginAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		res.status(400).send({ message: "Specify { email: string, password: sha512string }" })
		return;
	}

	const email = req.body.email;
	const password = req.body.password;

	if (typeof email != 'string') {
		res.status(400).send({ message: "Email must be a string" });
		return;
	}

	if (password.length != 128 || !regexSHA512.test(password)) {
		res.status(400).send({ message: 'The password must be in sha512' })
		return;
	}

	const user = await Admin.findOne({ email: email });
	if (!user) {
		res.status(404).send({ message: 'Admin not found' });
		return;
	}

	if (user.password.toUpperCase() == password.toUpperCase()) {
		res.status(200).send({ message: 'Logged in !' });
		return;
	} else {
		res.status(400).send({ message: 'Wrong confidentials' });
		return;
	}
}