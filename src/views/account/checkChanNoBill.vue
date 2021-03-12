<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <div class="selectContent" v-if="tblType == 3 || tblType == 9 || tblType == 10">
        <div class="selectTitle">卡平台订单号</div>
        <el-input v-model.trim="orderSeqId" placeholder="请输入卡平台订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 1">
        <div class="selectTitle">订单行号</div>
        <el-input v-model.trim="orderLineNumber" placeholder="请输入订单行号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 2 || tblType == 5 || tblType == 6 || tblType == 7 || tblType == 8 
                                      || tblType == 11 || tblType == 12 || tblType == 13 || tblType == 14 || tblType == 15">
        <div class="selectTitle">订单号</div>
        <el-input v-model.trim="orderCode" placeholder="请输入订单号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 2 || tblType == 5">
        <div class="selectTitle">订单类型</div>
        <el-select size="small" v-model="orderType" placeholder="订单类型">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in orderTypeOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6  || tblType == 8  || tblType == 12  || tblType == 14">
        <div v-if="tblType != 12" class="selectTitle">订单日期</div>
        <div v-else class="selectTitle">发生日期</div>
        <el-date-picker v-model="orderStartTime" type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
        <span>-</span>
        <el-date-picker v-model="orderEndTime"  type="date"
          value-format="yyyy-MM-dd" placeholder="选择日期"> </el-date-picker>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 13">
        <div class="selectTitle">订单交易流水号</div>
        <el-input v-model.trim="transactionNo" placeholder="请输入订单交易流水号" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6">
        <div class="selectTitle">退款日期</div>
        <el-date-picker v-model="refundTime" type="date"
              value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6 || tblType == 12 || tblType == 13 || tblType == 14 || tblType == 15">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="brandType" placeholder="全部品牌" :disabled="choosenBrandType != '' " filterable >
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="tblType == 1 || tblType == 2 || tblType == 6 || tblType == 8">
        <div class="selectTitle">商品类别</div>
        <el-input v-model.trim="productCategory" placeholder="请输入商品类别" clearable></el-input>
      </div>
      <div class="selectContent" v-if="tblType == 5 || tblType == 7">
        <div class="selectTitle">商品类别</div>
        <el-select size="small" v-model="productCategory" placeholder="请选择商品类别"  filterable >
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in productCategoryOptions" :key="item.index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent" v-if="tblType == 4">
        <div class="selectTitle">卡号</div>
        <el-input v-model.trim="cardNo" placeholder="请输入卡号" clearable></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否已手工分录</div>
        <el-select size="small" v-model="journalType" >
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
          <el-button size="small"  v-if="tblType == 2 || tblType == 6 || tblType == 8 || tblType == 12" type="text" @click="exportVoucher" ><i class="el-icon-download"></i>导出券码</el-button>
          <el-button size="small"  v-if="tblType == 9 || tblType == 10" type="text" @click="exportVoucher" ><i class="el-icon-download"></i>导出售卡</el-button>
          <el-button size="small"  type="success" @click="toManualAccounting" >手工分录</el-button>
        </el-row>
        <checkNoBillSingleTbl
                              v-bind:searchObj="searchObj"
                              v-on:selectedRow="selectedRow"
                              v-on:changePageInfo="getPageInfo" ></checkNoBillSingleTbl>
      </template>

      <!--多Tab-->
      <template v-if="tabs.length > 0" >
        <el-tabs v-model="activeTab" @tab-click="changeTab" >
          <el-tab-pane v-for="(tabItem,index) in tabs"
                      v-bind:key="tabItem"
                      :label="tabItem"
                      :name="'tab_' + tblType + '-' + index" >
            <el-row class="tbl-control" >
              <el-button size="small"  type="text" @click="exportDetail" ><i class="el-icon-download"></i>下载</el-button>
              <el-button size="small"  v-if="tblType == 4 || tblType == 11" type="text" @click="exportVoucher" >
                <i class="el-icon-download" v-if="tabType == '发卡'">导出售卡</i>
                <i class="el-icon-download" v-if="tabType == '退卡'">导出退卡</i>
                </el-button>
              <el-button size="small"  type="success" @click="toManualAccounting">手工分录</el-button>
            </el-row>
            <checkNoBillSingleTbl v-bind:reportType="reportType"
                                  v-bind:searchObj="searchObj"
                                  v-on:selectedRow="selectedRow"
                                  v-on:changePageInfo="getPageInfo" ></checkNoBillSingleTbl>
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
  import checkNoBillSingleTbl from './detailTbl/checkNoBillSingleTbl.vue'
	export default {
    name:'checkChanNoBill',
    components:{
      checkNoBillSingleTbl
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
      this.getInitHeader()
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
        activeTab  : '',
        searchObj  : {},
        selectData :[],
        businessType : '',
        orderStartTime : '',
        orderEndTime : '',
        orderCode : '',
        orderLineNumber : '',
        transactionNo   : '',
        refundTime      : '',
        brandType       : '',
        productCategory : '',
        journalType   : '',
        brandOptions  : [],
        choosenBrandType : '',
        orderSeqId:'',
        cardNo:'',
        pageInfo : {
          pageIndex : 1,
          pageSize  : 25
        },
        productCategoryOptions:[],
        tabType:'',
        productOrderCode:'',
        orderType:'',
        orderTypeOptions:[
          {
            value:'卡',
            label:'卡'
          },
          {
            value:'券',
            label:'券'
          }
        ]
			}
		},
    methods: {
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
        for(let i = 0; i < tblHeaderConfig.noBillTblHeader.length; i ++){
            if(tblHeaderConfig.noBillTblHeader[i].type == this.reportType){
              this.tHeaderConfig = tblHeaderConfig.noBillTblHeader[i];
              if(tblHeaderConfig.noBillTblHeader[i].tabConfig){
                this.tabs = tblHeaderConfig.noBillTblHeader[i].tabConfig;
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
        if(_self.tblType == 5 || _self.tblType == 7){
            let storage = window.localStorage;
            let params  = JSON.parse(storage.params);
            var productCategoryParam = [{
              name:'verifyResultType',
              value:3
            },
            {
              name:'verifyStartTime',
              value:params.verifyStartTime
            },
            {
              name:'verifyEndTime',
              value:params.verifyEndTime
            },
            {
              name:'brandType',
              value:params.brandType
            },
            {
              name:'payMethod',
              value:params.payMethod
            }]
          _self.productCategoryOptions = []
           api.getCheckProductCategory(_self.tblType,_self.common.joinSearchParam(productCategoryParam),function(res){
              if(res.code == 200){
                res.data.forEach(function(item,index){
                  if(!_self.productCategoryOptions[index]){
                      _self.productCategoryOptions.push({
                        index:index,
                        value:item?item:0,
                        label:item?item:'无类别'
                    })
                  }
                })
              }
           })
        }
      },
      reset(){
        let _self = this;
        let storage = window.localStorage;
        let params  = JSON.parse(storage.params);
        this.orderStartTime = '';
        this.orderEndTime = '';
        this.orderCode = '';
        this.orderLineNumber = '';
        this.transactionNo = '';
        this.refundTime = '';
        this.brandType = params.brandType? params.brandType : '';
        this.productCategory = '';
        this.journalType = '';
        this.orderType = '';
        this.orderSeqId = '';
        this.cardNo = ''
         window.localStorage.setItem('detailParams',JSON.stringify({}));
        // this.changeParams();
      },
      changeParams(){
        this.searchObj = {
          orderStartTime : this.orderStartTime,
          orderEndTime : this.orderEndTime,
          orderCode : this.orderCode,
          orderLineNumber : this.orderLineNumber,
          transactionNo   : this.transactionNo,
          refundTime      : this.refundTime,
          brandType       : this.brandType,
          productCategory : this.productCategory,
          journalType     : this.journalType,
          orderType:this.orderType,
          orderId:this.orderCode,
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
      getPageInfo(pageInfo){
        this.pageInfo = Object.assign({},pageInfo);
      },
      //跳转至手工分录
      toManualAccounting(){
        let _self = this;
        let currentParams = {
          type : _self.reportType,
          detailType   : '1',
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
          orderStartTime : this.orderStartTime ? this.orderStartTime : null,
          orderEndTime : this.orderEndTime ? this.orderEndTime : null,
          orderCode : this.orderCode ? this.orderCode : null,
          orderLineNumber : this.orderLineNumber ? this.orderLineNumber : null,
          transactionNo   : this.transactionNo ? this.transactionNo : null,
          refundTime      : this.refundTime ? this.refundTime : null,
          brandType       : this.brandType ? this.brandType : null,
          productCategory : this.productCategory ? this.productCategory : null,
          journalType     : this.journalType ? this.journalType : null
        };

        if(params.type == 3){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            orderSeqId: this.orderSeqId,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }
        if(params.type == 4 || params.type == '4-1'){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            cardNo:this.cardNo,
            tabType:this.tabType,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        if(params.type == 5){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            productCategory : this.productCategory,
            orderType:this.orderType,
            orderId:this.orderCode,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        if(params.type == 7){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            productCategory : this.productCategory,
            orderId:this.orderCode,
            pageIndex:this.pageInfo.pageIndex,
            pageSize:this.pageInfo.pageSize
          }
        }

        if(params.type == 8){
          detailParams = {
            journalType     : this.journalType ? this.journalType : null,
            productCategory : this.productCategory,
            orderCode:this.orderCode,
            orderStartTime : this.orderStartTime ? this.orderStartTime : null,
            orderEndTime : this.orderEndTime ? this.orderEndTime : null,
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
        // var typeNumber = this.tHeaderConfig.tabConfig ? type.substr(0,1) : type
        var typeNumber = type.indexOf('-') < 0 ? type : type.split('-')[0]
        api.exportCheckNoBill(typeNumber,exportParams,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            if(_self.reportType == '1' || _self.reportType == '3' || _self.reportType == '5' || _self.reportType == '7' || _self.reportType == '13' || _self.reportType == '15'){
              link.download = '核对明细(无账单).xlsx';
            }else if(_self.reportType == '2' || _self.reportType == '6' || _self.reportType == '8' || _self.reportType == '12' || _self.reportType == '14'){
              link.download = '核对明细(无券码).xlsx';
            }else if(_self.reportType == '4'){
              link.download = '核对明细自有渠道虚拟卡平台有订单无卡-发卡.xlsx';
            }else if(_self.reportType == '4-1'){
              link.download = '核对明细自有渠道虚拟卡平台有订单无卡-退卡.xlsx';
            }else if(_self.reportType == '9'){
              link.download = '核对明细一次性团购核对有订单无卡.xlsx';
            }
            else if(_self.reportType == '10'){
              link.download = '核对明细小额纸质卡核对有订单无卡.xlsx';
            }else if(_self.reportType == '11'){
              link.download = '核对明细天猫商城虚拟卡平台有订单无卡-发卡.xlsx';
            }else if(_self.reportType == '11-1'){
              link.download = '核对明细天猫商城虚拟卡平台有订单无卡-退卡.xlsx';
            }
            link.target = '_blank';link.click();
          }
        })
      },
      //导出券码
      exportVoucher(){
        let _self = this;
        let params  = Object.assign({},this.getExportParam().params);
        let exportParams = Object.assign({},this.getExportParam().exportParams);
        var typeNumber =  params.type.indexOf('-') < 0 ? params.type : params.type.split('-')[0]
        api.exportDataCheckVoucher(typeNumber,exportParams,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            if(_self.reportType == '4' || _self.reportType == '11'){
              link.download = '售卡记录.xlsx';
            }else if(_self.reportType == '4-1' || _self.reportType == '11-1'){
              link.download = '退卡记录.xlsx';
            }else if(_self.reportType == '9' || _self.reportType == '10'){
              link.download = '售卡信息.xlsx';
            }else{
              link.download = '券码信息.xlsx';
            }
            link.target = '_blank';link.click();
          }
        })
      }
    }
	}
</script>









