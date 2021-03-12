<template>
  <div class="mainContent">
        <div class="cbTabs">
        <div class="searchContent">
            <div class="selectContent">
                  <div class="selectTitle">业务类型</div>
                    <el-select size="small"  v-model="businessType" placeholder="请选择" filterable @change="changeBusinessType">
                      <el-option v-for="item in businessTypeOptions" :key="item.id" :label="item.instruction" :value="item.code">
                      </el-option>
                    </el-select>
              </div>
              <div class="selectContent">
                <div class="selectTitle">凭证说明</div>
                <el-select size="small"  v-model="code" placeholder="请选择" filterable>
                  <el-option v-for="item in codeOptions" :key="item.id" :label="item.instruction" :value="item.code">
                  </el-option>
                </el-select>
            </div>
            <div class="selectContent">
              <!--<div class="selectTitle">法人</div>-->
                <!--<el-input size="small"  v-model.trim="companyName" placeholder="请输入" clearable></el-input>-->
                <div class="selectTitle">法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        ref="companyRef"
                        :customType="1"
                        :judgePermission="true"
                ></remoteSelect>
            </div>
            <div class="selectContent">
              <div class="selectTitle">单据月份</div>
                <el-date-picker v-model="startMonth" type="month" placeholder="开始日期" clearable value-format="yyyyMM"></el-date-picker>
                <span>-</span>
                <el-date-picker v-model="endMonth"  type="month" placeholder="结束日期" clearable value-format="yyyyMM"> </el-date-picker>
            </div>
            <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"  @click="resetSerchBill" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
          <el-table :data="tableData" border>
            <el-table-column prop="businessType" label="业务类型" >
            </el-table-column>
            <el-table-column prop="instruction" label="凭证说明" >
            </el-table-column>
            <el-table-column prop="companyName" label="法人" >
            </el-table-column>
            <el-table-column prop="paymentDay" label="单据月份"  sortable width=100px>
            </el-table-column>
            <el-table-column  label="操作" width=100px >
              <template slot-scope="scope">
                <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                </el-tooltip>
                <el-button size="small"   type="text" @click="checkVoucher(scope.row)">凭证</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
              :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="pageSizeList" :total="totalRecords">
            </el-pagination>
          </div>
        </div>
          </div>
  <!--</div>-->
  </div>
</template>
<script>
    import billDetail from "./billDetail.vue"
    import billParticulars from "./billParticulars.vue"
    import api from '../../model/api'
    import remoteSelect from '@/components/common/remoteSelect'
    export default{
      name:'billManage',
      components:{
        billDetail,
        billParticulars,
       remoteSelect
      },
      data() {
        return {
          businessType:'',
          businessTypeOptions:[],
          code:'',
          codeOptions:[{id:'',instruction:'请选择',code:''}],
          startMonth:'',
          endMonth:'',
          companyName:'',
          isShowBt:true,
          isShowBNewT:false,
          isShowBm:true,
          isShowBdT:false,
          isShowBpT:false,
          isShowBdC:false,
          isShowBpC:false,
          pageSizeList:[25, 50, 75, 100, 125],
          totalRecords:0,
          currentPage: 1,
          pageSize:25,
          tableData: []
        }
		},
    created(){
      this.getSearchCondition()
      this.getBillList()
    },
    // beforeMount(){
    //   this.getSearchCondition()
    //   this.getBillList()
    // },
        activated() {
            if (this.$route.meta.isBack) {
                this.getBillList();
            }
        },
    beforeRouteLeave(to, from, next) {
        from.meta.isBack = to.name === 'voucherDetail';
      next();
    },
    methods: {
      getBillList(){
        var that = this
        var param = [
          {
            name:'pageIndex',
            value:this.currentPage
          },
          {
            name:'pageSize',
            value:this.pageSize
          },
          {
              name:'businessType',
              value:this.businessType
          },
          {
              name:'code',
              value:this.code
          },
          {
              name:'companyName',
              value:this.companyName
          },
          {
              name:'startMonth',
              value:this.startMonth
          },
          {
              name:'endMonth',
              value:this.endMonth
          },
         {
              name:'isManualRecording',
              value:0
         }
          ]
          api.getVoucherList(this.common.joinSearchParam(param),function(res){
              that.tableData = res.code === 200?res.data.list:[]
              that.totalRecords= res.code === 200?res.data.totalRecords:0
        })
      },
      getSearchCondition(){
        var that = this;
        api.getBusinessType('',function(res){
          that.businessTypeOptions = [];
          that.businessTypeOptions.push({id:'',instruction:'请选择',code:''});
          res.data.forEach(item => {
              that.businessTypeOptions.push(item)
          });
        })
      },
      changeBusinessType(indexType){
        var that = this;
        this.codeOptions = [{id:'',instruction:'请选择',code:''}];
        this.code = '';
        if(!this.common.isNullString(this.businessType)){
          this.businessTypeOptions.forEach(function(item,index){
              if(that.businessType === item.code){
                if(item.vouchers[0].instruction !=='请选择'){
                  item.vouchers.unshift({id:'',instruction:'请选择',code:''})
                }
                that.codeOptions = item.vouchers;
              }
          })
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getBillList()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.getBillList()
      },
      checkDetail(rowObject){
        if(rowObject.businessType == 'STORE'){
           this.$router.push({name:'billDetail',query:{voucherCode:rowObject.accountVoucherName,id:rowObject.id},params:{parentRoute:this.$route.fullPath}})
        }else{
           this.$router.push({name:'billDetail',query:{voucherCode:rowObject.accountVoucherName,invoiceId:rowObject.invoiceId},params:{parentRoute:this.$route.fullPath}})
        }
      },
      checkVoucher(rowObject){
        this.$router.push({name:'voucherDetail',query:{voucherCode:rowObject.accountVoucherName,voucherId:rowObject.id,jdeFlag:rowObject.jdeFlag},params:{parentRoute:this.$route.fullPath}})
      },
      resetSerchBill(){
        this.businessType = '',
        this.code ='',
        this.startMonth = '',
        this.endMonth = '',
        this.companyName = '';
        this.$refs.companyRef.reset();
        this.codeOptions = [{id:'',instruction:'请选择',code:''}]
        // this.getBillList()
      },
      search(){
        if(this.endMonth < this.startMonth){
          this.common.warningMessage('结束日期要大于开始日期')
          return
        }
        this.currentPage = 1
        this.getBillList()
      },
        getCompany(query){
            this.companyName = query;
        },
    }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';
  $col-primary:#2AAF37;
  $col-warning:#f56c6c;
  $col-cancel:#409EFF;
  $col-white:#FFFFFF;

  .cbBContent {
        background-color: white;
        .billReCbutton{
          float: right;
          margin: 30px;
        }
        .check {
          color: $col-primary;
        }
        .delete {
          color: $col-warning;
        }
        .cancel {
          color: $col-cancel;
        }
        .vouHanleCloumn {
          padding-right: 5px;
          cursor: pointer;
        }
      }
     .cbTabs {
      .selectContents
      {
        padding: 0px;
      }

      .inlineSpace {
        display: inline-block;
        width: 31px;
      }
  }


</style>
