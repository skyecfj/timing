<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="thirdBillData"
            :model="thirdBillData"
            :rules="rules"
            label-width="100px">
        <div class="viewFormThirdBill">
            <el-steps :active="active" finish-status="success">
                <el-step title="基础信息"></el-step>
                <el-step title="映射"></el-step>
            </el-steps>
            <div class="basicInfo" v-if="active === 0">
                <el-form-item label="名称" class="basicInfoInp" prop="configName">
                    <el-input v-on:input="URNames" size="small" maxlength="50" placeholder="请自定义名称" v-model="thirdBillData.configName" clearable :disabled="isDetails"></el-input>
                </el-form-item>
                <el-form-item label="获取方式" prop="getWay">
                    <el-radio-group v-model="thirdBillData.getWay" @change="thirdBillData.getLink = ''" :disabled="isDetails">
                        <el-radio :label="1">Kettle</el-radio>
                        <el-radio :label="2">手动导入</el-radio>
                        <el-radio :label="3">爬虫</el-radio>
                        <el-radio :label="4">邮箱</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 选择接口 -->
                <el-form-item v-if="thirdBillData.getWay === 1">
                    <el-select size="small"  v-model="thirdBillData.getLink" placeholder="请选择Kettle" :disabled="isDetails" filterable>
                        <el-option v-for="(item,index) in useAPI" :key="index" :label="item.configName" :value="item.id.toString()"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 选择爬虫 -->
                <el-form-item v-if="thirdBillData.getWay === 3">
                    <el-select size="small"  v-model="thirdBillData.getLink" placeholder="请选择爬虫" :disabled="isDetails" filterable>
                        <el-option v-for="item in useReptile" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select size="small"  v-model="thirdBillData.accountId" placeholder="请选择地址对应账号" :disabled="isDetails" filterable>
                        <el-option v-for="item in accountIdOpt" :key="item.id" :label="item.userName" :value="item.id">
                            <span style="float: left">{{ item.accountTitle }}</span>
                            <span style="float: right;">{{ item.userName }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <!-- 邮件标题 -->
                <el-form-item v-if="thirdBillData.getWay === 4">
                    <div v-for="(titleItem,titleIndex) in mailTitles" :key="titleIndex">
                        <el-input size="small" v-model="titleItem.title" class="basicInfoInp" @keyup.native="($event) => {return checkContent($event,titleIndex)}" :disabled="isDetails">
                            <template slot="prepend">邮件标题</template>
                        </el-input>
                        <el-button v-if="mailTitles.length > 1" size="small" icon="el-icon-minus" circle @click="removeMail(titleIndex)" :disabled="isDetails"></el-button>
                        <el-button v-if="( titleIndex + 1 ) === mailTitles.length" size="small" icon="el-icon-plus" circle @click="addMail" :disabled="isDetails"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="账单来源" prop="billSource">
                    <el-select size="small" v-model="thirdBillData.billSource" placeholder="请选择账单来源" :disabled="isDetails" filterable>
                        <el-option v-for="item in billSourceOpt" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可以手工获取" prop="manualImport">
                    <el-radio-group v-model="thirdBillData.manualImport"  :disabled="isDetails">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否提供订单明细" prop="provideDetail">
                    <el-radio-group v-model="thirdBillData.provideDetail" @change="isProvideDetail" :disabled="isDetails">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div class="orderDetails" v-if="thirdBillData.provideDetail === true">
                    <el-form-item label="是否计算百胜营业日期" prop="provideBsBusinessDate">
                        <el-radio-group v-model="thirdBillData.provideBsBusinessDate" :disabled="isDetails">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="thirdBillData.provideBsBusinessDate === true" prop="orderDelayInterval">
                        <el-input size="small" v-model.trim="thirdBillData.orderDelayInterval" placeholder="订单交易延迟时间" class="basicInfoInp" :disabled="isDetails">
                            <span slot="suffix">分钟</span>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item>
                    <el-button size="small" type="success" @click="next('thirdBillData')" class="c-button">下一步</el-button>
                </el-form-item>
            </div>
            <div class="map" v-else-if="active === 1">
                <el-collapse v-model="activeNames" accordion>
                    <el-collapse-item
                        v-for="(item,index) in thirdBillData.configItemDTOS"
                        :key="index"
                        :name="index">
                        <template slot="title">
                            {{item.mappingConfigName}}
                            <span class="collapse">
                                <el-button type="text" class="delete" v-if="thirdBillData.configItemDTOS.length > 1" @click="thirdBillDeleteRow(index)" :disabled="isDetails"><i class="el-icon-delete"></i>删除</el-button>
                                <el-button type="text" class="add" v-if="(index + 1) === thirdBillData.configItemDTOS.length" @click="thirdBillAddRow()" :disabled="isDetails"><i class="el-icon-circle-plus"></i>新增一条</el-button>
                            </span>
                        </template>
                        <div
                            class="content"
                            v-for="(billTypeItem,billTypeIndex) in item.thirdBillConfigDetailDTOS"
                            :key="billTypeIndex"
                            :ref="'content_' + index + '_' + billTypeItem.billType"
                            :style="billTypeIndex === 0 && item.thirdBillConfigDetailDTOS.length > 1 ? {display:'none'} : {display:'inline-block'}">
                            <el-form-item class="contentButton">
                                <el-button class="left" :class="billTypeItem.billType === 1 ? 'active' : ''" @click="handleOrderBillDetails(index,billTypeItem.billType,billTypeIndex)"
                                           :disabled="!thirdBillData.provideDetail || (isDetails && item.thirdBillConfigDetailDTOS.length<2)">订单</el-button>
                                <el-button class="right" :class="billTypeItem.billType === 2 ? 'active' : ''"
                                        @click="handleStoreDayBillDetails(index,billTypeItem.billType,billTypeIndex)" :disabled="(isDetails && item.thirdBillConfigDetailDTOS.length<2)">店天</el-button>
                            </el-form-item>
                            <el-form-item
                                label="名称"
                                class="basicInfoInp"
                                :prop="(item.thirdBillConfigDetailDTOS.length > 1 && billTypeIndex === 1) ? 'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + 0 + '.originalBillName' : 'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.originalBillName'"
                                :rules="[{ required: true, message: '请输入自定义名称', trigger: 'blur' }]">
                                <el-input v-if="item.thirdBillConfigDetailDTOS.length > 1 && billTypeIndex === 1" size="small" maxlength="100" placeholder="请输入自定义名称" v-model="item.thirdBillConfigDetailDTOS[0].originalBillName" clearable disabled></el-input>
                                <el-input v-else size="small" maxlength="100" v-on:input="unifiedName($event,index)" placeholder="请输入自定义名称" v-model="billTypeItem.originalBillName" clearable :disabled="isDetails"></el-input>
                            </el-form-item>
                            <el-form-item
                                :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.fileList'"
                                :rules="[{ required: true, message: '请上传源文件账单' }]">
                                <div v-loading="billTypeItem.loadFile"
                                    class="upload"
                                    element-loading-text = "上传中..."
                                    element-loading-spinner = "el-icon-loading"
                                    element-loading-background = "transparent">
                                    <el-upload
                                        :action="billTypeItem.importUrl"
                                        ref="importBill"
                                        accept=".csv,.xlsx,.xls"
                                        :file-list="billTypeItem.fileList"
                                        :before-upload="beforeFileUpload"
                                        :on-remove="(file,fileList) => {return removeFile(file,fileList,index,billTypeIndex)}"
                                        :on-error="(err,file,fileList) => {return uploadError(err,file,fileList,index,billTypeIndex)}"
                                        :on-success="(response,file,fileList) => {return uploadSuccess(response,file,fileList,index,billTypeIndex)}"
                                        :disabled="isDetails">
                                        <el-button type="text"><i class="fa fa-upload fa-5x"></i></el-button>
                                        <div slot="tip" class="el-upload__tip">
                                            <p>请选择文件上传</p>
                                            <p style="color: #E3E3E3">仅支持单个上传，只能上传csv/xlsx/xls格式文件，且不超过1M</p>
                                        </div>
                                    </el-upload>
                                </div>
                                <el-button size="small"  type="success" class="c-button" @click="exportFile(index,billTypeIndex)" :disabled="billTypeItem.originalBillFilePath==='' || billTypeItem.originalBillFilePath===null"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                            </el-form-item>
                            <el-form-item label="百胜店号映射">
                                <el-select size="small" v-model="billTypeItem.mapFileColumn" :disabled="isDetails" filterable>
                                    <el-option value="" label="请选择"></el-option>
                                    <el-option v-for="item in billTypeItem.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-if="billTypeItem.mapFileColumn"
                                :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.fileListMap'"
                                :rules="[{ required: true, message: '请上传映射文件账单' }]">
                                <div v-loading="billTypeItem.loadFileMap"
                                    class="upload"
                                    element-loading-text = "上传中..."
                                    element-loading-spinner = "el-icon-loading"
                                    element-loading-background = "transparent">
                                    <el-upload
                                        :action="billTypeItem.importUrlMap"
                                        ref="importBill"
                                        accept=".csv,.xlsx,xls"
                                        :file-list="billTypeItem.fileListMap"
                                        :before-upload="beforeFileUploadMap"
                                        :on-remove="(file,fileList) => {return removeFileMap(file,fileList,index,billTypeIndex)}"
                                        :on-error="(err,file,fileList) => {return uploadErrorMap(err,file,fileList,index,billTypeIndex)}"
                                        :on-success="(response,file,fileList) => {return uploadSuccessMap(response,file,fileList,index,billTypeIndex)}"
                                        :disabled="isDetails">
                                        <el-button type="text"><i class="fa fa-upload fa-5x"></i></el-button>
                                        <div slot="tip" class="el-upload__tip">
                                            <p>请选择文件上传</p>
                                            <p style="color: #E3E3E3">仅支持单个上传，只能上传csv/xlsx/xls格式文件，且不超过1M</p>
                                        </div>
                                    </el-upload>
                                </div>
                                <el-button size="small"  type="success" class="c-button" @click="exportFileMap(index,billTypeIndex)" :disabled="billTypeItem.mapFilePath==='' || billTypeItem.mapFilePath===null"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                            </el-form-item>
                            <el-form-item
                                v-else
                                :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.fileListMap'"
                                :rules="[]">
                                <div v-loading="billTypeItem.loadFileMap"
                                    class="upload"
                                    element-loading-text = "上传中..."
                                    element-loading-spinner = "el-icon-loading"
                                    element-loading-background = "transparent">
                                    <el-upload
                                        :action="billTypeItem.importUrlMap"
                                        ref="importBill"
                                        accept=".csv,.xlsx,xls"
                                        :file-list="billTypeItem.fileListMap"
                                        :before-upload="beforeFileUploadMap"
                                        :on-remove="(file,fileList) => {return removeFileMap(file,fileList,index,billTypeIndex)}"
                                        :on-error="(err,file,fileList) => {return uploadErrorMap(err,file,fileList,index,billTypeIndex)}"
                                        :on-success="(response,file,fileList) => {return uploadSuccessMap(response,file,fileList,index,billTypeIndex)}"
                                        :disabled="isDetails">
                                        <el-button type="text"><i class="fa fa-upload fa-5x"></i></el-button>
                                        <div slot="tip" class="el-upload__tip">
                                            <p>请选择文件上传</p>
                                            <p style="color: #E3E3E3">仅支持单个上传，只能上传csv/xlsx/xls格式文件，且不超过1M</p>
                                        </div>
                                    </el-upload>
                                </div>
                                <el-button size="small"  type="success" class="c-button" @click="exportFileMap(index,billTypeIndex)" :disabled="billTypeItem.mapFilePath==='' || billTypeItem.mapFilePath===null"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                            </el-form-item>
                            <el-form-item
                                    :label="billTypeItem.billType === 1 ? '订单来自第几个Sheet页' : '店天来自第几个Sheet页'"
                                    class="basicInfoInp"
                                    :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.sheetSeq'"
                                    :rules="[
                                        { required: true, message: '请输入页数' },
                                        { type: 'number', message: '页数必须为数字值'}
                                    ]">
                                <el-input size="small"  placeholder="e.g. 5" v-model.number="billTypeItem.sheetSeq" clearable :disabled="isDetails"></el-input>
                            </el-form-item>
                            <el-form-item label="数据读取范围" class="ReadRange">
                                <span>
                                    <el-form-item
                                         class="rangeItem"
                                         :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.dataStartRow'"
                                         :rules="startReadRange">
                                        <el-input size="small" v-model.trim="billTypeItem.dataStartRow" :disabled="isDetails">
                                            <template slot="prepend">第</template>
                                            <template slot="append">行</template>
                                        </el-input>
                                    </el-form-item>
                                    &nbsp;&nbsp;至&nbsp;&nbsp;
                                    <el-form-item
                                         class="rangeItem"
                                         :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.dataEndRow'"
                                         :rules="readRange">
                                        <el-input size="small"  v-model.trim="billTypeItem.dataEndRow" :disabled="isDetails">
                                            <template slot="prepend">第</template>
                                            <template slot="append">行</template>
                                        </el-input>
                                    </el-form-item>
                                </span>
                            </el-form-item>
                            <el-form-item label="手续费总额" class="ReadRange">
                                <span>
                                    <el-form-item
                                            class="rangeItem"
                                            :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.handingChargeRow'"
                                            :rules="readRange">
                                        <el-input size="small" v-model.trim="billTypeItem.handingChargeRow" :disabled="isDetails" v-on:input="(val) => {return clearHandingCharge(val,index,billTypeIndex)}">
                                            <template slot="prepend">第</template>
                                            <template slot="append">行</template>
                                        </el-input>
                                    </el-form-item>
                                    &nbsp;&nbsp;至&nbsp;&nbsp;
                                    <el-form-item
                                            class="rangeItem"
                                            :prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.handingChargeColumn'"
                                            :rules="readRange">
                                        <el-input size="small" v-model.trim="billTypeItem.handingChargeColumn" :disabled="isDetails" v-on:input="(val) => {return clearHandingCharge(val,index,billTypeIndex)}">
                                            <template slot="prepend">第</template>
                                            <template slot="append">列</template>
                                        </el-input>
                                    </el-form-item>
                                </span>
                            </el-form-item>
                            <el-form-item
                                    label="去除行关键字(若多个，则用';'分号分隔)"
                                    class="basicInfoInp">
                                    <!--:prop="'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.rowKeywordsRemove'"-->
                                    <!--:rules="removeKey">-->
                                <el-input size="small"  placeholder="请输入关键字" v-model="billTypeItem.rowKeywordsRemove" clearable :disabled="isDetails"></el-input>
                            </el-form-item>
                            <el-form-item label="筛选条件" class="filterCondition">
                                <div class="dataConfig">
                                    <p v-for="(itemFilter,indexFilter) in billTypeItem.filterDTOS" :key="indexFilter">
                                        <el-select size="small" v-model="itemFilter.columnOrValue" placeholder="请选择字段" class="dataConfig_select" :disabled="isDetails" filterable>
                                            <el-option value="" label="请选择"></el-option>
                                            <el-option v-for="item in billTypeItem.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                        <el-input size="small" v-model.trim="itemFilter.value" clearable class="dataConfig_input" :disabled="isDetails"></el-input>
                                        <el-select @change="(val) => {return unifyDataCondition(val,billTypeItem)}" size="small" v-model="itemFilter.dataCondition" class="dataConfig_condition" :disabled="isDetails" filterable>
                                            <el-option v-for="item in dataConditionOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                        <el-button v-if="billTypeItem.filterDTOS.length > 1" size="small" icon="el-icon-minus" circle @click="removeRow(index,billTypeIndex,indexFilter)" :disabled="isDetails"></el-button>
                                        <el-button v-if="( indexFilter + 1 ) === billTypeItem.filterDTOS.length" size="small" icon="el-icon-plus" circle @click="addRow(index,billTypeIndex,itemFilter)" :disabled="isDetails"></el-button>
                                    </p>
                                </div>
                            </el-form-item>
                            <strong>标准格式映射</strong>
                            <el-form-item
                                    class="standard"
                                    :label="itemColumn.standardColumnName"
                                    v-for="(itemColumn,indexColumn) in billTypeItem.thirdBillConfigColumnDTOS"
                                    :key="indexColumn"
                                    :prop="!(thirdBillData.provideDetail === true && thirdBillData.provideBsBusinessDate === true && billTypeItem.billType === 1 && itemColumn.standardColumnName === '营业日期') &&
                                        judgeCondition.includes(itemColumn.standardColumnName)
                                        && itemColumn.valueType === 1 ?
                                        'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.thirdBillConfigColumnDTOS.' + indexColumn + '.originalColumnCode' :
                                        (judgeCondition.includes(itemColumn.standardColumnName) && itemColumn.valueType === 2 ?
                                        'configItemDTOS.' + index + '.thirdBillConfigDetailDTOS.' + billTypeIndex + '.thirdBillConfigColumnDTOS.' + indexColumn + '.valueType' : '')"
                                    :rules="!(thirdBillData.provideDetail === true && thirdBillData.provideBsBusinessDate === true && billTypeItem.billType === 1 && itemColumn.standardColumnName === '营业日期') &&
                                        judgeCondition.includes(itemColumn.standardColumnName)
                                           && itemColumn.valueType === 1 ?
                                        { required: true, message: '请选择', trigger: ['change','blur'] } :
                                        (judgeCondition.includes(itemColumn.standardColumnName) && itemColumn.valueType === 2 ?
                                        { required: true, message: '请设置参数', trigger: ['change','blur'] } : {})">
                                <el-select
                                        v-if="billTypeItem.billType === 1 && (itemColumn.standardColumnName === '营业日期' ||
                                        itemColumn.standardColumnName === '交易日期' || itemColumn.standardColumnName === '与BOH核对金额' || itemColumn.standardColumnName === '餐厅应收')"
                                        filterable
                                        size="small"
                                        v-model="itemColumn.originalColumnCode"
                                        placeholder="请选择"
                                        @change="forceUpdate"
                                        disabled>
                                    <el-option :value="null" label="请选择"></el-option>
                                    <el-option v-for="item in orderFileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <el-select
                                        v-else-if="billTypeItem.billType === 2 && (itemColumn.standardColumnName === '营业日期' ||
                                        itemColumn.standardColumnName === '交易日期' || itemColumn.standardColumnName === '与BOH核对金额' || itemColumn.standardColumnName === '餐厅应收')"
                                        filterable
                                        size="small"
                                        @change="forceUpdate"
                                        v-model="itemColumn.originalColumnCode"
                                        placeholder="请选择"
                                        disabled>
                                    <el-option :value="null" label="请选择"></el-option>
                                    <el-option v-for="item in storeDayFileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                                <el-select
                                        v-else
                                        filterable
                                        size="small"
                                        v-model="itemColumn.originalColumnCode"
                                        placeholder="请选择"
                                        @change="forceUpdate"
                                        :disabled = "isDetails || itemColumn.valueType === 2 || (itemColumn.standardColumnName === '手续费' &&
                                        ((billTypeItem.handingChargeRow!==null && billTypeItem.handingChargeRow!=='') || (billTypeItem.handingChargeColumn!==null && billTypeItem.handingChargeColumn!=='')))">
                                    <el-option :value="null" label="请选择"></el-option>
                                    <el-option v-for="item in billTypeItem.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>&nbsp;&nbsp;
                                <el-button
                                        v-if="itemColumn.isSet"
                                        :disabled = "(itemColumn.standardColumnName === '餐厅应收'||thirdBillData.provideDetail === true && thirdBillData.provideBsBusinessDate === true && billTypeItem.billType === 1 && itemColumn.standardColumnName === '营业日期') || isDetails || (itemColumn.standardColumnName === '手续费' && ((billTypeItem.handingChargeRow!==null && billTypeItem.handingChargeRow!=='') || (billTypeItem.handingChargeColumn!==null && billTypeItem.handingChargeColumn!=='')))"
                                        size="small"
                                        type="success"
                                        class="c-button"
                                        @click="clearAmount(indexColumn,index,billTypeIndex,billTypeItem.billType,itemColumn.standardColumnName)">清空
                                </el-button>
                                <el-button
                                        v-if="itemColumn.isSet"
                                        :disabled = "itemColumn.standardColumnName === '其他' ||itemColumn.standardColumnName === '券名称'|| (thirdBillData.provideDetail === true && thirdBillData.provideBsBusinessDate === true
                                        && billTypeItem.billType === 1 && itemColumn.standardColumnName === '营业日期') || (itemColumn.originalColumnCode !== null && itemColumn.originalColumnCode !== '' )
                                        || (itemColumn.standardColumnName === '手续费' && ((billTypeItem.handingChargeRow!==null && billTypeItem.handingChargeRow!=='')
                                        || (billTypeItem.handingChargeColumn!==null && billTypeItem.handingChargeColumn!=='')))"
                                        size="small"
                                        type="success"
                                        class="c-button"
                                        @click="setAmount(indexColumn,index,billTypeIndex,billTypeItem.billType,itemColumn.standardColumnName)">
                                    <span v-if="itemColumn.valueType === 2" :key="'setedBtn_'+indexColumn">已设置</span>
                                    <span v-else :key="'setBtn_'+indexColumn">设置</span>
                                </el-button>
                                <el-checkbox @change="(val) => {return separateSettle(val,index,billTypeIndex,indexColumn,itemColumn.standardColumnName)}"
                                             v-if="itemColumn.standardColumnName === '顾客实付' || itemColumn.standardColumnName === '第三方补贴'" v-model="itemColumn.separateSettlement">是否单独结算</el-checkbox>
                                <el-checkbox @change="(val) => {return amountSymbolSettle(val,index,billTypeIndex,indexColumn,itemColumn.standardColumnName)}"
                                             v-if="itemColumn.standardColumnName === '顾客实付' || itemColumn.standardColumnName === '交易金额'" v-model="itemColumn.amountSymbol">正负标准字段</el-checkbox>
                            </el-form-item>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <br><br>
                <el-button size="small" type="success" plain class="c-button" @click="before">上一步</el-button>
                <el-button size="small" type="success" class="c-button" @click="saveThirdBill('thirdBillData')" :disabled="isDetails">保存</el-button>
            </div>
        </div>
        <!-- 数据项配置 -->
        <el-dialog :title="dialogName" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="55%" @close="clearAmountForm(amountForm.index,amountForm.billTypeIndex,amountForm.indexColumn)">
            <el-form :model="amountForm" ref="amountForm">
                <el-form-item v-for="(itemFrom,indexFrom) in amountForm.content" :key="indexFrom">
                    <el-select v-model="itemFrom.valueType" class="formSelect" @change="clearColumnOrValue(indexFrom)" :disabled="amountForm.standardColumnName === '餐厅应收' || isDetails" filterable>
                        <el-option v-for="item in valueTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-form-item v-if="itemFrom.valueType === 1" class="formInp" :prop="'content.' + indexFrom + '.columnOrValue'" :rules="columnOrValue" :ref="'columnOrValue' + indexFrom">
                         <el-select v-model="itemFrom.columnOrValue" @change="(val) => {return getEnglishColumnName(val,indexFrom,amountForm.standardColumnName)}" class="formSelect" :disabled="amountForm.standardColumnName === '餐厅应收' || isDetails" filterable>
                             <el-option v-for="item in amountForm.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                         </el-select>
                    </el-form-item>
                    <el-form-item v-else-if="itemFrom.valueType === 2" class="formInp" :prop="'content.' + indexFrom + '.value'" :rules="amountForm.standardColumnName === '顾客实付'?orderDelayInterval2:orderDelayInterval" :ref="'columnOrValue' + indexFrom">
                         <el-input placeholder="请输入数值" v-model="itemFrom.value" clearable :disabled="amountForm.standardColumnName === '餐厅应收' || isDetails"></el-input>
                    </el-form-item>
                    <el-form-item v-if="amountForm.standardColumnName === '营业日期' && itemFrom.valueType === 1" class="formInp" :disabled="isDetails">
                        <el-select v-model="itemFrom.value" class="formSelect" filterable>
                            <el-option v-for="item in tradeDateFormat" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-select v-model="itemFrom.dataCondition" @change="val => {return getDataCondition(val,indexFrom)}" class="formSelect" :disabled="amountForm.standardColumnName === '餐厅应收' || isDetails" filterable>
                        <el-option label="无" value=""></el-option>
                        <el-option v-for="(item,index) in dataConditionOpt2" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDetails && amountForm.standardColumnName !== '餐厅应收'">
                <el-button size="small" class="c-button" plain @click="dialogFormVisible = false">取 消</el-button>
                <el-button size="small" class="c-button" type="success" @click="saveDataConfig(amountForm.indexColumn,amountForm.index,amountForm.billTypeIndex,amountForm.standardColumnName,'amountForm')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 数据项配置 -->
        <!-- 设置 -->
        <el-dialog :title="dialogName" v-if="dialogBizDate" :visible.sync="dialogBizDate" class="setBizDate" @close="clearAmountForm(amountForm.index,amountForm.billTypeIndex,amountForm.indexColumn)">
            <el-form :model="amountForm" ref="amountForm">
                <el-form-item label="交易时间位置">
                    <el-radio-group v-model="amountForm.content[0].columnPosition" :disabled="isDetails">
                        <el-radio :label="1">列</el-radio>
                        <el-radio :label="2">行</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="amountForm.content[0].columnPosition === 1">
                    <el-form-item label="交易时间格式">
                        <el-radio-group v-model="amountForm.content[0].dateType" :disabled="isDetails">
                            <el-radio :label="1">日期&时分秒</el-radio>
                            <el-radio :label="2">日期||时分秒</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-select class="datePos" v-model="amountForm.content[0].columnOrValue" :disabled="isDetails" filterable>
                        <el-option v-for="item in amountForm.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-if="amountForm.content[0].dateType === 2" class="datePos bigDataPos" v-model="amountForm.content[0].value" :disabled="isDetails" filterable>
                        <el-option v-for="item in tradeDateFormat" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                    <el-select v-else class="datePos bigDataPos" v-model="amountForm.content[0].value" :disabled="isDetails" filterable>
                        <el-option v-for="item in tradeDateTimeFormat" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                    <el-select v-if="amountForm.content[0].dateType === 2 && amountForm.billType === 1" class="datePos" v-model="amountForm.content[1].columnOrValue" :disabled="isDetails" filterable>
                        <el-option v-for="item in amountForm.fileColumns" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-select v-if="amountForm.content[0].dateType === 2 && amountForm.billType === 1" class="datePos" v-model="amountForm.content[1].value" :disabled="isDetails" filterable>
                        <el-option v-for="item in tradeTimeFormat" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                    <el-select class="dataConPos" placeholder="" v-model="amountForm.content[0].dataCondition" :disabled="isDetails" filterable>
                        <el-option label="无" value=""></el-option>
                        <el-option label="+" value="+"></el-option>
                        <el-option label="-" value="-"></el-option>
                    </el-select>
                    <el-input v-if="amountForm.content[0].dataCondition === '+' || amountForm.content[0].dataCondition === '-'" class="datePos" placeholder="单行输入" size="small" v-model="amountForm.content[2].value" :disabled="isDetails"></el-input>
                </div>
                <div v-else-if="amountForm.content[0].columnPosition === 2">
                    <el-input class="datePos" size="small" v-model="amountForm.content[0].dateType" :disabled="isDetails">
                        <template slot="prepend">第</template>
                        <template slot="append">行</template>
                    </el-input>
                    <el-input class="datePos" size="small" v-model="amountForm.content[0].valueType" :disabled="isDetails">
                        <template slot="prepend">第</template>
                        <template slot="append">列</template>
                    </el-input>
                    <el-select class="datePos" v-model="amountForm.content[0].value" :disabled="isDetails" filterable>
                        <el-option v-for="item in tradeDateFormat" :key="item.dictionaryEntryCode" :label="item.dictionaryEntryName" :value="item.dictionaryEntryCode"></el-option>
                    </el-select>
                    <el-select class="dataConPos" placeholder="" v-model="amountForm.content[0].dataCondition" :disabled="isDetails" filterable>
                        <el-option label="+" value="+"></el-option>
                        <el-option label="-" value="-"></el-option>
                        <el-option label="无" value=""></el-option>
                    </el-select>
                    <el-input class="datePos" placeholder="单行输入" size="small" v-model="amountForm.content[0].columnOrValue" :disabled="isDetails"></el-input><br><br>
                    <el-input class="datePos" size="small" v-model="amountForm.content[0].startBit" :disabled="isDetails">
                        <template slot="prepend">第</template>
                        <template slot="append">位</template>
                    </el-input>&nbsp;&nbsp;至&nbsp;&nbsp;
                    <el-input class="datePos" size="small" v-model="amountForm.content[0].endBit" :disabled="isDetails">
                        <template slot="prepend">第</template>
                        <template slot="append">位</template>
                    </el-input>&nbsp;&nbsp;<span>字段截取</span>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="!isDetails">
                <el-button size="small" class="c-button" plain @click="dialogBizDate = false">取 消</el-button>
                <el-button size="small" class="c-button" type="success" @click="saveDataConfig(amountForm.indexColumn,amountForm.index,amountForm.billTypeIndex,amountForm.standardColumnName)">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 设置 -->
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    import tempIp from '../../model/tempIp'
    const defaultConfig = {
        columnPosition: 1,
        dataCondition: null,
        columnOrValue: null,
        valueType: 1,
        value: null
    };
    const defaultConfigDate = {
        columnPosition:1,
        dateType:1,
        valueType:1
    };
    const storeReceivable = [{
        columnOrValue:'顾客实付',
        columnPosition:1,
        dataCondition:'+',
        englishColumnName:'acturalAmount',
        value:null,
        valueType:1
    },{
        columnOrValue:'第三方补贴',
        columnPosition:1,
        dataCondition:'+',
        englishColumnName:'thirdSubsidy',
        value:null,
        valueType:1
    },{
        columnOrValue:'随机红包(第三方)',
        columnPosition:1,
        dataCondition:'-',
        englishColumnName:'randomRedBag',
        value:null,
        valueType:1
    },{
        columnOrValue:'配送费(第三方)',
        columnPosition:1,
        dataCondition:'-',
        englishColumnName:'thirdShippingFee',
        value:null,
        valueType:1
    },{
        columnOrValue:'手续费',
        columnPosition:1,
        dataCondition:'-',
        englishColumnName:'handingCharge',
        value:null,
        valueType:1
    },{
        columnOrValue:'服务费(第三方)',
        columnPosition:1,
        dataCondition:'-',
        englishColumnName:'serviceCharge',
        value:null,
        valueType:1
    },{
        columnOrValue:'包装费(第三方)',
        columnPosition:1,
        dataCondition:null,
        englishColumnName:'thirdPackagingFee',
        value:null,
        valueType:1
    }];
    var orderFileColumns = [];
    var storeDayFileColumns = [];
    var orderDefaultColumn = [];
    var storeDayDefaultColumn = [];
    var isMoney = false;
    var standardColumnNames = [[
        '订单编号,orderNo','POS交易号,posTradeNo','商户编号,businessNo','消费者账户,consumerAccount','送餐餐厅,deliveryStoreCode',
        '交易日期,tradeDate','营业日期,bizDate','交易金额,tradeAmount','顾客实付,acturalAmount','第三方补贴,thirdSubsidy',
        '随机红包(第三方),randomRedBag','百胜补贴,bsSubsidy','手续费,handingCharge','服务费(第三方),serviceCharge',
        '包装费(百胜),packagingFee','包装费(第三方),thirdPackagingFee','配送费(第三方),thirdShippingFee',
        '配送费(百胜),bsShippingFee','与BOH核对金额,bohCheckAmount','餐厅应收,storeReceivable','券名称,others','其他,others1','开票金额,invoiceAmount'
    ],[
        '送餐餐厅,deliveryStoreCode','交易日期,tradeDate','营业日期,bizDate','交易金额,tradeAmount',
        '顾客实付,acturalAmount','第三方补贴,thirdSubsidy','随机红包(第三方),randomRedBag','百胜补贴,bsSubsidy',
        '手续费,handingCharge','服务费(第三方),serviceCharge','包装费(百胜),packagingFee','包装费(第三方),thirdPackagingFee',
        '配送费(第三方),thirdShippingFee','配送费(百胜),bsShippingFee','与BOH核对金额,bohCheckAmount','餐厅应收,storeReceivable',
        '券名称,others','其他,others1','开票金额,invoiceAmount'
    ]];
    standardColumnNames.forEach((names,index) => {
        if(index === 0){
            //订单
            names.forEach(name => {
                orderFileColumns.push({value:name.split(',')[1],label:name.split(',')[0]});
                if(name === '交易日期,tradeDate'){
                    isMoney = true;
                }
                if(!isMoney){
                    orderDefaultColumn.push({
                        standardColumnName:name.split(',')[0],
                        standardEnglishName:name.split(',')[1],
                        originalColumnCode:null,
                        separateSettlement:false,
                        amountSymbol:false,
                        isSet:false,//没有设置按钮
                        valueType:1,
                        // startBit:'',
                        // endBit:''
                    })
                }else{
                    if(name === '交易日期,tradeDate'){
                        orderDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:1,
                            dataConfigDTOS:[Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate)]
                        })
                    }else if(name === '与BOH核对金额,bohCheckAmount' || name === '开票金额,invoiceAmount'){
                        orderDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:2,
                            dataConfigDTOS:[{
                                columnOrValue:'顾客实付',
                                columnPosition:1,
                                dataCondition:'+',
                                englishColumnName:'acturalAmount',
                                value:null,
                                valueType:1
                            },{
                                columnOrValue:'第三方补贴',
                                columnPosition:1,
                                dataCondition:'+',
                                englishColumnName:'thirdSubsidy',
                                value:null,
                                valueType:1
                            },{
                                columnOrValue:'百胜补贴',
                                columnPosition:1,
                                dataCondition:null,
                                englishColumnName:'bsSubsidy',
                                value:null,
                                valueType:1
                            }]
                        })
                    }else if(name === '餐厅应收,storeReceivable'){
                        orderDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:2,
                            dataConfigDTOS:JSON.parse(JSON.stringify(storeReceivable))
                        })
                    }else{
                        orderDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:1,
                            dataConfigDTOS:[JSON.parse(JSON.stringify(defaultConfig))]
                        })
                    }
                }
            });
            isMoney = false;
        }else if(index === 1){
            //店天
            names.forEach(name => {
                storeDayFileColumns.push({value:name.split(',')[1],label:name.split(',')[0]});
                if(name === '交易日期,tradeDate'){
                    isMoney = true;
                }
                if(!isMoney){
                    storeDayDefaultColumn.push({
                        standardColumnName:name.split(',')[0],
                        standardEnglishName:name.split(',')[1],
                        originalColumnCode:null,
                        separateSettlement:false,
                        amountSymbol:false,
                        isSet:false,//没有设置按钮
                        valueType:1
                    })
                }else{
                    if(name === '交易日期,tradeDate'){
                        storeDayDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:1,
                            dataConfigDTOS:[Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate)]
                        })
                    }else if(name === '与BOH核对金额,bohCheckAmount' || name === '开票金额,invoiceAmount'){
                        storeDayDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:2,
                            dataConfigDTOS:[{
                                columnOrValue:'顾客实付',
                                columnPosition:1,
                                dataCondition:'+',
                                englishColumnName:'acturalAmount',
                                value:null,
                                valueType:1
                            },{
                                columnOrValue:'第三方补贴',
                                columnPosition:1,
                                dataCondition:'+',
                                englishColumnName:'thirdSubsidy',
                                value:null,
                                valueType:1
                            },{
                                columnOrValue:'百胜补贴',
                                columnPosition:1,
                                dataCondition:null,
                                englishColumnName:'bsSubsidy',
                                value:null,
                                valueType:1
                            }]
                        })
                    }else if(name === '餐厅应收,storeReceivable'){
                        storeDayDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:2,
                            dataConfigDTOS:JSON.parse(JSON.stringify(storeReceivable))
                        })
                    }else{
                        storeDayDefaultColumn.push({
                            standardColumnName:name.split(',')[0],
                            standardEnglishName:name.split(',')[1],
                            originalColumnCode:null,
                            separateSettlement:false,
                            amountSymbol:false,
                            isSet:true,//有设置按钮
                            valueType:1,
                            dataConfigDTOS:[JSON.parse(JSON.stringify(defaultConfig))]
                        })
                    }
                }
            })
        }
    });

    //订单
    const thirdBillOrderConfigDetails = {
        billType:1,
        mapFileColumn:'',
        handingChargeRow:null,
        handingChargeColumn:null,
        //源文件和映射文件
        fileList:[],
        fileListMap:[],
        loadFile:false,
        loadFileMap:false,
        importUrl: tempIp.master_ip + '/third_bill_config/uploadFile?type=1',
        importUrlMap: tempIp.master_ip + '/third_bill_config/uploadFile?type=2',
        storeMapping:[],
        fileColumns:[],
        originalBillFileColumn:'',
        filterDTOS:[JSON.parse(JSON.stringify(defaultConfig))],
        thirdBillConfigColumnDTOS:orderDefaultColumn
    };
    //店天
    const thirdBillStoreDayConfigDetails = {
        billType:2,
        mapFileColumn:'',
        handingChargeRow:null,
        handingChargeColumn:null,
        //源文件和映射文件
        fileList:[],
        fileListMap:[],
        loadFile:false,
        loadFileMap:false,
        importUrl: tempIp.master_ip + '/third_bill_config/uploadFile?type=1',
        importUrlMap: tempIp.master_ip + '/third_bill_config/uploadFile?type=2',

        fileColumns:[],
        originalBillFileColumn:'',
        filterDTOS:[JSON.parse(JSON.stringify(defaultConfig))],
        thirdBillConfigColumnDTOS:storeDayDefaultColumn
    };

    const defaultThirdBill = {
        mappingConfigName:'',
        //订单，店天
        thirdBillConfigDetailDTOS:[JSON.parse(JSON.stringify(thirdBillOrderConfigDetails))]
    };

    export default {
        name: "thirdBillAdd",
        data(){
            var orderDelayInterval2 = (rule,value,callback) => {
                if(!/^([0-9]{1,4})([.][0-9]{1,2})?$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入0.01-9999.99中的数字'));
                }else{
                    callback()
                }
            };
            var orderDelayInterval = (rule,value,callback) => {
                if(!/^[0-9]+([.][0-9]{1,4})?$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('可保留4位小数的数字'));
                }else{
                    callback()
                }
            };
            var startReadRange = (rule,value,callback) => {
                if(!/^[1-9]*$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入正整数'));
                }else{
                    callback()
                }
            };
            var readRange = (rule,value,callback) => {
                if(!/^(-)?[1-9][0-9]*$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入正整数和负整数'));
                }else{
                    callback()
                }
            };
            var removeKey = (rule,value,callback) => {
                if(!/^[A-Za-z0-9\u4e00-\u9fa5;]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入中英文数字和;'));
                }else{
                    callback()
                }
            };
            return{
                isDetails: false,
                configName:'',
                module:'主档管理',
                subModule:'第三方账单配置',
                id:'',
                mailTitles:[{title:''}],
                thirdBillData:{
                    associationActivity:0,
                    billSource:'A',
                    configItemDTOS:[JSON.parse(JSON.stringify(defaultThirdBill))],
                    configName:'',
                    getLink:'',
                    getWay:1,
                    provideDetail:true,
                    provideBsBusinessDate:true,
                    orderDelayInterval:'',
                    manualImport:true
                },
                rules:{
                    configName:{ required: true, message: '请输入自定义名称', trigger: 'blur' },
                    getWay:{ required: true, message: '请选择获取方式', trigger: 'change' },
                    billSource:{ required: true, message: '请选择账单来源', trigger: 'change' },
                    provideDetail:{ required: true, message: '请选择是否提供订单明细', trigger: 'change' },
                    manualImport:{required: true, message: '请选择账单是否可以手工获取', trigger: 'change' },
                    provideBsBusinessDate:{ required: true, message: '请选择是否计算百胜营业日期', trigger: 'change' },
                    orderDelayInterval:[
                        { required: true, message: '请填写交易延迟时间' },
                        { validator: (rule,value,callback)=>{
                            if(!/^([0-9]{1,2})$/.test(value) && !this.common.isNullString(value)){
                                callback(new Error('只能输入1-2位的数字'));
                            }else{
                                callback()
                            }} }
                    ],
                },
                startReadRange:[
                    { required: true, message: '请填写数据读取范围开始时间' },
                    { validator: startReadRange }
                ],
                readRange:[{ validator: readRange }],
                orderDelayInterval:[{ validator: orderDelayInterval }],
                orderDelayInterval2:[{ validator: orderDelayInterval2 }],
                removeKey:[{ validator: removeKey }],
                columnOrValue:[{}],
                billSourceOpt:[],
                useAPI:[],
                useReptile:[],
                accountIdOpt:[],
                tradeDateFormat:[],
                tradeTimeFormat:[],
                tradeDateTimeFormat:[],
                dataConditionOpt:[{
                    value:'且',
                    label:'且'
                },{
                    value:'或',
                    label:'或'
                },{
                    value:'',
                    label:''
                },
                ],
                dataConditionOpt2:['+','-','*'],
                valueTypeOpt:[{
                    value: 1,
                    label: '字段'
                },{
                    value: 2,
                    label: '数值'
                }],
                dialogFormVisible: false,
                dialogBizDate:false,
                active: 0,
                amountForm: {
                    content:[{}],
                    fileColumns:[],
                    indexColumn:'',
                    index:'',
                    billTypeIndex:'',
                    standardColumnName:'',
                    billType:''
                },
                temCache:null,
                orderFileColumns:orderFileColumns,
                storeDayFileColumns:storeDayFileColumns,
                activeNames:[0],
                dialogName:null,
                thirdBillChange:true,
                judgeCondition:['送餐餐厅','交易日期','营业日期','顾客实付','与BOH核对金额','餐厅应收']
            }
        },
        methods:{
            cancel(){this.common.deleteTag(this.$route,this,'thirdBill');},
            getSearchCondition(){
                var that = this;
                ip.getKettleConfig(res => {that.useAPI = res.data});
                ip.getLinkCodeByType('1',res => {for(var i in res.data){that.useReptile.push({value:i, label:res.data[i]})}});
                ip.getAllTaskAccount(res => {that.accountIdOpt = res.data});
                ip.getDictionaryByNumber('DATEFORMAT',res => {that.tradeDateFormat = res.data});
                ip.getDictionaryByNumber('TIMEFORMAT',res => {that.tradeTimeFormat = res.data});
                ip.getDictionaryByNumber('DATETIMEFORMAT',res => {that.tradeDateTimeFormat = res.data});
                ip.getDictionaryByNumber('BILLSOURCE',res => {that.billSourceOpt = res.data});
            },
            thirdBillAddRow(){
                var _self = this;
                if(this.thirdBillData.provideDetail){
                    //提供订单明细，订单一定填，店天填不填随便
                    var thirdBillOrderConfigDetail = JSON.parse(JSON.stringify(thirdBillOrderConfigDetails));
                    this.$set(thirdBillOrderConfigDetail,'originalBillName',_self.thirdBillData.configName);
                    this.thirdBillData.configItemDTOS.push({
                        mappingConfigName:_self.thirdBillData.configName,
                        thirdBillConfigDetailDTOS:[thirdBillOrderConfigDetail]
                    });
                }else{
                    //不提供订单明细，只能填店天
                    var thirdBillStoreDayConfigDetail = JSON.parse(JSON.stringify(thirdBillStoreDayConfigDetails));
                    this.$set(thirdBillStoreDayConfigDetail,'originalBillName',_self.thirdBillData.configName);
                    this.thirdBillData.configItemDTOS.push({
                        mappingConfigName:_self.thirdBillData.configName,
                        thirdBillConfigDetailDTOS:[thirdBillStoreDayConfigDetail]
                    });
                }
            },
            thirdBillDeleteRow(index){this.thirdBillData.configItemDTOS.splice(index,1);},
            next(formName) {
                let that = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.active++;
                        if(_.isUndefined(that.$route.query.id)){
                            if(that.thirdBillChange){
                                that.thirdBillData.configItemDTOS[0].thirdBillConfigDetailDTOS[0].originalBillName = that.thirdBillData.configName;
                                that.thirdBillData.configItemDTOS[0].mappingConfigName = that.thirdBillData.configName;
                                that.thirdBillChange = false;
                            }
                        }
                    }else{
                        this.showTips('请必填信息填写完整','info');
                        return false
                    }
                });
            },
            before(){this.active--},
            getThirdBillData(id){
                var that = this;
                ip.getThirdBillById(id,res => {
                    if(res.code === 200){
                        that.thirdBillData = res.data;
                        that.configName = that.thirdBillData.configName;
                        //获取方式
                        if(that.thirdBillData.getWay === 4 && that.thirdBillData.getLink){
                            that.mailTitles = [];
                            that.thirdBillData.getLink.split(',').forEach(item => {
                                that.mailTitles.push({title:item})
                            })
                        }
                        //处理筛选条件、上传路径和名称
                        that.thirdBillData.configItemDTOS.forEach(item => {
                            item.thirdBillConfigDetailDTOS.forEach(item1 => {
                                var isMoney = false;
                                var url = item1.originalBillFilePath;
                                var urlMap = item1.mapFilePath;
                                if(item1.filterDTOS.length < 1){
                                    item1.filterDTOS = [JSON.parse(JSON.stringify(defaultConfig))];
                                }else if(item1.filterDTOS.length >1){
                                    item1.filterDTOS[0].dataCondition = item1.filterDTOS[1].dataCondition
                                    // item1.filterDTOS[item1.filterDTOS.length-1].dataCondition = null;
                                }
                                item1.originalBillFileName ? that.$set(item1,'fileList',[{name:item1.originalBillFileName}]) : that.$set(item1,'fileList',[]);
                                item1.mapFileName ? that.$set(item1,'fileListMap',[{name:item1.mapFileName}]) : that.$set(item1,'fileListMap',[]);
                                that.$set(item1,'loadFile',false);
                                that.$set(item1,'loadFileMap',false);
                                if(url){
                                    that.$set(item1,'importUrl',tempIp.master_ip + '/third_bill_config/uploadFile?type=1&url=' + url);
                                }else{
                                    that.$set(item1,'importUrl',tempIp.master_ip + '/third_bill_config/uploadFile?type=1');
                                }
                                if(urlMap){
                                    that.$set(item1,'importUrlMap',tempIp.master_ip + '/third_bill_config/uploadFile?type=2&url=' + urlMap);
                                }else{
                                    that.$set(item1,'importUrlMap',tempIp.master_ip + '/third_bill_config/uploadFile?type=2');
                                }
                                if(item1.originalBillFileColumn){
                                    that.$set(item1,'fileColumns',[]);
                                    item1.originalBillFileColumn.split(',').forEach(item => {item1.fileColumns.push({value:item, label:item})})
                                }else{
                                    that.$set(item1,'fileColumns',null)
                                }
                                // item1.thirdBillConfigColumnDTOS  = _.assignIn(JSON.parse(JSON.stringify(orderDefaultColumn)),item1.thirdBillConfigColumnDTOS);//合并初始化和返回信息，以防新增信息 eg:开票金额
                                item1.thirdBillConfigColumnDTOS.forEach(item2 => {
                                    if(item2.standardColumnName === '交易日期'){isMoney = true}
                                    if(isMoney){
                                        that.$set(item2,'isSet',true);
                                        if(item2.standardColumnName === '交易日期'){
                                            let dateContent = [];
                                            if(item2.dataConfigDTOS.length === 1){
                                                dateContent = JSON.parse(JSON.stringify(item2.dataConfigDTOS));
                                                dateContent.push(JSON.parse(JSON.stringify(defaultConfigDate)));
                                                dateContent.push(JSON.parse(JSON.stringify(defaultConfigDate)))
                                            }else if(item2.dataConfigDTOS.length > 1){
                                                if(item2.dataConfigDTOS[0].dateType === 1){
                                                    dateContent.push(JSON.parse(JSON.stringify(item2.dataConfigDTOS[0])));
                                                    dateContent.push(JSON.parse(JSON.stringify(defaultConfigDate)));
                                                    dateContent.push(JSON.parse(JSON.stringify(item2.dataConfigDTOS[1])));
                                                }else if(item2.dataConfigDTOS[0].dateType === 2){
                                                    dateContent = JSON.parse(JSON.stringify(item2.dataConfigDTOS));
                                                    if(item2.dataConfigDTOS.length<3){
                                                        dateContent.push(JSON.parse(JSON.stringify(defaultConfigDate)));
                                                        dateContent[2].dataCondition = '';
                                                    }
                                                }
                                            }
                                            item2.dataConfigDTOS = JSON.parse(JSON.stringify(dateContent))
                                        }else{
                                            if(item2.dataConfigDTOS.length < 1){item2.dataConfigDTOS = [JSON.parse(JSON.stringify(defaultConfig))]}
                                        }
                                    }else{
                                        that.$set(item2,'isSet',false)
                                    }
                                    if(item2.standardColumnName === '餐厅应收'){
                                        item2.dataConfigDTOS = JSON.parse(JSON.stringify(storeReceivable))
                                    }
                                })
                            })
                        })
                    }else{
                        that.showTips(res.msg,'info')
                    }
                })
            },
            addRow(index, billTypeIndex,itemFilter) {
                if(itemFilter.dataCondition&&itemFilter.columnOrValue){
                    if(this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].filterDTOS.length < 50){
                        this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].filterDTOS.push(JSON.parse(JSON.stringify(defaultConfig)));
                    }else{
                        this.common.messageUtil({
                            type:'warning',
                            message:'超过50条个数限制!'
                        })
                    }
                }else{
                    this.common.messageUtil({
                        type:'warning',
                        message:'请选择条件关系及筛选条件!'
                    })
                }
            },
            removeRow(index,billTypeIndex,indexFilter){this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].filterDTOS.splice(indexFilter,1)},
            addMail(){this.mailTitles.push({title:''})},
            removeMail(index){this.mailTitles.splice(index,1)},
            showTips(text,type){this.common.messageUtil({message: text, type: type})
            },
            //账单源文件上传
            beforeFileUpload(file){
                let suffix = file.name.split('.');
                const isLt1M = file.size / 1024 / 1024 <= 1;
                if(!isLt1M){
                    this.showTips('不能超过1M!','warning');
                    return false
                }
                if(suffix[suffix.length - 1] === 'csv' || suffix[suffix.length - 1] === 'xlsx' || suffix[suffix.length - 1] === 'xls'){
                    return file
                }else{
                    this.showTips('上传文件只能是 csv/xlsx/xls 格式!','warning');
                    return false
                }
            },
            removeFile(file,fileList,index,billTypeIndex){
                var billType = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex];
                billType.fileList = [];
                billType.loadFile = false;
            },
            uploadError(err,file,fileList,index,billTypeIndex){
                this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].loadFile = false;
                this.showTips('请求超时','warning')
            },
            uploadSuccess(response,file,fileList,index,billTypeIndex){
                var that = this;
                var billType = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex];
                if(response.code === 200){
                    billType.fileList = [];
                    billType.fileList.push(fileList[fileList.length - 1]);
                    that.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].fileColumns = [];
                    response.data.fileColumns.forEach(item => {
                        that.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].fileColumns.push({
                            value:item,
                            label:item
                        })
                    });
                    that.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].originalBillFileColumn = response.data.fileColumns.join(',');
                    billType.importUrl = tempIp.master_ip + '/third_bill_config/uploadFile?type=1&url=' + response.data.url;
                    billType.originalBillFilePath = response.data.url;
                    billType.originalBillFileName = file.name;
                    this.showTips(response.msg,'success');
                }else{
                    billType.fileList = [];
                    this.showTips(response.msg,'warning');
                }
            },
            //百胜店号映射
            beforeFileUploadMap(file){
                let suffix = file.name.split('.');
                const isLt1M = file.size / 1024 / 1024 <= 1;
                if(!isLt1M){
                    this.showTips('不能超过1M!','warning');
                    return false
                }
                if(suffix[suffix.length - 1] === 'csv' || suffix[suffix.length - 1] === 'xlsx' || suffix[suffix.length - 1] === 'xls'){
                    return file
                }else{
                    this.showTips('上传文件只能是 csv/xlsx/xls 格式!','warning');
                    return false
                }
            },
            removeFileMap(file,fileListMap,index,billTypeIndex){
                var that = this;
                var billType = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex];
                ip.deleteFile(billType.mapFilePath,res => {
                    if(res.code === 200){
                        billType.mapFilePath = null;
                        billType.mapFileName = null;
                        billType.fileListMap = [];
                        billType.loadFileMap = false;
                    }else{
                        that.showTips(res.msg,'info')
                    }
                })

            },
            uploadErrorMap(err,file,fileListMap,index,billTypeIndex){
                this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].loadFileMap = false;
                this.showTips('请求超时','warning')
            },
            uploadSuccessMap(response,file,fileListMap,index,billTypeIndex){
                var billType = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex];
                if(response.data){
                    billType.fileListMap = [];
                    billType.fileListMap.push(fileListMap[fileListMap.length - 1]);
                    billType.importUrlMap = tempIp.master_ip + '/third_bill_config/uploadFile?type=2&url=' + response.data.url;
                    billType.mapFilePath = response.data.url;
                    billType.mapFileName = file.name;
                    billType.storeMapping = response.data.stores;
                    this.showTips(response.msg,'success');
                }else{
                    billType.fileListMap = [];
                    this.showTips(response.msg,'warning');
                }
            },
            setAmount(indexColumn,index,billTypeIndex,billType,standardColumnName){
                this.amountForm.standardColumnName = standardColumnName;
                this.amountForm.billType = billType;
                this.amountForm.indexColumn = indexColumn;
                this.amountForm.index = index;
                this.amountForm.billTypeIndex = billTypeIndex;
                this.dialogName = standardColumnName;
                standardColumnName === '交易日期' ? this.dialogBizDate = true : this.dialogFormVisible = true;

                this.amountForm.content = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].dataConfigDTOS;
                this.temCache = JSON.parse(JSON.stringify(this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].dataConfigDTOS));
                if(billType === 1 && (standardColumnName === '与BOH核对金额' || standardColumnName === '餐厅应收' ||standardColumnName === '开票金额')){
                    this.amountForm.fileColumns = this.orderFileColumns;
                }else if(billType === 2 && (standardColumnName === '与BOH核对金额' || standardColumnName === '餐厅应收' ||standardColumnName === '开票金额')){
                    this.amountForm.fileColumns = this.storeDayFileColumns;
                }else{
                    this.amountForm.fileColumns = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].fileColumns;
                }
            },
            clearAmount(indexColumn,index,billTypeIndex,billType,standardColumnName){
                this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].originalColumnCode = null;
                if(standardColumnName === '交易日期'){

                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].dataConfigDTOS =
                        [Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate),Object.assign({},defaultConfigDate)];
                }else{
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].dataConfigDTOS = [JSON.parse(JSON.stringify(defaultConfig))];
                }
                this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].valueType = 1;
            },
            saveDataConfig(indexColumn,index,billTypeIndex,standardColumnName,amountForm){
                if(amountForm){
                    this.$refs[amountForm].validate((valid) => {
                        if(valid){
                            this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].valueType = 2;
                            standardColumnName === '交易日期' ? this.dialogBizDate = false : this.dialogFormVisible = false
                        }
                    })
                }else{
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].valueType = 2;
                    standardColumnName === '交易日期' ? this.dialogBizDate = false : this.dialogFormVisible = false
                }
            },
            getDataCondition(val,index){
                if(val !== '' && !this.amountForm.content[index+1]){
                    this.amountForm.content.push(JSON.parse(JSON.stringify(defaultConfig)))
                }else if(val === ''){
                    this.amountForm.content.splice(index+1,1)
                }
            },
            saveThirdBill(formName){
                var that = this;
                //链接
                var tem = [];
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
                tem = this.common.joinSearchParam(condition);

                //标准格式映射
                try{
                    this.$refs[formName].validate((valid) => {
                        if(valid){
                            if(!that.thirdBillData.provideDetail){
                                delete that.thirdBillData.provideBsBusinessDate;
                                delete that.thirdBillData.orderDelayInterval;
                            }
                            //获取方式
                            if(that.thirdBillData.getWay === 4){
                                let mails = [];
                                that.mailTitles.forEach(item => {mails.push(item.title)});
                                that.thirdBillData.getLink = mails.join(',')
                            }
                            //状态
                            that.thirdBillData.status = 1;
                            //判断店天和订单都存在时，店天是否被填
                            that.thirdBillData.configItemDTOS.forEach((configItemDTO, index) => {
                                configItemDTO.thirdBillId = that.thirdBillData.id;
                                configItemDTO.thirdBillConfigDetailDTOS.forEach((thirdBillConfigDetailDTO, index1) => {
                                    if (configItemDTO.thirdBillConfigDetailDTOS.length > 1) {
                                        if (thirdBillConfigDetailDTO.billType === 2) {
                                            var thirdBillConfigDetail = JSON.parse(JSON.stringify(thirdBillConfigDetailDTO));
                                            delete thirdBillConfigDetail.originalBillName;
                                            if (JSON.stringify(thirdBillConfigDetail) === JSON.stringify(thirdBillStoreDayConfigDetails)) {
                                                that.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.splice(index1, 1)
                                            }
                                        }
                                    }
                                    if (thirdBillConfigDetailDTO.storeMapping && thirdBillConfigDetailDTO.storeMapping.length > 0) {//stopmapping fill id
                                        thirdBillConfigDetailDTO.storeMapping.forEach(mapp => {
                                            mapp.thirdBillId = that.thirdBillData.id;
                                        })
                                    }
                                    if(thirdBillConfigDetailDTO.filterDTOS &&thirdBillConfigDetailDTO.filterDTOS.length>0 &&index1 === 0){//删选条件 第一个datacondition 永远为空
                                        thirdBillConfigDetailDTO.filterDTOS.forEach(item => {
                                            let temnobj = thirdBillConfigDetailDTO.filterDTOS.find(x=>{return x.dataCondition});
                                            if(temnobj){
                                                item.dataCondition = temnobj.dataCondition
                                            }
                                            // item.dataCondition = thirdBillConfigDetailDTO.filterDTOS.find(x=>{return x.dataCondition}).dataCondition
                                        });
                                        thirdBillConfigDetailDTO.filterDTOS[0].dataCondition = null;
                                    }
                                })
                            });
                            if(this.id !== ''){
                                if(this.configName === this.thirdBillData.configName){
                                    if(that.handleRuleAndJson() === false){
                                        return false;
                                    }
                                    ip.updateThirdBill(tem,that.thirdBillData,res => {
                                        if(res.code === 200){
                                            that.showTips(res.data,'success');
                                            that.cancel();
                                        }else{
                                            that.showTips(res.msg,'info')
                                        }
                                    })
                                }else{
                                    ip.checkConfigName(that.thirdBillData.configName,res => {
                                        if(!res.data){
                                            if(that.handleRuleAndJson() === false){
                                                return false;
                                            }
                                            ip.updateThirdBill(tem,that.thirdBillData,res => {
                                                if(res.code === 200){
                                                    that.showTips(res.data,'success');
                                                    that.cancel();
                                                }else{
                                                    that.showTips(res.msg,'info')
                                                }
                                            })
                                        }else{
                                            that.showTips('配置名称重复','info')
                                        }
                                    })
                                }
                            }else{
                                ip.checkConfigName(that.thirdBillData.configName,res => {
                                    if(!res.data){
                                        debugger;
                                        if(that.handleRuleAndJson() === false){
                                            return false;
                                        }
                                        ip.addThirdBill(tem,that.thirdBillData,res => {
                                            if(res.code === 200){
                                                that.showTips(res.data,'success');
                                                that.cancel();
                                            }else{
                                                that.showTips(res.msg,'info')
                                            }
                                        })
                                    }else{
                                        that.showTips('配置名称重复','info')
                                    }
                                })
                            }
                        }else{
                            that.showTips('请必填信息填写完整','info');
                            return false
                        }
                    })
                }catch (e) {
                    // console.log(e)
                }
            },
            handleOrderBillDetails(index,billType,billTypeIndex){
                var afterRef = 'content_' + index + '_' +  billType;
                var configDeatilsLength = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.length;
                if(configDeatilsLength === 1 && billType === 2){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.push(JSON.parse(JSON.stringify(thirdBillOrderConfigDetails)));
                }else if(configDeatilsLength === 2 && billType === 2){
                    var ref = 'content_' + index + '_' + ( billType - 1 );
                    this.$refs[ref][0].style.display = 'inline-block';
                    this.$refs[afterRef][0].style.display = 'none';
                }
            },
            handleStoreDayBillDetails(index,billType,billTypeIndex){
                var beforeRef = 'content_' + index + '_' +  billType;
                var configDeatilsLength = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.length;
                if(configDeatilsLength === 1 && billType === 1){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.push(JSON.parse(JSON.stringify(thirdBillStoreDayConfigDetails)));
                    if(this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.length > 1){
                        this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[1].originalBillName = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[0].originalBillName
                    }
                }else if(configDeatilsLength === 2 && billType === 1){
                    var ref = 'content_' + index + '_' + ( billType + 1 );
                    this.$refs[ref][0].style.display = 'inline-block';
                    this.$refs[beforeRef][0].style.display = 'none';
                }
            },
            unifiedName(e,index){
                this.thirdBillData.configItemDTOS[index].mappingConfigName = e;
                if(this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS.length > 1){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[1].originalBillName = e
                }
            },
            handleRuleAndJson(){
                //处理detailFilterJson和dataConfigJson
                try {
                    let that = this;
                    this.thirdBillData.configItemDTOS.forEach(item1 => {
                        item1.thirdBillConfigDetailDTOS.forEach(item2 => {
                            //统一dataCondition

                            // if(item2.filterDTOS.length >2){
                            //     item2.filterDTOS[item2.filterDTOS.length - 1].dataCondition = null;
                            // }
                            //detailFilterJson
                            let amountSymbolName = item2.thirdBillConfigColumnDTOS.filter(x=>{return x.standardColumnName === '交易金额'||x.standardColumnName === '顾客实付'});
                            if(!amountSymbolName[0].amountSymbol && !amountSymbolName[1].amountSymbol){
                                this.common.messageUtil({
                                    type:'warning',
                                    message:''
                                })
                                throw new  Error('1')
                            }
                            item2.detailFilterJson = '';
                            for(var i=0;i<item2.filterDTOS.length;i++){
                                if(JSON.stringify(item2.filterDTOS[i]) !== JSON.stringify(defaultConfig)){
                                    item2.detailFilterJson += i === item2.filterDTOS.length - 1 ? JSON.stringify(item2.filterDTOS[i]) : JSON.stringify(item2.filterDTOS[i]) + ',';
                                }
                            }
                            item2.detailFilterJson = '['+item2.detailFilterJson+']';
                            if(item2.detailFilterJson === '[]'){item2.detailFilterJson = null};
                            item2.thirdBillConfigColumnDTOS.forEach(item3 => {
                                //dataConfigJson
                                //第一页的是否计算百胜营业日期选择是，要把标准映射里的营业日期清空
                                if(item3.standardColumnName === '营业日期' &&  that.thirdBillData.provideBsBusinessDate){
                                    item3.dataConfigJson = '';
                                    item3.dataConfigDTOS = [];
                                }
                                if(item3.isSet) {
                                    if(item3.originalColumnCode !== '' && item3.originalColumnCode !== null) {
                                        item3.dataConfigJson = null;
                                    }else if(item3.originalColumnCode === '' || item3.originalColumnCode === null) {
                                        item3.dataConfigJson = '';
                                        if(item3.standardColumnName === '交易日期'){
                                            //处理交易日期
                                            let dateContent = Object.assign([],item3.dataConfigDTOS);
                                            if(dateContent[0].columnPosition === 2){
                                                dateContent.splice(1,2)
                                            }else if(dateContent[0].columnPosition === 1 && dateContent[0].dateType === 1){
                                                dateContent.splice(1,1);
                                                if(dateContent[0].dataCondition !== '+' && dateContent[0].dataCondition !== '-'){
                                                    dateContent.splice(1,1);
                                                    dateContent[0].valueType = 1
                                                }else{
                                                    dateContent[1].columnPosition = dateContent[0].columnPosition;
                                                    dateContent[1].dateType = dateContent[0].dateType;
                                                    dateContent[0].valueType = 1;
                                                    dateContent[1].valueType = 2;
                                                    dateContent[1].dataCondition = dateContent[0].dataCondition;
                                                }
                                            }else if(dateContent[0].columnPosition === 1 && dateContent[0].dateType === 2){
                                                if(dateContent[0].dataCondition !== '+' && dateContent[0].dataCondition !== '-'){
                                                    dateContent.splice(2,1);
                                                    dateContent[1].columnPosition = dateContent[0].columnPosition;
                                                    dateContent[1].dateType = dateContent[0].dateType;
                                                    dateContent[0].valueType = 1;
                                                    dateContent[1].valueType = 1;
                                                    //如果账单没有时分秒，则不需要填时分秒弹框
                                                    let nullConfigDate = {columnPosition:1,dateType:2,valueType:1};
                                                    if(JSON.stringify(dateContent[1]) === JSON.stringify(nullConfigDate)){dateContent.splice(1,1)}
                                                }else{
                                                    dateContent[1].columnPosition = dateContent[0].columnPosition;
                                                    dateContent[1].dateType = dateContent[0].dateType;
                                                    dateContent[2].columnPosition = dateContent[0].columnPosition;
                                                    dateContent[2].dateType = dateContent[0].dateType;
                                                    dateContent[0].valueType = 1;//1：字段，2：数值
                                                    dateContent[1].valueType = 1;
                                                    dateContent[2].valueType = 2;
                                                    dateContent[1].dataCondition = dateContent[0].dataCondition;
                                                    dateContent[2].dataCondition = dateContent[0].dataCondition;
                                                }
                                            }
                                            item3.dataConfigDTOS = dateContent;
                                            for (var i = 0; i < item3.dataConfigDTOS.length; i++) {
                                                item3.dataConfigJson += i === item3.dataConfigDTOS.length - 1 ? JSON.stringify(item3.dataConfigDTOS[i]) : JSON.stringify(item3.dataConfigDTOS[i]) + ',';
                                            }
                                            item3.dataConfigJson = '[' + item3.dataConfigJson + ']';
                                            item3.valueType = 2;
                                        }else{
                                            if(item3.dataConfigDTOS.length > 1){
                                                for (var i = item3.dataConfigDTOS.length - 1; i > 0; i--) {
                                                    item3.dataConfigDTOS[i].dataCondition = item3.dataConfigDTOS[i - 1].dataCondition
                                                }
                                            }
                                            for (var i = 0; i < item3.dataConfigDTOS.length; i++) {
                                                if(JSON.stringify(item3.dataConfigDTOS[i]) !== JSON.stringify(defaultConfig)){
                                                    item3.dataConfigJson += i === item3.dataConfigDTOS.length - 1 ? JSON.stringify(item3.dataConfigDTOS[i]) : JSON.stringify(item3.dataConfigDTOS[i]) + ',';
                                                }
                                            }
                                            item3.dataConfigJson = '[' + item3.dataConfigJson + ']';
                                            if(item3.dataConfigJson === '[]'){
                                                item3.dataConfigJson = '';item3.valueType = 1
                                            }else{
                                                item3.valueType = 2
                                            }
                                        }
                                    }
                                }
                            })
                        })
                    },this)
                }catch(e){
                    if(e.message === '1'){
                        this.common.messageUtil({
                            type:'warning',
                            message:'请选择交易金额或者顾客实付为正负标准字段'
                        })
                        return false;
                    }
                }

            },
            clearColumnOrValue(indexFrom){
                var columnOrValue = 'columnOrValue' + indexFrom;
                this.amountForm.content[indexFrom].columnOrValue = '';
                this.$refs[columnOrValue][0].clearValidate();
            },
            isProvideDetail(){
                this.thirdBillData.configItemDTOS = [];
                if(this.thirdBillData.provideDetail){
                    //提供订单明细，订单一定填，店天填不填随便
                    this.thirdBillData.configItemDTOS.push({
                        mappingConfigName:'',
                        thirdBillConfigDetailDTOS:[JSON.parse(JSON.stringify(thirdBillOrderConfigDetails))]
                    });
                }else{
                    //不提供订单明细，只能填店天
                    this.thirdBillData.configItemDTOS.push({
                        mappingConfigName:'',
                        thirdBillConfigDetailDTOS:[JSON.parse(JSON.stringify(thirdBillStoreDayConfigDetails))]
                    });
                }
                this.URNames(this.thirdBillData.configName)
            },
            exportFile(index,billTypeIndex){
                var url = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].originalBillFilePath;
                var fileName = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].originalBillFileName;
                var condition = [{
                    name:'url',
                    value:url
                },{
                    name:'fileName',
                    value:fileName
                }];
                if(url && fileName){
                    ip.thirdBillDownload(this.common.joinSearchParam(condition),function(res){
                        let url = URL.createObjectURL(new Blob([res.data],{type:'application/vnd.ms-excel'}));
                        let a = document.createElement('a');
                        a.download = fileName;
                        a.href = url;
                        a.click();
                    })
                }else{
                    this.showTips('请先上传源文件','info')
                }
            },
            exportFileMap(index,billTypeIndex){
                var url = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].mapFilePath;
                var fileName = this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].mapFileName;
                var condition = [{
                    name:'url',
                    value:url
                },{
                    name:'fileName',
                    value:fileName
                }];

                if(url && fileName){
                    ip.thirdBillDownload(this.common.joinSearchParam(condition),function(res){
                        let url = URL.createObjectURL(new Blob([res.data],{type:'application/vnd.ms-excel'}));
                        let a = document.createElement('a');
                        a.download = fileName;
                        a.href = url;
                        a.click();
                    })
                }else{
                    this.showTips('请先上传映射文件','info')
                }
            },
            checkContent(event,titleIndex){
                var value = event.target.value;
                var last  = value.charAt(value.length - 1);
                if (/^\,$/.test(last)) {
                    alert('请不要输入,');
                    this.mailTitles[titleIndex].title = ''
                }
            },
            getEnglishColumnName(val,indexFrom,standardColumnName){
                if(standardColumnName === '与BOH核对金额' || standardColumnName === '餐厅应收'  || standardColumnName === '开票金额'){
                    let obj = {};
                    obj = this.amountForm.fileColumns.find(item => {
                        return item.value === val
                    });
                    this.$set(this.amountForm.content[indexFrom],'englishColumnName',val);
                    this.amountForm.content[indexFrom].columnOrValue = obj.label
                }
            },
            URNames(e){
                // 去掉大账单名字更改 联动改掉销账单的名字
                // this.thirdBillData.configItemDTOS.forEach(configItemDTO => {
                //     configItemDTO.mappingConfigName = e;
                //     configItemDTO.thirdBillConfigDetailDTOS.forEach(thirdBillConfigDetailDTO => {
                //         thirdBillConfigDetailDTO.originalBillName = e
                //     })
                // })
            },
            unifyDataCondition(val,billTypeItem){
                billTypeItem.filterDTOS.forEach(item => {
                    item.dataCondition = val
                })
            },
            separateSettle(val,index,billTypeIndex,indexColumn,standardColumnName){
                if(standardColumnName === '顾客实付' && val){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '第三方补贴'){item.separateSettlement = false}
                    })
                }else if(standardColumnName === '第三方补贴' && val){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '顾客实付'){item.separateSettlement = false}
                    })
                }
            },
            amountSymbolSettle(val,index,billTypeIndex,indexColumn,standardColumnName){
                if(standardColumnName === '顾客实付' && val){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '交易金额'){item.amountSymbol = false}
                    })
                }else if(standardColumnName === '交易金额' && val){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '顾客实付'){item.amountSymbol = false}
                    })
                }
            },
            clearHandingCharge(val,index,billTypeIndex){
                if(val){
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '手续费'){
                            item.originalColumnCode = null;
                            item.dataConfigDTOS = [JSON.parse(JSON.stringify(defaultConfig))];
                            item.valueType = 2;
                        }
                    })
                }else{
                    this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS.forEach(item => {
                        if(item.standardColumnName === '手续费'){
                            item.originalColumnCode = null;
                            item.dataConfigDTOS = [JSON.parse(JSON.stringify(defaultConfig))];
                            item.valueType = 1;
                        }
                    })
                }
            },
            clearAmountForm(index,billTypeIndex,indexColumn){
                this.thirdBillData.configItemDTOS[index].thirdBillConfigDetailDTOS[billTypeIndex].thirdBillConfigColumnDTOS[indexColumn].dataConfigDTOS = JSON.parse(JSON.stringify(this.temCache));
            },
            forceUpdate(){
                this.$forceUpdate();
            }
        },
        beforeMount(){
            this.getSearchCondition();
        },
        mounted(){
            if(this.$route.query.id){
                this.id = this.$route.query.id;
                this.getThirdBillData(this.id);
            }
            this.$route.query.detail ? this.isDetails = true : this.isDetails = false;
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'thirdBill';
            next();
        },
    }
</script>

<style lang="scss">
    @import '../../assets/scss/master';
    .dataConfig{
        .dataConfig_condition{
            width:60px
        }
        .dataConfig_select{
            width:150px
        }
        .dataConfig_input{
            width:200px
        }
    }
    .formInp{
        display: inline-block;
        width:150px
    }
    .formSelect{
        width:150px
    }
</style>
