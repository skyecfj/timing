<template>
    <div class="notSaveButDoReportTable">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">财务市场</div>
                <el-input v-model.trim="financialMarket" size="small" clearable></el-input>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">法人公司</div>
                <!--<el-input v-model.trim="legalCompany" size="small" clearable></el-input>-->
                <el-select size="small" ref="company" v-model="legalCompany" placeholder="请选择法人公司"  filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in company" :key="item.companyId" :label="item.companyName" :value="item.jdeCode"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <el-select size="small" v-model="storeCode" placeholder="请选择" remote :remote-method="remoteStoreHypId"
                           :loading="loadingStoreHypId" filterable v-scroll="bindScroll" @visible-change="visibleChange"
                           @keyup.native="focusFn">
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in storeHypIdOpt" :key="item.storeHypId" :label="item.storeHypId"
                               :value="item.storeHypId"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <el-checkbox v-model="moreFlag" true-label="true" false-label="false">少存行1000元及以上</el-checkbox>
            </div>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="notSaveButDoReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'
    import scroll from '@/directives/index'
    import ip from '@/model/api'
    export default {
        name: "testReport",
        components: {
            tableOrigin
        },
        directives: {scroll},
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label:'法人公司',
                        prop:'companyName'
                    },
                    {
                        label:'财务市场',
                        prop:'financialMarket'
                    },
                    {
                        label:'餐厅编号',
                        prop:'storeCode'
                    },
                    {
                        label:'餐厅名称',
                        prop:'storeName'
                    },
                    {
                        label:'银行JDE号',
                        prop:'bankJdeCode'
                    },
                    {
                        label:'BOH应存行金额',
                        prop:'confirmAmount'
                    },
                    {
                        label:'银行金额',
                        prop:'bankAmount'
                    },
                    {
                        label:'存行差异',
                        prop:'differAmount'
                    },
                    {
                        label:'营业款所属日期',
                        prop:'bizDateStr'
                    },
                    {
                        label:'应存行日期',
                        prop:'savingDateStr'
                    },
                    {
                        label:'实际存行日期',
                        prop:'confirmDateStr'
                    },
                    {
                        label:'存行滞后天数',
                        prop:'dayNums'
                    },
                    {
                        label:'下一存行日日期',
                        prop:'nextSavingDateStr'
                    },
                    {
                        label:'应报备层级',
                        prop:'recordLevel'
                    },

                    {
                        label:'异常原因类别',
                        prop:'resonCategory'
                    },
                    {
                        label:'异常原因备注',
                        prop:'exceptionRemark'
                    },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                financialMarket:'',
                legalCompany:'',
                moreFlag:false,

                storeCode:'',
                scrollFlag:true,
                loadingStoreHypId:false,
                listPageIndex: 1,
                storeHypIdOpt:[],
                temString:'',
                selectObj: {},
                company:[]
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData(pageIndex) {
                if(pageIndex){
                    this.currentPage = 1;
                }
                let that = this;
                api.getNotSaveButDo(this.getParam()+'&moreFlag='+this.moreFlag,function(res){
                    if(res.code === 200){
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else{
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam(){
                return this.common.joinSearchParam([
                    {
                        value:this.financialMarket,
                        name:'financialMarket'
                    },
                    {
                        value:this.legalCompany,
                        name:'companyName'
                    },
                    {
                        value:this.storeCode,
                        name:'storeCode'
                    },
                    {
                        value:this.currentPage,
                        name:'pageIndex'
                    },
                    {
                        value:this.pageSize,
                        name:'pageSize'
                    },
                ])
            },
            reset() {

            },
            download(){
                let that = this;
                api.downloadNotSaveButDo(this.getParam(),'application/vnd.ms-excel',function(res,header){
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            bindScroll(param, object) {
                if (param) {
                    var that = this;
                    this.selectObj = object;
                    if (this.scrollFlag) {
                        this.listPageIndex++;
                        ip.getSelectSearchCondition({
                            storeHypId: this.temString,
                            pageSize: 20,
                            pageIndex: this.listPageIndex
                        }, function (res) {
                            if (res.code === 200) {
                                that.storeHypIdOpt = that.storeHypIdOpt.concat(res.data);
                            } else if (res.code === 404) {
                                that.scrollFlag = false;
                            }
                        })
                    }
                }
            },
            remoteStoreHypId(val) {
                let that = this;
                // this.storeCode = val;
                this.temString = val;
                this.listPageIndex = 1;
                if (JSON.stringify(this.selectObj) !== '{}') {
                    this.selectObj.scrollTop = 0;
                }
                ip.getSelectSearchCondition({
                    storeHypId: this.temString,
                    pageIndex: this.listPageIndex,
                    pageSize: 20
                }, function (res) {
                    that.storeHypIdOpt = res.data
                })
            },
            visibleChange(param) {
                if (!param && !this.storeCode) {
                    this.remoteStoreHypId();
                    this.temString = '';
                } else {
                    this.remoteStoreHypId(this.storeCode);
                }
            },
            focusFn(param) {
                if (!param.target.value) {
                    this.temString = '';
                    this.remoteStoreHypId();
                }
            },
        },
        mounted(){
            let that = this;
            ip.getAllCompanyIdNames('',res => {that.company = res.data.list||[]});
        }
    }
</script>

<style scoped>

</style>
