import { MongoClient } from "mongodb";

export async function connectToDb() {
	const client = await MongoClient("mongoDBURL");
	return client;
}
