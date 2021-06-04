const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioService = require('./src/services/usuarioService');

const porta = process.env.PORT || 3333;

const io = require('socket.io')(porta);
const userIo = io.of('/user');

io.on('connection', (socket) => {
	console.log(socket.id);

	socket.on('registrar_usuario', (nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, saldoInicial, callback) => {
		usuarioService.create(nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, saldoInicial).then(resultado => {
			callback(resultado);
		});
	});

	socket.on('login', (numeroConta, senha, callback) => {
		if (!numeroConta || !senha) {
			callback({ sucesso: false, mensagem: 'Número da conta e senha necessários para login' });
			return;
		}

		usuarioService.getByNumeroConta(numeroConta).then(usuario => {
			if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
				callback({ sucesso: false, mensagem: 'Erro de autentificação' });
				return;
			}
	
			const payload = {
				id: usuario.id,
				numeroConta: usuario.numeroConta,
				nome: usuario.nome
			};
	
			const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });
	
			callback({ sucesso: true, mensagem: 'Login feito com sucesso', token });
		});
	});
});

userIo.use((socket, next) => {
	const token = socket.handshake.auth.token;

	if (!token) {
		next(new Error('Erro de autentificação sem token'));
		return;
	}

	try {
		const decode = jwt.verify(token, process.env.JWT_KEY);
		socket.usuario = decode;
		next();
	} catch {
		next(new Error('Erro de autentificação token inválido'));
		return;
	}
});

// Mapa de todos os usuários online e logados no momento
const usuariosOnline = new Map();

userIo.on('connection', (socket) => {
	const usuario = socket.usuario;
	usuariosOnline.set(usuario.numeroConta, socket);

	console.log('Usuário da conta ' + usuario.numeroConta + ' conectado');

	socket.on('disconnect', function(){
		console.log('Usuário da conta ' + usuario.numeroConta + ' desconectado');
		usuariosOnline.delete(usuario.numeroConta);
	});

	socket.on('deposito', (valor, callback) => {
		usuarioService.deposito(usuario.numeroConta, valor).then(resultado => callback(resultado));
	});

	socket.on('fazer-cobranca', (nContaDestinatario, valor, callback) => {
		const sDestinatario = usuariosOnline.get(nContaDestinatario);

		// TODO possibilitar mandar cobraça para usuários offline
		if (!sDestinatario) {
			callback({ sucesso: false, mensagem: 'Destinatário não está online' });
			return;
		}

		if (sDestinatario == socket) {
			callback({ sucesso: false, mensagem: 'Não é possível enviar cobrança para você mesmo' });
			return;
		}

		sDestinatario.emit('receber-cobranca', usuario, valor, (autorizado, senha, callbackDest) => {
			if (!autorizado) {
				socket.emit('resultado-cobranca', `Sua cobrança para ${sDestinatario.usuario.nome} da conta ${sDestinatario.usuario.numeroConta} foi recusada`);
				callbackDest({ sucesso: true, mensagem: 'Você recusou a cobrança' });
				return;
			}

			usuarioService.getByNumeroConta(sDestinatario).then(destinatario => {
				if (!destinatario || !bcrypt.compareSync(senha, destinatario.senha)) {
					callbackDest({ sucesso: false, mensagem: 'Erro de autentificação' });
					return;
				}

				usuarioService.transferencia(nContaDestinatario, usuario.numeroConta, valor).then(resultado => {
					socket.emit('resultado-cobranca', `Sua cobraça de ${valor} para ${sDestinatario.usuario.nome} da conta ${sDestinatario.usuario.numeroConta} foi paga`);
					callbackDest(resultado);
				});
			});
		});

		callback({ sucesso: true, mensagem: 'Cobrança enviada com sucesso' });
	});

	socket.on('transferir', (destinatario, valor, callback) => {
		if (destinatario == usuario.numeroConta) {
			callback( { sucesso: false, mensagem: 'Não é possível transferir para você mesmo' } );
			return;
		}

		usuarioService.deposito(usuario.numeroConta, destinatario, valor).then(resultado => callback(resultado));
	});
});
