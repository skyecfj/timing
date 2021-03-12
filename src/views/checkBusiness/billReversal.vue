<template>
   <div class="cbContent">
      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>2018年5月订单账务</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="实体卡">
                <el-table-column prop="date" label="订单金额(A)">
                </el-table-column>
                <el-table-column prop="date" label="退款金额(B)">
                </el-table-column>
                <el-table-column prop="date" label="小计(C) = (A) - (B)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="虚拟卡">
                <el-table-column prop="date" label="订单金额(D)">
                </el-table-column>
                <el-table-column prop="date" label="退款金额(E)">
                </el-table-column>
                <el-table-column prop="date" label="小计(F) = (D) - (E)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="劵码">
                <el-table-column prop="date" label="订单金额(G)">
                </el-table-column>
                <el-table-column prop="date" label="退款金额(H)">
                </el-table-column>
                <el-table-column prop="date" label="小计(I) = (G) - (H)">
                </el-table-column>
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>天猫.2018年5月劵码账务</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="发劵金额(A)">
              </el-table-column>
              <el-table-column prop="date" label="销卷金额(B)">
              </el-table-column>
              <el-table-column prop="date" label="小计(C)=(A)-(B)">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>自由商城</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="会员权益早餐卡">
                <el-table-column prop="date" label="发劵金额(A)">
                </el-table-column>
                <el-table-column prop="date" label="销卷金额(B)">
                </el-table-column>
                <el-table-column prop="date" label="小计(C)=(A)-(B)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="非会员权益早餐卡">
                <el-table-column prop="date" label="发劵金额(A)">
                </el-table-column>
                <el-table-column prop="date" label="销卷金额(B)">
                </el-table-column>
                <el-table-column prop="date" label="小计(C)=(A)-(B)">
                </el-table-column>
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>天猫.2018年5月虚拟卡账务</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="发卡金额">
              </el-table-column>
              <el-table-column prop="date" label="销卡金额">
              </el-table-column>
            </el-table>
        </div>
      </div>
      
      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>天猫.2018年5月实体卡账单账务</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="收入金额(A)">
              </el-table-column>
              <el-table-column prop="date" label="支出金额(B)">
              </el-table-column>
              <el-table-column prop="date" label="小计(C)=(A)-(B)">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>卡/劵服务费账务</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="品牌">
              </el-table-column>
              <el-table-column prop="date" label="服务费(不含税)">
              </el-table-column>
              <el-table-column prop="date" label="税额">
              </el-table-column>
              <el-table-column prop="date" label="服务费(含税)">
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>积分账务.积分生成</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="开票单位99店">
                <el-table-column prop="date" label="积分费(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="积分费(含税)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="加盟商">
                <el-table-column prop="date" label="积分费(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="积分费(含税)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="合计">
                <el-table-column prop="date" label="积分费(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="积分费(含税)">
                </el-table-column>
              </el-table-column>
            </el-table>
        </div>
      </div>

      <div class="cbSection">
        <div class="cbSectionTitle">
          <span>积分账务.积分生成</span>
        </div>
        <div class="cbSectionContent">
          <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="开票单位99店">
                <el-table-column prop="date" label="内部结算价格(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="内部结算价格(含税)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="加盟商">
                <el-table-column prop="date" label="内部结算价格(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="内部结算价格(含税)">
                </el-table-column>
              </el-table-column>
              <el-table-column prop="date" label="合计">
                <el-table-column prop="date" label="内部结算价格(不含税)">
                </el-table-column>
                <el-table-column prop="date" label="税额">
                </el-table-column>
                <el-table-column prop="date" label="内部结算价格(含税)">
                </el-table-column>
              </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'billReversal',
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
          }]
      }
		},
    methods: {
      headRow(row, column, rowIndex, columnIndex){
        return 'text-align:center';
      },
      cellClass(){
        return 'text-align:center';
      }
     }
  }
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';

</style>