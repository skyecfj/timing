<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent">
                <div class="selectTitle">商品名称</div>
                <el-input size="small" v-model.trim="productName" placeholder="请输入商品名称" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">品牌</div>
                <el-select size="small" v-model="brandId" placeholder="请选择品牌" filterable>
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="item in brandIdOpt" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">是否确认商品类别</div>
                <el-select size="small" v-model="status" placeholder="请选择" >
                    <el-option label="请选择" value=""></el-option>
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">商品类别</div>
                <el-select size="small" v-model="productCategory" placeholder="请选择商品类别" filterable>
                    <el-option label="请选择" value=""></el-option>
                    <el-option v-for="(item,index) in productCategoryOpt" :key="index" :label="item.productCategory" :value="item.productCategory"></el-option>
                </el-select>
            </div>
            <el-button size="small" @click="searchBrand" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
            <el-button size="small" @click="dialogUploadFile = true" class="c-button c-button--primary"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
            <el-button size="small" @click="exportFile" class="c-button c-button--primary"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column prop="productName" label="商品名称"></el-table-column>
                <el-table-column prop="recommendProductCategory" label="系统推荐类别"></el-table-column>
                <el-table-column prop="productCategory" label="用户确认类别"></el-table-column>
                <el-table-column prop="taxRate" label="税率(%)"></el-table-column>
                <el-table-column prop="royalty" label="Royalty"></el-table-column>
                <el-table-column prop="brandName" label="品牌"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间" width="150px"></el-table-column>
                <el-table-column prop="modifiedUser" label="更新人" width="100px"></el-table-column>
                <el-table-column label="操作" width="100px">
                    <template slot-scope="scope">
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row.id,false)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="checkDetail(scope.row.id,true)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
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
        <!--编辑-->
        <el-dialog :visible.sync="tmProductGoodsDialog" class="dialogContent" width="70%">
            <div slot="title">{{tmProductGoodsTitle}}</div>
            <el-form :model="tmProductGoodsForm" label-width="110px" ref="tmProductGoodsForm" :rules="rules">
                <el-form-item label="商品名称" prop="productName">{{tmProductGoodsForm.productName}}</el-form-item>
                <el-form-item label="系统推荐类别" prop="recommendProductCategory">{{tmProductGoodsForm.recommendProductCategory}}</el-form-item>
                <el-form-item label="用户确认类别">
                    <el-select size="small" v-model="tmProductGoodsForm.productCategory" placeholder="请选择确认类别" filterable>
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in productCategoryOpt" :key="index" :label="item.productCategory" :value="item.productCategory"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="税率(%)">
                    <el-select size="small"  v-model="tmProductGoodsForm.taxRate" placeholder="请选择" :disabled="isDisabled" filterable>
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="(item,index) in taxOpt" :key="index" :label="item.taxRateValue" :value="item.taxRateValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Royalty">
                    <el-select size="small"  v-model="tmProductGoodsForm.royalty" placeholder="请选择" :disabled="isDisabled" filterable>
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="item in royaltyOpt" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌">
                    <el-select size="small" v-model="tmProductGoodsForm.brandId" placeholder="请选择品牌" filterable>
                        <el-option label="请选择" :value="null"></el-option>
                        <el-option v-for="item in brandIdOpt" :key="item.brandId" :label="item.brandEnglishName" :value="item.brandId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间" v-if="!isAdd">
                    <el-date-picker v-model="tmProductGoodsForm.modifiedTime" type="datetime" placeholder="" clearable disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新人" v-if="!isAdd">
                    <el-input size="small"  v-model.trim="tmProductGoodsForm.modifiedUser" disabled></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDisabled">
                <el-button size="small"  @click="tmProductGoodsDialog = false" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small"  @click="submitForm('tmProductGoodsForm')" class="c-button c-button--primary">保 存</el-button>
            </div>
        </el-dialog>
        <!--编辑-->

        <!--上传文件-->
        <el-dialog title="上传文件" :visible.sync="dialogUploadFile" class="dialogContent">
            <div class="loadFileContent" v-loading="loadFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent">
                <el-upload :action="url" ref="importCommodity"
                           :file-list="fileList"
                           :on-change="handleChange"
                           :auto-upload="false"
                           :before-upload="beforeFileUpload"
                           :on-remove="removeFile"
                           :on-error="uploadError"
                           :on-success="uploadSuccess"
                            accept=".xlsx">
                    <el-button size="small" class="c-button c-button--primary">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls|xlsx格式文件，且不超过20M</div>
                </el-upload>
                <div slot="footer" class="dialog-footer">
                    <el-button size="small"  @click="dialogUploadFile = false" class="c-button c-button--plain">取 消</el-button>
                    <el-button size="small"  type="primary" @click="importCommodity" class="c-button c-button--primary" :disabled="uploadDisabled">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <!--上传文件-->
    </div>
</template>
<script>
    import api from '../../model/api'
    import tempIp from '../../model/tempIp'
    export default {
        name:'tmProduct',
        data(){
            return {
                dialogUploadFile:false,
                uploadDisabled:true,
                productName:'',
                status: '',
                productCategory:'',
                brandId:'',
                productCategoryOpt:[],
                taxOpt:[],
                brandIdOpt:[],
                royaltyOpt:['是','否'],
                pageSizeList:[25, 50, 75, 100, 125],
                totalRecords:0,
                currentPage: 1,
                pageSize:25,
                brandType:'',
                isAdd:false,
                isDisabled:false,
                tmProductGoodsDialog:false,
                tmProductGoodsTitle:'',
                tmProductGoodsForm:{},
                tableData:[],
                url:tempIp.master_ip+'/tm/product/category/upload',
                loadFile:false,
                isTimeOut:false,
                fileList:[],
                rules:{
                    productCategory:{required: true, message: '请选择用户确认类别', trigger: 'change'},
                    taxRate:{required: true, message: '请选择税率', trigger: 'change'},
                    royalty:{required: true, message: '请选择royalty', trigger: 'change'},
                    brandId:{required: true, message: '请选择品牌', trigger: 'change'},
                }
            }
        },
        beforeMount(){
            this.getSelectObj();
            this.getTmProductGoodsList()
        },
        methods:{
            handleSizeChange(val) {
                this.pageSize = val;
                this.getTmProductGoodsList()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getTmProductGoodsList()
            },
            searchBrand(){
                this.currentPage = 1;
                this.getTmProductGoodsList()
            },
            reset(){
                this.productName = '';
                this.status = '';
                this.productCategory = '';
                this.brandId = ''
            },
            checkDetail(rowId,isEdit){
                var that = this;
                this.isAdd = false;
                this.isDisabled = !isEdit;
                this.tmProductGoodsDialog = true;
                if(this.$refs.tmProductGoodsForm){
                    this.$refs.tmProductGoodsForm.resetFields()
                }
                this.tmProductGoodsTitle = isEdit ? '天猫商城商品-编辑':'天猫商城商品-详情';
                api.getTmProductGoodsById(rowId,function(res){
                    that.tmProductGoodsForm = res.data;
                    that.$refs.tmProductGoodsForm.resetFields()
                })
            },
            submitForm(tmProductGoodsForm){
                var that = this;
                // delete that.tmProductGoodsForm.brandId;
                delete that.tmProductGoodsForm.brandName;
                delete that.tmProductGoodsForm.productName;
                delete that.tmProductGoodsForm.recommendProductCategory;
                delete that.tmProductGoodsForm.createTime;
                delete that.tmProductGoodsForm.createUser;
                delete that.tmProductGoodsForm.modifiedTime;
                delete that.tmProductGoodsForm.modifiedUser;
                this.$refs[tmProductGoodsForm].validate((valid) => {
                    if (valid) {
                        api.updateTmProductGoods(that.tmProductGoodsForm,res => {
                            res.code === 200 ? (that.showTips(res.data,'success') ,that.getTmProductGoodsList(),that.tmProductGoodsDialog = false): that.showTips(res.msg,'warning')
                        })
                    }else {
                        return false
                    }
                });
            },
            getTmProductGoodsList(){
                var that = this;
                var param = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'productName',
                        value:this.productName
                    },
                    {
                        name:'status',
                        value:this.status
                    },
                    {
                        name:'productCategory',
                        value:this.productCategory
                    },
                    {
                        name:'brandId',
                        value:this.brandId
                    }];
                api.getTmProductGoodsList(this.common.joinSearchParam(param),function(res){
                    that.tableData = [];
                    that.totalRecords = 0;
                    if(res.code === 200) {
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }else if(res.code !== 404){
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            getSelectObj(){
                var that = this;
                api.getTmProductGoodsBrand(res => {that.brandIdOpt = res.data});
                api.getTmProductCategoryList('?pageSize=0',res => {that.productCategoryOpt = res.data.list});
                api.getTaxRateList('?pageSize=0',res => {
                    if(res.code === 200){
                        that.taxOpt = res.data.list
                    }else if(res.code === 404){
                        that.taxOpt = []
                    }
                })
            },
            showTips(text,type){
                this.common.messageUtil({
                    message: text,
                    type: type
                });
            },
            exportFile(){
                var param = [{
                    name:'pageIndex',
                    value:this.currentPage
                }, {
                    name:'pageSize',
                    value:this.pageSize
                }, {
                    name:'productName',
                    value:this.productName
                },{
                    name:'status',
                    value:this.status
                }, {
                    name:'productCategory',
                    value:this.productCategory
                }, {
                    name:'brandId',
                    value:this.brandId
                }];
                window.location.href = tempIp.master_ip + '/tm/product/category/download' + this.common.joinSearchParam(param);
            },
            handleChange(file,fileList){
                this.fileList = fileList.slice(-1);
                this.uploadDisabled = this.fileList.length > 0 ? false : true;
                if(file.response || this.isTimeOut){
                    this.fileList = [];
                    this.uploadDisabled = true;
                    this.loadFile = false
                }
            },
            beforeFileUpload(file){
                let Xls = file.name.split('.');
                const isLt20M = file.size / 1024 / 1024 <= 20;
                if(Xls[Xls.length - 1] === 'xls' || Xls[Xls.length - 1] === 'xlsx'){
                    return file
                }else{
                    this.showTips('上传文件只能是 xls/xlsx 格式!','warning');return false
                }
                if(!isLt20M){this.showTips('不能超过20M!','warning');return false}
            },
            removeFile(file,fileList){
                this.fileList = [];
                this.loadFile = false;
                this.uploadDisabled = true
            },
            uploadError(err,file,fileList){
                this.loadFile = false;
                this.isTimeOut  = true;
                this.showTips('请求超时','warning')
            },
            uploadSuccess(response,file,fileList){
                if(response.code === 200){
                    this.$refs.importCommodity.clearFiles();
                    this.dialogUploadFile = false;
                    this.showTips(response.data,'success')
                }else{
                    this.showTips(response.msg,'warning')
                }
            },
            importCommodity(){
                this.loadFile = true;
                this.$refs.importCommodity.submit();
                this.uploadDisabled = true
            }
        }
    }
</script>
<style scoped lang="scss">
    .loadFileContent {
        .dialog-footer {
            text-align: right;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            padding-top: 20px;
        }
    }
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
</style>
