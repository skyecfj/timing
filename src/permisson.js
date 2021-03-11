/**
* Created by xiaoxiaozhang on 8/16/2018.
*/
import router from './router'
import { getToken } from './utils/auth'
import store from './store'
import { Message } from 'element-ui'
import { Loading } from 'element-ui';
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
// console.log('token',getToken());
// const loading = Loading.service({
//     lock: true,
//     text: 'Loading',
//     spinner: 'el-icon-loading',
//     background: 'rgba(0, 0, 0, 0.7)'
// });
router.beforeEach((to, from, next) => {
    if (getToken()) { // determine if there has token
        /* has token*/
        // if (to.matched.length === 0) {
        //     from.name ? next({name: from.name}) : next('/')
        // }
        // else {
            if (to.path === '/login') {
                next()
            } else {
                if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                    store.dispatch('GetUserInfo').then(res => { // 拉取user_info
                        if (res.code === 200) {
                            store.dispatch('GenerateRoutes', {res}).then(() => { // 根据roles权限生成可访问的路由表
                                router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
                                if (to.path === '/home') {
                                    let firstRouter = '', parent = store.getters.addRouters;
                                    let data = parent[0].children ? parent[0].children : parent[1].children ? parent[1].children : parent[2].children;
                                    let path = parent[0].children ? parent[0].path : parent[1].children ? parent[1].path : parent[2].path;
                                    if (data && data.length > 0) {
                                        for (var i = 0; i < data.length; i++) {
                                            if (data[i].meta.level && data[i].meta.level === 2) {
                                                firstRouter = path + '/' + data[i].path;
                                                sessionStorage.setItem('defaultIndex', parent[0].name);
                                                break;
                                            }
                                        }
                                    }
                                    next({path: firstRouter});
                                } else {
                                    next({...to, replace: true}) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                                }
                            })
                        } else {//无权限也进入空
                            // 白页
                            next();
                        }
                    }).catch((err) => {
                        store.dispatch('FedLogOut').then(() => {
                            Message.error(err || 'Verification failed, please login again');
                            next({path: '/'})
                            // loading.close();
                        })
                    });
                    store.dispatch('getPermissionBtnbs')
                }
                else {
                    next();
                    // loading.close();
                    //     // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
                    //     if (hasPermission(store.getters.roles, to.meta.roles)) {
                    //         next()
                    //     } else {
                    //         next({ path: '/401', replace: true, query: { noGoBack: true }})
                    //     }
                    //     // 可删 ↑
                }
            // }
        }
    } else {
        /* has no token*/
        if (to.matched.length === 0) {
            from.name ? next({name: from.name}) : next('/')
        } else {
            next()
        }
        // loading.close();
    }
});