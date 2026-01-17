import { createRouter, createWebHistory } from "vue-router"
import store from "../store"
import Login from "../views/Login.vue"

const routes = [
	{ path: "/", name: "Login", component: Login },

	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue"),
		meta: { allowedRoles: ["regular", "editor", "admin"] },
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
		meta: { allowedRoles: ["editor", "admin"] },
	},
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { allowedRoles: ["admin"] },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach(async to => {
	if (to.path === "/") return true

	if (!store.state.user && store.state.token) {
		await store.dispatch("initializeSession")
	}

	if (!store.getters.isAuthenticated) {
		return { path: "/" }
	}

	const allowedRoles = to.meta?.allowedRoles
	if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
		if (!store.getters.canAccess(allowedRoles)) {
			return { path: "/home" }
		}
	}

	return true
})

export default router
