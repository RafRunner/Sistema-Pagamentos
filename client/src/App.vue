<template>
  <div>
    <Cabecalho titulo="Faça seu cadastro" />

	  <div class="container">
		  <h1>Banco Finanças</h1>
		  <img class="logo" :src="mySVG" />

		  <Entrada titulo="Nome" />
		  <Entrada titulo="Banco" />
	  	<Entrada titulo="Número da Conta" tipo="number" />
	  	<Entrada titulo="Número da Agência" tipo="number" />
	  	<Entrada titulo="Número do Cartão" tipo="number" />
	  	<Entrada titulo="Saldo Inicial" tipo="number" />
	    <Entrada titulo="Senha" tipo="password" />

  		<Botao titulo="Criar Conta" v-on:click="funcaoCriaUsuario()" />
	  </div>
  </div>
</template>

<script>
import Entrada from './components/Entrada.vue';
import Botao from './components/Botao.vue';
import Cabecalho from './components/Cabecalho.vue';
import socket from './io/socket';

export default {
	name: 'App',
	components: {
		Entrada,
		Botao,
    Cabecalho,
	},
  methods: {
    funcaoCriaUsuario () {
      
    },
  },
	data(){
    return {
			mySVG: require('./assets/bank.svg'),
		}
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

.logo {
	width: 50%;
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
