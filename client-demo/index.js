const io = require('socket.io-client');

const endereco = process.env.SERVER_ADDR || 'http://localhost:3333';

const socket = io(endereco);

let logado = false;

socket.on('connect', () => {
	console.log('Conexão no socket geral bem sucedida com id ' + socket.id);

	// socket.emit('registrar_usuario', 'Rafael Nunes Santana', 'Banco Finanças', '123456', '01', '1234 1234 1234 1234', 'teste123', '100', (resposta) => {
	// 	console.log(resposta.mensagem);
	// });

	// socket.emit('registrar_usuario', 'Verônica Bertolucci Scilewski', 'Banco Finanças', '654321', '01', '1234 1234 1234 1234', 'teste456', '100', (resposta) => {
	// 	console.log(resposta.mensagem);
	// });

	if (!logado) {
		socket.emit('login', '654321', 'teste456', (respostaLogin) => {
			console.log(respostaLogin.mensagem);
	
			if (!respostaLogin.sucesso) {
				return;
			}
	
			logado = true;
			setUpSocketUsuario(respostaLogin.token);
		});
	}
});

function setUpSocketUsuario(token) {
	console.log('token: ' + token);
	
	const userSocket = io(endereco + '/user', { auth: { token } });
	
	userSocket.on('connect', () => {
		console.log('Conexão no socket de usuário bem sucedida com id ' + socket.id);
	});
			
	userSocket.on('connect_error', (error) => {
		console.log('Erro ao conectar no socket de usuário: ' + error);
	});

	userSocket.on('receber_cobranca', (remetente, valor, callback) => {
		console.log(remetente);
		console.log(valor);
	});
	
	userSocket.emit('deposito', -100, (mensagem) => console.log(mensagem));

	userSocket.emit('fazer_cobranca', 654321, 200, (mensagem) => console.log(mensagem));
}
