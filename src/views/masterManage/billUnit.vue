<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
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
                <div class="selectTitle">开票单位名称</div>
                <el-select filterable v-model="billingUnitName" placeholder="请输入查询关键词" size="small">
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in billingUnits" :value="item.id" :label="`[${item.jdeCode}]${item.billingUnitName}`" :key="index"></el-option>
                </el-select>
                <!--<el-input size="small"  v-model.trim="billingUnitName" clearable placeholder="请输入查询关键词"></el-input>-->
            </div>
            <el-button size="small"  type="success" @click="search">查询</el-button>
            <el-button size="small"  type="success" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableDataBillUnit" style="width: 100%" border>
                <el-table-column prop="jdeCode" label="JDE Code" width="100px">
                </el-table-column>
                <el-table-column prop="billingUnitName" label="开票单位名称" min-width="80px" sortable>
                </el-table-column>
                <el-table-column prop="affiliatedCompany" label="法人公司" min-width="80px" sortable>
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.billingUnitId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.billingUnitId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
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
import api from '../../model/api'
import remoteSelect from '@/components/common/remoteSelect'
 export default {
     name:'billUnit',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         billingUnitName:'',
         tableDataBillUnit:[],
         billingUnits:[],
         company:''
       }
    },
     components:{
         remoteSelect
     },
    beforeMount(){
        this.getBillUnitList()
    },
    beforeRouteLeave(to, from, next) {
        if (to.path === '/masterManage/billUnitEditDetail') {
            this.$store.dispatch('delCashedViews', from.name);
            from.meta.keepAlive = false;
        }else{
            from.meta.keepAlive = true;
        }
        next();
     },
     methods:{
         handleSizeChange(val) {
              this.pageSize = val
              this.getBillUnitList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getBillUnitList();
         },
         search(){
           this.currentPage = 1
           this.getBillUnitList()
         },
         reset(){
           this.billingUnitName = '';
           this.$refs.companyRef.reset();
           this.billingUnits = [];
        //    this.getBillUnitList()
         },
         checkDetail(billingUnitId,isEdit){
             isEdit ?  this.$router.push({name:'billUnitEditDetail',query:{billingUnitId:billingUnitId},params:{parentRoute:this.$route.fullPath}}) :
             this.$router.push({name:'billUnitCheckDetail',query:{billingUnitId:billingUnitId},params:{parentRoute:this.$route.fullPath}})
         },
         getBillUnitList(){
             var that = this
             var param = [
                 {
                    name:'pageIndex',
                    value:this.currentPage
                 },
                 {
                    name:'pageSize',
                    value:this.pageSize
               },{
                   name:'billingUnitId',
                   value:this.billingUnitName
               },
                 {
                     name:'companyCode',
                     value:this.company
                 }
             ]
               api.getBillUnitList(this.common.joinSearchParam(param),function(res){
                        that.tableDataBillUnit = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataBillUnit = res.data.list;
                             that.totalRecords = res.data.totalRecords;
                        }
                        else if(res.code != 404){
                            that.showTips(res.msg,'warning')
                        }
                })
         },
         showTips(text,type){
               this.common.messageUtil({
                 message: text,
                 type: type
               });
           },
         getUnitsOpt(param){
             api.getBillUnitsByCompanyCode(param,res=>{
                 if(res.code === 200){
                     this.billingUnits = res.data;
                 }
             })
         },
         getCompany(res){
             this.company = res;
             this.getUnitsOpt('?companyCode='+res+'&pageSize=0')
         },
     }
 }
</script>
<style scoped lang="scss">
    .topContent {
        padding: 20px;
        background-color: white;
        margin-bottom: 20px;
    }

    .pagination {
        text-align: right;
        padding: 20px;
    }

    .deleteColor {
        color: #F56C6C;
    }

    .bottomContent {
        background-color: white;
        .cbBContentRight {
            float: right;
            text-align: right;
            margin-top: 20px;
            margin-right: 30px;
            margin-bottom: 20px;
        }
    }
</style>
