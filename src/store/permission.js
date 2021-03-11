// import { asyncRouterMap, constantRouterMap } from '@/router'
import {asyncPermissionRouter} from '../router/index'
import home from '@/components/home';
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta.level && route.meta.level === 2) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else {
//     return true
//   }
// }
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 */
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        let level = route.meta.level||'';
        return !!(level && level === 2);
    })
}
function filterAsyncRouterLevel1(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        let level = route.permissionLevel;
        return !!(level && level === '3'&& route.updateFlag === '1');
    })
}
function filterAsyncRouterLevel2(asyncRouterMap,flag) {
    return asyncRouterMap.filter(route => {
        let level = route.permissionLevel;
        if(flag){
            return !!(level && level === '4');
        }else{
            return !!(level && level === '4'&& route.updateFlag === '1');
        }
    })
}
function filterAsyncRouterLevel3(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        let level = route.permissionLevel;
        return !!(level && level === '5'&& route.updateFlag === '1');
    })
}
function getDifferent(now,origin){ //去差集，b里不含a的
    let a = new Set(now);
    let b = new Set(origin);
    return [...new Set([...a].filter(x=> !b.has(x)))]
}
function  getIntersect(now,origin) { //数组取交集
    let a = new Set(now);
    let b = new Set(origin);
    return [new Set([...a].filter(x => b.has(x)))];
}
function  getUnion(now,origin) { //数组取并集
    let a = new Set(now);
    let b = new Set(origin);
    return [...new Set([...a,...b])];
}
const permission = {
    state: {
        // routers: constantRouter,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            // state.routers = constantRouter.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                let accessedRouters = [];
                let realLevel2 = [];
                let level3 = [];
                if(data.res.data &&data.res.data.length>0){
                    let routers = data.res.data[0].childPermissionInfos[0].childPermissionInfos;
                    let level1 = filterAsyncRouterLevel1(routers);
                    if(level1 && level1.length > 0){ //从页面添加的一级菜单 二级菜单 三级菜单
                        level1.forEach(function (vv,nn) {
                            let tt0 = {},children0 = [];
                            tt0.path = vv.path;
                            tt0.name = vv.permissionName;
                            tt0.meta = {title:vv.permissionName,level:2};
                            tt0.component = ()=>import('@/components/home');
                            if(vv.updateFlag === '1' && vv.childPermissionInfos &&vv.childPermissionInfos.length>0){    //用户通过界面进行的菜单配置
                                let manualLevel1 = filterAsyncRouterLevel2(vv.childPermissionInfos);
                                if(manualLevel1 && manualLevel1.length>0){
                                    manualLevel1.forEach(function(item1,index1){
                                        let tt1 = {}, children = [];
                                        tt1.path = item1.path;
                                        tt1.name = item1.permissionName;
                                        tt1.meta = {title:item1.permissionName,level:2,keepAlive:true};
                                        tt1.component = ()=>import('@/components/blank');
                                        if(item1.childPermissionInfos && item1.childPermissionInfos.length > 0){
                                            let manualLevel2 = filterAsyncRouterLevel3(item1.childPermissionInfos);
                                            manualLevel2.forEach(function(item2,index2) {
                                                let tt2 = {}
                                                tt2.path = item2.path;
                                                tt2.name = item2.permissionName;
                                                tt2.meta = {title: item2.permissionName, level: 3};
                                                tt2.component = () => import('@/components/blank');
                                                children.push(tt2);
                                            })
                                        }
                                        if(children.length > 0){
                                            tt1.children = children;
                                        }
                                        children0.push(tt1);
                                    })
                                }
                                tt0.children = children0;
                            }
                                accessedRouters.push(tt0)
                        })
                    }
                    if(routers && routers.length>0){
                        routers.forEach(function (item,index) {
                            asyncPermissionRouter.forEach(function (val,num) {
                                if(val.children && item.permissionName === val.meta.title){
                                    let level2= filterAsyncRouter(val.children);
                                    realLevel2 = filterAsyncRouter(val.children);
                                    if(item.childPermissionInfos &&item.childPermissionInfos.length>0){
                                        let manualLevel1 = filterAsyncRouterLevel2(item.childPermissionInfos,true);
                                        if(manualLevel1 && manualLevel1.length>0){
                                            manualLevel1.forEach(function(item1,index1){
                                                let tt1 = {}, children = [];
                                                if(item1.updateFlag === '1'){   //用户自己通过界面自己控制 二级菜单
                                                    tt1.path = item1.path;
                                                    tt1.name = item1.permissionName;
                                                    tt1.meta = {title:item1.permissionName,level:2,keepAlive:true};
                                                    tt1.component = ()=>import('@/components/blank');
                                                    if(item1.childPermissionInfos && item1.childPermissionInfos.length > 0){ //三级菜单
                                                        let manualLevel2 = filterAsyncRouterLevel3(item1.childPermissionInfos);
                                                        manualLevel2.forEach(function(item2,index2) {
                                                            let tt2 = {}
                                                            tt2.path = item2.path;
                                                            tt2.name = item2.permissionName;
                                                            tt2.meta = {title: item2.permissionName, level: 3};
                                                            tt2.component = () => import('@/components/blank');
                                                            children.push(tt2);
                                                        })
                                                    }
                                                    if(children.length>0){
                                                        tt1.children = children
                                                    }
                                                }
                                                if(item1.updateFlag === '0' && item1.childPermissionInfos && item1.childPermissionInfos.length > 0){
                                                    val.children.forEach(function (v8, n8) { //对一级菜单里的二级菜单进行循环
                                                        if (v8.meta.title === item1.permissionName) {
                                                            if(v8.children && v8.children.length>0){  //本地路由里是否含有三级菜单
                                                                var perSize =  item1.childPermissionInfos;
                                                                var oriSize = v8.children;
                                                                // var ori = v8.children;
                                                                if(perSize !== oriSize){ //三级菜单权限控制
                                                                    let arr = [];
                                                                    for(var i=0;i<item1.childPermissionInfos.length;i++){  //从权限树里面筛选
                                                                        for(var j=0;j<v8.children.length;j++){
                                                                            if( perSize[i].permissionName === oriSize[j].meta.title){
                                                                                arr.push(oriSize[j]);
                                                                                break;
                                                                            }
                                                                        }
                                                                    }
                                                                    if(arr.length > 0){
                                                                        v8.children = arr;// 筛选确定有权限的三级菜单
                                                                    }
                                                                }
                                                            }
                                                            item1.childPermissionInfos.forEach(function(item4,index4) {
                                                                if(item4.updateFlag === '1'){     //对新增加的三级菜单，设置路由，该路由为跳转百度
                                                                    let tt2 = {}
                                                                    tt2.path = item4.path;
                                                                    tt2.name = item4.permissionName;
                                                                    tt2.meta = {title: item4.permissionName, level: 3,type:'show'};//正常显示页面，不跳百度
                                                                    tt2.component = () => import('@/components/blank');
                                                                    v8.children = [];
                                                                    v8.children.push(tt2);
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                                if(Object.keys(tt1).length>0){
                                                    val.children.push(tt1)
                                                }
                                            })
                                        }
                                    }
                                    if(val.meta.title === item.permissionName && item.childPermissionInfos ){
                                        let arr = [];
                                        realLevel2.forEach(function (v,n) {
                                            item.childPermissionInfos.forEach(function (v2,n2) {
                                                if(v2.permissionName === v.meta.title){
                                                    delete level2[n];
                                                    // arr.push(level2[n]);
                                                    if(item.childPermissionInfos && item.childPermissionInfos.length > 0){
                                                        item.childPermissionInfos.splice(n2,1);
                                                    }
                                                }
                                            })
                                        });
                                        val.children = getDifferent(val.children,level2);//再取差集
                                        accessedRouters.push(val)
                                        // val.children = getUnion(val.children,level3);//再把三级菜单添加进二级菜单
                                    }
                                }
                            })
                        });
                    }
                }
                commit('SET_ROUTERS', accessedRouters);
                resolve();
            })
        }
    }
}

export default permission
