<template>
    <div class="wechatAndAlipay">
        <div class="search-content" >
            <div class="selectContent">
                <div class="selectTitle">账号</div>
                <el-input size="small" v-model.trim="alipaywechatAccount" placeholder="请输入查询关键词" clearable :maxlength="50"></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">状态</div>
                 <el-select v-model="state" :placeholder="isDisabled?'':'请选择状态'" size="small" :disabled="isDisabled" filterable>
                      <el-option v-for="item in stateOption"  :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
            </div>
            <el-button size="small"  type="success" class="findButt" @click="searchData">查询</el-button>
            <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content" >
            <div class="viewButton">
                <el-button size="small"  @click="openDetailDialog()" class="c-button c-button--primary">新增</el-button>
            </div>
            <div class="dataContent">
            <el-table :data="dynamicData" style="width: 100%" border>
                <el-table-column prop="alipaywechatAccount" label="账号" min-width="60px">
                </el-table-column>
                <el-table-column prop="companyId" label="法人公司" min-width="60px" sortable>
                </el-table-column>
                <el-table-column prop="brandId" label="品牌" min-width="50px">
                </el-table-column>
                <el-table-column prop="state" label="状态" min-width="30px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state">启用</span>
                        <span v-else>停用</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="openDetailDialog(scope.row.id,'detail')"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="openDetailDialog(scope.row.id,'edit')" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
    </div>
</template>

<script>
    import api from '../../model/api'
    export default {
        name: "wechatAndAlipay",
        data(){
            var validRemark = (rule, value, callback) => {
                if (!this.common.validSpecificSym(value)) {
                    callback(new Error('不能输入特殊字符'));
                }else{
                    callback()
                }
            };

            var validAccount = (rule, value, callback) => {
                if (!this.common.validSpecificSym(value) || /^[\u4e00-\u9fa5]+$/.test(value)) {
                    callback(new Error('只能输入数字、字母、符号'));
                }else{
                    callback()
                }
            };

            return{
                state:1,
                stateOption:[
                {
                    value:'',
                    label:'请选择'
                },
                {
                    value:1,
                    label:'启用'
                },
                {
                    value:0,
                    label:'停用'
                }
                ],
                dynamicData:[],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords:0,
                account:'',
                legalCompany:'',
                dialogFormVisible:false,
                dialogFormVisibleTitle:'',
                formLabelWidth: '110px',
                alipaywechatAccount:'',
                companyId:'',
                companyOption:[],
                companyAllOption:[{id:'',name:'请选择'}],
                isDisabled:false,
                isEdit:false
            }
        },
        beforeMount(){
            this.getData()
            this.getSearchOption()
        },
        beforeRouteLeave(to, from, next) {
            if (to.name === 'wechatAndAlipayAdd' ||to.name === 'wechatAndAlipayEditDetail') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getSearchOption(){
                var that = this
                api.getCompanyIdNames(function(res){
                   that.companyOption = Object.assign({},res.data)
                   that.companyAllOption = []
                   res.data.unshift({id:'',name:'请选择'})
                   that.companyAllOption = res.data
                })
            },
            getData(){
                var that = this
                var param = [
                 {
                    name:'pageIndex',
                    value:this.currentPage
                 },
                 {
                    name:'pageSize',
                    value:this.pageSize
               },{
                   name:'alipaywechatAccount',
                   value:this.alipaywechatAccount
               },
               {
                   name:'state',
                   value:this.state
               }
               ]
               api.getAlipayWechatAccountList(this.common.joinSearchParam(param),function(res){
                        that.dynamicData = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.dynamicData = res.data.list;
                             that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.common.warningMessage(res.msg)
                        }
               })
            },
            searchData(){
                this.currentPage = 1
                this.getData()
            },
            reset(){
                this.alipaywechatAccount = '';
                this.state = '';
            },
            openDetailDialog(rowId,type) {
                if(type === 'detail'){
                    this.$router.push({name:'wechatAndAlipayCheckDetail',query:{alipayId:rowId},params:{parentRoute:this.$route.fullPath}})
                }else if(type === 'edit'){
                    this.$router.push({name:'wechatAndAlipayEditDetail',query:{alipayId:rowId},params:{parentRoute:this.$route.fullPath}})
                }else{
                    this.$router.push({name:'wechatAndAlipayAdd',params:{parentRoute:this.$route.fullPath}})
                }
            },
            getAlipayWechatAccountDetail(rowId){
                var that = this
                api.getAlipayWechatAccountDetail(rowId,function(res){
                    if(res.code == 200){
                        that.form = res.data
                        that.originForm = Object.assign({},res.data)
                    }else{
                        that.common.warningMessage(res.msg)
                    }
                })
            },
            deleteRow(rowId){
                var that = this
                this.$confirm('是否删除该数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteAlipayWechatAccount(rowId,function(res){
                        res.code == 200 ? (that.common.successMessage(res.data), that.getData()): that.common.warningMessage(res.msg)
                        that.dialogFormVisible = false
                    })
                }).catch(() => {
                    that.common.infoMessage('已取消删除')
              });
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .viewButton{
        text-align:right;
        margin-bottom:15px;
    }
</style>
