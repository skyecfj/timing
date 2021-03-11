<template>
    <div class="bankStatementReportTable">
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
            <el-button size="small" type="success" class="findButt" @click="getData">查询</el-button>
            <el-button size="small"  type="success" class="findButt" @click="download">下载</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :selection="selection"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="bankStatementReportTable"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    :totalRecords="totalRecords"
                    @handleSelectionChange="handleSelectionChange"
                    :pageIndex="currentPage"
            ></tableOrigin>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '@/views/restaurant/BOHDataMg/originalTable'
    import api from '@/model/apidr'

    export default {
        name: "testReport",
        components: {
            tableOrigin
        },
        data() {
            return {
                dynamicData: [],
                tableHead: [],
                selection: true,
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
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
            handleSelectionChange(res) {
                let that = this;
                // that.ids = [];
                // if(res && res.length>0){
                //     res.forEach(function (item,index) {
                //         that.ids.push(item.id);
                //     })
                // }
            },
            getData() {

            },
            reset() {

            },
            download(){

            }
        }
    }
</script>

<style scoped>

</style>
