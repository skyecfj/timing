<template>
  <el-dialog :visible.sync="handleRepDialog" @close="close" class="dialogContent" width="70%">
    <div slot="title">手动生成报告</div>
    <el-form :model="handleRepForm" label-width="110px" ref="handleRepForm" :rules="rules">
      <el-form-item label="交易日期" prop="rangeDate">
        <el-date-picker size="small" v-model="handleRepForm.rangeDate" type="daterange" range-separator="-" start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="onRangeDatePick" @change="rangeDateChange" value-format="yyyy-MM-dd" >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动名称" prop="activityName">
        <el-select size="small"  v-model="handleRepForm.activityName" @change="selectActivity" filterable>
          <el-option v-for="item in activityNameOption" :key="item.activityId" :label="item.activityName" :value="item.activityName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第三方" prop="thirdName">
        <el-select size="small"  v-model="handleRepForm.thirdName" @change="selectThird" filterable remote :remote-method="remoteMethod" v-scroll="scrollLoading" :loading="loading">
          <el-option v-for="item in thirdNameOption" :key="item.thirdId" :label="item.thirdName" :value="item.thirdName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐厅类型" prop="storeType" v-if="type === '2'">
        <el-select size="small"  v-model="handleRepForm.storeType">
          <el-option v-for="item in storeTypeOption" :key="item.ownerShip" :label="item.ownerShipName" :value="item.ownerShip">
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
        rangeDate: [],
        activityId: '',
      	activityName: '',
        thirdName: '',
        thirdId: '',
        tradeStartTime: '',
        tradeEndTime: '',
        storeType: 'ALL'
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
        ]
      },
      storeTypeOption: [{
        ownerShip: 'ALL',
        ownerShipName: '全部'
      }, {
        ownerShip: 'FR',
        ownerShipName: '加盟'
      }, {
        ownerShip: '!FR',
        ownerShipName: '直营'
      }],
      thirdNameOption: [],
      activityNameOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
    }
  },
  props: ['storeTypeNotLimit','isShow', 'type','storeTypeParam'],
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
                return time.getTime() <= this.tradeStartTimeVal-180*24*60*60*1000 || time.getTime() >= this.tradeStartTimeVal + 180*24*60*60*1000
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
      this.getThirdSelect();
      if(!this.storeTypeNotLimit){
        this.getStoreType();
      }
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
        if (res.code === 200 && res.data.length > 0) {
          that.thirdNameOption = res.data
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
    getStoreType() { 
      let that = this;
      let pathParams = [{
        name: 'activityId',
        value: this.curActiveId
      },{
        name: 'type',
        value: this.storeTypeParam
      }];
      apidr.getStoreType(this.common.joinSearchParam(pathParams), function(res){
        that.loading = false
        if (res.code === 200 && res.data.length > 0) {
          that.storeTypeOption = res.data.concat()
          if(that.curActiveId){
            that.handleRepForm.storeType = res.data[0].ownerShip
          }
          //that.handleRepForm.thirdName = res.data[0].thirdName
        } else{
          that.handleRepForm.storeType = ''
          that.storeTypeOption = []
          //that.common.messageUtil({message: res.msg, type: 'warning'})
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