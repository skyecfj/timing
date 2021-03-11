<template>
    <el-form :model="companyForm"  labelPosition="top" ref="companyForm" :rules="rules">
      <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                <el-form-item label="JDE Code">
                      <el-input size="small"  v-model.trim="companyForm.jdeCode" placeholder="" clearable disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="法人公司中文名称">
                     <el-input size="small"  v-model.trim="companyForm.companyName" placeholder="" clearable disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="法人公司英文名称">
                     <el-input size="small"  v-model.trim="companyForm.companyEnglishName" placeholder="" clearable disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="财务市场" prop="marketId">
                    <el-select size="small"  v-model="companyForm.marketId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in MarketOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
             <el-col :span="8">
                <el-form-item label="类别" prop="type">
                      <el-select size="small"  v-model="companyForm.type" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in companyTypeOptions" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
             <el-col :span="8">
                 <el-form-item label="法人缩写" prop="legalPersonAbbre">
                      <el-input size="small"  v-model.trim="companyForm.legalPersonAbbre" :placeholder="isDisabled?'':'请输入'"  clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <div class="textLeft">
                     <el-form-item label="类型">
                     <el-select size="small"  v-model="companyForm.flag" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                     </el-form-item>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="textLeft">
                     <el-form-item label="默认开票单位" prop="">
                     <el-select size="small"  v-model="companyForm.billingUnitNnStoreCode" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in nnInfoOptions" :key="item.billingUnitNnStoreCode" :label="item.billingUnitNnStoreName" :value="item.billingUnitNnStoreCode">
                        </el-option>
                    </el-select>
                     </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <div class="textLeft">
                     <el-form-item label="品牌" prop="brandList">
                     <el-select size="small"  v-model="companyForm.brandList" :placeholder="isDisabled?'':'请选择'" clearable multiple filterable :disabled="isDisabled" class="sectionContent">
                        <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                     </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="财务年度开始">
                     <el-input size="small"  v-model.trim="companyForm.startDateOfFinancial" disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="当前期间">
                      <el-input size="small" v-model.trim="companyForm.generalLedgerPeriod" disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="记账本位币">
                    <el-input size="small"  v-model.trim="companyForm.recordingCurrency" disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="备注" prop="remark">
                     <el-input size="small"  v-model.trim="companyForm.remark" :placeholder="isDisabled?'':'请输入(1-100位)'" type="textarea" :autosize="{minRows:6}" clearable :disabled="isDisabled" class="sectionContent" :maxlength="100"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
     </div>
       <div class="regionalContent">
        <el-row>
            <el-col :span="6">
                <el-form-item label="内部往来/加盟商结算联系人" prop="innerContactNameId">
                    <el-select  size="small"  v-model="companyForm.innerContactNameId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled"
                                class="sectionContent" remote reserve-keyword :remote-method="remoteInnerContact" :loading="loadingInner" @change="changeInnerContact"
                                v-scroll="getMoreInnerContact" allow-create default-first-option>
                        <el-option v-for="item in innerContactOptions" :key="item.id" :label="item.userName+(item.psId?item.psId:'')" :value="item.id">
                        </el-option>
                    </el-select>
                     <!--<el-input size="small"  v-model.trim="companyForm.innerContactName" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>-->
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                    <el-form-item label="固定电话" prop="innerContactFixedTel">
                        <!--<span style="display:none">{{innerContactFixedTel}}</span>-->
                       <!--<el-input size="small"  v-model.trim="companyForm.innerContactFixedTel" style="display:none" ></el-input>-->
                     <!--<el-input size="small"  v-model.trim="companyForm.innerContactFixedZone" :placeholder="isDisabled?'':'区号'" clearable :disabled="isDisabled" class="inputZoneContent" :maxlength="4"></el-input>-->
                        <!--<span>-</span>-->
                     <!--<el-input size="small"  v-model.trim="companyForm.innerContactFixedTelp" :placeholder="isDisabled?'':'固定电话'"  clearable :disabled="isDisabled" class="inputFixTeContent" :maxlength="8" :minlength="6"></el-input>-->
                   <el-input size="small"  v-model.trim="companyForm.innerContactFixedTel" :placeholder="isDisabled?'':'固定电话'"  clearable :disabled="isDisabled" class="sectionContent" :maxlength="12"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                 <el-form-item label="移动电话" prop="innerContactMobileTel">
                     <el-input size="small"  v-model.trim="companyForm.innerContactMobileTel" :placeholder="isDisabled?'':'请输入'"  :maxlength="11" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="邮箱" prop="innerContactMail">
                     <el-input size="small"  v-model.trim="companyForm.innerContactMail" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="FBC" prop="fbcContactNameId">
                    <el-select  size="small"  v-model="companyForm.fbcContactNameId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent"
                                remote reserve-keyword :remote-method="remoteFbcContact" allow-create default-first-option
                                :loading="loadingFbc" @change="changeFbcContact"  v-scroll="getMoreFbcContact">
                        <el-option v-for="item in fbcContactOptions" :key="item.id" :label="item.userName+(item.psId?item.psId:'')" :value="item.id">
                        </el-option>
                    </el-select>
                    <!--<el-input size="small"  v-model.trim="companyForm.outerContactName" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>-->
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                 <el-form-item label="固定电话" prop="fbcContactFixedTel">
                       <!--<span style="display:none">{{outerContactFixedTel}}</span>
                       <el-input size="small"  v-model.trim="companyForm.outerContactFixedTel" style="display:none" ></el-input>
                        <el-input size="small"  v-model.trim="companyForm.outerContactFixedZone" :placeholder="isDisabled?'':'区号'" clearable :disabled="isDisabled" class="inputZoneContent" :maxlength="4"></el-input>
                        <span>-</span>
                        <el-input size="small"  v-model.trim="companyForm.outerContactFixedTelp" :placeholder="isDisabled?'':'固定电话'" clearable :disabled="isDisabled" class="inputFixTeContent" :maxlength="8" :minlength="6"></el-input>-->
                   <el-input size="small"  v-model.trim="companyForm.fbcContactFixedTel" :placeholder="isDisabled?'':'固定电话'" clearable :disabled="isDisabled" class="sectionContent" :maxlength="12"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="移动电话" prop="fbcContactMobileTel">
                    <el-input size="small"  v-model.trim="companyForm.fbcContactMobileTel" :placeholder="isDisabled?'':'请输入'" :maxlength="11" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="邮箱" prop="fbcContactMail">
                    <el-input size="small"  v-model.trim="companyForm.fbcContactMail" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="FM" prop="fmContactNameId">
                    <el-select  size="small"  v-model="companyForm.fmContactNameId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent"
                                remote reserve-keyword :remote-method="remoteFmContact" allow-create default-first-option
                                :loading="loadingFm" @change="changeFmContact" v-scroll="getMoreFmContact">
                        <el-option v-for="item in fmContactOptions" :key="item.id" :label="item.userName+(item.psId?item.psId:'')" :value="item.id">
                        </el-option>
                    </el-select>
                     <!--<el-input size="small"  v-model.trim="companyForm.fmContactName" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>-->
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="固定电话" prop="fmContactFixedTel">
                       <!--<span style="display:none">{{fmContactFixedTel}}</span>
                       <el-input size="small"  v-model.trim="companyForm.fmContactFixedTel" style="display:none" ></el-input>
                       <el-input size="small"  v-model.trim="companyForm.fmContactFixedZone"  :placeholder="isDisabled?'':'区号'" clearable :disabled="isDisabled" class="inputZoneContent" :maxlength="4"></el-input>
                        <span>-</span>
                        <el-input size="small"  v-model.trim="companyForm.fmContactFixedTelp" :placeholder="isDisabled?'':'固定电话'" clearable :disabled="isDisabled" class="inputFixTeContent" :maxlength="8" :minlength="6"></el-input>-->
                 <el-input size="small"  v-model.trim="companyForm.fmContactFixedTel" :placeholder="isDisabled?'':'固定电话'" clearable :disabled="isDisabled" class="sectionContent" :maxlength="12"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="移动电话" prop="fmContactMobileTel">
                     <el-input size="small"  v-model.number="companyForm.fmContactMobileTel" :placeholder="isDisabled?'':'请输入'" :maxlength="11" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="邮箱" prop="fmContactMail">
                     <el-input size="small"  v-model.trim="companyForm.fmContactMail" :placeholder="isDisabled?'':'请输入'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="regionalContent">
     <div class="regionalBankContent" v-for="(item,index) in companyForm.companyBrandBankList" :key="index">
        <!--<el-row>-->
            <!--<el-col :span="8">-->
                <!--<el-form-item label="品牌">-->
                    <!--<el-select size="small"  v-model="item.brandId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled || isEdit" class="sectionContent">-->
                        <!--<el-option v-for="itemBrand in brandOptions" :key="itemBrand.value" :label="itemBrand.label" :value="itemBrand.value">-->
                        <!--</el-option>-->
                    <!--</el-select>-->
                 <!--</el-form-item>-->
            <!--</el-col>-->
        <!--</el-row>-->
        <div class="bankContent">

        <el-row>
            <el-col :span="7">
                <span class="itemTitle">银行JDE科目号</span>
            </el-col>
            <el-col :span="7">
                <span class="itemTitle">开户行</span>
            </el-col>
            <el-col :span="7">
            <span class="itemTitle">银行账号</span>
            </el-col>
            <el-col :span="3">
            </el-col>
        </el-row>

        <el-row v-for="(bankEntryItem,bankEntryIndex) in item.bankEntryList" :key="bankEntryIndex" :class="bankEntryItem.defaultFlag?'bankContentRow':''">
            <div v-if="bankEntryItem.defaultFlag" class="defalutBackContent"></div>
            <el-col :span="7">
                <el-form-item label="">
                    <el-input size="small"  v-model.trim="bankEntryItem.jdeAccount" disabled class="sectionContent itemContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="">
                    <el-input size="small"  v-model.trim="bankEntryItem.depositBankName" disabled class="sectionContent itemContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="">
                    <el-input size="small"  v-model.trim="bankEntryItem.depositBankAccount" disabled class="sectionContent itemContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="3">
                <el-form-item label="" >
                   <el-radio v-model="bankEntryItem.defaultFlag" :label="1" :disabled="isDisabled"  class="sectionContent radioContent" @change="changeDefaultFlag(item.bankEntryList,bankEntryItem)">默认设置</el-radio>
                 </el-form-item>
            </el-col>
        </el-row>

        </div>
     </div>
     </div>

    <div class="regionalContent">
     <div class="regionalBankContent" v-for="(item,index) in companyForm.companyAlipayWechatInfos" :key="index">
        <el-row>
            <el-col :span="8">
                <el-form-item label="支付宝信息">
                    <el-select size="small"  v-model="item.brandId" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled || isEdit" class="sectionContent">
                        <el-option v-for="itemBrand in brandOptions" :key="itemBrand.value" :label="itemBrand.label" :value="itemBrand.value">
                        </el-option>
                    </el-select>
                 </el-form-item>
            </el-col>
        </el-row>
        <div class="bankContent">
        <el-row>
            <el-col :span="21">
                <el-col :span="7">
                  <span class="itemTitle">支付宝账号</span>
               </el-col>
            </el-col>
            <el-col :span="3">
            </el-col>
        </el-row>
        <el-row v-for="(alipayWechatEntryItem,alipayWechatEntryIndex) in item.alipayWechatEntryList" :key="alipayWechatEntryIndex" :class="alipayWechatEntryItem.defaultFlag?'bankContentRow':''">
            <div v-if="alipayWechatEntryItem.defaultFlag" class="defalutBackContent"></div>
            <el-col :span="21">
                <el-col :span="7">
                <el-form-item label="">
                    <el-input size="small"  v-model.trim="alipayWechatEntryItem.alipaywechatAccount"  disabled class="sectionContent itemContent"></el-input>
                 </el-form-item>
                </el-col>
            </el-col>
            <el-col :span="3">
                <el-form-item label="" >
                   <el-radio v-model="alipayWechatEntryItem.defaultFlag" :label="1" :disabled="isDisabled"  class="sectionContent radioContent" @change="changeDefaultFlag(item.alipayWechatEntryList,alipayWechatEntryItem)">默认设置</el-radio>
                 </el-form-item>
            </el-col>
        </el-row>

        </div>
     </div>
     </div>

     <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                <el-form-item label="JDE同步时间">
                     <el-date-picker v-model="companyForm.jdeModifiedTime" type="datetime" placeholder="" clearable disabled class="sectionContent">
                    </el-date-picker>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新时间">
                     <el-date-picker v-model="companyForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled class="sectionContent">
                     </el-date-picker>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                     <el-input size="small"  v-model.trim="companyForm.modifiedUser" placeholder="" clearable disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="opreaContent" v-if="!isDisabled">
         <el-button size="small"  class="c-button c-button--plain" @click="cancel" plain>取消</el-button>
         <el-button size="small"  class="c-button c-button--primary" @click="save">保存</el-button>
     </div>
    </el-form>
</template>
<script>
    import api from '../../model/api'
    import scroll from '@/directives/index'
    export default {
      name:'companyDetail',
      props:["isDisabled","isEdit"],
      directives: {scroll},
      data(){
          var validTele = (rule, value, callback) =>{
              if(!this.common.validTele(value) && value){
                  callback(new Error('手机格式不正确'));
              }else{
                  callback()
              }
          }

          var validNum = (rule, value, callback) =>{
              if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value) && value) {
                 callback(new Error('请输入正确的格式'));
              }
              else if (value > 99999) {
                  callback(new Error('最大限额为99999.00 '));
              }
              else{
                  callback()
              }
          }

          var validFixedTel = (rule, value, callback) =>{
              if(!/0\d{2,3}\d{6,8}/.test(value) && !this.common.isNullString(value)){
                 callback(new Error('请输入正确的格式'));
              }
              else{
                  callback()
              }
          }

          var validLegalPersonAbbre = (rule, value, callback) => {
            if (!/^[A-Za-z0-9]+$/.test(value) && value) {
                callback(new Error('只能输入数字、字母'));
            }
            else{
                  callback()
            }
         }

         var validRemark = (rule, value, callback) => {
            if (!this.common.validSpecificSym(value)) {
                    callback(new Error('不能输入特殊字符'));
            }else{
                    callback()
            }
         }

          return{
            companyForm:{},
            brandOptions:[],
            MarketOptions:[],
            companyTypeOptions:[],
            innerContactOptions:[],
            fbcContactOptions:[],
            fmContactOptions:[],
            loadingInner:false,
            loadingFbc:false,
            loadingFm:false,
            loadingMarketName:false,
            pageSize:20,
            innerPageIndex:1,
            fmPageIndex:1,
            fbcPageIndex:1,
            innerQuery:'',
            fmQuery:'',
            fbcQuery:'',
            innerLoadSign:true,
            fmLoadSign:true,
            fbcLoadSign:true,
            nnInfoOptions:[],
            typeOptions:[

                {
                    label:'餐厅业务',
                    value:1
                },
                {
                    label:'E-Com业务',
                    value:2
                },
                {
                    label:'餐厅业务及E-Com业务',
                    value:3
                },
            ],
            rules:{
                remark:[ { validator: validRemark, trigger: ['blur'] }],
                legalPersonAbbre:[
                    { required:true, message: '请输入法人缩写', trigger: ['blur'] },
                    { validator: validLegalPersonAbbre, trigger: ['blur'] }
                ],
                fmContactMail:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                fbcContactMail:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                innerContactMail:[
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                fmContactMobileTel:[
                     { validator: validTele, trigger: ['blur'] }
                ],
                innerContactMobileTel:[
                    { validator: validTele, trigger: ['blur'] }
                ],
                fbcContactMobileTel:[
                    { validator: validTele, trigger: ['blur'] }
                ],
                brandList:[
                    { required:true, message: '请选择品牌', trigger: ['blur','change'] }
                ],
                singleTicketLimit:[
                    { validator: validNum, trigger: ['blur'] }
                ],
                innerContactFixedTel:[{
                    validator: validFixedTel, trigger: ['blur']
                }],
                fbcContactFixedTel:[{
                    validator: validFixedTel, trigger: ['blur']
                }],
                fmContactFixedTel:[{
                    validator: validFixedTel, trigger: ['blur']
                }],
                fmContactNameId:[
                    { required:true, message: '不能为空', trigger: ['blur'] }
                ],
                fbcContactNameId:[
                    { required:true, message: '不能为空', trigger: ['blur'] }
                ],
                innerContactNameId:[
                    { required:true, message: '不能为空', trigger: ['blur'] }
                ],
                marketId:[
                    { required:true, message: '请选择财务市场', trigger: ['blur','change'] }
                ],
                type:[
                    { required:true, message: '请选择类别', trigger: ['blur','change'] }
                ]
            },
            matchedFBC : false,
            matchedFM  : false,
            matchedInner : false
          }
      },
    //   computed:{
        //   innerContactFixedTel:function(){
        //         this.companyForm.innerContactFixedTel = this.companyForm.innerContactFixedZone +'-'+this.companyForm.innerContactFixedTelp
        //         return  this.companyForm.innerContactFixedZone +'-'+ this.companyForm.innerContactFixedTelp
        //   },
        //   outerContactFixedTel:function(){
        //        this.companyForm.outerContactFixedTel = this.companyForm.outerContactFixedZone +'-'+ this.companyForm.outerContactFixedTelp
        //        return  this.companyForm.outerContactFixedZone +'-'+ this.companyForm.outerContactFixedTelp
        //   },
        //   fmContactFixedTel:function(){
        //        this.companyForm.fmContactFixedTel = this.companyForm.fmContactFixedZone +'-'+ this.companyForm.fmContactFixedTelp
        //        return  this.companyForm.fmContactFixedZone +'-'+ this.companyForm.fmContactFixedTelp
        //   }
    //   },
      beforeMount(){
          if(this.$refs.companyForm){
              this.$refs.companyForm.clearValidate()
          }
          this.getCondition()
          if(this.$route.query.companyId)
          {
              this.getCompany(this.$route.query.companyId)
          }
            this.getInnerContact()
            this.getFbcContact()
            this.getFmContact()
      },

      methods:{
          changeDefaultFlag(bankEntryList,bankEntryItem){
              bankEntryList.forEach(function(item,index){
                  item.defaultFlag = (item == bankEntryItem) ? bankEntryItem.defaultFlag : 0
              })
          },
          //内部
          getMoreInnerContact(){
            if(this.innerLoadSign){
                this.innerPageIndex ++
                this.getInnerContact()
            }
          },
          changeInnerContact(val){
            var that = this
            this.matchedInner = false;
            this.innerContactOptions.forEach(function(item,index){
                if(item.id == val){
                    that.matchedInner = true
                    that.companyForm.innerContactFixedTel = item.phone
                    that.companyForm.innerContactMobileTel = item.mobile
                    that.companyForm.innerContactMail = item.mail
                    that.companyForm.innerContactId = item.psId
                    that.companyForm.innerContactPsId = item.psId
                    that.companyForm.innerContactName  = item.userName
                    return
                }
            });
            if(!this.matchedInner){
                this.companyForm.innerContactFixedTel = null
                this.companyForm.innerContactMobileTel = null
                this.companyForm.innerContactMail = null
                this.companyForm.innerContactId = null
                this.companyForm.innerContactPsId = null
                this.companyForm.innerContactName  = val
            }
          },
          remoteInnerContact(query){
              this.loadingInner = true
              setTimeout(() => {
                 this.innerQuery = query
                 this.innerPageIndex = 1
                 this.getInnerContact(true)
             }, 200);
          },
          getInnerContact(isRemote){
              var that = this
              var param = [{
                  name:'userName',
                  value:this.innerQuery
              },
              {
                  name:'pageSize',
                  value:this.pageSize
              },
              {
                  name:'pageIndex',
                  value:this.innerPageIndex
              },{
                  name:'workType',
                  value:'12'
              }]
              api.getFmFbcInfo(this.common.joinSearchParam(param),function(res){
                  that.loadingInner = false
                  if(res.code == 200){
                      that.innerLoadSign = true
                      if(isRemote && that.innerPageIndex == 1){
                         that.innerContactOptions = res.data
                      }else{
                         that.innerContactOptions = that.innerContactOptions.concat(res.data)
                      }
                  }else if(res.code == 404){
                      that.innerLoadSign = false
                      if(isRemote && that.innerPageIndex == 1){
                         that.innerContactOptions = []
                      }
                  }
              })
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
            this.matchedFBC = false;
            this.fbcContactOptions.forEach(function(item,index){
                if(item.id == val){
                    that.matchedFBC = true;
                    that.companyForm.fbcContactFixedTel = item.phone
                    that.companyForm.fbcContactMobileTel = item.mobile
                    that.companyForm.fbcContactMail = item.mail
                    that.companyForm.fbcContactId = item.psId
                    that.companyForm.fbcContactPsId = item.psId
                    that.companyForm.fbcContactName  = item.userName
                    return
                }
            });
            if(!this.matchedFBC){
                this.companyForm.fbcContactFixedTel = null
                this.companyForm.fbcContactMobileTel = null
                this.companyForm.fbcContactMail = null
                this.companyForm.fbcContactId = null
                this.companyForm.fbcContactPsId = null
                this.companyForm.fbcContactName  = val
            }
          },
          remoteFbcContact(query){
              this.loadingFbc = true
              setTimeout(() => {
                 this.fbcQuery = query
                 this.fbcPageIndex = 1
                 this.getFbcContact(true)
             }, 200);
          },
          getFbcContact(isRemote){
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
                      if(isRemote && that.fbcPageIndex == 1){
                         that.fbcContactOptions = res.data
                      }else{
                         that.fbcContactOptions = that.fbcContactOptions.concat(res.data)
                      }
                  }else if(res.code == 404){
                      that.fbcLoadSign = false
                      if(isRemote && that.fbcPageIndex == 1){
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
                    that.matchedFM = true
                    that.companyForm.fmContactFixedTel = item.phone
                    that.companyForm.fmContactMobileTel = item.mobile
                    that.companyForm.fmContactMail = item.mail
                    that.companyForm.fmContactId = item.psId
                    that.companyForm.fmContactPsId = item.psId
                    that.companyForm.fmContactName  = item.userName
                    return
                }
            });
            if(!this.matchedFM){
                this.companyForm.fmContactFixedTel = null
                this.companyForm.fmContactMobileTel = null
                this.companyForm.fmContactMail = null
                this.companyForm.fmContactId = null
                this.companyForm.fmContactPsId = null
                this.companyForm.fmContactName  = val
            }
          },
          remoteFmContact(query){
              this.loadingFm = true
              setTimeout(() => {
                 this.fmQuery = query
                 this.fmPageIndex = 1
                 this.getFmContact(true)
             }, 200);
          },
          getFmContact(isRemote){
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
                      if(isRemote && that.fmPageIndex == 1){
                         that.fmContactOptions = res.data
                      }else{
                         that.fmContactOptions = that.fmContactOptions.concat(res.data)
                      }
                  }else if(res.code == 404){
                      that.fmLoadSign = false
                      if(isRemote && that.fmPageIndex == 1){
                         that.fmContactOptions = []
                      }
                  }
              })
          },
          //end
          save(){
             var that = this
             this.$refs.companyForm.validate((valid) => {
                    if (valid) {
                        var submitParam = {
                            brandList:this.companyForm.brandList,
                            affiliatedFinancialMarketId:this.companyForm.marketId,
                            companyId:this.companyForm.companyId,
                            legalPersonAbbre:this.common.isNullString(this.companyForm.legalPersonAbbre)?'':this.companyForm.legalPersonAbbre,
                            fmContactFixedTel:this.common.isNullString(this.companyForm.fmContactFixedTel)?'':this.companyForm.fmContactFixedTel,
                            fmContactMail: this.common.isNullString(this.companyForm.fmContactMail)?'':this.companyForm.fmContactMail,
                            fmContactMobileTel: this.common.isNullString(this.companyForm.fmContactMobileTel)?'':this.companyForm.fmContactMobileTel,
                            fmContactName: this.common.isNullString(this.companyForm.fmContactName)?'':this.companyForm.fmContactName,
                            fmContactId: this.companyForm.fmContactId,
                            innerContactFixedTel: this.common.isNullString(this.companyForm.innerContactFixedTel)?'':this.companyForm.innerContactFixedTel,
                            innerContactMail: this.common.isNullString(this.companyForm.innerContactMail)?'':this.companyForm.innerContactMail,
                            innerContactMobileTel: this.common.isNullString(this.companyForm.innerContactMobileTel)?'':this.companyForm.innerContactMobileTel,
                            innerContactName: this.common.isNullString(this.companyForm.innerContactName)?'':this.companyForm.innerContactName,
                            innerContactId: this.companyForm.innerContactId,
                            fbcContactFixedTel: this.common.isNullString(this.companyForm.fbcContactFixedTel)?'':this.companyForm.fbcContactFixedTel,
                            fbcContactMail: this.common.isNullString(this.companyForm.fbcContactMail)?'':this.companyForm.fbcContactMail,
                            fbcContactMobileTel: this.common.isNullString(this.companyForm.fbcContactMobileTel)?'':this.companyForm.fbcContactMobileTel,
                            fbcContactName: this.common.isNullString(this.companyForm.fbcContactName)?'':this.companyForm.fbcContactName,
                            fbcContactId: this.companyForm.fbcContactId,
                            remark: this.common.isNullString(this.companyForm.remark)?'':this.companyForm.remark,
                            singleTicketLimit: this.common.isNullString(this.companyForm.singleTicketLimit)?'':this.companyForm.singleTicketLimit,
                            type: this.common.isNullString(this.companyForm.type)?'':this.companyForm.type,
                            jdeCode:this.common.isNullString(this.companyForm.jdeCode)?'':this.companyForm.jdeCode,
                            companyBrandBankList:this.companyForm.companyBrandBankList,
                            companyAlipayWechatInfos:this.companyForm.companyAlipayWechatInfos,
                            flag:this.companyForm.flag,
                            billingUnitNnStoreCode:this.companyForm.billingUnitNnStoreCode
                        }
                        api.updateCompany(submitParam,function(res){
                                res.code === 200 ? (that.common.messageUtil({
                                    message: res.data,
                                    type: 'success'
                                }),that.$refs.companyForm.clearValidate(),that.cancel()): that.common.messageUtil({
                                    message: res.msg,
                                    type: 'warning'
                                })
                        })
                    } else {
                        return false;
                    }
            });
          },
          cancel(){
              this.common.deleteTag(this.$route,this)
          },
          getCondition(){
            var that = this
            api.getBrandEnglishNames('?flag=3',function(res){
                if(res.code === 200){
                    that.brandOptions = []
                    res.data.forEach(function(item,index){
                        that.brandOptions.push({value:item.id,label:item.englishName})
                    })
                }
            })

            api.getFinanceMarketIdNames('',function(res){
                if(res.code === 200){
                    that.MarketOptions = [];
                    res.data.forEach(function(item,index){
                        that.MarketOptions.push({value:item.id,label:item.name})
                    })
                }
            })
            api.getDictionaryByNumber('COMPANYTYPE',function(res){
                if(res.code === 200){
                    that.companyTypeOptions = res.data
                }else{
                    that.companyTypeOptions = []
                }
            })

          },
          getCompany(companyId){
            var that = this
            api.getCompanyId(companyId,function(res){
                 that.companyForm = res.data
                 that.companyForm.brandId = res.data.brandId ? res.data.brandId : []
                 that.companyForm.type = that.common.isNullString(that.companyForm.type) ? that.companyForm.type : parseInt(that.companyForm.type)
                 that.companyForm.innerContactName = that.common.isNullString(that.companyForm.innerContactName) ? '' : that.companyForm.innerContactName
                 that.companyForm.innerContactId = that.common.isNullString(that.companyForm.innerContactId) ? '' : that.companyForm.innerContactId
                 that.companyForm.fbcContactName = that.common.isNullString(that.companyForm.fbcContactName) ? '' : that.companyForm.fbcContactName
                 that.companyForm.fbcContactId = that.common.isNullString(that.companyForm.fbcContactId) ? '' : that.companyForm.fbcContactId
                 that.companyForm.fmContactName = that.common.isNullString(that.companyForm.fmContactName) ? '' : that.companyForm.fmContactName
                 that.companyForm.fmContactId = that.common.isNullString(that.companyForm.fmContactId) ? '' : that.companyForm.fmContactId
                 that.$set(that.companyForm,'innerContactNameId',that.companyForm.innerContactName+that.companyForm.innerContactId)
                 that.$set(that.companyForm,'fbcContactNameId',that.companyForm.fbcContactName+that.companyForm.fbcContactId)
                 that.$set(that.companyForm,'fmContactNameId',that.companyForm.fmContactName+that.companyForm.fmContactId)
                api.getNNInfoByJdeCode(that.companyForm.jdeCode,res=>{
                    if(res.code === 200){
                        that.nnInfoOptions = res.data
                    }else{
                        that.nnInfoOptions = []
                    }
                })
            })

          },
          spliString(text){
              if(this.common.isNullString(text))
                {
                    return ['','']
                }
              return text.split('-')
          }
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
          width: 95%;
        .inputZoneContent{
            width:35%
        }
        .inputFixTeContent{
            width:55%
        }
        &.radioContent{
            margin-top:30px
        }
        &.itemContent{
            margin-top:15px
        }
      }
    }
   .el-input--suffix .el-input__inner{
    padding-right:0px
   }
   .el-form-item{
        margin-bottom: 10px;
        .inputZoneContent{
            width:35%
        }
        .inputFixTeContent{
            width:55%
        }
   }
}
.regionalBankContent{
    &:last-child{
          padding-bottom: 20px
      }
      &:first-child{
          padding-top: 20px
      }
    .el-row {
      padding:0px 20px 0px;
      &:first-child{
          padding-top: 0px
      }
    }

}
.bankContent {
    .bankContentRow{
        position: relative;
        .defalutBackContent{
        background-color: rgba(86, 205, 116, 0.1);
        height: 60px;
        border: 1px solid #ccc;
        position: absolute;
        width: calc(100% - 20px);
        bottom: 0px;
        left: 10px;
      }
    }

     .el-row {
      padding:0px 20px 0px;
      &:last-child{
          padding-bottom: 0px
      }
      &:first-child{
          padding-top: 0px
      }
    }
    .itemTitle{
        float: none;
        display: inline-block;
        text-align: left;
        padding: 0 0 10px;
        font-size: 13px;
        color: #606266;
        line-height: 5px;
    }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
}

</style>
