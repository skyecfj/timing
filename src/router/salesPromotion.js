const salesPromotionLink = {
    path: '/salesPromotion',
    name: 'salesPromotion',
    component: () => import('@/components/home'),
    meta: {
        title: '第三方促销活动结算业务报表',
        level: 1
    },
    children: [{
        path: 'activeSettlement',
        name: 'activeSettlement',
        component: () => import('@/views/restaurant/salesPromotion/activeSettlement'),
        meta: {
            title: '活动结算统计报表',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'activeSale',
        name: 'activeSale',
        component: () => import('@/views/restaurant/salesPromotion/activeSale'),
        meta: {
            title: '活动销售统计报表',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'activeSaleDetail',
        name: 'activeSaleDetail',
        component: () => import('@/views/restaurant/salesPromotion/activeSaleDetail'),
        meta: {
            title: '活动销售统计报表',
            keepAlive: true
        }
    }, {
        path: 'bondAdditional',
        name: 'bondAdditional',
        component: () => import('@/views/restaurant/salesPromotion/bondAdditional'),
        meta: {
            title: '长假保证金额追加报表',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'bondAdditionalRep',
        name: 'bondAdditionalRep',
        component: () => import('@/views/restaurant/salesPromotion/bondAdditionalRep'),
        meta: {
            title: '长假保证金额追加报表详情',
            keepAlive: true
        }
    }, {
        path: 'accountPeak',
        name: 'accountPeak',
        component: () => import('@/views/restaurant/salesPromotion/accountPeak'),
        meta: {
            title: '活动日结算峰值报表',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'amountWarning',
        name: 'amountWarning',
        component: () => import('@/views/restaurant/salesPromotion/amountWarning'),
        meta: {
            title: '活动预警报表-金额预警',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'effectiveEarlyWarning',
        name: 'effectiveEarlyWarning',
        component: () => import('@/views/restaurant/salesPromotion/effectiveEarlyWarning'),
        meta: {
            title: '活动预警报表-效期预警',
            keepAlive: true,
            level: 2
        }
    },
        {
            path: 'nationThirdSaleProm',
            name: 'nationThirdSaleProm',
            component:() => import('@/views/reportManage/nationThirdSaleProm'),
            meta: {
                title: '第三方促销活动清单',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'smallActivity',
            name: 'smallActivity',
            component:() => import('@/views/reportManage/smallActivity'),
            meta: {
                title: '活动关键信息报表',
                keepAlive: true,
                level:2
            }
        },
        // {
        //     path: 'HandleServiceFeeReport',
        //     name: 'HandleServiceFeeReport',
        //     component:() => import('@/views/reportManage/HandleServiceFeeReport'),
        //     meta: {
        //         title: '手续费服务费差异报表',
        //         keepAlive: true,
        //         level:2
        //     }
        // }
        // {
        //     path: 'alipayFaceToFaceBill',
        //     name: 'alipayFaceToFaceBill',
        //     component:() => import('@/views/restaurant/salesPromotion/alipayFaceToFaceBill'),
        //     meta: {
        //         title: '支付宝当面付对账报表',
        //         keepAlive: true,
        //         level:2
        //     }
        // },
    ]
}
export default salesPromotionLink
