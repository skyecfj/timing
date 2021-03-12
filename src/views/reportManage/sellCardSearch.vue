<template>
  <div class="mainContent">
    <div class="searchContent">
      <div class="selectContent" >
        <div class="selectTitle">卡号</div>
        <el-input size="small" v-model="searchData.cardNo"></el-input>
      </div>
      <el-button size="small" type="success"  @click="searchList">查询</el-button>
      <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
    </div>
    <div class="sec-data-con">
      <div class="tab-content" >
        <el-tabs v-model="activeName" @tab-click="handleSwitch">
          <el-tab-pane label="订单售卖" name="detailReport">
            <sell-card-detail :cardNo="searchData.cardNo"></sell-card-detail>
          </el-tab-pane>
          <el-tab-pane label="餐厅售卖" name="restaurantReport">
            <sell-card-restaurant :cardNo="searchData.cardNo"></sell-card-restaurant>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import sellCardDetail from './sellCardSearchCom/sellCardDetail.vue'
import sellCardRestaurant from './sellCardSearchCom/sellCardRestaurant.vue'
import api from '@/model/api'

export default {
  name: 'sellCardSearch',
  data () {
    return {
      searchData: {
        cardNo: ''
      },
      activeName: 'detailReport',
      searchCardNo: ''
    }
  },
  components: {
    sellCardDetail,
    sellCardRestaurant
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    searchList () {
      this.checKCardNo()
    },
    reset () {
      this.searchData.cardNo = ''
    },
    handleSwitch () {

    },
    checKCardNo () {
      let that = this
      let pathParams = [{
      	name: 'cardNo',
        value: this.searchData.cardNo
      }]
      api.checKCardNo(this.common.joinSearchParam(pathParams),function(res){
        if (res.code === 200) {
          if (res.data === 1) {
            that.activeName = 'restaurantReport'
          } else {
            that.activeName = 'detailReport'
          }
        } else if (res.code != 404) {
          that.showTips(res.msg,'warning')
        } else {
          that.showTips(res.msg,'warning')
        }
      })
    },
    showTips (text,type) {
      this.common.messageUtil({
        message: text,
        type: type
      })
    }
  }
}
</script>

<style>
</style>
