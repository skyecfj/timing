const storeCheck = {
    path: '/storeCheck',
    component: () => import('@/components/home'),
    name: 'storeCheck',
    meta:
        {
            title: '餐厅核对业务',
            level: 1
        },
    children: [
        {
            path: 'cashBusiness',
            component: () => import('@/views/index.vue'),
            name: 'cashBusiness',
            // redirect: '/storeCheck/cashBusiness/CashBusinessCheck',
            meta: {
                title: '现金业务',
                level: 2,
            },
            children: [
                {
                    path: 'CashBusinessCheck',
                    name: 'CashBusinessCheck',
                    component:() => import('@/views/restaurant/dataCheck/cashBusinessCheck'),
                    meta: {
                        title: '现金业务手工核对',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cashNotSavedIntoBank',
                    name: 'cashNotSavedIntoBank',
                    component:() => import('@/views/restaurant/dataCheck/cashNotSavedIntoBank'),
                    meta: {
                        title: '现金未存行或少存行查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },

            ]
        },
        {
            path: 'nonCash',
            component: () => import('@/views/index.vue'),
            name: 'nonCash',
            meta: {
                title: '非现金业务',
                level: 2,
            },
            children: [
                {
                    path: 'BOHandThirdPartBillCheck',
                    name: 'BOHandThirdPartBillCheck',
                    component:() => import('@/views/restaurant/dataCheck/BOHandThirdPart/BOHandThirdPartBillCheck'),
                    meta: {
                        title: 'BOH与第三方账单核对',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'NonCashBOHandThirdPart',
                    name: 'NonCashBOHandThirdPart',
                    component:() => import('@/views/restaurant/dataCheck/nonchasBOHandThirdPart'),
                    meta: {
                        title: 'BOH与第三方账单核对结果',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'ThirdpartBillAndBankStatement',
                    name: 'ThirdpartBillAndBankStatement',
                    component:() => import('@/views/restaurant/dataCheck/thirdpartBillAndBankStatement'),
                    meta: {
                        title: '第三方账单与银行流水核对',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'taxIncomeAdjustmentAudit',
                    name: 'taxIncomeAdjustmentAudit',
                    component:() => import('@/views/restaurant/dataCheck/taxIncomeAdjustmentAudit'),
                    meta: {
                        title: '含税收入调整审核',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
            ]
        },
        {
            path: 'shouldPayProcedureFee',
            name: 'shouldPayProcedureFee',
            component: () => import('@/views/restaurant/invoiceManage/shouldPayProcedureFee'),
            meta: {
                title: '应付手续费发票管理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'CashATBl',
            name: 'CashATBl',
            component:() => import('@/views/restaurant/dataCheck/cashATbl'),
            meta: {
                title: 'CASH_A',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'BOHandThirdPartBillAdjust',
            name: 'BOHandThirdPartBillAdjust',
            component:() => import('@/views/restaurant/dataCheck/BOHandThirdPart/BOHandThirdPartBillAdjust'),
            meta: {
                title: '差异定位',
                keepAlive: true,
            }
        },{
            path: 'AllCheckDetailInOrders',
            name: 'AllCheckDetailInOrders',
            component:() => import('@/views/restaurant/dataCheck/BOHandThirdPart/AllCheckDetailInOrders'),
            meta: {
                title: '订单级核对',
                keepAlive: true,
            }
        }
    ]
}
export default storeCheck