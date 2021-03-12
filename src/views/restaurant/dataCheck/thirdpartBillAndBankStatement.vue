<!--非现金业务手工核对-->
<template>
  <div class="content" id="manualCheckmainPage" >
    <!--  -->
    <div class="top-tab" >
      <el-tabs ref="checkedOrNotTabs" :before-leave="beforeTypeChange"  v-model="checkedOrNot" >
        <el-tab-pane label="非现金手工核对" name="unChecked"></el-tab-pane>
        <el-tab-pane label="非现金已核对查询" name="checked"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="check-data-content" >
      <!-- <el-button style="float:none"  size="small"  v-if="checkedOrNot == 'unChecked'" key="upToBOHData" type="success" @click="upToBOHData" class="c-button alibill-upload">以BOH数据为准</el-button> -->
      <el-button style="float:none"  size="small" type="success" @click="importBill" class="c-button alibill-upload"><i class="fa fa-upload c-button-icon--left"></i>支付宝流水上传</el-button>
      <el-row class="tbl-control" style="text-align:center" >
        <el-button  v-if="checkedOrNot == 'unChecked'" key="doCheck" size="small" type="success" :title="(!summurySelectDatas.length || !singleTblSelectDatas.length)? '请选择两边数据进行核对':''"
                    :disabled="!summurySelectDatas.length || !singleTblSelectDatas.length" @click="toManualDataCheck" >手工核对</el-button>
        <el-button  v-if="checkedOrNot == 'checked'" key="doUnCheck" size="small" type="success" :title="(!summurySelectDatas.length && !singleTblSelectDatas.length)? '请选择要取消核对的数据':''"
                    :disabled="!summurySelectDatas.length && !singleTblSelectDatas.length" @click="toManualCancelCheck" >取消核对</el-button>
        <el-button  v-if="(checkedOrNot == 'unChecked' && hasAccountingPerssion)" key="toSpfAccountSPF" size="small" type="success" :title="(summurySelectDatas.length + singleTblSelectDatas.length != 1)? '请选择一条要做SPF手工账务的数据':''"
                    :disabled="summurySelectDatas.length + singleTblSelectDatas.length != 1" @click="toManualAccounting('SPF手工账务')" >SPF手工账务</el-button>
        <el-button  v-if="(checkedOrNot == 'unChecked' && hasAccountingPerssion)" key="toSpfAccountSplit" size="small" type="success" :title="(summurySelectDatas.length + singleTblSelectDatas.length != 1)? '请选择一条要做SPF手工账务的数据':''"
                    :disabled="summurySelectDatas.length + singleTblSelectDatas.length != 1" @click="toManualAccounting('强拆SPF手工账务')" >强拆SPF手工账务</el-button>
        <el-button  v-if="(checkedOrNot == 'unChecked' && hasAccountingPerssion)" key="toUnSpfAccountNoSpf" size="small" type="success" :title="(summurySelectDatas.length + singleTblSelectDatas.length != 1)? '请选择一条要做非SPF手工账务的数据':''"
                    :disabled="summurySelectDatas.length + singleTblSelectDatas.length != 1" @click="toManualAccounting('非SPF手工账务')" >非SPF手工账务</el-button>
        <p v-if="checkedOrNot == 'unChecked'" class="check-sum" >{{pageUtil.tabObj[summuryDataTabs]}}数据合计&nbsp;{{summurySum}}&nbsp;&nbsp;&nbsp;{{pageUtil.tabObj[singleDataTabs]}}数据合计&nbsp;{{singleSum}}&nbsp;&nbsp;&nbsp;差异金额&nbsp;{{diffAmount}}</p>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="tab-content" >
            <el-tabs ref="summuryDataTabs"  v-model="summuryDataTabs" @tab-click="toogleSummuryData">
              <el-tab-pane label="账单数据" name="thirdBill"></el-tab-pane>
              <el-tab-pane label="支付宝流水" name="alipay_sum"></el-tab-pane>
              <el-tab-pane label="账单未体现AR" name="ar"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="tbl-content" >
            <manualCheckSingleTblLeft v-bind:leftTblConfig="summuryTblConfig"
                                      v-bind:pageName="pageName"
                                      v-bind:refreshLeftTbl="refreshSummury"
                                      v-bind:resetLeftTblFlag="resetSummury"
                                      v-bind:currentSummmeryIdsForLeft="currentSummeryIdsForSum"
                                      v-bind:currentSinIdsForLeft="currentSinIdsForSum"
                                      v-on:selectedLeftRow="summuryCheckedDataChange"
                                      v-on:toogleRefreshLeftTbl="toogleSummuryTblRefresh"
                                      v-on:resetLeftTblDown="resetLeftTblDown"
                                      v-on:adjustLeftTblData="adjustData"
                                      v-on:leftTblSelectToogleDown="leftSelectToogleDown"
                                      v-on:setSelectedAmount="setSelectedAmount"  ></manualCheckSingleTblLeft>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tab-content" >
            <el-tabs ref="singleDataTabs"  v-model="singleDataTabs" :before-leave="beforeSingleLeave">
              <el-tab-pane label="银行流水" name="bank"></el-tab-pane>
              <el-tab-pane label="支付宝流水" name="alipay_sin"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="tbl-content" >
            <manualCheckSingleTblRight  v-bind:rightTblConfig="singleTblConfig"
                                        v-bind:pageName="pageName"
                                        v-bind:refreshRightTbl="refreshSingle"
                                        v-bind:resetRightTblFlag="resetSingle"
                                        v-bind:currentSumIdsForRigh="currentSumIdsForSin"
                                        v-bind:currentSinIdsForRigh="currentSinIdsForSin"
                                        v-bind:setMaxAmount="setMaxAmount"
                                        v-bind:rightMaxAmount="rightMaxAmount"
                                        v-on:selectedRightRow="singleCheckedDataChange"
                                        v-on:toogleRefreshRightTbl="toogleSingleTblRefresh"
                                        v-on:resetRightTblDown="resetRightTblDown"
                                        v-on:adjustRightTblData="adjustData"
                                        v-on:setMaxAmountDown="setMaxAmount = false;rightMaxAmount=''" ></manualCheckSingleTblRight>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- Table -->
    <el-dialog title="手工调整" :visible.sync="adjustDialogVisible" :close-on-click-modal="false" @close="resetAdjustForm" custom-class="adjust-dialog" >
      <!-- <el-form v-if="showCashADayChoose" ref="cashaBizDayForm" :model="cashaBizDayForm" class="casha-bizday-form" >
        <el-form-item label="cash_a店天" prop="cashAbussinessDay" :rules="{ required : true, message : '请选择cash_a店天', trigger : 'change'}" >
          <el-select size="small" v-model="cashAbussinessDay" placeholder="cash_a店天" >
            <el-option  v-for="(cashAbusinessDay,index) in cashAbusinessDays" :key="index" :value="cashAbusinessDay.id" :label="cashAbusinessDay.bizDate | formatDate('yyyy-MM-dd') +' '+ cashAbusinessDay.storeCode" ></el-option>
          </el-select>
        </el-form-item>
      </el-form> -->
      <p class="adjust-item-amount">金额：{{adjustItem.amount}}</p>
      <el-form :inline="true" :model="adjustForm" ref="adjustForm" class="adjust-form"  >
        <el-row v-for="(adjustItem,index) in adjustForm.adjustDetails" v-bind:key="index" :gutter="2"  >
          <el-col :span="3" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.adjustmentAmount'" :label="index == 0? '金额':''"
                          :rules="[{ required : true, message : '请输入调整金额', trigger : 'blur'},
                                   { validator: floatNumPass, trigger: 'blur'}]" >
              <el-input v-model="adjustItem.adjustmentDto.adjustmentAmount" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3" class="result-code-content" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.resultCode'" :label="index == 0? '调整类型':''"
                          :rules="{ required : true, message : '请选择调整类型', trigger : 'change'}" >
              <el-select size="small" v-model="adjustItem.adjustmentDto.resultCode" placeholder="调整类型" @change="changeResultCode(index)" >
                <el-option  v-for="adjustType in adjustTypeOpts" :key="adjustType.adjustType" :title="adjustType.adjustDesc" 
                            :label="adjustType.adjustType+' '+adjustType.adjustDesc" :value="adjustType.adjustType"></el-option>
								<template   v-if="showBankOpt" >
                  <el-option  label="长假保证金" value="长假保证金" title="长假保证金" ></el-option>
                  <el-option  label="日常保证金" value="日常保证金" title="日常保证金" ></el-option>
                  <el-option  label="长假预付款" value="长假预付款" title="长假预付款" ></el-option>
                  <el-option  label="日常预付款" value="日常预付款" title="日常预付款" ></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.activityId'" :label="index == 0? '活动':''"
                          :rules="(adjustItem.adjustmentDto.resultCode === '长假保证金'||adjustItem.adjustmentDto.resultCode === '日常保证金' || 
                          adjustItem.adjustmentDto.resultCode === '长假预付款' || adjustItem.adjustmentDto.resultCode === '日常预付款') ?{ required : true, message : '请选择活动', trigger : 'change'}:{}" >
              <el-select  size="small" v-model="adjustItem.adjustmentDto.activityId" placeholder="活动" @change="changeAct(index)" filterable
                          :disabled="adjustItem.adjustmentDto.resultCode != '长假保证金' && adjustItem.adjustmentDto.resultCode != '日常保证金' && adjustItem.adjustmentDto.resultCode != '长假预付款'
                                     && adjustItem.adjustmentDto.resultCode != '日常预付款'" >
                <el-option v-for="(actItem,index) in adjustItem.actList" :key="actItem.id+'_'+index" :label="actItem.activityName" :value="actItem.id" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.activityId'" :label="index == 0? '客户':''"
                          :rules="(adjustItem.adjustmentDto.resultCode === '长假保证金'||adjustItem.adjustmentDto.resultCode === '日常保证金' || adjustItem.adjustmentDto.resultCode === '长假预付款' || adjustItem.adjustmentDto.resultCode === '日常预付款') ?{ required : true, message : '请选择客户', trigger : 'change'}:{}" >
              <el-select size="small" v-model="adjustItem.adjustmentDto.customerId" placeholder="客户" :disabled="adjustItem.adjustmentDto.resultCode != '长假保证金' && adjustItem.adjustmentDto.resultCode != '日常保证金' 
                                      && adjustItem.adjustmentDto.resultCode != '长假预付款' && adjustItem.adjustmentDto.resultCode != '日常预付款'" >
                <el-option v-for="(cust,index) in adjustItem.custList" :key="cust.id+'_'+index" :label="cust.customerName" :value="cust.id" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.remark'" :label="index == 0? '原因备注':''" >
              <el-input v-model.trim="adjustItem.adjustmentDto.remark" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" >
            <el-form-item :label="index == 0? '附件':''" class="attach-content"  >
              <el-button type="text" class="link-btn" @click="showAttachDialog(adjustItem.adjustmentDto,index)" >附件</el-button>
            </el-form-item>
          </el-col>
          <div :class="index == 0? 'row-button no-label':'row-button'" >
            <el-button size="small" v-show="index == adjustForm.adjustDetails.length - 1" @click="newAdjustItem()" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-plus"></i></el-button>
            <el-button size="small" v-show="adjustForm.adjustDetails.length > 1" @click="deleteAdjustItem(index)"  class="c-button-icon--danger--opacity c-button-icon-circle"><i class="fa fa-trash-alt"></i></el-button>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogVisible = false">取 消 </el-button>
        <el-button type="primary" @click="doAdjust">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 附件弹框 -->
    <el-dialog title="附件" :visible.sync="attachmentDialogVisible" width="30%" @close="loadFile = false"
               :close-on-click-modal="false" :custom-class="checkedOrNot === 'checked'? 'view-file-dialog' : 'upload-file-dialog'" >
      <el-form ref="actMainInfo" class="act-main-info" label-position="top" v-if="checkedOrNot == 'checked' && adjustForm.adjustConfig.dataType == 'bank' && bankAdjustObj.activityName" >
        <el-row >
          <el-col :span="4">
            <el-form-item label="调整类型" >
              <span>{{bankAdjustObj.adjustCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7" >
            <el-form-item label="活动名称" >
              <span>{{bankAdjustObj.activityName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="客户名称">
              <span>{{bankAdjustObj.customerName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div  v-loading="loadFile"
            element-loading-text = "上传中..."
            element-loading-spinner = "el-icon-loading"
            element-loading-background = "transparent">
        <el-upload
          :class="checkedOrNot === 'checked'? 'view-file' : 'upload-file'"
          :action="uploadUrl"
          :on-preview ="handlePreview"
          :on-success ="uploadSucceed"
          :on-error="uploadError"
          :on-remove  ="handleRemove"
          multiple :before-upload="beforeUpload"
          :file-list="fileObjTemp.files">
          <el-button size="small" type="primary" v-if="checkedOrNot === 'unChecked'">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </div>
    </el-dialog>
    <el-dialog title="支付宝流水上传" :visible.sync="uploadBillDialogVisible" :close-on-click-modal = 'false' class="uploadB2C" @close="cleanDialogForm" custom-class="upload-dialog"  >
      <div    v-loading="loadBillUpload"
              element-loading-text = "上传中..."
              element-loading-spinner = "el-icon-loading"
              element-loading-background = "transparent">
          <el-upload  :action="getBillUploadUrl()" ref="importCommodity"
                      :multiple="true"
                      :file-list="fileList"
                      :on-change="handleBillUploadFormChange"
                      :auto-upload="false"
                      :on-remove="removeFile"
                      :on-error="uploadBillError"
                      :on-success="uploadBillSuccess"
                      accept=".csv">
              <el-button size="small" class="c-button c-button--primary">上传文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传csv格式文件<span class="delete">(若数据库已存在该日数据，上传将进行数据覆盖)</span></div>
          </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="uploadBillDialogVisible = false;" class="c-button c-button--plain">取 消</el-button>
          <el-button size="small" type="primary" @click="importCommodity()" class="c-button c-button--primary" :disabled="uploadDisabled">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 以BOH数据为准Dialog -->
    <el-dialog title="选择活动数据" :visible.sync="upToBOHDataDialogVisible" :close-on-click-modal="false" @closed="upToBOHDataDialogClose">
      <el-form ref="form" :inline="true" :model="upToBOHDataSearchObj" label-width="80px">
        <el-form-item label="活动名称"> 
          <!-- <el-input size="small" v-model="upToBOHDataSearchObj.activityName" placeholder="请输入活动名称" @change="searchBohDialogGridData" ></el-input> -->
          <el-input size="small" v-model="upToBOHDataSearchObj.activityName" placeholder="请输入活动名称" ></el-input>
        </el-form-item>
      </el-form>
      <el-table ref="upToBOHDataTable" :data="uptoBohDataGridData" @selection-change="upToBOHDataChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="activityName" label="活动名称" ></el-table-column>
        <el-table-column property="bizDate" label="营业日期/交易日期" ></el-table-column>
        <el-table-column property="company" label="法人公司"></el-table-column>
        <el-table-column property="amount" label="BOH对应的餐厅应收"></el-table-column>
      </el-table>
      <div class="page-content pagination" >
        <el-pagination  background @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizeOpt"
                        :page-size="pageSize"
                        :total="totalRecords"
                        layout="total,sizes,prev,pager,next,jumper" ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="upToBOHDataDialogVisible = false">取 消</el-button>
        <el-button type="success" size="small" @click="doUptoBOHData">确认以BOH数据为准</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../../model/api'
  import apiStore from '../../../model/apidr'
  import ip from '../../../model/tempIp'
  import {formatDate} from '../../../utils/dateFormat.js'
  //核对list
  import manualCheckSingleTblLeft from './dataCheckComponent/manualCheckSingleTblLeft'
  import manualCheckSingleTblRight from './dataCheckComponent/manualCheckSingleTblRight'
  //页面配置
  import pageUtil from '../../../utils/restaurant/dataCheck/nonCashManualCheck'

	export default {
    name:'ThirdpartBillAndBankStatement',
    filters :{
      formatDate (dateTime,fmt){
        let tempDateTime = new Date(dateTime);
        return formatDate(tempDateTime,fmt);
      }
    },
    components:{
      manualCheckSingleTblLeft,
      manualCheckSingleTblRight
    },
    created(){},
    beforeMount(){
      this.getActList();
      this.getAccountingPermission();
      //this.getAllAdjustType();
      //this.getAdjustType();
    },
    mounted(){},
		data() {
			return {
        pageUtil    : pageUtil,
        showBankOpt : false,
        pageName    : 'manual-nocasha-check',
        tempCheckedOrNot : 'unChecked',
        checkedOrNot     : 'unChecked',
        tempSummuryDataTabs  : 'thirdBill',
        summuryDataTabs      : 'thirdBill',
        tempSingleDataTabs   : 'bank',
        singleDataTabs       : 'bank',
        summurySelectDatas   : [],
        singleTblSelectDatas : [],
        currentSummeryIdsForSum : '',
        currentSinIdsForSum     : '',
        currentSumIdsForSin     : '',
        currentSinIdsForSin     : '',
        summurySum : '0.00',
        singleSum  : '0.00',
        diffAmount : '0.00',
        hasAccountingPerssion : false,
        bankOpts : ['长假保证金','日常保证金','长假预付款','日常预付款'],
        checkTypeMap : {
          bank       : 1,
          alipay_sin : 2,
          thirdBill  : 1,
          alipay_sum : 2,
          ar         : 3,
        },
        refreshSummury : true,
        resetSummury   : false,
        refreshSingle  : true,
        resetSingle    : false,
        summuryTblConfig : {
          dataType   : 'thirdBill',
          requiredSearchObj : {
            checkStatus : 0,
            checkType   : 1
          }
        },
        singleTblConfig : {
          dataType   : 'bank',
          requiredSearchObj : {
            checkStatus  : 0,
            checkWithBill : 'true',
            checkType   : 1
          }
        },
        //hasCheckWithCash   : true,
        //showCashADayChoose : false,
        adjustTypeOpts     : [],
        actList            : [],
        //单条调整对象
        adjustObj : {},
        adjustItem : {},
        adjustDialogVisible : false,
        adjustForm : {
          adjustConfig  : {},
          adjustDetails : [{
            adjustmentDto : {
              activityId  : '',
              customerId  : '',
              companyJde : '',
              files : []
            },
            custList : [],
            actList  : []
          }]
        },
        //cashaBizDayForm   : {},
        //cashAbussinessDay : '',
        //cashAbusinessDays : [],
        fileCount:0,
        attachmentDialogVisible  : false,
        loadFile:false,
        uploadUrl   : '',
        //暂存文件对象
        fileObjTemp : {
          id : '',
          files : []
        },
        //
        fileObjForSubmit: {},
        //支付宝流水上传
        uploadObj:{},
        uploadBillDialogVisible: false,
        loadBillUpload:false,
        importUrl:'',
        fileList:[],
        billCount:0,
        uploadDisabled:true,
        isTimeOut:false,
        upToBOHDataDialogVisible : false,
        upToBOHDataSearchObj : {
          activityName : null
        },
        uptoBohDataGridData   : [{
          activityName : '美团',
          bizDate : '2018-02-02',
          amount  : '1,000.00'
        },{
          activityName : '饿了么',
          bizDate : '2018-02-02',
          amount  : '2,000.00'
        },{
          activityName : '百度网支',
          bizDate : '2018-03-02',
          amount  : '3,000.00'
        }],
        uptoBohDataSelectData : [],
        currentPage  : 1,
        pageSizeOpt  : [5,10,15],
        pageSize     : 5,
        totalRecords : 3,
        floatNumPass : (rule, value, callback)=> {
          const reg = /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/;
          if (!value) {
              return callback(new Error('请输入金额'))
          } else if (!reg.test(value)) {
              return callback(new Error('请输入正确的金额,最多2位小数'))
          } else {
              callback()
          }
        },
        bankAdjustObj : {
          activityName : '',
          adjustCode   : '',
          customerName : ''
        },
        setMaxAmount   : false,
        rightMaxAmount : ''
			}
		},
    methods: {
      //获取手工分录权限
      getAccountingPermission(){
        let _self = this;
        apiStore.getOtherPermission(function(res){
          if(res.code === 200){
            if(res.data.includes(1)){
              _self.hasAccountingPerssion = true;
            }
          }
        })
      },
      //获取调整类型下拉框数据
      getAdjustType(){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : ' '
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          if(res.code === 200){
            _self.adjustTypeOpts = res.data;
          }else{
            _self.adjustTypeOpts = [];
          }
        })
      },
      //获取所有进行中的活动
      getActList(){
        let _self = this;
        let param = this.common.formatPathParam({
          pageIndex : 1,
          pageSize  : 999999,
          status    : 3
        });
        api.getActiveList(param,function(res){
          if(res.code === 200){
            _self.actList = res.data.list;
          }else{
            _self.actList = [];
          }
        })
      },
      importBill(){
        let _self = this;
        this.uploadBillDialogVisible = true;
        this.uploadDisabled = true;
        this.loadBillUpload = false;
        this.isTimeOut = false;
        apiStore.aliBillUploadStart('',function(result){
            if(result.code == 200){
                _self.uploadObj = result.data;
            }else{
                _self.common.messageUtil({
                  message : result.data.msg,
                  type    : 'warning'
                })
            }
        });
      },
      importCommodity(){
        this.loadBillUpload = true;
        this.$refs.importCommodity.submit();
        this.uploadDisabled = true;
      },
      cleanDialogForm(){
        this.$refs.importCommodity.clearFiles();
      },
      getBillUploadUrl(){
        var param = [
          {
              name:'uuid',
              value:this.uploadObj.uuid
          },
          {
              name:'uploadTime',
              value:this.uploadObj.uploadTime
          }
        ];
        return this.importUrl = ip.store + '/alipay-bill/upload-one' + this.common.joinSearchParam(param);
      },
      handleBillUploadFormChange(file,fileList){
        this.uploadDisabled = fileList.length > 0 ? false : true;
        if(file.response || this.isTimeOut){
            this.uploadDisabled = true;
        }
      },
      removeFile(file,fileList){
        if(fileList.length == 0){
          this.loadBillUpload = false;
          this.uploadDisabled = true
        }
      },
      uploadBillError(err, file, fileList){
        this.loadBillUpload = false;
        this.isTimeOut = true;
        this.common.messageUtil({
          message : '请求超时',
          type    : 'warning'
        })
      },
      uploadBillSuccess(response, file, fileList){
        let _self = this;
        const flieNum = fileList.length;
        this.billCount++ ;
        if(response.code === 200){
          if(this.billCount == flieNum){
            this.billCount = 0;
            this.loadBillUpload = false;
            let param = {
              fileCount : flieNum,
              uuid : this.uploadObj.uuid,
              uploadTime : this.uploadObj.uploadTime
            };
            apiStore.aliBillUploadFinish(param,function(response){
              if(response.code == 200){
                _self.$refs.importCommodity.clearFiles();
                _self.uploadBillDialogVisible = false;
                _self.common.messageUtil({
                  message : response.data,
                  type    : 'success'
                });
                _self.refreshBothSide(true);
              }else{
                _self.common.messageUtil({
                  message : response.msg,
                  type    : 'warning'
                })
                apiStore.aliBillUploadStart('',function(result){
                    if(result.code == 200){
                      _self.uploadObj = result.data;
                      _self.$refs.importCommodity.clearFiles();
                      //_self.uploadDisabled = false;
                    }else{
                      _self.common.messageUtil({
                        message : result.data.msg,
                        type    : 'warning'
                      })
                    }
                });
              }
            },function(){
              _self.common.messageUtil({
                message: '请求超时',
                type: 'warning',
                onClose: function(){
                  _self.$refs.importCommodity.clearFiles();
                }
              });
            })
          }
        }else{
          if(!response.msg){
            _self.common.messageUtil({
              message : '文件内容格式不正确',
              type    : 'warning'
            })
          }else{
            _self.common.messageUtil({
              message : response.msg,
              type    : 'warning'
            })
          }
          if(this.billCount == flieNum){
            this.billCount = 0;
            this.loadBillUpload = false;
            apiStore.aliBillUploadStart('',function(result){
                if(result.code == 200){
                    _self.uploadObj = result.data;
                    _self.$refs.importCommodity.clearFiles();
                    _self.uploadDisabled = false;
                }else{
                  _self.common.messageUtil({
                    message : result.data.msg,
                    type    : 'warning'
                  });
                }
            });
          }
        }
      },
      beforeTypeChange(activeName, oldActiveName){
        return  this.$confirm('切换核对状态选中数据将被刷新?', '提示', {
                  confirmButtonText: '确定切换',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.summurySum = '0.00';
                  this.singleSum  = '0.00';
                  this.diffAmount = '0.00';
                  this.tempSummuryDataTabs = 'thirdBill';
                  this.toogleCheckStatus({name : activeName});
                }).catch(() => {
                  //this.tempCheckedOrNot = oldActiveName;
                  throw new Error("取消成功！");
                });
      },
      beforeUpload(file) {
        let _self = this;
        this.loadFile = true;
        let dataType = this.adjustForm.adjustConfig.dataType;
        let source = pageUtil.uploadSource[dataType];
        return new Promise((resolve, reject) => {
          this.$nextTick(() => {
            _self.uploadUrl = ip.store + '/file-upload/upload?source=' + source        
            resolve()
          })
        })
      },
      handlePreview(file) {
        console.log(file);
        let link = document.createElement('a');
        if(file.response && file.response.code == 200){
          link.href = file.response.data.url;
          link.download = file.response.data.name;
        }else if(file.url){
          link.href = file.url;
          link.download = file.name;
        }
        link.target = '_blank';link.click();
      },
      //删除file
      handleRemove(file, fileList) {
        let _self = this;
        this.updateFileObjForSubmit(fileList);
      },
      uploadError(err, file, fileList){
        this.loadFile = false;
        this.common.messageUtil({
          message: '上传有误',
          type: 'warning'
        });
      },
      //上传成功
      uploadSucceed(response, file, fileList) {
        let _self = this;
        let index = this.fileObjTemp.index;
        let flieNum = fileList.length;
        this.adjustForm.adjustDetails[index].adjustmentDto.files.push(response.data);
        let succeedFileLength = this.adjustForm.adjustDetails[index].adjustmentDto.files.length;
        if(succeedFileLength == flieNum){
          this.loadFile = false;
        }
      },
      //更新fileObjForSubmit
      updateFileObjForSubmit (fileList){
        let _self = this;
        let index = this.fileObjTemp.index;
        this.adjustForm.adjustDetails[index].adjustmentDto.files = [];
        this.adjustForm.adjustDetails[index].adjustmentDto.files = fileList.concat();
      },
      //附件弹框
      showAttachDialog(rowObj,index) {
        let _self = this;
        this.fileObjTemp = Object.assign({},{
          id    : rowObj.id,
          index : index
        });
        this.fileObjTemp.files = [];
        this.fileObjTemp.files = rowObj.files.concat();
        this.attachmentDialogVisible = true;
      },
      //切换是否核对tab
      toogleCheckStatus(tab, event){
        let _self = this;
        //判断是否为当前tab,否--刷新列表
        if(tab.name != this.tempCheckedOrNot){
          if(tab.name == 'checked'){
            this.summuryTblConfig.requiredSearchObj={
              checkStatus : 1,
              checkType : 1,
            };
            this.singleTblConfig.requiredSearchObj.checkStatus = 1;
          }else if(tab.name == 'unChecked'){
            this.summuryTblConfig.requiredSearchObj={
              checkStatus : 0,
              checkType : 1,
            };
            this.singleTblConfig.requiredSearchObj.checkStatus = 0;
          }
          this.summuryTblConfig.dataType = 'thirdBill';
          this.summuryDataTabs  = 'thirdBill';
          this.singleDataTabs   = 'bank';
          this.refreshBothSide(true);
          this.tempCheckedOrNot = tab.name;
        }
      },
      //切换汇总数据tab
      toogleSummuryData(tab, event){
        if(tab.name != this.tempSummuryDataTabs){
          this.singleDataTabs = 'bank';
          this.summuryTblConfig.dataType = tab.name.split('_')[0];
          this.singleTblConfig.dataType = 'bank';
          this.singleTblConfig.requiredSearchObj.checkType = this.checkTypeMap[tab.name];
          if(tab.name == 'alipay_sum'){
            this.summuryTblConfig.requiredSearchObj.checkType = 2;
            this.singleTblConfig.requiredSearchObj.checkWithBill = 'false';
          }else{
            this.summuryTblConfig.requiredSearchObj.checkType = 1;
            this.singleTblConfig.requiredSearchObj.checkWithBill = 'true';
          }
          this.refreshBothSide(true);
          this.tempSummuryDataTabs = tab.name;
        }
        //console.log(tab.name);
      },
      beforeSingleLeave(activeName, oldActiveName){
        let tab = {name : activeName}
        if(this.summuryDataTabs == 'alipay_sum'){
          if(activeName == 'bank'){
            this.toogleSingleData(tab);
            return true;
          }else{
            this.common.messageUtil({
              message: '核对操作有误',
              type: 'warning'
            });
            this.tempSingleDataTabs = oldActiveName;
            return false;
          }
        }else{
          this.toogleSingleData(tab);
          return true;
        }
      },
      //切换非汇总数据tab
      toogleSingleData(tab, event){
        let _self = this;
        if(tab.name != this.tempSingleDataTabs){
          if(this.summuryDataTabs == 'thirdBill' || this.summuryDataTabs == 'ar'){
            this.summuryTblConfig.requiredSearchObj.checkType = this.checkTypeMap[tab.name];
            this.singleTblConfig.dataType = tab.name.split('_')[0];
            this.singleTblConfig.requiredSearchObj.checkType = this.checkTypeMap[this.summuryDataTabs];
            if(tab.name == 'alipay_sin'){
              this.singleTblConfig.requiredSearchObj.checkType = this.checkTypeMap[this.summuryDataTabs];
            }
            this.refreshBothSide(true);
          }
          this.tempSingleDataTabs = tab.name;
        }
        //console.log(tab.name);
      },
      //汇总表（左侧）选中数据变动
      summuryCheckedDataChange(selectedDatas) {
        let _self = this;
        this.summurySelectDatas =  Object.assign([],selectedDatas);
        if(this.checkedOrNot === 'unChecked'){
          let sumProp = this.pageUtil.tblColumns[this.summuryDataTabs.split('_')[0]].sumProp;
          var tempSum = 0;
          selectedDatas.forEach(function(item,index){
            let amount = item[sumProp] ? Number(item[sumProp].replace(/,/g,'')) : 0;
            tempSum += amount;
          })
          this.rightMaxAmount = tempSum.toFixed(2);
          this.summurySum = this.common.formatterAmount(tempSum.toFixed(2));
          let diffAmount = Number(tempSum) - Number(this.singleSum.replace(/,/g,''));//Math.abs();
          if(diffAmount > 0 ){
            this.diffAmount = '-' + this.common.formatterAmount(diffAmount.toFixed(2));
          }else{
            this.diffAmount = this.common.formatterAmount(Math.abs(diffAmount).toFixed(2));
          }
          
        }else if(this.checkedOrNot === 'checked'){
          let currentCheckWith = this.singleDataTabs.split('_')[0];
          let currentSelectTab = this.summuryDataTabs.split('_')[0];
          let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith].self;
          let currentCheckWithIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith][currentSelectTab];
          var currentSelectedIds = [];
          var checkWidthIds = [];
          //获取当前选中[ids];
          selectedDatas.forEach(function(item,index){
            currentSelectedIds.push({
              name  : currentCheckWithIdsKey,
              value : item.id
            });
          });
          this.currentSumIdsForSin = currentSelectedIds.length? this.common.joinSearchParam(currentSelectedIds).replace('?','&') : '';
          this.singleTblSelectDatas.forEach(function(item,index){
            checkWidthIds.push({
              name  : currentSelectedIdsKey,
              value : item.id
            });
          });
          this.currentSinIdsForSin = checkWidthIds.length? this.common.joinSearchParam(checkWidthIds).replace('?','&') : '';
          // if(this.singleDataTabs == 'bank'){
          //   this.singleTblConfig.requiredSearchObj.checkWithBoh = this.summuryDataTabs == 'casha'? 'true' : 'false';
          // }
          this.resetSingle    = true;
          this.refreshSingle  = true;
          // console.log('currentSumIds---',this.currentSumIds);
          // console.log('currentSinIds---',this.currentSinIds);
          // console.log(this.singleTblConfig.requiredSearchObj);

        }
      },
      //非汇总表（右侧）选中数据变动
      singleCheckedDataChange(selectedDatas) {
        let _self = this;
        this.singleTblSelectDatas = Object.assign([],selectedDatas);
        if(this.checkedOrNot === 'unChecked'){
          let sumProp = this.pageUtil.tblColumns[this.singleDataTabs.split('_')[0]].sumProp;
          var tempSum = 0;
          selectedDatas.forEach(function(item,index){
            let amount = item[sumProp]? Number(item[sumProp].replace(/,/g,'')) : 0;
            tempSum += amount;
          })
          this.singleSum = this.common.formatterAmount(tempSum.toFixed(2));
          let diffAmount = Number(this.summurySum.replace(/,/g,'')) - Number(tempSum);//Math.abs();
          if(diffAmount > 0){
            this.diffAmount = '-' + this.common.formatterAmount(diffAmount.toFixed(2));
          }else{
            this.diffAmount = this.common.formatterAmount(Math.abs(diffAmount).toFixed(2));
          }
        }else if(this.checkedOrNot === 'checked'){
          let currentCheckWith = this.summuryDataTabs.split('_')[0];
          let currentSelectTab = this.singleDataTabs.split('_')[0];
          let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith].self;
          let currentCheckWithIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith][currentSelectTab];
          var currentSelectedIds = [];
          var checkWidthIds = [];
          //获取当前选中[ids];
          selectedDatas.forEach(function(item,index){
            currentSelectedIds.push({
              name  : currentCheckWithIdsKey,
              value : item.id
            });
          });
          this.currentSinIdsForSum = currentSelectedIds.length? this.common.joinSearchParam(currentSelectedIds).replace('?','&') : '';
          this.summurySelectDatas.forEach(function(item,index){
            checkWidthIds.push({
              name  : currentSelectedIdsKey,
              value : item.id
            });
          });
          this.currentSummeryIdsForSum = checkWidthIds.length? this.common.joinSearchParam(checkWidthIds).replace('?','&') : '';
          this.resetSummury   = true;
          this.refreshSummury = true;
        }
      },
      //切换汇总表刷新
      toogleSummuryTblRefresh(refreshFlag){
        let currentCheckWith = this.summuryDataTabs.split('_')[0]; 
        let currentSelectedIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith].self;
        var currentSelectedIds = [];
        var checkWidthIds = [];
        this.currentSinIdsForSum = currentSelectedIds.length? this.common.joinSearchParam(currentSelectedIds).replace('?','&') : '';
        this.summurySelectDatas.forEach(function(item,index){
          checkWidthIds.push({
            name  : currentSelectedIdsKey,
            value : item.id
          });
        });
        this.currentSummeryIdsForSum = checkWidthIds.length? this.common.joinSearchParam(checkWidthIds).replace('?','&') : '';
        this.refreshSummury = refreshFlag;
      },
      //切换单表刷新
      toogleSingleTblRefresh(refreshFlag){
        let currentCheckWith = this.singleDataTabs.split('_')[0]; 
        let currentSelectTab = this.summuryDataTabs.split('_')[0];
        let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith].self;
        let currentCheckWithIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith][currentSelectTab];
        var currentSelectedIds = [];
        var checkWidthIds = [];
        //获取当前选中[ids];
        this.summurySelectDatas.forEach(function(item,index){
          currentSelectedIds.push({
            name  : currentCheckWithIdsKey,
            value : item.id
          });
        });
        this.currentSumIdsForSin = currentSelectedIds.length? this.common.joinSearchParam(currentSelectedIds).replace('?','&') : '';
        this.singleTblSelectDatas.forEach(function(item,index){
          checkWidthIds.push({
            name  : currentSelectedIdsKey,
            value : item.id
          });
        });
        this.currentSinIdsForSin = checkWidthIds.length? this.common.joinSearchParam(checkWidthIds).replace('?','&') : '';
        // if(this.singleDataTabs == 'bank'){
        //   this.singleTblConfig.requiredSearchObj.checkWithBoh = this.summuryDataTabs == 'casha'? 'true' : 'false';
        // }
        this.refreshSingle = refreshFlag;
      },
      leftSelectToogleDown(selectedDatas){
        this.refreshSingleTbl(selectedDatas,false,true)
      },
      refreshSingleTbl(selectedDatas,isReset,isRefresh){
        let currentCheckWith = this.summuryDataTabs.split('_')[0];
        let currentSelectTab = this.singleDataTabs.split('_')[0];
        //let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith].self;
        let currentCheckWithIdsKey = pageUtil.refreshCheckedDataIdsKey[currentSelectTab][currentCheckWith];
        var currentSelectedIds = [];
        var checkWidthIds = [];
        //获取当前选中[ids];
        // this.summurySelectDatas.forEach(function(item,index){
        //   currentSelectedIds.push({
        //     name  : currentCheckWithIdsKey,
        //     value : item.id
        //   });
        // });
        // this.currentSinIdsForSum = currentSelectedIds.length? this.common.joinSearchParam(currentSelectedIds).replace('?','&') : '';
        selectedDatas.forEach(function(item,index){
          checkWidthIds.push({
            name  : currentCheckWithIdsKey,
            value : item.id
          });
        });
        this.currentSumIdsForSin = checkWidthIds.length? this.common.joinSearchParam(checkWidthIds).replace('?','&') : '';
        this.resetSingle    = isReset;
        this.refreshSingle  = isRefresh;
      },
      setSelectedAmount(selectedData){
        let amountMaxKey = this.pageUtil.tblColumns[this.singleDataTabs.split('_')[0]].amountMaxKey;
        if(selectedData){
          this.setMaxAmount = true;
          //this.rightMaxAmount = selectedData.amount;
        }
      },
      //重置汇总表
      resetLeftTblDown(resetFlag){
        this.resetSummury = resetFlag;
      },
      //重置单表
      resetRightTblDown(resetFlag){
        this.resetSingle = resetFlag;
      },
      //刷新并重置
      refreshBothSide(resetFlag){
        this.summurySum = '0.00';
        this.singleSum  = '0.00';
        this.diffAmount = '0.00';
        if(resetFlag){
          this.resetSummury   = true;
          this.resetSingle    = true;
        }
        this.summurySelectDatas = [];
        this.singleTblSelectDatas = [];
        this.currentSummeryIdsForSum = '',
        this.currentSinIdsForSum = '',
        this.currentSumIdsForSin = '',
        this.currentSinIdsForSin = '',
        this.refreshSummury = true;
        this.refreshSingle  = true;
      },
      // getSelectableBOHdata(param){
      //   let _self = this;
      //   apiStore.getCheckedBOHdata(param,function(res){
      //     if(res.code === 200){
      //       _self.cashAbusinessDays = res.data;
      //     }else{
      //       _self.cashAbusinessDays = [];
      //     }
      //   })
      // },
      resetAdjustForm(){
        this.adjustForm = {
          adjustConfig  : {},
          adjustDetails : [{
            adjustmentDto : {
              activityId : '',
              customerId : '',
              files : []
            },
            custList : [],
            actList  : []
          }]
        }
        //this.hasCheckWithCash = true;
        this.$refs.adjustForm.resetFields();
      },
      //切换调整类型
      changeResultCode(index){
        let _self = this;
        let resultCode = this.adjustForm.adjustDetails[index].adjustmentDto.resultCode;
        this.adjustForm.adjustDetails[index].adjustmentDto.activityId = '';
        this.adjustForm.adjustDetails[index].adjustmentDto.customerId = '';
        this.adjustForm.adjustDetails[index].adjustmentDto.custList = [];
        this.adjustForm.adjustDetails[index].adjustmentDto.actList  = [];
        this.$refs.adjustForm.clearValidate('adjustDetails.'+index+'.adjustmentDto.activityId');
        this.$refs.adjustForm.clearValidate('adjustDetails.'+index+'.adjustmentDto.customerId');
        if(this.bankOpts.includes(resultCode)){
          this.getActivities(index);
        }
      },
      getActivities(index){
        let _self = this;
        let resultCode = this.adjustForm.adjustDetails[index].adjustmentDto.resultCode;
        let activityType;
        switch (resultCode) {
          case '长假保证金':
            activityType = 0;
            break;
          case '日常保证金':
            activityType = 1;
            break;
          case '长假预付款':
            activityType = 2;
            break;
          case '日常预付款':
            activityType = 3;
            break;
          default:
            break;
        }
        let param = this.common.formatPathParam({
          activityType : activityType
        });
        api.getActivityCheckList(param,function(res){
          if(res.code == 200){
            _self.adjustForm.adjustDetails[index].actList = res.data.concat();
          }
        })
      },
      //切换活动
      changeAct(index){
        let _self = this;
        let activityId   = this.adjustForm.adjustDetails[index].adjustmentDto.activityId;
        let param = this.common.formatPathParam({
          activityId : activityId
        });
        api.getCustomersByActId(param,function(res){
          _self.adjustForm.adjustDetails[index].custList = [];
          _self.adjustForm.adjustDetails[index].adjustmentDto.customerId = '';
          if(res.code == 200){
            _self.adjustForm.adjustDetails[index].custList = res.data.concat();
          }else{
            _self.$refs.adjustForm.clearValidate('adjustDetails.'+index+'.adjustmentDto.customerId');
          }

        })
      },
      //单条调整
      adjustData({row, event, column, tblConfig, checkType}){
        let _self = this;
        this.adjustItem = Object.assign({},row);
        this.adjustForm = {
          adjustConfig  : tblConfig,
          adjustDetails : [{
            adjustmentDto : {
              activityId : '',
              customerId : '',
              companyJde : row.leCode,
              files : []
            },
            custList : [],
            actList  : []
          }]
        };
        if(this.checkedOrNot === 'unChecked' && tblConfig.dataType != 'ar'){
          this.getAdjustType();
          if(tblConfig.dataType == 'bank'){
            this.showBankOpt = true;
          }else{
            this.showBankOpt = false;
          }
          this.adjustDialogVisible = true;
        }else if(this.checkedOrNot === 'checked'){
          if(event.target.className != 'el-checkbox__inner' && event.target.className != 'el-checkbox__original'){
            this.getCurrentAttachments(row.id,tblConfig.dataType);
          } 
        }
      },
      getCurrentAttachments(foreignId,foreignType){
        let _self = this;
        let param = this.common.formatPathParam({
          id : foreignId,
          source    : foreignType == 'casha' ? 'cashadetail' : foreignType
        });
        apiStore.selectCurrentAttachments(param,function(res){
          if(res.code === 200){
            _self.fileObjTemp.files = [];
            if(res.data.attachmentDtos){
              _self.fileObjTemp.files = res.data.attachmentDtos.concat();
            }
            _self.bankAdjustObj.adjustCode = res.data.adjustCode;
            _self.bankAdjustObj.customerName = res.data.customerName;
            _self.bankAdjustObj.activityName = res.data.activityName;
            _self.attachmentDialogVisible = true;
          }else if(res.code === 404){
            _self.common.messageUtil({
              message: '暂无附件',
              type: 'warning'
            });
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      },
      //添加调整
      newAdjustItem(){
        let _self = this;
        this.adjustForm.adjustDetails.push({
          adjustmentDto : {
            activityId : '',
            customerId : '',
            companyJde : _self.adjustItem.leCode,
            files : []
          },
          custList : [],
          actList  : []
        })
      },
      //删除
      deleteAdjustItem(dx){
        let tempDetailList = this.common.removeIndex(this.adjustForm.adjustDetails,dx);
        this.adjustForm.adjustDetails = tempDetailList;
      },
      //单条调整 TDO
      doAdjust(){
        let _self = this;
        // if(this.$refs.cashaBizDayForm){
        //   this.$refs.cashaBizDayForm.validate((cashaBizDayValid) =>{
        //     if(cashaBizDayValid){
        //       _self.$refs.adjustForm.validate((valid) => {
        //         if(valid){
        //           _self.adjustSubmit();
        //         }
        //       })
        //     }
        //   });
        // }else{
          this.$refs.adjustForm.validate((valid) => {
            if(valid){
              _self.adjustSubmit();
            }
          })
        //}
      },
      adjustSubmit(){
        let _self = this;
        let hasAllAttached = true;
        let dataType = this.adjustForm.adjustConfig.dataType;
        let tblPosition = this.adjustForm.adjustConfig.tblPosition;
        let requestPath =  this.pageUtil.singleAdjustRequestPath[dataType];
        let param = {};
        let tempAdjustList = [];
        _self.adjustForm.adjustDetails.forEach(function(item,index){
          if(!item.adjustmentDto.files.length){
            hasAllAttached = false;
          }
          let tempAdjustObj = Object.assign({},item.adjustmentDto);
          //tempAdjustObj.cashaDetailId = _self.cashAbussinessDay;
          tempAdjustList.push(tempAdjustObj);
        });
        if(!hasAllAttached){
          this.common.warningMessage('请上传附件！');
          return false;
        }
        param.id = _self.adjustItem.id;
        if(dataType == 'bank'){
          param.bankAdjustmentDtlDtos = tempAdjustList;
        }else{
          param.checkResultDtos = tempAdjustList;
        }
        console.log(param);
        apiStore.doNonCashSingleAdjust(requestPath,param,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message: res.data,
              type: 'success'
            });
            if(tblPosition == 'left'){
              _self.refreshSummury = true;
            }else if(tblPosition == 'right'){
              _self.refreshSingle = true;
            }
            _self.adjustDialogVisible = false;
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      },
      //手工核对
      toManualDataCheck(){
        let _self = this;
        this.$confirm('确定手工核对？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let checkKey   = this.summuryDataTabs + this.singleDataTabs;
          let summuryKey = this.pageUtil.checkSummeryDataKey[checkKey];
          let singleKey  = this.pageUtil.checkSingleDataKey[checkKey];
          let param = {
            manualCheckType : this.pageUtil.manualCheckType[checkKey]
          };
          param[summuryKey] = [];
          param[singleKey]  = [];
          this.summurySelectDatas.forEach(function(item,index){
            param[summuryKey].push(item.id);
          });
          this.singleTblSelectDatas.forEach(function(item,index){
            param[singleKey].push(item.id);
          });
          this.doNocashManualPreCheck(param);
        }).catch(() => {});
      },
      //预核对
      doNocashManualPreCheck(param){
        let _self = this;
        apiStore.doNocashManualPreCheck(param,function(res){
          if(res.code === 200){
            if(res.data.result == 'checkedInTolerance'){
              _self.$prompt('请填写拆分理由','提示',{
                distinguishCancelAndClose: true,
                inputPlaceholder: '拆分理由',
                confirmButtonText: '进盈亏',
                cancelButtonText: '继续拆分',
                callback: (action, instance) => {
                  if(action == 'confirm'){
                    param.dealType = 1;
                    param.splitReason = instance.$refs.input.value;
                    _self.doNocashManualCheck(param);
                  }else if(action == 'cancel'){
                    param.dealType = 2;
                    param.splitReason = instance.$refs.input.value;
                    _self.doNocashManualCheck(param);
                  }
                }
              })
            }else if(res.data.result == 'checkedOutTolerance'){
              _self.$prompt('请填写拆分理由','提示',{
                distinguishCancelAndClose: true,
                inputPlaceholder: '拆分理由',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(({ value }) => {
                param.splitReason = value;
                _self.doNocashManualCheck(param);
              }).catch(action => {
                // if(action === 'cancel'){
                //   param.dealType = 2;
                //   _self.doCashManualCheck(param);
                // }
              });
            }else{
              _self.common.messageUtil({
                message: res.data.result,
                type: 'success'
              });
              _self.refreshSummury = true;
              _self.refreshSingle  = true;
            }
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      },
      //核对
      doNocashManualCheck(param){
        let _self = this;
        apiStore.doNocashManualCheck(param,function(res){
          if(res.code === 200){
            if(res.data.result == 'checkedSplitToSpf'){
              _self.toManualAccounting('',res.data);
            }else{
              _self.common.messageUtil({
                message: res.data.result,
                type: 'success'
              });
            }
            _self.refreshSummury = true;
            _self.refreshSingle  = true;
            // _self.summuryDataTabs  = 'casha';
            // _self.singleDataTabs   = 'bank';
            // _self.refreshBothSide(true);
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      },
      //取消核对
      toManualCancelCheck(){
        let _self = this;
        this.$confirm('确定取消核对？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let cancelCheckKey = this.summuryDataTabs + this.singleDataTabs;
          let summuryKey     = this.pageUtil.cancelCheckSummuryDataKey[cancelCheckKey];
          let singleKey      = this.pageUtil.cancelCheckSingleDataKey[cancelCheckKey];
          let param = {
            cancelType : this.pageUtil.cancelCheckKey[cancelCheckKey]
          }
          param[summuryKey] = [];
          param[singleKey]  = [];
          this.summurySelectDatas.forEach(function(item,index){
            param[summuryKey].push(item.id);
          });
          this.singleTblSelectDatas.forEach(function(item,index){
            param[singleKey].push(item.id);
          });
          apiStore.doNocashCancelCheck(param,function(res){
            if(res.code === 200){
              _self.common.messageUtil({
                message: res.data,
                type: 'success'
              });
              _self.currentSummeryIdsForSum = '';
              _self.currentSinIdsForSum = '';
              _self.currentSumIdsForSin = '';
              _self.currentSinIdsForSin = '';
              _self.refreshSummury = true;
              _self.refreshSingle  = true;
              // _self.summuryDataTabs  = 'casha';
              // _self.singleDataTabs   = 'bank';
              // _self.refreshBothSide(true);
            }else{
              _self.common.errorMessage(res.msg);
            }
          })
        }).catch(() => {});
        
      },
      //跳转至手工分录
      toManualAccounting(accountingType,accountingObj){
        let _self = this;
        let rowObj = {}
        let param = {};
        if(!accountingObj){
          if(this.summurySelectDatas.length > 0){
            rowObj = Object.assign({},this.summurySelectDatas[0]);
            param.id = rowObj.id;
            param.source = this.pageUtil.manualAccountingType[this.summuryDataTabs];
          }else if(this.singleTblSelectDatas.length > 0){
            rowObj = Object.assign({},this.singleTblSelectDatas[0]);
            param.id = rowObj.id;
            param.source = this.pageUtil.manualAccountingType[this.singleDataTabs];
          }
          param.type = accountingType;
          param.voucherId = rowObj.voucherId;
          param.checkAmount = rowObj.amount;
        }else{
          param.id = accountingObj.id;
          param.type = accountingObj.type;
          param.source = accountingObj.source;
          param.checkAmount = accountingObj.amount;
        }
        window.localStorage.setItem('storeManualAccountingParams',JSON.stringify(param));
        this.$router.push({
          name   : 'StoreManualAccounting',
          query  : {source: 'noncashManualCheck',companyJde: accountingObj? accountingObj.companyCode : rowObj.companyCode}, 
          params : param
        });
      },
      //以BOH数据为准
      upToBOHData(){
        //this.searchBohDialogGridData();
        this.upToBOHDataDialogVisible = true;
      },
      upToBOHDataDialogClose(){
        this.upToBOHDataSearchObj = {
          activeName : null
        };
        this.$refs.upToBOHDataTable.clearSelection();
      },
      searchBohDialogGridData(){
        this.currentPage = 1;
        this.getBOHDialogGridData();
      },
      getBOHDialogGridData(){
        let _self = this;
        let pageParams = {pageIndex : this.currentPage,pageSize  : this.pageSize};
        let tempSearchParams = Object.assign({},pageParams,this.upToBOHDataSearchObj);
        let param = this.common.formatPathParam(tempSearchParams);
        apiStore.getUptoBOHDataDialogGridData(param,function(res){
          if(res.code === 200){
            _self.uptoBohDataGridData = res.data.list;
            _self.totalRecords = res.data.totalRecords;
          }else if(res.code !== 404){
            _self.common.errorMessage(res.msg);
          }
        })
      },
      upToBOHDataChange(val) {
        this.uptoBohDataSelectData = val.concat();
      },
      handleSizeChange(val){
        this.pageSize = val;
        this.getBOHDialogGridData();
      },
      handleCurrentChange(val){
        this.currentPage = val;
        this.getBOHDialogGridData();
      },
      doUptoBOHData(){
        let _self = this;
        let param = {
          list : this.uptoBohDataSelectData
        };
        if(!this.uptoBohDataSelectData.length){
          this.common.messageUtil({
            message : '请选择要以BOH数据为准的数据',
            type    : 'warning'
          });
          return false;
        }
        apiStore.doUptoBOHData(param,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message : res.data,
              type    : 'success'
            });
            _self.searchBohDialogGridData();
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      }
    }
	}
</script>
<style lang="scss">
  @import '../../../assets/scss/dataCheckStore';
  #manualCheckmainPage {
    .check-data-content{
      p.check-sum{
        margin-top: 15px;
      }
    }
    .el-dialog.adjust-dialog {
      min-width: 950px;
      .result-code-content{
        min-width: 120px;
        .el-form-item{
          min-width: 110px;
        }
      }
    }
    .el-scrollbar__view.el-select-dropdown__list{
      max-width: 250px;
    }
  }
  p.adjust-item-amount{
    margin-top: -15px;
    margin-bottom: 15px;
  }
  .view-file-dialog{
    min-width: 550px;
    .el-upload-list{
      margin-top: -15px;
    }
  }
  .act-main-info{
    margin-top: 5px;
    .el-form-item{
      margin-bottom: 5px;
      .el-form-item__label{
        padding-bottom: 0;
        line-height: 25px;
      }
      .el-form-item__content{
        line-height: 25px;
      }
    }
  }
</style>









