export default {
    // 单据详情表头类型
    billType: {
        B2C01: 'B2C_0001',
        B2C02: 'B2C_0002',
        B2C03: 'B2C_0003',
        B2C04: 'B2C_0004',
        B2C05: 'B2C_0005',
        B2C06: 'B2C_0006',
        B2C07: 'B2C_0007',
        B2C10: 'B2C_0010',
        B2C11: 'B2C_0011',
        B2C12: 'B2C_0012',
        B2C13: 'B2C_0013',
        B2C14: 'B2C_0014',
        B2C15: 'B2C_0015', 
        B2C08: 'B2C_0008', 
        B2C09: 'B2C_0009', 
        B2C16: 'B2C_0016', 
        B2C17: 'B2C_0017',  
        B2C18: 'B2C_0018',  
        B2C19: 'B2C_0019',  
        B2C20: 'B2C_0020',  
        B2C21: 'B2C_0021',  
        B2C22: 'B2C_0022',  
        B2C23: 'B2C_0023',  
        B2C24: 'B2C_0024',  
        B2C25: 'B2C_0025',  
        B2C26: 'B2C_0026', 
        B2B01: 'B2B_0001',
        B2B03: 'B2B_0003',
        B2B04: 'B2B_0004',
        B2B05: 'B2B_0005',
        B2B06: 'B2B_0006',
        B2B07: 'B2B_0007',
        B2B08: 'B2B_0008',
        B2B09: 'B2B_0009',
        B2B10: 'B2B_0010',
        B2B12: 'B2B_0012',
        B2B13: 'B2B_0013',
        B2B20: 'B2B_0020',
        B2B15: 'B2B_0015',
        B2B21: 'B2B_0021',
        B2B16: 'B2B_0016',
        B2B22: 'B2B_0022',
        B2B23: 'B2B_0023',
        B2B17: 'B2B_0017',
        B2B24: 'B2B_0024',
        B2B25: 'B2B_0025',
        B2B18: 'B2B_0018',
        B2B26: 'B2B_0026',
        B2B27: 'B2B_0027',
        B2B11: 'B2B_0011',
        B2B14: 'B2B_0014',
        B2B19: 'B2B_0019',
        B2B28: 'B2B_0028',
        B2B02: 'B2B_0002',
        B2B29: 'B2B_0029',
        B2B30: 'B2B_0030',
        B2B31: 'B2B_0031',
        B2B32: 'B2B_0032',
        B2B33: 'B2B_0033',
        B2B34: 'B2B_0034',
        B2B35: 'B2B_0035',
        B2B36: 'B2B_0036',
        B2B37: 'B2B_0037'

    },
    storeBillExportDeatilTitle: {
        'STORE_0001': 'BOH活动报送值非现金日凭证',
        'STORE_0002': '非现金账单与BOH活动自动核对完日凭证',
        'STORE_0003': '非现金账单与BOH核对差异定位完成日凭证',
        'STORE_0008': '现金BOH与押运公司账单核对完成押运公司账',
        'STORE_0009': '现金BOH与银行流水核对完成核对月凭证',
        'STORE_0011': '手续费进项税凭证',
        'STORE_0007': '第三方账单/支付宝与银行流水核对差异为容差范围内的凭证',
        'STORE_0020': '饿了么账单与支付宝核对完成支付宝账单日凭证',
        'STORE_0010': '手续费计提凭证',
        'STORE_0004': '确认结算日凭证',
        'STORE_0012': '计提百胜折扣凭证',
        'STORE_0005': '账单与银行流水核对凭证'
    },

    // 单据详情表头
    //多表头
    // headerConfig = {
    //                 firstColumnName:{
    //                     title:'UNP应收金额合计',
    //                     subColumn:{
    //                         firstColumnName:{
    //                           title:'UNP应收金额合计111111',
    //                         }
    //                     }
    //                 },
    //                 secondColumnName:{
    //                     title:'ZHX应收金额合计',
    //                 }
    //         }


    // 获取 STORE 上部分展示信息
    getStoreTitleHeaderConfigData(voucherCode) {
        var headerInfo = {
            'billCreateTime': '单据生成时间',
            'companyName': '法人公司',
            'paymentDay': '入账账期',
            'storeNum': '餐厅数量',
            'jdeInvoiceNumber': '单据号',
            'jdeBatchNo': '批号',
            'minDate': '营业日期段',
        }
        switch (voucherCode) {
            case 'STORE_0001':
                headerInfo.noCashBohAmount = '非现金活动BOH实收报送总金额和(元)'
                break;
            case 'STORE_0011':
                delete headerInfo.minDate
                break;
            case 'STORE_0008' :
            case 'STORE_0009':
            case 'STORE_0007':
            case 'STORE_0020':
                ''
                break;
            case 'STORE_0002':
                headerInfo.noCashLocationCompletionAmount = '非现金核对总差异(元)'
                break;
            default:
                ''
        }
        return headerInfo
    },

    // 获取 STORE 下部分table展示信息
    getStoreTableHeaderConfigData(voucherCode) {
        var tableHeaderInfo = {}
        switch (voucherCode) {
            case 'STORE_0001':
                tableHeaderInfo = {
                    'activityCode': '活动名称',
                    'amount': 'BOH报送实收值(元)'
                }
                break;
            case 'STORE_0011':
                tableHeaderInfo = {
                    'activityName': '活动名称',
                    'thirdName': '第三方名称',
                    'totalPriceTax': '价税合计',
                    'amount': '手续费进项税金额'
                }
                break;
            case 'STORE_0008':
                tableHeaderInfo = {
                    'bizDate': '营业日期',
                    'storeCode': '餐厅编号',
                    'amount': 'BOH金额',
                    'escortCompany': '押运公司名称',
                    'checkAmount': '押运清单账单金额',
                    'toleranceAmount': '核对容差金额'
                }
                break;
            case 'STORE_0009':
                tableHeaderInfo = {
                    'bizDate': '营业日期',
                    'storeCode': '餐厅编号',
                    'bohAmount': 'BOH金额',
                    'escortCompany': '押运公司名称',
                    'escortAmount': '押运清单账单金额',
                    'bankCheckAmount': '银行流水',
                    'toleranceAmount': '核对容差金额'
                }
                break;
            case 'STORE_0002':
                tableHeaderInfo = {
                    'activityCode': '活动名称',
                    'billBohDiff': '非现金核对差异合计',
                    'handingCharge': '手续费合计',
                    'serviceCharge': '服务费合计',
                    'bsSubsidy': '折扣折让合计'
                }
                break;
            case 'STORE_0020':
                tableHeaderInfo = {
                    'activityName': '活动名称',
                    'bizDate': '营业日期',
                    'thirdAmount': '核对金额'
                }
                break;
            //TDO
            case 'STORE_0010':
                tableHeaderInfo = {
                    'bizDate': '营业日期',
                    'storeCode': '餐厅编号',
                    'activityCode': '活动名称',
                    'amount': '手续费金额',
                    'tax': '应交税费',
                }
                break;
            case 'STORE_0004':
                tableHeaderInfo = {
                    'balanceStartDate': '结算期间',
                    'activityCode': '活动名称',
                    'customerId': '结算客户',
                    'amount': '结算金额',
                }
                break;
            case 'STORE_0012':
                tableHeaderInfo = {
                    'activityCode': '活动名称',
                    'storeCode': '餐厅编号',
                    'tradeAmount': '第三方账单金额/BOH交易额',
                    'amount': '折扣计提金额',
                }
                break;
            case 'STORE_0005':
                tableHeaderInfo = {
                    'activityCode': '活动名称',
                    'amount': '账单金额',
                    'bankCheckAmount': '银行流水/支付宝流水'
                }
                break;
            default:
                tableHeaderInfo = {}
        }
        return tableHeaderInfo
    },

    //获取 BBC 的 单据明细信息

    getTableHeaderConfigData(voucherCode) {
        var headerConfig = {}
        switch (voucherCode) {
            case 'B2B_0013':
                headerConfig = {
                    totalInitBalance: {
                        title: '卡面额合计',
                    },
                    channelId:
                        {
                            title: '子售卖渠道',
                        },
                    cardDiscount:
                        {
                            title: '销卡折扣',
                        },
                    transNetAmount:
                        {
                            title: '销卡净额',
                        }
                }
                break;
            case 'B2C_0014':
                headerConfig = {
                    firstColumnName: {
                        title: '品牌',
                    },
                    secondColumnName:
                        {
                            title: '卡片总额总计',
                        },
                    thirdColumnName:
                        {
                            title: '退卡净额总计',
                        }
                }
                break;
            case 'B2C_0006':
                headerConfig = {
                    firstColumnName: {
                        title: '卡片总额总计',
                    }
                }
                break;
            case 'B2C_0004':
            case 'B2C_0002':
            case 'B2C_0003':
            case 'B2C_0012':
            case 'B2C_0001':
            case 'B2C_0007':
            case 'B2C_0013':
                headerConfig = {
                    firstColumnName: {
                        title: '品牌',
                    },
                    secondColumnName:
                        {
                            title: '订单金额',
                        },
                    thirdColumnName:
                        {
                            title: '退款金额',
                        }
                }
                break;
            case 'B2C_0005':
            case 'B2C_0011':
            case 'B2C_0010':
                headerConfig = {
                    firstColumnName: {
                        title: '品牌',
                    },
                    secondColumnName: {
                        title: '发券金额',
                        subTitle: '(A)'
                    },
                    thirdColumnName:
                        {
                            title: '销券金额',
                            subTitle: '(B)'
                        },
                    fourColumnName: {
                        title: '小计',
                        subTitle: '(C)=(A)-(B)'
                    }
                }
                break;
            case 'B2C_0015':
            case 'B2C_0016':
            case 'B2C_0008':
            case 'B2C_0009':
            case 'B2C_0017':
            case 'B2C_0018':
            case 'B2C_0019':
            case 'B2C_0020':
            case 'B2C_0021':
            case 'B2C_0022':
            case 'B2C_0023':
            case 'B2C_0024':
                headerConfig = {
                    firstColumnName: {
                        title: '金额类别',
                    },
                    secondColumnName: {
                        title: '金额'
                    }
                }
                break;
            case 'B2C_0025':
                headerConfig = {
                    firstColumnName: {
                        title: 'kfc发券金额',
                    },
                    secondColumnName: {
                        title: 'kfc退券金额'
                    },
                    thirdColumnName: {
                        title: 'kfc小计'
                    },
                    fourthColumnName: {
                        title: 'ph发券金额'
                    },
                    fifthColumnName: {
                        title: 'ph退券金额'
                    },
                    sixthColumnName: {
                        title: 'ph小计'
                    }
                }
                break;
            case 'B2C_0026':
                headerConfig = {
                    firstColumnName: {
                        title: '肯德基订单金额',
                    },
                    secondColumnName: {
                        title: '肯德基退款金额'
                    },
                    thirdColumnName: {
                        title: '必胜客订单金额'
                    },
                    fourthColumnName: {
                        title: '必胜客退款金额'
                    }
                }
                break;
            case 'B2B_0001':
                headerConfig = {
                    firstColumnName: {
                        title: 'UNP应收金额合计'
                    },
                    secondColumnName: {
                        title: 'ZHX应收金额合计'
                    }
                }
                break;
            case 'B2B_0020':
                headerConfig = {
                    channelId: {
                        title: '订单渠道',
                    },
                    orderAmount:
                        {
                            title: '订单金额',
                        },
                    refundAmount:
                        {
                            title: '退款金额',
                        }
                }
                break;
            case 'B2B_0004':
            case 'B2B_0005':
            case 'B2B_0008':
            case 'B2B_0010':
                headerConfig = {
                    firstColumnName: {
                        title: '应收金额合计',
                    },
                    secondColumnName:
                        {
                            title: '折扣金额合计',
                        },
                    thirdColumnName: {
                        title: '卡面额合计'
                    }
                }
                break;
            case 'B2B_0006':
            case 'B2B_0007':
                headerConfig = {
                    firstColumnName: {
                        title: 'KFC应收金额合计',
                    },
                    secondColumnName: {
                        title: 'PH应收金额合计'
                    },
                    thirdColumnName:{
                        title: '折扣金额合计',
                    },
                    fourthColumnName: {
                        title: '卡面额合计'
                    }
                }
                break;
            case 'B2B_0009':
                headerConfig = {
                    firstColumnName: {
                        title: 'SJJC应收金额合计',
                    },
                    secondColumnName: {
                        title: 'CMB应收金额合计'
                    },
                    thirdColumnName:{
                        title: '折扣金额合计',
                    },
                    fourthColumnName: {
                        title: '卡面额合计'
                    }
                }
                break;
            case 'B2B_0003':
            case 'B2B_0012':
            case 'B2B_0021':
                headerConfig = {
                    firstColumnName: {
                        title: '应收金额合计',
                    }
                }
                break;
            case 'B2B_0015':
                headerConfig = {
                    firstColumnName:{
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '应收金额合计',
                    }
                }
                break;
            case 'B2B_0016':
                headerConfig = {
                    firstColumnName:{
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '当月刷卡面额',
                    }
                }
                break;
            case 'B2B_0022':
                headerConfig = {
                    firstColumnName: {
                        title: '当月刷卡面额',
                    }
                }
                break;
            case 'B2B_0023':
                headerConfig = {
                    firstColumnName: {
                        title: '当月刷卡面额',
                    }
                }
                break;
            case 'B2B_0017':
                headerConfig = {
                    firstColumnName:{
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '上月分摊折扣',
                    }
                }
                break;
            case 'B2B_0024':
                headerConfig = {
                    firstColumnName: {
                        title: '上月分摊折扣（法人）',
                    },
                    secondColumnName:{
                        title: '上月分摊折扣（加盟商）',
                    }
                }
                break;
            case 'B2B_0025':
                headerConfig = {
                    firstColumnName: {
                        title: '上月分摊折扣',
                    }
                }
                break;
            case 'B2B_0018':
                headerConfig = {
                    firstColumnName:{
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '与第三方结算金额',
                    }
                }
                break;
            case 'B2B_0026':
                headerConfig = {
                    firstColumnName: {
                        title: '与第三方结算金额',
                    }
                }
                break;
            case 'B2B_0027':
                headerConfig = {
                    firstColumnName: {
                        title: '与第三方结算金额',
                    }
                }
                break;
            case 'B2B_0011':
                headerConfig = {
                    firstColumnName: {
                        title: '支付金额合计',
                    },
                    secondColumnName: {
                        title: '购买金额合计',
                    },
                    thirdColumnName: {
                        title: '支付金额合计-购买金额合计',
                    }
                }
                break;
            case 'B2B_0014':
                headerConfig = {
                    firstColumnName: {
                        title: '卡面额合计',
                    },
                    secondColumnName: {
                        title: '卡面额合计-卡净额合计',
                    },
                    thirdColumnName: {
                        title: '卡净额/(1+税率)',
                    },
                    fourColumnName:{
                        title: '借贷方差额',
                    }
                }
                break;
            case 'B2B_0019':
            case 'B2B_0028':
                headerConfig = {
                    firstColumnName: {
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '法人公司品牌',
                    },
                    thirdColumnName: {
                        title: '金额（含税）',
                    },
                    fourthColumnName:{
                        title: '金额（不含税）',
                    },
                    fifthColumnName:{
                        title: '税额',
                    }
                }
                break;
            case 'B2B_0002':
                headerConfig = {
                    firstColumnName: {
                        title: 'UNP应收总额合计',
                    },
                    secondColumnName: {
                        title: 'ZHX应收总额合计',
                    },
                    thirdColumnName: {
                        title: '折扣金额合计',
                    },
                    fourthColumnName:{
                        title: '售卡面额合计',
                    }
                }
                break;
            case 'B2B_0029':
                headerConfig = {
                    firstColumnName: {
                        title: '科目',
                    },
                    secondColumnName: {
                        title: '上月分摊折扣（科目总金额）',
                    }
                }
                break;
            case 'B2B_0030':
            case 'B2B_0031':
            case 'B2B_0032':
            case 'B2B_0033':
                headerConfig = {
                    firstColumnName: {
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '法人公司代码',
                    },
                    thirdColumnName: {
                        title: '当月刷卡面额合计',
                    }
                }
                break;
            case 'B2B_0034':
            case 'B2B_0035':
            case 'B2B_0036':
            case 'B2B_0037':
                headerConfig = {
                    firstColumnName: {
                        title: '法人公司',
                    },
                    secondColumnName: {
                        title: '活动编码',
                    },
                    thirdColumnName: {
                        title: '法人公司代码',
                    },
                    fourthColumnName: {
                        title: '法人公司名称',
                    },
                    fifthColumnName: {
                        title: '第三方结算金额',
                    }
                }
                break;
            default:
                headerConfig = {}
        }
        return headerConfig
    },

    getTableData(voucherCode, tableData, data) {
        if (voucherCode == this.billType.B2C10) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.tmallKfcIncomeAmount,
                thirdColumnName: data.tmallKfcPayoutAmount,
                fourColumnName: data.tmallKfcTotalAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.tmallPhIncomeAmount,
                thirdColumnName: data.tmallPhPayoutAmount,
                fourColumnName: data.tmallPhTotalAmount
            })
        }
        if (voucherCode == this.billType.B2C14) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.kfcCardTotalNetAmount,
                thirdColumnName: data.kfcTransNetAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.phCardTotalNetAmount,
                thirdColumnName: data.phTransNetAmount
            })
        }
        if (voucherCode == this.billType.B2C06) {
            tableData.push({
                firstColumnName: data.cardTotalNetAmount
            })
        }
        if (voucherCode == this.billType.B2C01 || voucherCode == this.billType.B2C07 || voucherCode == this.billType.B2C13) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.kfcOrderAmount,
                thirdColumnName: data.kfcRefundAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.phOrderAmount,
                thirdColumnName: data.phRefundAmount
            })
        }
        if (voucherCode == this.billType.B2C04 || voucherCode == this.billType.B2C02) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.couponKfcOrderAmount,
                thirdColumnName: data.couponKfcRefundAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.couponPhOrderAmount,
                thirdColumnName: data.couponPhRefundAmount
            })
        }
        if (voucherCode == this.billType.B2C05) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.kfcTotalIncomeAmount,
                thirdColumnName: data.kfcTotalPayoutAmount,
                fourColumnName: data.kfcTotalAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.phTotalIncomeAmount,
                thirdColumnName: data.phTotalPayoutAmount,
                fourColumnName: data.phTotalAmount
            })
        }
        if (voucherCode == this.billType.B2C11) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.wechatKfcIncomeAmount,
                thirdColumnName: data.wechatKfcPayoutAmount,
                fourColumnName: data.wechatKfcTotalAmount
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.wechatPhIncomeAmount,
                thirdColumnName: data.wechatPhPayoutAmount,
                fourColumnName: data.wechatPhTotalAmount
            })
        }
        if (voucherCode == this.billType.B2C03 || voucherCode == this.billType.B2C12) {
            tableData.push({
                firstColumnName: 'KFC',
                secondColumnName: data.cardKfcOrderAmount,
                thirdColumnName: data.cardKfcRefundAmount,
            })
            tableData.push({
                firstColumnName: 'PH',
                secondColumnName: data.cardPhOrderAmount,
                thirdColumnName: data.cardPhRefundAmount,
            })
        }
        if (voucherCode == this.billType.B2B20) {
            data.vcpOrderInvoiceChildDtoList.forEach(function (item, indx) {
                tableData.push(item)
            })
        }
        if (voucherCode == this.billType.B2B01) {
            tableData.push({
                firstColumnName: data.unpArAmount,
                secondColumnName: data.zhxArAmount
            })
        }
        if (voucherCode == this.billType.B2B04 || voucherCode == this.billType.B2B05 ||
            voucherCode == this.billType.B2B08 || voucherCode == this.billType.B2B10) {
            tableData.push({
                firstColumnName: data.arAmount,
                secondColumnName: data.discountAmount,
                thirdColumnName: data.initBalance
            })
        }
        if (voucherCode == this.billType.B2B06 || voucherCode == this.billType.B2B07) {
            tableData.push({
                firstColumnName: data.kFCArAmount,
                secondColumnName: data.phArAmount,
                thirdColumnName: data.discountAmount,
                fourthColumnName: data.initBalance
            })
        }
        if (voucherCode == this.billType.B2B09) {
            tableData.push({
                firstColumnName: data.sJJCArAmount,
                secondColumnName: data.cMBArAmount,
                thirdColumnName: data.discountAmount,
                fourthColumnName: data.initBalance
            })
        }
        if (voucherCode == this.billType.B2B03 || voucherCode == this.billType.B2B12 || voucherCode == this.billType.B2B21 || voucherCode == this.billType.B2B22
            || voucherCode == this.billType.B2B23 || voucherCode == this.billType.B2B25 || voucherCode == this.billType.B2B26 || voucherCode == this.billType.B2B27) {
            tableData.push({
                firstColumnName: data.amount,
            })
        }
        if (voucherCode == this.billType.B2B24) {
            tableData.push({
                firstColumnName: data.buAmount,
                secondColumnName: data.frAmount
            })
        }
        if (voucherCode == this.billType.B2B11) {
            tableData.push({
                firstColumnName: data.totalPaymentAmount,
                secondColumnName: data.totalOrderAmount,
                thirdColumnName: data.totalSubAmount
            })
        }
        if (voucherCode == this.billType.B2B15 || voucherCode == this.billType.B2B16 || voucherCode == this.billType.B2B17 || voucherCode == this.billType.B2B18 || 
            voucherCode === this.billType.B2B29 || voucherCode === this.billType.B2C15 || voucherCode === this.billType.B2C16 || voucherCode === this.billType.B2C08 || 
            voucherCode === this.billType.B2C17 || voucherCode === this.billType.B2C18 || voucherCode === this.billType.B2C19 || voucherCode === this.billType.B2C20 || 
            voucherCode === this.billType.B2C21 || voucherCode === this.billType.B2C22 || voucherCode === this.billType.B2C23 || voucherCode === this.billType.B2C24 || 
            voucherCode === this.billType.B2C09) {
            data.monSettleLegalInvoiceDetailDtoList.forEach(function (item, indx) {
                tableData.push({
                    firstColumnName  : item.legal,
                    secondColumnName : item.amount
                })
            })
        }
        if(voucherCode == this.billType.B2B30 || voucherCode == this.billType.B2B31 || voucherCode == this.billType.B2B32 || voucherCode == this.billType.B2B33){
            data.childDtoList.forEach(function(item,index){
                tableData.push({
                    firstColumnName: item.legalEntityName,
                    secondColumnName: item.legalEntityCode,
                    thirdColumnName: item.swingCardAmount
                })
            })
            
        }
        if(voucherCode == this.billType.B2B34 || voucherCode == this.billType.B2B35 || voucherCode == this.billType.B2B36 || voucherCode == this.billType.B2B37){
            data.childDtoList.forEach(function(item,index){
                tableData.push({
                    firstColumnName: item.legalEntityName,
                    secondColumnName: item.legalEntityCode,
                    thirdColumnName: item.amount
                }) 
            }) 
            
        }
        if (voucherCode == this.billType.B2C25) {
            tableData.push({
                firstColumnName  : data.kbKfcIncomeAmount,
                secondColumnName : data.kbKfcPayoutAmount,
                thirdColumnName  : data.kbKfcTotalAmount,
                fourthColumnName : data.kbPhIncomeAmount,
                fifthColumnName  : data.kbPhPayoutAmount,
                sixthColumnName  : data.kbPhTotalAmount
            })
        }
        if (voucherCode == this.billType.B2C26) {
            tableData.push({
                firstColumnName  : data.kfcOrderAmount,
                secondColumnName : data.kfcRefundAmount,
                thirdColumnName  : data.phOrderAmount,
                fourthColumnName : data.phRefundAmount
            })
        }
        if (voucherCode == this.billType.B2B13) {
            data.childDtoList.forEach(function (item, index) {
                item.totalInitBalance = data.totalInitBalance
                tableData.push(item)
            })
            console.log('tableDatatableData', tableData)
        }
        if(voucherCode === this.billType.B2B14){
            tableData.push({
                firstColumnName: data.totalTransAmount,
                secondColumnName: data.totalSubAmount,
                thirdColumnName: data.transNetAmount,
                fourColumnName: data.blSubAmount
            })
        }
        if(voucherCode === this.billType.B2B19 || voucherCode === this.billType.B2B28){
            data.serviceChargeLegalInvoiceDetailDtoList.forEach(function (item, indx) {
                tableData.push({
                    firstColumnName  : item.legalEntityCode,
                    secondColumnName : item.legalBrand,
                    thirdColumnName  : item.ffsAmount,
                    fourthColumnName : item.ffsAmountEx,
                    fifthColumnName  : item.taxAmount
                })
            })
        }
        if(voucherCode === this.billType.B2B02){
            tableData.push({
                firstColumnName  : data.totalUnpArAmount,
                secondColumnName : data.totalZhxArAmount,
                thirdColumnName  : data.totalSaDiscount,
                fourthColumnName : data.totalSalesDenomination
            })
        }
    }
}
