<template>
    <div>
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="6"><div>JDE Code</div></el-col>
                <el-col :span="6"><div>第三方名称</div></el-col>
                <el-col :span="6"><div>第三方类型</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input size="small" placeholder="请输入JDE Code" v-model="customerNumber" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-input size="small" placeholder="请输入第三方名称" v-model="customerName" clearable></el-input>
                </el-col>
                <el-col :span="6">
                    <el-select size="small" placeholder="" v-model="searchType">
                        <el-option :value="null" label="请选择"></el-option>
                        <el-option v-for="(item,index) in searchTypeOpt" :key="index" :value="item" :label="item"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-button size="small"  type="success" @click="getCustomerList" class="c-button">查询</el-button>
                    <el-button size="small"  type="success" plain @click="reset" class="c-button">重置</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <el-table :data="tableData" tooltip-effect="dark" border>
                <el-table-column prop="customerNumber" label="JDE Code" width="120"></el-table-column>
                <el-table-column prop="customerName" label="第三方名称"></el-table-column>
                <el-table-column prop="customerAbbre" label="简称"></el-table-column>
                <el-table-column prop="searchType" label="第三方类型"></el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="holidayUpdate(scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        class="gross"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalRecords">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "customer",
        data() {
           return {
               currentPage: 1,
               pageSizesList: [25, 50, 75, 100, 125],
               pageSize: 25,
               tableData: [],
               totalRecords: 0,
               customerName:'',
               customerNumber:'',
               searchType:null,
               searchTypeOpt:[]
           }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getCustomerList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getCustomerList();
            },
            checkDetail(rows){
                this.$router.push({name:'customerCheck',query:{customerId:rows.customerId,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            holidayUpdate(rows){
                this.$router.push({name:'customerUpdate',query:{customerId:rows.customerId},params:{parentRoute:this.$route.fullPath}});
            },
            getSearchCondition(){
                let that = this;
                ip.getListSearchType(res => {that.searchTypeOpt = res.data})
            },
            getCustomerList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'customerNumber',
                        value:this.customerNumber
                    },
                    {
                        name:'customerName',
                        value:this.customerName
                    },
                    {
                        name:'searchType',
                        value:this.searchType
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                ip.getCustomerList(tem,function (res) {
                    if(res.data === null){
                        that.tableData = [];
                    }else{
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            reset(){
                this.customerName = '';
                this.customerNumber = '';
                this.searchType = null;
                // this.getCustomerList(true);
            }
        },
        mounted(){
            this.getSearchCondition();
            this.getCustomerList();
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>
