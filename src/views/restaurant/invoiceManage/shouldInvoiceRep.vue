<template>
  <div class="invoice-content">
    <div class="tab-content">
      <div class="report-info-btns" :class="{'margin': flag == 'FR'}">
        <div class="report-check-num" v-if="flag == '!FR'">
          <span>电子发票DCDM编码</span>
          <el-input
            placeholder="请输入电子发票DCDM编码"
            clearable
            style="width:210px"
            v-model="checkDCDMcode"
            validate-event
            :disabled="reportInfo.confirmStatus == '0'"
          ></el-input>
          <el-button size="small" @click="saveDCDM" type="success">保存</el-button>
        </div>
        <el-button size="small" @click="downloadFile" type="success">
          <i class="fa fa-download c-button-icon--left"></i>下载
        </el-button>
        <el-button size="small" @click="sendEmailToThird" type="success">发送开票报告给第三方</el-button>
        <el-button
          size="small"
          @click="affirmMakeInvoice"
          type="success"
          :disabled="reportInfo.confirmStatus !== '0'"
        >确认开票数据</el-button>
        <el-button
          size="small"
          @click="downloadTem"
          type="success"
          v-if="flag == '!FR'"
          :disabled="reportInfo.confirmStatus === '0'"
        >导出开票数据</el-button>
        <el-button
          size="small"
          @click="sendModelEmail"
          type="success"
          v-if="flag == '!FR'"
          :disabled="reportInfo.confirmStatus === '0'"
        >发送开票数据</el-button>
        <el-button v-if="flag == 'FR'" size="small" @click="sendEmailToBillCo" type="success">发送开票报告给加盟商开票数据收集人</el-button>
        <el-button
          size="small"
          @click="deleteList"
          type="danger"
          :disabled="reportInfo.confirmStatus !== '0'"
        >删除</el-button>
      </div>
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="直营店开票报告" name="directOperationReport" v-if="flag == '!FR'">
          <shouldinvoice-com
            :reportInfo="reportInfo"
            :tableData="simpleTableData"
            :tableKey="simpleTableKey"
          >
            <template slot-scope="scope" slot="storeType">
              <span>直营</span>
            </template>
          </shouldinvoice-com>
        </el-tab-pane>
        <el-tab-pane label="加盟店开票报告" name="joinReport" v-else>
          <shouldinvoice-com
            :reportInfo="reportInfo"
            :tableData="simpleTableData"
            :tableKey="simpleTableKey"
          >
            <template slot-scope="scope" slot="storeType">
              <span>加盟</span>
            </template>
          </shouldinvoice-com>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalRecords"
        :page-sizes="pageSizeList"
      ></el-pagination>
    </div>
    <send-email-com
      :isShow="isShow"
      :sendEmailForm="sendEmailForm"
      :notNeedPassword="notNeedPassword"
      @close="close"
    ></send-email-com>
  </div>
</template>

<script>
import shouldinvoiceCom from "./shouldInvoiceCom/shouldInvoiceCom.vue";
import sendEmailCom from "./sendEmailCom.vue";
import apidr from "@/model/apidr";
import Main from "@/main";

export default {
  name: "shouldInvoiceRep",
  data() {
    return {
      currentId: "",
      // checkDCDMcode是否已经输入、输入正确，如果输入正确则可以确认开票
      checkDCDMFlag: false,
      checkDCDMcode: "",
      reportInfo: {},
      flag: "",
      activeTabName: "directOperationReport",
      simpleTableData: [],
      simpleTableKey: [
        { name: "序号", value: "id" },
        { name: "开票单位CODE", value: "billingUnitCode" },
        { name: "开票单位", value: "billingUnitName" },
        { name: "类型", value: "storeType", special: true },
        { name: "开票金额（单位：元）", value: "balanceAmount" }
      ],
      pageSizeList: [25, 50, 75, 100, 125],
      pageSize: 25,
      currentPage: 1,
      totalRecords: 0,
      isShow: false,
      sendEmailForm: {
        receiveUserMail: "",
        ccUserMail: "",
        financialManagerUser: "",
        activityManagerUser: "",
        emailTitle: "",
        emailContext: "",
        emailAttachmentDTOList: []
      },
      notNeedPassword: false,
      isConfirm: true,
      isDown: true
    };
  },
  watch: {
    checkDCDMcode(val) {
      if (val && val.length > 0) {
        this.checkDCDMFlag = true;
      } else {
        this.checkDCDMFlag = false;
      }
    }
  },
  components: {
    shouldinvoiceCom,
    sendEmailCom
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInvoiceDetail();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getInvoiceDetail();
    },
    // 输入DCDM事件请求后台接口，控制是否确认开票
    checkDCDMInputChange(value) {
      if (value) {
        this.checkDCDMFlag = true;
      } else {
        this.checkDCDMFlag = false;
      }
    },
    downloadFile() {
      this.downBalanceFile(this.reportInfo.filePath);
    },
    sendEmailToThird() {
      this.isShow = true;
      this.getInvoiceMailDetail();
    },
    sendEmailToBillCo() {
      this.isShow = true;
      this.getFranchiseeMailDetail();
    },
    sendModelEmail() {
      this.isShow = true;
      this.getInvoiceMailModel();
    },
    close() {
      this.isShow = false;
    },
    downloadTem() {
      this.downBalanceFile(this.reportInfo.reportFilePath, "1");
    },
    affirmMakeInvoice() {
      let _self = this;
      this.$confirm("确认开票后无法取消，是否确认?", "提醒", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _self.confirmInvoice();
        })
        .catch(() => {
          //
        });
    },
    deleteList() {
      let _self = this;
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _self.delInvoiceList();
        })
        .catch(() => {
          _self.common.infoMessage("已取消删除");
        });
    },
    getInvoiceInfo() {
      let _self = this;
      let pathParams = [
        {
          name: "id",
          value: this.currentId
        }
      ];
      apidr.getInvoiceInfo(this.common.joinSearchParam(pathParams), function(
        res
      ) {
        if (res.code === 200) {
          _self.reportInfo = res.data;
          _self.$nextTick(function() {
            _self.getInvoiceDetail();
          });
        } else if (res.code != 404) {
          _self.showTips(res.msg, "warning");
        }
      });
    },
    getInvoiceDetail() {
      let _self = this;
      let pathParams = [
        {
          name: "pageIndex",
          value: this.currentPage
        },
        {
          name: "pageSize",
          value: this.pageSize
        },
        {
          name: "uuidCode",
          value: this.reportInfo.uuidCode
        },
        {
          name: "storeType",
          value: this.reportInfo.storeType
        }
      ];
      apidr.getInvoiceDetail(this.common.joinSearchParam(pathParams), function(
        res
      ) {
        _self.simpleTableData = [];
        _self.totalRecords = 0;
        if (res.code === 200) {
          _self.simpleTableData = res.data.list;
          _self.totalRecords = res.data.totalRecords;
          _self.checkDCDMcode = res.data.list[0].dcdmCode;
        } else if (res.code != 404) {
          _self.showTips(res.msg, "warning");
        }
      });
    },
    //保存dcdm
    saveDCDM() {
      let _self = this;
      if (this.checkDCDMcode) {
        let param = this.common.formatPathParam({
          id: this.currentId,
          storeType: this.reportInfo.storeType,
          dcdmCode: this.checkDCDMcode
        });
        apidr.saveDCDMcode(param, function(res) {
          if (res.code === 200) {
            _self.common.successMessage("保存成功");
          } else {
            _self.common.errorMessage(res.msg);
          }
        });
      }
    },
    downBalanceFile(filePath, type) {
      let _self = this;
      this.common.checkFilePath(filePath).forEach(function(value, index) {
        apidr.downBalanceList(value, "application/vnd.ms-excel", function(res) {
          if (res.code) {
            _self.common.warningMessage(res.msg);
            if (type) {
              _self.isDown = true;
            }
          } else {
            if (type) {
              _self.isDown = false;
            }
            let link = document.createElement("a");
            link.href = res;
            link.id = "attachmentLink";
            link.download = value.fileName;
            link.target = "_blank";
            link.click();
          }
        });
      });
    },
    confirmInvoice() {
      let _self = this;
      let pathParams = [
        {
          name: "id",
          value: this.currentId
        },
        {
          name: "storeType",
          value: this.flag
        }
      ];
      apidr.confirmInvoice(this.common.joinSearchParam(pathParams), function(
        res
      ) {
        if (res.code === 200) {
          _self.isConfirm = false;
          _self.getInvoiceInfo();
          Main.$emit("updateList");
          _self.showTips("完成确认", "success");
        } else if (res.code != 404) {
          _self.showTips(res.msg, "warning");
          _self.isConfirm = true;
        }
      });
    },
    delInvoiceList() {
      let _self = this;
      let param = [
        {
          name: "id",
          value: this.currentId
        }
      ];
      apidr.delInvoiceList(this.common.joinSearchParam(param), function(res) {
        if (res.code === 200) {
          _self.showTips("删除成功", "success");
          _self.common.deleteTag(_self.$route, _self);
          Main.$emit("updateList");
        } else if (res.code != 404) {
          _self.showTips(res.msg, "warning");
        }
      });
    },
    getInvoiceMailDetail() {
      let _self = this;
      let pathParams = [
        {
          name: "id",
          value: this.currentId
        }
      ];
      apidr.getInvoiceMailDetail(
        this.common.joinSearchParam(pathParams),
        function(res) {
          if (res.code === 200) {
            _self.sendEmailForm = res.data;
            _self.notNeedPassword = !res.data.needPassword;
          } else if (res.code != 404) {
            _self.showTips(res.msg, "warning");
          }
        }
      );
    },
    getFranchiseeMailDetail() {
      let _self = this;
      let param = this.common.formatPathParam({
        id : this.currentId
      });
      apidr.getFranchiseeMailDetail(param, function(res) {
        if (res.code === 200) {
          _self.sendEmailForm = res.data;
          _self.notNeedPassword = !res.data.needPassword;
        } else if (res.code != 404) {
          _self.showTips(res.msg, "warning");
        }
      });
    },
    getInvoiceMailModel() {
      let _self = this;
      let pathParams = [
        {
          name: "id",
          value: this.currentId
        }
      ];
      apidr.getInvoiceMailModel(
        this.common.joinSearchParam(pathParams),
        function(res) {
          if (res.code === 200) {
            _self.sendEmailForm = res.data;
          } else if (res.code != 404) {
            _self.showTips(res.msg, "warning");
          }
        }
      );
    },
    showTips(text, type) {
      this.common.messageUtil({
        message: text,
        type: type
      });
    }
  },
  beforeMount() {
    this.flag = this.$route.query.storeType;
    this.currentId = this.$route.query.id;
    this.activeTabName =
      this.flag === "FR" ? "joinReport" : "directOperationReport";
    this.getInvoiceInfo();
  }
};
</script>

<style lang="scss" scoped>
.report-info-btns {
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 300;
}
.report-check-num {
  text-align: right;
  margin-bottom: 20px;
  span {
    height: 23px;
    line-height: 23px;
    font-size: 14px;
  }
}
.margin {
  margin-top: 50px;
}
.pagination {
  background-color: white;
}
</style>
