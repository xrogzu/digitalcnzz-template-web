import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // progress bar style

Vue.use(Router)

import Layout from '@/layout'
import KeepAliveLayout from '@/layout/keepAlive'

const constantRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'dashboard',
                component: () => import('@/views/index'),
                meta: {
                    title: '控制台'
                }
            },
            {
                path: 'personal',
                component: KeepAliveLayout,
                redirect: '/personal/setting',
                meta: {
                    title: '个人中心',
                    breadcrumb: false
                },
                children: [
                    {
                        path: 'setting',
                        name: 'personalSetting',
                        component: () => import('@/views/personal/setting'),
                        meta: {
                            title: '个人设置'
                        }
                    },
                    {
                        path: 'edit/password',
                        name: 'personalEditPassword',
                        component: () => import('@/views/personal/edit.password'),
                        meta: {
                            title: '修改密码'
                        }
                    }
                ]
            }
        ]
    }
]

import MultilevelMenuExample from './modules/multilevel.menu.example'
import BreadcrumbExample from './modules/breadcrumb.example'
import HeaderExample from './modules/header.example'
import ComponentExample from './modules/component.example'
// import PermissionExample from './modules/permission.example'
// import KeepAliveExample from './modules/keep.alive.example'
// import ExTernalLinkExample from './modules/external.link.example'

// 此处的代码仅作演示用，实际开发中，头部只会保留一种展示形式，要么显示，要么不显示，所以只需保留 if-else 条件里的其中一段即可
let asyncRoutes
if (store.state.global.showHeader) {
    asyncRoutes = [
        {
            meta: {
                title: '头部导航1',
                icon: 'layout'
            },
            children: [
                MultilevelMenuExample,
                BreadcrumbExample,
                ComponentExample
            ]
        },
        {
            meta: {
                title: '头部导航2',
                icon: 'layout'
            },
            children: [
                HeaderExample
            ]
        }
    ]
} else {
    asyncRoutes = [
        MultilevelMenuExample,
        BreadcrumbExample,
        ComponentExample
    ]
}

const lastRoute = [{
    path: '*',
    component: () => import('@/views/404'),
    meta: {
        title: '404',
        sidebar: false
    }
}]

const router = new Router({
    routes: constantRoutes
})

// 解决路由在跳转时 push 了相同地址报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return originalPush.call(this, location).catch(err => err)
}

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    // 已经登录，但还没根据权限动态挂载路由
    if (store.getters['token/isLogin'] && !store.state.global.permissionInit) {
		/**
		 * 重置 matcher
		 * https://blog.csdn.net/baidu_28647571/article/details/101711682
		 */
        router.matcher = new Router({
            routes: constantRoutes
        }).matcher
        const accessRoutes = await store.dispatch('global/generateRoutes', {
            asyncRoutes,
            currentPath: to.path
        })
        router.addRoutes(accessRoutes)
        router.addRoutes(lastRoute)
        next({ ...to, replace: true })
    }
    if (store.state.global.showHeader) {
        store.commit('global/setHeaderActive', to.path)
    }
    if (store.state.global.dynamicTitle) {
        to.meta.title && store.commit('global/setTitle', to.meta.title)
    }
    if (store.getters['token/isLogin']) {
        if (to.name) {
            if (to.matched.length !== 0) {
                next()
                NProgress.done()
            } else {
                // 如果是通过 name 跳转，并且 name 对应的路由没有权限时，需要做这步处理，手动指向到 404 页面
                next({
                    path: '/404'
                })
                NProgress.done()
            }
        } else {
            next()
            NProgress.done()
        }
    } else {
        if (to.name != 'login') {
            next({
                name: 'login',
                query: {
                    redirect: to.fullPath
                }
            })
            NProgress.done()
        } else {
            next()
            NProgress.done()
        }
    }
})

export default router
