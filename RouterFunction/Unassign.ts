import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Box } from "../models/Box";
import { Document, Types } from "mongoose";
import CheckAdmin from "../Functions/CheckAdmin";
import { log } from "../Functions/Logs";

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

export default async function unassign(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		log('unassing.ts', 'WARNING', 'unassing has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('unassing.ts', 'WARNING', 'unassign has been call without valid admin id');
		return;
	}

	if (typeof req.body.numberOfSlot != 'number') {
		log('unassing.ts', 'WARNING', 'unassign has been call but numberOfSlot is not a number');
		res.status(400).send({ message: 'numberOfSlot must be a number' });
		return;
	}

	if (req.body.name) {
		if (req.body.id) {
			log('unassing.ts', 'WARNING', 'assing has been call but name is specified same time of id');
			res.status(400).send({ message: 'the id is specified but name is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.name != 'string') {
			log('unassing.ts', 'WARNING', 'unassign has been call but name is not a string');
			res.status(400).send({ message: 'the name must be a string' });
			return;
		}

		const response = await find({ name: req.body.name }, req.body.numberOfSlot);
		res.status(response.code).send({ message: response.message });

	} else if (req.body.id) {
		if (req.body.name) {
			log('unassing.ts', 'WARNING', 'assing has been call but id is specified same time of name');
			res.status(400).send({ message: 'the name is specified but id is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.id != 'string') {
			log('unassing.ts', 'WARNING', 'unassign has been call but id is not a string');
			res.status(400).send({ message: 'the id must be a string' });
			return;
		}
		const response = await find(req.body.id, req.body.numberOfSlot);
		res.status(response.code).send({ message: response.message });

	} else {
		log('unassing.ts', 'WARNING', 'unassign has been call without id or name');
		res.status(400).send({ message: 'please specified name or id of the box' });
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
		log('unassing.ts', 'WARNING', 'unassing has been call but the requiered box does not exist');
		return { code: 404, message: 'box not found' };
	}

	if (slotNumber > box.slot.length) {
		log('unassing.ts', 'WARNING', 'unassing has been call but slot number is higher of box slot size');
		return { code: 400, message: 'slot number should not be higher of box slot size' }
	}

	box.slot[slotNumber] = null;
	await box.save();

	log('unassing.ts', 'INFORMATION', `in box ${box.id} the ${slotNumber} has been unassigned to actual user`);
	return { code: 200, message: 'slot unassigned with sucess' };
}
