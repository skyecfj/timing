<template>
  <div>
    <el-table :data="checkDetailData" style="width: 100%" :border="true" @selection-change="handleSelectionChange" toggleRowSelection :cell-style="renderCellStyle" >
        <el-table-column type="selection" :selectable="renderSelected" ></el-table-column>
        <!--订单-->
        <el-table-column :label="tHeaderConfig.header_1.name" align="center" >
          <el-table-column  v-for="(headerItem,index) in tHeaderConfig.header_1.labels"
                            v-bind:key="headerItem"
                            :prop="tHeaderConfig.header_1.props[index]"
                            :label="headerItem"
                            :formatter="renderTblData"
                            :render-header="renderHeader" ></el-table-column>
        </el-table-column>
        <!--账单/券码中心/卡中心/-->
        <el-table-column :label="tHeaderConfig.header_2.name" align="center" >
          <el-table-column  v-for="(headerItem,index) in tHeaderConfig.header_2.labels"
                            v-bind:key="headerItem"
                            :prop="tHeaderConfig.header_2.props[index]"
                            :label="headerItem"
                            :formatter="renderTblData"
                            :render-header="renderHeader" ></el-table-column>
        </el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 1" label="核对时间" prop="createTime" :formatter="renderTblData" ></el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 6 || tHeaderConfig.type == 8 || tHeaderConfig.type == 11 || 
        tHeaderConfig.type == '11-1' || tHeaderConfig.type == 12" label="核对时间" prop="checkTime" :formatter="renderTblData" ></el-table-column>
        <el-table-column label="分录状态" prop="journalType" :formatter="renderTblData"></el-table-column>
        <el-table-column label="原因" prop="reason" :formatter="renderTblData" ></el-table-column>
        <el-table-column v-if="tHeaderConfig.type == 9 || tHeaderConfig.type == 10" label="实收金额差异" prop="actualAmountTotal"></el-table-column>
        <el-table-column v-if ="tHeaderConfig.type == 1 || tHeaderConfig.type == 2 || tHeaderConfig.type == 3 || tHeaderConfig.type == 5
        || tHeaderConfig.type == 6 || tHeaderConfig.type == 7 || tHeaderConfig.type == 8 || tHeaderConfig.type == 11 || tHeaderConfig.type == 12
        || tHeaderConfig.type == 13 || tHeaderConfig.type == 14 || tHeaderConfig.type == 15" 
        label="差异" prop="differentTotal" :render-header="renderHeader" ></el-table-column>
        <el-table-column v-if ="tHeaderConfig.type == '4-1'" label="退款金额差异" prop="differentTotal" :render-header="renderHeader" ></el-table-column>
        <el-table-column v-if ="tHeaderConfig.type == 4" label="应收金额差异" prop="arDifferentTotal" :render-header="renderHeader" ></el-table-column>
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
    name  : 'checkDiffSingleTbl',
    props : ['reportType','searchObj'], 
    activated(){
        let params  = window.localStorage.params;
        if(params !== this.stashParams){
          this.currentPage = 1
          this.pageSize = 10
          this.totalRecord = 0
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
        isFreshData :false
			}
    },
    watch : {
      reportType(val,oldVal){
        this.setTblHeaderConfig();
        // var lastStr = val.substr(val.length-1,1);
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
        let _self   = this;
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
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
        api.getAbnormalDetail(typeNumber,searchParam,function(result){
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
        for(let i = 0; i < tblHeaderConfig.sameAndDiffTblHeader.length; i ++){
          if(tblHeaderConfig.sameAndDiffTblHeader[i].type == params.type){
            _self.tHeaderConfig = tblHeaderConfig.sameAndDiffTblHeader[i];
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
      //区分多表头样式
      renderCellStyle({row, column, rowIndex, columnIndex}){
        let _self = this;
        if(this.tHeaderConfig.columnIndexRange){
          if(columnIndex > this.tHeaderConfig.columnIndexRange[0]+1 && columnIndex < this.tHeaderConfig.columnIndexRange[1]+1 ){
            let style = {
              'background' : 'rgba(219, 219, 219, 0.7)'
            }
            return style;
          }
        }
      },
      //渲染表头
      renderHeader(h, { column, $index }){
        var headerDesc = '';
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        if(params.type == 1||params.type == 2){
          switch(column.label){
          case '订单行金额' : 
            headerDesc = '(A)';
            break;
          case '退款金额' :
            headerDesc = '(B)';
            break;
          case '订单行退款金额' :
            headerDesc = '(B)';
            break;  
          case '收入' : 
            headerDesc = '(C)';
            break;
          case '发券金额' :
            headerDesc = '(C)';
            break;
          case '支出' :
            headerDesc = '(D)';
            break;
          case '退券金额' :
            headerDesc = '(D)';
            break;
          case '差异' :
            headerDesc = '(E) = (A-B) - (C-D)';
            break;
          default:
           headerDesc = '';
         }
        }
        return headerDesc ? <span><span>{column.label}</span><span style="color:#f56c6c;display: block">{headerDesc}</span></span> : <span>{column.label}</span>;
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