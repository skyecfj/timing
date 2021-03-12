<template>
    <div class="smallPaperInventoryReportTable">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">创建日期</div>
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
            <el-button size="small" type="success" class="findButt" @click="getData(1)">查询</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="smallPaperInventoryReportTable"
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

    export default {
        name: "smallPaperInventory",
        components: {
            tableOrigin
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        prop:'seq',
                        label:'seq'
                    },
                    {
                        prop:'cardStart',
                        label:'卡号开始序号'
                    },
                    {
                        prop:'cardEnd',
                        label:'卡号结束序号'
                    },
                    {
                        prop:'createTime',
                        label:'创建时间'
                    }
                ],
                selection: true,
                align: 'center',
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                bookDate: []
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
            getData(num) {
                let that = this;
                if(num === 1){
                    this.currentPage = 1;
                }
                api.smallPaperInventoryList(this.common.joinSearchParam([
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },{
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'beginTime',
                        value:this.bookDate&&this.bookDate.length>0?this.bookDate[0]:null,
                    },
                    {
                        name:'endTime',
                        value:this.bookDate&&this.bookDate.length>0?this.bookDate[1]:null,
                    }
                ]),res=>{
                    res.data.list.length>0?that.dynamicData = res.data.list : that.dynamicData = [];
                    that.totalRecords = res.data.totalRecords;
                })
            },
            reset() {
                this.bookDate = [];
            },
        }
    }
</script>

<style scoped>

</style>
