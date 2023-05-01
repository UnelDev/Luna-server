import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { User } from "../Models/User";

/**
 * This function checks if a user's login credentials are valid and returns a boolean value.
 * @param req - The request object that contains information about the incoming HTTP request, such as
 * the request body, headers, and query parameters.
 * @param res - The `res` parameter is an instance of the `Response` class from the Express.js
 * framework. It is used to send a response back to the client that made the request. The response can
 * include data, status codes, and headers.
 * @returns a boolean value, either true or false, depending on whether the user login credentials
 * provided in the request body are valid or not. If the credentials are invalid, the function sends an
 * appropriate error response and returns false. If the credentials are valid, the function returns
 * true.
 */
export default async function CheckUser(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
	if (typeof req.body.login != 'object' || Object.keys(req.body.login).length != 2) {
		res.status(400).send({ message: "Specify login: { email: String, password: Sha512 String }" });
		return false;
	}

	if (await User.findOne({ email: req.body.login.email }) == null) {
		res.status(404).send({ message: "User login not found" });
		return false;
	}

	if ((await User.findOne({ email: req.body.login.email })).password != req.body.login.password) {
		res.status(403).send({ message: "Wrong confidentials" });
		return false;
	}

	return true;
}