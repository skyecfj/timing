var contract = {
    activityMechanism: '',
    archiveElectronicDocNo: '',
    conventionEndDate: null,
    conventionStartDate: null,
    expirationReminder: 7,
    mainBody: '',
    signDate: null,
    newContract: true
}
var guarantyDetails = {
    activityMasterId: 0,
    guarantyType: 1,
    reversible: false,
    guarantyDimension: 1,
    addGuarantySum: 0,
    dueDate: null,
    expirationReminder: null,
    longVocationAdd: false,
    guarantySum: 0,
    guarantyCompanyDTOS: null,
    guarantyRecordedDTOS: []
}
var guarantyLongVocationDetails = {
    activityMasterId: 0,
    addGuarantySum: 0,
    guarantySum: 0,
    guarantyType: null,
    guarantyDimension: 1,
    longVocationAdd: true,
    longVocation:'',
    delFlag:true,
}
var bankConfig = {
    payeeId: null,
    payeeName: null,
    mainPayeeThirdAccount: null,
    payeeBankId: null,
    payeeBankName: null
}
var accountDetails = {
    settlementType: 0,
    provideSettlementToThird: false,
    settlementPeriodType: 1,
    settlementPeriod: '',
    settlementDateType: 1,
    customerId: '',
    defaultCustomer: true,
    settlementMode: 1,
    rscCollection: true,
    paymentMethod: 1,
    paymentFileName: null,
    paymentFilePath: null,
    fileList: [],
    provideDateType:1,
    bankAccountDate: '',
    bohSettlementKeyDTOS: [Object.assign({}, {'keyValue': null, 'settlementColumn': 3})],
    alipayDate: '',
    paymentDimension: 3,
    innerSettlementDimension: 1,
    configItemId: [],
    bankConfigs: [Object.assign({}, bankConfig)],
    summary: '',
    addGuarantySum: true,
    guaranteedWarnThreshold: null,
    guaranteedWarnThresholdType: 2,
    sumAdvanceDays: '',
    guarantyLongVocation: Object.assign({}, guarantyLongVocationDetails),
    guarantyTypes: [Object.assign({}, guarantyLongVocationDetails)],
    guarantyDTOS: [Object.assign({}, guarantyDetails)],
}
var userInfo = [
    {
        type: '财务负责人',
        workType:1,
        userType:1,
        userNameOpt:[]
    }, {
        type: '活动负责人',
        workType:2,
        userType:1,
        userNameOpt:[]
    }, {
        type: '信用控制负责人',
        workType:3,
        userType:1,
        userNameOpt:[]
    }, {
        type: '门店配置联系人',
        workType:4,
        userType:1,
        userNameOpt:[]
    }, {
        type: '发票开具联系人',
        workType:5,
        userType:1,

    }, {
        type: '内部往来结算审批人',
        workType:6,
        userType:1,
        userNameOpt:[]
    }, {
        type: '加盟商开票数据收件人',
        workType:9,
        userType:1,
        userNameOpt:[]
    }, {
        type: '活动负责人',
        workType:2,
        userType:2,
        userNameOpt:[]
    }, {
        type: '账单推送异常联系人',
        workType:7,
        userType:2,
        userNameOpt:[]
    }, {
        type: '银行上账异常联系人',
        workType:8,
        userType:2,
        userNameOpt:[]
    }
]
var chargeFeeInit = {
    activityMasterId: 0,
    chargeType: null,
    handingChargeListColumn: 1,
    handingChargeListRule: 1,
    handingChargeMinAmount: null,
    handingChargePercent: '',
    handingChargeSeparateSettlement: true,
    invoiceType: 1,
    listHandingCharge: true,
}
var activityActualPeriod = {
    acturalStartDate: null,
    acturalEndDate: null,
    date: null
};
export {
    contract,
    activityActualPeriod,
    guarantyDetails,
    guarantyLongVocationDetails,
    bankConfig,
    accountDetails,
    userInfo,
    chargeFeeInit,
}
