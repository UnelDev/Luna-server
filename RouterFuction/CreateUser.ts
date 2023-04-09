import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../models/user";

export default async function CreateUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length == 0) {
		res.status(400).send({ status: 400, message: "specify username object" })
		return;
	}
	if (typeof req.body.name != 'string') {
		res.status(400).send({ status: 400, message: "username must be a string" });
		return;
	} if (typeof req.body.email != 'string') {
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	} if (req.body.email.length == 0) {
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	} if (req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		res.status(400).send({ status: 400, message: 'the password must be sha512' })
		return;
	}

	if (await User.findOne({ email: req.body.email })) {
		res.status(409).send({ status: 409, message: "User with email " + req.body.email + " already exists" });
		return;
	}
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	await user.save();
	return 'User ' + user.email + ' created';
}