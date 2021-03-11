<template>
    <div class="couponRecordInconformityTable">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">年/月</div>
                <el-date-picker v-model="searchData.month" type="month"
                                value-format="yyyy-MM" placeholder="选择日期"></el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">品牌</div>
                <el-select size="small" v-model="searchData.brandName" placeholder="请选择品牌" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in brandSelect" :key="index" :label="item.englishName"
                               :value="item.englishName"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">券活动组</div>
                <el-select size="small" v-model="searchData.activityGroup" placeholder="请选择券活动组" filterable>
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in activityGroupSelect" :key="index" :label="item"
                               :value="item"></el-option>
                </el-select>
            </div>
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small" type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="couponRecordInconformityTable"
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
    import ip from '@/model/api'
    export default {
        name: "couponRecordInconformity",
        components: {
            tableOrigin,
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label: '券码',
                        prop: 'couponCode'
                    },
                    {
                        label: '券活动组',
                        prop: 'activityGroup'
                    },
                    {
                        label: '券id',
                        prop: 'activityId'
                    },
                    {
                        label: '券名称',
                        prop: 'activity'
                    },
                    {
                        label: '核销时间',
                        prop: 'usedTime'
                    },
                    {
                        label: '激活时间',
                        prop: 'activatedTime'
                    },
                    {
                        label: '品牌',
                        prop: 'brandName'
                    },
                    {
                        label: '使用状态',
                        prop: 'useStatus'
                    },
                    {
                        label:'单张券金额',
                        prop:'sales'
                    },
                    {
                        label:'主券可用次数',
                        prop:'reusableCount'
                    },
                    {
                        label:'主券已使用次数',
                        prop:'usedseqid'
                    },
                    {
                        label:'主券核销金额',
                        prop:'amount'
                    },
                    {
                        label:'子券使用次数',
                        prop:'couponCount'
                    },
                    {
                        label:'子券核销金额',
                        prop:'couponAmount'
                    },

                ],
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                searchData: {
                    month: '',
                    brandName: '',
                    activityGroup: ''
                },
                activityGroupSelect: [],
                brandSelect: []
            }
        },
        beforeMount() {
            this.getActivityGroup();
            this.getBrandEnglishNames();
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
                if (pageIndex) {
                    this.currentPage = 1;
                }
                let that = this;
                api.couponRecordInconformityList(this.getParam(), function (res) {
                    if (res.code === 200) {
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    } else {
                        that.dynamicData = [];
                        that.totalRecords = 0;
                    }
                })
            },
            getParam() {
                return this.common.joinSearchParam([
                    {
                        value: this.searchData.month,
                        name: 'month'
                    },
                    {
                        value: this.searchData.brandName,
                        name: 'brandName'
                    },
                    {
                        value: this.searchData.activityGroup,
                        name: 'activityGroup'
                    },
                    {
                        value: this.currentPage,
                        name: 'pageIndex'
                    },
                    {
                        value: this.pageSize,
                        name: 'pageSize'
                    },
                ])
            },
            reset() {
                let that = this;
                for (let index in this.searchData) {
                    that.searchData[index] = '';
                }
            },
            download() {
                let that = this;
                api.downLoadCouponRecordInconformity(this.searchData, 'application/vnd.ms-excel', function (res, header) {
                    that.common.exportTemplate('主券次数与子券不一致.xlsx', res);
                })
            },
            getActivityGroup() {
                let that = this;
                ip.getActivityGroup(function (res) {
                    if (res.code === 200) {
                        that.activityGroupSelect = res.data
                    } else if (res.code !== 404) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            },
            getBrandEnglishNames() {
                let that = this;
                ip.getBrandEnglishNames('?flag=2', function (res) {
                    if (res.code === 200) {
                        that.brandSelect = res.data
                    } else if (res.code !== 404) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.message
                        })
                    }
                })
            },
        },
    }
</script>

<style scoped>

</style>
