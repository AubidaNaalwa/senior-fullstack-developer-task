import { createStore } from "vuex"
import axios from "axios"

const TOKEN_KEY = "hg_token"

export default createStore({
	state: {
		token: localStorage.getItem(TOKEN_KEY) || "",
		user: null,
		loading: false,
		error: "",
	},
	getters: {
		isAuthenticated(state) {
			return Boolean(state.token) && Boolean(state.user)
		},
		username(state) {
			return state.user?.username || ""
		},
		roles(state) {
			return Array.isArray(state.user?.roles) ? state.user.roles : []
		},
		canAccess: (state, getters) => (allowedRoles) => {
			if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return true
			return getters.roles.some(r => allowedRoles.includes(r))
		},
	},
	mutations: {
		setLoading(state, value) {
			state.loading = value
		},
		setError(state, message) {
			state.error = message || ""
		},
		setToken(state, token) {
			state.token = token || ""
		},
		setUser(state, user) {
			state.user = user || null
		},
		clearAuth(state) {
			state.token = ""
			state.user = null
		},
	},
	actions: {
		async login({ commit }, username) {
			const value = String(username || "").trim()
			if (!value) return null

			commit("setLoading", true)
			commit("setError", "")

			try {
				const res = await axios.post(`/api/users/login/${encodeURIComponent(value)}`)

				commit("setToken", value)
				localStorage.setItem(TOKEN_KEY, value)

				commit("setUser", res.data)
				return res.data
			} catch (err) {
				commit("setError", err.response?.data?.message || "Login failed")
				throw err
			} finally {
				commit("setLoading", false)
			}
		},

		async fetchCurrentUser({ state, commit }) {
			if (!state.token) return null

			commit("setLoading", true)
			commit("setError", "")

			try {
				const res = await axios.get("/api", {
					headers: { token: state.token },
				})
				commit("setUser", res.data)
				return res.data
			} catch (err) {
				if (err.response?.status === 401) {
					localStorage.removeItem(TOKEN_KEY)
					commit("clearAuth")
				}
				throw err
			} finally {
				commit("setLoading", false)
			}
		},

		async initializeSession({ state, dispatch, commit }) {
			if (!state.token) return null

			try {
				return await dispatch("fetchCurrentUser")
			} catch {
				localStorage.removeItem(TOKEN_KEY)
				commit("clearAuth")
				return null
			}
		},

		logout({ commit }) {
			localStorage.removeItem(TOKEN_KEY)
			commit("clearAuth")
		},
	},
})
