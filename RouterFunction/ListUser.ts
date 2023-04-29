import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../Functions/CheckAdmin";
import { User } from "../Models/User";

/**
**{
*	login:{
*		username:string
*		password:stringSha512
*	}
**}
*/

export default async function listUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	const alluser = await User.find();
	if (alluser) {
		res.send(alluser);
	} else {
		res.status(400).send({ message: 'error ocurred' });
	}
}
