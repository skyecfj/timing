<!--alipayAccount 支付宝账务流水查询--->
<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
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
                ></remoteSelect>
            </div>
            <div class="selectContent">
                <div class="selectTitle">发生时间</div>
                <el-date-picker
                    v-model="bookDate"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                >
                </el-date-picker>
                <!--<el-date-picker
                    v-model="searchData.finalTransDate"
                    type="date"
                    placeholder="EnterDate"
                    value-format="yyyy-MM-dd"
                    size="small"
                >
                </el-date-picker>-->
            </div>
            <!--<div class="selectContent">-->
                <el-button size="small" type="success"  @click="alipayAccountList">查询</el-button>
                <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
                <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                <el-popover
                        placement="right"
                        trigger="click">
                    <el-table :data="downloadList" max-height="300" size="small"
                    >
                        <el-table-column label="导出类型" width="200" property="exportType"></el-table-column>
                        <el-table-column label="状态" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status === 0">已提交</span>
                                <span v-else-if="scope.row.status === 1 ">执行中</span>
                                <span v-else-if="scope.row.status === 2 ">已完成</span>
                                <span v-else-if="scope.row.status === 3">已失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column property="createTime" label="创建时间" width="140"></el-table-column>
                        <el-table-column width="100" label="地址">
                            <template slot-scope="scope">
                                <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                                <a v-else class="link-disable">下载</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()"
                               class="c-button">查看下载列表
                    </el-button>
                </el-popover>
            <!--</div>-->
        </div>
          <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="aplipayAccountTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import ip from '@/model/api'
    import api from '@/model/api'
    import apidr from '@/model/apidr'
    import remoteSelect from '@/components/common/remoteSelect'
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'

    /**
     * 查询接口  downalipayAccountList
     *
     * exportTypes= 支付宝账单流水
     */
    export default {
        name: 'alipayAccount',
        components: {
            tableOrigin,
            remoteSelect
        },
        data(){
            return {
                align:'center',
                dynamicData:[],

                bookDate:[],
                companyCode:'',
                tableHead: [
                    {
                        label: '法人公司',
                        prop: 'company'
                    },
                    {
                        label: '账务流水号',
                        prop: 'billNo'
                    },
                    {
                        label: '业务流水号',
                        prop: 'bizNo'
                    },
                    {
                        label: '商户订单号',
                        prop: 'orderNo'
                    },
                    {
                        label: '商品名称',
                        prop: 'productName'
                    },
                    {
                        label: '发生时间',
                        prop: 'paymentTime'
                    },
                    {
                        label: '对方账号',
                        prop: 'paymentAccount'
                    },
                    {
                        label: '收入金额',
                        prop: 'inAmount'
                    },
                    {
                        label: '支出金额',
                        prop: 'outAmount'
                    },
                    {
                        label: '账户余额',
                        prop: 'balance'
                    },
                    {
                        label: '交易渠道',
                        prop: 'source'
                    },
                    {
                        label: '业务类型',
                        prop: 'bizType'
                    },
                    {
                        label: '备注',
                        prop: 'notation'
                    },
                ],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                downloadList:[]
            }
        },
        methods: {
            handleSizeChange (size) {
                this.pageSize = size
                this.alipayAccountList()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage
                this.alipayAccountList()
            },
            reset () {
                this.bookDate = [];;
                this.companyCode = '';
                this.$refs.companyRef?this.$refs.companyRef.reset():null;
            },
            exportFile () {
                let that = this;
                apidr.downloadAlipayAccount(this.getParam());
            },
            getParam(){
                return this.common.joinSearchParam( [{
                    name: 'pageIndex',
                    value: this.currentPage
                }, {
                    name: 'pageSize',
                    value: this.pageSize
                }, {
                    name: 'preTransDate',
                    value: this.bookDate?this.bookDate[0]:null
                }, {
                    name: 'finalTransDate',
                    value: this.bookDate?this.bookDate[1]:null
                }, {
                   name: 'company',
                   value: this.companyCode
                }]
                )
            },
            alipayAccountList () {
                let that = this
                    apidr.alipayAccountList(this.getParam(), function(res){
                        if (res.code === 200) {
                            that.dynamicData = res.data.list
                            that.totalRecords = res.data.totalRecords
                        } else {
                            that.totalRecords = 0
                            that.dynamicData = [];
                        }
                })
            },
           getDownloadList(param){
                var that = this;
                ip.getDownloadListDr(`?pageSize=9999999
                                        &exportTypes=支付宝账单流水`,function(res){
                    if(res.code === 200){
                        that.downloadList = res.data.list;
                    }else{
                        that.downloadList = [];
                    }
                })
            },
            getCompany(res){
                // this.$emit('getCompany1',res||'')
                this.companyCode = res;
            },
        },
    }
</script>

<style>
    .link{
        color:-webkit-link;
    }
    .link-disable{
        color:#bdbdbd;
        cursor:not-allowed
    }
</style>
