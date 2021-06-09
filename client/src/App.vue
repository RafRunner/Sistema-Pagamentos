<template>
	<router-view />
</template>

<script>
export default {
	name: 'App',
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

body {
	background: #fff;
}

* {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
}

.router-link {
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
