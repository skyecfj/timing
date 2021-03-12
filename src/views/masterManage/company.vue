<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">财务市场</div>
                <el-select size="small"  v-model="marketName" placeholder="请选择财务市场" filterable
                     @change="changeMarketName">
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="item in marketNameOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">法人公司中文名称</div>
                <!--<el-select size="small"  v-model="id" placeholder="请选择法人公司中文名称" filterable-->
                    <!--remote reserve-keyword :remote-method="remoteCompanyName"-->
                    <!--:loading="loadingCompanyName" @change="changeCompanyName">-->
                        <!--<el-option v-for="item in companyNameOptions" :key="item.id" :label="item.name" :value="item.id">-->
                        <!--</el-option>-->
                <!--</el-select>-->
                <remoteSelect
                        placeholder="请选择法人公司"
                        :remoteFn="'getAllCompanyIdNamess'"
                        :optLabel="'companyName'"
                        :optValue="'jdeCode'"
                        @getChangeData="getCompany"
                        :type="2"
                        ref="companyRef"
                        :customType="1"
                        :param="{marketName:marketName}"
                ></remoteSelect>
            </div>
            <el-button size="small"  class="c-button c-button--primary" @click="search">查询</el-button>
            <el-button size="small"  class="c-button c-button--plain" @click="reset" plain>重置</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableDataCompany" style="width: 100%" border>
                <el-table-column prop="jdeCode" label="JDE Code" width="80px">
                </el-table-column>
                <el-table-column prop="companyName" label="法人公司中文名称" min-width="60px" sortable>
                </el-table-column>
                <el-table-column prop="legalPersonAbbre" label="法人公司缩写" min-width="60px" sortable>
                </el-table-column>
                <el-table-column prop="type" label="类别" min-width="50px">
                </el-table-column>
                <el-table-column prop="marketName" label="财务市场" min-width="50px">
                </el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.companyId,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="checkDetail(scope.row.companyId,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
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
     name:'company',
     data(){
        return {
         pageSizeList:[25, 50, 75, 100, 125],
         totalRecords:0,
         currentPage: 1,
         pageSize:25,
         isEdit:false,
         isDisabled:false,
         tableDataCompany:[],
         jdeCode:'',
         loadingMarketName:false,
         loadingCompanyName:false,
         marketName:'',
         marketNameOptions:[],
         id:'',
         companyNameOptions:[]
       }
    },
     components:{
         remoteSelect
     },
    beforeMount(){
      this.getCompanyList()
      this.getMarketIdNames('')
      // this.getCompanyIdNames('')
    },
    beforeRouteLeave(to, from, next) {
            if (to.path === '/masterManage/companyAddDetail' ||to.path === '/masterManage/companyEditDetail') {
                this.$store.dispatch('delCashedViews', from.name);
                from.meta.keepAlive = false;
            }else{
                from.meta.keepAlive = true;
            }
            next();
     },
     methods:{
         changeMarketName(val){
         },
         changeCompanyName(val){
         },
         getMarketIdNames(){
             var that = this
             api.getMarketIdNamesWithParams('&pageSize=0',function(res){
                 if(res.code === 200){
                      that.marketNameOptions = res.data
                  }else if(res.code === 404){
                      that.marketNameOptions = []
                  }
             })
         },
         // remoteCompanyName(query){
         //     if(this.common.isNullString(query)){
         //         this.id = ''
         //     }
         //     this.loadingCompanyName = true
         //      setTimeout(() => {
         //         this.loadingCompanyName = false
         //         this.getCompanyIdNames(query)
         //     }, 200);
         // },
         // getCompanyIdNames(query){
         //     var that = this
         //     api.getCompanyIdNamesWithParams(query,function(res){
         //         if(res.code == 200){
         //              that.companyNameOptions = res.data
         //          }else if(res.code == 404){
         //              that.companyNameOptions = []
         //          }
         //     })
         // },
         handleSizeChange(val) {
              this.pageSize = val
              this.getCompanyList()
         },
         handleCurrentChange(val) {
              this.currentPage = val
              this.getCompanyList();
         },
         search(){
           this.currentPage = 1
           this.getCompanyList()
         },
         reset(){
           this.id = ''
           this.marketName = ''
           // this.getMarketIdNames('')
           // this.getCompanyIdNames('');
           this.$refs.companyRef.reset();
        //    this.getCompanyList()
         },
         checkDetail(companyId,isEdit){
              isEdit ? this.$router.push({name:'companyEditDetail',query:{companyId:companyId},params:{parentRoute:this.$route.fullPath}}):
              this.$router.push({name:'companyCheckDetail',query:{companyId:companyId},params:{parentRoute:this.$route.fullPath}})
         },
         newAdd(){
             this.$router.push({name:'companyAddDetail',params:{parentRoute:this.$route.fullPath}})
         },
         getCompanyList(){
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
                   name:'marketId',
                   value:this.marketName
               },{
                   name:'id',
                   value:this.id
               }]
               api.getCompanyList(this.common.joinSearchParam(param),function(res){
                        that.tableDataCompany = [];
                        that.totalRecords = 0;
                        if(res.code === 200)
                        {
                             that.tableDataCompany = res.data.list;
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
           } ,
         getCompany(res){
             this.id = res;
         }
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

    .el-dialog .el-form .el-form-item {
        display: inline-block;
        width: 45%;
        .el-form-item__content {
            .el-select {
                width: 100%;
            }
            .el-date-editor.el-input {
                width: 100%;
            }
        }
    }

    .el-dialog .el-form .paramItem {
        .el-form-item {
            width: 96%
        }
    }

    .el-dialog .el-form .el-form-item:nth-child(even) {
        float: right;
        margin-right: 50px;
    }
</style>
