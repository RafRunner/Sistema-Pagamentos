<template>
	<div>
		<Cabecalho titulo="Bem vindo ao Zap Pagamentos" />

		<div class="container">
			<Logo />
			<router-link class="router-link" to="/login">Fazer Login</router-link>
			<router-link class="router-link" to="/criarconta">Criar Conta</router-link>
		</div>
	</div>
</template>

<script>
import Cabecalho from '../components/Cabecalho.vue';
import Logo from '../components/Logo.vue';

export default {
	name: 'HomePage',
	components: {
		Cabecalho,
		Logo,
	},
}
</script>
