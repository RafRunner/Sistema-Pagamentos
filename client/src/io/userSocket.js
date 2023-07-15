import * as io from 'socket.io-client';

const endereco = process.env.SERVER_ADDR || 'http://localhost:3333';

let userSocket = null;

export function createUserSocket(token) {
	if (userSocket != null) {
		return;
	}

	userSocket = io(endereco + '/user', { auth: { token } });

	userSocket.on('connect', () => {
		console.log('Conexão no socket de usuário bem sucedida com id ' + userSocket.id);
	});
}

export function getUserSocket() {
	return userSocket;
}

export function disconnect() {
	userSocket.disconnect();
	userSocket = null;
}
