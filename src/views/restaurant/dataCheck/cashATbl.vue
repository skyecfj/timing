<!--cash_a表-->
<template>
  <div class="cash-a-content" >
    <!-- search -->
    <div class="search-content" >
      <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                    v-on:rangeDatechange="rangeDatechange" ></searchHeader>
      <el-button size="small"  type="success" class="findButt" @click="getData">查询</el-button>
      <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
      <el-button size="small"  type="success" class="findButt" @click="exportCashaDetail">导出</el-button>
      <el-button size="small"  type="success" class="findButt" @click="showCatchDataDialog('批量获取')">批量获取</el-button>
    </div>

    <div class="content" >
      <el-row class="tbl-control" >
        <div v-if="supplementAttachment.url" class="supplement-attachment-content" >
          补录附件：
          <a v-if="supplementAttachment.url" :href="supplementAttachment.url" target="_blank" class="supplement-attachment" >
            <el-button type="text" class="link-btn" >{{supplementAttachment.name}}</el-button>
          </a>
        </div>
        <el-button size="small"  type="success" @click="toDelete" :disabled="!collatReport.length" >删除</el-button>
      </el-row>
      <el-table :data="collatReport" style="width: 100%" :row-class-name="tableRowClassName" :height="tblHeight">
        <el-table-column label="JDE科目" width="100" align="center" >
          <template slot-scope="scope" >
            <el-tooltip :disabled="!hasJDEsubjectName" effect="dark" :content="currentJDEsubjectName" placement="top" >
              <span @mouseover="checkJDEsubjectName(scope.row.jdeCode)" >{{scope.row.jdeCode}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="FSC活动名称" width="150" align="center">
          <template slot-scope="scope" >
            <el-popover v-if="scope.row.cashaDetailSrcs && scope.row.cashaDetailSrcs.length" placement="bottom-start" class="fsc-popover" width="450" trigger="click">
              <el-table :data="scope.row.cashaDetailSrcs" :show-header="false" >
                <el-table-column prop="bohItemCode" ></el-table-column>
                <el-table-column prop="bohSysAmount" ></el-table-column>
                <el-table-column prop="bohConfirmAmount" ></el-table-column>
              </el-table>
              <el-button type="text" slot="reference" class="link-btn fsc-activity" :title="scope.row.fscActivityCode" >{{scope.row.fscActivityCode}}</el-button>
            </el-popover>
            <span v-if="!scope.row.cashaDetailSrcs || !scope.row.cashaDetailSrcs.length" class="fsc-activity" :title="scope.row.fscActivityCode" >{{scope.row.fscActivityCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="bohSysAmount" label="BOH应收金额" align="center" ></el-table-column>
        <el-table-column prop="bohConfirmAmount" label="BOH实收金额" align="center" ></el-table-column>
        <el-table-column prop="billAmount" label="账单金额" align="center" ></el-table-column>
        <el-table-column label="账务核对+手工调整" align="center" >
          <el-table-column prop="adjustAmount" label="当月调整" align="center" ></el-table-column>
          <el-table-column prop="adjustAmountNext" label="次月调整" align="center" ></el-table-column>
        </el-table-column>
        <el-table-column prop="finalAmount" label="final" align="center" ></el-table-column>
        <el-table-column prop="orAmount" label="待调整OR" align="center" >
          <template slot-scope="scope" >
            <span v-if="scope.row.fscActivityCode != '现金' && scope.row.fscActivityCode != '支票'" >{{scope.row.orAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="adjustmentType" label="调整类型" align="center" >
          <template slot-scope="scope" >
            <el-button type="text" class="link-btn" @click="showAdjustDetail(scope.row.cashaResults)" >
              <span v-if="scope.row.cashaResults && scope.row.cashaResults.length > 2" >{{scope.row.cashaResults[0].resultCode}}、{{scope.row.cashaResults[1].resultCode}}..</span>
              <template v-if="scope.row.cashaResults && scope.row.cashaResults.length < 3"  >
                <span v-for="(item,index) in scope.row.cashaResults" :key="item.resultCode + '_' + index">{{item.resultCode}}
                  <template v-if="index+1 < scope.row.cashaResults.length" >、</template>
                </span>
              </template>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="附件" align="center" width="80" >
          <template slot-scope="scope" >
            <el-button  v-if="scope.row.fscActivityCode != 'OR' && scope.row.fscActivityCode != '非现金小计' && scope.row.fscActivityCode != '结算金额合计'"
                        type="text" class="link-btn" @click="showAttachDialog(scope.row)" >附件</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 附件list弹框 -->
    <el-dialog title="附件" :visible.sync="attachDialogVisible" width="20%" custom-class="attachments-dialog" >
      <el-card shadow="never" :body-style="cardStyle"  >
        <div v-for="item in fileObjTemp.files" :key="item.id" class="text item" >
          <a :href="item.url" target="_blank" class="attach-item" >{{item.name}}</a>
        </div>
      </el-card>
    </el-dialog>
    <!-- 调整类型详情弹框 -->
    <el-dialog title="调整详情" :visible.sync="adjustDetailDialogVisible" custom-class="adjust-detail-dialog" >
      <el-table :data="adjustDetail">
        <el-table-column property="amount" label="手工调整" >
          <template slot-scope="scope" >
            <span v-if="!scope.row.isEdit" >{{scope.row.amount}}</span>
            <span v-if="scope.row.auditState == 0"  >待审核</span>
          </template>
        </el-table-column>
        <el-table-column property="resultCode" label="调整类型" ></el-table-column>
        <el-table-column property="adjustDesc" label="调整类型说明" ></el-table-column>
        <el-table-column property="fscActivityCode" label="调整对象" ></el-table-column>
        <el-table-column property="remark" label="原因备注" ></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 批量获取,导出弹框 -->
    <el-dialog :title="dialogTitle" :visible.sync="catchDataDialogVisible" custom-class="catch-data-dialog" width="55%" :close-on-click-modal="false" @closed="dialogClosed" >
      <el-form ref="regetDataForm" :model="dataRegetObj" :inline="true" >
        <el-form-item label="营业日期" >
          <el-date-picker type="daterange" range-separator="-" value-format="yyyy-MM-dd" :unlink-panels="true" size="small"
                          v-model="dateRange" :clearable="true" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="dialogTitle == '批量获取'" key="catchDataMarket" label="财务市场" >
          <el-select value-key="marketId" v-model="dataRegetObj.marketId" size="medium" @change="changeMarket" filterable >
            <el-option label="请选择" value="" ></el-option>
            <el-option  v-for="item in marketList" :key="item.marketId" :label="item.marketEnglishName" :value="item" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人公司" >
          <el-select  v-model="dataRegetObj.companyJde" filterable remote placeholder="请输入法人公司名称进行查询" size="medium" @change="changeCompany"
                      :remote-method="getCompany" :loading="getCompanyLoading" @visible-change="toogleCompanyDropDown" v-scroll="companyScroll" >
            <el-option  v-for="item in companyList" :key="item.jdeCode" :label="item.companyName" :value="item.jdeCode" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐厅编号" >
          <el-select  v-model="dataRegetObj.storeCodes" multiple filterable remote placeholder="请输入餐厅编号进行查询" reserve-keyword  v-scroll="storeScroll"
                      :remote-method="getStore" :loading="getStoreLoading" @visible-change="toogleStoreDropDown"  @change="storeChange" clearable >
            <el-option v-for="(item,index) in storeList" :key="item.storeHypId" :label="item.storeHypId" :value="item.storeHypId" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="dialogTitle == '批量获取'" type="success" @click="cashaReget" key="catchDataConfirmBtn">获 取</el-button>
        <el-button type="success" :plain="true" @click="catchDataDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import apidr from '../../../model/apidr'
  import api from '../../../model/api'
  import scroll from '@/directives/index'
  //查询form组件
  import searchHeader from './dataCheckComponent/searchHeader'
  //查询form配置
  import pageUtil from '../../../utils/restaurant/dataCheck/cash_aTbl'

	export default {
    name:'CashATBl',
    components:{
      searchHeader
    },
    directives: { scroll },
    created(){},
    beforeMount(){
      let windowHeight = window.innerHeight;
      this.tblHeight = windowHeight * 0.65;
      this.getAllAccountingSubjects();
      this.getMarket();
      this.getCompany('');
      this.getStore('');
      this.setSearchStoreConfig();
    },
    mounted(){},
		data() {
			return {
        tblHeight : 0,
        attachDialogVisible : false,
        adjustDetailDialogVisible : false,
        catchDataDialogVisible : false,
        dialogTitle : '',
        exportConfigDialogVisible : false,
        hasJDEsubjectName : false,
        currentJDEsubjectName : '',
        cardStyle : {
          border : 'none'
        },
        //暂存文件对象
        fileObjTemp: {
          id : '',
          files : []
        },
        pageUtil : pageUtil,
        //
        fileObjForSubmit: {},
        searchObj:{
          resCode: '',
          verifyStartTime: '',
          verifyEndTime: ''
        },
        tempSearchObj:{},
        accountingSubjects:[],
        collatReport:[],
        dataRegetObj:{
          marketId   : '',
          companyJde : '',
          storeCodes : []
        },
        dateRange   : [],
        marketList  : [],
        companyList : [],
        billUnitOpts: [],
        exportActs  : [],
        storeList   : [],
        tempMarketId: '',
        tempCompany : '',
        getCompanyLoading : false,
        getStoreLoading   : false,
        adjustDetail      : [],
        companyScrollPageIndex  : 1,
        companyScrollFlag       : true,
        companySelectObj        : {},
        tempComanySearchKeyWord : '',
        storeScrollPageIndex    : 1,
        storeScrollFlag         : true,
        storeSelectObj          : {},
        tempStoreSearchKeyword  : '',
        searchStoreScrollPageIndex : 1,
        searchStoreScrollFlag      : true,
        searchStoreSelectObj       : {},
        tempSearchStoreKeyWord     : '',
        supplementAttachment       : {}
			}
    },
    watch : {
      marketIdChanged(val,oldVal){
        this.tempMarketId = oldVal;
      },
      companyJdeChanged(val,oldVal){
        if(!val){
          this.companyList = [];
          this.getCompany('');
        }
        this.tempCompany = oldVal;
      },
      storeCodesChanged(val,oldVal){
        if(!val.length){
          this.storeList = [];
          this.getStore('');
        }
        this.tempCompany = oldVal;
      }
    },
    computed: {
      marketIdChanged() {
  　　　　return this.dataRegetObj.marketId
  　　},
      companyJdeChanged(){
        return this.dataRegetObj.companyJde
      },
      storeCodesChanged(){
        return this.dataRegetObj.storeCodes
      }
    },
    methods: {
      setSearchStoreConfig(){
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
        searchStoreConfig.remoteMethod = (query) => {
          console.log(query);
          this.searchStoreCodeRemote(query);
        };
        searchStoreConfig.scrollMethod = (param,object) => {
          this.searchStoreScrollMethod(param,object);
        };
        searchStoreConfig.visibleChange = (isVisible) => {
          if(!isVisible && !pageUtil.searchConfig.searchObj.storeCode){
            searchStoreConfig.opts = [];
            this.searchStoreCodeRemote('');
          }else{
            this.searchStoreCodeRemote(pageUtil.searchConfig.searchObj.storeCode);
          }
        };
        searchStoreConfig.keyupFn = (event) => {
          if(!event.target.value){
            this.searchStoreCodeRemote('');
          }
        }
        this.searchStoreCodeRemote('');
      },
      searchStoreScrollMethod(param,object){
        let _self = this;
        if(param){
          this.searchStoreSelectObj = object;
          if(this.searchStoreScrollFlag){
            this.searchStoreScrollPageIndex++;
            let param = {
              pageSize   : 20,
              pageIndex  : this.searchStoreScrollPageIndex,
              storeHypId : this.tempSearchStoreKeyWord,
              judgePermission : true
            };
            api.getSelectSearchCondition(param,function(res){
              if(res.code === 200){
                pageUtil.searchConfig.searchConditions[1].otherConfig.opts = pageUtil.searchConfig.searchConditions[1].otherConfig.opts.concat(res.data);
              }else{
                _self.searchStoreScrollFlag = false;
              }
            })
          }
        }
      },
      searchStoreCodeRemote(query){
        let _self = this;
        pageUtil.searchConfig.searchConditions[1].otherConfig.remoteLoading = true;
        this.searchStoreScrollPageIndex = 1;
        this.tempSearchStoreKeyWord = query;
        if(JSON.stringify(this.searchStoreSelectObj) !== '{}'){
          this.searchStoreSelectObj.scrollTop = 0;
        }
        let param = {
          pageSize   : 20,
          pageIndex  : this.searchStoreScrollPageIndex,
          storeHypId : query,
          judgePermission : true
        };
        api.getSelectSearchCondition(param,function(result){
          pageUtil.searchConfig.searchConditions[1].otherConfig.remoteLoading = false;
          if(result.code == 200){
            pageUtil.searchConfig.searchConditions[1].otherConfig.opts = result.data;
          }else if(result.code == 404){
            pageUtil.searchConfig.searchConditions[1].otherConfig.opts = [];
            pageUtil.searchConfig.searchObj.storeCode = '';
          }
        })
      },
      tableRowClassName({row, rowIndex}) {
        if(row.fscActivityCode === 'OR' || row.fscActivityCode === '非现金小计' || row.fscActivityCode === '含税收入') {
          return 'summury-row';
        }else if(row.fscActivityCode === '结算金额合计'){
          return 'summury-row border-bottom';
        }else{
          return '';
        }
      },
      //search组件 范围变量变化
      rangeDatechange(emitObj){
        let _self = this;
        for(let searchKey in pageUtil.searchConfig.searchObj){
          for(let emitObjKey in emitObj){
            if(searchKey == emitObjKey){
              pageUtil.searchConfig.searchObj[searchKey] = emitObj[emitObjKey];
            }
          }
        }
      },
      //附件弹框
      showAttachDialog(rowObj) {
        let _self = this;
        let param = this.common.formatPathParam({
          fscActivityCode : rowObj.fscActivityCode,
          beginDate : pageUtil.searchConfig.searchObj.beginDate,
          endDate   : pageUtil.searchConfig.searchObj.endDate,
          storeCode : pageUtil.searchConfig.searchObj.storeCode
        })
        this.fileObjTemp = Object.assign({},{
          id    : rowObj.fscActivityCode,
          files : []
        });
        apidr.getCashaAttachments(param,function(res){
          if(res.code === 200){
            _self.fileObjTemp.files = res.data.concat();
            _self.attachDialogVisible = true;
          }else if(res.code === 404){
            _self.common.messageUtil({
              message: '暂无附件',
              type: 'warning'
            });
          }else{
            _self.common.errorMessage(res.msg);
          }
        });
      },
      //调整详情弹框
      showAdjustDetail(adjustDetails){
        this.adjustDetail = Object.assign([],adjustDetails);
        this.adjustDetailDialogVisible = true;
      },
      //批量获取，导出弹框
      showCatchDataDialog(type){
        this.dataRegetObj = {
          marketId   : '',
          companyJde : '',
          storeCodes : []
        };
        this.getCompany('');
        this.getStore('');
        this.dateRange = [];
        this.dialogTitle = type;
        this.catchDataDialogVisible = true;
      },
      //查询列表
      getData(){
        let _self = this;
        //console.log(pageUtil.searchConfig.searchObj);
        let searchObj = pageUtil.searchConfig.searchObj;
        if(searchObj.beginDate && searchObj.endDate && searchObj.storeCode){
          let param = this.common.formatPathParam(searchObj);
          apidr.getCashAData(param,function(result){
            _self.supplementAttachment = {};
            _self.tempSearchObj = {};
            _self.collatReport = [];
            if(result.code == 200){
              _self.collatReport = result.data.cashaDetails;
              _self.tempSearchObj = Object.assign({},searchObj);
              _self.supplementAttachment = Object.assign({},result.data.supplementAttachment);
              //TODO
              // _self.collatReport[1].cashaResults = Object.assign([],_self.tempAdjustDatail1);
              // _self.collatReport[2].cashaResults = Object.assign([],_self.tempAdjustDatail2);
            }else if(result.code != 404){
              _self.common.messageUtil({
                message: result.msg,
                type: 'error'
              });
            }
          })
        }else if(!searchObj.beginDate && !searchObj.endDate && !searchObj.storeCode){
          _self.common.messageUtil({
            message: '请输入营业日期和餐厅编号',
            type: 'warning'
          });
        }else if(!searchObj.beginDate || !searchObj.endDate){
          _self.common.messageUtil({
            message: '请输入营业日期',
            type: 'warning'
          });
        }else if(!searchObj.storeCode){
          _self.common.messageUtil({
            message: '请输入餐厅编号',
            type: 'warning'
          });
        }
      },
      exportCashaDetail(){
        let _self = this;
        let searchObj = pageUtil.searchConfig.searchObj;
        if(!searchObj.beginDate && !searchObj.endDate && !searchObj.storeCode){
          _self.common.messageUtil({
            message: '请选择营业日期和餐厅编号',
            type: 'warning'
          });
          return false;
        }
        if(!searchObj.beginDate || !searchObj.endDate){
          _self.common.messageUtil({
            message: '请选择营业日期',
            type: 'warning'
          });
          return false;
        }
        if(!searchObj.storeCode){
          _self.common.messageUtil({
            message: '请选择餐厅编号',
            type: 'warning'
          });
          return false;
        }
        let param = this.common.formatPathParam(searchObj);
        apidr.exportCashaDetails(param,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            link.download = 'cashA.xlsx'
            link.target = '_blank';link.click();
          }
        })
      },
      //删除
      toDelete(){
        let _self = this;
        let searchObj = pageUtil.searchConfig.searchObj;
        this.$confirm('确认删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(_self.tempSearchObj);
          let param =  this.common.formatPathParam(_self.tempSearchObj)
          apidr.deleteCashAData(param,function(result){
            if(result.code == 200){
              _self.common.messageUtil({
                message: result.data,
                type: 'success'
              });
              _self.getData();
            }else{
              _self.common.messageUtil({
                message: result.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {

        });
      },
      //获取所有JDE科目
      getAllAccountingSubjects(){
        let _self = this;
        let param = this.common.formatPathParam({
          pageIndex  : 1,
          pageSize   : 999999
        });
        api.getAccountingSubjectList(param,function(res){
          if(res.code === 404){
            _self.accountingSubjects = [];
          }else if(res.code === 200){
            _self.accountingSubjects = res.data.list;
          }
        });
      },
      //获取JDE科目中文名
      checkJDEsubjectName(jdeCode){
        let _self = this;
        this.hasJDEsubjectName = false;
        this.accountingSubjects.forEach(function(item,index){
          if(jdeCode == item.subjectNum){
            _self.hasJDEsubjectName = true;
            _self.currentJDEsubjectName = item.subjectName;
          }
        });
        if(!this.hasJDEsubjectName){
          this.currentJDEsubjectName = ''
        }
      },
      //获取所有财务市场
      getMarket(){
        let _self = this;
        //获取所有财务市场
        api.getDictionaryByNumber('MARKETTYPE',function(res){
          if(res.code == 200){
            let tempMarketCategory = '';
            res.data.forEach(function(item,index){
              if(item.dictionaryEntryName == '财务市场'){
                  tempMarketCategory = item.id;
              }
            });
            let marketSearchParam = _self.common.formatPathParam({
              pageIndex : 1,
              pageSize  : 999999,
              marketCategory : tempMarketCategory
            });
            api.getMarketList(marketSearchParam,function(result){
              if(result.code == 200){
                _self.marketList = result.data.list;
              }else if(result.code == 404){
                _self.collatReport = [];
              }
            });
          }
        });
      },
      changeMarket(val){
        let _self = this;
        this.getCompany('');
        this.getStore('');
        if(this.dataRegetObj.companyJde || this.dataRegetObj.storeCodes.length){
          this.$confirm('更改财务市场法人公司和餐厅编号将会被清空?', '提示', {
            confirmButtonText: '确定更改',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dataRegetObj.companyJde = '';
            this.dataRegetObj.storeCodes = [];
          }).catch(() => {
            this.dataRegetObj.marketId = this.tempMarketId;
          });
        }
      },
      companyScroll(param,object){
        let _self = this;
        if(param){
          this.companySelectObj = object;
          if(this.companyScrollFlag){
            this.companyScrollPageIndex++;
            let param = this.common.formatPathParam({
              pageSize  : 20,
              pageIndex : this.companyScrollPageIndex,
              companyName : this.tempComanySearchKeyWord,
              marketId    : this.dataRegetObj.marketId.marketId
            });
            api.getCompanyByFMarket(param,function(res){
              if(res.code === 200){
                _self.companyList = _self.companyList.concat(res.data);
              }else{
                _self.companyScrollFlag = false;
              }
            })
          }
        }
      },
      //获取法人公司
      getCompany(query){
        let _self = this;
        this.getCompanyLoading = true;
        this.companyScrollPageIndex = 1;
        this.tempComanySearchKeyWord = query;
        if(JSON.stringify(this.companySelectObj) !== '{}'){
          this.companySelectObj.scrollTop = 0;
        }
        let param = this.common.formatPathParam({
          pageIndex   : this.companyScrollPageIndex,
          pageSize    : 20,
          companyName : query,
          marketId    : _self.dataRegetObj.marketId.marketId? _self.dataRegetObj.marketId.marketId : null
        });
        api.getCompanyByFMarket(param,function(result){
          _self.getCompanyLoading = false;
          if(result.code == 200){
            _self.companyList = result.data;
          }else if(result.code == 404){
            _self.companyList = [];
          }
        })
      },
      //法人公司下拉框收起
      toogleCompanyDropDown(isVisible){
        if(!isVisible){
          if(!this.dataRegetObj.marketId){
            this.companyList = [];
            this.getCompany('');
          }
        }
      },
      changeCompany(val){
        let _self = this;
        this.getStore('');
        if(this.dataRegetObj.storeCodes.length){
          let confirmText = '更改法人公司餐厅编号将会被清空?'
          this.$confirm(confirmText, '提示', {
            confirmButtonText: '确定更改',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.dataRegetObj.storeCodes = [];
          }).catch(() => {
            this.dataRegetObj.companyJde = this.tempCompany;
          });
        }
      },
      storeScroll(param,object){
        let _self = this;
        if(param){
          this.storeSelectObj = object;
          if(this.storeScrollFlag){
            this.storeScrollPageIndex++;
            let param = {
              pageSize   : 20,
              pageIndex  : this.storeScrollPageIndex,
              storeHypId : this.tempStoreSearchKeyword,
              companyCode     : this.dataRegetObj.companyJde? this.dataRegetObj.companyJde : null,
              financialMarket : this.dataRegetObj.marketId.marketEnglishName? this.dataRegetObj.marketId.marketEnglishName : null
            };
            api.getSelectSearchCondition(param,function(res){
              if(res.code === 200){
                _self.storeList = _self.storeList.concat(res.data);
              }else{
                _self.storeScrollFlag = false;
              }
            })
          }
        }
      },
      //获取餐厅
      getStore(query){
        let _self = this;
        this.storeScrollPageIndex = 1;
        if(JSON.stringify(this.storeSelectObj) !== '{}'){
          this.storeSelectObj.scrollTop = 0;
        }
        this.tempStoreSearchKeyword = query;
        let param = {
          pageSize   : 20,
          pageIndex  : this.storeScrollPageIndex,
          storeHypId : query,
          companyCode     : this.dataRegetObj.companyJde? this.dataRegetObj.companyJde : null,
          financialMarket : this.dataRegetObj.marketId.marketEnglishName? this.dataRegetObj.marketId.marketEnglishName : null,
        };
        api.getSelectSearchCondition(param,function(result){
          _self.getStoreLoading = false;
          if(result.code == 200){
            _self.storeList = result.data;
          }else if(result.code == 404){
            _self.storeList = [];
          }
        })
        // if(query !== '') {

        // }else {
        //   this.storeList = [];
        // }
      },
      toogleStoreDropDown(isVisible){
        this.getStore('');
        if(!isVisible){
          if(!this.dataRegetObj.storeCodes.length){
            this.storeList = [];
          }
        }
      },
      storeChange(val){
        if(!this.dataRegetObj.storeCodes.length){
          this.storeList = [];
          this.getStore('');
        }
      },
      cashaReget(){
        let _self = this;
        if(this.dateRange.length < 2){
          this.common.messageUtil({
            message: '请选择完整的营业日期',
            type: 'warning'
          });
        }else if(!this.dataRegetObj.companyJde && !this.dataRegetObj.marketId && !this.dataRegetObj.storeCodes.length){
          this.common.messageUtil({
            message: '请至少再选择一个筛选条件',
            type: 'warning'
          });
        }else{
          let param = {
            bizDateBegin : this.dateRange[0]? this.dateRange[0] : null,
            bizDateEnd   : this.dateRange[1]? this.dateRange[1] : null,
            companyJde   : this.dataRegetObj.companyJde? this.dataRegetObj.companyJde : null,
            market       : this.dataRegetObj.marketId.marketEnglishName? this.dataRegetObj.marketId.marketEnglishName : null ,
            storeCodes   : this.dataRegetObj.storeCodes? this.dataRegetObj.storeCodes :null
          };
          console.log(param);
          apidr.cashaReget(param,function(result){
            _self.catchDataDialogVisible = false;
            if(result.code == 200){
              _self.common.messageUtil({
                message: result.data,
                type: 'success'
              });
            }else{
              _self.common.messageUtil({
                message: result.msg,
                type: 'warning'
              });
            }
          })
        }
      },
      dialogClosed(){
        this.dateRange = [],
        this.dataRegetObj = {
          companyCode : '',
          storeCodes  : [],
          marketId    : {}
        }
      },
      reset(){
        pageUtil.searchConfig.searchObj.reset = true;
      }
    }
	}
</script>

<style lang="scss">
.el-popover{
  max-height: 300px;
  overflow-y: auto;
}
.attachments-dialog{
  .el-dialog__body{
    padding: 0 0;
    .attach-item{
      display: block;
      padding: 5px 0;
      text-decoration: underline;
      color: #409EFF;
    }
  }
}
.fsc-activity{
    display: inline-block;
    max-width: 120px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.el-button--text{
  padding-top: 7px;
  padding-bottom: 7px;
}
tr.el-table__row.summury-row {
  font-weight: 700;
}
tr.el-table__row.summury-row.border-bottom td {
    border-bottom: 1px solid #000;
}
.supplement-attachment-content{
  display: inline-block;
  margin-right: 10px;
}
.export-acts-content{
  width: 100%;
  .el-form-item__content{
    width: 70%;
    .el-select{
      width: 100%;
    }
  }
}
</style>









