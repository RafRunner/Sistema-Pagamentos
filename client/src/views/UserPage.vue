<template>
	<div>
		<Cabecalho :titulo="`Sua Conta, ${nome}`" />

		<h3 class="saldo" >Seu saldo: {{ saldo }}</h3>

		<div class="horizontal-container">
			<div class="container">
				<h3>Fazer Depósito</h3>

				<Entrada ref="entValorDep" titulo="Valor" tipo="number" />

				<Botao titulo="Confirmar" v-on:click="deposito()" />
			</div>

			<div class="container">
				<h3>Fazer Transferência</h3>

				<Entrada ref="entNumeroContaTransf" titulo="Conta do Destinatário" tipo="number" />
				<Entrada ref="entValorTransf" titulo="Valor" tipo="number" />

				<Botao titulo="Confirmar" v-on:click="transferencia()" />
			</div>
		</div>

		<div class="horizontal-container">
			<div class="container">
				<h3>Fazer Cobrança</h3>

				<Entrada ref="entNumeroContaCobr" titulo="Número da Conta" tipo="number" />
				<Entrada ref="entValorCobr" titulo="Valor" tipo="number" />

				<Botao titulo="Confirmar" v-on:click="fazerCobranca()" />
			</div>

			<div class="container">
				<h3>Cobranças Recebidas</h3>

				<Cobrancas
					@pagar-cobranca="pagarCobranca"
					@negar-cobranca="negarCobranca"
					:cobrancas="cobrancas"
				/>
			</div>
		</div>

		<Botao style="margin-bottom: 40px;" titulo="Logout" v-on:click="logout"/>
	</div>
</template>

<script>
import Cabecalho from '../components/Cabecalho.vue';
import Entrada from '../components/Entrada.vue';
import Botao from '../components/Botao.vue';
import Cobrancas from '../components/Cobrancas.vue';
import { getUserSocket, disconnect } from '../io/userSocket';

let userSocket;
let balanco = 0;

export default {
	name: 'UserPage',
	components: {
		Cabecalho,
		Entrada,
		Botao,
		Cobrancas,
	},
	mounted() {
		this.setUpUserSocket();
	},
	data() {
		return {
			saldo: '',
			nome: '',
			cobrancas: [],
		}
	},
	methods: {
		atualizaSaldo(saldo) {
			this.saldo = `R$ ${(saldo / 100).toFixed(2).toString().replace('.', ',')}`
			balanco = saldo;
		},
		calculaValorCentavos(valor) {
			return Number((valor * 100).toFixed(0))
		},
		setUpUserSocket() {
			userSocket = getUserSocket();

			if (!userSocket) {
				alert('Faça login para acessar essa página!');
				this.$router.push('/');
				return;
			}

			userSocket.emit('ver_conta', (conta) => {
				this.nome = conta.nome;
				this.atualizaSaldo(conta.balanco);
			});

			userSocket.emit('ver_cobrancas');

			userSocket.on('receber_cobranca', cobranca => {
				this.cobrancas.push(cobranca);
			});

			userSocket.on('atualizacao_saldo', (mensagem, mudancaSaldo) => {
				alert(mensagem);
				this.atualizaSaldo(balanco + mudancaSaldo);
			});
		},
		deposito() {
			const valorCentavos = this.calculaValorCentavos(this.$refs.entValorDep.getValor());

			userSocket.emit('deposito', valorCentavos, (resposta) => {
				alert(resposta.mensagem);

				if (resposta.sucesso) {
					this.atualizaSaldo(resposta.novoBalanco);
				}

				this.$refs.entValorDep.limpar();
			});
		},
		transferencia() {
			const destinatario = this.$refs.entNumeroContaTransf.getValor();
			const valorCentavos = this.calculaValorCentavos(this.$refs.entValorTransf.getValor());

			userSocket.emit('transferir', destinatario, valorCentavos, (resposta) => {
				alert(resposta.mensagem);

				if (resposta.sucesso) {
					this.atualizaSaldo(resposta.novoBalanco);
				}

				this.$refs.entNumeroContaTransf.limpar();
				this.$refs.entValorTransf.limpar();
			});
		},
		fazerCobranca() {
			const destinatario = this.$refs.entNumeroContaCobr.getValor();
			const valorCentavos = this.calculaValorCentavos(this.$refs.entValorCobr.getValor());

			userSocket.emit('fazer_cobranca', destinatario, valorCentavos, (resposta) => {
				alert(resposta.mensagem);
				this.$refs.entNumeroContaCobr.limpar();
				this.$refs.entValorCobr.limpar();
			});
		},
		pagarCobranca(id) {
			const cobranca = this.cobrancas.find(cob => cob.id === id);

			const senha = prompt('Confirme sua senha: ');

			userSocket.emit('responder_cobranca', id, cobranca.usuario.numeroConta, true, senha, (resposta) => {
				alert(resposta.mensagem);

				if (resposta.sucesso) {
					this.cobrancas = this.cobrancas.filter(cob => cob.id !== id);
					this.atualizaSaldo(balanco - cobranca.valor);
				}
			});
		},
		negarCobranca(id) {
			const cobranca = this.cobrancas.find(cob => cob.id === id);
			this.cobrancas = this.cobrancas.filter(cob => cob.id !== id);

			userSocket.emit('responder_cobranca', id, cobranca.usuario.numeroConta, false, '', (resposta) => {
				alert(resposta.mensagem);
			});
		},
		logout() {
			disconnect();
			this.$router.push('/');
		},
	},
}
</script>

<style scoped>
.horizontal-container {
	display: flex;
	flex-direction: row;
	justify-content: space-between;

	max-width: 1200px;
	margin: 30px auto;
	overflow: auto;
	padding: 30px;
}

.saldo {
	color: black;
	margin-top: 50px;
	font-size: 50px;
}
</style>
