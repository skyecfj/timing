<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">交易日期</div>
        <!--<el-date-picker v-model="searchData.usedStartTime" type="date"-->
                        <!--value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>-->
        <!--<span>-</span>-->
        <!--<el-date-picker v-model="searchData.usedEndTime" type="date"-->
                        <!--value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerEnd"></el-date-picker>-->
        <limitDateRange
            v-on:changeDate="getDate"
            ref="limitDate"
        ></limitDateRange>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
          <el-select size="small" v-model="searchData.brandName" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="item in brandSelect" :key="item.id" :label="item.englishName" :value="item.englishName">
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">餐厅</div>
          <!--<el-select size="small" ref="storeName" v-model="searchData.storeId" remote :remote-method="remoteStoreName"-->
                     <!--:loading="loadingStoreName" v-scroll="scrollStoreName" filterable>-->
              <!--<el-option value="" label="请选择"></el-option>-->
              <!--<el-option v-for="item in storeSelect" :key="item.storeHypId" :label="item.dictionaryName"-->
                         <!--:value="item.dictionaryCode">-->
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
      <div class="selectContent">
        <div class="selectTitle">法人公司</div>
          <el-select size="small" v-model="searchData.resEntity" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="item in EntitySelect" :key="item.jdeCode" :label="`[${item.jdeCode}]${item.companyName}`"
                         :value="item.jdeCode">
                  <!--<span>[{{ item.jdeCode }}]</span>-->
                  <!--<span>{{ item.companyName }}</span>-->
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">财务市场</div>
          <el-select size="small" v-model="searchData.resFinMarket" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="item in finMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
                  <span>[{{ item.marketNumber }}]</span>
                  <span>{{ item.name }}</span>
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">营运市场</div>
          <el-select size="small" v-model="searchData.resOprMarket" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="item in OprMarketSelect" :key="item.id" :label="item.name" :value="item.marketNumber">
                  <span>[{{ item.marketNumber }}]</span>
                  <span>{{ item.name }}</span>
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券活动名称</div>
          <el-select size="small" v-model="searchData.activityGroup" @change="groupChange" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="(item, index) in activityGroupSelect" :key="index" :label="item" :value="item">
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券名称</div>
        <el-select size="small"  v-model="searchData.activity" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in activitySelect" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券码</div>
        <el-input size="small" v-model="searchData.couponCode"></el-input>
      </div>
      <!--<div class="selectContent">-->
        <!--<div class="selectTitle">发码平台</div>-->
        <!--<el-select size="small"  v-model="searchData.couponSource" filterable>-->
        <!--<el-option value="" label="请选择"></el-option>-->
        <!--<el-option v-for="(item, index) in couponSourceSelect" :key="index" :label="item" :value="item">-->
        <!--</el-option>-->
        <!--</el-select>-->
      <!--</div>-->
      <div class="selectContent">
        <div class="selectTitle">结算方</div>
          <el-select size="small" v-model="searchData.payerName">
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="(item, index) in payerNameSelect" :key="index" :label="item" :value="item">
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
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
      <div class="selectContent">
        <div class="selectTitle">法人归集</div>
          <el-select size="small" v-model="searchData.oprMode">
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="item in oprModeSelect" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券类型</div>
          <el-select size="small" v-model="searchData.couponTypeName" filterable>
              <el-option value="" label="请选择"></el-option>
              <el-option v-for="(item, index) in couponTypeSelect" :key="index" :label="item" :value="item">
              </el-option>
          </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">业务模式</div>
        <el-select size="small"  v-model="searchData.businessModel" filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in modelSelect" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">券码状态</div>
        <el-select size="small"  v-model="searchData.ifVdm" filterable>
          <el-option v-for="(item, index) in ifVdmSelect" :key="index" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" type="success"  @click="searchList(1)">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        <el-popover
                placement="right"
                trigger="click">
            <el-table :data="downloadList"  max-height="300" size="small"
                      v-loading="loadingList"
            >
                <el-table-column  property="exportType" label="导出类型" min-width="120"></el-table-column>
                <el-table-column  label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status ===0">已提交</span>
                        <span v-else-if="scope.row.status ===1 ">执行中</span>
                        <span v-else-if="scope.row.status ===2 ">已完成</span>
                        <span v-else-if="scope.row.status === 3">已失败</span>
                    </template>
                </el-table-column>
                <el-table-column  property="createTime" label="创建时间"  width="140"></el-table-column>
                <!--<el-table-column  property="finishTime" label="结束时间" width="140"></el-table-column>-->
                <el-table-column width="100" label="地址">
                    <template slot-scope="scope">
                        <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                        <a v-else  class="link-disable">下载</a>
                    </template>
                </el-table-column>
            </el-table>
            <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()" class="c-button">查看下载列表</el-button>

            <!--<el-button >click 激活</el-button>-->
        </el-popover>
    </div>
    <div class="dataContent">
      <report-table-com :tableData="simpleTableData" :tableKey="simpleTableKey"></report-table-com>
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
    import limitDateRange from '@/components/common/limitDateRange'
    import remoteSelect from '@/components/common/remoteSelect'
    export default {
        name: 'vdmCouponConsumeSea',
        data() {
            return {
                // pickerStart: {
                //     disabledDate: (time) => {
                //         if (this.searchData.usedEndTime) {
                //             let curDate = (new Date(this.searchData.usedEndTime)).getTime()
                //             let one = 30 * 24 * 3600 * 1000
                //             let oneMonths = curDate - one
                //             return time.getTime() < oneMonths || time.getTime() >= curDate
                //         } else {
                //             return false
                //         }
                //     }
                // },
                // pickerEnd: {
                //     disabledDate: (time) => {
                //         if (this.searchData.usedStartTime) {
                //             let curDate = (new Date(this.searchData.usedStartTime)).getTime()
                //             let one = 30 * 24 * 3600 * 1000
                //             let oneMonths = curDate + one
                //             return time.getTime() > oneMonths || time.getTime() < curDate - 86400000
                //         } else {
                //             return false
                //         }
                //     }
                // },
                searchData: {
                    usedStartTime: '',
                    usedEndTime: '',
                    brandName: '',
                    storeId: '',
                    resEntity: '',
                    resFinMarket: '',
                    resOprMarket: '',
                    activityGroup: '',
                    couponCode: '',
                    activity: '',
                    // couponSource: '',
                    payerName: '',
                    issuingUnit: '',
                    oprMode: '',
                    couponTypeName: '',
                    businessModel: '',
                    ifVdm: '',
                },
                brandSelect: [],
                loadingStoreName: false,
                storeSelect: [],
                EntitySelect: [],
                finMarketSelect: [],
                OprMarketSelect: [],
                activityGroupSelect: [],
                allActivity: [],
                activitySelect: [],
                // couponSourceSelect: [],
                payerNameSelect: [],
                issuingUnitSelect: [],
                oprModeSelect: [{
                    id: 1,
                    name: '加盟商'
                }, {
                    id: 2,
                    name: '市场公司'
                }],
                couponTypeSelect: [],
                modelSelect: [],
                ifVdmSelect: [{
                    name: '全部',
                    value: '-1'
                }, {
                    name: '核销',
                    value: '0'
                }, {
                    name: '撤销核销',
                    value: '1'
                }, {
                    name: '销毁',
                    value: '2'
                }],
                simpleTableData: [],
                simpleTableKey: [{
                    name: '消费餐厅编号',
                    value: 'storeId',
                    width: '110'
                }, {
                    name: '消费餐厅名称',
                    value: 'resName',
                    width: '110'
                }, {
                    name: '券码',
                    value: 'couponCode'
                }, {
                    name: '券码名称',
                    value: 'activity'
                }, {
                    name: '活动ID',
                    value: 'activityId'
                }, {
                    name: '券活动名称',
                    value: 'activityGroup',
                    width: '100'
                }, {
                    name: '活动批次',
                    value: 'activityGroupRound'
                }, {
                    name: 'POS交易号',
                    value: 'merchantPostTransId',
                    width: '110'
                }, {
                    name: '是否线上',
                    value: 'isOnline'
                }, {
                    name: '网上支付号',
                    value: 'orderId',
                    width: '110'
                }, {
                    name: '营业日期',
                    value: 'merchantPostOpenTime'
                }, {
                    name: '交易日期',
                    value: 'usedTime'
                }, {
                    name: '券面额',
                    value: 'faceAmount',
                    classname: 'sumClass'
                }, {
                    name: '券净额',
                    value: 'sales',
                    classname: 'sumClass'
                }, {
                    name: '消费者支付名称',
                    value: 'paymentNameA',
                    width: '120'
                }, {
                    name: '消费者支付价格',
                    value: 'invoiceAmountA',
                    width: '120',
                    classname: 'sumClass'
                }, {
                    name: '第三方补贴名称',
                    value: 'paymentNameB',
                    width: '120'
                }, {
                    name: '第三方补贴价格',
                    value: 'invoiceAmountB',
                    width: '120',
                    classname: 'sumClass'
                }, {
                    name: '积分兑换',
                    value: 'couponValue'
                }, {
                    name: '手续费',
                    value: 'poundage',
                    classname: 'sumClass'
                }, {
                    name: '售卖渠道',
                    value: 'placeChannelName'
                }, {
                    name: '发券品牌',
                    value: 'brandName'
                }, {
                    name: '营运市场',
                    value: 'resOprMarket'
                }, {
                    name: '财务市场',
                    value: 'resFinMarket'
                }, {
                    name: '城市',
                    value: 'resCity'
                }, {
                    name: '法人公司CODE',
                    value: 'resEntity',
                    width: '110'
                }, {
                    name: '法人公司名称',
                    value: 'resEntityName',
                    width: '120'
                }, {
                    name: '开票单位CODE',
                    value: 'issuingUnit',
                    width: '120'
                }, {
                    name: '开票单位名称',
                    value: 'issuingUnitName',
                    width: '120'
                }, {
                    name: '售券机构',
                    value: 'issuerName'
                }, {
                    name: '券类型',
                    value: 'couponTypeName'
                }, {
                    name: '收银机号',
                    value: 'merchantPostId'
                }, {
                    name: '业务模式',
                    value: 'businessModel'
                }, {
                    name: '发码平台',
                    value: 'couponSource'
                }, {
                    name: '结算方',
                    value: 'payerName'
                }, {
                    name: '券码状态',
                    value: 'flag'
                },
                    {
                        name: '核销时间',
                        value: 'transTime'
                    }
                ],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                consumeSearchData: {},
                selectIndex: 1,
                StoreNameSize: 10,
                query: '',
                downloadList:[],
                loadingList:false
            }
        },
        components: {
            reportTableCom,
            limitDateRange,
            remoteSelect
        },
        directives: {scroll},
        methods: {
            remoteStoreName(query) {
                this.selectIndex = 1
                this.loadingStoreName = true
                if (query !== '' && query !== '请选择') {
                    this.query = query
                } else {
                    this.query = ''
                }
                this.getAllStore()
            },
            scrollStoreName(param) {
                let that = this
                if (param) {
                    this.selectIndex += 1
                    this.getAllStore()
                }
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getVdmCouponConsume()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getVdmCouponConsume()
            },
            groupChange(val) {
                this.activitySelect = this.allActivity[val]
            },
            searchList(num) {
                let that = this;
                if (num === 1) {
                    this.currentPage = 1;
                }
                if (this.searchData.usedStartTime && this.searchData.usedEndTime) {
                    let temp = Object.keys(this.searchData).concat();
                    let flag = temp.splice(2, temp.length - 2).every(x => {
                        return !that.searchData[x]
                    });
                    if(flag && this.searchData.usedStartTime !== this.searchData.usedEndTime){ //只有交易日期
                        this.common.messageUtil({
                            type:'warning',
                            message:'当前筛选条件下，交易日期只能选择一天'
                        })
                        return;
                    }
                }else{
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择交易日期！'
                    })
                    return;
                }
                // this.consumeSearchData = JSON.parse(JSON.stringify(this.searchData))
                this.getVdmCouponConsume()
            },
            reset() {
                this.$refs.limitDate.reset();
                this.$refs.storeRef.reset();
                for (let key in this.searchData) {
                    this.searchData[key] = ''
                }
            },
            exportFile() {
                let that = this
                api.exportVdmCouponConsume(this.searchData,  function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        let link = document.createElement('a')
                        link.href = res
                        link.id = 'attachmentLink'
                        link.download = '电子券码核销查询报表.xlsx'
                        link.target = '_blank';link.click()
                    }
                })
            },
            getBrandEnglishNames() {
                let that = this
                let pathParams = [{
                    name: 'flag',
                    value: '2'
                }]
                api.getBrandEnglishNames(this.common.joinSearchParam(pathParams), function (res) {
                    if (res.code === 200) {
                        that.brandSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllCompany() {
                let that = this
                api.getAllCompany(function (res) {
                    if (res.code === 200) {
                        that.EntitySelect = res.data.list
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllFinanceMarket() {
                let that = this
                api.getAllFinanceMarket(function (res) {
                    if (res.code === 200) {
                        that.finMarketSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllOperateMarket() {
                let that = this
                api.getAllOperateMarket(function (res) {
                    if (res.code === 200) {
                        that.OprMarketSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getActivityGroup() {
                let that = this
                api.getActivityGroup(function (res) {
                    if (res.code === 200) {
                        that.activityGroupSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getGroupAndName() {
                let that = this
                api.getGroupAndName(function (res) {
                    if (res.code === 200) {
                        that.allActivity = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllBillingUnit() {
                let that = this
                api.getAllBillingUnit(function (res) {
                    if (res.code === 200) {
                        that.issuingUnitSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            // getCouponSource () {
            //   let that = this
            //   api.getCouponSource(function(res){
            //     if (res.code === 200) {
            //       that.couponSourceSelect = res.data
            //     } else if (res.code != 404) {
            //       that.showTips(res.msg,'warning')
            //     }
            //   })
            // },
            getPayerName() {
                let that = this
                api.getPayerName(function (res) {
                    if (res.code === 200) {
                        that.payerNameSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getAllStore() {
                let that = this
                let pathParams = [{
                    name: 'pageSize',
                    value: this.selectIndex
                }, {
                    name: 'branchCode',
                    value: this.query
                }]
                api.getAllStore(this.common.joinSearchParam(pathParams), function (res) {
                    that.loadingStoreName = false
                    if (res.code === 200) {
                        that.storeSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getBusinessModel() {
                let that = this
                api.getBusinessModel(function (res) {
                    if (res.code === 200) {
                        that.modelSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getCouponType() {
                let that = this
                api.getCouponType(function (res) {
                    if (res.code === 200) {
                        that.couponTypeSelect = res.data
                    } else if (res.code != 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            getVdmCouponConsume() {
                let that = this
                let pathParams = [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'usedStartTime',
                    value: this.searchData.usedStartTime
                }, {
                    name: 'usedEndTime',
                    value: this.searchData.usedEndTime
                }, {
                    name: 'brandName',
                    value: this.searchData.brandName
                }, {
                    name: 'storeId',
                    value: this.searchData.storeId
                }, {
                    name: 'resEntity',
                    value: this.searchData.resEntity
                }, {
                    name: 'resFinMarket',
                    value: this.searchData.resFinMarket
                }, {
                    name: 'resOprMarket',
                    value: this.searchData.resOprMarket
                }, {
                    name: 'activityGroup',
                    value: this.searchData.activityGroup
                }, {
                    name: 'activity',
                    value: this.searchData.activity
                },
                    //     {
                    // 	name: 'couponSource',
                    //   value: this.searchData.couponSource
                    // },
                    {
                        name: 'payerName',
                        value: this.searchData.payerName
                    }, {
                        name: 'issuingUnit',
                        value: this.searchData.issuingUnit
                    }, {
                        name: 'oprMode',
                        value: this.searchData.oprMode
                    }, {
                        name: 'couponCode',
                        value: this.searchData.couponCode
                    }, {
                        name: 'couponTypeName',
                        value: this.searchData.couponTypeName
                    }, {
                        name: 'businessModel',
                        value: this.searchData.businessModel
                    }, {
                        name: 'ifVdm',
                        value: this.searchData.ifVdm
                    }]
                api.getVdmCouponConsume(this.common.joinSearchParam(pathParams), function (res) {
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
            showTips(text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                })
            },
            getDate(res){
                if(res && res.length>1){
                    this.searchData.usedStartTime = res[0]
                    this.searchData.usedEndTime = res[1]
                }else{
                    this.searchData.usedStartTime = '';
                    this.searchData.usedEndTime = '';
                }
            },
            getStoreCode(res){
                this.searchData.storeId = res;
            },
            getDownloadList(param){
                var that = this;
                this.loadingList = true;
                api.getDownloadListDr('?pageSize=9999999&exportTypes=电子券码核销查询',function(res){
                    that.downloadList = res.data.list;
                    that.loadingList = false;
                })
            },
        },
        beforeMount() {
            this.getActivityGroup()
            this.getGroupAndName()
            this.getAllCompany()
            this.getAllFinanceMarket()
            this.getAllOperateMarket()
            this.getBrandEnglishNames()
            this.getAllBillingUnit()
            // this.getCouponSource()
            this.getPayerName()
            this.getAllStore()
            this.getBusinessModel()
            this.getCouponType()
            this.defaultHeader = this.simpleTableKey
        }
    }
</script>

<style>
    .link{
        color:-webkit-link;
    }
    .link-disable{
        color:#bdbdbd;
        cursor:not-allowed
    }
</style>
