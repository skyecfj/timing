<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" v-if="activeName==='detailReport'">
                <div class="selectTitle">核销月份</div>
                <el-date-picker
                        v-model="searchData.summaryDate"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择核销月份">
                </el-date-picker>
            </div>
            <div class="selectContent" v-if="activeName==='detailReport'">
                <div class="selectTitle">销售时间</div>
                <el-date-picker
                        v-model="searchData.activatedTime"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择销售时间">
                </el-date-picker>
            </div>
            <div class="selectContent" v-if="activeName==='detailReport'">
                <div class="selectTitle">品牌</div>
                <el-select size="small" v-model="searchData.brandName" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in brandSelect" :key="item.id" :label="item.englishName"
                               :value="item.englishName">
                    </el-option>
                </el-select>
            </div>
            <!--<div class="selectContent" v-if="activeName==='detailReport'">
              <div class="selectTitle">渠道</div>
              <el-input size="small" v-model="searchData.channel"></el-input>
            </div>-->
            <div class="selectContent" v-if="activeName !='detailReport'">
                <div class="selectTitle">券核销日期</div>
                <el-date-picker v-model="searchData.startSummaryDate" type="date"
                                value-format="yyyy-MM-dd" placeholder="选择日期"
                                :picker-options="pickerSummaryStart"></el-date-picker>
                <span>-</span>
                <el-date-picker v-model="searchData.endSummaryDate" type="date"
                                value-format="yyyy-MM-dd" placeholder="选择日期"
                                :picker-options="pickerSummaryEnd"></el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle" v-if="activeName ==='detailReport'">渠道</div>
                <div class="selectTitle" v-else>券活动名称</div>
                <el-select size="small" v-model="searchData.activityGroup" @change="groupChange" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item, index) in activityGroupSelect" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName !='detailReport'">
                <div class="selectTitle">券名称</div>
                <el-select size="small" v-model="searchData.activity" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item, index) in activitySelect" :key="index" :label="item" :value="item">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName !='detailReport'">
                <div class="selectTitle">法人归集</div>
                <el-select size="small" v-model="searchData.oprMode">
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in oprSelect" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName ==='restaurantReport' || activeName ==='companyReport'">
                <div class="selectTitle">法人公司</div>
                <el-select size="small" v-model="searchData.resEntity" filterable value-key="jdeCode">
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in EntitySelect" :key="item.jdeCode"
                               :label="'['+item.jdeCode+']'+item.companyName" :value="item">
                        <!--<span>[{{ item.jdeCode }}]</span>-->
                        <!--<span>{{ item.companyName }}</span>-->
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName ==='restaurantReport' || activeName ==='unitReport'">
                <div class="selectTitle">开票单位</div>
                <el-select size="small" v-model="searchData.issuingUnit" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in issuingUnitSelect" :key="item.billingUnitId" :label="item.billingUnitName"
                               :value="item.jdeCode">
                        <span>[{{ item.jdeCode }}]</span>
                        <span>{{ item.billingUnitName }}</span>
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName ==='restaurantReport'">
                <div class="selectTitle">餐厅</div>
                <!--<el-select size="small" ref="storeName"  v-model="searchData.resCode" remote :remote-method="remoteStoreName" :loading="loadingStoreName" v-scroll="scrollStoreName" filterable>-->
                <!--<el-option value="" label="请选择"></el-option>-->
                <!--<el-option v-for="item in CodeSelect" :key="item.storeHypId" :label="`[${item.storeHypId}]${item.storeName}`" :value="item.storeHypId">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <remoteSelect
                        placeholder="请选择餐厅编号"
                        :remoteFn="'getSelectSearchCondition'"
                        :optLabel="'storeName'"
                        :optValue="'storeHypId'"
                        @getChangeData="getStoreCode"
                        :type="1"
                        :customLabel="true"
                        :customType="1"
                        ref="storeRef"
                ></remoteSelect>
            </div>
            <div class="selectContent" v-if="activeName !='detailReport'">
                <div class="selectTitle">品牌</div>
                <el-select size="small" v-model="searchData.resBrand" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in resBrandSelect" :key="item.id" :label="item.englishName"
                               :value="item.englishName">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent" v-if="activeName !=='detailReport'">
                <div class="selectTitle">key 活动</div>
                <el-select size="small" v-model="searchData.activityCode" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in keyNames" :key="index" :label="item.activityGroup"
                               :value="item.activity">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small" type="success" @click="searchList">查询</el-button>
            <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success" @click="exportFile"><i
                    class="fa fa-download c-button-icon--left"></i>下载
            </el-button>
        </div>
        <div class="dataContent">
            <div class="tab-content">
                <el-tabs v-model="activeName" @tab-click="handleSwitch">
                    <el-tab-pane label="销售月份" name="detailReport">
                        <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey">
                        </report-table-com>
                    </el-tab-pane>
                    <el-tab-pane label="按餐厅" name="restaurantReport">
                        <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
                    </el-tab-pane>
                    <el-tab-pane label="按开票单位" name="unitReport">
                        <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
                    </el-tab-pane>
                    <el-tab-pane label="按法人公司" name="companyReport">
                        <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="pagination">
                <el-pagination background
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page.sync="currentPage"
                               :page-size="pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import reportTableCom from './reportTableCom.vue'
    import api from '@/model/api'
    import scroll from '@/directives/index'
    import remoteSelect from '@/components/common/remoteSelect'

    export default {
        name: 'vdmCouponConsume',
        data () {
            return {
                pickerSummaryStart: {
                    disabledDate: (time) => {
                        if (this.searchData.endSummaryDate) {
                            let curDate = (new Date(this.searchData.endSummaryDate)).getTime()
                            let one = 30 * 24 * 3600 * 1000
                            let oneMonths = curDate - one
                            return time.getTime() < oneMonths || time.getTime() >= curDate
                        } else {
                            return false
                        }
                    }
                },
                pickerSummaryEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.startSummaryDate) {
                            let curDate = (new Date(this.searchData.startSummaryDate)).getTime()
                            let one = 30 * 24 * 3600 * 1000
                            let oneMonths = curDate + one
                            return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
                        } else {
                            return false
                        }
                    }
                },
                searchData: {
                    summaryDate: '',
                    activatedTime: '',
                    brandName: '',
                    channel: '',
                    startSummaryDate: '',
                    endSummaryDate: '',
                    activity: '',
                    activityGroup: '',
                    oprMode: '',
                    resEntity: '',
                    issuingUnit: '',
                    resCode: '',
                    resBrand: '',
                    activityCode:''
                },
                oprSelect: [{
                    id: 1,
                    name: '加盟商'
                }, {
                    id: 2,
                    name: '市场公司'
                }],
                brandSelect: [],
                activitySelect: [],
                activityGroupSelect: [],
                allActivity: [],
                EntitySelect: [],
                issuingUnitSelect: [],
                loadingStoreName: false,
                CodeSelect: [],
                resBrandSelect: [],
                activeName: 'detailReport',
                simpleTableData: [],
                simpleTableKey: [{
                    name: '核销月份',
                    value: 'summaryDate'
                }, {
                    name: '渠道',
                    value: 'activityGroup'
                }, {
                    name: '销售时间',
                    value: 'activatedTime'
                }, {
                    name: '券码名称',
                    value: 'activity'
                }, {
                    name: '品牌',
                    value: 'brandName'
                }, {
                    name: '核销金额',
                    value: 'sales',
                    classname: 'sumClass'
                }],
                defaultHeader: [],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                ifDetail: false,
                ifRes: false,
                ifIssuing: false,
                ifEntity: false,
                // detailSearchData: {},
                // resSearchData: {},
                // issuingSearchData: {},
                // entitySearchData: {},
                selectIndex: 1,
                StoreNameSize: 10,
                keyNames:[],
            }
        },
        components: {
            reportTableCom,
            remoteSelect
        },
        directives: {scroll},
        methods: {
            remoteStoreName (val) {
                let that = this
                this.loadingStoreName = true
                api.getSelectSearchCondition({
                    pageIndex: this.selectIndex,
                    pageSize: this.StoreNameSize,
                    storeName: val
                }, res => {
                    this.loadingStoreName = false
                    if (res.code === 200) {
                        that.CodeSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    } else {
                        that.CodeSelect = []
                    }
                })
            },
            scrollStoreName (param) {
                let that = this
                if (param) {
                    this.StoreNameSize += 10
                    let currentValue = this.$refs.storeName.$children[0].currentValue === '请选择' ? '' : this.$refs.storeName.$children[0].currentValue
                    api.getSelectSearchCondition({
                        pageIndex: this.selectIndex,
                        pageSize: this.StoreNameSize,
                        storeName: currentValue
                    }, res => {
                        that.CodeSelect = res.data
                    })
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
                if (this.activeName === 'detailReport' && this.ifDetail) {
                    this.getVdmCouponMonth()
                } else if (this.activeName === 'restaurantReport' && this.ifRes) {
                    this.getVdmCouponRes()
                } else if (this.activeName === 'unitReport' && this.ifIssuing) {
                    this.getVdmCouponIssuing()
                } else if (this.activeName === 'companyReport' && this.ifEntity) {
                    this.getVdmCouponEntity()
                }
            },
            handleCurrentChange (val) {
                this.currentPage = val
                if (this.activeName === 'detailReport' && this.ifDetail) {
                    this.getVdmCouponMonth()
                } else if (this.activeName === 'restaurantReport' && this.ifRes) {
                    this.getVdmCouponRes()
                } else if (this.activeName === 'unitReport' && this.ifIssuing) {
                    this.getVdmCouponIssuing()
                } else if (this.activeName === 'companyReport' && this.ifEntity) {
                    this.getVdmCouponEntity()
                }
            },
            groupChange (val) {
                this.activitySelect = this.allActivity[val]
            },
            searchList () {
                if (this.activeName === 'detailReport') {
                    // this.detailSearchData = JSON.parse(JSON.stringify(this.searchData))
                    this.getVdmCouponMonth()
                    this.ifDetail = true
                } else if (this.activeName === 'restaurantReport') {
                    // this.resSearchData = JSON.parse(JSON.stringify(this.searchData))
                    this.getVdmCouponRes()
                    this.ifRes = true
                } else if (this.activeName === 'unitReport') {
                    // this.issuingSearchData = JSON.parse(JSON.stringify(this.searchData))
                    this.getVdmCouponIssuing()
                    this.ifIssuing = true
                } else {
                    // this.entitySearchData = JSON.parse(JSON.stringify(this.searchData))
                    this.getVdmCouponEntity()
                    this.ifEntity = true
                }
            },
            reset () {
                this.$refs.storeRef?this.$refs.storeRef.reset():null;
                for (let key in this.searchData) {
                    this.searchData[key] = ''
                }
            },
            exportFile () {
                let apiName = 'detailReport';
                let fileName = '电子券码核销报表-按月度.xlsx';
                if(this.searchData.resEntity){
                    this.searchData.resEntity = this.searchData.resEntity.jdeCode;
                }

                switch(this.activeName){
                    case 'detailReport' : apiName = 'exportVdmConsumeMonth'; fileName = '电子券码核销报表-按月度.xlsx';break;
                    case 'restaurantReport' : apiName = 'exportVdmConsumeRes';fileName = '电子券码核销报表-按餐厅.xlsx';break;
                    case 'unitReport' : apiName = 'exportVdmConsumeIssuing';fileName = '电子券码核销报表-按开票单位.xlsx';break;
                    case 'companyReport' : apiName = 'exportVdmConsumeEntity';fileName = '电子券码核销报表-按法人公司.xlsx';break;
                    default:return;
                }
                let that = this
                api[apiName](this.searchData, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        that.common.exportTemplate(fileName,res)
                        // let link = document.createElement('a')
                        // link.href = res
                        // link.id = 'attachmentLink'
                        // link.download = '电子券码核销报表-按月度.xlsx'
                        // link.target = '_blank';link.click()
                    }
                })
                // if (this.activeName === 'detailReport') {
                //     let that = this
                //     api.exportVdmConsumeMonth(this.searchData, 'application/vnd.ms-excel', function (res) {
                //         if (res.code) {
                //             that.common.warningMessage(res.msg)
                //         } else {
                //             let link = document.createElement('a')
                //             link.href = res
                //             link.id = 'attachmentLink'
                //             link.download = '电子券码核销报表-按月度.xlsx'
                //             link.target = '_blank';link.click()
                //         }
                //     })
                // } else if (this.activeName === 'restaurantReport') {
                //     let that = this
                //     api.exportVdmConsumeRes(this.searchData, 'application/vnd.ms-excel', function (res) {
                //         if (res.code) {
                //             that.common.warningMessage(res.msg)
                //         } else {
                //             let link = document.createElement('a')
                //             link.href = res
                //             link.id = 'attachmentLink'
                //             link.download = '电子券码核销报表-按餐厅.xlsx'
                //             link.target = '_blank';link.click()
                //         }
                //     })
                // } else if (this.activeName === 'unitReport') {
                //     let that = this
                //     api.exportVdmConsumeIssuing(this.searchData, 'application/vnd.ms-excel', function (res) {
                //         if (res.code) {
                //             that.common.warningMessage(res.msg)
                //         } else {
                //             let link = document.createElement('a')
                //             link.href = res
                //             link.id = 'attachmentLink'
                //             link.download = '电子券码核销报表-按开票单位.xlsx'
                //             link.target = '_blank';link.click()
                //         }
                //     })
                // } else {
                //     let that = this
                //     api.exportVdmConsumeEntity(this.searchData, 'application/vnd.ms-excel', function (res) {
                //         if (res.code) {
                //             that.common.warningMessage(res.msg)
                //         } else {
                //             let link = document.createElement('a')
                //             link.href = res
                //             link.id = 'attachmentLink'
                //             link.download = '电子券码核销报表-按法人公司.xlsx'
                //             link.target = '_blank';link.click()
                //         }
                //     })
                // }
            },
            handleSwitch (tab) {
                this.pageSize = 10
                this.currentPage = 1
                this.simpleTableData = []
                this.totalRecords = 0
                if (tab.name === 'detailReport') {
                    this.simpleTableKey = this.defaultHeader;
                    if (this.ifDetail) {
                        // this.searchData = JSON.parse(JSON.stringify(this.detailSearchData))
                        this.getVdmCouponMonth()
                    }
                } else if (tab.name === 'restaurantReport') {
                    this.simpleTableKey = [{name: '日期', value: 'summaryDate'}, {
                        name: '编号',
                        value: 'resCode'
                    }, {name: '店名', value: 'resName'}, {name: '券类型', value: 'activity'},
                        {name: '笔数', value: 'usedCount'}, {
                            name: '券面额',
                            value: 'faceAmount',
                            classname: 'sumClass'
                        }, {name: '券真实净额', value: 'netAmount', width: '100', classname: 'sumClass'}, {
                            name: '与第三方结算金额',
                            value: 'amount',
                            width: '120',
                            classname: 'sumClass'
                        },
                        {name: '第三方补贴', value: 'invoiceAmountB', width: '100', classname: 'sumClass'}, {
                            name: '用户支付',
                            value: 'invoiceAmountA',
                            classname: 'sumClass'
                        }, {name: '法人', value: 'resEntityName'},
                        {name: '开票单位', value: 'issuingUnitName'}, {name: '营运市场', value: 'oprMarketName'}, {
                            name: '财务市场',
                            value: 'finMarketName'
                        }, {name: '品牌', value: 'resBrand'},{
                            name: 'key 活动',
                            value: 'activityAbbreviation'
                        }]
                    if (this.ifRes) {
                        // this.searchData = JSON.parse(JSON.stringify(this.resSearchData))
                        this.getVdmCouponRes()
                    }
                } else if (tab.name === 'unitReport') {
                    this.simpleTableKey = [{name: 'JDE_CODE', value: 'issuingUnit'}, {
                        name: '开票单位',
                        value: 'issuingUnitName'
                    }, {name: '券名称', value: 'activity'},
                        {name: '笔数', value: 'usedCount'}, {
                            name: '券面额',
                            value: 'faceAmount',
                            classname: 'sumClass'
                        }, {name: '券真实净额', value: 'netAmount', classname: 'sumClass'}, {
                            name: '与第三方结算金额',
                            value: 'amount',
                            width: '120',
                            classname: 'sumClass'
                        },
                        {name: '第三方补贴', value: 'invoiceAmountB', classname: 'sumClass'}, {
                            name: '用户支付',
                            value: 'invoiceAmountA',
                            classname: 'sumClass'
                        }, {name: '品牌', value: 'resBrand'},{
                            name: 'key 活动',
                            value: 'activityAbbreviation'
                        }]
                    if (this.ifIssuing) {
                        // this.searchData = JSON.parse(JSON.stringify(this.issuingSearchData))
                        this.getVdmCouponIssuing()
                    }
                } else {
                    this.simpleTableKey = [{name: 'JDE_CODE', value: 'resEntity'}, {
                        name: 'company',
                        value: 'reEntityName'
                    }, {name: '券名称', value: 'activity'},
                        {name: '笔数', value: 'usedCount'}, {
                            name: '券面额',
                            value: 'faceAmount',
                            classname: 'sumClass'
                        }, {name: '券真实净额', value: 'netAmount', classname: 'sumClass'}, {
                            name: '与第三方结算金额',
                            value: 'amount',
                            width: '120',
                            classname: 'sumClass'
                        },
                        {name: '第三方补贴', value: 'invoiceAmountB', classname: 'sumClass'}, {
                            name: '用户支付',
                            value: 'invoiceAmountA',
                            classname: 'sumClass'
                        }, {name: '品牌', value: 'resBrand'},{
                            name: 'key 活动',
                            value: 'activityAbbreviation'
                        }]
                    if (this.ifEntity) {
                        // this.searchData = JSON.parse(JSON.stringify(this.entitySearchData))
                        this.getVdmCouponEntity()
                    }
                }
            },
            getActivityGroup () {
                let that = this
                api.getActivityGroup(function (res) {
                    if (res.code === 200) {
                        that.activityGroupSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getGroupAndName () {
                let that = this
                api.getGroupAndName(function (res) {
                    if (res.code === 200) {
                        that.allActivity = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllCompany () {
                let that = this
                api.getAllCompany(function (res) {
                    if (res.code === 200) {
                        that.EntitySelect = res.data.list
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllBillingUnit () {
                let that = this
                api.getAllBillingUnit(function (res) {
                    if (res.code === 200) {
                        that.issuingUnitSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getBrandEnglishNames () {
                let that = this
                let pathParams = [{
                    name: 'flag',
                    value: '2'
                }]
                api.getBrandEnglishNames(this.common.joinSearchParam(pathParams), function (res) {
                    if (res.code === 200) {
                        that.resBrandSelect = res.data
                        that.brandSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getStoreName () {
                let that = this
                api.getSelectSearchCondition({pageIndex: 1, pageSize: 10}, function (res) {
                    if (res.code === 200) {
                        that.CodeSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getVdmCouponMonth () {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'summaryDate',
                    value: this.searchData.summaryDate
                }, {
                    name: 'activatedTime',
                    value: this.searchData.activatedTime
                }, {
                    name: 'activityGroup',
                    value: this.searchData.activityGroup
                }, {
                    name: 'brandName',
                    value: this.searchData.brandName
                }]
                api.getVdmCouponMonth(this.common.joinSearchParam(pathParams), function (res) {
                    that.simpleTableData = []
                    that.totalRecords = 0
                    if (res.code === 200) {
                        that.simpleTableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getVdmCouponRes () {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'startSummaryDate',
                    value: this.searchData.startSummaryDate
                }, {
                    name: 'endSummaryDate',
                    value: this.searchData.endSummaryDate
                }, {
                    name: 'activity',
                    value: this.searchData.activity
                }, {
                    name: 'activityGroup',
                    value: this.searchData.activityGroup
                }, {
                    name: 'oprMode',
                    value: this.searchData.oprMode
                }, {
                    name: 'resEntity',
                    value: this.searchData.resEntity.jdeCode
                }, {
                    name: 'issuingUnit',
                    value: this.searchData.issuingUnit
                }, {
                    name: 'resCode',
                    value: this.searchData.resCode
                }, {
                    name: 'resBrand',
                    value: this.searchData.resBrand
                },
                {
                    name: 'activityCode',
                    value: this.searchData.activityCode
                }
                ]
                api.getVdmCouponRes(this.common.joinSearchParam(pathParams), function (res) {
                    that.simpleTableData = []
                    that.totalRecords = 0
                    if (res.code === 200) {
                        that.simpleTableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getVdmCouponEntity () {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'startSummaryDate',
                    value: this.searchData.startSummaryDate
                }, {
                    name: 'endSummaryDate',
                    value: this.searchData.endSummaryDate
                }, {
                    name: 'activity',
                    value: this.searchData.activity
                }, {
                    name: 'activityGroup',
                    value: this.searchData.activityGroup
                }, {
                    name: 'oprMode',
                    value: this.searchData.oprMode
                }, {
                    name: 'resEntity',
                    value: this.searchData.resEntity.jdeCode
                }, {
                    name: 'resBrand',
                    value: this.searchData.resBrand
                },
                    {
                        name: 'activityCode',
                        value: this.searchData.activityCode
                    }]
                api.getVdmCouponEntity(this.common.joinSearchParam(pathParams), function (res) {
                    that.simpleTableData = []
                    that.totalRecords = 0
                    if (res.code === 200) {
                        that.simpleTableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getVdmCouponIssuing () {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'startSummaryDate',
                    value: this.searchData.startSummaryDate
                }, {
                    name: 'endSummaryDate',
                    value: this.searchData.endSummaryDate
                }, {
                    name: 'activity',
                    value: this.searchData.activity
                }, {
                    name: 'activityGroup',
                    value: this.searchData.activityGroup
                }, {
                    name: 'oprMode',
                    value: this.searchData.oprMode
                }, {
                    name: 'issuingUnit',
                    value: this.searchData.issuingUnit
                }, {
                    name: 'resBrand',
                    value: this.searchData.resBrand
                },
                    {
                        name: 'activityCode',
                        value: this.searchData.activityCode
                    }]
                api.getVdmCouponIssuing(this.common.joinSearchParam(pathParams), function (res) {
                    that.simpleTableData = []
                    that.totalRecords = 0
                    if (res.code === 200) {
                        that.simpleTableData = res.data.list
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getKeyNames(){
              api.listActivityName(res=>{
                   this.keyNames  = res.data
              })
            },
            showTips (text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                })
            },
            getStoreCode (res) {
                this.searchData.resCode = res;
            }

        },
        beforeMount () {
            this.getActivityGroup()
            this.getGroupAndName()
            this.getAllCompany()
            this.getAllBillingUnit()
            this.getBrandEnglishNames()
            this.getStoreName();
            this.getKeyNames();
            this.defaultHeader = this.simpleTableKey
        }
    }
</script>

<style>
</style>
