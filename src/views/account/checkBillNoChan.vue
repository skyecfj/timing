<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <div class="selectContent" v-if="tblType == 9 || tblType == 10">
        <div class="selectTitle">卡平台订单号</div>
        <el-input v-model.trim="orderSeqId" placeholder="请输入卡平台订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 3 || tblType == 5 || tblType == 7 || tblType == 13 || tblType == 15" >
        <div class="selectTitle">商户订单号</div>
        <el-input v-model.trim="productOrderCode" placeholder="请输入商户订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 2 || tblType == 6 || tblType == 8" >
        <div class="selectTitle">来源订单号</div>
        <el-input v-model.trim="orderCode" placeholder="请输入来源订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 11 || tblType == 12 || tblType == 13 || tblType == 14 || tblType == 15" >
        <div class="selectTitle">订单号</div>
        <el-input v-model.trim="orderCode" placeholder="请输入订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 2 || tblType == 6 || tblType == 8 || tblType == 12 || tblType == 14">
        <div class="selectTitle">发券日期</div>
        <el-date-picker v-model="couponIncomeStartTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="couponIncomeEndTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6 || tblType == 8">
        <div class="selectTitle">{{tblType == 1?'退款日期':'退券日期'}}</div>
        <el-date-picker v-model="refundTime" type="date"
              value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6 || tblType == 8 || 
                                       tblType == 12 || tblType == 13 || tblType == 14 || tblType == 15">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="brandType" placeholder="全部品牌" :disabled="choosenBrandType != '' " filterable >
          <el-option label="请选择"  value=""></el-option>
          <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="tblType == 4">
        <div class="selectTitle">卡号</div>
        <el-input v-model.trim="cardNo" placeholder="请输入卡号" clearable></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否已手工分录</div>
        <el-select size="small"  v-model="journalType" >
          <el-option label="请选择" value=""></el-option>
          <el-option label="是" value="1" ></el-option>
          <el-option label="否" value="0" ></el-option>
        </el-select>
      </div>
        <el-button size="small"  type="success" class="findButt" @click="changeParams">查询</el-button>
        <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
    </div>
    <div class="content">
      <!--单表-->
      <template v-if="tabs.length == 0" >
        <el-row class="tbl-control" >
          <el-button size="small"  type="text" @click="exportDetail" ><i class="el-icon-download"></i>下载</el-button>
          <el-button size="small"  type="text" @click="exportOrders">
            <i class="el-icon-download"></i>导出订单</el-button>
          <el-button size="small"  type="success" @click="toManualAccounting" >手工分录</el-button>
        </el-row>
        <checkHasBillSingleTbl
                                v-bind:searchObj="searchObj"
                                v-on:selectedRow="selectedRow"
                                v-on:changePageInfo="getPageInfo"></checkHasBillSingleTbl>
      </template>

      <!--多Tab-->
      <template v-if="tabs.length > 0" >
        <el-tabs v-model="activeTab" @tab-click="changeTab" >
          <el-tab-pane  v-for="(tabItem,index) in tabs"
                        v-bind:key="tabItem"
                        :label="tabItem"
                        :name="'tab_' + tblType + '-' + index" >
            <el-row class="tbl-control" >
              <el-button size="small"  type="text" @click="exportDetail" ><i class="el-icon-download"></i>下载</el-button>
              <el-button size="small"  type="text" @click="exportOrders" v-if="tblType == 4 || tblType == 11"><i class="el-icon-download"></i>导出订单</el-button>
              <el-button size="small"  type="success" @click="toManualAccounting" >手工分录</el-button>
            </el-row>
            <checkHasBillSingleTbl  v-bind:reportType="reportType"
                                    v-bind:searchObj="searchObj"
                                    v-on:selectedRow="selectedRow"
                                    v-on:changePageInfo="getPageInfo"></checkHasBillSingleTbl>
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
  import checkHasBillSingleTbl from './detailTbl/checkHasBillSingleTbl.vue'
	export default {
    name:'checkBillNoChan',
    components:{
      checkHasBillSingleTbl
    },
    activated(){
        let params  = window.localStorage.params;
        if(params !== this.stashParams){
          this.reset()
          this.tabs = []
          this.getInitHeader();
          this.getHeaderConfig()
          this.selectData = []
        }
    },
    deactivated(){
        let params  = window.localStorage.params;
        this.stashParams = params;
    },
    beforeMount(){
      let storage = window.localStorage;
      let params  = JSON.parse(storage.params);
      params.type =  params.type.indexOf('-') < 0 ? params.type : params.type.split('-')[0]
      window.localStorage.setItem('params',JSON.stringify(params));
      this.getInitHeader();
    },
    mounted(){
      this.reset()
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
        selectData :[],
        businessType : '',
        orderTime : '',
        orderCode : '',
        orderLineNumber  : '',
        couponIncomeStartTime : '',
        couponIncomeEndTime : '',
        productOrderCode : '',
        refundTime       : '',
        brandType        : '',
        productCategory  : '',
        journalType   : '',
        brandOptions  : [],
        choosenBrandType : '',
        orderSeqId:'',
        cardNo:'',
        pageInfo : {
          pageIndex : 1,
          pageSize  : 25
        },
        tabType:''
			}
		},
    methods: {
      getPageInfo(pageInfo){
        this.pageInfo = Object.assign({},pageInfo);
      },
      changeTab(currentTab){
        let _self = this;
        let variable = currentTab.name.split('_');
        // let lastStr = variable[1].substr(variable.length-1,1);
        let lastStr = variable[1].split('-')[1]
        if(lastStr == 0){
          // _self.reportType = variable[1].substr(0,1);
          _self.reportType = variable[1].split('-')[0]
        }else{
          _self.reportType = variable[1];
        }
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        params.type = _self.reportType;
         _self.tabType = currentTab.label
        window.localStorage.setItem('params',JSON.stringify(params));
      },
      getInitHeader(){
         // type 1 礼品卡自有B2C/selfcard  2 天猫商城券码/voucher  3  天猫商城卡中心/card  4  礼品卡自由 BBC/giftcard  5  自有售卖渠道虚拟卡/dummycard
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        this.reportType = params.type;
        this.businessType = params.businessType;
        this.tblType = params.type;
        this.searchObj = {
          verifyStartTime : params.verifyStartTime,
          verifyEndTime   : params.verifyEndTime,
          brandType       : params.brandType,
          journalType     : params.journalType,
          payMethod:params.payMethod
        }
        this.choosenBrandType = params.brandType;
        this.brandType = params.brandType;
        for(let i = 0; i < tblHeaderConfig.hasBillTblHeader.length; i ++){
            if(tblHeaderConfig.hasBillTblHeader[i].type == this.reportType){
              this.tHeaderConfig = tblHeaderConfig.hasBillTblHeader[i];
              if(tblHeaderConfig.hasBillTblHeader[i].tabConfig){
                this.tabs = tblHeaderConfig.hasBillTblHeader[i].tabConfig;
                this.activeTab = 'tab_'+ this.reportType +'-0';
                this.tabType = this.tabs[0]
              }
            }
          }
      },
      getHeaderConfig(){
        let _self = this;
        let searchParam = this.common.formatPathParam({
          pageIndex : 1,
          pageSize  : 99999999,
          flag:2
        });
        api.getBrandList(searchParam,function(result){
          if(result.data.list){
            _self.brandOptions = result.data.list;
          }else{
             _self.brandOptions = [];
          }
        })
      },
      reset(){
        let _self = this;
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        this.orderTime = '';
        this.orderCode = '';
        this.orderLineNumber = '';
        this.productOrderCode = '';
        this.couponIncomeStartTime = '';
        this.couponIncomeEndTime = '';
        this.refundTime = '';
        this.brandType = params.brandType? params.brandType : '';
        this.productCategory = '';
        this.journalType = '';
        this.orderSeqId = '';
        this.cardNo = ''
        window.localStorage.setItem('detailParams',JSON.stringify({}));
        // this.changeParams();
      },
      changeParams(){
        this.searchObj = {
          orderTime : this.orderTime,
          orderCode : this.orderCode,
          orderId:this.orderCode,
          orderLineNumber  : this.orderLineNumber,
          productOrderCode : this.productOrderCode,
          couponIncomeStartTime : this.couponIncomeStartTime,
          couponIncomeEndTime : this.couponIncomeEndTime,
          refundTime       : this.refundTime,
          brandType        : this.brandType,
          productCategory  : this.productCategory,
          journalType      : this.journalType,
          orderSeqId:this.orderSeqId ? encodeURIComponent(this.orderSeqId):'',
          cardNo:this.cardNo
        }
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        let detailParams  = Object.assign({},this.searchObj);
        //params.journalType = this.journalType;
        window.localStorage.setItem('params',JSON.stringify(params));
        window.localStorage.setItem('detailParams',JSON.stringify(detailParams));
      },
      selectedRow(selectedRows){
        let _self = this;
        this.selectData = selectedRows;
      },
      //跳转至手工分录
      toManualAccounting(){
        let _self = this;
        let currentParams = {
          type : _self.reportType,
          detailType   : '2',
          activeTabType : '',
          selectData   : _self.selectData,
          businessType : _self.businessType
        };
        if(this.tabs.length > 0){
          let currentTabType = this.activeTab.charAt(this.activeTab.length - 1);
          currentParams.activeTabType = currentTabType;
        }
        window.localStorage.setItem('manualAccountingParams',JSON.stringify(currentParams));
        this.$router.push({
          name : 'manualAccountingCheck',
          params : currentParams
        });
      },
      //获取导出参数
      getExportParam(){
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        let detailParams = {
          orderTime : this.orderTime ? this.orderTime : null,
          orderCode : this.orderCode ? this.orderCode : null,
          orderLineNumber  : this.orderLineNumber ? this.orderLineNumber : null,
          productOrderCode : this.productOrderCode ? this.productOrderCode : null,
          couponIncomeStartTime : this.couponIncomeStartTime ? this.couponIncomeStartTime : null,
          couponIncomeEndTime : this.couponIncomeEndTime ? this.couponIncomeEndTime : null,
          refundTime       : this.refundTime ? this.refundTime : null,
          brandType        : this.brandType ? this.brandType : null,
          productCategory  : this.productCategory ? this.productCategory : null,
          journalType      : this.journalType ? this.journalType : null
        };
        if(params.type == 3){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            productOrderCode : this.productOrderCode ? this.productOrderCode : null,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        if(params.type == 4 || params.type == '4-1' ){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            cardNo:this.cardNo,
            tabType:this.tabType,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }
        if(params.type == 5 || params.type == 7){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            productOrderCode : this.productOrderCode,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        if(params.type == 8){
          detailParams = {
            orderCode : this.orderCode,
            journalType     : this.journalType ? this.journalType : null,
            couponIncomeStartTime : this.couponIncomeStartTime ? this.couponIncomeStartTime : null,
            couponIncomeEndTime : this.couponIncomeEndTime ? this.couponIncomeEndTime : null,
            refundTime       : this.refundTime ? this.refundTime : null,
            brandType        : this.brandType ? this.brandType : null,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

         if(params.type == 9 || params.type == 10){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            orderSeqId:this.orderSeqId,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }
         if(params.type == 11 || params.type == '11-1'){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            orderId:this.orderCode,
            tabType : this.tabType,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        let exportParams = Object.assign({},params,detailParams);
        delete exportParams.type;
        delete exportParams.businessType;
        return {params:params,exportParams:exportParams};
      },
      //下载数据
      exportDetail(){
        let _self = this;
        let params = Object.assign({},this.getExportParam().params);
        let exportParams = Object.assign({},this.getExportParam().exportParams);
        var type = params.type
        var typeNumber = type.indexOf('-') < 0 ? type : type.split('-')[0]
        api.exportCheckBill(typeNumber,exportParams,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            link.id = 'downloadRepo';
            link.download = '核对明细(有账单).xlsx';
            if(_self.reportType == '2' || _self.reportType == '6' || _self.reportType == '8' || _self.reportType == '12' || _self.reportType == '14'){
              link.download = '核对明细(有券码).xlsx';
            }else if(_self.reportType == '4'){
              link.download = '核对明细自有渠道虚拟卡平台有卡无订单-发卡.xlsx';
            }else if(_self.reportType == '4-1'){
              link.download = '核对明细自有渠道虚拟卡平台有卡无订单-退卡.xlsx';
            }else if(_self.reportType == '9'){
              link.download = '核对明细一次性团购核对有卡无订单.xlsx';
            }else if(_self.reportType == '10'){
              link.download = '核对明细小额纸质卡核对有卡无订单.xlsx';
            } else if(_self.reportType == '11'){
              link.download = '核对明细天猫商城虚拟卡平台有卡无订单-发卡.xlsx';
            }else if(_self.reportType == '11-1'){
              link.download = '核对明细天猫商城虚拟卡平台有卡无订单-退卡.xlsx';
            }
            link.target = '_blank';link.click();
          }
        })
      },
      //导出订单
      exportOrders(){
        let _self = this;
        let params = Object.assign({},this.getExportParam().params);
        let exportParams = Object.assign({},this.getExportParam().exportParams);
        var type = params.type
        var typeNumber = params.type.indexOf('-') < 0 ? params.type : params.type.split('-')[0]
        api.exportDataCheckOrder(typeNumber,exportParams,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            link.download = '订单信息.xlsx';
            link.target = '_blank';link.click();
          }
        })
      }
    }
	}
</script>









