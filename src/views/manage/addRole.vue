<template>
    <div class="view">
        <div class="viewContent">
            <el-form
                    class="roleData"
                    ref="roleData"
                    :model="roleData"
                    label-width="80px">
                <el-form-item label="角色名称">
                    <el-input size="small"  v-model.trim="roleData.roleName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="数据权限">
                    <el-checkbox-group v-model="roleData.auditId" class="margin-top">
                        <el-checkbox :label="1">手工账务审核</el-checkbox>
                        <el-checkbox :label="2">BOH未上传原因审核</el-checkbox>
                        <el-checkbox :label="3">BOH补录审核</el-checkbox>
                        <el-checkbox :label="4">活动主档新增</el-checkbox>
                        <el-checkbox :label="5">活动主档编辑</el-checkbox>
                        <el-checkbox :label="6">活动主档关闭</el-checkbox>
                        <el-checkbox :label="7">活动主档删除</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!--<el-form-item label="活动主档相关权限">-->
                    <!--<el-checkbox-group v-model="roleData.auditActivity">-->
                        <!--<el-checkbox :label="4">手工账务审核</el-checkbox>-->
                        <!--<el-checkbox :label="5">BOH未上传原因审核</el-checkbox>-->
                        <!--<el-checkbox :label="6">BOH补录审核</el-checkbox>-->
                        <!--<el-checkbox :label="7">BOH补录审核</el-checkbox>-->
                    <!--</el-checkbox-group>-->
                <!--</el-form-item>-->
                <el-form-item label="功能权限">
                    <el-tree
                            ref="tree"
                            :data="data2"
                            show-checkbox
                            node-key="permissionId"
                            :default-checked-keys="roleData.permissionId"
                            default-expand-all
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input size="small" type="textarea" v-model.trim="roleData.description" :autosize="{ minRows: 2 }" placeholder="请输入(1-100位)" maxlength="100"></el-input>
                </el-form-item>
                <el-form-item label="更新时间" class="roleDisabled" v-if="roleId !== ''">
                    <el-input size="small"  placeholder="" v-model.trim="roleData.modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" class="roleDisabled" v-if="roleId !== ''">
                    <el-input size="small"  placeholder="" v-model.trim="roleData.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttomButton">
            <el-button size="small"  @click='cancel' class="c-button c-button--plain">取消</el-button>
            <el-button size="small"  @click="insertRole('roleData')" class="c-button c-button--primary">保存</el-button>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    export default {
        name: "addRole",
        data() {
            return {
                roleId: '',
                roleName: '',
                roleData: {auditId:[]},
                treeCheckedKey: [],
                data2: [],
                defaultProps: {
                    children: 'childPermissionInfos',
                    label: 'permissionName'
                },
                rejectId:[]
            }
        },
        methods: {
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            getRoleTree(){
                var that = this;
                ip.showRoleTree(res => {
                    that.data2 = res.data;
                    that.data2.forEach(item1 => {
                        item1.childPermissionInfos.forEach(item2 => {
                            item2.childPermissionInfos.forEach(item3 => {
                                if(item3.childPermissionInfos && item3.childPermissionInfos.length>0){
                                    item3.childPermissionInfos.forEach(item4 => {
                                        if(item4.childPermissionInfos){
                                            that.rejectId.push(item4.permissionId)
                                        }
                                    })
                                }
                            })
                        });
                    });
                    if(that.roleId !== ''){
                        that.getRoleData(that.roleId)
                    }
                })
            },
            getRoleData(roleId){
                var that = this;
                ip.getRoleById(roleId,function (res) {
                    if(res.code === 200){
                        that.roleData = res.data;
                        that.roleName = that.roleData.roleName;
                        if(!that.roleData.auditId || that.roleData.auditId === null){that.$set(that.roleData,'auditId',[])}
                        var permissionId = that.roleData.permissionId;
                        that.roleData.permissionId = [];
                        permissionId.forEach(item => {
                            if(item >= 4000){
                                var isReject = false;
                                that.rejectId.forEach(item1 => {
                                    if(item === item1){isReject = true}
                                });
                                if(!isReject){
                                    that.roleData.permissionId.push(item)
                                }
                            }
                            // that.roleData.permissionId.push(item);
                        })
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                })
            },
            insertRole(formName){
                var that = this;
                this.treeCheckedKey = (that.$refs.tree.getCheckedKeys()).concat(that.$refs.tree.getHalfCheckedKeys());
                // if(this.roleData.auditId.length < 1){this.roleData.auditId = null}
                var param = {
                    description : this.roleData.description,
                    permissionId:this.roleData.permissionId,
                    roleId:this.roleData.roleId,
                    roleName:this.roleData.roleName,
                    auditId:this.roleData.auditId
                };
                if(this.roleData.roleName && this.roleData.roleName.length > 10){
                    this.common.messageUtil({
                        type:'info',
                        message:'角色名称长度要求1~10位'
                    });
                }else{
                    if(this.roleId !== ''){
                        if(this.roleData.roleName !== this.roleName){
                            ip.checkRoleName(this.roleData.roleName,function (res) {
                                if(res.data){
                                    param.permissionId = that.treeCheckedKey
                                    ip.updateRole(param,function (res) {
                                        if(res.code === 200){
                                            that.common.messageUtil({
                                                type:'success',
                                                message:res.data
                                            });
                                            that.cancel();
                                        }else if(res.code === 400){
                                            that.common.messageUtil({
                                                type:'info',
                                                message:res.msg
                                            });
                                        }
                                    })
                                }else{
                                    that.common.messageUtil({
                                        type:'info',
                                        message:'角色名称重复'
                                    });
                                }
                            })
                        }else {
                            param.permissionId = that.treeCheckedKey
                            ip.updateRole(param,function (res) {
                                if(res.code === 200){
                                    that.common.messageUtil({
                                        type:'success',
                                        message:res.data
                                    });
                                    that.cancel();
                                }else if(res.code === 400){
                                    that.common.messageUtil({
                                        type:'info',
                                        message:res.msg
                                    });
                                }
                            })
                        }
                    }else{
                        ip.checkRoleName(this.roleData.roleName,function (res) {
                            if(res.data){
                                param.permissionId = that.treeCheckedKey
                                ip.addRole(param,function (res) {
                                    if(res.code === 200){
                                        that.common.messageUtil({
                                            type:'success',
                                            message:res.data
                                        });
                                        that.cancel();
                                    }else if(res.code === 400){
                                        that.common.messageUtil({
                                            type:'info',
                                            message:res.msg
                                        });
                                    }
                                })
                            }else{
                                that.common.messageUtil({
                                    type:'info',
                                    message:'角色名称重复'
                                });
                            }
                        })
                    }
                }
            }
        },
        beforeMount(){
            this.getRoleTree();
        },
        mounted(){
            if(this.$route.query.roleId){
                this.roleId = this.$route.query.roleId;
                this.getRoleData(this.roleId);
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/manage';
    .margin-top{
        line-height:20px;
    }
    .margin-top /deep/ .el-checkbox {
        margin-right: 20px;
        margin-left: 0;
        width: 30%;
        box-sizing: border-box;
    }

    .margin-top /deep/ .el-checkbox:nth-of-type(3n) {
        margin-right: 0;
    }
</style>