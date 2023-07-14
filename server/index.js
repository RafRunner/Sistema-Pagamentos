const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioService = require('./src/services/usuarioService');
const cobrancaService = require('./src/services/cobrancaService');
const responderCobranca = require('./src/routes/responderCobranca');

const porta = process.env.PORT || 3333;
const enderecoCliente = process.env.CLIENT_ADDR || 'http://localhost:8080';

const io = require('socket.io')(porta, {
	cors: {
		origin: enderecoCliente,
	},
});

const userIo = io.of('/user');

function criaJwt(id, numeroConta, nome) {
	const payload = { id, numeroConta, nome };
	const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

	return token;
}

io.on('connection', (socket) => {
	console.log('Cliente conectado com id: ' + socket.id);

	socket.on('disconnect', () => {
		console.log('Cliente desconectado com id: ' + socket.id);
	});

	socket.on(
		'registrar_usuario',
		(nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, saldoInicial, callback) => {
			usuarioService
				.create(nome, banco, numeroConta, numeroAgencia, numeroCartao, senha, saldoInicial)
				.then((resultado) => {
					if (resultado.sucesso) {
						resultado.token = criaJwt(resultado.id, numeroConta, nome);
					}

					callback(resultado);
				});
		}
	);

	socket.on('login', (numeroConta, senha, callback) => {
		if (!numeroConta || !senha) {
			callback({ sucesso: false, mensagem: 'Número da conta e senha necessários para login' });
			return;
		}

		usuarioService.getByNumeroConta(numeroConta).then((usuario) => {
			if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
				callback({ sucesso: false, mensagem: 'Erro de autenticação' });
				return;
			}

			callback({
				sucesso: true,
				mensagem: 'Login feito com sucesso',
				token: criaJwt(usuario.id, usuario.numeroConta, usuario.nome),
			});
		});
	});
});

userIo.use((socket, next) => {
	const token = socket.handshake.auth.token;

	if (!token) {
		next(new Error('Erro de autenticação sem token'));
		return;
	}

	try {
		const decode = jwt.verify(token, process.env.JWT_KEY);
		socket.usuario = decode;
		next();
	} catch {
		next(new Error('Erro de autenticação token inválido'));
		return;
	}
});

// Mapa de todos os usuários online e logados no momento
const usuariosOnline = new Map();

userIo.on('connection', (socket) => {
	const usuario = socket.usuario;
	usuariosOnline.set(usuario.numeroConta, socket);

	console.log('Usuário da conta ' + usuario.numeroConta + ' conectado');

	socket.on('disconnect', () => {
		console.log('Usuário da conta ' + usuario.numeroConta + ' desconectado');
		usuariosOnline.delete(usuario.numeroConta);
	});

	socket.on('ver_conta', (callback) => {
		usuarioService.get(socket.usuario.id).then((usuario) => {
			callback(usuario);
		});
	});

	socket.on('ver_cobrancas', () => {
		(async () => {
			const cobrancasPendentes = await cobrancaService.getCobrancasPendentes(usuario.id);

			for (const cobranca of cobrancasPendentes) {
				const remetente = await usuarioService.get(cobranca.idRemetente);

				const remetenteResumido = {
					id: remetente.id,
					numeroConta: remetente.numeroConta,
					nome: remetente.nome,
				};

				const cobrancaResposta = { usuario: remetenteResumido, valor: cobranca.valor, id: cobranca.id };

				socket.emit('receber_cobranca', cobrancaResposta);
			}
		})();
	});

	socket.on('deposito', (valor, callback) => {
		usuarioService.deposito(usuario.numeroConta, valor).then((resultado) => callback(resultado));
	});

	socket.on('fazer_cobranca', (nContaDestinatario, valor, callback) => {
		(async () => {
			if (valor <= 0) {
				callback({ sucesso: false, mensagem: 'A valor da cobrança deve ser maior que zero' });
				return;
			}

			const destinatario = await usuarioService.getByNumeroConta(nContaDestinatario);

			if (!destinatario) {
				callback({ sucesso: false, mensagem: 'Número de conta informado não corresponde a nenhuma registrada' });
				return;
			}

			if (destinatario.id == usuario.id) {
				callback({ sucesso: false, mensagem: 'Não é possível enviar cobrança para você mesmo' });
				return;
			}

			const id = await cobrancaService.criaCobranca(usuario.id, destinatario.id, valor);

			if (!id) {
				callback({ sucesso: false, mensagem: 'Erro ao criar cobrança' });
				return;
			}

			const sDestinatario = usuariosOnline.get(nContaDestinatario);

			if (!sDestinatario) {
				callback({ sucesso: true, mensagem: 'Cobrança enviada com sucesso' });
				return;
			}

			sDestinatario.emit('receber_cobranca', { usuario, valor, id });

			callback({ sucesso: true, mensagem: 'Cobrança enviada com sucesso' });
		})();
	});

	socket.on('responder_cobranca', (idCobranca, numeroContaRemetente, autorizado, senha, callback) => {
		responderCobranca(usuariosOnline.get(numeroContaRemetente), idCobranca, autorizado, senha, callback);
	});

	socket.on('transferir', (destinatario, valor, callback) => {
		if (destinatario == usuario.numeroConta) {
			callback({ sucesso: false, mensagem: 'Não é possível transferir para você mesmo' });
			return;
		}

		usuarioService.transferencia(usuario.numeroConta, destinatario, valor).then((resultado) => {
			callback(resultado);

			if (resultado.sucesso && usuariosOnline.get(destinatario)) {
				usuariosOnline
					.get(destinatario)
					.emit(
						'atualizacao_saldo',
						`Você recebeu uma transferência de ${usuario.nome} no valor de ${valor} centavos`,
						valor
					);
			}
		});
	});
});
