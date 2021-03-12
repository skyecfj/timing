<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">业务场景</div>
        <el-select size="small" v-model="business_type" :filterable='filterable'>
          <el-option label="请选择" value=""></el-option>
          <el-option
          v-for="item in businessTypeOptions"
          :key="item.id"
          :label="item.dictionaryEntryName"
          :value="item.dictionaryEntryCode">
          </el-option>
        </el-select>
      </div>
      <el-button size="small"   @click="searchBrand" class="c-button c-button--primary">查询</el-button>
      <el-button size="small"   @click="resetBrand" class="c-button c-button--plain">重置</el-button>
    </div>
    <div class="dataContent">
      <el-table :data="tableDataTolerance" style="width: 100%" border>
        <el-table-column prop="id" label="记录ID" width="100px"></el-table-column>
        <el-table-column prop="businessType" label="业务场景" ></el-table-column>
        <el-table-column prop="brand" label="品牌" width="150px"></el-table-column>
        <el-table-column prop="minValue" label="容差最小值（单位：元）" width="160px"></el-table-column>
        <el-table-column prop="maxValue" label="容差最大值（单位：元）" width="160px"></el-table-column>
        <el-table-column label="操作" width="140px">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row, '1')"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row, '2')"><i class="fa fa-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" style="margin-left: 10px;">
              <el-popover
              placement="left"
              trigger="click"
              width="1000">
                <el-table :data="recordData" border>
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
                  :page-sizes="pageSizeList"
                  :page-size="pageLogSize"
                  class="gross"
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalLogRecords">
                  </el-pagination>
                </div>
                <el-button size="small" slot="reference" @click="changeDetails(scope.row.id)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-info-circle"></i></el-button>
              </el-popover>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
        	@size-change="handleSizeChange"
        	@current-change="handleCurrentChange"
        	:current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalRecords" :page-sizes="pageSizeList">
        </el-pagination>
      </div>
    </div>
    <!-- 弹框 -->
    <el-dialog :visible.sync="toleranceDialog" :before-close="handleClose" class="dialogContent" width="70%">
      <div slot="title">
        {{toleranceDialogTitle}}
      </div>
      <el-form :model="toleranceForm"  label-width="110px" ref="toleranceForm" :rules="rules">
        <el-form-item label="业务场景">
          <el-input size="small"  v-model.trim="businessName" disabled></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-input size="small"  v-model.trim="toleranceForm.brand" disabled></el-input>
        </el-form-item>
        <el-form-item label="容差最小值" prop="minValue">
          <el-input size="small"  v-model.trim="toleranceForm.minValue" :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="容差最大值" prop="maxValue">
          <el-input size="small"  v-model.trim="toleranceForm.maxValue" :disabled="isDisabled"></el-input>
        </el-form-item>
      	<el-form-item label="更新时间">
          <el-date-picker v-model="toleranceForm.modifiedTime" type="datetime" disabled>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新人">
          <el-input size="small"  v-model.trim="toleranceForm.modifiedUser" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!isDisabled">
        <el-button size="small"  @click="handleClose" class="c-button--plain">取 消</el-button>
        <el-button size="small"  @click="updateList('toleranceForm')" class="c-button c-button--primary">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/model/api"

export default {
  name: 'checkTolerance',
  data () {
    return {
      business_type: '',
      filterable: false,
      businessTypeOptions: [],
      tableDataTolerance: [],
      recordData: [],
      pageSizeList:[25, 50, 75, 100, 125],
      currentPage: 1,
      pageSize:25,
      totalRecords: 0,
      currentLogPage: 1,
      pageLogSize: 25,
      totalLogRecords: 0,
      toleranceDialog: false,
      rules: {
        minValue:[{ required: true, message: '容差金额不能为空', trigger: 'blur' }],
        maxValue:[{ required: true, message: '容差金额不能为空', trigger: 'blur' }]
      },
      toleranceDialogTitle: '核对容差主档-编辑',
      toleranceForm: {
      	id: '',
        businessType: '',
        brand: '',
        toleranceMoney: ''
      },
      getToleranceForm: [],
      brandOptions: [],
      isDisabled: false,
      mainModule: '主档管理',
      childModule: '核对容差主档',
      isAdd: false,
      changeId: 0,
      originalMoney: '',
      brandName: '',
      businessName: ''
    }
  },
  computed: {

  },
  watch: {
    toleranceForm (val) {
      if (val) {
        this.brandName = this.checkName(this.brandOptions, this.toleranceForm.brand)
        this.businessName = this.checkName(this.businessTypeOptions, this.toleranceForm.businessType) || this.toleranceForm.businessType
      }
    }
  },
  methods: {
  	searchBrand () {
  	  this.getToleranceList()
  	},
  	resetBrand () {
      this.business_type = ''
  	},
    handleSizeChange(val) {
      this.pageSize = val
      this.getToleranceList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getToleranceList()
    },
    // 详情、编辑
    checkDetail (row, type) {
    	if (type === '1') {
    	  this.isDisabled = true
    	  this.toleranceDialogTitle = '核对容差主档-详情'
    	} else {
    	  this.isDisabled = false
    	  this.toleranceDialogTitle = '核对容差主档-编辑'
    	}
    	this.getToleranceById(row.id)
      this.toleranceDialog = true
      if (this.$refs['toleranceForm']) {
        this.$refs['toleranceForm'].clearValidate()
      }
    },
    // 删除
    checkDelete (id) {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let param = [{
          name:'module',
          value: that.mainModule
        }, {
          name:'subModule',
          value:that.childModule
        }, {
          name:'id',
          value:id
        }]
        api.delToleranceById(that.common.joinSearchParam(param),function(res){
          if (res.code === 200) {
            that.showTips(res.data,'success')
            that.getToleranceList()
          } else if (res.code !== 404) {
            that.showTips(res.msg,'warning')
          }
        })
      }).catch(() => {
        that.showTips('已取消删除','info')
      })
    },
    //获取业务类型
    getBusinessType(){
      let that = this
      api.getDictionaryByNumber('CHECK_TOLERANCE_TYPE',function(res){
        let businessTypeOptions = res.data
        that.businessTypeOptions = businessTypeOptions
        if (businessTypeOptions.length > 4) {
          that.filterable = true
        }
      })
    },
    // 获取品牌
    getBrandList () {
    	let that = this
      api.getBrandEnglishNames('?flag=1',function(res) {
        if (res.code === 200) {
          that.brandOptions = res.data
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    // 获取容差列表
    getToleranceList () {
      let that = this
      let param = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
        name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'businessType',
        value: this.business_type
      }]
      api.getToleranceListNew(this.common.joinSearchParam(param),function(res){
        that.tableDataTolerance = []
        that.totalRecords = 0
        if (res.code === 200) {
          that.tableDataTolerance = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    // 通过id获取容差信息
    getToleranceById (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }]
      api.getToleranceByIdNew(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.toleranceForm = res.data
          that.originalMoney = res.data.toleranceMoney
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    // 更新容差信息
    updateList (formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let minValue = this.toleranceForm.minValue;
          let maxValue = this.toleranceForm.maxValue;
          let param = {
            businessType: this.toleranceForm.businessType,
            brand: this.toleranceForm.brand,
            minValue: minValue.replace(/,/g, '').replace(' ',''),
            maxValue: maxValue.replace(/,/g, '').replace(' ',''),
            id: this.toleranceForm.id
          }
          let pathParam = [
            {
              name:'module',
              value: this.mainModule
            }, {
              name:'subModule',
              value:this.childModule
          }]
          // 更新
          api.updateToleranceNew(that.common.joinSearchParam(pathParam),param,function(res){
            if (res.code === 200) {
              that.showTips(res.data,'success')
              that.getToleranceList()
            } else if (res.code !== 404) {
              that.showTips(res.msg,'warning')
            }
          })
          this.toleranceDialog = false
        }
      })
    },
    handleClose (done) {
//    if (this.originalMoney === this.toleranceForm.toleranceMoney) {
//      this.toleranceDialog = false
//    } else{
//    	this.$confirm('是否保存修改?', '提示', {
//        confirmButtonText: '确定',
//        cancelButtonText: '取消',
//        type: 'warning'
//      }).then(() => {
//        this.updateList('toleranceForm')
//      }).catch(() => {
//        this.toleranceDialog = false
//      })
//    }
      this.toleranceDialog = false
      this.toleranceForm = {}
    },
    handleLogSizeChange (val) {
      this.pageLogSize = val
      this.changeDetails(this.changeId)
    },
    handleLogCurrentChange (val) {
      this.currentLogPage = val
      this.changeDetails(this.changeId)
    },
    // 变更记录
    changeDetails (id) {
    	let that = this
    	this.changeId = id
    	let param = [
      {
        name:'pageIndex',
        value: this.currentLogPage
      }, {
        name:'pageSize',
        value:this.pageLogSize
      }, {
  	    name:'module',
        value:this.mainModule
      }, {
        name:'submodule',
        value:this.childModule
      }, {
      	name:'operationId',
        value:id
      }]
      api.getDataLog(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.recordData = res.data.list
          that.totalLogRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    checkName (arr, id) {
    	let name = ''
      arr.forEach(function(val, index) {
        if (val.id == id) {
        	name = val.englishName || val.dictionaryEntryName
        	return false
        }
      })
      return name
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.getToleranceList()
    this.getBusinessType()
    this.getBrandList()
  }
}
</script>

<style lang="scss" scoped>
.mainContent {
  .dataContent {
    .opreRight {
      height: 43px;
    }
  }
  .dialogContent {
    .tole-info-list {
      margin-bottom: 20px;
    	.li-title {
    		margin-bottom: 11px;
    	  .info-title {
    	  	display: inline-block;
    	    width: 30%;
    	    text-align: center;
    	    font-size: 14px;
    	    color: #101010;
    	  }
    	}
    	.li-value {
    	  .info-value {
    	  	display: inline-block;
    	    width: 30%;
    	    text-align: center;
    	    vertical-align: middle;
    	    font-size: 14px;
    	    color: #848282;
    	    .el-form {
    	  	  .el-form-item {
    	        width: 80%;
    	        margin-bottom: 0;
    	      }
    	    }
    	  }
    	}
    }
  }
}
</style>
