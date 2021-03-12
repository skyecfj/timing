<!--主档管理.通知-->
<template>
    <div id="integralMng">
        <div class="mainContent">
            <div class="dataContent">
            <div class="opreRight">
                <el-button size="small" @click="newCreate" class="c-button c-button--primary">新增</el-button>
            </div>
            <el-table :data="tableDataIntegral" style="width: 100%" border>
                <el-table-column prop="id" label="记录ID" min-width="50px"></el-table-column>
                <el-table-column prop="kValue" label="V金值" min-width="50px"></el-table-column>
                <el-table-column prop="equivalentValue" label="等价值(含税)" min-width="50px"></el-table-column>
                <el-table-column prop="startDate" label="生效日期" min-width="80px"></el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="changeDetails(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="alterDataSource(scope.row.id,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip  v-if="scope.row.state != 0" content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="alterDataSource(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="removeRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizesList"
                    :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
            </div>

        </div>
        <!--新增-->
        <el-dialog :visible.sync="integralDialog" class="dialogContent" width="70%" @closed="$refs.integralForm.clearValidate()" @opened="$refs.integralForm? $refs.integralForm.clearValidate() : null" >
            <div slot="title">
                {{integralDialogTitle}}
            </div>
            <el-form :model="integralForm" label-width="100px" :rules="rules" ref="integralForm">
                <el-form-item label="V金值" prop="kValue">
                    <el-input size="small"  v-model.trim="integralForm.kValue" clearable :disabled="isDisabled || integralForm.updateFlag" :placeholder="isDisabled?'':'请输入V金值'" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="等价值(含税)" prop="equivalentValue">
                    <el-input size="small"  v-model.trim="integralForm.equivalentValue" clearable :disabled="isDisabled || integralForm.updateFlag" :placeholder="isDisabled?'':'请输入等价值'" maxlength="16"></el-input>
                </el-form-item>
                <el-form-item label="品牌" class="viewFormRate" prop="brandId" :placeholder="isDisabled?'':'请选择品牌'" >
                    <el-select size="small"  v-model="integralForm.brandId" filterable :disabled="isDisabled || integralForm.updateFlag">
                        <el-option v-for="(item,index) in brandIdOpt" :key="index" :label="item.englishName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="生效日期" prop="startDate">
                     <el-date-picker size="small" v-model="integralForm.startDate" type="date"
                                     clearable value-format="yyyy-MM-dd" placeholder="请选择生效日期"
                                     :disabled="isDisabled || integralForm.updateFlag" :picker-options="pickerDateOption" >
                  </el-date-picker>
                </el-form-item>
                <div>
                <el-form-item label="更新时间" v-if="isEdit||isDisabled">
                    <el-date-picker v-model="integralForm.modifiedTime" type="datetime"  clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="isEdit||isDisabled">
                    <el-input size="small"  v-model.trim="integralForm.modifiedUser" clearable disabled></el-input>
                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="integralDialog = false" class="c-button--plain">取 消</el-button>
                <el-button size="small"  @click="newAddForm()" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
        <!--新增-->
        <!--变更详情-->
        <el-dialog :visible.sync="changeDetailDialog" class="dialogContent" width="70%" title="变更详情" >
            <el-table :data="tableLogData" border>
                <el-table-column prop="fieldName" label="更新字段"></el-table-column>
                <el-table-column prop="startValue" label="原值"></el-table-column>
                <el-table-column prop="updateValue" label="更新值"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人员"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleLogSizeChange"
                        @current-change="handleLogCurrentChange"
                        :current-page="currentLogPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageLogSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalLogRecords">
                </el-pagination>
            </div>
        </el-dialog>
        <!--变更详情-->
    </div>
</template>
<script>
    import api from '../../model/api'
    export default {
        name:'integral',
        data() {
            var validNumber = (rule, value, callback) => {
                if (!/^[0-9]+$/.test(value)) {
                    callback(new Error('只能输入数字'));
                }
                else{
                    callback()
                }
            };
            var floatNumPass = (rule, value, callback)=> {
                const reg = /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,4})?$/;
                if (!value) {
                    return callback(new Error('请输入正确的金额'))
                } else if (!reg.test(value)) {
                    return callback(new Error('请输入正确的金额,最多4位小数'))
                } else {
                    callback()
                }
            };
            return {
                originalIntegralForm:{startDate:'',brandId : ''},
                integralForm:{startDate:'',brandId : ''},
                tempEffectDate:'',
                isDisabled:false,
                integralDialog:false,
                integralDialogTitle:'',
                isEdit:false,
                totalRecords:0,
                tableDataIntegral: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                totalLogRecords:0,
                currentLogPage: 1,
                pageLogSize:10,
                tableLogData:[],
                matserModule:'主档管理',
                subModule:'积分主档',
                operationId:'',
                userName:'',
                rules:{
                    kValue:[
                        { required:true, message: 'V金值不能为空', trigger: ['blur'] },
                        { validator:validNumber, trigger: ['blur']}
                    ],
                    equivalentValue:[
                        { required:true, message: '等价值不能为空', trigger: ['blur'] },
                        { validator:floatNumPass, trigger: ['blur']}
                    ],
                    startDate:[
                        { required: true, message: '请选择生效日期', trigger: 'blur' },
                    ],
                    brandId:[
                        { required: true,message: '请选择品牌', trigger: 'change'}
                    ]
                },
                changeDetailDialog:false,
                pickerDateOption:{
                    disabledDate(time){
                        return time.getTime() < new Date(new Date().getTime() - 24*60*60*1000)
                    }
                },
                brandIdOpt:[]
            }
        },
        beforeMount(){
            this.getIntegralList();
            this.getBrandOpts();
        },
        methods: {
            handleLogSizeChange(val){
                this.pageLogSize = val
                this.getLogList()
            },
            handleLogCurrentChange(val){
                this.currentLogPage = val
                this.getLogList()
            },
            handleSizeChange:function(size) {
                this.pageSize = size;
                this.getIntegralList()
            },
            handleCurrentChange:function(currentPage) {
                this.currentPage = currentPage;
                this.getIntegralList()
            },
            getBrandOpts(){
                let _self = this;
                api.getBrandEnglishNames('?flag=3',res => {_self.brandIdOpt = res.data});
            },
           getIntegralList(){
               var that = this
               var param =[{
                   name:'pageIndex',
                   value:this.currentPage
               },
               {
                   name:'pageSize',
                   value:this.pageSize
               }]
               api.getIntegralList(this.common.joinSearchParam(param),function(res){
                    that.tableDataIntegral = [];
                    that.totalRecords = 0;
                    if(res.code === 200)
                    {
                        that.tableDataIntegral = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                    else if(res.code != 404){
                        that.showTips(res.msg,'warning')
                    }
               })
           },
           getLogList(){
                var that = this
                var param = [
                    {
                        name:'pageIndex',
                        value:this.currentLogPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageLogSize
                    },
                    {
                        name:'module',
                        value: this.matserModule
                    },
                    {
                        name:'submodule',
                        value:this.subModule
                    },
                    {
                        name:'operationId',
                        value:this.operationId
                    }]
                api.getDataLog(this.common.joinSearchParam(param),function(res){
                        that.tableLogData = [];
                        that.totalLogRecords = 0;
                        if(res.code === 200)
                        {
                            that.tableLogData = res.data.list;
                            that.totalLogRecords = res.data.totalRecords;
                        }
                 })
            },
            alterDataSource(integralId,isEdit){
                var that = this
                this.isEdit = isEdit
                this.isDisabled = !isEdit
                this.integralDialogTitle = isEdit ? '积分-编辑':'积分-详情'
                this.integralDialog = true
                if(this.$refs.integralForm){
                  this.$refs.integralForm.clearValidate()
                }
                that.integralForm = {startDate:''}
                api.getIntegralById(integralId,function(res){
                    // if(res.data.startDate > that.getCurrentDate()){
                    //     that.$set(res.data,'updateFlag',false)
                    // }else{
                    //     that.$set(res.data,'updateFlag',true)
                    // }
                    that.tempEffectDate = res.data.startDate
                    that.integralForm = res.data
                    that.integralForm.brandId = Number(res.data.brandId)
                    that.originalIntegralForm = Object.assign({},that.integralForm)
                })
            },
            changeDetails(operationId){
                this.changeDetailDialog = true
                this.operationId = operationId
                this.pageLogSize = 10
                this.currentLogPage = 1
                this.getLogList()
            },
            removeRow(integralId){
             var that = this
             this.$confirm('确定删除?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                 var param = [
                    {
                        name:'module',
                        value: that.matserModule
                    },
                    {
                        name:'subModule',
                        value:that.subModule
                    },
                    {
                        name:'id',
                        value:integralId
                    }
                 ]
                 api.deleteIntegral(that.common.joinSearchParam(param),function(res){
                   res.code === 200 ? (that.showTips(res.data,'success') ,that.getIntegralList()): that.showTips(res.msg,'warning')
                 })
          }).catch(() => {
             that.showTips('已取消删除','info')
             })
        },
        newCreate(){
            this.isEdit = false
            this.isDisabled = false
            this.integralDialogTitle = '积分-新增'
            this.integralForm = {startDate:'',brandId : ''}
            this.originalIntegralForm = {startDate:'',brandId : ''}
            this.integralDialog = true
            if(this.$refs.integralForm){
                this.$refs.integralForm.clearValidate()
            }
        },
        newAddForm(){
            var that = this
             this.$refs.integralForm.validate((valid) => {
                if (valid) {
                    //有效期验证
                    let param = {
                        starteDate:that.integralForm.startDate,
                        brandId : that.integralForm.brandId
                    }
                    if(that.tempEffectDate != that.integralForm.startDate){
                        api.checkValidityIntegral(param,function(res){
                            if(res.code == 200){
                                if(res.data){
                                    that.submitParam()
                                }else{
                                    that.common.warningMessage('生效日期不能重复,请重新选择')
                                }
                            }else{
                                that.common.warningMessage(res.msg)
                            }
                        })
                    }else{
                        that.submitParam();
                    }

                } else {
                    return false;
                }
            });
        },
        submitParam(){
            var that = this
            var param = {
                startDate:this.integralForm.startDate ,
                equivalentValue:this.integralForm.equivalentValue,
                brandId:this.integralForm.brandId,
                kvalue:this.integralForm.kValue ,
                id:this.common.isNullString(this.integralForm.id)?null:this.integralForm.id,
            }
            var pathParam = [
                {
                    name:'module',
                    value: that.matserModule
                },
                {
                    name:'subModule',
                    value:that.subModule
                }
            ]
            if(that.isEdit){
                api.updateIntegral(that.common.joinSearchParam(pathParam),param,function(res){
                res.code === 200 ? (that.showTips(res.data,'success') ,that.getIntegralList()): that.showTips(res.msg,'warning')
                })
            }
            else{
                api.addIntegral(that.common.joinSearchParam(pathParam),param,function(res){
                res.code === 200 ? (that.showTips(res.data,'success') ,that.getIntegralList()): that.showTips(res.msg,'warning')
                })
            }
            that.$refs.integralForm.clearValidate()
            that.integralDialog = false
        },
        getCurrentDate(){
            var currentDate = new Date()
            var currentYear = currentDate.getFullYear()
            var currentMonth = currentDate.getMonth() + 1
            currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
            var currentDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
            var currentDateString = currentYear + '-' + currentMonth +'-'+currentDay
            return currentDateString.toString()
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
<style scoped lang="scss">
    @import '../../assets/scss/masterMng';
    .deleteColor {
        color: #F56C6C;
    }
    .changeDetailIcon{
       margin-right: 10px
    }
</style>
