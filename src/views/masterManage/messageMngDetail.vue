<template>
    <el-form :model="notificationForm" labelPosition="left" :rules="rules" ref="notificationForm">
      <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                 <el-form-item label="名称" prop="warnName">
                     <el-input size="small"  v-model.trim="notificationForm.warnName" placeholder="请输入通知名称" clearable class="sectionContent" :disabled="isEdit"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                  <el-form-item label="业务类型">
                    <el-select size="small"  v-model="notificationForm.warnType"  clearable filterable disabled class="sectionContent">
                        <el-option v-for="item in warnTypeOptions" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="业务场景">
                    <el-select size="small"  v-model="notificationForm.businessType"  clearable filterable disabled class="sectionContent">
                        <el-option v-for="item in businessTypeOptions" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="描述">
                    <el-input size="small"  placeholder="请输入通知描述"  v-model="notificationForm.description" clearable type="textarea" :disabled="isEdit" :autoSize="{minRows:10,maxRows:10}"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="regionalContent" v-for="(item,index) in notificationForm.listEarlyWarnConfigDetail" :key="index">
         <el-row>
            <el-col>
                <el-form-item class="borderBottomLine">
                    <span v-if="item.delayDay == '0'"></span>
                    <span v-else>
                     <span class="contentSpace">滞后</span>
                     <el-input-number size="small" number v-model="item.delayDay"  :min='1' @change="changeNotiCount" :disabled="isEdit"></el-input-number> <span class="contentSpace">天</span>
                    </span>
                    <span class="float-right" v-if="!isEdit">
                        <el-button size="small"  icon="el-icon-minus"  class="c-button--plain--danger c-button-icon-circle c-button--small"
                        @click="deleteMsgContent(index)" v-if="notificationForm.listEarlyWarnConfigDetail.length > 1"></el-button>
                        <el-button size="small"  icon="el-icon-plus"  class="c-button--plain c-button-icon-circle c-button--small"
                        @click="addMsgContent" v-if="index === notificationForm.listEarlyWarnConfigDetail.length -1 "></el-button>
                    </span>
                </el-form-item>
                <el-form-item label="通知方式" :prop="'listEarlyWarnConfigDetail.' +index+'.notiSendType'" :rules="rules.notiSendType">
                         <div class="notiWaySection">
                              <el-radio-group v-model="item.notiSendType" @change="changeSpecificNotiWay" >
                                  <el-radio :label="'0-'+index" :disabled="isEdit">消息</el-radio>
                                  <el-radio :label="'1-'+index" :disabled="isEdit">邮件</el-radio>
                              </el-radio-group>
                         </div>
                         </el-form-item>
                         <div class="notiContent">
                            <div class="taskContent notiContentDetail" v-if="item.notiSendType == defalutNotiWay+index">
                                <el-form-item label="通知对象"  class="itemTop">
                                    <div class="notiObjectContent">
                                        <el-input size="small"  v-model.trim="item.notifyAllInfo" placeholder="请添加通知对象"  class="notiObjectInput" readonly :disabled="isEdit"></el-input>
                                        <el-button size="small" class="c-button-icon--plain c-button-icon-circle" @click="addUser(index,'notifyPersonName',item.sendType)" v-if="!isEdit">
                                            <i class="fa fa-edit"></i>
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="通知组织"  class="itemTop">
                                    <div class="notiObjectContent">
                                        <el-input size="small"  v-model.trim="item.notifyOrganize" placeholder="请添加通知对象"  class="notiObjectInput" readonly :disabled="isEdit"></el-input>
                                        <el-button size="small" class="c-button-icon--plain c-button-icon-circle" @click="addOrg(index,'notifyOrganize')" v-if="!isEdit">
                                            <i class="fa fa-edit"></i>
                                        </el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item label="主题" :label-width="labelWidth" >
                                   <div class="itemLeft">
                                       <el-input size="small"  placeholder="请输入邮件主题"  v-model="item.modelTitle" clearable  :disabled="isEdit"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="正文" :label-width="labelWidth">
                                    <div class="editor-container">
                                      <Tinymce ref="editor" v-model="item.modelContext" v-bind:isDisabled="isEdit"/></Tinymce>
                                    </div>
                                </el-form-item>
                            </div>
                            <div class="emailContent notiContentDetail" v-if="item.notiSendType != defalutNotiWay+index">
                                <el-form-item label="收件人" :label-width="labelWidth" >
                                    <div class="itemLeft">
                                       <el-input size="small"  placeholder="请添加收件人" v-model="item.notifyAllInfo" readonly :disabled="isEdit"></el-input>
                                    </div>
                                    <el-button size="small"  class="c-button-icon--plain c-button-icon-circle" @click="addUser(index,'notifyPersonName',item.sendType)" v-if="!isEdit">
                                        <i class="fa fa-edit"></i>
                                    </el-button>
                                </el-form-item>
                                <el-form-item label="抄送"  :label-width="labelWidth">
                                    <div class="itemLeft">
                                       <el-input size="small"  placeholder="请添加收件人" v-model="item.copyAllInfo" readonly :disabled="isEdit"></el-input>
                                    </div>
                                    <el-button size="small"  class="c-button-icon--plain c-button-icon-circle" @click="addUser(index,'copyPersonName',item.sendType)" v-if="!isEdit">
                                        <i class="fa fa-edit"></i>
                                    </el-button>
                                </el-form-item>
                                <el-form-item label="收件组织"  :label-width="labelWidth">
                                    <div class="itemLeft">
                                       <el-input size="small"  placeholder="请添加收件组织" v-model="item.notifyOrganize" readonly></el-input>
                                    </div>
                                        <el-button size="small" class="c-button-icon--plain c-button-icon-circle" @click="addOrg(index,'notifyOrganize')" v-if="!isEdit">
                                            <i class="fa fa-edit"></i>
                                        </el-button>
                                </el-form-item>
                                 <el-form-item label="抄送组织"  :label-width="labelWidth">
                                    <div class="itemLeft">
                                       <el-input size="small"  placeholder="请添加抄送组织" v-model="item.notifyCopyOrganize" readonly></el-input>
                                    </div>
                                        <el-button size="small" class="c-button-icon--plain c-button-icon-circle" @click="addOrg(index,'notifyCopyOrganize')" v-if="!isEdit">
                                            <i class="fa fa-edit"></i>
                                        </el-button>
                                </el-form-item>
                                <el-form-item label="主题" :label-width="labelWidth">
                                    <div class="itemLeft">
                                       <el-input size="small"  placeholder="请输入邮件主题" v-model="item.modelTitle" clearable  :disabled="isEdit"></el-input>
                                    </div>
                                </el-form-item>
                                <el-form-item label="正文" :label-width="labelWidth">
                                    <div class="editor-container">
                                      <Tinymce ref="editor" v-model="item.modelContext" v-bind:isDisabled="isEdit"/></Tinymce>
                                    </div>
                                </el-form-item>
                            </div>
                         </div>
            </el-col>
         </el-row>
     </div>
    <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                <el-form-item label="更新时间">
                    <el-input size="small"  v-model.trim="notificationForm.updateTime" class="sectionContent" disabled></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                    <el-input size="small"  v-model.trim="notificationForm.updatePerson" class="sectionContent" disabled></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
     <div class="opreaContent" v-if="!isEdit">
         <el-button size="small"   @click="cancel" plain class="c-button c-button--plain">取消</el-button>
         <el-button size="small"   @click="save" class="c-button c-button--primary">保存</el-button>
     </div>
     <el-dialog  :visible.sync="organizationDialog" class="dialogContent" width="50%" title="通知对象">
            <el-tree :data="dataTree" :props="defaultProps"
            @node-click="handleNodeClick"
            default-expand-all
            show-checkbox
            node-key="departmentId" ref="tree"
            :expand-on-click-node="false"
            >
         </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="organizationDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  @click="submitUser" class="c-button c-button--primary">确定</el-button>
            </div>
     </el-dialog>
     <el-dialog :visible.sync="organizationDialog2" class="dialogContent" width="50%" title="通知组织">
         <el-row>
             <el-col>
                 <el-checkbox-group v-model="checkList">
                     <el-checkbox label="RGM"></el-checkbox>
                     <el-checkbox label="AM"></el-checkbox>
                     <el-checkbox label="MM"></el-checkbox>
                     <el-checkbox label="DM" ></el-checkbox>
                     <el-checkbox label="FM" ></el-checkbox>
                     <el-checkbox label="FBC" ></el-checkbox>
                 </el-checkbox-group>
             </el-col>
         </el-row>
         <div slot="footer" class="dialog-footer">
             <el-button size="small"  @click="organizationDialog2 = false" class="c-button c-button--plain">取消</el-button>
             <el-button size="small"  @click="submitOrg" class="c-button c-button--primary">确定</el-button>
         </div>
     </el-dialog>
    </el-form>
</template>

<script>
    import api from '../../model/api'
    import Tinymce from '../../components/Tinymce'
    import Vue from 'vue'
    const defalutNotiContent = {
        sendType:'0',
        notiSendType:'0-0',
        delayDay:'1',
        specificNotiWay:'msg',
        notiPerson:'',
        notiPersonName:'',
        notiContent:'',
        notifyPerson:'',
        notifyPersonName:'',
        notifyDepartment:'',
        notifyDepartmentName:'',
        copyPerson:'',
        copyPersonName:'',
        copyDepartment:'',
        copyDepartmentName:'',
        modelTitle:'',
        modelContext:'',
        configId:'',
        id:-1
    }
    export default {
      name:'messageMngDetail',
      components:{Tinymce},
      props:["isEdit"],
      data(){
          return{
            dataTree: [],
            defaultProps: {
            children: 'childInfos',
            label: 'departmentName',
            id:'departmentId'
            },
            addFlag:'',
            currentSendType:'',
            pageSizeList:[25, 50, 75, 100, 125],
            totalRecords:0,
            currentPage: 1,
            pageSize:25,
            userName:'',
            organization:'',
            addUserIndex:0,
            tableData:[],
            organizationDialog:false,
            isDisabled:false,
            defalutNotiWay:'0-',
            emailNotiWay:'1-',
            notiSendType:'msg',
            notificationForm:{
                notiFrequency:'day',
                monthFrequency:'1',
                radioNotiWay:'auto',
                timeTags:[],
                listEarlyWarnConfigDetail:[Object.assign({},defalutNotiContent)]
            },
            labelWidth:'70px',
            rules: {
               warnName:[{required: true, message: '通知名称不能为空', trigger: 'blur'}],
               // receiver:[{required: true, message: '收件人不能为空', trigger: 'blur'}],
               // notifyAllInfo:[{required: true, message: '不能为空', trigger: 'blur'}],
               notiSendType:[{required: true, message: '请选择通知方式', trigger: 'blur'}]
            },
            warnTypeOptions:[],
            businessTypeOptions:[],
            organizationDialog2:false,
            checkList:[],
            currentOrgType:'',
            orgIndex:0
        }
      },
      beforeMount(){
          if(this.$route.query.id)
          {
              var that = this
              api.getWarnMessageDetail(this.$route.query.id,function(res){
                  if(res.code == 200){
                    that.notificationForm = res.data
                    that.notificationForm.warnType = that.common.isNullString(that.notificationForm.warnType) ? '' :parseInt(that.notificationForm.warnType)
                    that.notificationForm.businessType = that.common.isNullString(that.notificationForm.businessType) ? '' :parseInt(that.notificationForm.businessType)
                    that.notificationForm.listEarlyWarnConfigDetail.forEach(function(item,index){
                        that.$set(item,'notiSendType',item.sendType+'-'+index)
                        that.$set(item,'notifyAllInfo',that.setNotifyAllInfo(item))
                        that.$set(item,'copyAllInfo',that.setCopyAllInfo(item))
                    })
                  }
              })
          }
      },
      mounted(){
        this.getSearchCondition()
      },
      methods:{
          getSearchCondition(){
                var that = this
                api.getDictionaryByNumber('EARLY_WARN_TYPE',function(res){
                    that.businessTypeArray = []
                    res.data.forEach(function(item,index){
                        if(res.code == 200)
                        {
                            that.warnTypeOptions = res.data
                            var itemArray = []
                            api.getDictionaryByNumber(item.dictionaryEntryCode,function(res){
                                if(res.code == 200)
                                    {
                                        res.data.forEach(function(itemOption,index){
                                            that.businessTypeOptions.push(itemOption)
                                        })
                                    }
                            })
                        }
                    })
                })
            },
        setNotifyAllInfo(item){
            var notifyAllInfo = ''
            if(this.common.isNullString(item.notifyPersonName) && this.common.isNullString(item.notifyDepartmentName))
            {
                item.notifyPersonName = ''
                item.notifyDepartmentName = ''
                notifyAllInfo = ''
            }
            else if (this.common.isNullString(item.notifyPersonName)){
                item.notifyPersonName = ''
                notifyAllInfo = item.notifyDepartmentName

            }else if (this.common.isNullString(item.notifyDepartmentName)){
                item.notifyDepartmentName = ''
                notifyAllInfo = item.notifyPersonName
            }else {
                notifyAllInfo = item.notifyDepartmentName + item.notifyPersonName
            }
            return notifyAllInfo
        },
        setCopyAllInfo(item){
            var copyAllInfo = ''
            if(this.common.isNullString(item.copyPersonName) && this.common.isNullString(item.copyDepartmentName))
            {
                item.copyPersonName = ''
                item.copyDepartmentName = ''
                copyAllInfo = ''
            }
            else if (this.common.isNullString(item.copyPersonName)){
                item.copyPersonName = ''
                copyAllInfo = item.copyDepartmentName

            }else if (this.common.isNullString(item.copyDepartmentName)){
                item.copyDepartmentName = ''
                copyAllInfo = item.copyPersonName
            }else {
                copyAllInfo = item.copyDepartmentName + item.copyPersonName
            }
            return copyAllInfo
        },
        handleNodeClick(data) {
        },
        submitUser(){
            var that = this
            //收件人
                //收件人用户
                var notifyPerson = ''
                var notifyPersonName = ''
                //收件人部门信息
                var notifyDepartment = ''
                var notifyDepartmentName = ''
            //抄送人
                //抄送人用户
                var copyPerson = ''
                var copyPersonName = ''
                //抄送人部门信息
                var copyDepartment = ''
                var copyDepartmentName = ''

                var checkedLength = this.$refs.tree.getCheckedNodes(true).length
                if(this.addFlag == 'notifyPersonName'){
                    this.$refs.tree.getCheckedNodes(true).forEach(function(item,index){
                        if(item.flag){
                            notifyPerson = notifyPerson+item.departmentId+';';
                            notifyPersonName = notifyPersonName+item.departmentName+';';
                        }
                        else{
                            notifyDepartment = notifyDepartment+item.departmentId+';';
                            notifyDepartmentName = notifyDepartmentName+item.departmentName+';';
                        }
                    })

                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'notifyPerson',notifyPerson)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'notifyPersonName',notifyPersonName)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'notifyDepartment',notifyDepartment)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'notifyDepartmentName',notifyDepartmentName)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'notifyAllInfo',that.setNotifyAllInfo(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex]))
                }
                if(this.addFlag == 'copyPersonName'){
                     this.$refs.tree.getCheckedNodes(true).forEach(function(item,index){
                        if(item.flag){
                            copyPerson =  copyPerson+item.departmentId+';';
                            copyPersonName = copyPersonName+item.departmentName+';';
                        }
                        else{
                            copyDepartment = copyDepartment+item.departmentId+';';
                            copyDepartmentName = copyDepartmentName+item.departmentName+';';
                        }
                    })
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'copyPerson',copyPerson)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'copyPersonName',copyPersonName)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'copyDepartment',copyDepartment)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'copyDepartmentName',copyDepartmentName)
                    this.$set(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex],'copyAllInfo',that.setCopyAllInfo(this.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex]))
                }
                this.organizationDialog = false
        },
        getUserInfo(){
             var that = this
             var checkedKeys=[]
             if(this.addFlag == 'copyPersonName'){
                var copyPerson = that.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex].copyPerson
                var copyDepartment = that.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex].copyDepartment
                var copyPersonArray = this.common.isNullString(copyPerson) ? [] : (copyPerson.indexOf(';') > 0 ? copyPerson.split(';') : [copyPerson])
                var copyDepartmentArray = this.common.isNullString(copyDepartment) ? [] : (copyDepartment.indexOf(';') > 0 ? copyDepartment.split(';') : [copyDepartment])
                checkedKeys = copyDepartmentArray.concat(copyPersonArray)
             }

             if(this.addFlag == 'notifyPersonName'){
                var notifyPerson = that.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex].notifyPerson
                var notifyDepartment = that.notificationForm.listEarlyWarnConfigDetail[this.addUserIndex].notifyDepartment
                var notifyPersonArray = this.common.isNullString(notifyPerson) ? [] :((notifyPerson.indexOf(';') >0) ? notifyPerson.split(';') : [notifyPerson])
                var notifyDepartmentArray = this.common.isNullString(notifyDepartment) ? [] : ((notifyDepartment.indexOf(';') >0) ? notifyDepartment.split(';') : [notifyDepartment])
                checkedKeys = notifyDepartmentArray.concat(notifyPersonArray)
             }
            api.getDepartmentUserlist(function(res){
                that.dataTree = res.data
                that.$refs.tree.setCheckedKeys(checkedKeys)
            })
        },
        deleteMsgContent(index){
            var that = this
            this.$confirm('确定删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                var configId = that.notificationForm.listEarlyWarnConfigDetail[index].id
                if(configId == -1)
                {
                   that.notificationForm.listEarlyWarnConfigDetail.splice(index,1)
                }
                else{
                     api.deleteConfigDetail(configId,function(res){
                    if(res.code == 200){
                        that.notificationForm.listEarlyWarnConfigDetail.splice(index,1);
                        that.common.messageUtil({
                            type:'success',
                            message:res.data
                        })
                    }
                    else{
                        that.common.warningMessage(res.msg)
                     }
                  })
                }
            }).catch(() => {
                that.common.infoMessage('已取消删除')
            })
          },
          addMsgContent(){
              var index = this.notificationForm.listEarlyWarnConfigDetail.length
              this.$set(defalutNotiContent,'notiSendType',this.defalutNotiWay+index)
              this.notificationForm.listEarlyWarnConfigDetail.push(Object.assign({},defalutNotiContent))
          },
          changeSpecificNotiWay(val){
             var index = val.split('-')[1]
             this.$refs.notificationForm.clearValidate(['listEarlyWarnConfigDetail.' +index+'.notifyPersonName'])
             var currentChecked = this.notificationForm.listEarlyWarnConfigDetail[index].notiSendType
             this.$set(this.notificationForm.listEarlyWarnConfigDetail[index],'notiSendType',currentChecked)
             this.$set(this.notificationForm.listEarlyWarnConfigDetail[index],'sendType',currentChecked.split('-')[0])
             this.$forceUpdate()
          },
          changeNotiCount(val){

          },
         addUser(index,addFlag,sendType){
             this.organizationDialog = true
             this.addUserIndex = index
             this.addFlag = addFlag
             this.currentSendType = sendType
             this.getUserInfo()
         },
         save(){
             var that = this
             this.$refs.notificationForm.validate((valid) => {
                if (valid) {
                   if(that.judedelay())
                   {
                       try{
                           that.notificationForm.listEarlyWarnConfigDetail.forEach(function(item,index){
                               item.configId = that.notificationForm.id
                               if(item.sendType == '0'){
                                   if(!item.notifyAllInfo && !item.notifyOrganize){
                                       throw new Error('请选择通知对象或者通知组织！')
                                   }
                                   item.copyDepartment = ''
                                   item.copyDepartmentName = ''
                                   item.copyPerson = ''
                                   item.copyPersonName = '';
                               }else{
                                   if(!item.notifyAllInfo && !item.notifyOrganize){
                                       throw new Error('请选择收件人或者收件组织！')
                                   }
                               }
                           })
                       }catch(e){
                            that.common.messageUtil({
                                type:'warning',
                                message:e.message
                            });
                            return;
                       }
                        api.updateWarnMessageDetail(this.notificationForm,function(res){
                            if(res.code === 200){
                                that.common.successMessage(res.data)
                                that.common.deleteTag(that.$route,that)
                            }
                            else{
                                that.common.warningMessage(res.msg)
                            }
                        })
                   }
                } else {
                    return false;
                }
            })
          },
          judedelay(){
              var delayArray = []
              var that = this
              this.notificationForm.listEarlyWarnConfigDetail.forEach(function(item,index){
                  delayArray.push(item.delayDay)
              })
              for(var i=0;i<delayArray.length;i++){
                if (delayArray[i] === delayArray[i+1]){
                    that.common.warningMessage('滞后天数不能重复')
                    return false
                }
             }
             return true
         },
          cancel(){
              this.common.deleteTag(this.$route,this,'messageMng')
          },
         showTips(text,type){
            this.common.messageUtil({
                message: text,
                type: type
            });
        },
          submitOrg(){
              let html = this.checkList.length > 0?';':'';
              this.notificationForm.listEarlyWarnConfigDetail[this.orgIndex][this.currentOrgType] = this.checkList.join(';')+html
              this.organizationDialog2 = false;
          },
          addOrg(index,type){
              this.organizationDialog2 = true;
              if(this.notificationForm.listEarlyWarnConfigDetail[index][type]){
                this.checkList = this.notificationForm.listEarlyWarnConfigDetail[index][type].split(';').filter(x=>{return !!x})
              }
              this.currentOrgType = type;
              this.orgIndex = index;
          }
      }
    }
</script>

<style lang="scss" scoped>

.mainContent {
    .searchContent,.dataContent{
        padding: 0px
    }
}

 .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 100px;
    margin-left: 10px;
    vertical-align: bottom;
  }
.regionalContent {
    background-color: white;
    margin-bottom: 20px;
    .el-row {
      padding:0px 20px 0px;
      &:last-child{
          padding-bottom: 20px
      }
      &:first-child{
          padding-top: 20px
      }
      .sectionContent
      {
          display:inline-block;
          width: 95%
      }
      .borderBottomLine {
         border-bottom: 1px solid #bbb;
         padding-bottom: 10px;
      }
      .notiFrequencySelect {
          width: 20%
      }
      .monthSelect {
          width: 100px
      }
    }
    .el-form-item{
        margin-bottom: 15px;
    }
    .notiContent {
        .notiContentDetail{
            padding:15px;
            border:1px solid #56CD74;
            background-color: rgba(86, 205, 116, 0.1);
            margin-left: 25px;
        }
        .itemLeft{
            display:inline-block;
            width: 75%
        }
        .sectionContent{
            .contentSpace {
            margin: 0 10px;
          }

        }
        .notiObject {
            margin-right:10px
        }
        .notiObjectContent {
            display:inline-block;
            width: 100%;
            .notiObjectInput{
                width:75%
            }
        }
        .el-row {
            .el-item .el-form-item{
                display:inline-block;

            }
       }
    }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
}



</style>
