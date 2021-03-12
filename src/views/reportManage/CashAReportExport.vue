<!--cash_a导出-->
<template>
  <div id="cashaReportExport" >
    <div class="content" >
      <el-form ref="regetDataForm" :model="exportConfig" :inline="true" >
        <el-row>
          <el-form-item label="营业日期" >
            <el-date-picker type="daterange" range-separator="-" value-format="yyyy-MM-dd" :unlink-panels="true" size="medium"
                            v-model="dateRange" :clearable="true" start-placeholder="起始时间" end-placeholder="结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="营运市场" >
            <el-select  v-model="exportConfig.operateCode" size="medium" filterable @change="operateMarketChange" >
              <el-option label="请选择" value="" ></el-option>
              <el-option  v-for="item in operateOpts" :key="item.marketNumber" :label="item.marketNumber" :value="item.marketNumber" ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="法人公司" >
            <el-select  v-model="exportConfig.companyJde" filterable remote placeholder="请输入法人公司名称进行查询" size="medium" @change="changeCompany"
                        :remote-method="getCompany" :loading="getCompanyLoading" @visible-change="toogleCompanyDropDown" v-scroll="companyScroll" >
              <el-option label="请选择" value="" ></el-option>
              <el-option  v-for="item in companyList" :key="item.jdeCode" :label="item.companyName" :value="item.jdeCode" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开票单位" >
            <el-select  v-model="exportConfig.billingUnit" size="medium" filterable >
              <el-option label="请选择" value="" ></el-option>
              <el-option  v-for="item in billUnitOpts" :key="item.jdeCode" :label="item.billingUnitName" :value="item.jdeCode" ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="餐厅编号" >
            <el-select  v-model="exportConfig.storeCodes" multiple filterable remote placeholder="请输入餐厅编号进行查询" reserve-keyword  v-scroll="storeScroll"
                        :remote-method="getStore" :loading="getStoreLoading" @visible-change="toogleStoreDropDown"  @change="storeChange" clearable >
              <el-option v-for="(item,index) in storeList" :key="item.storeHypId" :label="item.storeHypId" :value="item.storeHypId" ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-form-item label="导出列" >
          <el-checkbox-group v-model="columnNames">
            <el-checkbox label="BOH报送应收"></el-checkbox>
            <el-checkbox label="BOH报送实收"></el-checkbox>
            <el-checkbox label="账单金额"></el-checkbox>
            <el-checkbox label="当月调整"></el-checkbox>
            <el-checkbox label="次月调整"></el-checkbox>
            <el-checkbox label="final"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-form-item label="导出常用数据项" label-width="105px" class="check-group-content" >
            <el-checkbox-group v-model="ususlDataSubject" >
              <el-checkbox v-for="(item,index) in ususlDataSubjects" :key="'ususl_'+index" :label="item" :checked="true" ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="导出其他数据项" label-width="105px" class="check-group-content" >
            <el-checkbox :indeterminate="isIndeterminate" v-model="chooseAllOthers" @change="handleCheckAllChange" class="check-all" >全选</el-checkbox>
            <el-checkbox-group v-model="otherDataSubject">
              <el-checkbox v-for="(item,index) in otherDataSubjects" :key="'other_'+index" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="导出活动项" class="export-acts-content" >
            <el-select  v-model="actNames" multiple filterable clearable >
              <el-option v-for="(item,index) in exportActs" :key="'act_'+index" :label="item" :value="item" ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="page-footer">
        <el-button size="small" type="success" @click="doExportCashA" key="exportConfirmBtn">导 出</el-button>
        <el-button size="small" type="success" :plain="true" @click="cancel">关 闭</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import apidr from '../../model/apidr'
  import api from '../../model/api'
  import scroll from '@/directives/index'

	export default {
    name:'CashAReportExport',
    directives: { scroll },
    created(){},
    beforeMount(){
      //this.getCompany('');
      this.getStore('');
      //this.getBillUnit();
      this.getExportActs();
      this.getOperateMarket();
    },
    mounted(){},
		data() {
			return {
        columnNames      : ['BOH报送应收','BOH报送实收','账单金额','当月调整','次月调整','final'],
        ususlDataSubject : [],
        otherDataSubject : [],
        actNames      : [],
        operateOpts   : [],
        exportConfig  : {
          companyJde  : null,

          storeCodes  : []
        },
        dateRange   : [],
        companyList : [],
        billUnitOpts: [],
        otherDataSubjects : [],
        chooseAllOthers   : false,
        isIndeterminate   : true,
        ususlDataSubjects : [],
        exportActs  : [],
        storeList   : [],
        tempCompany : '',
        getCompanyLoading : false,
        getStoreLoading   : false,
        companyScrollPageIndex  : 1,
        companyScrollFlag       : true,
        companySelectObj        : {},
        tempComanySearchKeyWord : '',
        storeScrollPageIndex    : 1,
        storeScrollFlag         : true,
        storeSelectObj          : {},
        tempStoreSearchKeyword  : '',
        searchStoreScrollPageIndex : 1,
        searchStoreScrollFlag      : true,
        searchStoreSelectObj       : {},
        tempSearchStoreKeyWord     : ''
			}
    },
    watch : {
      // companyJdeChanged(val,oldVal){
      //   if(!val){
      //     this.companyList = [];
      //     this.getCompany('');
      //   }
      //   this.tempCompany = oldVal;
      //   this.getBillUnit();
      // },
      storeCodesChanged(val,oldVal){
        if(!val.length){
          this.storeList = [];
          this.getStore('');
        }
        this.tempCompany = oldVal;
      }
    },
    computed: {
      // companyJdeChanged(){
      //   return this.exportConfig.companyJde
      // },
      storeCodesChanged(){
        return this.exportConfig.storeCodes
      }
    },
    methods: {
      //关闭当前页
      cancel(){
        this.common.deleteTag(this.$route,this);
      },
      // getBillUnit(){
      //   let _self = this;
      //   let param = this.common.formatPathParam({
      //     companyCode : this.exportConfig.companyJde
      //   })
      //   api.getBillUnitsByCompanyCode(param,function(res){
      //     if(res.code === 200){
      //       _self.billUnitOpts = res.data.concat();
      //     }else{
      //       _self.billUnitOpts = [];
      //     }
      //   })
      // },
      getExportActs(){
        let _self = this;
        apidr.getCashaExportActs('',function(res){
          if(res.code === 200){
            _self.ususlDataSubjects = [];
            _self.otherDataSubjects = [];
            _self.exportActs = [];
            res.data.forEach(function(item){
              if(item.usually === 1){
                _self.ususlDataSubjects.push(item.fscActivityCode);
              }else if(item.cashaDetailType === 2){
                _self.otherDataSubjects.push(item.fscActivityCode);
              }else if(item.cashaDetailType === 1){
                _self.exportActs.push(item.fscActivityCode);
              }
            })
          }else{
            _self.ususlDataSubjects = [];
            _self.otherDataSubjects = [];
            _self.exportActs = [];
          }
        })

      },
      getOperateMarket(){
        let _self = this;
        this.operateOpts = [];
        api.getOperateMarketIdNames('&judgePermission=true', res=> {
          if(res.code == 200){
            _self.operateOpts = res.data.concat();
          }
        })
      },
      operateMarketChange() {
        this.exportConfig.storeCodes = [];
        this.storeList = [];
        this.getStore('');
      },
      handleCheckAllChange(val) {
        this.otherDataSubject = val ? this.otherDataSubjects : [];
        this.isIndeterminate = false;
      },
      // companyScroll(param,object){
      //   let _self = this;
      //   if(param){
      //     this.companySelectObj = object;
      //     if(this.companyScrollFlag){
      //       this.companyScrollPageIndex++;
      //       let param = this.common.formatPathParam({
      //         pageSize  : 20,
      //         pageIndex : this.companyScrollPageIndex,
      //         companyName : this.tempComanySearchKeyWord,
      //         marketId    : null
      //       });
      //       api.getCompanyByFMarket(param,function(res){
      //         if(res.code === 200){
      //           _self.companyList = _self.companyList.concat(res.data);
      //         }else{
      //           _self.companyScrollFlag = false;
      //         }
      //       })
      //     }
      //   }
      // },
      //获取法人公司
      // getCompany(query){
      //   let _self = this;
      //   this.getCompanyLoading = true;
      //   this.companyScrollPageIndex = 1;
      //   this.tempComanySearchKeyWord = query;
      //   if(JSON.stringify(this.companySelectObj) !== '{}'){
      //     this.companySelectObj.scrollTop = 0;
      //   }
      //   let param = this.common.formatPathParam({
      //     pageIndex   : this.companyScrollPageIndex,
      //     pageSize    : 20,
      //     companyName : query,
      //     marketId    : null
      //   });
      //   api.getCompanyByFMarket(param,function(result){
      //     _self.getCompanyLoading = false;
      //     if(result.code == 200){
      //       _self.companyList = result.data;
      //     }else if(result.code == 404){
      //       _self.companyList = [];
      //     }
      //   })
      // },
      //法人公司下拉框收起
      // toogleCompanyDropDown(isVisible){
      //   if(!isVisible){
      //     if(!this.exportConfig.marketId){
      //       this.companyList = [];
      //       this.getCompany('');
      //     }
      //   }
      // },
      // changeCompany(val){
      //   let _self = this;
      //   this.getStore('');
      //   if(this.exportConfig.storeCodes.length || this.exportConfig.billingUnit){
      //     let confirmText = '更改法人公司餐厅编号和开票单位将会被清空?'
      //     this.$confirm(confirmText, '提示', {
      //       confirmButtonText: '确定更改',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //       this.exportConfig.storeCodes = [];
      //       this.exportConfig.billingUnit = '';
      //     }).catch(() => {
      //       this.exportConfig.companyJde = this.tempCompany;
      //     });
      //   }
      // },
      storeScroll(param,object){
        let _self = this;
        if(param){
          this.storeSelectObj = object;
          if(this.storeScrollFlag){
            this.storeScrollPageIndex++;
            let param = {
              pageSize   : 20,
              pageIndex  : this.storeScrollPageIndex,
              storeHypId : this.tempStoreSearchKeyword,
              judgePermission : true,
              operateMarket   : this.exportConfig.operateCode? this.exportConfig.operateCode : null
              //companyCode     : this.exportConfig.companyJde? this.exportConfig.companyJde : null,
              //financialMarket : null
            };
            api.getSelectSearchCondition(param,function(res){
              if(res.code === 200){
                _self.storeList = _self.storeList.concat(res.data);
              }else{
                _self.storeScrollFlag = false;
              }
            })
          }
        }
      },
      //获取餐厅
      getStore(query){
        let _self = this;
        this.storeScrollPageIndex = 1;
        if(JSON.stringify(this.storeSelectObj) !== '{}'){
          this.storeSelectObj.scrollTop = 0;
        }
        this.tempStoreSearchKeyword = query;
        let param = {
          pageSize   : 20,
          pageIndex  : this.storeScrollPageIndex,
          storeHypId : query,
          judgePermission : true,
          operateMarket   : this.exportConfig.operateCode? this.exportConfig.operateCode : null
          //companyCode     : this.exportConfig.companyJde? this.exportConfig.companyJde : null,
          //financialMarket : null,
        };
        api.getSelectSearchCondition(param,function(result){
          _self.getStoreLoading = false;
          if(result.code == 200){
            _self.storeList = result.data;
          }else if(result.code == 404){
            _self.storeList = [];
          }
        })
      },
      toogleStoreDropDown(isVisible){
        this.getStore('');
        if(!isVisible){
          if(!this.exportConfig.storeCodes.length){
            this.storeList = [];
          }
        }
      },
      storeChange(val){
        if(!this.exportConfig.storeCodes.length){
          this.storeList = [];
          this.getStore('');
        }
      },
      doExportCashA(){
        let _self = this;
        if(this.dateRange.length < 2){
          this.common.messageUtil({
            message: '请选择完整的营业日期',
            type: 'warning'
          });
          return false;
        }
        if(!this.exportConfig.operateCode && !this.exportConfig.storeCodes.length){
          this.common.messageUtil({
            message: '请至少再选择一个导出条件',
            type: 'warning'
          });
          return false;
        }
        let param = {
          bizDateBegin : this.dateRange[0]? this.dateRange[0] : null,
          bizDateEnd   : this.dateRange[1]? this.dateRange[1] : null,
          //companyCode  : this.exportConfig.companyJde? this.exportConfig.companyJde : null,
          //billingUnit  : this.exportConfig.billingUnit? this.exportConfig.billingUnit : null,
          operateCode  : this.exportConfig.operateCode? this.exportConfig.operateCode : null,
          storeCodes   : this.exportConfig.storeCodes.length? this.exportConfig.storeCodes : null,
          columnNames  : this.columnNames.length? this.columnNames : null
        };
        let actNames = [];
        actNames = actNames.concat(this.ususlDataSubject,this.otherDataSubject,this.actNames);
        param.actNames = actNames.concat();
        console.log(param);
        apidr.exportCashaData(param,'application/vnd.ms-excel',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            _self.catchDataDialogVisible = false;
            let link = document.createElement('a');
            link.href = res;
            link.download = 'cashA数据科目报表.xlsx'
            link.target = '_blank';link.click();
          }
        })
      }
    }
	}
</script>

<style lang="scss" scoped >
#cashaReportExport /deep/{
  .export-acts-content{
    width: 100%;
    .el-form-item__content{
      width: 50%;
      .el-select{
        width: 100%;
      }
    }
  }
  .check-group-content{
    width : 60%;
    .el-form-item__content{
      width : 85%;
      .el-checkbox-group .el-checkbox:first-child{
        margin-left: 30px;
      }
    }
    .check-all{
      margin-left: 30px;
      display: inline-block;
    }
  }
  .page-footer{
    text-align: right;
    padding-right: 5%;
  }
}
</style>









