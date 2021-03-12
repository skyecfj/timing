<!-- 押运清单-->
<template>
    <div class="escortInventory">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">营业日期</div>
                <el-date-picker
                        type="daterange"
                        v-model="bookDate"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        size="small"
                >
                </el-date-picker>
            </div>
            <div class="selectContent">
                <div class="selectTitle">餐厅编号</div>
                <el-input v-model.trim="storeCode" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">押运公司</div>
                <el-input v-model.trim="escortCompany" size="small" clearable></el-input>
            </div>
            <div class="selectContent" >
                <div class="selectTitle">营运市场</div>
                <el-select size="small"  v-model="operateMarket" placeholder="请选择营运市场"  filterable >
                    <el-option value="" label="请选择"></el-option>
                    <el-option v-for="(item,index) in operateMarkets" :key="index" :label="item.marketNumber" :value="item.marketNumber"></el-option>
                </el-select>
            </div>
            <div class="selectContent">
                <div class="selectTitle">银行JDE号</div>
                <el-input v-model.trim="bankJdeCode" size="small" clearable></el-input>
            </div>
            <div class="selectContent">
                <div class="selectTitle">核对状态</div>
                <el-select v-model="checkStatus">
                    <el-option v-for="(item,index) in selectOpt" :key="index" :value="item.value"
                               :label="item.name"></el-option>
                </el-select>
            </div>
            <el-button size="small" @click="searchData(1)" class="c-button c-button--primary">查询</el-button>
            <el-button size="small" @click="importData" class="c-button c-button--primary">上传</el-button>
            <el-button size="small" @click="exportData" class="c-button c-button--primary">模板下载</el-button>
            <el-button size="small" @click="batchDelete" class="c-button c-button--plain">批量删除</el-button>
            <el-button size="small" @click="reset" class="c-button c-button--plain">重置</el-button>
        </div>
        <div class="content">
            <tableOrigin
                    :tableHead="tableHead"
                    :selection="selection"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="escortInventory"
                    :option="option"
                    :operates="operates"
                    :totalRecords="totalRecords"
                    @handleSizeChange="handleSizeChange"
                    @handleCurrentChange="handleCurrentChange"
                    @handleSelectionChange="handleSelectionChange"
                    :pageIndex="currentPage"
            >
            </tableOrigin>
            <el-dialog title="附件" :visible.sync="dialogVisible" width="30%">
                <el-upload
                        ref="escortInventory"
                        class="upload-demo"
                        :action="action"
                        :on-preview="handlePreview"
                        :on-success="uploadSucceed"
                        :on-remove="handleRemove"
                        :auto-upload="false"
                        :limit="1"
                        :file-list="fileObjTemp.files">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
                <el-button class="file-upload-save" size="small" type="success" @click="saveAttach">保存</el-button>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import tableOrigin from './originalTable'
    import ip from '../../../model/apidr'
    import api from '../../../model/api'
    export default {
        name: 'escortInventory',
        components: {
            tableOrigin
        },
        computed: {
            action () {
                return this.actions + '?cover=' + this.cover + '&coverSummary=' + this.coverSummary;
            }
        },
        data () {
            return {
                storeCode: '',
                escortCompany: '',
                bankJdeCode: '',
                dynamicData: [],
                tableHead: [
                    {

                    label: '营业日期',
                    prop: 'bizDateStr'
                   },
                    {
                        label: '押运公司名称',
                        prop: 'escortCompany'
                    },
                    {
                        label:'营运市场',
                        prop:'operateMarket'
                    },
                    {
                        label: '餐厅编号',
                        prop: 'storeCode'
                    },
                    {
                        label: '存行日期',
                        prop: 'savingDateStr'
                    },
                    {
                        label: '存行金额',
                        prop: 'amount'
                    },
                    {
                        label: '银行JDE号',
                        prop: 'bankJdeCode'
                    },
                    {
                        label: '核对状态',
                        prop: 'checkStatus',
                        type: 'judge',
                        param: ['已核对', '未核对']
                    },
                ],
                selection: true,
                align: 'center',
                // pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                operates: {
                    width: 150,
                    fixed: 'right',
                    list: [
                        {
                            label: '删除',
                            show: true,
                            class: 'c-button-icon--danger--opacity c-button-icon-circle',
                            iClass: 'fa fa-trash-alt',
                            method: (index, row) => {
                                this.deleteRow(row);
                            }
                        }
                    ]
                },
                option: {},
                dialogVisible: false,
                fileObjTemp: {
                    files: []
                },
                fileObjForSubmit: {},
                multipleSelection: [],
                selectOpt: [{value: '', name: '全部'}, {value: 0, name: '未核对'}, {value: 1, name: '已核对'}],
                checkStatus: '',
                cover: false,
                coverSummary: false,
                actions: '/fsc/store/escort_list/upload',
                bookDate:[],
                operateMarkets:[],
                operateMarket:''
            }
        },
        methods: {
            searchData (pageIndex) {
                let that = this;
                if(pageIndex){
                    this.currentPage = 1;
                }
                let search = this.common.joinSearchParam([
                    {
                        name: 'pageSize',
                        value: this.pageSize
                    },
                    {
                        name: 'pageIndex',
                        value: this.currentPage
                    },
                    {
                        name: 'bizDateBegin',
                        value: this.bookDate?this.bookDate[0]:''

                    },
                    {
                        name: 'bizDateEnd',
                        value: this.bookDate?this.bookDate[1]:''

                    },
                    {
                        name: 'storeCode',
                        value: this.storeCode
                    },
                    {
                        name: 'escortCompany',
                        value: this.escortCompany
                    },
                    {
                        name: 'bankJdeCode',
                        value: this.bankJdeCode
                    },
                    {
                        name: 'checkStatus',
                        value: this.checkStatus
                    }
                ])
                ip.getEscortInventoryList(search, function (res) {
                    that.dynamicData = [];
                    that.totalRecords = 0;
                    if (res.code === 200) {
                        that.dynamicData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    } else if (res.code !== 200 && res.code !== 404) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    }
                })
            },
            exportData () {
                let that = this;
                ip.downloadEscortInventoryTemplate('application/vnd.ms-excel', function (res) {
                    if (res && res.code) {
                        that.common.messageUtil({
                            type: 'error',
                            message: res.msg
                        })
                    } else {
                        let link = document.createElement('a');
                        link.download = '押运清单模板.xlsx'
                        link.href = res;
                        link.target = '_blank';link.click();
                    }
                })
            },
            importData (rowObj) {
                let that = this;
                this.dialogVisible = true;
            },
            handlePreview (file) {
                console.log(file);
                // window.location.href = file.url;
                // this.getAction();
            },
            //删除file
            handleRemove (file, fileList) {
            },
            //上传成功
            uploadSucceed (res, file, fileList) {
                let that = this;
                if (res.code === 200) {
                    that.common.messageUtil({
                        type: 'success',
                        message: res.data
                    })
                    this.searchData();
                    this.dialogVisible = false;
                    this.fileObjTemp.files = [];
                    that.cover = false;
                    that.coverSummary = false;
                } else if (res.code === 404) {
                    that.common.messageUtil({
                        type: 'warning',
                        message: res.msg
                    })
                    this.dialogVisible = false;
                    this.fileObjTemp.files = [];
                    that.cover = false;
                    that.coverSummary = false;
                } else {
                    if (res.msg === '当前导入数据有重复，是否覆盖原数据？') {
                        that.$confirm(res.msg, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            that.cover = true;
                            that.$nextTick(function (res) {
                                that.$refs.escortInventory.$children[0].post(file.raw)
                            })
                        }).catch(() => {
                            this.dialogVisible = false;
                            this.fileObjTemp.files = [];
                        })
                    } else if (res.msg === '该存行日该银行已有数据，是否覆盖该日押运存行汇总额？') {
                        that.$confirm(res.msg, '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            that.coverSummary = true;
                            that.$nextTick(function (res) {
                                that.$refs.escortInventory.$children[0].post(file.raw)
                            });
                        }).catch(() => {
                            this.dialogVisible = false;
                            this.fileObjTemp.files = [];
                        })
                    } else {
                        that.common.messageUtil({
                            type: 'warning',
                            message: res.msg
                        })
                        this.dialogVisible = false;
                        this.fileObjTemp.files = [];
                        that.cover = false;
                        that.coverSummary = false;
                    }
                }
            },
            //保存已上传的fileList
            saveAttach () {
                this.$refs.escortInventory.submit();
            },
            deleteRow (row) {
                let that = this;
                if (typeof row !== 'boolean') {
                    this.multipleSelection = [row.id];
                } else {
                    if (this.multipleSelection && this.multipleSelection.length === 0) {
                        that.common.messageUtil({
                            type: 'warning',
                            message: '请勾选数据后再批量删除！'
                        });
                        return;
                    }
                }
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    ip.deleteEscortInventory({escortListIds: this.multipleSelection}, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            })
                            that.searchData();
                            that.multipleSelection = [];
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            })
                        }
                    })
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消删除'
                    });
                    // that.multipleSelection = [];
                });
            },
            batchDelete () {
                this.deleteRow(true);
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.searchData();
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.searchData();
            },
            handleSelectionChange (val) {
                this.multipleSelection = [];
                let that = this;
                if (val.length > 0) {
                    val.forEach(function (item, index) {
                        that.multipleSelection.push(item.id)
                    })
                }
            },
            reset(){
                this.bookDate = [];
                this.storeCode = '';
                this.checkStatus = '';
                this.escortCompany = '';
                this.bankJdeCode = '';
                this.operateMarket = '';
            },
            getAllOperateMarket(){
                api.getOperateMarketIdNames('&judgePermission=true',res=>{
                    this.operateMarkets = res.data||[];
                })
            }
        },
        mounted () {
            this.getAllOperateMarket();
            this.searchData();
        }
    }
</script>

<style>
</style>
