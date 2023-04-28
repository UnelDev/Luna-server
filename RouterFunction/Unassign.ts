import { Request, Response } from "express-serve-static-core";
import { Document, Types } from "mongoose";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";

import { Box } from "../Models/Box";

/*
**{
**	login:{
**		username:string
**		password:stringSha512
**	},
**	name:string|id:string,
**	numberOfSlot:number
**}
*/

export default async function Unassign(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		res.status(400).send({ status: 400, message: "Specify { login: { username: String, password: Sha512 String }, name: String|id, numberOfSlot: Number }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.numberOfSlot != 'number') {
		res.status(400).send({ message: 'numberOfSlot must be a number' });
		return;
	}

	if (req.body.name) {
		if (req.body.id) {
			res.status(400).send({ message: 'Use id OR name. Only one is allowed. Prefer to use id' });
			return;
		}
		if (typeof req.body.name != 'string') {
			res.status(400).send({ message: 'Name must be a string' });
			return;
		}

		const response = await find({ name: req.body.name }, req.body.numberOfSlot);
		res.status(response.code).send({ message: response.message });

	} else if (req.body.id) {
		if (req.body.name) {
			res.status(400).send({ message: 'Use id OR name. Only one is allowed. Prefer to use id' });
			return;
		}
		if (typeof req.body.id != 'string') {
			res.status(400).send({ message: 'Id must be a string' });
			return;
		}
		const response = await find(req.body.id, req.body.numberOfSlot);
		res.status(response.code).send({ message: response.message });

	} else {
		res.status(400).send({ message: 'Specify name or id of the box' });
		return;
	}

}

async function find(key: { name: string } | String, slotNumber: number) {
	let box: Document<unknown, {}, { name: string; placment: string; slot: any[]; size: number; createdAt: Date; }> & Omit<{ name: string; placment: string; slot: any[]; size: number; createdAt: Date; } & { _id: Types.ObjectId; }, never>;
	if (typeof key == 'string') {
		box = await Box.findById(key);
	} else if (typeof key == 'object') {
		box = await Box.findOne(key);
	}

	if (!box) {
		return { code: 404, message: 'Box not found' };
	}

	if (slotNumber > box.slot.length) {
		return { code: 400, message: 'Slot number is higher than the number of slots' }
	}

	box.slot[slotNumber] = null;
	await box.save();

	return { code: 200, message: 'Slot unassigned successfully' };
}
