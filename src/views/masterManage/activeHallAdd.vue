<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="activeData"
            :model="activeData"
            label-width="100px">
        <div class="viewFormHeader">
            <el-form-item
                    label="活动区域名称"
                    class="viewFormLeft"
                    prop="activityAreaName"
                    :rules="[
                        {required:true,message:'请输入活动区域名称',trigger:'blur'}
                    ]">
                <el-input size="small"  placeholder="华北地区" v-model.trim="activeData.activityAreaName" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item label="备注" class="viewFormRight">
                <el-input size="small"  placeholder="请输入备注" v-model.trim="activeData.remark" clearable :disabled="isChecked"></el-input>
            </el-form-item>
            <el-form-item
                    label="请选择区域餐厅"
                    class="viewFormHall">
                <div class="selectHall">
                    <el-checkbox @change="isSelectAll" class="isSelected" :disabled="isChecked">全选/全不选</el-checkbox>
                    <el-tree
                            :data="dataTree"
                            show-checkbox
                            node-key="id"
                            :default-checked-keys="activeData.restaurantId"
                            default-expand-all
                            ref="dataTree"
                            highlight-current>
                    </el-tree>
                </div>
            </el-form-item>
        </div>
        <div class="viewFormContent" v-if="activityAreaId !== ''">
            <el-form-item label="FSC更新时间">
                <el-input size="small"  placeholder="2018-05-31 13:40:38" v-model.trim="activeData.fscModifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新人">
                <el-input size="small"  placeholder="连杰" v-model.trim="activeData.modifiedUser" disabled></el-input>
            </el-form-item>
        </div>
        <div class="buttomButton" v-if="!isChecked">
            <el-form-item>
                <el-button size="small"  type="success" plain @click='cancel' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="insertActive('activeData')" class="c-button">保存</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "activeHallAdd",
        data(){
            return{
                isChecked:false,
                module: '主档管理',
                subModule: '活动区域与餐厅映射',
                activityAreaId: '',
                activeData: {},
                isSelected: false,
                dataTree: [],
                allHallId:[]
            }
        },
        methods:{
            isSelectAll(){
                if(!this.isSelected){
                    this.isSelected=!this.isSelected;
                    this.$refs.dataTree.setCheckedKeys(this.allHallId);
                }else{
                    this.isSelected=!this.isSelected;
                    this.$refs.dataTree.setCheckedKeys([]);
                }
            },
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            getHallInfo(){
                var that = this;
                ip.getActivityAreaCompany(res =>  {
                    if(res.code === 200){
                        res.data.forEach(item => {
                            var companyInfo = {};
                            var companyParam = [{
                                name:'jdeCode',
                                value:item.companyJdeCode
                            }, {
                                name:'id',
                                value:item.companyId
                            }];
                            companyInfo.id = 'company'+item.companyJdeCode;
                            companyInfo.label = item.companyName;
                            if(that.isChecked){companyInfo.disabled = true;}
                            ip.getActivityAreaBillingunit(that.common.joinSearchParam(companyParam),res => {
                                var companyChild = [];
                                var companyId = item.companyJdeCode;
                                if(res.code === 200){
                                    res.data.forEach(item => {
                                        var billingunitInfo = {};
                                        billingunitInfo.id = 'billingunit'+item.billingUnitJdeCode;
                                        billingunitInfo.label = item.billingUnitName;
                                        if(that.isChecked){billingunitInfo.disabled = true;}
                                        ip.getRestaurantNames('?companyJdeCode='+companyId+'&billingUnitJdeCode='+item.billingUnitJdeCode,function (res) {
                                            var billingunitChild = [];
                                            if(res.code === 200){
                                                res.data.forEach(item => {
                                                    var restaurantInfo = {};
                                                    restaurantInfo.id = item.restaurantId;
                                                    restaurantInfo.label = item.restaurantName;
                                                    if(that.isChecked){restaurantInfo.disabled = true;}
                                                    billingunitChild.push(restaurantInfo);
                                                    that.allHallId.push(restaurantInfo.id)
                                                });
                                                billingunitInfo.children = billingunitChild;
                                                companyChild.push(billingunitInfo);
                                            }
                                            if(that.activityAreaId !== ''){
                                                that.getActiveData(that.activityAreaId);
                                            }
                                        })
                                    });
                                    companyInfo.children = companyChild;
                                    that.dataTree.push(companyInfo)
                                }
                            })
                        });
                    }
                });
            },
            getActiveData(id){
                var that = this;
                ip.getActivityAreaById(id,function (res) {
                    if(res.code === 200){
                        that.activeData = res.data;
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            insertActive(formName){
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        var condition = [
                            {
                                name:'module',
                                value:this.module
                            },
                            {
                                name:'subModule',
                                value:this.subModule
                            }
                        ];
                        condition = this.common.joinSearchParam(condition);
                        this.activeData.restaurantId = this.$refs.dataTree.getCheckedKeys();
                        //对传回的id进行筛选
                        var restaurantId = [];
                        this.activeData.restaurantId.forEach((item,index) => {
                            if(typeof item === 'number'){
                                restaurantId.push(item);
                            }
                        });
                        this.activeData.restaurantId = restaurantId;
                        var param = {
                            activityAreaName:this.activeData.activityAreaName,
                            id:this.activeData.id,
                            remark:this.activeData.remark,
                            restaurantId:this.activeData.restaurantId
                        }
                        if(this.activityAreaId !== ''){
                            ip.updateActivityArea(condition,param,function (res) {
                                if(res.code === 200){
                                    that.common.messageUtil({
                                        type:'success',
                                        message:res.data
                                    });
                                    that.cancel();
                                }else{
                                    that.common.messageUtil({
                                        type:'info',
                                        message:res.msg
                                    });
                                }
                            })
                        }else{
                            ip.addActivityArea(condition,param,function (res) {
                                if(res.code === 200){
                                    that.common.messageUtil({
                                        type:'success',
                                        message:res.data
                                    });
                                    that.cancel();
                                }else{
                                    that.common.messageUtil({
                                        type:'info',
                                        message:res.msg
                                    });
                                }
                            })
                        }
                    }else{
                        return false;
                    }
                })
            }
        },
        beforeMount(){
            this.getHallInfo();
        },
        mounted(){
            if(this.$route.query.id){
                this.activityAreaId = this.$route.query.id;
                this.getActiveData(this.activityAreaId);
            }
            if(this.$route.query.detail){
                this.isChecked = true;
            }else{
                this.isChecked = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
</style>