const taskManage = {
    path: '/taskManage',
    component:() => import('@/components/home'),
    name:'taskManage',
    meta:{
        title: '任务管理',
        level:1
    }
    ,
    children: [
        {
            path: 'taskCenter',
            name: 'taskCenter',
            component:() => import('@/views/taskManage/taskCenter.vue'),
            meta: {
                title: '任务中心',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'taskDetailList',
            name: 'taskDetailList',
            component:() => import('@/views/taskManage/taskDetailList.vue'),
            meta: {
                title: '查看执行记录',
                keepAlive: true
            }
        },
        {
            path: 'dataSourceCenter',
            name: 'dataSourceCenter',
            component:() => import('@/views/taskManage/dataSourceCenter'),
            meta: {
                title: '数据源中心',
                keepAlive: true,
                level:2
            }
        },
         {
            path: 'taskGroup',
            name: 'taskGroup',
            component:() => import('@/views/taskManage/taskGroup'),
            meta: {
                title: '任务组',
                keepAlive: true,
                level:2
            }
        }
    ]
};
export default taskManage