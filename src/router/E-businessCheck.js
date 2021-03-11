const buzCheck = {
    path: '/E-buzCheck',
    component: () => import('@/components/home'),
    name: 'E-buzCheck',
    meta:
        {
            title: '电商核对业务',
            level: 1
        },
    children: [
        {
            path: 'dataReduction',
            name: 'dataReduction',
            component:() => import('@/views/account/dataReduction.vue'),
            meta: {
                title: '数据整理',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'B2B_checkResults',
            name: 'checkResultsB2B',
            component:() => import('@/views/account/checkResultsB2B.vue'),
            meta: {
                title: 'B2B核对结果',
                keepAlive: true,
                level:2,
                param:{
                    businessType: 'B2B'
                }
            }
        },
        {
            path: 'B2C_checkResults',
            name: 'checkResultsB2C',
            component:() => import('@/views/account/checkResultsB2C.vue'),
            meta: {
                title: 'B2C核对结果',
                keepAlive: true,
                level:2,
                param:{
                    businessType: 'B2C'
                }
            }
        },
        {
            path: 'checkSame',
            name: 'checkSame',
            component:() => import('@/views/account/checkSame.vue'),
            meta: {
                title: '核对无差异',
                keepAlive: true
            }
        },
        {
            path: 'checkSumDiff',
            name: 'checkSumDiff',
            component:() => import('@/views/account/checkSumDiff.vue'),
            meta: {
                title: '金额不一致',
                keepAlive: true
            }
        },
        {
            path: 'checkChanNoBill',
            name: 'checkChanNoBill',
            component:() => import('@/views/account/checkChanNoBill.vue'),
            meta: {
                title: '售卖渠道有账单无',
                keepAlive: true
            }
        },
        {
            path: 'checkBillNoChan',
            name: 'checkBillNoChan',
            component:() => import('@/views/account/checkBillNoChan.vue'),
            meta: {
                title: '售卖渠道无账单有',
                keepAlive: true
            }

        },
        {
            path: 'manualAccountingCheck',
            name: 'manualAccountingCheck',
            component:() => import('@/views/account/manualAccountingCheck.vue'),
            meta: {
                title: '手工分录',
                keepAlive: true
            }

        }
    ]
}
export default buzCheck