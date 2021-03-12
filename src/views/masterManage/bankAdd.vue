<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="bankData"
            :model="bankData"
            :rules="rules"
            label-width="100px">
        <div class="viewFormHeader">
            <el-form-item label="银行JDE号" class="viewFormBank" prop="mainJdeAccount">
                <el-input size="small"  placeholder="" v-model="bankData.mainJdeAccount" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="开户行" class="viewFormBank" prop="depositBankName">
                <el-input size="small"  placeholder="" v-model="bankData.depositBankName" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" class="viewFormBank" prop="depositBankAccount">
                <el-input size="small"  placeholder="" v-model="bankData.depositBankAccount" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="联行号" class="viewFormBank" prop="linkLineNumber">
                <el-input size="small"  placeholder="" v-model="bankData.linkLineNumber" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <!--<el-form-item label="品牌" class="viewFormBank" prop="brandId">-->
                <!--<el-select size="small"  v-model="bankData.brandId" placeholder="请选择" :disabled="isChecked" filterable>-->
                    <!--<el-option v-for="item in brand" :key="item.id" :label="item.englishName" :value="item.id"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="银行流水标准化名称" class="viewFormBank" prop="bank">
                <el-select size="small"  v-model="bankData.bank" placeholder="请选择" :disabled="isChecked" filterable>
                    <el-option v-for="item in bankOpt" :key="item.id" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="法人公司" class="viewFormBank" prop="companyId">
                <el-select
                        ref="company"
                        @change="getCompanyJdeCode"
                        size="small"
                        v-model="bankData.companyId"
                        :disabled="isChecked"
                        filterable>
                    <el-option label="请选择" :value="null"></el-option>
                    <el-option v-for="item in companyIdOpt" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票单位" class="viewFormBank">
                <el-select
                        ref="billingUnit"
                        @change="getBillingUnitJdeCode"
                        size="small"
                        v-model="bankData.billingUnitId"
                        :disabled="isChecked"
                        filterable>
                    <el-option label="请选择" :value="null"></el-option>
                    <el-option v-for="item in billingUnitIdOpt" :key="item.billingUnitId" :label="item.billingUnitName" :value="item.billingUnitId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="viewFormBank"></el-form-item>
            <el-form-item label="状态" class="viewFormBank" prop="state">
                <el-radio v-model="bankData.state" label="1" :disabled="isChecked">启用</el-radio>
                <el-radio v-model="bankData.state" label="0" :disabled="isChecked">禁用</el-radio>
            </el-form-item>
        </div>
        <div class="viewFormContent">
            <el-form-item label="是否周末存行" prop="weatherWeekendStore">
                <el-radio v-model="bankData.weatherWeekendStore" :label="0" :disabled="isChecked">是</el-radio>
                <el-radio v-model="bankData.weatherWeekendStore" :label="1" :disabled="isChecked">否</el-radio>
            </el-form-item><br>
            <el-form-item v-if="bankData.weatherWeekendStore === 1" prop="storeDay">
                <el-select size="small" v-model="bankData.storeDay" placeholder="" :disabled="isChecked" filterable>
                    <el-option v-for="item in storeDayOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item><br>
            <el-form-item label="是否节假日上账" prop="weatherHolidayStore">
                <el-radio v-model="bankData.weatherHolidayStore" :label="0" :disabled="isChecked">是</el-radio>
                <el-radio v-model="bankData.weatherHolidayStore" :label="1" :disabled="isChecked">否</el-radio>
            </el-form-item>
            <el-form-item label="是否从H2H同步数据" prop="h2h">
                <el-radio v-model="bankData.h2h" label="1" :disabled="isChecked">是</el-radio>
                <el-radio v-model="bankData.h2h" label="0" :disabled="isChecked">否</el-radio>
            </el-form-item>

        </div>
        <div class="viewFormContent" v-if="bankId !== ''">
            <el-form-item label="更新时间">
                <el-input size="small"  placeholder="" v-model="bankData.fscModifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新人">
                <el-input size="small"  placeholder="" v-model="bankData.modifiedUser" disabled></el-input>
            </el-form-item>
        </div>
        <div class="buttomButton" v-if="!isChecked">
            <el-form-item>
                <el-button size="small"  type="success" plain @click='cancel' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="insertBank('bankData')" class="c-button">保存</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "bankAdd",
        data(){
            return{
                isChecked:false,
                bankId: '',
                bankData: {
                    companyId:null,
                    companyJdeCode:null,
                    billingUnitId:null,
                    billingUnitJdeCode:null,
                    storeDay:1
                },
                doubleBankData: {},
                rules: {
                    // linkLineNumber: { required: true, message: '请输入联行号', trigger: 'blur' },
                    mainJdeAccount: { required: true, message: '请输入银行JDE号', trigger: 'blur' },
                    depositBankName: { required: true, message: '请输入开户银行名称', trigger: 'blur' },
                    depositBankAccount: { required: true, message: '请输入开户银行账号', trigger: 'blur' },
                    // brandId:{ required: true, message: '请选择品牌', trigger: 'change' },
                    bank:{ required: true, message: '请选择银行', trigger: 'change' },
                    h2h:{ required: true, message: '请选择是否从H2H同步数据', trigger: 'change' },
                    weatherWeekendStore:{ required: true, message: '请选择是否周末存行', trigger: 'change' },
                    storeDay:{ required: true, message: '请选择周末存行的类型', trigger: 'change' },
                    weatherHolidayStore:{ required: true, message: '请选择是否节假日上账', trigger: 'change' },
                    state:{ required: true, message: '请选择状态', trigger: 'change' },
                    companyId:{ required: true, message: '请选择法人公司', trigger: 'change' }
                },
                brand: [],
                bankOpt:[],
                billingUnitIdOpt:[],
                companyIdOpt:[],
                storeDayOpt:[{
                    value:1,
                    label:'全部'
                },{
                    value:2,
                    label:'星期六'
                },{
                    value:3,
                    label:'星期日'
                }]
            }
        },
        methods:{
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            getSearchCondition(){
                var that = this;
                ip.getBrandEnglishNames('?flag=1',res => {that.brand = res.data});
                ip.getDictionaryByNumber('BANK',res => {that.bankOpt = res.data});
                ip.getAllCompanyIdNames('',res => {that.companyIdOpt = res.data.list});
                ip.getAllBillUnitIdNames('',res => {that.billingUnitIdOpt = res.data})
                // ip.getCompanyJDECode('',res => {that.companyIdOpt = res.data});
                // ip.getBillJDECode('',res => {that.billingUnitIdOpt = res.data})
            },
            // getCompanyId(){
            //     var that = this;
            //     var param = this.$refs.company.$children[0].currentValue;
            //     console.log(param);
            //     this.companyIdOpt = [];
            //     ip.getCompanyJDECode(param,res => {that.companyIdOpt = res.data})
            // },
            getCompanyJdeCode(val){
                if(val){
                    let obj = {};
                    obj = this.companyIdOpt.find(item => {
                        return item.companyId === val
                    });
                    this.bankData.companyJdeCode = obj.jdeCode
                }else{
                    this.bankData.companyJdeCode = null
                }
            },
            // getBillingUnitId(){
            //     var that = this;
            //     var param = this.$refs.billingUnit.$children[0].currentValue;
            //     this.billingUnitIdOpt = [];
            //     ip.getBillJDECode(param,res => {that.billingUnitIdOpt = res.data})
            // },
            getBillingUnitJdeCode(val){
                if(val){
                    let obj = {};
                    obj = this.billingUnitIdOpt.find(item => {
                        return item.billingUnitId === val
                    });
                    this.bankData.billingUnitJdeCode = obj.jdeCode
                }else{
                    this.bankData.billingUnitJdeCode = null
                }
            },
            getBankData(bankId){
                var that = this;
                ip.getBankById(bankId,function (res) {
                    if(res.code === 200){
                        that.bankData = Object.assign({},res.data);
                        that.doubleBankData = Object.assign({},res.data);
                        that.bankData.id = that.bankData.bankId;
                    }else{
                        that.showTips(res.msg,'info')
                    }
                })
            },
            insertBank(formName){
                let that = this;
                delete this.bankData.modifiedUser;
                if(this.bankData.companyId === null && this.bankData.billingUnitId === null){
                    this.showTips('请选择法人公司或开票单位','info')
                }else{
                    //查询银行JDE+法人公司/开票单位是否重复存在
                    that.$refs[formName].validate((valid) => {
                        if(valid){
                            if(this.bankId !== ''){
                                if(that.doubleBankData.companyId !== that.bankData.companyId && that.doubleBankData.billingUnitId === that.bankData.billingUnitId){
                                    let param = [{
                                        name:'jdeAccount',
                                        value:that.bankData.mainJdeAccount
                                    },
                                    // {
                                    //     name:'brandId',
                                    //     value:that.bankData.brandId
                                    // },
                                    {
                                        name:'companyId',
                                        value:that.bankData.companyId
                                    }];
                                    ip.checkJdeBrandCompanyBillUnit(that.common.joinSearchParam(param),res => {
                                        if(res.data) {
                                            ip.updateBank(that.bankData,res => {
                                                if(res.code === 200){
                                                    that.showTips(res.data,'success');
                                                    that.cancel();
                                                }else{
                                                    that.showTips(res.msg,'info')
                                                }
                                            })
                                        }else{
                                            that.showTips('已存在相同的银行jde号，法人/开票单位','warning')
                                        }
                                    })
                                }else if(that.doubleBankData.billingUnitId !== that.bankData.billingUnitId && that.doubleBankData.companyId === that.bankData.companyId){
                                    let param = [{
                                        name:'jdeAccount',
                                        value:that.bankData.mainJdeAccount
                                    },
                                    // {
                                    //     name:'brandId',
                                    //     value:that.bankData.brandId
                                    // },
                                    {
                                        name:'billingUnitId',
                                        value:that.bankData.billingUnitId
                                    }];
                                    ip.checkJdeBrandCompanyBillUnit(that.common.joinSearchParam(param),res => {
                                        if(res.data) {
                                            ip.updateBank(that.bankData,res => {
                                                if(res.code === 200){
                                                    that.showTips(res.data,'success');
                                                    that.cancel();
                                                }else{
                                                    that.showTips(res.msg,'info')
                                                }
                                            })
                                        }else{
                                            that.showTips('已存在相同的银行jde号，法人/开票单位','warning')
                                        }
                                    })
                                }else if(that.doubleBankData.billingUnitId !== that.bankData.billingUnitId && that.doubleBankData.companyId !== that.bankData.companyId){
                                    let param = [{
                                        name:'jdeAccount',
                                        value:that.bankData.mainJdeAccount
                                    },
                                    // {
                                    //     name:'brandId',
                                    //     value:that.bankData.brandId
                                    // },
                                    {
                                        name:'companyId',
                                        value:that.bankData.companyId
                                    },
                                    {
                                        name:'billingUnitId',
                                        value:that.bankData.billingUnitId
                                    }];
                                    ip.checkJdeBrandCompanyBillUnit(that.common.joinSearchParam(param),res => {
                                        if(res.data) {
                                            ip.updateBank(that.bankData,res => {
                                                if(res.code === 200){
                                                    that.showTips(res.data,'success');
                                                    that.cancel();
                                                }else{
                                                    that.showTips(res.msg,'info')
                                                }
                                            })
                                        }else{
                                            that.showTips('已存在相同的银行jde号，法人/开票单位','warning')
                                        }
                                    })
                                }else if(that.doubleBankData.billingUnitId === that.bankData.billingUnitId && that.doubleBankData.companyId === that.bankData.companyId){
                                    ip.updateBank(that.bankData,res => {
                                        if(res.code === 200){
                                            that.showTips(res.data,'success');
                                            that.cancel();
                                        }else{
                                            that.showTips(res.msg,'info')
                                        }
                                    })
                                }
                            }else{
                                let param = [{
                                    name:'jdeAccount',
                                    value:that.bankData.mainJdeAccount
                                },
                                // {
                                //     name:'brandId',
                                //     value:that.bankData.brandId
                                // },
                                {
                                    name:'companyId',
                                    value:that.bankData.companyId
                                },
                                {
                                    name:'billingUnitId',
                                    value:that.bankData.billingUnitId
                                }];
                                ip.checkJdeBrandCompanyBillUnit(that.common.joinSearchParam(param),res => {
                                    if(res.data) {
                                        ip.addBank(that.bankData,res => {
                                            if(res.code === 200){
                                                that.showTips(res.data,'success');
                                                that.cancel();
                                            }else{
                                                that.showTips(res.msg,'info')
                                            }
                                        })
                                    }else{
                                        that.showTips('已存在相同的银行jde号，法人/开票单位','warning')
                                    }
                                })
                            }
                        }else{
                            return false;
                        }
                    })
                }
            },
            showTips(text,type){this.common.messageUtil({message: text, type: type})}
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            if(this.$route.query.bankId){
                this.bankId = this.$route.query.bankId;
                this.getBankData(this.bankId);
            }
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
