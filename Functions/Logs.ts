import fs from 'fs';
import path from 'path'
import dotenv from 'dotenv';
import { red, blue, yellow, bgRed, gray } from 'chalk'
dotenv.config({ path: '.env' });
/**
 * Impact Levels:
 * - INFORMATION: No impact on the system or user.
 * - WARNING: Minor impact that can be easily corrected.
 * - ERROR: Moderate impact that requires attention.
 * - CRITICAL: Significant impact that can cause damage or data loss.
 */

export async function log(file: string, impact: 'INFORMATION' | 'WARNING' | 'ERROR' | 'CRITICAL' | 'DEBUG', text: string, complement?: string) {
	if (process.env.npm_command == 'test') {
		return;
	}

	const logDir = './log';
	const logFilePath = path.resolve(`${logDir}/${process.env.ENVIRONMENT == 'dev' ? 'devLog' : 'log'}.log`);

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

	const date = new Date().toISOString();
	// append log in file
	fs.appendFileSync(logFilePath, `${new Date().toISOString()} ${impact} ${file} ${text}\n`);

	// print log if you are in dev environment
	if (process.env.ENVIRONMENT == 'dev') {

		console.log(`${date} ${file} ${coloredImpact} ${text}\n`);
	}
}
