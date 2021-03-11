<!--cash_a表-->
<template>
    <div class="BOHDataCheck">
        <!-- search -->
        <div class="search-content">
            <searchHeader v-bind:searchConfig="pageUtil.searchConfigCheck"
                          v-on:rangeDatechange="rangeDatechange">
                <div class="selectContent">
                    <div class="selectTitle">餐厅编号</div>
                    <remoteSelect
                            placeholder="请选择餐厅编号"
                            :remoteFn="'getSelectSearchCondition'"
                            :optLabel="'storeHypId'"
                            :optValue="'storeHypId'"
                            :judgePermission="true"
                            @getChangeData="getStoreCode"
                            :type="1"
                            ref="storeRef"
                    ></remoteSelect>
                </div>
            </searchHeader>
            <el-button size="small" type="success" class="findButt" @click="search">查询</el-button>
            <el-button size="small" type="success" plain class="reSet" @click="reset">重置</el-button>
            <el-button size="small" type="success" class="findButt" @click="doExport">下载</el-button>
            <el-button size="small" type="success" class="findButt" @click="updateReasonMulti">设置原因类型</el-button>
            <el-button size="small"  type="success" class="findButt" @click="sendEmail">批量发送邮件</el-button>
            <!-- <el-button size="small"  type="success" class="findButt" @click="doUpload">批量上传</el-button> -->
        </div>

        <div class="content">
            <el-table :data="tblData" style="width: 100%;" @selection-change="handleSelectionChange" :border="true"
                      :height="dynamicHeight">
                <el-table-column type="selection" ></el-table-column>
                <el-table-column v-for="(headerItem,index) in tblStaticFrontObj"
                                 v-bind:key="'static'+index"
                                 :prop="headerItem.prop"
                                 :label="headerItem.label" ></el-table-column>
                <el-table-column v-for="(headerItem,index) in tblFlexObj"
                                 v-bind:key="'flex'+index"
                                 :label="headerItem" >
                    <template slot-scope="scope">
                        <span>{{scope.row.values[index]}}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(headerItem,index) in tblStaticBackObj"
                                 v-bind:key="'staticBack'+index"
                                 :prop="headerItem.prop"
                                 :label="headerItem.label" >
                    <template slot-scope="scope">
            <span v-if="headerItem.prop == 'specialTrack'">
              {{specialTrackMap[scope.row.specialTrack]}}
            </span>
                        <span v-else>{{scope.row[headerItem.prop]}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" width="120" >
                    <template slot-scope="scope">
                        <el-button type="text" class="link-btn block" @click="toAdjust(scope.row)">手工调整</el-button>
                        <el-button type="text" class="link-btn block" @click="toDailyRepo(scope.row)">日常追踪报告</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="附件" >
                    <template slot-scope="scope">
                        <el-button type="text" class="link-btn" @click="getCurrentAttachments(scope.row)">附件</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-content">
                <el-pagination @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="currentPage"
                               :page-sizes="pageSizeOpt"
                               :page-size="pageSize"
                               :total="totalRecord"
                               layout="total,sizes,prev,pager,next,jumper"></el-pagination>
            </div>
        </div>

        <el-dialog title="附件" :visible.sync="attatchDialogVisible" width="30%" @closed="attachDialogClosed"
                   :close-on-click-modal="false">
            <div v-loading="loadFile"
                 element-loading-text="上传中..."
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="transparent">
                <el-upload class="upload-demo"
                           :action="uploadUrl"
                           :on-preview="handlePreview"
                           :on-success="uploadSucceed"
                           :on-remove="handleRemove"
                           multiple :before-upload="beforeUpload"
                           :before-remove="beforeRemove"
                           :file-list="fileObjTemp.files">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip"></div>
                </el-upload>
            </div>
        </el-dialog>

        <!-- 批量设置原因dialog -->
        <el-dialog title="设置异常原因类别" :visible.sync="setReasonDialogVisible" width="30%" :close-on-click-modal="false"
                   custom-class="reasonset-dialog"
                   @close="setReasonForm.specialTrack = '';$refs['setReasonForm'].resetFields()">
            <el-form :model="setReasonForm" label-width="80px" ref="setReasonForm">
                <el-form-item label="原因类型" prop="specialTrack"
                              :rules="[{ required: true, message: '请选择原因类型', trigger: 'change' }]">
                    <el-select size="samll" v-model="setReasonForm.specialTrack" placeholder="请选择" :filterable="true">
                        <el-option label="不需手工调整" value="0"></el-option>
                        <el-option label="继续追踪" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="specialRemark">
                    <el-input type="textarea" v-model="setReasonForm.specialRemark" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" class="c-button c-button--plain" @click="setReasonDialogVisible = false">取 消
                </el-button>
                <el-button size="small" class="c-button c-button--primary" @click="doUpdateReasonMulti">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import api from '../../../../model/api'
    import apiStore from '../../../../model/apidr'
    import ip from '../../../../model/tempIp'
    //查询form组件
    import searchHeader from '../dataCheckComponent/searchHeader'
    //查询form配置
    import pageUtil from '../../../../utils/restaurant/dataCheck/BOHDataMng'
    import remoteSelect from '@/components/common/remoteSelect'

    export default {
        name: 'BOHDataCheck',
        activated() {
            let _self = this;
            let oldTh = JSON.stringify(this.tblFlexObj);
            apiStore.getTblFlexTh('', function (res) {
                let currentTh = JSON.stringify(res.data);
                if (oldTh != currentTh) {
                    if (res.code === 404) {
                        _self.tblFlexObj = [];
                    } else if (res.code === 200) {
                        _self.tblFlexObj = res.data;
                    }
                    _self.setBOHOpts();
                    _self.tblData = [];
                    _self.totalRecord = 0;
                }
            });
        },
        deactivated() {
        },
        components: {
            searchHeader,
            remoteSelect
        },
        created() {
        },
        beforeMount() {
            console.log(pageUtil.searchConfigCheck.searchObj);
            this.getSearchOptioins();
            this.setBOHOpts();
            this.getTblFlexObj();
            //财务市场查询配置
            //this.setSearchMarketConfig();
            //法人公司查询配置
            //this.setSearchCompanyConfig()
        },
        mounted() {
            this.$nextTick(() => {
                this.dynamicHeight = parseInt(document.body.clientHeight - document.getElementsByClassName('BOHDataCheck')[0].getElementsByClassName('search-content')[0].clientHeight - 250)
            })
        },
        data() {
            return {
                dynamicHeight: 0,
                attatchDialogVisible: false,
                //uploadDown    : false,
                uploadUrl: '',
                //暂存文件对象
                fileObjTemp: {
                    id: '',
                    files: []
                },
                loadFile: false,
                fileCount: 0,
                pageUtil: pageUtil,
                //
                fileObjForSubmit: {},
                //前半部分固定表头
                tblStaticFrontObj: [
                    {
                        label: '餐厅编号',
                        prop: 'storeCode'
                    },
                    {
                        label: '营运市场',
                        prop: 'operateMarket'
                    },
                    {
                        label: '法人公司',
                        prop: 'companyName'
                    },
                    {
                        label: '品牌',
                        prop: 'brand'
                    },
                    {
                        label: '营业日期',
                        prop: 'bizDate'
                    }
                ],
                //动态表头
                tblFlexObj: [],
                //后半部分固定表头
                tblStaticBackObj: [
                    {
                        label: '原因类型',
                        prop: 'specialTrack'
                    },
                    {
                        label: '备注',
                        prop: 'specialRemark'
                    },
                    {
                        label: '非现金核对差异',
                        prop: 'actOrAmount'
                    },
                    {
                        label: '现金核对差异',
                        prop: 'cashOrAmount'
                    }
                    // {
                    //   label : '百胜卡售卖差异',
                    //   prop  : 'cardOrAmount'
                    // }
                ],
                tblData: [],
                selectedRows: [],
                currentPage: 1,
                pageSizeOpt: [25, 50, 75, 100, 125],
                pageSize:25,
                totalRecord: 0,
                searchCompanyScrollPageIndex: 1,
                searchCompanyScrollFlag: true,
                searchCompanySelectObj: {},
                tempSearchCompanyKeyWord: '',
                specialTrackMap: ['不需手工调整', '继续追踪'],
                setReasonDialogVisible: false,
                setReasonForm: {
                    specialTrack: '',
                    specialRemark: ''
                },
                storeCode: '',
            }
        },
        methods: {
            //search组件 范围变量变化
            rangeDatechange(emitObj) {
                let _self = this;
                for (let searchKey in pageUtil.searchConfigCheck.searchObj) {
                    for (let emitObjKey in emitObj) {
                        if (searchKey == emitObjKey) {
                            pageUtil.searchConfigCheck.searchObj[searchKey] = emitObj[emitObjKey];
                        }
                    }
                }
            },
            //获查询头部选项
            getSearchOptioins() {
                let _self = this;
                let searchParam = this.common.formatPathParam({
                    pageIndex: 1,
                    pageSize: 99999999,
                    flag: 1
                });
                api.getBrandList(searchParam, function (result) {
                    console.log(result);
                    if (result.data.list) {
                        pageUtil.searchConfigCheck.searchConditions[2].otherConfig.opts = result.data.list;
                    } else {
                        pageUtil.searchConfigCheck.searchConditions[2].otherConfig.opts = [];
                    }
                });

                api.getOperateMarketIdNames('&judgePermission=true', function (res) {
                    let searchMarketConfig = pageUtil.searchConfigCheck.searchConditions[1].otherConfig;
                    if (res.code == 200) {
                        searchMarketConfig.opts = searchMarketConfig.opts.concat(res.data);
                    } else {
                        searchMarketConfig.opts = [];
                    }
                })
                //获取所有财务市场
                // api.getDictionaryByNumber('MARKETTYPE', function (res) {
                //     if (res.code == 200) {
                //         let tempMarketCategory = '';
                //         res.data.forEach(function (item, index) {
                //             if (item.dictionaryEntryName == '营运市场') {
                //                 tempMarketCategory = item.id;
                //             }
                //         });
                //         let marketSearchParam = _self.common.formatPathParam({
                //             pageIndex: 1,
                //             pageSize: 999999,
                //             marketCategory: tempMarketCategory
                //         });
                //         api.getMarketList(marketSearchParam, function (result) {
                //             let searchMarketConfig = pageUtil.searchConfigCheck.searchConditions[1].otherConfig;
                //             if (result.code == 200) {
                //                 searchMarketConfig.opts = searchMarketConfig.opts.concat(result.data.list);
                //             } else {
                //                 searchMarketConfig.opts = [];
                //             }
                //         });
                //     }
                // });
            },
            setBOHOpts() {
                let _self = this;
                let param = this.common.formatPathParam({
                    pageIndex: 1,
                    pageSize: 99999999
                });
                api.getBOHList(param, function (res) {
                    if (res.code === 404) {
                        pageUtil.searchConfigCheck.searchConditions[3].otherConfig.opts = [];
                    } else if (res.code === 200) {
                        pageUtil.searchConfigCheck.searchConditions[3].otherConfig.opts = res.data.list;
                    }
                });
            },
            //获取动态表头
            getTblFlexObj() {
                let _self = this;
                apiStore.getTblFlexTh('', function (res) {
                    if (res.code === 404) {
                        _self.tblFlexObj = [];
                    } else if (res.code === 200) {
                        _self.tblFlexObj = res.data;
                    }
                });
            },
            //营运市场查询配置
            // setSearchMarketConfig(){
            //   let searchMarketConfig = pageUtil.searchConfigCheck.searchConditions[1].otherConfig;
            //   let searchCompanyConfig = pageUtil.searchConfigCheck.searchConditions[2].otherConfig;
            //   searchMarketConfig.changeMethod = () => {
            //     pageUtil.searchConfigCheck.searchObj.companyName = '';
            //     searchCompanyConfig.opts = [];
            //     this.searchCompanyRemote('');
            //   };
            // },
            //法人公司查询配置
            setSearchCompanyConfig() {
                let searchCompanyConfig = pageUtil.searchConfigCheck.searchConditions[2].otherConfig;
                searchCompanyConfig.remoteMethod = (query) => {
                    //console.log(query);
                    this.searchCompanyRemote(query);
                };
                searchCompanyConfig.scrollMethod = (param, object) => {
                    this.searchCompanyScrollMethod(param, object);
                };
                searchCompanyConfig.visibleChange = (isVisible) => {
                    if (!isVisible && !pageUtil.searchConfigCheck.searchObj.companyName) {
                        searchCompanyConfig.opts = [];
                        this.searchCompanyRemote('');
                    } else {
                        //this.searchCompanyRemote(pageUtil.searchConfigCheck.searchObj.companyName);
                    }
                };
                this.searchCompanyRemote('');
            },
            //法人公司下拉查询和远程查询
            searchCompanyScrollMethod(param, object) {
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfigCheck.searchConditions[2].otherConfig;
                if (param) {
                    this.searchCompanySelectObj = object;
                    if (this.searchCompanyScrollFlag) {
                        this.searchCompanyScrollPageIndex++;
                        let param = this.common.formatPathParam({
                            companyName: this.tempSearchCompanyKeyWord,
                            //marketNumber : pageUtil.searchConfigCheck.searchObj.financialMarket,
                            pageIndex: this.searchCompanyScrollPageIndex,
                            pageSize: 20
                        });
                        api.getCompanyByFMarket(param, function (res) {
                            if (res.code === 200) {
                                searchCompanyConfig.opts = searchCompanyConfig.opts.concat(res.data);
                            } else {
                                _self.searchCompanyScrollFlag = false;
                            }
                        })
                    }
                }
            },
            searchCompanyRemote(query) {
                let _self = this;
                let searchCompanyConfig = pageUtil.searchConfigCheck.searchConditions[2].otherConfig;
                searchCompanyConfig.remoteLoading = true;
                this.searchCompanyScrollPageIndex = 1;
                this.tempSearchCompanyKeyWord = query;
                this.searchCompanyScrollFlag = true;
                if (JSON.stringify(this.searchCompanySelectObj) !== '{}') {
                    this.searchCompanySelectObj.scrollTop = 0;
                }
                let param = this.common.formatPathParam({
                    companyName: query,
                    //marketNumber : pageUtil.searchConfigCheck.searchObj.financialMarket,
                    pageIndex: this.searchCompanyScrollPageIndex,
                    pageSize: 20
                });
                api.getCompanyByFMarket(param, function (result) {
                    searchCompanyConfig.remoteLoading = false;
                    if (result.code == 200) {
                        searchCompanyConfig.opts = [];
                        searchCompanyConfig.opts = searchCompanyConfig.opts.concat(result.data);
                    } else if (result.code == 404) {
                        searchCompanyConfig.opts = [];
                        pageUtil.searchConfigCheck.searchObj.companyName = '';
                    }
                })
            },
            doUpdateReasonMulti() {
                let _self = this;
                this.$refs['setReasonForm'].validate((valid) => {
                    if (valid) {
                        let param = {
                            ids: [],
                            specialRemark: _self.setReasonForm.specialRemark,
                            specialTrack: _self.setReasonForm.specialTrack
                        }
                        _self.selectedRows.forEach(function (item, index) {
                            param.ids.push(item.id)
                        });
                        apiStore.setBohAbnormalReasonMulti(param, function (res) {
                            if (res.code === 200) {
                                _self.common.messageUtil({
                                    message: res.data,
                                    type: 'success'
                                });
                                _self.setReasonDialogVisible = false;
                                _self.getData();
                            } else {
                                _self.common.errorMessage(res.msg);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSelectionChange(selectedDatas) {
                this.selectedRows = selectedDatas;
            },
            //跳转至手工调整页
            toAdjust(bohItem) {
                let _self = this;
                let query = {
                    cashaMainId: bohItem.id
                };
                //window.localStorage.setItem('bohParams',JSON.stringify(currentParams));
                this.$router.push({
                    name: 'BOHDataAdjust',
                    query: query
                });
            },
            toDailyRepo(bohItem) {
                let _self = this;
                let query = {
                    bizDate: bohItem.bizDate,
                    storeCode: bohItem.storeCode
                };
                //window.localStorage.setItem('bohParams',JSON.stringify(currentParams));
                this.$router.push({
                    name: 'BOHDataDailyReport',
                    query: query
                });
            },
            //下载
            doExport() {
                let _self = this;
                let params = Object.assign({storeCodeL: this.storeCode}, pageUtil.searchConfigCheck.searchObj);
                apiStore.exportBohAbnormalList(params, 'application/vnd.ms-excel', function (res) {
                    if (res.code) {
                        _self.common.messageUtil({
                            message: res.msg,
                            type: 'warning'
                        });
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = 'BOH数据异常列表.xlsx';
                        link.target = '_blank';link.click();
                    }
                })
            },
            updateReasonMulti() {
                if (this.selectedRows.length < 1) {
                    this.common.messageUtil({
                        message: '请选择要设置原因类型的数据',
                        type: 'warning'
                    });
                    return false;
                }
                this.setReasonDialogVisible = true;
            },
            //发送邮件
            sendEmail() {
                if(!this.selectedRows || this.selectedRows.length === 0){
                    this.common.messageUtil({
                        type:'warning',
                        message:'请勾选数据后再发送邮件'
                    })
                    return false
                }
                apiStore.batchSendEmailNotUpload(this.selectedRows.map(res=>{
                    return {
                        bizDate:res.bizDate,
                        storeCode:res.storeCode
                    }
                }))
            },
            //批量上传
            doUpload() {

            },
            beforeUpload(file) {
                let _self = this;
                this.loadFile = true;
                return new Promise((resolve, reject) => {
                    this.$nextTick(() => {
                        _self.uploadUrl = ip.store + '/file-upload/attachment?source=bohExceptionCheck&foreignId=' + _self.fileObjTemp.id
                        resolve()
                    })
                })
            },
            handlePreview(file) {
                let link = document.createElement('a');
                if (file.response && file.response.code == 200) {
                    link.href = file.response.data.url;
                    link.download = file.response.data.name;
                } else if (file.url) {
                    link.href = file.url;
                    link.download = file.name;
                }
                link.target = '_blank';link.click();
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            //删除file
            handleRemove(file, fileList) {
                let _self = this;
                let param = this.common.formatPathParam({
                    id: file.id
                })
                apiStore.deleteCheckAttachMent(param, function (res) {
                    //_self.uploadDown = true;
                    _self.fileCount = fileList.length;
                });
            },
            //上传成功
            uploadSucceed(response, file, fileList) {
                let _self = this;
                this.fileCount++;
                if (fileList.length == this.fileCount) {
                    this.loadFile = false;
                }
                //this.uploadDown = true;
            },
            //附件弹框
            getCurrentAttachments(rowObj) {
                let _self = this;
                let param = this.common.formatPathParam({
                    foreignId: rowObj.id,
                    source: 'bohExceptionCheck'
                });
                apiStore.selectCurrentAttachments(param, function (res) {
                    if (res.code === 200) {
                        _self.fileObjTemp = Object.assign({}, {
                            id: rowObj.id,
                            files: []
                        });
                        _self.fileObjTemp.files = res.data.concat();
                        _self.fileCount = _self.fileObjTemp.files.length;
                        _self.attatchDialogVisible = true;
                    } else if (res.code === 404) {
                        _self.fileObjTemp = Object.assign({}, {
                            id: rowObj.id,
                            files: []
                        });
                        _self.fileCount = _self.fileObjTemp.files.length;
                        _self.attatchDialogVisible = true;
                    } else {
                        _self.common.errorMessage(res.msg);
                    }
                })
            },
            // showAttachDialog(rowObj) {
            //   let _self = this;
            //   this.fileObjTemp = Object.assign({},{
            //     id    : rowObj.id,
            //     files : []
            //   });
            //   this.fileObjTemp.files = rowObj.files.concat();
            //   this.fileCount = this.fileObjTemp.files.length;
            //   this.attatchDialogVisible = true;
            // },
            attachDialogClosed() {
                this.fileObjTemp = Object.assign({}, {
                    id: rowObj.id,
                    files: []
                });
            },
            search() {
                this.currentPage = 1
                this.getData()
            },
            //查询列表
            getData() {
                let _self = this;
                let pageParam = {
                    pageIndex: this.currentPage,
                    pageSize: this.pageSize
                };
                let searchParam = Object.assign({storeCode: this.storeCode}, pageParam, pageUtil.searchConfigCheck.searchObj)
                if (!searchParam.bizDateBegin || !searchParam.bizDateEnd) {
                    this.common.messageUtil({
                        message: '请选择完整的营业日期',
                        type: 'warning'
                    });
                    return false;
                }
                let param = this.common.formatPathParam(searchParam);
                apiStore.getBohAbnormalList(param, function (result) {
                    if (result.code == 200) {
                        _self.tblData = result.data.list;
                        _self.totalRecord = result.data.totalRecords;
                    } else if (result.code == 404) {
                        _self.tblData = [];
                        _self.totalRecord = 0;
                    }
                })
            },
            reset() {
                this.$refs.storeRef.reset();
                pageUtil.searchConfigCheck.searchObj.reset = true;
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getData();
            },
            getStoreCode(res) {
                this.storeCode = res;
            },

        }
    }
</script>
<style lang="scss">
    .link-btn.block {
        display: block;
        margin: 0;
        padding: 5px 0;
    }

</style>







