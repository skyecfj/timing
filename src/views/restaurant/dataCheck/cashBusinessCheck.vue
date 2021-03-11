<!--现金业务手工核对-->
<template>
  <div class="content" id="manualCheckmainPage" >
    <!--  -->
    <div class="top-tab" >
      <el-tabs ref="checkedOrNotTabs" :before-leave="beforeTypeChange"  v-model="checkedOrNot" >
        <el-tab-pane label="现金业务手工核对" name="unChecked"></el-tab-pane>
        <el-tab-pane label="现金业务已核对" name="checked"></el-tab-pane>
      </el-tabs>
    </div>

    <div class="check-data-content" >
      <el-row class="tbl-control" style="text-align:center" >
        <el-button  v-if="checkedOrNot == 'unChecked'" key="doCheck" size="small" type="success" :title="(!summurySelectDatas.length || !singleTblSelectDatas.length)? '请选择两边数据进行核对':''"
                    :disabled="!summurySelectDatas.length || !singleTblSelectDatas.length" @click="toManualDataCheck" >手工核对</el-button>
        <el-button  v-if="checkedOrNot == 'checked'" key="doUnCheck" size="small" type="success" :title="(!summurySelectDatas.length && !singleTblSelectDatas.length)? '请选择要取消核对的数据':''"
                    :disabled="!summurySelectDatas.length && !singleTblSelectDatas.length" @click="toManualCancelCheck" >取消核对</el-button>
        <el-button  v-if="(checkedOrNot == 'unChecked' && hasAccountingPerssion)" key="toSpfAccount" size="small" type="success" :title="(summurySelectDatas.length + singleTblSelectDatas.length != 1)? '请选择一条要做SPF手工账务的数据':''"
                    :disabled="summurySelectDatas.length + singleTblSelectDatas.length != 1" @click="toManualAccounting('1')" >SPF手工账务</el-button>
        <el-button  v-if="(checkedOrNot == 'unChecked' && hasAccountingPerssion)" key="toUnSpfAccount" size="small" type="success" :title="(summurySelectDatas.length + singleTblSelectDatas.length != 1)? '请选择一条要做非SPF手工账务的数据':''"
                    :disabled="summurySelectDatas.length + singleTblSelectDatas.length != 1" @click="toManualAccounting('2')" >非SPF手工账务</el-button>
        <p v-if="checkedOrNot == 'unChecked'" class="check-sum" >{{pageUtil.tabObj[summuryDataTabs]}}数据合计&nbsp;{{summurySum}}&nbsp;&nbsp;&nbsp;{{pageUtil.tabObj[singleDataTabs]}}数据合计&nbsp;{{singleSum}}&nbsp;&nbsp;&nbsp;差异金额&nbsp;{{diffAmount}}</p>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <div class="tab-content" >
            <el-tabs ref="summuryDataTabs"  v-model="summuryDataTabs" @tab-click="toogleSummuryData">
              <el-tab-pane label="BOH数据" name="casha"></el-tab-pane>
              <el-tab-pane label="押运清单" name="escortsummary"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="tbl-content" >
            <manualCheckSingleTblLeft v-bind:leftTblConfig="summuryTblConfig"
                                      v-bind:pageName="pageName"
                                      v-bind:refreshLeftTbl="refreshSummury"
                                      v-bind:resetLeftTblFlag="resetSummury"
                                      v-bind:currentSummmeryIdsForLeft="currentSummeryIdsForSum"
                                      v-bind:currentSinIdsForLeft="currentSinIdsForSum"
                                      v-bind:sumRefreshObj="sumRefreshProp"
                                      v-bind:refreshCashCheckedLeft="refreshSumCashCkecked"
                                      v-bind:leftSelectedIdsParam="leftSelectedIdsParam"
                                      v-bind:leftInvertIdsParam="leftInvertIdsParam"
                                      v-bind:cashCheckedLeftRefreshDown="cashCheckedLeftRefreshDown"
                                      v-bind:cashCheckedRightRefreshDown="cashCheckedRightRefreshDown"
                                      v-on:selectedLeftRow="summuryCheckedDataChange"
                                      v-on:toogleRefreshLeftTbl="toogleSummuryTblRefresh"
                                      v-on:resetLeftTblDown="resetLeftTblDown"
                                      v-on:adjustLeftTblData="adjustData"
                                      v-on:leftTblSelectToogleDown="leftSelectToogleDown"
                                      v-on:cashLeftCheckedChange="cashCheckedChange"
                                      v-on:cashLeftCheckedRefreshDown="cashLeftCheckedRefreshDownfn"
                                      v-on:cashCheckedLeftRefreshDown="cashCheckedLeftRefreshDownfn"
                                      v-on:bothRefreshDown="bothRefreshDownfn"
                                      v-on:setLeftCashCheckedDatas="setSumSelectedData"
                                      v-on:setSelectedAmount="setSelectedAmount"></manualCheckSingleTblLeft>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="tab-content" >
            <el-tabs ref="singleDataTabs"  v-model="singleDataTabs" :before-leave="beforeSingleLeave">
              <el-tab-pane label="银行流水" name="bank"></el-tab-pane>
              <el-tab-pane label="押运清单" name="escort"></el-tab-pane>
              <el-tab-pane label="房东清单" name="landlord"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="tbl-content" >
            <manualCheckSingleTblRight  v-bind:rightTblConfig="singleTblConfig"
                                        v-bind:pageName="pageName"
                                        v-bind:refreshRightTbl="refreshSingle"
                                        v-bind:resetRightTblFlag="resetSingle"
                                        v-bind:currentSumIdsForRigh="currentSumIdsForSin"
                                        v-bind:currentSinIdsForRigh="currentSinIdsForSin"
                                        v-bind:sinRefreshObj="sinRefreshProp"
                                        v-bind:refreshCashCheckedRight="refreshSinCashCkecked"
                                        v-bind:rightSelectedIdsParam="rightSelectedIdsParam"
                                        v-bind:rightInvertIdsParam="rightInvertIdsParam"
                                        v-bind:cashCheckedLeftRefreshDown="cashCheckedLeftRefreshDown"
                                        v-bind:cashCheckedRightRefreshDown="cashCheckedRightRefreshDown"
                                        v-bind:setMaxAmount="setMaxAmount"
                                        v-bind:rightMaxAmount="rightMaxAmount"
                                        v-on:selectedRightRow="singleCheckedDataChange"
                                        v-on:toogleRefreshRightTbl="toogleSingleTblRefresh"
                                        v-on:resetRightTblDown="resetRightTblDown"
                                        v-on:adjustRightTblData="adjustData"
                                        v-on:rightTblSelectToogleDown="rightSelectToogleDown"
                                        v-on:cashRightCheckedChange="cashCheckedChange"
                                        v-on:cashRightCheckedRefreshDown="cashRightCheckedRefreshDownfn"
                                        v-on:cashCheckedRightRefreshDown="cashCheckedRightRefreshDownfn"
                                        v-on:bothRefreshDown="bothRefreshDownfn"
                                        v-on:setRightCashCheckedDatas="setSinSelectedData"
                                        v-on:setMaxAmountDown="setMaxAmount = false;rightMaxAmount=''" ></manualCheckSingleTblRight>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- Table -->
    <el-dialog title="手工调整" :visible.sync="adjustDialogVisible" :close-on-click-modal="false" @close="resetAdjustForm" custom-class="adjust-dialog" >
      <p class="adjust-item-amount">金额：{{adjustItem.amount}}</p>
      <el-form v-if="showCashADayChoose" ref="cashaBizDayForm" :model="cashaBizDayForm" :inline="true"  class="casha-bizday-form" >
        <!-- <el-form-item label="cash_a店天" prop="cashAbussinessDay"
                      :rules="(!cashaBizDayForm.storeCode && !cashaBizDayForm.bizDate)? { required : true, message : '请选择cash_a店天', trigger : 'change'} : {}" >
          <el-select size="small" v-model="cashaBizDayForm.cashAbussinessDay" placeholder="cash_a店天" value-key="id" >
            <el-option  value="" label="请选择" ></el-option>
            <el-option  v-for="(cashAbusinessDay,index) in cashAbusinessDays" :key="index" :value="cashAbusinessDay" :label="cashAbusinessDay.bizDate | formatDate('yyyy-MM-dd') +' '+ cashAbusinessDay.storeCode" ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="餐厅编号" prop="storeCode" :rules="{ required : true, message : '请选择餐厅编号', trigger : 'change'}" >
          <el-select  size="small" v-model="cashaBizDayForm.storeCode" placeholder="请选择" remote :remote-method="remoteStoreHypId" :loading="loadingStoreHypId"
                      filterable v-scroll="bindScroll" @visible-change="visibleChange" @keyup.native="focusFn" style="width:150px"
                      :disabled="!cashAbusinessDays.length" >
              <el-option  value="" label="请选择" ></el-option>
              <el-option v-for="item in storeHypIdOpt" :key="item.storeHypId" :label="item.storeHypId" :value="item.storeHypId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业日期" prop="bizDate" :rules="{ required : true, message : '请选择营业日期', trigger : 'change'}" >
          <el-date-picker size="small" v-model="cashaBizDayForm.bizDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择营业日期"
                          :disabled="!cashAbusinessDays.length"  style="width:150px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="adjustForm" ref="adjustForm" class="adjust-form"  >
        <el-row v-for="(adjustItem,index) in adjustForm.adjustDetails" v-bind:key="index" :gutter="2"  >
          <el-col :span="4" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.adjustmentAmount'" :label="index == 0? '金额':''"
                          :rules="[{ required : true, message : '请输入调整金额', trigger : 'blur'},
                                   { validator: floatNumPass, trigger: 'blur'}]" >
              <el-input v-model="adjustItem.adjustmentDto.adjustmentAmount" :disabled="!hasCheckWithCash"  ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.resultCode'" :label="index == 0? '调整类型':''"
                          :rules="{ required : true, message : '请选择调整类型', trigger : 'change'}" >
              <el-select size="small" v-model="adjustItem.adjustmentDto.resultCode" placeholder="调整类型" @change="changeAdjustType(index)"
                         class="adjusttype-select" :disabled="!hasCheckWithCash"  >
                <el-option  v-for="adjustType in cashAdjustTypes" :key="adjustType.adjustType" :title="adjustType.adjustDesc"
                            :label="adjustType.adjustType+'  '+adjustType.adjustDesc" :value="adjustType.adjustType" :disabled="!hasCheckWithCash" ></el-option>
								<!-- <el-option  label="SPF手工账务" value="SPF手工账务" ></el-option>
                <el-option  label="非SPF手工账务" value="非SPF手工账务" ></el-option> -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.fscActivityCode'" :label="index == 0? 'BOH调整项':''"
                          :rules="adjustItem.BOHObjs.length?{ required : true, message : 'BOH调整项', trigger : 'change'}:{}" >
              <el-select size="small" v-model="adjustItem.adjustmentDto.fscActivityCode" placeholder="BOH调整项" :disabled="!adjustItem.BOHObjs.length" >
                <el-option v-for="BOHObj in adjustItem.BOHObjs" :key="BOHObj" :label="BOHObj" :value="BOHObj" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item :prop="'adjustDetails.'+index+'.adjustmentDto.remark'" :label="index == 0? '原因备注':''" >
              <el-input v-model.trim="adjustItem.adjustmentDto.remark" :disabled="!hasCheckWithCash" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" >
            <el-form-item :label="index == 0? '附件':''" class="attach-content"  >
              <el-button v-if="hasCheckWithCash" type="text" class="link-btn" @click="showAttachDialog(adjustItem.adjustmentDto,index)" >附件</el-button>
            </el-form-item>
          </el-col>
          <div :class="index == 0? 'row-button no-label':'row-button'" >
            <el-button size="small" v-show="(index == adjustForm.adjustDetails.length - 1) && hasCheckWithCash" @click="newAdjustItem()" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-plus"></i></el-button>
            <el-button size="small" v-show="(adjustForm.adjustDetails.length > 1) && hasCheckWithCash" @click="deleteAdjustItem(index)"  class="c-button-icon--danger--opacity c-button-icon-circle"><i class="fa fa-trash-alt"></i></el-button>
          </div>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogVisible = false" >取 消 </el-button>
        <el-button type="primary" @click="doAdjust" :disabled="!hasCheckWithCash">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 附件弹框 -->
    <el-dialog title="附件" :visible.sync="attachmentDialogVisible" width="30%" @close="loadFile = false"
               :close-on-click-modal="false" :custom-class="checkedOrNot === 'checked'? 'view-file-dialog' : 'upload-file-dialog'" >
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
  </div>
</template>
<script>
  import api from '../../../model/api'
  import apiStore from '../../../model/apidr'
  import ip from '../../../model/tempIp'
  import {formatDate} from '../../../utils/dateFormat.js'
  import scroll from '@/directives/index'
  //核对list
  import manualCheckSingleTblLeft from './dataCheckComponent/manualCheckSingleTblLeft'
  import manualCheckSingleTblRight from './dataCheckComponent/manualCheckSingleTblRight'
  //页面配置
  import pageUtil from '../../../utils/restaurant/dataCheck/cashManualCheck'

	export default {
    name:'CashBusinessCheck',
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
    directives: {scroll},
    created(){},
    beforeMount(){
      this.getAllAdjustType();
      this.getAccountingPermission();
      //this.getAdjustType();
    },
    mounted(){},
		data() {
			return {
        pageUtil : pageUtil,
        pageName : 'manual-check-statement',
        tempCheckedOrNot : 'unChecked',
        checkedOrNot     : 'unChecked',
        sinRefreshProp   : {
          prop  : '',
          value : ''
        },
        sumRefreshProp   : {
          prop  : '',
          value : ''
        },
        tempSummuryDataTabs  : 'casha',
        summuryDataTabs      : 'casha',
        tempSingleDataTabs   : 'bank',
        singleDataTabs       : 'bank',
        summurySelectDatas   : [],
        singleTblSelectDatas : [],
        currentSummeryIdsForSum : '',
        currentSinIdsForSum : '',
        currentSumIdsForSin : '',
        currentSinIdsForSin : '',
        summurySum : '0.00',
        singleSum  : '0.00',
        diffAmount : '0.00',
        hasAccountingPerssion: false,
        storageTypeMap : {
          bank         : 1,
          escort       : 2,
          landlord     : 3
        },
        refreshSummury : true,
        resetSummury   : false,
        refreshSumCashCkecked : false,
        leftSelectedIdsParam : '',
        leftInvertIdsParam : '',
        refreshSingle  : true,
        resetSingle    : false,
        refreshSinCashCkecked : false,
        rightSelectedIdsParam : '',
        rightInvertIdsParam   : '',
        cashCheckedLeftRefreshDown  : false,
        cashCheckedRightRefreshDown : false,
        summuryTblConfig : {
          //checkedFlag   : false,
          //refreshTbl : true,
          dataType   : 'casha',
          requiredSearchObj : {
            checkStatus : 0,
            storageType : 1,
          }
        },
        singleTblConfig : {
          //checkedFlag   : false,
          //refreshTbl : true,
          dataType   : 'bank',
          requiredSearchObj : {
            checkStatus  : 0,
            checkWithBoh : 'true'
          }
        },
        hasCheckWithCash   : true,
        showCashADayChoose : false,
        allAdjustTypes     : [],
        cashAdjustTypes    : [],
        //单条调整对象
        adjustObj : {},
        adjustItem : {},
        adjustDialogVisible : false,
        adjustForm : {
          adjustDetails : [{
            adjustmentDto : {
              fscActivityCode : '',
              files : []
            },
            BOHObjs       : []
          }]
        },
        cashaBizDayForm   : {
          // cashAbussinessDay : {},
          storeCode : '',
          bizDate   : ''
        },
        cashAbusinessDays : [],
        //餐厅远程查询参数
        storeHypIdOpt:[],
        scrollFlag:true,
        loadingStoreHypId:false,
        listPageIndex: 1,
        selectObj: {},
        temString: '',
        //===
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
        setMaxAmount : false,
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
      //获取所有调整类型
      getAllAdjustType(){
        let _self = this;
        api.getDictionaryByNumber('ADJUST_TYPE', function(res) {
          if(res.code === 200) {
            _self.allAdjustTypes = res.data;
          }
        });
      },
      //获取调整类型下拉框数据
      getAdjustType(bohType){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : bohType? bohType : '现金'
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          _self.cashAdjustTypes = [];
          res.data.forEach(function(item,index){
            _self.cashAdjustTypes.push(item);
          })
          if(res.code === 200){
            _self.adjustTypes = _self.adjustTypes.concat(res.data);
          }else{
            _self.adjustTypes = [{
              adjustType : '请选择'
            }];
          }
          _self.adjustTypes.push({
            adjustType : '非SPF手工账务'
          });
        })
        // let param = this.common.formatPathParam({
        //   boh : bohType? bohType : '现金'
        // })
        // api.getCashAdjustType(param,function(res){
        //   _self.cashAdjustTypes = [];
        //   if(res.code === 200){
        //     res.data.forEach(function(cashAdjustTypeItem,cIndex){
        //       _self.allAdjustTypes.forEach(function(adjustTypeItem,aIndex){
        //         if(cashAdjustTypeItem == adjustTypeItem.id){
        //           _self.cashAdjustTypes.push(adjustTypeItem.dictionaryEntryCode);
        //         }
        //       })
        //     })
        //   }
        // });
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
                  this.tempSummuryDataTabs = 'casha';
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
        let source = dataType == 'casha'? 'cashadetail' : dataType;
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
        //this.fileCount++ ;
        this.adjustForm.adjustDetails[index].adjustmentDto.files.push(response.data);
        let succeedFileLength = this.adjustForm.adjustDetails[index].adjustmentDto.files.length;
        if(succeedFileLength == flieNum){
          this.loadFile = false;
        }
        //this.updateFileObjForSubmit(fileList);
      },
      //更新fileObjForSubmit
      updateFileObjForSubmit (fileList){
        let _self = this;
        let index = this.fileObjTemp.index;
        this.adjustForm.adjustDetails[index].adjustmentDto.files = [];
        this.adjustForm.adjustDetails[index].adjustmentDto.files = fileList.concat();
        // this.fileObjForSubmit.id = this.fileObjTemp.id
        // this.fileObjForSubmit.files = [];
        // fileList.forEach(function(item,index){
        //   _self.fileObjForSubmit.files.push({
        //     id   : item.id ? item.id : '',
        //     name : item.name,
        //     url  : item.url
        //   })
        // })
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
              storageType : 1,
            };
            this.singleTblConfig.requiredSearchObj.checkStatus = 1;
          }else if(tab.name == 'unChecked'){
            this.summuryTblConfig.requiredSearchObj={
              checkStatus : 0,
              storageType : 1,
            };
            this.singleTblConfig.requiredSearchObj.checkStatus = 0;
          }
          this.summuryTblConfig.dataType = 'casha';
          this.summuryDataTabs  = 'casha';
          this.singleDataTabs   = 'bank';
          this.resetSelectedData();
          this.refreshBothSide(true);
          this.tempCheckedOrNot = tab.name;
        }
      },
      //切换汇总数据tab
      toogleSummuryData(tab, event){
        if(tab.name != this.tempSummuryDataTabs){
          this.sinRefreshProp = {
            prop  : '',
            value : ''
          }
          this.singleDataTabs = 'bank';
          this.summuryTblConfig.dataType = tab.name;
          this.singleTblConfig.dataType = 'bank';
          if(tab.name == 'casha'){
            this.summuryTblConfig.requiredSearchObj.storageType = 1;
            this.singleTblConfig.requiredSearchObj.checkWithBoh = 'true';
          }else{
            this.singleTblConfig.requiredSearchObj.checkWithBoh = 'false';
          }
          this.refreshBothSide(true);
          this.tempSummuryDataTabs = tab.name;
        }
        //console.log(tab.name);
      },
      beforeSingleLeave(activeName, oldActiveName){
        let tab = {name : activeName}
        if(this.summuryDataTabs == 'escortsummary'){
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
          if(this.summuryDataTabs == 'casha'){
            this.summuryTblConfig.requiredSearchObj.storageType = this.storageTypeMap[tab.name];
            this.singleTblConfig.dataType = tab.name;
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
          let sumProp = this.pageUtil.tblColumns[this.summuryDataTabs].sumProp;
          var tempSum = 0;
          selectedDatas.forEach(function(item,index){
            let amount = Number(item[sumProp].replace(/,/g,''));
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
          this.refreshSingleTbl(selectedDatas,true,true)
          // console.log('currentSumIds---',this.currentSumIds);
          // console.log('currentSinIds---',this.currentSinIds);
          // console.log(this.singleTblConfig.requiredSearchObj);

        }
      },
      leftSelectToogleDown(selectedDatas){
        this.refreshSingleTbl(selectedDatas,false,true)
      },
      cashCheckedChange(checkedIds,invertIds,refreshType,dataType){
        let checkedKey = '';
        let invertKey  = '';
        let checkedIdsArr = [];
        let invertIdsArr  = [];
        let refreshSide = '';
        if(refreshType == 'self'){
          checkedKey  = this.pageUtil.checkedRefreshKeyConfig[refreshType][dataType];
          invertKey   = this.pageUtil.invertRefreshKeyConfig[refreshType][dataType];
          refreshSide = (dataType == 'casha' || dataType == 'escortsummary')? 'left' : 'right';
        }else{
          let refreshDataType = (dataType == 'casha' || dataType == 'escortsummary')? this.singleDataTabs : this.summuryDataTabs;
          checkedKey = refreshDataType == 'bank'? this.pageUtil.checkedRefreshKeyConfig[refreshType][this.summuryDataTabs] : 'selectIds';
          invertKey  = refreshDataType == 'bank'? this.pageUtil.invertRefreshKeyConfig[refreshType][this.summuryDataTabs] : 'invertSelectIds';
          refreshSide = (dataType == 'casha' || dataType == 'escortsummary')? 'right' : 'left';
        }
        checkedIds.forEach(function(item,index){
          checkedIdsArr.push({
            name  : checkedKey,
            value : item.id
          })
        });
        invertIds.forEach(function(item,index){
          invertIdsArr.push({
            name  : invertKey,
            value : item
          })
        });
        if(refreshSide == 'left'){
          this.leftSelectedIdsParam  = checkedIdsArr.length? this.common.joinSearchParam(checkedIdsArr).replace('?','&') : '';
          this.leftInvertIdsParam    = invertIdsArr.length? this.common.joinSearchParam(invertIdsArr).replace('?','&') : '';
          this.refreshSumCashCkecked = true;
        }else{
          this.rightSelectedIdsParam = checkedIdsArr.length? this.common.joinSearchParam(checkedIdsArr).replace('?','&') : '';
          this.rightInvertIdsParam   = invertIdsArr.length? this.common.joinSearchParam(invertIdsArr).replace('?','&') : '';
          this.refreshSinCashCkecked = true;
        }
      },
      cashLeftCheckedRefreshDownfn(){
        this.refreshSumCashCkecked = false;
      },
      cashCheckedLeftRefreshDownfn(){
        this.cashCheckedLeftRefreshDown = true;
      },
      cashRightCheckedRefreshDownfn(){
        this.refreshSinCashCkecked = false;
      },
      cashCheckedRightRefreshDownfn(){
        this.cashCheckedRightRefreshDown = true;
      },
      bothRefreshDownfn(){
        this.refreshSumCashCkecked = false;
        this.refreshSinCashCkecked = false;
        this.cashCheckedLeftRefreshDown = false;
        this.cashCheckedRightRefreshDown = false
      },
      setSumSelectedData(selectedDatas){
        this.summurySelectDatas = selectedDatas.concat();
      },
      setSinSelectedData(selectedDatas){
        this.singleTblSelectDatas = selectedDatas.concat();
      },
      refreshSingleTbl(selectedDatas,isReset,isRefresh){
        let currentCheckWith = this.singleDataTabs; // casha escort landlord
        let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith];
        let currentCheckWithIdsKey = currentCheckWith == 'bank' ? pageUtil.bankCheckIdsKey[this.summuryDataTabs] : 'selectIds'
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
        if(this.singleDataTabs == 'bank'){
          this.singleTblConfig.requiredSearchObj.checkWithBoh = this.summuryDataTabs == 'casha'? 'true' : 'false';
        }
        this.resetSingle    = isReset;
        this.refreshSingle  = isRefresh;
      },
      //非汇总表（右侧）选中数据变动
      singleCheckedDataChange(selectedDatas) {
        let _self = this;
        this.singleTblSelectDatas = Object.assign([],selectedDatas);
        if(this.checkedOrNot === 'unChecked'){
          let sumProp = this.pageUtil.tblColumns[this.singleDataTabs].sumProp;
          var tempSum = 0;
          selectedDatas.forEach(function(item,index){
            let amount = Number(item[sumProp].replace(/,/g,''));
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
          let currentCheckWith = this.summuryDataTabs; // casha escort landlord
          let currentSelectedIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith];
          var currentSelectedIds = [];
          var checkWidthIds = [];
          //获取当前选中[ids];
          selectedDatas.forEach(function(item,index){
            currentSelectedIds.push({
              name  : 'selectIds',
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
      rightSelectToogleDown(selectedDatas){
        //刷新另一侧数据
        let refreshKey = this.summuryDataTabs + this.singleDataTabs;
        let currentSelectData = selectedDatas[selectedDatas.length -1];
        let singleTblRefreshProp = this.pageUtil.unCkeckedDataRefresSumhKey[refreshKey];

        if(selectedDatas.length){
          let value = currentSelectData[singleTblRefreshProp];
          if(this.sumRefreshProp.value != value){
            this.sumRefreshProp = {
              prop  : singleTblRefreshProp,
              value : value
            }
          }
        }else{
          this.sumRefreshProp = {
            prop  : singleTblRefreshProp,
            value : ''
          }
        }
      },
      //切换汇总表刷新
      toogleSummuryTblRefresh(refreshFlag){
        let currentCheckWith = this.summuryDataTabs;
        let currentSelectedIdsKey = pageUtil.refreshCheckedDataIdsKey[currentCheckWith];
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
      toogleSingleTblRefresh(refreshFlag,selectedDatas){
        let currentCheckWith = this.singleDataTabs; // casha escort landlord
        let currentSelectedIdsKey  = pageUtil.refreshCheckedDataIdsKey[currentCheckWith];
        let currentCheckWithIdsKey = currentCheckWith == 'bank' ? pageUtil.bankCheckIdsKey[this.summuryDataTabs] : 'selectIds'
        var currentSelectedIds = [];
        var checkWidthIds = [];
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
        if(this.singleDataTabs == 'bank'){
          this.singleTblConfig.requiredSearchObj.checkWithBoh = this.summuryDataTabs == 'casha'? 'true' : 'false';
        }
        this.refreshSingle = refreshFlag;
      },
      setSelectedAmount(selectedData){
        //let amountMaxKey = this.pageUtil.tblColumns[this.singleDataTabs].amountMaxKey;
        if(selectedData){
          this.setMaxAmount = true;
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
        if(resetFlag){
          this.resetSummury   = true;
          this.resetSingle    = true;
        }
        this.summurySelectDatas    = [];
        this.singleTblSelectDatas  = [];
        this.rightSelectedIdsParam = '';
        this.rightInvertIdsParam   = '';
        this.leftSelectedIdsParam  = '';
        this.leftInvertIdsParam    = '';
        this.currentSummeryIdsForSum = '';
        this.currentSinIdsForSum = '';
        this.currentSumIdsForSin = '';
        this.currentSinIdsForSin = ''
        this.refreshSummury = true;
        this.refreshSingle  = true;
      },
      getSelectableBOHdata(param){
        let _self = this;
        apiStore.getCheckedBOHdata(param,function(res){
          if(res.code === 200){
            let firstChekcedObj = res.data[0];
            _self.cashaBizDayForm.storeCode = firstChekcedObj.storeCode;
            _self.cashaBizDayForm.bizDate = firstChekcedObj.bizDate;
            _self.cashAbusinessDays = res.data;
          }else{
            _self.cashaBizDayForm.storeCode = '';
            _self.cashaBizDayForm.bizDate = '';
            _self.cashAbusinessDays = [];
          }
        })
      },
      resetAdjustForm(){
        this.adjustForm = {
          adjustDetails : [{
            adjustmentDto : {
              fscActivityCode : '',
              files : []
            },
            BOHObjs       : []
          }]
        }
        this.hasCheckWithCash = true;
        this.$refs.adjustForm.resetFields();
        if(this.$refs.cashaBizDayForm){
          this.$refs.cashaBizDayForm.resetFields();
        }
      },
      //餐厅编号远程查询
      bindScroll(param, object) {
        if (param) {
          var that = this;
          this.selectObj = object;
          if (this.scrollFlag) {
            this.listPageIndex++;
            api.getSelectSearchCondition({
              storeHypId: this.temString,
              pageSize: 20,
              pageIndex: this.listPageIndex
            }, function (res) {
              if (res.code === 200) {
                  that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data);
              } else if (res.code === 404) {
                  that.scrollFlag = false;
              }
            })
          }
        }
      },
      remoteStoreHypId(val) {
        let that = this;
        // this.storeCode = val;
        this.temString = val;
        this.listPageIndex = 1;
        if (JSON.stringify(this.selectObj) !== '{}') {
          this.selectObj.scrollTop = 0;
        }
        api.getSelectSearchCondition({
          storeHypId: this.temString,
          pageIndex: this.listPageIndex,
          pageSize: 20
        }, function (res) {
          that.storeHypIdOpt = res.data
        })
      },
      visibleChange(param) {
        if (!param && !this.storeCode) {
          this.remoteStoreHypId();
          this.temString = '';
        } else {
          this.remoteStoreHypId(this.storeCode);
        }
      },
      focusFn(param) {
        if (!param.target.value) {
          this.temString = '';
          this.remoteStoreHypId();
        }
      },
      //单条调整
      adjustData({row, event, column, tblConfig, storageType}){
        let _self = this;
        this.cashAbusinessDays = [];
        this.cashaBizDayForm.cashAbussinessDay = '';
        this.adjustItem = Object.assign({},row);
        this.adjustForm = {
          adjustConfig  : tblConfig,
          adjustDetails : [{
            adjustmentDto : {
              fscActivityCode : '',
              files : []
            },
            BOHObjs       : []
          }]
        };
        if(this.checkedOrNot === 'unChecked'){
          this.getAdjustType(row.fscActivityCode);
          if((tblConfig.dataType == 'escortsummary' || tblConfig.dataType == 'bank') && !row.rootId){
            this.hasCheckWithCash = false;
          }
          if(this.singleDataTabs == 'bank' && this.summuryDataTabs == 'escortsummary'){
            this.hasCheckWithCash = false;
          }
          if(tblConfig.dataType == 'bank' || tblConfig.dataType == 'escort' || tblConfig.dataType == 'landlord'){
            if(!row.rootId){
              this.hasCheckWithCash = false;
            }
            this.showCashADayChoose = true;
            if(row.rootId){
              let param = this.common.formatPathParam({
                id : row.rootId,
                storageType : storageType
              })
              this.getSelectableBOHdata(param);
            }
          }else{
            this.showCashADayChoose = false;
          }
          if(tblConfig.dataType == 'bank'){
            if(this.summuryDataTabs != 'escortsummary'){
              this.adjustDialogVisible = true;
            }
          }else if(tblConfig.dataType != 'escortsummary'){
            this.adjustDialogVisible = true;
          }
        }else if(this.checkedOrNot === 'checked'){
          if(event.target.className != 'el-checkbox__inner' && event.target.className != 'el-checkbox__original'){
            this.getCurrentAttachments(row.id,tblConfig.dataType);
          }
        }
      },
      getCurrentAttachments(id,foreignType){
        let _self = this;
        let param = this.common.formatPathParam({
          id : id,
          source    : foreignType == 'casha' ? 'cashadetail' : foreignType
        });
        apiStore.selectCurrentAttachments(param,function(res){
          if(res.code === 200){
            _self.fileObjTemp.files = [];
            _self.fileObjTemp.files = res.data.attachmentDtos.concat();
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
        this.adjustForm.adjustDetails.push({
          adjustmentDto : {
            fscActivityCode : '',
            files : []
          },
          BOHObjs       : []
        })
      },
      //删除
      deleteAdjustItem(dx){
        let tempDetailList = this.common.removeIndex(this.adjustForm.adjustDetails,dx);
        this.adjustForm.adjustDetails = tempDetailList;
      },
      //切换调整类型
      changeAdjustType(index){
        let _self = this;
        let currentResultCode   = this.adjustForm.adjustDetails[index].adjustmentDto.resultCode;
        let currentAdjustTypeId = '';
        _self.allAdjustTypes.forEach(function(item,index){
          if(item.dictionaryEntryCode == currentResultCode){
            currentAdjustTypeId = item.id;
          }
        });
        let param = this.common.formatPathParam({
          adjustType : currentAdjustTypeId? currentAdjustTypeId : '0'
        });
        api.getBOHSubjectByAdjustType(param,function(res){
          _self.adjustForm.adjustDetails[index].BOHObjs = [];
          _self.adjustForm.adjustDetails[index].adjustmentDto.fscActivityCode = '';
          if(res.code == 200){
            for(let BOHItem in res.data[0]){
              _self.adjustForm.adjustDetails[index].BOHObjs.push(res.data[0][BOHItem]);
            }
          }else{
            _self.$refs.adjustForm.clearValidate('adjustDetails.'+index+'.adjustmentDto.fscActivityCode');
          }

        })
      },
      //单条调整 TDO
      doAdjust(){
        let _self = this;
        if(this.$refs.cashaBizDayForm){
          this.$refs.cashaBizDayForm.validate((cashaBizDayValid) =>{
            if(cashaBizDayValid){
              _self.$refs.adjustForm.validate((valid) => {
                if(valid){
                  _self.adjustSubmit();
                }
              })
            }
          });
        }else{
          this.$refs.adjustForm.validate((valid) => {
            if(valid){
              _self.adjustSubmit();
            }
          })
        }
      },
      adjustSubmit(){
        let _self = this;
        let requestPath =  _self.adjustForm.adjustConfig.dataType == 'casha'? 'adjustment-casha' : 'adjustment-other';
        let hasAllAttached = true;
        let param = {};
        let tempAdjustList = [];
        _self.adjustForm.adjustDetails.forEach(function(item,index){
          let tempAdjustObj = Object.assign({},item.adjustmentDto);
          item.BOHObjs.forEach(function(bohItem,index){
            if(bohItem != tempAdjustObj.fscActivityCode){
              tempAdjustObj.unCheckFscActivityCode = bohItem;
            }
          });
          //tempAdjustObj.cashaDetailId = _self.cashaBizDayForm.cashAbussinessDay;
          tempAdjustList.push(tempAdjustObj);
          if(!item.adjustmentDto.files.length){
            hasAllAttached = false;
          }
        });
        if(!hasAllAttached){
          this.common.warningMessage('请上传附件！');
          return false;
        }
        let dataType = _self.adjustForm.adjustConfig.dataType;
        if(dataType != 'bank'){
          param.adjustmentType = pageUtil.adjustmentType[dataType];
        }else{
          if(_self.summuryDataTabs == 'casha'){
            param.adjustmentType = '2';
          }else if(_self.summuryDataTabs == 'escortsummary'){
            param.adjustmentType = '3';
          }
        }
        param.id = _self.adjustItem.id;
        param.adjustmentDtlDtoList = tempAdjustList;
        param.storeCode = _self.cashaBizDayForm.storeCode;
        param.bizDate   = _self.cashaBizDayForm.bizDate;
        console.log(param);
        apiStore.doSingleAdjust(param,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message: res.data,
              type: 'success'
            });
            if(dataType == 'casha' || dataType == 'escortsummary'){
              _self.refreshSummury = true;
            }else if(dataType == 'bank' || dataType == 'escort' || dataType == 'landlord'){
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
          this.doCashManualPreCheck(param);
        }).catch(() => {});
      },
      doCashManualPreCheck(param){
        let _self = this;
        apiStore.doCashManualPreCheck(param,function(res){
          if(res.code === 200){
            if(res.data == 'checkedOutTolerance'){
              _self.$prompt('请填写拆分理由','提示',{
                distinguishCancelAndClose: true,
                inputPlaceholder: '拆分理由',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(({ value }) => {
                param.splitReason = value;
                _self.doCashManualCheck(param);
              }).catch(action => {
                // if(action === 'cancel'){
                //   param.dealType = 2;
                //   _self.doCashManualCheck(param);
                // }
              });
            }else{
              _self.common.messageUtil({
                message: res.data,
                type: 'success'
              });
              _self.resetSelectedData();
              _self.resetSingle = true;
              _self.refreshSingle = true;
              _self.refreshSummury = true;
              //_self.refreshBothSide(true);
              // _self.refreshSummury = true;
              // _self.refreshSingle  = true;
            }
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      },
      //核对
      doCashManualCheck(param){
        let _self = this;
        apiStore.doManualCheck(param,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message: res.data,
              type: 'success'
            });
            _self.resetSelectedData();
            _self.resetSingle = true;
            _self.refreshSingle = true;
            _self.refreshSummury = true;
            // _self.refreshSummury = true;
            // _self.refreshSingle  = true;
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
          apiStore.doCancelCashCheck(param,function(res){
            if(res.code === 200){
              _self.common.messageUtil({
                message: res.data,
                type: 'success'
              });
              _self.resetSelectedData();
              _self.refreshSummury = true;
              _self.refreshSingle  = true;
              _self.summurySelectDatas = [];
              _self.singleTblSelectDatas = [];
              // _self.summuryDataTabs  = 'casha';
              // _self.singleDataTabs   = 'bank';
              // _self.refreshBothSide(true);
            }else{
              _self.common.errorMessage(res.msg);
            }
          })
        }).catch(() => {});
      },
      resetSelectedData(){
        this.currentSummeryIdsForSum = '';
        this.currentSinIdsForSum     = '';
        this.currentSumIdsForSin     = '';
        this.currentSinIdsForSin     = '';
        this.rightSelectedIdsParam   = '';
        this.rightInvertIdsParam     = '';
        this.leftSelectedIdsParam    = '';
        this.leftInvertIdsParam      = '';
      },
      //跳转至手工分录TDO 1 SPF 2 非SPF
      toManualAccounting(accountingType){
        let _self = this;
        let rowObj = {}
        let param = {};
        if(this.summurySelectDatas.length > 0){
          rowObj = Object.assign({},this.summurySelectDatas[0]);
          param.id = rowObj.id;
          param.source = this.pageUtil.manualAccountingType[this.summuryDataTabs];
        }else if(this.singleTblSelectDatas.length > 0){
          rowObj = Object.assign({},this.singleTblSelectDatas[0]);
          param.id = rowObj.id;
          param.source = this.pageUtil.manualAccountingType[this.singleDataTabs];
        }
        param.type = accountingType == 1? 'SPF手工账务' : '非SPF手工账务';
        param.voucherId = rowObj.voucherId;
        param.checkAmount = rowObj.amount;
        window.localStorage.setItem('storeManualAccountingParams',JSON.stringify(param));
        this.$router.push({
          name : 'StoreManualAccounting',
          query: {source: 'cashManualCheck',companyJde: rowObj.companyCode},
          params : param
        });
      }
    }
	}
</script>
<style lang="scss">
  @import '../../../assets/scss/dataCheckStore';
  .check-data-content{
    p.check-sum{
      margin-top: 15px;
    }
  }
  .el-scrollbar__view.el-select-dropdown__list{
    max-width: 250px;
  }
  p.adjust-item-amount{
    margin-top: -15px;
    margin-bottom: 15px;
  }
</style>









