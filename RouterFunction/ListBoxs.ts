import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { Box } from "../Models/Box";

/**
**{
*	login:{
*		username:string
*		password:stringSha512
*	}
**}
*/

export default async function listBox(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		Log('listBox.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { email: String, password: Sha512 String }" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('listBox.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	const allBox = await Box.find();

	Log('listBox.ts', 'INFORMATION', 'Admin "' + req.body.email + '" got the box list');
	res.status(200).send(allBox);
}