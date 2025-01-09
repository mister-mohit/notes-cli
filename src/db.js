import fs from "fs/promises"
import {dirname, join} from "path";
import { fileURLToPath } from "url";

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);

const DB_PATH = join(__dirname, "../db.json");


const getDB = async () => {
    try {
        const db = await fs.readFile(DB_PATH, 'utf-8');
        return db;
    } catch (error) {
        console.error(error);
    }
}

const saveDB = async (db) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
        return db;
    } catch (error) {
        console.error(error);
    }
}

const insertDB = async (data) => {
    try {
        const db = await getDB();
        const parsedDB = await JSON.parse(db);
        parsedDB.notes.push(data);
        await saveDB(parsedDB);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export {
    getDB,
    saveDB,
    insertDB
}
