import { createApp } from 'vue';
import App from './App.vue';
import { nomeAplicacao } from './constantes';

createApp(App).mount('#app');

document.getElementById('titulo-site').innerHTML = nomeAplicacao;
