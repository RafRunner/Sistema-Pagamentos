<template>
	<div>
		<Cabecalho titulo="Faça seu cadastro" />

		<form @submit="criarUsuario" class="container">
			<Logo />

			<Entrada ref="entNome" titulo="Nome" />
			<Entrada ref="entBanco" titulo="Banco" />
			<Entrada ref="entNumeroConta" titulo="Número da Conta" tipo="number" />
			<Entrada ref="entNumeroAgencia" titulo="Número da Agência" tipo="number" />
			<Entrada ref="entCartao" titulo="Número do Cartão" tipo="number" />
			<Entrada ref="entSaldoInicial" titulo="Saldo Inicial" tipo="number" />
			<Entrada ref="entSenha" titulo="Senha" tipo="password" />

			<Botao titulo="Criar Conta" v-on:click="criarUsuario()" />
		</form>
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
		criarUsuario () {
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
					createUserSocket(resposta.token);
					this.$router.push('userpage');
				}
			});
		},
	},
}
</script>
