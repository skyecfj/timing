<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="5"><div>活动名称</div></el-col>
                <el-col :span="5"><div>活动类型</div></el-col>
                <el-col :span="5"><div>直联/非直联</div></el-col>
                <el-col :span="5"><div>状态</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-input size="small"  placeholder="请输入活动名称" v-model="activityName" clearable></el-input>
                </el-col>
                <el-col :span="5">
                    <el-select size="small"  v-model="activityType">
                        <el-option v-for="item in activityTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select size="small"  v-model="directCon">
                        <el-option v-for="item in directConOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select size="small"  v-model="status">
                        <el-option v-for="item in statusOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-button size="small"  type="success" @click="search" class="c-button">查询</el-button>
                <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small" type="success" @click="dialogActiveType = true" class="c-button" v-if="activeAuditAdd">新增</el-button>
                <!--<el-button size="small" type="success" @click="" class="c-button">下载</el-button>-->
            </div>
            <el-table :data="tableData" tooltip-effect="dark" border>
                <el-table-column prop="activityName" label="活动名称"></el-table-column>
                <el-table-column prop="brandName" label="品牌" :formatter="(row, column, cellValue, index)=>{return cellValue.split(',')[0]}"></el-table-column>
                <el-table-column prop="actualPeriod" label="活动实际期间" width="200">
                    <template slot-scope="scope">
                        <span v-for="(item,index) in scope.row.actualPeriod" :key="index">{{item.acturalStartDate}}  至  {{item.acturalEndDate}}<br></span>
                    </template>
                </el-table-column>
                <el-table-column prop="activityType" label="活动类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.activityType === 1">A-N全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === 2">A-L非全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === 3">房东代收</span>
                    </template>
                </el-table-column>
                <el-table-column prop="directCon" label="直联/非直联">
                    <template slot-scope="scope">
                        <span v-if="scope.row.directCon === 0">非直联</span>
                        <span v-else-if="scope.row.directCon === 1">直联</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status === 1">草稿</span>
                        <span v-else-if="scope.row.status === 2" style="color:#FF9900">未开始</span>
                        <span v-else-if="scope.row.status === 3" style="color:#1FB02D">进行中</span>
                        <span v-else-if="scope.row.status === 4" style="color:#AEAEAE">已结束</span>
                        <span v-else-if="scope.row.status === 5" style="color:#AEAEAE">已关闭</span>
                        <!--<span v-else-if="scope.row.status === 6" style="color:#434343">已删除</span>-->
                    </template>
                </el-table-column>
                <el-table-column prop="userName" label="活动负责人"></el-table-column>
                <el-table-column prop="" label="操作" width="220">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="activeAuditEdit">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="updateActive(scope.$index,scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="关闭" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="activeAuditClose">
                            <el-button size="small" :class="scope.row.status ===4? 'high-light':null" :disabled="scope.row.status !== 3 && scope.row.status !== 4" class="c-button-icon--danger--opacity c-button-icon-circle" @click="closeStatus(scope.row.id)"><i class="fa fa-ban"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="activeAuditDel">
                            <el-button size="small" :disabled="scope.row.status === 3 || scope.row.status === 4" class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="键位更新" placement="top" effect="light" popper-class="table-cell-toolTip" >
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="remapper(scope.row.id)"><i class="fas fa-sync-alt"></i></el-button>
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
        <!-- 弹框 -->
        <el-dialog title="请选择活动类型" :visible.sync="dialogActiveType">
            <el-button size="small" type="success" class="c-button" @click="selActiveType('special')">房东代收</el-button>
            <el-button size="small" type="success" class="c-button" @click="selActiveType('normal')">正常活动</el-button>
        </el-dialog>
        <!-- 弹框 -->
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "active",
        data(){
            return{
                dialogActiveType:false,
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                module:'主档管理',
                subModule:'活动主档',
                activityName:'',
                activityType:'',
                directCon:'',
                status:'',
                activityTypeOpt:[{
                    value:'',
                    label:'请选择'
                },{
                    value:1,
                    label:'A-N全国性促销活动'
                },{
                    value:2,
                    label:'A-L非全国性促销活动'
                },{
                    value:3,
                    label:'房东代收'
                }],
                directConOpt: [{
                    value: '',
                    label: '请选择'
                }, {
                    value: 0,
                    label: '非直联'
                }, {
                    value: 1,
                    label: '直联'
                }],
                statusOpt: [{
                    value: '',
                    label: '请选择'
                }, {
                    value: 1,
                    label: '草稿'
                }, {
                    value: 2,
                    label: '未开始'
                }, {
                    value: 3,
                    label: '进行中'
                }, {
                    value: 4,
                    label: '已结束'
                },
                    {
                        value: 5,
                        label: '已关闭'
                    },
                    // {
                    //     value: 6,
                    //     label: '已删除'
                    // },
                ],
                activeAuditAdd:false,
                activeAuditEdit:false,
                activeAuditClose:false,
                activeAuditDel:false
            }
        },
        methods:{
            handleSizeChange(size) {
                this.pageSize = size;
                this.getActiveList()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getActiveList()
            },
            search(){
                this.currentPage = 1;
                this.getActiveList()
            },
            checkDetail(rows){
                if(rows.activityType === 3){
                    this.$router.push({name:'activeMasterColDetail',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'activeDetails',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
                }
            },
            updateActive(index,rows){
                if(rows.activityType === 3){
                    this.$router.push({name:'activeMasterColEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}});
                }else{
                    this.$router.push({name:'activeEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}});
                }
            },
            selActiveType(param){
                this.dialogActiveType = false;
                if(param === 'special'){
                    this.$router.push({name:'activeMasterColAdd',params:{parentRoute:this.$route.fullPath}});
                }else if(param === 'normal'){
                    this.$router.push({name:'activeAdd',params:{parentRoute:this.$route.fullPath}});
                }
            },
            getActiveList(param){
                var that = this;
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
                        name:'activityName',
                        value:this.activityName
                    },
                    {
                        name:'activityType',
                        value:this.activityType
                    },
                    {
                        name:'directCon',
                        value:this.directCon
                    },
                    {
                        name:'status',
                        value:this.status
                    }
                ];
                if(param === true){ condition = '' }
                ip.getActiveList(this.common.joinSearchParam(condition),res => {
                    that.tableData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }
                })
            },
            reset(){
                this.activityName = '';
                this.activityType = '';
                this.directCon = '';
                this.status = '';
            },
            showTips (text,type) {this.common.messageUtil({message: text, type: type})},
            removeRow(id){
                var that = this;
                var param = [
                    {
                        name:'module',
                        value:this.module
                    },
                    {
                        name:'subModule',
                        value:this.subModule
                    },
                    {
                        name:'id',
                        value:id
                    }
                ];
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteActive(this.common.joinSearchParam(param),function (res) {
                        if(res.code === 200){
                            that.showTips(res.data,'success');
                            that.getActiveList();
                        }else{
                            that.showTips(res.msg,'warning');
                            that.getActiveList();
                        }
                    });
                }).catch(() => {
                    this.showTips('已取消删除','info')
                });
            },
            closeStatus(id){
                var that = this;
                this.$confirm('确定关闭?','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    ip.activeChangeStatus(id,res => {
                        if(res.code === 200){
                            that.showTips(res.data,'success');
                            that.getActiveList()
                        }else{
                            that.showTips(res.msg,'warning');
                            that.getActiveList()
                        }
                    })
                }).catch(() => {
                    this.showTips('已取消关闭','info')
                })
            },
            remapper(id){
                this.$confirm('确定更新?','提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.activityRemapper('?activityId='+id)
                }).catch(() => {
                })
            }
        },
        mounted(){
            let that = this;
            this.getActiveList();
            let activeAudit = localStorage.getItem('permissionBtns').split(',').filter(x=>{ return x>3});
            if(activeAudit && activeAudit.length>0){
                activeAudit.forEach(item=>{
                    switch(item){
                        case '4':that.activeAuditAdd = true;break;
                        case '5':that.activeAuditEdit = true;break;
                        case '6':that.activeAuditClose = true;break;
                        case '7':that.activeAuditDel = true;break;
                    }
                })
            }
        },
        activated(){
            if(this.$route.meta.isBack){
                this.getActiveList();
            }
            this.$route.meta.isBack = false;
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .high-light{
        color:#edf559;
        background-color:transparent;
    }
</style>
