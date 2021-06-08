const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioService = require('./src/services/usuarioService');
const cobrancaService = require('./src/services/cobrancaService');
const receberCobranca = require('./src/routes/receberCobranca');

const porta = process.env.PORT || 3333;
const enderecoCliente = process.env.CLIENT_ADDR || 'http://localhost:8080';

const io = require('socket.io')(porta, {
	cors: {
		origin: enderecoCliente,
	}
});
const userIo = io.of('/user');

io.on('connection', (socket) => {
	console.log('Cliente conectado com id: ' + socket.id);

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

	cobrancaService.getCobrancasPendentes(usuario.numeroConta).then(cobrancasPendentes => {

		cobrancasPendentes.forEach(cobranca => {
			usuarioService.getByNumeroConta(cobranca.idRemetente).then(remetente => {
				const socketRemetente = usuariosOnline.get(remetente.numeroConta);

				const remetenteResumido = {
					id: remetente.id,
					numeroConta: remetente.numeroConta,
					nome: remetente.nome,
				};
		
				socket.emit('receber_cobranca', remetenteResumido, cobranca.valor, (autorizado, senha, callbackDest) => {
					receberCobranca(socketRemetente, autorizado, senha, callbackDest);
				});
			});
		});
	});

	socket.on('disconnect', () => {
		console.log('Usuário da conta ' + usuario.numeroConta + ' desconectado');
		usuariosOnline.delete(usuario.numeroConta);
	});

	socket.on('deposito', (valor, callback) => {
		usuarioService.deposito(usuario.numeroConta, valor).then(resultado => callback(resultado));
	});

	socket.on('fazer_cobranca', (nContaDestinatario, valor, callback) => {
		if (valor <= 0) {
			callback({ sucesso: false, mensagem: 'A valor da cobrança deve ser maior que zero' });
			return;
		}

		usuarioService.getByNumeroConta(nContaDestinatario).then(destinatario => {
			if (!destinatario) {
				callback({ sucesso: false, mensagem: 'Número de conta informado não corresponde a nenhuma registrada' });
				return;
			}

			if (destinatario.id == usuario.id) {
				callback({ sucesso: false, mensagem: 'Não é possível enviar cobrança para você mesmo' });
				return;
			}

			const sDestinatario = usuariosOnline.get(nContaDestinatario);

			if (!sDestinatario) {
				cobrancaService.criaCobranca(usuario.numeroConta, destinatario.numeroConta, valor);
				callback({ sucesso: true, mensagem: 'Cobrança enviada com sucesso' });
				return;
			}

			sDestinatario.emit('receber_cobranca', usuario, valor, (autorizado, senha, callbackDest) => {
				receberCobranca(socket, autorizado, senha, callbackDest);
			});

			callback({ sucesso: true, mensagem: 'Cobrança enviada com sucesso' });
		});
	});

	socket.on('transferir', (destinatario, valor, callback) => {
		if (destinatario == usuario.numeroConta) {
			callback( { sucesso: false, mensagem: 'Não é possível transferir para você mesmo' } );
			return;
		}

		usuarioService.deposito(usuario.numeroConta, destinatario, valor).then(resultado => callback(resultado));
	});
});
