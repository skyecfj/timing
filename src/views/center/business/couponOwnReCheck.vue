<template>
  <div>
    <!-- search -->
    <div class="search-content" >
      <div class="selectContent">
        <div class="selectTitle">订单号</div>
        <el-input v-model.trim="searchObj.orderCode" ></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">订单日期</div>
        <el-date-picker v-model="searchObj.orderTime" type="date"
                        value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">售卖渠道</div>
        <el-select size="small"   v-model="searchObj.sellChannelType" placeholder="售卖渠道">
          <el-option v-for="item in sellChannelTypeOptions" :key="item.id" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">退款日期</div>
        <el-date-picker v-model="searchObj.refundTime" type="date"
                        value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      </div>
      <div class="selectContent">
        <div class="selectTitle">品牌</div>
        <el-select size="small" v-model="searchObj.brandType" placeholder="全部品牌" :disabled="choosenBrandType != '' " filterable >
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in brandOptions" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandEnglishName">
          </el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">商品类别</div>
        <el-input v-model.trim="searchObj.productCategory" ></el-input>
      </div>
      <div class="selectContent">
        <div class="selectTitle">是否已手工分录</div>
        <el-select size="small" v-model="searchObj.journalType" >
          <el-option label="请选择" value=""></el-option>
          <el-option label="是" value="1" ></el-option>
          <el-option label="否" value="0" ></el-option>
        </el-select>
      </div>
      <div class="selectContent">
        <div class="selectTitle">活动组</div>
        <el-input v-model.trim="searchObj.activityGroup" ></el-input>
      </div>
      <el-button size="small"  type="success" class="findButt" @click="search">查询</el-button>
      <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
    </div>

    <div class="content">
      <!--单表-->
      <template v-if="showTbl" >
        <el-row class="tbl-control" >
          <el-button size="small"  type="text" @click="exportDetail" ><i class="el-icon-download"></i>下载</el-button>
          <el-button size="small"  type="success" @click="addToRecheck" >加入下次核对</el-button>
        </el-row>
        <el-table :data="checkDetailData" style="width: 100%" :border="true" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>
          <el-table-column  v-for="(headerItem,index) in tHeaderConfig.labels"
                            v-bind:key="index"
                            :prop="tHeaderConfig.props[index]"
                            :label="headerItem"></el-table-column>
        </el-table>
        <div class="page-content" >
          <el-pagination  @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="currentPage"
                          :page-sizes="pageSizeOpt"
                          :page-size="pageSize"
                          :total="totalRecord"
                          layout="total,sizes,prev,pager,next,jumper" ></el-pagination>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
    import api from '../../../model/api'
    import tblHeaderConfig from '../../../utils/checkResultsUtil'

    export default {
        name:'couponOwnReCheck',
        beforeMount(){
            // for(let i = 0; i < tblHeaderConfig.noBillTblHeader.length; i ++){
            //     if(tblHeaderConfig.noBillTblHeader[i].type == this.reportType){
            //         this.tHeaderConfig = tblHeaderConfig.noBillTblHeader[i];
            //     }
            // }
        },
        mounted(){
            this.getHeaderConfig();
            //this.getData();
        },
        data() {
            return {
                //reportType : '2-1',
                showTbl : false,
                tHeaderConfig : {
                    labels : [],
                    props  : []
                },
                searchObj  : {},
                selectData :[],
                brandOptions  : [],
                sellChannelTypeOptions: [],//售卖渠道
                choosenBrandType : '',
                checkDetailData : [],
                currentPage : 1,
                pageSizeOpt : [25,50,75,100,125],
                pageSize    : 25,
                totalRecord : 0
            }
        },
        methods: {
            getHeaderConfig(){
                let _self = this;
                let searchParam = this.common.formatPathParam({
                    pageIndex : 1,
                    pageSize  : 99999999,
                    flag : 2
                });
                api.getBrandList(searchParam,function(result){
                    console.log(result);
                    if(result.data.list){
                        _self.brandOptions = result.data.list;
                    }else{
                        _self.brandOptions = [];
                    }
                });
                api.getDictionaryByNumber('COUPON-B2C',function(res){
                    _self['sellChannelTypeOptions'] = res.data;
                })
            },
            search(){
                this.currentPage = 1;
                this.getData();
            },
            //查询列表
            getData(){
                let _self = this;
                this.searchObj.pageIndex = this.currentPage;
                this.searchObj.pageSize = this.pageSize;
                if(!this.searchObj.sellChannelType){
                    this.common.messageUtil({
                        message : '请选择售卖渠道',
                        type    : 'warning'
                    });
                    return false;
                }
                api.getCouponOwnData(this.searchObj,function(result){
                    if(result.data){
                        _self.showTbl = true;
                        let tblHeaderMap = result.data.headMap;
                        _self.tHeaderConfig = {
                            labels : [],
                            props  : []
                        };
                        for(let key in tblHeaderMap){
                            _self.tHeaderConfig.labels.push(tblHeaderMap[key]);
                            _self.tHeaderConfig.props.push(key);
                        }
                        _self.checkDetailData = result.data.dataList.list;
                        _self.totalRecord = result.data.dataList.totalRecords;
                    }else if(result.code != 404){
                        _self.common.messageUtil({
                            message: result.msg,
                            type: 'warning'
                        });
                        _self.tHeaderConfig = {
                            labels : [],
                            props  : []
                        };
                        _self.checkDetailData = [];
                        _self.totalRecord = 0;
                    }
                })
            },
            reset(){
                let _self = this;
                this.searchObj = {};
            },
            //处理表单数据
            // renderTblData(row,column,cellValue,index){
            //     let _self = this;
            //     if(column.property === 'journalType'){
            //         if(cellValue == 0){
            //             return '否';
            //         }else if(cellValue == 1){
            //             return '是';
            //         }
            //     }else{
            //         return cellValue;
            //     }
            // },
            //
            addToRecheck(){
                let _self = this;
                this.$confirm('确定加入下次核对?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = [];
                    _self.selectData.forEach(function(item,index){
                        ids.push(item.id);
                    });
                    api.addToRecheck({ids : ids,sellChannelType : _self.selectData[0].channelType},function(result){
                        if(result.code === 200){
                            _self.common.messageUtil({
                                message: result.data,
                                type: 'success'
                            });
                            _self.getData();
                        }else{
                            _self.common.messageUtil({
                                message: result.msg,
                                type: 'error'
                            });
                        }
                    })
                }).catch(() => {
                });
            },
            handleSelectionChange(selectedDatas) {
                this.selectData = selectedDatas;
            },
            handleSizeChange(val){
                this.pageSize = val;
                this.getData();
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.getData();
            },
            //下载数据
            exportDetail(){
                let _self = this;
                this.searchObj.pageIndex = this.currentPage;
                this.searchObj.pageSize = this.pageSize;
                if(!this.searchObj.sellChannelType){
                    this.common.messageUtil({
                        message : '请选择售卖渠道',
                        type    : 'warning'
                    });
                    return false;
                }
                api.exportCouponRecheckList(this.searchObj,'application/vnd.ms-excel',function(res,headers){
                    if(res.code){
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    }else{
                        const fileName = headers['content-disposition'].split(';')[1].split('=')[1];
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = fileName;
                        link.target = '_blank';link.click();
                    }
                })
            }
        }
    }
</script>









