export default{
  tabObj : {
    thirdBill  : '账单数据',
    alipay_sum : '支付宝流水',
    bank       : '银行流水',
    alipay_sin : '支付宝流水',
    ar         : '账单未体现AR'
  },
  manualCheckType : {
    thirdBillbank   : '1',
    thirdBillalipay_sin : '2',
    alipay_sumbank : '3',
    arbank : '4'
  },
  cancelCheckKey : {
    thirdBillbank   : '1',
    thirdBillalipay_sin : '2',
    alipay_sumbank : '3',
    arbank : '4'
  },
  manualAccountingType : {
    thirdBill : 7,
    alipay_sum : 9,
    bank : 1,
    alipay_sin : 9,
    ar : 8
  },
  singleAdjustRequestPath:{
    thirdBill : '/manual-nocasha-check/adjustment-summary',
    bank : '/manual-nocasha-check/adjustment-bank',
    alipay : '/manual-nocasha-check/adjustment-alipay'
  },
  uploadSource : {
    thirdBill : 'thirdBill',
    alipay : 'alipay',
    bank : 'bohExceptionCheck',
    ar : 'checkResult'
  },
  checkSummeryDataKey : {
    thirdBillbank       : 'unSplitBillViews',
    thirdBillalipay_sin : 'unSplitBillViews',
    alipay_sumbank    : 'unSplitAlipayViews',
    arbank : 'unSplitARBillViews'
  },
  checkSingleDataKey : {
    thirdBillbank         : 'unSplitBankStatementViews',
    thirdBillalipay_sin   : 'unSplitAlipayViews',
    alipay_sumbank    : 'unSplitBankStatementViews',
    arbank : 'unSplitBankStatementViews'
  },
  cancelCheckSummuryDataKey : {
    thirdBillbank       : 'selectThirdBillIds',
    thirdBillalipay_sin : 'selectThirdBillIds',
    alipay_sumbank      : 'selectAlipayIds',
    arbank : 'selectAlipayIds'
  },
  cancelCheckSingleDataKey : {
    thirdBillbank       : 'selectBankIds',
    thirdBillalipay_sin : 'selectAlipayIds',
    alipay_sumbank      : 'selectBankIds',
    arbank : 'selectBankIds'
  },
  refreshCheckedDataIdsKey :{
    thirdBill  : {
      self   : 'thirdBillIds',
      bank   : 'bankStatementIds',
      alipay : 'alipayIds'
    },
    alipay : {
      self : 'selectAlipayIds',
      bank : 'selectBankIds',
      thirdBill : 'selectThirdBillIds'
    },
    bank : {
      self      : 'selectBankStatementIds',
      thirdBill : 'selectBillIds',
      alipay    : 'selectAlipayIds',
      ar        : 'selectBillIds'
    },
    ar : {
      self   : 'thirdBillIds',
      bank   : 'bankStatementIds',
      alipay : 'alipayIds'
    }
  },
  bankCheckIdsKey :{
    casha : 'selectCashaIds',
    escortsummary : 'selectEscortSummaryIds'
  },
  // adjustmentType:{
  //   casha  : '1',
  //   escort : '4',
  //   landlord : '5',
  //   escortsummary : '6'
  // },
  needCondense : {
    bank : true,
    thirdBill : true,
    alipay : false,
    ar : true
  },
  tblColumns:{
    //银行流水
    bank : {
      labels : ['上账日期','金额','JDE号','对方收/付款单位','摘要','拆分理由'],
      props  : ['bookDate','amount','bankJdeCode','paymentAccountName','comment','splitReason'],
      iconColumn : '金额',
      sumProp : 'amount',
      storageType : '1',
      amountMaxKey: 'creditAmountMax'
    },
    //账单数据
    thirdBill : {
      labels : ['活动名称','营业日期','法人公司','开票单位','金额','客户名称','拆分理由'],
      props  : ['activityName','bizDate','company','billUnit','amount','customerName','splitReason'],
      iconColumn : '金额',
      sumProp : 'amount'
    },
    //支付宝左侧
    alipay : {
      labels : ['上账日期','支付宝账号','金额','拆分理由'],
      props  : ['chargeDate','alipayAccount','amount','splitReason'],
      iconColumn : '金额',
      sumProp : 'amount',
      amountMaxKey: 'creditAmountMax'
    },
    //账单未体现AR
    ar : {
      labels : ['活动名称','营业日期','法人公司','开票单位','金额','客户名称','拆分理由'],
      props  : ['activityName','bizDate','company','billUnit','amount','customerName','splitReason'],
      iconColumn : '金额',
      sumProp : 'amount'
    },
    //房东清单
    landlord : {
      labels : ['营业日期','金额','餐厅编号'],
      props  : ['bizDate','amount','storeCode'],
      iconColumn : '金额',
      sumProp : 'amount',
      storageType : '3'
    }
  },
  tblSearchDtos:{
    //银行流水
    bank : {
      bookDate : '',
      creditAmountMax    : '',
      creditAmountMin    : '',
      bankJdeCode        : '',
      paymentAccountName : '',
      comment         : '',
      notspfFlag      : '',
      splitReason     : '',
      checkStatus     : '' //required
    },
    //账单数据
    thirdBill : {
      activityName : '',
      bizDate      : '',
      company      : '',
      billUnit     : '',
      creditAmountMax : '',
      creditAmountMin : '',
      customerName    : '',
      notspfFlag      : '',
      splitReason     : '',
      checkStatus     : '',//required
      checkType       : '',//required
    },
    //支付宝左侧
    alipay : {
      chargeDate      : '',
      alipayAccount   : '',
      creditAmountMin : '',
      creditAmountMax : '',
      notspfFlag  : '',
      checkStatus : '' //required
    },
    //账单未体现AR
    ar : {
      activityName : '',
      bizDate      : '',
      company      : '',
      billUnit     : '',
      creditAmountMax : '',
      creditAmountMin : '',
      customerName    : '',
      notspfFlag      : '',
      splitReason     : '',
      checkStatus     : '',//required
      checkType       : '' //required
    },
    //房东清单
    landlord : {
      bizDate     : '',
      storeCode   : '',
      amountMax   : '',
      amountMin   : '',
      notspfFlag  : '',
      checkStatus : '' //required
    }
  },
  tblSearchConfigs:{
    //银行流水
    bank : [{
      prop : ['bookDate'],
      type : 'date',
      unCheckWidth : '120px',
      checkedWidth : '120px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['creditAmountMin','creditAmountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['bankJdeCode'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['paymentAccountName'],
      type : 'input',
      unCheckWidth : '95px',
      checkedWidth : '95px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['comment'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['splitReason'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    }],
    //账单数据
    thirdBill : [{
      prop : ['activityName'],
      type : 'input',
      unCheckWidth : '95px',
      checkedWidth : '85px',
      unCheckedMin : '1620'
    },{
      prop : ['bizDate'],
      type : 'date',
      unCheckWidth : '120px',
      checkedWidth : '120px',
      unCheckedMin : '1620'
    },{
      prop : ['company'],
      type : 'input',
      unCheckWidth : '95px',
      checkedWidth : '85px',
      unCheckedMin : '1620'
    },{
      prop : ['billUnit'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620'
    },{
      prop : ['creditAmountMin','creditAmountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      unCheckedMin : '1620'
    },{
      prop : ['customerName'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620'
    },{
      prop : ['splitReason'],
      type : 'input',
      unCheckWidth : '95px',
      checkedWidth : '95px',
      unCheckedMin : '1620'
    }],
    //支付宝左侧
    alipay : [{
      prop : ['chargeDate'],
      type : 'date',
      unCheckWidth : null,
      checkedWidth : null
    },{
      prop : ['alipayAccount'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : null
    },{
      prop : ['creditAmountMin','creditAmountMax'],
      type : 'rangeInput',
      unCheckWidth : null,
      checkedWidth : null
    },{
      prop : ['splitReason'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : null
    }],
    //押运清单left
    ar : [{
      prop : ['activityName'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['bizDate'],
      type : 'date',
      unCheckWidth : '120px',
      checkedWidth : '120px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['company'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['billUnit'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['creditAmountMin','creditAmountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['customerName'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    },{
      prop : ['splitReason'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      unCheckedMin : '1620',
      checkedMin : '1620'
    }]
  }
}