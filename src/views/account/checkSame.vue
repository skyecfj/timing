<template>
<div class="main">
  <div class="search-content" v-if="tblType == 4 || tblType == 9 || tblType == 10 ">
      <div class="selectContent" >
        <div class="selectTitle">卡面额差异金额</div>
        <el-select size="small"  v-model="initBalanceStatus" >
          <el-option label="请选择" value=""></el-option>
          <el-option label="不为0" value="0" ></el-option>
          <el-option label="为0" value="1" ></el-option>
        </el-select>
      </div>
        <el-button size="small"  type="success" class="findButt" @click="changeParams">查询</el-button>
        <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
    </div>
  <div class="content">
  <!--单表-->
  <template v-if="tabs.length == 0" >
    <checkSameSingleTbl
                        v-bind:searchObj="searchObj" ></checkSameSingleTbl>
  </template>

  <!--多Tab-->
  <template v-if="tabs.length>0" >
    <el-tabs v-model="activeTab" @tab-click="changeTab" >
      <el-tab-pane v-for="(tabItem,index) in tabs"
                  v-bind:key="tabItem"
                  :label="tabItem"
                  :name="'tab_' + tblType + '-' + index" >
        <checkSameSingleTbl v-bind:reportType="reportType"
                            v-bind:searchObj="searchObj" ></checkSameSingleTbl>
      </el-tab-pane>
    </el-tabs>
  </template>
  </div>
</div>
</template>
<script>
  import api from '../../model/api'
  import tblHeaderConfig from '../../utils/checkResultsUtil'
  //单表
  import checkSameSingleTbl from './detailTbl/checkSameSingleTbl.vue'
	export default {
    name:'checkSame',
    components:{
      checkSameSingleTbl
    },
    activated(){
        let params  = window.localStorage.params;
        if(params !== this.stashParams){
          this.tabs = []
          this.getInitHeader();
          this.getHeaderConfig()
        }
    },
    deactivated(){
        let params  = window.localStorage.params;
        this.stashParams = params;
    },
    beforeMount(){
      let storage = window.localStorage;
      let params  = JSON.parse(storage.params);
      params.type = params.type.indexOf('-') < 0 ? params.type : params.type.split('-')[0]
      window.localStorage.setItem('params',JSON.stringify(params));
      this.getInitHeader()
    },
    mounted(){
      this.getHeaderConfig();
    },
		data() {
			return {
				navTitle : {
      		fontSize : '20px'
        },
        reportType : '',
        tblType : '',
        tabs : [],
        tHeaderConfig : {},
        activeTab : '',
        searchObj : {},
        initBalanceStatus:''
			}
		},
    methods: {
      getInitHeader(){
         // type 1 礼品卡自有B2C/selfcard  2 天猫商城券码/voucher  3  天猫商城卡中心/card  4  礼品卡自由 BBC/giftcard  5  自有售卖渠道虚拟卡/dummycard
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        this.reportType = params.type;
        this.tblType = params.type;
        this.searchObj = {
          brandType       : params.brandType,
          verifyStartTime : params.verifyStartTime,
          verifyEndTime   : params.verifyEndTime,
          payMethod:params.payMethod
        }
        for(let i = 0; i < tblHeaderConfig.sameAndDiffTblHeader.length; i ++){
          if(tblHeaderConfig.sameAndDiffTblHeader[i].type == this.reportType){
            this.tHeaderConfig = tblHeaderConfig.sameAndDiffTblHeader[i];
            if(tblHeaderConfig.sameAndDiffTblHeader[i].tabConfig){
              this.tabs = tblHeaderConfig.sameAndDiffTblHeader[i].tabConfig;
              this.activeTab = 'tab_'+ this.reportType +'-0';
            }
          }
        }
      },
      changeTab(currentTab){
        let _self = this;
        let variable = currentTab.name.split('_');
        let lastStr = variable[1].split('-')[1]
         _self.tabType = currentTab.label
        if(lastStr == 0){
          _self.reportType = variable[1].split('-')[0];
        }else{
          _self.reportType = variable[1];
        }
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        params.type = _self.reportType;
        window.localStorage.setItem('params',JSON.stringify(params));
      },
      getHeaderConfig(){
        var _self = this;

      },
      reset(){
        this.initBalanceStatus = ''
      },
      changeParams(){
        this.searchObj = {
          initBalanceStatus : this.initBalanceStatus,
        }
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        let detailParams  = Object.assign({},this.searchObj);
        window.localStorage.setItem('params',JSON.stringify(params));
        window.localStorage.setItem('detailParams',JSON.stringify(detailParams));
      }
    }
	}
</script>









