import Vue from 'vue';
import Router from 'vue-router';
// import dataCheckRes from './restaurant/dataCheck'
// import dataManageRes from './restaurant/dataManage'
import finalReport from './finalReport'
// import salesPromotion from './restaurant/salesPromotion'
// import invoiceManage from './restaurant/invoiceManage'
import accountingBusiness from './accountingbusiness'
// import center from './BBC/center'
// import closeAccount from './BBC/closeaccount'
// import dataCheckBBC from './BBC/datacheck'
import manage from './manage'
// import reportManage from './BBC/reportmanage'
import taskManage from './taskmanage'
// import masterManage from './BBC/mastermanage'
import buzDataCenter from './E-BusinessDataCenter'
import storeDateCenter from './storeDataCenter'
import buzCheck from './E-businessCheck'
import logMg from './logMg'
import salesPromotion from './salesPromotion'
import storeCheck from './storeCheck'
import storeBusReport from './storeBusReport'
import buzReport from './E-busReport'
import masterData from './masterdata'
export const asyncPermissionRouter = [
    accountingBusiness,
    // center,
    // closeAccount,
    // dataCheckBBC,
    manage,
    // reportManage,
    // taskManage,
    // dataManageRes,
    // dataCheckRes,
    // masterManage,
    finalReport,
    // salesPromotion,
    // invoiceManage,
    // thirdBillReport
    buzDataCenter,
    storeDateCenter,
    buzCheck,
    taskManage,
    logMg,
    salesPromotion,
    storeCheck,
    storeBusReport,
    buzReport,
    masterData
]
Vue.use(Router);
export default new Router({
    routes: [
        // {path: '*', redirect: '/404', hidden: true},
        {path: '/404', component: () => import('@/components/common/NotFoundComponent'),hidden: true},
        {path: '/401', component: () => import('@/components/errorPage/401'),hidden: true},
        {
            path: '/home',
            name:'home',
            hidden:true,
            meta: {
                    title: '首页',
            },
            component:() => import('@/components/home'),
            children:[{
                path: 'warnMessage',
                name: 'warnMessage',
                component: ()=>import('@/views/warnMessage.vue'),
                 meta: {
                    title: '任务通知列表',
                    keepAlive:false
                 }
          }]
        },

        {
            path:'/',
            redirect:'/home',
        },
        {
            path: '/login',
            name:'login',
            component:() => import('@/views/login.vue'),
            meta:{
                title:'login',
                keepAlive:false
            }
        },
    ]
})
;
