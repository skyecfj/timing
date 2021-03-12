<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>配置名称</div></el-col>
                <el-col :span="4"><div>获取方式</div></el-col>
                <el-col :span="4"><div>状态</div></el-col>
                <el-col :span="4"></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入配置名称" v-model.trim="configName" clearable></el-input>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  v-model="getWay" placeholder="请选择获取方式">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="item in getWayOpt" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  v-model="status" placeholder="请选择通知状态">
                        <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-button size="small"  type="success" class="c-button" @click="getThirdBillList(1)">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="updateBill" class="c-button">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border>
                <el-table-column prop="configName" label="名称"></el-table-column>
                <el-table-column prop="getWay" label="获取方式">
                    <template slot-scope="scope">
                        <span v-if="scope.row.getWay === 1">Kettle</span>
                        <span v-else-if="scope.row.getWay === 2">手动导入</span>
                        <span v-else-if="scope.row.getWay === 3">爬虫</span>
                        <span v-else-if="scope.row.getWay === 4">邮箱</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">启用</span>
                        <span v-else-if="scope.row.status === 2">停用</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"
                                       :disabled="disabledObj.includes(scope.row.configName)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="updateBill(scope.$index, scope.row)"
                                       :disabled="disabledObj.includes(scope.row.configName)">
                                <i class="fa fa-edit"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"
                                       :disabled="disabledObj.includes(scope.row.configName)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                        <el-button type="text" v-if="scope.row.status === 1" class="block" @click="changeStatus(scope.row.id,'停用')"
                                   :disabled="disabledObj.includes(scope.row.configName)">停用</el-button>
                        <el-button type="text" v-if="scope.row.status === 2" class="start" @click="changeStatus(scope.row.id,'启用')"
                                   :disabled="disabledObj.includes(scope.row.configName)">启用</el-button>
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
        name: "thirdBill",
        data(){
            return{
                module:'主档管理',
                subModule:'第三方账单配置',
                statusOpt:[{
                    value: '',
                    label: '请选择'
                },{
                    value: 1,
                    label: '启用'
                },{
                    value: 2,
                    label: '停用'
                }],
                getWayOpt:[],
                configName:'',
                status:'',
                getWay:'',
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                disabledObj:[
                    '百胜电子券码核销及撤销核销',
                    '百胜卡核销及撤销核销',
                    '微信当面付',
                    '银联卡',
                    '支付宝',
                    '百胜卡售卖',
                    '支付宝当面付',
                    '支付宝网支',
                    '支付宝手机支付',
                    '百胜电子券码核销及撤销核销-B2C-顾客实付',
                    '百胜电子券码核销及撤销核销-B2C-第三方补贴',
                    '百胜电子券码核销及撤销核销-非B2C'
                ]
            }
        },
        methods:{
            handleSizeChange(size) {
                this.pageSize = size;
                this.getThirdBillList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getThirdBillList();
            },
            checkDetail(rows){
                this.$router.push({name:'thirdBillDetails',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            updateBill(index,rows){
                if(rows){
                    this.$router.push({name:'thirdBillEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'thirdBillAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            getThirdBillList(param){
                var that = this;
                var tem = [];
                if(param === 1){
                    this.currentPage = 1;
                }
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
                        name:'configName',
                        value:this.configName
                    },
                    {
                        name:'status',
                        value:this.status
                    },
                    {
                        name:'getWay',
                        value:this.getWay
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getThirdBillList(tem,res => {
                    that.tableData = [];
                    that.totalRecords = 0;
                    if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            getSearchCondition(){
                var that = this;
                ip.getDictionaryByNumber('GETWAY',res => {that.getWayOpt = res.data});
            },
            removeRow(id){
                let that = this;
                let tem = [];
                let title = ''
                var condition = [
                    {
                        name:'id',
                        value:id
                    },
                    {
                        name:'module',
                        value:this.module
                    },
                    {
                        name:'subModule',
                        value:this.subModule
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                ip.checkBillConfig('?id='+id,(res)=>{
                    if(res.data === true){
                        title = '已有账单配置导入该账单, '
                    }
                    that.$confirm(title+'确定删除吗?','提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        ip.deleteThirdBill(tem,function (res) {
                            if(res.code === 200){
                                that.common.messageUtil({
                                    type: 'success',
                                    message: res.data
                                });
                                that.getThirdBillList();
                            }else{
                                that.common.messageUtil({
                                    type: 'info',
                                    message: res.msg
                                });
                                that.getThirdBillList();
                            }
                        });
                    }).catch(() => {
                        this.common.messageUtil({
                            type: 'info',
                            message: '已取消删除'
                        });
                    })
                })
            },
            changeStatus(id,title){
                var that = this;
                this.$confirm('确定'+title+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.thirdBillChangeStatus(id,res => {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getThirdBillList();
                        }else if(res.code === 400){
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getThirdBillList();
        },
        beforeRouteLeave(to, from, next) {
            if (to.path === '/masterManage/thirdBill' || to.path === '/masterManage/thirdBillAdd') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
        },
        activated(){
            if(this.$route.meta.isBack){
                this.getThirdBillList();
            }
            this.$route.meta.isBack = false;
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .start{
        color:#85ce61;
    }
    .block{
        color:#FF9800;
    }
</style>
