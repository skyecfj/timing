<template>
  <div class="mainContent">
  	<div class="center">
    <el-form :model="bankConfigForm" :label-position="labelPosition" label-width="100px" ref="bankConfigForm" :rules="rules">
      <el-form-item label="银行"  prop="bank" class="inline-item">
        <el-select size="small"  v-model.trim="bankConfigForm.bank" @change="handleChange" filterable placeholder="请选择">
          <el-option v-for="item in bankOption" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="银行编号"  prop="bankCode" class="inline-item">
        <el-input size="small" v-model="bankConfigForm.bankCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="文件上传" required :error="errorMsg">
        <div v-loading="loadFile"
        class="upload"
        element-loading-text = "上传中..."
        element-loading-spinner = "el-icon-loading"
        element-loading-background = "transparent">
          <el-upload
          :action="importUrl"
          ref="importBankBill"
          :file-list="fileList"
          :before-upload="beforeFileUpload"
          :on-remove="removeFile"
          :on-error="uploadError"
          :on-success="uploadSuccess"
          :limit="1" multiple>
            <el-button type="text"><i class="fa fa-upload fa-5x"></i></el-button>
            <div slot="tip" class="el-upload__tip">
              <p>请选择文件上传</p>
              <p style="color: #E3E3E3">仅支持单个上传。严禁上传公司数据或其他带文件</p>
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="数据读取范围" required>
        <div class="range-set">
          <el-form-item prop="dataStartRow" class="item-line">
            <el-input size="small" v-model.trim="bankConfigForm.dataStartRow">
              <template slot="prepend">第</template>
              <template slot="append">行</template>
            </el-input>
           </el-form-item>
           &nbsp;&nbsp;至&nbsp;&nbsp;
           <el-form-item prop="dataEndRow" class="item-line">
            <el-input size="small"  v-model.trim="bankConfigForm.dataEndRow">
              <template slot="prepend">第</template>
              <template slot="append">行</template>
            </el-input>
           </el-form-item>
        </div>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="bankConfigForm.state">
          <el-radio label="启用">启用</el-radio>
          <el-radio label="禁用">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    </div>
    <div class="field-wrap">
    	<p class="name">数据项配置</p>
      <el-form :model="fieldsForm" label-width="170px" ref="fieldsForm" :rules="dataRules">
        <template v-for="(item, index) in standardFormat">
          <el-form-item :label="item.name" :prop="item.modelParam" class="">
            <el-select size="small"
              v-model="fieldsForm[item.modelParam]"
              filterable
              placeholder="请选择字段" :disabled="item.modelParam === 'transactionDate' || item.modelParam === 'bookDate'">
          	  <el-option label="请选择字段" value=""></el-option>
              <el-option v-for="(item, index) in options" :value="item" :key="index">
              </el-option>
            </el-select>&nbsp;&nbsp;
            <el-button size="small" type="success" class="c-button"
              @click="dateSet(item.modelParam)" 
              v-if="item.modelParam === 'transactionDate'">{{ transactionDateName }}</el-button>
            <el-button size="small" type="success" class="c-button"
              @click="dateSet(item.modelParam)" 
              v-else-if="item.modelParam === 'bookDate'">{{ bookDateName }}</el-button>
            <el-button size="small" type="success" class="c-button"
              @click="clearSet(item.modelParam)"
              v-if="item.modelParam === 'transactionDate' || item.modelParam === 'bookDate'">清空</el-button>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div class="opreRight">
      <el-button size="small" @click="cancel" plain type="success">取消</el-button>
      <el-button size="small" @click="save('bankConfigForm')" type="success">保存</el-button>
    </div>
    <el-dialog title="设置" :visible.sync="dialogDateSet" class="setDateDialog">
      <el-form :model="amountForm" ref="amountForm" :label-position="labelPosition">
        <el-form-item label="时间类型" v-if="setDateType === 'bookDate'">
          <el-radio-group v-model="amountForm.content[0].dateType">
            <el-radio :label="1">年月日&时分秒</el-radio>
            <el-radio :label="2">年月日</el-radio>
          </el-radio-group>
          <div class="date-select">
        	  <div class="date-and-time" v-if="amountForm.content[0].dateType === 1">
        	  	<el-select size="small" v-model="amountForm.content[0].fileField" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
        	    <el-select class="dataTime" size="small" v-model="amountForm.content[0].dateTime">
                <el-option v-for="item in tradeDateTimeFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
              </el-select>
              <el-select class="dataConPos" v-model="amountForm.content[0].dataCondition" placeholder="">
                <el-option label="+" value="+"></el-option>
                <el-option label="-" value="-"></el-option>
                <el-option label="无" value=""></el-option>
              </el-select>
              <el-input v-if="amountForm.content[0].dataCondition === '+' || amountForm.content[0].dataCondition === '-'" class="datePos" placeholder="单行输入" size="small" v-model.trim="amountForm.content[0].value"></el-input>
        	  </div>
        	  <div class="date-or-time" v-else>
        	  	<el-select size="small" v-model="amountForm.content[0].fileField" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
              <el-select size="small" v-model="amountForm.content[0].date">
                <el-option v-for="item in tradeDateFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
              </el-select>
              <el-select class="dataConPos" v-model="amountForm.content[0].dataCondition" placeholder="">
                <el-option label="+" value="+"></el-option>
                <el-option label="-" value="-"></el-option>
                 <el-option label="无" value=""></el-option>
              </el-select>
              <el-input v-if="amountForm.content[0].dataCondition === '+' || amountForm.content[0].dataCondition === '-'" class="datePos" placeholder="单行输入" size="small" v-model.trim="amountForm.content[0].value"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="时间类型" v-else>
          <el-radio-group v-model="amountForm.content[1].dateType">
            <el-radio :label="1">年月日&时分秒</el-radio>
            <el-radio :label="3">年月日|||时分秒</el-radio>
            <el-radio :label="2">年月日</el-radio>
          </el-radio-group>
          <div class="date-select">
        	  <div class="date-and-time" v-if="amountForm.content[1].dateType === 1">
        	  	<el-select size="small" v-model="amountForm.content[1].fileField" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
        	    <el-select class="dataTime" size="small" v-model="amountForm.content[1].dateTime">
                <el-option v-for="item in tradeDateTimeFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
             </el-select>
             <el-select size="small"  v-model.trim="amountForm.content[1].sequence">
                <el-option v-for="item in orderOption" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
        	  </div>
        	  <div class="date-and-time" v-else-if="amountForm.content[1].dateType === 3">
        	  	<el-select size="small" v-model="amountForm.content[1].fileFieldDate" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
              <el-select size="small" v-model="amountForm.content[1].date">
                <el-option v-for="item in tradeDateFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
              </el-select>
              <el-select size="small" v-model="amountForm.content[1].fileFieldTime" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
              <el-select size="small" v-model="amountForm.content[1].time">
                <el-option v-for="item in tradeTimeFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
              </el-select>
              <el-select size="small"  v-model.trim="amountForm.content[1].sequence">
                <el-option v-for="item in orderOption" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div class="date-or-time" v-else>
            	<el-select size="small" v-model="amountForm.content[1].fileField" placeholder="请选择字段">
                <el-option v-for="(item, index) in options" :value="item" :key="index">
                </el-option>
              </el-select>
              <el-select size="small" v-model="amountForm.content[1].dates">
                <el-option v-for="item in tradeDateFormat" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
              </el-select>
              <el-select size="small"  v-model.trim="amountForm.content[1].sequence">
                <el-option v-for="item in orderOption" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" class="c-button" plain @click="dialogDateSet = false">取 消</el-button>
        <el-button size="small" class="c-button" type="success" @click="saveSet">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../model/api'
import tempIp from '../../model/tempIp'
import Main from '../../main'

export default {
  name:'bankConfigAdd',
  data(){
  	var readRange = (rule,value,callback) => {
      if (!/^(\-?)([0-9]{1,5})$/.test(value) && !this.common.isNullString(value)) {
        callback(new Error('只能输入1-5位的数字'));
      } else if (value === '') {
        callback(new Error(' '))
      } else {
        callback()
      }
    }
    return {
      rowId: '',
    	labelPosition: 'top',
      bankConfigForm: {
        bank: '',
        bankCode: '',
        dataStartRow: '',
        dataEndRow: '',
        state: '启用',
        filePath: '',
        fileName: ''
      },
      rules: {
        bank: [
          { required: true, message: '请选择银行', trigger: 'change' }
        ],
        dataStartRow: [
          { validator: readRange, trigger: 'blur' }
        ],
        dataEndRow: [
          { validator: readRange, trigger: 'blur' }
        ],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      bankOption: [],
      orderOption: [{
        id: 1,
        name: '正序'
      }, {
        id: 2,
        name: '倒序'
      }],
      tradeDateTimeFormat: [],
      tradeDateFormat: [],
      tradeTimeFormat: [],
      loadFile: false,
      importUrl: tempIp.master_ip + '/bankFlow-standard-config/uploadFile',
      fileList: [],
      errorMsg: '',
      dataRules: {
      	bookDate: [{ required: true, message: '请选择记账日期', trigger: 'change' }],
      	transactionDate: [{ required: true, message: '请选择交易时间', trigger: 'change' }],
        creditAccount: [{ required: true, message: '请选择贷方发生额', trigger: 'change' }],
        debitAccount: [{ required: true, message: '请选择借方发生额', trigger: 'change' }],
        balance: [{ required: true, message: '请选择余额', trigger: 'change' }],
      },
      fieldsForm: {
        batch: '',
        transactionDate: '',
        bookDate: '',
        creditAccount: '',
        debitAccount: '',
        balance: '',
        bankJdeCode: '',
        summary: '',
        businessType: '',
        purpose: '',
        note: '',
        reciprocalAccount: '',
        reciprocalUsername: '',
        intelligenceCardNumber: '',
        receiptPersonalInformation: '',
        payeeAccount: '',
        payeeName: ''
      },
      standardFormat: [{
        name: '交易流水号',
        modelParam: 'batch'
      }, {
        name: '记账日期',
        modelParam: 'bookDate'
      }, {
        name: '交易时间（小时/分钟）',
        modelParam: 'transactionDate'
      }, {
        name: '贷方发生额（收入）',
        modelParam: 'creditAccount'
      }, {
        name: '借方发生额（支出）',
        modelParam: 'debitAccount'
      }, {
        name: '余额',
        modelParam: 'balance'
      }, {
        name: '银行JDE号',
        modelParam: 'bankJdeCode'
      }, {
        name: '摘要',
        modelParam: 'summary'
      }, {
        name: '备注',
        modelParam: 'note'
      }, {
        name: '对方账号',
        modelParam: 'reciprocalAccount'
      }, {
        name: '对方用户名',
        modelParam: 'reciprocalUsername'
      }, {
        name: '收款人账号',
        modelParam: 'payeeAccount'
      }, {
        name: '收款人名称',
        modelParam: 'payeeName'
      }, {
        name: '财智卡卡号',
        modelParam: 'intelligenceCardNumber'
      }, {
        name: '回单个性化信息',
        modelParam: 'receiptPersonalInformation'
      }],
      options: [],
      mainModule: '主档管理',
      childModule: '银行流水标准格式配置',
      dialogDateSet: false,
      setDateType: 'bookDate',
      amountForm: {
      	content: [{
      	  dateType: 1,
          fileField: '',
          dateTime: 'yyyy-MM-dd HH:mm:ss',
          date: 'yyyy-MM-dd',
          dataCondition: '',
          value: ''
      	}, {
      	  dateType: 1,
          dateTime: 'yyyy-MM-dd HH:mm:ss',
          fileFieldDate: '',
          date: 'yyyy-MM-dd',
          fileFieldTime: '',
          time: 'hh:mm:ss',
          fileField: '',
          dates: '',
          sequence: '正序'
      	}]
      },
      setSavedFrom: {}
    }
  },
  computed: {
    transactionDateName () {
      return this.fieldsForm.transactionDate ? '已设置' : '设置'
    },
    bookDateName () {
      return this.fieldsForm.bookDate ? '已设置' : '设置'
    }
  },
  methods:{
  	handleChange (val) {
  	  let that = this
  	  this.bankOption.forEach(function(value, index){
  	    if (value.id == val) {
  	      that.bankConfigForm.bankCode = value.dictionaryEntryCode
  	      return false
  	    }
  	  })
  	},
    beforeFileUpload(file){
    	this.errorMsg = ''
      let suffix = file.name.split('.')
      const isLt1M = file.size / 1024 / 1024 <= 1
      if(!isLt1M){
        this.showTips('不能超过1M!','warning')
        return false
      }
      if(suffix[suffix.length - 1] === 'csv' || suffix[suffix.length - 1] === 'xlsx' || suffix[suffix.length - 1] === 'xls'){
        return file
      }else{
        this.showTips('上传文件只能是 csv/xlsx/xls 格式!','warning')
        return false
      }
    },
    removeFile (file, fileList) {
      this.fileList = []
      this.loadFile = false
      this.options = []
      this.errorMsg = '请上传文件'
    },
    uploadError (err, file, fileList) {
      this.loadFile = false;
      this.showTips('请求超时','warning')
    },
    uploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        this.showTips('上传成功','success')
        this.options = response.data.fileColumns
        this.bankConfigForm.filePath = response.data.url
        this.bankConfigForm.fileName = response.data.fileName
      } else {
        this.showTips(response.msg,'warning')
      }
    },
    dateSet (modelParam) {
      this.setDateType = modelParam
      this.amountForm = JSON.parse(JSON.stringify(this.setSavedFrom))
      this.dialogDateSet = true
    },
    clearSet (modelParam) {
      if (modelParam === 'bookDate') {
        this.setSavedFrom.content[0] = {
      	  dateType: 1,
          fileField: '',
          dateTime: 'yyyy-MM-dd HH:mm:ss',
          date: 'yyyy-MM-dd',
          dataCondition: '',
          value: ''
      	}
      } else {
        this.setSavedFrom.content[1] = {
      	  dateType: 1,
          dateTime: 'yyyy-MM-dd HH:mm:ss',
          fileFieldDate: '',
          date: 'yyyy-MM-dd',
          fileFieldTime: '',
          time: 'hh:mm:ss',
          fileField: '',
          dates: '',
          sequence: '正序'
      	}
      }
    },
    saveSet () {
      if (this.setDateType === 'bookDate') {
        this.setSavedFrom.content[0]  = JSON.parse(JSON.stringify(this.amountForm.content[0]))
        this.fieldsForm.bookDate = this.amountForm.content[0].fileField
      } else {
        this.setSavedFrom.content[1]  = JSON.parse(JSON.stringify(this.amountForm.content[1]))
        if (this.amountForm.content[1].dateType === 3) {
          this.fieldsForm.transactionDate = this.amountForm.content[1].fileFieldDate + '&' + this.amountForm.content[1].fileFieldTime
        } else{
        	this.fieldsForm.transactionDate = this.amountForm.content[1].fileField
        } 
      }
      this.dialogDateSet = false
    },
    getDictionaryByNumber (number) {
      let that = this
      api.getDictionaryByNumber(number, function(res) {
        if (res.code === 200) {
          if (number === 'BANK') {
          	that.bankOption = res.data
          } else if (number === 'DATETIMEFORMAT') {
          	that.tradeDateTimeFormat = res.data
          } else if (number === 'DATEFORMAT') {
            that.tradeDateFormat = res.data
          } else {
            that.tradeTimeFormat = res.data
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    addBankConfig () {
    	let that = this
      let pathParam = [{
        name:'module',
        value: that.mainModule
      }, {
        name:'subModule',
        value:that.childModule
      }]
      let params = Object.assign({}, this.bankConfigForm, this.fieldsForm)
      this.$set(params, 'headList', this.options)
      this.$set(params, 'bookDateType', this.setSavedFrom.content[0].dateType)
      this.$set(params, 'dateType', this.setSavedFrom.content[1].dateType)
      if (this.setSavedFrom.content[0].dateType === 1) {
        this.$set(params, 'bookDateFormat', this.setSavedFrom.content[0].dateTime)
      } else {
        this.$set(params, 'bookDateFormat', this.setSavedFrom.content[0].date)
      }
      this.$set(params, 'sequence', this.setSavedFrom.content[1].sequence)
      if (this.setSavedFrom.content[1].dateType === 1) {
        this.$set(params, 'transactionDateFormat', this.setSavedFrom.content[1].dateTime)
      } else if (this.setSavedFrom.content[1].dateType === 3) {
        this.$set(params, 'transactionDateFormat', this.setSavedFrom.content[1].date + '&' + this.setSavedFrom.content[1].time)
      } else {
        this.$set(params, 'transactionDateFormat', this.setSavedFrom.content[1].dates)
        //this.$set(params, 'sequence', this.setSavedFrom.content[1].sequence)
      }
      if (this.setSavedFrom.content[0].dataCondition) {
        this.$set(params, 'intervalDay', Number(this.setSavedFrom.content[0].dataCondition + this.setSavedFrom.content[0].value))
      }
      api.addBankConfig(that.common.joinSearchParam(pathParam), params, function(res){
        if (res.code === 200) {
          that.showTips('新增成功','success')
          that.common.deleteTag(that.$route,that)
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    checkBank () {
      let that = this
      let pathParam = [{
        name:'bank',
        value: this.bankConfigForm.bank
      }]
      api.checkBank(that.common.joinSearchParam(pathParam), function(res){
        if (res.code === 200) {
          if (res.data) {
          	that.addBankConfig()
          } else{
          	that.showTips('该银行流水配置已存在','warning')
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    cancel () {
      this.common.deleteTag(this.$route,this)
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.errorMsg) {
            return false
          } else{
            this.$refs['fieldsForm'].validate((valid) => {
              if (valid) {
                this.checkBank()
              } else {
                return false
              }
            })
          }
        } else {
          return false
        }
      })
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getDictionaryByNumber ('BANK')
    this.getDictionaryByNumber ('DATETIMEFORMAT')
    this.getDictionaryByNumber ('DATEFORMAT')
    this.getDictionaryByNumber ('TIMEFORMAT')
    this.setSavedFrom = JSON.parse(JSON.stringify(this.amountForm))
  }
}
</script>

<style scoped lang="scss">
.mainContent {
  .center {
    background-color: white;
    padding: 20px;
    .el-form {
      .inline-item {
        display: inline-block;
        margin-right: 80px;
      }
    }
    .upload{
      padding: 20px;
      width: 700px;
      /*height: 300px;*/
      border: 1px dashed #E3E3E3;
      text-align: center;
      svg{
        color: #49A9EE;
        cursor: pointer;
      }
    }
    .range-set {
      display: inline-block;
      margin-right: 82px;
      .el-input.el-input-group {
        width: 180px;
      }
      .item-line {
        display: inline-block;
      }
    }
    .fields-form {
  	  p {
  		  margin-bottom: 14px;
  		  .name {
    	    display: inline-block;
    	    width: 200px;
          font-size: 13px;
          color: #606266;
          text-align: right;
          padding-right: 12px;
        }
  	  }
    }
  }
  .field-wrap {
    background-color: white;
    padding: 20px;
    margin-top: 2px;
    .name {
      color: #606266;
      line-height: 40px;
      font-size: 13px;
      padding: 0 0 10px;
    }
  }
  .date-select {
    .date-and-time {
      display: inline-block;
      .el-select {
        width: 150px;
      }
      .el-select.dataTime {
        width: 185px;
      }
    }
    .date-or-time {
      display: inline-block;
      margin-left: 150px;
      .el-select {
        width: 150px;
      }
    }
  }
  .setDateDialog{
    .el-dialog {
      .dataConPos {width: 70px}
      .datePos {
        width: 150px;
        vertical-align: middle;
        .el-input-group__prepend{padding: 0 10px}
        .el-input-group__append{padding: 0 10px}
      }
    }
  }
}
.opreRight {
  text-align: center;
  padding: 10px 0;
}
</style>