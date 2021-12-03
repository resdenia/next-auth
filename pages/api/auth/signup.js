import { connectToDb } from "../../../lib/db";

async function hadnler(req, res) {
	const data = req.body;

	const { email, password } = data;

	if (
		!email ||
		!email.includes("@") ||
		!password ||
		password.trim().length < 7
	) {
		res
			.status(422)
			.json({
				message:
					"Invalid input  - password should also be at least 7 chars long",
			});
		return;
	}

	const client = await connectToDb();

	const db = client.db();

	db.collection("user").insertOne({
		email: email,
		password: password,
	});
}

export default hadnler;
