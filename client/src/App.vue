<template>
	<div>
		<Cabecalho titulo="Faça seu cadastro" />

		<div class="container">
			<Logo />

			<Entrada ref="entNome" titulo="Nome" />
			<Entrada ref="entBanco" titulo="Banco" />
			<Entrada ref="entNumeroConta" titulo="Número da Conta" tipo="number" />
			<Entrada ref="entNumeroAgencia" titulo="Número da Agência" tipo="number" />
			<Entrada ref="entCartao" titulo="Número do Cartão" tipo="number" />
			<Entrada ref="entSaldoInicial" titulo="Saldo Inicial" tipo="number" />
			<Entrada ref="entSenha" titulo="Senha" tipo="password" />

			<Botao titulo="Criar Conta" v-on:click="funcaoCriaUsuario()" />
		</div>
	</div>
</template>

<script>
import Entrada from './components/Entrada.vue';
import Botao from './components/Botao.vue';
import Cabecalho from './components/Cabecalho.vue';
import Logo from './components/Logo.vue';
import socket from './io/socket';

export default {
	name: 'App',
	components: {
		Entrada,
		Botao,
		Cabecalho,
		Logo,
	},
	methods: {
		funcaoCriaUsuario () {
			const nome = this.$refs.entNome.getValor();
			const banco = this.$refs.entBanco.getValor();
			const numeroConta = this.$refs.entNumeroConta.getValor();
			const numeroAgencia = this.$refs.entNumeroAgencia.getValor();
			const cartao = this.$refs.entCartao.getValor();
			const saldoInicial = this.$refs.entSaldoInicial.getValor();
			const senha = this.$refs.entSenha.getValor();

			socket.emit('registrar_usuario', nome, banco, numeroConta, numeroAgencia, cartao, senha, saldoInicial, (resposta) => {
				alert(resposta.mensagem);

				if (resposta.sucesso) {
					
				}
			});
		},
	},
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

#app {
	font-family: 'Poppins', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: rgb(255, 255, 255);
}

body {
	background: #fff;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.container {
	max-width: 500px;
	margin: 30px auto;
	overflow: auto;
	border: 5px solid #fff;
	padding: 30px;
	border-radius: 5px;
	box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.2);
	background: rgb(119, 210, 132);
}
</style>
