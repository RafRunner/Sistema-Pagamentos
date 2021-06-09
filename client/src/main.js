import { createApp } from 'vue';
import App from './App.vue';
import { nomeAplicacao } from './constantes';
import router from './router';

createApp(App).use(router).mount('#app');

document.getElementById('titulo-site').innerHTML = nomeAplicacao;
