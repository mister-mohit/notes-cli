import yargs from "yargs";
import {hideBin} from  "yargs/helpers";
import { getDB, insertDB, saveDB } from "./db.js";

function formatNotes(notes){
    notes.forEach(note => {
        console.log(`Note id: ${note.id}`);
        console.log(`Note.content: ${note.content}`);
    })
}

const getParsedDB = async () => {
    try {
        const db = await getDB();
        return JSON.parse(db);
    } catch (error) {
        console.error(error);
    }
}

yargs(hideBin(process.argv))
.command(
    "new <note>",
    "insert new note",
    () => {},
    async (argv) => {
        try {
            const newNote = {
                id: Date.now(),
                content: argv.note
            }
            await insertDB(newNote);
            console.log(`Noted added: ${newNote.id}`);
        } catch (error) {
            console.log(error);
        }
    }
)
.command(
    'all',
    "get all notes",
    () => {},
    async (argv) => {
        try {
            const db = await getParsedDB();
            formatNotes(db.notes);
        } catch (error) {
            console.error(error);
        }
    }
)
.command(
    'find <filter>',
    "get related notes",
    () => {},
    async (argv) => {
        try {
            const db = await getParsedDB();
            const notes=  db.notes.filter(note => 
                note.content.toLowerCase().includes(argv.filter.toLowerCase())
            )

            if(notes.length === 0){
                console.log("No matching note found.");
            } else {
                formatNotes(notes);
            }
        } catch (error) {
            console.error(error);
        }
    }
)
.command(
    'remove <id>',
    "remove note by id",
    () => {},
    async (argv) => {
        try {
            const db = await getParsedDB();
            
            const updatedNotes = db.notes.filter(note => note.id === Number(argv.id));

            if(updatedNotes.length > 0){
                await saveDB({notes: updatedNotes});
                console.log(`Removed Note: ${argv.id}`);
            } else {
                console.log("No matching note found with given id.");
            }
            
        } catch (error) {
            console.error(error);
        }
    }
)
.command(
    'clear',
    "remove all notes",
    () => {},
    async (argv) => {
        try {
            const db = {notes: []};
            await saveDB(db);
            console.log("Removed all notes.");
        } catch (error) {
            console.error(error);
        }
    }
)
.demandCommand(1)
.parse();


