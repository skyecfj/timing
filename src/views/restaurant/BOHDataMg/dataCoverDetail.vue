<template>
    <div class="dataCoverDetail">
        <div class="search-content" >
            <div class="opreRight">
                <el-button size="small"  type="success" plain class="reSet" @click="deleteRow($route.query.id)">删除</el-button>
                <el-button size="small"  type="success" primay class="reSet" @click="sureToCover($route.query.id)">确认覆盖</el-button>
            </div>
            <el-row :gutter="24" class="opreLeft">
                <el-col :span="4">餐厅编号：{{storeCode}}</el-col>
                <el-col :span="4">餐厅名称：{{storeName}}</el-col>
                <el-col :span="4">营业日期：{{bizDate}}</el-col>
            </el-row>

        </div>

        <div class="content" >
            <el-table :data="dynamicData" style="width: 100%" border>
                <el-table-column prop="fscActivityCode" label="FSC活动名称"  align="center" ></el-table-column>
                <el-table-column prop="bohConfirmAmount" label="实收报送值"  align="center" ></el-table-column>
                <el-table-column prop="originalAmnount" label="原实收报送值"  align="center" ></el-table-column>
                <el-table-column prop="diffAmnout" label="差异值"  align="center" ></el-table-column>
            </el-table>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
    import tableOrigin from './originalTable'
    import apidr from '../../../model/apidr'
    export default {
        name: "dataCoverDetail",
        components:{
            tableOrigin
        },
        data(){
            return{
                dynamicData:[],
                storeName:'',
                storeCode:'',
                bizDate:'',
                dataCoverDInfo:'',
                lastDataCoverDInfo:''
            }
        },
        activated(){
          this.dataCoverDInfo = sessionStorage.getItem('dataCoverDetailInfo');
          if(this.lastDataCoverDInfo !== this.dataCoverDInfo && !this.common.isNullString(this.lastDataCoverDInfo)){
              JSON.parse(this.dataCoverDInfo)
                this.resetData()
          }
        },
        deactivated(){
            this.lastDataCoverDInfo = this.dataCoverDInfo;
        },
        mounted(){
            this.dataCoverDInfo = sessionStorage.getItem('dataCoverDetailInfo');
            this.resetData()
        },
        methods: {
            resetData(){
                var obj = JSON.parse(this.dataCoverDInfo)
                this.storeName = obj.storeName;
                this.storeCode = obj.storeCode;
                this.bizDate = obj.bizDate
                this.getData(obj.cashaMainId)
            },
            getData(cashaMainId){
              var that = this
              apidr.getBOHCashDiffMainDetailList(cashaMainId,res=>{
                  that.dynamicData = res.code === 200 ? res.data : []
              })
            },
            sureToCover(id) {
                let title = '',that = this;
                this.$confirm('确认覆盖吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCover({ids:[id]},function(){
                        that.cancelPage();
                    });
                })
            },
            deleteRow(id){
                let that = this;
                this.$confirm('是否删除该数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apidr.cashaCoverDelete({ids:[id]},function(){
                        that.cancelPage();
                    })
                })
            },
            cancelPage(){
                this.common.deleteTag(this.$route,this,'dataCover')
            }

        }
    }
</script>

<style scoped lang="scss">
    .opreRight {
        float: right;
        margin-right: 12px;
    }
    .opreLeft {
        margin-top: 16px;
    }

</style>