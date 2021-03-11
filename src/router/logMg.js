const logMg = {
    path: '/center',
    component: () => import('@/components/home'),
    name: 'center',
    meta:
        {
            title: '日志管理',
            level: 1
        }
    ,
    children: [
        {
            path: 'dataLog',
            name: 'dataLog',
            component: () => import('@/views/center/dataLog.vue'),
            meta: {
                title: '数据日志',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'kettleLog',
            name: 'kettleLog',
            component: () => import('@/views/center/kettleLog.vue'),
            meta: {
                title: 'kettle日志',
                keepAlive: true,
                level: 2,
            }
        },
    ]
}
export default logMg