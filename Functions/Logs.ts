import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
import { red, blue, yellow, bgRed, gray } from 'chalk'
dotenv.config({ path: '.env' });
//formation:
//2023-04-28T11:27:47.509Z ERROR bad password for test@exemple.com 
//2023-04-28T11:27:47.509Z INFORMATION test@exemple.com connected


export async function log(file: string, impact: 'INFORMATION' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'DEBUG', text: string, complement?: string) {
	const date = new Date().toISOString();

	const logDir = './log';
	const logFilePath = path.resolve(`${logDir}/log.log`);

	// Vérifier si le dossier log existe
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir);
	}

	let coloredImpact = impact as string;
	switch (impact) {
		case 'INFORMATION':
			coloredImpact = blue(impact);
			break;
		case 'WARNING':
			coloredImpact = yellow(impact);
			break;
		case 'ERROR':
			coloredImpact = red(impact);
			break;
		case 'CRITICAL':
			coloredImpact = bgRed.white(impact);
			break;
		case 'DEBUG':
			coloredImpact = gray(impact);
			break;
	}

	// append log in file
	fs.appendFileSync(logFilePath, `${date} ${file} ${impact} ${text}\n`);

	// print log if you are in dev environment
	if (process.env.isdev) {

		console.log(`${date} ${file} ${coloredImpact} ${text}\n`);
	}
}