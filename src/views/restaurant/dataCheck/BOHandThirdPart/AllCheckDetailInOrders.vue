<!--cash_a表-->
<template>
  <div>
    <div class="content" id="allCheckDetails">
      <div v-for="(orderCheckItem,index) in allCheckDetails" v-bind:key="index" class="content order-check-item"  >
        <div class="top-control" >
          <el-form ref="actMainInfo" class="act-main-info" label-position="top" >
            <el-row >
              <el-col :span="2">
                <el-form-item label="活动名称" >
                  <span>{{orderCheckItem.activityCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2" >
                <el-form-item label="营业日期" >
                  <span>{{orderCheckItem.bizDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="2">
                <el-form-item label="BOH数据">
                  <span>{{orderCheckItem.orderAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="第三方账单数据" >
                  <span>{{orderCheckItem.billAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="差异金额">
                  <span>{{orderCheckItem.amountDiffAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="BOH订单数量">
                  <span>{{orderCheckItem.orderCount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="第三方账单数量">
                  <span>{{orderCheckItem.billCount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="差异数量">
                  <span>{{orderCheckItem.amountDiffCount}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- <div class="store-main-info" >

            <p>活动名称 {{storeObj.storeCode}}  营业日期：{{storeObj.bizDate}}</p>
            <p>美团网支{{storeObj.overshort}}</p>
          </div> -->
          <div class="btn-group" >
            <el-button size="small"  type="success" @click="detailDownload(orderCheckItem)" >下载明细</el-button>
          </div>
        </div>
        <el-table :data="collatReport" style="width: 100%" border >
          <el-table-column >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >金额无差异</span>
              <span v-else-if="scope.$index == 1" >金额有差异</span>
              <span v-else-if="scope.$index == 2" >BOH有，账单无</span>
              <span v-else >账单有，BOH无</span>
            </template>
          </el-table-column>
          <el-table-column prop="billAmount" label="订单金额" >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >{{orderCheckItem.amountNoDiffAmount}}</span>
              <span v-else-if="scope.$index == 1" >{{orderCheckItem.amountDiffAmount}}</span>
              <span v-else-if="scope.$index == 2" >{{orderCheckItem.orderOnlyAmount}}</span>
              <span v-else >{{orderCheckItem.billOnlyAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="billNum" label="订单数量" >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >{{orderCheckItem.amountNoDiffCount}}</span>
              <span v-else-if="scope.$index == 1" >{{orderCheckItem.amountDiffCount}}</span>
              <span v-else-if="scope.$index == 2" >{{orderCheckItem.orderOnlyCount}}</span>
              <span v-else >{{orderCheckItem.billOnlyCount}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
	export default {
    name:'AllCheckDetailInOrders',
    activated(){
      let params  = JSON.stringify(this.$route.query);
      if(params !== this.stashParams && this.stashParams){
        this.searchObj = Object.assign({},this.$route.query);
        this.getData();
        //console.log('new--'+this.$route.query.id);
      }else{
        //console.log('old--'+this.$route.query.id);
      }
    },
    deactivated(){
      let params  = JSON.stringify(this.$route.query);
      this.stashParams = params;
    },
    created(){},
    beforeMount(){
      this.searchObj = Object.assign({},this.$route.query);
    },
    mounted(){
      this.getData();
    },
    data() {
        return {
            stashParams  : '',
            searchObj    : {},
            collatReport : [{},{},{},{}],
            allCheckDetails : []
        }
    },
    watch: {},
    methods: {
      detailDownload(orderObj){
        let _self = this;
        let param = {
          activityCode : orderObj.activityCode,
          bizDate   : this.searchObj.bizDate,
          storeCode : this.searchObj.storeCode
        };
        apiStore.exportOrderCheckDetail(param,'application/octet-stream',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            link.download = '订单明细.zip'
            link.target = '_blank';link.click();
          }
        })
      },
      //查询列表
      getData(){
        let _self = this;
        let param = this.common.formatPathParam(this.searchObj);
        apiStore.getAllCheckDetailInOrders(param,function(result){
          if(result.code == 200){
            _self.allCheckDetails = result.data.list.concat();
          }else{
            _self.common.errorMessage(result.msg);
          }
        })
      }
    }
}
</script>
<style lang="scss">
  @import '../../../../assets/scss/dataCheckStore';
  .el-form-item__label{
    line-height: 20px;
  }
  .el-form-item__content{
    line-height: 20px;
  }
</style>










