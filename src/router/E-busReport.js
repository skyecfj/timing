const EBusReport = {
    path: '/E-busReport',
    component: () => import('@/components/home'),
    name: 'E-busReport',
    meta:
        {
            title: '电商业务报表',
            level: 1
        },
    children: [
        {
            path: 'fscDdmCoupon',
            component: () => import('@/views/index.vue'),
            name: 'fscDdmCoupon',
            // redirect: '/E-busReport/fscDdmCoupon/vdmCouponConsume',
            meta: {
                title: '百胜电子券码',
                level: 2,
            },
            children: [
                {
                    path: 'vdmCouponConsume',
                    name: 'vdmCouponConsume',
                    component:() => import('@/views/reportManage/vdmCouponConsume'),
                    meta: {
                        title: '电子券码核销报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'vdmCouponAging',
                    name: 'vdmCouponAging',
                    component:() => import('@/views/reportManage/vdmCouponAging'),
                    meta: {
                        title: '电子券码账龄报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'vdmCouponDetail',
                    name: 'vdmCouponDetail',
                    component:() => import('@/views/reportManage/vdmCouponDetail'),
                    meta: {
                        title: '预售电子券码核销明细查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'vdmCouponMonth',
                    name: 'vdmCouponMonth',
                    component:() => import('@/views/reportManage/vdmCouponMonth'),
                    meta: {
                        title: '预售电子券码核销月度（和环胜电商结算）报告查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'couponSellReport',
                    name: 'couponSellReport',
                    component:() => import('@/views/reportManage/couponSellReport'),
                    meta: {
                        title: '电子券码售卖报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'vdmMonActivitySales',
                    name: 'vdmMonActivitySales',
                    component:() => import('@/views/reportManage/vdmMonActivitySales'),
                    meta: {
                        title: '券当月售卖明细券码查询按券活动组',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'monthlyBalanceCheck',
                    name: 'monthlyBalanceCheck',
                    component:() => import('@/views/reportManage/monthlyBalanceCheck'),
                    meta: {
                        title: '券平衡报告按券名称',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'couponAmount',
                    name: 'couponAmount',
                    component:() => import('@/views/reportManage/couponAmount'),
                    meta: {
                        title: '券余额核对报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'couponRecordInconformity',
                    name: 'couponRecordInconformity',
                    component: () => import('@/views/reportManage/couponRecordInconformity'),
                    meta: {
                        title: '主券核销次数与子券核销记录不一致报表',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'fscCard',
            component: () => import('@/views/index.vue'),
            name: 'fscCard',
            meta: {
                title: '百胜卡',
                level: 2,
            },
            children: [
                {
                    path: 'sellCardSearch',
                    name: 'sellCardSearch',
                    component:() => import('@/views/reportManage/sellCardSearch'),
                    meta: {
                        title: '实体卡售卖查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'consumeMonth',
                    name: 'consumeMonth',
                    component:() => import('@/views/reportManage/consumeMonth'),
                    meta: {
                        title: '月百胜卡核销报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'sellReportMonth',
                    name: 'sellReportMonth',
                    component:() => import('@/views/reportManage/sellReportMonth'),
                    meta: {
                        title: '月百胜卡售卖报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                // {
                //     path: 'consumeSearch',
                //     name: 'consumeSearch',
                //     component:() => import('@/views/reportManage/consumeSearch'),
                //     meta: {
                //         title: '卡核销查询',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'virtualPlatformSales',
                    name: 'virtualPlatformSales',
                    component:() => import('@/views/reportManage/virtualPlatformSales'),
                    meta: {
                        title: '虚拟平台零售订单查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'backCardDetail',
                    name: 'backCardDetail',
                    component:() => import('@/views/reportManage/backCardDetail'),
                    meta: {
                        title: '退卡明细查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardSearch',
                    name: 'cardSearch',
                    component:() => import('@/views/reportManage/cardSearch'),
                    meta: {
                        title: '卡片查询',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardPlatDifference',
                    name: 'cardPlatDifference',
                    component:() => import('@/views/reportManage/cardPlatDifference'),
                    meta: {
                        title: '卡平台差异分析报告',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'giftCardAging',
                    name: 'giftCardAging',
                    component:() => import('@/views/reportManage/giftCardAging'),
                    meta: {
                        title: '礼品卡账龄报告',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardTransMonth',
                    name: 'cardTransMonth',
                    component:() => import('@/views/reportManage/cardTransMonth'),
                    meta: {
                        title: '百胜卡结算单',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardTransDetail',
                    name: 'cardTransDetail',
                    component:() => import('@/views/reportManage/cardTransDetail'),
                    meta: {
                        title: '卡核销明细报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardPlatBalance',
                    name: 'cardPlatBalance',
                    component:() => import('@/views/reportManage/cardPlatBalance'),
                    meta: {
                        title: '卡平台累计平衡报告',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                // {
                //     path: 'paymentNonactivatedOrder',
                //     name: 'paymentNonactivatedOrder',
                //     component:() => import('@/views/reportManage/paymentNonactivatedOrder'),
                //     meta: {
                //         title: '月末已收款未激活订单',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'paymentNonactivatedCard',
                    name: 'paymentNonactivatedCard',
                    component:() => import('@/views/reportManage/paymentNonactivatedCard'),
                    meta: {
                        title: '已收款未激活实体卡报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardBalanceCheck',
                    name: 'cardBalanceCheck',
                    component:() => import('@/views/reportManage/cardBalanceCheck'),
                    meta: {
                        title: '卡片余额核对报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'giftCardAccount',
                    name: 'giftCardAccount',
                    component:() => import('@/views/reportManage/giftCardAccount'),
                    meta: {
                        title: '礼品卡结算报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'giftCardManageCost',
                    name: 'giftCardManageCost',
                    component:() => import('@/views/reportManage/giftCardManageCost'),
                    meta: {
                        title: '礼品卡管理费报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'giftCardShare',
                    name: 'giftCardShare',
                    component:() => import('@/views/reportManage/giftCardShare'),
                    meta: {
                        title: '礼品卡折扣及手续费分摊',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardConsumeDiffDetail',
                    name: 'cardConsumeDiffDetail',
                    component:() => import('@/views/reportManage/cardConsumeDiffDetail'),
                    meta: {
                        title: '核销报告差异明细',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
            ]
        },
        {
            path: 'integral2',
            component: () => import('@/views/index.vue'),
            name: 'integral2',
            meta: {
                title: '积分',
                level: 2,
            },
            children: [
                // {
                //     path: 'integralVerification',
                //     name: 'integralVerification',
                //     component:() => import('@/views/reportManage/integralVerification'),
                //     meta: {
                //         title: '积分按开票单位核销汇总',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'verificationCouponCode',
                    name: 'verificationCouponCode',
                    component:() => import('@/views/reportManage/verificationCouponCode'),
                    meta: {
                        title: '积分券码核销报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                // {
                //     path: 'integralStoreSummary',
                //     name: 'integralStoreSummary',
                //     component:() => import('@/views/reportManage/integralStoreSummary'),
                //     meta: {
                //         title: '积分按餐厅汇总月度报表',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'IntegralGenerate',
                    name: 'IntegralGenerate',
                    component:() => import('@/views/reportManage/IntegralGenerate'),
                    meta: {
                        title: '积分生成报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
            ]
        },
        {
            path: 'other',
            component: () => import('@/views/index.vue'),
            name: 'other',
            meta: {
                title: '其他',
                level: 2,
            },
            children: [
                {
                    path: 'reportForm',
                    name: 'reportForm',
                    component:() => import('@/views/reportManage/reportForm'),
                    meta: {
                        title: '自有商城发货明细',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'cardCouponServiceCharge',
                    name: 'cardCouponServiceCharge',
                    component:() => import('@/views/reportManage/cardCouponServiceCharge'),
                    meta: {
                        title: '卡/券服务费计算报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'tmStoreOrder',
                    name: 'tmStoreOrder',
                    component:() => import('@/views/reportManage/tmStoreOrder'),
                    meta: {
                        title: '天猫待确认收货订单报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'billDetailReport',
                    name: 'billDetailReport',
                    component:() => import('@/views/reportManage/billDetailReport'),
                    meta: {
                        title: '账单明细汇总报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                {
                    path: 'invoiceTemplate',
                    name: 'invoiceTemplate',
                    component:() => import('@/views/reportManage/invoiceTemplate'),
                    meta: {
                        title: '电子发票开票模板报表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
                // {
                //     path: 'alipayFaceToPayAccountCheck',
                //     name: 'alipayFaceToPayAccountCheck',
                //     component:() => import('@/views/reportManage/alipayFaceToPayAccountCheck'),
                //     meta: {
                //         title: '支付宝当面付对账报表',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'pennyCardCheck',
                    name: 'pennyCardCheck',
                    component:() => import('@/views/reportManage/pennyCardCheck'),
                    meta: {
                        title: '小额纸质卡券盘点表',
                        keepAlive: true,
                        level:3,
                        type:'show'
                    }
                },
            ]
        },

    ]
}
export default EBusReport
