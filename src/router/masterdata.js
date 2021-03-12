const masterData = {
    path: '/masterData',
    component: () => import('@/components/home'),
    name: 'masterData',
    meta:
        {
            title: '主档管理',
            level: 1
        },
    children: [
        {
            path: 'dataGeneral',
            component: () => import('@/views/index.vue'),
            name: 'dataGeneral',
            // redirect: '/masterData/dataGeneral/brand',
            meta: {
                title: '通用数据',
                level: 2,
            },
            children: [
                {
                    path: 'brand',
                    name: 'brand',
                    component: () => import('@/views/masterManage/brand.vue'),
                    meta: {
                        title: '品牌',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'taxRate',
                    name: 'taxRate',
                    component: () => import('@/views/masterManage/taxRate.vue'),
                    meta: {
                        title: '税率',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                }, {
                    path: 'company',
                    name: 'company',
                    component: () => import('@/views/masterManage/company'),
                    meta: {
                        title: '法人公司',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'dataDictionary',
                    name: 'dataDictionary',
                    component: () => import('@/views/masterManage/dataDictionary'),
                    meta: {
                        title: '数据字典',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'accountSubject',
                    name: 'accountSubject',
                    component: () => import('@/views/masterManage/accountSubject'),
                    meta: {
                        title: '会计科目',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'E-bus',
            component: () => import('@/views/index.vue'),
            name: 'E-bus',
            // redirect: '/masterData/E-bus/cardMgr',
            meta: {
                title: '电商业务数据',
                level: 2,
            },
            children: [
                {
                    path: 'cardMgr',
                    name: 'cardMgr',
                    component: () => import('@/views/masterManage/cardMgr'),
                    meta: {
                        title: '卡档管理',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'goods',
                    name: 'goods',
                    component: () => import('@/views/masterManage/goods'),
                    meta: {
                        title: '自有商城商品',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'goodsKind',
                    name: 'goodsKind',
                    component: () => import('@/views/masterManage/goodsKind'),
                    meta: {
                        title: '自有商城商品类别',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'accountRate',
                    name: 'accountRate',
                    component: () => import('@/views/masterManage/accountRate'),
                    meta: {
                        title: '结算费率',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'integral',
                    name: 'integral',
                    component: () => import('@/views/masterManage/integral.vue'),
                    meta: {
                        title: '积分',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'cardMap',
                    name: 'cardMap',
                    component: () => import('@/views/masterManage/cardMap'),
                    meta: {
                        title: '卡档映射',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'tmProductCategory',
                    name: 'tmProductCategory',
                    component: () => import('@/views/masterManage/tmProductCategory'),
                    meta: {
                        title: '天猫商城类别',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'tmProductGoods',
                    name: 'tmProductGoods',
                    component: () => import('@/views/masterManage/tmProductGoods'),
                    meta: {
                        title: '天猫商城商品',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'storeCodeData',
            component: () => import('@/views/index.vue'),
            name: 'storeCodeData',
            meta: {
                title: '餐厅业务数据',
                level: 2,
            },
            children: [
                {
                    path: 'bank',
                    name: 'bank',
                    component: () => import('@/views/masterManage/bank'),
                    meta: {
                        title: '银行',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }

                },
                {
                    path: 'customer',
                    name: 'customer',
                    component: () => import('@/views/masterManage/customer'),
                    meta: {
                        title: '第三方',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'market',
                    name: 'market',
                    component: () => import('@/views/masterManage/market'),
                    meta: {
                        title: '市场',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'billUnit',
                    name: 'billUnit',
                    component: () => import('@/views/masterManage/billUnit'),
                    meta: {
                        title: '开票单位',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'holiday',
                    name: 'holiday',
                    component: () => import('@/views/masterManage/holiday'),
                    meta: {
                        title: '公众节假日',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'departmentChart',
                    name: 'departmentChart',
                    component: () => import('@/views/masterManage/departmentChart'),
                    meta: {
                        title: '组织架构管理',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'customArea',
                    name: 'customArea',
                    component: () => import('@/views/masterManage/customArea'),
                    meta: {
                        title: '自定义区域',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'messageMng',
                    name: 'messageMng',
                    component: () => import('@/views/masterManage/messageMng.vue'),
                    meta: {
                        title: '预警通知配置',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'checkTolerance',
                    name: 'checkTolerance',
                    component: () => import('@/views/masterManage/checkTolerance'),
                    meta: {
                        title: '核对容差',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }

                },
                {
                    path: 'equalSales',
                    name: 'equalSales',
                    component: () => import('@/views/masterManage/equalSales'),
                    meta: {
                        title: '视同销售',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'gsCategory',
                    name: 'gsCategory',
                    component: () => import('@/views/masterManage/gsCategory'),
                    meta: {
                        title: '货劳分类',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'bohSubject',
                    name: 'bohSubject',
                    component: () => import('@/views/masterManage/bohSubject'),
                    meta: {
                        title: '调整类型-BOH项目',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'bankConfig',
                    name: 'bankConfig',
                    component: () => import('@/views/masterManage/bankConfig'),
                    meta: {
                        title: '银行流水标准化',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'hall',
                    name: 'hall',
                    component: () => import('@/views/masterManage/hall'),
                    meta: {
                        title: '餐厅主档',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'active',
                    name: 'active',
                    component: () => import('@/views/masterManage/active'),
                    meta: {
                        title: '活动主档',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'wechatAndAlipay',
                    name: 'wechatAndAlipay',
                    component: () => import('@/views/masterManage/wechatAndAlipay'),
                    meta: {
                        title: '支付宝账号',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'thirdBackWebsite',
                    name: 'thirdBackWebsite',
                    component: () => import('@/views/masterManage/thirdBackWebsite'),
                    meta: {
                        title: '第三方退款平台',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'taskCenterAccount',
                    name: 'taskCenterAccount',
                    component: () => import('@/views/masterManage/taskCenterAccount'),
                    meta: {
                        title: '任务中心账号',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'thirdBill',
                    name: 'thirdBill',
                    component: () => import('@/views/masterManage/thirdBill'),
                    meta: {
                        title: '第三方账单标准化',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
                {
                    path: 'BOHCashAbnormal',
                    name: 'BOHCashAbnormal',
                    component:() => import('@/views/masterManage/BOHCashAbnormal'),
                    meta: {
                        title: 'BOH现金项目异常配置',
                        keepAlive: true,
                        level:3,
                        type: 'show'
                    }
                },
                {
                    path: 'hallConfig',
                    name: 'hallConfig',
                    component: () => import('@/views/masterManage/hallConfig'),
                    meta: {
                        title: '餐厅查询与配置',
                        keepAlive: true,
                        level: 3,
                        type: 'show'
                    }
                },
            ]
        },
        {
            path: 'companyEditDetail',
            name: 'companyEditDetail',
            component: () => import('@/views/masterManage/companyEditDetail'),
            meta: {
                title: '法人公司-编辑',
                keepAlive: true
            }
        },
        {
            path: 'companyCheckDetail',
            name: 'companyCheckDetail',
            component: () => import('@/views/masterManage/companyCheckDetail'),
            meta: {
                title: '法人公司-详情',
                keepAlive: true
            }
        },
        {
            path: 'dataDictionaryAdd',
            name: 'dataDictionaryAdd',
            component: () => import('@/views/masterManage/dataDictionaryAdd'),
            meta: {
                title: '数据字典 新增',
                keepAlive: true
            }
        },
        {
            path: 'dataDictionaryEdit',
            name: 'dataDictionaryEdit',
            component: () => import('@/views/masterManage/dataDictionaryEdit'),
            meta: {
                title: '数据字典 编辑',
                keepAlive: true
            }
        },
        {
            path: 'dataDictionaryDetails',
            name: 'dataDictionaryDetails',
            component: () => import('@/views/masterManage/dataDictionaryDetails'),
            meta: {
                title: '数据字典 详情',
                keepAlive: true
            }
        }, {
            path: 'bankAdd',
            name: 'bankAdd',
            component: () => import('@/views/masterManage/bankAdd'),
            meta: {
                title: '银行 新增',
                keepAlive: false
            }
        },
        {
            path: 'bankEdit',
            name: 'bankEdit',
            component: () => import('@/views/masterManage/bankEdit'),
            meta: {
                title: '银行 编辑',
                keepAlive: true
            }
        },
        {
            path: 'bankDetail',
            name: 'bankDetail',
            component: () => import('@/views/masterManage/bankDetail'),
            meta: {
                title: '银行 详情',
                keepAlive: true
            }
        }, {
            path: 'customerUpdate',
            name: 'customerUpdate',
            component: () => import('@/views/masterManage/customerUpdate'),
            meta: {
                title: '第三方 编辑',
                keepAlive: true
            }
        },
        {
            path: 'customerCheck',
            name: 'customerCheck',
            component: () => import('@/views/masterManage/customerCheck'),
            meta: {
                title: '第三方 详情',
                keepAlive: true
            }
        }, {
            path: 'billUnitEditDetail',
            name: 'billUnitEditDetail',
            component: () => import('@/views/masterManage/billUnitEditDetail'),
            meta: {
                title: '开票单位-编辑',
                keepAlive: true
            }
        },
        {
            path: 'billUnitCheckDetail',
            name: 'billUnitCheckDetail',
            component: () => import('@/views/masterManage/billUnitCheckDetail'),
            meta: {
                title: '开票单位-详情',
                keepAlive: true
            }
        }, {
            path: 'customAreaAdd',
            name: 'customAreaAdd',
            component: () => import('@/views/masterManage/customAreaAdd'),
            meta: {
                title: '自定义区域-新增',
                keepAlive: true
            }
        },
        {
            path: 'customAreaCheckDetail',
            name: 'customAreaCheckDetail',
            component: () => import('@/views/masterManage/customAreaCheckDetail'),
            meta: {
                title: '自定义区域-详情',
                keepAlive: true
            }
        },
        {
            path: 'customAreaEditDetail',
            name: 'customAreaEditDetail',
            component: () => import('@/views/masterManage/customAreaEditDetail'),
            meta: {
                title: '自定义区域-编辑',
                keepAlive: true
            }
        }, {
            path: 'messageMngDetail',
            name: 'messageMngDetail',
            component: () => import('@/views/masterManage/messageMngDetail'),
            meta: {
                title: '预警通知配置-编辑',
                keepAlive: true
            }

        },
        {
            path: 'messageMngCheckD',
            name: 'messageMngCheckD',
            component: () => import('@/views/masterManage/messageMngCheckD'),
            meta: {
                title: '预警通知配置-详情',
                keepAlive: true
            }
        },
        {
            path: 'bankConfigAdd',
            name: 'bankConfigAdd',
            component: () => import('@/views/masterManage/bankConfigAdd'),
            meta: {
                title: '银行流水标准化 新增',
                keepAlive: true
            }
        },
        {
            path: 'bankConfigDetail',
            name: 'bankConfigDetail',
            component: () => import('@/views/masterManage/bankConfigDetail'),
            meta: {
                title: '银行流水标准化 详情',
                keepAlive: true
            }
        },
        {
            path: 'hallEdit',
            name: 'hallEdit',
            component: () => import('@/views/masterManage/hallEdit'),
            meta: {
                title: '餐厅主档 编辑',
                keepAlive: true
            }
        },
        {
            path: 'hallDetails',
            name: 'hallDetails',
            component: () => import('@/views/masterManage/hallDetails'),
            meta: {
                title: '餐厅主档 详情',
                keepAlive: true
            }
        },
        {
            path: 'activeAdd',
            name: 'activeAdd',
            component: () => import('@/views/masterManage/activeAdd'),
            meta: {
                title: '活动主档 新增',
                keepAlive: true
            }

        },
        {
            path: 'activeEdit',
            name: 'activeEdit',
            component: () => import('@/views/masterManage/activeEdit'),
            meta: {
                title: '活动主档 编辑',
                keepAlive: true
            }

        },
        {
            path: 'activeDetails',
            name: 'activeDetails',
            component: () => import('@/views/masterManage/activeDetails'),
            meta: {
                title: '活动主档 详情',
                keepAlive: true
            }
        }, {
            path: 'wechatAndAlipayCheckDetail',
            name: 'wechatAndAlipayCheckDetail',
            component: () => import('@/views/masterManage/wechatAndAlipayCheckDetail'),
            meta: {
                title: '支付宝账号-详情',
                keepAlive: true
            }
        },
        {
            path: 'wechatAndAlipayAdd',
            name: 'wechatAndAlipayAdd',
            component: () => import('@/views/masterManage/wechatAndAlipayAdd'),
            meta: {
                title: '支付宝账号-新增',
                keepAlive: true
            }
        },
        {
            path: 'wechatAndAlipayEditDetail',
            name: 'wechatAndAlipayEditDetail',
            component:() => import('@/views/masterManage/wechatAndAlipayEditDetail'),
            meta: {
                title: '支付宝账号-编辑',
                keepAlive: true
            }
        },
        {
            path: 'thirdBillAdd',
            name: 'thirdBillAdd',
            component: () => import('@/views/masterManage/thirdBillAdd'),
            meta: {
                title: '第三方账单标准化 新增',
                keepAlive: true
            }

        },
        {
            path: 'thirdBillEdit',
            name: 'thirdBillEdit',
            component: () => import('@/views/masterManage/thirdBillEdit'),
            meta: {
                title: '第三方账单标准化 编辑',
                keepAlive: true
            }
        },
        {
            path: 'thirdBillDetails',
            name: 'thirdBillDetails',
            component: () => import('@/views/masterManage/thirdBillDetails'),
            meta: {
                title: '第三方账单配置 详情',
                keepAlive: true
            }

        },
        {
            path: 'activeMasterColAdd',
            name: 'activeMasterColAdd',
            component:() => import('@/views/masterManage/activeMasterColAdd'),
            meta: {
                title: '活动主档-房东代收 新增',
                keepAlive: true
            }

        },
        {
            path: 'activeMasterColEdit',
            name: 'activeMasterColEdit',
            component:() => import('@/views/masterManage/activeMasterColEdit'),
            meta: {
                title: '活动主档-房东代收 编辑',
                keepAlive: true
            }

        },
        {
            path: 'activeMasterColDetail',
            name: 'activeMasterColDetail',
            component:() => import('@/views/masterManage/activeMasterColDetail'),
            meta: {
                title: '活动主档-房东代收 详情',
                keepAlive: true
            }

        },
        // {
        //     path: 'companyAddDetail',
        //     name: 'companyAddDetail',
        //     component:() => import('@/views/masterManage/companyAddDetail'),
        //     meta: {
        //         title: '法人公司-新增',
        //         keepAlive: true
        //     }
        // },
    ]
}
export default masterData
