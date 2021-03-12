<template>
    <div class="hadImportedBill">
        <tableOrigin
                :tableHead="tableHead"
                :selection="selection"
                :align="align"
                :dynamicData="dynamicData"
                ref="hadImportedBill"
                :operates="operates"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                @handleSelectionChange = "handleSelectionChange"
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
        name: "hadImportedBill",
        components: {
            tableOrigin
        },
        props:['currentPage','pageSize','dynamicData','totalRecords','pageIndex'],
        data() {
            return {
                tableHead: [
                    {
                        label: '交易日期',
                        prop: 'bizDate',
                        fixed:true,
                        formatter:(item)=>{
                            if(item.tradeStartDate === item.tradeEndDate){
                                return item.tradeStartDate.split(' ')[0];
                            }else{
                                return item.tradeStartDate.split(' ')[0]+'--'+item.tradeEndDate.split(' ')[0]
                            }
                        }
                    },
                    {
                        label: '账单接入时间',
                        prop: 'transferDate'
                    },
                    {
                        label: '账单名称',
                        prop: 'billName'
                    },
                    {
                        label: '品牌',
                        prop: 'brandNameStr'
                    },
                    {
                        label: '获取频率',
                        prop: 'billProvideDateTypeDesc'
                    },
                    {
                        label: '银行流水核对状态',
                        prop: 'checkStatusDesc',
                        // fixed:true,
                        // formatter:(item)=>{
                        //     switch(item.checkStatus){
                        //         case '0': return '否';
                        //         case '1': return '是';
                        //         default:return;
                        //     }
                        // }
                    },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                // pageSize: 10,
                // currentPage: 1,
                // totalRecords: 0,
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
                                this.sureToDelete([row.sourceBillId]);
                            }
                        },
                        {
                            label: '下载',
                            showFn: (row) => {
                               return !(row.getWay === 1 && row.getLink !== '7');
                            },
                            class:'c-button-icon--primary--opacity c-button-icon-circle',
                            iClass:'fa fa-download',
                            method: (index, row) => {
                                this.downloadSingle(row.sourceBillId);
                            }
                        },
                    ]
                },
                multipleSelection:[]
            }
        },
        methods: {
            handleSizeChange(size) {
                // this.pageSize = size;
                this.$emit('pageSize',size)
            },
            handleCurrentChange(currentPage) {
                // this.currentPage = currentPage;
                this.$emit('currentPage',currentPage)
            },
            handleSelectionChange (val) {
                this.multipleSelection = [];
                console.log(val);
                let that = this;
                if (val.length > 0) {
                    val.forEach(function (item, index) {
                        that.multipleSelection.push(item.sourceBillId)
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
                    IP.deleteThirdBill(param,function (res) {
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
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            downloadSingle(id){
                let that = this;
                IP.downloadSinglebill('?sourceId='+id,'application/vnd.ms-excel',(res,header)=>{
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            }
        },
    }

</script>

<style scoped>
</style>
