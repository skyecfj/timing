<!--其他业务收入明细报表-->
<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                    v-on:rangeDatechange="rangeDatechange" 
                    v-on:clearDateRange="clearDateRange" ></searchHeader>
      <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
      <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
      <el-button size="small"  type="success" class="findButt" @click="doExport">下载</el-button>
      <el-popover placement="right" trigger="click">
        <el-table :data="downloadList" v-loadmore="loadMore"  max-height="300" size="small"
                  v-loading="loadingList"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-table-column  property="exportType" label="导出类型"  width="120"></el-table-column>
          <el-table-column  label="状态" width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.status ===0">已提交</span>
                    <span v-else-if="scope.row.status ===1 ">执行中</span>
                    <span v-if="scope.row.status ===2 ">已完成</span>
                    <span v-else-if="scope.row.status === 3">已失败</span>
                </template>
            </el-table-column>
            <el-table-column  property="createTime" label="创建时间"  width="140"></el-table-column>
            <el-table-column width="100" label="地址">
                <template slot-scope="scope">
                    <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                    <a v-else  class="link-disable">下载</a>
                </template>
            </el-table-column>
        </el-table>
        <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()" class="c-button">查看下载列表</el-button>
    </el-popover>
    </div>

    <div class="content" >
      <tableOrigin  ref="BOHandThirdPartBillCheckMainTbl"
                    :tableHead="mainTblConfig.tableHead"
                    :align="mainTblConfig.align"
                    :dynamicData="dynamicData"
                    @handleSizeChange ="handleSizeChange"
                    @handleCurrentChange = "handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage">
      </tableOrigin>
    </div>
  </div>
</template>
<script>
  import api from '@/model/api'
  import apiStore from '@/model/apidr'
  import Vue from 'vue'
  //查询form组件
  import searchHeader from '../restaurant/dataCheck/dataCheckComponent/searchHeader'
  //查询form配置
  import pageUtil from '../../utils/restaurant/report/otherIncomeDetailReport'
  //表格
  import tableOrigin from '../restaurant/BOHDataMg/originalTable'
	export default {
    name:'OtherIncomeDetailReport',
    activated(){},
    deactivated(){},
    components:{
      searchHeader,
      tableOrigin
    },
    created(){
      Vue.directive('loadmore', {
        bind(el, binding) {
          const selectWrap = el.querySelector('.el-table__body-wrapper');
          selectWrap.addEventListener('scroll', function() {
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
            if(scrollDistance <= 0){
                binding.value()
            }
          })
        }
      },{passive: true})
    },
    beforeMount(){
      //console.log(pageUtil);
      //法人公司查询配置
      this.setSearchCompanyConfig();
      this.setSearchStoreConfig();
      this.setSearchDateConfig();
    },
    mounted(){},
		data() {
			return {
        pageUtil : pageUtil,
        mainTblConfig: {
          tableHead: [
            {
              label : '餐厅',
              prop  : 'storeChineseName'
            },
            {
              label : '法人公司',
              prop  : 'companyCode'
            },
            {
              label : '财务市场',
              prop  : 'financialMarket'
            },
            {
              label : '交易日期',
              prop  : 'bizDate'
            },
            {
              label : '项目名称',
              prop  : 'itemName'
            },
            {
              label : '金额',
              prop  : 'amount'
            }
          ],
          align : 'center'
        },
        dynamicData  : [],
        currentPage  : 1,
        pageSizeOpt  : [25,50,75,100,125],
        pageSize     : 25,
        totalRecords : 0,
        downloadList:[],
        loadingList:false,
        loadSign:true,
        startTimeVal: '',
        searchCompanyScrollPageIndex : 1,
        searchCompanyScrollFlag      : true,
        searchCompanySelectObj       : {},
        tempSearchCompanyKeyWord     : '',
        searchStoreScrollPageIndex : 1,
        searchStoreScrollFlag      : true,
        searchStoreSelectObj       : {},
        tempSearchStoreKeyWord     : ''
			}
		},
    computed: {
      onRangeDatePick() {
        let _self = this;
        return {
          onPick:(dateRange) =>{
            _self.startTimeVal =  new Date(dateRange.minDate).getTime();
          },
          disabledDate:(time) =>{
            if(_self.startTimeVal){
                return time.getTime() <= _self.startTimeVal-7*24*60*60*1000 || time.getTime() >= _self.startTimeVal + 7*24*60*60*1000
            }else{
                return false;
            }  
          }
        }  
      }
    },
    methods: {
      // //法人公司查询配置
      setSearchCompanyConfig(){
        let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
        searchCompanyConfig.remoteMethod = (query) => {
          //console.log(query);
          this.searchCompanyRemote(query);
        };
        searchCompanyConfig.scrollMethod = (param,object) => {
          this.searchCompanyScrollMethod(param,object);
        };
        searchCompanyConfig.visibleChange = (isVisible) => {
          if(!isVisible && !pageUtil.searchConfig.searchObj.companyName){
            searchCompanyConfig.opts = [];
            this.searchCompanyRemote('');
          }else{
            //this.searchCompanyRemote(pageUtil.searchConfig.searchObj.companyName);
          }
        };
        this.searchCompanyRemote('');
      },
      setSearchDateConfig(){
        let searchDateConfig = pageUtil.searchConfig.searchConditions[0];
        searchDateConfig.pickOptions = this.onRangeDatePick;
      },
      setSearchStoreConfig(){
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
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
      
      //法人公司下拉查询和远程查询
      searchCompanyScrollMethod(param,object){
        let _self = this;
        let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
        if(param){
          this.searchCompanySelectObj = object;
          if(this.searchCompanyScrollFlag){
            this.searchCompanyScrollPageIndex++;
            let param = this.common.formatPathParam({
              companyName  : this.tempSearchCompanyKeyWord,
              //marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
              pageIndex    : this.searchCompanyScrollPageIndex,
              pageSize     : 20,
              judgePermission : true
            });
            api.getAllCompanyIdNamess(param,function(res){
              if(res.code === 200){
                searchCompanyConfig.opts = searchCompanyConfig.opts.concat(res.data.list);
              }else{
                _self.searchCompanyScrollFlag = false;
              }
            })
          }
        }
      },
      searchCompanyRemote(query){
        let _self = this;
        let searchCompanyConfig = pageUtil.searchConfig.searchConditions[1].otherConfig;
        searchCompanyConfig.remoteLoading = true;
        this.searchCompanyScrollPageIndex = 1;
        this.tempSearchCompanyKeyWord = query;
        this.searchCompanyScrollFlag = true;
        if(JSON.stringify(this.searchCompanySelectObj) !== '{}'){
          this.searchCompanySelectObj.scrollTop = 0;
        }
        let param = this.common.formatPathParam({
          companyName  : query,
          pageIndex    : this.searchCompanyScrollPageIndex,
          pageSize     : 20,
          judgePermission : true
        });
        api.getAllCompanyIdNamess(param,function(result){
          searchCompanyConfig.remoteLoading = false;
          if(result.code == 200){
            searchCompanyConfig.opts = [];
            searchCompanyConfig.opts = searchCompanyConfig.opts.concat(result.data.list);
          }else if(result.code == 404){
            searchCompanyConfig.opts = [];
            pageUtil.searchConfig.searchObj.companyName = '';
          }
        })
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
                pageUtil.searchConfig.searchConditions[2].otherConfig.opts = pageUtil.searchConfig.searchConditions[2].otherConfig.opts.concat(res.data);
              }else{
                _self.searchStoreScrollFlag = false;
              }
            })
          }
        }
      },
      searchStoreCodeRemote(query){
        let _self = this;
        pageUtil.searchConfig.searchConditions[2].otherConfig.remoteLoading = true;
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
          pageUtil.searchConfig.searchConditions[2].otherConfig.remoteLoading = false;
          if(result.code == 200){
            pageUtil.searchConfig.searchConditions[2].otherConfig.opts = result.data;
          }else if(result.code == 404){
            pageUtil.searchConfig.searchConditions[2].otherConfig.opts = [];
            pageUtil.searchConfig.searchObj.storeCode = '';
          }
        })
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
      clearDateRange(valueKey){
        this[valueKey] = '';
      },
      //下载
      doExport(){
        let _self = this;
        let searchObj = Object.assign({},pageUtil.searchConfig.searchObj);
        apiStore.exportOtherIncomDetailDetailReport(searchObj,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message: res.data,
              type: 'success'
            });
          }else{
            _self.common.messageUtil({
              message: res.msg,
              type: 'error'
            });
          }
        })
      },   
      getDownloadList(param){
        var _self = this;
        this.loadSign = true;
        this.listPageIndex = 1;
        param = this.common.formatPathParam({
          exportTypes : '其他业务收入明细报表'
        })
        api.getDownloadListDr(param,function(res){
          res.code == 200 ? _self.downloadList = res.data.list : _self.downloadList = []
        })
      },
      loadMore () {
        let _self = this;
        if (this.loadSign) {
          this.loadingList = true;
          this.listPageIndex++;
          let param = this.common.formatPathParam({
            pageSize  : this.listPageSize,
            pageIndex : this.listPageIndex,
            exportTypes : '其他业务收入明细报表'
          });
          api.getDownloadListDr(param,function (res) {
            _self.loadingList = false;
            if (res.code ===404 ) {
              _self.loadSign = false;
              return false;
            }else{
              _self.loadSign = true;
              _self.downloadList = _self.downloadList.concat(res.data.list);
            }
          })
        }
      },
      search(){
        this.currentPage = 1;
        this.getData();
      },
      //查询列表
      getData(){
        let _self = this;
        let pageParam = {
          pageIndex : this.currentPage,
          pageSize  : this.pageSize
        };
        let searchParam = Object.assign({},pageParam,pageUtil.searchConfig.searchObj);
        if(!searchParam.bizDateBeginDate || !searchParam.bizDateEndDate){
          this.common.messageUtil({
            message: '请选完整的交易日期',
            type: 'warning'
          });
          return false;
        }
        if(!searchParam.storeCode && !searchParam.companyCode){
          this.common.messageUtil({
            message: '请至少选择一个法人公司或餐厅编号',
            type: 'warning'
          });
          return false;
        }
        console.log(pageUtil.searchConfig.searchObj);
        let param = this.common.formatPathParam(searchParam);
        apiStore.getOtherIncomDetailDetailReport(param,function(result){
          if(result.code === 200){
            _self.dynamicData = result.data.list;
            _self.totalRecords = result.data.totalRecords;
          }else if(result.code === 404){
            _self.dynamicData = [];
            _self.totalRecords = 0;
          }else{
            _self.common.errorMessage(result.msg);
          }
        })
      },
      reset(){
        pageUtil.searchConfig.searchObj.reset = true;
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getData();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getData();
      }
    }
	}
</script>
<style lang="scss">
.link-btn.block{
  display: block;
  margin: 0;
  padding: 5px 0;
}
</style>







