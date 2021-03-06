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

app.get('/rooms/:id', (req, res) => {
    const { id: roomId } = req.params;
	//console.log(roomId);
	const obj = rooms.has(roomId)
	? {
		users: [...rooms.get(roomId).get('users').values()],
		messages: [...rooms.get(roomId).get('messages').values()],
	} : { users: [], messages: [] };
	res.json(obj);
});

app.post('/rooms', (req, res) => {
	//console.log(req.body);
	const {roomId, userName} = req.body;
	if(!rooms.has(roomId)) {
		rooms.set(roomId, new Map([
			['users', new Map()],
			['messages', []]
		]
		))
	}
	res.send();
});
io.on('connection', (socket) => {
	socket.on('ROOM:JOIN', ({roomId, userName}) => {
		//console.log(data);
		socket.join(roomId);
		rooms.get(roomId).get('users').set(socket.id, userName);
		const users = [...rooms.get(roomId).get('users').values()];
		socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
	})

	socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
		const obj = {
			userName, text
		}
		rooms.get(roomId).get('messages').push(obj);
		socket.broadcast.to(roomId).emit('ROOM:NEW_MESSAGE', obj);
	})

	socket.on('disconnect', () => {
		rooms.forEach((value, roomId) => {
			if(value.get('users').delete(socket.id)) {
				//console.log('Пользватель вышел!');
				const users = [...rooms.get(roomId).get('users').values()];
				socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
			}
		})
	})
    //console.log('user connect ', socket.id);
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
