<template>
  <div class="mainContent">
    <!--STORE-->
    <div v-if="businessType == 'STORE'">
      <el-row class="bdSection">
      <el-col :span="8" v-for="(value,key) in storeHeaderInfo" :key="key" class="titleContent">
          <div class="textLeft">
            <div class="bdSectionTitle">{{value}}</div>
            <div  class="bdSectionContent">{{getName(key)}}</div>
          </div>
        </el-col>
    </el-row>
    <div class="dataContent">
      <div class="opreRight">
        <el-button size="small"  @click="exportFile()" class="c-button c-button--flat"><i class="fa fa-download c-button-icon--left"></i>下载明细</el-button>
      </div>
      <div v-if="isShowStoreTable">
      <el-table :data="storeBillDetailList" style="width: 100%" border max-height="600">
        <el-table-column :prop="key" :label="value" v-for="(value,key) in storeTableHeaderInfo" :key="key">
          <template slot-scope="scope" >
                <span v-if="key == 'minDate'">{{scope.row.minDate}}至{{scope.row.maxDate}}</span>
                <span v-else-if="key == 'balanceStartDate'" >{{scope.row.balanceStartDate}}至{{scope.row.balanceEndDate}}</span>
                <span v-else>{{scope.row[key]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
              :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
          </el-pagination>
      </div>
      </div>
    </div>
    </div>

    <!--BBC-->
    <div v-else>
      <div class="searchContent">
        <el-button size="small"  @click="checkParticulars()" class="c-button c-button--plain">查看明细</el-button>
      </div>
      <div class="dataContent">
        <div class="contentTitle">{{currentData.title}}</div>
        <el-table :data="tableData" style="width: 100%" border :span-method="spanMethod">
            <el-table-column :prop="index" :label="item.title" v-for="(item,index) in tableHeaderData" :key="index"
            :render-header="(h,data) => renderHeader(h,data,item.title,item.subTitle)">
              <el-table-column :prop="subIndex" :label="subItem.title" v-for="(subItem,subIndex) in item.subColumn" :key="subIndex">
              </el-table-column>
            </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import billDetailContent from './billDetailContent.vue'
  import billReversal from './billReversal.vue'
  import api from '../../model/api'
  import tempIp from '../../model/tempIp'
  import billManageUtil from '../../utils/billManageUtil'
  export default{
      name:'billDetail',
      components:{
        billDetailContent,
        billReversal
      },
      data() {
			return {
         dDisabled: false,
         cDisabled:false,
         frDisabled:true,
         reversalSuceess:false,
         reversalFinance:false,
         createFinance:false,
         isShowBdc:true,
         isShowBr:false,
         tableData: [],
         voucherCode:'',
         invoiceId:'',
         resMsg:'',
         isNoData:false,
         // tableData:[],
         currentData:{},
         tableHeaderData:{},
         businessType:'',
         storeBillDetailList:[],//STORE
         storeHeaderInfo:{},
         storeDataInfo:{},
         storeTableHeaderInfo:{},
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         isShowStoreTable:true
      }
		},
      methods: {
        handleSizeChange(val) {
          this.pageSize = val
          this.getStoreTableList()
        },
        handleCurrentChange(val) {
          this.currentPage = val
          this.getStoreTableList()
        },
        exportFile(){
          var that = this
          api.exportDetailFile(this.voucherCode,this.invoiceId,'application/x-msdownload',function(res){
                if(res.code){
                      that.common.warningMessage(res.msg)
                  }else{
                      let link = document.createElement('a');
                      link.href = res;
                      link.id = 'attachmentLink';
                      link.download = billManageUtil.storeBillExportDeatilTitle[that.voucherCode] + '明细.xlsx';
                      link.target = '_blank';link.click();
                  }
          })
        },
        getName(key){
          console.log('this.storeDataInfo',this.storeDataInfo)
           return this.storeDataInfo[key]
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
          if(this.voucherCode == 'B2B_0013'){
            if (columnIndex === 0) {
              if (rowIndex === 0) {
                return {
                  rowspan: 5,
                  colspan: 1
                };
              }else {
                return {
                  rowspan: 0,
                  colspan: 0
              };
             }
            }
          }
      },
      renderHeader(h,data,headFisrtName,headSecondName){
        return <div style="line-height:23px;padding-left:0px">{headFisrtName}<span style="color:#f56c6c">{headSecondName}</span></div>
      },
      getStoreBillDetail(){
       this.voucherCode = this.$route.query.voucherCode
       this.invoiceId = this.$route.query.id
       var that = this
       that.storeHeaderInfo = billManageUtil.getStoreTitleHeaderConfigData(this.voucherCode)
       api.getStorebillDetail(this.voucherCode,this.invoiceId,function(res){
         if(res.code === 200){
            that.storeDataInfo = res.data
          }
          else if(res.code != 404){
           that.common.messageUtil({
                type: 'warning',
                message: res.msg
               });
          }
       })
       that.isShowStoreTable = that.common.isNullString(tempIp.storeBillDeatilApi[that.voucherCode]) ? false : true
       if(that.isShowStoreTable){
          if(that.voucherCode != 'STORE_0003'){
            that.storeTableHeaderInfo = billManageUtil.getStoreTableHeaderConfigData(that.voucherCode)
          }
          that.getStoreTableList()
       }else{
           that.storeTableHeaderInfo = {}
       }
      },

      getStoreTableList(){
        var that = this
        var storeDetailParams = [{
          name:'voucherId',
          value:that.invoiceId
          },
          {
              name:'pageIndex',
              value:this.currentPage
          },
          {
              name:'pageSize',
              value:this.pageSize
          }
        ]
        api.getStorebillDetailList(tempIp.storeBillDeatilApi[that.voucherCode],that.common.joinSearchParam(storeDetailParams),function(res){
            if(res.code == 200){
              if(that.voucherCode == 'STORE_0003'){
                that.get03VoucherDetail(res.data);
              }else{
                that.storeBillDetailList = res.data.list;
              }
              that.totalRecords= res.data.totalRecords
            }else if(res.code == 404){
               that.storeBillDetailList = []
            }
       })
      },
      //非现金账单与BOH核对差异定位完成日凭证
      get03VoucherDetail(data){
        let vocherDetailThConfig = {
          activityCode : '活动名称'
        };
        let formatTblData = [];
        let tblData = data.list;
        let allReasons = tblData[0].reasons;
        allReasons.forEach(function(item,index){
          vocherDetailThConfig[item] = item;
        });
        this.storeTableHeaderInfo = vocherDetailThConfig;
        tblData.forEach(function(actObj,actIndex){
          let tblDataObj = {};
          tblDataObj.activityCode = actObj.activityCode;
          actObj.reasonDetail.forEach(function(reasonObj,reasonIndex){
            for(let reasonKey in reasonObj){
              tblDataObj[reasonKey] = reasonObj[reasonKey];
            }
          });
          formatTblData.push(tblDataObj);
        })
        this.storeBillDetailList = formatTblData;
      },
      getBBCBillDetail(){
       this.voucherCode = this.$route.query.voucherCode
       this.invoiceId = this.$route.query.invoiceId
       var that = this
       api.getInvoices(this.voucherCode,this.invoiceId,function(res){
         if(res.code === 200){
            that.currentData = res.data
            billManageUtil.getTableData(that.$route.query.voucherCode,that.tableData,res.data)
          }
          else if(res.code != 404){
           that.common.messageUtil({
                type: 'warning',
                message: res.msg
               });
          }
       })
      },
      checkParticulars(){
       this.$router.push({name:'billParticulars',query:{voucherCode:this.voucherCode,invoiceId:this.invoiceId},params:{parentRoute:this.$route.fullPath}})
      }
     },
     mounted(){
       if(!this.common.isNullString(this.$route.query.voucherCode)){
        this.businessType = this.$route.query.voucherCode.split('_')[0]
        if(this.businessType == 'STORE')
        {
           this.getStoreBillDetail()
        }else{
          this.getBBCBillDetail()
          this.tableHeaderData =  billManageUtil.getTableHeaderConfigData(this.$route.query.voucherCode)
        }
       }
     }
    }
  </script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';
  .el-table th div{
      line-height:auto
      &.renderHeader{
        line-height:auto
      }

    }
  .cbContainer {
     .cbBContentTitle {
         height: 80px;
         margin-bottom: $section-space;
     }
  }
  .mainContent{
      .searchContent {
        text-align:right
      }
    .dataContent {
      padding:20px;
      .contentTitle{
        padding-bottom: 20px;
        font-size: 16px;
      }
    }

  }

  .bdSection {
    &.el-row {
      padding: 20px;
    }
    .textLeft{
      width:85%;
    }
    .titleContent {
      padding: 5px 0px;
    }
  }
</style>
