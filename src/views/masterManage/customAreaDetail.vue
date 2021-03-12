<template>
    <el-form :model="customizeAreaForm" labelPosition="top" :rules="rules" ref="customizeAreaForm">
      <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                 <el-form-item label="自定义区域名称" prop="customizeActivityAreaName">
                     <el-input size="small"  v-model.trim="customizeAreaForm.customizeActivityAreaName" :placeholder="isDisabled?'':'请输入区域名称'" 
                     clearable :disabled="isDisabled" class="sectionContent" maxlength="10"></el-input>
                 </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="8">
                <el-form-item label="请选择区域餐厅" prop="restaurantId" class="restaurantContent">
                    <!--<el-input size="small"  v-model="customizeAreaForm.restaurantId" clearable style="display:none"></el-input>-->
                </el-form-item>
                 <div class="treeContent" v-loading="loadingInfo">
                        <el-input size="small"  placeholder="请输入餐厅名称/餐厅JDE Code" v-model.trim="filterText"  v-on:keyup.13.native="blurFilter($event)">
                        <i
                            class="el-icon-search el-input__icon cursorPointer"
                            slot="suffix"
                            @click="searchArea">
                        </i>
                        </el-input>
                        <el-tree
                                :data="dataTreeData"
                                show-checkbox
                                node-key="id"
                                :default-checked-keys="checkedKeys"
                                ref="dataTreeRef"
                                :default-expanded-keys="defaultExpandArray"
                                :filter-node-method="filterNode"
                                :default-expand-all ="isExpandAll"
                                >
                        </el-tree>
                    </div>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="8">
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="customizeAreaForm.state"  size="small" :disabled="isDisabled" class="sectionContent">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
         </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="备注">
                     <el-input size="small"  v-model.trim="customizeAreaForm.remark" type="textarea"
                     :placeholder="isDisabled?'':'请输入(1-100位)'"
                     :autosize="{minRows:8}" clearable :disabled="isDisabled" class="sectionContent" maxlength="100"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="regionalContent">
           <el-row>
            <el-col :span="6">
                <el-form-item label="FBC" prop="fbcContactNameId">
                    <el-select  size="small"  v-model="customizeAreaForm.fbcContactNameId" :placeholder="isDisabled?'':'请选择'" 
                                filterable :disabled="isDisabled" class="sectionContent" remote reserve-keyword :remote-method="remoteFbcContact"
                                :loading="loadingFbc" @change="changeFbcContact" v-scroll="getMoreFbcContact"
                                allow-create default-first-option >
                        <el-option v-for="item in fbcContactOptions" :key="item.id" :label="item.userName+(item.psId?item.psId:'')" :value="item.id">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                 <el-form-item label="固定电话" prop="fbcContactFixedTel">
                   <el-input size="small"  v-model.trim="customizeAreaForm.fbcContactFixedTel" :placeholder="isDisabled || isFbcDisabled?'':'固定电话'" clearable
                    :disabled="isDisabled || isFbcDisabled" class="sectionContent" :maxlength="12"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="移动电话" prop="fbcContactMobileTel">
                    <el-input size="small"  v-model.trim="customizeAreaForm.fbcContactMobileTel" :placeholder="isDisabled || isFbcDisabled?'':'请输入'" 
                    :maxlength="11" clearable :disabled="isDisabled || isFbcDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="邮箱" prop="fbcContactMail">
                    <el-input size="small"  v-model.trim="customizeAreaForm.fbcContactMail" :placeholder="isDisabled || isFbcDisabled?'':'请输入'" clearable 
                    :disabled="isDisabled || isFbcDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row >
            <el-col :span="6">
                <el-form-item label="FM" prop="fmContactNameId">
                    <el-select  size="small"  v-model="customizeAreaForm.fmContactNameId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent"
                                remote reserve-keyword :remote-method="remoteFmContact" :loading="loadingFm" @change="changeFmContact"
                                v-scroll="getMoreFmContact" allow-create default-first-option>
                        <el-option v-for="item in fmContactOptions" :key="item.id" :label="item.userName+(item.psId?item.psId:'')" :value="item.id">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="固定电话" prop="fmContactFixedTel">
                 <el-input size="small"  v-model.trim="customizeAreaForm.fmContactFixedTel" :placeholder="isDisabled || isFmDisabled?'':'固定电话'" clearable
                  :disabled="isDisabled || isFmDisabled" class="sectionContent" :maxlength="12"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="移动电话" prop="fmContactMobileTel">
                     <el-input size="small"  v-model.number="customizeAreaForm.fmContactMobileTel" :placeholder="isDisabled || isFmDisabled?'':'请输入'" :maxlength="11" clearable :disabled="isDisabled || isFmDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="邮箱" prop="fmContactMail">
                     <el-input size="small"  v-model.trim="customizeAreaForm.fmContactMail" :placeholder="isDisabled || isFmDisabled?'':'请输入'" clearable :disabled="isDisabled || isFmDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="regionalContent" v-if="isDisabled || isEdit">
         <el-row>
         <el-col :span="8">
                <el-form-item label="更新时间">
                       <el-date-picker v-model="customizeAreaForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled class="sectionContent">
                       </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                       <el-input size="small"  v-model.trim="customizeAreaForm.modifiedUser" placeholder="" clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
         </el-row>
     </div>
     <div class="opreaContent" v-if="!isDisabled">
         <el-button size="small"  type="success" @click="cancel" plain>取消</el-button>
         <el-button size="small"  type="success" @click="save">保存</el-button>
     </div>
    </el-form>
</template>

<script>
    import api from '../../model/api'
    import scroll from '@/directives/index'
    const defaultForm = {
        state:1,
        fbcContactFixedTel: '',
        fbcContactId: '',
        fbcContactMail: '',
        fbcContactMobileTel: '',
        fbcContactName: '',
        fmContactFixedTel: '',
        fmContactId: '',
        fmContactMail: '',
        fmContactMobileTel: '',
        fmContactName: '',
        fbcContactNameId:'',
        fmContactNameId:''
    }
    export default {
      name:'customAreaDetail',
      props:["isDisabled","isEdit"],
      directives: {scroll},
      data(){
          var validTele = (rule, value, callback) =>{
              if(!this.common.validTele(value) && value){
                  callback(new Error('手机格式不正确'));
              }else{
                  callback()
              }
          };
          var validFixedTel = (rule, value, callback) =>{
              if(!/0\d{2,3}\d{6,8}/.test(value) && !this.common.isNullString(value)){
                 callback(new Error('请输入正确的格式'));
              }
              else{
                  callback()
              }
          };
           var validCustomAreaName = (rule, value, callback) => {
            if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) {
                callback(new Error('只能输入数字、字母和汉字'));
            }
            else{
                callback()
            }
        };

          return{
            customizeAreaForm:Object.assign({},defaultForm),
            originalCustomizeAreaForm:Object.assign({},defaultForm),
            isIndeterminate:true,
            checkedKeys:[],
            restaurantId:[],
            restaurant:'',
            isFirsthandleCheckChange:true,
            rules: {
               customizeActivityAreaName:[
                   {required: true, message: '自定义区域名称不能为空', trigger: 'blur'},
                   { validator: validCustomAreaName, trigger: ['blur'] }
                   ],
               restaurantId:[{required: true, message: '请选择餐厅', trigger: 'blur'}],
               state:[{required: true, message: '请选择状态', trigger: 'blur'}],
               fmContactMail:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                fbcContactMail:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                fmContactMobileTel:[
                     { validator: validTele, trigger: ['blur'] }
                ],
                fbcContactMobileTel:[
                    { validator: validTele, trigger: ['blur'] }
                ],
                fbcContactFixedTel:[{
                    validator: validFixedTel, trigger: ['blur']
                }],
                fmContactFixedTel:[{
                    validator: validFixedTel, trigger: ['blur']
                }],
            },
          dataTree: [],
          matserModule:'主档管理',
          subModule:'自定义区域',
          userName:'',
          fbcContactOptions:[],
          fmContactOptions:[],
          loadingFbc:false,
          loadingFm:false,
          defaultExpandArray:[],
          loadingInfo: true,
          filterText:'',
          dataTreeData:[],
          isFmDisabled:false,
          isFbcDisabled:false,
          restaurantInfo:[],
          filterCount:0,
          filterAllCount:0,
          isExpandAll:false,
          fbcLoadSign:true,
          fmLoadSign:true,
          fbcQuery:'',
          fmQuery:'',
          fbcPageIndex:1,
          fmPageIndex:1,
          pageSize:20,
          matchedFBC : false,
          matchedFM  : false
         }
      },
      beforeMount(){
          if(this.$route.query.customizeAreaId)
          {
              this.getCustomizeArea(this.$route.query.customizeAreaId)
          }else{
              this.isFmDisabled = true
              this.isFbcDisabled = true
          }
          this.getFbcContact()
          this.getFmContact()
      },
      mounted(){
        this.getStoreTree()
      },
      watch:{
        //    filterText(val) {
        //     this.filterCount = 0
        //     this.$refs.dataTreeRef.filter(val);
        //     // setTimeout(this.loadingInfo = false,4000)
        //   },
      },
      methods:{
          searchArea(){
              this.filterCount = 0
              this.loadingInfo = true
              this.$refs.dataTreeRef.filter(this.filterText)  
          },
          blurFilter(event){
             this.searchArea()
          },
          //filterText
          changeFilterText(){
            //   console.log('valval',this.filterText)
            //   this.$refs.dataTree.filter(this.filterText);
          },
          filterNode(value, data) {
            this.filterCount ++ 
            if(this.filterCount == 1){
                //  console.log('filterCount',this.filterCount)
                this.loadingInfo = true
            }
            if(this.filterCount == this.filterAllCount){
                // console.log('filterAllCountfilterAllCount',this.filterAllCount)
                  this.loadingInfo = false
            }
            if(this.filterCount == this.filterAllCount && this.common.isNullString(this.filterText)){
                  this.defaultExpandArray = this.restaurantId
                  this.loadingInfo = false
            }
            if (!value)  return true
            if(!data.children){
               return data.label.indexOf(value) !== -1;
            }
          },
          //fbc
          getMoreFbcContact(){
            if(this.fbcLoadSign){
                this.fbcPageIndex ++ 
                this.getFbcContact()
             }
           },
           changeFbcContact(val){
            var that = this
            this.matchedFBC = false
            this.fbcContactOptions.forEach(function(item,index){
                if(item.id == val){
                    that.matchedFBC = true
                    that.customizeAreaForm.fbcContactFixedTel = item.phone
                    that.customizeAreaForm.fbcContactMobileTel = item.mobile
                    that.customizeAreaForm.fbcContactMail = item.mail
                    that.customizeAreaForm.fbcContactId = item.psId
                    that.customizeAreaForm.fbcContactPsId = item.psId
                    that.customizeAreaForm.fbcContactName  = item.userName
                    that.isFbcDisabled = item.userName == '请选择' ? true : false
                    return
                }
            });
            if(!this.matchedFBC){
                this.customizeAreaForm.fbcContactFixedTel = null
                this.customizeAreaForm.fbcContactMobileTel = null
                this.customizeAreaForm.fbcContactMail = null
                this.customizeAreaForm.fbcContactId = null
                this.customizeAreaForm.fbcContactPsId = null
                this.customizeAreaForm.fbcContactName  = val
                this.isFbcDisabled = val == '请选择' ? true : false
            }
          },
          remoteFbcContact(query){
              this.loadingFbc = true
              setTimeout(() => {
                 this.fbcQuery = query
                 this.fbcPageIndex = 1
                 this.getFbcContact()
             }, 200);
          },
          getFbcContact(){
              var that = this
              var param = [{
                  name:'userName',
                  value:this.fbcQuery
              },
              {
                  name:'pageSize',
                  value:this.pageSize
              },
              {
                  name:'pageIndex',
                  value:this.fbcPageIndex
              },{
                  name:'workType',
                  value:'11'
              }]
             
              api.getFmFbcInfo(this.common.joinSearchParam(param),function(res){
                  that.loadingFbc = false
                  if(res.code == 200){
                      that.fbcLoadSign = true
                      if(that.fbcPageIndex == 1){
                            that.fbcContactOptions = [{
                                        id: '',
                                        mail: '',
                                        mobile: '',
                                        phone: '',
                                        psId: '',
                                        userName:'请选择'
                                }]
                        }
                       that.fbcContactOptions = that.fbcContactOptions.concat(res.data)
                  }else if(res.code == 404){
                      that.fbcLoadSign = false
                      if(that.fbcPageIndex == 1){
                         that.fbcContactOptions = []
                      }
                  }
              })
          },
          //fm
          getMoreFmContact(){
            if(this.fmLoadSign){
                this.fmPageIndex ++ 
                this.getFmContact()
             }
          },
          changeFmContact(val){
            var that = this
            this.matchedFM = false;
            this.fmContactOptions.forEach(function(item,index){
                if(item.id == val){
                    that.matchedFM = true;
                    that.customizeAreaForm.fmContactFixedTel = item.phone
                    that.customizeAreaForm.fmContactMobileTel = item.mobile
                    that.customizeAreaForm.fmContactMail = item.mail
                    that.customizeAreaForm.fmContactId = item.psId
                    that.customizeAreaForm.fmContactPsId = item.psId
                    that.customizeAreaForm.fmContactName  = item.userName
                    that.isFmDisabled = item.userName == '请选择' ? true : false
                    return
                }
            });
            if(!this.matchedFM){
                this.customizeAreaForm.fmContactFixedTel = null
                this.customizeAreaForm.fmContactMobileTel = null
                this.customizeAreaForm.fmContactMail = null
                this.customizeAreaForm.fmContactId = null
                this.customizeAreaForm.fmContactPsId = null
                this.customizeAreaForm.fmContactName  = val
                this.isFmDisabled = val == '请选择' ? true : false
            }
          },
          remoteFmContact(query){
              this.loadingFm = true
              setTimeout(() => {
                 this.fmQuery = query
                 this.fmPageIndex = 1
                 this.getFmContact(query)
             }, 200);
          },
          getFmContact(query){
              var that = this
              var param = [{
                  name:'userName',
                  value:this.fmQuery
              },
              {
                  name:'pageSize',
                  value:this.pageSize
              },
              {
                  name:'pageIndex',
                  value:this.fmPageIndex
              },{
                  name:'workType',
                  value:'10'
              }]
              api.getFmFbcInfo(this.common.joinSearchParam(param),function(res){
                  that.loadingFm = false
                  if(res.code == 200){
                      that.fmLoadSign = true
                      if(that.fbcPageIndex == 1){
                            that.fmContactOptions = [{
                                        id: '',
                                        mail: '',
                                        mobile: '',
                                        phone: '',
                                        psId: '',
                                        userName:'请选择'
                                }]
                        }
                       that.fmContactOptions = that.fmContactOptions.concat(res.data)
                  }else if(res.code == 404){
                      that.fmLoadSign = false
                      if(that.fmPageIndex == 1){
                         that.fmContactOptions = []
                      }
                  }
              })
          },
          //end
          getAllCheckedRestaurantKeys(){
              var that = this
              this.restaurantId = []
              this.$refs.dataTreeRef.getCheckedNodes().forEach(function(item,index){
                   if(item.children == undefined)
                   {
                        that.restaurantId.push(item.id)
                    }
              })
          },
          save(){
              var that = this    
              this.getAllCheckedRestaurantKeys()
              that.customizeAreaForm.restaurantId = that.restaurantId
              this.$refs.customizeAreaForm.validate((valid) => {
                    if (valid) {
                        var isSubmit = true
                        api.checkCustomizeActivityAreaName(that.customizeAreaForm.customizeActivityAreaName,res=>{
                           if(res.code == 200){
                               isSubmit = res.data ? true : (that.originalCustomizeAreaForm.customizeActivityAreaName == that.customizeAreaForm.customizeActivityAreaName ? true : false)
                               isSubmit ? that.submitForm() : that.common.warningMessage('自定义区域名称已存在,请检查')
                           }else{
                               isSubmit = false
                               that.common.warningMessage(res.msg)
                           }
                        })
                    }
                    else{
                        return false
                    }
              })
          },
          submitForm(){
                var that = this
                delete that.customizeAreaForm.fscModifiedTime
                delete that.customizeAreaForm.modifiedUser
                delete that.customizeAreaForm.fbcContactNameId
                delete that.customizeAreaForm.fmContactNameId
                delete that.customizeAreaForm.fmContactPsId
                delete that.customizeAreaForm.fbcContactPsId
                delete that.customizeAreaForm.createTime
                delete that.customizeAreaForm.createUser
                var pathParam = [
                        {
                            name:'module',
                            value: that.matserModule
                        },
                        {
                            name:'subModule',
                            value:that.subModule
                        }
                ]
                if(that.isEdit){
                    api.updateCustomizeArea(that.common.joinSearchParam(pathParam),that.customizeAreaForm,function(res){
                        res.code === 200 ? (that.showTips(res.data,'success'),that.$refs.customizeAreaForm.clearValidate(),
                        that.cancel()): that.showTips(res.msg,'warning')
                    })
                }
                else{
                    api.addCustomizeArea(that.common.joinSearchParam(pathParam),that.customizeAreaForm,function(res){
                        res.code === 200 ? (that.showTips(res.data,'success'),that.$refs.customizeAreaForm.clearValidate(),
                        that.cancel()): that.showTips(res.msg,'warning')
                        })
                }

          },
          cancel(){
              this.common.deleteTag(this.$route,this)
          },
          getCustomizeArea(customizeAreaId){
              var that = this
              api.getCustomizeAreaById(customizeAreaId,function(res){
                  that.originalCustomizeAreaForm = Object.assign({},res.data)
                  that.customizeAreaForm = res.data
                  that.checkedKeys = that.customizeAreaForm.restaurantId
                  that.restaurantId = that.customizeAreaForm.restaurantId
                  that.customizeAreaForm.fbcContactName = that.common.isNullString(that.customizeAreaForm.fbcContactName) ? '' : that.customizeAreaForm.fbcContactName
                  that.customizeAreaForm.fbcContactId = that.common.isNullString(that.customizeAreaForm.fbcContactId) ? '' : that.customizeAreaForm.fbcContactId
                  that.customizeAreaForm.fmContactName = that.common.isNullString(that.customizeAreaForm.fmContactName) ? '' : that.customizeAreaForm.fmContactName
                  that.customizeAreaForm.fmContactId = that.common.isNullString(that.customizeAreaForm.fmContactId) ? '' : that.customizeAreaForm.fmContactId
                  that.$set(that.customizeAreaForm,'fbcContactNameId',that.customizeAreaForm.fbcContactName+that.customizeAreaForm.fbcContactId)
                  that.$set(that.customizeAreaForm,'fmContactNameId',that.customizeAreaForm.fmContactName+that.customizeAreaForm.fmContactId)
                  that.isFmDisabled = that.common.isNullString(that.customizeAreaForm.fbcContactNameId) ? true : false
                  that.isFbcDisabled = that.common.isNullString(that.customizeAreaForm.fmContactNameId) ? true : false
              })
          },
          getStoreTree(){
              var that = this
              api.getStoreTree(function(res){
                res.data.forEach(function(companyItem,companyIndex){
                    var companyInfo = {}
                    companyInfo.label = companyItem.companyName + companyItem.jdeCode
                    companyInfo.id = companyItem.id
                    companyInfo.jdeCode = companyItem.jdeCode
                    companyInfo.disabled = that.isDisabled
                    var companyChild = []
                    companyItem.billUnitStores.forEach(function(billUnitItem,billUnitIndex){
                         var billingunitInfo = {}
                         billingunitInfo.label = billUnitItem.billingUnitName + billUnitItem.jdeCode
                         billingunitInfo.id = billUnitItem.id
                         billingunitInfo.jdeCode = billUnitItem.jdeCode
                         billingunitInfo.disabled = that.isDisabled
                         var billingunitChild = []
                         billUnitItem.storeInfos.forEach(function(storeItem,storeIndex){
                             var restaurantInfo = {}
                             restaurantInfo.label = storeItem.storeName + storeItem.storeJdeCode
                             restaurantInfo.id = storeItem.id
                             restaurantInfo.jdeCode = storeItem.storeJdeCode
                             restaurantInfo.disabled = that.isDisabled
                             that.filterAllCount ++
                             billingunitChild.push(restaurantInfo)
                         })
                         billingunitInfo.children = billingunitChild
                         
                         if(billingunitInfo.children.length > 0){
                             that.filterAllCount ++
                             companyChild.push (billingunitInfo)
                         }
                    })
                    companyInfo.children =  companyChild
                    if(companyInfo.children.length > 0)
                    {   that.filterAllCount ++
                        that.dataTree.push(companyInfo)
                    }
                })
                that.dataTreeData = that.dataTree
                that.defaultExpandArray = that.checkedKeys
                that.$refs.dataTreeRef.setCheckedKeys(that.checkedKeys)
                that.loadingInfo = false
              })
          },
         showTips(text,type){
            this.common.messageUtil({
                message: text,
                type: type
            });
        },
      }
    }
</script>

<style lang="scss" scoped>
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
          display:block;
          width: 95%
      }
    }
    .el-input--suffix .el-input__inner{
        padding-right:0px
    }

    .el-form-item{
        margin-bottom: 10px;
        &.restaurantContent{
            margin-bottom: 22px;
        } 
        .el-form-item__label{
            padding-bottom: 0px;
            line-height: 20px;
            margin-top: 10px;
        }
    }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
}
.treeContent {
    width:95%;
    border:1px solid #dcdfe6;
    padding: 10px;
    .el-tree{
        marigin-top: 10px;
        max-height: 500px;
        overflow-y: auto;
    }
}

</style>