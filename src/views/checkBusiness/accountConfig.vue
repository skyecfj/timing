<!--账务配置-->
<template>
  <div>
    <!-- search -->
    <div class="search-content" >
        <div class="selectContent">
            <div class="selectTitle">业务类型</div>
            <el-select size="small"   v-model="searchObj.businessType" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in businessTypeOptions" :key="item.id" :label="item.instruction" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="selectContent">
            <div class="selectTitle">账套</div>
            <el-select size="small" filterable v-model="searchObj.accountMode" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in optMap[key = 'ACCOUNTSET']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="selectContent">
            <div class="selectTitle">JDE账务模块</div>
            <el-select size="small" filterable v-model="searchObj.jdeAccountModule" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in optMap[key = 'JDEACCOUNTMODULE']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <el-button size="small"  type="success" class="findButt" @click="getData">查询</el-button>
        <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
    </div>

    <!--body-->
    <div class="content" >
        <!-- <el-row class="tbl-control" >
          <el-button size="small"  type="success" @click="edit" >新增</el-button>
        </el-row> -->
        <el-table :data="tblData" border >
            <el-table-column prop="accountNumber" label="凭证编号"  ></el-table-column>
            <el-table-column prop="businessTypeStr" label="业务类型"  ></el-table-column>
            <el-table-column width="250" prop="voucherInstructionsStr" label="凭证说明"  ></el-table-column>
            <el-table-column prop="accountMode" label="账套" column-key="ACCOUNTSET" :formatter="renderTblData"  ></el-table-column>
            <el-table-column prop="jdeAccountModule" label="JDE账务模块" column-key="JDEACCOUNTMODULE" :formatter="renderTblData"  ></el-table-column>
            <el-table-column prop="buildType" label="生成方式" column-key="GENERATIONTYPE" :formatter="renderTblData"  ></el-table-column>
            <el-table-column width="150" prop="modifiedTimeStr" label="更新时间"  ></el-table-column>
            <el-table-column prop="modifiedUser" label="更新人"  ></el-table-column>
            <el-table-column width="80" prop="operate" label="操作" align="center" >
                <template slot-scope="scope">
                    <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"   @click="edit(scope.row.id)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                    </el-tooltip>
                    <!-- <el-tooltip content="删除" placement="top" effect="light" popper-class="table-cell-toolTip">
                        <el-button size="small"  class="c-button-icon--danger--opacity c-button-icon-circle" @click="delete(scope.$index)"><i class="fa fa-trash-alt"></i></el-button>
                    </el-tooltip> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" >
            <el-pagination background @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="pageSizeOpt"
                            :page-size="pageSize"
                            :total="totalRecord"
                            layout="total,sizes,prev,pager,next,jumper" ></el-pagination>
        </div>
    </div>
  </div>
</template>
<script>
import api from '../../model/api'
export default {
    name:'accountConfig',
    created(){},
    beforeMount(){
        this.getDictionaryOptions();
        this.getBusinessType();
    },
    mounted(){
        this.getData();
    },
    data() {
        return {
            searchObj:{
                businessType: '',
                accountSet: '',
                accountModule: '',
                accountMode:'',
                jdeAccountModule:''
            },
            searchConfig : {
                searchConditions : [
                    {
                        range : false,
                        type  : 'select',
                        label : '业务类型',
                        prop  : 'businessType',
                        otherConfig : {
                            placeHolder : '全部',
                            optLabel    : 'instruction',
                            optValue    : 'id',
                            opts : []
                        }
                    },
                    {
                        range : false,
                        type  : 'select',
                        label : '业务类型',
                        prop  : 'businessType',
                        otherConfig : {
                            placeHolder : '全部',
                            optLabel    : 'instruction',
                            optValue    : 'id',
                            opts : []
                        }
                    }
                ]
            },
            tblData:[],
            businessTypeOptions:[],
            //数据字典中配置的字段
            optFromDic: ['ACCOUNTSET','JDEACCOUNTMODULE','GENERATIONTYPE'],
            optMap: {},
            currentPage : 1,
            pageSizeOpt : [25,50,75,100,125],
            pageSize    : 25,
            totalRecord : 0
        }
    },
    methods: {
        //详情
        edit(id){
            let _self = this;
            let currentParams = {
                id : id
            };
            window.localStorage.setItem('params',JSON.stringify(currentParams));
            this.$router.push({
                name : 'accountDetail',
                params : currentParams
            });
        },
        //删除
        delete(id){
            let _self = this;
        },
        //获取数据字典中的配置项
        getDictionaryOptions(){
            let _self = this;

            this.optFromDic.forEach(function(item,index){
                api.getDictionaryByNumber(item,function(res){
                    _self.optMap[item] = res.data;
                })
            })

            // .then(function(res){
            //     return res;
            // });
            // api.getBrandOptions(null,function(result){
            //   _self.brandOptions = result.data;
            // })
        },
        //获取业务类型
        getBusinessType(){
            let _self = this;
            api.getBusinessType('',function(res){
                _self.businessTypeOptions = res.data;
            })
        },
        //查询列表
        getData(){
            let _self = this;
            this.searchObj.pageIndex = this.currentPage;
            this.searchObj.pageSize  = this.pageSize;
            let param = this.common.formatPathParam(_self.searchObj);
            api.getAccountConfig(param,function(result){
                if(result.code == 200){
                    _self.tblData = result.data.list;
                    _self.totalRecord = result.data.totalRecords;
                }else if(result.code == 404){
                    _self.tblData = [];
                    _self.totalRecord = 0;
                }
            })
        },
        //处理表单数据
        renderTblData(row,column,cellValue,index){
            let _self = this;
            let actCellVal = '';
            if(this.optMap[column.columnKey]){
                this.optMap[column.columnKey].forEach(function(item,index){
                    if(column.property == 'buildType'){
                        if(cellValue == item.dictionaryEntryCode){
                            actCellVal = item.dictionaryEntryName;
                        }
                    }else{
                        if(cellValue == item.id){
                            actCellVal = item.dictionaryEntryName;
                        }
                    }

                })
            }
            return actCellVal;
        },
        reset(){
            this.searchObj = {
                businessType: '',
                accountSet: '',
                accountModule: ''
            };
            // this.getData();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        }
    }
}
</script>









