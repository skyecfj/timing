<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
                <div class="selectTitle">YUM卡种类名称</div>
                <el-select size="small" v-model="productTypeName" placeholder="请选择卡种类名称" filterable @change="getProductCodeName">
                    <el-option label="请选择" :value='null'></el-option>
                    <el-option v-for="(item,index) in productTypeNameOpt" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">YUM卡产品名称</div>
                <el-select size="small" v-model="productCodeName" placeholder="请选择卡产品名称" filterable :disabled="!productTypeName">
                    <el-option label="请选择" :value='null'></el-option>
                    <el-option v-for="(item,index) in productCodeNameOpt" :key="index" :label="item" :value="item"></el-option>
                </el-select>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">修改日期</div>
                <el-date-picker size="small" v-model="modifiedTime" value-format="yyyy-MM-dd" type="date" placeholder="请选择修改日期"></el-date-picker>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">是否已映射</div>
                <el-select size="small" v-model="ifBind" placeholder="请选择是否已映射">
                    <el-option label="请选择" :value=null></el-option>
                    <el-option label="Y" value="Y"></el-option>
                    <el-option label="N" value="N"></el-option>
                </el-select>
            </div>
            <el-button size="small" type="success" @click="getCardMapList">查询</el-button>
            <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
            <el-button size="small" type="success" class="c-button" @click="exportFiles"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
            <el-button size="small" type="success" class="c-button" @click="exportMap"><i class="fa fa-download c-button-icon--left"></i>映射数据下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" border>
                <el-table-column prop="productType" label="YUM卡种类名称"></el-table-column>
                <el-table-column prop="productCode" label="YUM卡产品名称"></el-table-column>
                <el-table-column prop="unpCardSystemType" label="UNP卡种类名称"></el-table-column>
                <el-table-column prop="unpCardSystemCode" label="UNP卡产品名称"></el-table-column>
                <el-table-column prop="zhxCardSystemType" label="ZHX卡种类名称"></el-table-column>
                <el-table-column prop="zhxCardSystemCode" label="ZHX卡产品名称"></el-table-column>
                <el-table-column prop="modifiedTime" label="修改日期"></el-table-column>
                <el-table-column prop="" label="操作">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,'detail','cardMapData')"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row,'edit','cardMapData')"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizeList"
                               :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
        <el-dialog class="dialogContent" :title="dialogTitle" :visible.sync="dialogCardMap" width="50%">
            <el-form :model="cardMapData" ref="cardMapData" label-width="120px" :rules="rules">
                <el-form-item label="YUM卡种类">{{cardMapData.productType}}</el-form-item>
                <el-form-item label="YUM卡产品">{{cardMapData.productCode}}</el-form-item>
                <el-form-item label="UNP卡种类" :prop="cardMapData.unpProductType ? 'unpProductType' : ''">
                    <el-select size="small" v-model="cardMapData.unpProductType" placeholder="请选择" @change="(val) => getProductType(val,'UNP')" :disabled="isDetails">
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in unpProductTypeOpt" :key="index" :label="item.productName" :value="item.productType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="UNP卡产品" :prop="cardMapData.unpProductType ? 'unpProductCode' : ''">
                    <el-select size="small" v-model="cardMapData.unpProductCode" placeholder="请选择" :disabled="!cardMapData.unpProductType || isDetails">
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in unpProductCodeOpt" :key="index" :label="item.productName" :value="item.productType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ZHX卡种类" :prop="cardMapData.zhxProductType ? 'zhxProductType' : ''">
                    <el-select size="small" v-model="cardMapData.zhxProductType" placeholder="请选择" @change="(val) => getProductType(val,'ZHX')" :disabled="isDetails">
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in zhxProductTypeOpt" :key="index" :label="item.productName" :value="item.productType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="ZHX卡产品" :prop="cardMapData.zhxProductType ? 'zhxProductCode' : ''">
                    <el-select size="small" v-model="cardMapData.zhxProductCode" placeholder="请选择" :disabled="!cardMapData.zhxProductType || isDetails">
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in zhxProductCodeOpt" :key="index" :label="item.productName" :value="item.productType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input v-model="cardMapData.modifiedTime" size="small" disabled></el-input>
                </el-form-item>
                <el-form-item label="更新人">
                    <el-input v-model="cardMapData.modifiedUser" size="small" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" v-if="!isDetails">
                <el-button size="small" type="success" plain @click='dialogCardMap = false' class="c-button">取消</el-button>
                <el-button size="small" type="success" @click="updateCardMap('cardMapData')" class="c-button">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ip from '@/model/api'

    export default {
        name: 'cardMap',
        data () {
            return {
                tableData: [],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                productTypeName:null,
                productCodeName:null,
                productTypeNameOpt:[],
                productCodeNameOpt:[],
                productTypeCode:{},
                dialogCardMap:false,
                cardMapData:{},
                unpProductTypeOpt:[],
                unpProductCodeOpt:[],
                zhxProductTypeOpt:[],
                zhxProductCodeOpt:[],
                rules:{
                    unpProductType:{ required: true, message: '请选择UNP卡种类', trigger: ['change','blur'] },
                    unpProductCode:{ required: true, message: '请选择UNP卡产品', trigger: ['change','blur'] },
                    zhxProductType:{ required: true, message: '请选择ZHX卡种类', trigger: ['change','blur'] },
                    zhxProductCode:{ required: true, message: '请选择ZHX卡产品', trigger: ['change','blur'] },
                },
                dialogTitle:'',
                isDetails:false,
                modifiedTime:null,
                ifBind:null
            }
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val;
                this.getCardMapList()
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getCardMapList()
            },
            getCardMapList(){
                var that = this;
                var param = [{
                    name:'pageIndex',
                    value:this.currentPage
                },
                {
                    name:'pageSize',
                    value:this.pageSize
                },
                {
                    name:'productTypeName',
                    value:this.productTypeName
                },
                {
                    name:'productCodeName',
                    value:this.productCodeName
                },
                {
                    name:'modifiedTime',
                    value:this.modifiedTime
                },
                {
                    name:'ifBind',
                    value:this.ifBind
                }];
                ip.getCardMapList(this.common.joinSearchParam(param),res => {
                    if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }else{
                        that.tableData = [];
                        that.totalRecords = 0
                    }
                })
            },
            exportFiles(){
                var that = this;
                var param = {
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    productTypeName:this.productTypeName,
                    productCodeName:this.productCodeName,
                    modifiedTime:this.modifiedTime,
                    ifBind:this.ifBind
                };
                ip.exportCardMap(param, 'application/vnd.ms-excel', res => {
                    if (res.code) {
                        that.showTips(res.msg,'error')
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '卡档映射.xlsx';
                        link.target = '_blank';link.click()
                    }
                })
            },
            showTips (text,type) {this.common.messageUtil({message: text, type: type})},
            checkDetail(row,type,formName){
                var that = this;
                this.dialogCardMap = true;
                ip.getCardMapById(row.id,res => {
                    if(res.code === 200){
                        that.cardMapData = res.data;
                        that.$set(that.cardMapData,'unpProductType',res.data.unpCardSystemType);
                        that.$set(that.cardMapData,'unpProductCode',res.data.unpCardSystemCode);
                        that.$set(that.cardMapData,'zhxProductType',res.data.zhxCardSystemType);
                        that.$set(that.cardMapData,'zhxProductCode',res.data.zhxCardSystemCode);
                        that.getSearchCondition();
                        if(that.cardMapData.unpProductType !== null){
                            ip.getZHXUNPCode(that.cardMapData.unpProductType,res => {
                                that.unpProductCodeOpt = res.data
                            })
                        }
                        if(that.cardMapData.zhxProductType !== null){
                            ip.getZHXUNPCode(that.cardMapData.zhxProductType,res => {
                                that.zhxProductCodeOpt = res.data
                            })
                        }
                    }else{
                        that.showTips(res.msg,'info')
                    }
                });
                if(type === 'detail'){
                    this.dialogTitle = '卡档映射 - 详情';
                    this.isDetails = true;
                }else if(type === 'edit'){
                    this.dialogTitle = '卡档映射 - 编辑';
                    this.isDetails = false;
                }
                if(this.$refs[formName] !== undefined){
                    this.$refs[formName].resetFields();
                }
            },
            getSearchCondition(){
                var that = this;
                ip.getCardTypes(res => {that.productTypeNameOpt = res.data});
                ip.getCardCode(res => {that.productTypeCode = res.data});
                ip.getUNPType(res => {that.unpProductTypeOpt = res.data});
                ip.getZHXType(res => {that.zhxProductTypeOpt = res.data});
            },
            updateCardMap(formName){
                var that = this;
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        delete that.cardMapData.modifiedTime;
                        delete that.cardMapData.modifiedUser;
                        ip.updateCardMap(that.cardMapData,res => {
                            res.code === 200 ? (that.showTips(res.data,'success'),that.dialogCardMap = false,that.getCardMapList()) : that.showTips(res.msg,'info')
                        })
                    }else{
                        return false
                    }
                })
            },
            getProductCodeName(val){
                if(!val){
                    this.productCodeName = null;
                }
                this.productCodeNameOpt = this.productTypeCode[val];
            },
            reset(){
                this.productTypeName = null;
                this.productCodeName = null;
                this.modifiedTime = null;
                this.ifBind = null;
            },
            getProductType(val,type){
                var that = this;
                if(!this.cardMapData.unpProductType){this.cardMapData.unpProductCode = null}
                if(!this.cardMapData.zhxProductType){this.cardMapData.zhxProductCode = null}
                if(val !== null){
                    ip.getZHXUNPCode(val,res => {
                        if(type === 'UNP'){
                            that.unpProductCodeOpt = res.data
                        }else if(type === 'ZHX'){
                            that.zhxProductCodeOpt = res.data
                        }
                    })
                }
            },
            exportMap(){
                ip.downloadCardMp('application/vnd.ms-excel',(res)=>{
                    this.common.exportTemplate('ZHX/UNP映射数据.xlsx',res);
                })
            }

        },
        mounted(){
            this.getCardMapList();
            this.getSearchCondition()
        }
    }
</script>

<style>
</style>
