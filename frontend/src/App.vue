<template>
	<div>
		<Navbar />
		<router-view />
	</div>
</template>

<script setup>
import { onMounted } from "vue"
import { useStore } from "vuex"
import Navbar from "./components/Navbar.vue"

const store = useStore()

onMounted(() => {
	store.dispatch("initializeSession")
})
</script>
