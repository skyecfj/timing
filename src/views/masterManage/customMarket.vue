<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">市场名称</div>
                <el-input size="small"  v-model.trim="marketName" clearable placeholder="请输入市场名称"></el-input>
            </div>
             <div class="selectContent">
                <div class="selectTitle">创建人</div>
                <el-input size="small"  v-model.trim="createUser" clearable placeholder="请输入创建人"></el-input>
            </div>
            <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"   @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <div class="opreRight">
                <el-button size="small"  type="success" @click="newCreate">新增</el-button>
            </div>
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="customizeMarketId" label="记录ID" min-width="50px">
                </el-table-column>
                <el-table-column prop="marketName" label="市场" min-width="80px">
                </el-table-column>
                <el-table-column prop="createUser" label="创建人" width="80px">
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.customizeMarketId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.customizeMarketId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.customizeMarketId)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                    :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import api from '../../model/api'
    export default {
        name:'customMarket',
        data(){
            return {
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,
                marketName:'',
                createUser:'',
                tableData:[]
            }
        },
        beforeMount(){
            this.getCustomizeMarketList()
        },
        methods:{
            handleSizeChange(val){
                this.pageSize = val
                this.getCustomizeMarketList()
            },
            handleCurrentChange(val){
                this.currentPage = val
                this.getCustomizeMarketList()
            },
            search(){
                this.getCustomizeMarketList()
            },
            reset(){
                this.marketName = ''
                this.createUser = ''
                // this.getCustomizeMarketList()
            },
            getCustomizeMarketList(){
                var that = this
                var param = [
                   {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'marketName',
                        value:this.marketName
                    },
                    {
                        name:'createUser',
                        value:this.createUser
                    }
                ]
                api.getCustomizeMarketList(this.common.joinSearchParam(param),function(res){
                    that.tableData = [];
                    that.totalRecords = 0
                    if(res.code == 200)
                    {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404){
                        that.common.messageUtil({
                            message: text,
                            type: type
                        });
                    }
                })
            },
            newCreate(){
                this.$router.push({name:'customMarketAdd',params:{parentRoute:this.$route.fullPath}})
                // this.$router.push('/masterManage/customMarketAdd')
            },
            checkDetail(customizeMarketId,isEdit){

                isEdit ? this.$router.push({name:'customMarketEditDetail',query:{customizeMarketId:customizeMarketId},params:{parentRoute:this.$route.fullPath}}):
                 this.$router.push({name:'customMarketCheckD',query:{customizeMarketId:customizeMarketId},params:{parentRoute:this.$route.fullPath}})
            },
            deleteRow(customizeMarketId){
                var that = this
                this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deleteCustomizeMarket(customizeMarketId,function(res){
                    res.code === 200 ? (that.showTips(res.data,'success') ,that.getCustomizeMarketList()): that.showTips(res.msg,'warning')
                    })
                }).catch(() => {
                that.showTips('已取消删除','info')
                })
            },
            showTips(text,type){
            this.common.messageUtil({
                message: text,
                type: type
            });
           }
        }
    }
</script>
