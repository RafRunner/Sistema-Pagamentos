<template>
	<div>
		<label><b>{{ titulo }}</b></label>
		<input :type=tipo v-model="valor" >
	</div>
</template>

<script>
export default {
	name: 'Entrada',
	props: {
		titulo: String,
		tipo: {
			type: String,
			default: 'text',
		},
	},
	data() {
		return {
			valor: "",
		}
	},
	methods: {
		getValor() {
			return this.valor;
		},
		limpar() {
			this.valor = "";
		}
	},
}
</script>

<style scoped>
div {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
	padding-bottom: 7px;
}

input {
	font-size: 100%;
	height: 30px;
	width: 100%;
	outline-color: transparent;
	border: 0;
	box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
}
</style>
