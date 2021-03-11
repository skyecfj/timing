<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>卡种类名称</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select size="small"  v-model="cardTypeName" placeholder="请选择卡种类名称" filterable>
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  type="success" @click="getCardList" class="c-button">查询</el-button>
                    <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="cardMgrUpdate" class="c-button">新增</el-button>
            </div>
            <el-table :data="tableData" tooltip-effect="dark" border :default-sort = "{prop: 'type', order: 'descending'}">
                <el-table-column prop="cardTypeName" sortable label="卡种类名称"></el-table-column>
                <el-table-column prop="cardName" label="卡产品名称"></el-table-column>
                <el-table-column prop="modifiedTime" sortable label="更新时间"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人"></el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,true)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.cardFileId)"><i class="fa fa-trash-alt"></i></el-button>
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
        <!--新增-->
          <el-dialog  :visible.sync="cardMgrDialog" class="dialogContent" width="70%">
              <div slot="title">{{cardMgrDialogTitle}}</div>
            <el-form ref="cardData" :model="cardData" label-width="100px" :rules="rules">
                <el-form-item label="卡种类名称" class="viewFormLeft" prop="cardTypeName">
                <el-input size="small"  placeholder="请输入" v-model.trim="cardData.cardTypeName" clearable :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item label="卡产品名称" class="viewFormRight" prop="cardName">
                    <el-input size="small"  placeholder="请输入" v-model.trim="cardData.cardName" clearable :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="cardRemark">
                    <el-input size="small"
                              type="textarea"
                              maxlength="100"
                              :autosize="{ minRows: 8, maxRows: 10}"
                              placeholder="请输入（1-100位）"
                              v-model="cardData.remark"
                              :disabled="isChecked">
                     </el-input>
                </el-form-item><br>
                <el-form-item label="更新时间" v-if="cardFileId !== ''">
                    <el-input size="small"  placeholder="" v-model="cardData.modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" v-if="cardFileId !== ''">
                    <el-input size="small"  placeholder="" v-model="cardData.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isChecked">
                <el-button size="small"  @click="cardMgrDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="insertCard()" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "cardMgr",
        data() {
            return {
                options:[],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                cardTypeName: '',
                cardMgrDialog:false,
                cardFileId: '',
                cardData: {},
                isChecked:false,
                cardMgrDialogTitle:'',
                rules: {
                    cardTypeName: { required: true, message: '请输入卡种类名称', trigger: 'blur' },
                    cardName: { required: true, message: '请输入卡产品名称', trigger: 'blur' }
                },
                cardTypeNameDialog:'',
                cardNameDialog:''
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getCardList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getCardList();
            },
            checkDetail(rows,isEdit){
                let that = this;
                this.cardFileId = rows.cardFileId;
                that.isChecked = !isEdit;
                that.cardMgrDialog = true;
                that.cardMgrDialogTitle = isEdit ? '卡档管理-编辑' : '卡档管理-详情';
                if(this.$refs.cardData){
                   this.$refs.cardData.resetFields()
                }
                this.cardData = {};
                ip.getCardById(rows.cardFileId,function (res) {
                    if(res.code === 200){
                        that.cardData = res.data;
                        that.cardTypeNameDialog = that.cardData.cardTypeName;
                        that.cardNameDialog = that.cardData.cardName;
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            insertCard(){
                let that = this;
                delete this.cardData.modifiedUser;
                delete this.cardData.modifiedTime;
                let tem = [
                    {
                        name:'cardTypeName',
                        value:this.cardData.cardTypeName
                    },
                    {
                        name:'cardName',
                        value:this.cardData.cardName
                    }
                ];
                this.$refs.cardData.validate((valid) => {
                    if(valid){
                        if(this.cardFileId !== ''){
                            if(this.cardData.cardTypeName !== this.cardTypeNameDialog || this.cardData.cardName !== this.cardNameDialog){
                                ip.checkCard(this.common.joinSearchParam(tem),res => {
                                    if(res.data){
                                        ip.updateCard(this.cardData,res => {
                                            if(res.code === 200){
                                                that.common.messageUtil({
                                                    type:'success',
                                                    message:res.data
                                                });
                                                that.getCardList(true);that.reset();that.getSearchCondition();
                                                that.cardMgrDialog = false
                                            }
                                            else{
                                                that.common.messageUtil({
                                                    type:'warning',
                                                    message:res.msg
                                                });
                                            }
                                        })
                                    }else{
                                        that.common.messageUtil({
                                            type:'warning',
                                            message:'卡种类名称和卡产品名称和列表中已有数据不能同时相同'
                                        });
                                    }
                                })
                            }else{
                                ip.updateCard(this.cardData,res => {
                                    if(res.code === 200){
                                        that.common.messageUtil({
                                            type:'success',
                                            message:res.data
                                        });
                                        that.getCardList(true);that.reset();that.getSearchCondition();
                                        that.cardMgrDialog = false
                                    }
                                    else{
                                        that.common.messageUtil({
                                            type:'warning',
                                            message:res.msg
                                        });
                                    }
                                })
                            }
                        }else{
                            ip.checkCard(this.common.joinSearchParam(tem),res => {
                                if(res.data){
                                    ip.addCard(that.cardData,res => {
                                        if(res.code === 200){
                                            that.common.messageUtil({
                                                type:'success',
                                                message:res.data
                                            });
                                            that.getCardList(true);that.reset();that.getSearchCondition();
                                            that.cardMgrDialog = false
                                        }
                                        else{
                                            that.common.messageUtil({
                                                type:'warning',
                                                message:res.msg
                                            });
                                        }
                                    })
                                }else{
                                    that.common.messageUtil({
                                        type:'warning',
                                        message:'卡种类名称和卡产品名称和列表中已有数据不能同时相同'
                                    });
                                }
                            })
                        }
                    }else{
                        return false;
                    }
                })
            },
            cardMgrUpdate(){
                this.cardFileId = '';
                this.isChecked = false;
                this.cardMgrDialog = true;
                this.cardMgrDialogTitle = '卡档管理-新增';
                if(this.$refs.cardData){
                   this.$refs.cardData.resetFields()
                }
                this.cardData = {}
            },
            getSearchCondition(){
                let that = this;
                ip.getCardTypes(res => {that.options = res.data})
            },
            getCardList(param){
                let that = this;
                let tem = [];
                let condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'cardTypeName',
                        value:this.cardTypeName
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getCardList(tem,function (res) {
                    if(res.code === 404){
                        that.tableData = [];
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            removeRow(id) {
                let that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteCard(id,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getCardList(true);that.reset();that.getSearchCondition();
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getCardList(true);that.reset();that.getSearchCondition();
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
                this.cardTypeName = '';
                // this.getCardList(true);
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getCardList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
