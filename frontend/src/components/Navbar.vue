<template>
	<nav class="bar" v-if="isAuthenticated">
		<div class="left">
			<span class="brand">HyperGuest</span>

			<router-link to="/home" class="link">Home</router-link>

			<router-link v-if="canAccess(['editor', 'admin'])" to="/editor" class="link">
				Editor
			</router-link>

			<router-link v-if="canAccess(['admin'])" to="/admin" class="link">
				Admin
			</router-link>
		</div>

		<div class="right">
			<span class="user">Hi, {{ username }}</span>
			<button class="btn" @click="logout">Logout</button>
		</div>
	</nav>
</template>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const username = computed(() => store.getters.username)
const canAccess = roles => store.getters.canAccess(roles)

const logout = () => {
	store.dispatch("logout")
	router.push("/")
}
</script>

<style scoped>
.bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid #e6e6e6;
	background: white;
}

.left {
	display: flex;
	align-items: center;
	gap: 14px;
}

.brand {
	font-weight: 700;
	letter-spacing: 0.2px;
}

.link {
	text-decoration: none;
	color: #2c3e50;
	padding: 6px 10px;
	border-radius: 8px;
}

.link.router-link-active {
	background: #f3f3f3;
}

.right {
	display: flex;
	align-items: center;
	gap: 12px;
}

.user {
	font-size: 0.95rem;
	color: #444;
}

.btn {
	padding: 6px 10px;
	border-radius: 8px;
	border: 1px solid #ddd;
	background: #fff;
	cursor: pointer;
}

.btn:hover {
	background: #f7f7f7;
}
</style>
