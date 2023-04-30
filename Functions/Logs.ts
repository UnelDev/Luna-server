import { bgRed, blue, gray, red, yellow } from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env' });

type WarningLevel = 'DEBUG' | 'INFORMATION' | 'WARNING' | 'ERROR' | 'CRITICAL'


// Formation:
// (2023-04-28T11:27:47.509Z) [ERROR]> bad password for test@exemple.com 
// (2023-04-28T11:27:47.509Z) [INFORMATION]> test@exemple.com connected
/**
 * Impact Levels:
 * - INFORMATION: No impact on the system or user.
 * - WARNING: Minor impact that can be easily corrected.
 * - ERROR: Moderate impact that requires attention.
 * - CRITICAL: Significant impact that can cause damage or data loss.
 */
export async function Log(location: string, impact: WarningLevel = 'DEBUG', text: string) {
	if (process.env.npm_lifecycle_script.includes('jest')) {
		return;
	}
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
	fs.appendFileSync(logFilePath, `(${date}) [${location}]> ${impact} ${text}\n`);

	// print log if you are in dev environment
	if (process.env.isdev) {
		console.log(`(${date}) [${location}]> ${coloredImpact} ${text}\n`);
	}
}