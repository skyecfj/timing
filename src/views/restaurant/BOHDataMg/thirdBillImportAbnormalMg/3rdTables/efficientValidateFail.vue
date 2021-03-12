<template>
    <div class="efficientValidateFail">
        <tableOrigin
                :tableHead="tableHead"
                :align="align"
                :dynamicData="dynamicData"
                ref="efficientValidateFail"
                :operates="operates"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                :totalRecords="totalRecords"
        >
        </tableOrigin>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import api from '../../../../../model/apidr'
    export default {
        name: "efficientValidateFail",
        components: {
            tableOrigin
        },
        props:['currentPage','pageSize','dynamicData','totalRecords'],
        data() {
            return {
                tableHead: [
                    {
                        label: '账单名称',
                        prop: 'thirdBillName'
                    },
                    {
                        label: '交易日期',
                        prop: 'tradeDate',

                    },
                    {
                        label: '餐厅应收',
                        multiple:true,
                        columns:[
                            {
                                label: '订单合计',
                                prop: 'orderReceivable'
                            },
                            {
                                label: '店天合计',
                                prop: 'dayReceivable'
                            },
                            {
                                label: '差异',
                                prop: 'diff'
                            },
                        ]
                    },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                operates:{
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '下载',
                            show:true,
                            class:'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass:'fa fa-external-link-square-alt',
                            method: (index, row) => {
                                this.exportEfficient(row.sourceBillId);
                            }
                        },
                        {
                            label: '删除',
                            show:true,
                            class:'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass:'fa fa-trash-alt',
                            method: (index, row) => {
                                this.sureToDelete(row);
                            }
                        },
                    ]
                },
            }
        },
        methods: {
            handleSizeChange(size) {
                this.$emit('pageSize',{size:size,type:3});
            },
            handleCurrentChange(currentPage) {
                // this.$emit('currentPage',currentPage);
                this.$emit('pageIndex',{'currentPage':currentPage,'type':2});
            },
            sureToDelete(param) {
                var that = this;
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteEfficientValidate('?id='+param.id+'&sourceBillId='+param.thirdBillId,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.$emit('refresh-list','right');
                        }else{
                            that.common.messageUtil({
                                type: 'error',
                                message:res.msg
                            });
                        }
                    });
                })
            },
            exportEfficient(param){
                let that = this;
                api.downloadEfficientValidateTemplate('?sourceBillId='+param,'application/vnd.ms-excel',function(res,header){
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            }
        }
    }
</script>

<style scoped>

</style>