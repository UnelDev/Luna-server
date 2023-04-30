import { Request, Response } from "express-serve-static-core";
import { Document, Types } from "mongoose";
import { ParsedQs } from "qs";
import { Log } from "../Functions/Logs";
import { Box } from "../Models/Box";
import { User } from "../Models/User";
import CheckUser from "../Functions/CheckUser";

/**
{
	login:{
		username:string
		password:stringSha512
	},
	name:string|id:string,
	numberOfSlot:number
}
*/

export default async function ReleaseSlot(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 3) {
		Log('ReleaseSlot.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ status: 400, message: "Specify { login: { username: String, password: Sha512 String }, name: String|id, numberOfSlot: Number }" });
		return;
	}

	if (!await CheckUser(req, res)) {
		Log('ReleaseSlot.ts', 'WARNING', 'Invalid User login');
		return;
	}

	if (typeof req.body.numberOfSlot != 'number') {
		Log('ReleaseSlot.ts', 'WARNING', 'Invalid type for "numberOfSlot"');
		res.status(400).send({ message: 'numberOfSlot must be a number' });
		return;
	}

	if (req.body.name) {
		if (req.body.id) {
			Log('ReleaseSlot.ts', 'WARNING', 'Usage of "id" AND "name"');
			res.status(400).send({ message: 'Use id OR name. Only one is allowed. Prefer to use id' });
			return;
		}
		if (typeof req.body.name != 'string') {
			Log('ReleaseSlot.ts', 'WARNING', 'Invalid type for name');
			res.status(400).send({ message: 'Name must be a string' });
			return;
		}

		const response = await find({ name: req.body.name }, req.body.numberOfSlot, req.body.login.email);
		res.status(response.code).send({ message: response.message });

	} else if (req.body.id) {
		if (req.body.name) {
			Log('ReleaseSlot.ts', 'WARNING', 'Usage of "id" AND "name"');
			res.status(400).send({ message: 'Use id OR name. Only one is allowed. Prefer to use id' });
			return;
		}
		if (typeof req.body.id != 'string') {
			Log('ReleaseSlot.ts', 'WARNING', 'Invalid type for id');
			res.status(400).send({ message: 'Id must be a string' });
			return;
		}
		const response = await find(req.body.id, req.body.numberOfSlot, req.body.login.email);
		res.status(response.code).send({ message: response.message });

	} else {
		Log('ReleaseSlot.ts', 'WARNING', 'Missing "id" or "name"');
		res.status(400).send({ message: 'Specify name or id of the box' });
		return;
	}

}

async function find(key: { name: string } | String, slotNumber: number, UserEmail: string) {
	let box: Document<unknown, {}, { name: string; placement: string; slot: any[]; size: number; createdAt: Date; }> & Omit<{ name: string; placement: string; slot: any[]; size: number; createdAt: Date; } & { _id: Types.ObjectId; }, never>;
	if (typeof key == 'string') {
		box = await Box.findById(key);
	} else if (typeof key == 'object') {
		box = await Box.findOne(key);
	}

	if (!box) {
		Log('ReleaseSlot.ts', 'WARNING', 'Box not found');
		return { code: 404, message: 'Box not found' };
	}

	if (slotNumber > box.slot.length) {
		Log('ReleaseSlot.ts', 'WARNING', 'Slot number is higher than the number of slots');
		return { code: 400, message: 'Slot number is higher than the number of slots' }
	}

	if (!Array.isArray(box.slot[slotNumber])) {
		Log('ReleaseSlot.ts', 'WARNING', `User ${UserEmail} to request the release of slot ${slotNumber} but the slot is not allocated`);
		return { code: 400, message: 'Slot required is not allocated' };
	}

	const user = await User.findById(box.slot[slotNumber][0]);
	if (user == null) {
		//critical beacause the user in this box is unknow
		Log('ReleaseSlot.ts', 'CRITICAL', `User ${box.slot[slotNumber][0]} to request the release of slot ${slotNumber} but the assigned user dose not exist`);
		return { code: 404, message: 'user not found' };
	}

	if (!(box.slot[slotNumber][1] instanceof Date && !isNaN(box.slot[slotNumber][1]))) {
		//critical beacause the user in this box is unknow
		Log('ReleaseSlot.ts', 'CRITICAL', `User ${user._id} to request the release of slot ${slotNumber} but the date of reservation isn't date`);
		return { code: 500, message: 'this slot does not contain date' };
	}


	if (user.email != UserEmail) {
		//critical beacause the user in this box is unknow
		Log('ReleaseSlot.ts', 'WARNING', `User ${user._id} to request the release of slot ${slotNumber} but email is diferant to email of user in the slot`);
		return { code: 403, message: 'bad user' };
	}

	if (typeof user.timeOfUse != 'number') {
		Log('ReleaseSlot.ts', 'ERROR', `User ${user._id} found an error, it does not have the correct type of timeOfUse`);
		return { code: 500, message: 'user in this slot generate an error' };
	}

	await user.updateOne({
		timeOfUse: user.timeOfUse + (new Date().getTime() - new Date(box.slot[slotNumber][1]).getTime())
	})
	box.slot[slotNumber] = null;
	await box.save();

	Log('ReleaseSlot.ts', 'INFORMATION', `Box "${box.id}": Slot "${slotNumber}" has been unassigned`);
	return { code: 200, message: 'Slot Released successfully' };
}
