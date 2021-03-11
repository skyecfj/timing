<!--账单异常检查报告0.5%-->
<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <searchHeader v-bind:searchConfig="pageUtil.searchConfig"
                    v-on:rangeDatechange="rangeDatechange" ></searchHeader>
      <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
      <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
      <el-button size="small"  type="success" class="findButt" @click="doExport">下载</el-button>
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
  //查询form组件
  import searchHeader from '../restaurant/dataCheck/dataCheckComponent/searchHeader'
  //查询form配置
  import pageUtil from '../../utils/restaurant/report/billAbnormalCheckMng05'
  //表格
  import tableOrigin from '../restaurant/BOHDataMg/originalTable'
	export default {
    name:'BillAbnormalCheckMng05',
    activated(){},
    deactivated(){},
    components:{
      searchHeader,
      tableOrigin
    },
    created(){},
    beforeMount(){
      this.getSearchOptioins();
    },
    mounted(){},
		data() {
			return {
        pageUtil : pageUtil,
        mainTblConfig: {
          tableHead: [
            {
              label : '活动名称',
              prop  : 'activityName'
            },
            {
              label : '营业时间',
              prop  : 'bizDateStr'
            },
            {
              label : '品牌',
              prop  : 'brand'
            },
            {
              label : '是否直连',
              prop  : 'directConStr'
            },
            {
              label : 'BOH总金额',
              prop  : 'bohConfirmAmount'
            },
            {
              label : '账单总金额',
              prop  : 'bohCheckAmount'
            },
            {
              label : '退款金额',
              prop  : 'returnAmount'
            },
            {
              label : '串户金额',
              prop  : 'sumAmount'
            },
            {
              label : '时间性差异金额',
              prop  : 'timeAmount'
            },
            {
              label : '盘盈',
              multiple : true,
              columns  : [{
                label : '餐厅数量',
                prop  : 'gainNum'
              },{
                label : '金额',
                prop  : 'gainAmount'
              }]
            },
            {
              label : '盘亏',
              multiple : true,
              columns  : [{
                label : '餐厅数量',
                prop  : 'lossNum'
              },{
                label : '金额',
                prop  : 'lossAmount'
              }]
            }
          ],
          align : 'center'
        },
        dynamicData  : [],
        currentPage  : 1,
        pageSizeOpt  : [25,50,75,100,125],
        pageSize     : 25,
        totalRecords : 0,
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
              pageUtil.searchConfig.searchConditions[2].otherConfig.opts = result.data.list.concat();
          }else{
              pageUtil.searchConfig.searchConditions[2].otherConfig.opts = [];
          }
        });
      },
      //下载
      doExport(){
        let _self = this;
        // let pageParam = {
        //     pageIndex : this.currentPage,
        //     pageSize  : this.pageSize
        // };
        let searchObj = Object.assign({},pageUtil.searchConfig.searchObj);
        // if(!searchObj.bizDateBegin || !searchObj.bizDateEnd){
        //     this.common.messageUtil({
        //         message: '请选营业日期',
        //         type: 'warning'
        //     });
        //     return false;
        // }
        // if(!searchObj.fscActivityCode && !searchObj.companyName && !searchObj.storeCode){
        //     this.common.messageUtil({
        //         message: '请至少输入要查询的活动名称或选择一个法人公司或餐厅编号',
        //         type: 'warning'
        //     });
        //     return false;
        // }
        apiStore.exportBillAbnormalCheckDetailReport(searchObj,'application/vnd.ms-excel',function(res){
            if(res.code){
              _self.common.messageUtil({
                message: res.msg,
                type: 'warning'
              });
            }else{
              let link = document.createElement('a');
              link.href = res;
              link.download = '账单异常检查报表(0.5%).xlsx'
              link.target = '_blank';link.click();
            }
        })
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
        // if(!searchParam.bizDateBegin || !searchParam.bizDateEnd){
        //   this.common.messageUtil({
        //     message: '请选完整的营业日期',
        //     type: 'warning'
        //   });
        //   return false;
        // }
        // if(!searchParam.financialMarket && !searchParam.companyName && !searchParam.storeCode){
        //   this.common.messageUtil({
        //     message: '请至少选择一个财务市场或法人公司或餐厅编号',
        //     type: 'warning'
        //   });
        //   return false;
        // }
        console.log(pageUtil.searchConfig.searchObj);
        let param = this.common.formatPathParam(searchParam);
        apiStore.getBillAbnormalCheckDetailReport(param,function(result){
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







