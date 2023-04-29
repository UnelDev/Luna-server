import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { Log } from "../Functions/Logs";

import { User } from "../Models/User";

/*
**{
**	email:String,
**	oldPassword: Sha512 String,
**	newPassword: Sha512 String
**}
*/

export default async function changePassword(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		Log('changePassword.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: string, oldPassword: Sha512 String, newPassword: Sha512 String }" });
		return;
	}
	if (!req.body.email || typeof req.body.email != 'string') {
		Log('changePassword.ts', 'WARNING', 'Invalid type for email');
		res.status(400).send({ message: "Email must be a string" });
		return;
	}
	if (!req.body.oldPassword || req.body.oldPassword.length != 128 || !regexSHA512.test(req.body.oldPassword)) {
		Log('changePassword.ts', 'WARNING', 'Invalid format for oldPassword');
		res.status(400).send({ message: 'OldPassword must be in sha512 format' })
		return;
	}
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		Log('changePassword.ts', 'WARNING', 'User not found');
		res.status(404).send({ message: 'User not found' });
		return;
	}
	if (user.password != req.body.oldPassword) {
		Log('changePassword.ts', 'WARNING', 'Wrong confidentials');
		res.status(403).send({ message: 'Wrong confidentials' });
		return;
	}

	if (!req.body.newPassword || req.body.newPassword.length != 128 || !regexSHA512.test(req.body.newPassword)) {
		Log('changePassword.ts', 'WARNING', 'Invalid format for newPassword');
		res.status(400).send({ message: 'NewPassword must be in sha512 format' });
		return;
	}

	await User.findOneAndUpdate(
		{ email: req.body.email },
		{ password: req.body.newPassword },
		{ new: true },
	);

	Log('changePassword.ts', 'INFORMATION', ' User "' + user._id + '" changed his password');
	res.status(200).send({ message: 'Password changed successfully' });
	return;
}