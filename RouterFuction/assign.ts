import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../function/checkAdmin";
import { Box } from "../models/Box";
import { Document, Types } from "mongoose";
import { User } from "../models/user";

/*
**{
**	login:{
**		username:string
**		password:stringSha512
**	},
**	name:string|id:string,
**	IDOfUser:String,
**	numberOfSlot:number
**}
*/

export default async function assign(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 4) {
		res.status(400).send({ status: 400, message: "specify object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		return;
	}

	if (typeof req.body.numberOfSlot != 'number') {
		res.status(400).send({ message: 'numberOfSlot must be a number' });
		return;
	}

	if (typeof req.body.IDOfUser != 'string') {
		res.status(400).send({ message: 'IDOfUser must be a string' });
		return;
	}
	if (req.body.name) {
		if (req.body.id) {
			res.status(400).send({ message: 'the id is specified but name is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.name != 'string') {
			res.status(400).send({ message: 'the name must be a string' });
			return;
		}

		const user = await User.findOne({ email: req.body.IDOfUser });
		if (!user) {
			res.status(404).send({ message: 'user not found' });
			return;
		}

		const response = await find({ name: req.body.name }, req.body.numberOfSlot, req.body.IDOfUser);
		res.status(response.code).send({ message: response.message });

	} else if (req.body.id) {
		if (req.body.name) {
			res.status(400).send({ message: 'the name is specified but id is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.id != 'string') {
			res.status(400).send({ message: 'the id must be a string' });
			return;
		}
		const user = await User.findById(req.body.IDOfUser);
		if (!user) {
			res.status(404).send({ message: 'user not found' });
			return;
		}
		const response = await find(req.body.id, req.body.numberOfSlot, req.body.IDOfUser);
		res.status(response.code).send({ message: response.message });

	} else {
		res.status(400).send({ message: 'please specified name or id of the box' });
		return;
	}

}

async function find(key: { name: string } | String, slotNumber: number, id: string) {
	let box: Document<unknown, {}, { name: string; placment: string; slot: any[]; size: number; createdAt: Date; }> & Omit<{ name: string; placment: string; slot: any[]; size: number; createdAt: Date; } & { _id: Types.ObjectId; }, never>;
	if (typeof key == 'string') {
		box = await Box.findById(key);
	} else if (typeof key == 'object') {
		box = await Box.findOne(key);
	}
	if (!box) {
		return { code: 404, message: 'box not found' };
	}

	if (slotNumber > box.slot.length) {
		return { code: 400, message: 'slot number should not be higher of box slot size' }
	}

	if (box.slot[slotNumber]) {
		return { code: 400, message: 'the slot is already use' };
	}

	box.slot[slotNumber] = [id, new Date()];
	await box.save();

	return { code: 200, message: 'slot assigned with sucess' };
}
