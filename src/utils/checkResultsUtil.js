export default{
    //核对无差异，金额不一致表头
    sameAndDiffTblHeader : [
        {
            type : '1',
            header_1 : {
                name   : '订单',
                labels : ['渠道','订单交易流水号','订单行号','订单状态','订单行金额','退款金额','订单日期','退款日期','支付方式','商品类别','品牌'],
                props  : ['channelType','transactionNo','orderLineNumber','orderStatus','orderAmount','refundAmount','orderTime','refundTime','payMethod','productCategory','orderBrandName']
            },
            header_2 : {
                name   : '账单',
                labels : ['商户订单号','交易流水号','收入','支出','发生日期','业务类型','品牌','备注'],
                props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','transDatetime','businessType','billBrandName','comment']
            },
            columnIndexRange : [10,19]
        },
        {
            type : '2',
            header_1 : {
                name   : '订单',
                labels : ['渠道','订单号','订单行号','订单行金额','订单行退款金额','订单日期','退款日期','品牌','订单券码','订单状态'],
                props  : ['channelType','orderCode','orderLineNumber','currentOrderAmount','currentRefundAmount','orderTime','refundTime','orderBrandName','orderVoucherCode','orderStatus'] 
            },
            header_2 : {
                name   : '券码中心',
                labels : ['券号','券码状态','发券日期','退券日期','发券金额','退券金额','品牌'],
                props  : ['voucherCode','useStatus','incomeTime','payoutTime','incomeAmount','payoutAmount','couponBrandName']
            },
            columnIndexRange : [9,17]
        },
         //b2b 核对无差异
        {
            type : '3',
            header_1 : {
                name   : '订单',
                labels : ['卡平台订单号','订单状态','支付渠道','订单渠道','应收金额','退款金额','订单日期','付款日期','卡号','卡面额','卡折扣金额'],
                props  : ['orderSeqId','orderStatus','paymentType','channelId','balanceReceivable','refundAmount','purchaseTime','paymentTime','cardBin','cardAmount','discountBalance']
            },
            header_2 : {
                name   : '账单',
                labels : ['商户订单号','收入','支出','发生日期','订单创建月份','交易状态'],
                props  : ['productOrderCode','incomeAmount','payoutAmount','lastUpdateTxStamp','orderMonth','paymentModel']
            },
            columnIndexRange : [10,17]
        },
        {
            type   : '4',
            tabConfig : ['发卡','退卡'],
            header_1 : {
                name   : '订单',
                labels : ['卡平台订单号','订单状态','支付渠道','订单渠道','应收金额','订单日期','付款日期','卡号','卡面额','卡折扣金额'],
                props  : ['orderSeqId','orderStatus','paymentType','channelId','balanceReceivable','purchaseTime','paymentTime','cardBin','cardAmount','discountBalance']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['订单号','发卡渠道','卡号','应收金额','卡面值','订单状态','子订单渠道'],
                props  : ['orderSeqIdSales','platformCode','beginCardNo','arAmount','initBalanceSales','orderStatusSales','subSalesChannelSales']
            },
            columnIndexRange : [9,17]
        },
        {
            type  : '4-1',
            tabConfig : ['发卡','退卡'],
            header_1 : {
                name   : '订单',
                labels : ['卡平台订单号','订单状态','支付渠道','订单渠道','退款金额','订单日期','付款日期','卡号','卡面额','卡折扣金额'],
                props  : ['orderSeqId','orderStatus','paymentType','channelId','refundAmount','purchaseTime','paymentTime','cardBin','cardAmount','discountBalance']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['订单号','发卡渠道','卡号','退款金额','卡面值','子订单渠道'],
                props  : ['orderSeqIdRecharge','productTypeRecharge','cardNo','transNetAmount','initBalanceRecharge','subSalesChannelRecharge']
            },
            columnIndexRange : [9,16]
        },
        {
            type : '5',
            header_1 : {
                name   : '订单',
                labels : ['渠道','订单号','订单类型','订单金额','退款金额','订单创建日期','退款日期','支付方式','商品类别','品牌'],
                props  : ['channelType','orderId','orderType','orderAmount','refundAmount','orderCreateTime','refundTime','payMethod','productCategory','orderBrandName']
            },
            header_2 : {
                name   : '账单',
                labels : ['商户订单号','交易流水号','账单收入金额','支出','发生日期','品牌','备注'],
                props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','transDatetime','billBrandName','comment']
            },
            columnIndexRange : [9,17]
        },
        {
            type : '6',
            header_1 : {
                name   : '订单',
                labels : ['订单号','商品类别','订单金额','订单退款金额','订单日期','退款日期','订单品牌'],
                props  : ['orderCode','productCategory','orderAmount','refundAmount','orderCreateTime','refundTime','orderBrandName']
            },
            header_2 : {
                name   : '券码中心',
                labels : ['券码订单号','券号','券码状态','发券日期','退券日期','券码品牌','发券金额','退券金额'],
                props  : ['couponOrderCode','couponCode','useStatus','incomeTime','payoutTime','couponBrandName','incomeAmount','payoutAmount']
            },
            columnIndexRange : [6,15]
        },
        {
            type : '7',
            header_1 : {
                name   : '订单',
                labels : ['渠道','订单号','订单状态','订单金额','退款金额','订单日期','支付方式','商品类别','品牌'],
                props  : ['channelType','orderId','orderStatus','orderAmount','refundAmount','orderCreateTime','payMethod','productCategory','orderBrandName']
            },
            header_2 : {
                name   : '账单',
                labels : ['商户订单号','交易流水号','收入','支出','发生日期','品牌','备注'],
                props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','transDatetimeStr','billBrandName','comment']
            },
            columnIndexRange : [8,16]
        },
        {
            type : '8',
            header_1 : {
                name   : '订单',
                labels : ['渠道','订单号','天猫对接平台订单号','订单金额','退款金额','订单品牌','券码号','订单状态','券码订单号','订单创建时间','商品类别'],
                props  : ['channelType','orderId','tmallOrderId','orderAmount','refundAmount','orderBrandName','orderCoupon','orderStatus','couponOrderCode','orderCreateTime','productCategory']
            },
            header_2 : {
                name   : '券码中心',
                labels : ['券号','券码状态','发券金额','发券日期','退券金额','退券日期','券码品牌',],
                props  : ['couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName']
            },
            columnIndexRange : [10,18]
        },
        {
            type : '9',
            header_1 : {
                name   : '订单',
                labels : ['卡平台订单号','b2b折扣率','卡面值总额','实收金额','增量实收金额','审批状态','审批时间'],
                props  : ['orderSeqId','discount','cardAmount','actualAmount','currentActualAmount','approvalStatus','approvalTime']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['发卡-订单号','rsc折扣率','卡面总额','增量订单金额','应收总额','增量应收总额'],
                props  : ['orderNo','discountRate','orderAmount','currentOrderAmount','cardTotalNetAmount','currentCardTotalNetAmount']
            },
            columnIndexRange : [6,13]
        },
         {
            type : '10',
            header_1 : {
                name   : '订单',
                labels : ['卡平台订单号','b2b折扣率','卡面值总额','实收金额','增量实收金额','审批状态','审批时间'],
                props  : ['orderSeqId','discount','cardAmount','actualAmount','currentActualAmount','approvalStatus','approvalTime']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['发卡-订单号','rsc折扣率','卡面总额','增量订单金额','应收总额','增量应收总额'],
                props  : ['orderNo','discountRate','orderAmount','currentOrderAmount','cardTotalNetAmount','currentCardTotalNetAmount']
            },
            columnIndexRange : [6,13]
        },
        {
            type : '11',
            tabConfig : ['发卡','退卡'],
            header_1 : {
                name   : '订单',
                labels : ['订单号','订单状态','订单金额','订单日期','商品名称','最后更新时间','商品类别','品牌'],
                props  : ['orderId','orderStatus','currentOrderAmount','orderCreateTime','productName','lastUpdateTime','productCategory','orderBrandName']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['订单号','订单状态','子订单渠道','卡片真实金额','渠道类型'],
                props  : ['orderNo','orderStatusSales','subSalesChannel','currentCardTotalNetAmount','channelType']
            },
            columnIndexRange : [7,13]
        },
        {
            type : '11-1',
            tabConfig : ['发卡','退卡'],
            header_1 : {
                name   : '订单',
                labels : ['订单号','订单状态','退款金额','订单日期','商品名称','最后更新时间','商品类别','品牌'],
                props  : ['orderId','orderStatus','currentRefundAmount','orderCreateTime','productName','lastUpdateTime','productCategory','orderBrandName']
            },
            header_2 : {
                name   : '卡中心',
                labels : ['订单号','操作类型','退卡净额','子订单渠道','操作时间'],
                props  : ['orderNo','opearType','currentTransNetAmount','subSalesChannel','operaTime']
            },
            columnIndexRange : [7,14]
        },
        {
            type : '12',
            header_1 : {
                name   : '订单',
                labels : ['口碑商品订单号','口碑订单行号','商品名称','品牌','业务类型','发生日期','订单金额','退款金额','渠道','券码号'],
                props  : ['kbOrderNo','orderLineNumber','productName','orderBrandName','orderStatus','happenTime','currentOrderAmount','currentRefundAmount','channelType','orderCoupon']
            },
            header_2 : {
                name   : '券码中心',
                labels : ['券码订单号','券号','券码状态','发券金额','发券日期','退券金额','退券日期','券码品牌'],
                props  : ['couponOrderCode','couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName']
            },
            columnIndexRange : [9,18]
        },
        {
            type : '13',
            header_1 : {
                name   : '订单',
                labels : ['口碑订单行号','商品名称','品牌','业务类型','订单金额','退款金额','渠道'],
                props  : ['orderLineNumber','orderProductName','orderBrandName','businessType','currentOrderAmount','currentRefundAmount','channelType']
            },
            header_2 : {
                name   : '账单',
                labels : ['账单订单行号','商户订单号','交易流水号','收入','支出','发生日期','支付方式'],
                props  : ['billOrderLineNumber','productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','happenTime','payMethod']
            },
            columnIndexRange : [6,14]
        },
        {
            type : '14',
            header_1 : {
                name   : '订单',
                labels : ['订单号','外部订单号','品牌','商品名称','订单状态','创建时间','商品金额合计','运费','店铺优惠合计','订单金额','支付时间','退款状态','退款金额','商家订单备注','渠道类型'],
                props  : ['orderNo','outerOrderNo','orderBrand','productName','orderStatus','orderCreateTime','totalAmount','feeAmount','discountAmount','currentPayAmount','orderPaymentTime','refundStatus','currentRefundAmount','businessRemark','channelType'] 
            },
            header_2 : {
                name   : '券码中心',
                labels : ['券码号','券码订单号','券号','券码状态','发券金额','发券时间','退券金额','退券时间','券码品牌'],
                props  : ['orderCoupon','couponOrderCode','couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName']
            },
            columnIndexRange : [14,24]
        },
        {
            type : '15',
            header_1 : {
                name   : '订单',
                labels : ['订单号','外部订单号','品牌','商品名称','订单状态','创建时间','应收订单金额','订单金额','支付时间','退款状态','退款金额','商家订单备注','渠道类型'],
                props  : ['orderNo','outerOrderNo','orderBrand','productName','orderStatus','orderCreateTime','receivableAmount','currentPayAmount','orderPaymentTime','refundStatus','currentRefundAmount','businessRemark','channelType']
            },
            header_2 : {
                name   : '账单',
                labels : ['微信订单号','商户订单号','收入','支出','交易时间','账单品牌','账单状态','核对时间'],
                props  : ['wechatOrderNo','productOrderCode','incomeAmount','payoutAmount','transDatetime','billBrand','billStatus','checkTime']
            },
            columnIndexRange : [12,21]
        }
    ],
    //核对无账单表头
    noBillTblHeader : [
        {
            type   : '1',
            labels : ['渠道','订单交易流水号','订单行号','订单状态','订单行金额','订单行退款金额','订单日期','退款日期','商品类别','品牌','核对时间','分录状态','原因'],
            props  : ['channelType','transactionNo','orderLineNumber','orderStatus','orderAmount','refundAmount','orderTime','refundTime','productCategory','orderBrandName','createTime','journalType','reason']
        },
        {
            type   : '2',
            labels : ['渠道','订单号','订单行号','订单状态','订单行金额','订单行退款金额','订单日期','退款日期','商品类别','品牌','券号','核对时间','分录状态','原因'],
            props  : ['channelType','orderCode','orderLineNumber','orderStatus','orderAmount','refundAmount','orderTime','refundTime','productCategory','orderBrandName','orderVoucherCode','createTime','journalType','reason']
        },
        {
            type   : '3',
            labels : ['卡平台订单号','支付方式','订单状态','订单渠道','应收金额','退款金额','订单日期','付款日期','卡号','卡折扣金额','分录状态','原因'],
            props  : ['orderSeqId','paymentType','orderStatus','channelId','balanceReceivable','refundAmount','purchaseTime','paymentTime','cardBin','discountBalance','journalType','reason']
        },
        {
            type   : '4',
            tabConfig : ['发卡','退卡'],
            labels : ['卡平台订单号','订单状态','支付渠道','订单渠道','应收金额','订单日期','付款日期','卡号','卡面额','卡折扣金额','分录状态','原因'],
            props  : ['orderSeqId','orderStatus','paymentType','channelId','balanceReceivable','purchaseTime','paymentTime','cardBin','cardAmount','discountBalance','journalType','reason']
        },
        {
            type  : '4-1',
            tabConfig : ['发卡','退卡'],
            labels : ['卡平台订单号','订单状态','支付渠道','订单渠道','退款金额','退款日期','付款日期','卡号','卡面额','卡折扣金额','分录状态','原因'],
            props  : ['orderSeqId','orderStatus','paymentType','channelId','refundAmount','refundTime','paymentTime','cardBin','cardAmount','discountBalance','journalType','reason']
        },
        {
            type   : '5',
            labels : ['渠道','订单号','订单类型','订单金额','退款金额','订单创建日期','退款日期','商品类别','品牌','分录状态','原因'],
            props  : ['channelType','orderId','orderType','orderAmount','refundAmount','orderCreateTime','refundTime','productCategory','orderBrandName','journalType','reason']
        },
        {
            type   : '6',
            labels : ['订单号','订单金额','订单退款金额','订单日期','退款日期','订单品牌','商品类别','分录状态','原因'],
            props  : ['orderCode','orderAmount','refundAmount','orderCreateTime','refundTime','orderBrandName','productCategory','journalType','reason']
        },
        {
            type   : '7',
            labels : ['渠道','订单号','订单状态','订单金额','退款金额','订单日期','商品类别','品牌','分录状态','原因'],
            props  : ['channelType','orderId','orderStatus','orderAmount','refundAmount','orderCreateTime','productCategory','orderBrandName','journalType','reason']
        },
        {
            type   : '8',
            labels : ['渠道','订单号','天猫对接平台订单号','订单金额','退款金额','订单品牌','券码号','订单状态','订单创建时间','商品类别','分录状态','原因','核对时间'],
            props  : ['channelType','orderId','tmallOrderId','orderAmount','refundAmount','orderBrandName','orderCoupon','orderStatus','orderCreateTime','productCategory','journalType','reason','checkTime']
        },
        {
            type   : '9',
            labels : ['卡平台订单号','b2b折扣率','卡面值总额','实收金额','增量实收金额','审批状态','审批时间','分录状态','原因'],
            props  : ['orderSeqId','discount','cardAmount','actualAmount','currentActualAmount','approvalStatus','approvalTime','journalType','reason']
        },
        {
            type   : '10',
            labels : ['卡平台订单号','b2b折扣率','卡面值总额','实收金额','增量实收金额','审批状态','审批时间','分录状态','原因'],
            props  : ['orderSeqId','discount','cardAmount','actualAmount','currentActualAmount','approvalStatus','approvalTime','journalType','reason']
        },
        {
            type   : '11',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','订单状态','订单金额','订单日期','商品名称','最后更新时间','商品类别','品牌','渠道类型','核对时间','分录状态','原因'],
            props  : ['orderId','orderStatus','currentOrderAmount','orderCreateTime','productName','lastUpdateTime','productCategory','orderBrandName','channelType','checkTime','journalType','reason']
        },
        {
            type   : '11-1',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','订单状态','退款金额','订单日期','商品名称','最后更新时间','商品类别','品牌','渠道类型','核对时间','分录状态','原因'],
            props  : ['orderId','orderStatus','currentRefundAmount','orderCreateTime','productName','lastUpdateTime','productCategory','orderBrandName','channelType','checkTime','journalType','reason']
        },
        {
            type   : '12',
            labels : ['口碑商品订单号','口碑订单行号','商品名称','品牌','业务类型','发生日期','订单金额','退款金额','渠道','券码号','分录状态','原因'],
            props  : ['kbOrderNo','orderLineNumber','productName','orderBrandName','orderStatus','happenTime','currentOrderAmount','currentRefundAmount','channelType','orderCoupon','journalType','reason']
        },
        {
            type   : '13',
            labels : ['口碑订单行号','商品名称','品牌','业务类型','订单金额','退款金额','渠道','核对时间','分录状态','原因'],
            props  : ['orderLineNumber','productName','orderBrandName','orderStatus','currentOrderAmount','currentRefundAmount','channelType','checkTime','journalType','reason']
        },
        {
            type   : '14',
            labels : ['订单号','外部订单号','品牌','商品名称','订单状态','创建时间','商品金额合计','运费','店铺优惠合计','订单金额','支付时间','退款状态','退款金额','商家订单备注','渠道类型','核对时间','分录状态','原因'],
            props  : ['orderNo','outerOrderNo','orderBrand','productName','orderStatus','orderCreateTime','totalAmount','feeAmount','discountAmount','currentPayAmount','orderPaymentTime','refundStatus','currentRefundAmount','businessRemark','channelType','checkTime','journalType','reason']
        },
        {
            type   : '15',
            labels : ['订单号','外部订单号','品牌','商品名称','订单状态','创建时间','店铺优惠合计','订单金额','支付时间','退款状态','退款金额','商家订单备注','渠道类型','核对时间','分录状态','原因'],
            props  : ['orderNo','outerOrderNo','orderBrand','productName','orderStatus','orderCreateTime','receivableAmount','currentPayAmount','orderPaymentTime','refundStatus','currentRefundAmount','businessRemark','channelType','checkTime','journalType','reason']
        }
    ],
    //核对有账单
    hasBillTblHeader : [
        {
            type   : '1',
            labels : ['商户订单号','交易流水号','收入','支出','支付方式','交易时间','业务类型','订单创建月份','商品名称','品牌','备注','核对时间','分录状态','原因'],
            props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','payMethod','happendDate','businessType','orderMonth','productName','billBrandName','comment','createTime','journalType','reason'] 
        },
        {
            type   : '2',
            labels : ['券码','券码状态','发券日期','发券金额','退券日期','退券金额','来源订单号','品牌','可使用次数','已使用次数','核对时间','分录状态','原因','变更标记','备注'],
            props  : ['voucherCode','useStatus','incomeTime','incomeAmount','payoutTime','payoutAmount','orderCode','couponBrandName','reusableCount','usedseqid','createTime','journalType','reason','changeFlag','remark']
        },
        {
            type   : '3',
            labels : ['商户订单号','支付方式','收入','支出','发生日期','订单创建月份','交易状态','分录状态','原因'], 
            props  : ['productOrderCode','payMethod','incomeAmount','payoutAmount','lastUpdateTxStamp','orderMonth','paymentModel','journalType','reason']
        },
        {
            type   : '4',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','应收金额','卡号','卡面值','订单状态','子订单渠道','分录状态','原因'],
            props  : ['orderSeqIdSales','arAmount','beginCardNo','initBalanceSales','orderStatusSales','subSalesChannelSales','journalType','reason']
        },
        {
            type  : '4-1',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','退款金额','卡号','卡面值','子订单渠道','分录状态','原因'],
            props  : ['orderSeqIdRecharge','transNetAmount','cardNo','initBalanceRecharge','subSalesChannelRecharge','journalType','reason']
        },
        {
            type   : '5',
            labels : ['商户订单号','交易流水号','收入','支出','发生日期','商品名称','分录状态','支付方式','原因','备注'],
            props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','transDatetime','productName','journalType','payMethod','reason','comment']
        },
        {
            type   : '6',
            labels : ['订单号','券号','券码状态','发券日期','退券日期','发券金额','退券金额','券码品牌','核对时间','渠道类型','分录状态','原因'],
            props  : ['orderCode','couponCode','useStatus','incomeTime','payoutTime','incomeAmount','payoutAmount','couponBrandName','checkTime','channelType','journalType','reason']
        },
        {
            type   : '7',
            labels : ['商户订单号','交易流水号','收入','支出','支付方式','支付账号','交易时间','商品名称','品牌','备注','核对时间','分录状态'],
            props  : ['productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','payMethod','payAccount','transDatetime','productName','billBrandName','comment','checkTime','journalType']
        },
        {
            type   : '8',
            labels : ['订单号','券码','券码状态','发券金额','发券日期','退券金额','退券日期','券码品牌','分录状态','原因','核对时间'],
            props  : ['orderCode','couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName','journalType','reason','checkTime']
        },
        {
            type   : '9',
            labels : ['发卡-订单号','rsc折扣率','卡面总额','增量订单金额','应收总额','增量应收总额','分录状态','原因'],
            props  : ['orderNo','discountRate','orderAmount','currentOrderAmount','cardTotalNetAmount','currentCardTotalNetAmount','journalType','reason']
        },
        {
            type   : '10',
            labels : ['发卡-订单号','rsc折扣率','卡面总额','增量订单金额','应收总额','增量应收总额','分录状态','原因'],
            props  : ['orderNo','discountRate','orderAmount','currentOrderAmount','cardTotalNetAmount','currentCardTotalNetAmount','journalType','reason']
        },
        {
            type   : '11',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','订单状态','子订单渠道','卡片真实金额','渠道类型','核对时间','分录状态','原因'],
            props  : ['orderNo','orderStatusSales','subSalesChannel','currentCardTotalNetAmount','channelType','checkTime','journalType','reason']
        },
        {
            type   : '11-1',
            tabConfig : ['发卡','退卡'],
            labels : ['订单号','退卡净额','子订单渠道','渠道类型','操作类型','操作时间','核对时间','分录状态','原因'],
            props  : ['orderNo','currentTransNetAmount','subSalesChannel','channelType','opearType','operaTime','checkTime','journalType','reason']
        },
        {
            type   : '12',
            labels : ['订单号','券码','券码状态','发券金额','发券日期','退券金额','退券日期','券码品牌','分录状态','原因','核对时间'],
            props  : ['orderCode','couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName','journalType','reason','checkTime']
        },
        {
            type   : '13',
            labels : ['账单订单行号','商户订单号','交易流水号','收入','支出','发生日期','支付方式','品牌','渠道类型','商品名称','核对时间','分录状态','原因'],
            props  : ['orderLineNumber','productOrderCode','paySerialNumbers','incomeAmount','payoutAmount','happenTime','payMethod','billBrandName','channelType','productName','checkTime','journalType','reason']
        },
        {
            type   : '14',
            labels : ['订单号','券号','券码状态','发券金额','发券日期','退券金额','退券日期','券码品牌','分录状态','原因','核对时间'],
            props  : ['orderCode','couponCode','useStatus','incomeAmount','incomeTime','payoutAmount','payoutTime','couponBrandName','journalType','reason','checkTime']
        },
        {
            type   : '15',
            labels : ['微信订单号','商户订单号','收入','支出','交易时间','账单品牌','账单状态','渠道类型','核对时间','分录状态','原因'],
            props  : ['wechatOrderNo','productOrderCode','incomeAmount','payoutAmount','transDatetime','billBrand','billStatus','channelType','checkTime','journalType','reason'] 
        }
    ],
    //获取表配置
    getTblObj(caseStr){
        let tempTblObj = {};
        switch(caseStr){
            case 'B2C_RECEIVE-B2C_OWNMALL':
                tempTblObj = {
                    title : '自有商城收退款核对报告',
                    type  : '1',
                    numberLabel  : '订单数量',
                    noBillLabel  : '售卖渠道有账单无',
                    hasBillLabel : '售卖渠道无账单有'
                };
                break;
            case 'B2C_COUPON-B2C_OWNMALL':
                tempTblObj = {
                    title : '自有商城券码订单核对报告',
                    type  : '2',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有券码中心无',
                    hasBillLabel : '售卖渠道无券码中心有'
                };
                break;
             case 'B2B_RECEIVE-B2B_OWNCHANNEL':
                tempTblObj = {
                    title : '虚拟卡平台收退款核对报告',
                    type  : '3',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有账单无',
                    hasBillLabel : '售卖渠道无账单有'
                };
                break;
            case 'B2B_VIRTUALCARD-B2B_OWNCHANNEL':
                tempTblObj = {
                    title : '虚拟卡平台订单核对报告',
                    type  : '4',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有卡中心无',
                    hasBillLabel : '售卖渠道无卡中心有'
                };
                break;
            case 'B2C_RECEIVE-B2C_WECHATMALL':
                tempTblObj = {
                    title : '微信社交商城核对报告',
                    type  : '5',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有账单无',
                    hasBillLabel : '售卖渠道无账单有'
                };
                break;
            case 'B2C_COUPON-B2C_WECHATMALL':
                tempTblObj = {
                    title : '微信社交商城券码订单核对报告',
                    type  : '6',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有券码中心无',
                    hasBillLabel : '售卖渠道无券码中心有'
                };
                break;
            case 'B2C_RECEIVE-B2C_TMALL':
                tempTblObj = {
                    title : '天猫商城收退款核对报告',
                    type  : '7',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道订单有账单无',
                    hasBillLabel : '售卖渠道订单无账单有'
                };
                break;
            case 'B2C_COUPON-B2C_TMALL':
                tempTblObj = {
                    title : '天猫商城券码订单核对报告',
                    type  : '8',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有券码中心无',
                    hasBillLabel : '售卖渠道无券码中心有'
                };
                break;
            case 'B2B_VIRTUALCARD-B2B_GROUP':
                tempTblObj = {
                    title : '一次性团购虚拟卡订单平台核对报告',
                    type  : '9',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有卡中心无',
                    hasBillLabel : '售卖渠道无卡中心有'
                };
                break;
            case 'B2B_VIRTUALCARD-B2B_PETTY':
                tempTblObj = {
                    title : '小额纸质卡虚拟卡订单平台核对报告',
                    type  : '10',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有卡中心无',
                    hasBillLabel : '售卖渠道无卡中心有'
                };
                break;
            case 'B2C_VIRTUALCARD-B2C_TMALL':
                tempTblObj = {
                    title : '天猫商城虚拟卡订单核对报告',
                    type  : '11',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有卡中心无',
                    hasBillLabel : '售卖渠道无卡中心有'
                };
                break;
            case 'B2C_COUPON-B2C_KB':
                tempTblObj = {
                    title : '口碑券码订单核对报告',
                    type  : '12',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有券码中心无',
                    hasBillLabel : '售卖渠道无券码中心有'
                };
                break; 
            case 'B2C_RECEIVE-B2C_KB':
                tempTblObj = {
                    title : '口碑收退款核对报告',
                    type  : '13',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道订单有账单无',
                    hasBillLabel : '售卖渠道订单无账单有'
                };
                break
            case 'B2C_COUPON-B2C_YZ':
                tempTblObj = {
                    title : '有赞券码订单核对报告',
                    type  : '14',
                    numberLabel  : '数量',
                    noBillLabel  : '售卖渠道有券码中心无',
                    hasBillLabel : '售卖渠道无券码中心有'
                };
                break;
            case 'B2C_RECEIVE-B2C_YZ':
                tempTblObj = {
                    title : '有赞收退款核对报告',
                    type  : '15',
                    numberLabel  : '订单数量',
                    noBillLabel  : '售卖渠道订单有账单无',
                    hasBillLabel : '售卖渠道订单无账单有'
                };
                break;
            default:
                tempTblObj = {
                    title : '',
                    type  : ''
                }
        }
        return tempTblObj;
    },
    //手工分录decs
    manualAccountingDesc : [
        '',
        {
            type : '自有商城收退款',
            detailType : ['核对不一致','核对有订单无账单','核对有账单无订单']
        },
        {
            type : '自有商城',
            detailType : ['订单核对不一致','核对有订单无券码','核对有券码无订单']
        },
        {
            type : '虚拟卡平台B2C收退款核对',
            detailType : ['不一致','有订单无账单','有账单无订单']
        },
        {
            type : '虚拟卡平台B2C订单核对',
            detailType : ['不一致','有订单无卡','有卡无订单'],
            activeTabType : ['-发卡','-退卡']
        },
        {
            type : '微信社交商城收退款核对',
            detailType : ['不一致','有订单无账单','有账单无订单']
        },
        {
            type : '微信社交商城',
            detailType : ['订单核对不一致','核对有订单无券码','核对有券码无订单']
        },
        {
            type : '天猫商城收退款核对',
            detailType : ['不一致','有订单无账单','有账单无订单']
        },
        {
            type : '天猫商城',
            detailType : ['订单核对不一致','核对有订单无券码','核对有券码无订单']
        },
        {
            type : '一次性团购订单核对',
            detailType : ['不一致','有订单无卡','有卡无订单']
        },
        {
            type : '小额纸质卡券订单核对',
            detailType : ['不一致','有订单无卡','有卡无订单']
        },
        {
            type : '天猫商城虚拟卡平台订单核对',
            detailType : ['不一致','有订单无卡','有卡无订单'],
            activeTabType : ['-发卡','-退卡']
        },
        {
            type : '口碑',
            detailType : ['订单核对不一致','核对有订单无券码','核对有券码无订单']
        },
        {
            type : '口碑收退款核对',
            detailType : ['不一致','有订单无账单','有账单无订单']
        },
        {
            type : '有赞',
            detailType : ['订单核对不一致','核对有订单无券码','核对有券码无订单']
        },
        {
            type : '有赞收退款核对',
            detailType : ['不一致','有订单无账单','有账单无订单']
        }
    ],
    //汇总金额KEY
    totalAmountCalKey : ['',
    {
        type : '1',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '2',
        detailType : ['differentTotal','currentOrderAmount-currentRefundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '3',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '4',
        detailType : ['arDifferentTotal','orderAmount','arAmount']
    },
    {
        type : '5',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '6',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '7',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '8',
        detailType : ['differentTotal','orderAmount-refundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '9',
        detailType : ['actualAmountTotal','currentActualAmount','currentCardTotalNetAmount']
    },
    {
        type : '10',
        detailType : ['actualAmountTotal','currentActualAmount','currentCardTotalNetAmount']
    },
    {
        type : '11',
        detailType : ['differentTotal','differentTotal','currentOrderAmount','currentRefundAmount','currentCardTotalNetAmount','currentTransNetAmount']
    },
    {
        type : '4-1',
        detailType : ['differentTotal','refundAmount','transNetAmount']
    },
    {
        type : '11-1',
        detailType : ['differentTotal','differentTotal','currentOrderAmount','currentRefundAmount','currentCardTotalNetAmount','currentTransNetAmount']
    },
    {
        type : '12',
        detailType : ['differentTotal','currentOrderAmount-currentRefundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '13',
        detailType : ['differentTotal','currentOrderAmount-currentRefundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '14',
        detailType : ['differentTotal','currentPayAmount-currentRefundAmount','incomeAmount-payoutAmount']
    },
    {
        type : '15',
        detailType : ['differentTotal','currentPayAmount-currentRefundAmount','incomeAmount-payoutAmount']
    }]
}