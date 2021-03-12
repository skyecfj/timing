const storeBusReport = {
        path: '/storeBusReport',
    component: () => import('@/components/home'),
    name: 'storeBusReport',
    meta:
        {
            title: '餐厅业务报表',
            level: 1
        },
    children: [
        {
            path: 'CashAReportExport',
            name: 'CashAReportExport',
            component:() => import('@/views/reportManage/CashAReportExport'),
            meta: {
                title: 'casha数据科目报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'bankStatementReport',
            name: 'bankStatementReport',
            component:() => import('@/views/reportManage/bankStatementReport'),
            meta: {
                title: '银行流水导入月报告',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'thirdBillMonthlyReport',
            name: 'thirdBillMonthlyReport',
            component:() => import('@/views/reportManage/thirdBillMonthlyReport'),
            meta: {
                title: '账单导入月报告',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'notSaveButDoReport',
            name: 'notSaveButDoReport',
            component:() => import('@/views/reportManage/notSaveButDoReport'),
            meta: {
                title: '现金未存行及少存行报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'cashDelayCheckReport',
            name: 'cashDelayCheckReport',
            component:() => import('@/views/reportManage/cashDelayCheckReport'),
            meta: {
                title: '现金滞后核对报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'revenueReport',
            name: 'revenueReport',
            component:() => import('@/views/reportManage/revenueReport'),
            meta: {
                title: '手工调整汇总报表-收入',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'lossGainReport',
            name: 'lossGainReport',
            component:() => import('@/views/reportManage/lossGainReport'),
            meta: {
                title: '手工调整汇总报表-盈亏',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'BillAbnormalCheckMng20',
            name: 'BillAbnormalCheckMng20',
            component:() => import('@/views/reportManage/BillAbnormalCheckMng20'),
            meta: {
                title: '账单异常检查报表(20%)',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'BillAbnormalCheckMng05',
            name: 'BillAbnormalCheckMng05',
            component:() => import('@/views/reportManage/BillAbnormalCheckMng05'),
            meta: {
                title: '账单异常检查报表(0.5%)',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'DiscountDetailReport',
            name: 'DiscountDetailReport',
            component:() => import('@/views/reportManage/DiscountDetailReport'),
            meta: {
                title: '折扣明细报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'OtherIncomeDetailReport',
            name: 'OtherIncomeDetailReport',
            component:() => import('@/views/reportManage/OtherIncomeDetailReport'),
            meta: {
                title: '其他业务收入明细报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'saveLineFrequency',
            name: 'saveLineFrequency',
            component: () => import('@/views/reportManage/saveLineFrequency'),
            meta: {
                title: '存行频率报表',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'hallMasterExportReport',
            name: 'hallMasterExportReport',
            component: () => import('@/views/reportManage/hallMasterExportReport'),
            meta: {
                title: '餐厅主档导出报表',
                keepAlive: true,
                level: 2
            }
        },
        {
            path: 'fscCardSaleCheck',
            name: 'fscCardSaleCheck',
            component:() => import('@/views/reportManage/fscCardSaleCheck'),
            meta: {
                title: '百胜卡售卖核对报表',
                keepAlive: true,
                level:2,
            }
        },
        {
            path: 'rebackedByMaster',
            name: 'rebackedByMaster',
            component:() => import('@/views/reportManage/rebackedByMaster'),
            meta: {
                title: '被主管退回报告',
                keepAlive: true,
                level:2,
            }
        },
        {
            path: 'BillNotCheckOntime',
            name: 'BillNotCheckOntime',
            component:() => import('@/views/reportManage/BillNotCheckOntime'),
            meta: {
                title: '账单未及时核对统计报告',
                keepAlive: true,
                level:2,
            }
        },
        {
            path: 'HandleServiceFeeReport',
            name: 'HandleServiceFeeReport',
            component:() => import('@/views/reportManage/HandleServiceFeeReport'),
            meta: {
                title: '手续费服务费差异报表',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'cashaDifferResult',
            name: 'cashaDifferResult',
            component:() => import('@/views/reportManage/cashaDifferResult'),
            meta: {
                title: '差异核对完成报告',
                keepAlive: true,
                level:2
            }
        },
        {
            path: 'billImportedNotInTime',
            name: 'billImportedNotInTime',
            component:() => import('@/views/reportManage/billImportedNotInTime'),
            meta: {
                title: '账单未及时导入统计报告',
                keepAlive: true,
                level:2
            }
        },
    ]
}
export default storeBusReport
