<template>
  <el-dialog :visible.sync="handleRepDialog" @close="close" class="dialogContent" width="70%">
    <div slot="title">手动生成报告</div>
    <el-form :model="handleRepForm" label-width="100px" ref="handleRepForm" :rules="rules">
      <el-form-item label="交易日期" prop="tradeDate" class="item-block">
        <!--<el-date-picker v-model="handleRepForm.tradeStartTime" type="date"
        value-format="yyyy-MM-dd" placeholder="选择日期" :picker-options="pickerStart"></el-date-picker>-->
        <el-date-picker
          size="small"
          v-model="handleRepForm.tradeDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerStart"
          @change="setTradeDate">
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
      <el-form-item label="费用类型" prop="chargeType" v-if="type === '3'">
        <el-select size="small"  v-model="handleRepForm.chargeType ">
          <el-option v-if="chargeTypeOptFlag == '1,2'"  label="全部" value="0"  ></el-option>
          <el-option v-if="chargeTypeOptFlag == '1' || chargeTypeOptFlag == '1,2'" label="手续费" value="1"></el-option>
          <el-option v-if="chargeTypeOptFlag == '2' || chargeTypeOptFlag == '1,2'" label="服务费" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐厅类型" prop="storeTypeId" v-if="type === '2'">
        <el-select size="small"  v-model="handleRepForm.storeTypeId">
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
    	pickerStart: {
        disabledDate: (time) => {
          if (this.choiceDate) {
            let days = 0
            if (this.type == '0') {
            	days = 30
            } else if (this.type == '1') {
              days = 90
            } else {
              days = 180
            }
            let one = days * 24 * 3600 * 1000
            const minTime = this.choiceDate - one
            const maxTime = this.choiceDate + one
            return time.getTime() < minTime || time.getTime() > maxTime
          }
        },
        onPick: ({ maxDate, minDate }) => {
          this.choiceDate = minDate.getTime()
          if (maxDate) {
            this.choiceDate = ''
          }
        }
      },
      handleRepDialog: false,
      handleRepForm: {
      	activityId: '',
      	activityName: '',
        thirdName: '',
        thirdId: '',
        tradeDate: [],
        tradeStartTime: '',
        tradeEndTime: '',
        storeTypeId: '',
        chargeType: ''
      },
      choiceDate: '',
      rules: {
        activityName: [
          { required: true, message: '请选择活动名称', trigger: 'change' }
        ],
        thirdName: [
          { required: true, message: '请选第三方名称', trigger: 'change' }
        ],
        tradeStartTime: [
          { required: true, message: '请选交易开始日期', trigger: 'change' }
        ],
        tradeEndTime: [
          { required: true, message: '请选交易结束日期', trigger: 'change' }
        ],
        tradeDate: [
          { required: true, message: '请选交易日期', trigger: 'change' }
        ],
        chargeType: [
          { required: true, message: '请选择费用类型', trigger: 'change' }
        ]
      },
      storeTypeOption: [],
      thirdNameOption: [],
      activityNameOption: [],
      loading: false,
      query: '',
      pageNumber: 1,
      curActiveId: '',
      curThirdId: '',
      chargeTypeOptFlag: ''
    }
  },
  props: ['isShow', 'type','storeTypeParam'],
  watch: {
    isShow (val) {
      if (val) {
        if (this.$refs.handleRepForm) {
          this.$refs['handleRepForm'].resetFields()
        }
        this.curActiveId = ''
        this.curThirdId = ''
        this.handleRepForm.thirdName = ''
        this.handleRepForm.chargeType= ''
        this.remoteMethod('')
        this.getActivitySelect()
      }
      this.handleRepDialog = val
    }
  },
  directives: {
    scroll
  },
  methods: {
    setTradeDate(tradeDateRange) {
      this.handleRepForm.tradeStartTime = tradeDateRange[0];
      this.handleRepForm.tradeEndTime   = tradeDateRange[1]; 
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
      let _self = this
      let obj = []
      obj = this.activityNameOption.filter((item)=>{
          return item.activityName === name
      })
      this.handleRepForm.activityId = obj[0].activityId
      this.curActiveId = obj[0].activityId
      this.getThirdSelect();
      if(this.type === '2'){
        this.getStoreType();
      }
      this.activityNameOption.forEach(function(item,index){
        if(item.activityName == name){
          _self.chargeTypeOptFlag = item.chargeType
        }
      })
      if(this.chargeTypeOptFlag == '1,2'){
        this.handleRepForm.chargeType = '0'
      }else{
        this.handleRepForm.chargeType = this.chargeTypeOptFlag
      }
      
    },
    selectThird (name) {
      let obj = []
      obj = this.thirdNameOption.filter((item)=>{
          return item.thirdName === name
      })
      this.handleRepForm.thirdId = obj[0].thirdId
      this.curThirdId = obj[0].thirdId
      //this.getActivitySelect()
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
          that.thirdNameOption = res.data.concat();
          if(that.curActiveId){
            that.handleRepForm.thirdName = res.data[0].thirdName
            that.handleRepForm.thirdId = res.data[0].thirdId
            that.curThirdId = res.data[0].thirdId
          }
        // } else if (res.code != 404) {
        //   that.thirdNameOption = []
        //   that.handleRepForm.thirdName = ''
        //   that.handleRepForm.thirdId = ''
        //   that.curThirdId = ''
        //   that.common.messageUtil({message: res.msg, type: 'warning'})
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
        if (res.code === 200) {
          that.storeTypeOption = res.data.concat();
          if(that.curActiveId){
            that.handleRepForm.storeTypeId = res.data[0].ownerShip
          }
          //that.handleRepForm.thirdName = res.data[0].thirdName
        } else{
          that.handleRepForm.storeTypeId = ''
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
      }, {
      	name: 'businessType',
        value: this.type
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

<style scoped lang="scss">

</style>