<!--核对结果-->
<template>
  <div>
    <!-- search -->
    <div class="search-content">
      <div class="selectContent">
        <div class="selectTitle">业务类型</div>
        <el-select
          size="small"
          v-model="searchObj.businessType"
          placeholder="业务类型"
          disabled
          @change="searchObj.verifyType = ''; searchObj.sellChannelType = '';getDicSonOpts(searchObj.businessType,'verifyTypeOptions')"
        >
          <el-option
            v-for="item in businessTypeOptions"
            :key="item.id"
            :label="item.dictionaryEntryName"
            :value="item.dictionaryEntryCode"
          ></el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">核对类型</div>
        <el-select
          size="small"
          v-model="searchObj.verifyType"
          placeholder="核对类型"
          @change="changeVerifyType"
        >
          <el-option
            v-for="item in verifyTypeOptions"
            :key="item.id"
            :label="item.dictionaryEntryName"
            :value="item.dictionaryEntryCode"
          ></el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">售卖渠道</div>
        <el-select size="small" v-model="searchObj.sellChannelType" placeholder="售卖渠道">
          <el-option
            v-for="item in sellChannelTypeOptions"
            :key="item.id"
            :label="item.dictionaryEntryName"
            :value="item.dictionaryEntryCode"
          ></el-option>
        </el-select>
      </div>
      <!--<div class="selectContent" v-if="isShowPayMethod">-->
      <!--<div class="selectTitle">支付方式</div>-->
      <!--<el-select size="small"   v-model="searchObj.payMethod" placeholder="请选择支付方式">-->
      <!--<el-option label="请选择"  value=""></el-option>-->
      <!--<el-option v-for="item in payMethodOptions" :key="item.label" :label="item.label" :value="item.value">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <!--</div>-->
      <div class="selectContent" v-if="isShowBrand">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="searchObj.brandType" placeholder="请选择品牌" filterable>
          <el-option label="请选择" value></el-option>
          <el-option
            v-for="item in brandOptions"
            :key="item.brandId"
            :label="item.brandEnglishName"
            :value="item.brandEnglishName"
          ></el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">核对日期</div>
        <el-date-picker
          v-model="searchObj.verifyStartTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="searchObj.verifyEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
      <el-button size="small" type="success" class="findButt" @click="getData">查询</el-button>
      <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
      <el-button
        size="small"
        type="success"
        plain
        class="reSet"
        @click="taskgroup(1)"
        v-if="searchObj.sellChannelType === 'KB' && searchObj.verifyType === 'RECEIVE-B2C'"
      >核对任务</el-button>
      <el-button
        size="small"
        type="success"
        plain
        class="reSet"
        @click="taskgroup(0)"
        v-if="searchObj.sellChannelType === 'KB' && searchObj.verifyType === 'RECEIVE-B2C'"
      >订单账务</el-button>
    </div>

    <!--body-->
    <div class="rightTableCR">
      <p class="tableTit">{{tblObj.title}}</p>
      <!--多头表格-->
      <template>
        <el-table
          v-show="collatReport.length > 0"
          :data="collatReport"
          style="width: 100%"
          :row-style="renderSumStyle"
          :cell-style="renderCellStyle"
        >
          <el-table-column label="核对结果" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.indexNumber == 1">核对无差异</span>
              <span v-if="scope.row.indexNumber == 2">金额不一致</span>
              <span v-if="scope.row.indexNumber == 3">{{tblObj.noBillLabel}}</span>
              <span v-if="scope.row.indexNumber == 4">{{tblObj.hasBillLabel}}</span>
              <span v-if="scope.row.indexNumber == 5">合计</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" :label="tblObj.numberLabel"></el-table-column>
          <!--订单-->
          <el-table-column label="订单" align="center">
            <el-table-column
              prop="orderAmount"
              label="订单金额"
              :render-header="(h,data) => renderHeader(h,data,tblObj.type == '9' || tblObj.type == '10' ? tblHeader.children[0]:'订单金额','(A)')"
            ></el-table-column>
            <el-table-column
              prop="orderRefundAmount"
              label="退款金额"
              :render-header="(h,data) => renderHeader(h,data,tblObj.type == '9' || tblObj.type == '10' ? tblHeader.children[1]:'退款金额','(B)')"
            ></el-table-column>
            <el-table-column
              prop="orderTotal"
              label="小计"
              :render-header="(h,data) => renderHeader(h,data,'小计','(C) = (A)-(B)')"
              v-if=" tblObj.type !== '9' && tblObj.type !== '10'"
            ></el-table-column>
          </el-table-column>
          <!--账单/券码中心/卡中心/-->
          <el-table-column :label="tblHeader.name" align="center">
            <el-table-column
              prop="billInAmount"
              :render-header="(h,data) => renderHeader(h,data,tblHeader.children[0], tblObj.type == '9' || tblObj.type == '10' ?'(C)':'(D)')"
            ></el-table-column>
            <el-table-column
              prop="billOutAmount"
              :render-header="(h,data) => renderHeader(h,data,tblHeader.children[1],tblObj.type == '9' || tblObj.type == '10' ?'(D)':'(E)')"
            ></el-table-column>
            <el-table-column
              prop="billTotal"
              label="小计"
              :render-header="(h,data) => renderHeader(h,data,'小计','(F) = (D)-(E)')"
              v-if=" tblObj.type !== '9' && tblObj.type !== '10'"
            ></el-table-column>
          </el-table-column>
          <el-table-column
            prop="diffTotalAmount"
            :render-header="(h,data) => renderHeader(h,data,'差异', tblObj.type == '9' || tblObj.type == '10' ? '(E) = (B)-(D)' :
              '(G) = (C)-(F)')"
          ></el-table-column>
          <el-table-column prop="operatE" label="操作">
            <template slot-scope="scope" v-if="scope.row.indexNumber != 5">
              <el-button
                size="small"
                @click.native.prevent="viewDetails(scope.row.indexNumber)"
                type="text"
              >查看明细</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
<script>
import api from "../../model/api";
import checkResultsUtil from "../../utils/checkResultsUtil";
export default {
  name: "checkResults",
  props: ["businessTypeFromCom"],
  created() {},
  watch: {
    $route(to, from) {
      this.$emit("routeLeave", this.tblObj);
      if (to.name == "checkChanNoBill") {
        to.meta.title = this.tblObj.noBillLabel;
      } else if (to.name == "checkBillNoChan") {
        to.meta.title = this.tblObj.hasBillLabel;
      }
    }
  },
  beforeMount() {
    this.getSearchOptioins();
  },
  mounted() {
    this.searchObj.businessType = this.businessTypeFromCom;
    this.getDicSonOpts(this.searchObj.businessType, "verifyTypeOptions");
  },
  data() {
    return {
      name: "checkResults",
      navTitle: {
        fontSize: "20px"
      },
      tabIndex: 2,
      searchObj: {
        businessType: "",
        verifyType: "",
        sellChannelType: "",
        brandType: "",
        verifyStartTime: "",
        verifyEndTime: ""
        // payMethod:''
      },
      businessTypeOptions: [], //业务类型
      verifyTypeOptions: [], //核对类型
      sellChannelTypeOptions: [], //售卖渠道
      brandOptions: [],
      activeName: "first",
      tblHeader: {
        name: "",
        children: []
      },
      tblObj: {
        title: "",
        type: ""
      },
      collatReport: [],
      isShowBrand: true
      // isShowPayMethod:false,
      // payMethodOptions:[
      //   {
      //     value:'微信',
      //     label:'微信'
      //   },
      //   {
      //     value:'支付宝',
      //     label:'支付宝'
      //   }
      // ]
    };
  },
  methods: {
    changeVerifyType(val) {
      this.searchObj.sellChannelType = "";
      this.getDicSonOpts(this.searchObj.verifyType, "sellChannelTypeOptions");
      // this.isShowPayMethod = val == 'RECEIVE-B2B'? true : false
      this.isShowBrand =
        val == "VIRTUALCARD-B2B" ||
        val == "RECEIVE-B2B" ||
        val == "VIRTUALCARD-B2C"
          ? false
          : true;
      this.searchObj.brandType = this.isShowBrand
        ? this.searchObj.brandType
        : "";
      this.searchObj.payMethod = this.isShowPayMethod
        ? this.searchObj.payMethod
        : "";
    },
    viewDetails(index) {
      let _self = this;
      let docType = index;
      let currentParams = {
        type: _self.tblObj.type,
        businessType: _self.searchObj.businessType,
        verifyStartTime: _self.searchObj.verifyStartTime,
        verifyEndTime: _self.searchObj.verifyEndTime,
        brandType: _self.searchObj.brandType,
        journalType: "",
        payMethod: _self.searchObj.payMethod
      };
      window.localStorage.setItem("params", JSON.stringify(currentParams));
      window.localStorage.setItem("detailParams", JSON.stringify({}));
      this.$emit("routeLeave", this.tblObj);
      if (docType == 1) {
        this.$router.push({
          name: "checkSame",
          params: currentParams
        });
      } else if (docType == 2) {
        this.$router.push({
          name: "checkSumDiff",
          params: currentParams
        });
      } else if (docType == 3) {
        this.$router.push({
          name: "checkChanNoBill",
          meta: {
            title: _self.tblObj.noBillLabel
          },
          params: currentParams
        });
      } else {
        this.$router.push({
          name: "checkBillNoChan",
          meta: {
            title: _self.tblObj.hasBillLabel
          },
          params: currentParams
        });
      }
    },
    //渲染合计行样式
    renderSumStyle(rowObj) {
      if (rowObj.row.indexNumber == 5) {
        let style = {
          background: "#f5f7fa",
          "font-size": "14px"
        };
        return style;
      }
    },
    //区分多表头样式
    renderCellStyle({ row, column, rowIndex, columnIndex }) {
      let _self = this;
      if (columnIndex > 4 && columnIndex < 8 && row.indexNumber != 5) {
        let style = {
          background: "rgba(219, 219, 219, 0.7)"
        };
        return style;
      }
    },
    renderDis(row, column, cellValue, index) {
      return "-" + cellValue;
    },
    renderHeader(h, data, headFisrtName, headSecondName) {
      return (
        <span>
          <span>{headFisrtName}</span>
          <span style="color:#f56c6c;display: block">{headSecondName}</span>
        </span>
      );
    },
    //加载多头表头
    renderTblHeader() {
      let _self = this;
      if (
        this.tblObj.type == "1" ||
        this.tblObj.type == "3" ||
        this.tblObj.type == "5" ||
        this.tblObj.type == "7" ||
        this.tblObj.type == "13" ||
        this.tblObj.type == "15"
      ) {
        _self.tblHeader = {
          name: "账单",
          children: ["收入", "支出"]
        };
      } else if (
        this.tblObj.type == "2" ||
        this.tblObj.type == "6" ||
        this.tblObj.type == "8" ||
        this.tblObj.type == "12" ||
        this.tblObj.type == "14"
      ) {
        _self.tblHeader = {
          name: "券码中心",
          children: ["发券", "退券"]
        };
      } else if (this.tblObj.type == "4") {
        _self.tblHeader = {
          name: "卡中心",
          children: ["发卡", "退卡"]
        };
      } else if (this.tblObj.type == "9" || this.tblObj.type == "10") {
        _self.tblHeader = {
          name: "卡中心",
          children: ["卡面额", "实收金额"]
        };
      } else if (this.tblObj.type == "11") {
        _self.tblHeader = {
          name: "卡中心",
          children: ["发卡", "退卡"]
        };
      }
    },
    getTblTitle() {
      let _self = this;
      let currentTblType =
        this.searchObj.businessType +
        "_" +
        this.searchObj.verifyType +
        "_" +
        this.searchObj.sellChannelType;
      _self.tblObj = checkResultsUtil.getTblObj(currentTblType);
    },
    //获查询头部选项
    getSearchOptioins() {
      let _self = this;
      let searchParam = this.common.formatPathParam({
        pageIndex: 1,
        pageSize: 99999999,
        flag: 2
      });
      api.getBrandList(searchParam, function(result) {
        if (result.data.list) {
          _self.brandOptions = result.data.list;
        } else {
          _self.brandOptions = [];
        }
      });
      // api.getBrandOptions(null,function(result){
      //   _self.brandOptions = result.data;
      // });
      api.getDictionaryByNumber("BUSINESSTYPEFORCHECK", function(res) {
        _self.businessTypeOptions = res.data;
      });
    },
    //获取数据字典子项
    getDicSonOpts(code, sonAttr) {
      let _self = this;
      api.getDictionaryByNumber(code, function(res) {
        _self[sonAttr] = res.data;
      });
    },
    //查询列表
    getData() {
      let _self = this;
      if (
        this.searchObj.businessType &&
        this.searchObj.verifyType &&
        this.searchObj.sellChannelType
      ) {
        if (this.searchObj.verifyStartTime && this.searchObj.verifyEndTime) {
          let tempSearchObj = Object.assign({}, this.searchObj);
          tempSearchObj.verifyType = tempSearchObj.verifyType.substring(
            0,
            tempSearchObj.verifyType.length - 4
          );
          let param = this.common.formatPathParam(tempSearchObj);
          api.getCheckResultMainTbl(
            param,
            function(result) {
              if (result.code == 200) {
                _self.collatReport = result.data;
              } else {
                _self.collatReport = [];
              }
              _self.getTblTitle();
              _self.renderTblHeader();
            },
            function(err) {
              _self.collatReport = [];
              _self.getTblTitle();
              _self.renderTblHeader();
            }
          );
        } else {
          _self.common.messageUtil({
            message: "请选择完整的核对日期",
            type: "warning"
          });
        }
      } else {
        _self.common.messageUtil({
          message: "请选择完整的 业务类型、核对类型、售卖渠道",
          type: "warning"
        });
        _self.collatReport = [];
      }
    },
    reset() {
      var businessType = this.searchObj.businessType;
      this.searchObj = {
        businessType: businessType,
        verifyType: "",
        sellChannelType: "",
        brandType: "",
        verifyStartTime: "",
        verifyEndTime: ""
      };
      this.collatReport = [];
      //this.getData();
    },
    taskgroup(type) {
      this.$confirm("是否确认运行?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let groupNames = [];
        if (type === 1) {
          groupNames = ["口碑_收退款核对", "口碑_券码订单核对"];
        } else {
          groupNames = ["口碑_订单账务"];
        }
        api.checkOrderBatch({ finalResultEnable: 1, groupNames: groupNames });
      }).catch();
      
    }
  }
};
</script>

<style scoped lang="scss">
.rightTableCR {
  margin: 20px 0 30px 0;
  padding: 0 30px 30px;
  background: #ffffff;
  .tableTit {
    font-size: 16px;
    padding: 30px 20px 40px;
    text-align: center;
  }
}
</style>









