export default{
    getTblHeaderConfig(resultName){
        let tblHeaderConfig = {};
        switch (resultName) {
            case 'alipayBill':
                tblHeaderConfig = {
                    batchDate : '跑批时间',
                    batchNo : '批次号',
                    orderId : '商户订单号',
                    paymentModel : '支付类型',
                    transDatetime : '交易时间',
                    transAmount : '交易金额',
                    paymentOrderId : '支付流水号',
                    lastUpdatedTxStamp : '最后更新时间',
                    totalFee : '交易总金额',
                    goodsTitle : '商品名称',
                    partnerId : '商户号',
                    account : '账号',
                    memo : '备注'
                }
                break;
            case 'vcpAlipayBill':
            case 'tmallAlipayBill':
                tblHeaderConfig = {
                    batchDate : '跑批时间',
                    batchNo : '批次号',
                    orderId : '商户订单号',
                    financialOrderId : '财务流水号',
                    merchantNumber : '商户号',
                    account : '账号',
                    buyerAccount : '对方账号',
                    brand : '品牌',
                    channel : '渠道',
                    goodsTitle : '商品名称',
                    transAmount : '交易金额',
                    balanceAccount : '账户余额',
                    paymentOrderId : '支付流水号',
                    paymentMethod : '交易渠道',
                    paymentModel : '业务类型',
                    transDatetime : '交易时间',
                    lastUpdatedTxStamp : '最后更新时间',
                    memo : '备注'
                }
                break;
            case 'ownStoreOrder':
                tblHeaderConfig = {
                    itemDescription : '商品名称',
                    orderId : '订单号',
                    externalId : '订单行号',
                    itemStatusId : '订单行状态',
                    statusId : '订单状态',
                    subtotal : '订单行金额',
                    quantity : '订单行数量',
                    unitPrice : '商品单价',
                    headerSubtotal : '订单金额',
                    createdTxStamp : '下单日期',
                    lastUpdatedTxStamp : '最后修改日期',
                    transactionNo : '订单交易流水号',
                    channel : '支付方式',
                    returnAmount : '退款金额',
                    returnTxStamp : '退款日期',
                    subProductCouponCodes : 'couponID',
                    brand : '品牌',
                    dispatchDate : '发货日期',
                    commodityType : '商品类别',
                    productId : '商品编码'
                }
                break;
            case 'vcpOrder':
                tblHeaderConfig = {
                    orderseqid : '卡平台订单号',
                    orderstatus : '订单状态',
                    channelid : '订单渠道',
                    amount : '订单金额',
                    totalcount : '卡片数量',
                    purchasetime : '订单日期',
                    completedtime : '发货日期',
                    frozentime : '冻结日期',
                    refundamount : '退款金额',
                    refundedtime : '退款日期',
                    invoicestatus : '是否要卡发票',
                    ispayment : '是否支付',
                    paymenttype : '支付渠道',
                    paymenttime : '付款日期',
                    paymentbalance : '付款金额',
                    paymentbankname : '付款银行',
                    paymentbankaccount : '付款银行账户',
                    isactivate : '是否激活',
                    activatetime : '激活时间',
                    discountrate : '折扣率',
                    discountbalance : '折扣金额',
                    balancereceivable : '应收金额',
                    cardbin : '卡号',
                    currentstatus : '卡状态',
                    cardamount : '卡面额',
                    cardtype : '卡类型',
                    usertype : '购买人类型',
                    cardbuyer : '购买人手机号',
                    cardreceiver : '收货手机号',
                    lastUpdateTime : '最后更新时间'
                }
                break;
            case 'tmallOrder':
                tblHeaderConfig = {
                    batchNo : '批次编号',
                    transDatetime : '交易时间',
                    goodsTitle : '商品名称',
                    orderId : '商户订单号',
                    brand : '品牌',
                    paymentOrderId : '支付宝交易号',
                    buyerAccount : '对方账户',
                    buyerName : '对方名称',
                    transAmount : '订单金额(元)',
                    returnAmount : '退款金额(元)',
                    serviceFee : '服务费(元)',
                    branchCompany : '分公司',
                    bankOrderId : '银行订单号',
                    transType : '交易分类',
                    paymentModel : '交易方式',
                    store : '门店',
                    account : '子账号',
                    lastUpdateTime : '最新抓取时间'
                }
                break;
            case 'wechatSocialBill':
            case 'wechatBill':
                tblHeaderConfig = {
                    batchDate : '跑批时间',
                    batchNo : '批次号',
                    orderId : '商户订单号',
                    paymentModel : '支付类型',
                    transDatetime : '交易时间',
                    transAmount : '交易金额',
                    paymentOrderId : '支付流水号',
                    lastUpdatedTxStamp : '最后更新时间',
                    officalAccountId : '微信公众账号id',
                    merchantId : '商户号',
                    subMerchantId : '特约商户号',
                    account : '账号',
                    goodsTitle : '商品名称',
                    orderAmount : '订单金额',
                    applyRefundAmount : '申请退款金额'
                }
                break;
            case 'vcpWechatBill':
                tblHeaderConfig = {
                    batchDate : '跑批时间',
                    batchNo : '批次号',
                    orderId : '订单号',
                    transDatetime : '交易时间',
                    transAmount : '交易金额',
                    paymentOrderId : '支付流水号',
                    paymentModel : '支付类型',
                    createdStamp : '拉取时间',
                    officalAccountId : '微信公众账号id',
                    merchantId : '商户号',
                    deviceId : '设备号',
                    buyerAccount : '用户标识',
                    transType : '交易类型',
                    bankName : '退款银行',
                    currency : '货币种类',
                    cashCouponAmount : '现金券金额',
                    weixinRefundId : '微信退款单号',
                    merchantRefundId : '商户退款单号',
                    cashCouponRefundAmount : '现金退款金额',
                    refundType : '退款类型',
                    goodsTitle : '商品名称',
                    serviceFee : '手续费',
                    rate : '费率',
                    merchantData : '商户数据包',
                    account : '账号',
                    orderAmount : '订单金额',
                    applyRefundAmount : '申请退款金额',
                    serviceFeeMemo : '费率备注'
                }
                break;
            case 'wechatSocialCouponOrder': //微信社交商城券订单
                tblHeaderConfig = {
                    orderid : '订单号',
                    ordertime : '订单交易日期',
                    amount : '订单金额',
                    num : '总数量',
                    mobile : '用户电话',
                    coupon : '券号',
                    //cmsid : 'cmsid',//QUES
                    leftConsumeNum : '剩余可消费次数',
                    sumConsumeNum : '可消费次数',
                    deliverytime : '发券时间',
                    orderamount : '券金额',
                    price : '单价',
                    deltime : '退单日期',
                    refundamount : '退款金额',
                    ordertype : '发卡类型',
                    //subOuterIid : 'sub_outer_iid',//QUES
                    lastUpdateTime : '最后更新时间'
                }
                break;
            case 'wechatSocialCardOrder': //微信社交商城卡订单
                tblHeaderConfig = {
                    brand : '品牌',
                    b2bOrder : '入库编号',
                    b2bOrdertime : '入库时间',
                    carddesc : '商品类别',
                    cardbin : '卡号',
                    b2cOrder : '订单编号',
                    b2cOrdertime : '订单时间',
                    orderamount : '订单金额',
                    unitprice : '单价',
                    lastUpdateTime : '最后更新时间',
                    refundamount : '退款金额',
                    //b2bUnitprice : 'b2bUnitprice'//QUES
                }
                break;
            case 'wechatSocialBill': //微信社交商城账单QUES
                break;
            case 'vcopOrder': //虚拟卡订单平台的订单
                tblHeaderConfig = {
                    orderseqid : '卡平台订单号',
                    ordernum : '订单号',
                    orderamount : '卡面值总额',
                    discount : '折扣率',
                    ordertype : '发码方式',
                    approvalstatus : '审批状态',
                    buyeremail : '买家邮箱',
                    buyermobile : '买家手机',
                    createtime : '创建时间',
                    approvaltime : '审批时间',
                    ispayable : '激活状态',
                    effectivedate : '订单有效时期',
                    invoicetitle : '发票抬头',
                    note : '备注',
                    accountname : '户名',
                    paidinamount : '实收金额',
                    paybank : '打款银行',
                    accountno : '账号',
                    iscreateurl : '是否生成链接',
                    isyumplatform : '是否使用银商发卡',
                    productid : '卡产品号',//QUES
                    num : '卡数量',
                    issuerbrandid : '卡产品号码',//QUES
                    cardbin : '卡号',
                    cardamount : '卡面额',
                    balance : '折扣金额',
                    cardTotalAmount : '卡净值',
                    activatetime : '订单激活日期',
                    cardsequence : '卡序列号',
                    lastUpdateTime : '最近更新时间'
                }
                break;
            case 'vcopBuyerOrder': //小额纸质卡券订单
                tblHeaderConfig = {
                    ordernum : '订单编号',
                    num : '购买数量',
                    orderamount : '购买金额',
                    paymentamount : '实付金额',
                    discount : '折扣率',
                    orderstatus : '订单状态',
                    leftConsumeNum : '剩余可消费次数',
                    paymenttype : '支付方式',
                    paybank : '打款银行',
                    accountname : '户名',
                    accountno : '账号',
                    approvalstatus : '审批状态',
                    approvaltime : '审批时间',
                    salesman : '销售人',
                    note : '备注',
                    createtime : '订单创建时间',
                    lastupdatetime : '最后更新时间',
                    cardcenter : '登录账号',
                    buyername : '买家',
                    buyermobile : '买家手机',
                    invoicetitle : '发票抬头',
                    couriercompany : 'couriercompany',//QUES
                    couriernumber : 'couriernumber',//QUES
                    ispayable : '激活状态'
                }
                break;
            case 'kbOrder': //小额纸质卡券订单
                tblHeaderConfig = {
                    happenTime : '发生时间',
                    productName : '商品信息',
                    productId : '商品ID',
                    alipayOrderNo : '支付宝订单交易号',
                    merchantOrderNo : '商品订单商户订单号',
                    couponInfo : '券码信息',
                    verificationEnableNum : '可核销次数',
                    orderStatus : '业务类型',
                    settlementAmount : '结算金额',
                    orderAmount : '商品订单金额',
                    merchantDiscountAmount : '商家优惠',
                    jfbPayAmount : '集分宝支付',
                    packagePayAmount : '红包支付',
                    alipayDiscoutAmount : '支付宝优惠',
                    refundOrderNo : '退款请求号',
                    payModel : '结算模式',
                    voucherName : '商品抵用券名称',
                    voucherMerchantDiscountAmount : '商品抵用券商家优惠金额',
                    voucherAlipayDiscountAmount : '商品抵用券支付宝优惠金额',
                    kbOrderNo : '口碑商品订单号',
                    kbLineNo : '口碑订单行号',
                    brand : '品牌',
                    lastUpdateTime : '最近更新时间'
                }
                break;
            case 'kbBill': //小额纸质卡券订单
                tblHeaderConfig = {
                    batchDate : '跑批时间',
                    batchNo : '批次号',
                    financialOrderId : '财务流水号',
                    financialOrderId : '业务流水号',
                    orderId : '商户订单号',
                    goodsTitle : '商品名称',
                    transDatetime : '交易时间',
                    buyerAccount : '对方账号',
                    inAmount : '收入金额',
                    outAmount : '支出金额',
                    balanceAccount : '账户余额',
                    paymentMethod : '交易渠道',
                    paymentModel : '业务类型',
                    memo : '备注',
                    brand : '品牌',
                    channel : '渠道'
                }
                break;
            case 'yzOrder': //有赞订单
                tblHeaderConfig = {
                    orderId : '订单号',
                    orderType : '订单类型',
                    orderStatus : '订单状态',
                    orderSource : '订单来源',
                    createTime : '订单创建时间',
                    payTime : '买家付款时间',
                    successTime : '交易成功时间',
                    payModel : '付款方式',
                    outOrderId : '外部订单号',
                    paymentOrderId : '支付流水号',
                    totalAmount : '商品金额合计',
                    fare : '运费',
                    totalDiscount : '店铺优惠合计',
                    totalShouldAmount : '应收订单金额',
                    actualPayAmount : '订单实付金额',
                    storeDiscountType : '店铺优惠方式',
                    goodsTitle : '全部商品名称',
                    goodsNum : '商品种类数',
                    deliveryType : '订单配送方式',
                    refundStatus : '订单退款状态',
                    alreadyRefundAmount : '订单已退款金额',
                    couponName : '优惠券码名称',
                    brand : '品牌',
                    lastUpdateTime : '最近更新时间'
                }
                break;
            case 'yzBill': //有赞微信账单
                tblHeaderConfig = {
                    batchNo : '批次号',
                    batchDate : '跑批时间',
                    transDatetime : '交易时间',
                    officalAccountId : '微信公众号id',
                    merchantId : '商户号',
                    subMerchantId : '特约商户号',
                    deviceId : '设备号',
                    wechatOrderId : '微信订单号',
                    merchantOrderId : '商户订单号',
                    buyerAccount : '用户标识',
                    transType : '交易类型',
                    transStatus : '交易状态',
                    bankName : '付款银行',
                    currency : '货币种类',
                    originalOrderAmount : '应结订单金额',
                    cashCouponAmount : '代金券金额',
                    weixinRefundId : '微信退款单号',
                    merchantRefundId : '商户退款单号',
                    refundAmount : '退款金额',
                    voucherRefundAmount : '充值券退款金额',
                    refundType : '退款类型',
                    refundStatus : '退款状态',
                    goodsTitle : '商品名称',
                    merchantData : '商品数据包',
                    serviceFee : '手续费',
                    rate : '费率',
                    orderAmount : '订单金额',
                    applyRefundAmount : '申请退款金额',
                    serviceFeeMemo : '费率备注',
                    brand : '品牌'
                }
                break;
            default:
                break;
        }
        return tblHeaderConfig;
    }
}