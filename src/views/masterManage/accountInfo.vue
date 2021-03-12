<template>
    <div>
        <div class="accountInfo">
            <!-- 结算信息 -->
            <div class="billLittleTitle"><i></i><span>结算信息</span></div>
            <div class="accountMessage">
                <el-form-item
                        label="是否出具结算报告至第三方"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.provideSettlementToThird'"
                        :rules="{required: true, message: '请选择是否出具结算报告至第三方', trigger: 'change'}">
                    <el-radio-group
                            v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].provideSettlementToThird"
                            :disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked" @change="readyTopay">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].provideSettlementToThird"
                        label="结算周期"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.settlementPeriodType'"
                        :rules="{required: true, message: '请选择结算周期', trigger: 'change'}">
                    <el-select
                            v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType"
                            filterable
                            @change="clearSettlementPeriod"
                            :disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked">
                        <el-option v-for="item in settlementPeriodTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-form-item
                            class="settlement"
                            :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.settlementPeriod'"
                            :rules="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 1 ? defaultDay :
                            ((activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 6 ||
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 7) &&
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementDateType === 1 ? calendarDay :
                            ((activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 6 ||
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 7) &&
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementDateType === 2 ? workDay :
                            { required: true, message: '请选择', trigger: ['change','blur'] }))">
                        <!-- 按天 改成和按月一样的   -->
                        <!--<el-input-->
                                <!--v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 1"-->
                                <!--class="cycle"-->
                                <!--v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriod"-->
                                <!--:disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked">-->
                            <!--<template slot="prepend">T+</template>-->
                            <!--<i slot="suffix">日</i>-->
                        <!--</el-input>-->
                        <!-- 按月 -->
                        <el-input
                                v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 6
                                ||activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 1"
                                class="cycle"
                                v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriod"
                                :disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked">
                            <template slot="prepend">
                                <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementDateType">
                                    <el-option label="自然日" :value="1"></el-option>
                                    <el-option label="工作日" :value="2"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                        <!-- 活动结束 -->
                        <el-input
                                v-else-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriodType === 7"
                                class="cycle"
                                v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriod"
                                :disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked">
                            <template slot="prepend">
                                <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementDateType">
                                    <el-option label="自然日" :value="1"></el-option>
                                    <el-option label="工作日" :value="2"></el-option>
                                </el-select>
                            </template>
                        </el-input>
                        <!-- 每几周 -->
                        <el-radio-group
                                v-else
                                v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementPeriod"
                                :disabled="(activeData.settlementConsolidation && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked">
                            <el-radio :label="1">周一</el-radio>
                            <el-radio :label="2">周二</el-radio>
                            <el-radio :label="3">周三</el-radio>
                            <el-radio :label="4">周四</el-radio>
                            <el-radio :label="5">周五</el-radio>
                            <el-radio :label="6">周六</el-radio>
                            <el-radio :label="7">周日</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="第三方是否提供账单" prop="provideBill">
                    <el-radio-group v-model="activeData.provideBill" :disabled="isChecked || disabledBill" @change="clearThirdBills">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        v-if="activeData.provideBill"
                        label="第三方账单"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.configItemId'"
                        :rules="{required: true, message: '请选择第三方账单', trigger: 'change'}">
                    <el-select
                            v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].configItemId"
                            multiple
                            filterable
                            size="medium"
                            style="width:300px"
                            :disabled="isChecked || disabledBill">
                        <el-option v-for="(item,index) in configItemOpt" :key="index" :label="item.configName" :value="item.id+''"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        label="BOH结算键位"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bohSettlementKeyDTOS'"
                        :rules="{required: true, message: '请输入BOH结算键位', trigger: 'blur'}"
                        class="activeBOH">
                    <el-form-item
                            v-for="(bohSettlementKey,index) in activeData.thirdSettlementConfigDTOS[settlementTab-1].bohSettlementKeyDTOS"
                            :key="index"
                            :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bohSettlementKeyDTOS.' + index + '.keyValue'"
                            :rules="{required: true, message: '请输入BOH结算键位', trigger: ['blur','change']}">
                        <el-autocomplete
                                class="smallBOH"
                                size="small"
                                v-model="bohSettlementKey.keyValue"
                                :fetch-suggestions="bohQuerySearch"
                                :disabled="(activeData.provideBill === true && (activeData.settlementMode<3 && settlementTab === 2)) || isChecked">
                        </el-autocomplete>
                        <el-button v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].bohSettlementKeyDTOS.length > 1" @click="removeBOH(index)" size="small"
                                   icon="el-icon-minus" circle :disabled="(activeData.provideBill === true && settlementTab === 2) || isChecked"></el-button>
                        <el-button v-if="index === activeData.thirdSettlementConfigDTOS[settlementTab-1].bohSettlementKeyDTOS.length - 1" @click="addBOH" size="small"
                                   icon="el-icon-plus" circle :disabled="(activeData.provideBill === true && settlementTab === 2) || isChecked"></el-button>
                    </el-form-item>
                </el-form-item>
            </div>
            <!-- 第三方信息 -->
            <div class="billLittleTitle"><i></i><span>第三方信息</span></div>
            <div class="accountMessage">
                <el-form-item
                        class="third third-name"
                        label="第三方名称"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.customerId'"
                        :rules="{required: true, message: '请选择第三方名称', trigger: 'change'}">
                        <el-select size="small"
                                v-if="activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2"
                                class="cycle"
                                v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].customerName||customName"
                                :disabled="activeData.status > 2">
                            <el-option v-for="(item,index) in customerOpt" :key="index" :label="item.jdeCode + item.customerName" :value="item.jdeCode + item.customerName"></el-option>
                        </el-select>
                    <el-select
                            class="cycle"
                            v-else
                            ref="customerName"
                            remote
                            :remote-method="remoteCustomerName"
                            v-scroll="scrollCustomerName"
                            @change="getCustomerInfo"
                            v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].customerId"
                            :disabled="isChecked||activeData.status > 2"
                            @keyup.native="focusFn"
                            filterable>
                        <el-option v-for="(item,index) in customerOpt" :key="index" :label="item.jdeCode + item.customerName" :value="item.id"></el-option>
                    </el-select>&nbsp;&nbsp;&nbsp;&nbsp;
                    <el-checkbox v-if="activeData.settlementMode === 3" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].defaultCustomer" @change="setDefault" :disabled="isChecked">默认客户</el-checkbox>
                </el-form-item>
                <el-form-item class="third" label="银行账号">
                    <el-input class="cycle" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankAccount" disabled></el-input>
                </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <el-form-item class="third" label="银行账户名称">
                    <el-input class="cycle" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankName" disabled></el-input>
                </el-form-item>
            </div>
            <!-- 保证方式  右边的tab里的 去掉禁用-->
            <el-form-item
                    label="保证方式"
                    class="ensureMode"
                    :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guarantyDTOS'"
                    :rules="{required: true, message: '请选择保证方式', trigger: 'change'}">
                <div class="setEnsureMode" v-for="(ensureItem,ensureIndex) in activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS" :key="ensureIndex" v-if="!ensureItem.longVocationAdd">
                    <el-select
                            v-model="ensureItem.guarantyType"
                            class="ensureSelWidth"
                            @change="(val) => {return clearGuarantyInfo(val,ensureIndex)}"
                            :disabled="isChecked || (activeData.status>=3 && !ensureItem.delFlag)"
                            >
                        <!--:disabled="(activeData.settlementMode === 2 v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length < 2"&& activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked || activeData.status>=3"--->
                        <el-option label="无" :value="0" :disabled="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length>1"></el-option>
                        <el-option v-for="(item,index) in guarantyTypeOpt" :key="index" :label="item.label" :value="item.value"
                                   :disabled="item.disabled||(index === 0 &&activeData.thirdSettlementConfigDTOS[settlementTab-1].provideSettlementToThird )"></el-option>
                    </el-select>
                    <el-button
                            v-if="ensureItem.delFlag || (activeData.status !==3 && activeData.status !==5
                            && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.filter(x=>{return !!x.guarantyType}).length>1)"
                            type="text"
                            @click="removeEnsureMode(ensureIndex)"
                            class="delete deleteMode"
                            :disabled="isChecked || (activeData.status>=4 && !ensureItem.delFlag)">删除
                    </el-button>
                    <el-checkbox class="deleteMode" v-if="ensureItem.guarantyType === 2 && activeData.status !==5"
                                 v-model="ensureItem.reversible" :disabled="isChecked || activeData.status>=4">
                        是否冲销活动应收款
                    </el-checkbox>
                    <div class="modeDetails" v-if="ensureItem.guarantyType !== 0">
                        <el-select
                                v-model="ensureItem.guarantyDimension"
                                class="ensureSelWidth"
                                @change="(val) => {return getCompanyNames(val,ensureIndex)}"
                                :disabled="isChecked ||(activeData.status>=3 && !ensureItem.delFlag)"
                                >
                            <!--:disabled="(activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked || activeData.status>=3"-->
                            <el-option v-for="(item,index) in dimensionality" :key="index" :value="item.value" :label="item.label"
                                       :disabled="ensureItem.guarantyType === 5 &&item.value === 2 ||item.disabled"

                            ></el-option>
                            <!--<el-option :value="2" label="按法人公司"></el-option>-->
                        </el-select>
                        <el-button
                                v-if="ensureItem.guarantyDimension === 2 && !((id==='' || activeData.status === 1) && (ensureItem.guarantyType === 1 || ensureItem.guarantyType === 2))"
                                @click="companyAddAmount(ensureIndex)"
                                type="text"
                                class="checkAddDetails">追加金额</el-button>
                        <el-popover v-if="ensureItem.guarantyDimension === 2 && id!=='' && activeData.status!==1" placement="right-start" title="追加记录" width="250" trigger="hover">
                            <p v-for="(logItem,logIndex) in ensureItem.guarantyRecordedDTOS" :key="logIndex" class="margin-left">{{logItem.createTime}}&nbsp;&nbsp;{{logItem.guarantySum | numberFormatToThousand}}</p>
                            <el-button
                                    class="checkAddDetails"
                                    type="text"
                                    slot="reference"
                                    :disabled="activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2">
                                <i class="el-icon-document"></i>&nbsp;&nbsp;追加记录
                            </el-button>
                        </el-popover>
                        <h1 v-if="id!=='' && activeData.status!==1">
                            可用金额 : {{(ensureItem.guarantySum+ensureItem.addGuarantySum) | numberFormatToThousand}}元
                            <el-button v-if="ensureItem.guarantyDimension === 1 && id!=='' && activeData.status!==1 && ensureItem.guarantySum>0" type="text" class="refund"
                                       @click="refund(ensureIndex,'activity',ensureItem.guarantyType,activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeId,ensureItem.id,ensureItem.reversible)"
                                       :disabled="(activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || ensureItem.guarantySum <= 0">
                                {{ensureItem.guarantyType ===5?'解除':(ensureItem.guarantyType === 1 || ensureItem.guarantyType ===2)?'退款':'退回'}}
                            </el-button>
                        </h1>
                        <el-form-item
                                class="guarantyForm"
                                v-if="(ensureItem.guarantyType === 3 || ensureItem.guarantyType === 4 || ensureItem.guarantyType === 5)
                                && ensureItem.guarantyDimension === 1"
                                label="追加金额"
                                :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guarantyDTOS.' + ensureIndex + '.addGuarantySum'"
                                :rules="addAmount">
                            <el-input placeholder="请输入" v-model.number="ensureItem.addGuarantySum"
                                      :disabled="isChecked || activeData.status>=4"><i slot="suffix">元</i></el-input>
                        </el-form-item>
                        <el-form-item
                                class="guarantyForm"
                                v-if="ensureItem.guarantyType === 3 || ensureItem.guarantyType === 4 || ensureItem.guarantyType === 5"
                                label="到期日"
                                :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guarantyDTOS.' + ensureIndex + '.dueDate'"
                                :rules="{ required: true, message: '到期日不能为空', trigger: ['change','blur']}">
                            <el-date-picker
                                    v-model="ensureItem.dueDate"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="年/月/日"
                                    @change="(val) => {setDueDate(val,ensureIndex)}"
                                    :disabled="isChecked || activeData.status>=4">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item
                                class="guarantyForm"
                                v-if="ensureItem.guarantyType === 3 || ensureItem.guarantyType === 4 || ensureItem.guarantyType === 5"
                                label="到期提醒"
                                :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guarantyDTOS.' + ensureIndex + '.expirationReminder'"
                                :rules="{ required: true, message: '到期提醒不能为空', trigger: ['blur','change']}">
                            <el-input maxlength="3" placeholder="30" v-model="ensureItem.expirationReminder" :disabled="isChecked || activeData.status>3"><i slot="suffix">天</i></el-input>
                        </el-form-item>
                    </div>
                </div>
                <el-button
                        @click="addEnsureMode"
                        class="setEnsureMode addEnsureMode"
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length < 3 &&
                        activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType !== 0"
                        :disabled="isChecked || activeData.status>3"
                        >
                    <!---:disabled="(activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2) || isChecked || activeData.status>=3"--->
                    <div><i class="el-icon-plus"></i><br><span>增加保证方式</span></div>
                </el-button>
            </el-form-item>
            <el-form-item
                    v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType !== 0  "
                    label="保证金金额预警阈值(注释:指应收金额或应收金额占保证金的比例)"
                    class="warnAmount"
                    :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guaranteedWarnThresholdType'"
                    :rules="{required: true, message: '请选择', trigger: 'change'}">
                <el-select
                        class="warnAmountType"
                        v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThresholdType"
                        :disabled="isChecked">
                    <el-option label="百分比" :value="1"></el-option>
                    <el-option label="金额" :value="2"></el-option>
                </el-select>
                <el-form-item
                        class="warnAmountInp"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.guaranteedWarnThreshold'"
                        :rules="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThresholdType === 1 ? percent : {required: true, message: '请输入', trigger: ['change','blur']}">
                    <el-input
                            maxlength="10"
                            :placeholder="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThresholdType === 1 ? '请输入百分比' : '请输入金额'"
                            v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThreshold"
                            :disabled="isChecked">
                        <i slot="suffix" v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThresholdType === 1">%</i>
                        <i slot="suffix" v-else-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guaranteedWarnThresholdType === 2">元</i>
                    </el-input>
                </el-form-item>
            </el-form-item>
            <el-form-item
                    label="是否出具《长假保证金额追加报告》"
                    :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.addGuarantySum'"
                    :rules="{required: true, message: '请选择', trigger: 'change'}">
                <el-radio-group v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].addGuarantySum">
                    <el-radio :label="true" :disabled="activeData.status>4">是</el-radio>
                    <el-radio :label="false" :disabled="activeData.status>4">否</el-radio>
                </el-radio-group><br>
                <div v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].addGuarantySum" class="activeRange isProvide">
                    <el-form-item
                            label="提前天数"
                            :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.sumAdvanceDays'"
                            :rules="{required: true, message: '请输入提前天数', trigger: 'blur'}">
                        <el-input v-model.trim="activeData.thirdSettlementConfigDTOS[settlementTab-1].sumAdvanceDays"
                                  :disabled="isChecked ||activeData.status>4"><i slot="suffix">天</i></el-input>
                    </el-form-item>
                </div>
                <div class="guaranteen-types">
                    <div v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].addGuarantySum" class="activeRange isProvide is-type"
                 v-for="(item,index) in activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyTypes"
                >
                    <el-form-item label="保证类型">
                        <el-select v-model="item.guarantyType" :disabled="isChecked || ((activeData.status>4 && !item.delFlag))" placeholder="请选择保证类型" >
                            <el-option label="预付款" :value="1"></el-option>
                            <el-option label="保证金" :value="2"></el-option>
                            <el-option label="保函" :value="3"></el-option>
                            <el-option label="银行汇票" :value="4"></el-option>
                            <el-option label="赊销特批" :value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="可用金额">-->
                        <!--<el-input class="amount" v-model.trim.number="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyLongVocation.guarantySum + activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyLongVocation.addGuarantySum" disabled><i slot="suffix">元</i></el-input>-->
                    <!--</el-form-item>-->
                    <el-form-item label="年度" v-if="holidayYearMap[item.longVocation]">
                        <el-input disabled v-model="holidayYearMap[item.longVocation].year" size="small" style="width:90px;"></el-input>
                    </el-form-item>
                    <el-form-item label="节假日">
                        <el-select v-model="item.longVocation" placeholder="请选择节假日"
                                   :disabled="(activeData.status>3) ||
                        (!item.delFlag && activeData.status === 3 &&  common.formatDate(new Date(),'yyyy-MM-dd') > holidayYearMap[item.longVocation].startDate)"
                        >
                            <el-option value="" label="请选择节假日"></el-option>
                            <el-option v-for="(item,index) in holidayStorage" :key="index" :label="item.holidayName" :value="item.holidayId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="追加金额">
                        <el-input
                                class="amount"
                                v-model.trim.number="item.guarantySum"
                                :disabled="(item.guarantyType <=2) || isChecked ||(activeData.status>4 && !item.delFlag)"><i slot="suffix">元</i></el-input>
                    </el-form-item>
                    <el-form-item v-if="id!=='' && activeData.status!==1 && item.guarantySum > 0">
                        <el-button type="text" @click="refund('longVocation','activity',
                        item.guarantyType,
                        activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeId,item.id,item.reversible,index)"
                                   :disabled="isChecked || item.guarantySum <= 0">{{item.guarantyType ===5?'解除':(item.guarantyType === 1 || item.guarantyType ===2)?'退款':'退回'}}</el-button>
                    </el-form-item>
                    <el-button v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyTypes.length > 1" @click="removeGuarantyType(index)" size="small"
                               icon="el-icon-minus" circle :disabled="(activeData.provideBill === true && settlementTab === 2) || (activeData.status>3) ||
                        (!item.delFlag && activeData.status === 3 &&  common.formatDate(new Date(),'yyyy-MM-dd') >holidayYearMap[item.longVocation].startDate)"></el-button>
                    <el-button v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].addGuarantySum && index === activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyTypes.length-1" @click="addGuarantyType(settlementTab-1)" size="small"
                               icon="el-icon-plus" circle :disabled="(activeData.provideBill === true && settlementTab === 2) || isChecked"></el-button>

                        <br>
                </div>
                </div>

            </el-form-item>
            <!-- 是否RSC代收 -->
            <div class="billLittleTitle"><i></i><span>是否RSC代收</span></div>
            <div class="accountMessage">
                <el-radio-group
                        v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        @change="clearBankConfigs">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group><br>
                <el-form-item
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        label="主收款方"
                        class="RSCollection RSCollectionMain"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bankConfigs.' + 0 + '.payeeId'"
                        :rules="{required: true, message: '请选择主收款方', trigger: 'change'}">
                    <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeId" @change="(val) => {return getBankName(val,true)}" filterable :disabled="isChecked">
                        <el-option v-for="item in mainPayeeOpt" :key="item.jdeCode" :label="item.companyName" :value="item.jdeCode"></el-option>
                    </el-select>
                </el-form-item><br>
                <el-form-item
                        label="打款方式"
                        class="RSCollection"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.paymentMethod'"
                        :rules="{required: true, message: '请选择打款方式', trigger: 'change'}">
                    <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod" @change="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection ?
                     getBankName() : getBankConfigDetails(activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension)" filterable :disabled="isChecked">
                        <el-option label="银行账户" :value="1"></el-option>
                        <el-option label="支付宝" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 1" class="RSCollection RSCollectionUpload">
                    <el-upload
                            style="display: inline-block"
                            :action="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentFilePath ? url+'&url='+activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentFilePath : url"
                            accept=".csv,.xlsx"
                            :file-list="activeData.thirdSettlementConfigDTOS[settlementTab-1].fileList"
                            :on-success="uploadSuccess"
                            :on-remove="()=>{payWayDisabled=false}"
                            :disabled="isChecked">
                        <el-button class="checkInterSettle" type="text"><i class="el-icon-upload2"></i>&nbsp;&nbsp;文件上传</el-button>
                    </el-upload>
                    <el-button class="checkInterSettle" type="text" @click="downloadTemplate">模板<i class="el-icon-download"></i></el-button>
                </el-form-item>
                <el-form-item
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 1 && activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        label="银行账号"
                        class="RSCollection"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bankConfigs.' + 0 + '.payeeBankId'"
                        :rules="{required: true, message: '请选择', trigger: 'change'}">
                    <el-select @change="setBank" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeBankId" filterable :disabled="isChecked">
                        <el-option v-for="(item,index) in mainPayeeBankIdOpt" :key="index" :label="item.depositBankAccount" :value="item.depositBankAccount"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-else-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        label="第三方账号"
                        class="RSCollection"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bankConfigs.' + 0 + '.mainPayeeThirdAccount'"
                        :rules="{required: true, message: '请选择', trigger: 'change'}">
                    <el-select @change="setThird" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].mainPayeeThirdAccount" filterable :disabled="isChecked">
                        <el-option v-for="(item,index) in alipaywechatAccountOpt" :key="index" :label="item.alipaywechatAccount" :value="item.alipaywechatAccount"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        label="银行账号"
                        class="RSCollection">
                    <el-input v-model.trim="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeBankId" disabled></el-input>
                </el-form-item>
                <el-form-item v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection" label="开户行" class="RSCollection">
                    <el-input v-model.trim="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs[0].payeeBankName" disabled></el-input>
                </el-form-item>
                <br>
                <el-form-item
                        label="打款维度"
                        class="RSCollection"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.paymentDimension'"
                        :rules="{required: true, message: '请选择', trigger: 'change'}">
                    <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension" filterable @change="getBankConfigDetails(activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension)" :disabled="isChecked||payWayDisabled">
                        <el-option v-if="!activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection" label="法人公司" :value="1"></el-option>
                        <el-option v-if="!activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection && activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 1" label="开票单位" :value="2"></el-option>
                        <el-option v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection" label="活动" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection" class="RSCollection">
                    <el-button @click="dialogPaymentDimension=true" class="checkInterSettle" type="text"><i class="el-icon-document"></i>&nbsp;&nbsp;设置收款方</el-button>
                    <el-dialog
                            :title="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension === 1 ? '法人公司' : '开票单位'"
                            v-if="dialogPaymentDimension"
                            :visible.sync="dialogPaymentDimension"
                            center
                            width="90%">
                        <el-table :data="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankConfigs">
                            <el-table-column property="payeeId" label="JDE Code"></el-table-column>
                            <el-table-column property="payeeName" :label="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension === 1 ? '法人公司名称' : '开票单位名称'"></el-table-column>
                            <el-table-column v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension !== 2" property="mainPayeeThirdAccount" label="第三方账号">
                                <template slot-scope="scope">
                                    <el-select @change="(val) => {return setThirdInfo(val,scope.$index)}" v-model="scope.row.mainPayeeThirdAccount" placeholder="请选择" :disabled="isChecked">
                                        <el-option v-for="(item,index) in scope.row.alipay" :key="index" :label="item.alipaywechatAccount" :value="item.alipaywechatAccount"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 1" property="payeeBankId" label="银行账号">
                                <template slot-scope="scope">
                                    <el-select @change="(val) => {return setBankInfo(val,scope.$index)}" v-model="scope.row.payeeBankId" placeholder="请选择" :disabled="isChecked">
                                        <el-option v-for="(item,index) in scope.row.bank" :key="index" :label="item.depositBankAccount" :value="item.depositBankAccount"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 &&
                             activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension !== 2" property="payeeBankId" label="银行账号"></el-table-column>
                            <el-table-column v-if="!(activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 &&
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentDimension === 2)" property="payeeBankName" label="开户行"></el-table-column>
                        </el-table>
                        <div slot="footer">
                            <el-button @click="dialogPaymentDimension = false" type="primary" size="small">关闭</el-button>
                        </div>
                    </el-dialog>
                </el-form-item>
                <div class="payWays">
                    <el-form-item
                            v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 && (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length === 1 ? !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1 ||
                            (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2 &&
                            activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) : (!(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1 || (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2
                             && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) && !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 1 || (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 2
                              && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].reversible))))"
                            label="第三方到账日期"
                            :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.alipayDate'"
                            :rules="{required: true, message: '请输入支付宝/微信提现日期', trigger: 'change'}">
                        <el-input class="keepBooksDate" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].alipayDate" :disabled="isChecked">
                            <template slot="prepend">第三方账单交易日期+</template>
                            <i slot="suffix">日</i>
                        </el-input>
                    </el-form-item>
                    <el-form-item
                            v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 2 && (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length === 1 ? !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1
                            || (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) : (!(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1
                            || (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) && !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 1 ||
                            (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].reversible))))"
                            label="银行上账日期"
                            :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bankAccountDate'"
                            :rules="[{required: true, message: '请输入银行上账日期', trigger: 'change'},
                             { validator: validate.defaultDay }
                            ]">
                        <el-input class="keepBooksDate" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankAccountDate" :disabled="isChecked" style="width:300px">
                            <!--<template slot="prepend">第三方上账日期+</template>-->
                            <template slot="prepend">第三方上账日期T+
                                <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].provideDateType" class="two-ways" placeholder="">
                                    <el-option label="自然日" :value="1"></el-option>
                                    <el-option label="工作日" :value="2"></el-option>
                                </el-select>
                            </template><i slot="suffix">日</i>
                            <!--<i slot="suffix">日</i>-->
                        </el-input>
                    </el-form-item>
                    <el-form-item v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].paymentMethod === 1 && (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS.length === 1 ? !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1 ||
                    (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) : (!(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 1 ||
                    (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[0].reversible)) && !(activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 1 ||
                    (activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].guarantyType === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[1].reversible))))"
                                  label="银行上账日期"
                                  :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.bankAccountDate'"
                                  :rules="[{required: true, message: '请输入银行上账日期', trigger: 'change' } ,
                             { validator: validate.defaultDay }]
                        ">
                        <el-input class="keepBooksDate" v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].bankAccountDate" :disabled="isChecked">
                            <!--<template slot="prepend">T+</template>-->
                            <!--<i slot="suffix">日</i>-->
                            <template slot="prepend">T+
                                <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].provideDateType" class="two-ways" placeholder="">
                                    <el-option label="自然日" :value="1"></el-option>
                                    <el-option label="工作日" :value="2"></el-option>
                                </el-select>
                            </template><i slot="suffix">日</i>
                        </el-input>
                    </el-form-item>
                </div>
                <el-form-item
                        v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection"
                        label="内部往来结算维度"
                        class="RSCollection"
                        :prop="'thirdSettlementConfigDTOS.' + (settlementTab-1) + '.innerSettlementDimension'"
                        :rules="{required: true, message: '请选择内部往来结算维度', trigger: 'change'}">
                    <el-select v-model="activeData.thirdSettlementConfigDTOS[settlementTab-1].innerSettlementDimension" filterable :disabled="isChecked">
                        <el-option label="法人公司" :value="1"></el-option>
                        <el-option label="开票单位" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="RSCollection" v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].rscCollection">
                    <el-button @click="getJdeAndName(activeData.thirdSettlementConfigDTOS[settlementTab-1].innerSettlementDimension)" class="checkInterSettle" type="text"><i class="el-icon-document"></i>&nbsp;&nbsp;查看</el-button>
                    <el-dialog :title="activeData.thirdSettlementConfigDTOS[settlementTab-1].innerSettlementDimension === 1 ? '法人公司维度' : '开票单位维度'" :visible.sync="dialogTableVisible">
                        <el-table v-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].innerSettlementDimension === 1" :data="JdeAndName">
                            <el-table-column property="jdeCode" label="JDE Code"></el-table-column>
                            <el-table-column property="companyName" label="法人公司名称"></el-table-column>
                        </el-table>
                        <el-table v-else-if="activeData.thirdSettlementConfigDTOS[settlementTab-1].innerSettlementDimension === 2" :data="JdeAndName">
                            <el-table-column property="jdeCode" label="JDE Code"></el-table-column>
                            <el-table-column property="billingUnitName" label="开票单位名称"></el-table-column>
                        </el-table>
                    </el-dialog>
                </el-form-item>
                <el-dialog title="按法人追加金额-详情" v-if="dialogAddAmount" :visible.sync="dialogAddAmount" width="60%" @close="clearCompanyAmount">
                    <el-form :model="activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum]" ref="guarantyCompany">
                        <el-form-item class="guarantyCompany" v-for="(item,index) in activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantyCompanyDTOS" :key="index" :label="item.companyName">
                            <span class="money">总计金额:</span><span class="money">{{item.amount+item.addAmount}}元</span>
                            <span class="money" v-if="id!=='' && activeData.status!==1">可用金额:</span>
                            <el-form-item
                                    v-if="id!=='' && activeData.status!==1"
                                    :prop="'guarantyCompanyDTOS.' + index + '.amount'"
                                    :rules="addAmount">
                                <el-input class="money moneyInp" placeholder="可用金额" maxlength="8" v-model.number="item.amount" :disabled="
                                activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantyType > 2 || isChecked"><i slot="suffix">元</i></el-input>
                            </el-form-item>
                            <span class="money">追加金额:</span>
                            <el-form-item
                                    :prop="'guarantyCompanyDTOS.' + index + '.addAmount'"
                                    :rules="addAmount">
                                <el-input class="money moneyInp" placeholder="追加金额" maxlength="8" v-model.number="item.addAmount"
                                          :disabled="isChecked || activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantyType <=2"><i slot="suffix">元</i></el-input>
                            </el-form-item>
                            <el-button v-if="id!=='' && activeData.status!==1" type="text" @click="refund(guarantyNum,index,activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantyType,
                            item.companyId,activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].id,activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].reversible)" :disabled="
                             isChecked || item.amount <= 0 || !item.id">退款</el-button>
                            <el-popover v-if="id!=='' && activeData.status!==1" placement="right-start" title="追加记录" width="250" trigger="hover">
                                <p v-for="(logItem,logIndex) in activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantyRecordedDTOS" :key="logIndex"
                                   v-if="parseInt(item.companyId) === parseInt(logItem.guarantyCompanyId)" class="margin-left">{{logItem.createTime}}&nbsp;&nbsp;{{logItem.guarantySum | numberFormatToThousand}}</p>
                                <el-button class="log" type="text" slot="reference" :disabled="activeData.settlementMode === 2 && activeData.thirdSettlementConfigDTOS[settlementTab-1].settlementType === 2">
                                    <i class="el-icon-document"></i>&nbsp;&nbsp;追加记录
                                </el-button>
                            </el-popover>
                        </el-form-item>
                        <div class="guarantyCompanyButton">
                            <div v-if="id!=='' && activeData.status!==1">剩余可用金额:{{surAmount(guarantyNum)}}/{{activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyDTOS[guarantyNum].guarantySum}}</div>
                            <el-button type="success" size="small" @click="totalAmount(guarantyNum)" :disabled="isChecked">确 定</el-button>
                        </div>
                    </el-form>
                </el-dialog>

            </div>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import tempIp from '../../model/tempIp'
    import scroll from '@/directives/index'
    import * as validate from '@/utils/validateItemForAcitvity'
    export default {
        name: "accountInfo",
        props:['isChecked','disabledBill','activeData','settlementPeriodTypeOpt','configItemOpt','mainPayeeOpt',
            'settlementTab','companyJDEs','billUnitJDEs','customizeAreaIds','bohSettlementKeyOpt','status','holidayStorage'],
        directives: { scroll },//引入 滚动指令
        data(){
            // var workDay = (rule,value,callback) => {
            //     if(!/^[1-9]$|^1\d$|^2[0-2]$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('请输入1-22以内的正整数'));
            //     }else{
            //         callback()
            //     }
            // };
            // var calendarDay = (rule,value,callback) => {
            //     if(!/^[1-9]$|^1\d$|^2[0-8]$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('请输入1-28以内的正整数'));
            //     }else{
            //         callback()
            //     }
            // };
            // var defaultDay = (rule,value,callback) => {
            //     if(!/^\+?[1-9]\d*$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('请输入正整数'));
            //     }else{
            //         callback()
            //     }
            // };
            // var addAmount = (rule,value,callback) => {
            //     if(!/^0\.\d{1,2}$|^[1-9]\d{0,8}\.\d{1,2}$|^[1-9]\d{0,8}$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('追加金额只能为正数并最多精确至小数点后两位'));
            //     }else{
            //         callback()
            //     }
            // };
            // var percent = (rule,value,callback) => {
            //     if(!/^([1-9]\d{0,1}|100)$/.test(value) && !this.common.isNullString(value)){
            //         callback(new Error('数值范围:1-100'));
            //     }else{
            //         callback()
            //     }
            // };
            return{
                id:'',
                mainPayeeBankIdOpt:[],
                alipaywechatAccountOpt:[],
                thirdSettlementConfigDTO:{},
                dialogTableVisible:false,
                dialogPaymentDimension:false,
                dialogAddAmount:false,
                JdeAndName:[],
                url:tempIp.master_ip+'/activity_master_data/uploadFile?type=1',
                bankInfos:[{bank:[]}],
                alipaywechatInfos:[{alipay:[]}],
                customerOpt:[],
                selectId:0,
                needCreate:true,
                workDay:[
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: validate.workDay }
                ],
                calendarDay:[
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: validate.calendarDay }
                ],
                defaultDay:[
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: validate.defaultDay }
                ],
                addAmount: { validator: validate.addAmount, trigger: ['change','blur'] },
                percent:[
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: validate.percent }
                ],
                customerIndex:1,
                customerSize:10,
                companyAddInfo:{
                    guarantyCompanyDTOS:[],
                    guarantyRecordedDTOS:[],
                    ensureIndex:null,
                    index:null,
                    guarantyType:null,
                    companyId:null,
                    id:null,
                    guarantySum:0
                },
                guarantyNum:0,
                addCompanyAmount:null,
                guarantyTypeOpt:[{
                    value:1,
                    label:'预付款',
                    disabled: false
                },{
                    value:2,
                    label:'保证金',
                    disabled: false
                },{
                    value:3,
                    label:'保函',
                    disabled: false
                },{
                    value:4,
                    label:'银行汇票',
                    disabled: false
                },{
                    value:5,
                    label:'赊销特批',
                    disabled: false
                },],
                selectObj:{},
                temString:'',
                // holidayStorage:[],
                dimensionality:[
                    {
                        value:1,
                        label:'按活动'
                    },
                    {
                        value:2,
                        label:'按法人'
                    }
                ],
                validate:validate,
                payWayDisabled:false,//文件上传后打款维度置灰
                customName:'',//用于回显
                year:'',
                holidayYearMap:{}//长假保证金 选择节假日后 显示出年度。该字段只为显示
                // :[]
                // activeData.thirdSettlementConfigDTOS[this.settlementTab-1]:this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1]
            }

        },
        methods:{
            clearSettlementPeriod(val){
                if(val === 6 || val === 7){
                    this.$set(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],'settlementDateType',1)
                }else{
                    this.$set(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],'settlementDateType',null)
                }
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].settlementPeriod = null
            },
            focusFn(param) {
                if (!param.target.value) {
                    this.temString = '';
                    this.remoteCustomerName();
                }
            },
            remoteCustomerName(val){
                let that = this;
                this.temString = val;
                let param = [
                    {
                        name:'customerName',
                        value:this.temString
                    },{
                        name:'pageSize',
                        value:this.customerSize
                    },{
                        name:'pageIndex',
                        value:this.customerIndex
                    }
                ];
                ip.getCustomerByName(this.common.joinSearchParam(param),res => {that.customerOpt = res.data})
            },
            scrollCustomerName(param,object){
                let that = this;
                if(param){
                    this.customerSize += 10;
                    this.selectObj = object;
                    let tem = [
                        {
                            name:'customerName',
                            value:this.temString
                        },
                        {
                            name:'pageSize',
                            value:this.customerSize
                        },{
                            name:'pageIndex',
                            value:this.customerIndex
                        }
                    ];
                    ip.getCustomerByName(this.common.joinSearchParam(tem),res => {that.customerOpt = res.data})
                }
            },
            getCustomerInfo(val){
                let obj = {};
                obj = this.customerOpt.find(item => {return item.id === val});
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankAccount = obj.account;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankName = obj.depositBank;
                this.$set(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],'customerName',obj.jdeCode + obj.customerName);
                this.activeData.activityCode = obj.jdeCode;
                this.activeData.customerJde = obj.jdeCode;
            },
            setDefault(val){
                let that = this;
                if(this.settlementTab === 1){
                    this.activeData.thirdSettlementConfigDTOS[0].defaultCustomer = val;
                    this.activeData.thirdSettlementConfigDTOS[1].defaultCustomer = !val
                }else{
                    this.activeData.thirdSettlementConfigDTOS[0].defaultCustomer = !val;
                    this.activeData.thirdSettlementConfigDTOS[1].defaultCustomer = val
                }
                this.activeData.thirdSettlementConfigDTOS.forEach(item => {
                    if(item.defaultCustomer){that.activeData.customerJde = item.id+''}
                })
            },
            addEnsureMode(){
                let tem = {
                    activityMasterId:parseInt(this.id),
                    guarantyType:null,
                    reversible:false,
                    guarantyDimension:1,//this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyDimension,
                    addGuarantySum:0,
                    dueDate:null,
                    expirationReminder:null,
                    longVocationAdd:false,
                    guarantySum:0,
                    guarantyRecordedDTOS:[],
                    delFlag:true//进行中的活动可新增保证方式但是不能删除
                };
                if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyDimension === 1){ //按活动
                    this.$set(tem,'guarantyCompanyDTOS',null)
                }else if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyDimension === 2){//按法人
                    this.$set(tem,'guarantyCompanyDTOS',JSON.parse(JSON.stringify(
                        this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyCompanyDTOS)));

                    tem.guarantyCompanyDTOS.forEach(item => {item.amount = 0;item.addAmount = null})
                }
                let arr = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS;
                if(arr.length>0){
                    let obj = arr.find(val=>{return val.guarantyType === 5})
                   if(obj){
                       this.dimensionality.map(x=>{
                           if(x.value ===2){

                               x.disabled = true;
                           }
                       })
                   }
                }
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.push(tem);
            },
            removeEnsureMode(ensureIndex){
                let that = this;
                this.guarantyTypeOpt.forEach(item => {
                    if(item.value === this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].guarantyType) {
                        item.disabled = false;
                        if(item.value === 5){
                            that.dimensionality[1].disabled = false;
                        }
                    }
                });
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.splice(ensureIndex,1)
            },
            getBankName(val,flag){
                let that = this ,data =this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1] ,
                bankConfigs = data.bankConfigs[0];
                // let bankParam = [{
                //     name:'brandId',
                //     value:this.activeData.brandName.split(',')[1]
                // },{
                //     name:'companyId',
                //     value:bankConfigs.payeeId
                // }];
                let alipayParam = [{
                    name:'brandId',
                    value:this.activeData.brand.split(',')[1]
                },{
                    name:'companyId',
                    value:bankConfigs.payeeId
                }];
                if(flag){
                    let obj = this.mainPayeeOpt.find(item => {return item.jdeCode === val});
                    bankConfigs.payeeName = obj.companyName
                }
                bankConfigs.mainPayeeThirdAccount = null;
                bankConfigs.payeeBankId = null;
                bankConfigs.payeeBankName = null;
                let obj = {};
                if(data.paymentMethod === 1 && (val === '86021'|| val === '86050' )){ //支付方式为 银行账户
                    ip.getBankByCompany('?brandId='+this.activeData.brand.split(',')[1],[bankConfigs.payeeId],res=>{
                        if(res.code === 200){
                            that.mainPayeeBankIdOpt = Object.values(res.data)[0];
                            obj = that.mainPayeeBankIdOpt.find(item => {return item.defaultFlag === true});
                            bankConfigs.payeeBankName = obj.depositBankName;
                            bankConfigs.payeeBankJde = obj.jdeAccount;
                            bankConfigs.payeeBankId = obj.depositBankAccount
                        }
                        // that.mainPayeeBankIdOpt = res.data
                    })
                }else if(data.paymentMethod === 2){ //支付方式为 支付宝
                    ip.getAlipayWechatByCompany('?brandId='+this.activeData.brand.split(',')[1],[bankConfigs.payeeId],res=>{
                        if(res.code === 200){
                            that.alipaywechatAccountOpt =  Object.values(res.data)[0]//res.data;
                             obj = that.alipaywechatAccountOpt.find(x=>{return x.defaultFlag === true});
                            bankConfigs.mainPayeeThirdAccount = obj.alipaywechatAccount;
                            bankConfigs.payeeBankId = obj.bankAccount;
                            bankConfigs.payeeBankName = obj.bankName;
                            bankConfigs.payeeBankJde = obj.bankJde;
                        }
                    })
                }
            },
            getCompanyNames(val,index){
                if(val === 1 && this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.length === 1){
                    this.guarantyTypeOpt.find(x=>{ return x.value === 5}).disabled = false;
                }
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[index].addGuarantySum = 0;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[index].guarantyNum = 0;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {item.guarantyDimension = val});
                if(val === 2){this.addAmountDetails()}
            },
            getJdeAndName(val){
                this.dialogTableVisible = true;
                let param = [];
                let that = this;
                if(val === 1){
                    if(this.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        this.customizeAreaIds.forEach(item => {
                            param.push({name:'jde',value:item})
                        })
                    }else{
                        param = [{name:'type',value:1}];
                        this.companyJDEs.forEach(item => {
                            param.push({name:'jde',value:item})
                        })
                    }
                    ip.getCompanyJdeAndName(that.common.joinSearchParam(param),res => {res.code === 200 ? that.JdeAndName = res.data : that.JdeAndName = []})
                }else if(val === 2){
                    if(this.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        this.customizeAreaIds.forEach(item => {
                            param.push({name:'jde',value:item})
                        })
                    }else{
                        param = [{name:'type',value:1}];
                        this.billUnitJDEs.forEach(item => {
                            param.push({name:'jde',value:item})
                        })
                    }
                    ip.getBillUnitJdeAndName(that.common.joinSearchParam(param),res => {res.code === 200 ? that.JdeAndName = res.data : that.JdeAndName = []})
                }
            },
            getBankConfigDetails(val){
                let that = this;
                let param = [];
                // this.bankInfos = [];
                // this.alipaywechatInfos = [];
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs = [];
                //法人公司
                if(val === 1){
                    if(that.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        that.customizeAreaIds.forEach(item => {param.push({name:'jde',value:item})})
                    }else{
                        param = [{name:'type',value:1}];
                        that.companyJDEs.forEach(item => {param.push({name:'jde',value:item})})
                    }
                    ip.getCompanyJdeAndName(that.common.joinSearchParam(param),res => {
                        that.activeData.thirdSettlementConfigDTOS[that.settlementTab-1].bankConfigs = [];
                        if(res.code === 200){
                            res.data.forEach(item => {
                                that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.push({payeeId:item.jdeCode,payeeName:item.companyName,payeeBankId : ''})
                            })
                            that.setPayment(true);
                        }else{
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs = null
                        }
                    })
                //开票单位
                }else if(val === 2){
                    if(that.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        that.customizeAreaIds.forEach(item => {param.push({name:'jde',value:item})})
                    }else{
                        param = [{name:'type',value:1}];
                        that.billUnitJDEs.forEach(item => {param.push({name:'jde',value:item})})
                    }
                    ip.getBillUnitJdeAndName(that.common.joinSearchParam(param),res => {
                        that.activeData.thirdSettlementConfigDTOS[that.settlementTab-1].bankConfigs = [];
                        if(res.code === 200){
                            res.data.forEach(item => {
                                that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.push({payeeId:item.jdeCode,payeeName:item.billingUnitName})
                            })
                            that.setPayment(true);
                        }else{
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs = null
                        }
                    })
                }
            },
            setPayment(flag){
                let that = this;
                let tem = [];
                // this.bankInfos = [];
                // this.alipaywechatInfos = [];
                let brandId = that.activeData.brand.split(',')[1];
                if(this.activeData.brand && this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs && (this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.length >= 1)){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.forEach(item => {
                        tem.push(item.payeeId);
                    });
                    if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentDimension === 1){//按法人
                        if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentMethod === 1){ //银行账户
                                ip.getBankByCompany('?brandId='+brandId,tem,response=>{
                                    if(response.code === 200){
                                        that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.forEach((item,index)=>{
                                            _.forEach(response.data,(value,key)=>{
                                                if(item.payeeId === key){
                                                    item.bank = value;
                                                    if(value && value.length>0){
                                                       let defaultVal = {};
                                                        defaultVal = value.find(x=>{ return x.defaultFlag});
                                                        if(defaultVal){
                                                            item.payeeBankId =  defaultVal.depositBankAccount;
                                                            item.payeeBankName = defaultVal.depositBankName;
                                                            item.payeeBankJde = defaultVal.jdeAccount
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                    }else{
                                        // that.bankInfos.push({bank:[],jde:item.payeeId})
                                    }
                                    if(!flag){
                                      this.dialogPaymentDimension = true;
                                    }
                            })
                        }else if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentMethod === 2){//支付宝
                            ip.getAlipayWechatByCompany('?brandId='+brandId,tem,response=>{
                                if(response.code === 200){
                                    that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.forEach((item,index)=>{
                                        _.forEach(response.data,(value,key)=>{
                                            if(item.payeeId === key){
                                                item.alipay = value;
                                                if(value && value.length>0){
                                                    let defaultVal = {};
                                                    defaultVal = value.find(x=>{ return x.defaultFlag});
                                                    if(defaultVal){
                                                        item.mainPayeeThirdAccount =  defaultVal.alipaywechatAccount;
                                                        item.payeeBankId = defaultVal.bankAccount;
                                                        item.payeeBankJde = defaultVal.bankJde;
                                                        item.payeeBankName = defaultVal.bankName;
                                                    }
                                                }
                                            }
                                        })
                                    })

                                }else{
                                    // that.alipaywechatInfos.push({alipay:[],jde:item.payeeId})
                                }
                                if(!flag){
                                    this.dialogPaymentDimension = true;
                                }
                            })
                        }
                    }else if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentDimension === 2){//开票单位
                        if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentMethod === 1){//银行账户
                                ip.getBankByBillingUnit('?brandId='+brandId,tem,response=>{
                                    if(response.code === 200){
                                        that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs.forEach((item,index)=>{
                                            _.forEach(response.data,(value,key)=>{
                                                if(item.payeeId === key){
                                                    item.bank = value;
                                                    if(value && value.length>0){
                                                        let defaultVal = {};
                                                        defaultVal = value.find(x=>{ return x.defaultFlag});
                                                        if(defaultVal){
                                                            item.payeeBankId =  defaultVal.depositBankAccount;
                                                            item.payeeBankName = defaultVal.depositBankName;
                                                            item.payeeBankJde = defaultVal.jdeAccount
                                                        }
                                                    }
                                                }
                                            })
                                        })
                                    }else{
                                        // that.bankInfos.push({bank:[],jde:item.payeeId})
                                    }
                                    if(!flag){
                                        this.dialogPaymentDimension = true;
                                    }
                                })
                        }
                    }
                }
                // setTimeout(() => {
                    // if(this.bankInfos.length > 1){
                    //     this.bankInfos.sort((a,b) => {
                    //         if(a.jde < b.jde){return -1}
                    //         if(a.jde > b.jde){return 1}
                    //         return 0
                    //     })
                    // }else if(this.alipaywechatInfos.length > 1){
                    //     this.alipaywechatInfos.sort((a,b) => {
                    //         if(a.jde < b.jde){return -1}
                    //         if(a.jde > b.jde){return 1}
                    //         return 0
                    //     })
                    // }
                // },500)
            },
            refundFn(param,masterType,type,loginIndex){
                let that = this;
                ip.activeRefund(param,res => {// TO DO
                    if(res.code === 200){
                        that.showTips(res.data,'success');
                        if(masterType === 'longVocation' && type === 'activity'){
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyTypes[loginIndex].guarantySum = 0
                        }else if(masterType !== 'longVocation' && type === 'activity'){
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[masterType].guarantySum = 0
                        }else if(masterType !== 'longVocation' && type !== 'activity'){
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[masterType].guarantyCompanyDTOS[type].amount = 0;
                            that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[masterType].guarantySum = 0
                        }
                    }else{
                        that.showTips(res.msg,'warning')
                    }
                })
            },
            refund(masterType,type,guarantyType,companyId,guarantyId,reversible,loginIndex){
                let that = this,reversibleAmount = 0;
                let param = {
                    activityAbbreviation:this.activeData.activityAbbreviation,
                    activityId:parseInt(this.id),
                    companyJde:companyId+'',
                    customerJde:this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].customerId+'',
                    guarantyId:guarantyId,
                    operate:2,
                    type:guarantyType,
                    reversibleAmount:reversibleAmount
                };
                this.$confirm('确定退款?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if(reversible){
                        that.$prompt('请输入冲销金额', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /^[0-9|.]+$/,
                            inputErrorMessage: '金额格式不正确'
                        }).then(({ value }) => {
                            param.reversibleAmount = Number(value);
                            that.refundFn(param,masterType,type,loginIndex);
                        }).catch(() => {
                            this.common.messageUtil({
                                type: 'info',
                                message: '取消输入'
                            });
                        });
                    }else{
                        that.refundFn(param,masterType,type,loginIndex);
                    }
                }).catch(() => {
                    this.common.messageUtil({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            showTips(text,type){this.common.messageUtil({message: text, type: type})},
            uploadSuccess(response,file,fileList){
                if(response.code === 200){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].fileList = [];
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].fileList.push(fileList[fileList.length - 1]);
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentFileName = file.name;
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentFilePath = response.data.url;
                    this.payWayDisabled = true;
                }else{
                    this.activeData.billConfigs[index].fileList = [];
                    this.showTips(response.msg,'warning');
                    this.payWayDisabled = false;
                }
            },
            addBOH(){
                if(this.settlementTab === 1){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bohSettlementKeyDTOS.push(Object.assign({},{'keyValue':null,'settlementColumn':2}));
                }else if(this.settlementTab === 2){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bohSettlementKeyDTOS.push(Object.assign({},{'keyValue':null,'settlementColumn':1}));
                }
            },
            removeBOH(index){
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bohSettlementKeyDTOS.splice(index,1)
            },
            bohQuerySearch(queryString, cb) {
                let bohSettlementKeyOpt = this.bohSettlementKeyOpt;
                let results = queryString ? bohSettlementKeyOpt.filter(this.bohCreateFilter(queryString)) : bohSettlementKeyOpt;
                cb(results);
            },
            bohCreateFilter(queryString) {
                return (bohSettlementKey) => {
                    return (bohSettlementKey.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            setBank(val){
                let obj = this.mainPayeeBankIdOpt.find(item => {return item.depositBankAccount === val});
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[0].payeeBankName = obj.depositBankName;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[0].payeeBankJde = obj.jdeAccount
            },
            setThird(val){
                let obj = this.alipaywechatAccountOpt.find(item => {return item.alipaywechatAccount === val});
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[0].payeeBankId = obj.bankAccount;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[0].payeeBankName = obj.bankName;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[0].payeeBankJde = obj.bankJde
            },
            setThirdInfo(val,index){ //设置收款方
                let obj = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].alipay.find(item => {return item.alipaywechatAccount === val});
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].payeeBankId = obj.bankAccount;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].payeeBankName = obj.bankName;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].payeeBankJde = obj.bankJde
            },
            setBankInfo(val,index){
                let obj =  this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].bank.find(item => {return item.depositBankAccount === val});
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].payeeBankName = obj.depositBankName;
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs[index].payeeBankJde = obj.jdeAccount
            },
            addAmountDetails(){
                let that = this;
                let param = [];
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {item.guarantyCompanyDTOS = []});
                if(this.activeData.rangeType === 3){
                    param = [{name:'type',value:2}];
                    this.customizeAreaIds.forEach(item => {
                        param.push({name:'jde',value:item})
                    })
                }else{
                    param = [{name:'type',value:1}];
                    this.companyJDEs.forEach(item => {
                        param.push({name:'jde',value:item})
                    })
                }

                ip.getCompanyJdeAndName(that.common.joinSearchParam(param),res => {
                    if(res.code === 200){
                        res.data.forEach(item => {
                            let tem = {};
                            if(that.id !== ''){
                                if (that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.length === 1) {
                                    that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                        addAmount: 0,
                                        amount: 0,
                                        companyId: item.id,
                                        companyName: item.companyName,
                                        guarantyId: that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].id
                                    })
                                } else if (that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.length === 2) {
                                    that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                        addAmount: 0,
                                        amount: 0,
                                        companyId: item.id,
                                        companyName: item.companyName,
                                        guarantyId: that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[0].id
                                    });
                                    that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[1].guarantyCompanyDTOS.push({
                                        addAmount: 0,
                                        amount: 0,
                                        companyId: item.id,
                                        companyName: item.companyName,
                                        guarantyId: that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[1].id
                                    })
                                }
                            }else{
                                tem = {addAmount:0,amount:0,companyId:item.id,companyName:item.companyName};
                                that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {item.guarantyCompanyDTOS.push(JSON.parse(JSON.stringify(tem)))})
                            }
                        })
                    }else{
                        this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {item.guarantyCompanyDTOS = []})
                    }
                })
            },
            totalAmount(ensureIndex){

                let addAmount = 0;
                let arr = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].guarantyCompanyDTOS;
                if(arr && arr.length >0){
                    arr.forEach(item => {
                        addAmount = addAmount + item.addAmount
                    });
                }
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].addGuarantySum = parseFloat(addAmount);
                if(this.id !== '' && this.activeData.status !== 1 &&
                    this.surAmount(ensureIndex) !== (this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].guarantySum+
                        this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].addGuarantySum)){
                    this.showTips('请正确分配可用金额','warning')
                }else{
                    this.dialogAddAmount = false
                }
            },
            clearGuarantyInfo(val,ensureIndex){
                let data = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],that = this;
                let arr = data.guarantyDTOS;
                if(val === 1 || val ===2){
                    let dataIndex = data.guarantyDTOS[ensureIndex];
                    dataIndex.addGuarantySum = 0;
                    dataIndex.dueDate = null;
                    dataIndex.expirationReminder = null;
                    // this.activeData.thirdSettlementConfigDTOS[settlementTab-1].guarantyLongVocation = [{}]
                }

                if(val === 0){
                    data.guaranteedWarnThresholdType = null;
                    data.guaranteedWarnThreshold = null;
                    data.guarantyDTOS[ensureIndex].guarantyDimension = null;
                }
                if(val === 5){  //选择赊销特批 改为按活动
                    if(arr && arr.length>0){
                        arr.map(x=>{
                            x.guarantyDimension = 1;
                        })
                    }

                    this.dimensionality[1].disabled = true;
                }
                this.guarantyTypeOpt.forEach(item => {item.disabled = false});
                if(_.isUndefined(arr.find(x=>{ return x.guarantyType === 5 }))){

                    this.dimensionality[1].disabled = false;
                }
                arr.forEach(item1 => {
                    that.guarantyTypeOpt.forEach(item2 => {if(item1.guarantyType === item2.value){
                        item2.disabled = true
                    }})
                })
            },
            setDueDate(val,ensureIndex){
                this.activeData.activityActualPeriodDTOS.forEach(item => {
                    if(item.acturalStartDate > val){
                        this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].dueDate = null;
                        this.showTips('到期日必须晚于活动实际开始日期','warning');
                        return false
                    }
                })
            },
            surAmount(ensureIndex){
                if(this.dialogAddAmount){
                    let total = 0;
                    if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].guarantyCompanyDTOS){
                        this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[ensureIndex].guarantyCompanyDTOS.forEach(item => {if(typeof item.amount === 'number'){total = total + item.amount+item.addAmount}});
                    }
                    return total
                }
            },
            companyAddAmount(ensureIndex){
                this.guarantyNum = ensureIndex;
                this.addCompanyAmount = JSON.parse(JSON.stringify(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[this.guarantyNum].guarantyCompanyDTOS));
                this.dialogAddAmount = true;
            },
            clearCompanyAmount(){
                this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS[this.guarantyNum].guarantyCompanyDTOS = JSON.parse(JSON.stringify(this.addCompanyAmount));
            },
            initData(){
                let that = this;
                let customerId = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].customerId;
                this.customerOpt = [];
                ip.getCustomerByName('?pageSize=10&pageIndex=1',res => {
                    that.customerOpt = res.data;
                    if(customerId && customerId !== '' && customerId !== null){
                        let flag = false;
                        that.customerOpt.forEach(item => {if(item.id === customerId){flag = true}});
                        if(!flag){
                            ip.getCustomerById(customerId,response => {
                                let param = {
                                    account:response.data.account,
                                    customerName:response.data.customerName,
                                    depositBank:response.data.depositBank,
                                    id:response.data.customerId,
                                    jdeCode:response.data.customerNumber
                                };
                                that.customName = response.data.customerName;
                                that.customerOpt.push(param);
                                that.$set(that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],'bankAccount',response.data.account);
                                that.$set(that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1],'bankName',response.data.depositBank)
                            })
                        }
                    }
                });
                //收款方银行
                //保证方式如果有赊销批
                if(that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS && !_.isUndefined(that.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.find(x=>{return x.guarantyType === 5 && !x.longVocationAdd}))) {
                    that.dimensionality[1].disabled = true;
                }
                if(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.length >= 1){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {
                        that.guarantyTypeOpt.forEach(item1 => {
                            if(!item.longVocationAdd){
                                if(item.guarantyType === item1.value ){item1.disabled = true};
                                // if( item.guarantyDimension === 2&& item1.value === 5){
                                //     debugger;
                                //     item1.disabled = true;
                                // }
                            }
                        })
                    })
                }
            },
            clearThirdBills(){this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].configItemId = ''},
            clearBankConfigs(val){
                if(val){
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentDimension = 3;
                    // this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {item.guarantyCompanyDTOS = null});
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].bankConfigs = [{payeeId:null, payeeName:null, mainPayeeThirdAccount:null, payeeBankId:null, payeeBankName:null,}];
                }else{
                    this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentDimension = 1;
                    // this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].guarantyDTOS.forEach(item => {
                    //     if(item.longVocationAdd){
                    //         item.addGuarantySum = 0
                    //     }
                    // });
                    this.getBankConfigDetails(this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1].paymentDimension);
                    // this.addAmountDetails()   //保证金与rsc代收 关联关系去掉
                }
            },
            addGuarantyType(index){
                let objArr = this.activeData.thirdSettlementConfigDTOS[index].guarantyTypes;
                objArr.push({
                    activityMasterId:0,
                    addGuarantySum:0,
                    guarantySum:0,
                    guarantyType:null,
                    guarantyDimension:1,
                    longVocationAdd:true,
                    longVocation:'',
                    delFlag:true
                })
            },
            removeGuarantyType(index){
                let obj = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1];
                obj.guarantyTypes.splice(index,1)
            },
            readyTopay(res){
                if (res) { //预付款不能出具结算报告至第三方
                    let obj = this.activeData.thirdSettlementConfigDTOS[this.settlementTab - 1].guarantyDTOS;
                    let index = obj.findIndex(x => {
                        return !x.longVocationAdd && x.guarantyType === 1
                    });
                    if (index > -1) {
                        this.$confirm('修改此项，保证方式中的预付款将被删除，确定删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            obj[index].guarantyType = null;
                        }).catch(() => {
                        });
                    } else {
                        this.guarantyTypeOpt[0].disabled = true;
                    }
                }else{
                    this.guarantyTypeOpt[0].disabled = false;
                }
            },
            downloadTemplate(){
                ip.downloadActivityTemplate('application/vnd.ms-excel',res=>{
                    this.common.exportTemplate('模板.xlsx',res)
                })
            }
        },
        beforeMount(){
            // ip.getHolidayList('?isLongHoliday=1&pageSize=99999&year='+new Date().getFullYear(),res=>{
            //     if(res.code === 200){
            //         this.holidayStorage = res.data.list;
            //         this.holidayStorage.forEach(x=>{
            //             this.holidayYearMap[x.holidayId] = x;//x.year
            //         })
            //     }
            // })
            this.holidayStorage.forEach(x=>{
                this.holidayYearMap[x.holidayId] = x;//x.year
            })
        },
        mounted(){
            let that = this;
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
                // let obj = this.activeData.thirdSettlementConfigDTOS[this.settlementTab-1];
            }
            this.initData();
            // ip.getHolidayList('?isLongHoliday=1&pageSize=99999',function(res){
            //     if(res.code === 200){
            //         that.holidayStorage = res.data.list.filter(x=>{return x.year === new Date().getFullYear()});//当年的节假日
            //         res.data.list.forEach(x=>{
            //             that.holidayYearMap[x.holidayId] = x.year  //对当年以前的已经保存的节假日进行赋值
            //         })
            //     }
            // })

        },
        // filters:{
        //     addGuarantySumFormat:function (value) {
        //         if(!value)return '0.00';
        //         let intPart =  Number(value)|0; //获取整数部分
        //         let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
        //         let floatPart = ".00"; //预定义小数部分
        //         let value2Array = value.toString().split(".");
        //         //=2表示数据有小数位
        //         if(value2Array.length === 2) {
        //             floatPart = value2Array[1].toString(); //拿到小数部分
        //             if(floatPart.length === 1) { //补0,实际上用不着
        //                 return intPartFormat + "." + floatPart + '0';
        //             }else{
        //                 return intPartFormat + "." + floatPart;
        //             }
        //         }else{
        //             return intPartFormat + floatPart;
        //         }
        //     }
        // }
    }
</script>

<style lang="scss" >
    @import '../../assets/scss/master';
    .guaranteen-types{
        display: inline-block;
        width:calc(100% - 232px);
        vertical-align: top;
        box-sizing: border-box;
    }
    .guaranteen-types>div{
        display: block;
    }
    .isProvide{
        /*display: block;*/
        width: 200px;
    }
    .is-type{
        width:80%;
        display: block;
    }
    .is-type + .is-type{
        margin-top:5px;
    }
    .margin-left{
        margin-left:20px;
    }
    .third-name{
        width:100%;
    }
    .accountInfo /deep/ .el-select__input {
        /*vertical-align: baseline;*/
    }
    .accountInfo /deep/ .el-select__tags .el-tag--small{
        height:25px;
        &:focus{
            outline:none;
            border:none;
            padding:0;
        }
    }
    :focus {
        outline: -webkit-focus-ring-color auto 0;
    }
    .two-ways /deep/ .el-input--suffix{
            width:100px;
    }
    .two-ways /deep/  .el-input__suffix {
        right:18px;
    }
</style>
