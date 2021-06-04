const porta = process.env.PORT || 3333;

const io = require('socket.io')(porta);

let i = 0;

io.on('connection', (socket) => {
	console.log(socket.id);

	socket.emit('teste2', 'olá');

	socket.on('teste', (mensagem, callback) => {
		console.log(mensagem);
		callback(i++);
	});

	socket.on('registrar-usuario', (nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, valorInicial) => {

	});

	socket.on('login', (usuario, senha) => {

	});

	socket.on('cobranca', (destinatario, valor) => {

	});

	socket.on('transferir', (destinatario, valor) => {

	});
});
