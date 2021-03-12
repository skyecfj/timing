<template>
    <div class="viewForm">
        <div class="activeHeader">
            <el-button size="small" type="success" plain class="c-button" @click="cancel">取消</el-button>
            <el-button size="small" type="success" class="c-button" :disabled="isChecked" @click="insertActiveMaster">保存</el-button>
        </div>
        <div class="activeContent">
            <el-form
                    class="basicInfo"
                    label-position="top"
                    ref="activeData"
                    :model="activeData"
                    :rules="rules"
                    label-width="100px">
                <el-form-item label="活动名称" class="basicWidth basicSmallWidth" prop="activityName">
                    <el-input size="small" placeholder="请输入" v-model="activeData.activityName" clearable maxlength="20" @change="UnitActiveName" :disabled="isChecked"></el-input>
                </el-form-item>
                <el-form-item label="品牌" class="basicWidth basicSmallWidth" prop="brand">
                    <el-select v-model="activeData.brand" placeholder="请选择" @change="getBrandName" :disabled="isChecked">
                        <el-option v-for="(item,index) in brandOpt" :key="index" :label="item.englishName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动范围" class="basicRangeType">
                    <div class="basicActiveRange">
                        <div class="basicActiveRangeHeader">
                            <el-checkbox v-model="companyChecked" @change="selectAllCompany" :disabled="isChecked">全选</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input class="basicSmallWidth" placeholder="请输入餐厅名称" v-model="filterCompanyText" :disabled="isChecked"></el-input>&nbsp;
                        </div>
                        <el-scrollbar class="basicActiveRangeContent">
                            <el-tree
                                    :data="companyData"
                                    :props="companyProps"
                                    node-key="id"
                                    show-checkbox
                                    :default-checked-keys="selectCompanyKey"
                                    default-expand-all
                                    :filter-node-method="filterCompanyNode"
                                    ref="company"
                                    @check="getSelectedCompanyKeys">
                            </el-tree>
                        </el-scrollbar>
                    </div>
                </el-form-item>
                <el-form-item label="活动实际期间" class="basicWidthTypeThree">
                    <el-form-item
                            v-for="(activityActual,index) in activeData.activityActualPeriodDTOS"
                            :key="index"
                            :prop="'activityActualPeriodDTOS.' + index + '.date'"
                            :rules="{required: true, message: '活动实际期间不能为空', trigger: 'change'}">
                        <div class="block">
                            <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    @change="(val) => {return getActivityActual(val,index)}"
                                    v-model="activityActual.date"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="-"
                                    start-placeholder="年/月/日"
                                    end-placeholder="年/月/日"
                                    :disabled="isChecked">
                            </el-date-picker>
                        </div>
                        <el-button v-if="activeData.activityActualPeriodDTOS.length > 1" @click="removeActualPeriod(index)" size="small" icon="el-icon-minus" circle :disabled="isChecked"></el-button>
                        <el-button v-if="index === activeData.activityActualPeriodDTOS.length - 1" @click="addActualPeriod" size="small" icon="el-icon-plus" circle :disabled="isChecked"></el-button>
                    </el-form-item><br>
                </el-form-item>
                <el-form-item label="是否与银行流水核对" prop="checkBankFlow" class="accountState">
                    <el-radio-group v-model="activeData.checkBankFlow" :disabled="isChecked" disabled>
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group><br>
                    <div class="activeRange" v-if="activeData.checkBankFlow">
                        <el-select v-model="activeData.checkDateWithBank" filterable placeholder="请选择" :disabled="isChecked">
                            <el-option :value="1" label="营业日期"></el-option>
                            <el-option :value="2" label="交易日期"></el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="第三方是否提供账单">
                    <el-radio-group v-model="activeData.provideBill" disabled>
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        label="BOH结算键位"
                        :prop="'thirdSettlementConfigDTOS.' + 0 + '.bohSettlementKeyDTOS'"
                        :rules="{required: true, message: '请输入BOH结算键位', trigger: 'blur'}"
                        class="activeBOH">
                    <el-form-item
                            v-for="(bohSettlementKey,index) in activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS"
                            :key="index"
                            :prop="'thirdSettlementConfigDTOS.' + 0 + '.bohSettlementKeyDTOS.' + index + '.keyValue'"
                            :rules="{required: true, message: '请输入BOH结算键位', trigger: ['blur','change']}">
                        <el-autocomplete
                                class="smallBOH"
                                size="small"
                                v-model="bohSettlementKey.keyValue"
                                :fetch-suggestions="bohQuerySearch"
                                :disabled="isChecked">
                        </el-autocomplete>
                        <el-button v-if="activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.length > 1" @click="removeBOH(index)" size="small" icon="el-icon-minus" circle :disabled="isChecked"></el-button>
                        <el-button v-if="index === activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.length - 1" @click="addBOH" size="small" icon="el-icon-plus" circle :disabled="isChecked"></el-button>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" :rows="4" v-model="activeData.remark" maxlength="100" placeholder="请输入" :disabled="isChecked"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import tempIp from '../../model/tempIp'
    const activityActualPeriod = {
        acturalStartDate:null,
        acturalEndDate:null,
        date:null
    };
    export default {
        name: "activeMasterColAdd",
        data(){
            var legalChars = (rule,value,callback) => {
                if(!/^[A-Za-z0-9\u4e00-\u9fa5！~·@#%……&* （）——、。-，；：“”？,.?""'';()!:\+\=\-\/]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入数字、汉字、字母、符号(特殊符号除外)'));
                }else{
                    callback()
                }
            };
            return{
                id:'',
                module:'主档管理',
                subModule:'活动主档',
                activeData:{
                    activityType:3,
                    rangeType:2,
                    settlementMode:1,
                    provideBill:true,
                    activityActualPeriodDTOS:[Object.assign({},activityActualPeriod)],
                    thirdSettlementConfigDTOS:[{
                        provideSettlementToThird:false,
                        bohSettlementKeyDTOS:[Object.assign({},{'keyValue':null,'settlementColumn':3})]
                    }],
                    checkBankFlow:false,
                    status:2
                },
                rules:{
                    activityName:[{ required: true, message: '请输入活动名称', trigger: 'blur' },{ validator: legalChars }],
                    brand:{ required: true, message: '请选择品牌', trigger: 'change' },

                },
                brandOpt:[],
                isChecked:false,
                companyChecked:false,
                allCompanyId:[],
                filterCompanyText:'',
                companyData:[],
                companyProps: {children:'children',label:'name'},
                selectCompanyKey:[],
                thirdBillDataDTOs:[],
                isSelectBillsId:[],
                isSelectBills:[],
                bohSettlementKeyOpt:[],
                selectKey:[]
            }
        },
        methods:{
            cancel(){this.common.deleteTag(this.$route,this)},
            UnitActiveName(){
                this.activeData.activityAbbreviation = this.activeData.activityName
            },
            getSearchCondition(){
                let that = this;
                ip.getBrandEnglishNames('?flag=1',res => {that.brandOpt = res.data});
                ip.selectUnmapperKey(res => {res.data.forEach(item => {that.bohSettlementKeyOpt.push({value:item})})});
            },
            getBrandName(val){
                let obj = {};
                obj = this.brandOpt.find((item) => {
                    return item.id === val
                });
                this.activeData.brandName = obj.englishName
            },
            selectAllCompany(val){val ? this.$refs.company.setCheckedKeys(this.allCompanyId) : this.$refs.company.setCheckedKeys([])},
            filterCompanyNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getSelectedCompanyKeys(node,nodes){
                this.selectCompanyKey = nodes.checkedKeys
            },
            getStoreTree(activityId){
                let that = this;
                ip.getTypeThreeTrue(res => {
                    res.data.forEach(item => {
                        let company = {};
                        company.id = 'company'+item.jdeCode;
                        company.flag = item.flag;
                        company.name = item.jdeCode + item.companyName;
                        company.children = [];
                        if(that.isChecked){company.disabled = true}
                        that.allCompanyId.push(company.id);
                        if(item.billUnitStores){
                            item.billUnitStores.forEach(item1 => {
                                let billingunit = {};
                                billingunit.id = 'billingunit'+item1.jdeCode;
                                billingunit.name = item1.jdeCode + item1.billingUnitName;
                                billingunit.children = [];
                                if(that.isChecked){billingunit.disabled = true}
                                if(item1.storeInfos){
                                    item1.storeInfos.forEach(item2 => {
                                        let restaurant = {};
                                        restaurant.id = item2.storeJdeCode;
                                        restaurant.name = item2.storeJdeCode+item2.storeName;
                                        if(that.isChecked){restaurant.disabled = true}
                                        billingunit.children.push(restaurant)
                                    })
                                }
                                company.children.push(billingunit);
                            })
                        }
                        that.companyData.push(company);
                    });
                    if(activityId !== ''){that.getActiveData(activityId)}
                })
            },
            bohQuerySearch(queryString, cb) {
                let bohSettlementKeyOpt = this.bohSettlementKeyOpt;
                let results = queryString ? bohSettlementKeyOpt.filter(this.bohCreateFilter(queryString)) : bohSettlementKeyOpt;
                cb(results);
            },
            bohCreateFilter(queryString) {
                return (bohSettlementKey) => {
                    return (bohSettlementKey.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            addBOH(){
                this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.push(Object.assign({},{'keyValue':null,'settlementColumn':3}));
            },
            removeBOH(index){
                this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.splice(index,1);
            },
            addActualPeriod(){
                this.activeData.activityActualPeriodDTOS.push(Object.assign({},activityActualPeriod));
            },
            removeActualPeriod(index){
                this.activeData.activityActualPeriodDTOS.splice(index,1);
            },
            insertActiveMaster(){
                let that = this;
                this.$refs['activeData'].validate((valid) => {
                    if(valid){
                        this.activeData.rangeDTOS = [];
                        if(this.id !== ''){
                            this.$refs.company.getCheckedKeys().forEach(item => {
                                if(item.substr(0,1) !== 'c' && item.substr(0,1) !== 'b'){that.activeData.rangeDTOS.push({activityMasterId:that.id,rangeValue:parseInt(item)})}
                            })
                        }else{
                            this.$refs.company.getCheckedKeys().forEach(item => {
                                if(item.substr(0,1) !== 'c' && item.substr(0,1) !== 'b'){that.activeData.rangeDTOS.push({rangeValue:parseInt(item)})}
                            })
                        }
                        if(this.id !== ''){
                            this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.forEach(item => {that.$set(item,'activityMasterId',that.id)})
                        }
                        if(this.activeData.thirdSettlementConfigDTOS[0].id){
                            this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.forEach(item => {
                                item.settlementConfigId = this.activeData.thirdSettlementConfigDTOS[0].id
                            })
                        }
                        if(this.id !== ''){
                            this.activeData.activityActualPeriodDTOS.forEach(item => {that.$set(item,'activityMasterId',parseInt(that.id))});
                            ip.updateTypeThree(that.activeData,res => {
                                if (res.code === 200) {
                                    that.showTips(res.data, 'success');
                                    that.cancel()
                                } else {
                                    that.showTips(res.msg, 'info')
                                }
                            },err=>{
                                // console.log(err)
                            })
                        }else{
                            ip.insertTypeThree(that.activeData,res => {
                                if(res.code === 200){
                                    that.showTips('活动主档-房东代收，新增成功', 'success');
                                    that.cancel()
                                }else{
                                    that.showTips(res.msg, 'info')
                                }
                            })
                        }
                    }else{
                        this.showTips('请将信息填写完整','info');
                        return false
                    }
                })
            },
            showTips(text,type){this.common.messageUtil({message: text, type: type})},
            getActiveData(id){
                let that = this;
                ip.getActiveDetail(id,res => {
                    if(res.code === 200){
                        that.activeData.id = res.data.id;
                        that.$set(that.activeData,'activityName',res.data.activityName);
                        that.activeData.activityAbbreviation = res.data.activityAbbreviation;
                        that.$set(that.activeData,'brand',parseInt(res.data.brand));
                        that.activeData.activityType = res.data.activityType;
                        that.activeData.rangeType = res.data.rangeType;
                        that.activeData.settlementMode = res.data.settlementMode;
                        that.activeData.provideBill = res.data.provideBill;
                        that.activeData.thirdSettlementConfigDTOS[0].id = res.data.thirdSettlementConfigDTOS[0].id;
                        that.activeData.thirdSettlementConfigDTOS[0].provideSettlementToThird = res.data.thirdSettlementConfigDTOS[0].provideSettlementToThird;
                        that.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS = res.data.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS;
                        that.activeData.checkBankFlow = res.data.checkBankFlow;
                        that.activeData.remark = res.data.remark;
                        that.activeData.rangeDTOS = res.data.rangeDTOS;
                        that.activeData.status = res.data.status;
                        that.activeData.activityActualPeriodDTOS = res.data.activityActualPeriodDTOS;
                        that.$set(that.activeData,'checkDateWithBank',res.data.checkDateWithBank);
                        //活动范围
                        that.selectKey = [];
                        that.activeData.rangeDTOS.forEach(item => {
                            that.selectKey.push(item.rangeValue)
                        });
                        that.selectCompanyKey = that.selectKey;
                        //活动实际期间
                        that.activeData.activityActualPeriodDTOS.forEach(item => {
                            that.$set(item,'date',[item.acturalStartDate,item.acturalEndDate])
                        });
                    }else{
                        that.showTips(res.msg,'info')
                    }
                })
            },
            getActivityActual(val,index){
                this.activeData.activityActualPeriodDTOS[index].acturalStartDate = val[0];
                this.activeData.activityActualPeriodDTOS[index].acturalEndDate = val[1];
                this.activeData.activityActualPeriodDTOS.forEach((item,activeIndex) => {
                    if(index !== activeIndex){
                        if(val && !(val[0] > this.activeData.activityActualPeriodDTOS[activeIndex].date[1] || val[1] < this.activeData.activityActualPeriodDTOS[activeIndex].date[0])){
                            this.showTips('活动实际期间之间不能有交集','warning');
                            this.activeData.activityActualPeriodDTOS[index].date = null;
                            this.activeData.activityActualPeriodDTOS[index].acturalStartDate = null;
                            this.activeData.activityActualPeriodDTOS[index].acturalEndDate = null;
                        }
                    }
                })
            }
        },
        watch:{
            filterCompanyText(val){this.$refs.company.filter(val)},
        },
        beforeMount(){
            if(this.$route.query.id){this.id = parseInt(this.$route.query.id)}
            this.getSearchCondition();
        },
        mounted(){
            this.getStoreTree(this.id);
            if(this.$route.query.detail){
                this.isChecked = true;
            }else{
                this.isChecked = false;
            }
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'active';
            next();
        },
    }
</script>

<style lang="scss">
    @import '../../assets/scss/master';
    .block{
        .el-date-editor .el-input__icon,.el-range-separator{
            line-height: 22px;
        }
    }
</style>
