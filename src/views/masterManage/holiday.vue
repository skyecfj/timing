<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>年度</div></el-col>
                <el-col :span="4"><div>节假日名称</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入年度" v-model.trim="year" clearable></el-input>
                    <!--<el-select size="small" v-model="year" filterable>-->
                        <!--<el-option label="请选择" value=""></el-option>-->
                        <!--<el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>-->
                    <!--</el-select>-->
                </el-col>
                <el-col :span="4">
                    <el-input size="small" placeholder="请输入节假日名称" v-model.trim="holidayName" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-button size="small" type="success" @click="getHolidayData" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small" type="success" @click="holidayUpdate" class="c-button">新增</el-button>
            </div>
            <el-table
                    :data="tableData"
                    tooltip-effect="dark"
                    border
                    :default-sort = "{prop: 'year', order: 'descending'}"
                    @selection-change="handleSelectionChange">
                <el-table-column prop="year" sortable label="年度"></el-table-column>
                <el-table-column prop="holidayName" sortable label="节假日名称"></el-table-column>
                <el-table-column label="放假时间">
                    <template slot-scope="scope">
                        <div>{{scope.row.startDate}}--{{scope.row.endingDate}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,true)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.holidayId)"><i class="fa fa-trash-alt"></i></el-button>
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
          <el-dialog  :visible.sync="holidayOpreDialog" class="dialogContent" width="70%">
              <div slot="title">{{holidayDialogTitle}}</div>
            <el-form :model="holidayData" label-width="110px" ref="holidayData" :rules="rules">
                <el-form-item label="年度" prop="year">
                    <el-input size="small" placeholder="" v-model="holidayData.year" clearable :disabled="isChecked"></el-input>
                    <!--<el-select size="small" v-model="holidayData.year" :disabled="isChecked" filterable>-->
                        <!--<el-option label="请选择" value=""></el-option>-->
                        <!--<el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="节假日名称" prop="holidayName" :rules="name">
                    <el-input size="small" placeholder="" v-model="holidayData.holidayName" clearable maxlength="10" :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item label="放假时间" prop="value1">
                    <el-date-picker
                            value-format="yyyy-MM-dd"
                            @change="getHolidayRange"
                            v-model="holidayData.value1"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :disabled="isChecked" size="small">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="是否为长假" prop="isLongHoliday">
                    <el-radio v-model="holidayData.isLongHoliday" label="1" :disabled="isChecked">是</el-radio>
                    <el-radio v-model="holidayData.isLongHoliday" label="0" :disabled="isChecked">否</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input size="small" type="textarea" :autosize="{ minRows: 8, maxRows: 10}" placeholder="请输入（1-100位）" maxlength="100" v-model="holidayData.remark" :disabled="isChecked"></el-input>
                </el-form-item><br>
                <el-form-item label="更新时间" v-if="holidayId !== ''">
                    <el-input size="small" placeholder="" v-model="holidayData.modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" v-if="holidayId !== ''">
                    <el-input size="small" placeholder="" v-model="holidayData.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isChecked">
                <el-button size="small" @click="holidayOpreDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small" @click="insertHoliday('holidayData')" class="c-button c-button--primary">保存</el-button>
            </div>
          </el-dialog>
        <!--新增-->
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "holiday",
        data() {
            var name = (rule,value,callback) => {
                if(!/^[A-Za-z0-9\u4e00-\u9fa5！~·@#%……&*（）——、。-，；：“”？,.?""'';()!:\+\=\ \\\/\_\-]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入1-10位的数字、汉字、字母、符号(特殊符号除外)'));
                }else{
                    callback()
                }
            };
            return {
                holidayNameDialog:null,
                yearDialog:null,
                startDate:null,
                endingDate:null,
                holidayOpreDialog:false,
                isChecked:false,
                holidayData:{},
                holidayDialogTitle:'',
                options: [],
                multipleSelection: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                year: '',
                holidayName: null,
                name:[
                    { required: true, message: '节假日名称不能为空', trigger: 'blur' },
                    { validator: name }
                ],
                holidayId:'',
                rules:{
                    year: { required: true, message: '请选择年度', trigger: 'change' },
                    value1: { required: true, message: '请选择放假时间', trigger: 'change' },
                    isLongHoliday: { required: true, message: '请选择是否为长假', trigger: ['change','blur'] },
                },
            }
        },
        methods: {
            getHolidayRange(val){
                this.holidayData.startDate = val[0];
                this.holidayData.endingDate = val[1];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getHolidayData();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getHolidayData();
            },
            checkDetail(rows,isEdit){
                let that = this;
                this.isChecked = !isEdit;
                this.holidayOpreDialog = true;
                this.holidayDialogTitle = isEdit ? '公共节假日-编辑' : '公共节假日-详情';
                this.holidayId = rows.holidayId;
                if(this.$refs.holidayData){
                   this.$refs.holidayData.resetFields()
                }
                this.holidayData = {};
                ip.getHolidayById(rows.holidayId,res => {
                    if(res.code === 200){
                        that.holidayData = res.data;
                        that.holidayNameDialog = that.holidayData.holidayName;
                        that.startDate = that.holidayData.startDate;
                        that.endingDate = that.holidayData.endingDate;
                        that.$set(that.holidayData,'value1',[that.holidayData.startDate,that.holidayData.endingDate])
                    }else{
                        that.common.messageUtil({
                            type:'warning',
                            message:res.msg
                        })
                    }
                })
            },
            holidayUpdate(index,rows){
                this.isChecked = false;
                this.holidayOpreDialog = true;
                this.holidayDialogTitle = '公共节假日-新增';
                this.holidayId = '';
                if(this.$refs.holidayData){
                   this.$refs.holidayData.resetFields()
                }
                this.holidayData = {};
                this.$set(this.holidayData,'year',this.yearDialog);
                this.$set(this.holidayData,'value1',null)
            },
             insertHoliday(formName){
                 var that = this;
                 delete this.holidayData.modifiedTime;
                 delete this.holidayData.modifiedUser;
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         if(this.holidayId !== ''){
                             if(this.holidayNameDialog !== this.holidayData.holidayName && that.startDate === that.holidayData.startDate && that.endingDate === that.holidayData.endingDate){
                                 let param = {
                                     holidayName:this.holidayData.holidayName,
                                     year:this.holidayData.year,
                                 };
                                 ip.checkHolidayValidity(param,res => {
                                     if(res.data){
                                         ip.updateHoliday(that.holidayData,res => {
                                             if(res.code === 200){
                                                 that.common.messageUtil({
                                                     type:'success',
                                                     message:res.data
                                                 });
                                                 that.getHolidayData();
                                                 that.holidayOpreDialog = false
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
                                             message:'节假日名称/日期重复'
                                         })
                                     }
                                 })
                             }else if(this.holidayNameDialog === this.holidayData.holidayName && (that.startDate !== that.holidayData.startDate || that.endingDate !== that.holidayData.endingDate)){
                                 let param = {
                                     startDate:this.holidayData.startDate,
                                     endingDate:this.holidayData.endingDate,
                                     year:this.holidayData.year,
                                 };
                                 ip.checkHolidayValidity(param,res => {
                                     if(res.data){
                                         ip.updateHoliday(that.holidayData,res => {
                                             if(res.code === 200){
                                                 that.common.messageUtil({
                                                     type:'success',
                                                     message:res.data
                                                 });
                                                 that.getHolidayData();
                                                 that.holidayOpreDialog = false
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
                                             message:'节假日名称/日期重复'
                                         })
                                     }
                                 })
                             }else if(this.holidayNameDialog !== this.holidayData.holidayName && (that.startDate !== that.holidayData.startDate || that.endingDate !== that.holidayData.endingDate)){
                                 let param = {
                                     holidayName:this.holidayData.holidayName,
                                     year:this.holidayData.year,
                                     startDate:this.holidayData.startDate,
                                     endingDate:this.holidayData.endingDate
                                 };
                                 ip.checkHolidayValidity(param,res => {
                                     if(res.data){
                                         ip.updateHoliday(that.holidayData,res => {
                                             if(res.code === 200){
                                                 that.common.messageUtil({
                                                     type:'success',
                                                     message:res.data
                                                 });
                                                 that.getHolidayData();
                                                 that.holidayOpreDialog = false
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
                                             message:'节假日名称/日期重复'
                                         })
                                     }
                                 })
                             }else{
                                 ip.updateHoliday(this.holidayData,res => {
                                     if(res.code === 200){
                                         that.common.messageUtil({
                                             type:'success',
                                             message:res.data
                                         });
                                         that.getHolidayData();
                                         that.holidayOpreDialog = false
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
                             let param = {
                                 holidayName:this.holidayData.holidayName,
                                 year:this.holidayData.year,
                                 startDate:this.holidayData.startDate,
                                 endingDate:this.holidayData.endingDate
                             };
                             ip.checkHolidayValidity(param,res => {
                                 if(res.data){
                                     ip.addHoliday(that.holidayData,res => {
                                         if(res.code === 200){
                                             that.common.messageUtil({
                                                 type:'success',
                                                 message:res.data
                                             });
                                             that.getHolidayData();
                                             that.holidayOpreDialog = false
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
                                         message:'节假日名称/日期重复'
                                     })
                                 }
                             })
                         }
                     } else {
                         return false
                     }
                 })
            },
            getHolidayData(param){
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
                        name:'holidayName',
                        value:this.holidayName
                    }
                ];
                this.year||this.year === 0?condition.push({name:'year',value:this.year}):[];
                tem = this.common.joinSearchParam(condition);
                if(param === true){tem = '';}
                ip.getHolidayList(tem,function (res) {
                    if(res.data === null){
                        that.tableData = [];
                        that.totalRecords = 0
                    }else{
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }
                })
            },
            removeRow(holidayId) {
                var that = this;
                this.$confirm('确定删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteHoliday(holidayId,function (res) {
                        if(res.code === 200){
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.getHolidayData(true);
                        }else{
                            that.common.messageUtil({
                                type: 'info',
                                message: res.msg
                            });
                            that.getHolidayData(true);
                        }
                    });
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            getSearchCondition(){
                let that = this;
                let date = new Date();
                this.yearDialog = date.getFullYear();
                ip.getYears(res => {that.options = res.data});
            },
            reset(){
                this.holidayName = null;
                this.year = null;
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            this.getHolidayData();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .dialogContent .el-dialog .el-form .el-form-item .el-form-item__content
    {
        .el-range-editor.el-input__inner{
            width:100%
        }
    }
</style>
