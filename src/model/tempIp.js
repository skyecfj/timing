/**
 * Created by xiaoxiaozhang on 7/20/2018.
 */
export default  {
    data_set_ip:'/fsc/source-guide',
    test_local_ip:'http://172.16.15.126:8016',
    task_center_ip:'/fsc/task-center',//'http://10.6.11.163:43245'http://172.16.15.126:8016,
    export_center_ip:'/fsc/export-center',
    verify_ip:'/fsc/verify',
    master_ip:'/fsc/masterdata',
    third_sales_ip: '/fsc/third-sales-promotion',
    login_ip:'/fsc',
    accountConfig_ip:'/fsc/account',
    //temp_accountConfig_ip:'http://172.18.13.31:8013/fsc/account',
    manualAccounting_ip:'/fsc/account/bbc-manual-entry',
    report_ip:'/fsc/report',
    data_center:'/fsc/data-center',
    warn_ip:'/fsc/warn',
    verifyApi:[
        '/verify/query',//核对结果主表查询 0
        '/verify/own-refunds',//自有卡核对 1
        '/verify/own/orders',//券码中心核对 2
        '/verify/vcp-refunds',//b2b虚拟卡收退款自有渠道核对3
        '/verify/vcp-orders',//b2b虚拟卡订单自有渠道核对4
        '/verify/wsm-refunds',//b2c收退款微信社交商城5 
        '/verify/wsm/orders',//b2c虚拟卡订单微信社交商城6 
        '/verify/tm-refunds',//b2c天猫商城订单收退款7
        '/verify/tm/orders',//b2c天猫商城券码8
        '/verify/vcop-orders/sales',//b2b虚拟卡订单平台一次性团购9
        '/verify/petty-orders/sales',//b2b虚拟卡订单平台小额纸质10
        '/verify/tm/orders/virtual/card',//b2c天猫商城 虚拟卡订单11 
        '/verify/kb/orders',//b2c 券码订单 口碑 核对-12 
        '/verify/kb-refunds',//b2c 收退款 口碑 核对-13
        '/verify/yz/orders',//b2c 券码订单 有赞 核对-14
        '/verify/yz/refunds'//b2c 收退款 有赞 核对-15
    ], 
    verifyExportApi:[
        '',
        '/export/export-OwnRefunds',//自有商城收退款 1
        '/export/export-OwnOrders',//自有商城订单 2
        '/vcp-export/export-refunds',//b2b虚拟卡收退款自有渠道核对3
        '/vcp-export/export-OwnOrders',//b2b虚拟卡订单自有渠道核对4
        '/wsm-export/export-refunds',//b2c收退款微信社交商城5  
        '/verify/wsm/orders/export/export-WsmOrders',//b2c虚拟卡订单微信社交商城6  
        '/verify/tm/refunds/export-refunds',//b2c天猫商城订单收退款7
        '/verify/tm/orders/export/export-TmOrders',//b2c天猫商城券码8
        '/vcop-export/export-OwnOrders',//b2b虚拟卡订单平台一次性团购9
        '/vcop-petty-export/export-OwnOrders',//b2b虚拟卡订单平台小额纸质10
        '/verify/tm/orders/virtual/card/export/export-OwnOrders',//b2c天猫商城 虚拟卡订单11 
        '/verify/kb/orders/export/export-KbOrders',//b2c券码订单 口碑12 
        '/verify/kb/refunds/export/export-refunds',//b2c 收退款 口碑 核对-13
        '/verify/yz/orders/export/export-orders',//b2c券码订单 有赞14
        '/verify/yz/refunds/export/export-refunds' //b2c收退款 有赞15
    ],
    verifyExportDetailApi:[//导出订单
        '',
        '/export/export-ProductOrderCode-Excel-ByPage', //有账单无订单结果页面，导出订单1
        '/export/export-OrderCode-Excel-ByPage',//有券码无订单结果页面，导出订单  2
        '/vcp-export/export-ProductOrderCode-Excel-ByPage',//b2b虚拟卡收退款自有渠道核对3
        '/vcp-export/export-OrdersByOrderCode-Excel-ByPage',//b2b虚拟卡订单自有渠道核对4
        '/wsm-export/export-ProductOrderCode-Excel-ByPage',//b2c收退款微信社交商城5  
        '/verify/wsm/orders/export/export-OrderCode-Excel-ByPage',//b2c虚拟卡订单微信社交商城6  
        '/verify/tm/refunds/export-ProductOrderCode-Excel-ByPage',//b2c天猫商城订单收退款7
        '/verify/tm/orders/export/export-OrderCode-Excel-ByPage',//b2c天猫商城券码8
        '/vcop-export/export-OrdersByOrderCode-Excel-ByPage',//b2b虚拟卡订单平台一次性团购9
        '/vcop-petty-export/export-OrdersByOrderCode-Excel-ByPage',//b2b虚拟卡订单平台小额纸质10
        '/verify/tm/orders/virtual/card/export/export-OrdersByOrderCode-Excel-ByPage',//b2c天猫商城 虚拟卡订单11 
        '/verify/kb/orders/export/export-OrderCode-Excel-ByPage',//b2c券码订单 口碑12 
        '/verify/kb/refunds/export/export-ProductOrderCode-Excel-ByPage',//b2c 收退款 口碑 核对-13 
        '/verify/yz/orders/export/export-OrderCode-Excel-ByPage',//b2c券码订单 有赞14
        '/verify/yz/refunds/export/export-WeChatOrderNo-Excel-ByPage'//b2c收退款 有赞15
    ],
   verifyExportCouponApi:[ // 导出券码
        '',
        '', 
        '/export/export-Bill-ByOrderVoucherCode-Excel-ByPage',
        '',
        '/vcp-export/export-Bill-exportCardByOrder-Excel-ByPage',//b2b虚拟卡订单自有渠道核对4
        '', 
        '/verify/wsm/orders/export/export-Bill-ByOrderVoucherCode-Excel-ByPage',//b2c虚拟卡订单微信社交商城6  
        '',
        '/verify/tm/orders/export/export-Bill-ByOrderVoucherCode-Excel-ByPage',//b2c天猫商城券码8
        '/vcop-export/export-Bill-exportCardByOrder-Excel-ByPage',//b2b虚拟卡订单平台一次性团购9
        '/vcop-petty-export/export-Bill-exportCardByOrder-Excel-ByPage',//b2b虚拟卡订单平台小额纸质10
        '/verify/tm/orders/virtual/card/export/export-Bill-exportCardByOrder-Excel-ByPage',//b2c天猫商城 虚拟卡订单11 
        '/verify/kb/orders/export/export-Bill-ByOrderVoucherCode-Excel-ByPage'//b2c券码订单 口碑12 
    ],
    verifyProductCategoryApi:[//商品类别
        '',//核对结果主表查询 0
        '',//自有卡核对 1
        '',//券码中心核对 2
        '',//b2b虚拟卡收退款自有渠道核对3
        '',//b2b虚拟卡订单自有渠道核对4
        '/verify/wsm-refunds/get-product-category',//b2c收退款微信社交商城5 
        '',//b2c虚拟卡订单微信社交商城6 
        '/verify/tm-refunds/get-product-category',//b2c天猫商城订单收退款7
        '',//b2c天猫商城券码8
        '',//b2b虚拟卡订单平台一次性团购9
        '',//b2b虚拟卡订单平台小额纸质10
        ''//b2c天猫商城 虚拟卡订单11 
    ],

    

    dataViewApi:[
        '/data/download' //B2C账单/B2C订单
    ],
    storeBillDeatilApi:{
        'STORE_0001':'bohActiveNoCashVoucherDetailList',//BOH活动报送值非现金日凭证
        'STORE_0002':'getNocashBohCheckDetailList',//非现金账单与BOH活动自动核对完日凭证
        'STORE_0008':'getBohEscortVoucherDetailList',//现金BOH与押运公司账单核对完成押运公司账
        'STORE_0009':'cashBankVoucherDetailList',//现金BOH与银行流水核对完成核对月凭证
        'STORE_0011':'procedureFeeInputTaxList',//手续费进项税凭证
        'STORE_0007':'',//第三方账单/支付宝与银行流水核对差异为容差范围内的凭证
        'STORE_0020':'getThirdBillAlipayCheckDetailList',//饿了么账单与支付宝核对完成支付宝账单日凭证
        'STORE_0003':'getNoCashBohDiffDetailList',//非现金账单与BOH核对差异定位完成日凭证
        'STORE_0010':'getChargeProvisionDetailList',//手续费计提凭证
        'STORE_0004':'getConfirmSettleDetailList',//确认结算日凭证
        'STORE_0012':'getProvisionBsDiscountDetailList', //计提百胜折扣凭证
        'STORE_0005':'getBankBillCheckAccountDetailList' //账单与银行流水核对凭证
    },
    store: '/fsc/store'
}