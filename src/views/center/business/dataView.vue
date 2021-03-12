<!--数据查看-->
<template>
    <div class="dataView">
        <div class="viewHeader">
            <el-row :gutter="24">
                <el-col :span="3" key="channelLabel"><div>售卖渠道</div></el-col>
                <el-col :span="3" v-if="channels != 4 && channels != 5" key="brandLabel" ><div>品牌</div></el-col>
                <el-col :span="3" key="dataTypeLabel"><div>数据类型</div></el-col>
                <el-col :span="3" v-if="channels == 5 && type == 2" key="cardTypeLabel"><div>发卡类型 </div></el-col>
                <el-col :span="3" v-if="type == 1 || type == 0" key="bizOrderNumLabel">
                    <div v-if="channels == 4 && (type == 0 || type == 1)" key="bizOrderNumLabeltext" >订单号</div>
                    <div v-else >商户订单号</div>
                </el-col>
                <el-col :span="3" v-if="type != 1 && type != 0" key="orderNumLabel">
                    <div v-if="(channels == 5 && type == 2) || (channels == 4 && type == 2) ">卡平台订单号</div>
                    <div v-else-if="channels == 5 && type == 5" >订单编号</div>
                    <div v-else-if="channels == 6">口碑商品订单号</div>
                    <div v-else>订单号</div>
                </el-col>
                <el-col :span="3" v-if="channels == 0 && type == 2" key="prodTypeLabel"><div>商品类别</div></el-col>
                <el-col :span="8" class="dayMargin" key="billOrderDateLabel"><div>账单日期/订单日期</div></el-col>
                <!-- <el-col :span="3" v-if="channels == 1 && type == 1" key="businessTypeLabel"><div>业务类型</div></el-col> -->
            </el-row>
            <el-row :gutter="24">
                <el-col :span="3">
                    <el-select size="small"  v-model="channels" placeholder="请选择售卖渠道" filterable @change="changeChannel" key="channelTypeSelect">
                        <el-option v-for="item in channelsOpt" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" v-if="channels != 4 && channels != 5" key="brandSelect">
                    <el-select size="small"  v-model="brand" placeholder="请选择品牌" filterable>
                        <el-option value="">请选择</el-option>
                        <el-option
                                v-for="item in brandsOpt"
                                :key="item.brandId"
                                :label="item.brandEnglishName"
                                :value="item.brandEnglishName">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select size="small"  v-model="type" placeholder="请选择数据类型" filterable @change="selectBill">
                        <el-option v-if="channels == 0 || channels == 2 || channels == 4 || channels == 7" key="wechatBill" label="微信账单" value="0"></el-option>
                        <el-option v-if="channels == 0 || channels == 1 || channels == 4 || channels == 6" key="aliBill" label="支付宝账单" value="1"></el-option>
                        <el-option v-if="channels == 0 || channels == 1 || channels == 4 || channels == 5 || channels == 6 || channels == 7" key="order" label="订单" value="2"></el-option>
                        <el-option v-if="channels == 2" key="couponOrder" label="券订单" value="3"></el-option>
                        <el-option v-if="channels == 2" kay="cardOrder" label="卡订单" value="4"></el-option>
                        <el-option v-if="channels == 5" key="paperCard" label="小额纸质卡券(二次激活)订单" value="5"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3" v-if="channels == 5 && type == 2" key="cardTypeSelect" >
                    <el-select size="small"  v-model="ordertype" placeholder="请选择发卡类型" >
                        <el-option label="请选择" value="" ></el-option>
                        <el-option label="团购" value="2"></el-option>
                        <el-option label="小额纸质卡券" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-input   v-model.trim="bszNumber" size="small" placeholder="订单号"
                                v-if="type == 1 || type == 0" key="bizOrderNumInput" clearable ></el-input>
                    <el-input   v-model.trim="bszNumber" size="small" placeholder="订单号" @blur="getBszNumbers"
                                v-if="type != 1 && type != 0" key="orderNumInput" clearable ></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select size="small" placeholder="请选择商品类别" filterable v-model="commodityType" v-if="channels == 0 && type == 2" key="prodTypeSelect">
                        <el-option v-for="(item,index) in commodityTypes"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="8" class="dayMargin" >
                    <div class="block">
                        <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="getDataRange"
                                type="daterange"
                                align="right"
                                unlink-panels
                                v-model="value1"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :picker-options="pickerOptions1"
                                :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-col>
                <!-- <el-col :span="3" v-if="channels == 1 && type == 1" key="businessTypeSelect">
                    <el-select size="small" placeholder="请选择业务类型" filterable multiple v-model="busniessType">
                        <el-option v-for="(item,index) in busniessTypeOptions"
                                   :key="index"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-col> -->

            </el-row>
            <el-row :gutter="24" >
                <el-col :span="8" v-if="(channels == 0 || channels == 4) && type == 2" key="refundDateLabel"><div>退款日期</div></el-col>
                <el-col :span="5" v-if="channels == 0 && type == 2" key="orderLineStatusLabel"><div>订单行状态</div></el-col>
                <el-col :span="5" v-if="(channels == 0 || channels == 4) && type == 2" key="orderStatusLabel"><div>订单状态</div></el-col>
                <el-col :span="5" v-if="(channels == 0 || channels == 4) && type == 2" key="paymentTypeLabel"><div>支付方式</div></el-col>
            </el-row>
            <el-row :gutter="24" >
                <el-col :span="8" class="dayMargin" v-if="(channels == 0 || channels == 4) && type == 2" key="refundDateInput" >
                    <div class="block">
                        <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                @change="getDataRange2"
                                type="daterange"
                                align="right"
                                unlink-panels
                                v-model="value2"
                                range-separator="-"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :picker-options="pickerOptions2"
                                :default-time="['00:00:00', '23:59:59']">
                        </el-date-picker>
                    </div>
                </el-col>
                <el-col :span="5" v-if="channels == 0 && type == 2" key="orderLineStatusSelect" >
                    <el-select size="small"  v-model="itemStatus" placeholder="请选择订单行状态" filterable multiple class="fullSelect" @change="changeItemStatus">
                        <el-option
                                v-for="item in itemStatusOption"
                                :key="item.dictionaryEntryCode"
                                :label="item.dictionaryEntryName"
                                :value="item.dictionaryEntryCode"
                                :disabled="isHasAllSelect(itemStatus,item.dictionaryEntryCode)">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" v-if="(channels == 0 || channels == 4) && type == 2" key="orderStatusSelect" >
                    <el-select size="small"  v-model="status" placeholder="请选择订单状态" filterable multiple class="fullSelect" @change="changeOrderStatus">
                        <el-option
                                v-for="item in vcOrderStatusOption"
                                :key="item.dictionaryEntryCode"
                                :label="item.dictionaryEntryName"
                                :value="item.dictionaryEntryCode"  v-if="isVirtualCrad">
                        </el-option>
                        <el-option
                                v-for="item in orderStatusOption"
                                :key="item.dictionaryEntryCode"
                                :label="item.dictionaryEntryName"
                                :value="item.dictionaryEntryCode"
                                :disabled="isHasAllSelect(status,item.dictionaryEntryCode)" v-if="!isVirtualCrad">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" v-if="(channels == 0 || channels == 4) && type == 2" key="paymentTypeSelect">
                    <el-select size="small"  v-model="paymentModels" placeholder="请选择支付方式" filterable multiple class="fullSelect">
                        <el-option  v-for="item in paymentModelsOption" :key="item.dictionaryEntryCode"
                                    :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col>
                    <el-button size="small" type="success" class="c-button" @click="getDataViewList">查询</el-button>
                    <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
                    <el-button size="small" type="success" @click="importFile" class="c-button"><i class="fa fa-upload c-button-icon--left"></i>上传</el-button>
                    <el-button size="small"  type="success" class="c-button" @click="exportFile"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                    <el-popover
                        placement="right"
                        trigger="click">
                    <el-table :data="downloadList" v-loadmore="loadMore"  max-height="300" size="small"
                              v-loading="loadingList"
                              element-loading-text="拼命加载中"
                              element-loading-spinner="el-icon-loading"
                              element-loading-background="rgba(0, 0, 0, 0.8)"
                    >
                      <el-table-column  property="exportType" label="导出类型"  width="120"></el-table-column>
                      <el-table-column  label="状态" width="100">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status ===0">已提交</span>
                                <span v-else-if="scope.row.status ===1 ">执行中</span>
                                <span v-if="scope.row.status ===2 ">已完成</span>
                                <span v-else-if="scope.row.status === 3">已失败</span>
                            </template>
                        </el-table-column>
                        <el-table-column  property="createTime" label="创建时间"  width="140"></el-table-column>
                        <el-table-column width="100" label="地址">
                            <template slot-scope="scope">
                                <a v-if="scope.row.fileUrl" :href="'http://'+scope.row.fileUrl" class="link">下载</a>
                                <a v-else  class="link-disable">下载</a>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button slot="reference" size="small" type="success" plain @click="getDownloadList()" class="c-button">查看下载列表</el-button>
                </el-popover>
                <el-button v-if="bill && isTmall && type" size="small" type="success"  @click="uploadBusniessType()" class="c-button">业务类型上传</el-button>
                <el-button size="small" v-if="channels == 1 && type == 1" key="tmllAliPayDownLoadBtn"
                           type="success" class="c-button" @click="exportFile('paymentTypeDownLoad')"><i class="fa fa-download c-button-icon--left"></i>可修改支付类型下载</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="viewContent">
            <div class="viewIconView" v-if="(type == 2 || type == 5) && (channels != 2)" key="totalAmountContent">
                <span v-if="channels == 5">卡面值总额 : {{sumCardAmount}}</span><span v-else >订单金额汇总 : {{sumSubTotal}}</span>&nbsp;&nbsp;
                <span v-if="channels == 5">卡净值汇总 : {{sumPaidAmount}}</span><span v-else >退款金额汇总 :{{sumReturnAmount}}</span>
            </div>
            <el-table :data="tableData" border class="viewTable">
                <el-table-column v-for="(value,key) in tblHeaderConfig" v-bind:key = key :prop="key" :label="value"  >
                    <template slot-scope="scope">
                        <template v-if="key == 'ispayment' || key == 'isactivate'">
                            <span v-if="scope.row[key] == 't'">是</span>
                            <span v-else>否</span>
                        </template>
                        <template v-else >
                            <span>{{scope.row[key]}}</span>
                        </template>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="60px" v-if="resultName === 'tmallAlipayBill'">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top" effect="light" popper-class="table-cell-toolTip">
                            <el-button size="small"   @click="editTmall(scope.row)" class="c-button-icon--primary--opacity c-button-icon-circle"><i class="fa fa-edit"></i></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
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
        <!--业务类型上传-->
         <el-dialog :visible.sync="importBusinessOpreDialog" class="dialogContent" width="40%"
         title="业务类型上传">
            <div  class="loadFileContent" v-loading="loadBusinessFile"
            element-loading-text="上传中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="transparent">
             <el-upload ref="importBusinessType" :action="importTmallAlipayUrl"
                :file-list="fileBusinessList"
                :on-change="handleBusinessChange"
                :auto-upload="false"
                :before-upload="beforeBusinessFileUpload"
                :on-remove="removeBusinessFile"
                :on-error="uploadBusinessError"
                :on-success="uploadBusinessSuccess"
                accept=".xlsx"
                >
                 <el-button class="c-button c-button--primary" size="small">上传文件</el-button>
                 <div slot="tip" class="el-upload__tip">只能上传xlsx格式文件,且不超过20M</div>
             </el-upload>
             <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="importBusinessOpreDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="importBusinessType" class="c-button c-button--primary" :disabled="uploadBusinessDisabled">上传</el-button>
            </div>
            </div>
        </el-dialog>
       <!--业务类型上传-->

        <!--业务类型修改dialog-->
        <el-dialog :visible.sync="tmallAlipayBusDialog" class="dialogContent" width="60%"  title="账单-业务类型修改">
             <div class="tamllAlipayContent">
                  <el-col :span="16">
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>商户订单号</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.orderId}}</p></el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>品牌</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.brand}}</p></el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>渠道</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.channel}}</p></el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>商品名称</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.goodsTitle}}</p></el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>交易时间</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.transDatetime}}</p></el-col>
                      </el-row>
                      <el-row :gutter="10">
                          <el-col :span="4" ><span>交易金额</span></el-col>
                          <el-col :span="16" ><p class="titleValue">{{tmallAlipayRowData.transAmount}}</p></el-col>
                      </el-row>
                  </el-col>
                   <el-col :span="8">
                        <label>业务类型</label>
                        <el-select size="small"  v-model="tmallAlipayRowData.paymentModel" filterable>
                                <el-option v-for="(item,index) in updateBusniessTypeOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                   </el-col>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small"  @click="tmallAlipayBusDialog = false" class="c-button c-button--plain">取消</el-button>
                <el-button size="small"  type="primary" @click="submitEditTmall" class="c-button c-button--primary">保存</el-button>
            </div>
        </el-dialog>
      <!--业务类型修改dialog-->

        <el-dialog title="上传文件" :visible.sync="dialogFormVisible" :close-on-click-modal = 'false' class="uploadB2C" @close="cleanDialogForm" custom-class="upload-dialog"  width="60%">
            <el-row :gutter="24">
                <el-col :span="11">
                    <el-form :model="uploadFileForm" ref="uploadFileForm" :rules="rules" label-width="110px">
                        <el-form-item label="文件类型" prop="isOrder">
                            <el-radio v-model="uploadFileForm.isOrder" label="false">账单</el-radio>
                            <el-radio v-model="uploadFileForm.isOrder" label="true" :disabled="uploadFileForm.dialogChannel != 6 && uploadFileForm.dialogChannel != 7">订单</el-radio>
                        </el-form-item>
                        <el-form-item label="支付类型" prop="payMethod">
                            <el-select size="small"  v-model="uploadFileForm.payMethod" filterable>
                                <el-option
                                        v-for="item in payMethodOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="售卖渠道" prop="dialogChannel">
                            <el-select size="small"  v-model="uploadFileForm.dialogChannel" filterable @change="changeDialogChannel">
                                <el-option
                                        v-for="item in dialogChannelOpt"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="品牌" prop="dialogBrand" v-if="isShowDialogBrand">
                            <el-select size="small"  v-model="uploadFileForm.dialogBrand" filterable>
                                <el-option value="">请选择</el-option>
                                <el-option
                                        v-for="item in brandsOpt"
                                        :key="item.brandId"
                                        :label="item.brandEnglishName"
                                        :value="item.brandEnglishName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="交易时间"  prop="transTime" :rules="{required: true, message: '交易时间不能为空', trigger: 'blur' }">
                            <el-date-picker v-model="uploadFileForm.transTime" type="date" placeholder="选择交易时间" value-format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>-->
                        <el-form-item label="交易开始时间"  prop="startTime" >
                            <el-date-picker v-model="uploadFileForm.startTime" type="date" placeholder="选择交易开始时间" value-format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="交易结束时间"  prop="endTime">
                            <el-date-picker v-model="uploadFileForm.endTime" type="date" placeholder="选择交易结束时间" value-format="yyyy-MM-dd" ></el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="10" >
                    <p style="margin-bottom:15px;">账单为从【账单下载】的数据。如下图所示:</p>
                    <img style="cursor: pointer;" @click="showFullPic = true"  title="点击查看大图"  src="../../../assets/aliPayBillDownload.png" alt="">
                </el-col>
            </el-row>
            <div    v-loading="loadFile"
                    element-loading-text = "上传中..."
                    element-loading-spinner = "el-icon-loading"
                    element-loading-background = "transparent">
                <el-upload  :action="getURL()" ref="importCommodity"
                            :multiple="true"
                            :file-list="fileList"
                            :on-change="handleChange"
                            :auto-upload="false"
                            :before-upload="beforeFileUpload"
                            :on-remove="removeFile"
                            :on-error="uploadError"
                            :on-success="uploadSuccess"
                            accept=".csv">
                    <el-button size="small" class="c-button c-button--primary">上传文件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传csv格式文件<span class="delete">(上传文件必须为整天数据，若数据库已存在该日数据，上传将清除之前上传的数据)</span></div>
                </el-upload>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="cancelUpload" class="c-button c-button--plain">取 消</el-button>
                <el-button size="small" type="primary" @click="importCommodity('uploadFileForm')" class="c-button c-button--primary" :disabled="uploadDisabled">确 定</el-button>
            </div>
        </el-dialog>
        <div v-show="showFullPic" @click="showFullPic = false" class="full-pic-div" >
            <img class="full-pic" src="../../../assets/aliPayBillDownload.png" alt="" >
            <div class="v-modal" tabindex="0" style="z-index: 20000;"></div>
        </div>
    </div>
</template>

<script>
    import ip from '../../../model/api'
    import tempIp from '../../../model/tempIp'
    import Vue from 'vue';
    import pageUtil from '../../../utils/dataViewUtil'
    export default {
        name: "dataView",

        data() {
            var validTime = (rule, value, callback) => {
               if (this.uploadFileForm.startTime  > this.uploadFileForm.endTime)
                {
                    callback(new Error('交易开始时间不能大于结束时间'));
                }
                else{
                    callback();
                }
            };
            return {
                tblHeaderConfig:{},
                importTmallAlipayUrl:tempIp.data_center+'/data/upload-tmall-alipay-paymodel',
                loadBusinessFile:false,
                isBusinessTimeOut:false,
                uploadBusinessDisabled:true,
                fileBusinessList:[],
                importBusinessOpreDialog:false,
                tmallAlipayBusDialog:false,
                tmallAlipayRowData:'',
                busniessType:[],
                busniessTypeOptions:[],
                updateBusniessTypeOptions:[],
                channelsOpt:[],
                dialogChannelOpt:[],
                brandsOpt:[],
                //typeOpt:[],
                bszNumbers:[],
                payMethodOpt:[],
                uploadObj:{},
                channels: 0,
                brand:'',
                ordertype: '',
                type: '',
                preTransDatetime:'',
                finalTransDatetime:'',
                dialogBrand:'',
                dialogChannel:'',
                isOrder: 'false',
                payMethod:'',
                tableData: [],
                currentPage: 1,
                pageSizesList: [25, 50, 75, 100, 125],
                pageSize: 25,
                totalRecords:0,
                resultName:'',
                value1: '',
                showFullPic : false,
                transmaxDate:'',
                transminDate:'',
                pickerOptions1:{
                    onPick:(dateRange)=>{
                        this.transminDate =  new Date(dateRange.minDate).getTime();
                        this.transmaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                },
                returnmaxDate:'',
                returnminDate:'',
                pickerOptions2: {
                   onPick:(dateRange)=>{
                        this.returnminDate =  new Date(dateRange.minDate).getTime();
                        this.returnmaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                },

                dialogFormVisible: false,
                loadFile:false,
                importUrl:'',
                fileList:[],
                fileCount:0,
                uploadDisabled:true,
                isTimeOut:false,
                uploadFileForm: {
                    isOrder: 'false',
                    payMethod:'',
                    dialogChannel:0,
                    dialogBrand:'',
                    transTime:'',
                    startTime:'',
                    endTime:''
                },
                rules:{
                    payMethod:[
                        { required: true, message: '请选择支付类型', trigger: 'change' }
                    ],
                    dialogChannel:[
                        { required: true, message: '请选择售卖渠道', trigger: 'change' }
                    ],
                    dialogBrand:[
                        { required: true, message: '请选择品牌', trigger: 'change' }
                    ],
                    startTime:[
                        { required: true, message: '交易开始时间不能为空', trigger: 'change' },
                        { validator: validTime, trigger: 'blur'}
                    ],
                    endTime:[
                        { required: true, message: '交易结束时间不能为空', trigger: 'change' },
                    ]
                },
                bszNumber:'',
                bill:false,
                orderShow:false,
                commodityType:'',
                commodityTypes:[{value:'',label:'请选择'}],
                preReturnDatetime:'',
                finalReturnDatetime:'',
                value2:'',
                sumSubTotal:'--',//订单金额汇总
                sumReturnAmount:'--',//退款金额汇总
                sumCardAmount:'--',
                sumPaidAmount:'--',
                totalNumShow:false,
                itemStatus:[],
                itemStatusAll:[],
                itemStatusOption:[],
                paymentModelsOption:[],
                paymentModels:[],
                downloadList:[],
                loadingList:false,
                loadSign:true,
                // exportTypes:['自有商城支付宝账单','自有商城订单','自有商城微信账单'],
                // vcExportTypes:['虚拟卡平台B2C支付宝账单','虚拟卡平台B2C订单','虚拟卡平台B2C微信账单'],
                // tmallExportTypes:['天猫商城支付宝账单','天猫商城订单'],
                exportConfig:[{
                    config : ['自有商城支付宝账单','自有商城订单','自有商城微信账单']
                },{
                    config : ['天猫商城支付宝账单','天猫商城订单','天猫商城支付宝可修改支付类型账单']
                },{
                    config : ['微信社交商城券订单','微信社交商城卡订单','微信社交商城微信账单']
                },{},{
                    config : ['虚拟卡平台B2C支付宝账单','虚拟卡平台B2C订单','虚拟卡平台B2C微信账单']
                },{
                    config : ['虚拟卡平台B2B原始订单','虚拟卡平台B2B二次销售订单']
                },{
                    config : ['口碑支付宝账单','口碑订单']
                },{
                    config : ['有赞订单','有赞微信账单']
                }],
                orderStatusOption:[],
                orderStatusAll:[],
                status:[],
                isVirtualCrad:false,
                vcOrderStatusOption:[],
                isTmall:false,
                isShowDialogBrand:true
            }
        },
        created(){
            Vue.directive('loadmore', {
                bind(el, binding) {
                    const selectWrap = el.querySelector('.el-table__body-wrapper');
                    selectWrap.addEventListener('scroll', function() {
                        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                        if(scrollDistance <= 0){
                            binding.value()
                        }
                    })
                }
            },{passive: true})
        },
         watch:{
            transminDate(val,oldVal){
                this.pickerOptions1 = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.transminDate =  new Date(dateRange.minDate).getTime();
                        this.transmaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                    disabledDate: (time) => {
                        if(this.common.isNullString(this.bszNumber) && this.transminDate){
                            return time.getTime() <= this.transminDate-31*24*60*60*1000 || time.getTime() >= this.transminDate + 31*24*60*60*1000;
                        }else{
                            return false;
                        }

                    }
                });
            },
            returnminDate(val,oldVal){
                this.pickerOptions2 = Object.assign({},{
                    onPick:(dateRange)=>{
                        this.returnminDate =  new Date(dateRange.minDate).getTime();
                        this.returnmaxDate =  new Date(dateRange.maxDate).getTime();
                    },
                    disabledDate: (time) => {
                        if(this.common.isNullString(this.bszNumber) && this.returnminDate){
                            return time.getTime() <= this.returnminDate-31*24*60*60*1000 || time.getTime() >= this.returnminDate + 31*24*60*60*1000;
                        }else{
                            return false;
                        }

                    }
                });
            },
            value1(val,oldVal){
                if(!val || (val &&val.length === 0)){
                    this.pickerOptions = Object.assign({},{
                        onPick:(dateRange)=>{
                            this.transminDate =  new Date(dateRange.minDate).getTime();
                            this.transmaxDate =  new Date(dateRange.maxDate).getTime();
                        },
                        disabledDate: (time) => {
                            return false;
                        }
                    });
                    this.transminDate = '';
                }
            },
            value2(val,oldVal){
                if(!val || (val &&val.length === 0)){
                    this.pickerOptions2 = Object.assign({},{
                        onPick:(dateRange)=>{
                            this.returnminDate =  new Date(dateRange.minDate).getTime();
                            this.returnmaxDate =  new Date(dateRange.maxDate).getTime();
                        },
                        disabledDate: (time) => {
                            return false;
                        }
                    });
                    this.returnminDate = '';
                }
            }
        },
        methods: {
            // 业务类型上传
            uploadBusniessType(){
             this.importBusinessOpreDialog = true
             this.fileBusinessList =[]
             this.uploadBusinessDisabled = true
             this.loadBusinessFile = false
             this.isBusinessTimeOut = false
            },

        importBusinessType(){
            this.loadBusinessFile = true
            this.$refs.importBusinessType.submit();
            this.uploadBusinessDisabled = true
        },
        uploadBusinessError(err, file, fileList){
            this.loadBusinessFile = false
            this.isBusinessTimeOut = true
            this.showTips('请求超时','warning')
        },
        uploadBusinessSuccess(response, file, fileList){
            if(response.code === 200)
            {
                this.$refs.importBusinessType.clearFiles();
                this.importBusinessOpreDialog = false
                this.showTips(response.data,'success')
            }
            else{
                this.showTips(response.msg,'warning')
            }
        },
        beforeBusinessFileUpload(file){
            let Xls = file.name.split('.');
            const isLt20M = file.size / 1024 / 1024 <= 20
            if(Xls[Xls.length - 1] === 'xls'||Xls[Xls.length - 1] === 'xlsx'){
                return file
            }else {
                this.showTips('上传文件只能是xlsx 格式!','warning')
                return false
            }
            if(!isLt20M){
                this.showTips('不能超过20M!','warning')
                return false
            }
        },
        removeBusinessFile(file,fileList){
            this.fileBusinessList=[]
            this.loadBusinessFile = false
            this.uploadBusinessDisabled = true
        },
        handleBusinessChange(file, fileList) {
           this.fileBusinessList = fileList.slice(-1)
           this.uploadBusinessDisabled = (this.fileBusinessList.length >0 ) ? false:true
           if(file.response || this.isTimeOut){
                this.fileBusinessList = []
                this.uploadBusinessDisabled = true
                this.loadBusinessFile = false
           }
        },
            // 业务类型上传
            getBusniessTypeOtions(){
              var that = this
              ip.getDictionaryByNumber('TMAL_ALIPAY_PAY_MODEL',function(res){
                that.busniessTypeOptions = [];
                that.updateBusniessTypeOptions= []
                 that.busniessTypeOptions.push({
                     value:'',
                     label:'请选择'
                 });
                res.data.forEach(function(item,index){
                    that.busniessTypeOptions.push(
                        {
                            value:item.dictionaryEntryCode,
                            label:item.dictionaryEntryName
                        }
                    )

                    that.updateBusniessTypeOptions.push(
                        {
                            value:item.dictionaryEntryCode,
                            label:item.dictionaryEntryName
                        }
                    )
                })
            });
            },
            submitEditTmall(){
                var that = this
                var param = [
                    {
                        name:'id',
                        value:this.tmallAlipayRowData.id
                    },
                    {
                        name:'paymentModel',
                        value:this.tmallAlipayRowData.paymentModel
                    }
                ]
                ip.updateTmallPaymodel(this.common.joinSearchParam(param),res=>{
                     if(res.code == 200){
                         that.getDataViewList()
                     }else{
                         that.common.warningMessage(res.msg)
                     }
                     that.tmallAlipayBusDialog = false
                })
            },
            editTmall(rowData){
                this.tmallAlipayBusDialog = true
                this.tmallAlipayRowData = rowData

            },
            changeDialogChannel(val){
                this.uploadFileForm.dialogChannel = val
                if(val == 4){
                   this.isShowDialogBrand = false
                   this.uploadFileForm.dialogBrand = ''
                }else{
                    this.isShowDialogBrand = true
                }
                if(val != 6){
                    this.uploadFileForm.isOrder = 'false';
                }
            },
            changeChannel(val){
                this.status = []
                this.itemStatus = []
                if(val == 0){
                   this.isVirtualCrad = false
                   this.isTmall = false
                }else if(val == 1){
                    this.isVirtualCrad = false
                    this.isTmall = true
                }else if(val == 4){
                    this.isVirtualCrad = true
                    this.isTmall = false
                }
                this.brand = '';
                this.type = '';
                this.value1 = '';
                this.preTransDatetime = '';
                this.finalTransDatetime = '';
                this.bszNumber = '';
                this.bszNumbers = [];
                this.value2 = '';
                this.preReturnDatetime = '';
                this.finalReturnDatetime = '';
                this.commodityType = '';
                this.paymentModels = []
                this.itemStatus = []
                this.status = []
                this.changeDialogChannel(val)
            },
            isHasAllSelect(statusArray,dictionaryEntryCode){
                if(statusArray.length >0){
                    if(statusArray.indexOf('OTHER_STATUS') != -1 && dictionaryEntryCode == 'OTHER_STATUS'){
                          return false
                    }else if(statusArray.indexOf('OTHER_STATUS') == -1) {
                        return false
                    }else{
                        return true
                    }
                }
                return false
            },
            changeOrderStatus(val){
                if(val[val.length-1] == 'OTHER_STATUS'){
                       this.status = ['OTHER_STATUS']
                }else{
                    if(val.indexOf('OTHER_STATUS') != -1){
                        val.splice(val.indexOf('OTHER_STATUS'),1)
                    }
                    this.status = val
                }
            },
            changeItemStatus(val){
                if(val[val.length-1] == 'OTHER_STATUS'){
                       this.itemStatus = ['OTHER_STATUS']
                }else{
                    if(val.indexOf('OTHER_STATUS') != -1){
                        val.splice(val.indexOf('OTHER_STATUS'),1)
                    }
                    this.itemStatus = val
                }
            },
            getDownloadList(param){
                var that = this;
                this.loadSign = true;
                this.listPageIndex = 1;
                param = this.common.joinSearchParam([
                {
                    value:this.exportConfig[Number(this.channels)].config,
                    name:'exportTypes'
                }])
                ip.getDownloadListDr(param,function(res){
                    res.code == 200 ? that.downloadList = res.data.list : that.downloadList = []
                })
            },
            loadMore () {
                let that = this;
                if (this.loadSign) {
                    this.loadingList = true;
                    this.listPageIndex++;
                    let param = this.common.joinSearchParam([{
                        value:this.listPageSize,
                        name:'pageSize'
                    },{
                        value:this.listPageIndex,
                        name:'pageIndex'
                    },
                    {
                        value:this.exportConfig[Number(this.channels)].config,
                        name:'exportTypes'
                    }])
                    ip.getDownloadListDr(param,function (res) {
                        that.loadingList = false;
                        if (res.code ===404 ) {
                            that.loadSign = false;
                            return false;
                        }else{
                            that.loadSign = true;
                            that.downloadList = that.downloadList.concat(res.data.list);
                        }
                    })
                }
            },
            handleSizeChange(size) {
                this.pageSize = size;
                this.getDataViewList();
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
                this.getDataViewList();
            },
            getDataRange(val){
                if(val){
                    this.preTransDatetime = val[0];
                    this.finalTransDatetime = val[1];
                }else{
                    this.preTransDatetime = '';
                    this.finalTransDatetime = '';
                }
            },
            getDataRange2(val){
                if(val){
                    this.preReturnDatetime = val[0];
                    this.finalReturnDatetime = val[1];
                }else{
                    this.preReturnDatetime = '';
                    this.finalReturnDatetime = '';
                }
            },
            getSelectObj(){
                var that = this;
                ip.getSearchList(res => {
                    res.data.channels.forEach(item => {
                        that.channelsOpt.push({value:item.code,label:item.message})
                    });
                    res.data.channels.forEach(item => {
                        if(item.message !== '虚拟卡订单平台'){
                          that.dialogChannelOpt.push({value:item.code,label:item.message})
                        }
                    });

                    // res.data.brands.forEach(item => {
                    //     that.brandsOpt.push({value:item.code,label:item.message})
                    // });
                    // res.data.types.forEach(item => {
                    //     that.typeOpt.push({value:item.code,label:item.message})
                    // });
                    res.data.payMethod.forEach(item => {
                        that.payMethodOpt.push({value:item.code,label:item.message})
                    });
                })

                ip.getDictionaryByNumber('ORDER_ITEM_STATUS',function(res){
                    if(res.code == 200){
                        that.itemStatusOption = res.data
                        that.itemStatusAll = []
                        that.itemStatusOption.forEach(function(item,index){
                          that.itemStatusAll.push(item.dictionaryEntryCode)
                        })
                    }else{
                        that.itemStatusAll = []
                        that.itemStatusOption = []
                    }
                })

                ip.getDictionaryByNumber('PAYMENT_MODEL',function(res){
                    if(res.code == 200){
                        that.paymentModelsOption = res.data
                    }else{
                        that.paymentModelsOption = []
                    }
                })

                ip.getDictionaryByNumber('ORDER_STATUS',function(res){
                    if(res.code == 200){
                        that.orderStatusOption = res.data
                        that.orderStatusAll = []
                        that.orderStatusOption.forEach(function(item,index){
                          that.orderStatusAll.push(item.dictionaryEntryCode)
                        })
                    }else{
                        that.orderStatusAll = []
                        that.orderStatusOption = []
                    }
                })

                ip.getDictionaryByNumber('VCP_ORDER_STATUS',function(res){
                    if(res.code == 200){
                        that.vcOrderStatusOption = res.data
                    }else{
                        that.vcOrderStatusOption = []
                    }
                })

            },
            getDataViewList(param){
                var that = this;
                var tem = [];
                var condition = this.getParam();
                if(this.bill){
                    condition.push({
                        name:'orderId',
                        value:this.bszNumber
                    })
                    if(this.isTmall){
                      condition.push({
                        name:'tmBillPaymentModel',
                        value:this.busniessType
                       })
                    }
                }else if(this.orderShow){
                    this.bszNumbers = this.bszNumber ?  this.bszNumbers : []
                    this.bszNumbers.forEach(function(item,index){
                        condition.push({
                            name: [0,1,4].includes(that.channels)? 'orderIds' : 'orderId',
                            value: item
                        })
                    })
                    condition.push({
                        name: 'itemStatus',
                        value: this.itemStatus.indexOf('OTHER_STATUS') == -1 ? this.itemStatus : this.itemStatusAll
                    })
                    condition.push({
                        name: 'paymentModels',
                        value: this.paymentModels
                    })
                    condition.push({
                        name: 'status',
                        value: this.status.indexOf('OTHER_STATUS') == -1 ? this.status : this.orderStatusAll
                    })
                }
                tem = this.common.joinSearchParam(condition);
                if(param === true){
                    tem = '';
                }
                if(this.common.isNullString(this.type)){
                   this.common.warningMessage('数据类型不能为空');
                   return
                }
                if(this.common.isNullString(this.bszNumber) && this.common.isNullString(this.preTransDatetime) && this.common.isNullString(this.finalTransDatetime))
                {
                   if(this.orderShow && !this.isTmall){
                       if(this.common.isNullString(this.preReturnDatetime ) && this.common.isNullString(this.finalReturnDatetime))
                      {
                        this.common.warningMessage('请选择账单日期/订单日期或退款日期');
                        return
                      }
                   }else{
                       this.common.warningMessage('请选择账单日期/订单日期');
                        return
                   }
                }
                ip.getDataList(tem,res => {
                    that.tableData = [];
                    that.totalRecords = 0;
                    that.sumSubTotal = '--'
                    that.sumReturnAmount = '--';
                    that.sumCardAmount = '--';
                    that.sumPaidAmount = '--';
                    if(res.code === 200){
                        that.resultName = res.data.resultName;
                        that.tblHeaderConfig = pageUtil.getTblHeaderConfig(that.resultName);
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords;
                        that.totalNumShow = false;
                        if(that.orderShow || that.type === '5'){
                            that.sumSubTotal = res.data.sumSubTotal||'';//订单金额汇总
                            that.sumReturnAmount = res.data.sumReturnAmount||'';
                            that.sumPaidAmount = res.data.sumPaidAmount ||'';
                            that.sumCardAmount = res.data.sumCardAmount ||'';
                            that.totalNumShow = true;
                        }
                    }else if(res.code === 404){
                        that.showTips(res.msg,'warning');
                    }else{
                        that.showTips(res.msg,'error');
                    }
                })
            },
            getParam(type){
                // if(type === 'download'){
                //     this.currentPage = null;
                //     this.pageSize = null;
                // }
                return  [
                    {
                        name:'pageIndex',
                        value:this.currentPage
                    },
                    {
                        name:'pageSize',
                        value:this.pageSize
                    },
                    {
                        name:'brand',
                        value:this.brand
                    },
                    {
                        name:'channel',
                        value:this.channels
                    },
                    {
                        name:'type',
                        value:this.type
                    },
                    {
                        name:'ordertype',
                        value:this.ordertype
                    },
                    {
                        name:'preTransDatetime',
                        value:this.preTransDatetime
                    },
                    {
                        name:'finalTransDatetime',
                        value:this.finalTransDatetime
                    },
                    {
                        name:'preReturnDatetime',
                        value:this.preReturnDatetime
                    },
                    {
                        name:'finalReturnDatetime',
                        value:this.finalReturnDatetime
                    },
                    {
                        name:'commodityType',
                        value:this.commodityType
                    }
                ];
            },
            exportFile(downloadType){
                var that = this;
                var tem = [];
                var param = this.getParam();
                if(this.bill){
                    param.push({
                        name:'orderId',
                        value:this.bszNumber
                    })
                    if(this.isTmall){
                        param.push({
                            name:'tmBillPaymentModel',
                            value:this.busniessType
                        })
                    }
                }else if(this.orderShow){
                    this.bszNumbers.forEach(function(item,index){
                        param.push({
                            name: [0,1,4].includes(that.channels)? 'orderIds' : 'orderId',//自有商城订单、虚拟卡平台B2C、天猫订单->orderIds
                            value: item
                        })
                    })
                    param.push({
                        name: 'itemStatus',
                        value: this.itemStatus.indexOf('OTHER_STATUS') == -1 ? this.itemStatus : this.itemStatusAll
                    })
                    param.push({
                        name: 'paymentModels',
                        value: this.paymentModels
                    })
                    param.push({
                        name: 'status',
                        value: this.status.indexOf('OTHER_STATUS') == -1 ? this.status : this.orderStatusAll
                    })
                }
                tem = this.common.joinSearchParam(param);
                if(downloadType === 'paymentTypeDownLoad'){
                    ip.exportPaymentTypeDataViewExcel(tem,function(res,headers){
                        that.downLoadCallBack(res,headers)
                    })
                }else{
                    ip.exportdataViewExcel(tem,function(res,headers){
                        that.downLoadCallBack(res,headers)
                    })
                }

            },
            downLoadCallBack(res,headers){
                let that = this;
                if(headers['content-disposition']){
                    let fileName = headers['content-disposition'].split(';')[1].split('=')[1];
                    let elink = document.createElement('a');
                    elink.download = fileName;
                    elink.href = res;
                    elink.target = '_blank';link.click();
                }else{
                    res.code == 200 ? that.common.messageUtil({
                        type:'success',
                        message:res.data
                    }) : that.common.messageUtil({
                        type:'error',
                        message:res.msg
                    })

                }
            },
            reset(){
                this.channels = 0;
                this.brand = '';
                this.type = '';
                this.value1 = '';
                this.preTransDatetime = '';
                this.finalTransDatetime = '';
                this.bszNumber = '';
                this.bszNumbers = [];
                this.value2 = '';
                this.preReturnDatetime = '';
                this.finalReturnDatetime = '';
                this.commodityType = '';
                this.paymentModels = []
                this.itemStatus = []
                this.status = []
            },
            showTips(text,type){
                this.common.messageUtil({
                    message: text,
                    type: type
                });
            },
            dataFormat(row,column,callValue,index){
                return this.common.formatDate(new Date(callValue),'yyyy-MM-dd hh:mm:ss')
            },
            getURL(){
                var param = [
                    {
                        name:'uuid',
                        value:this.uploadObj.uuid
                    },
                    {
                        name:'uploadTime',
                        value:this.uploadObj.uploadTime
                    }
                ];
                return this.importUrl = tempIp.data_center + '/data/upload-one' + this.common.joinSearchParam(param);
            },
            importCommodity(formName){
                var that = this;
                this.$refs[formName].validate(valid => {
                    if(valid){
                        that.loadFile = true;
                        that.$refs.importCommodity.submit();
                        that.uploadDisabled = true;
                    }else{
                        return false;
                    }
                })
            },
            getBszNumbers(event){
                if(!this.common.isNullString(event.target.value.trim())){
                    this.bszNumbers = event.target.value.split(/[;|；]|[ | ]/);
                }else{
                    this.bszNumbers = [];
                }
            },
            cancelUpload(){
                this.dialogFormVisible = false;
            },
            importFile(){
                let that = this;
                this.dialogFormVisible = true;
                this.uploadDisabled = true;
                this.loadFile = false;
                this.isTimeOut = false;
                ip.uploadStart('',function(result){
                    if(result.code == 200){
                        that.uploadObj = result.data;
                    }else{
                        that.showTips(result.data.msg);
                    }
                });
            },
            handleChange(file,fileList){
                this.uploadDisabled = fileList.length > 0 ? false : true;
                if(file.response || this.isTimeOut){
                    this.uploadDisabled = true;
                }
            },
            beforeFileUpload(file){
                let that = this;
                // const isLt20M = file.size / 1024 / 1024 <= 20;
                // if(!isLt20M){
                //    this.showTips('不能超过20M!','warning');
                //    return false
                // }
            },
            removeFile(file,fileList){
                if(fileList.length == 0){
                    this.loadFile = false;
                    this.uploadDisabled = true
                }
            },
            uploadError(err, file, fileList){
                this.loadFile = false;
                this.isTimeOut = true;
                this.showTips('请求超时','warning')
            },
            uploadSuccess(response, file, fileList){
                let that = this;
                const flieNum = fileList.length;
                this.fileCount++ ;
                if(response.code === 200){
                    if(this.fileCount == flieNum){
                        this.fileCount = 0;
                        this.loadFile = false;
                        let param = this.common.formatPathParam({
                            uuid : this.uploadObj.uuid,
                            uploadTime : this.uploadObj.uploadTime,
                            brand : this.uploadFileForm.dialogBrand,
                            channel : this.uploadFileForm.dialogChannel,
                            type : this.uploadFileForm.payMethod,
                            startTime : this.uploadFileForm.startTime,
                            endTime : this.uploadFileForm.endTime,
                            isOrder : this.uploadFileForm.isOrder
                        });
                        ip.uploadFinish(param,function(response){
                            if(response.code == 200){
                                that.$refs.importCommodity.clearFiles();
                                that.dialogFormVisible = false;
                                that.showTips(response.data,'success');
                            }else{
                                that.showTips(response.msg,'warning');
                                ip.uploadStart('',function(result){
                                    if(result.code == 200){
                                        that.uploadObj = result.data;
                                        that.$refs.importCommodity.clearFiles();
                                        //that.uploadDisabled = false;
                                    }else{
                                        that.showTips(result.data.msg);
                                    }
                                });

                            }
                        },function(){
                            that.common.messageUtil({
                                message: '请求超时',
                                type: 'warning',
                                onClose: function(){
                                    window.location.reload();
                                }
                            });
                        })
                    }
                }else{
                    if(!response.msg){
                        that.showTips('文件内容格式不正确','warning');
                    }else{
                        that.showTips(response.msg,'warning');
                    }
                    if(this.fileCount == flieNum){
                        this.fileCount = 0;
                        this.loadFile = false;
                        ip.uploadStart('',function(result){
                            if(result.code == 200){
                                that.uploadObj = result.data;
                                that.$refs.importCommodity.clearFiles();
                                that.uploadDisabled = false;
                            }else{
                                that.showTips(result.data.msg);
                            }
                        });
                    }
                }
            },
            cleanDialogForm(){
                //this.isOrder = 'false';
                this.$refs['uploadFileForm'].resetFields();
                this.$refs.importCommodity.clearFiles();
            },
            selectBill(val){
                if(val != 2){
                    this.bill = true;
                    this.orderShow = false;
                    this.bszNumber = '';
                }else{
                    this.orderShow = true;
                    this.bill = false;
                    this.bszNumber = '';
                }
            },
            getCommodityTypes(){
                let that = this;
                // that.commodityTypes = [{value:'',label:'请选择'}];
                ip.getCommodityTypeList('',function(res){
                    res.data.list.forEach(function (item,index) {
                        that.commodityTypes.push({value:item.commodityTypeId,label:item.commodityTypeName})
                    })
                })
            },
            getBrandName(){
               var that = this;
               ip.getBrandList('?pageSize=0&flag=2',function(result){
                     if(result.data.list){
                         that.brandsOpt = result.data.list
                     }else{
                         that.brandOptions = [];
                     }
                })
          },
        },
        beforeMount(){
            this.getSelectObj();
            this.getCommodityTypes();
            this.getBrandName();
            this.getBusniessTypeOtions()
        },

    }
</script>

<style lang="scss">
    @import '../../../assets/scss/center';
    @import '../../../assets/scss/dataView';
</style>

