<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">年/月</div>
                <el-date-picker v-model="searchData.summaryDate" type="month"
                                value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">法人公司</div>
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        :customLabel="true"
                        :customType="1"
                        ref="companyRef"
                        :selectedFirst="true"
                        :showFirst="false"
                >
                </remoteSelect>
            </div>
            <el-button size="small" type="success" @click="searchList()">查询</el-button>
            <el-button size="small" type="success" @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success" @click="exportFile"><i
                    class="fa fa-download c-button-icon--left"></i>下载
            </el-button>
            <el-button size="small" type="success" @click="checkMail">发送邮件</el-button>
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
                    :needColRowSpan="true"
                    :rowClassName="rowClassNameFn"
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
                        label:'法人公司代码'  ,
                        item:'legalEntityCode'
                    },
                    {
                        label:'法人公司名称'  ,
                        item:'legalEntityName'
                    },
                    {
                        label:'ITEMS'  ,
                        item:'productType'
                    },
                    {
                        label:'当月售卡面额'  ,
                        item:'salesDenomination'
                    },
                    {
                        label:'减：当月售卡面额-现金折扣'  ,
                        item:'saDiscount'
                    },
                    {
                        label:'减：当月销卡面额' ,
                        item:'backAmount'
                    },
                    {
                        label:'其他'  ,
                        item:'other'
                    },
                    {
                        label:'应收总额'  ,
                        item:'arAmount'
                    },
                    {
                        label:'empty'  ,
                    },
                    {
                        label:'当月刷卡金额'  ,
                        item:'swingCardAmount'
                    },
                    {
                        label:'减：上月分摊折扣'  ,
                        item:'shareDiscount'
                    },
                    {
                        label:'当月领用免费产品'  ,
                        item:'presentAmount'
                    },
                    {
                        label:'当月分摊手续费' ,
                        item:'sharePoundage'
                    },
                    {
                        label:'应付总额'  ,
                        item:'payableAmount'
                    },
                ],
                searchData: {
                    summaryDate: '',
                    legalEntityCode: '',
                },
                resEntitySelect: [],
                simpleTableData: [],
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                cardTransSearchData: {},
                firstCompany: '',
                flag: true,
                colspanSize: 0,
                firstValue: ''
            }
        },
        components: {
            reportTableCom,
            remoteSelect,
            tableOrigin
        },
        methods: {
            getCompany(res) {
                this.$nextTick(() => {
                    if (typeof res === 'object') {
                      this.searchData.legalEntityCode = res.val;
                      this.firstValue = res.val;
                      this.checkEntityCode = ''
                    } else{
                      this.searchData.legalEntityCode = res
                      this.checkEntityCode = res
                    }
                    if (res.first) {
                        this.searchList(true);
                    }
                })
            },
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
                api.exportCardTransMonth(this.searchData, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        that.common.warningMessage(res.msg)
                    } else {
                        let link = document.createElement('a')
                        link.href = res
                        link.id = 'attachmentLink'
                        link.download = '百胜卡结算单.xlsx'
                        link.target = '_blank';link.click()
                    }
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
                apidr.getCardVerificationList(this.common.joinSearchParam([
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
                        name: 'legalEntityCode',
                        value: this.searchData.legalEntityCode
                    }]), (res) => {
                    that.dynamicData = [];
                    if (res.code === 200) {
                        // that.dynamicData = Object.values(res.data).map((item, index) => {
                        //     // debugger;
                        //     // let arr = [that.complexDataFixed[index]].concat(item);
                        //     // let oobj = {};
                        //     // arr.forEach((val, i) => {
                        //     //     oobj['value' + i] = val;
                        //     // })
                        //     return [that.complexDataFixed[index]].concat(item);
                        // });
                        // if (that.dynamicData.length > 0) {
                        //     that.colspanSize = Object.keys(that.dynamicData[0]).length;
                        //     that.tableHead = Object.keys(that.dynamicData[0]).map((val, index) => {
                        //         if (index === 0) {
                        //             return {columnClass: 'heavy-bold', prop: val}
                        //         } else {
                        //             return {prop: val}
                        //         }
                        //     })
                        // } else {
                        //     that.tableHead = [];
                        // }
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
                                if(val === 'empty'){
                                    return {columnClass: 'empty', prop: val}
                                }
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
            checkMail() {
                let that = this
                api.checkCardTransMonthMail({
                  'summaryDate': this.searchData.summaryDate,
                  'legalEntityCode': this.checkEntityCode
                }, function (res) {
                    if (res.code === 200) {
                        let entityName = res.data
                        that.confirmTips('<span>该报表有</span><strong>' + entityName.length + '</strong>家法人公司的内部往来/加盟商结算联系人没有配置邮箱，确认发送邮件？</span>')
                    } else if (res.code !== 404) {
                        that.showTips(res.msg, 'warning')
                    } else {
                        that.sendMail()
                    }
                })
            },
            sendMailMonth(val) {
                let that = this
                let params = Object.assign(this.cardTransSearchData, {password: val})
                api.sendMailMonth(params, function (res) {
                    if (res.code === 200) {
                        that.showTips('邮件发送成功', 'success')
                    } else if (res.code !== 404) {
                        that.showTips(res.msg, 'warning')
                    }
                })
            },
            confirmTips(context) {
                let that = this
                this.$confirm(context, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true
                }).then(() => {
                    that.sendMail()
                }).catch(() => {
                    //that.common.infoMessage('已取消')
                })
            },
            showTips(text, type) {
                this.common.messageUtil({
                    message: text,
                    type: type
                })
            },
            rowSpan({row, column, rowIndex, columnIndex}) {
                if (rowIndex === 0 || rowIndex === 1) {
                    if (columnIndex === 1) {
                        return [1, this.colspanSize - 1];
                    }
                }
            },
            rowClassNameFn({row, rowIndex}){
                if(row && row.length>0){
                    if(!row[0]){
                        return 'lineHeight24'
                    }
                }
            }
        },
        mounted() {
            this.flag = false;
        },
    }
</script>

<style lang="scss" scoped>
    .dataContent /deep/ .heavy-bold  .cell {
        span {
            font-weight: bold;
        }
    }
    .dataContent /deep/ .lineHeight24 .cell{
        height: 23px;
    }
    .dataContent /deep/ .el-table .el-table__row:first-child .el-table_1_column_2, .dataContent /deep/ .el-table .el-table__row:nth-of-type(2) .el-table_1_column_2 {
        width: 100%;
    }

    .dataContent /deep/ .el-table .el-table__body .el-table__row:first-child > td:not(:first-child):not(:nth-of-type(2)),
    .dataContent /deep/ .el-table .el-table__body .el-table__row:nth-of-type(2) > td:not(:first-child):not(:nth-of-type(2)) {
        display: none;
    }
    .empty{
        line-height: 24px;
    }

    /*.dataContent /deep/  .el-table .el-table__body .el-table__row td[width='1']{*/
    /*padding:0;.dataContent /deep/ .el-table .el-table__row:nth-of-type(2) .td:not(.el-table_1_column_2)*/
    /*}*/
</style>
