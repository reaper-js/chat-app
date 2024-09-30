import path from "path";
import { fileURLToPath } from "url";
import express from "express";

//mimic __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.listen(port, ()=> {
    console.log('Server is up on port ' + port);
})