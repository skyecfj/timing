<template>
    <div class="billImportedNotInTimeReportTable">
        <div class="search-content">
            <searchHeader
                    :showDate="true"
                    v-on:getBookDate="getBookDate"
                    @reset="reset"
                    ref="billImportedNotInTimeHeader"
                    :dataLabel="'交易日期'"
            >
                <div class="selectContent">
                    <div class="selectTitle">活动名称</div>
                    <el-select size="small" filterable v-model.trim="fscActivityCode">
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in activityList" :value="item.id"
                                   :label="item.abbr" :key="index"></el-option>
                    </el-select>
                </div>
                <div class="selectContent">
                    <div class="selectTitle">活动负责人</div>
                    <el-input size="small" v-model="person" clearable></el-input>
                </div>
                <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
                <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
                <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            </searchHeader>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="billImportedNotInTimeReportTable"
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
    import apidr from '@/model/apidr'
    import api from '@/model/api'
    import searchHeader from '@/components/common/searchHeader'

    export default {
        name: 'billImportedNotInTime',
        components: {
            tableOrigin,
            searchHeader
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label: '活动名称',
                        prop: 'activityName'
                    },
                    {
                        label: '账单获取方式',
                        prop: 'getWayDesc'
                    },
                    {
                        label: '交易日期',
                        prop: 'tradeDate'
                    },
                    {
                        label: '账单应导入日期',
                        prop: 'createTime'
                    },
                    {
                        label: '账单实际导入日期',
                        prop: 'actualImportDate'
                    },
                    {
                        label: '滞后天数',
                        prop: 'gap'
                    },
                    {
                        label: '活动负责人',
                        prop: 'supplementedPerson'
                    },
                    {
                        label: '未及时导入原因',
                        prop: 'reason'
                    },
                ],
                align: 'center',
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                bookDate: [],
                fscActivityCode: '',
                activityList: [],
                person: ''
            }
        },
        methods: {
            handleSizeChange (size) {
                this.pageSize = size;
                this.getData()
            },
            handleCurrentChange (currentPage) {
                this.currentPage = currentPage;
                this.getData()
            },
            getData (num) {
                if (num === 1) {
                    this.currentPage = 1;
                }
                apidr.getImportedNotInTime({
                    'tradeDateStart': this.bookDate ? this.bookDate[0] : null,
                    'tradeDateEnd': this.bookDate ? this.bookDate[1] : null,
                    'activityId': this.fscActivityCode,
                    'supplementedPerson': this.person,
                    'pageSize': this.pageSize,
                    'pageIndex': this.currentPage
                }, res => {
                    this.dynamicData = res.code === 200 ? res.data.list : [];
                    this.totalRecords = res.code === 200 ? res.data.totalRecords : 0
                })
            },
            reset () {
                this.fscActivityCode = '';
                this.person = '';
                this.$refs.billImportedNotInTimeHeader.reset();
            },
            download () {
                apidr.downloadImportedNotInTime({
                    'tradeDateStart': this.bookDate ? this.bookDate[0] : null,
                    'tradeDateEnd': this.bookDate ? this.bookDate[1] : null,
                    'activityId': this.fscActivityCode,
                    'supplementedPerson': this.person,
                }, 'application/vnd.ms-excel', (res,) => {
                    this.common.exportTemplate('账单未及时导入统计报告', res);
                })
            },
            getBookDate (res) {
                this.bookDate = res;
            },
            getList () {
                api.getActiveList('?pageSize=0', res => {
                    if (res.code === 200) {
                        this.activityList = res.data.list.map(item => {
                            return {
                                abbr: item.activityName,
                                id:item.id
                            }
                        })
                    }
                })
            }
        },
        beforeMount () {
            this.getData();
            this.getList();
        }
    }
</script>
