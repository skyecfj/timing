<template>
    <div class="hall">
        <div class="viewHeader">
            <el-row :gutter="20">
                <el-col :span="4"><div>餐厅编号</div></el-col>
                <el-col :span="4"><div>餐厅名称</div></el-col>
                <el-col :span="4"><div>品牌</div></el-col>
                <el-col :span="4"><div>营运市场</div></el-col>
                <el-col :span="4"><div>财务市场</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-select ref="storeHypId" size="small" v-model="storeHypId" placeholder="请选择" remote reserve-keyword :remote-method="remoteStoreHypId" filterable v-scroll="scrollStoreHypId">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="(item,index) in storeHypIdOpt" :key="index" :label="item.storeHypId" :value="item.storeHypId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select ref="storeName" size="small" v-model="storeName" placeholder="请选择" remote reserve-keyword :remote-method="remoteStoreName" filterable v-scroll="scrollStoreName">
                        <el-option label="请选择" value=""></el-option>
                        <el-option v-for="(item,index) in storeNameOpt" :key="index" :label="item.storeName" :value="item.storeName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="small" ref="brand" v-model="brand" placeholder="请选择" filterable>
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in brandOpt" :key="index" :label="item.brandEnglishName" :value="item.brandEnglishName"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  v-model="operateMarket" placeholder="请选择营运市场"  filterable >
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in operateMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="4">
                    <el-select size="small"  v-model="financialMarket" placeholder="请选择财务市场"  filterable >
                        <el-option value="" label="请选择"></el-option>
                        <el-option v-for="(item,index) in financialMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
                    </el-select>
                </el-col>

            </el-row>
            <el-row class="btn-area">
                <el-col :span="8">
                    <el-button size="small" type="success" @click="getHallList" class="c-button">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                    <el-button size="small" type="success" plain @click="download" class="c-button">日志导出</el-button>
                    <el-button size="small" type="success" @click="importFiles" class="c-button">
                        <i class="fa fa-upload c-button-icon--left"></i>变更存行频率</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewButton">
                <el-button size="small"  type="success" @click="selectTemplateTypeDialog = true" class="c-button"><i class="fa fa-download c-button-icon--left"></i>下载模板</el-button>
            </div>
            <el-table :data="tableData" border>
                <el-table-column prop="storeHypId" label="餐厅编号"></el-table-column>
                <el-table-column prop="storeName" label="餐厅名称"></el-table-column>
                <el-table-column prop="brand" label="品牌"></el-table-column>
                <el-table-column prop="ownerShip" label="拥有方式"></el-table-column>
                <el-table-column prop="financialMarket" label="财务市场"></el-table-column>
                <el-table-column prop="billingUnitName" label="开票单位"></el-table-column>
                <el-table-column prop="operateMarket" label="营运市场"></el-table-column>
                <el-table-column prop="status" label="营业状态"></el-table-column>
                <el-table-column prop="operate" label="操作" width="140">
                    <template slot-scope="scope">
                        <el-tooltip content="变更详情" placement="top" effect="light" popper-class="table-cell-toolTip" slot="reference" >
                            <el-button size="small"  class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkLog(scope.row.id)"><i class="fa fa-info-circle"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="详情" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="checkDetail(scope.row)"><i class="fa fa-file-alt"></i></el-button>
                        </el-tooltip>
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small" class="c-button-icon--primary--opacity c-button-icon-circle" @click="hallUpdate(scope.$index,scope.row)"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
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
        <!-- 下载 -->
        <el-dialog title="模板类型" :visible.sync="selectTemplateTypeDialog">
            <el-radio-group v-model="templateType">
                <el-radio :label="1">固定天数</el-radio>
                <el-radio :label="2">固定星期几</el-radio>
            </el-radio-group>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" type="success" class="c-button" plain @click="selectTemplateTypeDialog = false">取 消</el-button>
                <el-button size="small" type="success" class="c-button"  @click="downloadTemplate">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 下载 -->
        <!-- 上传 -->
        <el-dialog title="批量变更存行频率" :visible.sync="uploadFilesDialog" width="75%" >
            <el-row :gutter="24">
                <el-col :span="12" style="border-right:1px solid #ccc">
                    <el-container >
                        <el-header>
                            <el-select v-model="leftDialog.type" size="small" style="width:34%"
                                       @change="(res)=>{
                                       if(res>1){
                                           leftDialog.storageFrequencyType =null;
                                           leftDialog.storageFrequency=null;
                                       }else if(res === 0){
                                          leftDialog.storageFrequencyType = 1;
                                       }else if (res === 1){
                                         leftDialog.storageFrequencyType = 2;
                                       }else {
                                         leftDialog.storageFrequencyType = null;
                                       }
                                       }">  <!---选择押运公司或者房东代收 存行频率类型 为null-->
                                <el-option :value="null" label="请选择"></el-option>
                                <el-option v-for="(value,key,index) in {'自行存行-固定天数':0,'自行存行固定星期几':1,'押运公司':2,'房东代收':3}"
                                           :value="value" :label="key" :key="index"></el-option>
                            </el-select>
                            <el-select v-model="leftDialog.storageFrequency" size="small" style="width:16%"
                                       placeholder="天数" v-if="leftDialog.type === 0"
                                       >  <!---选择自行存行-固定天数 存行频率类型 为1-->
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(value,index) in 20" :value="value" :label="value"
                                           :key="index"></el-option>
                            </el-select>
                            <el-select v-model="leftDialog.storageFrequency" size="small" style="width:16%"
                                       placeholder="星期几" v-if="leftDialog.type === 1">
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(value,index) in 7" :value="value"
                                           :label="`星期${' 一二三四五六日'.charAt(value)}`" :key="index"></el-option>
                            </el-select>
                            <el-select v-model="leftDialog.brand" size="small" style="width:22%" placeholder="品牌">
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(value,index) in brandList" :value="value.brandEnglishName" :label="value.brandEnglishName" :key="index"></el-option>
                            </el-select>
                            <el-input size="small" clearable v-model="leftDialog.storeHypId" placeholder="请输入餐厅编号" style="width:24%"></el-input>
                            <el-button icon="el-icon-search" circle  type="success" size="small" class="search-btn" @click="getStoreTree"></el-button>
                        </el-header>
                        <el-main style="padding-top:20px;max-height:600px">
                            <el-scrollbar class="basicActiveRangeContent">
                                        <!--:data="companyData"-->
                                <el-tree
                                        :props="companyProps"
                                        node-key="id"
                                        show-checkbox
                                        ref="storeCodeTree"
                                        :default-expand-all="false"
                                        :lazy="true"
                                        :load="loadMore"
                                        :key="treeKey"
                                        @check="getSelectedCompanyKeys">
                                    <!--  :filter-node-method="filterCompanyNode"-->
                                </el-tree>
                            </el-scrollbar>
                        </el-main>
                    </el-container>
                </el-col>
                <el-col :span="12">
                    <el-container>
                        <el-header>
                            存行类型
                        </el-header>
                        <el-main>
                            <el-radio-group v-model="rightType"
                                            @change="(res)=>{if(res === 0){dialogObj.storageFrequencyType = 1}else if(res === 1){dialogObj.storageFrequencyType = 2;dialogObj.weekendStorage = 1}}">
                                <el-radio :label="0">
                                    <span>自行存行-固定天数</span>
                                    <div v-if="rightType === 0" class="fix-block">
                                        <p>间隔天数 <el-input size="small" style="width:100px" placeholder="请输入天数" v-model="dialogObj.storageFrequency"></el-input></p>
                                        <p>周末存行   <el-radio-group v-model="dialogObj.weekendStorageDate">
                                            <el-radio :label="1">周六不存行</el-radio>
                                            <el-radio :label="2">周日不存行</el-radio>
                                            <el-radio :label="3">全部不存行</el-radio>
                                            <el-radio :label="null">空</el-radio>
                                        </el-radio-group></p>
                                        <p>节假日存行   <el-radio-group v-model="dialogObj.holidayStorage">
                                            <el-radio :label="1">是</el-radio>
                                            <el-radio :label="0">否</el-radio>
                                        </el-radio-group></p>
                                        <p>生效日期   <el-date-picker
                                                type="date"
                                                v-model="dialogObj.depositStartDate"
                                                range-separator="-"
                                                value-format="yyyy-MM-dd"
                                                size="small"
                                                @change="getDate"
                                                :pickerOptions="{
                                                    disabledDate(time) {
                                                    return time.getTime() < Date.now()- 8.64e7;}
                                              }"
                                        >
                                        </el-date-picker></p>
                                    </div>
                                 </el-radio>
                                <br>
                                <el-radio :label="1">
                                    <span>自行存行-固定星期几</span>
                                    <div v-if="rightType === 1" class="fix-block">
                                        <p>间隔周数
                                            <el-select size="small" style="width:100px" placeholder="请选择间隔周数" v-model="dialogObj.weekendStorageDate">
                                                <el-option v-for="item in 4" :value="item" :label="`间隔${' 一二三四'.charAt(item)}周`" :key="item"></el-option>
                                            </el-select>
                                            <br>
                                            <br>
                                            <el-checkbox-group v-model="dialogObj.checkList" :max="2" :min="1">
                                                <el-checkbox v-for="item in 7 " :label="item" :key="item">星期{{' 一二三四五六日'.charAt(item)}}</el-checkbox>
                                            </el-checkbox-group>
                                        </p>
                                       <p>节假日存行   <el-radio-group v-model="dialogObj.holidayStorage">
                                                            <el-radio :label="1">是</el-radio>
                                                            <el-radio :label="0">否</el-radio>
                                                       </el-radio-group>
                                        </p>
                                        <p>生效日期   <el-date-picker
                                                        type="date"
                                                        v-model="dialogObj.depositStartDate"
                                                        range-separator="-"
                                                        value-format="yyyy-MM-dd"
                                                        size="small"
                                                        :pickerOptions="{
                                                        disabledDate(time) {
                                                        return time.getTime() < Date.now()- 8.64e7;}
                                                     }"
                                                        >
                                        </el-date-picker></p>
                                    </div>
                                </el-radio>
                                <br>
                                <el-radio :label="2">押运公司</el-radio>
                                <br>
                                <el-radio :label="3">房东代收</el-radio>
                            </el-radio-group>
                        </el-main>
                    </el-container>
                </el-col>
            </el-row>
            <div slot="footer">
                <el-button size="small" type="success" class="c-button" plain @click="uploadFilesDialog = false">取 消</el-button>
                <el-button size="small" type="success" class="c-button"  @click="saveStorage">保 存</el-button>
            </div>
            <!--<el-radio-group v-model="uploadFilesType">-->
                <!--<el-radio :label="1">固定天数</el-radio>-->
                <!--<el-radio :label="2">固定星期几</el-radio>-->
            <!--</el-radio-group><br><br>-->
            <!--<el-upload-->
                    <!--ref="uploadFiles"-->
                    <!--:action="'/fsc/masterdata/store-master/uploadFile?type='+uploadFilesType"-->
                    <!--:before-upload="beforeFileUpload"-->
                    <!--:on-success ="uploadSucceed"-->
                    <!--:auto-upload="false"-->
                    <!--multiple-->
                    <!--:file-list="fileList">-->
                <!--<el-button size="small" type="success">点击上传</el-button><br>-->
                <!--<div slot="tip" class="el-upload__tip">只能上传xlsx格式文件<span class="delete">(请按照模板的格式上传文件)</span></div>-->
            <!--</el-upload>-->
            <!--<el-button size="small" type="success" class="c-button" @click="uploadFiles">确 定</el-button>-->
        </el-dialog>
        <!-- 上传 -->
        <!-- 变更详情 -->
        <el-dialog :visible.sync="hallLogDialog" width="70%" title="变更详情">
            <el-table :data="logDetailData" border>
                <el-table-column prop="fieldName" label="更新字段" min-width="60px"></el-table-column>
                <el-table-column prop="startValue" label="原值" min-width="60px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.startValue === 'true'">是</span>
                        <span v-else-if="scope.row.startValue === 'false'">否</span>
                        <span v-else>{{scope.row.startValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="updateValue" label="更新值" min-width="80px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.updateValue === 'true'">是</span>
                        <span v-else-if="scope.row.updateValue === 'false'">否</span>
                        <span v-else>{{scope.row.updateValue}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="modifiedUser" label="更新人员" min-width="50px"></el-table-column>
                <el-table-column prop="modifiedTime" label="更新时间" min-width="50px"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        @size-change="handleLogSizeChange"
                        @current-change="handleLogCurrentChange"
                        :current-page.sync="currentLogPage"
                        :page-size="pageLogSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalLogRecords"
                        :page-sizes="pageSizesList">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 变更详情 -->
    </div>
</template>

<script>
    import ip from '../../model/api'
    import api from '../../model/apidr'
    import tempIp from '../../model/tempIp'
    import scroll from '@/directives/index'
    const dialogSaveObj = {
        weekendStorageDate:1,
        holidayStorage:1,
        depositStartDate:'',
        checkList:[1],
        weekendStorage:0,
        storageFrequency:'1',
        storeCodes:[],
        storageFrequencyType:1
    }
    const leftDialogConst = {
        type:0,
        storageType:1,
        storageFrequency:'',
        storageFrequencyType:1,
        brand:'',
        storeHypId:'',
    }
    export default {
        name: "hall",
        directives: { scroll },//引入 滚动指令
        data() {
            return {
                pageSizesList: [25, 50, 75, 100, 125],
                currentPage: 1,
                pageSize: 25,
                tableData: [],
                totalRecords: 0,
                //变更详情
                currentLogPage: 1,
                pageLogSize: 25,
                logDetailData: [],
                totalLogRecords: 0,

                module:'主档管理',
                submodule:'餐厅主档',

                loadingStoreHypId:false,
                loadingStoreName:false,
                storeHypId:'',
                storeName:'',
                brand:'',
                storeHypIdOpt:[],
                storeNameOpt:[],
                brandOpt:[{value:'',label:'请选择'}],
                //模板下载
                selectTemplateTypeDialog:false,
                templateType:1,
                //账单上传
                uploadFilesDialog:false,
                // uploadFilesType:1,
                fileList:[],
                //变更详情
                hallLogDialog:false,
                hallId:'',

                //分页查询
                selectIndex:1,
                StoreHypIdSize:10,
                StoreNameSize:10,
                operateMarkets:[],
                financialMarkets:[],
                financialMarket:'',
                operateMarket:'',

                leftDialog:Object.assign({},leftDialogConst),
                rightType:0,
                dialogObj:Object.assign({},dialogSaveObj),
                brandList:[],
                companyData:[],
                storeLevel1:[],
                storeLevel2:[],
                companyProps: {children:'children',label:'name',isLeaf: 'leaf'},
                selectCompanyKey:[],
                treeKey:'',
                resolve:{},
                node:{},
                firstCallback:true

            }
        },
        // watch: {
        //     // filterBillUnitText(val) {this.$refs.billUnit.filter(val)},
        //     'leftDialog.storeHypId' (val) {
        //         this.$refs.storeCodeTree.filter(val)
        //     },
        // },
        methods: {
            handleSizeChange(size) {
                this.pageSize = size;
                this.getHallList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getHallList();
            },
            /* 变更详情*/
            handleLogSizeChange(size){
                this.pageLogSize = size;
                this.getHallLogList()
            },
            handleLogCurrentChange(currentPage){
                this.currentLogPage = currentPage;
                this.getHallLogList()
            },
            checkDetail(rows){
                this.$router.push({name:'hallDetails',query:{id:rows.id,detail:true},params:{parentRoute:this.$route.fullPath}});
            },
            hallUpdate(index,rows){
                this.$router.push({name:'hallEdit',query:{id:rows.id},params:{parentRoute:this.$route.fullPath}})
            },
            scrollStoreHypId(param){
                let that = this;
                let storeHypId = '';
                this.$refs.storeHypId.$children[0].currentValue === '请选择' ? storeHypId = '' : storeHypId = this.$refs.storeHypId.$children[0].currentValue;
                if(param){
                    this.StoreHypIdSize += 10;
                    ip.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreHypIdSize,storeHypId:storeHypId},res => {that.storeHypIdOpt = res.data})
                }
            },
            scrollStoreName(param){
                let that = this;
                let storeName = '';
                this.$refs.storeName.$children[0].currentValue === '请选择' ? storeName = '' : storeName = this.$refs.storeName.$children[0].currentValue;
                if(param){
                    this.StoreNameSize += 10;
                    ip.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreNameSize,storeName:storeName},res => {that.storeNameOpt = res.data})
                }
            },
            remoteStoreHypId(val){
                let that = this;
                ip.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreHypIdSize,storeHypId:val},res => {that.storeHypIdOpt = res.data})
            },
            remoteStoreName(val){
                let that = this;
                ip.getSelectSearchCondition({pageIndex:this.selectIndex,pageSize:this.StoreNameSize,storeName:val},res => {that.storeNameOpt = res.data})
            },
            getSearchCondition(){
                var that = this;
                ip.getBrandList('',res => {that.brandOpt = res.data.list});
                ip.getSelectSearchCondition({pageIndex:1,pageSize:10},res => {that.storeHypIdOpt = res.data;that.storeNameOpt = res.data})
                this.getFinanceMarkets();
                this.getOperateMarkets();
            },
            downloadTemplate(){
                window.location.href = tempIp.master_ip + '/store-master/downloadTemplate?type=' + this.templateType;
                this.selectTemplateTypeDialog = false;
            },
            getHallList(param){
                var that = this;
                var tem = [];
                var condition = [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'storeName',
                        value:this.storeName
                    },
                    {
                        name:'storeHypId',
                        value:this.storeHypId
                    },
                    {
                        name:'brand',
                        value:this.brand
                    },
                    {
                        name:'operateMarket',
                        value:this.operateMarket
                    },
                    {
                        name:'financialMarket',
                        value:this.financialMarket
                    }
                ];
                tem = this.common.joinSearchParam(condition);
                if(param === true){ tem = '' }
                ip.getStoreList(tem,res => {
                    if(res.code === 404){
                        that.tableData = []
                    }else if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                    }
                })
            },
            checkLog(hallId){
                this.hallId = hallId;
                this.hallLogDialog = true;
                this.getHallLogList()
            },
            getParam(flag){
                let that = this;
                let exportParam = "";
                if (flag) {
                    exportParam = '&'+that.common.joinSearchParam([
                        {
                            name: 'operateMarket',
                            value: this.operateMarket
                        },
                        {
                            name: 'financialMarket',
                            value: this.financialMarket
                        }])
                }
                return this.common.joinSearchParam([
                    {
                        name: 'pageIndex',
                        value: this.currentLogPage
                    },
                    {
                        name: 'pageSize',
                        value: this.pageLogSize
                    },
                    {
                        name: 'storeName',
                        value: this.storeName
                    },
                    {
                        name: 'storeHypId',
                        value: this.storeHypId
                    },
                    {
                        name: 'brand',
                        value: this.brand
                    }
                ]) + exportParam;
            },
            getHallLogList(){
                var that = this;
                var param = [
                    {
                        name:'pageIndex',
                        value:this.currentLogPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageLogSize
                    },
                    {
                        name:'module',
                        value:this.module
                    },
                    {
                        name:'submodule',
                        value:this.submodule
                    },
                    {
                        name:'operationId',
                        value:this.hallId
                    }
                ];
                ip.getDataLog(this.common.joinSearchParam(param),res => {
                    that.logDetailData = [];
                    that.totalLogRecords = 0;
                    if(res.code === 200){
                        that.logDetailData = res.data.list;
                        that.totalLogRecords = res.data.totalRecords;
                    }else if(res.code === 404){
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            reset(){
                let that = this;
                this.storeHypId = '';
                this.storeName = '';
                this.brand = '';
                this.operateMarket = "";
                this.financialMarket = '';
                this.currentPage = 1;
                ip.getSelectSearchCondition({pageIndex:1,pageSize:10},res => {that.storeHypIdOpt = res.data;that.storeNameOpt = res.data})
            },
            showTips(text,type){
                this.common.messageUtil({message:text,type:type})
            },
            //上传文件
            importFiles(){
                this.dialogObj = Object.assign({},dialogSaveObj);
                this.leftDialog = Object.assign({},leftDialogConst);
                this.rightType = 0;
                this.selectCompanyKey = [];
                this.firstCallback = true;
                this.treeKey = + new Date();
                this.resolve = {};
                this.node = {};
                this.uploadFilesDialog = true;
            },
            download(){
                let that = this;
                api.downloadHallMasterModified(this.getParam(true),'application/vnd.ms-excel',(res)=>{
                    that.common.exportTemplate('餐厅主档修改日志.xlsx',res);
                })
            },
            getFinanceMarkets() {
                let that = this;
                ip.getFinanceMarketIdNames(this.financialMarket, function (res) {
                    that.financialMarkets = res.data || []
                })
            },
            getOperateMarkets() {
                let that = this;
                ip.getOperateMarketIdNames(this.operateMarket, function (res) {
                    that.operateMarkets = res.data || []
                })
            },
            getBrand(){
                ip.getBrandList(this.common.formatPathParam({
                    pageIndex: 1,
                    pageSize: 99999999,
                    flag: 1
                }), res=> {
                    if (res.code === 200) {
                      this.brandList = res.data.list
                    } else {
                     this.brandList = []
                    }
                });
            },
            getDate(){

            },
            saveStorage(){
                let that = this;
                if(this.selectCompanyKey.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择餐厅!'
                    })
                    return false;
                }
                if(!this.dialogObj.depositStartDate && this.rightType <= 1){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请输入生效日期!'
                    })
                    return false;
                }
                this.dialogObj.weekendStorage = this.dialogObj.weekendStorageDate && this.rightType === 0 ?0:1;  //周末存行 0：否 1：是
                if(this.rightType === 1){
                    this.dialogObj.storageFrequency = this.dialogObj.checkList.join(',')  //若类型为固定星期几
                }
                if ( this.rightType >1 ){   //清空对象
                    for(let val in this.dialogObj){
                        that.dialogObj[val] = null;
                    }
                }
                this.dialogObj.storeCodes = this.selectCompanyKey;
                this.dialogObj.storageType = this.rightType>1?this.rightType:1;

                ip.batchUpdateStore('?module='+this.module+'&subModule='+this.submodule,this.dialogObj,()=>{
                    this.uploadFilesDialog = false;
                    this.getHallList();
                })
            },
            filterCompanyNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getSelectedCompanyKeys(node,nodes){
                this.selectCompanyKey = nodes.checkedNodes.filter(x=>{
                    return _.isUndefined(x.children)
                }).map(x=>{return x.id})
            },
            loadMore(node, resolve){
                if( _.isUndefined(resolve)){
                    this.firstCallback = true;
                }
                if(node.level === 0 && this.firstCallback){
                    this.resolve = resolve;
                    this.node = node;
                    this.getStoreTree(node,resolve);
                }else if(node.level === 1){
                    let findChild = this.companyData.find(x=>{return x.id === node.data.id})
                    if(findChild){
                        resolve(findChild.children)
                    }
                }else {
                   resolve([])
                }
            },
            getStoreTree(node,resolve){
                if(this.leftDialog.type != null){
                   this.leftDialog.storageType = this.leftDialog.type>1?this.leftDialog.type:1
                }else{
                    this.leftDialog.storageType = null;
                }
                this.loading = true;
                ip.listStoreTreeInHall(this.leftDialog,res => {
                        this.companyData = [];
                        if (res.code === 404) {
                            this.loading = false;
                            return false;
                        }
                        res.data.forEach((item,index) => {
                            let company = {};
                            company.id =  item.companyJde;
                            company.name = item.companyName;
                            company.children = [];
                            company.level = 1;
                            if (item.storeInfoList) {
                                item.storeInfoList.forEach((item1,index1) => {
                                    let storeInfo = {};
                                    storeInfo.id = item1.storeHypId;
                                    storeInfo.name = item1.storeHypId + item1.storeName;
                                    storeInfo.level = 2;
                                    storeInfo.leaf = true;
                                    company.children.push(storeInfo);
                                })
                            }
                            this.companyData.push(company);
                            this.loading = false;
                        });
                        if(node.level === 0 || _.isUndefined(resolve)){
                            if(_.isUndefined(resolve)){
                                if(this.node.childNodes && this.node.childNodes.length>0){
                                    let temNodes =  this.node.childNodes.concat();
                                    temNodes.forEach(item=>{
                                        this.$refs.storeCodeTree.remove(item.data)
                                    })
                                }
                            }
                            resolve = resolve?resolve:this.resolve;
                            resolve(this.companyData.map(item=>{return {name:item.name,id:item.id}}))
                        }
                        this.firstCallback = false;
                })
            },
        },
        mounted(){
            this.getBrand();
            this.getHallList();
            this.getSearchCondition()
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/scss/master';
    .btn-area{
        margin-top:15px;
        text-align: center;
    }
    .fix-block{
        padding-left: 25px;
        color: #ccc;
        p{
            margin-top:15px ;
        }
        /deep/ .el-checkbox{
            color:#ccc;
        }
        /deep/ .el-radio{
            color:#ccc;
        }
    }
   .hall /deep/ .el-radio{
        margin-bottom:15px;
    }
    .hall /deep/  .el-radio-group{
        vertical-align: baseline;
    }
    .search-btn{
        right: 52.2%;
        position: absolute;
        top: 35px;
        z-index:1111111;
    }

</style>
