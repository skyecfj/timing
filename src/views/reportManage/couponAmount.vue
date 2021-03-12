<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">年/月</div>
        <el-date-picker v-model="searchData.month" type="month"
                        value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
            <el-select size="small" v-model="searchData.brand">
                <el-option value="" label="请选择"></el-option>
                <el-option v-for="item in brandSelect" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
                </el-option>
            </el-select>
      </div>
      <div class="selectContent" >
        <div class="selectTitle">申请法人公司</div>
        <remoteSelect
                placeholder="请选择法人公司"
                :remoteFn="'getAllCompanyIdNamess'"
                :optLabel="'companyName'"
                :optValue="'jdeCode'"
                @getChangeData="getCompany"
                :type="2"
                :customType="1"
                ref="companyRef"
        ></remoteSelect>
      </div>
      <div class="selectContent">
        <div class="selectTitle">兑换方式</div>
        <el-select size="small" v-model="searchData.type">
          <el-option value="" label="请选择"></el-option>
          <el-option label="现金" value="现金"></el-option>
          <el-option label="积分" value="积分"></el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">发放渠道</div>
        <el-input size="small" v-model.trim="searchData.placeChannelName" clearable></el-input>
      </div>
      <el-button size="small" type="success" @click="searchList()">查询</el-button>
      <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success" @click="exportFile"><i
              class="fa fa-download c-button-icon--left"></i>下载
      </el-button>
    </div>
    <div class="dataContent">
      <!--<el-tabs @tab-click="handleSwitch" value="cash">-->
        <!--<el-tab-pane  label="按现金" name="cash">-->
          <tableOrigin
                  :tableHead="tableHead"
                  align="center"
                  :dynamicData="dynamicData"
                  ref="couponAmount"
                  size="medium"
                  :pageination="false"
                  :showHeader="false"
                  :spanMethod="searchData.type==='现金'?rowSpan:null"
          >
          </tableOrigin>
    </div>
  </div>
</template>

<script>
    import api from '@/model/api'
    import apidr from '@/model/apidr'
    import remoteSelect from '@/components/common/remoteSelect'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    export default {
        name: 'couponAmount',
        data() {
            return {
                dynamicData: [],
                tableHead: [],
                complexDataFixed: [
                    '',
                    '',
                    '期初余额',
                    '+本期销售(扣除本期退售)',
                    '+本期赠送',
                    '+本期积分兑换',
                    '+其他调整',
                    '-本期使用',
                    '-本期失效',
                    '-其他调整',
                    '=期末余额',
                    '=平台库存卡余额'
                ],
                complexDataFixedIntegral: [
                    '',
                    '',
                    '期初余额',
                    '+本期积分兑换',
                    '-本期使用',
                    '-本期失效',
                    '=期末余额',
                ],
                propList:[
                    'couponType',
                    'amountType',
                    'initialBalance',
                    'currProdSalesAmount',
                    'currProdPresentAmount',
                    'currProdInteExchAmount',
                    'salesOtherAmount',
                    'currProdUsedAmount',
                    'currProdInvalidAmout',
                    'transOtherAmount',
                    'closingBalance',
                    'platStockBalance',
                ],
                propListIntegral:[
                    'couponType',
                    'amountType',
                    'initBalance',
                    'inteExAmount',
                    'usedAmount',
                    'invalidAmount',
                    'closingBalance',
                ],
                searchData: {
                    month: '',
                    brand:'',
                    applyJde:'',
                    placeChannelName:'',
                    type:'',
                },
                brandSelect: [],
                colspanSize: 0,
            }
        },
        components: {
            remoteSelect,
            tableOrigin
        },
        methods: {
            getCompany(res){
                this.searchData.applyJde = res;
            },
            getBrandSelect () {
                let that = this;
                apidr.getBrandSelect('',function(res){
                    if (res.code === 200) {
                        that.brandSelect = res.data
                    } else if (res.code !== 404) {
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            searchList() {
                if(!this.searchData.type){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择兑换方式'
                    })
                    return;
                }
                this.getCouponAmount()
            },
            reset() {
                for (let key in this.searchData) {
                    this.searchData[key] = ''
                }
                this.$refs.companyRef.reset()
            },
            exportFile() {
                if(!this.searchData.type){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择兑换方式'
                    })
                    return;
                }
                let that = this,wayName = '';
                if(this.searchData.type === '现金'){
                    wayName = 'downloadCouponAmountBalance'
                }else{
                    wayName = 'downloadCouponBalanceIntegral'
                }
                apidr[wayName](this.searchData, 'application/vnd.ms-excel', function (res) {
                  that.common.exportTemplate('券余额核对报表.xlsx',res)
                })
            },
            getCouponAmount(flag) {
                let that = this,wayName = '';
                if(this.searchData.type === '现金'){
                    wayName = 'couponAmountBalance'
                }else{
                    wayName = 'couponBalanceIntegralList'
                }
                apidr[wayName](this.common.joinSearchParam([
                   {
                        name: 'month',
                        value: this.searchData.month
                    }, {
                        name: 'brand',
                        value: this.searchData.brand
                    },{
                        name: 'applyJde',
                        value: this.searchData.applyJde
                    },{
                        name: 'placeChannelName',
                        value: this.searchData.placeChannelName
                    },{
                        name: 'type',
                        value: this.searchData.type
                    }]), (res) => {
                    that.dynamicData = [];
                    if (res.code === 200) {
                        if(this.searchData.type === '现金'){
                            for (let [index,elem] of this.propList.entries()) {
                                that.dynamicData[index] = [that.complexDataFixed[index]].concat(res.data[elem]);
                            }
                        }else{
                            for (let [index,elem] of this.propListIntegral.entries()) {
                                that.dynamicData[index] = [that.complexDataFixedIntegral[index]].concat(res.data[elem]);
                            }
                        }
                        if (that.dynamicData.length > 0) {
                            that.colspanSize = Object.keys(that.dynamicData[0]).length;
                            that.tableHead = Object.keys(that.dynamicData[0]).map((val, index) => {
                                if (index === 0) {
                                    return {columnClass: 'heavy-bold', prop: val}
                                } else {
                                    return {prop: val}
                                }
                            })
                        } else {
                            that.tableHead = [];
                        }
                    }
                })
            },
            showTips(text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                })
            },
            rowSpan({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0 && columnIndex>0) {
                    if (columnIndex % 2 === 0) {
                        return {
                        rowspan: 1,
                        colspan: 2
                        };
                    } else {
                        return {
                        rowspan: 0,
                        colspan: 0
                        };
                    }
                }
            },
        },
        mounted() {
            this.getBrandSelect();
        },
    }
</script>

<style lang="scss" scoped>
  .heavy-bold .cell {
    span {
      font-weight: bold;
    }
  }

  .dataContent /deep/ .el-table .el-table__row:first-child .el-table_1_column_2, .dataContent /deep/ .el-table .el-table__row:nth-of-type(2) .el-table_1_column_2 {
    width: 100%;
  }
  /*.dataContent /deep/ .el-table .el-table__body .el-table__row:first-child > td:not(:first-child):not(:nth-of-type(2)),*/
  /*.dataContent /deep/ .el-table .el-table__body .el-table__row:nth-of-type(2) > td:not(:first-child):not(:nth-of-type(2)) {*/
    /*display: none;*/
  /*}*/


  /*.dataContent /deep/  .el-table .el-table__body .el-table__row td[width='1']{*/
  /*padding:0;.dataContent /deep/ .el-table .el-table__row:nth-of-type(2) .td:not(.el-table_1_column_2)*/
  /*}*/
</style>
