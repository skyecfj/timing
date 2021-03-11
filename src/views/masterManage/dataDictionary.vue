<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>字典项名称</div></el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input size="small"
                            placeholder="请输入字典项名称"
                            v-model="dictionaryEntryName"
                            clearable>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  type="success" @click="getDataDictionaryList" class="c-button">查询</el-button>
                    <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="updateData" class="c-button">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border>
                <el-table-column prop="dictionaryEntryName" label="字典项名称"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人"></el-table-column>
                <el-table-column prop="" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="updateData(scope.$index, scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "dataDictionary",
        data() {
            return {
                value: '',
                value1: '',
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                dictionaryEntryName: ''
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getDataDictionaryList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getDataDictionaryList();
            },
            checkDetail(rows){
                this.$router.push({name:'dataDictionaryDetails',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            updateData(index,rows){
                if(rows){
                    this.$router.push({name:'dataDictionaryEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'dataDictionaryAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            getDataDictionaryList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'dictionaryEntryName',
                        value:this.dictionaryEntryName
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getDateDictionaryList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                        that.totalRecords = 0;
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id) {
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteDateDictionary(id,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getDataDictionaryList(true);
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getDataDictionaryList(true);
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            reset(){
                this.dictionaryEntryName = '';
                // this.getDataDictionaryList(true);
            }
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/masterManage/dataDictionaryAdd' ||to.path === '/masterManage/dataDictionaryEdit') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
        },
        mounted(){
            this.getDataDictionaryList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
