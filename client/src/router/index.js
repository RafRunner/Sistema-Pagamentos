import { createRouter, createWebHistory } from 'vue-router';
import CriarConta from '../views/CriarConta';
import HomePage from '../views/HomePage';
import Login from '../views/Login';

const routes = [
	{
		path: '/criarconta',
		name: 'Criar Conta',
		component: CriarConta
	},
	{
		path: '/',
		name: 'Home',
		component: HomePage
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
