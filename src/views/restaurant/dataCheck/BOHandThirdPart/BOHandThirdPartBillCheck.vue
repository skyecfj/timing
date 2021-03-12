<!--cash_a表-->
<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                    v-on:rangeDatechange="rangeDatechange" ></searchHeader>
      <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
      <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
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
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import scroll from '@/directives/index'
  //查询form组件
  import searchHeader from '../dataCheckComponent/searchHeader'
  //表格
  import tableOrigin from '../../BOHDataMg/originalTable'
  //查询form配置
  import pageUtil from '../../../../utils/restaurant/dataCheck/BOHandThirdPartBill'
	export default {
    name:'BOHandThirdPartBillCheck',
    components:{
      searchHeader,
      tableOrigin
    },
    directives: { scroll },
    created(){},
    beforeMount(){
      //console.log(pageUtil.searchConfig.searchObj);
      this.getSearchOptioins();
      //营运市场查询配置
      this.setSearchOperateMarketConfig();
      //财务市场查询配置
      //this.setSearchMarketConfig();
      //法人公司查询配置
      //this.setSearchCompanyConfig()
      //餐厅编号查询配置
      this.setSearchStoreConfig();
    },
    mounted(){
      //this.getData();
    },
		data() {
			return {
        pageUtil : pageUtil,
        mainTblConfig: {
          tableHead: [
            {
              label : '餐厅编号',
              prop  : 'storeCode'
            },
            {
              label : '营运市场',
              prop  : 'operateCode'
            },
            {
              label : '营业日期',
              prop  : 'bizDate'
            },
            {
              label : '餐厅名称',
              prop  : 'storeName'
            },
            {
              label : '品牌',
              prop  : 'brand'
            },
            {
              label : '财务市场',
              prop  : 'financialMarket'
            },
            {
              label : '法人公司',
              prop  : 'companyName'
            },
            {
              label : '状态',
              prop  : 'checkStatus',
              formatter:(row)=>{
                  switch (row.checkStatus){
                      case 0: return '未完成差异定位';
                      case 1: return '已完成差异定位';
                      default:return;
                  }
              }
            },
            {
              label : 'BOH数据合计',
              prop  : 'bohConfirmAmount'
            },
            {
              label : '账单金额合计',
              prop  : 'billAmount'
            },
            {
              label     : '操作',
              type      : 'router',
              router    : 'BOHandThirdPartBillAdjust',
              emptyText : '差异定位',
              getQuery  : (row) => {
                return {
                  storeCode : row.storeCode,
                  bizDate   : row.bizDate
                }
              }
            }
          ],
          align : 'center'
        },
        branNameDefaultOpts : [{
          brandName : '请选择',
          brandEnglishName : ''
        }],
        dynamicData  : [],
        selectedRows : [],
        currentPage  : 1,
        pageSizeOpt  : [25,50,75,100,125],
        pageSize     : 25,
        totalRecords : 0,
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
    methods: {
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
      //获查询头部选项
      getSearchOptioins(){
        let _self = this;
        let searchParam = this.common.formatPathParam({
          pageIndex : 1,
          pageSize  : 99999999,
          flag      : 1
        });
        api.getBrandList(searchParam,function(result){
          //console.log(result);
          if(result.data.list){
            pageUtil.searchConfig.searchConditions[1].otherConfig.opts = _self.branNameDefaultOpts.concat(result.data.list);
          }else{
            pageUtil.searchConfig.searchConditions[1].otherConfig.opts = _self.branNameDefaultOpts.concat();
          }
        })
        //获取所有财务市场
        // api.getDictionaryByNumber('MARKETTYPE',function(res){
        //   if(res.code == 200){
        //     let tempMarketCategory = '';
        //     res.data.forEach(function(item,index){
        //       if(item.dictionaryEntryName == '财务市场'){
        //         tempMarketCategory = item.id;
        //       }
        //     });
        //     let marketSearchParam = _self.common.formatPathParam({
        //       pageIndex : 1,
        //       pageSize  : 999999,
        //       marketCategory : tempMarketCategory
        //     });
        //     api.getMarketList(marketSearchParam,function(result){
        //       let searchMarketConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
        //       if(result.code == 200){
        //         searchMarketConfig.opts = searchMarketConfig.opts.concat(result.data.list);
        //       }else{
        //         searchMarketConfig.opts = [];
        //       }
        //     });
        //   }
        // });
      },
      //设置营运市场
      setSearchOperateMarketConfig(){
        let searchOperateMarketConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
        searchOperateMarketConfig.changeMethod = () => {
          pageUtil.searchConfig.searchObj.storeCode = null;
          searchStoreConfig.opts = [];
          this.searchStoreRemote('');
        }
        searchOperateMarketConfig.opts = [];
        api.getOperateMarketIdNames('&judgePermission=true', res=> {
          if(res.code == 200){
              searchOperateMarketConfig.opts = res.data.concat();
          }
        })
      },
      //财务市场查询配置
      // setSearchMarketConfig(){
      //   let searchMarketConfig = pageUtil.searchConfig.searchConditions[2].otherConfig;
      //   let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
      //   let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
      //   searchMarketConfig.changeMethod = () => {
      //     pageUtil.searchConfig.searchObj.companyName = '';
      //     searchCompanyConfig.opts = [];
      //     this.searchCompanyRemote('');
      //     pageUtil.searchConfig.searchObj.storeCode = '';
      //     searchStoreConfig.opts = [];
      //     this.searchStoreRemote('');
      //   };
      // },
      // //法人公司查询配置
      // setSearchCompanyConfig(){
      //   let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
      //   let searchStoreConfig = pageUtil.searchConfig.searchConditions[4].otherConfig;
      //   searchCompanyConfig.remoteMethod = (query) => {
      //     //console.log(query);
      //     this.searchCompanyRemote(query);
      //   };
      //   searchCompanyConfig.scrollMethod = (param,object) => {
      //     this.searchCompanyScrollMethod(param,object);
      //   };
      //   searchCompanyConfig.visibleChange = (isVisible) => {
      //     if(!isVisible && !pageUtil.searchConfig.searchObj.companyName){
      //       searchCompanyConfig.opts = [];
      //       this.searchCompanyRemote('');
      //     }else{
      //       //this.searchCompanyRemote(pageUtil.searchConfig.searchObj.companyName);
      //     }
      //   };
      //   // searchStoreConfig.keyupFn = (event) => {
      //   //   if(!event.target.value){
      //   //     this.searchCompanyRemote('');
      //   //   }
      //   // }
      //   searchCompanyConfig.changeMethod = () => {
      //     pageUtil.searchConfig.searchObj.storeCode = '';
      //     searchStoreConfig.opts = [];
      //     this.searchStoreRemote('');
      //   }
      //   this.searchCompanyRemote('');
      // },
      //餐厅编号查询配置
      setSearchStoreConfig(){
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
        searchStoreConfig.remoteMethod = (query) => {
          this.searchStoreRemote(query);
        };
        searchStoreConfig.scrollMethod = (param,object) => {
          this.searchStoreScrollMethod(param,object);
        };
        searchStoreConfig.visibleChange = (isVisible) => {
          if(!isVisible && !pageUtil.searchConfig.searchObj.storeCode){
            searchStoreConfig.opts = [];
            this.searchStoreRemote('');
          }
        };
        this.searchStoreRemote('');
      },
      //法人公司下拉查询和远程查询
      // searchCompanyScrollMethod(param,object){
      //   let _self = this;
      //   let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
      //   if(param){
      //     this.searchCompanySelectObj = object;
      //     if(this.searchCompanyScrollFlag){
      //       this.searchCompanyScrollPageIndex++;
      //       let param = this.common.formatPathParam({
      //         companyName  : this.tempSearchCompanyKeyWord,
      //         marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
      //         pageIndex    : this.searchCompanyScrollPageIndex,
      //         pageSize     : 20
      //       });
      //       api.getCompanyByFMarket(param,function(res){
      //         if(res.code === 200){
      //           searchCompanyConfig.opts = searchCompanyConfig.opts.concat(res.data);
      //         }else{
      //           _self.searchCompanyScrollFlag = false;
      //         }
      //       })
      //     }
      //   }
      // },
      // searchCompanyRemote(query){
      //   let _self = this;
      //   let searchCompanyConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
      //   searchCompanyConfig.remoteLoading = true;
      //   this.searchCompanyScrollPageIndex = 1;
      //   this.tempSearchCompanyKeyWord = query;
      //   this.searchCompanyScrollFlag = true;
      //   if(JSON.stringify(this.searchCompanySelectObj) !== '{}'){
      //     this.searchCompanySelectObj.scrollTop = 0;
      //   }
      //   let param = this.common.formatPathParam({
      //     companyName  : query,
      //     marketNumber : pageUtil.searchConfig.searchObj.financialMarket,
      //     pageIndex    : this.searchCompanyScrollPageIndex,
      //     pageSize     : 20
      //   });
      //   api.getCompanyByFMarket(param,function(result){
      //     searchCompanyConfig.remoteLoading = false;
      //     if(result.code == 200){
      //       searchCompanyConfig.opts = [];
      //       searchCompanyConfig.opts = searchCompanyConfig.opts.concat(result.data);
      //     }else if(result.code == 404){
      //       searchCompanyConfig.opts = [];
      //       pageUtil.searchConfig.searchObj.companyName = '';
      //     }
      //   })
      // },
      //餐厅下拉查询和远程查询
      searchStoreScrollMethod(param,object){
        let _self = this;
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
        if(param){
          this.searchStoreSelectObj = object;
          if(this.searchStoreScrollFlag){
            this.searchStoreScrollPageIndex++;
            let param = {
              //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
              //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
              operateMarket : pageUtil.searchConfig.searchObj.operateCode? pageUtil.searchConfig.searchObj.operateCode : null,
              storeHypId   : this.tempSearchStoreKeyWord? this.tempSearchStoreKeyWord : null,
              pageIndex    : this.searchStoreScrollPageIndex,
              pageSize     : 20,
              judgePermission : true
            };
            api.getSelectSearchCondition(param,function(res){
              if(res.code === 200){
                searchStoreConfig.opts = searchStoreConfig.opts.concat(res.data);
              }else{
                _self.searchStoreScrollFlag = false;
              }
            })
          }
        }
      },
      searchStoreRemote(query){
        let _self = this;
        let searchStoreConfig = pageUtil.searchConfig.searchConditions[3].otherConfig;
        searchStoreConfig.remoteLoading = true;
        this.searchStoreScrollPageIndex = 1;
        this.tempSearchStoreKeyWord = query;
        this.searchStoreScrollFlag = true;
        if(JSON.stringify(this.searchStoreSelectObj) !== '{}'){
          this.searchStoreSelectObj.scrollTop = 0;
        }
        let param = {
          //companyCode     : pageUtil.searchConfig.searchObj.companyName? pageUtil.searchConfig.searchObj.companyName : null,
          //financialMarket : pageUtil.searchConfig.searchObj.financialMarket? pageUtil.searchConfig.searchObj.financialMarket : null,
          operateMarket : pageUtil.searchConfig.searchObj.operateCode? pageUtil.searchConfig.searchObj.operateCode : null,
          storeHypId   : query,
          pageIndex    : this.searchStoreScrollPageIndex,
          pageSize     : 20,
          judgePermission : true
        };
        api.getSelectSearchCondition(param,function(result){
          searchStoreConfig.remoteLoading = false;
          if(result.code == 200){
            searchStoreConfig.opts = [];
            searchStoreConfig.opts = searchStoreConfig.opts.concat(result.data);
          }else if(result.code == 404){
            searchStoreConfig.opts = [];
            pageUtil.searchConfig.searchObj.storeCode = '';
          }
        })
      },
      handlePreview(file) {
        console.log(file);
        window.location.href = file.url;
      },
      search(){
        this.currentPage = 1
        this.getData()
      },
      //查询列表
      getData(){
        let _self = this;
        let pageParam = {
          pageIndex : this.currentPage,
          pageSize  : this.pageSize
        };
        let searchParam = Object.assign({},pageParam,pageUtil.searchConfig.searchObj)
        if(!searchParam.bizDateBegin || !searchParam.bizDateEnd){
          this.common.messageUtil({
            message: '请选完整的营业日期',
            type: 'warning'
          });
          return false;
        }
        if(!searchParam.financialMarket && !searchParam.operateCode && !searchParam.storeCode){
          this.common.messageUtil({
            message: '请至少选择一个营运市场或餐厅编号',
            type: 'warning'
          });
          return false;
        }
        //console.log(pageUtil.searchConfig.searchObj);
        let param = this.common.formatPathParam(searchParam);
        apiStore.bohAndBillCheckList(param,function(result){
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
        //this.getData();
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









