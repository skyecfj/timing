const finalReportLink = {
    path: '/dr/finalReport',
    name: 'finalReport',
    component: () => import('@/components/home'),
    meta: {
        title: '第三方促销活动结算业务',
        level: 1
    },
    children: [{
        path: 'couponCode',
        name: 'couponCode',
        component: () => import('@/views/restaurant/finalReport/couponCode'),
        meta: {
            title: '百胜电子券码核销结算报告',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'couponCodeRep',
        name: 'couponCodeRep',
        component: () => import('@/views/restaurant/finalReport/couponCodeRep'),
        meta: {
            title: '百胜电子券码核销结算报告详情',
            keepAlive: true
        }
    }, {
        path: 'thirdPartyBill',
        name: 'thirdPartyBill',
        component: () => import('@/views/restaurant/finalReport/thirdPartyBill'),
        meta: {
            title: '第三方账单结算报告',
            keepAlive: true,
            level: 2
        }
    },
        {
            path: 'shouldInvoiceMg',
            name: 'shouldInvoiceMg',
            component: () => import('@/views/restaurant/invoiceManage/shouldInvoiceMg'),
            meta: {
                title: '应开具给第三方发票',
                keepAlive: true,
                level: 2
            }
        },
        {
        path: 'thirdPartyBillRep',
        name: 'thirdPartyBillRep',
        component: () => import('@/views/restaurant/finalReport/thirdPartyBillRep'),
        meta: {
            title: '第三方账单结算报告详情',
            keepAlive: true
        }
    }, {
        path: 'intrabranch',
        name: 'intrabranch',
        component: () => import('@/views/restaurant/finalReport/intrabranch'),
        meta: {
            title: 'RSC代收内部往来结算报告',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'intrabranchRep',
        name: 'intrabranchRep',
        component: () => import('@/views/restaurant/finalReport/intrabranchRep'),
        meta: {
            title: 'RSC代收内部往来结算报告详情',
            keepAlive: true
        }
    }, {
        path: 'commissionCharge',
        name: 'commissionCharge',
        component: () => import('@/views/restaurant/finalReport/commissionCharge'),
        meta: {
            title: '手续费/服务费结算报告',
            keepAlive: true,
            level: 2
        }
    }, {
        path: 'commissionChargeRep',
        name: 'commissionChargeRep',
        component: () => import('@/views/restaurant/finalReport/commissionChargeRep'),
        meta: {
            title: '手续费/服务费结算报告详情',
            keepAlive: true
        }
    },
        {
            path: 'shouldInvoiceRep',
            name: 'shouldInvoiceRep',
            component: () => import('@/views/restaurant/invoiceManage/shouldInvoiceRep'),
            meta: {
                title: '应开具给第三方发票详情',
                keepAlive: false
            }
        },
    ]
}
export default finalReportLink
