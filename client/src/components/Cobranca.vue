<template>
	<div 
		@dblclick="$emit('pagar-cobranca', cobranca.id)"
		class="cobranca"
	>
		<h3>
			{{ cobranca.usuario.nome }}
			<i @click="$emit('negar-cobranca', cobranca.id)" class="fas fa-times" />
		</h3>
		<h3>Conta: {{ cobranca.usuario.numeroConta }}</h3>
		<p>{{ valorFormatado }}</p>
	</div>
</template>

<script>
export default {
	name: 'Cobranca',
	props: {
		cobranca: Object,
	},
	data() {
		return {
			valorFormatado: '',
		}
	},
	mounted() {
		this.formataValor();
	},
	methods: {
		formataValor() {
			this.valorFormatado = `R$ ${(this.cobranca.valor / 100).toFixed(2).toString().replace('.', ',')}`
		},
	}
}
</script>

<style scope>
.fas {
	color: red;
}
.cobranca {
	background: #11C76F;
	margin: 5px;
	padding: 10px 20px;
	cursor: pointer;
	box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
}

.cobranca h3 {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>