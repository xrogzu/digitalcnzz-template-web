/**
 * 存放全局公用状态
 */
import setting from '@/setting'

function hasPermission (permissions, route) {
    if (route.meta && route.meta.auth) {
        return permissions.some(auth => {
            if (typeof route.meta.auth == 'string') {
                return route.meta.auth === auth
            } else {
                return route.meta.auth.some(routeAuth => {
                    return routeAuth === auth
                })
            }
        })
    } else {
        return true
    }
}

function filterAsyncRoutes (routes, permissions) {
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(permissions, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, permissions)
                tmp.children.length && res.push(tmp)
            } else {
                res.push(tmp)
            }
        }
    })
    return res
}

const state = {
    ...setting,
    // 如果未开启 openPermission 则 permissionInit 和 permissions 参数不会使用到
    permissionInit: false,
    permissions: [],
    // 如果未开启 showHeader 则 allRoutes 和 headerNavActive 参数不会使用到
    allRoutes: [],
    headerNavActive: 0,
    // 侧边栏导航，通过路由自动生成
    sidebarRoutes: [],
    // 页面标题
    title: '',
    // 是否显示搜索
    openSearch: false
}

const getters = {
    hasPermission: state => permissions => {
        if (state.openPermission) {
            return state.permissions.some(v => {
                return v === permissions
            })
        } else {
            return true
        }
    }
}

const actions = {
    // 获取我的权限
    getPermissions ({ rootState, commit }) {
        return new Promise(resolve => {
            // 模拟权限数据
            let permissions
            if (rootState.token.account == 'digitalcnzz') {
                permissions = [
                    'permission.browse'
                ]
            } else {
                permissions = [
                    'permission.browse',
                    'permission.create',
                    'permission.edit',
                    'permission.remove'
                ]
            }
            commit('setPermissions', permissions)
            resolve(permissions)
        })
    },
    // 根据权限动态生成路由
    generateRoutes ({ state, dispatch, commit }, data) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async resolve => {
            let accessedRoutes
            // 判断权限功能是否开启
            if (state.openPermission) {
                const permissions = await dispatch('getPermissions')
                accessedRoutes = filterAsyncRoutes(data.asyncRoutes, permissions)
            } else {
                accessedRoutes = data.asyncRoutes
            }
            commit('setRoutes', {
                routes: accessedRoutes,
                currentPath: data.currentPath
            })
            let routes = []
            if (state.showHeader) {
                accessedRoutes.map(item => {
                    routes.push(item.children)
                })
                routes = routes.flat()
            } else {
                routes = accessedRoutes
            }
            resolve(routes)
        })
    }
}

const mutations = {
    setPermissions (state, permissions) {
        state.permissions = permissions
    },
    setRoutes (state, data) {
        state.permissionInit = true
        if (state.showHeader) {
            state.allRoutes = JSON.parse(JSON.stringify(data.routes))
            this.commit('global/setHeaderActive', data.currentPath)
        } else {
            state.sidebarRoutes = JSON.parse(JSON.stringify(data.routes))
        }
    },
    setHeaderActive (state, currentPath) {
        state.allRoutes.map((item, index) => {
            if (item.children.some(r => currentPath.indexOf(r.path) === 0)) {
                state.headerNavActive = index
            }
        })
        console.log('Index', state.headerNavActive)
        console.log('allRoutes', state.allRoutes[state.headerNavActive])
        state.sidebarRoutes = state.allRoutes[state.headerNavActive].children
    },
    switchHeader (state, index) {
        state.headerNavActive = index
        state.sidebarRoutes = state.allRoutes[index].children
    },
    invalidRoutes (state) {
        state.permissionInit = false
    },
    setTitle (state, title) {
        state.title = title
    },
    toggleSearch (state) {
        state.openSearch = !state.openSearch
    }
}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}
