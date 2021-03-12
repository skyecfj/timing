<template>
    <el-form :model="customizeMarketForm" labelPosition="top" :rules="rules" ref="customizeMarketForm">
      <div class="regionalContent">
        <el-row>
            <el-col :span="8">
                 <el-form-item label="市场名称" prop="marketName">
                     <el-input size="small"  v-model.trim="customizeMarketForm.marketName" :placeholder="isDisabled?'':'请输入市场名称'" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                 </el-form-item>
            </el-col>
            </el-row>
            <el-row>
            <el-col :span="8">
                <el-form-item label="请选择餐厅">
                    <div class="treeContent">
                        <el-input size="small"  placeholder="模糊查询" v-model="filterText" clearable></el-input>
                        <el-tree
                                :data="dataTree"
                                show-checkbox
                                :props="defaultProps"
                                node-key="id"
                                :default-checked-keys="checkedKeys"
                                default-expand-all
                                :filter-node-method="filterNode"
                                @check-change="handleCheckChange"
                                ref="dataTree">
                        </el-tree>
                    </div>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="备注">
                     <el-input size="small"  v-model.trim="customizeMarketForm.remark" :placeholder="isDisabled?'':'请输入(1-100位)'" type="textarea" :autosize="{minRows:8}" clearable :disabled="isDisabled" class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
     </div>
     <div class="regionalContent" v-if="isDisabled || isEdit">
         <el-row>
         <el-col :span="8">
                <el-form-item label="更新时间">
                       <el-date-picker v-model="customizeMarketForm.fscModifiedTime" type="datetime" placeholder="" clearable disabled class="sectionContent">
                       </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="更新人">
                       <el-input size="small"  v-model.trim="customizeMarketForm.modifiedUser" placeholder="" clearable disabled class="sectionContent"></el-input>
                </el-form-item>
            </el-col>
         </el-row>
     </div>
     <div class="opreaContent" v-if="!isDisabled">
         <el-button size="small"  type="success" @click="cancel" plain>取消</el-button>
         <el-button size="small"  type="success" @click="save">保存</el-button>
     </div>
    </el-form>
</template>

<script>
    import api from '../../model/api'
    export default {
      name:'customMarketDetail',
      props:["isDisabled","isEdit"],
      data(){
          return{
            customizeMarketForm:{},
            filterText:'',
            rules: {
               marketName:[{required: true, message: '自定义市场名称不能为空', trigger: 'blur'}]
            },
          dataTree: [],
          defaultProps: {
                children: 'children',
                label: 'label'
           },
          checkedKeys:[],
          filterText:'',
          restaurantId:[]
        }
      },
      watch: {
        filterText(val) {
            this.$refs.dataTree.filter(val);
        }
      },
      beforeMount(){
          if(this.$route.query.customizeMarketId)
          {
              this.getCustomizeMarket(this.$route.query.customizeMarketId)
          }
          this.getRestaurantInfo()
      },
      methods:{
          filterNode(value, data) {
            if (!value) return true;
                return data.label.indexOf(value) !== -1;
          },
          handleCheckChange(data, checked, indeterminate) {
              if(data.children == undefined)
              {
                  if(checked){
                      this.restaurantId.push(data.id)
                  }else{
                      var newRestaurantId = Object.assign([],this.restaurantId)
                      var that = this
                      newRestaurantId.forEach(function(item,index){
                        if(item === data.id)
                        {
                            that.restaurantId.splice(index,1)
                        }
                     })
                  }
              }
          },
          getRestaurantInfo(){
            this.getActivityAreaCompany()
          },
          getActivityAreaCompany(){
              var that = this
              var dataTreeCompany = []
              api.getActivityAreaCompany(function(res){
                if(res.code === 200){
                        res.data.forEach(function(item,index){
                            var companyInfo = {}
                            companyInfo.id = 'company'+item.companyId
                            companyInfo.label = item.companyName
                            if(that.isDisabled){
                                 companyInfo.disabled = true
                            }
                            that.getActivityAreaBillingunit(item.companyId,companyInfo)
                        })
                  }
              })
            },
          getActivityAreaBillingunit(companyId,companyInfo){
              var that = this
              var companyChild = []
              api.getActivityAreaBillingunit(companyId,function(res){
                        if(res.code === 200){
                            res.data.forEach(function(item,index){
                                var billIndex = index
                                var billingunitInfo = {}
                                billingunitInfo.id = 'billingunit'+item.billingUnitId
                                billingunitInfo.label = item.billingUnitName
                                if(that.isDisabled){
                                   billingunitInfo.disabled = true
                                }
                                that.getRestaurantNames(companyId,item.billingUnitId,billingunitInfo,companyChild,companyInfo)
                            })
                            companyInfo.children = companyChild
                            that.dataTree.push(companyInfo)
                        }
              })
          },
          getRestaurantNames(companyId,billingUnitId,billingunitInfo,companyChild,companyInfo){
                var billingunitChild = []
                var that = this
                api.getRestaurantNames('?companyId='+companyId+'&billingUnitId='+billingUnitId,function(res){
                    if(res.code === 200){
                        res.data.forEach(function(item,index){
                            var restaurantInfo = {}
                            restaurantInfo.id = item.restaurantId
                            restaurantInfo.label = item.restaurantName
                            if(that.isDisabled){
                                restaurantInfo.disabled = true
                            }
                            billingunitChild.push(restaurantInfo)
                        })
                        billingunitInfo.children = billingunitChild
                        companyChild.push(billingunitInfo)
                        that.$refs.dataTree.setCheckedKeys(that.checkedKeys)
                    }
                })
          },
          save(){
              var that = this
              this.$refs.customizeMarketForm.validate((valid) => {
                    if (valid) {
                        var param = {
                                marketName:that.customizeMarketForm.marketName,
                                customizeMarketId:that.customizeMarketForm.customizeMarketId,
                                remark:that.customizeMarketForm.remark,
                                restaurantIds:that.restaurantId,
                        }
                        if(that.isEdit){
                            api.updateCustomizeMarket(param,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success'),that.$refs.customizeMarketForm.clearValidate(),
                                that.cancel()): that.showTips(res.msg,'warning')
                            })
                        }
                        else{
                            api.addCustomizeMarket(param,function(res){
                                res.code === 200 ? (that.showTips(res.data,'success'),that.$refs.customizeMarketForm.clearValidate(),
                                that.cancel()): that.showTips(res.msg,'warning')
                               })
                        }
                    }
                    else{
                        return false
                    }
              })
          },
          cancel(){
              this.common.deleteTag(this.$route,this)
          },
          getCustomizeMarket(customizeMarketId){
              var that = this
              api.getCustomizeMarketById(customizeMarketId,function(res){
                  that.customizeMarketForm = res.data
                  that.checkedKeys = that.customizeMarketForm.restaurantInfo
              })
          },
         showTips(text,type){
            this.common.messageUtil({
                message: text,
                type: type
            });
        },
      }
    }
</script>

<style lang="scss" scoped>
.regionalContent {
    background-color: white;
    margin-bottom: 20px;
    .el-row {
      padding:0px 20px 0px;
      &:last-child{
          padding-bottom: 20px
      }
      &:first-child{
          padding-top: 20px
      }
      .sectionContent
      {
          display:block;
          width: 95%
      }
    }

    .el-form-item{
        margin-bottom: 10px;
    }
}
.opreaContent {
    text-align: right;
    padding: 0 20px 20px
}
.treeContent {
    width:95%;
    border:1px solid #dcdfe6;
    padding: 10px;
    .el-tree{
        marigin-top: 10px
    }
}

</style>
