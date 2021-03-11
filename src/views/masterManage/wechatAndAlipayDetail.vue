<template>
    <el-form :model="form" :rules="rules" ref="wechatAlipayForm" labelPosition="top">
    <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                <el-form-item label="支付宝账号" prop="alipaywechatAccount">
                    <el-input v-model.trim="form.alipaywechatAccount" clearable :placeholder="isDisabled?'':'请输入支付宝账号'" size="small" :disabled="isDisabled"
                     :maxlength="50" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="商户号" prop="merchantNumber">
                    <el-input v-model.trim="form.merchantNumber" clearable :placeholder="isDisabled?'':'请输入商户号'" size="small" :disabled="isDisabled"
                      class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="法人公司" prop="companyId">
                    <el-select v-model="form.companyId" :placeholder="isDisabled?'':'请选择法人公司'" size="small" :disabled="isDisabled"
                    filterable class="sectionContent" @change="changeCompany">
                      <el-option v-for="item in companyOption"  :key="item.companyId" :label="item.jdeCode+' '+item.companyName" :value="item.companyId">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                 <el-form-item label="品牌" prop="brandId">
                    <el-select v-model="form.brandId" :placeholder="isDisabled?'':'请选择品牌'" size="small" :disabled="isDisabled"
                    filterable class="sectionContent" @change="changeBrand" value-key="id">
                      <el-option v-for="item in brandOption"  :key="item.id" :label="item.brand_english_name" :value="item">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="银行JDE号" prop="bankJde">
                    <el-select v-model="form.bankJde" :placeholder="isDisabled?'':'请选择银行JDE号'" size="small" :disabled="isDisabled"
                     filterable class="sectionContent" @change="changeBankJDE">
                      <el-option v-for="(item,index) in bankJDEOption"  :key="item.jdeAccount+'_'+index" :label="item.jdeAccount" :value="item.jdeAccount">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="银行账号">
                     <el-input v-model.trim="form.depositBankAccount" size="small" disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="8">
                 <el-form-item label="开户行">
                    <el-input v-model.trim="form.depositBankName" size="small" disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="会计科目" prop="accountingSubject">
                    <el-select  v-model="form.accountingSubject" placeholder="请选择会计科目" size="small" :disabled="isDisabled"
                                filterable class="sectionContent" >
                      <el-option v-for="item in accountingSubjectOption"  :key="item.subjectNum" :label="item.subjectNum" :value="item.subjectNum">
                      </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否节假日提现" prop="isHolidayWithdrawal">
                    <el-radio-group v-model="form.isHolidayWithdrawal"  size="small" :disabled="isDisabled" class="sectionContent radioGroupContent">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>


        </el-row>
         <el-row>
             <el-col :span="8">
                <el-form-item label="是否周末提现" prop="isWeekendWithdrawal">
                    <el-radio-group v-model="form.isWeekendWithdrawal"  size="small" :disabled="isDisabled" class="sectionContent radioGroupContent" @change="changeWeekend">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                    <el-radio-group  size="small" v-model="form.weekendForbidDay" :disabled="isDisabled" class="sectionContent weekendRadio" v-if="isWeekend">
                        <el-radio :label="1">周六</el-radio>
                        <el-radio :label="2">周日</el-radio>
                        <el-radio :label="3">周六+周日</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="是否节假日上账" prop="isHolidayAccount">
                    <el-radio-group v-model="form.isHolidayAccount"  size="small" :disabled="isDisabled" class="sectionContent">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="是否周末上账" prop="isWeekend">
                    <el-radio-group v-model="form.isWeekend"  size="small" :disabled="isDisabled" class="sectionContent" @change="changeWeekendPush">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                    <el-radio-group  size="small" v-model="form.forbidAccountDay" :disabled="isDisabled" class="sectionContent weekendRadio" v-if="isWeekendPush">
                        <el-radio :label="1">周六</el-radio>
                        <el-radio :label="2">周日</el-radio>
                        <el-radio :label="3">周六+周日</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>

        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="状态" prop="state">
                    <el-radio-group v-model="form.state"  size="small" :disabled="isDisabled" class="sectionContent">
                        <el-radio :label="0">停用</el-radio>
                        <el-radio :label="1">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-col>
            <el-col :span="8">
               <el-form-item label="说明" prop="illustrate">
                    <el-input size="small" type="textarea" v-model="form.illustrate" :disabled="isDisabled" :placeholder="isDisabled?'':'请输入(1-100位)'"
                    :maxlength="100" :autosize="{minRows:4,maxRows:10}" class="sectionContent">
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
    <div class="regionalContent" v-if="isDisabled || isEdit">
        <el-row>
            <el-col :span="8">
                <el-form-item label="更新时间">
                    <el-input v-model.trim="form.modifiedTime"  size="small" disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                        <el-input v-model.trim="form.modifiedUser"  size="small" disabled class="sectionContent"></el-input>
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
    const  defaultForm={
            accountingSubject:'',
            alipaywechatAccount:'',
            companyId:'',
            brandId:'',
            isHolidayAccount:0,
            isHolidayWithdrawal:0,
            isWeekend:0,
            isWeekendWithdrawal:0,
            state:1,
            modifiedTime:'',
            modifiedUser:'',
            illustrate:'',
            depositBankAccount:'',
            depositBankName:'',
            companyJde:'',
            bankJde:'',
            weekendForbidDay:1,
            forbidAccountDay:1
    };
    export default {
      name:'wechatAndAlipayDetail',
      props:["isDisabled","isEdit"],
       data(){
            var validRemark = (rule, value, callback) => {
                if (!this.common.validSpecificSym(value)) {
                    callback(new Error('不能输入特殊字符'));
                }else{
                    callback()
                }
            };

            var validAccount = (rule, value, callback) => {
                if (/^[\u4e00-\u9fa5]+$/.test(value)) {
                    callback(new Error('只能输入数字、字母、符号'));
                }else{
                    callback()
                }
            };

            return{
                brandOption:[],
                companyOption:[],
                accountingSubjectOption:[],
                bankJDEOption:[],
                form:Object.assign({},defaultForm),
                originForm:{},
                rules:{
                    alipaywechatAccount:[
                        {required: true, message: '账号不能为空', trigger: 'blur'},
                        { validator: validAccount, trigger: 'blur'}
                    ],
                    companyId:[{required: true, message: '法人公司不能为空', trigger: 'change'}],
                    brandId:[{required: true, message: '品牌不能为空', trigger: 'change'}],
                    isHolidayAccount:[{required: true, message: '请选择是否节假日上账', trigger: 'blur'}],
                    isHolidayWithdrawal:[{required: true, message: '请选择是否节假日提现', trigger: 'blur'}],
                    isWeekendWithdrawal:[{required: true, message: '请选择是否周末提现', trigger: 'blur'}],
                    isWeekend:[{required: true, message: '请选择是否周末上账', trigger: 'blur'}],
                    status:[{required: true, message: '请选择状态', trigger: 'blur'}],
                    illustrate:[{ validator: validRemark, trigger: 'blur'}],
                    bankJde:[{required: true, message: '请选择银行JDE号', trigger: 'change'}],
                    merchantNumber:[{required: true, message: '商户号不能为空', trigger: 'blur'}],
                    accountingSubject:[{required: true, message: '请选择会计科目', trigger: 'change'}],
                },
                isWeekend:false,
                isWeekendPush:false, //是否周末上账,
                brandId:''//用于回显
            }
    },
     beforeMount(){
          if(this.$refs.wechatAlipayForm){
              this.$refs.wechatAlipayForm.clearValidate()
          }
          if(this.$route.query.alipayId)
          {
              this.getAlipayWechatAccountDetail(this.$route.query.alipayId)
          }
          this.getSearchCondition()
      },
      methods:{
          changeWeekend(val){
              this.isWeekend = val
              this.form.weekendForbidDay = val ? this.form.weekendForbidDay : 1
          },
          changeWeekendPush(val){
              this.isWeekendPush = val
              this.form.forbidAccountDay = val ? this.form.forbidAccountDay : 1
          },
          changeBrand(val){
              var that = this
              var param = [{
                  name:'companyId',
                  value:that.form.companyId
              },{
                  name:'brandId',
                  value:that.form.brandId.id
              }]
              this.bankJde = ''
              this.bankJDEOption = []
              if(!this.common.isNullString(val)){
                 this.form.depositBankAccount = ''
                 this.form.depositBankName = ''
                 this.form.bankJde = ''
              }
              api.getBankByCompanyAndBrand(this.common.joinSearchParam(param),function(res){
                  that.bankJDEOption = (res.code == 200) ? res.data : []
                  if(that.common.isNullString(val)){
                      that.changeBankJDE()
                   }
              })

          },
          changeCompany(val){
              var that = this
              var param = [{
                  name:'companyId',
                  value:this.form.companyId
              }]
              if(!this.common.isNullString(val)){
                  this.form.brandId = ''
                  this.form.bankJde = ''
                  this.form.depositBankAccount = ''
                  this. form.depositBankName = ''
                  this.bankJDEOption = []
                  this.form.companyJde = val.toString()
              }
              this.brandOption = []
              api.getBrandByCompany(this.common.joinSearchParam(param),function(res){
                  that.brandOption = (res.code == 200) ? res.data : [];
                  let obj = that.brandOption.find(x=>{return x.id === that.brandId});
                  that.brandId?obj?that.form.brandId = obj:null:null;
              })
          },
          changeBankJDE(){
              var bankInfo = {}
              var that = this
              this.bankJDEOption.forEach(function(item,indx){
                  if(item.jdeAccount == that.form.bankJde){
                      bankInfo = item
                  }
              })
              this.form.depositBankAccount = bankInfo.depositBankAccount
              this.form.depositBankName = bankInfo.depositBankName
          },
          getSearchCondition(){
              var that = this
              api.getAllCompanyIdNames('',function(res){
                  if(res.code == 200){
                      that.companyOption = res.data.list
                  }else{
                      that.companyOption = []
                  }
              });
              api.getAllAccountingSubjectJdeName(function(res){
                  if(res.code == 200){
                      that.accountingSubjectOption = res.data
                  }else{
                      that.accountingSubjectOption = []
                  }
              })
          },
          save(){
            var that = this
            var isSubmit = false
            this.form.bankJde = this.form.bankJde.toString()
            delete this.form.modifiedTime
            delete this.form.modifiedUser
            this.$refs.wechatAlipayForm.validate((valid) => {
                if (valid) {
                    //检查支付宝是否重名
                    var checkParam = [{
                        name:'companyId',
                        value:that.form.companyId
                    },
                    {
                        name:'alipaywechatAccount',
                        value:that.form.alipaywechatAccount
                    }]

                    var checkMerchantNumberParam = [{
                        name:'companyId',
                        value:that.form.companyId
                    },
                    {
                        name:'merchantNumber',
                        value:that.form.merchantNumber
                    }]

                    // api.checkAlipayWechatAccount(this.common.joinSearchParam(checkParam),function(res){
                    //     if(res.data){
                    //         isSubmit = res.data
                    //     }else{//重名
                    //         //但是是编辑
                    //         isSubmit = (that.originForm.alipaywechatAccount == that.form.alipaywechatAccount && that.originForm.companyId == that.form.companyId ) ? true : res.data
                    //     }
                    //     if(isSubmit){
                    //         //检查商户号是否重复
                    //         api.checkAlipayMerchantNumber(that.common.joinSearchParam(checkMerchantNumberParam),function(res){
                    //             if(res.data){
                    //                 isSubmit = res.data
                    //             }else{//重名
                    //                 //但是是编辑
                    //                 isSubmit = (that.originForm.merchantNumber == that.form.merchantNumber && that.originForm.companyId == that.form.companyId ) ? true : res.data
                    //             }
                                // if(isSubmit){
                                     that.form.brandId =  that.form.brandId.id||'';
                                     if(that.form.id){
                                        // let updateParam = Object.assign({},that.form);
                                        // delete updateParam.depositBankAccount;
                                        // delete updateParam.depositBankName;
                                        api.updateAlipayWechatAccount(that.form,function(res){
                                        res.code == 200 ? (that.common.successMessage(res.data), that.cancel()): that.common.warningMessage(res.msg)
                                        })
                                    }else{
                                        // let insertParam = Object.assign({},that.form);
                                        // delete insertParam.depositBankAccount;
                                        // delete insertParam.depositBankName;
                                        api.insertAlipayWechatAccount(that.form,function(res){
                                        res.code == 200 ? (that.common.successMessage(res.data), that.cancel()): that.common.warningMessage(res.msg)
                                        })
                                    }
                        //         }else{
                        //             that.common.warningMessage('该商户号已经存在')
                        //         }
                        //     })
                        // }else{
                        //     that.common.warningMessage('该支付宝账号已经存在')
                        // }
                    // })
                }else{
                    return false
                }
            })
          },
          cancel(){
              this.common.deleteTag(this.$route,this)
          },
          getAlipayWechatAccountDetail(alipayId){
                var that = this
                api.getAlipayWechatAccountDetail(alipayId,function(res){
                    if(res.code == 200){
                        that.form = res.data;
                        // that.form.accountingSubject = parseInt(that.form.accountingSubject)
                        that.originForm = Object.assign({},res.data)
                        that.isWeekend = that.form.isWeekendWithdrawal
                        that.isWeekendPush = that.form.isWeekend;
                        that.brandId = res.data.brandId;
                        that.changeCompany();
                        that.changeBrand();
                    }else{
                        that.common.warningMessage(res.msg)
                    }
                })

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
      }
      .weekendRadio{
          margin-top: 20px
      }
      .radioGroupContent {
          margin-top:14px;
      }
    }
   .el-input--suffix .el-input__inner{
    padding-right:0px
   }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
}

</style>
