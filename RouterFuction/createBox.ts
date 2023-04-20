import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../function/checkAdmin";
import { Box } from "../models/Box";

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
		res.status(400).send({ status: 400, message: "specify email and login object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.name != 'string') {
		res.status(400).send({ status: 400, message: "the name must be a string" });
		return;
	}

	if (typeof req.body.placment != 'string') {
		res.status(400).send({ status: 400, message: "the placment must be a string" });
		return;
	}

	if (Array.isArray(req.body.slot) || typeof req.body.size == 'number') {
		if (!Array.isArray(req.body.slot)) {
			res.status(400).send({ status: 400, message: "the slot must be specified if the size is specified" });
			return;
		}

		if (typeof req.body.size != 'number') {
			res.status(400).send({ status: 400, message: "the size must be specified if the slot is specified" });
			return;
		}

		if (!req.body.slot.every((item: any) => typeof item === 'string')) {
			res.status(400).send({ status: 400, message: "the slot must contains the id of the user (string)" });
			return;
		}

		if (req.body.slot.length != req.body.size) {
			res.status(400).send({ status: 400, message: "the size of slot array is not equal of size argument" });
			return;
		}
	}

	const created = new Box({
		name: req.body.name,
		placment: req.body.placment,
		slot: req.body?.slot,
		size: req.body.size
	});
	await created.save();
	res.send('the ' + created.name + ' boxe has been creted');

}