<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">年/月</div>
        <el-date-picker v-model="searchData.summaryDate" type="month"
                        value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">卡种类</div>
        <el-select size="small"  v-model="searchData.productType"  filterable>
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="(item, index) in productTypeSelect" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>
      <el-button size="small" type="success" @click="searchList()">查询</el-button>
      <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
      <el-button size="small" type="success" @click="exportFile"><i
              class="fa fa-download c-button-icon--left"></i>下载
      </el-button>
    </div>
    <div class="dataContent">
      <tableOrigin
              :tableHead="tableHead"
              align="center"
              :dynamicData="dynamicData"
              ref="cardTransMonth"
              size="medium"
              :pageination="false"
              :showHeader="false"
              :spanMethod="rowSpan"
      >
      </tableOrigin>
    </div>
  </div>
</template>

<script>
    import reportTableCom from './reportTableCom.vue'
    import api from '@/model/api'
    import apidr from '@/model/apidr'
    import remoteSelect from '@/components/common/remoteSelect'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    export default {
        name: 'cardTransMonth',
        data() {
            return {
                dynamicData: [],
                tableHead: [],
                complexDataFixed: [
                    {
                        label:''  ,
                        item:'productType'
                    },
                    {
                        label:''  ,
                        item:'amountType'
                    },
                    {
                        label:'期初余额'  ,
                        item:'bopBalance'
                    },
                    {
                        label:'+本期售卡激活(含当期换卡)'  ,
                        item:'salesAmount'
                    },
                    {
                        label:'本期充值激活'  ,
                        item:'rechargeAmount'
                    },
                    {
                        label:'+其它调整'  ,
                        item:'salesOtherAmount'
                    },
                    {
                        label:'empty'  ,
                    },
                    {
                        label:'-本期交易'  ,
                        item:'transAmount'
                    },
                    {
                        label:'-本期卡内扣费'  ,
                        item:'cardDeduction'
                    },
                    {
                        label:'-本期退卡销户'  ,
                        item:'backCardCloseAmount'
                    },
                    {
                        label:'-本期换卡销户'  ,
                        item:'returnCardAmount'
                    },
                    {
                        label:'-其它调整'  ,
                        item:'transOtherAmount'
                    },
                    {
                        label:'empty'  ,
                    },
                    {
                        label:'期末余额'  ,
                        item:'balance'
                    },
                    {
                        label:'卡系统期末余额'  ,
                        item:'cardRealBalance'
                    },
                    {
                        label:'本期过期(赠卡)'  ,
                        item:'overdueBalanceAmount'
                    },
                ],
                searchData: {
                    summaryDate: '',
                    productType:''
                },
                resEntitySelect: [],
                simpleTableData: [],
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                // cardTransSearchData: {},
                flag: true,
                colspanSize: 0,
                // firstValue: '',
                productTypeSelect:[],
                index:1
            }
        },
        components: {
            reportTableCom,
            remoteSelect,
            tableOrigin
        },
        methods: {
            // getCompany(res) {
            //     this.$nextTick(() => {
            //         if (typeof res === 'object') {
            //             this.searchData.legalEntityCode = res.val;
            //             this.firstValue = res.val;
            //         } else{
            //             this.searchData.legalEntityCode = res
            //         }
            //         if (res.first) {
            //             this.searchList(true);
            //         }
            //     })
            // },
            handleSizeChange(val) {
                this.pageSize = val
                this.getCardTransMonth()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getCardTransMonth()
            },
            searchList(flag) {
                // this.cardTransSearchData = JSON.parse(JSON.stringify(this.searchData))
                this.getCardTransMonth(flag)
            },
            reset() {
                for (let key in this.searchData) {
                    this.searchData[key] = ''
                }
                this.$refs.companyRef.modelValue = ''
            },
            exportFile() {
                let that = this;
                // if (!this.cardTransSearchData.legalEntityCode) {
                //     this.cardTransSearchData.legalEntityCode = this.firstValue
                // }
                // if (!this.searchData.legalEntityCode) {
                //     this.searchData.legalEntityCode = this.firstValue
                // }
                apidr.downloadCardBalanceCheck(this.searchData, 'application/vnd.ms-excel', function (res) {
                  that.common.exportTemplate('卡片余额核对报表.xlsx',res)
                })
            },
            sendMail() {
                this.$prompt('请输入邮箱密码', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputType: 'password',
                    inputPattern: /\w/,
                    inputErrorMessage: '邮箱密码不能为空且不为汉字'
                }).then(({value}) => {
                    this.sendMailMonth(value)
                }).catch(() => {
                    this.showTips('已取消', 'warning')
                })
            },
            getCardTransMonth(flag) {
                let that = this;
                if (!this.searchData.legalEntityCode) {
                    this.searchData.legalEntityCode = this.firstValue
                }
                apidr.cardBalanceCheckList(this.common.joinSearchParam([
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    }, {
                        name: 'pageSize',
                        value: this.pageSize
                    }, {
                        name: 'summaryDate',
                        value: this.searchData.summaryDate
                    }, {
                        name: 'productTypeName',
                        value: this.searchData.productType
                    }]), (res) => {
                    that.dynamicData = [];
                    if (res.code === 200) {
                        _.forEach(res.data,(value,key)=>{
                           that.complexDataFixed.forEach((item,index)=>{
                               if(key === item.item && item.label !== 'empty'){
                                   that.dynamicData[index] = [item.label].concat(value)
                               }else if(item.label === 'empty'){
                                   that.dynamicData[index] = new Array(value.length)
                               }
                           })
                        })
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
            // rowSpan({row, column, rowIndex, columnIndex}) {
                // if (rowIndex === 0 || rowIndex === 1) {
                //     if (columnIndex === 1) {
                //         return [1, this.colspanSize - 1];
                //     }
                // }
            // },
            getCardTypes () {
                let that = this
                api.getCardTypes(function(res){
                    if (res.code === 200) {
                        that.productTypeSelect = res.data
                    } else if (res.code !== 404) {
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            rowSpan({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0 ) {
                    if ((columnIndex+1) %2 === 0 ) {
                        return [1, 2] ;
                    }
                }
            }

        },
        mounted() {
            this.flag = false;
            this.getCardTypes();
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
  .dataContent /deep/ .el-table .el-table__body .el-table__row .cell{
    min-height: 16px;
  }
  /*.dataContent /deep/ .el-table .el-table__body .el-table__row:first-child > td:not(:first-child):not(:nth-of-type(2)),*/
  .dataContent /deep/ .el-table .el-table__body .el-table__row:first-child > td[colspan='1']:not(:first-child) {
    display: none;
  }


  /*.dataContent /deep/  .el-table .el-table__body .el-table__row td[width='1']{*/
  /*padding:0;.dataContent /deep/ .el-table .el-table__row:nth-of-type(2) .td:not(.el-table_1_column_2)*/
  /*}*/
</style>
