import { createRouter, createWebHistory } from 'vue-router';
import CriarConta from '../views/CriarConta';
import HomePage from '../views/HomePage';
import Login from '../views/Login';
import UserPage from '../views/UserPage';

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
	{
		path: '/userpage',
		name: 'Sua Conta',
		component: UserPage
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
