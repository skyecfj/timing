<template>
  <div>
    <el-table :data="checkDetailData" style="width: 100%" :border="true" :cell-style="renderCellStyle" >
        <!--订单-->
        <el-table-column :label="tHeaderConfig.header_1.name" align="center" >
          <el-table-column  v-for="(headerItem,index) in tHeaderConfig.header_1.labels"
                            v-bind:key="headerItem"
                            :prop="tHeaderConfig.header_1.props[index]"
                            :label="headerItem"
                            :formatter="renderTblData" ></el-table-column>
        </el-table-column>
        <!--账单/券码中心/卡中心/-->
        <el-table-column :label="tHeaderConfig.header_2.name" align="center" >
          <el-table-column  v-for="(headerItem,index) in tHeaderConfig.header_2.labels"
                            v-bind:key="headerItem"
                            :prop="tHeaderConfig.header_2.props[index]"
                            :label="headerItem"
                            :formatter="renderTblData" ></el-table-column>
        </el-table-column>
        <!-- <el-table-column label="支付类型" prop="payMethod" ></el-table-column> -->
        <el-table-column v-if="tHeaderConfig.type == 1" label="核对时间" prop="createTime" :formatter="renderTblData" ></el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 6" label="核对时间" prop="checkTime" :formatter="renderTblData" ></el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 1"  label="差异" prop="differentTotal" ></el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 4 || tHeaderConfig.type == '4-1' || tHeaderConfig.type == 9 || tHeaderConfig.type == 10"  label="差异" prop="differentStatus" ></el-table-column>
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
    name  : 'checkSameSingleTbl',
    props : ['reportType','searchObj'], 
    activated(){
        let params  = window.localStorage.params;
        if(params !== this.stashParams){
          this.currentPage = 1
          this.pageSize = 10
          this.totalRecord = 0
          this.tabIndex = 0
          this.setTblHeaderConfig();
          this.isFreshData = false
          this.getData();
        }
    },
    deactivated(){
        let params  = window.localStorage.params;
        this.stashParams = params;
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
        isFreshData :false
			}
    },
    watch : {
      reportType(val,oldVal){
        this.setTblHeaderConfig()
        var lastStr = val.split('-')[1]
        this.tabIndex = lastStr == 1 ? 1 : 0
        this.isFreshData = false
        this.getData()
        console.log('tHeaderConfig',this.tHeaderConfig)
      },
      searchObj(val,oldVal){
        this.isFreshData = false
        this.getData();
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
        var typeNumber = type.indexOf('-') < 0 ? type : type.split('-')[0]
        api.getNormalDetail(typeNumber,searchParam,function(result){
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
        for(let i = 0; i < tblHeaderConfig.sameAndDiffTblHeader.length; i ++){
          if(tblHeaderConfig.sameAndDiffTblHeader[i].type == params.type){
            _self.tHeaderConfig = tblHeaderConfig.sameAndDiffTblHeader[i];
          }
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
        }else{
          return cellValue;
        }
      },
      //区分多表头样式
      renderCellStyle({row, column, rowIndex, columnIndex}){
        let _self = this;
        if(this.tHeaderConfig.columnIndexRange){
            if(columnIndex > this.tHeaderConfig.columnIndexRange[0] && columnIndex < this.tHeaderConfig.columnIndexRange[1]){
              let style = {
                'background' : 'rgba(219, 219, 219, 0.7)'
              }
              return style;
           }
        }
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