import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Document, Types } from "mongoose";
import CheckAdmin from "../Functions/CheckAdmin";
import { log } from "../Functions/Logs";
import { User } from "../Models/User";
import { Box } from "../Models/Box";;

/*
**{
	login:{
		username:string
		password:stringSha512
	},
	name:string|id:string,
	IDOfUser:String,
	numberOfSlot:number
}
*/

export default async function assign(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 4) {
		log('assing.ts', 'WARNING', 'assing has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('assing.ts', 'WARNING', 'assing has been call without valid admin id');
		return;
	}

	if (typeof req.body.numberOfSlot != 'number') {
		log('assing.ts', 'WARNING', 'assing has been call with wrong type of numberOfSlot');
		res.status(400).send({ message: 'numberOfSlot must be a number' });
		return;
	}

	if (typeof req.body.IDOfUser != 'string') {
		log('assing.ts', 'WARNING', 'assing has been call with wrong type of IDOfUser');
		res.status(400).send({ message: 'IDOfUser must be a string' });
		return;
	}
	if (req.body.name) {
		if (req.body.id) {
			log('assing.ts', 'WARNING', 'assing has been call but name is specified same time of id');
			res.status(400).send({ message: 'the id is specified but name is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.name != 'string') {
			log('assing.ts', 'WARNING', 'assing has been call with wrong type of name');
			res.status(400).send({ message: 'the name must be a string' });
			return;
		}

		const user = await User.findOne({ email: req.body.IDOfUser });
		if (!user) {
			log('assing.ts', 'WARNING', 'assing has been call but the specifed user does not exist');
			res.status(404).send({ message: 'user not found' });
			return;
		}

		const response = await find({ name: req.body.name }, req.body.numberOfSlot, req.body.IDOfUser);
		res.status(response.code).send({ message: response.message });

	} else if (req.body.id) {
		if (req.body.name) {
			log('assing.ts', 'WARNING', 'assing has been call but name is specified same time of id');
			res.status(400).send({ message: 'the name is specified but id is already specified, you have to specify only id or name. Prefer the id' });
			return;
		}
		if (typeof req.body.id != 'string') {
			log('assing.ts', 'WARNING', 'assing has been call with wrong type of id');
			res.status(400).send({ message: 'the id must be a string' });
			return;
		}
		const user = await User.findById(req.body.IDOfUser);
		if (!user) {
			log('assing.ts', 'WARNING', 'assing has been call but the specifed user does not exist');
			res.status(404).send({ message: 'user not found' });
			return;
		}
		const response = await find(req.body.id, req.body.numberOfSlot, req.body.IDOfUser);
		res.status(response.code).send({ message: response.message });

	} else {
		log('assing.ts', 'WARNING', 'assing has been call name or id has not specified');
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
		log('assing.ts', 'WARNING', 'assing has been call but the requiered box does not exist');
		return { code: 404, message: 'box not found' };
	}

	if (slotNumber > box.slot.length) {
		log('assing.ts', 'WARNING', 'assing has been call but slot number is higher of box slot size');
		return { code: 400, message: 'slot number should not be higher of box slot size' }
	}

	if (box.slot[slotNumber]) {
		log('assing.ts', 'WARNING', 'assing has been call but the slot is already use');
		return { code: 400, message: 'the slot is already use' };
	}

	box.slot[slotNumber] = [id, new Date()];
	await box.save();

	log('assing.ts', 'INFORMATION', `in box ${box.id} the ${slotNumber} has been assigned to ${id} user`);
	return { code: 200, message: 'slot assigned with sucess' };
}

