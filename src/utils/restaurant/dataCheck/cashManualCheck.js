export default{
  tabObj : {
    casha : 'BOH数据',
    escortsummary : '押运清单',
    bank : '银行流水',
    escort : '押运清单',
    landlord : '房东清单'
  },
  manualCheckType : {
    cashabank     : '1',
    cashaescort   : '2',
    cashalandlord : '3',
    escortsummarybank : '4'
  },
  cancelCheckKey : {
    cashabank     : '1',
    cashaescort   : '2',
    cashalandlord : '3',
    escortsummarybank : '4'
  },
  manualAccountingType : {
    casha : 5,
    escortsummary : 4,
    bank : 1,
    escort : 2,
    landlord : 3
  },
  checkSummeryDataKey : {
    cashabank     : 'unSplitCashaViews', 
    cashaescort   : 'unSplitCashaViews',
    cashalandlord : 'unSplitCashaViews',
    escortsummarybank : 'unSplitEscortSumViews'
  },
  checkSingleDataKey : {
    cashabank     : 'unSplitBankStatementViews',
    cashaescort   : 'unSplitEscortViews',
    cashalandlord : 'unSplitLandLordViews',
    escortsummarybank : 'unSplitBankStatementViews'
  },
  cancelCheckSummuryDataKey : {
    cashabank     : 'selectBohIds',
    cashaescort   : 'selectBohIds',
    cashalandlord : 'selectBohIds',
    escortsummarybank : 'selectEscortSummaryIds'
  },
  cancelCheckSingleDataKey : {
    cashabank     : 'selectBankIds',
    cashaescort   : 'selectEscortIds',
    cashalandlord : 'selectLandlordIds',
    escortsummarybank : 'selectBankIds'
  },
  refreshCheckedDataIdsKey :{
    casha : 'selectCashaDetailIds',
    escortsummary : 'selectEscortSummaryIds',
    bank : 'selectBankStatementIds',
    escort : 'selectEscortIds',
    landlord : 'selectLandlordIds'
  },
  bankCheckIdsKey :{
    casha : 'selectCashaIds',
    escortsummary : 'selectEscortSummaryIds'
  },
  adjustmentType:{
    casha  : '1',
    escort : '4',
    landlord : '5',
    escortsummary : '6'
  },
  tblSearchKeyWord:{
    //银行流水
    bank : 'bankJdeCode',
    //BOH数据
    casha : 'storeCodeOrName',
    //押运清单right
    escort : 'storeCode',
    //押运清单left
    escortsummary : 'bankJdeCode',
    //房东清单
    landlord : 'storeCode'
  },
  unCkeckedDataRefresSinhKey : {
    cashabank     : 'bankJdeCode',
    cashaescort   : 'storeCode',
    cashalandlord : 'storeCode',
    escortsummarybank : 'bankJdeCode'
  },
  unCkeckedDataRefresSumhKey : {
    cashabank     : 'bankJdeCode',
    cashaescort   : 'storeCodeOrName',
    cashalandlord : 'storeCodeOrName',
    escortsummarybank : 'bankJdeCode'
  },
  checkedRefreshKeyConfig : {
    self : {
      bank   : 'selectBankStatementIds',
      casha  : 'selectCashaDetailIds',
      escort : 'selectEscortIds',
      escortsummary : 'selectEscortSummaryIds',
      landlord : 'selectLandlordIds'
    },
    notSelf : {
      casha  : 'selectCashaIds',
      escortsummary : 'selectEscortSummaryIds',
    }
  },
  invertRefreshKeyConfig : {
    self : {
      bank   : 'invertBankStatementIds',
      casha  : 'invertCashaDetailIds',
      escort : 'invertEscortIds',
      escortsummary : 'invertEscortSummaryIds',
      landlord : 'invertLandlordIds'
    },
    notSelf : {
      casha : 'invertCashaIds',
      escortsummary : 'insertEscortSummaryIds'
    }
  },
  tblColumns:{
    //银行流水
    bank : {
      labels : ['上账日期','金额','JDE号','对方收/付款单位','摘要','财智卡号'],
      props  : ['bookDate','amount','bankJdeCode','paymentAccountName','comment','cardNumber'],
      iconColumn : '金额',
      sumProp : 'amount',
      storageType : '1',
      amountMaxKey: 'creditAmountMax'
    },
    //BOH数据
    casha : {
      labels : ['应存行日期','营业日期','餐厅编号','默认银行JDE号','金额','实存行','差异原因'],
      props  : ['savingDate','bizDate','storeCode','bankJdeCode','amount','realSaveAmount','unSaveBankReason'],
      iconColumn : '金额',
      sumProp : 'amount'
    },
    //押运清单right
    escort : {
      labels : ['营业日期','金额','餐厅编号','押运公司'],
      props  : ['bizDate','amount','storeCode','escortCompany'],
      iconColumn : '金额',
      sumProp : 'amount',
      storageType : '2',
      amountMaxKey: 'amountMax'
    },
    //押运清单left
    escortsummary : {
      labels : ['存行日期','金额','银行JDE号','押运公司'],
      props  : ['savingDate','amount','bankJdeCode','escortCompany'],
      iconColumn : '金额',
      sumProp : 'amount'
    },
    //房东清单
    landlord : {
      labels : ['营业日期','金额','餐厅编号'],
      props  : ['bizDate','amount','storeCode'],
      iconColumn : '金额',
      sumProp : 'amount',
      storageType : '3',
      amountMaxKey: 'amountMax'
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
      cardNumber      : '',
      notspfFlag      : '',
      modiferUser     : '',
      checkStatus     : '' //required
    },
    //BOH数据
    casha : {
      savingDate : '',
      bizDate    : '',
      storeCodeOrName   : '',
      bankJdeCode       : '',
      amountMax         : '',
      amountMin         : '',
      realSaveAmountMax : '',
      realSaveAmountMin : '',
      differenceReason  : '',
      notspfFlag        : '',
      modiferUser       : '',
      checkStatus       : '',//required
      storageType       : '',//required
    },
    //押运清单right
    escort : {
      bizDate       : '',
      storeCode     : '',
      amountMax     : '',
      amountMin     : '',
      escortCompany : '',
      notspfFlag    : '',
      modiferUser   : '',
      checkStatus   : '' //required
    },
    //押运清单left
    escortsummary : {
      savingDate    : '',
      amountMax     : '',
      amountMin     : '',
      bankJdeCode   : '',
      escortCompany : '',
      notspfFlag    : '',
      modiferUser   : '',
      checkStatus   : '',//required
    },
    //房东清单
    landlord : {
      bizDate     : '',
      storeCode   : '',
      amountMax   : '',
      amountMin   : '',
      notspfFlag  : '',
      modiferUser : '',
      checkStatus : '' //required
    }
  },
  needCondense : {
    casha : true,
    escortsummary : false,
    bank : true,
    escort : false,
    landlord : false
  },
  tblSearchConfigs:{
    //银行流水
    bank : [{
      prop : ['bookDate'],
      type : 'date',
      unCheckWidth : '118px',
      checkedWidth : '118px',
      //unCheckedMin : '1680'
    },{
      prop : ['creditAmountMin','creditAmountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      //unCheckedMin : '1680'
    },{
      prop : ['bankJdeCode'],
      type : 'input',
      unCheckWidth : '100px',
      checkedWidth : '100px',
      //unCheckedMin : '1680'
    },{
      prop : ['paymentAccountName'],
      type : 'input',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      //unCheckedMin : '1620'
    },{
      prop : ['comment'],
      type : 'input',
      unCheckWidth : '110px',
      checkedWidth : '110px',
      //unCheckedMin : '1620'
    },{
      prop : ['cardNumber'],
      type : 'input',
      unCheckWidth : '110px',
      checkedWidth : '110px',
      //unCheckedMin : '1620'
    }],
    //BOH数据
    casha : [{
      prop : ['savingDate'],
      type : 'date',
      unCheckWidth : '118px',
      checkedWidth : '118px',
      checkedMin : '1620'
    },{
      prop : ['bizDate'],
      type : 'date',
      unCheckWidth : '118px',
      checkedWidth : '118px',
      checkedMin : '1620'
    },{
      prop : ['storeCodeOrName'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      checkedMin : '1620'
    },{
      prop : ['bankJdeCode'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      checkedMin : '1620'
    },{
      prop : ['amountMin','amountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      checkedMin : '1620'
    },{
      prop : ['realSaveAmountMin','realSaveAmountMax'],
      type : 'rangeInput',
      unCheckWidth : '115px',
      checkedWidth : '115px',
      checkedMin : '1620'
    },{
      prop : ['differenceReason'],
      type : 'input',
      unCheckWidth : '85px',
      checkedWidth : '85px',
      checkedMin : '1620'
    }],
    //押运清单right
    escort : [{
      prop : ['bizDate'],
      type : 'date',
      unCheckWidth : null,
      checkedWidth : '118px',
      unCheckedMin : '1450'
    },{
      prop : ['amountMin','amountMax'],
      type : 'rangeInput',
      unCheckWidth : null,
      checkedWidth : '115px',
      unCheckedMin : '1450'
    },{
      prop : ['storeCode'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : '85px',
      unCheckedMin : '1450'
    },{
      prop : ['escortCompany'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : '110px',
      unCheckedMin : '1450'
    }],
    //押运清单left
    escortsummary : [{
      prop : ['savingDate'],
      type : 'date',
      unCheckWidth : null,
      checkedWidth : '118px',
      checkedMin : '1450'
    },{
      prop : ['amountMin','amountMax'],
      type : 'rangeInput',
      unCheckWidth : null,
      checkedWidth : '115px',
      checkedMin : '1450'
    },{
      prop : ['bankJdeCode'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : '85px',
      checkedMin : '1450'
    },{
      prop : ['escortCompany'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : '85px',
      checkedMin : '1450'
    }],
    //房东清单
    landlord : [{
      prop : ['bizDate'],
      type : 'date',
      unCheckWidth : null,
      checkedWidth : null
    },{
      prop : ['amountMin','amountMax'],
      type : 'rangeInput',
      unCheckWidth : null,
      checkedWidth : null
    },{
      prop : ['storeCode'],
      type : 'input',
      unCheckWidth : null,
      checkedWidth : null
    }]
  }
}