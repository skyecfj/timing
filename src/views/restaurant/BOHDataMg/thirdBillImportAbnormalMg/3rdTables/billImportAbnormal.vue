<template>
    <div class="billImportAbnormal">
        <tableOrigin
                :tableHead="tableHead"
                :align="align"
                :dynamicData="dynamicData"
                ref="billImportAbnormal"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
        <el-dialog  :visible.sync="dialogFormVisible" center>
            <div slot="title">异常账单情况列表</div>
            <tableOrigin
                    :tableHead="tableHead2"
                    :align="align"
                    :dynamicData="dynamicData2"
                    ref="billImportAbnormal"
                    :height="560"
                    :pageination="false"
            >
            </tableOrigin>
            <div slot="footer" >
                <el-button type="success"  size="small" @click="exportStoreCodeNull(detail)" :disabled="ifDisabled">导出餐厅编号为空</el-button>
                <el-button type="success" plain size="small" @click="()=>{dialogFormVisible=false;ifDisabled=true}">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import apidr from '@/model/apidr'
    export default {
        name: "billImportAbnormal",
        components: {
            tableOrigin
        },
        props:['dynamicData','totalRecords','pageIndex'],
        data() {
            return {
                tableHead: [
                    {
                        label: '交易日期',
                        prop: 'tradeDate'
                    },
                    {
                        label: '账单名称',
                        prop: 'configName'
                    },
                    {
                        label: '详情',
                        prop:'detail',
                        edit: true,
                        formatter:(row)=>{
                            return `详情`
                        },
                        method: (key, row) => {
                            this.getDetail(row);
                        }
                    },

                ],
                tableHead2:[
                    {
                        label: '交易日期',
                        prop: 'tradeDate'
                    },
                    {
                        label: '账单名称',
                        prop: 'configName'
                    },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '餐厅编号',
                        prop: 'deliveryStoreCode'
                    },
                    {
                        label: '错误提示',
                        prop: 'errorTypeDesc'
                    },
                ],
                align: 'center',
                // pageSizesList: [5, 10, 15, 20, 25],
                // pageSize: 10,
                currentPage: 1,
                dialogFormVisible:false,
                dynamicData2:[],
                detail:{itemId:'',tradeDate:''},
                ifDisabled:true
            }
        },
        methods: {
            handleSizeChange(size) {
                // this.pageSize = size;
                this.$emit('pageSize',{size:size,type:2});
            },
            handleCurrentChange(currentPage) {
                // this.currentPage = currentPage;
                this.$emit('pageIndex',{'currentPage':currentPage,'type':2});
            },
            getDetail(row){
                let that = this;
                that.detail.itemId =  row.itemId;
                that.detail.tradeDate =  row.tradeDate;
                apidr.selectImportErrorDetail(that.detail,res=>{
                    if(res.code === 200){
                        that.dynamicData2 = res.data;
                        this.dialogFormVisible = true;
                        that.ifDisabled = false
                    }else{
                        that.dynamicData2 = [];
                        this.dialogFormVisible = true;
                    }
                });
            },
            exportStoreCodeNull(row){
                let that = this;
                apidr.downloadImportErrorDetail(row,'application/vnd.ms-excel',function(res,header){
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            }
        }
    }
</script>

<style scoped>
    /deep/ .el-dialog__body {
        padding: 31px 20px
    }
</style>
