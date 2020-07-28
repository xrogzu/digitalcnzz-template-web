import Layout from '@/layout'

export default {
    path: '/permission_example',
    component: Layout,
    redirect: '/permission_example/index',
    name: 'permissionExample',
    meta: {
        title: '权限演示',
        icon: 'permission'
    },
    children: [
        {
            path: 'index',
            name: 'permissionExampleIndex',
            component: () => import(/* webpackChunkName: 'permission_example' */ '@/views/permission_example'),
            meta: {
                title: '权限演示',
                auth: ['permission.browse'],
                sidebar: false,
                activeMenu: '/permission_example'
            }
        }
    ]
}
