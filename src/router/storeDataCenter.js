const storeDataCenter = {
    path: '/storeDataCenter',
    component: () => import('@/components/home'),
    name: 'storeDataCenter',
    meta:
        {
            title: '餐厅数据中心',
            level: 1
        },
    children: [
        {
            path: 'cargoLaborData',
            name: 'cargoLaborData',
            component: () => import('@/views/masterManage/cargoLaborData'),
            meta: {
                title: '货劳分类数据',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'deemedSalesData',
            name: 'deemedSalesData',
            component: () => import('@/views/masterManage/deemedSalesData'),
            meta: {
                title: '视同销售数据',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'BOHData',
            component: () => import('@/views/index.vue'),
            name: 'BOHData',
            // redirect: '/storeDataCenter/BOHData/abnormalMg',
            meta: {
                title: 'BOH数据',
                level: 2,
            },
            children: [
                {
                    path: 'abnormalMg',
                    name: 'abnormalMg',
                    component: () => import('@/views/restaurant/BOHDataMg/BOHAbnormalMg/abnormalMg'),
                    meta: {
                        title: 'BOH数据未上传及异常',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'dataCover',
                    name: 'dataCover',
                    component: () => import('@/views/restaurant/BOHDataMg/dataCover'),
                    meta: {
                        title: 'BOH数据覆盖差异列表',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    },
                },
                {
                    path: 'BOHDataCheck',
                    name: 'BOHDataCheck',
                    component: () => import('@/views/restaurant/dataCheck/BOHDataMng/BOHDataCheck'),
                    meta: {
                        title: 'BOH数据异常检查',
                        level: 3,
                        keepAlive: true,
                        type: 'show'
                    }
                },
                {
                    path: 'restDetail',
                    name: 'restDetail',
                    component: () => import('@/views/center/store/restDetail.vue'),
                    meta: {
                        title: '餐厅订单明细查询',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'bankStatementEscortList',
            component: () => import('@/views/index.vue'),
            name: 'bankStatementEscortList',
            meta: {
                title: '银行流水/押运清单',
                level: 2,
            },
            children: [
                {
                    path: 'bankStatementMg',
                    name: 'bankStatementMg',
                    component: () => import('@/views/restaurant/BOHDataMg/bankStatementMg'),
                    meta: {
                        title: '银行流水数据',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'escortInventory',
                    name: 'escortInventory',
                    component: () => import('@/views/restaurant/BOHDataMg/escortInventory'),
                    meta: {
                        title: '押运清单数据',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'bankShouldImportedButNone',
                    name: 'bankShouldImportedButNone',
                    component: () => import('@/views/restaurant/BOHDataMg/bankShouldImportedButNone.vue'),
                    meta: {
                        title: '银行流水应导入而未导入',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'thirdBillLandlordCollect',
            component: () => import('@/views/index.vue'),
            name: 'thirdBillLandlordCollect',
            meta: {
                title: '第三方账单/房东代收',
                level: 2,
            },
            children: [
                {
                    path: 'thirdBillImportAbnormalMg',
                    name: 'thirdBillImportAbnormalMg',
                    component: () => import('@/views/restaurant/BOHDataMg/thirdBillImportAbnormalMg/thirdBillAbnormalMg.vue'),
                    meta: {
                        title: '第三方账单导入异常',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'thirdBillCoverMg',
                    name: 'thirdBillCoverMg',
                    component: () => import('@/views/restaurant/BOHDataMg/thirdBillCoverMg/thirdBillCoverMg.vue'),
                    meta: {
                        title: '第三方账单待处理',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'thirdBillHadImportedDataMg',
                    name: 'thirdBillHadImportedDataMg',
                    component: () => import('@/views/restaurant/BOHDataMg/thirdBillHadImportedDataMg/thirdBillHadImportedDataMg.vue'),
                    meta: {
                        title: '第三方账单已导入数据',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'landlordBillData',
                    name: 'landlordBillData',
                    component: () => import('@/views/restaurant/BOHDataMg/landlordBillData'),
                    meta: {
                        title: '房东代收数据',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                //还没页面
                // {
                //     path: 'standardBill',
                //     name: 'standardBill',
                //     component:() => import('@/components/home'),
                //     meta: {
                //         title: '标准账单数据',
                //         keepAlive: true,
                //         level:3,
                //         type:'show'
                //     }
                // },
                {
                    path: 'refundOrderData',
                    name: 'refundOrderData',
                    component: () => import('@/views/restaurant/BOHDataMg/refundOrderData'),
                    meta: {
                        title: '手工退款数据',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'refundDataReport',
                    name: 'refundDataReport',
                    component:() => import('@/views/reportManage/refundDataReport'),
                    meta: {
                        title: '退款数据查询',
                        keepAlive: true,
                        level:3,
                        type: 'show'
                    }
                }
            ],
        },
        {
            path: 'serviceCenter',
            name: 'serviceCenter',
            component: () => import('@/views/index.vue'),
            meta: {
                title: '业务数据中心',
                level: 2
            },
            children: [{
                path: 'alipayBill',
                name: 'alipayBill',
                component: () => import('@/views/restaurant/thirdBillReport/alipayBill'),
                meta: {
                    title: '支付宝',
                    keepAlive: true,
                    level: 3,
                    type: 'show',
                }
            }, {
                path: 'weChatBill',
                name: 'weChatBill',
                component: () => import('@/views/restaurant/thirdBillReport/weChatBill'),
                meta: {
                    title: '微信当面付',
                    keepAlive: true,
                    level: 3,
                    type: 'show',
                }
            }, {
                path: 'PrimeDataMng',
                name: 'PrimeDataMng',
                component: () => import('@/views/restaurant/thirdBillReport/PrimeDataMng'),
                meta: {
                    title: 'Prime数据查询',
                    keepAlive: true,
                    level: 3,
                    type: 'show',
                }
            }, {
                path: 'AlipayBillByStore',
                name: 'AlipayBillByStore',
                component: () => import('@/views/restaurant/thirdBillReport/AlipayBillByStore'),
                meta: {
                    title: '支付宝-按餐厅',
                    keepAlive: true,
                    level: 3,
                    type: 'show',
                }
            }, {
                path: 'WeChatBillByStore',
                name: 'WeChatBillByStore',
                component: () => import('@/views/restaurant/thirdBillReport/WeChatBillByStore'),
                meta: {
                    title: '微信当面付-按餐厅',
                    keepAlive: true,
                    level: 3,
                    type: 'show',
                }
            },
                //     {
                //     path: 'bsCouponBill',
                //     name: 'bsCouponBill',
                //     component: ()=>import('@/views/restaurant/thirdBillReport/bsCouponBill'),
                //     meta: {
                //         title: '百胜电子券码报告',
                //         keepAlive: true,
                //         level: 3,
                //         type:'show',
                //     }
                // },

                {
                    path: 'vdmCouponConsumeSea2',
                    name: 'vdmCouponConsumeSea2',
                    component: () => import('@/views/reportManage/vdmCouponConsumeSea2'),
                    meta: {
                        title: '百胜电子券码核销及撤销核销查询',
                        keepAlive: true,
                        repeat: 2,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'bsCouponStoreBill',
                    name: 'bsCouponStoreBill',
                    component: () => import('@/views/restaurant/thirdBillReport/bsCouponStoreBill'),
                    meta: {
                        title: '百胜电子券码核销及撤销核销查询-按店天',
                        keepAlive: true,
                        level: 3,
                        type: 'show',
                    }
                }, {
                    path: 'storeCardSell',
                    name: 'storeCardSell',
                    component: () => import('@/views/restaurant/thirdBillReport/storeCardSell'),
                    meta: {
                        title: '餐厅百胜卡售卖',
                        keepAlive: true,
                        level: 3,
                        type: 'show',
                    }
                },
                {
                    path: 'storeCardVerification',
                    name: 'storeCardVerification',
                    component: () => import('@/views/restaurant/thirdBillReport/storeCardVerification'),
                    meta: {
                        title: '百胜卡核销及撤销核销',
                        keepAlive: true,
                        level: 3,
                        type: 'show',
                    }
                },
                {
                    path: 'ChinaUnionPay',
                    name: 'ChinaUnionPay',
                    component: () => import('@/views/restaurant/thirdBillReport/ChinaUnionPay'),
                    meta: {
                        title: '银联卡',
                        keepAlive: true,
                        level: 3,
                        type: 'show',
                    }
                },
                ]

        },
        // {
        //     path: 'breakMonthList',
        //     name: 'breakMonthList',
        //     component: () => import('@/views/restaurant/BOHDataMg/breakMonthList.vue'),
        //     meta: {
        //         title: '破月清单查询',
        //         keepAlive: true,
        //         level: 2
        //     }
        // },
        {
            path: 'breakMonthList',
            name: 'breakMonthList',
            component: () => import('@/views/restaurant/BOHDataMg/breakMonthList.vue'),
            meta: {
                title: '破月清单查询',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'standardBillQuery',
            name: 'standardBillQuery',
            component: () => import('@/views/restaurant/BOHDataMg/standardBillQuery.vue'),
            meta: {
                title: '标准账单查询',
                keepAlive: true,
                level: 2
            }
        },
        // {
        //     path: 'alipayAccount',
        //     name: 'alipayAccount',
        //     component: () => import('@/views/restaurant/BOHDataMg/alipayAccount.vue'),
        //     meta: {
        //         title: '支付宝账务流水查询',
        //         keepAlive: true,
        //         level: 2
        //     }
        // },
        {
            path: 'alipayAccount',
            name: 'alipayAccount',
            component: () => import('@/views/restaurant/BOHDataMg/alipayAccount.vue'),
            meta: {
                title: '支付宝账务流水查询',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'MyfollowActivities',
            name: 'MyfollowActivities',
            component: () => import('@/views/restaurant/BOHDataMg/MyfollowActivities.vue'),
            meta: {
                title: '我关注的活动',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'MyfollowActivitiesAll',
            name: 'MyfollowActivitiesAll',
            component: () => import('@/views/restaurant/BOHDataMg/MyfollowActivitiesAll.vue'),
            meta: {
                title: '我关注的活动2',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'dataCoverDetail',
            name: 'dataCoverDetail',
            component: () => import('@/views/restaurant/BOHDataMg/dataCoverDetail'),
            meta: {
                title: 'BOH数据覆盖-明细',
                keepAlive: true,
            },
        },
        {
            path: 'thirdBillCoverDetail',
            name: 'thirdBillCoverDetail',
            component: () => import('@/views/restaurant/BOHDataMg/thirdBillCoverMg/thirdBillCoverDetail.vue'),
            meta: {
                title: '第三方账单待处理-明细',
            }
        },
        {
            path: 'bankStatementDetail',
            name: 'bankStatementDetail',
            component: () => import('@/views/restaurant/BOHDataMg/bankStatementDetail'),
            meta: {
                title: '银行流水数据 详情',
                keepAlive: false
            }
        },
        {
            path: 'additionalRecording',
            name: 'additionalRecording',
            component: () => import('@/views/restaurant/BOHDataMg/BOHAbnormalMg/additionalRecording'),
            meta: {
                title: '手工补录店天',
                keepAlive: true,
            }
        }
        , {
            path: 'BOHDataAdjust',
            name: 'BOHDataAdjust',
            component: () => import('@/views/restaurant/dataCheck/BOHDataMng/BOHDataAdjust'),
            meta: {
                title: 'BOH数据异常检查-手工调整',
                keepAlive: true
            }
        }, {
            path: 'BOHDataDailyReport',
            name: 'BOHDataDailyReport',
            component: () => import('@/views/restaurant/dataCheck/BOHDataMng/BOHDataDailyReport'),
            meta: {
                title: 'BOH数据异常检查-日常追踪报告',
                keepAlive: true
            }
        },
    ]
}
export default storeDataCenter
