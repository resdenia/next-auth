import { connectToDb } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function hadnler(req, res) {
	if (req.method === "POST") {
		const data = req.body;

		const { email, password } = data;

		if (
			!email ||
			!email.includes("@") ||
			!password ||
			password.trim().length < 7
		) {
			res.status(422).json({
				message:
					"Invalid input  - password should also be at least 7 chars long",
			});
			return;
		}

		const client = await connectToDb();

		const db = client.db();

		const existingUser = await db.collection("users").findOne({ email: email });

		if (existingUser) {
			res.status(422).json({ message: "User exists already!" });
			client.close();
			return;
		}

		const hashedPassword = await hashPassword(password);

		db.collection("user").insertOne({
			email: email,
			password: hashedPassword,
		});
		client.close();

		res.status(201).json({ message: "Created user!" });
	}
}

export default hadnler;
