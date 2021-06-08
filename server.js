const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{
	cors: { 
		origin: '*',
		methods: ["GET", "POST"],
		credentials: true,
		transports: ['websocket']
	} });
const port = 8000;

const rooms = new Map();

app.use(express.json());

app.get('/rooms', (req, res) => {
    res.json(rooms);
});

app.post('/rooms', (req, res) => {

});
io.on('connection', (socket) => {
    console.log('user connect ', socket.id);
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
