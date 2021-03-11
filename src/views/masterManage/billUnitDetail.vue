<template>
    <el-form :model="billUnitForm" labelPosition="top" :rules="rules" ref="billUnitForm">
      <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                 <el-form-item label="JDE code">
                     <el-input size="small"   v-model="billUnitForm.jdeCode" :placeholder="isDisabled?'':'请输入JDE code'" clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="开票单位名称">
                     <el-input size="small"  v-model.trim="billUnitForm.billingUnitName" placeholder="" clearable disabled class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="法人公司">
                     <el-input size="small"  v-model.trim="billUnitForm.affiliatedCompany" :placeholder="isDisabled?'':'请输入法人缩写'" code clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                 <el-form-item label="品牌">
                     <el-select size="small"  v-model="billUnitForm.brandId" :placeholder="isDisabled?'':'请选择品牌'" filterable disabled class="sectionContent">
                        <el-option v-for="itemBrand in brandOptions" :key="itemBrand.value" :label="itemBrand.label" :value="itemBrand.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="是否小规模纳税人">
                     <el-select size="small"  v-model="billUnitForm.smallScaleTaxpayers" :placeholder="isDisabled?'':'请选择'" filterable :disabled="isDisabled" class="sectionContent">
                        <el-option label="是" value="1" > </el-option>
                        <el-option label="否" value="0" > </el-option>
                     </el-select>
                 </el-form-item>
            </el-col>
        </el-row>
        <el-row>
             <el-col :span="8">
                <el-form-item label="地址">
                      <el-input size="small"  v-model.trim="billUnitForm.wholeAddress" :placeholder="isDisabled?'':'请输入地址'" clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                 <el-form-item label="邮箱" prop="mail">
                     <el-input size="small"  v-model.trim="billUnitForm.mail" :placeholder="isDisabled?'':'请输入邮箱'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
             <el-col :span="8">
                 <el-form-item label="电话" prop="telephone">
                       <el-input size="small"  v-model.trim="billUnitForm.telephone" :placeholder="isDisabled?'':'请输入电话'" clearable :disabled="isDisabled" class="sectionContent" :maxlength="12"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
             <el-col :span="8">
                <el-form-item label="开票单位缩写" prop="billingUnitAbbre">
                    <el-input size="small"  v-model.trim="billUnitForm.billingUnitAbbre" :maxlength="20" :placeholder="isDisabled?'':'请输入开票单位缩写'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="税号" prop="taxNumber">
                      <el-input size="small"  v-model.trim="billUnitForm.taxNumber" :maxlength="18" :placeholder="isDisabled?'':'请输入税号'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="开票单张限额(元)" prop="hideSingleLimit">
                    <el-input style="display:none" size="small"  v-model="billUnitForm.hideSingleLimit"></el-input>
                     <span style="display:none">{{hideSpanSingleLimit}}</span>
                     <el-input size="small"  v-model.trim="billUnitForm.singleLimit" :placeholder="isDisabled?'':'请输入开票单张限额'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
     </div>
      <div class="regionalContent">
     <div class="regionalBankContent" v-for="(item,index) in billUnitForm.billingUnitBrandBankList" :key="index">
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
        <el-row v-for="(bankEntryItem,bankEntryIndex) in item.bankEntryList" :key="bankEntryIndex" :class="bankEntryItem.defaultFlag?'bankContentRow':''">
            <div v-if="bankEntryItem.defaultFlag" class="defalutBackContent"></div>
            <el-col :span="7">
                <el-form-item label="银行JDE号">
                    <el-input size="small"  v-model.trim="bankEntryItem.jdeAccount" clearable :disabled="isDisabled || isEdit" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="开户行">
                    <el-input size="small"  v-model.trim="bankEntryItem.depositBankName" clearable :disabled="isDisabled || isEdit" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="银行账号">
                    <el-input size="small"  v-model.trim="bankEntryItem.depositBankAccount" clearable :disabled="isDisabled || isEdit" class="sectionContent"></el-input>
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
        <el-row>
            <el-col :span="8">
                <el-form-item label="JDE同步时间">
                      <el-date-picker v-model="billUnitForm.jdeModifiedTime" type="datetime" placeholder="" clearable disabled  class="sectionContent">
                      </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新时间">
                       <el-date-picker v-model="billUnitForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled class="sectionContent">
                       </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                       <el-input size="small"  v-model.trim="billUnitForm.modifiedUser" placeholder="" clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="opreaContent" v-if="!isDisabled">
         <el-button size="small"  type="success" @click="cancel" plain>取消</el-button>
         <el-button size="small"  type="success" @click="save('billUnitForm')">保存</el-button>
     </div>
    </el-form>
</template>
<script>
    import api from '../../model/api'
    export default {
      name:'companyDetail',
      props:["isDisabled","isEdit"],
      data(){
        //   var validTele = (rule, value, callback) =>{
        //       if(!this.common.validTele(value) && value !=''){
        //           callback(new Error('手机格式不正确'));
        //       }else{
        //           callback()
        //       }
        //   };
           var validFixedTel = (rule, value, callback) =>{
              if(!/0\d{2,3}\d{6,8}/.test(value) && !this.common.isNullString(value)){
                 callback(new Error('请输入正确的格式'));
              }
              else{
                  callback()
              }
          }
          var validNum = (rule, value, callback) =>{
              // console.log('value',value)
              if (!/^[0-9]+(.[0-9]{2})?$/.test(this.billUnitForm.hideSingleLimit) && this.billUnitForm.hideSingleLimit) {
                 callback(new Error('请输入正确的格式(保留两位小数)'));
              }
              else if (this.billUnitForm.hideSingleLimit > 999999.99) {
                  callback(new Error('最大限额为999,999.99'));
              }
              else{
                  callback()
              }
          };
          var validNumEng = (rule, value, callback) => {
            if (!/^[A-Za-z0-9]+$/.test(value) && value) {
                callback(new Error('只能输入数字、字母'));
            }
            else{
                  callback()
            }
         }
          return{
            billUnitForm:{},
            brandOptions:[],
             rules: {
                mail: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
                ],
                telephone:[
                    { validator: validFixedTel , trigger: ['blur'] }
                ],
                hideSingleLimit:[
                    { validator: validNum , trigger: ['blur'] }
                ],
                taxNumber:[
                    { validator: validNumEng , trigger: ['blur'] }
                ],
                billingUnitAbbre:[
                    {required:true,message:'请输入开票单位缩写',trigger: ['blur']},
                    { validator: validNumEng , trigger: ['blur'] }
                ]
            }
          }
      },
      computed:{
          hideSpanSingleLimit:function(){
               if(this.billUnitForm.singleLimit){
                   this.$set(this.billUnitForm,'hideSingleLimit',this.billUnitForm.singleLimit.split(",").join(""))
                   this.$forceUpdate()
                  return this.billUnitForm.hideSingleLimit
               }
               this.billUnitForm.hideSingleLimit = ''
               this.$forceUpdate()
               return ''

          }

      },
      beforeMount(){
          var that = this
          if(this.$route.query.billingUnitId)
          {
              api.getBillUnitById(this.$route.query.billingUnitId,function(res){
                    that.billUnitForm = res.data
                    that.billUnitForm.province = that.common.isNullString(that.billUnitForm.province) ? '':that.billUnitForm.province
                    that.billUnitForm.city = that.common.isNullString(that.billUnitForm.city) ? '':that.billUnitForm.city
                    that.billUnitForm.address = that.common.isNullString(that.billUnitForm.address) ? '':that.billUnitForm.address
                    that.billUnitForm.wholeAddress = that.billUnitForm.province + that.billUnitForm.city + that.billUnitForm.address
                    that.billUnitForm.hideSingleLimit = that.billUnitForm.singleLimit.split(",").join("");
                    that.billUnitForm.brandId = Number(res.data.brandId);
                    that.billUnitForm.smallScaleTaxpayers = res.data.smallScaleTaxpayers + '';
              })
          }
          this.getBrandOptions()
      },
      methods:{
          changeDefaultFlag(bankEntryList,bankEntryItem){
              bankEntryList.forEach(function(item,index){
                  item.defaultFlag = (item == bankEntryItem) ? bankEntryItem.defaultFlag : 0
              })
          },
          getBrandOptions(){
            var that = this
            api.getBrandList('?pageSize=0&flag=3',function(res){
                if(res.code === 200){
                    that.brandOptions = []
                    res.data.list.forEach(function(item,index){
                        that.brandOptions.push({value:item.brandId,label:item.brandEnglishName})
                    })
                }
            })
          },
          save(billUnitForm){
             var that = this
             this.$refs[billUnitForm].validate((valid) => {
                    if (valid) {
                        var param = {
                            billingUnitId:this.billUnitForm.billingUnitId,
                            billingUnitAbbre:this.billUnitForm.billingUnitAbbre,
                            brandId:this.billUnitForm.brandId,
                            smallScaleTaxpayers:this.billUnitForm.smallScaleTaxpayers,
                            mail:this.billUnitForm.mail,
                            taxNumber:this.billUnitForm.taxNumber,
                            telephone:this.billUnitForm.telephone,
                            singleLimit:this.common.isNullString(this.billUnitForm.hideSingleLimit) ? null : this.billUnitForm.hideSingleLimit,
                            billingUnitBrandBankList:this.billUnitForm.billingUnitBrandBankList
                        }
                        api.updateBillUnit(param,function(res){
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.$refs.billUnitForm.resetFields(),that.cancel()): that.showTips(res.msg,'warning')
                        })
                    } else {
                        return false;
                    }
            });
          },
          cancel(){
              this.common.deleteTag(this.$route,this)
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
          width: 95%;
          &.radioContent{
            margin-top:65px
        }
      }
    }
    .el-input--suffix .el-input__inner{
        padding-right:0px
    }

    .el-form-item{
        margin-bottom: 10px;
    }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
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
}

</style>
