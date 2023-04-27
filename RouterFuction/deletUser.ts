import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Admin } from "../models/admin";
import { User } from "../models/user";
import CheckAdmin from "../function/checkAdmin";

export default async function deletUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		res.status(400).send({ status: 400, message: "specify email and login object" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.email != 'string') {
		res.status(400).send({ status: 400, message: "bad email to delet user" });
		return;
	}

	if (!(await User.findOne({ email: req.body.email }))) {
		res.status(404).send({ status: 404, message: "user not found" });
		return;
	}

	const user = await User.deleteOne({ email: req.body.email });
	if (user) {
		res.send('user ' + req.body.email + ' deleted');
	} else {
		res.status(400).send('error in deleting ' + req.body.email + ' user');
	}
}
