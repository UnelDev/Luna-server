import CheckAdmin from "../Functions/CheckAdmin";
import { log } from "../Functions/Logs";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
/**
 {
	login:{
		username:string,
		password:stringSha512
	}
}
 */

export default async function GetLogs(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body != 'object' || Object.keys(req.body).length != 1) {
		log('GetLogs.ts', 'WARNING', 'get logs has been call with wrong body');
		res.status(400).send({ status: 400, message: "specify login object" });
		return;
	}

	if (!await CheckAdmin(req, res)) {
		log('GetLogs.ts', 'WARNING', 'get logs has been call without valid admin id');
		return;
	}
	const logFilePath = path.resolve(`./log/${process.env.ENVIRONMENT == 'dev' ? 'devLog' : 'log'}.log`);
	fs.readFile(logFilePath, 'utf8', (err, data) => {
		if (err) {
			log('GetLogs.ts', 'CRITICAL', 'Error reading log file');
			res.status(500).send({ message: 'Error reading log file' });
		} else {
			log('GetLogs.ts', 'INFORMATION', 'the ' + req.body.login.email + ' admin has been see the logs');
			res.send({ data: data });
		}
	});
}