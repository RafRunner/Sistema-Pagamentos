const io = require('socket.io-client');

const endereco = process.env.SERVER_ADDR || 'http://localhost:3333';

const socket = io(endereco);

socket.on('connect', () => {
	console.log('Conexão bem sucedida com id ' + socket.id);

	setInterval(() => {
		socket.emit('teste', { sucesso: true, mensagem: 'Deu bom' }, (mensagem) => {
			console.log(mensagem);
		});
	},
	1000);

	socket.on('teste2', (mensagem) => {
		console.log(mensagem);
	});
});
