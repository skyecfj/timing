const busDataCenter = {
    path: '/E-busDataCenter',
    component: () => import('@/components/home'),
    name: 'E-busDataCenter',
    meta:
        {
            title: '电商数据中心',
            level: 1
        },
    children: [
        {
            path: 'dataView',
            component: () => import('@/views/center/business/dataView.vue'),
            name: 'dataView',
            meta: {
                title: '订单/账单',
                level: 2,
                keepAlive: true,
            },
        },
        {
            path: 'salesUpdate',
            name: 'salesUpdate',
            component: () => import('@/views/center/business/salesUpdate'),
            meta: {
                title: '券码售价变更',
                level: 2,
                keepAlive: true,
            }
        },
        {
            path: 'couponOwnReCheck',
            name: 'couponOwnReCheck',
            component: () => import('@/views/center/business/couponOwnReCheck.vue'),
            meta: {
                title: '券码Activity Group配置不正确',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'couponSale',
            name: 'couponSale',
            component: () => import('@/views/center/business/couponSale'),
            meta: {
                title: '券码售卖信息查询',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'commodityTypeMaintain',
            name: 'commodityTypeMaintain',
            component: () => import('@/views/center/business/commodityTypeMaintain.vue'),
            meta: {
                title: '订单缺少商品主档明细',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'tmStoreOrderData',
            name: 'tmStoreOrderData',
            component: () => import('@/views/center/business/tmStoreOrderData'),
            meta: {
                title: '天猫商城订单有对接平台无',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'tmStorePlatformOrder',
            name: 'tmStorePlatformOrder',
            component: () => import('@/views/center/business/tmStorePlatformOrder'),
            meta: {
                title: '天猫对接平台订单有天猫商城无',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'smallPaperInventory',
            name: 'smallPaperInventory',
            component: () => import('@/views/center/business/smallPaperInventory'),
            meta: {
                title: '小额纸质盘点',
                keepAlive: true,
                level: 2,
            }
        },
        {
            path: 'ownCoupon',
            component: () => import('@/views/index.vue'),
            name: 'ownMall',
            meta: {
                title: '百胜卡/百胜电子券码查询',
                level: 2,
            },
            children: [
                {
                    path: 'vdmCouponConsumeSea',
                    name: 'vdmCouponConsumeSea',
                    component: () => import('@/views/reportManage/vdmCouponConsumeSea'),
                    meta: {
                        title: '百胜电子券码核销及撤销核销查询',
                        keepAlive: true,
                        level: 3,
                        type:'show'
                    }
                },

                {
                    path: 'consumeSearch',
                    name: 'consumeSearch',
                    component:() => import('@/views/reportManage/consumeSearch'),
                    meta: {
                        title: '百胜卡核销及撤销核销查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
            ]
        },
    ]
}
export default busDataCenter
