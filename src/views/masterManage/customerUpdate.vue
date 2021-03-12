<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="customerData"
            :model="customerData"
            :rules="rules"
            label-width="100px">
        <div class="viewFormCustomer">
            <el-form-item label="JDE Code">
                <el-input size="small"  placeholder="" v-model="customerData.customerNumber" disabled></el-input>
            </el-form-item>
            <el-form-item label="第三方名称">
                <el-input size="small"  placeholder="" v-model="customerData.customerName" disabled></el-input>
            </el-form-item>
            <el-form-item label="简称">
                <el-input size="small"  placeholder="" v-model="customerData.customerAbbre"></el-input>
            </el-form-item>
        </div>
        <div class="viewFormCustomer">
            <el-form-item label="联系人">
                <el-input size="small"  placeholder="" v-model="customerData.contactPerson" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input size="small"  placeholder="" v-model="customerData.phone" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="固定电话">
                <el-input size="small"  placeholder="" v-model="customerData.telephone" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" class="longerItem">
                <el-input size="small"  placeholder="" v-model="customerData.customerAddress" disabled></el-input>
            </el-form-item><br>
            <el-form-item label="开户银行">
                <el-input size="small"  placeholder="" v-model="customerData.depositBank" disabled></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input size="small"  placeholder="" v-model="customerData.account" disabled></el-input>
            </el-form-item><br>
            <el-form-item label="法人缩写" prop="customerLegalPersonAbbre">
                <el-input size="small"  placeholder="" v-model="customerData.customerLegalPersonAbbre" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="开票单位缩写" prop="customerBillingUnitAbbre">
                <el-input size="small"  placeholder="" v-model="customerData.customerBillingUnitAbbre" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="税号">
                <el-input size="small"  placeholder="" v-model="customerData.taxNumber" disabled></el-input>
            </el-form-item>
        </div>
        <div class="viewFormCustomer">
            <el-form-item label="邮政编码">
                <el-input size="small"  placeholder="" v-model="customerData.mailCode" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="发票收件地址" class="longerItem">
                <el-input size="small"  placeholder="" v-model="customerData.ticketReceivedAddress" clearable :disabled="isChecked"></el-input>
            </el-form-item><br>
            <el-form-item label="电子发票收件人邮箱">
                <el-input size="small"  placeholder="" v-model="customerData.mail" clearable :disabled="isChecked"></el-input>
            </el-form-item>
        </div>
        <div class="viewFormCustomer">
            <el-form-item label="JDE同步时间">
                <el-input size="small"  placeholder="" v-model="customerData.jdeUpdateTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间">
                <el-input size="small"  placeholder="" v-model="customerData.modifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新人">
                <el-input size="small"  placeholder="" v-model="customerData.modifiedUser" disabled></el-input>
            </el-form-item>
        </div>
        <div class="buttomButton" v-if="!isChecked">
            <el-form-item>
                <el-button size="small"  type="success" plain @click='cancel' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="updateCustomer('customerData')" class="c-button">保存</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "customerUpdate",
        data(){
            return{
                isChecked:false,
                customerId: '',
                customerData: {},
                rules: {
                    customerLegalPersonAbbre:{ required: true, message: '请输入法人缩写', trigger: 'blur' },
                    customerBillingUnitAbbre:{ required: true, message: '请输入开票单位缩写', trigger: 'blur' }
                },
                form: {}
            }
        },
        methods:{
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            getCustomerList(customerId){
                var that = this;
                ip.getCustomerById(customerId,function (res) {
                    if(res.code === 200){
                        that.customerData = res.data;
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            updateCustomer(formName){
                var that = this;
                delete this.customerData.modifiedTime;
                delete this.customerData.modifiedUser;
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        ip.updateCustomer(this.customerData,function (res) {
                            if(res.code === 200){
                                that.common.messageUtil({
                                    type:'success',
                                    message:res.data
                                });
                                that.cancel();  
                            }
                        })
                    }else{
                        return false
                    }
                })
            }
        },
        mounted(){
            this.getCustomerList(this.$route.query.customerId);
            if(this.$route.query.detail){
                this.isChecked = true;
            }else{
                this.isChecked = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
