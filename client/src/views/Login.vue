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
import { createUserSocket } from '../io/userSocket';

export default {
	name: 'CriarConta',
	components: {
		Entrada,
		Botao,
		Cabecalho,
		Logo,
	},
	methods: {
		login () {
			const numeroConta = this.$refs.entNumeroConta.getValor();
			const senha = this.$refs.entSenha.getValor();

			socket.emit('login', numeroConta, senha, (resposta) => {
				alert(resposta.mensagem);

				if (resposta.sucesso) {
					createUserSocket(resposta.token);
				}
			});
		},
	},
}
</script>
