<template>
  <div class="mainContent">
    <div class="dataContent">
      <div class="opreRight">
        <el-button size="small"  @click="addList" class="c-button c-button--primary">新增</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="adjustType" label="调整类型" width="130px">
        </el-table-column>
        <el-table-column prop="bohProject1" label="BOH项目1">
        </el-table-column>
        <el-table-column prop="bohProject2" label="BOH项目2">
        </el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailRow(scope.row, '1')"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="scope.row.adjustType.indexOf('A') !== 0">
              <el-button size="small"   @click="detailRow(scope.row, '2')" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip" v-if="scope.row.delRight == 1">
              <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row)"><i class="fa fa-trash-alt"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecords" :page-sizes="pageSizeList">
        </el-pagination>
      </div>
    </div>
    <!--新增-->
    <el-dialog  :visible.sync="bohSubjectDialog" class="dialogContent" width="40%">
      <div slot="title">{{bohSubjectDialogTitle}}</div>
      <el-form :model="bohSubjectForm"  label-width="110px" ref="bohSubjectForm" :rules="rules">
        <el-form-item label="调整类型"  prop="adjustType" class="formItemBlock" :error="typeErrMsg">
          <el-select size="small"  v-model="bohSubjectForm.adjustType" filterable placeholder="请选择" :disabled="disabled || typeDisabled">
            <el-option v-for="item in adjustTypeOpt" :key="item.id" :label="item.dictionaryEntryCode" :value="item.id" :disabled="item.dictionaryEntryCode == 'C4' || item.dictionaryEntryCode == 'C1'" >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整说明"  prop="adjustDesc" class="formItemBlock">
          <el-input type="textarea" size="small" :autosize="{ minRows: 8, maxRows: 10}" v-model.trim="bohSubjectForm.adjustDesc" maxlength="200" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="BOH项目1" prop="bohProject1" class="formItemBlock">
          <el-select size="small"  v-model="bohSubjectForm.bohProject1" filterable :disabled="disabled" @change="bohSubjectChange" >
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in oneSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BOH项目2" prop="bohProject2" class="formItemBlock">
          <el-select size="small"  v-model="bohSubjectForm.bohProject2" filterable :disabled="disabled" @change="bohSubjectChange" >
            <el-option label="请选择" value=""></el-option>
            <el-option v-for="(item, index) in twoSelect" :key="index" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整正负值" class="formItemBlock">
          <span v-if="amountType === 1">同正同负</span>
          <span v-else-if="amountType === 0">相加为0</span>
        </el-form-item>
        <el-form-item label="更新时间"  prop="modifiedTime" class="formItemBlock" v-if="isShow">
          <el-input size="small"  v-model.trim="bohSubjectForm.modifiedTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新人"  prop="modifiedUser" class="formItemBlock" v-if="isShow">
          <el-input size="small"  v-model.trim="bohSubjectForm.modifiedUser" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!disabled">
        <el-button size="small"  @click="bohSubjectDialog = false" class="c-button c-button--plain">取 消</el-button>
        <el-button size="small"  @click="submitForm('bohSubjectForm')" class="c-button c-button--primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
	import api from '../../model/api'
    export default{
        name:'bohSubject',
        data(){
        	var validateProOne = (rule, value, callback) => {
        	  if (value === '') {
                if (this.bohSubjectForm.bohProject2 == '') {
                  this.$refs.bohSubjectForm.clearValidate('bohProject2')
                  callback()
                } else{
                  callback(new Error('请选择BOH项目1'))
                }
              } else {
                if (this.bohSubjectForm.bohProject2 == '') {
                  this.$refs.bohSubjectForm.validateField('bohProject2')
                  callback()
                } else if (value === this.bohSubjectForm.bohProject2) {
                  callback(new Error('当前数据有误'))
                } else {
                  this.$refs.bohSubjectForm.clearValidate('bohProject2')
                  callback()
                }
              }
        	}
        	var validateProTwo = (rule, value, callback) => {
        	  if (value === '') {
                if (this.bohSubjectForm.bohProject1 == '') {
                  this.$refs.bohSubjectForm.clearValidate('bohProject1')
                  callback()
                } else{
                  callback(new Error('请选择BOH项目2'))
                }
              } else {
              	if (this.bohSubjectForm.bohProject1 == '') {
                  this.$refs.bohSubjectForm.validateField('bohProject1')
                  callback()
                } else if (value === this.bohSubjectForm.bohProject1) {
                  callback(new Error('当前数据有误'))
                } else {
                  this.$refs.bohSubjectForm.clearValidate('bohProject1')
                  callback()
                }
              }
        	}
          return{
            importOpreDialog:false,
            importUrl:'',
            uploadDisabled:true,
            loadFile:false,
            isTimeOut:false,
            fileList:[],
            tableData:[],
            bohSubjectDialog: false,
            bohSubjectDialogTitle: '调整类型-BOH项目-新增',
            bohSubjectForm: {
              adjustType: '',
              adjustDesc: '',
              bohProject1: '',
              bohProject2: '',
            },
            adjustTypeOpt: [],
            oneSelect: [],
            twoSelect: [],
            typeErrMsg: '',
            rules: {
              adjustType: [{required: true, message: '请选择调整类型', trigger: 'change'}],
		          bohProject1: [
		            { type: 'string', validator: validateProOne, trigger: 'change' }
		          ],
		          bohProject2: [
		            { type: 'string', validator: validateProTwo, trigger: 'change' }
		          ]
		        },
		        disabled: false,
		        isShow: false,
		        filterable: false,
		        isUpdate: false,
		        operateId: 0,
            pageSizeList:[25, 50, 75, 100, 125],
            totalRecords:0,
            currentPage: 1,
            pageSize:25,
            editAdjustType: '',
            allAdjustType: [],
            defaultAdjustType: [],
            typeDisabled: false,
            amountType: '',
          }
        },
        methods:{
          handleSizeChange(val){
            this.pageSize = val
            this.getBOHSubjectList()
          },
          handleCurrentChange(val){
            this.currentPage = val
            this.getBOHSubjectList()
          },
          getDictionaryByNumber () {
            let that = this
            api.getDictionaryByNumber('ADJUST_TYPE', function(res) {
              if(res.code === 200) {
                that.allAdjustType = JSON.parse(JSON.stringify(res.data))
                that.adjustTypeOpt = JSON.parse(JSON.stringify(res.data))
                // for (let i = 0; i < that.adjustTypeOpt.length; i++) {
                  // if (that.adjustTypeOpt[i].dictionaryEntryCode === 'A1-1' ||
                  // that.adjustTypeOpt[i].dictionaryEntryCode === 'A1-2' ||
                  // that.adjustTypeOpt[i].dictionaryEntryCode === 'A1-3' ||
                  // that.adjustTypeOpt[i].dictionaryEntryCode === 'A1-4') {
                  //   that.adjustTypeOpt.splice(i, 1)
                  //   i--
                  // }
                // }
                that.defaultAdjustType = JSON.parse(JSON.stringify(that.adjustTypeOpt))
              } else if (res.code != 404) {
                that.showTips(res.msg,'warning')
              }
            })
          },
          getBOHSubjectList () {
            let that = this
            let param = [{
              name: 'pageIndex',
              value: this.currentPage
            }, {
              name:'pageSize',
              value:this.pageSize
            }]
            api.getBOHSubjectList(this.common.joinSearchParam(param),function(res){
              that.tableData = res.data.list
              that.totalRecords= res.data.totalRecords
              if(res.code === 200) {
                that.tableData = res.data.list
                that.totalRecords= res.data.totalRecords
              } else if (res.code != 404) {
                that.showTips(res.msg,'warning')
              }
            })
          },
          getBohProject () {
          	let that = this
            api.getBohProject(function(res){
              if(res.code === 200) {
              	let oneOptions = res.data
              	let twoOptions = res.data
                that.oneSelect = oneOptions
                that.twoSelect = twoOptions
              } else if (res.code != 404) {
                that.showTips(res.msg,'warning')
              }
            })
          },
          bohSubjectChange () {
            let _self = this;
            if(this.bohSubjectForm.bohProject1 && this.bohSubjectForm.bohProject2){
              let _self = this;
              let param = this.common.formatPathParam({
                bohProject1 : this.bohSubjectForm.bohProject1,
                bohProject2 : this.bohSubjectForm.bohProject2
              });
              api.getAdjustTypeAmountType(param,function(res){
                if(res.code === 200){
                  _self.amountType = res.data;
                }else{
                  _self.common.errorMessage(res.msg);
                }
              })
            }else{
              this.amountType = '';
            }
          },
          checkAdjustType () {
            let that = this
            let param = [{
              name: 'adjustType',
              value: this.bohSubjectForm.adjustType
            }]
            api.checkAdjustType(this.common.joinSearchParam(param),function(res){
              if(res.code === 200) {
                if (res.data) {
                  if (that.isUpdate) {
                    that.updateBohSubject()
                  } else{
                  	that.insertBohSubject()
                  }
                } else{
                  that.typeErrMsg = '该调整类型已存在'
                }
              } else if (res.code != 404) {
                that.showTips(res.msg,'warning')
              }
            })
          },
          insertBohSubject () {
          	let that = this
          	let bohSubjectForm = {
          	  adjustType: this.bohSubjectForm.adjustType,
          	  adjustDesc: this.bohSubjectForm.adjustDesc,
              bohProject1: this.bohSubjectForm.bohProject1,
              bohProject2: this.bohSubjectForm.bohProject2,
          	}
          	let params = Object.assign(bohSubjectForm, {adjustTypeName: this.checkCode(this.bohSubjectForm.adjustType)})
            api.insertBohSubject(params, function(res) {
              if (res.code === 200) {
                that.showTips(res.data,'success')
                that.getBOHSubjectList()
              } else if (res.code !== 404) {
                that.showTips(res.msg,'warning')
              }
              that.bohSubjectDialog = false
            })
          },
          updateBohSubject () {
          	let that = this
            let param = {
              adjustType: this.bohSubjectForm.adjustType,
              adjustTypeName: this.checkCode(this.bohSubjectForm.adjustType),
              adjustDesc: this.bohSubjectForm.adjustDesc,
              bohProject1: this.bohSubjectForm.bohProject1,
              bohProject2: this.bohSubjectForm.bohProject2,
              id: this.operateId
            }
            api.updateBohSubject(param, function(res){
              if (res.code === 200) {
                that.showTips(res.data,'success')
                that.getBOHSubjectList()
              } else if (res.code !== 404) {
                that.showTips(res.msg,'warning')
              }
              that.bohSubjectDialog = false
            })
          },
          submitForm (formName) {
            this.typeErrMsg = ''
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if (this.isUpdate) {
                  this.editAdjustType == this.bohSubjectForm.adjustType ? this.updateBohSubject() : this.checkAdjustType()
                } else{
                	this.checkAdjustType()
                }
              } else {
                return false
              }
            })
          },
          addList(){
          	this.bohSubjectDialogTitle = '调整类型-BOH项目-新增'
          	this.disabled = false
          	this.isShow = false
          	this.typeDisabled = false
          	this.isUpdate = false
          	this.bohSubjectForm = {
          		adjustType: '',
              adjustDesc: '',
              bohProject1: '',
              bohProject2: ''
            }
            this.amountType = ''
          	this.bohSubjectDialog = true
            if (this.$refs.bohSubjectForm) {
              this.$refs.bohSubjectForm.resetFields()
            }
          },
          detailRow (row, type) {
          	this.bohSubjectDialogTitle = type === '1' ? '调整类型-BOH项目-详情' : '调整类型-BOH项目-编辑'
          	this.disabled = type === '1' ? true : false
          	this.isShow = true
          	let formInfo = row
          	this.operateId = row.id
          	this.bohSubjectForm = Object.assign({}, formInfo)
            if (type === '1') {
              this.adjustTypeOpt = JSON.parse(JSON.stringify(this.allAdjustType))
            } else {
              if (this.bohSubjectForm.adjustType === 'A1-1' || this.bohSubjectForm.adjustType === 'A1-2' ||
              this.bohSubjectForm.adjustType === 'A1-3' || this.bohSubjectForm.adjustType === 'A1-4') {
              	this.adjustTypeOpt = JSON.parse(JSON.stringify(this.allAdjustType))
              	this.typeDisabled = true
              } else{
              	this.adjustTypeOpt = JSON.parse(JSON.stringify(this.defaultAdjustType))
              	this.typeDisabled = false
              }
            }
            this.$set(this.bohSubjectForm, 'adjustType', this.checkName(this.bohSubjectForm.adjustType))
            this.editAdjustType = this.bohSubjectForm.adjustType
            this.isUpdate = true
            if (this.$refs.bohSubjectForm) {
              this.$refs.bohSubjectForm.clearValidate()
            }
            this.bohSubjectChange()
            this.bohSubjectDialog = true
          },
          deleteRow(row){
            let that = this
            this.$confirm('确定删除?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let param = [{
                name:'id',
                value: row.id
              }]
              api.delBohSubjectById(that.common.joinSearchParam(param),function(res){
                if (res.code === 200) {
                  that.showTips(res.data,'success')
                  that.getBOHSubjectList()
                } else if (res.code !== 404) {
                  that.showTips(res.msg,'warning')
                }
              })
            }).catch(() => {
              that.common.infoMessage('已取消删除')
            })
          },
          checkCode (id) {
          	let entryCode = ''
            this.adjustTypeOpt.forEach(function(val, index) {
              if (val.id == id) {
                entryCode = val.dictionaryEntryCode
                return false
              }
            })
            return entryCode
          },
          checkName (name) {
          	let entryName = ''
            this.allAdjustType.forEach(function(val, index) {
              if (val.dictionaryEntryCode == name) {
                entryName = val.id
                return false
              }
            })
            return entryName
          },
          showTips(text,type){
            this.common.messageUtil({
              message: text,
              type: type
            })
          }
        },
        beforeMount () {
          this.getBOHSubjectList()
          this.getBohProject()
          this.getDictionaryByNumber()
        },
    }
</script>
<style lang="scss" scoped>
    .loadFileContent {
        .dialog-footer {
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding-top: 20px;
        }
    }
    .dialogContent .el-dialog {
    	.el-form {
    		.formItemBlock {
              display: block;
              width: 88%;
            }
        }
        .dialog-footer {
          text-align: center;
        }
    }
</style>
