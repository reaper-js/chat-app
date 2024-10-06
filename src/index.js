import path from "path";
import http from "http"
import { fileURLToPath } from "url";
import express from "express";
import { Server } from "socket.io"
import { generateMessage, generateLocationMessage} from "./utils/messages.js";

//mimic __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server  = http.createServer(app);
const io = new Server(server);


const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));


io.on('connection', (socket) => {
    console.log('New WebSocket Connection');

    socket.emit('message', generateMessage('Welcome'))
    socket.broadcast.emit('message', generateMessage('A new user has joined the chat'))

    socket.on('sendMessage', (text, callback) => {
        io.emit('message', generateMessage(text));
        callback('Delivered!');
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has disconnected'))
    })

    socket.on('locationMessage', (position, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${position.latitude},${position.longitude}`));
        callback();
    })
})

server.listen(port, ()=> {
    console.log('Server is up on port ' + port);
})