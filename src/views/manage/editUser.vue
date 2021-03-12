<template>
    <div class="view">
        <div class="viewContent">
            <el-form
                    label-position="left"
                    ref="FSCUserData"
                    :model="FSCUserData"
                    label-width="135px">
                <el-form-item
                        label="AD账号或邮箱号"
                        class="viewAD"
                        v-if="isAdd || isCopy"
                        prop="ADorEmail"
                        :rules="[
                             { required: true, message: '请输入AD账号或邮箱号', trigger: 'blur' },
                        ]">
                    <el-input size="small"  placeholder="请输入AD账号或邮箱号" v-model="FSCUserData.ADorEmail" class="cursorPointer" @keyup.enter.native="getPSInfo">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="getPSInfo"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="PS ID">{{FSCUserData.psId}}</el-form-item>
                <el-form-item label="姓名">{{FSCUserData.userName}}</el-form-item>
                <el-form-item label="邮箱">{{FSCUserData.email}}</el-form-item>
                <el-form-item label="AD账号">{{FSCUserData.adAccount}}</el-form-item>
                <el-form-item label="财务市场">{{FSCUserData.financeMarket}}</el-form-item>
                <el-form-item label="部门">{{FSCUserData.department}}</el-form-item>
                <el-form-item label="在职情况">{{FSCUserData.workStatus}}</el-form-item>
                <el-form-item label="状态">
                    <el-switch
                            class="viewSwitch"
                            v-model="FSCUserData.userStatus"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="已启用" :disabled="isCheckEd">
                    </el-switch>
                </el-form-item>
                <el-form-item label="角色" class="viewRole">
                    <el-select v-if="isCheckEd"
                               size="small"
                               v-model="FSCUserData.roleId"
                               multiple
                               placeholder="请输入关键词"
                               @change="getSelectRoleObj"
                               :disabled="isCheckEd">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-else
                               size="small"
                               v-model="FSCUserData.roleId"
                               multiple
                               filterable
                               default-first-option
                               placeholder="请输入关键词"
                               @change="getSelectRoleObj"
                               :disabled="isCheckEd">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="SSO权限">
                    <el-switch
                            v-if="isAdd || isCopy"
                            class="viewSwitch"
                            v-model="FSCUserData.ssoLimit"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="已启用"
                            :disabled="isCheckEd">
                    </el-switch>
                    <el-switch
                            v-else
                            class="viewSwitch"
                            v-model="FSCUserData.ssoLimit"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-text="已启用"
                            :disabled="isCheckEd"
                            @change="updateSSO">
                    </el-switch>
                </el-form-item>
                <el-form-item label="组织架构">
                    <el-tree
                            ref="tree"
                            class="viewAD"
                            :data='data'
                            show-checkbox
                            :check-strictly="true"
                            node-key="departmentId"
                            default-expand-all
                            :props="defaultProps"
                            @check-change="checkChange">
                    </el-tree>
                </el-form-item>
                <el-form-item label="数据权限" class="viewData">
                    <template>
                        <el-row :gutter="20" class="finance">
                            <el-col :span="2" class="market">
                                <el-radio v-model="FSCUserData.marketType" :label="1" @change="toggle" :disabled="isCheckEd">财务市场</el-radio>
                            </el-col>
                            <el-col :span="20" :class="{'viewDataFinanceOn':isOnFinance,'viewDataFinance':!isOnFinance}">
                                <el-row :gutter="20">
                                    <el-col :span="6">财务市场</el-col>
                                    <el-col :span="8">法人公司</el-col>
                                    <!--<el-col :span="6">开票单位</el-col>-->
                                </el-row>
                                <el-row v-for="(list,index) in financeMarket" :key="index" :gutter="20">
                                    <el-col :span="6">
                                        <el-select size="small" ref="market" v-model="list.marketId" placeholder="请选择财务市场" :disabled="isCheckEd || FSCUserData.marketType === 2" filterable>
                                            <el-option :value="null" label="请选择"></el-option>
                                            <el-option v-for="item in market" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-select size="small" ref="company" v-model="list.companyId" placeholder="请选择法人公司" :disabled="isCheckEd || FSCUserData.marketType === 2" filterable @change="companyChange(index)" >
                                            <el-option :value="null" label="请选择"></el-option>
                                            <el-option v-for="item in company" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                                        </el-select>
                                    </el-col>
                                    <!-- <el-col :span="6">
                                        <el-select size="small"  v-model="list.brandId" placeholder="请选品牌" :disabled="isCheckEd" filterable>
                                            <el-option :value="null" label="请选择"></el-option>
                                            <el-option v-for="item in brand" :key="item.id" :label="item.englishName" :value="item.id"></el-option>
                                        </el-select>
                                    <!--</el-col> &ndash;&gt;-->
                                    <!--<el-col :span="6" >-->
                                        <!--<el-select size="small" v-model="list.billingUnitId" placeholder="请选择开票单位" :disabled="isCheckEd" filterable >-->
                                            <!--<el-option :value="null" label="请选择" ></el-option>-->
                                            <!--<el-option v-for="item in billUnitOptList[index].opts" :key="item.id" :label="item.billingUnitName" :value="item.id" ></el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-col>-->
                                    <el-col :span="3" class="marketButton">
                                        <el-button size="small" v-if = "financeMarket.length > 1"  icon="el-icon-minus" circle @click="finDeleteRow(index)" :disabled="isCheckEd"></el-button>
                                        <el-button size="small" v-if = "(index + 1) === financeMarket.length" icon="el-icon-plus" circle @click="finAddRow(index)" :disabled="isCheckEd"></el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" :style="viewNotFirst" class="service" >
                            <el-col :span="2" class="market">
                                <el-radio v-model="FSCUserData.marketType" :label="2" @change="toggle" :disabled="isCheckEd">营运市场</el-radio>
                            </el-col>
                            <el-col :span="20" :class="{'viewDataServiceOn':isOnService,'viewDataService':!isOnService}">
                                <el-row :gutter="20">
                                    <el-col :span="6">营运市场</el-col>
                                </el-row>
                                <el-row :gutter="20" v-for="(list,index) in operateMarket" :key="index">
                                    <el-col :span="6">
                                        <el-select size="small" ref="operate" v-model="list.marketId" placeholder="请选择运营市场" :disabled="isCheckEd || FSCUserData.marketType === 1" filterable>
                                            <el-option :value="null" label="请选择"></el-option>
                                            <el-option v-for="item in operate" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="3" class="marketButton">
                                        <el-button size="small" v-if = "operateMarket.length > 1"  icon="el-icon-minus" circle @click="finDeleteRow(index,true)" :disabled="isCheckEd"></el-button>
                                        <el-button size="small" v-if = "(index + 1) === operateMarket.length" icon="el-icon-plus" circle @click="finAddRow(index,true)" :disabled="isCheckEd"></el-button>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!--<el-row :gutter="20" :style="viewNotFirst" class="custom">-->
                            <!--<el-col :span="2" class="market">-->
                                <!--<el-radio v-model="FSCUserData.marketType" :label="3" @change="toggle" :disabled="isCheckEd">自定义区域</el-radio>-->
                            <!--</el-col>-->
                            <!--<el-col :span="20" :class="{'viewDataCustomOn':isOnCustom,'viewDataCustom':!isOnCustom}">-->
                                <!--<el-row :gutter="20">-->
                                    <!--<el-col :span="6">自定义区域</el-col>-->
                                <!--</el-row>-->
                                <!--<el-row :gutter="20">-->
                                    <!--<el-col :span="6">-->
                                        <!--<el-select size="small"  v-model="customizeMarket[0].marketId" placeholder="请选择自定义区域" :disabled="isCheckEd" filterable>-->
                                            <!--<el-option :value="null" label="请选择"></el-option>-->
                                            <!--<el-option v-for="item in customize" :key="item.id" :label="item.customizeActivityAreaName" :value="item.id"></el-option>-->
                                        <!--</el-select>-->
                                    <!--</el-col>-->
                                <!--</el-row>-->
                            <!--</el-col>-->
                        <!--</el-row>-->
                    </template>
                </el-form-item>
                <el-form-item label="更新时间" class="userDisabled" v-if="userId !== '' && !copy">
                    <el-input size="small"  placeholder="" v-model="FSCUserData.modifiedTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人" class="userDisabled" v-if="userId !== '' && !copy">
                    <el-input size="small"  placeholder="" v-model="FSCUserData.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="buttomButton" v-if="!isCheckEd">
            <el-button size="small"  @click="cancel" class="c-button c-button--plain">取消</el-button>
            <el-button size="small"  @click="updateFSCUser('FSCUserData')" class="c-button c-button--primary">保存</el-button>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    const market ={
        billingUnitId: null,
        companyId: null,
        marketId: null
    };
    export default  {
        name: "editUser",
        props:['isAdd','isCheckEd','isCopy'],
        data() {
            return {
                userId:'',
                copy:false,
                FSCUserData: {
                    ssoLimit: true,
                    userStatus: true,
                    roleId: [],
                    marketType: 1
                },
                viewNotFirst: {
                    position: 'relative',
                    left: '10px'
                },
                market: [],
                company: [],
                brand: [],
                operate: [],
                customize: [],
                roles: [],
                lists: [Object.assign({},market)],
                isOnFinance: true,
                isOnService: false,
                isOnCustom: false,
                financeMarket:[Object.assign({},market)],
                operateMarket:[Object.assign({},market)],
                customizeMarket:[Object.assign({},market)],
                // billUnitOptList:[{
                //     opts : []
                // }],
                data:[],
                defaultProps:{
                    children:'childInfos',
                    label:'departmentName'
                },
                selectedKey:'',
                selectedName:'',
                organizationObj:[],
                selectedRoleId:[],
                ADorEmail:''
            }
        },
        methods: {
            cancel(){
                this.common.deleteTag(this.$route,this);
            },
            toggle(label) {
                if(label == 1){
                    this.isOnFinance = true;
                    this.isOnService = false;
                    this.isOnCustom = false;
                }else if(label == 2){
                    this.isOnFinance = false;
                    this.isOnService = true;
                    this.isOnCustom = false;
                }else if(label == 3){
                    this.isOnFinance = false;
                    this.isOnService = false;
                    this.isOnCustom = true;
                }
            },
            finAddRow(index,flag){
                if(flag){
                    this.operateMarket.push(Object.assign({},market));
                }else{
                    this.financeMarket.push(Object.assign({},market));
                }
                // this.billUnitOptList.push({
                //     opts : []
                // });
            },
            finDeleteRow(index,flag){
                if(flag){
                    this.operateMarket.splice(index,1);
                    // this.billUnitOptList.splice(index,1);
                }else{
                    this.financeMarket.splice(index,1);
                    // this.billUnitOptList.splice(index,1);
                }
            },
            getSearchCondition(){
                var that = this;
                ip.getBrandEnglishNames('?flag=4',res => {that.brand = res.data});
                ip.getFinanceMarketIdNames('',res => {that.market = res.data});
                ip.getOperateMarketIdNames('',res => {that.operate = res.data});
                ip.getAllCompanyIdNames('',res => {that.company = res.data.list});
                ip.getCustomizeAreaList('?pageSize=0',res => {that.customize = res.data.list});
                ip.getRoleIdNames(res => {that.roles = res.data})
            },
            companyChange(index){
                let _self = this;
                let param = this.common.formatPathParam({
                    companyCode : _self.financeMarket[index].companyId
                })
                this.billUnitOptList[index].opts = [];
                if(_self.financeMarket[index].companyId){
                    ip.getBillUnitsByCompanyCode(param,function(res){
                        if(res.code === 200){
                            _self.billUnitOptList[index].opts = res.data.concat();
                        }else{
                            _self.billUnitOptList[index].opts = [];
                        }
                    })
                }
            },
            getRoleData(userId){
                var that = this;
                ip.getFSCById(userId,function (res) {
                    if(res.code === 200){
                        that.FSCUserData = res.data;
                        that.FSCUserData.psId = res.data.userNumber;
                        //若数据权限没数据，则默认一行
                        if(Object.prototype.toString.call(that.FSCUserData.dataAuthorities) !== '[object Array]' || that.FSCUserData.dataAuthorities[0] === null){
                            that.FSCUserData.dataAuthorities = that.lists;
                        }
                        //兼容角色&筛选已存在的角色
                        if(that.FSCUserData.roleId === null){
                            that.FSCUserData.roleId = [];
                        }
                        //转换用户状态和SSO权限
                        if(that.FSCUserData.userStatus === 1){
                            that.FSCUserData.userStatus = true;
                        }else if(that.FSCUserData.userStatus === 0){
                            that.FSCUserData.userStatus = false;
                        }
                        if(that.FSCUserData.ssoLimit === 1){
                            that.FSCUserData.ssoLimit = true;
                        }else if(that.FSCUserData.ssoLimit === 0){
                            that.FSCUserData.ssoLimit = false;
                        }
                        //根据marketType判断市场类型
                        if(that.FSCUserData.marketType === 1){
                            that.$set(that,'financeMarket',res.data.dataAuthorities);
                            that.$nextTick(function(){
                                that.getBillUnitsOpts();
                            });
                        }else if(that.FSCUserData.marketType === 2){
                            that.$set(that,'operateMarket',that.FSCUserData.dataAuthorities);
                        }else if(that.FSCUserData.marketType === 3){
                            that.$set(that,'customizeMarket',that.FSCUserData.dataAuthorities);
                        }
                        //调整组织结构
                        if(that.FSCUserData.organization){
                            that.handleOrganization(that.FSCUserData.organization);
                        }else{
                            that.$refs.tree.setCheckedKeys([]);
                        }
                        //复制用户数据
                        if(that.$route.query.copy){
                            var copyObj = {};
                            copyObj.roleId = that.FSCUserData.roleId;
                            copyObj.organization = that.FSCUserData.organization;
                            copyObj.marketType = that.FSCUserData.marketType;
                            copyObj.dataAuthorities = that.FSCUserData.dataAuthorities;
                            copyObj.ssoLimit = true;
                            copyObj.userStatus = true;
                            that.FSCUserData = copyObj;
                        }
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message:res.msg
                        })
                    }
                });
            },
            getBillUnitsOpts(){
                let _self = this;
                this.billUnitOptList = [];
                this.financeMarket.forEach(function(item,index){
                    let param = _self.common.formatPathParam({
                        companyCode : item.companyId
                    })
                    ip.getBillUnitsByCompanyCode(param,function(res){
                        if(res.code === 200){
                            let tempOpts = res.data.concat();
                            _self.billUnitOptList.push({
                                opts : tempOpts
                            })
                        }else{
                            _self.billUnitOptList.push({
                                opts : []
                            })
                        }
                    })
                })
            },
            updateFSCUser(formName){
                var that = this;
                //转换用户状态和SSO权限
                if(this.FSCUserData.userStatus === true){
                    this.FSCUserData.userStatus = 1;
                }else if(this.FSCUserData.userStatus === false){
                    this.FSCUserData.userStatus = 0;
                }
                if(this.FSCUserData.ssoLimit === true){
                    this.FSCUserData.ssoLimit = 1;
                }else if(this.FSCUserData.ssoLimit === false){
                    this.FSCUserData.ssoLimit = 0;
                }
                //根据marketType判断市场类型
                if(this.FSCUserData.marketType === 1){
                    this.FSCUserData.dataAuthorities = this.financeMarket;
                }else if(this.FSCUserData.marketType === 2){
                    this.FSCUserData.dataAuthorities = this.operateMarket;
                }else if(this.FSCUserData.marketType === 3){
                    this.FSCUserData.dataAuthorities = this.customizeMarket;
                }

                //拼接组织架构的字符串
                if(this.$refs.tree.getCheckedNodes()[0]){
                    var childNodeName = this.$refs.tree.getCheckedNodes()[0].departmentName;
                    var parentId = this.$refs.tree.getCheckedNodes()[0].parentId;
                    var organization = '/' + childNodeName;
                    while(parentId){
                        var parentNode = this.$refs.tree.getNode(parentId);
                        parentId = parentNode.data.parentId;
                        organization = '/' + parentNode.data.departmentName + organization;
                    }
                    this.FSCUserData.organization = organization.slice(1);
                }else{
                    this.FSCUserData.organization = null
                }

                var param = {
                    adAccount:this.FSCUserData.adAccount,
                    dataAuthorities:this.FSCUserData.dataAuthorities,
                    email:this.FSCUserData.email,
                    financeMarket:this.FSCUserData.financeMarket,
                    marketType:this.FSCUserData.marketType,
                    ssoLimit:this.FSCUserData.ssoLimit,
                    userId:this.FSCUserData.userId,
                    userName:this.FSCUserData.userName,
                    userNumber:this.FSCUserData.psId,
                    psId:this.FSCUserData.psId,
                    userStatus:this.FSCUserData.userStatus,
                    department:this.FSCUserData.department,
                    organization:this.FSCUserData.organization,
                    workStatus:this.FSCUserData.workStatus,
                    organizationId:this.$refs.tree.getCheckedKeys()[0]
                };
                if(this.$route.query.userId && !this.$route.query.copy) {
                    param.roleId = this.FSCUserData.roleId
                }else{
                    param.roles = this.FSCUserData.roleId
                }

                this.$refs[formName].validate((valid) => {
                    if(valid){
                        if(this.$route.query.userId && !this.$route.query.copy){
                            this.FSCUserData.userName = '';
                            ip.updateFSC(param,function (res) {
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
                            });
                        }else{
                            ip.adAccountCheck(that.FSCUserData.adAccount,res => {
                                if(res.data){
                                    ip.getPSbyAD(that.FSCUserData.adAccount,res => {
                                        if(res.code === 200){
                                            if(that.FSCUserData.userName){
                                                ip.insertFSC(param,function (res) {
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
                                                that.common.messageUtil({
                                                    type: 'info',
                                                    message: '请先由AD账号获得相应信息'
                                                });
                                            }
                                        }else{
                                            that.common.messageUtil({
                                                type: 'info',
                                                message: res.msg
                                            });
                                        }
                                    })
                                }else{
                                    that.common.messageUtil({
                                        type: 'info',
                                        message: '此AD号已被添加'
                                    });
                                }
                            })
                        }
                    }else{
                        return false
                    }
                })
            },
            getSelectRoleObj(obj){
                this.FSCUserData.roleId = obj;
            },
            getPSInfo(){
                var that = this;
                var FSCUserDataInit = {
                    marketType:1,
                    roleId:[],
                    ssoLimit:true,
                    userStatus:true
                };
                ip.adAccountCheck(this.FSCUserData.ADorEmail,function (res) {
                    if(res.data){
                        ip.emailCheck(that.FSCUserData.ADorEmail,function (res) {
                            if(res.data){
                                ip.getPSbyAD(that.FSCUserData.ADorEmail,function (res) {
                                    if(res.code === 200){
                                        that.$set(that.FSCUserData,'adAccount',res.data.adAccount);
                                        that.$set(that.FSCUserData,'department',res.data.department);
                                        that.$set(that.FSCUserData,'email',res.data.email);
                                        that.$set(that.FSCUserData,'financeMarket',res.data.financeMarket);
                                        that.$set(that.FSCUserData,'psId',res.data.psId);
                                        that.$set(that.FSCUserData,'userName',res.data.userName);
                                        that.$set(that.FSCUserData,'workStatus',res.data.workStatus);
                                        //处理组织架构
                                        if(res.data.organization){
                                            that.handleOrganization(res.data.organization);
                                        }else{
                                            that.$refs.tree.setCheckedKeys([]);
                                        }
                                    }else if(res.code === 404){
                                        that.common.messageUtil({
                                            type: 'info',
                                            message: res.msg
                                        });
                                    }
                                });
                            }else{
                                that.FSCUserData = FSCUserDataInit;
                                that.common.messageUtil({
                                    type: 'info',
                                    message: '邮箱号重复'
                                });
                            }
                        })
                    }else{
                        that.FSCUserData = FSCUserDataInit;
                        that.common.messageUtil({
                            type: 'info',
                            message: 'AD账号已被添加'
                        });
                    }
                });
            },
            getTreeInfo(){
                var that = this;
                ip.getDepartmentlist(res => {
                    that.data = res.data;
                })
            },
            checkChange(data, checked, indeterminate) {
                if( checked === true ){ //点击未选中的复选框
                    this.editCheckId = data.departmentId;
                    this.$refs.tree.setCheckedKeys([data.departmentId]);
                }else{
                    if( this.editCheckId === data.departmentId ){ //点击已选中复选框，保证至少选中一个
                        this.$refs.tree.setCheckedKeys([]);
                    }
                }
            },
            handleOrganization(param){
                if(param){
                    var _self = this;
                    param.split("/").forEach(item => {
                        _self.selectedName = item;
                    });
                    _self.data.forEach(item => {
                        if(item.childInfos){
                            item.childInfos.forEach(item1 => {
                                if(item1.childInfos){
                                    item1.childInfos.forEach(item2 => {
                                        if(item2.childInfos){
                                            item2.childInfos.forEach(item3 => {
                                                if(item3.childInfos){
                                                    item3.childInfos.forEach(item4 => {
                                                        if(item4.childInfos){
                                                            item4.childInfos.forEach(item5 => {
                                                                _self.organizationObj.push({id:item5.departmentId,label:item5.departmentName});
                                                            })
                                                        }
                                                        _self.organizationObj.push({id:item4.departmentId,label:item4.departmentName});
                                                    })
                                                }
                                                _self.organizationObj.push({id:item3.departmentId,label:item3.departmentName});
                                            })
                                        }
                                        _self.organizationObj.push({id:item2.departmentId,label:item2.departmentName});
                                    })
                                }
                                _self.organizationObj.push({id:item1.departmentId,label:item1.departmentName});
                            })
                        }
                        _self.organizationObj.push({id:item.departmentId,label:item.departmentName});
                    });
                    _self.organizationObj.forEach(item => {
                        if(item.label === _self.selectedName){
                            _self.selectedKey = item.id;
                        }
                    });
                    _self.$refs.tree.setCheckedKeys([_self.selectedKey])
                }else{
                    _self.$refs.tree.setCheckedKeys([])
                }
            },
            updateSSO(val){
                var that = this;
                var param = {
                    ssoLimit:val,
                    adAccount:this.FSCUserData.adAccount
                };
                ip.updateSSOLimit(param,res =>{
                    if(res.code === 200){
                        res.data.ssoLimitChange === 0 ? that.FSCUserData.ssoLimit = false : that.FSCUserData.ssoLimit = true;
                        that.common.messageUtil({
                            type:'success',
                            message: res.data.msg
                        })
                    }else{
                        that.common.messageUtil({
                            type:'info',
                            message: res.msg
                        })
                    }
                })
            },
        },
        beforeMount(){
            this.getSearchCondition();
            this.getTreeInfo();
        },
        mounted() {
            if(this.$route.query.userId || this.$route.query.userId === 0){
                this.userId = this.$route.query.userId;
                this.getRoleData(this.userId);
            }
            if(this.$route.query.copy){this.copy = this.$route.query.copy}
        },
        beforeUpdate(){
            this.toggle(this.FSCUserData.marketType);
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'userMgr';
            next();
        },
    }
</script>

<style lang="scss">
    @import '../../assets/scss/manage';
    .viewSwitch{
        margin-left: 0;
        margin-right: 0;
        .el-switch__label.el-switch__label--right {
            position: relative;
            left: 0;
            span{
                color:#2AAF37;
            }
        }
    }
    .viewData{
        .el-radio__input.is-checked .el-radio__inner{
            border-color: #67c23a;
            background: #67c23a;
        }
        .el-radio__input.is-checked+.el-radio__label{
            color: #67c23a;
        }
    }
</style>
