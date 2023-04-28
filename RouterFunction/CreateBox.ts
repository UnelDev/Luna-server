import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";

import { Box } from "../Models/Box";

/*
**{
**	login:{
**		username:string
**		password:stringSha512
**	},
**	name:string,
**	placment: string,
**	?slot[undefined, undefined, undefined, undefined],
**	?size: number
**}
*/

export default async function CreateBox(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || !(Object.keys(req.body).length >= 3 && Object.keys(req.body).length <= 5)) {
		res.status(400).send({ message: "Specify { login:{ email: String, password: Sha512 String }, name: String, placment: String, ?slot[undefined, undefined, undefined, undefined], ?size: Number }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.name != 'string') {
		res.status(400).send({ message: "Name must be a string" });
		return;
	}

	if (typeof req.body.placment != 'string') {
		res.status(400).send({ message: "Placment must be a string" });
		return;
	}

	if (Array.isArray(req.body.slot) || typeof req.body.size == 'number') {
		if (!Array.isArray(req.body.slot)) {
			res.status(400).send({ message: "Slot must be specified if the size is specified" });
			return;
		}

		if (typeof req.body.size != 'number') {
			res.status(400).send({ message: "Size must be specified if the slot is specified" });
			return;
		}

		if (req.body.slot.length != req.body.size) {
			res.status(400).send({ message: "Size of the slot array is not equal to the size argument" });
			return;
		}
	}

	if (await Box.findOne({ name: req.body.name })) {
		res.status(400).send({ message: "A box already exists with this name" });
		return;
	}
	const created = new Box({
		name: req.body.name,
		placment: req.body.placment,
		slot: req.body?.slot,
		size: req.body?.size
	});
	await created.save();
	res.status(200).send({ message: 'Box created successfully' });

}