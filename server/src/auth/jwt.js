const jwt = require('jsonwebtoken');

function criaJwt(id, numeroConta, nome) {
	const payload = { id, numeroConta, nome };
	const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h' });

	return token;
}

function verificaToken(token) {
    return jwt.verify(token, process.env.JWT_KEY);
}

module.exports = { criaJwt, verificaToken };
