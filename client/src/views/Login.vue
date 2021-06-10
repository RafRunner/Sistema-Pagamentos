<template>
	<div>
		<Cabecalho titulo="Faça seu Login" />

		<div class="container">
			<Logo />

			<Entrada ref="entNumeroConta" titulo="Número da Conta" tipo="number" />
			<Entrada ref="entSenha" titulo="Senha" tipo="password" />

			<Botao titulo="Login" v-on:click="login()" />
		</div>
	</div>
</template>

<script>
import Entrada from '../components/Entrada.vue';
import Botao from '../components/Botao.vue';
import Cabecalho from '../components/Cabecalho.vue';
import Logo from '../components/Logo.vue';
import socket from '../io/socket';
import { createUserSocket, getUserSocket } from '../io/userSocket';

export default {
	name: 'Login',
	components: {
		Entrada,
		Botao,
		Cabecalho,
		Logo,
	},
	mounted() {
		this.checkLogin();
	},
	methods: {
		checkLogin() {
			const userSocket = getUserSocket();

			if (userSocket) {
				this.$router.push('userpage');
			}
		},
		login() {
			const numeroConta = this.$refs.entNumeroConta.getValor();
			const senha = this.$refs.entSenha.getValor();

			socket.emit('login', numeroConta, senha, (resposta) => {
				if (resposta.sucesso) {
					createUserSocket(resposta.token);
					this.$router.push('userpage');
				}
				else {
					alert(resposta.mensagem);
				}
			});
		},
	},
}
</script>
