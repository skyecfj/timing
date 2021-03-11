<!--cash_a表-->
<template>
  <div>
    <div class="content" >
      <div class="top-control" >
        <div class="store-main-info" >
          <p>餐厅编号：{{storeObj.storeCode}}&nbsp;&nbsp;&nbsp;营业日期：{{storeObj.bizDate}}</p>
        </div>
      </div>
      <el-table :data="repoData" class="outside-tbl" :border="true" :span-method="arraySpanMethod" >
        <el-table-column  label="BOH键位" class-name="cos-column" width="250" >
          <template slot-scope="scope">
            <el-table :data="scope.row.cashaDetailSrcs" class="inside-tbl" :border="true" :show-header="false" >
              <el-table-column prop="bohItemCode" width="250" ></el-table-column>
              <el-table-column prop="bohSysAmount" width="250" ></el-table-column>
              <el-table-column prop="bohConfirmAmount" width="249" class-name="last-column" ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column  label="BOH应收金额" width="250"  
                          :render-header="(h,data) => renderHeader(h,data,'BOH应收金额','B')" ></el-table-column>
        <el-table-column  label="BOH实收金额" width="250"  
                          :render-header="(h,data) => renderHeader(h,data,'BOH实收金额','C')" ></el-table-column>
        <el-table-column  prop="billAmount" label="账单金额"  
                          :render-header="(h,data) => renderHeader(h,data,'账单金额','F.C/D.NC')"  ></el-table-column>
        <el-table-column  prop="orAmount" label="账单金额与BOH实收金额差异"  
                          :render-header="(h,data) => renderHeader(h,data,'账单金额与BOH实收金额差异','F.C/D.NC-C')"  ></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import ip from '../../../../model/tempIp'

	export default {
    name:'BOHDataDailyReport',
    activated(){
      // let params  = JSON.stringify(this.$route.query);
      // if(params !== this.stashParams){
      //   this.stashParams = params;
      //   //this.getData();
      // }
    },
    deactivated(){},
    created(){},
    beforeMount(){
    },
    mounted(){
      let params  = JSON.stringify(this.$route.query);
      if(params !== this.stashParams){
        this.stashParams = params;
        //this.getData();
      }
      this.storeObj = {
        storeCode  : this.$route.query.storeCode,
        bizDate    : this.$route.query.bizDate
      }
      this.getData();
    },
		data() {
			return {
        stashParams : '',
        storeObj    : {},
        repoData    : []
			}
		},
    methods: {
      //查询列表
      getData(){
        let _self = this;
        let param = JSON.parse(this.stashParams);
        apiStore.getBohAbnormalDailyReport(this.common.formatPathParam(param),function(res){
          if(res.code === 200){
            _self.repoData = res.data.list;
          }else if(res.code === 404){
            _self.repoData = []
          }else{
            _self.common.errorMessage(res.msg)
          }
        });
      },

      renderHeader(h,data,headFisrtName,headSecondName){
        return <span><span>{headFisrtName}</span><span style="color:#f56c6c;display: block">{headSecondName}</span></span>
      },

      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex < 3) {
          if (columnIndex === 0) {
            return [1, 3];
          } else if (columnIndex > 0) {
            return [0, 0];
          }
        }
      }
    }
	}
</script>

<style lang="scss">
.store-main-info{
  margin-bottom: 10px;
  p{
    height: 32px;
    line-height: 32px;
  }
}
.outside-tbl{
  width: 100%;
  .cos-column{
    padding: 0 0 !important;
    border-bottom: none;
    .cell{
      padding: 0 0 !important;
    }
    
  }
  th.cos-column{
    .cell{
      padding: 0 6px !important;
    }
  }
  .inside-tbl{
    width: 100%;
    border: none;
    .cell{
      padding: 0 6px !important;
      .el-table__body-wrapper{
        overflow: hidden;
      }
    }
    td{
      border-bottom: 1px solid #ebeef5;
    }
    .last-column{
      border-right: none;
    }
  }
  .inside-tbl.el-table::before,.inside-tbl.el-table::after{
    height: 0px;
  }
}

</style>









