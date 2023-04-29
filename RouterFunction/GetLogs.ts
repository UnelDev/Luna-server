import dotenv from 'dotenv';
import { Request, Response } from "express-serve-static-core";
import fs from 'fs';
import path from "path";
import { ParsedQs } from "qs";

import CheckAdmin from "../Functions/CheckAdmin";
import { Log } from "../Functions/Logs";

dotenv.config({ path: '.env' });
/**
** {
** 	login:{
** 		email: String,
** 		password: Sha512 String
** 	}
** }
 */

export default async function GetLogs(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		Log('GetLogs.ts', 'WARNING', 'Invalid body');
		res.status(400).send({ message: "Specify { login: { email: string, password: Sha512 String } }" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		Log('GetLogs.ts', 'WARNING', 'Invalid admin login');
		return;
	}

	const logFilePath = path.resolve(`./log/${process.env.ENVIRONMENT == 'dev' ? 'devLog' : 'log'}.log`);

	fs.readFile(logFilePath, 'utf8', (err, data) => {
		Log('GetLogs.ts', 'INFORMATION', 'Admin "' + req.body.login.email + '" got the logs');
		res.send({ data: data });
	});
}