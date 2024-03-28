import { MongoClient } from "mongodb";

const uri = "<secret>";
const dbName = "intro";
const categoriesCollection = "todo_categories";

export async function seedDb() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);

    const isEmpty =
      (await db.collection(categoriesCollection).countDocuments()) === 0;

    isEmpty &&
      (await db.collection(categoriesCollection).insertMany([
        {
          name: "Work",
        },
        {
          name: "Groceries",
        },
        {
          name: "Finance",
        },
        {
          name: "Family",
        },
        {
          name: "Cooking",
        },
        {
          name: "Gardening",
        },
      ]));

    console.log(
      isEmpty
        ? "Categories were successfully inserted to the db."
        : "Categories already set in the db."
    );
  } catch (error) {
    console.error(error);
    console.log("Unable to seed db");
  } finally {
    client.close();
  }
}
