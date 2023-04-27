import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../function/checkAdmin";
import { Box } from "../models/Box";

/*
**{
**	login:{
**		username:string
**		password:stringSha512
**	}
**}
*/

export default async function listBox(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {

	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		res.status(400).send({ message: "Specify { email: string, password: sha512string }" })
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	const allBox = await Box.find();
	if (allBox) {
		res.status(200).send(allBox);
	} else {
		res.status(400).send({ message: 'error ocurred' });
	}

}