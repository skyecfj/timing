const manage = {
    path: '/manage',
    component:() => import('@/components/home'),
    name:'manage',
    meta:{
        title:'权限管理',
        level:1
    }
    ,
    children: [
        {
            path: 'roleMgr',
            name: 'roleMgr',
            component:() => import('@/views/manage/roleMgr.vue'),
            meta: {
                title: '角色管理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'userMgr',
            name: 'userMgr',
            component:() => import('@/views/manage/userMgr.vue'),
            meta: {
                title: '用户管理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'addRole',
            name: 'addRole',
            component:() => import('@/views/manage/addRole.vue'),
            meta: {
                title: '添加角色',
                keepAlive: true
            }
        },
        {
            path: 'editRole',
            name: 'editRole',
            component:() => import('@/views/manage/editRole.vue'),
            meta: {
                title: '编辑角色',
                keepAlive: true
            }
        },
        {
            path: 'editUser',
            name: 'editUser',
            component:() => import('@/views/manage/editUser.vue'),
            meta: {
                title: '编辑用户',
                keepAlive: false
            }
        },
        {
            path: 'userMgrAdd',
            name: 'userMgrAdd',
            component:() => import('@/views/manage/userMgrAdd.vue'),
            meta: {
                title: 'FSC管理-新增',
                keepAlive: true
            }
        },
        {
            path: 'checkUser',
            name: 'checkUser',
            component:() => import('@/views/manage/checkUser.vue'),
            meta: {
                title: '查看用户',
                keepAlive: false
            }
        },
        {
            path: 'copyUser',
            name: 'copyUser',
            component:() => import('@/views/manage/copyUser.vue'),
            meta: {
                title: 'FSC管理-新增',
                keepAlive: false
            }
        },
        {
            path: 'permission',
            name: 'permission',
            component:() => import('@/views/manage/permission.vue'),
            meta: {
                title: '功能权限管理',
                keepAlive: true,
                level:2
            }
        }
    ]
}
export default manage