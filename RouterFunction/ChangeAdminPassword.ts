import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { Admin } from "../Models/Admin";

export default async function changeAdminPassword(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;

	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		res.status(400).send({ message: "Specify { email: string, oldPassword: Sha512 string, newPassword: sha512String }" });
		return;
	}
	if (!req.body.email || typeof req.body.email != 'string') {
		res.status(400).send({ message: "Email must be a string" });
		return;
	}
	if (!req.body.oldPassword || req.body.oldPassword.length != 128 || !regexSHA512.test(req.body.oldPassword)) {
		res.status(400).send({ message: 'OldPassword must be in sha512 format' })
		return;
	}

	const admin = await Admin.findOne({ email: req.body.email });
	if (!admin) {
		res.status(404).send({ message: 'Admin not found' });
		return;
	}
	if (admin.password != req.body.oldPassword) {
		res.status(403).send({ message: 'Wrong confidentials' });
		return;
	}

	if (!req.body.newPassword || req.body.newPassword.length != 128 || !regexSHA512.test(req.body.newPassword)) {
		res.status(400).send({ message: 'NewPassword must be in sha512 format' })
		return;
	}

	await Admin.findOneAndUpdate(
		{ email: req.body.email },
		{ password: req.body.newPassword },
		{ new: true }
	);

	res.send({ message: 'Operation success' });
}