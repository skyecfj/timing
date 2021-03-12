<template>
    <div class="wrongOperation">
        <tableOrigin
                :tableHead="tableHead"
                :align="align"
                :dynamicData="dynamicData"
                ref="BOHAbnormalTable"
                @handleSizeChange ="handleSizeChange"
                @handleCurrentChange = "handleCurrentChange"
                :totalRecords="totalRecords"
                :pageIndex="pageIndex"
        >
        </tableOrigin>
    </div>
</template>

<script>
    import tableOrigin from '../../originalTable'
    import api from '@/model/api'
    export default {
        name: "wrongOperation",
        components:{
            tableOrigin
        },
        props:['dynamicData','totalRecords','pageIndex'],
        data(){
            return {
                tableHead:[
                    {
                        label:'系统判断不应导入而导入原因',
                        prop:'nodataResult'
                    },
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'营业日期',
                        prop:'bizDate'
                    },
                    {
                        label:'含税收入金额',
                        prop:'taxAmount'
                    },
                    {
                        label:'非现金金额',
                        prop:'unCashAmount'
                    },
                    {
                        label:'应存行金额',
                        prop:'mustSaveAmount'
                    },
                    // {
                    //     label:'状态',
                    //     prop:'reportStateMsg'
                    // },
                    {
                        label:'餐厅主档',
                        edit:true,
                        // router:'/masterManage/hallDetails',
                        // getQuery:(row)=>{
                        //     return {
                        //         id:row.id,
                        //         detail:'true'
                        //     }
                        // },
                        method:(index,row)=>{
                            this.openStoreDetail(row.storeCode)
                        },
                        emptyText:'餐厅主档详情'
                    },
                ],
                align:'center',
                option:{

                },
                operates:{
                    // width: 200,
                    // fixed: 'right',
                    // show:true,
                    // list: [
                    //     {
                    //         label: '编辑',
                    //         disabled: false,
                    //         method: (index, row) => {
                    //         }
                    //     },
                    //     {
                    //         label: '删除',
                    //         disabled: false,
                    //     }
                    // ]
                }
            }
        },
        methods:{
            handleSizeChange(size){
                this.$emit('pageSize',size)
            },
            handleCurrentChange(currentPage){
                this.$emit('currentPage',currentPage);
            },
            openStoreDetail(storeCode){
                let that = this;
                api.getStoreList('?storeHypId='+storeCode,function(res){
                    if(res.code === 200){
                        that.$router.push({name:'hallDetails',query:{id:res.data.list[0].id,detail:true}})
                    }else{
                        that.common.messageUtil({
                            type:'error',
                            message:res.data.msg
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
