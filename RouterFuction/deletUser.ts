import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Admin } from "../models/admin";
import { User } from "../models/user";

export default async function deletUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		res.status(400).send({ status: 400, message: "specify email and login object" })
		return;
	}

	if (typeof req.body.login != 'object' || Object.keys(req.body.login).length != 2) {
		res.status(400).send({ status: 400, message: "specify login object" });
		return;
	}

	if (await Admin.findOne({ email: req.body.login.email }) == null) {
		res.status(404).send({ status: 404, message: "Admin login not found" });
		return;
	}

	if ((await Admin.findOne({ email: req.body.login.email })).password != req.body.login.password) {
		res.status(403).send({ status: 403, message: "bad login password" });
		return;
	}

	if (typeof req.body.email != 'string') {
		res.status(400).send({ status: 400, message: "bad email to delet user" });
		return;
	}

	console.log(req.body.email);
	if (!(await User.findOne({ email: req.body.email }))) {
		res.status(404).send({ status: 404, message: "user not found" });
		return;
	}

	const user = await User.deleteOne({ email: req.body.email });
	if (user) {
		return 'user ' + req.body.email + ' deleted';
	} else {
		return 'error in deleting ' + req.body.email + ' user';
	}
}
