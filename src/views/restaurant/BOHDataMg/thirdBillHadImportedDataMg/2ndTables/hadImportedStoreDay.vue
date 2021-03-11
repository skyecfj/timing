<template>
    <div class="hadImportedStoreDay">
        <tableOrigin
                :tableHead="tableHead"
                :selection="selection"
                :align="align"
                :dynamicData="dynamicData"
                ref="hadImportedStoreDay"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                @handleSelectionChange="handleSelectionChange"
                :operates="operates"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import IP from  '../../../../../model/apidr.js'
    export default {
        name: "hadImportedStoreDay",
        components: {
            tableOrigin
        },
        props:['currentPage','pageSize','dynamicData','totalRecords','pageIndex'],
        data() {
            return {
                tableHead: [
                    {

                        label: '营业日期',
                        prop: 'bizDate'
                    },
                    {

                        label: '账单接入时间',
                        prop: 'createTime'
                    },
                    {
                        label: '活动名称',
                        prop: 'activityName'
                    },
                    {
                        label: '财务市场',
                        prop: 'financialMarket'
                    },
                    {
                        label: '营运市场',
                        prop: 'operateMarket'
                    },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '开票单位',
                        prop: 'billingUnitName'
                    },
                    {
                        label: '餐厅编号',
                        prop: 'deliveryStoreCode'
                    },
                    {
                        label: '品牌',
                        prop: 'brandName'
                    },
                    {
                        label: '银行流水核对状态',
                        prop: 'checkStatus',
                        fixed:true,
                        formatter:(item)=>{
                            switch(item.checkStatus){
                                case '0': return '否';
                                case '1': return '是';
                                default:return;
                            }
                        }
                    },

                ],
                selection: true,
                align: 'center',
                operates:{
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '删除',
                            show:true,
                            class:'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass:'fa fa-trash-alt',
                            method: (index, row,self) => {
                                this.sureToDelete([row.id]);
                            }
                        },
                    ]
                },
                multipleSelection:[]
            }
        },
        methods: {
            handleSizeChange(size) {
                this.$emit('pageSize',size)
            },
            handleCurrentChange(currentPage) {
                this.$emit('currentPage',currentPage)
            },
            handleSelectionChange (val) {
                this.multipleSelection = [];
                let that = this;
                if (val.length > 0) {
                    val.forEach(function (item, index) {
                        that.multipleSelection.push(item.id)
                    })
                    this.$emit('multipleSelection',that.multipleSelection)
                }else{
                    this.$emit('multipleSelection',[])
                }
            },
            sureToDelete(param) {
                var that = this;
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    IP.deleteThirdBillStoreDay(param,function (res) {
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
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        }
    }
</script>

<style scoped>

</style>
