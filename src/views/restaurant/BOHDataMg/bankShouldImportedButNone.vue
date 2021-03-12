<!-- 手工退款数据管理-->
<template>
    <div class="bankShouldImportedButNone">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">上账日期</div>
                <el-date-picker
                        type="daterange"
                        v-model="bookDate"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">银行JDE号</div>
                <el-input v-model.trim="bankJDE" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">财务市场</div>
                <el-select v-model="financialMarket" size="small" filterable>
                    <el-option value="">请选择</el-option>
                    <el-option v-for="(item,index) in financialMarketSelect" :value="item.id" :label="item.name"
                               :key="index"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <!--<div class="selectTitle">法人公司</div>-->
                <!--<el-select v-model="legalCompany" size="small" filterable>-->
                    <!--<el-option value="">请选择</el-option>-->
                    <!--<el-option v-for="(item,index) in legalCompanySelect" :value="item.companyId"-->
                               <!--:label="item.companyName"-->
                               <!--:key="index"></el-option>-->
                <!--</el-select>-->
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
                        :judgePermission="true"
                ></remoteSelect>
            </div>
            <div class="selectContent">
                <div class="selectTitle">未导入原因</div>
                <el-select v-model="reason" size="small" filterable>
                    <el-option value="">请选择</el-option>
                    <el-option v-for="(item,index) in reasonSelect" :value="item" :label="item"
                               :key="index"></el-option>
                </el-select>
            </div>
            <el-button size="small" @click="searchData(false,1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="searchData(true)" class="c-button c-button--primary">下载</el-button>
            <el-button size="small" @click="reset" class="c-button c-button--primary">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="bankShouldImportedButNone"
                    :operates="operates"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            >
            </tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from './originalTable'
    import api from '../../../model/apidr'
    import ip from '../../../model/api'
    import remoteSelect from '@/components/common/remoteSelect'
    export default {
        name: 'bankShouldImportedButNone',
        components: {
            tableOrigin,
            remoteSelect
        },
        data() {
            return {
                bookDate:[],
                bankJDE: '',
                dynamicData: [],
                financialMarketSelect: [],
                // legalCompanySelect: [],
                tableHead: [{

                    label: '上账日期',
                    prop: 'bookDate'
                },
                    {
                        label: '银行JDE号',
                        prop: 'bankJdeCode'
                    },
                    {
                        label: '法人公司',
                        prop: 'leCode'
                    },
                    {
                        label: '财务市场',
                        prop: 'finalMarketName'
                    },
                    {
                        label: '未导入原因类型',
                        prop: 'unSaveBankRemark'
                    },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                operates: {
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '删除',
                            show: true,
                            class: 'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass: 'fa fa-trash-alt',
                            method: (index, row) => {
                                console.log(row);
                                this.deleteRow(row.id);
                            }
                        }
                    ]
                },
                financialMarket: '',
                legalCompany: '',
                reason: '',
                reasonSelect: []
            }
        },
        methods: {
            searchData(flag,pageIndex) {
                let that = this;
                if(pageIndex){
                    this.currentPage = 1;
                }
                let param = this.common.joinSearchParam([
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    },
                    {
                        name: 'pageSize',
                        value: this.pageSize
                    },
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    },
                    {
                        name: 'bookDateBegin',
                        value: this.bookDate?this.bookDate[0]:''
                    },
                    {
                        name: 'bookDateEnd',
                        value: this.bookDate?this.bookDate[1]:''
                    },
                    {
                        name: 'bankJdeCode',
                        value: this.bankJDE
                    },
                    {
                        name: 'unSaveBankRemark',
                        value: this.reason
                    },
                    {
                        name: 'companyId',
                        value: this.legalCompany
                    },
                    {
                        name: 'financialMarketId',
                        value: this.financialMarket
                    }
                ]);
                if (flag) {
                    this.exportData(param);
                } else {
                    api.getAllNotImportedList(param, function (res) {
                        if (res.code === 200) {
                            that.totalRecords = res.data.totalRecords;
                            that.dynamicData = res.data.list;
                        } else {
                            that.totalRecords = 0;
                            that.dynamicData = [];
                        }
                    })
                }
            },
            exportData(param) {
                let that = this;
                api.downloadNotImportedTemplate(param, 'application/vnd.ms-excel', function (res) {
                    that.common.exportTemplate('银行流水应导入而未导入模板.xlsx', res)
                })
            },
            deleteRow(id) {
                let that = this
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.deleteNotImported('?ids=' + id,function(res){
                       if(res.code == 200){
                           that.searchData()
                       }
                    });

                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            // getAllCompany() {
            //     let that = this;
            //     ip.getCompanyList('?pageSize=9999999', function (res) {
            //         that.legalCompanySelect = res.data.list;
            //     })
            // },
            getAllFinanceMarket() {
                let that = this;
                ip.getFinanceMarketIdNames('&pageSize=9999999&judgePermission=true', function (res) {
                    that.financialMarketSelect = res.data;
                })
            },
            getReasonsSelect() {
                let that = this;
                api.getAllNotImportedReason(function (res) {
                    that.reasonSelect = res.data
                })
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.searchData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.searchData();
            },
            reset(){
                this.bookDate = [];
                this.bankJDE = '';
                this.financialMarket = '';
                this.legalCompany = '';
                this.reason = '';
                this.$refs.companyRef.reset();
            },
            getCompany(query){
                this.legalCompany = query;
            },
        },
        beforeMount() {
            // this.getAllCompany();
            this.getAllFinanceMarket();
            this.getReasonsSelect();
        },
        mounted() {
            this.searchData();
        }
    }
</script>

<style>
</style>
