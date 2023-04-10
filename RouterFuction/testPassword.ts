import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../models/user";

export default async function testPassword(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length == 0) {
		res.status(400).send({ status: 400, message: "specify {email:string, password:sha512string} object" })
		return;
	}
	if (typeof req.body.email != 'string') {
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	}
	if (req.body.testPassword.length != 128 || !regexSHA512.test(req.body.testPassword)) {
		res.status(400).send({ status: 400, message: 'the testPassword must be sha512' })
		return;
	}
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		res.status(404).send({ status: 404, message: 'bad email' });
		return;
	}
	if (user.password == req.body.testPassword) {
		return ('good password');
	} else {
		return ('bad password');
	}
}