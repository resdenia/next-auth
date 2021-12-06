import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDb } from "../../../lib/db";

async function handler(req, res) {
	if (req.method !== "PATCH") {
		return;
	}

	const session = getSession({ req: req });

	if (!session) {
		res.status(401).json({ message: "Not authenticated!" });
		return;
	}

	const userEmail = session.user.email;
	const oldPassword = req.body.oldPassword;
	const newPassword = req.body.newPassword;
	try {
		const client = await connectToDb();

		const userCollection = client.db().collection("users");

		const user = await userCollection.findOne({ email: userEmail });

		if (!user) {
			res.status(404).json({ message: "User not found." });
			client.close();
			return;
		}

		const currentPassword = user.password;
		const passwordAreEqual = await verifyPassword(oldPassword, currentPassword);

		if (!passwordAreEqual) {
			res.status(404).json({ message: "Old password not corect ." });

			client.close();

			return;
		}

		const hashedPassword = await hashPassword(newPassword);

		const result = userCollection.updateOne(
			{ email: userEmail },
			{ $set: { password: hashedPassword } },
		);
		client.close();
		res.status(200).json({ message: "password updated" });
	} catch (e) {
		throw new Error(e.message);
	}
}

export default handler;
