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
**	},
**	name:string,
**	placment: string,
**	?slot[undefined, undefined, undefined, undefined],
**	?size: number
**}
*/

export default async function CreateBox(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || !(Object.keys(req.body).length >= 3 && Object.keys(req.body).length <= 5)) {
		log('createBox.ts', 'WARNING', 'create box has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify email and login object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('createBox.ts', 'WARNING', 'create box has been call without valid admin id');
		return;
	}

	if (typeof req.body.name != 'string') {
		log('createBox.ts', 'WARNING', 'create box has been call with wrong type of name');
		res.status(400).send({ status: 400, message: "the name must be a string" });
		return;
	}

	if (typeof req.body.placment != 'string') {
		log('createBox.ts', 'WARNING', 'create box has been call with wrong type of placment');
		res.status(400).send({ status: 400, message: "the placment must be a string" });
		return;
	}

	if (Array.isArray(req.body.slot) || typeof req.body.size == 'number') {
		if (!Array.isArray(req.body.slot)) {
			log('createBox.ts', 'WARNING', 'create box has been call but size has been specified and slot not');
			res.status(400).send({ status: 400, message: "the slot must be specified if the size is specified" });
			return;
		}

		if (typeof req.body.size != 'number') {
			log('createBox.ts', 'WARNING', 'create box has been call but slot has been specified and size not');
			res.status(400).send({ status: 400, message: "the size must be specified if the slot is specified" });
			return;
		}

		if (req.body.slot.length != req.body.size) {
			log('createBox.ts', 'WARNING', 'create box has been call but slot.length and size is not equal');
			res.status(400).send({ status: 400, message: "the size of slot array is not equal of size argument" });
			return;
		}
	}

	if (await Box.findOne({ name: req.body.name })) {
		log('createBox.ts', 'WARNING', 'create box has been call but the slot to be created already exists');
		res.status(400).send({ status: 400, message: "the box with this name already exist" });
		return;
	}
	const created = new Box({
		name: req.body.name,
		placment: req.body.placment,
		slot: req.body?.slot,
		size: req.body.size
	});
	await created.save();
	log('createBox.ts', 'INFORMATION', 'box ' + created._id + ' created');
	res.send('the ' + created.name + ' boxe has been creted');

}