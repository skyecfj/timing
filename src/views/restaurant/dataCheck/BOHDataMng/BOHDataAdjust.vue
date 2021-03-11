<!--cash_a表-->
<template>
  <div>
    <div class="content" >
      <div class="top-control" >
        <div class="store-main-info" >
          <p>餐厅编号：{{storeObj.storeCode}}&nbsp;&nbsp;&nbsp;营业日期：{{storeObj.bizDate}}</p>
          <!-- <p>当前状态：{{storeObj.auditState}}</p> -->
        </div>
      </div>
      <el-table :data="tblData" style="width: 100%" :border="true" @row-click="dataAdjust" :row-class-name="tableRowClassName" >
        <el-table-column prop="cashaDetail.fscActivityCode" label="FSC活动" width="130"></el-table-column>
        <el-table-column prop="cashaDetail.bohSysAmount" label="BOH应收金额" ></el-table-column>
        <el-table-column prop="cashaDetail.bohConfirmAmount" label="BOH实收金额" ></el-table-column>
        <el-table-column prop="adjustmentAmountSum" label="财务手工调整" >
          <!-- <template slot-scope="scope" >
            <el-button type="text" class="link-btn" >{{scope.row.adjustmentAmountSum}}</el-button>
          </template> -->
        </el-table-column>
        <el-table-column label="调整类型" :formatter="renderAdjustType" ></el-table-column>
        <el-table-column label="原因备注" :formatter="renderAdjustResult"></el-table-column>>
        <el-table-column prop="" label="附件" >
          <template slot-scope="scope" >
            <el-button v-if="!cannotAdjust.includes(scope.row.cashaDetail.fscActivityCode)"  type="text" class="link-btn" @click="showAttachDialog(scope.row,scope.$index,'totalView')" >附件</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 附件弹框 -->
    <el-dialog title="附件" :visible.sync="attachmentDialogVisible" width="30%"
               :close-on-click-modal="false" :custom-class="attachmentDialogType === 'upload'? 'upload-file-dialog' : 'view-file-dialog'" >
      <div  v-loading="loadFile"
            element-loading-text = "上传中..."
            element-loading-spinner = "el-icon-loading"
            element-loading-background = "transparent">
        <el-upload
          :class="attachmentDialogType === 'view'? 'view-file' : 'upload-file'"
          :action="uploadUrl"
          :on-preview ="handlePreview"
          :on-success ="uploadSucceed"
          :on-error="uploadError"
          :on-remove  ="handleRemove"
          multiple :before-upload="beforeUpload"
          :file-list="fileObjTemp.files">
          <el-button size="small" type="primary" v-if="attachmentDialogType === 'upload'">点击上传</el-button>
          <div slot="tip" class="el-upload__tip"></div>
        </el-upload>
      </div>
    </el-dialog>
    <!-- Table -->
    <el-dialog title="手工调整" :visible.sync="adjustDialogTableVisible" custom-class="adjust-dialog" @closed="adjustDialogClosed" >
      <el-row class="view-form" >
        <p>{{currentAdjustItem.fscActivityCode}}</p>
        <p>实收金额：{{currentAdjustItem.BOHActualAmount}}</p>
      </el-row>
      <el-table :data="adjustDetails" :span-method="renderColspan">
        <el-table-column property="adjustmentAmount" label="调整金额" width="120" header-align="center" align="center" >
          <template slot-scope="scope" >
            <el-form  v-if="scope.row.isNew" :inline="true" :model="scope.row" :ref="'adjustDetailItemForm_'+scope.$index" class="adjust-detail-form" >
              <el-form-item prop="adjustmentAmount" style="width:17%" :rules="{ required : true, message : '请输入调整金额', trigger : 'blur' }" >
                <el-input v-model.trim="scope.row.adjustmentAmount"></el-input>
              </el-form-item>
              <el-form-item prop="resultCode" style="width:15%" :rules="{ required : true, message : '请选择调整类型', trigger : 'change' }" >
                <el-select size="small" v-model="scope.row.resultCode" placeholder="调整类型" filterable @change="(val)=>{resultCodeChange(val,scope.$index)}" >
                  <el-option v-for="(item,index) in adjustTypeOpts" :key="item.adjustType+'_'+scope.$index+'_'+index" :label="item.adjustType" :value="item.adjustType"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="fscActivityCode" style="width:25%" :rules="{ required : true, message : '请选择调整对象', trigger : 'blur' }" >
                <el-input v-model.trim="scope.row.fscActivityCode" disabled ></el-input>
                <!-- <el-select size="small" v-model="scope.row.fscActivityCode" placeholder="调整对象" filterable >
                  <el-option  v-for="(item,index) in tblData" :key="item.cashaDetail.fscActivityCode+'_'+scope.$index+'_'+index" :label="item.cashaDetail.fscActivityCode" :value="item.cashaDetail.fscActivityCode" 
                              v-if="item.cashaDetail.fscActivityCode != currentAdjustItem.fscActivityCode && !cannotAdjust.includes(item.cashaDetail.fscActivityCode)"></el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item prop="remark" style="width:29%" >
                <el-input v-model.trim="scope.row.remark" ></el-input>
              </el-form-item>
              <el-form-item style="width:5%;margin-right:0;" >
                <el-button type="text" class="link-btn" @click="showAttachDialog(scope.row,scope.$index,'upload')" >附件</el-button>
              </el-form-item>
            </el-form>
            <span v-if="scope.row.auditState === 0" class="icon-span">待审核</span>
            <span v-if="scope.row.auditState === 2" class="icon-span">已退回</span>
            &nbsp;&nbsp;&nbsp;
            <span v-if="!scope.row.isNew" >{{scope.row.adjustmentAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column property="resultCode" label="调整类型" width="120" header-align="center" align="center" column-key="adjustTypeOpts" >
          <template slot-scope="scope" >
            <span v-if="!scope.row.isNew" >{{scope.row.resultCode}}</span>
          </template>
        </el-table-column>
        <el-table-column property="fscActivityCode" label="调整对象" width="150" header-align="center" align="center" column-key="adjustItems" >
          <template slot-scope="scope" >
            <span v-if="!scope.row.isNew" >{{scope.row.fscActivityCode}}</span>
          </template>
        </el-table-column>
        <el-table-column property="remark" label="原因备注" width="205" header-align="center" align="center" >
          <template slot-scope="scope" >
            <span v-if="!scope.row.isNew" >{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column label="附件" width="50" header-align="center" align="center" >
          <template slot-scope="scope" >
            <el-button type="text" class="link-btn" @click="showAttachDialog(scope.row,scope.$index,'view')" >附件</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="" label="" width="90" >
          <template slot-scope="scope" >
            <div :class="scope.row.isNew? 'edit-control-column' : ''">
              <el-button v-if="scope.row.isNew"  type="text" class="link-btn" @click="saveAdjustItem(scope.row,scope.$index)" >保存</el-button>
              <el-button v-if="scope.row.auditState != 1" type="text" class="link-btn" @click="deleteAdjustItem(scope.row,scope.$index)" >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button v-if="adjustTypeOpts.length"  size="small"  class="full-btn border-dashed" @click="newAdjustItem" ><i class="el-icon-plus" ></i></el-button>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adjustDialogTableVisible = false">关  闭</el-button>
        <!-- <el-button type="primary" @click="saveAdjustItem">保 存</el-button> -->
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import ip from '../../../../model/tempIp'

	export default {
    name:'BOHDataAdjust',
    activated(){
      // let params  = JSON.stringify(this.$route.query);
      // if(params !== this.stashParams){
      //   this.stashParams = params;
      //   //this.getData();
      // }
    },
    deactivated(){},
    created(){},
    beforeMount(){
      this.getSelectOpts();
      this.uploadUrl = ip.store + '/file-upload/upload?source=cashaResult';
    },
    mounted(){
      let params  = JSON.stringify(this.$route.query);
      if(params !== this.stashParams){
        this.stashParams = params;
        //this.getData();
      }
      this.getData();
    },
		data() {
			return {
        attachmentDialogVisible  : false,
        adjustDialogTableVisible : false,
        attachmentDialogType : 'upload',
        stashParams  : '',
        loadFile  : false,
        uploadUrl : '',
        //暂存文件对象
        fileObjTemp: {
          id : '',
          files : []
        },
        //
        fileObjForSubmit: {},
        searchObj:{
          resCode: '',
          verifyStartTime: '',
          verifyEndTime: ''
        },
        cannotAdjust : ['含税收入'],
        needAudit : ['营业总额','折扣'],
        storeObj:{},
        currentAdjustItem : {},
        adjustDetails:[],
        adjustTypeOpts : [],
        adjustItems: [],
        tblData:[],
        adjustDown:false,
        needReload:false
			}
		},
    methods: {
      //search组件 范围变量变化
      rangeDatechange(emitObj){
        let _self = this;
        for(let searchKey in pageUtil.searchConfigAdjust.searchObj){
          for(let emitObjKey in emitObj){
            if(searchKey == emitObjKey){
              pageUtil.searchConfigAdjust.searchObj[searchKey] = emitObj[emitObjKey];
            }
          }
        }
      },
      tableRowClassName({row, rowIndex}) {
        if(row.cashaDetail.fscActivityCode){
          //let curFscActivityCode = row.cashaDetail.fscActivityCode;
          let fscAcitvityType = row.cashaDetail.fscActivityCode.substring(0,4);
          if(row.cashaDetail.fscActivityCode == '营业总额' || row.cashaDetail.fscActivityCode == '折扣' || fscAcitvityType == '平衡调整') {
            if(row.cashaDetail.fscActivityCode == '平衡调整 - FSC'){
              return 'summury-row border-bottom';
            }else{
              return 'summury-row';
            }
          }else{
            return '';
          }
        }else{
          return '';
        }
        
      },
      //获取下拉框选项
      getSelectOpts(){
        let _self = this;
        // let searchParam  = this.common.formatPathParam({
        //   pageIndex : 1,
        //   pageSize  : 999999
        // });
        // //获取调整类型
        // api.getBOHSubjectList(searchParam,function(result){
        //   if(result.code === 200){
        //     _self.adjustTypeOpts = result.data.list;
        //   }else{
        //     _self.adjustTypeOpts = [];
        //   }
        // });
        //获取调整对象 本身不可选 TDO
        this.adjustItems = this.tblData;
      },
      beforeUpload(file) {
        this.loadFile = true;
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
        this.adjustDetails[index].files.push(response.data);
        let succeedFileLength = this.adjustDetails[index].files.length;
        if(succeedFileLength == flieNum){
          this.loadFile = false;
        }
        //this.updateFileObjForSubmit(fileList);
      },
      //更新fileObjForSubmit
      updateFileObjForSubmit (fileList){
        let _self = this;
        let index = this.fileObjTemp.index;
        this.adjustDetails[index].files = [];
        this.adjustDetails[index].files = fileList.concat();
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
      //保存已上传的fileList
      saveAttach() {
        console.log(this.fileObjForSubmit);
      },
      //附件弹框
      showAttachDialog(rowObj,index,dialogType) {
        let _self = this;
        this.fileObjTemp = Object.assign({},{
          id    : rowObj.id,
          index : index
        });
        let tempFiles = [];
        if(dialogType == 'totalView'){
          tempFiles = this.getAllAttachments(rowObj).concat();
        }else{
          tempFiles = rowObj.files.concat();
        }
        this.fileObjTemp.files = [];
        this.fileObjTemp.files = tempFiles.concat();
        if(this.fileObjTemp.files.length > 0 || dialogType === 'upload'){
          this.attachmentDialogType = dialogType;
          this.attachmentDialogVisible = true;
        }else{
          this.common.messageUtil({
            message : '暂无附件',
            type    : 'warning'
          })
        }
        
      },
      resultCodeChange(curResultCode,rowIndex){
        let _self = this;
        this.adjustTypeOpts.forEach(function(item,index){
          if(item.adjustType == curResultCode){
            _self.adjustDetails[rowIndex].fscActivityCode = item.bohProject1 == _self.currentAdjustItem.fscActivityCode? item.bohProject2 : item.bohProject1;
          }
        })
      },
      //获取所有附件
      getAllAttachments(rowObj){
        let _self = this;
        let files = [];
        rowObj.bohSpecialAdjustmentDtlDtos.forEach(function(item,index){
          files = files.concat(item.files);
        });
        return files;
      },
      renderAdjustType(row, column, cellValue, index){
        let tempAdjustDetail = ''
        row.bohSpecialAdjustmentDtlDtos.forEach(function(item,index){
            tempAdjustDetail += item.resultCode +';'
        });
        if(tempAdjustDetail.length > 8){
            return tempAdjustDetail.substring(0,7) + '...'
        }else{
            return tempAdjustDetail;
        }
      },
      renderAdjustResult(row, column, cellValue, index){
        let tempAdjustResult = ''
        row.bohSpecialAdjustmentDtlDtos.forEach(function(item,index){
          if(item.remark){
            tempAdjustResult += item.remark +';'
          }
        });
        if(tempAdjustResult.length > 8){
            return tempAdjustResult.substring(0,7) + '...'
        }else{
            return tempAdjustResult;
        }
      },
      //查询列表
      getData(){
        let _self = this;
        let param = JSON.parse(this.stashParams);
        apiStore.getBohAbnormalDetail(this.common.formatPathParam(param),function(res){
          if(res.code === 200){
            _self.storeObj = {
              storeCode  : res.data.storeCode,
              bizDate    : res.data.bizDate,
              auditState : res.data.auditState
            }
            _self.tblData = res.data.cashaDetailAdjustmentVos;
          }else if(res.code === 404){
            _self.tblData = []
          }else{
            _self.common.errorMessage(res.msg)
          }
        });
      },
      reset(){
        pageUtil.searchConfigAdjust.searchObj.reset = true;
      },
      //手工调整
      dataAdjust(row, event, column){
        let _self = this;
        //TDO
        // api.getAdjustDetail(null,function(result){
        //   _self.adjustDetails = result.data;
        // });
        if(column.label != '附件' && !this.cannotAdjust.includes(row.cashaDetail.fscActivityCode)){
          this.needReload = false;
          this.currentAdjustItem = {
            fscActivityCode : row.cashaDetail.fscActivityCode,
            BOHActualAmount : row.cashaDetail.bohConfirmAmount,
            cashaDetailId   : row.cashaDetail.id
          }
          this.adjustDetails = row.bohSpecialAdjustmentDtlDtos.concat();
          this.getAdjustTypeOpts();
          this.adjustDialogTableVisible = true;
        }
      },
      getAdjustTypeOpts(){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : this.currentAdjustItem.fscActivityCode
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          _self.adjustTypeOpts = [];
          if(res.code === 200){
            res.data.forEach(function(item,index){
              if(item.bohProject1 != '当前活动' && item.bohProject2 != '当前活动' && item.bohProject1 != '现金' && item.bohProject2 != '现金'){
                _self.adjustTypeOpts.push(item);
              }
            })
          }
        })
      },
      //渲染合并行
      renderColspan({ row, column, rowIndex, columnIndex }){
        if(row.isNew){
          if(columnIndex === 0){
            return [1, 5];
          }else if (columnIndex === 5){
            return [1, 2];
          }else{
            return [0, 0];
          }
        }
      },
      //加载手工调整条目（区分）
      renderAdjustItem(row, column, cellValue, index){
        let _self = this;
      },
      //新增调整条目
      newAdjustItem(){
        let _self = this;
        this.adjustDetails.push({
          isNew : true,
          files : []
        })
      },
      //删除调整条目
      deleteAdjustItem(detailItem,dx){
        let _self = this;
        if(detailItem.cashaResultId){
          let curNeedAudit = this.needAudit.includes(this.currentAdjustItem.fscActivityCode) || this.needAudit.includes(detailItem.fscActivityCode)
          let confirmText = (curNeedAudit && detailItem.auditState != 0 &&  detailItem.auditState != 2)? '含税收入调整需审核' : '确定删除?';
          this.$confirm(confirmText, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // let tempAdjustDetails = this.common.removeIndex(_self.adjustDetails,dx);
            // this.adjustDetails = tempAdjustDetails;
            let param = _self.common.formatPathParam({
              cashaResultId : detailItem.cashaResultId
            })
            apiStore.delBohAbnormalAsjustItem(param,function(result){
              if(result.code === 200){
                if(curNeedAudit){
                  _self.adjustDialogTableVisible = false;
                  _self.getData();
                }else{
                  _self.adjustDown = true;
                  _self.reloadAdjustDetail();
                }
              }else{
                _self.adjustDown = true;
                _self.common.errorMessage(result.msg);
              }
            });
          }).catch(() => {

          });
        }else{
          let tempAdjustDetails = this.common.removeIndex(_self.adjustDetails,dx);
          this.adjustDetails = tempAdjustDetails;
        }
      },
      //保存调整条目
      saveAdjustItem(detailItem,$index){
        let _self = this;
        this.$refs['adjustDetailItemForm_' + $index].validate((valid) => {
          if(valid){
            //_self.$set(_self.adjustDetails[$index],'isNew',false);
            if(_self.needAudit.includes(_self.currentAdjustItem.fscActivityCode) || _self.needAudit.includes(detailItem.fscActivityCode)){
              _self.$confirm('含税收入调整需审核','提示',{
                confirmButtonText : '确定',
                cancelButtonText  : '取消',
                type : 'warning'
              }).then(() => {
                _self.needReload = true;
                _self.doSaveAdjust(detailItem);
              }).catch(() => {})
            }else{
              _self.needReload = false;
              _self.doSaveAdjust(detailItem);
            }
            //TDO
            // api.saveAdjustItem(null,function(result){
            //    _self.$set(_self.adjustDetails[$index],'isNew',false);
            // });
          }
        })
      },
      doSaveAdjust(detailItem){
        let _self = this;
        let adjustSaveObj = {};
        adjustSaveObj.cashaDetailId = _self.currentAdjustItem.cashaDetailId;
        adjustSaveObj.bohSpecialAdjustmentDtlDtoList = [];
        let tempAdjustItem = Object.assign({},detailItem);
        delete tempAdjustItem.isNew;
        adjustSaveObj.bohSpecialAdjustmentDtlDtoList.push(tempAdjustItem);
        //console.log(adjustSaveObj);
        apiStore.doBohAbnormalAdjust(adjustSaveObj,function(res){
          if(res.code === 200){
            if(_self.needReload){
              _self.adjustDialogTableVisible = false;
              _self.getData();
            }else{
              _self.adjustDown = true;
              _self.reloadAdjustDetail();
            }
          }else{
            _self.adjustDown = true;
            _self.common.errorMessage(res.msg);
          }
        })
      },
      reloadAdjustDetail(){
        let _self = this;
        let param = this.common.formatPathParam({
          cashaDetailId : this.currentAdjustItem.cashaDetailId
        })
        apiStore.getBohAbnormalAdjustDetail(param,function(res){
          if(res.code === 200){
            _self.adjustDetails = res.data.concat();
          }else if(res.code === 404){
            _self.adjustDetails = [];
          }
        })
      },
      adjustDialogClosed(){
        //this.fileCount = 0;
        if(this.adjustDown){
          this.adjustDown = false;
          this.getData();
        }
      },
    }
	}
</script>

<style lang="scss">
.store-main-info{
  margin-bottom: 10px;
  p{
    height: 32px;
    line-height: 32px;
  }
}
tr.el-table__row.summury-row {
  font-weight: 700;
}
tr.el-table__row.summury-row.border-bottom td {
    border-bottom: 1px solid #000;
}
.adjust-dialog{
  width: 800px;
  .el-dialog__body{
    padding-top: 10px;
    .el-table__header-wrapper{
      border-bottom: 1px solid #ebeef5;
      th.is-leaf{
        border-bottom: none;
      }
    }
    .el-table__body{
      .el-table__row{
        td{
          vertical-align: top;
        }
        .edit-control-column{
          padding-top: 3px;
        }
      }
    }
    .view-form{
      padding-left: 15px;
      p{
        padding-top: 5px;
      }
    }
    .el-form-item{
      margin-bottom: 0;
    }
  }
}
.el-dialog.view-file-dialog{
  .el-dialog__body {
    padding-top: 0;
    .el-upload-list__item-status-label,.el-icon-close,.el-icon-close-tip{
      display: none;
    }
  }  
} 
</style>









