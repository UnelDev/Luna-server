import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import CheckAdmin from "../Functions/CheckAdmin";
import { log } from "../Functions/Logs";
import { Admin } from "../Models/Admin";;

export default async function deletAdmin(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 2) {
		log('deleteAdmin.ts', 'WARNING', 'delete admin has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify email and login object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('deleteAdmin.ts', 'WARNING', 'delete admin has been call without valid admin id');
		return;
	}

	if (typeof req.body.email != 'string') {
		log('deleteAdmin.ts', 'WARNING', 'delete admin has been call with wrong type of email');
		res.status(400).send({ status: 400, message: "bad email to delet admin" });
		return;
	}

	if (await Admin.findOne({ email: req.body.email })) {
		log('deleteAdmin.ts', 'WARNING', 'delete admin has been call but admin required does not exist anymore');
		res.status(404).send({ status: 404, message: "admin not found" });
		return;
	}

	const admin = await Admin.deleteOne({ email: req.body.email });
	if (admin) {
		//no id for admin (deleted) no id for admin because i dont have admin object
		log('deleteAdmin.ts', 'INFORMATION', 'admin' + req.body.email + 'has been deleted by' + req.body.login.email);
		res.send('admin ' + req.body.email + ' deleted');
	} else {
		log('deleteAdmin.ts', 'ERROR', 'error in deleting admin the ' + req.body.email + ' have create an error');
		res.status(400).send('error in deleting ' + req.body.email + ' admin');
	}
}
