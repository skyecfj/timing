const accountingBusiness =  {
    path: '/checkBusiness',
    component: () => import('@/components/home'),
    name:'checkBusiness',
    meta:
        {
            title:'核算业务',
            level:1
        }
    ,
    children: [
        {
            path: 'billManage',
            name: 'billManage',
            component: () => import('@/views/checkBusiness/billManage.vue'),
            meta: {
                title: '单据管理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'billDetail',
            name: 'billDetail',
            component: () => import('@/views/checkBusiness/billDetail.vue'),
            meta: {
                title: '单据详情',
                keepAlive: true,
            }
        },
        {
            path: 'billParticulars',
            name: 'billParticulars',
            component: () => import('@/views/checkBusiness/billParticulars.vue'),
            meta: {
                title: '单据明细',
                keepAlive: true
            }
        },
        {
            path: 'manualVoucher',
            name: 'manualVoucher',
            component: () => import('@/views/checkBusiness/manualVoucher.vue'),
            meta: {
                title: '手工账务',
                keepAlive: true
            }
        },
        {
            path: 'voucherManage',
            name: 'voucherManage',
            component: () => import('@/views/checkBusiness/voucherManage.vue'),
            meta: {
                title: '凭证管理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'voucherDetail',
            name: 'voucherDetail',
            component: () => import('@/views/checkBusiness/voucherDetail.vue'),
            meta: {
                title: '凭证查看-明细',
                keepAlive: true
            }
        },
        {
            path: 'GroupVoucherMng',
            name: 'GroupVoucherMng',
            component: () => import('@/views/checkBusiness/GroupVoucherMng.vue'),
            meta: {
                title: '内部往来账务',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'GroupVoucherDetail',
            name: 'GroupVoucherDetail',
            component: () => import('@/views/checkBusiness/GroupVoucherDetail.vue'),
            meta: {
                title: '内部往来账务详情',
                keepAlive: true,
            }
        },
        {
            path: 'accountConfig',
            name: 'accountConfig',
            component: () => import('@/views/checkBusiness/accountConfig.vue'),
            meta: {
                title: '账务配置',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'accountDetail',
            name: 'accountDetail',
            component: () => import('@/views/checkBusiness/accountDetail.vue'),
            meta: {
                title: '账务配置-详情',
                keepAlive: true
            }
        },
        {
            path: 'accountCreate',
            name: 'accountCreate',
            component: () => import('@/views/checkBusiness/accountCreate.vue'),
            meta: {
                title: '手动生成账务',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'StoreManualAccounting',
            name: 'StoreManualAccounting',
            component: () => import('@/views/checkBusiness/StoreManualAccounting.vue'),
            meta: {
                title: '手工分录',
                keepAlive: true,
                level:2,
                param:{
                    source: 'leftMenu'
                }
            }
        },
        {
            path: 'manualAccountingCommon',
            name: 'manualAccountingCommon',
            component: () => import('@/views/account/manualAccountingCommon.vue'),
            meta: {
                title: 'BBC手工分录',
                keepAlive: true,
                level:2,
                param:{
                    source: 'leftMenu'
                }
            }
        },
        {
            path: 'closeAccount',
            name: 'closeAccount',
            component:() => import('@/views/closeAccounts/closeAccount'),
            meta: {
                title: '关账管理',
                keepAlive: true,
                level:2
            }
        }

    ]
};
export default accountingBusiness