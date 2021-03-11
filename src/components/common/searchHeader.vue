<!--
   列表的查询条件
-->
<template>
    <div class="search-content">
        <slot name="up"></slot>
        <div class="selectContent" v-if="showDate">
            <div class="selectTitle">{{dataLabel?dataLabel:'营业日期'}}</div>
            <el-date-picker
                    type="daterange"
                    v-model="bookDate"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                    @change="getDate"
            >
            </el-date-picker>
        </div>
        <div class="selectContent" v-if="showLimitDate">
            <div class="selectTitle">{{dataLabel}}</div>
            <limitDateRange
                   @changeDate="getLimitDate"
                   :limitDays="limitDays"
                    ref="limitDate"
            ></limitDateRange>
        </div>
        <div class="selectContent" v-if="showBrand">
            <div class="selectTitle">品牌</div>
            <el-select size="small"  v-model="brand" placeholder="请选择品牌"  filterable @change="getBrand">
                <el-option value="" label="请选择"></el-option>
                <el-option v-for="(item,index) in brandOpt" :key="index" :label="item.englishName" :value="item.englishName"></el-option>
            </el-select>
        </div>

        <div class="selectContent" v-if="showStoreCode">
            <div class="selectTitle">餐厅编号</div>
            <remoteSelect
                    placeholder="请选择餐厅编号"
                    :judgePermission="dataPermission"
                    :remoteFn="'getSelectSearchCondition'"
                    :optLabel="'storeName'"
                    :optValue="'storeHypId'"
                    @getChangeData="getStoreCode"
                    :type="1"
                    ref="storeRef"
                    :customType="1"
            ></remoteSelect>
        </div>
        <div class="selectContent" v-if="showOperateMarket">
            <div class="selectTitle">营运市场</div>
            <el-select size="small"  v-model="operateMarket" placeholder="请选择营运市场"  filterable @change="changeOperateMarkets">
                <el-option value="" label="请选择"></el-option>
                <el-option v-for="(item,index) in operateMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
            </el-select>
        </div>
        <div class="selectContent" v-if="showFinancialMarket">
            <div class="selectTitle">财务市场</div>
            <el-select size="small"  v-model="financialMarket" placeholder="请选择财务市场"  filterable @change="changeFinancialMarkets">
                <el-option value="" label="请选择"></el-option>
                <el-option v-for="(item,index) in financialMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
            </el-select>
        </div>
        <div class="selectContent" v-if="showCompany">
            <div class="selectTitle">法人公司</div>
            <remoteSelect
                    placeholder="请选择法人公司"
                    :remoteFn="'getAllCompanyIdNamess'"
                    :optLabel="'companyName'"
                    :optValue="'jdeCode'"
                    @getChangeData="getCompany"
                    :type="2"
                    ref="companyRef"
                    :customType="1"
                    :judgePermission="dataPermission"
            ></remoteSelect>
        </div>
        <div class="selectContent" v-if="showBillingUnit">
            <div class="selectTitle">开票单位</div>
            <el-select size="small"  v-model="billingUnit" placeholder="请选择开票单位"  filterable @change="changeBillingUnits">
                <el-option value="" label="请选择"></el-option>
                <el-option v-for="(item,index) in billingUnits" :key="index" :label="item.billingUnitName" :value="item.jdeCode"></el-option>
            </el-select>
        </div>
        <div class="selectContent" v-if="showClient">
            <div class="selectTitle" >客户名称</div>
            <remoteSelect
                    placeholder="请选择法人公司"
                    :remoteFn="'getCustomerList'"
                    :optLabel="'customerName'"
                    :optValue="'customerNumber'"
                    @getChangeData="getClient"
                    :type="3"
                    ref="clientRef"
            ></remoteSelect>
        </div>
        <slot></slot>
    </div>
</template>

<script>
    import api from '@/model/api'
    import remoteSelect from '@/components/common/remoteSelect'
    import limitDateRange from '@/components/common/limitDateRange'
    export default {
        name: "searchHeader",
        components:{
            remoteSelect,
            limitDateRange
        },
        props:{
            showCompany:{
                type:Boolean,
                default:false
            },
            showFinancialMarket:{
                type:Boolean,
                default:false
            },
            showStoreCode:{
                type:Boolean,
                default:false
            },
            showOperateMarket:{
                type:Boolean,
                default:false
            },
            showBillingUnit:{
                type:Boolean,
                default:false
            },
            showClient:{
                type:Boolean,
                default:false
            },
            showDate:{
                type:Boolean,
                default:false
            },
            cashDelayCheckReport:{
                type:Function,
            },
            dataLabel:{
                type:String,
            },
            showLimitDate:{
                type:Boolean,
                default:false
            },
            showBrand:{
                type:Boolean,
                default:false
            },
            limitDays:{
                type:Number,
                default:31
            },
            dataPermission:{
                type:Boolean,
                default:false
            },
        },
        data(){
            return {
                bookDate:[],

                storeName:'',

                scrollFlag: true,
                loadingStoreHypId: false,
                listPageIndex: 1,
                storeHypIdOpt: [],
                temString: '',
                selectObj: {},

                financialMarkets: [],
                financialMarket: '',

                operateMarkets: [],
                operateMarket: '',

                billingUnits: [],
                billingUnit: '',

                brand:'',
                brandOpt:[]
            }
        },
        methods:{
            getStoreCode(res){
                this.$emit('getStoreCode1',res||'')
            },
            getCompany(res){
                this.$emit('getCompany1',res||'')
            },
            changeFinancialMarkets(res){
                this.$emit('getFinancial1',res||'')
            },
            changeBillingUnits(res){
                this.$emit('getBillingUnits1',res||'')
            },
            getDate(res){
                this.$emit('getBookDate',res||'')
            },
            changeOperateMarkets(res){
                this.$emit('getOperateMarkets1',res||'')
            },
            getClient(res){
                this.$emit('getClient1',res||'')
            },
            getLimitDate(res){
                this.$emit('getLimitDate1',res||'')
            },
            getBrand(res){
                this.$emit('getBrand1',res||'')
            },
            getFinanceMarkets() {
                let param = this.financialMarket;
                if(this.dataPermission){
                    param += '&judgePermission=true'
                }
                api.getFinanceMarketIdNames(param+'&pageSize=9999999', res=> {
                    this.financialMarkets = res.data || []
                })
            },
            getOperateMarkets(){
                let param = this.operateMarket;
                if(this.dataPermission){
                    param += '&judgePermission=true'
                }
                api.getOperateMarketIdNames(param+'&pageSize=9999999', res=> {
                    this.operateMarkets = res.data || []
                })
            },
            getBillingUnits(){
                api.getBillJDECode(this.billingUnit+'&pageSize=9999999', res=> {
                    this.billingUnits = res.data || []
                })
            },
            getBrands(){
                api.getBrandEnglishNames('?flag=1', res => {
                    this.brandOpt = res.data
                });
            },
            reset(){  //为重置按钮服务
                this.financialMarket = '';
                this.billingUnit = '';
                this.operateMarket = '';
                this.bookDate = [];
                this.brand = '';
                this.$refs.companyRef?this.$refs.companyRef.reset():null;
                this.$refs.storeRef?this.$refs.storeRef.reset():null;
                this.$refs.clientRef?this.$refs.clientRef.reset():null;
                this.$refs.limitDate?this.$refs.limitDate.reset():null;
                this.getStoreCode();
                this.getCompany();
                this.changeFinancialMarkets();
                this.changeBillingUnits();
                this.changeOperateMarkets();
                this.getDate();
                this.getClient();
                this.getLimitDate();
                this.getBrand();

            }
        },
       beforeMount(){
            if(this.showFinancialMarket){
                this.getFinanceMarkets();
            }
           if(this.showBillingUnit){
               this.getBillingUnits();
           }
           if(this.showOperateMarket){
               this.getOperateMarkets();
           }
           if(this.showBrand){
               this.getBrands();
           }
        }
    }
</script>

<style scoped>

</style>
