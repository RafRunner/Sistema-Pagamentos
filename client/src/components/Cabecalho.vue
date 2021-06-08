<template>
	<header>
		<p>{{ titulo }}</p>
	</header>
</template>

<script>
import { nomeAplicacao } from '../constantes';

export default {
	name: 'Cabecalho',
	props: {
		titulo: {
			type: String,
			default: nomeAplicacao,
		},
	},
}
</script>

<style scoped>
header {
	display: flex;
	height: 250px;
	background: #11C76F;
	align-items: center;
	justify-content: center;
}

p {
	font-weight: bolder;
	font-size: 50px;
}
</style>
