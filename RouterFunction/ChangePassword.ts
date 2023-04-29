import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../models/user";
import { log } from "../function/logs";

export default async function changePassword(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	const regexSHA512 = /^[a-fA-F0-9]{128}$/;
	//verify information
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		log('changePassword.ts', 'WARNING', 'change password has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify {email:string, oldPassword:sha512string, newPassword:sha512String} object" })
		return;
	}
	if (!req.body.email || typeof req.body.email != 'string') {
		log('changePassword.ts', 'WARNING', 'change password has been call with wrong type of email');
		res.status(400).send({ status: 400, message: "email must be a string" });
		return;
	}
	if (!req.body.oldPassword || req.body.oldPassword.length != 128 || !regexSHA512.test(req.body.oldPassword)) {
		log('changePassword.ts', 'WARNING', 'change password has been call with wrong type of oldPassword');
		res.status(400).send({ status: 400, message: 'the oldPassword must be sha512' });
		return;
	}
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		log('changePassword.ts', 'WARNING', 'change password has been call but user required does not exist anymore');
		res.status(404).send({ status: 404, message: 'user not fond' });
		return;
	}
	if (user.password != req.body.oldPassword) {
		log('changePassword.ts', 'WARNING', 'change password has been call with bad old password');
		res.status(403).send({ status: 403, message: 'bad old password' });
		return;
	}

	//change password
	if (!req.body.newPassword || req.body.newPassword.length != 128 || !regexSHA512.test(req.body.newPassword)) {
		log('changePassword.ts', 'WARNING', 'change password has been call with bad type of newPassword');
		res.status(400).send({ status: 400, message: 'the newPassword must be sha512' });
		return;
	}

	await User.findOneAndUpdate(
		{ email: req.body.email }, // Filter to find the user to update
		{ password: req.body.newPassword }, // New value of the password field
		{ new: true }, // Return the updated user instead of the old one
	);
	log('changePassword.ts', 'INFORMATION', 'the ' + user._id + ' user has changed his password');
	res.send({ status: 200, message: 'new password is effective' });
	return;
}