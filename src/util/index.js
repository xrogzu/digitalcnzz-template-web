import store from '@/store/index'

export function auth(value) {
    let auth
    if (typeof value === 'string') {
        auth = store.getters['global/hasPermission'](value)
    } else {
        auth = value.some(item => {
            return store.getters['global/hasPermission'](item)
        })
    }
    return auth
}

export function authAll(value) {
    const auth = value.every(item => {
        return store.getters['global/hasPermission'](item)
    })
    return auth
}

export default {
    install(Vue) {
        Vue.prototype.$toLogin = function() {
            this.$router.push({
                path: '/login',
                query: {
                    redirect: this.$route.fullPath
                }
            })
        }
        Vue.prototype.$auth = auth
        Vue.prototype.$authAll = authAll
        // 注册 v-auth 和 v-auth-all 指令
        Vue.directive('auth', {
            inserted: (el, binding) => {
                if (!auth(binding.value)) {
                    el.remove()
                }
            }
        })
        Vue.directive('auth-all', {
            inserted: (el, binding) => {
                if (!authAll(binding.value)) {
                    el.remove()
                }
            }
        })
    }
}
