import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Admin } from "../models/admin";
import { User } from "../models/user";

export default async function createAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;


	if (typeof req.body != 'object' || Object.keys(req.body).length != 4) {
		res.status(400).send({ status: 400, message: "specify Admin object" });
		return;
	}

	if (typeof req.body.login != 'object' || Object.keys(req.body.login).length != 2) {
		res.status(400).send({ status: 400, message: "specify Login object" });
		return;
	}

	if (await User.findOne({ email: req.body.login.email }) == null) {
		console.log(await User.findOne({ email: req.body.login.email }));
		res.status(404).send({ status: 404, message: "user login not found" });
		return;
	}

	if ((await User.findOne({ email: req.body.login.email })).password != req.body.login.password) {
		res.status(400).send({ status: 400, message: "bad login password" });
		return;
	}

	if (!req.body.name || typeof req.body.name != 'string') {
		res.status(400).send({ status: 400, message: "username must be a string" });
		return;
	} if (!req.body.email || typeof req.body.email != 'string') {
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	} if (req.body.email.length == 0) {
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	} if (!req.body.password || req.body.password.length != 128 || !regexSHA512.test(req.body.password)) {
		res.status(400).send({ status: 400, message: 'the password must be sha512' })
		return;
	}

	if (await Admin.findOne({ email: req.body.email })) {
		res.status(409).send({ status: 409, message: "Admin with email " + req.body.email + " already exists" });
		return;
	}
	const admin = new Admin({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
	});
	await admin.save();
	return 'Admin ' + admin.email + ' created';
}
