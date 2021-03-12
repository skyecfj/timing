<template>
  <div>
    <el-table :data="checkDetailData" :border="true"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="renderSelected" ></el-table-column>
      <el-table-column  v-for="(headerItem,index) in tHeaderConfig.labels"
                        v-bind:key="headerItem"
                        :prop="tHeaderConfig.props[index]"
                        :label="headerItem"
                        :formatter="renderTblData" ></el-table-column>
      <!-- <el-table-column label="支付类型" prop="payMethod" ></el-table-column> -->
    </el-table>
    <div class="page-content pagination" >
      <el-pagination background @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizeOpt"
                      :page-size="pageSize"
                      :total="totalRecord"
                      layout="total,sizes,prev,pager,next,jumper" ></el-pagination>
    </div>
  </div>
</template>

<script>
  import api from '../../../model/api'
  import tblHeaderConfig from '../../../utils/checkResultsUtil'
  export default{
    name  : 'checkHasBillSingleTbl',
    props : ['reportType','searchObj'], 
    activated(){
        let params  = window.localStorage.params;
        if(params !== this.stashParams){
          this.currentPage = 1
          this.pageSize = 10
          this.totalRecord = 0
          this.tabIndex =  0
          this.setTblHeaderConfig();
          this.isFreshData = false
          this.getData();
        }
    },
    deactivated(){
        let params  = window.localStorage.params;
        this.stashParams = params;
        // this.firstVisit = true;
    },
    beforeMount(){
      this.setTblHeaderConfig();
    },
    mounted(){
      this.isFreshData = true
      //this.getData();
    },
    data() {
			return {
        stashParams : '',
        firstVisit : true,
				navTitle : {
      		fontSize : '20px'
        },
        tHeaderConfig : {},
        checkDetailData : [],
        currentPage : 1,
        pageSizeOpt : [25,50,75,100,125],
        pageSize    : 25,
        totalRecord : 0,
        tabIndex:0,
        isFreshData:false
			}
    },
    watch : {
      reportType(val,oldVal){
        this.setTblHeaderConfig();
        var lastStr = val.split('-')[1]
        this.tabIndex = lastStr == 1 ? 1 : 0
        this.isFreshData = false
        this.getData()
      },
      searchObj(val,oldVal){
        // if(!this.firstVisit){
          this.isFreshData = false
          this.getData();
        // }
      }
    },
    methods : {
      //查询列表
      getData(){
        let _self = this;
        let storage = window.localStorage;
        let params = JSON.parse(storage.params);
        let detailParams = this.isFreshData ? '' : (storage.detailParams ? JSON.parse(storage.detailParams) : {}); 
        let pageParams = {pageIndex : _self.currentPage,pageSize  : _self.pageSize,};
        let tempSearchParams = Object.assign({},pageParams,params,detailParams);
        var tabType = this.tHeaderConfig.tabConfig ? this.tHeaderConfig.tabConfig[this.tabIndex] :''
        tempSearchParams.tabType = tabType
        delete tempSearchParams.type;
        delete tempSearchParams.businessType;
        let searchParam  = this.common.formatPathParam(tempSearchParams);
        var type = params.type
        // var typeNumber = this.tHeaderConfig.tabConfig ?type.substr(0,1):type
        var typeNumber = type.indexOf('-') < 0 ? type : type.split('-')[0]
        api.getBillDetail(typeNumber,searchParam,function(result){
          _self.firstVisit = false;
          if(result.data){
            _self.checkDetailData = result.data.list;
            _self.totalRecord = result.data.totalRecords;
          }else{
            _self.checkDetailData = [];
            _self.totalRecord = 0;
          }
        })
      },
      setTblHeaderConfig(){
        let _self = this;
        let storage = window.localStorage;
        let params = JSON.parse(storage.params);
        for(let i = 0; i < tblHeaderConfig.hasBillTblHeader.length; i ++){
          if(tblHeaderConfig.hasBillTblHeader[i].type == params.type){
            _self.tHeaderConfig = tblHeaderConfig.hasBillTblHeader[i];
            if(tblHeaderConfig.hasBillTblHeader[i].isSameHeader){
              _self.tHeaderConfig.labels = tblHeaderConfig.hasBillTblHeader[i-1].labels;
              _self.tHeaderConfig.props  = tblHeaderConfig.hasBillTblHeader[i-1].props;
            }
          }
        }
      },
      //加载是否可选
      renderSelected(row, index){
        if(row.journalType == 0){
          return true;
        }else{
          return false;
        } 
      },
      //处理表单数据
      renderTblData(row,column,cellValue,index){
        let _self = this;
        if(column.property === 'happendDate'){
          if(row.incomeTime){
            return row.incomeTime;
          }else if(row.payoutTime){
            return row.payoutTime;
          }
        }else if(column.property === 'journalType'){
          if(cellValue == 0){
            return '否';
          }else if(cellValue == 1){
            return '是';
          }
        }else{
          return cellValue;
        }
      },
      handleSelectionChange(selectedDatas) {
        this.$emit('selectedRow', selectedDatas);
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.$emit('changePageInfo',{pageIndex : this.currentPage,pageSize  : this.pageSize});
        this.getData();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.$emit('changePageInfo',{pageIndex : this.currentPage,pageSize  : this.pageSize});
        this.getData();
      }
    }
  }
</script>