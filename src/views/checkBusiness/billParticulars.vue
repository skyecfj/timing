<template>
    <div class="mainContent">
       <div class="dataContent">
          <div class="opreRight">
            <el-button size="small"  @click="exportFile()" class="c-button c-button--flat"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
          </div>
          <el-table :data="tableData"  style="width: 100%" border>
              <el-table-column :prop="index" :label="item" v-for="(item,index) in tableHeaderData" :key="index" min-width="80px">
              </el-table-column>
          </el-table>
          <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                  :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
              </el-pagination>
          </div>
       </div>
    </div>
</template>
<script>
    import api from '../../model/api'
    import  ip from '../../model/tempIp'
    export default{
      name:'billParticulars',
      data() {
			return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         tableData: [],
         tableHeaderData:{},
         exportUrl:''
			}

		},
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.currentSize = val
        this.getList()
      },
      getSearchParam(){
        var param = [
          {
              name:'pageIndex',
              value:this.currentPage
          },
          {
            name:'pageSize',
            value:this.pageSize
          }
        ]
        return this.common.joinSearchParam(param)
      },
      exportFile(){
        let _self = this;
        api.exportBill(this.$route.query.voucherCode,this.$route.query.invoiceId,this.getSearchParam(),'application/vnd.ms-excel',function(res,headers){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            const fileName = headers['content-disposition'].split(';')[1].split('=')[1];
            let link = document.createElement('a');
            link.href = res;
            link.download = fileName;
            link.target = '_blank';link.click();
          }
        })
      },
      getList(voucherCode,invoiceId){
        var that = this
       api.getInvoicesDetail(this.$route.query.voucherCode,this.$route.query.invoiceId,this.getSearchParam(),function(res){
        if(res.code === 200){
            that.tableData = res.data.dataList.list
            that.totalRecords= res.data.dataList.totalRecords
            that.tableHeaderData = res.data.headMap
          }
          else if(res.code != 404){
           that.common.messageUtil({
                type: 'warning',
                message: res.msg
               });
          }
       })
      }
    },
    beforeMount(){
      this.getList()
    },
    mounted(){
      this.exportUrl = ip.accountConfig_ip +'/account-common/'+this.$route.query.voucherCode+'/download-invoices-detail/'+this.$route.query.invoiceId + this.getSearchParam()
    }
}
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';

  .cbBContent {
    margin-top: 0px;
      .bottomTitle {
        background-color: white;
        height: 50px;
        .cbBContentRight {
          float: right;
          margin-top: 20px;
          margin-right: 30px;
          color: #409EFF;
          font-size: 14px;
        }
      }
  }
</style>
