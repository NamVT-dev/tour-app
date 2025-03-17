import * as SQLite from "expo-sqlite";

const database = await SQLite.openDatabaseAsync("place.db");

export async function init() {
  return database.execAsync(`CREATE TABLE IF NOT EXITS places (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      imageUri TEXT NOT NULL,
      address TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL
      )`);
}
