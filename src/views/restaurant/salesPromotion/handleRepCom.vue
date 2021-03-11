<template>
  <el-dialog :visible.sync="handleRepDialog" @close="close" class="dialogContent" width="70%">
    <div slot="title">手动生成报告</div>
    <el-form :model="handleRepForm" label-width="110px" ref="handleRepForm" :rules="rules">
      <el-form-item label="交易日期" prop="rangeDate">
        <el-date-picker size="small" v-model="handleRepForm.rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="法人公司" prop="companyCode" v-if="type == '0' && source != 'activeSale'">
        <el-select size="small"  v-model="handleRepForm.companyCode" filterable >
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in companyCodeOption" :key="item.companyCode" :label="item.companyName" :value="item.companyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开票单位" prop="billingUnitCode" v-if="type == '0' && source != 'activeSale'">
        <el-select size="small"  v-model="handleRepForm.billingUnitCode" filterable >
          <el-option value="" label="请选择"></el-option>
          <el-option v-for="item in billingUnitCodeOption" :key="item.billingUnitCode" :label="item.billingUnitName" :value="item.billingUnitCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="法人公司/开票单位" prop="statisticType" v-if="source == 'activeSale'">
        <el-select size="small"  v-model="handleRepForm.statisticType" >
          <el-option label="法人公司" value="0"></el-option>
          <el-option label="开票单位" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称" prop="activityName" >
        <el-select size="small"  v-model="handleRepForm.activityName" @change="selectActivity" filterable>
          <el-option v-for="item in activityNameOption" :key="item.activityId" :label="item.activityName" :value="item.activityName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第三方" prop="thirdName">
        <el-select size="small"  v-model="handleRepForm.thirdName" filterable @change="selectThird" remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading">
          <el-option v-for="item in thirdNameOption" :key="item.thirdId" :label="item.thirdName" :value="item.thirdName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动类型" prop="activityType" v-if="source != 'activeSale'">
        <el-select size="small"  v-model="handleRepForm.activityType">
          <el-option v-for="item in activtyTypeOption" :key="item.activityTypeId" :label="item.activityTypeName" :value="item.activityTypeId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small"  @click="handleRepDialog = false" class="c-button c-button--plain">取消</el-button>
      <el-button size="small"  @click="submits('handleRepForm')" class="c-button c-button--primary">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import apidr from '@/model/apidr'
import scroll from '@/directives/index'
export default {
  name: 'handleRepCom',
  data () {
    return {
    	onRangeDatePick: {
        onPick:(dateRange)=>{
          this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
          this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
        }
      },
      handleRepDialog: false,
      tradeStartTimeVal: '',
      tradeEndTimeVal: '',
      handleRepForm: {
      	companyCode: '',
      	billingUnitCode: '',
      	activityId: '',
      	activityName: '',
      	thirdId: '',
        thirdName: '',
        tradeStartTime: '',
        tradeEndTime: '',
        activityType: '',
        rangeDate: [],
        statisticType: null
      },
      rules: {
        activityName: [
          { required: true, message: '请选择活动名称', trigger: 'change' }
        ],
        thirdName: [
          { required: true, message: '请选第三方名称', trigger: 'change' }
        ],
        rangeDate: [
          { required: true, message: '请选交易日期', trigger: 'change' }
        ],
        activityType: [
          { required: true, message: '请选择活动类型', trigger: 'change' }
        ],
        statisticType: [
          { required: true, message: '请选择法人公司/开票单位', trigger: 'change' }
        ]
      },
      activityNameOption: [],
      thirdNameOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
    }
  },
  props: ['isShow', 'type', 'companyCodeOption', 'billingUnitCodeOption', 'activtyTypeOption','source'],
  watch: {
    isShow (val) {
      if (val) {
        if (this.$refs.handleRepForm) {
          this.$refs['handleRepForm'].resetFields()
        }
        this.curActiveId = ''
        this.curThirdId = ''
        this.remoteMethod('')
        this.getActivitySelect()
      }
      this.handleRepDialog = val
    },
    tradeStartTimeVal(val,oldVal){
        this.onRangeDatePick = Object.assign({},{
            onPick:(dateRange)=>{
              this.tradeStartTimeVal =  new Date(dateRange.minDate).getTime();
              this.tradeEndTimeVal =  new Date(dateRange.maxDate).getTime();
            },
            disabledDate: (time) => {
              if(val){
                return time.getTime() <= this.tradeStartTimeVal-365*24*60*60*1000 || time.getTime() >= this.tradeStartTimeVal + 365*24*60*60*1000
              }else{
                return false;
              }
            }
      });
    }
  },
  directives: {
    scroll
  },
  methods: {
    rangeDateChange(){
      if(this.handleRepForm.rangeDate){
        this.handleRepForm.tradeStartTime = this.handleRepForm.rangeDate[0];
        this.handleRepForm.tradeEndTime = this.handleRepForm.rangeDate[1];
      }else{
        this.handleRepForm.tradeStartTime = '';
        this.handleRepForm.tradeEndTime = '';
        this.tradeStartTimeVal = '';
        this.tradeEndTimeVal = '';
      }
    },
  	remoteMethod (query) {
  	  this.pageNumber = 1
  	  this.loading = true
  	  if (query !== '' && query !== '请选择') {
        this.query = query
      } else {
        this.query = ''
      }
      this.getThirdSelect()
  	},
  	scrollLoading (param) {
  	  if (param) {
  	    this.pageNumber +=1
  	    this.getThirdSelect()
  	  }
  	},
    submits (form) {
      this.$refs[form].validate((valid) => {
        if(valid){
          this.$emit('submitForm', this.handleRepForm)
        } else {
          return false
        }
      })
    },
    close () {
      this.$emit('close')
    },
    selectActivity (name) {
      let obj = []
      obj = this.activityNameOption.filter((item)=>{
          return item.activityName === name
      })
      this.handleRepForm.activityId = obj[0].activityId
      this.curActiveId = obj[0].activityId
      this.getThirdSelect()
    },
    selectThird (name) {
      let obj = []
      obj = this.thirdNameOption.filter((item)=>{
          return item.thirdName === name
      })
      this.handleRepForm.thirdId = obj[0].thirdId
      this.curThirdId = obj[0].thirdId
      this.getActivitySelect()
    },
    getThirdSelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdName',
        value: this.query
      }, {
      	name: 'pageNumber',
        value: this.pageNumber
      }, {
      	name: 'activityId',
        value: this.curActiveId
      }]
      apidr.getThirdSelect(this.common.joinSearchParam(pathParams), function(res){
        that.loading = false
        if (res.code === 200) {
          that.thirdNameOption = res.data;
          if(that.curActiveId){
            that.handleRepForm.thirdName = res.data[0].thirdName
            that.handleRepForm.thirdId = res.data[0].thirdId
            that.curThirdId = res.data[0].thirdId
          }
        }else {
          that.thirdNameOption = []
          that.handleRepForm.thirdName = ''
          that.handleRepForm.thirdId = ''
          that.curThirdId = ''
        }
      })
    },
    getActivitySelect () {
      let that = this
      let pathParams = [{
      	name: 'thirdId',
        value: this.curThirdId
      }]
      apidr.getActivitySelect(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.activityNameOption = res.data
        } else if (res.code != 404) {
          that.common.messageUtil({message: res.msg, type: 'warning'})
        }
      })
    },
  },
  beforeMount () {
    
  }
}
</script>

<style>
</style>