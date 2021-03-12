<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent">
        <div class="selectTitle">银行</div>
        <el-select size="small"  v-model="bankName" placeholder="请选择银行" :filterable='bankFilterable'>
          <el-option v-for="item in bankOptions" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
          </el-option>
        </el-select>
        <el-button size="small"   @click="search" class="c-button c-button--primary">查询</el-button>
        <el-button size="small"   @click="reset" class="c-button c-button--plain">重置</el-button>
      </div>
    </div>
    <div class="dataContent">
      <div class="opreRight">
        <el-button size="small"   @click="newAdd" class="c-button c-button--primary">新增</el-button>
      </div>
      <el-table :data="tableData"  style="width: 100%" border>
        <el-table-column prop="id" label="记录ID" width="150px" ></el-table-column>
        <el-table-column prop="bank" label="银行" min-width="80px">
        </el-table-column>
        <el-table-column prop="state" label="状态" width="180px">
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="detailRow(scope.row.id)"><i class="fa fa-file-alt"></i></el-button>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="editRow(scope.row.id)"><i class="fa fa-edit"></i></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
              <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="deleteRow(scope.row.id)"><i class="fa fa-trash-alt"></i></el-button>
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
                <el-button size="small" slot="reference" @click="checkRecord(scope.row.id)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-info-circle"></i></el-button>
              </el-popover>
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
</template>
<script>
import api from '../../model/api'
import Main from '../../main'

export default {
  name:'bankConfig',
  data(){
    return {
      pageSizeList:[25, 50, 75, 100, 125],
      totalRecords:0,
      currentPage: 1,
      pageSize:25,
      bankName:'',
      bankOptions:[],
      tableData:[],
      bankFilterable: false,
      module: '主档管理',
      subModule: '银行流水标准格式配置',
      recordData: [],
      changeId: 0,
      currentLogPage: 1,
      pageLogSize: 10,
      totalLogRecords: 0,
    }
  },
  beforeMount(){
  	this.getBankName()
    this.getBankConfig()
    Main.$off('updateList')
    Main.$on('updateList', () => {
      this.getBankConfig()
    })
  },
  methods:{
    handleSizeChange(val) {
      this.pageSize = val
      this.getBankConfig()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getBankConfig()
    },
    handleLogSizeChange (val) {
      this.pageLogSize = val
      this.getDataLog()
    },
    handleLogCurrentChange (val) {
      this.currentLogPage = val
      this.getDataLog()
    },
    search(){
      this.getBankConfig()
    },
    reset(){
      this.bankName = ''
    },
    getBankName () {
      let that = this
      api.getDictionaryByNumber('BANK', function(res) {
        if (res.code === 200) {
        	let options = res.data
          options.unshift({dictionaryEntryName: '请选择', id: ''})
          that.bankOptions = options
          if (that.bankOptions.length > 0) {
            this.bankFilterable = true
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getBankConfig () {
      let that = this
      let param = [{
        name: 'pageIndex',
        value: this.currentPage
      }, {
        name: 'pageSize',
        value: this.pageSize
      }, {
        name: 'bank',
        value: this.bankName
      }]
      api.getBankConfig(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.tableData = res.data.list
          that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.tableData = []
          that.totalRecords = 0
        }
      })
    },
    getDataLog () {
    	let that = this
      let param = [
      {
        name:'pageIndex',
        value: this.currentLogPage
      }, {
        name:'pageSize',
        value:this.pageLogSize
      }, {
  	    name:'module',
        value:this.module
      }, {
        name:'submodule',
        value:this.subModule
      }, {
      	name:'operationId',
        value:this.changeId
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
    delBankConfig (id) {
      let that = this
      let param = [{
        name: 'id',
        value: id
      }, {
        name: 'module',
        value: this.module
      }, {
        name: 'subModule',
        value: this.subModule
      }]
      api.delBankConfig(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.getBankConfig()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    detailRow(id){
      this.$router.push({name: 'bankConfigDetail', query: {type: 'detail', id: id}, params: {parentRoute:this.$route.fullPath}})
    },
    editRow (id) {
      this.$router.push({name: 'bankConfigDetail', query: {type: 'edit', id: id}, params: {parentRoute:this.$route.fullPath}})
    },
    deleteRow(id){
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delBankConfig(id)
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    checkRecord (id) {
    	this.changeId = id
    	this.currentLogPage = 1
    	this.pageLogSize = 10
    	this.getDataLog()
    },
    newAdd(){
      this.$router.push({name: 'bankConfigAdd', params: {parentRoute:this.$route.fullPath}})
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  filters: {
    checkStatus (val) {
      return val === '0' ? '启用' : '启用'
    }
  },
  beforeRouteLeave (to, from, next) {
  	if (to.name === 'bankConfigDetail') {
  	  if (to.query.type === 'edit') {
        this.$store.dispatch('delVisitedViews', to.name);
        to.meta.title = '银行流水标准格式配置 编辑'
      }else{
        to.meta.title = '银行流水标准格式配置 详情'
      }
  	}
    next()
  }
}
</script>
<style scoped  lang="scss" >


</style>
