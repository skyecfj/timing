/**
 * Created by xiaoxiaozhang on 16/7/2018.
 */
import ajaxHandle from './util';
import ip from './tempIp'
import {Message} from 'element-ui';

export default {
    //房东账单
    getLandlordList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/landlord-list/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadTemplate: (appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/landlord-list/download', {}, appType).then(res => {
            resolve(res.result, res.headers)
        }).catch(err => {
            reject && reject(err);
        })
    },
    importLandlord: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/landlord-list/upload', param).then(res => {
            resolve(res)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteLandlord: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/landlord-list/del', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //根据jedCode模糊查询法人公司
    getCompanyByJedCode: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/store-manual-entry/list-company' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBuNameList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/store-manual-entry/list-bu' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllSubjects: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/store-manual-entry/list-subject' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustsBykeyWord: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/store-manual-entry/list-customer' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBohAdjustTypeList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/store-manual-entry/list-adjust' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //餐厅手工分录
    generateStoreManualEntry: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.accountConfig_ip + '/store-manual-entry/generate-manual-entry', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadStoreManualAccountingAttach: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPost(ip.accountConfig_ip + '/store-manual-entry/download' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /*********************** 餐厅数据核对 *************************/
    //cashA表
    getCashAData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/casha/select-by-store' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    cashaReget: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/casha/casha-reget', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCashAData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/casha/delete-by-store' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashaAttachments: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/casha/select-attachment' + tt.replace(/\+/g, '%2B')).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashaExportActs: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/casha/exportAct' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCashaData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/casha/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCashaDetails: (param, appType, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPostFile(ip.store + '/casha/exportCashDetails' + tt,'',appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //BOH异常检查
    getTblFlexTh: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-special-adjustment/tablehead' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBohAbnormalList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-special-adjustment/list' + tt).then(res => {
            if(res.data.code === 200 || res.data.code === 404){
                resolve(res.data)
            }else{
                Message.error({
                    message:res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBohAbnormalList:(param,appType,resolve,reject)=>{
        ajaxHandle.ajaxPostFile(ip.store + '/boh-special-adjustment/export',param,appType).then(res=>{
            resolve(res.result,res.headers);
        }).catch(err=>{
            reject && reject(err);
        })
    },
    getBohAbnormalDetail: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-special-adjustment/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    setBohAbnormalReasonMulti: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/boh-special-adjustment/track-update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBohAbnormalDailyReport: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-special-adjustment/casha-diff-report' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doBohAbnormalAdjust: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/boh-special-adjustment/adjustment', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBohAbnormalAdjustDetail: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-special-adjustment/select-adjustment-dtl' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delBohAbnormalAsjustItem: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxDelete(ip.store + '/boh-special-adjustment/del' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //手工核对
    getSummurySideData: (searchUrl, param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + searchUrl + tt,'','notloading').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    singleDataAdjust: (adjustUrl, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/manual-check-statement/' + adjustUrl, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCheckedBOHdata: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/manual-check-statement/select-can-adjustment-boh-by-rootid' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doCashManualPreCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-check-statement/manual-precheck', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doManualCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-check-statement/manual-check', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doCancelCashCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-check-statement/cancel-check', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doNocashManualCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-nocasha-check/manual-checkspf', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doNocashManualPreCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-nocasha-check/manual-precheckspf', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doSingleAdjust: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-check-statement/adjustment', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doNocashCancelCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/manual-nocasha-check/cancel-check', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    selectCurrentAttachments: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPost(ip.store + '/manual-nocasha-check/selectAdjustActivity' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    aliBillUploadStart: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/upload-start' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    aliBillUploadFinish: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/alipay-bill/upload-finish', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doNonCashSingleAdjust: (requestPath, param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + requestPath, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getUptoBOHDataDialogGridData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/manual-nocasha-check/nobill/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    doUptoBOHData: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/manual-nocasha-check/nobill/save', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //现金未存行货少存行查询
    getExceptionCategory: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/getExceptionCategory' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMatchData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateMatchDataCategory: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/updateCategory' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateMatchDataRemark: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/updateRemark' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportMatchData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/download' + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    cashNotSavedIntoBankWarnMailSend: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/boh-no-upload/boh-upload-low', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    cashNotSavedIntoBankUpdateReasonMulti: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/match-check/batchUpdateCategory', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //BOH与第三方账单核对
    bohAndBillCheckList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-check/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    bohAndBillCheckDetail: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-check/detail' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllCheckDetailInOrders: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/order-check-result/select-all' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSingleCheckDetailInOrder: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/order-check-result/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportOrderCheckDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/order-check-result/download', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCheckAttachMent: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxDelete(ip.store + '/file-upload/delete' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAdjustTypeByBohKeyworld: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/list-by-itemcode' + tt.replace(/\+/g, '%2B')).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveBohBillAdjust: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/boh-bill-check/save', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBohBillAdjust: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxDelete(ip.store + '/boh-bill-check/delete' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    thresholdCheck: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-check/threshold-check' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSubActivities: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-check/get-sub-act' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //非现金活动BOH和第三方账单核对
    getNoncashBohandBillList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-result/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    reprocessRefund: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-data-sync/reprocessRefund' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    billtozero: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-result/billtozero' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveNoncashBohandBillAdjustRemark: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/boh-bill-result/update-remark' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportOrDownloadNoncashBohandBillCheckDetail: (requestUrl,param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + requestUrl, param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    /*********************** third sales promotion*************************/
    // 结算报告列表查询
    getBalanceList: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-sales-promotion/select-by-business-type' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGenerateFile: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-sales-promotion/generate-file-by-id' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downBalanceList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/third-sales-promotion/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exoprtBalanceList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/cash-deposit/down-detail'+ param,'', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBondAdditionalRep : (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/cash-deposit/delete-by-uuid-code' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportActivitySettlementRepo : (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/settlement_statistics/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReportDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-sales-promotion/select-detail-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getChargeAmount: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/handle-charge/get-handle-charge-amount' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendEmail: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-sales-promotion/send-mail', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandSelect: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-brand' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdSelect: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-third-bill' + pathParams, {}, true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreType: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-store-type' + pathParams, {}, true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDeliveryStoreCode: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip+ '/third-bill/select-delivery-store-code'+ pathParams, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivitySelect: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-activity' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getdepositActivitySelect: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/cash-deposit/select-activity').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashHolidayYear: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-cash-holiday-year').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashHoliday: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-cash-holiday' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-activity-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillingUnit: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-billing-unit').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompany: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-company').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBusinessMarket: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-business-market').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-coupon-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponStatus: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-coupon-status').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFinanceMarket: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-finance-market').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStore: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-store').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBalanceList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/inside/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 第三方
    delThirdBillList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/third-bill/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updatebalanceStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/third-bill/update-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-bill/select-bill-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreBillDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-bill/select-store-bill-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyBillDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-bill/select-company-bill-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getUnitBillDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-bill/select-unit-bill-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delBillDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/third-bill/delete-bill-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleThirdReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/third-bill/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdEmailDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/third-bill/get-mail-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    testThirdReport: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/third-bill/test').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBillAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/third-bill/update-balance-amount' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillSalesAmount: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/third-bill/get-third-bill-amount' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 百胜电子券
    delCouponList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/coupon/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCouponStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/coupon/update-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleCouponReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon/select-coupon-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreCouponDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon/select-store-coupon-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyCouponDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon/select-company-bill-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getUnitCouponDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon/select-unit-coupon-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delCouponDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/coupon/delete-coupon-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delCouponHistoryDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/coupon/delete-history-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponEmailDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/coupon/get-mail-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    testCouponReport: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/coupon/test').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/coupon/update-balance-amount' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponSalesAmount: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/coupon/get-coupon-sales-amount' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 内部往来
    applyList: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/apply-by-id' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    replyList: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/check-by-id' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delIntrabranchList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/inside/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleInsideReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getIntrabranchInfo: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/select-inside-by-id' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getIntrabranchDetail: (pathParam,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/select-inside-detail' + pathParam,).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInsideEmailDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/get-mail-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendInsideEmail: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/inside/send-mail', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDownFilePath: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/inside/getDownFilePath' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //
    getFranchiseeList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip  + '/common/get-store-attribute' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    setFranchiseeBlackList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/common/update-store-attribute', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 手续费
    handleChargeReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/handle-charge/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateChargeStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/handle-charge/update-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delChargeList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/handle-charge/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getChargeDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/handle-charge/select-handle-charge-store-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getOrderDetailThird: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/handle-charge/select-handle-charge-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getChargeEmailDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/handle-charge/get-mail-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 应开发票
    getInvoiceList: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/select' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delInvoiceList: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/invoices/delete-bill-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInvoiceInfo: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/invoices/select-by-id' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInvoiceDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/select-detail-by-id' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveDCDMcode: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/save-dcdmcode' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleInvoiceReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    confirmInvoice: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/confirm-settlement' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInvoiceMailDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/get-mail-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFranchiseeMailDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/get-mail-detail-for-franchisee-recipient' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInvoiceMailModel: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/invoices/get-mail-model-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动结算
    getSettlementList: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/settlement_statistics/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleSettlementReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/settlement_statistics/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动销售
    getSaleList: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/sale-statistics/select-list' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动销售详情
    getSaleListDetail: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/sale-statistics/select-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteSaleData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxDelete(ip.third_sales_ip + '/sale-statistics/delete' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleSaleReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/sale-statistics/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动日结算峰值
    getDayPeakStatistics: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/day-peak-statistics/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downDayPeakReport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/day-peak-statistics/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleDayPeakReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/day-peak-statistics/handle-report' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 百胜电子券码报告
    getCouponDetailReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon-detail/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCouponDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/coupon-detail/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 微信账单
    getWechatReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/wechat/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportWechatDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/wechat/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 支付宝账单
    getAliPayReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/ali/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportAliPayDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/ali/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 百胜电子券码报告-餐厅
    getStoreCouponReport: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/coupon-detail/select-by-store' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportStoreCouponDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/coupon-detail/down-file-store', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 餐厅百胜卡售卖
    getStoreSales: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/store-sales/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportStoreSales: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/store-sales/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 餐厅百胜卡核销
     getStoreTrans: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/store-trans/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportStoreTrans: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/store-trans/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 长假保证金额追加报告
    getCashDeposit: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/cash-deposit/select' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashDepositList: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/cash-deposit/select-detail' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    handleBondReport: (param,resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/cash-deposit/handle-report' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashDepositDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/cash-deposit/select-detail-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCashDeposit: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.third_sales_ip + '/cash-deposit/update' , param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动预警报告-金额预警
    getAmountWarning: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/activity-warn/select-activity-warn' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportAmountWarning: (param, appType, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/activity-warn/down-file' + tt,'', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 活动预警报告-效期预警
    getEffectiveWarning: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.third_sales_ip + '/expiration-warn/select-expiration-activity' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportEffectiveWarning: (param, appType, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/expiration-warn/down-file' + tt, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    /***********************third sales promotion *************************/

    /*********************** data manage *************************/
    getThirdBillListStoreDay: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_bill_data_process/listStoreDay', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillListBill: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_bill_data_process/listBillData', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportThirdBillStoreDay: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/third_bill_data_process/storeDayExport', param, appType).then(res => {
            resolve(res.result, res.headers)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportThirdBill: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/third_bill_data_process/exportBill', param, appType).then(res => {
            resolve(res.result, res.headers)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteThirdBill: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/third_bill_data_process/deleteBill', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteThirdBillStoreDay: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/third_bill_data_process/deleteStoreDayBill', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /*********************** data manage*************************/
    // getShouldPayFeeList: (param, resolve, reject) => {
    //     var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
    //     ajaxHandle.ajaxGet(ip.store + '/payable_invoice/select' + tt).then(res => {
    //         resolve(res.data)
    //     }).catch(err => {
    //         reject && reject(err);
    //     })
    // },
    // exportShouldPayFee: (param, appType, resolve, reject) => {
    //     ajaxHandle.ajaxPostFile(ip.store + '/payable_invoice/exportPayableInvoiceExcel', param, appType).then(res => {
    //         resolve(res.result, res.headers)
    //     }).catch(err => {
    //         reject && reject(err);
    //     })
    // },
    //押运清单
    getEscortInventoryList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/escort_list/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadEscortInventoryTemplate: (appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/escort_list/download', {}, appType).then(res => {
            resolve(res.result, res.headers)
        }).catch(err => {
            reject && reject(err);
        })
    },
    importEscortInventory: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/escort_list/upload', param).then(res => {
            resolve(res)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteEscortInventory: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/escort_list/del', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //银行流水数据管理
    getBankStatementList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/bank-statement/select' + tt).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadBankStatementTemplate: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/bank-statement/download', param, appType).then(res => {
            // resolve(res.result,res.headers)
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBankStatement: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/bank-statement/del', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBankStatementDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/bank-statement/del-detail', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankStatementDetail: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/bank-statement/select-detail' + tt).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankStatementDetailNoLoading: (param, loading, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/not-upload/select-detail' + tt, {}, loading).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //手工退款数据管理
    getManualRefundList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/manual_refund_data_management/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadManualRefundTemplate: (appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/manual_refund_data_management/exportTemplate', {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteManualRefund: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/manual_refund_data_management/delete', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //我关注的活动
    getAllUserForActivity: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/user_activity/select' + tt).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllActivity: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/user_activity/selectActivity' + tt).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveMyActivity: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/user_activity/save', param).then(res => {
            if (res.data.code === 200) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //銀行流水应导入而未导入
    getAllNotImportedList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/bank-statement-import-statistics/select-un-import-data' + tt).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllNotImportedReason: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/bank-statement-import-statistics/select-un-save-bank-remark' + '?t=' + Date.now()).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadNotImportedTemplate: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/bank-statement-import-statistics/download' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteNotImported: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/bank-statement-import-statistics/del' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: '删除成功！'
                })
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //第三方账单数据覆盖
    getThirdBillCoverList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_source_bill_repeat/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteThirdBillCover: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/third_source_bill_repeat/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillCoverDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/third_source_bill_repeat/getRepeatItems' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadThirdBillCoverTemplate: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/third_source_bill_repeat/export' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //第三方账单数据覆盖----有效验证
    getEfficientValidateList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_source_bill_dif/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteEfficientValidate: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/third_source_bill_dif/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadEfficientValidateTemplate: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/third_source_bill_dif/export' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //含税收入调整审核
    getAdjustVerifyList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/adjust_verify/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadAdjustVerifyList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/adjust_verify/download' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    passAdjustVerify: (requestPath,param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + requestPath, param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
            resolve();
        }).catch(err => {
            reject && reject(err);
        })
    },
    rejectAdjustVerify: (requestPath,param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + requestPath, param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
            resolve();
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAdjustVerifyDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/adjust_verify/getDetail' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //数据覆盖 确认覆盖
    sureToCoverBill: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/third_source_bill_repeat/confirmCover' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //第三方账单已导入 批量获取
    batchAcquire: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_bill_data_process/batchAcquisition', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getConfigNameAndId: (resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_bill_data_process/getThirdBillConfig', {}).then(res => {
            if (res.data.code !== 200 && res.data.code !== 404) {
                Message.error({
                    message: res.data.msg
                })
            } else {
                resolve(res.data);
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //BOH数据覆盖差异列表
    getBOHCashDiffMainList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/casha_diff_main/select' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHCashDiffMainDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/casha_diff_main/getDetailByMainId?cashaMainId=' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //BOH未上传及异常管理  ---1：未上传
    auditInNotUpload: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/audit', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    cancelRelatedCash: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/cancel-related-bank', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    relatedCash: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/related-bank', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    notUploadList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/not-upload/select' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    supplementSubmit: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/supplement', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    selectSupplementList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/not-upload/select-supplement' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    modifyReason: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/change-not-upload-reason', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    selectKeyName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/get-activity-boh-settlement-key-by-key-value' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    modifyRemark: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/not-upload/change-remark' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadNonCashBill: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/not-upload/get-bill-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //2. boh数据异常
    bohExceptionChangeRemark: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/boh-exception/change-remark' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    bohExceptionConfirm: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.store + '/boh-exception/confirm', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    bohExceptionEdit: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/boh-exception/edit' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    bohExceptionList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/boh-exception/select-exception-data' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },


    //3：不应导入但导入
    shouldNotButDoList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/import-should-not-import/select' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //第三方账单导入异常管理
    shouldImportedButNotList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    shouldImportedErrorList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/selectImportErrorData', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    shouldImportedExport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/should-improted-but-not/export', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    shouldImportedErrorExport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/should-improted-but-not/exportImportErrorData', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadIsNotTrade: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/upload', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    sureIsOrNotTrade: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/isNotTrade', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadShouldImportedButNot: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/should-improted-but-not/download' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //批量获取
    getCashaRegetById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/casha/reget-by-id' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //数据覆盖
    cashaCover: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/casha_diff_main/overwrite', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    cashaCoverDelete: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/casha_diff_main/delete', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //含税调整收入 获取附件
    getAttachment: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/adjust_verify/downloadSingle' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //银行流水明细的明细
    getDetailByBankDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/bank-statement/select-check-detail' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //查询补录数据
    getCashaConfig: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/not-upload/select-casha-config').then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //批量发送邮件
    batchSendEmail: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/boh-no-upload/batch-send-mail', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    bohUploadLow: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/boh-no-upload/boh-upload-low', param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                });
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //获取登陆者特殊权限
    //审核权限id:1，手工账务审核；2，BOH未上传原因审核；3，BOH补录审核
    getOtherPermission: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-audit-by-login_user').then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //boh 三个下载按钮
    downloadNotUpload: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/not-upload/download', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadException: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/boh-exception/download', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadShouldButNot: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/import-should-not-import/download', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //导出退回原因
    downloadRejectReason: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/not-upload/download-reject' + param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //银行流水列表页下载
    downloadAll: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/bank-statement/download-all', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },

    //银行流水导入月报告
    bankStatementReportList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/bank-statement/select', param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    bankStatementReportDownload: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/bank-statement/export', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //总账冲销码列表
    getGeneralOffCodeList: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-general_ledger_code').then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //报表
    getNotSaveButDo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/match-check/select' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadNotSaveButDo: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/download'+param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDelayList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/match-check/selectDelayChecked' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadDelay: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/downloadDelayChecked'+param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRevenue: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/match-check/selectAdjustRevenue' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadRevenue: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/downloadCashaRevenue', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getLossGainList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/match-check/selectAdjustLossGain' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadLossGain: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/downloadCashaLossGain', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillReportMonth: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/thirdBillImportReport/select' , param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadThirdBillReportMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/thirdBillImportReport/export', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardVerificationList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-trans-month/list-card-trans-new' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 折扣明细报表
    getDiscountDetailReport: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/income-report/select-distinct-income' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportDiscountDetailReport: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/income-report/download-distinct-income', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 其他业务收入明细报表
    getOtherIncomDetailDetailReport: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/income-report/select-other-income' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportOtherIncomDetailDetailReport: (param, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/income-report/download-other-income', param).then(res => {
            resolve(res.result)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 账单异常检查报表（0.5%）
    getBillAbnormalCheckDetailReport: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/selectBillExceptionRulel' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBillAbnormalCheckDetailReport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/downloadBillExceptionRulel', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 账单异常检查报表（20%）
    getBillAbnormalCheckDetailReport20: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/match-check/billExceptionCheckReport' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBillAbnormalCheckDetailReport20: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/match-check/billExceptionCheckReport', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadSaveLineFrequency: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/store-master/exportStoreDepositDate'+param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSaveLineFrequencyList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/store-master/storeDepositDate' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadHallMasterExport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/store-master/exportStoreReport', param, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getHallMasterExportList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/store-master/getStoreReport' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getHallMasterExportItems: ( resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/store-master/getExportStoreReportField' ).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadHallMasterModified: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/data-log/export-store-log'+param, {}, appType).then(res => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //标准账单
    selectThirdBillList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/standard-bill/list' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadStandardBill: (param,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/standard-bill/export' +param,{}).then((res,header) => {
            if (res.result.code === 200) {
                Message.success({
                    message: res.result.data
                })
            } else {
                Message.error({
                    message: res.result.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadStandardOrder: (param,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/standard-bill/export-order' +param,{}).then((res,header) => {
            if (res.result.code === 200) {
                Message.success({
                    message: res.result.data
                })
            } else {
                Message.error({
                    message: res.result.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //支付宝当面付
    alipayBillReport: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/get-face-pay-bill' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    alipayBillDelete: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/alipay-bill/delete-coupon-activity' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    alipayBillList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/get-coupon-activity-list' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadAlipayBill: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/alipay-bill/download-coupon-activity-file' + param,{},appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //bbc7张报表
    verificationCouponCodeList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vgold-coupon-consume/list-vgold-coupon' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadVerificationCouponCode: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vgold-coupon-consume/export' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    verificationCouponCodeResList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vgold-coupon-consume/list-vgold-coupon-res' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadVerificationCouponCodeRes: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vgold-coupon-consume/export-res' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //卡片余额核对
    cardBalanceCheckList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-balance-check/list-card-balance-check' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCardBalanceCheck: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-balance-check/export' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //按季度按月度
    integralGenerateListMonth: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vgold-earned/list-earned-month' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadIntegralGenerateMonth: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vgold-earned/export-month' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    integralGenerateListSeason: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vgold-earned/list-earned-quarter' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadIntegralGenerateSeason: (param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vgold-earned/export-quarter' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //券余额核对
    couponAmountBalance: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-balance/list-vdm-check' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCouponAmountBalance:(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-balance/export' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //主券核销次数与子券核销记录不一致报表c
    couponRecordInconformityList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-detail-diff/select-all' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadCouponRecordInconformity: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-detail-diff/export', param, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //券余额核对按积分
    couponBalanceIntegralList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-balance/list-vdm-check-inte' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCouponBalanceIntegral: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-balance/export-inte', param, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //核销报告差异明细
    cardConsumeDiffDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-consume-diff/list-card-consume-diff' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCardConsumeDiffDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-consume-diff/export', param, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //百胜卡售卖核对报表
    fscCardsSaleCheckList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/agg-res-sales/report-list' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadFscCardsSaleCheck: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/agg-res-sales/report-export'+param, {}, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //支付宝当面付对账报表
    alipayFaceToPayAccountCheckList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/get-face-pay-bill' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadAlipayFaceToPayAccountCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/alipay-bill/export-ali-bill'+ param,).then((res) => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadAlipayFaceToPayCoupon: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/alipay-bill/download-coupon-activity-file'+param, {}, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    alipayFaceToPayCouponList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/get-coupon-activity-list' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    delAlipayCoupon: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/alipay-bill/delete-coupon-activity' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    smallPaperInventoryList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.data_center + '/b2b-card-info/get-data' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //boh未上传 按钮  检查数据 并更新列表数据
    checkDataAndUpdate: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/boh-data-sync/recheckUnopenData' + param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //破月清单
    breakMonthList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/break-month/view-data' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadbreakMonthList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.accountConfig_ip + '/break-month/download'+param, {}, appType).then((res, header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //支付宝流水账务查询
    alipayAccountList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/alipay-bill/select' + param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //支付宝流水账务查询
    downloadAlipayAccount: (param, resolve, reject) => {
      ajaxHandle.ajaxPost(ip.store + '/alipay-bill/download'+param).then((res, header) => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //boh 数据异常批量发送邮件
    batchSendEmailNotUpload: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/boh-no-upload/batch-send-cash-diff',param).then((res, header) => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    tempToStandard: (resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/third_bill_convertion/tempToStandard').then((res, header) => {
            if (res.data.code === 200) {
                Message.success({
                    message: '处理成功！'//只会返回true或者报错
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadSinglebill  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/third_bill_data_process/down-source-bill'+param ,{},appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    selectImportErrorDetail: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/select-import-error-detail',param).then((res) => {
            if (res.data.code === 200 || res.data.code === 404) {
                 resolve(res.data)
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadImportErrorDetail  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/should-improted-but-not/exportImportErrorData' ,param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateMemo: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not/updateMemo'+param).then((res) => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateReexport: ( resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/should-improted-but-not/updateSupplemented' ).then(res => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }1
        }).catch(err => {
            reject && reject(err);
        })
    },
    selectFiles: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/file-upload/select'+param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    pennyCardCheckList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/penny-card-check/list-penny-card-check'+param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadPennyCardCheck  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/penny-card-check/export',param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateRemarkCashDelay: (param,resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/match-check/updateDelayRemark'+param).then((res) => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getShouldPayFeeAllList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/payable_invoice/select-invoice-total',param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getShouldPayFeeDetailList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/payable_invoice/select-invoice-detail',param).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadPayFeeHeader  : (appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/payable_invoice/down-detail-header',{},appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    deletePayableInvoice: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/payable_invoice/batch-delete',param).then((res) => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                })
                resolve();
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadPayFeeDetail  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/payable_invoice/down-detail',param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downChinaUnionPay: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/agg-bank-card-res/export',param).then(res => {
            if (res.data.code === 200) {
                Message.success({
                    message: res.data.data
                })
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getChinaUnionPayList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/agg-bank-card-res/select',param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPrimeDataList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/prime/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadPrimeData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/prime/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayBillByStoreDataList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/ali/select-store' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadAlipayBillByStoreData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/ali/down-store-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getWeChatBillByStoreDataList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/wechat/select-ras' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadWeChatBillByStoreData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.third_sales_ip + '/wechat/down-ras-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillNotCheckOntimeData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.store + '/manual-nocasha-check/select-not-in-check' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadBillNotCheckOntimeData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/manual-nocasha-check/down-not-in-check', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getHandleServiceFeeData: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/handing-service-fee-report/list', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downLoadHandleServiceFeeData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/handing-service-fee-report/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadPayFeeAll  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/payable_invoice/down-invoice-total',param,appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadRebackedByMaster  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/adjust_verify/down-adjust-reject-report'+param,{},appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRebackedByMaster: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/adjust_verify/get-adjust-reject-report'+param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCashaDifferResult  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/casha_result_report/export',param, appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashaDifferResult: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/casha_result_report/select'+param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadRefundDataList  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/bc_refund_report/export',param, appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRefundDataList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/bc_refund_report/select',param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadImportedNotInTime  :(param, appType,resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/should-improted-but-not-report/export',param, appType).then((res,header) => {
            if (res.result.code) {
                Message.error({
                    message: res.result.msg
                })
            } else {
                resolve(res.result, res.headers)
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getImportedNotInTime: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.store + '/should-improted-but-not-report/list',param).then(res => {
            if (res.data.code === 200 || res.data.code === 404 ) {
                resolve(res.data);
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
}
