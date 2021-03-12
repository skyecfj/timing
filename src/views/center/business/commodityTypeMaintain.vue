<!--数据查看-->
<template>
  <div class="commodityTypeMaintain">
    <div class="viewHeader">
      <el-row :gutter="24">
        <el-col :span="3"><div>售卖渠道</div></el-col>
        <el-col :span="3"><div>商品编号</div></el-col>
        <el-col :span="3"><div>商品名称</div></el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="3">
          <el-select size="small"  v-model="channelType" placeholder="请选择售卖渠道" filterable >
            <el-option
                    v-for="item in channelsOpt"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3" >
          <el-input v-model.trim="productCode" size="small" placeholder="商品编号"></el-input>
        </el-col>
        <el-col :span="3" >
          <el-input v-model.trim="productName" size="small" placeholder="商品名称"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-button size="small" type="success" class="c-button" @click="getDataViewList">查询</el-button>
          <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="viewContent">
      <el-table :data="tableData" border class="viewTable">
          <el-table-column prop="productCode" label="商品编号"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="createTime" label="创建时间"></el-table-column>
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
    import ip from '../../../model/api'
    export default {
        name: "commodityTypeMaintain",
        data() {
            return {
                channelsOpt:[],
                brandsOpt:[],
                channelType:'',
                pageSizesList:[25, 50, 75, 100, 125],
                currentPage:1,
                pageSize:25,
                totalRecords:0,
                tableData:[],
                productName:'',
                productCode:''
            }
        },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getDataViewList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getDataViewList();
            },
            getChannels(){
                var that = this;
                ip.getChannelsAboutGoods(function(res){
                    for(var val in res.data){
                        that.channelsOpt.push({value:val,label:res.data[val],})
                    }
                })
            },
            searchData(){
                this.currentPage = 1;
                this.getDataViewList();
            },
            getDataViewList(currentPage){
                var that = this;
                var tem =   {
                        pageIndex:this.currentPage,
                        pageSize:this.pageSize,
                        channelType:this.channelType.trim(),
                        productCode:this.productCode.trim(),
                        productName:this.productName.trim()
                    }
                ip.searchCommodityWithoutCategory(tem,res => {
                    that.tableData = [];
                    that.totalRecords = 0;
                    if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else if(res.code !== 404 && res.code !== 200){
                        that.common.messageUtil({message:res.msg,type:'error'});
                    }
                })
            },
            reset(){
                this.channelType = '';
                this.productCode = '';
                this.productName = '';
            },
        },
        beforeMount(){
            this.getChannels()
        },

    }
</script>

<style lang="scss">
  @import '../../../assets/scss/center';
  .dayMargin{
    min-width: 50px;
    .el-date-editor--daterange.el-input__inner{
      width: 100%;
    }
  }
  .block{
    .el-date-editor .el-input__icon,.el-range-separator{
      line-height: 22px;
    }
  }
  .uploadB2C{
    .el-form-item__label{
      width:80px;
    }
    .el-form-item__error{
      left:80px;
    }
  }
</style>

