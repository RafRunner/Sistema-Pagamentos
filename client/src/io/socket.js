import * as io from 'socket.io-client';

const endereco = process.env.SERVER_ADDR || 'http://localhost:3333';

const socket = io(endereco);

socket.on('connect', () => {
	console.log('Conexão no socket geral bem sucedida com id ' + socket.id);
});

export default socket;
