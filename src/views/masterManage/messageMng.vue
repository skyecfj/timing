<!--主档管理.通知-->
<template>
    <div class="mainContent">
        <div class="searchContent">
             <div class="selectContent">
                <div class="selectTitle">业务类型</div>
                <el-select size="small"  v-model="warnType" placeholder="请选择" filterable @change="changeWarnType">
                    <el-option
                            v-for="item in warnTypeOptions"
                            :key="item.id"
                            :label="item.dictionaryEntryName"
                            :value="item.id">
                    </el-option>
                </el-select>
             </div>
             <div class="selectContent">
                <div class="selectTitle">业务场景</div>
                <el-select size="small"  v-model="businessType" placeholder="请选择" filterable>
                    <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.id"
                            :label="item.dictionaryEntryName"
                            :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">状态</div>
                 <el-select size="small"  v-model="forbidden" placeholder="请选择" filterable>
                    <el-option
                            v-for="item in forbiddenOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button size="small"  @click="search" class="c-button c-button--primary">查询</el-button>
            <el-button size="small"  @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="dataContent">
            <el-table
                :data="tableData"
                border
                class="common-tbl">
                <el-table-column prop="warnName" label="名称" min-width="80"></el-table-column>
                <el-table-column prop="warnType" label="业务类型" min-width="50"></el-table-column>
                <el-table-column prop="businessType" label="业务场景" min-width="80"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="updateDetail(scope.row.id)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                        <div class="switchDiv">
                           <el-switch active-text="启用"
                                       inactive-text="停用"
                                       active-color="#56CD74"
                                       inactive-color="#bdbdbd"
                                       @change="active(scope.$index,scope.row)" v-model="scope.row.forbidden == '0' ? true:false" :width=60 >
                            </el-switch>
                        </div>
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
    import api from '../../model/api'
    export default {
        data() {
            return {
                // pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                // currentPage: 1,
                // pageSize:10,
                tableData: [],
                options: [],
                warnType:'',
                warnTypeOptions:[],
                sendTypeOptions:[{
                    value:'',
                    label:'请选择'
                },{
                    value:'1',
                    label:'邮件'
                },
                {
                    value:'0',
                    label:'消息'
                }],
                businessType:'',
                businessTypeOptions:[{id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''}],
                businessTypeArray:[],
                sendType:'',
                forbidden:'',
                forbiddenOptions:[{
                    value:'',
                    label:'请选择'
                },{
                    value:'0',
                    label:'启用'
                },
                {
                    value:'1',
                    label:'停用'
                }],
                input: '',
                value1: '',
                value2: '',
                value3: '',
                value4: '',
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25
            }
        },
        beforeMount(){
            this.getMessageList()
            this.getSearchCondition()
        },
        methods: {
            changeWarnType(val){
                var that = this
                this.businessType = ''
                if(!this.common.isNullString(val)){
                    that.businessTypeArray.forEach(function(item,index){
                        if(item.id == val){
                            if(item.value[0].dictionaryEntryName !='请选择'){
                                item.value.unshift({id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''})
                            }
                            that.businessTypeOptions = item.value
                        }
                    })
                }else{
                    this.businessTypeOptions = [{id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''}]
                }
            },
            getSearchCondition(){
                var that = this
                api.getDictionaryByNumber('EARLY_WARN_TYPE',function(res){
                    that.businessTypeArray = []
                    res.data.unshift({id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''})
                    that.warnTypeOptions = res.data
                    res.data.forEach(function(item,index){
                        if(res.code == 200)
                        {
                            var itemArray = []
                            api.getDictionaryByNumber(item.dictionaryEntryCode,function(res){
                                res.data.forEach(function(itemBusiness,index){
                                    if(res.code == 200)
                                    {
                                        itemArray.push(itemBusiness)
                                    }
                                })
                                that.businessTypeArray.push({
                                    id:item.id,
                                    value:itemArray
                                })
                            })
                        }
                    })
                })
            },
            handleSizeChange:function(size) {
                this.pageSize = size
                this.getMessageList()
            },
            handleCurrentChange:function(currentPage) {
                this.currentPage = currentPage
                this.getMessageList()
            },
            checkDetail(id){
              this.$router.push({name:'messageMngCheckD',query:{id:id},params:{parentRoute:this.$route.fullPath}})
            },
             newAdd(){
                this.$router.push('/masterManage/messageMngDetail')
            },
            updateDetail(id){
                this.$router.push({name:'messageMngDetail',query:{id:id},params:{parentRoute:this.$route.fullPath}})
            },
            reset(){
                this.warnType = ''
                this.businessType = ''
                this.sendType = ''
                this.forbidden = ''
                this.businessTypeOptions = [{id:'',dictionaryEntryName:'请选择',dictionaryEntryCode:''}]
            },
            search(){
                this.currentPage = 1
                this.getMessageList()
            },
            getMessageList(){
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
                    name:'warnType',
                    value:this.warnType
                },
                {
                    name:'businessType',
                    value:this.businessType
                },
                {
                    name:'sendType',
                    value:this.sendType
                },
                {
                    name:'forbidden',
                    value:this.forbidden
                }]
                api.getWarnMessageList(this.common.joinSearchParam(param),function(res){
                    if(res.code == 200)
                        {
                            that.tableData = res.data.list;
                            that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code == 404){
                            that.tableData = [];
                            that.totalRecords = 0;
                        }
                        else if(res.code != 404){
                            that.common.warningMessage(res.msg)
                        }
                })
            },
            removeRow(id){
                var that = this
                this.$confirm('确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    api.deleteWarnMessage(id,function(res){
                        if(res.code == 200)
                        {
                            that.common.successMessage(res.data)
                            that.getMessageList()
                        }
                        else{
                            that.common.warningMessage(res.msg)
                        }
                    })
                }).catch(() => {
                    that.common.infoMessage('已取消删除')
                })
            },
            active(index,rowData){
                var that = this
                var title = rowData.forbidden == '1' ? '确定启用?':'确定停用?'
                this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    var param = {
                        'forbidden': rowData.forbidden == '1' ? '0':'1',
                        'id': rowData.id
                    }
                    api.updateWarnMessageStatus(param,function(res){
                        if(res.code == 200)
                        {
                            that.common.successMessage(res.data)
                            rowData.forbidden = (rowData.forbidden == '1') ? '0':'1'
                            // that.getReservationList()
                        }
                        else{
                            that.common.warningMessage(res.msg)
                        }
                    })
                }).catch(() => {
                    that.common.infoMessage('已取消操作')
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    /*@import '../../assets/scss/masterMng';*/
    .inactiveColor {
        color:#E6A23C
    }
    .activeColor {
        color:#67C23A
    }

    .switchDiv{
            height:24px;
            overflow:hidden;
            display: inline-block;
            vertical-align: middle;
            margin-bottom: 5px;
            margin-left:10px;
            .el-switch{
                width:136px;
            }
        }
</style>
