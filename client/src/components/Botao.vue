<template>
	<button class="btn">{{titulo}}</button>
</template>

<script>
export default {
	name: 'Botao',
	props: {
		titulo: String,
		aoClicar: Function
	}
}
</script>

<style scoped>
.btn {
	display: inline-block;
	background: #2196F3;
	color: #fff;
	border: none;
	padding: 10px 20px;
	margin: 5px;
	border-radius: 5px;
	cursor: pointer;
	text-decoration: none;
	font-size: 15px;
	font-family: inherit;
	box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
}

.btn:focus {
	outline: none;
}

.btn:active {
	transform: scale(0.98);
}

.btn-block {
	display: block;
	width: 100%;
}
</style>