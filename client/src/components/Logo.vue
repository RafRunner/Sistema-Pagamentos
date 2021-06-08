<template>
	<div>
		<h1>{{ nomeAplicacao }}</h1>
		<img :src="mySVG" />
	</div>
</template>

<script>
import { nomeAplicacao } from '../constantes';

export default {
	name: 'Logo',
	data() {
		return {
			mySVG: require('../assets/bank.svg'),
			nomeAplicacao, 
		}
	},
}
</script>

<style scoped>
img {
	width: 50%;
}
</style>
