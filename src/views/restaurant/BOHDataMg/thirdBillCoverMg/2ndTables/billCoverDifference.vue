<template>
    <div class="billCoverDifference">
        <tableOrigin
                :tableHead="tableHead"
                :align="align"
                :dynamicData="dynamicData"
                ref="billCoverDifference"
                :operates="operates"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
                :nullRowStyle="nullRowStyle"
        >
        </tableOrigin>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import api from '../../../../../model/apidr'
    export default {
        name: "billCoverDifference",
        components: {
            tableOrigin
        },
        props:['currentPage','pageSize','dynamicData','totalRecords','pageIndex'],
        data() {
            return {
                tableHead: [
                    {
                        label: '账单名称',
                        prop: 'thirdBillName',
                        align: 'left'
                    },
                    {
                        label: '交易日期',
                        prop: 'tradeDate',
                        align: 'left'
                    },
                    {
                        label: '原账单应收金额汇总',
                        prop: 'oldAmountTotal',
                        labelComments: 'a账单',
                        commentColor: 'red',
                        align: 'right'
                    },
                    {
                        label: '新账单应收金额汇总',
                        prop: 'newAmountTotal',
                        labelComments: 'b账单',
                        commentColor: 'red',
                        align: 'right'
                    },
                    {
                        label: '金额差异',
                        prop: 'diff',
                        labelComments: '（c = b - a）',
                        commentColor: 'red',
                        align: 'right'
                    },
                ],
                nullRowStyle:true,
                selection: true,
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                operates:{
                    width: 180,
                    fixed: 'right',
                    list: [
                        {
                            label: '下载',
                            show:true,
                            class:'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass:'fa fa-download',
                            method: (index, row) => {
                                this.exportThirdBillDiff(row.newSourceBillId)
                            }
                        },
                        {
                            label: '详情',
                            show:true,
                            class:'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass:'fa fa-file-alt',
                            router:true,
                            path:'/storeDataCenter/thirdBillCoverDetail',
                            getQuery:(row)=>{
                                return {
                                    repeatId:row.id,
                                    thirdBillName:row.thirdBillName,
                                    tradeDate:row.tradeDate,
                                    oldAmountTotal:row.oldAmountTotal,
                                    newAmountTotal:row.newAmountTotal,
                                    diff:row.diff,
                                    oldSourceBillId:row.oldSourceBillId,
                                    sourceBillId:row.newSourceBillId,
                                    oldAccessDate:row.oldAccessDate,
                                    newAccessDate:row.newAccessDate,
                                }
                            },
                        },
                        {
                            label: '确认覆盖',
                            show:true,
                            class:'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass:'fa fa-check',
                            method: (index,row,self) => {
                                this.sureToCover(row);
                            }
                        },
                        {
                            label: '删除',
                            show:true,
                            class:'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass:'fa fa-trash-alt',
                            method: (index, row) => {
                                this.sureToDelete(row.id);
                            }
                        },
                    ]
                },
            }
        },
        methods: {
            handleSizeChange(size) {
                this.$emit('pageSize',size)
            },
            handleCurrentChange(currentPage) {
                this.$emit('currentPage',currentPage)
            },
            sureToCover(self) {
                let that = this;
                this.$confirm('是否确认覆盖？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.sureToCoverBill('?repeatId='+self.id,function(){
                        that.$emit('refresh-list','left');
                    });
                }).catch(err=>{
                    this.common.messageUtil({
                        type: 'info',
                        message:'取消确认覆盖！'
                    });
                })
            },
            sureToDelete(param) {
                var that = this;
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteThirdBillCover('?repeatId='+param,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.$emit('refresh-list','left');
                        }else{
                            that.common.messageUtil({
                                type: 'error',
                                message:res.msg
                            });
                        }
                    });
                }).catch(err=>{
                    that.common.messageUtil({
                        type: 'info',
                        message:'取消删除'
                    });
                })
            },
            exportThirdBillDiff(param){
                let that = this;
                api.downloadEfficientValidateTemplate('?sourceBillId=' + param, 'application/vnd.ms-excel', function (res, header) {
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
        }
    }
</script>

<style scoped>

</style>