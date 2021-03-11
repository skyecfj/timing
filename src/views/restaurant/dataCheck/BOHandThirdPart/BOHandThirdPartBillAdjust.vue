<template>
  <div>
    <div class="content" id="bohAndBillAdjust" >
      <div class="top-control" >
        <div class="store-main-info" >
          <p>餐厅编号：{{storeObj.storeCode}}  营业日期：{{storeObj.bizDate}}</p>
          <p>非现金盈亏：{{storeObj.overshort}}</p>
        </div>
        <div class="btn-group" >
          <!-- <el-button size="small"  type="text" class="link-btn" @click="viewAllOrderDiff" >订单级核对差异</el-button> -->
          <!-- <el-button size="small"  type="success" v-if="hasAccountingPerssion" @click="toManualAccounting('1')" >SPF手工账务</el-button>
          <el-button size="small"  type="success" v-if="hasAccountingPerssion" @click="toManualAccounting('2')" >非SPF手工账务</el-button> -->
          <el-button size="small"  type="success" @click="calculate" >计算阈值</el-button>
          <!-- <el-button size="small"  type="success" @click="showAttachDialog(storeObj)" >批量上传附件</el-button> -->
        </div>
      </div>
      <el-table :data="collatReport" style="width: 100%" :default-expand-all='false' border >
        <el-table-column type="expand">
          <template slot-scope="expendObj">
            <el-table :data="expendObj.row.cashaResults" :span-method="renderColspan" class="adjust-detail-tbl" >
              <el-table-column property="amount" label="金额" header-align="center" align="center" >
                <template slot-scope="scope" >
                  <el-form  v-if="scope.row.isEdit" :inline="true" :model="scope.row" :ref="'adjustDetailItemForm_'+scope.$index" class="adjust-detail-form" >
                    <el-form-item prop="amount" style="width:31%" :rules="[ { required : true, message : '请输入调整金额', trigger : 'blur' },
                                                                            { validator: floatNumPass, trigger: 'blur'}]" >
                      <el-input v-model="scope.row.amount"></el-input>
                    </el-form-item>
                    <el-form-item prop="resultCode" :style="(scope.row.resultCode == '串户' || scope.row.resultCode == '时间性差异' || scope.row.resultCode == 'C4')? 'width:15%' : 'width:33%'" :rules="{ required : true, message : '请选择调整类型', trigger : 'change' }" >
                      <el-select size="small" v-model="scope.row.resultCode" placeholder="调整类型" filterable @change="scope.row.targetActCode = '';scope.row.targetDate = ''" >
                        <el-option v-for="item in adjustTypeOpts" :key="item.adjustType + expendObj.$index" :label="item.adjustType" :value="item.adjustType"></el-option>
                        <el-option label="C4" value="C4" ></el-option>
                        <el-option label="串户" value="串户" ></el-option>
                        <el-option label="时间性差异" value="时间性差异" ></el-option>
                        <el-option label="SPF手工账务" value="SPF手工账务" ></el-option>
                        <el-option label="非SPF手工账务" value="非SPF手工账务" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="scope.row.resultCode == 'C4'" prop="activityId" style="width:18%"
                                  :rules="{ required : true, message : '请选择活动', trigger : 'change' }" >
                      <el-select size="small" v-model="scope.row.activityId" filterable >
                        <el-option v-for="item in scope.row.subActivities" :key="item.id" :label="item.activityName" :value="item.id" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="scope.row.resultCode == '串户'" prop="targetActCode" style="width:18%"
                                  :rules="{ required : true, message : '请选择活动', trigger : 'change' }" >
                      <el-select size="small" v-model="scope.row.targetActCode" filterable >
                        <el-option v-for="item in collatReport" :key="item.fscActivityCode" :label="item.fscActivityCode"
                                   :value="item.fscActivityCode" :disabled="expendObj.row.fscActivityCode == item.fscActivityCode" ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item v-if="scope.row.resultCode == '时间性差异'" prop="targetDate" style="width:18%"
                                  :rules="{ required: true, message: '请选择日期', trigger: 'change'  }" >
                      <el-date-picker v-model="scope.row.targetDate" type="date" placeholder="选择日期" 
                                      value-format="yyyy-MM-dd" :picker-options="pickerOptions" ></el-date-picker>
                    </el-form-item>
                    <el-form-item prop="remark" style="width:31%" >
                      <el-input v-model="scope.row.remark" ></el-input>
                    </el-form-item>
                  </el-form>
                  <span v-if="isAuditStateShow(scope.row)" class="icon-span">{{auditStatusMap[scope.row.auditState]}}</span>
                  <span v-if="!scope.row.isEdit" >{{scope.row.amount}}</span>
                </template>
              </el-table-column>
              <el-table-column property="resultCode" label="调整类型" header-align="center" align="center" column-key="adjustTypeOpts" >
                <template slot-scope="scope" >
                  <span v-if="!scope.row.isEdit" >{{scope.row.resultCode}}</span>
                  <span v-if="!scope.row.isEdit && scope.row.targetActCode" >{{scope.row.targetActCode}}</span>
                  <span v-if="!scope.row.isEdit && scope.row.targetDate" >{{scope.row.targetDate}}</span>
                </template>
              </el-table-column>
              <el-table-column property="remark" label="原因备注" header-align="center" align="center" >
                <template slot-scope="scope" >
                  <span v-if="!scope.row.isEdit && scope.row.remark && scope.row.remark.length < 9" :title="scope.row.remark"  >{{scope.row.remark}}</span>
                  <span v-if="!scope.row.isEdit && scope.row.remark && scope.row.remark.length > 8" :title="scope.row.remark" >{{scope.row.remark.substring(0,8)}}...</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="" width="200"  >
                <template slot-scope="scope" > 
                  <el-button v-if="scope.row.isEdit"  type="text" class="link-btn" @click="saveAdjustItem(expendObj.$index,scope.$index)" >保存</el-button>
                  <el-button v-if="(((scope.row.resultCode != '非SPF手工账务' && scope.row.resultCode != 'SPF手工账务') || !scope.row.voucherId)) && scope.row.auditState != 1" type="text" class="link-btn" @click.native.prevent="deleteRow(scope.$index, expendObj.row.cashaResults)" >删除</el-button>
                  <el-button v-if="!scope.row.isEdit && scope.row.resultCode == '非SPF手工账务' && !scope.row.voucherId" type="text" class="link-btn" @click="toManualAccounting('2',scope.row.id,scope.row.amount)" >手工账务</el-button>
                  <el-button v-if="!scope.row.isEdit && scope.row.resultCode == 'SPF手工账务' && !scope.row.voucherId" type="text" class="link-btn"  @click="toManualAccounting('1',scope.row.id,scope.row.amount)" >手工账务</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-button size="small"  class="full-btn border-dashed" @click="newAdjustItem(expendObj.$index)" ><i class="el-icon-plus" ></i></el-button>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="fscActivityCode" label="活动名称" ></el-table-column>
        <el-table-column prop="bohConfirmAmount" label="BOH实收金额" ></el-table-column>
        <el-table-column prop="billAmount" label="第三方账单" ></el-table-column>
        <el-table-column prop="orAmount" label="未定位差异金额" ></el-table-column>
        <el-table-column prop="totalAmount" label="差异金额合计" >
          <template slot-scope="scope" >
            {{scope.row.totalAmount}}
            <el-button size="small" v-if="scope.row.orderCheckStatus == '2'"  type="text" class="link-btn li-order-check-detail" @click="viewSingleOrderDiff(scope.row.fscActivityCode)" >订单级核对差异</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="附件" >
          <template slot-scope="scope" >
            <el-button type="text" class="link-btn" @click="showAttachDialog(scope.row)" >附件 <template v-if="scope.row.files.length" >(有附件)</template></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="附件" :visible.sync="attatchDialogVisible" width="30%" @closed="attachDialogClosed" :close-on-click-modal="false"  >
      <div  v-loading="loadFile"
            element-loading-text = "上传中..."
            element-loading-spinner = "el-icon-loading"
            element-loading-background = "transparent">
        <el-upload  class="upload-demo"
                    :action="uploadUrl"
                    :on-preview ="handlePreview"
                    :on-success ="uploadSucceed"
                    :on-remove  ="handleRemove"
                    multiple :before-upload="beforeUpload"
                    :before-remove="beforeRemove"
                    :file-list="fileObjTemp.files">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </div>
    </el-dialog>

    <!-- 订单级核对差异Dialog -->
    <el-dialog title="选择活动数据" custom-class="order-check-dialog" :visible.sync="orderDetailCheckDialogVisible" :close-on-click-modal="false" >
      <div class="top-control" >
          <div class="btn-group" >
            <el-button size="small"  type="success" @click="detailDownload(orderCheckDetail.activityCode)" >下载明细</el-button>
          </div>
          <el-form ref="actMainInfo" class="act-main-info" label-position="top" >
            <el-row >
              <el-col :span="4">
                <el-form-item label="活动名称" >
                  <span>{{orderCheckDetail.activityCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" >
                <el-form-item label="营业日期" >
                  <span>{{orderCheckDetail.bizDate}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row >
              <el-col :span="4">
                <el-form-item label="BOH数据">
                  <span>{{orderCheckDetail.orderAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="第三方账单数据" >
                  <span>{{orderCheckDetail.billAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="差异金额">
                  <span>{{orderCheckDetail.diffAmount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="BOH订单数量">
                  <span>{{orderCheckDetail.orderCount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="第三方账单数量">
                  <span>{{orderCheckDetail.billCount}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="差异数量">
                  <span>{{orderCheckDetail.diffCount}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <el-table :data="orderChedkDetailGridData" style="width: 100%" border >
          <el-table-column >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >金额无差异</span>
              <span v-else-if="scope.$index == 1" >金额有差异</span>
              <span v-else-if="scope.$index == 2" >BOH有，账单无</span>
              <span v-else >账单有，BOH无</span>
            </template>
          </el-table-column>
          <el-table-column prop="billAmount" label="订单金额" >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >{{orderCheckDetail.amountNoDiffAmount}}</span>
              <span v-else-if="scope.$index == 1" >{{orderCheckDetail.amountDiffAmount}}</span>
              <span v-else-if="scope.$index == 2" >{{orderCheckDetail.orderOnlyAmount}}</span>
              <span v-else >{{orderCheckDetail.billOnlyAmount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="billNum" label="订单数量" >
            <template slot-scope="scope">
              <span v-if="scope.$index == 0" >{{orderCheckDetail.amountNoDiffCount}}</span>
              <span v-else-if="scope.$index == 1" >{{orderCheckDetail.amountDiffCount}}</span>
              <span v-else-if="scope.$index == 2" >{{orderCheckDetail.orderOnlyCount}}</span>
              <span v-else >{{orderCheckDetail.billOnlyCount}}</span>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>
<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import ip from '../../../../model/tempIp'
	export default {
    name:'BOHandThirdPartBillAdjust',
    activated(){
      let params  = JSON.stringify(this.$route.query);
      if(params !== this.stashParams){
        this.stashParams = params;
      }
    },
    deactivated(){},
    created(){},
    beforeMount(){
      this.searchObj = Object.assign({},this.$route.query);
      this.getAdjustType();
      this.getAccountingPermission();
    },
    mounted(){
      this.getData();
    },
		data() {
			return {
        hasAccountingPerssion : false,
        attatchDialogVisible : false,
        uploadDown    : false,
        stashParams   : '',
        uploadUrl     : '',
        searchObj     : {},
        pickerOptions : {
          disabledDate: (time) => {
            let currentDay = new Date(this.storeObj.bizDate).getTime();
            let beforDay = new Date(this.storeObj.bizDate).getTime() - 24*60*60*1000;
            let afterDay = new Date(this.storeObj.bizDate).getTime() + 24*60*60*1000;
            //console.log(this.storeObj.bizDate);
            return time.getTime() < currentDay && time.getTime() > beforDay;
          }
        },
        //暂存文件对象
        fileObjTemp: {
          id : '',
          files : []
        },
        loadFile:false,
        fileCount:0,
        //
        adjustTypeOpts:[],
        storeObj    : {},
        collatReport:[],
        orderDetailCheckDialogVisible : false,
        orderCheckDetail : {},
        orderChedkDetailGridData : [{},{},{},{}],
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
        auditStatusMap:['待审核','审核通过','退回']
			}
    },
    watch: {
    },
    methods: {
      //
      isAuditStateShow(rowObj){
        if(rowObj.auditState!=1 && this.auditStatusMap[rowObj.auditState]){
          if(rowObj.resultCode != '非SPF手工账务' && rowObj.resultCode != 'SPF手工账务'){
            return true;
          }else if(rowObj.voucherId){
            return true;
          }
        }else{
          return false;
        }
      },
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
      getAdjustType(){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : '当前活动'
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          if(res.code === 200){
            _self.adjustTypeOpts = res.data;
          }else{
            _self.adjustTypeOpts = [];
          }
        })
      },
      beforeUpload(file) {
        let _self = this;
        this.loadFile = true;
        return new Promise((resolve, reject) => {
          this.$nextTick(() => {
            _self.uploadUrl = ip.store + '/file-upload/attachment?source=cashadetail&foreignId=' + _self.fileObjTemp.id        
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
      beforeRemove(file, fileList){
        return  this.$confirm(`确定移除 ${ file.name }？`);
      },
      //删除file
      handleRemove(file, fileList) {
        let _self = this;
        let param = this.common.formatPathParam({
          id : file.id
        })
        apiStore.deleteCheckAttachMent(param,function(res){
          _self.uploadDown = true;
          _self.fileCount  = fileList.length;
        //   _self.common.messageUtil({
        //   message: 'y',
        //   type: 'success'
        // });
        });
      },
      //上传成功
      uploadSucceed(response, file, fileList) {
        let _self = this;
        this.fileCount++;
        if(fileList.length == this.fileCount){
          this.loadFile = false;
        }
        this.uploadDown = true;
      },
      //附件弹框
      showAttachDialog(rowObj) {
        let _self = this;
        this.fileObjTemp = Object.assign({},{
          id    : rowObj.id,
          files : []
        });
        this.fileObjTemp.files = rowObj.files.concat();
        this.fileCount = this.fileObjTemp.files.length;
        this.attatchDialogVisible = true;
      },
      attachDialogClosed(){
        //this.fileCount = 0;
        if(this.uploadDown){
          this.uploadDown = false;
          this.getData();
        }
      },
      //渲染合并行
      renderColspan({ row, column, rowIndex, columnIndex }){
        if(row.isEdit){
          if(columnIndex === 0){
            return [1, 3];
          }else if (columnIndex === 3){
            return [1, 2];
          }else{
            return [0, 0];
          }
        }
      },
      //新增调整条目
      newAdjustItem(rowIndex){
        let _self = this;
        let param = this.common.formatPathParam({
          activityCode : this.collatReport[rowIndex].fscActivityCode
        });
        this.collatReport[rowIndex].cashaResults.push({
          targetActCode : '',
          targetDate : '',
          isEdit : true,
          subActivities : []
        });
        let curCashResultsIndex = this.collatReport[rowIndex].cashaResults.length - 1;
        apiStore.getSubActivities(param,function(res){
          if(res.code === 200){
            _self.collatReport[rowIndex].cashaResults[curCashResultsIndex].subActivities = res.data.concat();
          }else{
            _self.collatReport[rowIndex].cashaResults[curCashResultsIndex].subActivities = []
          }
        })
        
      },
      //删除行
      deleteRow(index, rows) {
        let _self = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(rows[index].id){
            let param = this.common.formatPathParam({
              id : rows[index].id
            });
            apiStore.deleteBohBillAdjust(param,function(res){
              if(res.code === 200){
                _self.getData();
              }else{
                _self.common.errorMessage(res.msg);
              }
            })
          }else{
            rows.splice(index, 1);
          }
        }).catch(() => {
        });
      },
      toEdit(expendIndex,detailItemIndex){
        let _self = this;
        this.$set(this.collatReport[expendIndex].cashaResults[detailItemIndex],'isEdit',true);
        //this.$set(this.collatReport[expendIndex].cashaResults[detailItemIndex],'isEdit',true);
        //this.collatReport[expendIndex].cashaResults[detailItemIndex].isEdit = true;
      },
      //保存调整条目
      saveAdjustItem(expendIndex,detailItemIndex){
        let _self = this;
        this.$refs['adjustDetailItemForm_' + detailItemIndex].validate((valid) => {
          if(valid){
            let currentActObj = _self.collatReport[expendIndex];
            let currentAdjustObj = _self.collatReport[expendIndex].cashaResults[detailItemIndex];
            let param = { 
              amount : currentAdjustObj.amount,
              remark : currentAdjustObj.remark,
              cashaDetailId : currentActObj.id,
              resultCode    : currentAdjustObj.resultCode,
              targetActCode : currentAdjustObj.targetActCode,
              targetDate    : currentAdjustObj.targetDate,
              activityId    : currentAdjustObj.activityId
            };
            apiStore.saveBohBillAdjust(param,function(res){
              if(res.code == 200){
                if(currentAdjustObj.resultCode == 'SPF手工账务' || currentAdjustObj.resultCode == '非SPF手工账务'){
                  _self.$set(_self.collatReport[expendIndex].cashaResults[detailItemIndex],'isEdit',false);
                  _self.$set(_self.collatReport[expendIndex].cashaResults[detailItemIndex],'id',res.data);
                  let accountingType = currentAdjustObj.resultCode == 'SPF手工账务'? '1' : '2';
                  _self.toManualAccounting(accountingType,res.data,currentAdjustObj.amount);
                }else{
                  _self.common.messageUtil({
                    message: '保存成功',
                    type: 'success'
                  });
                  //_self.$set(_self.collatReport[expendIndex].cashaResults[detailItemIndex],'isEdit',false);
                  _self.getData();
                }
                
              }else{
                _self.common.errorMessage(res.msg);
              }
            })
            // _self.$set(_self.collatReport[expendIndex].cashaResults[detailItemIndex],'isNew',false);
            // _self.$set(_self.collatReport[expendIndex].cashaResults[detailItemIndex],'isEdit',false);
            //_self.$set(_self.cashaResults[detailItemIndex],'isNew',false);
            //TDO
            // api.saveAdjustItem(null,function(result){
            //    _self.$set(_self.cashaResults[$index],'isNew',false);
            // });
          }
        })

      },
      //查询列表
      getData(){
        let _self = this;
        let param = this.common.formatPathParam(this.searchObj);
        apiStore.bohAndBillCheckDetail(param,function(result){
          if(result.code == 200){
            _self.storeObj = {
              storeCode  : result.data.storeCode,
              bizDate    : result.data.bizDate,
              overshort  : result.data.overshort,
              companyJde : result.data.companyJdeCode
            }
            _self.collatReport = result.data.dtos;
          }else{
            _self.common.errorMessage(result.msg);
          }
        })
      },
      //查看所有订单及差异
      viewAllOrderDiff(){
        let _self = this;
        let param = {
          storeCode : this.storeObj.storeCode,
          bizDate   : this.storeObj.bizDate,
        };
        window.localStorage.setItem('CheckDetailInOrdersParam',JSON.stringify(param));
        let searchObj = this.common.formatPathParam(param);
        apiStore.getAllCheckDetailInOrders(searchObj,function(result){
          if(result.code == 200){
            _self.$router.push({
              name : 'AllCheckDetailInOrders',
              query : param
            });
          }else if(result.code == 404){
            _self.common.messageUtil({
              message : result.msg,
              type    : 'warning'
            });
          }
        })
      },
      //查看单条订单及核对差异
      viewSingleOrderDiff(activityCode){
        let _self = this;
        let param = this.common.formatPathParam({
          activityCode : activityCode,
          bizDate      : this.searchObj.bizDate,
          storeCode    : this.searchObj.storeCode
        });
        apiStore.getSingleCheckDetailInOrder(param,function(res){
          if(res.code == 200){
            _self.orderCheckDetail = Object.assign({},res.data);
          }else{
            _self.orderCheckDetail = {};
          };
          _self.orderDetailCheckDialogVisible = true;
        })
      },
      detailDownload(activityCode){
        let _self = this;
        let param = {
          activityCode : activityCode,
          bizDate   : this.searchObj.bizDate,
          storeCode : this.searchObj.storeCode
        };
        apiStore.exportOrderCheckDetail(param,'application/octet-stream',function(res){
          if(res.code){
            _self.common.messageUtil({
              message: res.msg,
              type: 'warning'
            });
          }else{
            let link = document.createElement('a');
            link.href = res;
            link.download = '订单明细.zip'
            link.target = '_blank';link.click();
          }
        })
      },
      //跳转至手工分录
      toManualAccounting(accountingType,id,checkAmount){
        let _self = this;
        let param = {
          type : accountingType == 1? 'SPF手工账务' : '非SPF手工账务',
          source : 6,
          id : id,
          checkAmount : checkAmount
        };
        window.localStorage.setItem('storeManualAccountingParams',JSON.stringify(param));
        this.$router.push({
          name : 'StoreManualAccounting',
          query: {source: 'BOHAdjust',companyJde : _self.storeObj.companyJde},
          params : param
        });
      },
      //计算阈值
      calculate(){
        let _self = this;
        let param = this.common.formatPathParam({
          id : this.collatReport[0].cashaMainId
        });
        apiStore.thresholdCheck(param,function(res){
          if(res.code === 200){
            _self.common.messageUtil({
              message  : res.data,
              type     : 'success',
              duration : 5000
            });
            _self.getData();
          }else{
            _self.common.errorMessage(res.msg);
          }
        })
      }
    }
	}
</script>
<style lang="scss">
  @import '../../../../assets/scss/dataCheckStore';
  // .adjust-detail-tbl{
  //   .el-form-item{
  //     margin-bottom: 0;
  //   }
  // }
  .order-check-dialog{
    .top-control{
      .btn-group{
        position: absolute;
        right: 0;
        z-index: 2000;
      }
    }
    .el-form-item__label{
      line-height: 20px;
    }
    .el-form-item__content{
      line-height: 20px;
    }
  }
  .icon-span{
    //border: 1px solid #56cd74;
    //color: #56cd74;
    display: inline-block;
    height: 23px;
    line-height: 22px;
    padding: 0 3px;
    position: absolute;
    left: 25px;
  }
</style>









