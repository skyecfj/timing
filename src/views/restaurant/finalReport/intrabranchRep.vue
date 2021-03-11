<template>
  <div class="mainContent">
    <div class="tab-content" >
      <el-tabs v-model="activeName" @tab-click="handleSwitch">
        <el-tab-pane label="直营店" name="directStore" v-if="currStoreType === '!FR'">
          <intrabranch-rep-com :infoData="infoData" :intrabranchInfoData="intrabranchInfoData" :storeType="currStoreType"></intrabranch-rep-com>
        </el-tab-pane>
        <el-tab-pane label="加盟店" name="franchisedStore" v-else>
          <intrabranch-rep-com :infoData="infoData" :intrabranchInfoData="intrabranchInfoData" :storeType="currStoreType"></intrabranch-rep-com>
        </el-tab-pane>
      </el-tabs>
      <div class="operate-btn">
        <el-button size="small"   @click="downloadList" type="success"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        <el-button size="small"   @click="apply" type="success" :disabled="infoData.auditStatus === '1' || infoData.auditStatus === '2'">提交</el-button>
        <el-button size="small"   @click="approve" type="success" :disabled="infoData.auditStatus === '0' || infoData.auditStatus === '2'">审批</el-button>
        <el-button size="small"   @click="reject" type="success" :disabled="infoData.auditStatus === '0' || infoData.auditStatus === '2'">退回</el-button>
        <el-button size="small"   @click="deleteList" type="danger" :disabled="infoData.auditStatus === '1' || infoData.auditStatus === '2'">删除</el-button>
      </div>
      <!-- <div class="pagination">
        <el-pagination background
    	    @size-change="handleSizeChange"
    	    @current-change="handleCurrentChange"
    	    :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, sizes , prev, pager, next , jumper"
          :total="totalRecords" :page-sizes="pageSizeList">
        </el-pagination> -->
      </div>
    </div>
  </div>
</template>

<script>
import intrabranchRepCom from './intrabranchCom/intrabranchRepCom'
import apidr from '@/model/apidr'
import api from '@/model/api'
import Main from '@/main'

export default {
  data () {
    return {
    	activeName: 'directStore',
      infoData: {},
      intrabranchInfoData: [{
        id: 1,
        jdeCode: '8689001',
        incorCompany: '溧阳泰丰餐饮有限公司',
        accountMoney: '10555.00',
        sendState: '1'
      }, {
        id: 2,
        jdeCode: '8689003',
        incorCompany: '荆门百乐食品餐饮有限公司',
        accountMoney: '10236.00',
        sendState: '0'
      }],
      currentBillId: '',
      currStoreType: '',
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
    }
  },
  components: {
    intrabranchRepCom
  },
  methods: {
  	handleSizeChange (val) {
      this.pageSize = val
      this.getIntrabranchDetail()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getIntrabranchDetail()
    },
    handleSwitch () {

    },
    downloadList () {
      this.downBalanceList()
    },
    apply () {
      let that = this
    	this.$confirm('是否提交审批？', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.applyList()
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    approve (id) {
      let that = this
    	this.$confirm('审批后无法取消，是否审批？', '提醒', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.replyList('2')
      }).catch(() => {
        //that.common.infoMessage('已取消')
      })
    },
    reject (id) {
      this.replyList('1')
    },
    deleteList () {
      let that = this
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.delIntrabranchList()
      }).catch(() => {
        that.common.infoMessage('已取消删除')
      })
    },
    getIntrabranchInfo () {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: this.currentBillId
      }]
      apidr.getReportDetail(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.infoData = res.data
          that.$nextTick(function() {
            that.getIntrabranchDetail()
          })
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getIntrabranchDetail () {
      let that = this
      let pathParam = [{
        name: 'uuidCode',
        value: this.infoData.uuidCode
      }, {
      	name: 'storeType',
        value: this.currStoreType
      }];
      apidr.getIntrabranchDetail(this.common.joinSearchParam(pathParam), function(res){
      	that.intrabranchInfoData = []
        //that.totalRecords = 0
        if (res.code === 200) {
          that.intrabranchInfoData = res.data
          //that.totalRecords = res.data.totalRecords
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.simpleTableData = []
          //that.totalRecords = 0
        }
      })
    },
    downBalanceList () {
      let that = this
      this.common.checkFilePath(this.infoData.filePath).forEach(function(value, index) {
      apidr.downBalanceList(value, 'application/vnd.ms-excel', function(res){
        if(res.code){
          that.common.warningMessage(res.msg)
        }else{
          let link = document.createElement('a')
          link.href = res
          link.id = 'attachmentLink'
          link.download = value.fileName
          link.target = '_blank';link.click()
        }
      })
    })
    },
    applyList () {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: this.currentBillId
      }]
      apidr.applyList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
          that.showTips('提交成功','success')
          that.getIntrabranchInfo()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    replyList (type) {
      let that = this
      let pathParams = [{
      	name: 'id',
        value: this.currentBillId
      }, {
        name: 'type',
        value: type
      }]
      apidr.replyList(this.common.joinSearchParam(pathParams), function(res){
        if (res.code === 200) {
        	type === '1' ? that.showTips('已退回','success') : that.showTips('已审批','success')
          that.getIntrabranchInfo()
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    delIntrabranchList () {
      let that = this
      let param = [{
        name: 'id',
        value: this.currentBillId
      }, {
        name: 'storeType',
        value: this.currStoreType
      }, {
        name: 'uuidCode',
        value: this.infoData.uuidCode
      }]
      apidr.delIntrabranchList(this.common.joinSearchParam(param),function(res){
        if (res.code === 200) {
          that.showTips('删除成功','success')
          that.common.deleteTag(that.$route,that)
          Main.$emit('updateList')
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        }
      })
    },
    getFSCById (key, id) {
      let that = this
      if (id) {
      	api.getFSCById(id, function(res){
          if (res.code === 200) {
            that.$set(that.infoData, key, res.data.userName)
          }else if (res.code != 404) {
            that.showTips(res.msg,'warning')
          }
        })
      }
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  },
  beforeMount () {
    this.currentBillId = parseInt(this.$route.query.id)
    this.currStoreType = this.$route.query.storeType
    this.activeName = this.currStoreType === '!FR' ? 'directStore' : 'franchisedStore'
    //this.auditStatus = this.$route.query.auditStatus
    this.getIntrabranchInfo()
  }
}
</script>

<style lang="scss" scoped>
.tab-content {
  background-color: white;
}
</style>
