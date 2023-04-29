import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

import { Box } from "../Models/Box";

/*
**{
**	login:{
**		username:string
**		password:stringSha512
**	},
**	name:string,
**	placement: string,
**	?slot[undefined, undefined, undefined, undefined],
**	?size: number
**}
*/

export default async function CreateBox(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || !(Object.keys(req.body).length >= 3 && Object.keys(req.body).length <= 5)) {
		Log('createBox.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { login:{ email: String, password: Sha512 String }, name: String, placement: String, ?slot[undefined, undefined, undefined, undefined], ?size: Number }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('createBox.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	if (typeof req.body.name != 'string') {
		Log('createBox.ts', 'WARNING', 'Invalid type for name');
		res.status(400).send({ message: "Name must be a string" });
		return;
	}

	if (typeof req.body.placement != 'string') {
		Log('createBox.ts', 'WARNING', 'Invalid type for placement');
		res.status(400).send({ message: "Placement must be a string" });
		return;
	}

	if (Array.isArray(req.body.slot) || typeof req.body.size == 'number') {
		if (!Array.isArray(req.body.slot)) {
			Log('createBox.ts', 'WARNING', 'Size is defined but slot is not');
			res.status(400).send({ message: "Slot must be specified if the size is specified" });
			return;
		}

		if (typeof req.body.size != 'number') {
			Log('createBox.ts', 'WARNING', 'Slot is defined but size is not');
			res.status(400).send({ message: "Size must be specified if the slot is specified" });
			return;
		}

		if (req.body.slot.length != req.body.size) {
			Log('createBox.ts', 'WARNING', 'Invalid array length');
			res.status(400).send({ message: "Size of the slot array is not equal to the size argument" });
			return;
		}
	}

	if (await Box.findOne({ name: req.body.name })) {
		Log('createBox.ts', 'WARNING', 'A box already exists with this name');
		res.status(400).send({ message: "A box already exists with this name" });
		return;
	}
	const created = new Box({
		name: req.body.name,
		placement: req.body.placement,
		slot: req.body?.slot,
		size: req.body?.size
	});

	await created.save();
	Log('createBox.ts', 'INFORMATION', 'Box "' + created._id + '" created');
	res.status(200).send({ message: 'Box created successfully' });
}