import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../function/checkAdmin";
import { Box } from "../models/Box";
import { log } from "../function/logs";

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
		log('listBox.ts', 'WARNING', 'list box has been call with wrong body');
		res.status(400).send({ message: "Specify { email: string, password: sha512string }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('listBox.ts', 'WARNING', 'list box has been call without valid admin id');
		return;
	}

	const allBox = await Box.find();
	if (allBox) {
		log('listBox.ts', 'WARNING', 'the list of box has been send to ' + req.body.email + ' admin');
		res.send(allBox);
	} else {
		log('listBox.ts', 'ERROR', 'one error is ocured in listbox by ' + req.body.email + ' admin');
		res.status(400).send({ message: 'error ocurred' });
	}

}