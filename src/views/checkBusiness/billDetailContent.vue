<template>
    <div class="cbContent">
      <div class="cbSection" v-if="orderBillData.tableData.length">
        <div class="cbSectionTitle">
          <span>{{orderBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="orderBillData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="price" label="应收金额(合计)">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection" v-if="cAData.tableData.length">
        <div class="cbSectionTitle">
          <span>{{cAData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="cAData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="price" label="实付金额(合计)">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{monthCBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="monthCBillData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="receive" label="应收金额">
              </el-table-column>
              <el-table-column prop="discount" label="折扣金额">
              </el-table-column>
              <el-table-column prop="cardSum" label="卡面额">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{cAOrderData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="cAOrderData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="paid" label="购买金额">
              </el-table-column>
              <el-table-column prop="discount" label="折扣金额">
              </el-table-column>
              <el-table-column prop="outSum" label="实付金额">
              </el-table-column>
            </el-table>
        </div>
      </div>
      
      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{recyBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="recyBillData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="sum" label="销卡面额">
              </el-table-column>
              <el-table-column prop="discount" label="销卡折扣">
              </el-table-column>
              <el-table-column prop="netSum" label="销卡净额">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{mangerBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="mangerBillData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="deductSum" label="卡面扣费金额">
              </el-table-column>
              <el-table-column prop="discount" label="卡片折扣金额">
              </el-table-column>
              <el-table-column prop="netSum" label="卡片净额(不含税)">
              </el-table-column>
              <el-table-column prop="taxSum" label="卡片净额-税额">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{srBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="srBillData.tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="saleSum" label="当月售卡面额(A)" :render-header="(h,data) => renderHeader(h,data,'当月售卡面额','(A)')">
              </el-table-column>
              <el-table-column prop="deductSum" label="当月销卡面额(B)" :render-header="(h,data) => renderHeader(h,data,'当月售卡面额','(B)')">
              </el-table-column>
              <el-table-column prop="discount" label="当月现金折扣(C)" :render-header="(h,data) => renderHeader(h,data,'当月现金折扣','(C)')">
              </el-table-column>
              <el-table-column prop="deductDis" label="当月销卡折扣(D)" :render-header="(h,data) => renderHeader(h,data,'当月销卡折扣','(D)')">
              </el-table-column>
              <el-table-column prop="total" label="合计(A-B-C+D)" :render-header="(h,data) => renderHeader(h,data,'合计','(A-B-C+D)')">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{drcBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="刷卡面额总计(A)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(A)')">
              </el-table-column>
              <el-table-column prop="date" label="刷卡面额(B)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额','(B)')">
              </el-table-column>
              <el-table-column prop="date" label="刷卡面额(C)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额','(C)')">
              </el-table-column>
              <el-table-column prop="date" label="刷卡面额(D)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额','(A-B-C)')">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{drnBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="刷卡面额总计(A)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(A)')">
              </el-table-column>
              <el-table-column prop="date" label="当月销卡面额(B)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(B)')">
              </el-table-column>
              <el-table-column prop="date" label="当月现金折扣(C)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(C)')">
              </el-table-column>
              <el-table-column prop="date" label="当月销卡折扣(D)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(D)')">
              </el-table-column>
              <el-table-column prop="date" label="合计(A-B-C+D)" :render-header="(h,data) => renderHeader(h,data,'刷卡面额总计','(A-B-C-D)')">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{drnTBillData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="刷卡面额-品牌">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{disData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>{{deductData.title}}</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
              <el-table-column prop="date" label="上月折扣分摊额">
              </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'billDetailContent',
    data() {
			return {
         dDisabled: false,
         cDisabled:false,
         frDisabled:true,
         reversalSuceess:false,
         reversalFinance:false,
         createFinance:false,
         isShowBdc:true,
         isShowBr:false,
         tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            time:'2018-07-08'
          }],
          orderBillData:{title:'实体卡订单/自有售卖渠道订单/一次性团购订单.2018年5月订单账务',tableData:[{price:'121231'}]},
          cAData:{title:'小额纸质卡券.二次激活',tableData:[{price:'22222'}]},
          monthCBillData:{title:'实体卡大额订单/天猫TP实体卡订单/自有售卖渠道订单/一次性团购订单.2018年5月卡账务',tableData:[{receive:'123',discount:'13',cardSum:'345'}]},
          cAOrderData:{title:'小额纸质卡券二次激活订单',tableData:[{paid:'123',discount:'13',outSum:'345'}]},
          recyBillData:{title:'销卡回收账务',tableData:[{sum:'1232',discount:'13',netSum:'345'}]},
          mangerBillData:{title:'到期管理费账务',tableData:[{deductSum:'1232',discount:'13',netSum:'345',taxSum:'1213'}]},
          srBillData:{title:'实体卡售卡-往来账务',tableData:[{saleSum:'1232',deductSum:'13',discount:'345',deductDis:'1213',total:'12312'}]},
          drcBillData:{title:'卡核销(当月)-往来账务',tableData:[{saleSum:'1232',deductSum:'13',discount:'345',deductDis:'1213',total:'12312'}]},
          drnBillData:{title:'卡核销(次月AR)-往来账务',tableData:[{saleSum:'1232',deductSum:'13',discount:'345',deductDis:'1213',total:'12312'}]},
          drnTBillData:{title:'卡核销(次月总账)-往来账务',tableData:[{sum:'1232'}]},
          disData:{title:'卡折扣分摊-往来账务',tableData:[{sum:'1232',discount:'13',netSum:'345'}]},
          deductData:{title:'券核销-往来账务',tableData:[{sum:'1232',discount:'13',netSum:'345'}]},
     }
		},
    methods: {
      headRow(row, column, rowIndex, columnIndex){
        return 'text-align:center';
      },
      cellClass(){
        return 'text-align:center';
      },
      renderHeader(h,data,headFisrtName,headSecondName){
        //console.log(data)
        return <div><span>{headFisrtName}</span><span style="color:#f56c6c">{headSecondName}</span></div>

      }
     }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';
  .textRed {
    color: red;
  }

 </style>