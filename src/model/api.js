/**
 * Created by xiaoxiaozhang on 16/7/2018.
 */
import ajaxHandle from './util';
import ip from './tempIp'
import {Message} from 'element-ui';

export default {
    //checkResult---------
    getBrandOptions: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.verify_ip + '/verify/listBrand').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCheckResultMainTbl: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyApi[0] + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //核对无误
    getNormalDetail: (type, param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyApi[Number(type)] + '/get-no-diff-detail' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //核对有账单
    getBillDetail: (type, param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyApi[Number(type)] + '/get-bill-detail' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //核对无账单
    getNoBillDetail: (type, param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyApi[Number(type)] + '/get-no-bill-detail' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //核对数据异常
    getAbnormalDetail: (type, param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyApi[Number(type)] + '/get-diff-detail' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //下载核对结果有差异
    exportCheckDiff: (type, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + ip.verifyExportApi[Number(type)] + 'Diff-Excel', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //下载核对有账单
    exportCheckBill: (type, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + ip.verifyExportApi[Number(type)] + 'Bill-Excel', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //下载核对无账单
    exportCheckNoBill: (type, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + ip.verifyExportApi[Number(type)] + 'NoBill-Excel', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //导出券码
    exportDataCheckVoucher: (type, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + ip.verifyExportCouponApi[Number(type)], param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //导出订单
    exportDataCheckOrder: (type, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + ip.verifyExportDetailApi[Number(type)], param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    //微信社交商城收退款商品类别 无差异 1 不一致 2 有订单无账单 3 无订单有账单 4
    getCheckProductCategory: (type, param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.verify_ip + ip.verifyProductCategoryApi[Number(type)] + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //./checkResult-----------
    //task Center
    /*
     * 0-taskcenter,
     * 1-taskrecord
     * 2-datasource
     */

    /*****************data source*/
    viewTaskRelationship: (param, resolve, reject) => {  //view a task relationship
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/view-rely?taskId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteDs: (param, resolve, reject) => {  //delete a data source
        ajaxHandle.ajaxDelete(ip.task_center_ip + '/data-source/del?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveDs: (param, resolve, reject) => {   //submit to save data source
        ajaxHandle.ajaxPost(ip.task_center_ip + '/data-source/save', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    queryDsByCondition: (param, resolve, reject) => {  //query data source by condition, default param:pageIndex:1,pageSize:10,sourceName,sourceType
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.task_center_ip + '/data-source/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    queryDsById: (param, resolve, reject) => {  //query data source by id
        ajaxHandle.ajaxGet(ip.task_center_ip + '/data-source/select-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateDs: (param, resolve, reject) => {  //update data source
        ajaxHandle.ajaxPatch(ip.task_center_ip + '/data-source/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /*data source***************/

    /***********task center*/
    getPageSearch: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.task_center_ip + '/param/get-param?pageType=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /**手动执行任务 */
    startManualTask: (param, resolve, reject) => { //action a task right now
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/start-task-manually', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteTask: (param, resolve, reject) => {  //delete a task
        ajaxHandle.ajaxDelete(ip.task_center_ip + '/task/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    disableTask: (param, resolve, reject) => { //disable a task
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/disable?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    usingTask: (param, resolve, reject) => {//start using a task
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/enable?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTask: (param, resolve, reject) => {  // submit for updating a task
        ajaxHandle.ajaxPut(ip.task_center_ip + '/task/edit', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertTask: (param, resolve, reject) => {  // submit for updating a task
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPageTaskList: (param, resolve, reject) => { //paged query query param:pageIndex:1,pageSize:10,taskName,taskType,taskStatus
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaskRely: (param, resolve, reject) => { // get task depends
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/get-by-type?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSingleTask: (param, resolve, reject) => {  //get a task edit data
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/get-edit-data?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /**
     * service for edit task page for searching task to ensure depends relationship
     * @param resolve
     * @param reject
     */
    getPlanTask: (resolve, reject) => {//get planning to run data
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/get-plan-task?t=' + Date.now()).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRunningTask: (resolve, reject) => {//get running data
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/get-running-task?t=' + Date.now()).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /**task center**************/

    /**task instance******/
    getTaskInstance: (param, resolve, reject) => {//get running data
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task-instance/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaskLog: (param, resolve, reject) => {//get task log
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task-log/select-by-instance-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    /***********************>master manage *************************/
    //商品
    deleteCommodity: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/commodity/delete-by-id?commodityId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity/get-by-id?commodityId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCommodity: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/commodity/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCommodityById: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/commodity/update-by-id', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity/get-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //商品类别
    checkName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/check-name?name=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkNumber: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/check-number?number=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCommodityType: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/commodity-type/delete?commodityTypeId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityTypeById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/get-by-id?commodityTypeId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityTypeNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/get-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityTypeIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/list-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCommodityType: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/commodity-type/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCommodityTypeList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/commodity-type/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCommodityTypeById: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/commodity-type/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //积分主档
    deleteIntegral: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/integral/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getIntegralById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/integral/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addIntegral: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/integral/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getIntegralList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/integral/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateIntegral: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/integral/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkValidityIntegral: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/integral/check-validityDate',param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //活动区域与餐厅映射
    deleteActivityArea: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/activity-area/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaBillingunit: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/get-billing-unit-id-names' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/get-by-id?activityAreaId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaCompany: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/get-company-id-names').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaCompanyInfo: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/getCompanyInfo').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRestaurantNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/get-restaurant-names' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addActivityArea: (module, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/activity-area/insert' + module, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateActivityArea: (module, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity-area/update' + module, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllActivityArea: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity-area/getAllActivityArea').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //银行
    deleteBank: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/bank/delete?bankId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bank/get-by-id?bankId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bank/get-bank-names').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/bank/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addBank: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/bank/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBank: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/bank/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankInfoByJDE: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bank/get-bank-info?jdeCode=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankByCompany: (param, body, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/bank/getBankByCompany' + param, body).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.message
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankByBillingUnit: (param, body, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/bank/getBankByBillingUnit' + param, body).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.message
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkJdeBrandCompanyBillUnit: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bank/check-jdeBrandCompanyBillUnit' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //品牌
    checkBrandName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/check-name?brandName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkBrandEnglishName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/check-english-name?brandEnglishName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBrand: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/brand/delete?brandId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-by-id?brandId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandEnglishName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-english-name?keyword=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandByIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get—id-and-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllBrandInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addBrand: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/brand/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBrandById: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/brand/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandEnglishNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get—id-and-english-name' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },


    //市场
    getOperateIdName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-Operate-idname').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getOperateIdNamesWithParams: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-Operate-idname?operateMarketName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketCategory: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-category').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/market/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-by-id?marketId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getMarketIdNamesWithParams: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-id-name?marketName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getOperateMarketIdNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-all-Operate-idname?operateMarketName=' + param).then(res => {
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
    checkMarketNumber: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/check-market-number?marketNumber=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertMarket: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/market/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateMarketById: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/market/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //节假日
    checkHolidayValidity: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/holiday/check-validity', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteHoliday: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/holiday/delete?holidayId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getHolidayById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/holiday/get-by-id?holidayId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getYears: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/holiday/get-year').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getHolidayList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/holiday/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addHoliday: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/holiday/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateHoliday: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/holiday/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //税率
    getTaxRateTypeList: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tax-rate/list-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaxRateNameList: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tax-rate/list-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteTaxRate: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/tax-rate/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaxRateById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tax-rate/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaxRateList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/tax-rate/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaxRateData: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/tax-rate/get-list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    validateTaxRate: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/tax-rate/check-validityDate-type_code', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addTaxRate: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/tax-rate/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTaxRate: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/tax-rate/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //开票单位
    getBillUnitById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/get-by-id?billingUnitId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillUnitList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBillUnit: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/billing-unit/update-by-id', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillIdNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/list-id-name?billingUnitName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillJDECode: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/get-billing-unit-pull?billingUnitName=' + param).then(res => {
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
    getAllBillUnitIdNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/get-all-billing-unit?billingUnitName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillUnitJdeAndName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/getBillUnit' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //法人公司
    getFmFbcInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get-fm-fbc' + param, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyId: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get-by-id?companyId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCompany: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/company/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCompany: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/company/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—id-and-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyIdNamesWithParams: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—id-and-name?companyName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyIdNamesByName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get-id-and-name-by-name?name=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyByFMarket: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/company/getCompanies' + tt, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRscCompanies: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/getRscCompanies').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCompanyJDECode: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—pull-info?companyName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getNNInfoByJdeCode: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/getNNInfo?companyJdeCode=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllCompanyIdNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—all-id-jde-name?companyName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllCompanyIdNamess: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—all-id-jde-name' + param, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFinanceMarketIdNames: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-all-id-name?marketName=' + param).then(res => {
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
    getCompanyJdeAndName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/getJdeAndName' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //客户主档
    getCustomerById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customer/get-by-id?customerId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomerList: (param, resolve, reject, flag) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/customer/get-page-data' + tt, '', flag).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCustomer: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/customer/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomerByName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customer/getCustomerByName' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomersByActId: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/customer/get-customer-by-activity-master-id' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityCheckList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/activityCheckList' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getListSearchType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customer/list-search-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //卡档管理
    checkCard: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/card-file/check-card' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCard: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/card-file/delete?cardFileId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/card-file/get-by-id?cardFileId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardTypes: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/card-file/list-type-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/card-file/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCard: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/card-file/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCard: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/card-file/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardCode: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/card-file/list-type-code').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //结算费率
    checkBrandRateValidity: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/accounting-rate/check-band-validityDate', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkRateValidity: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/accounting-rate/check-validity', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteRate: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/accounting-rate/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRateById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accounting-rate/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRateNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accounting-rate/get-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRateList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/accounting-rate/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addRate: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/accounting-rate/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateRateById: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/accounting-rate/update-by-id' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //BOH现金项目异常配置
    checkAccountSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/abnormal-config-of-boh/check-account-subject?accountSubject=' + encodeURIComponent(param)).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteBOH: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/abnormal-config-of-boh/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/abnormal-config-of-boh/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/abnormal-config-of-boh/get-account-subject').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/abnormal-config-of-boh/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addBOH: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/abnormal-config-of-boh/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBOHById: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/abnormal-config-of-boh/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //角色管理
    checkRoleName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/role-info/check-name?roleName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteRole: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/role-info/delete', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRoleById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/role-info/get-by-id?roleId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRoleIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/role-info/get-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRoleList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/role-info/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    showRoleTree: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/role-info/list-tree-Permission').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addRole: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/role-info/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateRole: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/role-info/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //用户管理
    getPSbyAD: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/get-by-ad?adAccount=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFSCById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/get-fsc-user?userId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFinanceMarketNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-financemarket').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getRoleNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/get-role-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertFSC: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/user/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    adAccountCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-ad?adAccount=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    emailCheck: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/check-email?email=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFSCList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-fsc-user' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getLoginUserInfo: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/get-login-user').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPermissionListById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-permission-by-id?userId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getLoginUserPermission: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-permission-by-login_user').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPSList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-ps-user' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateFSC: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/user/update-fsc-user', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateUserStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/user/update-status' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateSSOLimit: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/user/update-sso-limit', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateLocalSSOLimit: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.master_ip + '/user/update-local-sso-limit', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getUserDepartment: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-userDepartment' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillUnitsByCompanyCode: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/getBillUnits' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //数据日志
    getDataLog: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-data-log' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getModule: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-module').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSubModule: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-submodule').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTableName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-table-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getParentModule: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-parent-module').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSonModule: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/get-son-module?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDataLogList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/data-log/list-data-log' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //B2C账单/B2C订单
    updateTmallPaymodel: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/data/update-tmall-alipay-paymodel' + param).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportdataViewExcel: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + ip.dataViewApi + param).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportPaymentTypeDataViewExcel: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/data/down-tm-bill' + param).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // exportdataView:(param,resolve,reject)=>{
    //     ajaxHandle.ajaxPost(ip.data_center + ip.dataViewApi + param).then(res=>{
    //         resolve(res.data);
    //     }).catch(err=>{
    //         reject && reject(err);
    //     })
    // },
    getSearchList: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.data_center + '/data/get-param').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadStart: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.data_center + '/data/upload-start' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadFinish: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/data/upload-finish' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadDataView: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/data/upload' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDataList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.data_center + '/data/view-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.data_center + '/coupon-change-detail/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    importCouponSale: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/coupon-change-detail/upload', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCouponRow: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.data_center + '/coupon-change-detail/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //数据字典
    checkDateDictionaryNum: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/dictionary/check-dictionaryNumber?dictionaryNumber=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkDateDictionaryName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/dictionary/check-dictionaryName?dictionaryEntryName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteDateDictionary: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/dictionary/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDateDictionaryById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/dictionary/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addDateDictionary: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/dictionary/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDateDictionaryList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/dictionary/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDictionaryByNumber: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/dictionary/list-dictionary?dictionaryNumber=' + param).then(res => {
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
    updateDateDictionary: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/dictionary/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAdjustTypeAmountType: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/get-amount-type' + tt.replace(/\+/g, '%2B')).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //自定义市场
    deleteCustomizeMarket: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/customizeMarket/delete?customizeMarketId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeMarketById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customizeMarket/get-by-id?customizeMarketId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeMarketList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/customizeMarket/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCustomizeMarket: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/customizeMarket/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeMarketIdName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customizeMarket/list-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCustomizeMarket: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/customizeMarket/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //自定义区域
    checkCustomizeActivityAreaName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customize-activity-area/check-customizeActivityAreaName?customizeActivityAreaName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCustomizeArea: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/customize-activity-area/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeAreaById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customize-activity-area/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeAreaList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/customize-activity-area/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addCustomizeArea: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/customize-activity-area/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCustomizeAreaIdName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customizeMarket/list-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCustomizeArea: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/customize-activity-area/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreTree: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customize-activity-area/get-store-tree').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTypeThreeTrue: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/customize-activity-area/get-type-three-tree').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //支付宝账号与品牌渠道法人映射
    deleteAlipayAccountRs: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/alipayAccountRelationship/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayAccountRsById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayAccountRelationship/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayAccountRsList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayAccountRelationship/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addAlipayAccountRs: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/alipayAccountRelationship/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayAccountRsChannel: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayAccountRelationship/list-channel').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayAccountRsType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayAccountRelationship/list-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateAlipayAccountRs: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/alipayAccountRelationship/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //组织管理
    checkDepartmentName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/department/check-name' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDepartmentlist: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/department/list-tree').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDepartmentParentlist: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/department/list-parent-tree').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDepartmentUserlist: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/department/list-usertree').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addDepartment: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/department/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDepartmentIdNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/department/get-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateDepartment: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/department/update-by-id', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteDepartment: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/department/delete?list=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //功能权限
    deletePermissionInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/permissionInfo/delete?permissionId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPermissionInfoById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/permissionInfo/get-by-id?permissionId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPermissionInfoList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/permissionInfo/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addPermissionInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/permissionInfo/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkPermissionInfoName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/permissionInfo/check-permissionInfoName?permissionInfoName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPermissionInfoListNode: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/permissionInfo/list-node').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updatePermissionInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/permissionInfo/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //功能权限
    deleteReservation: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/reservation/delete?activityId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReservationById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/reservation/get-by-id?activityId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReservationListbc: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/reservation/list-bc').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReservationListName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/reservation/list-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addReservation: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/reservation/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReservationList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/reservation/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateReservation: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/reservation/update-by-id', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //会计科目
    checkAccountingSubjectName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/check-name?subjectName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkAccountingSubjectNum: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/check-num?subjectNum=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteAccountingSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/accountingSubject/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAccountingSubjectById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addAccountingSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/accountingSubject/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAccountingSubjectList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAccountingSubjectName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/list-node').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateAccountingSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/accountingSubject/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllAccountingSubjectJdeName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-all-jde-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getNotaxIncludeWholeMonth: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-notax_include_whole_month').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getFullMonthWithTaxSubjects: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-tax-include-whole-month').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrokeMonthWithTaxSubjects: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-tax-include-breaken-month').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrokeMonthWithOutTaxSubjects: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-notax-include-breaken-month').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //第三方账单配置
    thirdBillChangeStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/third_bill_config/changeStatus?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkConfigName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/configNameCheck?configName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteThirdBill: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/third_bill_config/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/detail?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getLinkCodeByType: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/getLinkCode?type=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getOrderCheckRule: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/getOrderCheckRule').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addThirdBill: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_bill_config/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getThirdBillList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateThirdBill: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/third_bill_config/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    thirdBillUploadFile: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_bill_config/uploadFile?url=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBillConfigByKey: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_bill_config/getBillConfigByKey', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    thirdBillDownload: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/downloadFile' + param, '', '', true).then(res => {
            resolve(res)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteFile: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_bill_config/deleteFile?url=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getKettleConfig: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/getKettleConfig').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    // 核对容差主档
    getToleranceList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/check-tolerance-file/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //容差主档list-new
    getToleranceListNew: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/tolerance/get-page-data' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 根据ID获取核对容差信息
    getToleranceById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/check-tolerance-file/get-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 根据ID获取核对容差信息-new
    getToleranceByIdNew: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/tolerance/get-by-id' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 删除核对容差信息
    delToleranceById: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/check-tolerance-file/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 更新核对容差信息
    updateTolerance: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/check-tolerance-file/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 更新核对容差信息-new
    updateToleranceNew: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/tolerance/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 插入核对容差信息
    addTolerance: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/check-tolerance-file/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // BOH数据项-会计科目
    getBOHDataList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/boh-data_item/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delBOHDataById: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/boh-data_item/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 差异原因-BOH数据项
    getBOHSubjectList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBohProject: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/get-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delBohSubjectById: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/difference-reason/delete-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkAdjustType: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/check-adjust-type' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertBohSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/difference-reason/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBohSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/difference-reason/update-by-id', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCashAdjustType: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/get-adjust-type' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHSubjectByAdjustType: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/difference-reason/get-boh-project' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBOHRuleType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/abnormal-config-of-boh/get-rule-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //餐厅主档
    getStoreDetailById: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/detail?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    listFscUsersByKeyWord: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/store-master/listFscUsers' + param, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/store-master/selectByStoreName' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSelectSearchCondition: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/selectSearchCondition', param, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateStore: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/store-master/updateStore' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    uploadBatchFiles: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/uploadFile?type=' + param).then(res => {

            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    // 银行流水标准格式配置
    addBankConfig: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/bankFlow-standard-config/insert' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankConfig: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bankFlow-standard-config/get-page-data' + param).then(res => {

            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    delBankConfig: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/bankFlow-standard-config/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankConfigInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bankFlow-standard-config/get-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkBank: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/bankFlow-standard-config/check-bank' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBankConfig: (pathParam, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/bankFlow-standard-config/update' + pathParam, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //活动主档
    selectUnmapperKey: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/casha/select-unmapper-key').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    activeChangeStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity_master_data/changeStatus?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteActive: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/activity_master_data/delete' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActiveDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/detail?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    activeFindAllUserInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/findAllUserInfo' + param, '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    activeGetAddLog: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/getAddLog?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSameNameActivity: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/getSameNameActivity?activityAbbreviation=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertActive: (pathParams, param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/activity_master_data/insert' + pathParams, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActiveList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/list' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    activeRefund: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity_master_data/refund', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateActive: (pathParams, param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity_master_data/update' + pathParams, param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    activeUploadFile: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity_master_data/uploadFile' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertTypeThree: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/activity_master_data/insertTypeThree', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTypeThree: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/activity_master_data/updateTypeThree', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //活动小表
    getSmallActivityBrand: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/get-brand').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSmallActivityList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/activity_master_data/list-smallActivityExportDtos', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSmallActivity: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/activity_master_data/exportSmallActivity', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //全国性第三方促销活动清单
    getNationThirdSalePromList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_promotions_list/select', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getNationThirdSaleActivityTypeOpt: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.third_sales_ip + '/common/select-activity-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportNationThirdSaleProm: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/third_promotions_list/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    /***********************master manage <*************************/
    //权限控制
    login: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.login_ip + '/user/login', param, "mutilpart/form-data").then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err.response.data);
        })
    },
    logout: (resolve, reject) => {
        ajaxHandle.ajaxPost(ip.login_ip + '/user/logout', {}).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err.response.data);
        })
    },
    getPermissionPath: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/user/list-permission-by-login_user').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //账务配置
    getAccountConfig: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-base-info/select' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBusinessType: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-base-info/select-account-business-type' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getConfigDetail: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-base-info/select-by-id' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateAccountConfig: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.accountConfig_ip + '/accounts-base-info/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    saveSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.accountConfig_ip + '/accounts-subject-config/save', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.accountConfig_ip + '/accounts-subject-config/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteSubject: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.accountConfig_ip + '/accounts-subject-config/del?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    generateVoucher: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.accountConfig_ip + '/account-common/generate-voucher', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPaymentDayRange: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-close/select-payment-range' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGroupNames: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/group-names').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivities: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/get-activity-names').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // getSubjectDetail:(param,resolve,reject)=>{
    //     var tt = !param?'?t='+Date.now():param+'&t='+Date.now();
    //     ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-base-info/select-by-id' + tt).then(res=>{
    //         resolve(res.data)
    //     }).catch(err=>{
    //         reject && reject(err);
    //     })
    // },

    //手工分录
    getCompany: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.manualAccounting_ip + '/list-company' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStartDate: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.manualAccounting_ip + '/get-start-date' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getReasonSubject: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.manualAccounting_ip + '/list-reason-subject' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    generateManualEntry: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.manualAccounting_ip + '/generate-manual-entry', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //关账管理
    cancelPreClose: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.accountConfig_ip + '/accounts-close/cancel-pre-close', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    closeAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.accountConfig_ip + '/accounts-close/close', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    preCloseAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPatch(ip.accountConfig_ip + '/accounts-close/pre-close', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCloseAccountList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/accounts-close/select' + tt).then(res => {
            if(res.data.code === 200 || res.data.code === 404){
                resolve(res.data);
            }else{
                Message.error({
                    message:res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    //报表管理
    getReportList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.report_ip + '/ownstore-dispatch-detail/list-dispatch—detail' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponReportList: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-coupon-sales' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityFromCoupon: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-activity' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityGroupFromCoupon: (resolve, reject) => {
        var tt = '?t=' + Date.now();
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-activity-group' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityGroupAndCoupons: (resolve, reject) => {
        var tt = '?t=' + Date.now();
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-activitygroup-activity' + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCouponReport: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-sales/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //凭证管理
    getVoucherList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/select' + param).then(res => {
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
    getNotGroupVoucherList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/group-voucher/select' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGroupVoucherList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/group/select' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    reversalVoucher: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/reversal/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    reversalGroupVoucher: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/group/reversal/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendJde: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/sendJde/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    groupSendJde: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/group/sendJde/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkJde: (voucherId, auditingFlag, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/' + voucherId + '/verify-voucher/' + auditingFlag).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    editVoucher: (voucherId, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/edit-voucher/' + voucherId).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //单据管理
    //store单据详情
    getStorebillDetail: (voucherCode, voucherId, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/bill/billManagement/' + voucherCode + '/' + voucherId).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //store单据详情列表
    getStorebillDetailList: (pathUrl, param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/bill/' + pathUrl + '/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //下载明细
    exportDetailFile: (voucherCode, voucherId, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.accountConfig_ip + '/voucherDetailExport/exportBOH/' + voucherCode + '/' + voucherId, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    getInvoices: (voucherCode, invoiceId, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/account-common/' + voucherCode + '/invoices/' + invoiceId).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getInvoicesDetail: (voucherCode, invoiceId, param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/account-common/' + voucherCode + '/invoices-detail/' + invoiceId + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteVoucher: (voucherCode, invoiceId, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.accountConfig_ip + '/voucher/' + voucherCode + '/delete-voucher/' + invoiceId).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteGroupVoucher: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.accountConfig_ip + '/voucher/group/delete/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBill: (voucherCode, invoiceId, param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.accountConfig_ip + '/account-common/' + voucherCode + '/download-invoices-detail/' + invoiceId + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    getVoucherDetail: (voucherId, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/voucher/' + voucherId).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getBBCManualVoucherDetail: (voucherId, resolve, reject) => {
        var tt = '?t=' + Date.now();
        ajaxHandle.ajaxGet(ip.accountConfig_ip + '/bbc-manual-entry/get-manual-entry/' + voucherId + tt).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    downLoadBBCManualAccountingAttach: (param,resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxPost(ip.accountConfig_ip + '/bbc-manual-entry/download' + tt).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject && reject(err);
        })
    },

    getRestaurantList: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/boh-payment-detail/view', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportFileFromDrOrder: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/boh-payment-detail/download', param).then(res => {
            // if(res.data.code){
            //     var  objectUrl = res.data;
            // }else{
            //     var objectUrl = URL.createObjectURL(new Blob([res.data],{type:'text/csv'}));
            // }
            // resolve(objectUrl)
            resolve(res.data);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 预警通知
    getWarnMessageList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.warn_ip + '/early-warn/select' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getWarnMessageDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.warn_ip + '/early-warn/select-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteWarnMessage: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.warn_ip + '/early-warn/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateWarnMessageStatus: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.warn_ip + '/early-warn/update-status', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateWarnMessageDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.warn_ip + '/early-warn/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteConfigDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.warn_ip + '/early-warn/delete-config-detail-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getWarnAllMessageList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.warn_ip + '/early-warn-message/select' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteWarnMsg: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.warn_ip + '/early-warn-message/del-message?messageId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateMsgReadStatus: (resolve, reject) => {
        ajaxHandle.ajaxPut(ip.warn_ip + '/early-warn-message/update-message-status').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getWarnNoReadMsg: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.warn_ip + '/early-warn-message/select-no-read', '', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadWarnMsgFile: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.warn_ip + '/early-warn-message/down-file', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 任务中心

    getIsRollback: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task/is-rollback?taskId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getBatchStop: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/batch-stop?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    batchExecuteTask: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task/batch-execute-task', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    taskJudge: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.data_center + '/data/task-judge' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getRollBackInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_set_ip + '/data-set/get-roll-back-info/by-task-date', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getBbcRollBackInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.accountConfig_ip + '/bbc-roll-back/roll-back/by-task-date', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    rollBackBydate: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.data_set_ip + '/data-set/roll-back/by-task-date', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVoucher: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.accountConfig_ip + '/voucher/export-voucher-Excel?voucherId=' + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVoucherStore: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.accountConfig_ip + '/voucher/export-voucher-Excel-store?voucherId=' + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponOwnData: (param, resolve, reject) => {   //submit to save data source
        ajaxHandle.ajaxPost(ip.data_center + '/own-order-no-bill/list', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //券码补丁list查询
    addToRecheck: (param, resolve, reject) => {   //submit to save data source
        ajaxHandle.ajaxPost(ip.data_center + '/own-order-no-bill/add-coupon', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //下载券码补丁list
    exportCouponRecheckList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.data_center + '/own-order-no-bill/download', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getChannelsAboutGoods: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.data_center + '/product-without-category/list' + '?t=' + Date.now()).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    searchCommodityWithoutCategory: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/product-without-category/list', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //货劳分类
    getCargoLaborTaxonomyList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/cargoLaborTaxonomy/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCargoLaborClass: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/cargoLaborTaxonomy/get—cargoLaborClass').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCargoLaborItem: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/cargoLaborTaxonomy/get—cargoLaborItem').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCargoLaborTaxonomy: (param, urlPath, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/cargoLaborTaxonomy/' + urlPath, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteCargoLaborTaxonomy: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/cargoLaborTaxonomy/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //视同销售
    getDeemedSalesList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/deemedSales/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDeemedSalesItem: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/deemedSales/get—deemedSalesItem').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadDeemedSales: (param, urlPath, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/deemedSales/' + urlPath, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteDeemedSales: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/deemedSales/delete-by-itemCode?itemCode=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //第三方退款平台
    getThirdRefundPlatformList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/thirdRefundPlatform/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteThirdRefundPlatform: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/thirdRefundPlatform/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getThirdRefundPlatformDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/thirdRefundPlatform/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    insertThirdRefundPlatform: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/thirdRefundPlatform/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    updateThirdRefundPlatform: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/thirdRefundPlatform/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    checkThirdRefundPlatformSiteName: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/thirdRefundPlatform/check-siteName?siteName=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //支付宝微信
    checkAlipayMerchantNumber: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/check-merchant-number' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayWechatAccountList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteAlipayWechatAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/alipayWechatAccount/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getAlipayWechatAccountDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    insertAlipayWechatAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/alipayWechatAccount/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    updateAlipayWechatAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/alipayWechatAccount/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    checkAlipayWechatAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/check-alipayWechat-account' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayWechatByCompany: (param, body, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/alipayWechatAccount/getAlipayWechatByComAndBrand' + param, body).then(res => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data)
            } else {
                Message.error({
                    message: res.data.message
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayWechatByCompanyIdAndBrandId: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/get-alipayWechat-account-by-companyId-and-brandId' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBankByCompanyAndBrand: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/get-bank-by-companyAndBrand' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBrandByCompany: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/alipayWechatAccount/get-brand-by-company' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //任务中心账号
    getTaskAccountList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/task-account/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getAllTaskAccount: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/task-account/get-all').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    deleteTaskAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.master_ip + '/task-account/delete?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    getTaskAccountDetail: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/task-account/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    insertTaskAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/task-account/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    updateTaskAccount: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/task-account/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //货劳分类数据管理
    getCargolaborDataList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/cargo-labor-data/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    importCargoLabor: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/cargo-labor-data/importCargoLabor').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCargoLaborDataModel: (appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/cargo-labor-data/exportCargoLaborModel', '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadCargoLaborData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/cargo-labor-data/exportCargoLabor' + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteCargoLaborData: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/cargo-labor-data/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //视同销售数据管理
    getDeemedSalesDataList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/deemed-sales-data/list' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    importDeemedSales: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/deemed-sales-data/importDeemedSales').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadDeemedSalesDataModel: (appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/deemed-sales-data/exportDeemedSalesModel', '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    downloadDeemedSalesData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.store + '/deemed-sales-data/exportDeemedSales' + param, '', appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteDeemedSalesData: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/deemed-sales-data/delete-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //报表管理
    /*********************** 报表管理*************************/
    getAllBillingUnit: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/billing-unit/get-all-billing-unit','',true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllCompany: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/company/get—all-id-jde-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllFinanceMarket: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-all-id-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAllOperateMarket: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/market/get-all-Operate-idname').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 库存地
    getAllInventory: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-search/list-branch-code' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 餐厅
    getAllStore: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-res-code' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    downReportOwn: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/ownstore-dispatch-detail/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 电子券码核销报表
    getActivityGroup: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-activity-group').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGroupAndName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-sales/list-activitygroup-activity').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getVdmCouponMonth: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-vdm-coupon-month' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getVdmCouponRes: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-vdm-coupon-res' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getVdmCouponEntity: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-vdm-coupon-entity' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getVdmCouponIssuing: (pathParam, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-vdm-coupon-issuing' + pathParam).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmConsumeMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-consume/export-month', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmConsumeRes: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-consume/export-res', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmConsumeEntity: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-consume/export-entity', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmConsumeIssuing: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-consume/export-issuing', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 售卡查询
    checKCardNo: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/check-card-no' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardSupplier: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-card-supplier').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDiscountType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-discount-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getOrderStatus: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-order-status','',true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPayeeUnit: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-payee-unit','',true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSalesChannel: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-sales-channel','',true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSellRscDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-sell-rsc-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSellRscSum: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-sell-rsc-sum' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSellRes: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-sell-res' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSellRscDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/sell-card-search/export-detail', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSellRscSum: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/sell-card-search/export-sum', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSellRes: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/sell-card-search/export-res', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 虚拟平台零售
    getVirtualPlatformSales: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/virtual-platform-sale/list-virtual-platform' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVirtualPlatformSales: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/virtual-platform-sale/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 电子券码核销查询
    getCouponSource: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-coupon-source').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getPayerName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-payer-name').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBusinessModel: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-business-model').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCouponType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-coupon-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getVdmCouponConsume: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-consume/list-vdm-coupon-consume' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmCouponConsume: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-consume/export', param).then(res => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                });
            } else {
                Message.error({
                    message: res.data.msg
                })
            }
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 电子券码账龄报表
    getVdmCouponAging: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-aging/list-coupon-aging' ,pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmCouponAging: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-aging/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 月百胜卡售卖报表
    getSellReportMonth: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-report-month/list-sell-report-month' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSellReport: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-report-month/list-sell-report' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSellMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/sell-report-month/export-res', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportSell: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/sell-report-month/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    //卡平台累计平衡报告
    createCardPlatBalance: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-plat-balance/create-card-plat-balance?date=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardPlatBalance: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-plat-balance/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getBalanceChangeItem: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-plat-balance/get-balance-change-item' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardPlatBalanceList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-plat-balance/list-card-plat-balance' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCardPlatBalanceList: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.report_ip + '/card-plat-balance/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //卡档映射
    checkZHX: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-mapping/check-zhx', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardMap: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-mapping/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardMapList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-mapping/list-card-mapping' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardMapById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-mapping/get-card-mapping?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getZHXUNPCode: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-mapping/list-code?productType=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getUNPType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-mapping/list-unp-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getZHXType: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-mapping/list-zhx-type').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateCardMap: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.report_ip + '/card-mapping/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    // 月百胜卡核销报表
    getConsumeMonthRes: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/consume-month/list-consume-month-res' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getConsumeMonth: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/consume-month/list-consume-month' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    exportConsumeMonthRes: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/consume-month/export-res', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    exportConsumeMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/consume-month/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },

    // 卡核销查询
    getConsumeSearch: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/consume-search/list-consume-search' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    exportConsumeSearch: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/consume-search/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 预售电子券码核销查询
    getVdmCouponDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-report/list-vdm-coupon-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmCouponDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-report/export-detail', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkVdmCouponDetailMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-report/check-detail', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendVdmCouponMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-report/send-detail', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 预售电子券码核销月度查询
    getVdmCouponMonthRep: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-coupon-report/list-vdm-coupon-month' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmCouponMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-coupon-report/export-Month', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkVdmCouponMonthMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-report/check-month', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendVdmCouponMonthMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/vdm-coupon-report/send-month', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 退卡明细
    getBackCardDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/back-card-detail/list-back-card-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportBackCardDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/back-card-detail/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getSubSaleChannel: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/sell-card-search/list-sub-sales-channel','', true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 卡片查询
    getCardSearch: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-search/list-card-search' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardSearch: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-search/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getCardStatus: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-search/list-card-status' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 卡/券服务费计算
    getCardCouponCharge: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-coupon-service-charge/list-card-coupon-service' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardCouponCharge: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-coupon-service-charge/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 卡核销月度报表
    getCardTransMonth: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-trans-month/list-card-trans-month' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardTransMonth: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-trans-month/export-detail', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkCardTransMonthMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-trans-month/check', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendMailMonth: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-trans-month/send', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 卡核销明细报表
    getCardTransDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-trans-detail/list-card-trans-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardTransDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-trans-detail/export-detail', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    checkCardTransMail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-trans-detail/check', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    sendMailDetail: (params, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.report_ip + '/card-trans-detail/send', params).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 电子发票开票模板
    getInvoiceTemplate: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/invoice-template/get-invoice-template' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportInvoiceTemplate: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/invoice-template/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 账单明细汇总
    getPaymentModel: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/bill-detail/get-payment-model' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getAlipayBill: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/bill-detail/get-bill-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getWechatBill: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/bill-detail/get-wechat-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportAlipayBill: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/bill-detail/export-ali', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportWechatBill: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/bill-detail/export-wechat', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 礼品卡结算
    getGiftCardYearAccount: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/account-report/list-account-report-year' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportGiftCardYearAccount: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/account-report/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGiftCardMonAccount: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/account-report/list-account-report-mon' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getGiftCardIssuingAccount: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/account-report/list-account-report-issuing' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportGiftCardMonAccount: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/account-report/export-mon', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportGiftCardIssuingAccount: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/account-report/export-issuing', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 礼品卡折扣及手续费分摊
    getDiscountDivide: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/discount-divide/list-discount-divide' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportDiscountDivide: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/discount-divide/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 礼品卡管理费报表-明细
    getCardRechargeDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-recharge-detail/list-card-recharge-detail' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardRechargeDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-recharge-detail/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 礼品卡账龄
    getCardAgingDetail: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-aging-report/list-card-aging-report' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardAgingDetail: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-aging-report/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 天猫待确认收货订单报表
    getTmStoreOrder: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/tm-store-order/list-tm-order' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportTmStoreOrder: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/tm-store-order/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 券当月售卖明细券码查询按券活动组
    getVdmMonSales: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/vdm-mon-sales-detail/list-mon-sales' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportVdmMonSales: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/vdm-mon-sales-detail/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 券平衡报告按券名称
    getMonthlyBalance: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/monthly-balance-activity/get-invoice-template' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportMonthlyBalance: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/monthly-balance-activity/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 卡平台差异分析
    getCardPlatDiff: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-plat-diff/list-card-plat-diff' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    createDiffData: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/card-plat-diff/create-card-plat-diff' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportCardPlatDiff: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-plat-diff/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 天猫商城订单与天猫对接平台订单差异报表
    getHaveOrder: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/tm-store-order/list-tm-no-fsc' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getNoOrder: (pathParams, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/tm-store-order/list-tm-no-order' + pathParams).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportHaveOrder: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/tm-store-order/export-no-fsc', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportNoOrder: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/tm-store-order/export-no-order', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    /*********************** 报表管理*************************/
    //餐厅订单明细
    checkCountNumber: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/boh-payment-detail/count-number', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTotalNum: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.data_center + '/boh-payment-detail/amount-sum', param, false, true).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getDownloadListDr: (param, resolve, reject) => {
        var tt = !param ? '?t=' + Date.now() : param + '&t=' + Date.now();
        ajaxHandle.ajaxGet(ip.export_center_ip + '/data-export-task/list' + tt, '', true).then(res => {
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
    //天猫商城类别
    getTmProductCategoryList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tm/product/category/recommend/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTmProductCategoryById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tm/product/category/recommend/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    insertTmProductCategory: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/tm/product/category/recommend/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTmProductCategory: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/tm/product/category/recommend/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //天猫商城商品
    getTmProductGoodsList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tm/product/category/get-page-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTmProductGoodsById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tm/product/category/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTmProductGoods: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.master_ip + '/tm/product/category/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTmProductGoodsBrand: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/tm/product/category/get-brand').then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },


    //任务组
    getTaskGroupIds: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task-group/get-one?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteTaskGroup: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.task_center_ip + '/task-group/delete?groupId=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaskGroupById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task-group/get-by-id?id=' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getTaskGroupList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.task_center_ip + '/task-group/view-data' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    addTaskGroup: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task-group/insert', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateTaskGroup: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.task_center_ip + '/task-group/update', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    batchExecuteTaskGroup: (param, resolve, reject) => {
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task-group/batch-execute', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    // 餐厅查询与配置
    getStoreSerList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/store-search/list-store' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStorePushList: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/store-search/list-store-push' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getStoreById: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/store-search/get-store-by-id' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateSingleStore: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.report_ip + '/store-search/update' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    updateBatchStore: (param, resolve, reject) => {
        ajaxHandle.ajaxPut(ip.report_ip + '/store-search/updateMulti', param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    exportStoreSerList: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/store-search/export', param, appType).then(res => {
            resolve(res.result, res.headers);
        }).catch(err => {
            reject && reject(err);
        })
    },
    deleteStoreList: (param, resolve, reject) => {  //delete a data source
        ajaxHandle.ajaxDelete(ip.report_ip + '/store-search/reSend' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    //kettle 日志
    getKettleLog: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.data_center + '/kettle-log/' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //天猫商城订单
    getTmStoreOrderData: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.verify_ip + '/verify/tm/orders/get-tmOrdersNofsc' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },

    //天猫商城平台订单
    getTmStorePlatformOrderData: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.verify_ip + '/verify/tm/orders/get-tmOrdersNoOrder' + param).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject && reject(err);
        })
    },
    getActivityAreaNew: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/getActivityArea' + param,'', true).then(res => {
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

    findFscUserInfo: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/findFscUserInfo' + param, '', true).then(res => {
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
    getWriteOffCodeList: ( resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/accountingSubject/get-general_ledger_code').then(res => {
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
    //新加活动主档餐厅范围
    getActivityStore: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/activity_master_data/getActivityStore' + param,'', true).then(res => {
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
    changeSaveBank: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/reCalculateDepositDate'+param,{} ).then(res => {
            if (res.data.code === 200 ) {
                Message.success({
                    message: res.data.data
                })
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
    checkActivitySettlement: (param,body,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/third_bill_config/checkActivitySettlement'+param,body ).then(res => {
            if (res.data.code === 200 ) {
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
   checkBillConfig: ( param,resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/third_bill_config/checkConfig'+param).then(res => {
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
    //活动主档 键位未映射
    activityRemapper: (param, resolve, reject) => {
        ajaxHandle.ajaxGet(ip.store + '/boh-data-sync/remapperSrc' + param).then(res => {
            if (res.data.code === 200 ) {
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
    checkOrderBatch: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.task_center_ip + '/task-group/batch-execute',param ).then(res => {
            if (res.data.code === 200 ) {
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
    batchDeleteDeemedSales: (param, resolve, reject) => {
        ajaxHandle.ajaxDelete(ip.store + '/deemed-sales-data/delete-by-ids',param).then(res => {
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
    //查询key  活动
    listActivityName: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.report_ip + '/common/list-activity-name').then((res) => {
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
    downloadTMStoreOrder: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + '/verify/tm/orders/export/export-TmOrderNofsc-Excel-ByPage' ,param,appType).then((res,header) => {
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
    downloadTMtmStorePlatformOrder: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.verify_ip + '/verify/tm/orders/export/export-tmOrdersNoOrder-Excel-ByPage' ,param,appType).then((res,header) => {
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

    listStoreTreeInHall: (param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/listStore',param).then((res) => {
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
    batchUpdateStore: (url,param,resolve, reject) => {
        ajaxHandle.ajaxPost(ip.master_ip + '/store-master/batchUpdateStore'+url,param).then((res) => {
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
    downloadCargoLaborTaxonomyData: (param, appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/cargoLaborTaxonomy/down' ,param,appType).then((res,header) => {
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
    downloadActivityTemplate: ( appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.master_ip + '/activity_master_data/downloadTemplate' ,{},appType).then((res,header) => {
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
    downloadCardMp: ( appType, resolve, reject) => {
        ajaxHandle.ajaxPostFile(ip.report_ip + '/card-mapping/export-zu' ,{},appType).then((res,header) => {
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
    primeBrandList: (resolve, reject) => {
        ajaxHandle.ajaxGet(ip.master_ip + '/brand/get-prime-brand','',true).then((res) => {
            if (res.data.code === 200 || res.data.code === 404) {
                resolve(res.data);
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
}
