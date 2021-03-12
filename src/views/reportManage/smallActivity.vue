<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
                <div class="selectTitle">品牌</div>
                <el-select v-model="brand" size="small" filterable>
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in brandOpt" :key="index" :value="item.brandEnglishName" :label="item.brandEnglishName"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">活动状态</div>
                <el-select v-model="status" size="small">
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in statusOpt" :key="index" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">活动名称</div>
                <el-select v-model="activityName" size="small" filterable>
                    <el-option :value="null" label="请选择"></el-option>
                    <el-option v-for="(item,index) in activityNameOpt" :key="index" :value="item.activityName" :label="item.activityName"></el-option>
                </el-select>
            </div>
            <el-button size="small" type="success"  @click="getSmallActivityList">查询</el-button>
            <el-button size="small" type="success"  @click="reset" plain class="reSet">重置</el-button>
            <el-button size="small" type="success"  @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" border>
                <el-table-column prop="activityCode" label="活动编号"></el-table-column>
                <el-table-column prop="activityName" label="活动名称"></el-table-column>
                <el-table-column prop="activityType" label="活动类型">
                    <!-- <template slot-scope="scope">
                        <span v-if="scope.row.activityType === '1'">A-N全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === '2'">A-L非全国性促销活动</span>
                        <span v-else-if="scope.row.activityType === '3'">房东代收</span>
                    </template> -->
                </el-table-column>
                <el-table-column prop="brandName" label="品牌"></el-table-column>
                <el-table-column prop="rscCollection" label="是否RSC代收"></el-table-column>
                <el-table-column prop="rscJdeCode" label="代收公司JDE_Code"></el-table-column>
                <el-table-column prop="thirdJdeCode" label="第三方JDE_Code"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                               :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRecords" :page-sizes="pageSizeList">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '@/model/api'
    export default {
        name: 'smallActivity',
        data () {
            return {
                brand:null,
                brandOpt:[],
                status:null,
                statusOpt:[{
                    value:3,
                    label:'进行中'
                },{
                    value:4,
                    label:'已结束'
                }],
                activityNameOpt:[],
                activityName:null,
                tableData: [],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
            }
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val;
                this.getSmallActivityList()
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getSmallActivityList()
            },
            reset () {
                this.brand = null;
                this.status = null;
                this.activityName = null;
            },
            getSmallActivityList () {
                let that = this;
                let pathParams = {
                    activityName:this.activityName,
                    brandName:this.brand,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    status:this.status
                };
                api.getSmallActivityList(pathParams,res =>{
                    that.tableData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code !== 404) {
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            exportFile () {
                let that = this;
                let pathParams = {
                    activityName:this.activityName,
                    brandName:this.brand,
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    status:this.status
                };
                api.exportSmallActivity(pathParams, 'application/vnd.ms-excel', function(res){
                    if (res.code) {
                        that.showTips(res.msg,'warning')
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '活动小表.xlsx';
                        link.target = '_blank';link.click()
                    }
                })
            },
            showTips (text,type) {this.common.messageUtil({message: text, type: type})},
            getSelect(){
                let that = this;
                api.getSmallActivityBrand(res => {that.brandOpt = res.data});
                api.getSmallActivityList({pageSize:0},res => {that.activityNameOpt = res.data.list})
            }
        },
        beforeMount(){
            this.getSelect()
        }
    }
</script>

<style>
</style>
