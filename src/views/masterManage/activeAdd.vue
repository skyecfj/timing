<template>
    <div class="viewForm">
        <div class="activeHeader">
            <el-button size="small" type="success" plain @click='cancel' class="c-button">取消</el-button>
            <el-button size="small" type="success" v-if="active > 0" plain @click='prev' class="c-button">上一步</el-button>
            <el-button size="small" type="success" v-if="active === 3" @click="insertActive" class="c-button" :disabled="isChecked">保存</el-button>
            <el-button size="small" type="success" v-if="active === 0" @click="firstNext" class="c-button" :disabled="loading">下一步</el-button>
            <el-button size="small" type="success" v-if="active === 1" @click="secondNext" class="c-button">下一步</el-button>
            <el-button size="small" type="success" v-if="active === 2" @click="thirdNext" class="c-button">下一步</el-button>
        </div>
        <div class="activeContent">
            <!-- 步骤条 -->
            <el-steps :active="active" finish-status="success">
                <el-step title="基础信息"></el-step>
                <el-step title="收/付款信息"></el-step>
                <el-step title="核对/核算信息"></el-step>
                <el-step title="联系人信息"></el-step>
            </el-steps>
            <el-form
                    label-position="top"
                    ref="activeData"
                    :model="activeData"
                    :rules="rules"
                    label-width="100px">
                <!-- 基础信息 -->
                <div class="basicInfo" v-if="active === 0">
                    <el-form-item label="活动名称" class="basicWidth basicSmallWidth" prop="activityName">
                        <el-input size="small" placeholder="请输入" v-model="activeData.activityName" clearable maxlength="20" @change="getActiveName" :disabled="isChecked"></el-input>
                    </el-form-item>
                    <el-form-item label="活动简称" class="basicWidth basicSmallWidth" prop="activityAbbreviation">
                        <el-input size="small" placeholder="请输入" v-model="activeData.activityAbbreviation" clearable maxlength="20" @change="checkAbbreviation" :disabled="isChecked"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌" class="basicWidth basicSmallWidth" prop="brand">
                        <el-select v-model="activeData.brand" placeholder="请选择" @change="getBrandName" :disabled="isChecked">
                            <el-option v-for="(item,index) in brandOpt" :key="index" :label="item.englishName" :value="item.englishName+','+item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="网上支付号前三位" class="basicWidth basicSmallWidth" prop="activityEnglishName">
                        <el-input size="small" placeholder="请输入" v-model="activeData.activityEnglishName" clearable maxlength="10" :disabled="isChecked"></el-input>
                    </el-form-item>
                    <el-form-item label="支付公司" class="basicWidth basicSmallWidth">
                        <el-input size="small" placeholder="请输入" v-model="activeData.payCompany" clearable :disabled="isChecked" style="width:416px"></el-input>
                    </el-form-item>
                    <div class="basicCarousel">
                        <div class="basicCarouselBar" ref="basicCarouselBar">
                            <el-card v-for="(contract,index) in activeData.contractDTOS" :key="index">
                                <el-button v-if="activeData.contractDTOS.length > 1" icon="el-icon-delete" class="delContract" @click="delCompact(index)" :disabled="isChecked || !baseData.contract.newContract"></el-button>
                                <el-form-item
                                        label="百胜合同主体"
                                        class="basicWidth"
                                        :prop="'contractDTOS.'+index+'.mainBody'"
                                        :rules="{required: true, message: '百胜合同主体不能为空', trigger: 'change'}">
                                    <el-select v-model="contract.mainBody" placeholder="请选择" filterable
                                               :disabled="isChecked || !baseData.contract.newContract ||(activeData.status === 3&&!contract.disabledFlag)">
                                        <el-option v-for="item in mainBodyOpt" :key="item.jdeCode" :label="item.companyName" :value="item.jdeCode"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item
                                        label="合同签订日期"
                                        class="basicWidth"
                                        :prop="'contractDTOS.'+index+'.signDate'"
                                        :rules="{required: true, message: '合同签订日期不能为空', trigger: 'change'}">
                                    <el-date-picker
                                            size="small"
                                            value-format="yyyy-MM-dd"
                                            @change="(val) => {return getSignDateRange(val,index)}"
                                            v-model="contract.signDate"
                                            type="date"
                                            placeholder="年/月/日"
                                            :disabled="isChecked || !contract.newContract ||(activeData.status === 3&&!contract.disabledFlag)">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item
                                        label="活动机制"
                                        class="basicWidthTextarea">
                                    <el-input size="small" type="textarea" :rows="5" placeholder="请输入" v-model="contract.activityMechanism" clearable maxlength="500" :disabled="isChecked"></el-input>
                                </el-form-item>
                                <el-form-item
                                        label="合同约定活动期间"
                                        class="basicWidth"
                                        :prop="'contractDTOS.'+index+'.range'"
                                        :rules="{required: true, message: '合同约定活动期间不能为空', trigger: 'change'}">
                                    <div class="block">
                                        <el-date-picker
                                                value-format="yyyy-MM-dd"
                                                @change="(val) => {return getDateRange(val,index)}"
                                                v-model="contract.range"
                                                type="daterange"
                                                align="right"
                                                unlink-panels
                                                range-separator="-"
                                                start-placeholder="年/月/日"
                                                end-placeholder="年/月/日"
                                                :disabled="isChecked || !contract.newContract ||(activeData.status === 3&&!contract.disabledFlag)">
                                        </el-date-picker>
                                    </div>
                                </el-form-item>
                                <el-form-item
                                        label="活动到期提醒"
                                        class="basicWidth"
                                        :prop="'contractDTOS.'+index+'.expirationReminder'"
                                        :rules="expirationReminderRules">
                                    <el-input size="small" placeholder="" v-model="contract.expirationReminder" maxlength="2"
                                              :disabled="isChecked || !contract.newContract ||(activeData.status === 3&&!contract.disabledFlag)"><span slot="suffix">&nbsp;天&nbsp;</span></el-input>
                                </el-form-item><br>
                                <el-form-item label="合同存档电子文档编号" class="basicWidth">
                                    <el-input size="small" placeholder="请输入" v-model.trim="contract.archiveElectronicDocNo"
                                              :disabled="isChecked || !contract.newContract ||(activeData.status === 3&&!contract.disabledFlag)" type="number"
                                              oninput="if(value.length>9)value=value.slice(0,9)" clearable @mousewheel.native.prevent></el-input>
                                </el-form-item>
                            </el-card>
                            <el-card class="addCompacts" v-if="activeData.contractDTOS.length < 10">
                                <el-button
                                        @click="addCompact"
                                        class=""
                                        :disabled="isChecked">
                                    <div><i class="el-icon-plus"></i><br><span>新增合同</span></div>
                                </el-button>
                            </el-card>
                        </div>
                    </div>
                    <div class="basicScrollBar">
                        <i v-for="(contract,index) in activeData.contractDTOS" :key="index" :class="index === activeBar ? 'basicScroll active' : 'basicScroll'" @click="getCompact(index)"></i>
                    </div>
                    <el-form-item
                            v-for="(activityActual,index) in activeData.activityActualPeriodDTOS"
                            :key="index"
                            v-if="index === activeBar"
                            label="活动实际期间"
                            class="basicWidth"
                            :prop="'activityActualPeriodDTOS.' + index + '.date'"
                            :rules="{required: true, message: '活动实际期间不能为空', trigger: 'change'}">
                        <div class="block">
                            <el-date-picker
                                    value-format="yyyy-MM-dd"
                                    @change="(val) => {return getActivityActual(val,index)}"
                                    v-model="activityActual.date"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="-"
                                    start-placeholder="年/月/日"
                                    end-placeholder="年/月/日"
                                    :disabled="isChecked">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="活动类型" prop="activityType">
                        <el-select v-model="activeData.activityType" :disabled="isChecked">
                            <el-option v-for="item in activityTypeOpt" :key="parseInt(item.dictionaryEntryCode)" :label="item.dictionaryEntryName" :value="parseInt(item.dictionaryEntryCode)"></el-option>
                        </el-select>
                        <el-input class="basicWidth" v-if="activeData.activityType === 1" v-model="activeData.activityTypeCode"
                                  placeholder="SRB Project Code" :disabled="isChecked" maxlength="12"
                                  oninput="value=value.replace(/[^\w\/]/ig,'')"

                        ></el-input>
                    </el-form-item>
                    <el-form-item label="活动形式" prop="activityMode">
                        <el-select v-model="activeData.activityMode" :disabled="isChecked">
                            <el-option v-for="item in activityModeOpt" :key="parseInt(item.dictionaryEntryCode)" :label="item.dictionaryEntryName" :value="parseInt(item.dictionaryEntryCode)"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动范围" prop="rangeType" class="basicRangeType">
                        <el-radio-group v-model="activeData.rangeType" @change="clearRange" :disabled="isChecked || activeData.status >= 3">
                            <!--<el-radio :label="1">法人公司/开票单位</el-radio>-->
                            <el-radio :label="2">餐厅</el-radio>
                            <el-radio :label="3">自定义区域</el-radio>
                        </el-radio-group><br>
                        <!--<div v-if="activeData.rangeType === 1" class="basicActiveRange" v-loading="loading">-->
                        <!--<div class="basicActiveRangeHeader">-->
                        <!--<el-checkbox v-model="billUnitChecked" @change="selectAllBillUnit" :disabled="isChecked || activeData.status === 3" :indeterminate="selectStatus === 0">全选</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;-->
                        <!--<el-input class="basicSmallWidth" placeholder="请输入法人公司/开票单位名称" v-model="filterBillUnitText" :disabled="isChecked"></el-input>&nbsp;-->
                        <!--</div>-->
                        <!--<el-scrollbar class="basicActiveRangeContent">-->
                        <!--<el-tree-->
                        <!--:data="billUnitData"-->
                        <!--:props="billUnitProps"-->
                        <!--node-key="id"-->
                        <!--show-checkbox-->
                        <!--:default-checked-keys="selectBillUnitKey"-->
                        <!--:filter-node-method="filterBillUnitNode"-->
                        <!--ref="billUnit"-->
                        <!--@check="getSelectedBillUnitKeys">-->
                        <!--</el-tree>-->
                        <!--</el-scrollbar>-->
                        <!--</div>-->
                        <div v-if="activeData.rangeType === 2" class="basicActiveRange" v-loading="loading">
                            <div class="basicActiveRangeHeader">
                                <el-checkbox v-model="companyChecked" @change="selectAllCompany " :disabled="isChecked || activeData.status === 3">全选</el-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;
                                <el-input class="basicSmallWidth" placeholder="请输入餐厅名称" v-model="filterCompanyText" :disabled="isChecked"></el-input>&nbsp;
                            </div>
                            <el-scrollbar class="basicActiveRangeContent">
                                <el-tree
                                        :data="companyData"
                                        :props="companyProps"
                                        node-key="id"
                                        show-checkbox
                                        :default-checked-keys="selectCompanyKey"
                                        :filter-node-method="filterCompanyNode"
                                        ref="company"
                                        @check="getSelectedCompanyKeys">
                                </el-tree>
                            </el-scrollbar>
                        </div>
                        <div v-if="activeData.rangeType === 3" class="activeRange">
                            <div v-for="(item,index) in activeData.rangeDTOS" :key="index">
                                <el-select v-model="item.rangeValue" filterable placeholder="请选择" :disabled="isChecked">
                                    <el-option v-for="item in activityAreaOpt" :key="item.id" :label="item.customizeActivityAreaName" :value="item.id"></el-option>
                                </el-select>&nbsp;&nbsp;
                                <el-button v-if="activeData.rangeDTOS.length > 1" size="small" icon="el-icon-minus" @click="removeRangeDTOs(index)" circle :disabled="isChecked"></el-button>
                                <el-button v-if="index + 1 === activeData.rangeDTOS.length" size="small" icon="el-icon-plus" @click="addRangeDTOs" circle :disabled="isChecked"></el-button>
                            </div>
                            <router-link class="link" :to="{name:'customArea'}">新增自定义区域</router-link>
                        </div>
                    </el-form-item>
                    <el-form-item label="加盟商参与" prop="franchiseeSettlementType">
                        <el-radio-group v-model="activeData.franchiseeSettlementType === 0 ? false : true" @change="setJoin" :disabled="isChecked">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group><br>
                        <div v-if="activeData.franchiseeSettlementType !== 0" class="activeRange">
                            <el-select v-model="activeData.franchiseeSettlementType" :disabled="isChecked">
                                <el-option :value="1" label="百胜代收代付"></el-option>
                                <el-option :value="2" label="独立结算"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item label="结算/进单途径" prop="orderWayType">
                        <el-radio-group v-model="activeData.orderWayType" @change="clearOrderWay" :disabled="isChecked">
                            <el-radio :label="1">堂食</el-radio>
                            <el-radio :label="2">外卖</el-radio>
                        </el-radio-group><br>
                        <el-form-item v-if="activeData.orderWayType === 1" class="activeRange" prop="eatIn">
                            <el-checkbox-group v-model="activeData.eatIn" class="accountWays" @change="getEatIn" :disabled="isChecked">
                                <el-checkbox v-for="(eat, index) in eatInOpt" :key="index" :label="eat.dictionaryEntryName" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item v-else-if="activeData.orderWayType === 2" class="activeRange" prop="takeOut">
                            <el-radio-group v-model="activeData.takeOut" class="accountWays" @change="getTakeOut" :disabled="isChecked">
                                <el-radio v-for="(take, index) in takeOutOpt" :key="index" :label="take.dictionaryEntryName" border></el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="直联/非直联" prop="directCon">
                        <el-select v-model="activeData.directCon" placeholder="请选择" :disabled="isChecked">
                            <el-option label="直联" :value="true"></el-option>
                            <el-option label="非直联" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input type="textarea" :rows="4" v-model="activeData.remark" maxlength="500" placeholder="请输入" :disabled="isChecked"></el-input>
                    </el-form-item>
                </div>
                <!-- 收/付款信息 -->
                <div class="billInfo" v-else-if="active === 1">
                    <div class="billTitle"><i></i><span>百胜收款</span></div>
                    <el-form-item class="billSettle" label="结算类型" prop="settlementMode">
                        <el-select v-model="activeData.settlementMode" @change="switchSettlementMode" :disabled="isChecked">
                            <el-option label="全单单客户" :value="1"></el-option>
                            <el-option label="非全单单客户" :value="2"></el-option>
                            <el-option label="非全单多客户" :value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="activeData.settlementMode === 2" class="billSettle" label="顾客实付/第三方补贴是否合并结算" prop="settlementConsolidation">
                        <el-select v-model="activeData.settlementConsolidation" @change="mergeSettle" :disabled="isChecked">
                            <el-option label="是" :value="true"></el-option>
                            <el-option label="否" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-tabs v-model="activeTab" type="card" @tab-click="switchTab">
                        <el-tab-pane :label="activeData.settlementMode !== 1 ? '顾客实付' : '顾客实付+第三方补贴'" name="first">
                            <accountInfo
                                    :isChecked="isChecked"
                                    :disabledBill="disabledBill"
                                    :settlementTab="1"
                                    :activeData="activeData"
                                    :settlementPeriodTypeOpt="settlementPeriodTypeOpt"
                                    :configItemOpt="configItemOpt"
                                    :mainPayeeOpt="mainPayeeOpt"
                                    :companyJDEs="companyJDEs"
                                    :billUnitJDEs="billUnitJDEs"
                                    :customizeAreaIds="customizeAreaIds"
                                    :bohSettlementKeyOpt="bohSettlementKeyOpt"
                                    :holidayStorage="holidayStorage"
                                    ref="acc1"
                                    :status="activeData.status">
                            </accountInfo>
                        </el-tab-pane>
                        <el-tab-pane v-if="activeData.settlementMode !== 1" label="第三方补贴" name="second">
                            <accountInfo
                                    :isChecked="isChecked"
                                    :disabledBill="disabledBill"
                                    :settlementTab="2"
                                    :activeData="activeData"
                                    :settlementPeriodTypeOpt="settlementPeriodTypeOpt"
                                    :configItemOpt="configItemOpt"
                                    :mainPayeeOpt="mainPayeeOpt"
                                    :companyJDEs="companyJDEs"
                                    :billUnitJDEs="billUnitJDEs"
                                    :customizeAreaIds="customizeAreaIds"
                                    :bohSettlementKeyOpt="bohSettlementKeyOpt"
                                    :holidayStorage="holidayStorage"
                                    ref="acc2"
                                    :status="activeData.status">
                            </accountInfo>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="billTitle">
                        <i></i><span>百胜/第三方补贴计算方法</span>
                    </div>
                    <el-form-item label="是否计算百胜补贴" prop="calculateBsSubsidy">
                        <el-radio-group v-model="activeData.calculateBsSubsidy" :disabled="isChecked">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.calculateBsSubsidy" label="第三方列示百胜补贴" prop="listBsSubsidy">
                        <el-radio-group v-model="activeData.listBsSubsidy" :disabled="isChecked">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="activeData.calculateBsSubsidy === true && activeData.listBsSubsidy === false" class="activeRange showSubsidy">
                        <el-select v-model="activeData.bsSubsidyListRule" :disabled="isChecked">
                            <el-option v-for="item in accountForm" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select><br><br>
                        <!-- 百分比第三方列示百胜补贴 -->
                        <div v-if="activeData.bsSubsidyListRule === 1">
                            <el-select v-model="activeData.bsSubsidyListColumn" class="showSubsidyWidth" :disabled="isChecked">
                                <el-option v-for="item in accountMoney" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>&nbsp;×&nbsp;
                            <el-form-item class="showSubsidyWidth" prop="bsSubsidyPercent" :rules="percent">
                                <el-input v-model.trim="activeData.bsSubsidyPercent" :disabled="isChecked" placeholder="请输入百分比" ><i slot="suffix">%</i></el-input>
                            </el-form-item>
                        </div>
                        <!-- 每笔订单金额 -->
                        <el-input v-else-if="activeData.bsSubsidyListRule === 2" maxlength="6" placeholder="请输入金额" v-model="activeData.bsSubsidyPercent" :disabled="isChecked"><i slot="suffix">元</i></el-input>
                    </div>
                    <el-form-item label="是否计算第三方补贴" prop="calculateThirdSubsidy">
                        <el-radio-group v-model="activeData.calculateThirdSubsidy" :disabled="isChecked">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="activeData.calculateThirdSubsidy" label="第三方列示第三方补贴" prop="listThirdSubsidy">
                        <el-radio-group v-model="activeData.listThirdSubsidy" :disabled="isChecked">
                            <el-radio :label=true>是</el-radio>
                            <el-radio :label=false>否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="activeData.calculateThirdSubsidy === true && activeData.listThirdSubsidy === false" class="activeRange showSubsidy">
                        <el-select v-model="activeData.thirdSubsidyListRule" placeholder="请选择" :disabled="isChecked">
                            <el-option v-for="item in accountForm" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select><br><br>
                        <!-- 百分比第三方列示第三方补贴 -->
                        <div v-if="activeData.thirdSubsidyListRule === 1">
                            <el-select v-model="activeData.thirdSubsidyListColumn" class="showSubsidyWidth" :disabled="isChecked">
                                <el-option v-for="item in accountMoney" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>&nbsp;×&nbsp;
                            <el-form-item class="showSubsidyWidth" prop="thirdSubsidyPercent" :rules="percent">
                                <el-input v-model.trim="activeData.thirdSubsidyPercent" :disabled="isChecked" placeholder="请输入百分比"><i slot="suffix">%</i></el-input>
                            </el-form-item>
                        </div>
                        <!-- 每笔订单金额 -->
                        <el-input v-else-if="activeData.thirdSubsidyListRule === 2" maxlength="6" placeholder="请输入金额" v-model="activeData.thirdSubsidyPercent" :disabled="isChecked"><i slot="suffix">元</i></el-input>
                    </div>
                    <div class="billTitle"><i></i><span>百胜付款</span></div>
                    <div class="chargeFeesContent">
                        <el-card v-for="(chargeFee,chargeFeeIndex) in activeData.chargeFees" :key="chargeFeeIndex" class="charge-fees">
                            <el-form-item class="chargeFeesType">
                                <el-select v-model="chargeFee.chargeType" :disabled="isChecked"  >
                                    <el-option value="" label="无" :disabled="activeData.chargeFees.length>0"></el-option>
                                    <el-option

                                            label="手续费"
                                            :value="1" :disabled="(activeData.chargeFees.length === 2 &&
                                            ((activeData.chargeFees[0].chargeType === 1 && chargeFeeIndex === 1) || (activeData.chargeFees[0].chargeType === 2 && chargeFeeIndex === 0)))"></el-option>
                                    <el-option

                                            label="服务费"
                                            :value="2" :disabled="(activeData.chargeFees.length === 2 &&
                                            ((activeData.chargeFees[0].chargeType === 2 && chargeFeeIndex === 1) || (activeData.chargeFees[0].chargeType === 1 && chargeFeeIndex === 0)))"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-button class="delChargeFee" icon="el-icon-delete" @click="delChargeFee(chargeFeeIndex)" :disabled="isChecked"></el-button>
                            <div class="showSubsidy serviceCharge" v-if="chargeFee.chargeType">
                                <el-form-item
                                        :label="chargeFee.chargeType === 1 ? '是否单独结算手续费' : '是否单独结算服务费'"
                                        :prop="'chargeFees.'+chargeFeeIndex+'.handingChargeSeparateSettlement'"
                                        :rules="chargeFee.chargeType === 1 ? { required: true, message: '请选择是否单独结算手续费', trigger: 'change' } : { required: true, message: '请选择是否单独结算服务费', trigger: 'change' }">
                                    <el-radio-group v-model="chargeFee.handingChargeSeparateSettlement" :disabled="isChecked">
                                        <el-radio :label=true>是</el-radio>
                                        <el-radio :label=false>否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item
                                        :label="chargeFee.chargeType === 1 ? '第三方账单是否列示手续费' : '第三方账单是否列示服务费'"
                                        :prop="'chargeFees.'+chargeFeeIndex+'.listHandingCharge'"
                                        :rules="chargeFee.chargeType === 1 ? { required: true, message: '请选择第三方账单是否列示手续费', trigger: 'change' } : { required: true, message: '请选择第三方账单是否列示服务费', trigger: 'change' }">
                                    <el-radio-group v-model="chargeFee.listHandingCharge" :disabled="isChecked" @change="clearChargeMinAmount">
                                        <el-radio :label=true>是</el-radio>
                                        <el-radio :label=false>否</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div class="activeRange" v-if="chargeFee.listHandingCharge === true">
                                    <el-select v-model="chargeFee.handingChargeListRule" placeholder="请选择" :disabled="isChecked">
                                        <el-option v-for="item in accountForm" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select><br><br>
                                    <!-- 百分比 -->
                                    <div v-if="chargeFee.handingChargeListRule === 1">
                                        <el-select v-model="chargeFee.handingChargeListColumn" class="showSubsidyWidth" :disabled="isChecked">
                                            <el-option v-for="item in accountMoney" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>&nbsp;×&nbsp;
                                        <el-form-item class="showSubsidyWidth" :prop="'chargeFees.'+chargeFeeIndex+'.handingChargePercent'" :rules="percent">
                                            <el-input v-model.trim="chargeFee.handingChargePercent" class="showSubsidyWidth" :disabled="isChecked" placeholder="请输入百分比"><i slot="suffix">%</i></el-input>
                                        </el-form-item>
                                    </div>
                                    <!-- 每笔订单金额 -->
                                    <el-input v-else-if="chargeFee.handingChargeListRule === 2" maxlength="6" placeholder="请输入金额" v-model="chargeFee.handingChargePercent" :disabled="isChecked"><i slot="suffix">元</i></el-input>
                                </div>
                                <div class="activeRange" v-else-if="chargeFee.listHandingCharge === false">
                                    <el-select v-model="chargeFee.handingChargeListRule" placeholder="请选择" :disabled="isChecked" @change="clearChargeMinAmount">
                                        <el-option v-for="item in accountForm" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select><br><br>
                                    <!-- 百分比 -->
                                    <div v-if="chargeFee.handingChargeListRule === 1">
                                        <el-select v-model="chargeFee.handingChargeListColumn" class="showSubsidyWidth" :disabled="isChecked">
                                            <el-option v-for="item in accountMoney" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>&nbsp;×&nbsp;
                                        <el-form-item class="showSubsidyWidth" :prop="'chargeFees.'+chargeFeeIndex+'.handingChargePercent'" :rules="percent">
                                            <el-input v-model.trim="chargeFee.handingChargePercent" class="showSubsidyWidth" :disabled="isChecked" placeholder="请输入百分比"><i slot="suffix">%</i></el-input>
                                        </el-form-item>
                                        <!--<el-form-item v-if="chargeFee.chargeType === 1" class="showSubsidyWidth" :prop="'chargeFees.'+chargeFeeIndex+'.handingChargeMinAmount'" :rules="{ required: true, message: '请输入', trigger: ['blur','change'] }">-->
                                        <!--<el-input v-model.trim="chargeFee.handingChargeMinAmount" class="showSubsidyWidth" :disabled="isChecked" placeholder="最低金额"><i slot="suffix">元</i></el-input>-->
                                        <!--</el-form-item>-->
                                    </div>
                                    <!-- 每笔订单金额 -->
                                    <el-input v-else-if="chargeFee.handingChargeListRule === 2" maxlength="6" placeholder="请输入金额" v-model="chargeFee.handingChargePercent" :disabled="isChecked"><i slot="suffix">元</i></el-input>
                                </div>
                                <el-form-item
                                        label="应收付款发票种类"
                                        :prop="'chargeFees.'+chargeFeeIndex+'.invoiceType'"
                                        :rules="{ required: true, message: '请选择应收付款发票种类', trigger: 'change' }">
                                    <el-radio-group v-model="chargeFee.invoiceType" :disabled="isChecked">
                                        <el-radio :label="1">增值税普通发票</el-radio>
                                        <el-radio :label="2">增值税专用发票</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </div>
                        </el-card>
                        <!--<el-card class="addChargeFees" v-if="activeData.chargeFees.length < 2">-->
                        <el-button :disabled="isChecked" @click="addChargeFee" v-if="activeData.chargeFees.length < 2
                             && !(activeData.chargeFees.length ===1&& !activeData.chargeFees[0].chargeType)"  class="setGathering" round type="info">
                            <div><i class="el-icon-plus"></i><span>新增百胜付款类型</span></div>
                        </el-button>
                        <!--</el-card>-->
                    </div>
                </div>
                <!-- 核对/核算信息 -->
                <div class="checkInfo" v-else-if="active === 2">
                    <div class="billTitle"><i></i><span>核对信息</span></div>
                    <div class="billLittleTitle" v-if="activeData.provideBill"><i></i><span>账单信息</span></div>
                    <div class="basicCarousel" v-if="activeData.provideBill">
                        <div class="basicCarouselBar" ref="checkInfoBar">
                            <el-card class="accountState checkInfoCard" v-for="(isSelectBill,index) in activeData.billConfigs" :key="index">
                                <div slot="header"><span>{{isSelectBill.billName}}</span></div>
                                <el-form-item
                                        label="账单预计提供日期"
                                        :prop="'billConfigs.'+index+'.billProvideDateType'"
                                        :rules="{required: true, message: '请选择账单预计提供日期', trigger: 'change'}">
                                    <el-select v-model="isSelectBill.billProvideDateType" filterable :disabled="isChecked || disabledBill" @change="(val) => {return clearBillProvideDate(val,index)}">
                                        <el-option v-for="item in settlementPeriodTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                    <el-form-item
                                            class="checkInfoCardItem"
                                            :prop="'billConfigs.'+index+'.billProvideDate'"
                                            :rules="((isSelectBill.billProvideDateType === 1 || isSelectBill.billProvideDateType === 6 ||
                                            isSelectBill.billProvideDateType === 7) && isSelectBill.settlementDateType === 1 ? calendarDay :
                                            ((isSelectBill.billProvideDateType === 1 || isSelectBill.billProvideDateType === 6 || isSelectBill.billProvideDateType === 7) &&
                                            isSelectBill.settlementDateType === 2 ? workDay : { required: true, message: '请选择', trigger: ['change','blur'] }))">
                                        <!-- 按月  没有自然日和工作日区分 -->
                                        <el-input v-if="isSelectBill.billProvideDateType === 1" class="cycle" v-model="isSelectBill.billProvideDate" :disabled="isChecked || disabledBill">
                                            <template slot="prepend">
                                                <i>T+</i>
                                                <el-select v-model="isSelectBill.settlementDateType" >
                                                    <el-option label="自然日" :value="1"></el-option>
                                                    <el-option label="工作日" :value="2"></el-option>
                                                </el-select>
                                            </template><i slot="suffix">日</i>
                                        </el-input>
                                        <el-input
                                                v-else-if="isSelectBill.billProvideDateType  === 6"
                                                class="cycle"
                                                v-model="isSelectBill.billProvideDate"
                                                :disabled="isChecked || disabledBill">
                                            <template slot="prepend">T+</template>
                                            <i slot="suffix">日</i>
                                        </el-input>
                                        <!-- 按月 -->
                                        <!--<el-input v-else-if="isSelectBill.billProvideDateType === 6" class="cycle" v-model="isSelectBill.billProvideDate" :disabled="isChecked || disabledBill">-->
                                        <!--<template slot="prepend">-->
                                        <!--<el-select v-model="isSelectBill.settlementDateType">-->
                                        <!--<el-option label="自然日" :value="1"></el-option>-->
                                        <!--<el-option label="工作日" :value="2"></el-option>-->
                                        <!--</el-select>-->
                                        <!--</template>-->
                                        <!--</el-input>-->
                                        <!-- 活动结束 -->
                                        <el-input v-else-if="isSelectBill.billProvideDateType === 7" class="cycle" v-model="isSelectBill.billProvideDate" :disabled="isChecked || disabledBill">
                                            <template slot="prepend">
                                                <el-select v-model="isSelectBill.settlementDateType">
                                                    <el-option label="自然日" :value="1"></el-option>
                                                    <el-option label="工作日" :value="2"></el-option>
                                                </el-select>
                                            </template>
                                        </el-input>
                                        <!-- 每几周 -->
                                        <el-radio-group v-else v-model="isSelectBill.billProvideDate" :disabled="isChecked || disabledBill">
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
                                <el-form-item label="获取方式" class="billDisabled">
                                    <el-input size="small" v-model.trim="isSelectBill.getWayDesc" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="账单来源" class="billDisabled">
                                    <el-input size="small" v-model.trim="isSelectBill.billSourceDesc" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="是否提供订单及明细" class="billDisabled">
                                    <el-input size="small" v-model.trim="isSelectBill.provideDetail ? '是' : '否'" disabled></el-input>
                                </el-form-item><br>
                                <el-form-item label="是否计算理论营业日期" class="billDisabled">
                                    <el-input size="small" v-model.trim="isSelectBill.provideBsBusinessDate ? '是' : '否'" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="订单延迟时间" class="billDisabled">
                                    <el-input size="small" v-model.trim="isSelectBill.orderDelayInterval" disabled><i slot="suffix">分钟</i></el-input>
                                </el-form-item><br>
                                <el-form-item label="筛选条件" class="billDisabled">
                                    <el-select v-model="isSelectBill.couponStandardColumn" filterable :disabled="isChecked || disabledBill">
                                        <el-option label="请选择" :value="null"></el-option>
                                        <el-option v-for="(item,index) in standardColumnNamesOpt" :key="index" :label="item" :value="item"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="billDisabled">
                                    <el-upload
                                            :action="isSelectBill.couponFilePath ? url+'&url='+isSelectBill.couponFilePath : url"
                                            accept=".csv,.xlsx"
                                            :file-list="isSelectBill.fileList"
                                            :on-success="(response,file,fileList) => {return uploadSuccess(response,file,fileList,index)}"
                                            :on-remove="(file,fileList) => {return removeFile(file,fileList,index)}"
                                            :disabled="isChecked || disabledBill">
                                        <span class="uploadFiles"><i class="el-icon-upload2"></i>&nbsp;&nbsp;文件上传</span>
                                    </el-upload>
                                </el-form-item>
                                <el-form-item class="billDisabled">
                                    <el-button size="small" type="success" class="c-button" @click="exportFile(index)" :disabled="!isSelectBill.couponFilePath"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
                                </el-form-item>
                            </el-card>
                        </div>
                    </div>
                    <div class="basicScrollBar" v-if="activeData.provideBill">
                        <i v-for="(isSelectBill,index) in isSelectBills" :key="index" :class="index === selectBill ? 'basicScroll active' : 'basicScroll'" @click="getSelectBill(index)"></i>
                    </div>
                    <div v-if="hasOrderCheckRule && activeData.provideBill" class="billLittleTitle"><i></i>
                        <span>订单核对规则</span></div>
                    <el-form-item v-if="hasOrderCheckRule && activeData.provideBill" label="选择核对规则" class="accountState">
                        <div v-for="(ruleItem,ruleIndex) in activeData.orderCheckRule">
                            <el-select v-model="activeData.orderCheckRule[ruleIndex]" placeholder="请选择" :disabled="isChecked || disabledBill">
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(item,index) in orderCheckRuleOpt" :key="index" :label="item.dictionaryEntryName" :value="item.id"></el-option>
                            </el-select>
                            <el-button v-if="activeData.orderCheckRule.length > 1" @click="removeCheckRule(ruleIndex)" size="small" icon="el-icon-minus" circle :disabled="isChecked || disabledBill"></el-button>
                            <el-button v-if="ruleIndex === activeData.orderCheckRule.length - 1" @click="addCheckRule" size="small" icon="el-icon-plus" circle :disabled="isChecked || disabledBill"></el-button>
                        </div>
                    </el-form-item>
                    <div class="billLittleTitle"><i></i><span>银行流水</span></div>
                    <el-form-item label="是否与银行流水核对" prop="checkBankFlow" class="accountState">
                        <el-radio-group v-model="activeData.checkBankFlow" :disabled="isChecked">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group><br>
                        <div class="activeRange" v-if="activeData.checkBankFlow">
                            <el-select v-model="activeData.checkDateWithBank" filterable placeholder="请选择" :disabled="isChecked">
                                <el-option :value="1" label="营业日期"></el-option>
                                <el-option :value="2" label="交易日期"></el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <div class="billTitle"><i></i><span>核算信息</span></div>
                    <el-form-item label="手续费" class="accountSubject" v-if="showProcedure">
                        <el-select v-model="activeData.debitHandingCharge" filterable placeholder="请选择借方科目" :disabled="isChecked">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="offsetCode" v-if="showProcedure">
                        <el-select v-model="activeData.lenderHandingCharge" filterable placeholder="请选择贷方科目" :disabled="isChecked||showProcedureDisabled">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item><br>
                    <el-form-item label="服务费" class="accountSubject" v-if="showService">
                        <el-select v-model="activeData.debitServiceCharge" filterable placeholder="请选择借方科目" :disabled="isChecked">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="offsetCode"  v-if="showService">
                        <el-select v-model="activeData.lenderServiceCharge" filterable placeholder="请选择贷方科目" :disabled="isChecked||showServiceDisabled">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item><br>
                    <el-form-item label="百胜补贴" class="accountSubject">
                        <el-select v-model="activeData.debitBsSubsidy" filterable placeholder="请选择借方科目" :disabled="isChecked">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="offsetCode">
                        <el-select v-model="activeData.lenderBsSubsidy" filterable placeholder="请选择贷方科目" :disabled="isChecked||(showServiceDisabled||showProcedureDisabled)">
                            <el-option value="" label="请选择"></el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index" :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="BOH是否包含百胜补贴">
                        <el-select v-model="activeData.posContainBsSubsidy" filterable :disabled="isChecked">
                            <el-option label="是" :value="true"></el-option>
                            <el-option label="否" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="BOH是否包含第三方补贴">
                        <el-select v-model="activeData.bohContainThirdSubsidy  " filterable :disabled="isChecked">
                            <el-option label="是" :value="true"></el-option>
                            <el-option label="否" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <!--<el-select v-model="activeData.accountType" :disabled="isChecked">-->
                        <!--<el-option v-for="(item,index) in subjectTypeOpts" :value="index+1" :label="item"-->
                        <!--:key="index"></el-option>-->
                        <!--:prop="activeData.subjectType !==2 && activeData.accountType ===1?'suspendReceivable':''" :rules="{require:true,message:'请输入总账冲销码',trigger:'change'}"-->
                        <!--</el-select>-->
                    </el-form-item>
                    <el-form-item class="accountSubject">
                        <el-select v-model="activeData.accountType" :disabled="isChecked">
                            <el-option v-for="(item,index) in subjectTypeOpts" :value="index" :label="item"
                                       :key="index"></el-option>
                        </el-select>
                        <br>
                        <el-select v-model="activeData.finalReceivable" filterable placeholder="请选择科目"
                                   :disabled="isChecked" v-if="activeData.accountType !==1" key="leger">
                            <el-option value="">请选择</el-option>
                            <el-option v-for="(item,index) in accountingSubjectOpt" :key="index"
                                       :label="item.subjectNum+item.subjectName" :value="item.subjectNum"></el-option>
                        </el-select>
                        <el-select v-if="activeData.accountType ===1"  v-model="activeData.suspendReceivable"
                                   filterable placeholder="请选择总账冲销码"
                                   :disabled="isChecked" :key="1">
                            <el-option value="">请选择</el-option>
                            <el-option v-for="(item,index) in writeOffOpt" key="jde"
                                       :label="item.code" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item class="offsetCode" prop="suspendReceivable" v-if="activeData.subjectType !==2">-->
                    <!--<el-input size="small" v-model.trim="activeData.suspendReceivable" placeholder="请输入总账冲销码" :disabled="isChecked"></el-input>-->
                    <!--</el-form-item>-->
                </div>
                <!-- 联系人信息 -->
                <div class="contactInfo" v-else-if="active === 3">
                    <div class="contactInfoDetails" v-for="(contactItem,contactIndex) in activeData.userInfo" :key="contactIndex">
                        <div class="billBigTitle" v-if="contactIndex === 0"><span>百胜联系人</span></div>
                        <div class="billBigTitle" v-if="contactIndex === 7"><span>第三方联系人</span></div>
                        <div class="billTitle"><i></i><span>{{contactItem.workType | customType}}</span></div>
                        <el-form-item label="姓名">
                            <el-select
                                    size="small"
                                    :ref="contactItem.type"
                                    v-model="contactItem.userName"
                                    remote
                                    allow-create
                                    default-first-option
                                    :remote-method="(val)=>{return remoteUserName(val,contactItem,contactIndex)}"
                                    v-scroll="(param,object) => {return scrollUserName(contactItem,contactIndex,param,object)}"
                                    @change="(val) => {return getUserInfo(val,contactItem,contactIndex)}"
                                    @visible-change="(val) => {return getUserInfo(val,contactItem,contactIndex,true)}"
                                    filterable
                                    :disabled="isChecked">
                                <el-option value="">请选择</el-option>
                                <el-option v-for="(item,index) in contactItem.userNameOpt" :key="index" :label="item.userName" :value="item.psId+','+item.userName||''"></el-option>
                            </el-select>
                            <!--<el-autocomplete-->
                            <!--v-if="contactIndex > 6"-->
                            <!--size="small"-->
                            <!--:ref="contactItem.type"-->
                            <!--v-model="contactItem.userName"-->
                            <!--v-scroll="(param) => {return scrollUserName(contactItem.type,contactIndex,param)}"-->
                            <!--:fetch-suggestions="querySearch"-->
                            <!--@select="(item) => {return handleSelect(item,contactIndex)}"-->
                            <!--:disabled="isChecked">-->
                            <!--</el-autocomplete>-->
                        </el-form-item>
                        <el-form-item label="固定电话"
                                      :prop="'userInfo.' + contactIndex + '.phone'"
                                      :rules="phones">
                            <el-input class="contactInfoDetailsInp" size="small" v-model="contactItem.phone" placeholder="请输入" :disabled="isChecked"></el-input>
                        </el-form-item>
                        <el-form-item label="移动电话"
                                      :prop="'userInfo.' + contactIndex + '.mobile'"
                                      :rules="phones">
                            <el-input class="contactInfoDetailsInp" size="small" v-model="contactItem.mobile" placeholder="请输入" :disabled="isChecked"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input class="contactInfoDetailsInp" size="small" v-model="contactItem.mail" placeholder="请输入" :disabled="isChecked"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import ip from '../../model/api'
    import tempIp from '../../model/tempIp'
    import accountInfo from './accountInfo'
    import scroll from '@/directives/index'
    import * as validate from '@/utils/validateForAcEdit'
    import * as baseData from '@/utils/activityBaseData'
    export default {
        name: "activeAdd",
        components:{accountInfo},
        directives: { scroll },//引入 滚动指令
        data(){
            return{
                activeData:{
                    //基础信息
                    activityName:null,
                    activityAbbreviation:null,
                    activityEnglishName:null,
                    brand:null,
                    brandName:null,
                    contractDTOS:[Object.assign({},baseData.contract)],
                    activityActualPeriodDTOS:[Object.assign({},baseData.activityActualPeriod)],
                    activityType:1,
                    activityTypeCode:null,
                    activityMode:null,
                    rangeType:2,
                    rangeDTOS:[{rangeValue:null}],
                    orderWayValue:null,
                    franchiseeSettlementType:1,
                    orderWayType:1,
                    eatIn:[],
                    takeOut:null,
                    directCon:true,
                    remark:'',
                    //收/付款信息
                    activityCode:null,
                    settlementMode:1,
                    settlementConsolidation:false,
                    provideBill:true,
                    customerJde:'',
                    thirdSettlementConfigDTOS:null,
                    calculateBsSubsidy:false,
                    listBsSubsidy:false,
                    bsSubsidyListRule:1,
                    bsSubsidyListColumn:1,
                    bsSubsidyPercent:'',
                    calculateThirdSubsidy:false,
                    listThirdSubsidy:false,
                    thirdSubsidyListRule:1,
                    thirdSubsidyListColumn:1,
                    thirdSubsidyPercent:'',
                    bohContainThirdSubsidy:'',
                    //百胜付款
                    chargeFees:[Object.assign({},baseData.chargeFeeInit)],
                    //核对/核算信息
                    billConfigs:[],
                    couponStandardColumn:null,
                    orderCheckRule:null,
                    checkBankFlow:true,
                    checkDateWithBank:2,
                    debitHandingCharge:'',
                    lenderHandingCharge:'',
                    debitServiceCharge:'',
                    lenderServiceCharge:'',
                    debitBsSubsidy:'',
                    posContainBsSubsidy:'',
                    lenderBsSubsidy:'',
                    suspendReceivable:'',
                    finalReceivable:'',
                    //联系人信息
                    userInfo:null,
                    settlementType:null,
                    accountType:'',
                    payCompany:''

                },
                contactInfo:{userInfo:JSON.parse(JSON.stringify(baseData.userInfo))},
                url:tempIp.master_ip+'/activity_master_data/uploadFile?type=2',
                isAdd:false,
                isEdit:false,
                brand:'',
                loading:false,
                selectedIds:[],
                //从第三方获取账单信息
                thirdBillData:{},
                isSelectBillsId:[],
                isSelectBills:[],
                hasOrderCheckRule:true,
                //验证规则
                rules:{
                    //基础信息
                    activityName:[{ required: true, message: '请输入活动名称', trigger: 'blur' },{ validator: validate.legalChars }],
                    activityAbbreviation:[{ required: true, message: '请输入活动简称', trigger: 'blur' },{ validator: validate.legalChars }],
                    //activityEnglishName:{ validator: validate.legalEnglishChars },//活动英文简称去掉只能输入字母的校验0524
                    brand:{ required: true, message: '请选择品牌', trigger: 'change' },
                    activityType:{ required: true, message: '请选择活动类型', trigger: 'change' },
                    activityMode:{ required: true, message: '请选择活动形式', trigger: 'change' },
                    rangeType:{ required: true, message: '请选择活动范围', trigger: 'change' },
                    franchiseeSettlementType:{ required: true, message: '请选择是否加盟商参与', trigger: 'change' },
                    orderWayType:{ required: true, message: '请选择结算/进单途径', trigger: 'change' },
                    eatIn:{ type: 'array', required: true, message: '请选择结算/进单途径', trigger: 'change' },
                    takeOut:{ required: true, message: '请选择结算/进单途径', trigger: 'change' },
                    directCon:{ required: true, message: '请选择直联/非直联', trigger: 'change' },
                    //收/付款信息
                    settlementMode:{ required: true, message: '请选择结算类型', trigger: 'change' },
                    settlementConsolidation:{ required: true, message: '请选择是否合并结算', trigger: 'change' },
                    provideBill:{ required: true, message: '请选择是否提供账单', trigger: 'change' },
                    calculateBsSubsidy:{ required: true, message: '请选择是否计算百胜补贴', trigger: 'change' },
                    listBsSubsidy:{ required: true, message: '请选择是否第三方列示百胜补贴', trigger: 'change' },
                    calculateThirdSubsidy:{ required: true, message: '请选择是否计算第三方补贴', trigger: 'change' },
                    listThirdSubsidy:{ required: true, message: '请选择是否第三方列示第三方补贴', trigger: 'change' },


                    //核对/核算信息
                    checkBankFlow:{ required: true, message: '请选择是否与银行流水核对', trigger: 'change' },
                    suspendReceivable:{ required: true, message: '请输入总账冲销码', trigger: 'change' },
                    // finalReceivable:{ required: true, message: '请选择会计科目', trigger: 'change' },
                    //联系人信息
                },
                expirationReminderRules:[
                    { required: true, message: '活动到期提醒不能为空'},
                    { validator: validate.legalNumber }
                ],
                phones:{ validator: validate.phone, trigger: ['blur','change'] },
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
                percent:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: validate.percent }
                ],
                id:'',
                module:'主档管理',
                subModule:'活动主档',
                thirdName:'',
                isChecked:false,
                active: 0,
                activeBar:0,
                selectBill:0,
                basicCarouselBarLeft:820,
                activeTab:'first',
                companyJDEs:[],
                billUnitJDEs:[],
                restaurantJDEs:[],
                customizeAreaIds:[],
                brandOpt:[],
                activityTypeOpt:[],
                activityModeOpt:[],
                bohSettlementKeyOpt:[],
                activityAreaOpt:[],
                //百胜/第三方补贴计算方法
                accountForm:[{value:1,label:'百分比'},{value:2,label:'每笔订单金额'}],
                accountMoney:[{value:1,label:'交易金额'},{value:2,label:'顾客实付'}],
                //树
                // billUnitChecked:false,
                companyChecked:false,
                allCompanyId:[],
                // filterBillUnitText:'',
                filterCompanyText:'',
                billUnit: [],
                company: [],
                // billUnitData:[],
                companyData:[],
                // billUnitProps: {children:'children',label:'name'},
                companyProps: {children:'children',label:'name'},
                //结算类型
                settlementPeriodTypeOpt:[{
                    value:1,
                    label:'按天'
                },{
                    value:2,
                    label:'每一周'
                },{
                    value:3,
                    label:'每两周'
                },{
                    value:4,
                    label:'每三周'
                },{
                    value:5,
                    label:'每四周'
                },{
                    value:6,
                    label:'按月'
                },{
                    value:7,
                    label:'活动结束'
                }],
                mainBodyOpt:[],
                configItemOpt:[],
                standardColumnNamesOpt: [
                    '餐厅编号', '交易日期', '营业日期', '交易金额', '第三方补贴',
                    '随机红包(第三方)', '百胜补贴', '手续费', '服务费(第三方)', '包装费(百胜)', '包装费(第三方)',
                    '配送费(第三方)', '配送费(百胜)', '顾客实付', '与BOH核对金额', '餐厅应收', '其他','券名称','开票金额'],
                accountingSubjectOpt:[],
                eatInOpt:[],
                takeOutOpt:[],
                userNameOpt:[],
                thirdUserNameOpt:[],
                mainPayeeOpt:[],
                orderCheckRuleOpt:[],
                // selectBillUnitKey:[],
                selectCompanyKey:[],
                userNameSize:10,
                thirdUserNameSize:10,
                disabledBill:false,
                activityCode:null,
                selectKey:[],
                selectStatus:null,//[0,1,2][不全选,全选,不选]
                companylength:0,
                baseData:baseData,
                subjectTypeOpts:['请选择','应收科目','福利费','广告费'],
                showProcedure:null,
                showServiceDisabled:false,
                showProcedureDisabled:false,
                showService:null,
                userNameIndex:1,
                remoteFlagUser:true,
                remoteFlagOther:true,
                remoteString:'',
                switchon:true,
                selectObj:{},
                writeOffOpt:[],
                // switchFlagLeft:false,
                switchFlagRight:false,
                // switchFlagLeftId:false,
                switchFlagRightId:false,
                paymentFlag:true,
                holidayStorage:[]
                // isIndeterminate:false
            }
        },
        //树
        watch: {
            // filterBillUnitText(val) {this.$refs.billUnit.filter(val)},
            filterCompanyText(val){this.$refs.company.filter(val)},
            companyJDEs(val,oldVal){
                if(this.activeData.rangeType !== 3){
                    this.getCompanyJdeAndName(val,oldVal)
                }
                // if(this.activeData.rangeType === 1){
                //     this.getBankConfigs(val,oldVal)
                // }
            },
            billUnitJDEs(val,oldVal){
                if(this.activeData.rangeType === 2){
                    this.getBankConfigs(val,oldVal)
                }
            },
            customizeAreaIds(val,oldVal){
                if(this.activeData.rangeType === 3){
                    this.getCompanyJdeAndName(val,oldVal);
                    this.getBankConfigs(val,oldVal)
                }
            },
        },
        methods: {
            cancel(){this.common.deleteTag(this.$route,this,'active')},
            firstNext(){
                let that = this;
                let pathParams = [{
                    name:'module',
                    value:this.module
                },{
                    name:'subModule',
                    value:this.subModule
                }];
                let tem = this.common.joinSearchParam(pathParams);
                /*基础信息*/
                //活动范围
                // if(this.active === 0 && this.activeData.rangeType === 1){
                //     this.selectedIds = this.$refs.billUnit.getCheckedKeys();
                //     this.activeData.rangeDTOS = [];
                //     if(this.id !== ''){
                //         this.$refs.billUnit.getCheckedKeys().forEach(item => {
                //             if(item.substr(0,1) !== 'c'){that.activeData.rangeDTOS.push({activityMasterId:that.id,rangeValue:parseInt(item)})}
                //         })
                //     }else{
                //         this.$refs.billUnit.getCheckedKeys().forEach(item => {
                //             if(item.substr(0,1) !== 'c'){that.activeData.rangeDTOS.push({rangeValue:parseInt(item)})}
                //         })
                //     }
                // }else

                if (this.active === 0 && this.activeData.rangeType === 2) {
                    this.selectedIds = this.$refs.company.getCheckedKeys();
                    this.activeData.rangeDTOS = [];
                    if (this.id !== '') {
                        this.$refs.company.getCheckedKeys().forEach(item => {
                            if (item.substr(0, 1) !== 'c' && item.substr(0, 1) !== 'b') {
                                that.activeData.rangeDTOS.push({activityMasterId: that.id, rangeValue: parseInt(item)})
                            }
                        })
                    } else {
                        this.$refs.company.getCheckedKeys().forEach(item => {
                            if (item.substr(0, 1) !== 'c' && item.substr(0, 1) !== 'b') {
                                that.activeData.rangeDTOS.push({rangeValue: parseInt(item)})
                            }
                        })
                    }
                }
                //得到法人公司和开票单位
                let selectNodes = [];
                this.companyJDEs = [];
                this.billUnitJDEs = [];
                this.restaurantJDEs = [];
                this.customizeAreaIds = [];
                // if(this.active === 0 && this.activeData.rangeType === 1){
                //     selectNodes = [];
                //     this.$refs.billUnit.getHalfCheckedNodes().forEach(item => {selectNodes.push(item)});
                //     this.$refs.billUnit.getCheckedNodes().forEach(item => {selectNodes.push(item)});
                //     selectNodes.forEach(item => {
                //         if(item.id.substr(0,1)==='c'){
                //             that.companyJDEs.push(item.id.split("company")[1])
                //         }else{
                //             that.billUnitJDEs.push(item.id)
                //         }
                //     })
                // }else
                if (this.active === 0 && this.activeData.rangeType === 2) {
                    selectNodes = [];
                    this.$refs.company.getHalfCheckedNodes().forEach(item => {
                        selectNodes.push(item)
                    });
                    this.$refs.company.getCheckedNodes().forEach(item => {
                        selectNodes.push(item)
                    });
                    selectNodes.forEach(item => {
                        if (item.id.substr(0, 1) === 'c') {
                            that.companyJDEs.push(item.id.split("company")[1])
                        } else if (item.id.substr(0, 1) === 'b') {
                            that.billUnitJDEs.push(item.id.split("billingunit")[1])
                        } else {
                            that.restaurantJDEs.push(item.id)
                        }
                    })
                }else if(this.active === 0 && this.activeData.rangeType === 3){
                    this.activeData.rangeDTOS.forEach(item => {
                        if(that.id !== ''){that.$set(item,'activityMasterId',that.id)}
                        that.customizeAreaIds.push(item.rangeValue+'');
                    })
                }

                //保存草稿，调新增接口
                if(this.activeData.rangeType === 2 && this.$refs.company.getCheckedKeys().length < 1){
                    this.showTips('请选择活动范围','info');return false
                }
                if(this.active === 0){
                    this.$refs['activeData'].validate((valid) => {
                        if(valid){
                            if(that.id !== ''){
                                that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                                    // that.configItemOpt.forEach(thirdBill => {
                                    //     if (thirdBill.configItemDTOS && thirdBill.configItemDTOS.length > 0) {
                                    //         thirdBill.configItemDTOS.forEach(configItem => {
                                    //             if (item.configItemId.split(',')[0] === configItem.id + '') {
                                    //                 item.configItemId = configItem.thirdBillId + ''
                                    //             }
                                    //         })
                                    //     }
                                    // })
                                    //第三方账单回显

                                    if(that.configItemOpt && that.configItemOpt.length>0){    // 后台返回的小账单的id，去匹配筛选大账单的id 进行回显
                                        let billIds = item.configItemId?item.configItemId.split(','):[] ;
                                        item.configItemId = [];
                                        that.configItemOpt.forEach(val=>{
                                            if(billIds && billIds.length >0){
                                                billIds.forEach(value=>{
                                                    if(val.configItemDTOS.find(x=>{return x.id+'' === value})){
                                                        if(item.configItemId.length>0 && !item.configItemId.includes(val.id+'') || item.configItemId.length === 0){
                                                            item.configItemId.push(val.id+'');
                                                        }
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    // if(that.activeData.billConfigs &&that.activeData.billConfigs.length>0){
                                    //     item.configItemId = [];
                                    //     that.activeData.billConfigs.map(x=>{
                                    //         item.configItemId.push(x.billMasterId.toString());
                                    //     })
                                    // }

                                    // let arr = [];
                                    // if(item.configItemId && !_.isArray(item.configItemId)){
                                    //     if(item.configItemId.indexOf(',') !== -1){
                                    //         arr = item.configItemId.split(',')
                                    //     }else{
                                    //         arr[0] = item.configItemId;
                                    //     }
                                    // }else{
                                    //     arr = [];
                                    // }
                                    // item.configItemId  = [];
                                    // item.configItemId =  arr;
                                });
                                this.active++
                            }else{
                                //作为草稿保存
                                that.activeData.status = 1;
                                that.activeData.brand = that.activeData.brand.split(',')[0];
                                ip.insertActive(tem,that.activeData,res => {
                                    if(res.code === 200){
                                        that.id = res.data.id;
                                        that.activeData = res.data;
                                        that.handleData();
                                        that.activeData.thirdSettlementConfigDTOS = [JSON.parse(JSON.stringify(that.baseData.accountDetails))];
                                        that.showTips('基础信息保存成功，请填写收/付款信息','success');
                                        that.active++
                                    }else{
                                        that.showTips(res.msg,'info')
                                    }
                                })
                            }
                        }else{
                            that.showTips('请将信息填写完整','info');return false
                        }
                    })
                }
            },
            secondNext(){
                /*收/付款信息*/
                if(this.active === 1){
                    let that = this;
                    let setBank = true;
                    let pathParams = [{
                        name:'module',
                        value:this.module
                    },{
                        name:'subModule',
                        value:this.subModule
                    }];
                    let tem = this.common.joinSearchParam(pathParams);
                    //收款方必填
                    if(this.activeData.thirdSettlementConfigDTOS.length === 1){
                        if(this.activeData.thirdSettlementConfigDTOS[0].paymentMethod === 2 && this.activeData.thirdSettlementConfigDTOS[0].paymentDimension === 2){
                            setBank = true
                        }else{
                            this.activeData.thirdSettlementConfigDTOS[0].bankConfigs.forEach(item => {
                                if(!item.payeeBankId || item.payeeBankId === '' || item.payeeBankId === null){
                                    setBank = false
                                }
                            })
                        }
                    }else if(this.activeData.thirdSettlementConfigDTOS.length === 2){
                        if(this.activeData.thirdSettlementConfigDTOS[0].paymentMethod === 2 &&
                            this.activeData.thirdSettlementConfigDTOS[0].paymentDimension === 2 && this.activeData.thirdSettlementConfigDTOS[1].paymentMethod === 2 &&
                            this.activeData.thirdSettlementConfigDTOS[1].paymentDimension === 2){
                            setBank = true
                        }else if((this.activeData.thirdSettlementConfigDTOS[0].paymentMethod === 2 && this.activeData.thirdSettlementConfigDTOS[0].paymentDimension === 2) &&
                            (this.activeData.thirdSettlementConfigDTOS[1].paymentMethod !== 2 || this.activeData.thirdSettlementConfigDTOS[1].paymentDimension !== 2)){
                            this.activeData.thirdSettlementConfigDTOS[1].bankConfigs.forEach(item => {
                                if(!item.payeeBankId || item.payeeBankId === '' || item.payeeBankId === null){
                                    setBank = false
                                }
                            })
                        }else if((this.activeData.thirdSettlementConfigDTOS[1].paymentMethod === 2 && this.activeData.thirdSettlementConfigDTOS[1].paymentDimension === 2) &&
                            (this.activeData.thirdSettlementConfigDTOS[0].paymentMethod !== 2 || this.activeData.thirdSettlementConfigDTOS[0].paymentDimension !== 2)){
                            this.activeData.thirdSettlementConfigDTOS[0].bankConfigs.forEach(item => {
                                if(!item.payeeBankId || item.payeeBankId === '' || item.payeeBankId === null){
                                    setBank = false
                                }
                            })
                        }else if((this.activeData.thirdSettlementConfigDTOS[0].paymentMethod !== 2 || this.activeData.thirdSettlementConfigDTOS[0].paymentDimension !== 2) &&
                            (this.activeData.thirdSettlementConfigDTOS[1].paymentMethod !== 2 || this.activeData.thirdSettlementConfigDTOS[1].paymentDimension !== 2)){
                            this.activeData.thirdSettlementConfigDTOS.forEach(item => {
                                item.bankConfigs.forEach(item1 => {
                                    if(!item1.payeeBankId || item1.payeeBankId === '' || item1.payeeBankId === null){
                                        setBank = false
                                    }
                                })
                            })
                        }
                    }
                    //非全单多客户时，客户不能选同一个
                    if(this.activeData.settlementMode === 3 && this.activeData.thirdSettlementConfigDTOS[0].customerId === this.activeData.thirdSettlementConfigDTOS[1].customerId){
                        this.showTips('多客户时须设置第三方客户不能相同','info');return false
                    }

                    if(that.activeData.settlementMode === 1){
                        that.activeData.settlementType = 1;
                    }

                    this.$refs['activeData'].validate((valid) => {
                        if(valid){
                            if(setBank){
                                //第三方账单
                                if(that.activeData.provideBill){
                                    that.isSelectBillsId = [];
                                    that.isSelectBills = [];
                                    that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                                        if(item.configItemId !== ''){
                                            that.isSelectBillsId = that.isSelectBillsId.concat(item.configItemId)
                                        }
                                        // if(item.guarantyDTOS && item.guarantyDTOS.length>0){
                                        //     item.guarantyDTOS = item.guarantyDTOS.filter(x=> {
                                        //         return (x.guarantyType && x.guarantyDimension) ||(!x.guarantyType && !x.guarantyDimension)
                                        //     }) //删除只选择维度没有选择方式
                                        // }
                                    });
                                    //数组去重
                                    let selectedBigBillsId = [];
                                    for(let i = 0; i < that.isSelectBillsId.length; i++){
                                        if(selectedBigBillsId.indexOf(that.isSelectBillsId[i]) === -1){
                                            selectedBigBillsId.push(that.isSelectBillsId[i]);
                                        }
                                    }
                                    //获取第三方账单信息
                                    selectedBigBillsId.forEach(item => {
                                        that.configItemOpt.forEach(item1 => {
                                            if(item === item1.id+''){that.isSelectBills.push(JSON.parse(JSON.stringify(item1)))}
                                        })
                                    });
                                    //将账单名和账单id放入账单信息
                                    that.isSelectBills.forEach(item => {
                                        if(!item.provideDetail){that.hasOrderCheckRule = false}
                                        if(that.id !== ''){that.$set(item,'activityMasterId',parseInt(that.id))}
                                        that.$set(item,'billMasterId',item.id);
                                        that.$set(item,'billProvideDate','');
                                        that.$set(item,'billProvideDateType',1);
                                        that.$set(item,'settlementDateType',1);
                                        that.$set(item,'billName',item.configName);
                                        that.$set(item,'fileList',[]);
                                        that.$set(item,'couponFileName',null);
                                        that.$set(item,'couponFilePath',null);
                                        delete item.id
                                    });
                                    //筛选账单
                                    if(that.activeData.billConfigs.length < 1){
                                        that.activeData.billConfigs = JSON.parse(JSON.stringify(that.isSelectBills));
                                    }else{
                                        for(let k=0;k<that.activeData.billConfigs.length;k++){
                                            for(var j=0;j<that.isSelectBills.length;j++){
                                                if(that.activeData.billConfigs[k].billMasterId === that.isSelectBills[j].billMasterId){
                                                    that.isSelectBills[j].id = that.activeData.billConfigs[k].id;
                                                    that.isSelectBills[j].billProvideDate = that.activeData.billConfigs[k].billProvideDate;
                                                    that.isSelectBills[j].billProvideDateType = that.activeData.billConfigs[k].billProvideDateType;
                                                    that.isSelectBills[j].settlementDateType = that.activeData.billConfigs[k].settlementDateType;
                                                    that.isSelectBills[j].couponStandardColumn = that.activeData.billConfigs[k].couponStandardColumn;
                                                    that.isSelectBills[j].couponFileName = that.activeData.billConfigs[k].couponFileName;
                                                    that.isSelectBills[j].couponFilePath = that.activeData.billConfigs[k].couponFilePath;
                                                    if(that.activeData.billConfigs[k].couponFileName){
                                                        that.isSelectBills[j].fileList = [{name:that.activeData.billConfigs[k].couponFileName}];
                                                    }
                                                }
                                            }
                                        }
                                        that.activeData.billConfigs = JSON.parse(JSON.stringify(that.isSelectBills))
                                    }
                                    //核对规则
                                    if(that.activeData.orderCheckRule === null || that.activeData.orderCheckRule === ''){
                                        that.activeData.orderCheckRule = [''];
                                    }else if(typeof that.activeData.orderCheckRule === 'string'){
                                        that.activeData.orderCheckRule = that.activeData.orderCheckRule.split(',');
                                        that.activeData.orderCheckRule = that.activeData.orderCheckRule.map(Number)
                                    }
                                }else{
                                    that.activeData.thirdSettlementConfigDTOS.forEach(item => {item.configItemId = ''});
                                    that.activeData.billConfigs = [];
                                    that.hasOrderCheckRule = false
                                }
                                //BOH结算键位
                                try {
                                    that.activeData.thirdSettlementConfigDTOS.forEach(item1 => {
                                        item1.bohSettlementKeyDTOS.forEach(item2 => {
                                            if(that.id !== ''){that.$set(item2,'activityMasterId',that.id)}
                                        })


                                        ;
                                        let temarr = item1.guarantyTypes.concat();
                                        let temarrType = item1.guarantyTypes.concat();
                                        if(temarr && temarr.length >0){
                                            temarr = temarr.map(x=>{
                                                return x.longVocation;
                                            });
                                            temarrType = temarrType.map(x=>{
                                                return x.guarantyType;
                                            });
                                            let cutCopyHoliday = [... new Set(temarr)];
                                            let cutCopyType = [... new Set(temarrType)]
                                            if(cutCopyHoliday){
                                                if(cutCopyHoliday.length < temarr.length){
                                                    throw new Error('长假保证金节假日不能重复选择！')
                                                }
                                            }
                                            if(cutCopyType){
                                                if(cutCopyHoliday.length < temarr.length){
                                                    throw new Error('保证方式不能重复选择！')
                                                }
                                            }
                                        }
                                        //长假保证方式
                                        item1.guarantyDTOS = item1.guarantyDTOS.concat(item1.guarantyTypes);
                                    });
                                }catch(e){
                                    that.common.messageUtil({
                                        type:'warning',
                                        message:e.message
                                    });
                                    return ;
                                }

                                //手续费 和服务费显示与否
                                that.showProcedure = false;
                                that.showService = false;
                                that.showServiceDisabled = false;
                                that.showProcedureDisabled = false;
                                if( that.activeData.chargeFees &&  that.activeData.chargeFees.length>1){
                                    that.activeData.chargeFees.map((item,index)=>{
                                        if(item.chargeType === 1){
                                            that.showProcedure = true;
                                            if(!item.handingChargeSeparateSettlement){
                                                that.showProcedureDisabled = true;
                                            }
                                            that.activeData.debitHandingCharge = '6601.070'
                                        }else if(item.chargeType === 2){
                                            that.showService = true;
                                            if(!item.handingChargeSeparateSettlement){
                                                that.showServiceDisabled = true;
                                            }
                                            that.activeData.debitServiceCharge = '6601.026'
                                        }
                                    })
                                }
                                if( that.activeData.chargeFees &&  that.activeData.chargeFees.length === 1){
                                    let obj = that.activeData.chargeFees[0];
                                    if(!obj.chargeType){
                                        that.showProcedure = false;
                                        that.showService = false
                                    }else{
                                        if(obj.chargeType === 1){
                                            that.showProcedure = true;
                                            that.activeData.debitHandingCharge = '6601.070';
                                            if(!obj.handingChargeSeparateSettlement){
                                                that.showProcedureDisabled = true;
                                            }
                                        }else if(obj.chargeType === 2){
                                            that.showService = true;
                                            that.activeData.debitServiceCharge = '6601.026';
                                            if(!obj.handingChargeSeparateSettlement){
                                                that.showServiceDisabled = true;
                                            }
                                        }
                                    }
                                }
                                that.activeData.debitBsSubsidy = '4705.001';
                                //检查活动主档结算类型是否与账单配置一致 true: 一致， false：不一致
                                let configIds = [];
                                that.activeData.billConfigs.forEach(item=>{
                                    configIds.push(item.billMasterId);
                                });
                                ip.checkActivitySettlement('?settlementType='+that.activeData.settlementMode,configIds,res=>{
                                    if(!res.data){
                                        that.common.messageUtil({
                                            type:'warning',
                                            message:'第三方补贴/顾客实付单独结算与活动主档结算类型不一致'
                                        });
                                    }
                                    //非全单单客户的保证方式不要限制为一样，非全单单客户可以选不同的保证方式、保证金额预警阈值、是否出具《长假保证金额追加报告》
                                    //且保证方式一样时，两边值要一样
                                    if(that.activeData.settlementMode === 2){
                                        // let guarantyDTOS1 = [],guarantyDTOS2 = [];
                                        let obj1 = that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.filter(x=>{return !x.longVocationAdd}),
                                            obj0=that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.filter(x=>{return !x.longVocationAdd});
                                        let allArr = obj1.concat(obj0).filter(x=>{return !!x.guarantyType});//有保证方式且不为长假保证方式

                                        if(_.uniqBy(allArr,'guarantyType').length >3){
                                            that.common.messageUtil({
                                                type:'warning',
                                                message:'保证方式不能超过三种！'
                                            });
                                            return ;
                                        }
                                        if (allArr.length > 0) {
                                            //对相同保证方式的的groupby   对保证经方式相同内容不同的进行筛选，一样的，保留一且添加属性 settlementMode 为0
                                            allArr = _.groupBy(allArr, 'guarantyType');
                                            let arr = Object.values(allArr).filter(x => {
                                                return x.length > 1
                                            });
                                            try {
                                                if (arr && arr.length > 0) {
                                                    arr.forEach(val => {
                                                        if (val[0].guarantyDimension !== val[1].guarantyDimension) { //维度不同
                                                            throw new Error('相同保证方式下，保证内容请保持相同！');
                                                        }
                                                        if (val[0].guarantyType === 1) { //预付款
                                                            if (val[0].guarantyDimension === 2 && !_.isEqual(val[0].guarantyCompanyDTOS, val[1].guarantyCompanyDTOS)) {  //法人
                                                                throw new Error('相同保证方式下，保证内容请保持相同！');
                                                            }
                                                        } else if (val[0].guarantyType === 2) { //保证金
                                                            if (val[0].reversible !== val[1].reversible) {
                                                                throw new Error('相同保证方式下，保证内容请保持相同！')
                                                            }
                                                        } else if (val[0].guarantyType === 3 || val[0].guarantyType === 4 || val[0].guarantyType === 5) { //保函和银行汇票，赊销特批（只能按活动）
                                                            if (val[0].guarantyDimension === 1) {
                                                                if (val[0].addGuarantySum !== val[1].addGuarantySum || val[0].dueDate !== val[1].dueDate ||
                                                                    val[0].expirationReminder !== val[1].expirationReminder) {
                                                                    throw new Error('相同保证方式下，保证内容请保持相同！');
                                                                }
                                                            } else {
                                                                if (!_.isEqual(val[0].guarantyCompanyDTOS, val[1].guarantyCompanyDTOS) || val[0].dueDate !== val[1].dueDate ||
                                                                    val[0].expirationReminder !== val[1].expirationReminder) {
                                                                    throw new Error('相同保证方式下，保证内容请保持相同！');
                                                                }
                                                            }
                                                        }
                                                        let repeatIndex = that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.findIndex(x => {
                                                            return x.guarantyType === val[0].guarantyType && !x.longVocationAdd
                                                        });
                                                        if (repeatIndex > -1) {
                                                            obj0.find(x => {
                                                                return x.guarantyType === val[0].guarantyType
                                                            }).settlementMode = 0;  //
                                                            // that.activeDa.ta.thirdSettlementConfigDTOS[1].guarantyDTOS[repeatIndex].guarantyType = null;
                                                            that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.splice(repeatIndex, 1);  //保证方式一样，只传一个并且settlementMode设置为0
                                                            ;
                                                            if(!that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS ||
                                                                that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.filter(x=>{return !x.longVocationAdd}).length ===0){
                                                                let obj = Object.assign({},that.baseData.guarantyDetails);
                                                                obj.guarantyType = null;
                                                                obj.guarantyDimension = null;
                                                                ;
                                                                that.$set(that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS,
                                                                    that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.length>0?that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.length:0,obj)
                                                                // that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.push(obj)
                                                            }
                                                        }
                                                    })
                                                }
                                            } catch (e) {
                                                that.common.messageUtil({
                                                    type: 'warning',
                                                    message:e.message
                                                });
                                                return;
                                            }
                                        }
                                    }
                                        //更新一次
                                        if(that.$route.query.id){
                                            that.active++
                                        }else{
                                            //作为草稿保存
                                            that.activeData.status = 1;
                                            let draftActive = that.handleThirdSettlement();
                                            // that.activeData.brand = that.activeData.brand.split(',')[0];
                                            ip.updateActive(tem,draftActive,res => {
                                                if(res.code === 200){
                                                    that.showTips('收/付款信息保存成功，请填写核对/核算信息','success');
                                                    ip.getActiveDetail(that.id, res => {
                                                        if(res.code === 200){
                                                            that.activeData.thirdSettlementConfigDTOS = JSON.parse(JSON.stringify(res.data.thirdSettlementConfigDTOS));
                                                            that.activeData.chargeFees = res.data.chargeFees// 新增成功 的百盛付款 id 要再传过去 不然就等于新增
                                                            that.handleUpdateThirdSettlement();
                                                            that.active++
                                                        }else{
                                                            that.showTips(res.msg,'info')
                                                        }
                                                    })
                                                }else{
                                                    that.showTips(res.msg,'info')
                                                }
                                            })
                                        }
                                })
                            }else{
                                this.showTips('请设置收款方','info');return false
                            }
                        }else{
                            this.showTips('请将信息填写完整','info');return false
                        }
                    })
                }
            },
            thirdNext(){
                /*核对/核算信息*/
                if(this.active === 2){
                    let that = this;
                    let pathParams = [{
                        name:'module',
                        value:this.module
                    },{
                        name:'subModule',
                        value:this.subModule
                    }];
                    let tem = this.common.joinSearchParam(pathParams);
                    if(this.activeData.billConfigs && this.activeData.billConfigs.length>0){
                        for(let item of this.activeData.billConfigs){
                            if(item.couponFilePath && !item.couponStandardColumn){
                                this.common.messageUtil({
                                    type:'warning',
                                    message:'请选择筛选条件！'
                                })
                                return;
                            }
                        }
                    }
                    // if(that.activeData.userInfo && that.activeData.userInfo.length>0){
                    // that.activeData.userInfo.forEach((item,index)=>{
                    //     switch(item.userType+item.workType){
                    //         case '11'item.ps;
                    //         case '12':return '活动负责人';
                    //         case '13':return '信息控制负责人';
                    //         case '14':return '门店配置联系人';
                    //         case '15':return '发票开具联系人';
                    //         case '16':return '内部往来结算审批人';
                    //         case '17':return '账单推送异常联系人';
                    //         case '28':return '银行上账异常联系人';
                    //         case '29':return '加盟商开票数据收集人';
                    //         case '22':return '加盟商开票数据收集人';
                    //         default:return;
                    //     }
                    // })
                    // let arr = {}
                    //
                    // arr = _.groupBy(that.userNameOpt.concat(that.thirdUserNameOpt),(x)=>{return x.userType.toString()+x.workType.toString()});
                    // _.forIn( arr,(value,key)=>{
                    //     let obj = _.find(that.activeData.userInfo,x=>{
                    //         return x.userType.toString()+x.workType.toString()  === key
                    //     });
                    //     if(obj){
                    //         obj.userNameOpt = value;
                    //     }
                    // })
                    // }
                    this.$refs['activeData'].validate((valid) => {
                        if(valid){
                            if(that.$route.query.id){
                                that.active++
                            }else{
                                //作为草稿保存
                                that.activeData.status = 1;
                                let draftActive = that.handleThirdSettlement();
                                // draftActive.thirdSettlementConfigDTOS.forEach(item => {
                                //     if(item.configItemId !== '' && item.configItemId !== null &&item.configItemId.length>0){
                                //         // if(typeof item.configItemId === 'object' && item.configItemId.length >= 1){
                                //             // item.configItemId = item.configItemId.join(',');
                                //             let ids = [];
                                //             item.configItemId.forEach((item)=>{
                                //                 let arr = that.configItemOpt.find(x=>{return x.id.toString() === item}).configItemDTOS;
                                //                 if(arr && arr.length>0){
                                //                     arr.map(x=>{ ids.push(x.id)});
                                //                 }
                                //             });
                                //             if(_.isArray(item.configItemId)){
                                //                 item.configItemId = ids.join(',')
                                //             }
                                //         }else if(typeof item.configItemId === 'object' && item.configItemId.length < 1){
                                //             item.configItemId = ''
                                // }
                                // that.configItemOpt.forEach(thirdBill => {
                                //     if(thirdBill.id + '' === item.configItemId){
                                //         item.configItemId = [];
                                //         thirdBill.configItemDTOS.forEach(configItem => {
                                //             item.configItemId.push(configItem.id)
                                //         });
                                //         if(_.isArray(item.configItemId)){
                                //           item.configItemId = item.configItemId.join(',')
                                //         }
                                //     }
                                // })
                                //     }
                                // });
                                ;
                                // that.activeData.brand = that.activeData.brand.split(',')[0];
                                ip.updateActive(tem,draftActive,res => {
                                    if(res.code === 200){
                                        that.activeData.userInfo = JSON.parse(JSON.stringify(that.baseData.userInfo));
                                        that.showTips('核对/核算信息保存成功，请填写联系人信息','success');
                                        ip.getActiveDetail(that.id, res => {
                                            if(res.code === 200){
                                                that.activeData.thirdSettlementConfigDTOS = JSON.parse(JSON.stringify(res.data.thirdSettlementConfigDTOS));
                                                that.handleUpdateThirdSettlement();
                                                that.activeData.billConfigs = JSON.parse(JSON.stringify(res.data.billConfigs));
                                                that.active++
                                            }else{
                                                that.showTips(res.msg,'info')
                                            }
                                        })
                                    }else{
                                        that.showTips(res.msg,'info')
                                    }
                                })
                            }
                        }else{
                            this.showTips('请将信息填写完整','info');
                            return false
                        }
                    })
                }
            },
            prev(){
                let that = this;
                that.paymentFlag = true;
                if(this.active === 1){
                    this.activeData.thirdSettlementConfigDTOS.forEach(item => {
                        //第三方账单
                        // if (item.configItemId !== '' && item.configItemId !== null) {
                        //     this.configItemOpt.forEach(thirdBill => {
                        //         if (thirdBill.id + '' === item.configItemId) {
                        //             item.configItemId = [];
                        //             if(thirdBill.configItemDTOS && thirdBill.configItemDTOS.length>0){
                        //                 thirdBill.configItemDTOS.forEach(configItem => {
                        //                     item.configItemId.push(configItem.id)
                        //                 })
                        //             }
                        //         }
                        //     });
                        //     if(_.isArray(item.configItemId)){
                        //         item.configItemId = item.configItemId.join(',')
                        //     }
                        // }
                        if(typeof item.configItemId === 'object' && item.configItemId.length >= 1){
                            // item.configItemId = item.configItemId.join(',');
                            let ids = [];
                            item.configItemId.forEach((item)=>{
                                let arr = that.configItemOpt.find(x=>{return x.id.toString() === item}).configItemDTOS;
                                if(arr && arr.length>0){
                                    arr.map(x=>{ ids.push(x.id)});
                                }
                            });
                            if(_.isArray(item.configItemId)){
                                item.configItemId = ids.join(',')
                            }
                        }else if(typeof item.configItemId === 'object' && item.configItemId.length < 1){
                            item.configItemId = ''
                        }
                    })
                }
                this.active--;
                if(this.companyChecked){
                    this.$nextTick(()=>{
                        this.$refs.company ?this.$refs.company.setCheckedKeys(this.allCompanyId):null   //返回上一步时  全选中树
                    })
                }
            },
            handleData(){
                //基础信息
                let that = this;
                //品牌
                // that.activeData.brand = that.activeData.brand.split(',')[0];
                //合同约定活动期间
                that.activeData.contractDTOS.forEach(item => {
                    that.activeData.status >= 3 ? that.$set(item,'newContract',false) : that.$set(item,'newContract',true);
                    that.$set(item,'range',[item.conventionStartDate,item.conventionEndDate])
                });
                //活动实际期间
                that.activeData.activityActualPeriodDTOS.forEach(item => {
                    that.$set(item,'date',[item.acturalStartDate,item.acturalEndDate])
                });
                // //活动范围
                // that.selectKey = [];
                // that.activeData.rangeDTOS.forEach(item => {
                //     item.disabled = true;
                //     that.selectKey.push(item.rangeValue)
                // });
                // if(that.activeData.rangeType === 1 ){
                //     that.selectBillUnitKey = that.selectKey;
                //     if (that.selectBillUnitKey.length > 0 && that.activeData.status === 3) {
                //         that.billUnitData.forEach(function (item, index) { //已选择的禁掉
                //             item.children.forEach(function (item1, index1) {
                //                 item1 = that.selectBillUnitKey.map(function (id) {
                //                     if (item1.id === id.toString()) {
                //                         return Object.assign(item1, {disabled: true})
                //                     }
                //                 })
                //             })
                //         })
                //     }
                //     //全选按钮选中与否
                //     if(this.companylength === that.selectKey.length){
                //         this.billUnitChecked = true;
                //         this.selectStatus = 1;
                //     }else if(that.selectKey.length === 0){
                //         this.selectStatus = 2
                //     }else if(that.selectKey.length >= 0 && that.selectKey.length<this.companylength){
                //         this.selectStatus = 0
                //     }
                // }else if(that.activeData.rangeType === 2 ){
                //     that.selectCompanyKey = that.selectKey;
                //     if (that.selectCompanyKey.length > 0 && that.activeData.status === 3) {
                //         that.companyData.forEach(function (item, index) { //已选择的禁掉
                //             if( item.children.length>0){
                //                 item.children.forEach(function (item1, index1) {
                //                     if (item1.children.length > 0) {
                //                         item1.children.forEach(function (item2, index1) {
                //                             item1 = that.selectCompanyKey.map(function (id) {
                //                                 if (item2.id === id.toString()) {
                //                                     return Object.assign(item2, {disabled: true})
                //                                 }
                //                             });
                //                         });
                //                     }
                //                     item1 = that.selectCompanyKey.map(function (id) {
                //                         if (item1.id === id.toString()) {
                //                             return Object.assign(item1, {disabled: true})
                //                         }
                //                     });
                //                 })
                //             }
                //         })
                //     }
                //     // that.companyChecked = true
                // }
                //结算/进单途径
                if(that.activeData.orderWayValue){
                    if(that.activeData.orderWayType === 1){
                        that.$set(that.activeData,'eatIn',that.activeData.orderWayValue.split(','));
                        that.$set(that.activeData,'takeOut',null)
                    }else if(that.activeData.orderWayType === 2){
                        that.$set(that.activeData,'eatIn',[]);
                        that.$set(that.activeData,'takeOut',that.activeData.orderWayValue)
                    }
                }
                //百胜付款 如果没填
                if(!that.activeData.chargeFees || that.activeData.chargeFees.length === 0){
                    that.activeData.chargeFees = [Object.assign({},that.baseData.chargeFeeInit)];
                }
            },
            handleThirdSettlement(){
                let that = this;
                let draftActive = JSON.parse(JSON.stringify(that.activeData));
                draftActive.thirdSettlementConfigDTOS.forEach(item => {
                    item.activityMasterId = parseInt(that.id);

                    //筛选条件必填 当有文件上传时
                });
                if(draftActive.chargeFees && draftActive.chargeFees.length>0){
                    draftActive.chargeFees.forEach(item => {
                        item.activityMasterId = parseInt(that.id);
                    });
                }
                //处理核对规则
                if(that.hasOrderCheckRule){
                    if(_.isArray(draftActive.orderCheckRule)){
                        draftActive.orderCheckRule = draftActive.orderCheckRule.join(',')
                    }
                }else{
                    delete draftActive.orderCheckRule
                }
                //非全单单客户时复制顾客实付的 第三方信息 和 保证方式 到第三方补贴
                if(draftActive.settlementMode === 2){
                    draftActive.thirdSettlementConfigDTOS[1].customerId = draftActive.thirdSettlementConfigDTOS[0].customerId;
                    draftActive.thirdSettlementConfigDTOS[1].bankAccount = draftActive.thirdSettlementConfigDTOS[0].bankAccount;
                    draftActive.thirdSettlementConfigDTOS[1].bankName = draftActive.thirdSettlementConfigDTOS[0].bankName;
                    // draftActive.thirdSettlementConfigDTOS[1].guarantyDTOS = draftActive.thirdSettlementConfigDTOS[0].guarantyDTOS;
                    draftActive.thirdSettlementConfigDTOS[1].addGuarantySum = draftActive.thirdSettlementConfigDTOS[0].addGuarantySum;
                    draftActive.thirdSettlementConfigDTOS[1].sumAdvanceDays = draftActive.thirdSettlementConfigDTOS[0].sumAdvanceDays;
                    draftActive.thirdSettlementConfigDTOS[1].rscCollection = draftActive.thirdSettlementConfigDTOS[0].rscCollection;
                }
                //若打款方式为支付宝，打款维度为开票单位，则无收款方
                draftActive.thirdSettlementConfigDTOS.forEach(item => {
                    if(item.paymentMethod === 2 && item.paymentDimension === 2){item.bankConfigs = null}
                });
                //不出具结算报告，结算类型不用存值
                draftActive.thirdSettlementConfigDTOS.forEach(item => {
                    if(!item.provideSettlementToThird){
                        item.settlementPeriodType = null;
                        item.settlementPeriod = null;
                        item.settlementDateType = null
                    }
                });
                //处理保证方式
                draftActive.thirdSettlementConfigDTOS.forEach(item => {
                    //是否出具《长假保证金额追加报告》
                    if(!item.addGuarantySum){item.sumAdvanceDays = null}
                    //保证方式
                    if(item.guarantyDTOS[0].guarantyType === 0){
                        item.guarantyDTOS = null
                    }
                    if(item.id){
                        //收款方信息
                        if(item.bankConfigs !== null){
                            item.bankConfigs.forEach(item1 => {
                                item1.settlementConfigId = item.id
                            })
                        }
                        //BOH键位
                        item.bohSettlementKeyDTOS.forEach(item1 => {
                            item1.settlementConfigId = item.id
                        })
                    }
                    //处理长假保证方式
                    if(item.addGuarantySum){
                        if(item.guarantyLongVocation){
                            if(item.guarantyLongVocation.guarantyType){
                                item.guarantyLongVocation.guarantyDimension = 1;
                                if(item.guarantyDTOS){
                                    ;
                                    item.guarantyDTOS.forEach((item1,index) => {
                                        if(item1.longVocationAdd){item.guarantyDTOS.splice(index,1)}
                                    })
                                }else{
                                    item.guarantyDTOS = []
                                }
                                item.guarantyLongVocation.guarantyDimension = 1;
                                item.guarantyDTOS.push(item.guarantyLongVocation)
                            }
                        }
                    }else{
                        if(item.guarantyDTOS){
                            ;
                            item.guarantyDTOS.forEach((item1,index) => {
                                if(item1.longVocationAdd){item.guarantyDTOS.splice(index,1)}
                            })
                        }
                    }
                    delete item.guarantyLongVocation;
                    //保证方式加客户JDE
                    if(item.guarantyDTOS !== null){
                        ;
                        item.guarantyDTOS.forEach(item1 => {
                            item1.activitySettlementId = item.customerId
                        });
                        //处理可用金额
                        item.guarantyDTOS.forEach(item2 => {
                            //按活动
                            item2.guarantySum = Number(item2.guarantySum) + Number(item2.addGuarantySum);
                            item2.addGuarantySum = 0;
                            //按法人公司
                            if(item2.guarantyDimension === 2){
                                if(item2.guarantyCompanyDTOS && item2.guarantyCompanyDTOS.length>0){
                                    item2.guarantyCompanyDTOS.forEach(item3 => {
                                        if(item3.addAmount){item3.amount = item3.amount + item3.addAmount}
                                    })
                                }
                            }else{
                                item2.guarantyCompanyDTOS = null
                            }
                        });
                    }
                });
                // if(draftActive.settlementMode === 2){
                //     delete draftActive.thirdSettlementConfigDTOS[1].guarantyDTOS
                // }
                draftActive.thirdSettlementConfigDTOS.forEach(item=>{
                    if(typeof item.configItemId === 'object' && item.configItemId.length >= 1){
                        // item.configItemId = item.configItemId.join(',');
                        let ids = [];
                        item.configItemId.forEach((item)=>{
                            let arr = that.configItemOpt.find(x=>{return x.id.toString() === item}).configItemDTOS;
                            if(arr && arr.length>0){
                                arr.map(x=>{ ids.push(x.id)});
                            }
                        });
                        if(_.isArray(item.configItemId)){
                            item.configItemId = ids.join(',')
                        }
                    }else if(typeof item.configItemId === 'object' && item.configItemId.length < 1){
                        item.configItemId = ''
                    }
                })
                return draftActive
            },
            handleUpdateThirdSettlement(){
                let that = this;
                // if(that.activeData.settlementMode === 2){ //处理非全单单客户的时候，回显处理为两个对象
                //     let obj = that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.find(x=>{return x.settlementMode === 0})
                //     if(obj){
                //         that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.push(obj);
                //     }
                // }
                that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                    //收款方信息
                    if(!item.bankConfigs || item.bankConfigs.length<1){
                        item.bankConfigs = [Object.assign({},that.baseData.bankConfig)]
                    }
                    //处理保证方式
                    if(!item.guarantyDTOS || item.guarantyDTOS.length < 1){
                        item.guarantyDTOS = [Object.assign({},that.baseData.guarantyDetails)];
                        item.guarantyDTOS[0].guarantyType = 0
                    }
                    //处理文件上传
                    if(item.paymentFileName){
                        that.$set(item,'fileList',[{name:item.paymentFileName}])
                    }else{
                        that.$set(item,'fileList',[])
                    }
                    that.$set(item, 'guarantyTypes',[]);
                    let i =0;
                    // let besidesLong = item.guarantyDTOS.filter(x=>{return !x.longVocationAdd && x.guarantyType});
                    // let arrGroup = _.groupBy(besidesLong,'guarantyType');
                    ;
                    item.guarantyDTOS.forEach((item1,index) => {
                        if(item1.longVocationAdd){ //长假保证金
                            // that.$set(item,'guarantyLongVocation',item1);
                            that.$set(item.guarantyTypes, i++, item1);
                            // item.gitem1uarantyDTOS.splice(index,1);
                        }
                        // let flag = true;
                        // if(besidesLong.length > arrGroup.length){
                        //     arrGroup.map((v1,in1)=>{
                        //         if(v1.length>1){
                        //             return v1.guarantyNum
                        //         }
                        //     })
                        // }
                    });



                    //长假保证方式  和保证方式共用一个数组
                    // item.guarantyTypes =  _.filter(item.guarantyDTOS,['longVocationAdd',true]);
                    item.guarantyDTOS =  _.filter(item.guarantyDTOS,['longVocationAdd',false]);
                    //TO DO
                    if(item.guarantyDTOS.length === 0){
                        item.guarantyDTOS = [{
                            activityMasterId: 0,
                            guarantyType: 0,
                            reversible: false,
                            guarantyDimension: 1,
                            addGuarantySum: 0,
                            dueDate: null,
                            expirationReminder: null,
                            longVocationAdd: false,
                            guarantySum: 0,
                            guarantyCompanyDTOS: null,
                            guarantyRecordedDTOS: []}]
                    }
                    if (item.guarantyTypes &&  item.guarantyTypes.length === 0) { //处理长假保证方式
                        that.$set(item, 'guarantyLongVocation', Object.assign({}, that.baseData.guarantyLongVocationDetails));
                        that.$set(item, 'guarantyTypes', [item.guarantyLongVocation]);
                    }
                    // if(item.guarantyDTOS && item.guarantyDTOS.length>0){//保证方式一样的 金额 相加
                    //     let arr = [] ;
                    //     let groupBy = _.groupBy(item.guarantyDTOS,(x)=>{return x.guarantyTypes+','+x.guarantyDimension})//获取保证方式和维度相同的
                    //     _.forEach(groupBy,(val,index)=>{
                    //         if(val.length>0){
                    //             let obj = val[0];
                    //             val.forEach((item,index)=>{
                    //                 if(index>0){
                    //                     obj.guarantySum = item.guarantySum++;
                    //                     obj.guarantyCompanyDTOS =  obj.guarantyCompanyDTOS.concat(item.guarantyCompanyDTOS);
                    //                     obj.guarantyRecordedDTOS =  obj.guarantyRecordedDTOS.concat(item.guarantyRecordedDTOS);
                    //                 }
                    //             })
                    //             arr.push(obj)
                    //         }else{
                    //             arr.push(val)
                    //         }
                    //     })
                    // }
                    //收款方银行

                });
                //BOH结算键位
                if(!that.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS){
                    if(that.activeData.thirdSettlementConfigDTOS.length <= 1){
                        that.$set(that.activeData.thirdSettlementConfigDTOS[0],'bohSettlementKeyDTOS',[{'keyValue':null,'settlementColumn':3}])
                    }else{
                        that.$set(that.activeData.thirdSettlementConfigDTOS[0],'bohSettlementKeyDTOS',[{'keyValue':null,'settlementColumn':2}]);
                        that.$set(that.activeData.thirdSettlementConfigDTOS[1],'bohSettlementKeyDTOS',[{'keyValue':null,'settlementColumn':1}])
                    }
                }
                //活动编码
                that.activityCode = that.activeData.activityCode;
            },
            addCompact(){
                this.activeData.contractDTOS.push(Object.assign({disabledFlag:true},this.baseData.contract));
                this.activeData.activityActualPeriodDTOS.push({date:''})
            },
            delCompact(index){
                this.activeData.contractDTOS.splice(index,1);
                this.activeData.activityActualPeriodDTOS.splice(index,1);
                this.$refs.basicCarouselBar.style.left = '0px';
                this.activeBar = 0
            },
            getCompact(index){
                this.activeBar = index;
                this.$refs.basicCarouselBar.style.left = (-index * this.basicCarouselBarLeft) + 'px'
            },
            getSelectBill(index){
                this.selectBill = index;
                this.$refs.checkInfoBar.style.left = (-index * this.basicCarouselBarLeft) + 'px';
            },
            getSignDateRange(val,index){
                if(this.activeData.contractDTOS[index].signDate !== null && this.activeData.contractDTOS[index].conventionStartDate !== null && val >
                    this.activeData.contractDTOS[index].conventionStartDate){
                    this.showTips('合同签订日期不得晚于合同约定活动期间','warning');
                    this.activeData.contractDTOS[index].signDate = this.activeData.contractDTOS[index].conventionStartDate
                }
            },
            getDateRange(val,index){
                this.activeData.contractDTOS[index].conventionStartDate = val[0];
                this.activeData.contractDTOS[index].conventionEndDate = val[1];
                //合同签订日期
                if(!this.activeData.contractDTOS[index].signDate || this.activeData.contractDTOS[index].signDate > val[0]){
                    this.activeData.contractDTOS[index].signDate = val[0];
                }
                //活动实际期间
                this.activeData.activityActualPeriodDTOS[index].date = val;
                this.activeData.activityActualPeriodDTOS[index].acturalStartDate = val[0];
                this.activeData.activityActualPeriodDTOS[index].acturalEndDate = val[1];
                //合同约定活动期间不能有交集
                this.activeData.contractDTOS.forEach((item,addIndex) => {
                    if(index !== addIndex){
                        if(val && !(val[0] > this.activeData.contractDTOS[addIndex].range[1] || val[1] < this.activeData.contractDTOS[addIndex].range[0])){
                            this.showTips('合同约定活动期间不能有交集','warning');
                            this.activeData.contractDTOS[index].range = null;
                            this.activeData.contractDTOS[index].conventionStartDate = null;
                            this.activeData.contractDTOS[index].conventionEndDate = null;
                            this.activeData.contractDTOS[index].signDate = null;
                            this.activeData.activityActualPeriodDTOS[index].date = null;
                            this.activeData.activityActualPeriodDTOS[index].acturalStartDate = null;
                            this.activeData.activityActualPeriodDTOS[index].acturalEndDate = null;
                        }
                    }
                })
            },
            getActivityActual(val,index){
                if(this.activeData.activityActualPeriodDTOS[index].acturalStartDate !== null && this.activeData.contractDTOS[index].conventionStartDate !== null
                    && val[0] < this.activeData.contractDTOS[index].conventionStartDate){
                    this.showTips('活动实际开始日期不得早于合同约定活动期间','warning');
                    this.activeData.activityActualPeriodDTOS[index].acturalStartDate = this.activeData.contractDTOS[index].conventionStartDate
                }else{
                    this.activeData.activityActualPeriodDTOS[index].acturalStartDate = val[0]
                }
                this.activeData.activityActualPeriaccodDTOS[index].acturalEndDate = val[1];
                this.activeData.activityActualPeriodDTOS[index].date = [this.activeData.activityActualPeriodDTOS[index].acturalStartDate,this.activeData.activityActualPeriodDTOS[index].acturalEndDate];
                //活动实际期间改变则保证方式的到期日随之改变
                if(this.activeData.thirdSettlementConfigDTOS.length>0){
                    this.activeData.thirdSettlementConfigDTOS.forEach(item => {
                        ;
                        item.guarantyDTOS.forEach(item1 => {
                            item1.dueDate = null
                        })
                    })
                }
            },
            getSearchCondition(){
                let that = this;
                ip.getDictionaryByNumber('ACCOUNTWAYS-EAT',res => {that.eatInOpt = res.data});
                ip.getDictionaryByNumber('ACCOUNTWAYS-TAKE',res => {that.takeOutOpt = res.data});
                ip.getDictionaryByNumber('ACTIVETYPE',res => {that.activityTypeOpt = res.data});
                ip.getDictionaryByNumber('ACTIVEFORM',res => {that.activityModeOpt = res.data});
                ip.getDictionaryByNumber('ORDER_CHECK_RULE',res => {that.orderCheckRuleOpt = res.data});
                ip.getBrandEnglishNames('?flag=1',res => {that.brandOpt = res.data});
                ip.selectUnmapperKey(res => {res.data.forEach(item => {that.bohSettlementKeyOpt.push({value:item})})});
                ip.getCustomizeAreaList('?pageSize=0',res => {that.activityAreaOpt = res.data.list});
                ip.getAllAccountingSubjectJdeName(res => {that.accountingSubjectOpt = res.data});
                ip.getWriteOffCodeList(res=>{
                    that.writeOffOpt = res.data;
                })
                // ip.listFscUsersByKeyWord('?pageSize=20&pageIndex=1',res => {
                //   that.userNameOpt = res.data;
                // });
                // ip.activeFindAllUserInfo('?pageSize=20&pageIndex=1', res => {
                //     that.thirdUserNameOpt = res.data;
                //     that.thirdUserNameOpt.forEach(item => {
                //         that.$set(item, 'value', item.userName)
                //     })
                // });
                ip.getRscCompanies(res => {that.mainPayeeOpt = res.data});
                ip.getAllCompany(res => {that.mainBodyOpt = res.data.list});
            },
            getBillConfigByKey(param){
                let that = this;
                ip.getBillConfigByKey(param,res => {that.configItemOpt = res.data})
            },
            getStoreTreeOnly(brandEnglishName,id){   //获得餐厅的树
                let that = this;
                this.loading = true;
                ip.getActivityStore('?brandEnglishName='+encodeURIComponent(brandEnglishName),res => {
                    if(res.code === 404){
                        that.activeData.rangeType = 3;
                        that.loading = false;
                        return false;
                    }
                    //更改品牌，清空开票单位信息
                    that.companyData = [];
                    // that.billUnitData = [];
                    if(_.isUndefined(res.data.areas) && !_.isUndefined(res.data.storeTrees)){
                        res.data.storeTrees.forEach(item => {
                            let company = {};
                            let companys = {};
                            company.id = 'company'+item.jdeCode;
                            company.flag = item.flag;
                            company.name = item.jdeCode + item.companyName;
                            company.children = [];
                            companys.id = 'company'+item.jdeCode;
                            companys.flag = item.flag;
                            companys.name = item.jdeCode + item.companyName;
                            companys.children = [];
                            if(that.isChecked){company.disabled = true;companys.disabled = true}
                            that.allCompanyId.push(companys.id);
                            if(item.billUnitStores){
                                that.companylength += item.billUnitStores.length;
                                item.billUnitStores.forEach(item1 => {
                                    let billingunit = {};
                                    let billingunits = {};
                                    billingunit.id = 'billingunit'+item1.jdeCode;
                                    billingunit.name = item1.jdeCode + item1.billingUnitName;
                                    billingunit.children = [];
                                    billingunits.id = item1.jdeCode;
                                    billingunits.name = item1.jdeCode + item1.billingUnitName;
                                    if(that.isChecked){billingunit.disabled = true;billingunits.disabled = true}
                                    if(item1.storeInfos){
                                        item1.storeInfos.forEach(item2 => {
                                            let restaurant = {};
                                            restaurant.id = item2.storeJdeCode;
                                            restaurant.name = item2.storeHypId + item2.storeName;
                                            if(that.isChecked){restaurant.disabled = true}
                                            billingunit.children.push(restaurant)
                                        })
                                    }
                                    company.children.push(billingunit);
                                    companys.children.push(billingunits)
                                })
                            }
                            that.companyData.push(company);
                            // that.billUnitData.push(companys);
                            // }
                            // }
                        });
                    }else if(_.isUndefined(res.data.storeTrees) && !_.isUndefined(res.data.areas)){
                        that.activeData.rangeType = 3;
                        that.activityAreaOpt = [];
                        that.activityAreaOpt = res.data.areas;
                    }
                    that.$nextTick(()=>{
                        if(id) {
                            that.selectKey = [];
                            that.activeData.rangeDTOS.forEach(item => {
                                item.disabled = true;
                                that.selectKey.push(item.rangeValue)
                            });
                            // if (that.activeData.rangeType === 1) { //法人公司开票单位
                            //     that.selectBillUnitKey = that.selectKey;
                            //     // that.$set(that,'selectBillUnitKey',that.selectKey)
                            //     if (that.selectBillUnitKey.length > 0 && that.activeData.status === 3) {
                            //         that.billUnitData.forEach(function (item, index) { //已选择的禁掉
                            //             item.children.forEach(function (item1, index1) {
                            //                 item1 = that.selectBillUnitKey.map(function (id) {
                            //                     if (item1.id === id.toString()) {
                            //                         return Object.assign(item1, {disabled: true})
                            //                     }
                            //                 })
                            //             })
                            //         })
                            //     }
                            // } else
                            if (that.activeData.rangeType === 2) { //餐厅
                                that.selectCompanyKey = that.selectKey;
                                if (that.selectCompanyKey.length > 0 && that.activeData.status === 3) {
                                    that.companyData.forEach(function (item, index) { //已选择的禁掉
                                        if (item.children.length > 0) {
                                            item.children.forEach(function (item1, index1) {
                                                if (item1.children.length > 0) {
                                                    item1.children.forEach(function (item2, index1) {
                                                        item1 = that.selectCompanyKey.map(function (id) {
                                                            if (item2.id === id.toString()) {
                                                                return Object.assign(item2, {disabled: true})
                                                            }
                                                        });
                                                    });
                                                }
                                                item1 = that.selectCompanyKey.map(function (id) {
                                                    if (item1.id === id.toString()) {
                                                        return Object.assign(item1, {disabled: true})
                                                    }
                                                });
                                            })
                                        }
                                    })
                                        // //全选按钮选中与否
                                        // if (this.companylength === that.selectKey.length) {
                                        //     that.billUnitChecked = true;
                                        //     that.selectStatus = 1;
                                        // } else if (that.selectKey.length === 0) {
                                        //     that.selectStatus = 2
                                        // } else if (that.selectKey.length >= 0 && that.selectKey.length < this.companylength) {
                                        //     that.selectStatus = 0
                                        // }
                                }
                            }else if (that.activeData.rangeType === 3) {

                            }
                        }
                        that.switchFlagRight = false;
                        that.switchFlagRightId = false;
                        that.loading = false;
                    })

                    // if(activityId !== ''){that.getActiveData(activityId)}
                })
            },
            //     getStoreTree(brandEnglishName,id){  //获得法人公司/开票单位的树
            //         let that = this;
            //         this.loading = true;
            //         ip.getActivityAreaNew('?brandEnglishName='+encodeURIComponent(brandEnglishName),res => {
            //             if(res.code === 404){
            //                 that.activeData.rangeType = 3;
            //                 that.loading = false;
            //                 return false;
            //             }
            //             //更改品牌，清空开票单位信息
            //             // that.companyData = [];
            //             that.billUnitData = [];
            //             if(_.isUndefined(res.data.areas) && !_.isUndefined(res.data.storeTrees)){
            //             res.data.storeTrees.forEach(item => {
            //                     let company = {};
            //                     let companys = {};
            //                     company.id = 'company'+item.jdeCode;
            //                     company.flag = item.flag;
            //                     company.name = item.jdeCode + item.companyName;
            //                     company.children = [];
            //                     companys.id = 'company'+item.jdeCode;
            //                     companys.flag = item.flag;
            //                     companys.name = item.jdeCode + item.companyName;
            //                     companys.children = [];
            //                     if(that.isChecked){company.disabled = true;companys.disabled = true}
            //                     that.allCompanyId.push(companys.id);
            //                     if(item.billUnitStores){
            //                         that.companylength += item.billUnitStores.length;
            //                         item.billUnitStores.forEach(item1 => {
            //                             let billingunit = {};
            //                             let billingunits = {};
            //                             billingunit.id = 'billingunit'+item1.jdeCode;
            //                             billingunit.name = item1.jdeCode + item1.billingUnitName;
            //                             billingunit.children = [];
            //                             billingunits.id = item1.jdeCode;
            //                             billingunits.name = item1.jdeCode + item1.billingUnitName;
            //                             if(that.isChecked){billingunit.disabled = true;billingunits.disabled = true}
            //                             // if(item1.storeInfos){
            //                             //     item1.storeInfos.forEach(item2 => {
            //                             //         let restaurant = {};
            //                             //         restaurant.id = item2.storeJdeCode;
            //                             //         restaurant.name = item2.storeHypId + item2.storeName;
            //                             //         if(that.isChecked){restaurant.disabled = true}
            //                             //         billingunit.children.push(restaurant)
            //                             //     })
            //                             // }
            //                             // company.children.push(billingunit);
            //                             companys.children.push(billingunits)
            //                         })
            //                     }
            //                     // that.companyData.push(company);
            //                     that.billUnitData.push(companys);
            //                 // }
            //             // }
            //             });
            //             }else if(_.isUndefined(res.data.storeTrees) && !_.isUndefined(res.data.areas)){
            //                 that.activeData.rangeType = 3;
            //                 that.activityAreaOpt = [];
            //                 that.activityAreaOpt = res.data.areas;
            //             }
            //             that.$nextTick(()=>{
            //                 if(id) {
            //                     that.selectKey = [];
            //                     that.activeData.rangeDTOS.forEach(item => {
            //                         item.disabled = true;
            //                         that.selectKey.push(item.rangeValue)
            //                     });
            //                     if (that.activeData.rangeType === 1) { //法人公司开票单位
            //                         that.selectBillUnitKey = that.selectKey;
            //                         // that.$set(that,'selectBillUnitKey',that.selectKey)
            //                         if (that.selectBillUnitKey.length > 0 && that.activeData.status === 3) {
            //                             that.billUnitData.forEach(function (item, index) { //已选择的禁掉
            //                                 item.children.forEach(function (item1, index1) {
            //                                     item1 = that.selectBillUnitKey.map(function (id) {
            //                                         if (item1.id === id.toString()) {
            //                                             return Object.assign(item1, {disabled: true})
            //                                         }
            //                                     })
            //                                 })
            //                             })
            //                         }
            //                         //全选按钮选中与否
            //                         if (this.companylength === that.selectKey.length) {
            //                             that.billUnitChecked = true;
            //                             that.selectStatus = 1;
            //                         } else if (that.selectKey.length === 0) {
            //                             that.selectStatus = 2
            //                         } else if (that.selectKey.length >= 0 && that.selectKey.length < this.companylength) {
            //                             that.selectStatus = 0
            //                         }
            //                     }
            //                     // else if (that.activeData.rangeType === 2) { //餐厅
            //                     //     that.selectCompanyKey = that.selectKey;
            //                     //     if (that.selectCompanyKey.length > 0 && that.activeData.status === 3) {
            //                     //         that.companyData.forEach(function (item, index) { //已选择的禁掉
            //                     //             if (item.children.length > 0) {
            //                     //                 item.children.forEach(function (item1, index1) {
            //                     //                     if (item1.children.length > 0) {
            //                     //                         item1.children.forEach(function (item2, index1) {
            //                     //                             item1 = that.selectCompanyKey.map(function (id) {
            //                     //                                 if (item2.id === id.toString()) {
            //                     //                                     return Object.assign(item2, {disabled: true})
            //                     //                                 }
            //                     //                             });
            //                     //                         });
            //                     //                     }
            //                     //                     item1 = that.selectCompanyKey.map(function (id) {
            //                     //                         if (item1.id === id.toString()) {
            //                     //                             return Object.assign(item1, {disabled: true})
            //                     //                         }
            //                     //                     });
            //                     //                 })
            //                     //             }
            //                     //         })
            //                     //     }
            //                     // }
            //                 }
            //                 that.switchFlagLeft = false;
            //                 that.switchFlagLeftId = false;
            //                 that.loading = false;
            //             })
            //
            //             // if(activityId !== ''){that.getActiveData(activityId)}
            //         })
            //
            // },
            clearOrderWay(){
                this.activeData.takeOut = null;
                this.activeData.eatIn = [];
                this.activeData.orderWayValue = null;
            },
            getEatIn(val){
                this.activeData.orderWayValue = val.join(',');
            },
            getTakeOut(val){
                this.activeData.orderWayValue = val;
            },
            switchTab(tab, event){
                let that = this;
                if(tab.name === 'second'){
                    //非全单单客户时复制顾客实付的 第三方信息 和 保证方式 到第三方补贴
                    if(this.activeData.settlementMode === 2){
                        this.activeData.thirdSettlementConfigDTOS[1].customerId = this.activeData.thirdSettlementConfigDTOS[0].customerId;
                        this.activeData.thirdSettlementConfigDTOS[1].bankAccount = this.activeData.thirdSettlementConfigDTOS[0].bankAccount;
                        this.activeData.thirdSettlementConfigDTOS[1].bankName = this.activeData.thirdSettlementConfigDTOS[0].bankName;
                        this.activeData.thirdSettlementConfigDTOS[1].customerName = this.activeData.thirdSettlementConfigDTOS[0].customerName;
                        // this.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS = this.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS;
                        this.activeData.thirdSettlementConfigDTOS[1].addGuarantySum = this.activeData.thirdSettlementConfigDTOS[0].addGuarantySum;
                        this.activeData.thirdSettlementConfigDTOS[1].sumAdvanceDays = this.activeData.thirdSettlementConfigDTOS[0].sumAdvanceDays;
                        // this.activeData.thirdSettlementConfigDTOS[1].rscCollection = this.activeData.thirdSettlementConfigDTOS[0].rscCollection;
                        // if(this.activeData.thirdSettlementConfigDTOS[1].paymentDimension === 3 && !this.activeData.thirdSettlementConfigDTOS[1].rscCollection)
                        // {this.activeData.thirdSettlementConfigDTOS[1].paymentDimension = 1}
                        // if(this.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].guarantyDimension === 2 && this.activeData.thirdSettlementConfigDTOS[1].bankConfigs[0].payeeId === null){
                        //     this.$set(this.activeData.thirdSettlementConfigDTOS[1],'bankConfigs',this.activeData.thirdSettlementConfigDTOS[0].bankConfigs)
                        // }
                    }
                    //BOH键位
                    if(this.activeData.settlementMode !== 1 && this.activeData.provideBill === true  && this.activeData.settlementMode !== 3 ){
                        let keyValues = [];
                        this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS.forEach(item => {
                            keyValues.push(item.keyValue)
                        });
                        let bohSettlementKeyDTOS = [];
                        let goal = this.activeData.thirdSettlementConfigDTOS[1].bohSettlementKeyDTOS[0];
                        keyValues.forEach(item => {
                            if(that.id !== ''){
                                bohSettlementKeyDTOS.push({'id':goal.id,'keyValue':item,'settlementColumn':goal.settlementColumn,'settlementConfigId':goal.settlementConfigId})
                            }else{
                                bohSettlementKeyDTOS.push({'keyValue':item,'settlementColumn':goal.settlementColumn})
                            }
                        });
                        this.activeData.thirdSettlementConfigDTOS[1].bohSettlementKeyDTOS = JSON.parse(JSON.stringify(bohSettlementKeyDTOS))
                    }
                    //顾客实付/第三方补贴合并结算时
                    if((this.activeData.settlementMode === 2 || this.activeData.settlementMode === 3) && this.activeData.settlementConsolidation === true){
                        this.activeData.thirdSettlementConfigDTOS[1].provideSettlementToThird = this.activeData.thirdSettlementConfigDTOS[0].provideSettlementToThird;
                        this.activeData.thirdSettlementConfigDTOS[1].settlementPeriodType = this.activeData.thirdSettlementConfigDTOS[0].settlementPeriodType;
                        this.activeData.thirdSettlementConfigDTOS[1].settlementDateType = this.activeData.thirdSettlementConfigDTOS[0].settlementDateType;
                        this.activeData.thirdSettlementConfigDTOS[1].settlementPeriod = this.activeData.thirdSettlementConfigDTOS[0].settlementPeriod;
                    }
                }
            },
            mergeSettle(val){
                if(val){
                    this.activeData.thirdSettlementConfigDTOS[1].provideSettlementToThird = this.activeData.thirdSettlementConfigDTOS[0].provideSettlementToThird;
                    this.activeData.thirdSettlementConfigDTOS[1].settlementPeriodType = this.activeData.thirdSettlementConfigDTOS[0].settlementPeriodType;
                    this.activeData.thirdSettlementConfigDTOS[1].settlementDateType = this.activeData.thirdSettlementConfigDTOS[0].settlementDateType;
                    this.activeData.thirdSettlementConfigDTOS[1].settlementPeriod = this.activeData.thirdSettlementConfigDTOS[0].settlementPeriod;
                }
            },
            //树
            // filterBillUnitNode(value, data) {
            //     if (!value) return true;
            //     return data.name.indexOf(value) !== -1;
            // },
            filterCompanyNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            addRangeDTOs(){this.activeData.rangeDTOS.push({rangeValue:''})},
            removeRangeDTOs(index){this.activeData.rangeDTOS.splice(index,1)},
            getBrandName(val){
                // let obj = {};
                // obj = this.brandOpt.find((item) => {
                //     return item.id === val
                // });
                // this.activeData.brandName = obj.englishName
                // ;
                // this.switchFlagLeft = true;
                this.switchFlagRight = true;
                this.activeData.brandName = this.activeData.brand.split(',')[0];
                // if(this.activeData.rangeType === 1){
                //     this.getStoreTree(val.split(',')[0]);
                // }else

                if (this.activeData.rangeType === 2) {
                    this.getStoreTreeOnly(val.split(',')[0])
                }
                // ip.getActivityAreaNew('?brandEnglishName='+this.activeData.brandName.split(',')[0],res=>{
                //     console.log(res);
                // })
            },
            setJoin(){this.activeData.franchiseeSettlementType === 0 ? this.activeData.franchiseeSettlementType = 1 : this.activeData.franchiseeSettlementType = 0},
            // selectAllBillUnit(val){val ? this.$refs.billUnit.setCheckedKeys(this.allCompanyId) : this.$refs.billUnit.setCheckedKeys([])},
            selectAllCompany (val) {
                val ? this.$refs.company.setCheckedKeys(this.allCompanyId) : this.$refs.company.setCheckedKeys([]);
            },
            switchSettlementMode(val){
                this.activeTab = 'first';

                this.activeData.thirdSettlementConfigDTOS = [];
                this.activeData.thirdSettlementConfigDTOS.push(JSON.parse(JSON.stringify(this.baseData.accountDetails)));
                if(val !== 1) {
                    this.activeData.thirdSettlementConfigDTOS.push(JSON.parse(JSON.stringify(this.baseData.accountDetails)));
                    this.activeData.thirdSettlementConfigDTOS[0].bohSettlementKeyDTOS[0].settlementColumn = 2;
                    this.activeData.thirdSettlementConfigDTOS[0].settlementType = 1;
                    this.activeData.thirdSettlementConfigDTOS[1].bohSettlementKeyDTOS[0].settlementColumn = 1;
                    this.activeData.thirdSettlementConfigDTOS[1].settlementType = 2;
                    this.activeData.thirdSettlementConfigDTOS[1].defaultCustomer = false;
                    this.activeData.thirdSettlementConfigDTOS.forEach(item => {item.settlementMode = val})
                }
                if(val !== 2){this.activeData.settlementConsolidation = false}
            },
            remoteUserName(val,item,index){  //输入时调用
                let that = this;
                if(val){
                    this.remoteString = val;
                    if (JSON.stringify(this.selectObj) !== '{}') {
                        this.selectObj.scrollTop = 0;
                    }
                }
                let tem = [
                    {
                        name:'keyWord',
                        value:val
                    },{
                        name:'pageSize',
                        value:this.userNameSize
                    },{
                        name:'pageIndex',
                        value:1
                    },{
                        name:'workType',
                        value:item.workType
                    },{
                        name:'userType',
                        value:item.userType
                    }

                ];
                ip.findFscUserInfo(this.common.joinSearchParam(tem), res => {
                    if(res.code === 200){
                        that.activeData.userInfo[index].userNameOpt = res.data;
                    }
                })
            },
            scrollUserName(item,index,param,object){
                let that = this;
                if(param && this.switchon){
                    this.selectObj = object;
                    this.switchon = false;
                    if(this.remoteFlagUser){
                        this.userNameSize +=  20;
                        let tem = [
                            {
                                name:'keyWord',
                                value:this.remoteString
                            },
                            {
                                name:'pageSize',
                                value:this.userNameSize
                            },{
                                name:'pageIndex',
                                value:1
                            },{
                                name:'workType',
                                value:item.workType,
                            },
                            {
                                name:'userType',
                                value:item.userType,
                            }
                        ];
                        ip.findFscUserInfo(this.common.joinSearchParam(tem),res => {
                            if(res.code === 200){
                                that.activeData.userInfo[index].userNameOpt = res.data;
                                if(that.userNameSize === res.data.length){
                                    that.switchon = true
                                }else  if(that.userNameSize>= res.data.length){
                                    that.remoteFlagUser = false
                                }
                            }else{
                                that.remoteFlagUser  = false;
                            }
                        })
                    }

                }
            },
            getUserInfo(val,contactItem,index,flag){ //选择时
                let that = this;
                let arrOpt = this.activeData.userInfo[index].userNameOpt;
                if(!val){
                    this.remoteString  = '';
                }
                if (!flag) {
                    this.userNameSize = 20;
                    let obj = {};
                    let arrIndex = this.activeData.userInfo[index];
                    let userType = arrIndex.userType,workType = arrIndex.workType;
                    let type = this.activeData.userInfo[index].type;
                    let infoObj = {
                        mobile:'',
                        mail:'',
                        phone:''
                    };
                    let objTemp = {
                        workType:workType,
                        type:type,
                        userType:userType,
                        userName:val,
                    };
                    if (arrOpt && arrOpt.length > 0) {
                        obj = arrOpt.find(item => {
                            return item.psId+','+item.userName === val
                        });
                        if (obj) {
                            this.$set(this.activeData.userInfo,index,Object.assign(this.activeData.userInfo[index], JSON.parse(JSON.stringify(obj))))
                        } else {
                            this.$set(this.activeData.userInfo,index,{...objTemp,...infoObj})
                        }
                    }else{
                        this.$set(this.activeData.userInfo,index,{...objTemp,...infoObj})
                    }
                } else {//下拉框出现时 调用
                    ip.findFscUserInfo(this.common.joinSearchParam([
                        {
                            name: 'pageIndex',
                            value: 1
                        },
                        {
                            name: 'pageSize',
                            value: 20
                        },
                        {
                            name: 'workType',
                            value: contactItem.workType
                        },
                        {
                            name: 'userType',
                            value: contactItem.userType
                        },
                    ]), res => {
                        if(res.code ===200){
                            that.$set(that.activeData.userInfo[index],'userNameOpt',res.data)
                        }
                    })
                }

            },
            getActiveData(id){
                let that = this;
                ip.getActiveDetail(id,res => {
                    if(res.code === 200){
                        that.activeData = res.data;
                        if(Number(localStorage.getItem('marketType')) !== 3){
                            // if(that.activeData.rangeType === 1){
                            //     that.getStoreTree(that.activeData.brand.split(',')[0],id);
                            // }else
                            //
                            if (that.activeData.rangeType === 2) {
                                that.getStoreTreeOnly(that.activeData.brand.split(',')[0], id);
                            }
                        }
                        that.handleData();
                        /*收/付款信息*/
                        res.data.bsSubsidyListRule ? that.activeData.bsSubsidyListRule = res.data.bsSubsidyListRule : that.activeData.bsSubsidyListRule = 1;
                        res.data.thirdSubsidyListRule ? that.activeData.thirdSubsidyListRule = res.data.thirdSubsidyListRule
                            : that.activeData.thirdSubsidyListRule = 1;
                        res.data.handingChargeListRule ? that.activeData.handingChargeListRule = res.data.handingChargeListRule
                            : that.activeData.handingChargeListRule = 1;

                        //结算类型
                        if(!that.activeData.settlementMode){that.activeData.settlementMode = 1}
                        //是否出具结算报告至第三方
                        if(that.activeData.thirdSettlementConfigDTOS.length < 1){
                            that.activeData.thirdSettlementConfigDTOS.push(JSON.parse(JSON.stringify(that.baseData.accountDetails)))
                        }
                        //账单配置项
                        that.checkAbbreviation(that.activeData.activityAbbreviation);


                        that.handleUpdateThirdSettlement();

                        /*联系人下拉框信息*/
                        // if(that.activeData.userInfo){
                        //     that.activeData.userInfo.forEach(item => {
                        //         if(item.userType === 1){
                        //             let userNameRange = false;
                        //             that.userNameOpt.forEach(item1 => {if(item.psId === item1.psId){userNameRange = true}});
                        //             if(!userNameRange){that.userNameOpt.push(item)}
                        //         }else if(item.userType === 2){
                        //             let thirdRange = false;
                        //             that.thirdUserNameOpt.forEach(item2 => {if(item.psId === item2.psId){thirdRange = true}});
                        //             if(!thirdRange){that.thirdUserNameOpt.push(item)}
                        //         }
                        //     })
                        // }
                        /*联系人信息*/
                        let conctact = that.contactInfo.userInfo;
                        let active = that.activeData.userInfo;
                        if(active && active.length>0){
                            for(var i=0;i <conctact.length;i++){    //合并联系人信息 将返回的联系人信息与基本联系人信息合并
                                for(var j=0;j <active.length;j++){
                                    if(conctact[i].workType === active[j].workType && conctact[i].userType === active[j].userType){
                                        _.assignIn(conctact[i],active[j])
                                        break;
                                    }
                                }
                            }
                        }
                        that.activeData.userInfo = JSON.parse(JSON.stringify(that.contactInfo.userInfo));
                        if(that.brandOpt.length>0){
                            that.brandOpt.forEach(function(item,index){
                                if(item.englishName === res.data.brand){
                                    that.activeData.brand = item.englishName+','+item.id.toString();
                                }
                            })
                        }
                        //活动范围回显

                    }else{
                        that.showTips(res.msg,'info')
                    }
                })

            },
            insertActive(){
                let that = this;
                let pathParams = [{
                    name:'module',
                    value:this.module
                },{
                    name:'subModule',
                    value:this.subModule
                }];
                let tem = this.common.joinSearchParam(pathParams);
                /*联系人信息*/
                this.$refs['activeData'].validate((valid) => {
                    if(valid){
                        that.contactInfo = {userInfo:[]};
                        that.activeData.financialManagerId = null;
                        that.activeData.activityManagerId = null
                        that.activeData.creditManagerId = null
                        that.activeData.storeConfigId = null
                        that.activeData.invoiceContactId = null;
                        that.activeData.internalSettlementId = null;
                        that.activeData.thirdManagerId = null
                        that.activeData.pushExceptionId = null
                        that.activeData.recordedExceptionId = null
                        that.activeData.userInfo.forEach((item,index) => {
                            let userName,psId;
                            if (item.userName && item.userName.indexOf(',') !== -1) {
                                [psId, userName] = item.userName.split(',');
                            } else {
                                [psId, userName] = [item.psId,item.userName]
                            }
                            var flag = !item.mobile && !userName && !psId && !item.phone && !item.mail; //是否未填
                            if (!flag) {
                                item.userName = userName;
                                if (item.type === '财务负责人') {
                                    that.activeData.financialManagerId = psId//item.userName.split(',')[0];
                                    that.contactInfo.userInfo.push(item);
                                } else if (item.type === '活动负责人' && index === 1) {
                                    that.activeData.activityManagerId = psId;
                                    that.contactInfo.userInfo.push(item)
                                } else if (item.type === '信用控制负责人') {
                                    that.activeData.creditManagerId = psId;
                                    that.contactInfo.userInfo.push(item)
                                } else if (item.type === '门店配置联系人') {
                                    that.activeData.storeConfigId = psId;
                                    that.contactInfo.userInfo.push(item)
                                } else if (item.type === '发票开具联系人') {
                                    that.activeData.invoiceContactId = psId;
                                    that.contactInfo.userInfo.push(item);
                                } else if (item.type === '内部往来结算审批人') {
                                    that.activeData.internalSettlementId = psId;
                                    that.contactInfo.userInfo.push(item)
                                } else if (item.type === '加盟商开票数据收集人') {
                                    that.activeData.franchiseeRecipient = psId;
                                    that.contactInfo.userInfo.push(item)
                                } else if (item.type === '活动负责人' && index === 7) {
                                    if (!item.id) {
                                        that.activeData.thirdManagerId = psId;
                                        that.activeData.thirdManager = item;
                                        that.$set(that.activeData.thirdManager, 'userType', 2)
                                        that.contactInfo.userInfo.push(that.activeData.thirdManager)
                                    } else {
                                        that.activeData.thirdManagerId = psId;
                                        delete item.value;
                                        that.contactInfo.userInfo.push(item)
                                    }
                                } else if (item.type === '账单推送异常联系人') {
                                    if (!item.id) {
                                        that.activeData.pushExceptionId = psId;
                                        that.activeData.pushException = item;
                                        that.$set(that.activeData.pushException, 'userType', 2);
                                        that.contactInfo.userInfo.push(that.activeData.pushException)
                                    } else {
                                        that.activeData.pushExceptionId = psId;
                                        delete item.value;
                                        that.contactInfo.userInfo.push(item)
                                    }
                                } else if (item.type === '银行上账异常联系人') {
                                    if (!item.id) {
                                        that.activeData.recordedExceptionId = psId;
                                        that.activeData.recordedException = item;
                                        that.$set(that.activeData.recordedException, 'userType', 2)
                                        that.contactInfo.userInfo.push(that.activeData.recordedException)
                                    } else {
                                        that.activeData.recordedExceptionId = psId;
                                        delete item.value;
                                        that.contactInfo.userInfo.push(item)
                                    }
                                }
                            }
                        });

                        //去除重复联系人
                        let length = that.contactInfo.userInfo.length;
                        if(length >0){
                            for(let i=length - 1;i >= 0;i--){
                                for(let j=i - 1;j >= 0;j--){
                                    if(this.contactInfo.userInfo[i].psId && this.contactInfo.userInfo[j].psId){
                                        if(this.contactInfo.userInfo[i].psId === this.contactInfo.userInfo[j].psId){
                                            this.contactInfo.userInfo.splice(j,1);break
                                        }
                                    }
                                }
                            }
                        }
                        delete that.activeData.userInfo;
                        that.activeData = Object.assign(that.activeData,that.contactInfo);

                        that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                            item.activityMasterId = parseInt(that.id);
                        });
                        //处理核对规则
                        if(that.hasOrderCheckRule){
                            // that.activeData.orderCheckRule = that.activeData.orderCheckRule.join(',');
                            if(_.isArray( that.activeData.orderCheckRule)){
                                that.activeData.orderCheckRule =  that.activeData.orderCheckRule.join(',')
                            }
                        }else{
                            delete that.activeData.orderCheckRule
                        }
                        //非全单单客户时复制顾客实付的 第三方信息 和 保证方式 到第三方补贴
                        if(that.activeData.settlementMode === 2){
                            that.activeData.thirdSettlementConfigDTOS[1].customerId = that.activeData.thirdSettlementConfigDTOS[0].customerId;
                            that.activeData.thirdSettlementConfigDTOS[1].bankAccount = that.activeData.thirdSettlementConfigDTOS[0].bankAccount;
                            that.activeData.thirdSettlementConfigDTOS[1].bankName = that.activeData.thirdSettlementConfigDTOS[0].bankName;
                            // that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS = that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS;
                            that.activeData.thirdSettlementConfigDTOS[1].addGuarantySum = that.activeData.thirdSettlementConfigDTOS[0].addGuarantySum;
                            that.activeData.thirdSettlementConfigDTOS[1].sumAdvanceDays = that.activeData.thirdSettlementConfigDTOS[0].sumAdvanceDays;
                            that.activeData.thirdSettlementConfigDTOS[1].rscCollection = that.activeData.thirdSettlementConfigDTOS[0].rscCollection;
                        }
                        //若打款方式为支付宝，打款维度为开票单位，则无收款方
                        that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                            if(item.paymentMethod === 2 && item.paymentDimension === 2){item.bankConfigs = null}
                        });
                        //不出具结算报告，结算类型不用存值
                        that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                            if(!item.provideSettlementToThird){
                                item.settlementPeriodType = null;
                                item.settlementPeriod = null;
                                item.settlementDateType = null
                            }
                        });
                        //处理保证方式
                        that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                            //第三方账单
                            if(that.activeData.provideBill){
                                if(typeof item.configItemId === 'object' && item.configItemId.length >= 1){
                                    // item.configItemId = item.configItemId.join(',');
                                    let ids = [];
                                    item.configItemId.forEach((item)=>{
                                        let arr = that.configItemOpt.find(x=>{return x.id.toString() === item}).configItemDTOS;
                                        if(arr && arr.length>0){
                                            arr.map(x=>{ ids.push(x.id)});
                                        }
                                    });
                                    if(_.isArray(item.configItemId)){
                                        item.configItemId = ids.join(',')
                                    }
                                }else if(typeof item.configItemId === 'object' && item.configItemId.length < 1){
                                    item.configItemId = ''
                                }
                                // if(item.configItemId !== '' && item.configItemId !== null){
                                //     that.configItemOpt.forEach(thirdBill => {
                                //         if(thirdBill.id + '' === item.configItemId){
                                //             item.configItemId = [];
                                //             if(  thirdBill.configItemDTOS &&thirdBill.configItemDTOS.length>0){
                                //                 thirdBill.configItemDTOS.forEach(configItem => {
                                //                     item.configItemId.push(configItem.id)
                                //                 })
                                //             }
                                //         }
                                //     });
                                //     if(_.isArray(item.configItemId)){
                                //         ;
                                //         item.configItemId = item.configItemId.join(',')
                                //     }
                                // }
                            }else{
                                item.configItemId = ''
                            }
                            //是否出具《长假保证金额追加报告》
                            if(!item.addGuarantySum){item.sumAdvanceDays = null}
                            //保证方式
                            if(item.guarantyDTOS.length === 1 && item.guarantyDTOS[0].guarantyType === 0 && !item.guarantyDTOS[0].longVocationAdd){
                                item.guarantyDTOS = null
                            }
                            if(item.id){
                                //收款方信息
                                if(item.bankConfigs !== null){
                                    item.bankConfigs.forEach(item1 => {
                                        item1.settlementConfigId = item.id
                                    })
                                }
                                //BOH键位
                                item.bohSettlementKeyDTOS.forEach(item1 => {
                                    item1.settlementConfigId = item.id
                                })
                            }
                            //处理长假保证方式
                            if(item.addGuarantySum){
                                if(item.guarantyLongVocation){
                                    if(item.guarantyLongVocation.guarantyType){
                                        item.guarantyLongVocation.guarantyDimension = 1;
                                        if(item.guarantyDTOS){
                                            item.guarantyDTOS.forEach((item1,index) => {
                                                if(item1.longVocationAdd){item.guarantyDTOS.splice(index,1)}
                                            })
                                        }else{
                                            item.guarantyDTOS = []
                                        }
                                        item.guarantyLongVocation.guarantyDimension = 1;
                                        item.guarantyDTOS.push(item.guarantyLongVocation)
                                    }
                                }
                            }else{
                                if(item.guarantyDTOS){
                                    item.guarantyDTOS.forEach((item1,index) => {
                                        if(item1.longVocationAdd){item.guarantyDTOS.splice(index,1)}
                                    })
                                }
                            }
                            delete item.guarantyLongVocation;
                            delete item.guarantyTypes;
                            //保证方式加客户JDE
                            if(item.guarantyDTOS !== null){
                                ;
                                item.guarantyDTOS.forEach(item1 => {
                                    item1.activitySettlementId = item.customerId
                                });
                                //处理可用金额
                                item.guarantyDTOS.forEach(item2 => {
                                    //按活动
                                    item2.guarantySum = Number(item2.guarantySum) + Number(item2.addGuarantySum);
                                    //按法人公司
                                    if(item2.guarantyDimension === 2){
                                        item2.guarantyCompanyDTOS.forEach(item3 => {
                                            if(item3.addAmount){item3.amount = item3.amount + item3.addAmount}
                                        })
                                    }else{
                                        item2.guarantyCompanyDTOS = null
                                    }
                                });
                            }
                        });
                        if(that.activeData.settlementMode === 2){
                            // delete that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS
                        }
                        //活动编码
                        if(that.id !== '' && that.activeData.status !== 1 && that.activityCode === that.activeData.activityCode){
                            delete that.activeData.activityCode
                        }

                        //草稿->未开始
                        if(that.activeData.status === 1){that.activeData.status = 2}
                        that.activeData.id = that.id;
                        ip.updateActive(tem,that.activeData,res => {
                            if (res.code === 200) {
                                that.showTips(res.data, 'success');
                                that.cancel()
                            } else {
                                that.showTips(res.msg, 'info');
                                that.cancel()
                            }
                        },err=>{
                            console.log(err)
                        })
                    }else{
                        this.showTips('请将信息填写完整','info');
                        return false
                    }
                })
            },
            showTips(text,type){this.common.messageUtil({message: text, type: type})},
            uploadSuccess(response,file,fileList,index){
                if(response.code === 200){
                    this.activeData.billConfigs[index].fileList = [];
                    this.activeData.billConfigs[index].fileList.push(fileList[fileList.length - 1]);
                    this.activeData.billConfigs[index].couponFileName = file.name;
                    this.activeData.billConfigs[index].couponFilePath = response.data.url;
                    this.activeData.billConfigs[index].couponNames = response.data.couponName;
                }else{
                    this.activeData.billConfigs[index].fileList = [];
                    this.showTips(response.msg,'warning');
                }
            },
            removeFile(file,fileListMap,index){
                let that = this;
                ip.deleteFile(this.activeData.billConfigs[index].couponFilePath,res => {
                    if(res.code === 200){
                        this.activeData.billConfigs[index].couponFilePath = null;
                        this.activeData.billConfigs[index].couponFileName = null;
                        this.activeData.billConfigs[index].fileList = [];
                        this.activeData.billConfigs[index].couponNames = [];
                    }else{
                        that.showTips(res.msg,'info')
                    }
                })

            },
            getActiveName(val){
                if(!this.activeData.activityAbbreviation){
                    this.activeData.activityAbbreviation = this.activeData.activityName;
                    this.checkAbbreviation(val)
                }
            },
            checkAbbreviation(val){
                let that = this;
                if(this.id !== ''){val = val + '&activityId=' + this.id}
                ip.getSameNameActivity(val,res => { //获取相同简称的活动账单
                    if(res.code === 200){
                        let billConfigsUnify = {};
                        let billIds = [];
                        res.data.forEach(item => {
                            if(item.status === 3　&& item.billConfigs.length >= 1){billConfigsUnify = item}//进行中
                        });
                        if(Object.keys(billConfigsUnify).length<1){
                            res.data.forEach(item => {if(item.status === 2 && item.billConfigs.length >= 1){billConfigsUnify = item}})//未开始
                        }
                        if(Object.keys(billConfigsUnify).length<1){
                            that.disabledBill = false;
                            that.getBillConfigByKey({pageSize:999999})
                        }else{
                            that.disabledBill = billConfigsUnify.status === 3;
                            that.activeData.provideBill = billConfigsUnify.provideBill;
                            that.activeData.orderCheckRule = billConfigsUnify.orderCheckRule;

                            that.activeData.billConfigs = JSON.parse(JSON.stringify(billConfigsUnify.billConfigs));
                            if(that.id === ''){
                                that.activeData.billConfigs.forEach(item => {delete item.id})
                            }

                            billConfigsUnify.billConfigs.forEach(item => {billIds.push(item.billMasterId)});
                            let param = Object.assign({},{pageSize:999999});
                            if(billIds.length >= 1){param =  {thirdBillId:billIds,pageSize:999999}}
                            that.getBillConfigByKey(param)
                        }
                    }else{
                        that.getBillConfigByKey({pageSize:999999})
                    }
                })
            },
            querySearch(queryString, cb) {
                // let that = this;
                // let tem = [
                //     {
                //         name:'keyWord',
                //         value:queryString
                //     },{
                //         name:'pageSize',
                //         value:this.thirdUserNameSize
                //     },{
                //         name:'pageIndex',
                //         value:1
                //     }
                // ];
                // ip.activeFindAllUserInfo(this.common.joinSearchParam(tem), res => {
                //     that.thirdUserNameOpt = res.data;
                //     that.thirdUserNameOpt.forEach(item => {
                //         that.$set(item, 'value', item.userName)
                //     })
                // });
                // let thirdUserNameOpt = this.thirdUserNameOpt;
                // let results = queryString ? thirdUserNameOpt.filter(this.createFilter(queryString)) : thirdUserNameOpt;
                // cb(results);
            },
            createFilter(queryString) {
                return (thirdUserName) => {
                    return (thirdUserName.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item,index) {
                // let obj = {};
                // obj = this.thirdUserNameOpt.find(val => {return val.psId === item.psId});
                // this.activeData.userInfo[index] = JSON.parse(JSON.stringify(obj));
            },
            clearRange(){
                this.activeData.rangeDTOS = [{rangeValue:null}];
                // if(this.activeData.rangeType === 1 && this.switchFlagLeft && !this.$route.query.id){ //品牌如果有改动 切换活动范围
                //     this.getStoreTree(this.activeData.brand.split(',')[0])
                // }else
                if (this.activeData.rangeType === 2 && this.switchFlagRight && !this.$route.query.id) {  //新增页面且未调过树的接口
                    this.getStoreTreeOnly(this.activeData.brand.split(',')[0])
                }
                // if(this.activeData.rangeType === 1 && this.$route.query.id && this.switchFlagLeftId){ //品牌如果有改动 切换活动范围
                //     this.getStoreTree(this.activeData.brand.split(',')[0])
                // }else
                if (this.activeData.rangeType === 2 && this.$route.query.id && this.switchFlagRightId) { //编辑页面且未调过树的接口
                    this.getStoreTreeOnly(this.activeData.brand.split(',')[0])
                }
            },
            // getSelectedBillUnitKeys(node,nodes){
            //     this.selectBillUnitKey = nodes.checkedKeys
            // },
            getSelectedCompanyKeys(node,nodes){
                this.selectCompanyKey = nodes.checkedKeys;
                // this.isIndeterminate =  0 < this.selectKey.length <this.companylength
                // if(this.selectKey.length  === this.companylength ){
                //     this.companyChecked = true;
                // }
            },
            clearBillProvideDate(val,index){
                if(val === 6 || val === 7){
                    this.$set(this.activeData.billConfigs[index],'settlementDateType',1)
                }else{
                    this.$set(this.activeData.billConfigs[index],'settlementDateType',null)
                }

                this.activeData.billConfigs[index].billProvideDate = null
            },
            getBankConfigs(val,oldVal){
                if(this.id === '' || (oldVal.length >= 1 && val.join(',') !== oldVal.join(','))
                    // || (oldVal.length < 1 && this.activeData.rangeType === 1 && this.selectKey.join(',') !== this.billUnitJDEs.join(','))
                    || (oldVal.length < 1 && this.activeData.rangeType === 2 && this.selectKey.join(',') !== this.restaurantJDEs.join(',')) ||
                    (oldVal.length < 1 && this.activeData.rangeType === 3 && this.selectKey.join(',') !== this.customizeAreaIds.join(','))) {
                    if(this.activeData.thirdSettlementConfigDTOS && this.activeData.thirdSettlementConfigDTOS[0].paymentDimension !== 3){
                        this.activeData.thirdSettlementConfigDTOS[0].bankConfigs = [];
                        this.activeData.thirdSettlementConfigDTOS[0] = this.getBankInfo(this.activeData.thirdSettlementConfigDTOS[0],val)
                    }
                    if(this.activeData.thirdSettlementConfigDTOS && this.activeData.thirdSettlementConfigDTOS.length === 2 && this.activeData.thirdSettlementConfigDTOS[1].paymentDimension !== 3){
                        this.activeData.thirdSettlementConfigDTOS[1].bankConfigs = [];
                        this.activeData.thirdSettlementConfigDTOS[1] = this.getBankInfo(this.activeData.thirdSettlementConfigDTOS[1],val)
                    }
                }
            },
            getBankInfo(type,val){
                let param = [];
                let that = this;
                if(type.paymentDimension === 1){
                    if(this.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        val.forEach(item => {param.push({name:'jde',value:item})})
                    }else{
                        param = [{name:'type',value:1}];
                        this.companyJDEs.forEach(item => {param.push({name:'jde',value:item})})
                    }
                    ip.getCompanyJdeAndName(this.common.joinSearchParam(param),res => {
                        if(res.code === 200){
                            if(that.paymentFlag){
                                that.paymentFlag = false;
                                that.$refs.acc1.getBankConfigDetails(type.paymentDimension);
                                if(that.$refs.acc2){
                                    that.$refs.acc2.getBankConfigDetails(type.paymentDimension);
                                }
                            }
                            res.data.forEach(item => {
                                type.bankConfigs.push({payeeId:item.jdeCode,payeeName:item.companyName})
                            })
                        }else{
                            type.bankConfigs = null
                        }
                    })
                }else if(type.paymentDimension === 2){
                    if(this.activeData.rangeType === 3){
                        param = [{name:'type',value:2}];
                        val.forEach(item => {param.push({name:'jde',value:item})})
                    }else{
                        param = [{name:'type',value:1}];
                        this.billUnitJDEs.forEach(item => {param.push({name:'jde',value:item})})
                    }
                    ip.getBillUnitJdeAndName(this.common.joinSearchParam(param),res => {
                        if(res.code === 200){
                            if(that.paymentFlag){
                                that.paymentFlag = false;
                                that.$refs.acc1.getBankConfigDetails(type.paymentDimension);
                                if(that.$refs.acc2){
                                    that.$refs.acc2.getBankConfigDetails(type.paymentDimension);
                                }
                            }
                            res.data.forEach(item => {
                                type.bankConfigs.push({payeeId:item.jdeCode,payeeName:item.billingUnitName})
                            });
                        }else{
                            type.bankConfigs = null
                        }
                    })
                }
                // if(type.bankConfigs.length < 1){type.bankConfigs = [JSON.parse(JSON.stringify(bankConfig))]}
                return type
            },
            getCompanyJdeAndName(val,oldVal){
                if(this.id === '' || (oldVal.length >= 1 && val.join(',') !== oldVal.join(',')) ||
                    // (oldVal.length < 1 && this.activeData.rangeType === 1 && this.selectKey.join(',') !== this.billUnitJDEs.join(',')) ||
                    (oldVal.length < 1 && this.activeData.rangeType === 2 && this.selectKey.join(',') !== this.restaurantJDEs.join(',')) ||
                    (oldVal.length < 1 && this.activeData.rangeType === 3 && this.selectKey.join(',') !== this.customizeAreaIds.join(','))) {
                    let that = this;
                    let param = [];
                    if(this.activeData.thirdSettlementConfigDTOS){
                        this.activeData.thirdSettlementConfigDTOS.forEach(item => {
                            if(item.guarantyDTOS){
                                item.guarantyDTOS.forEach(item1 => {
                                    item1.guarantyCompanyDTOS = []
                                })
                            }
                        });
                    }
                    if (this.activeData.rangeType === 3) {
                        param = [{name: 'type', value: 2}];
                        val.forEach(item => {
                            param.push({name: 'jde', value: item})
                        })
                    } else {
                        param = [{name: 'type', value: 1}];
                        val.forEach(item => {
                            param.push({name: 'jde', value: item})
                        })
                    }
                    ip.getCompanyJdeAndName(that.common.joinSearchParam(param), res => {
                        if (res.code === 200) {
                            // that.$refs.acc1.getBankConfigDetails(type.paymentDimension);
                            res.data.forEach(item => {
                                let tem = {};
                                if (that.id !== '') {
                                    if (that.activeData.thirdSettlementConfigDTOS.length === 1) {
                                        if (that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.length === 1) {
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].id
                                            })
                                        } else if (that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.length === 2) {
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].id
                                            });
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[1].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[1].id
                                            })
                                        }
                                    } else if (that.activeData.thirdSettlementConfigDTOS.length === 2) {
                                        if (that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.length === 1) {
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].id
                                            })
                                        } else if (that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS.length === 2) {
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[0].id
                                            });
                                            that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[1].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[0].guarantyDTOS[1].id
                                            })
                                        }
                                        if (that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.length === 1) {
                                            that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[0].id
                                            })
                                        } else if (that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS.length === 2) {
                                            that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[0].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[0].id
                                            });
                                            that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[1].guarantyCompanyDTOS.push({
                                                addAmount: 0,
                                                amount: 0,
                                                companyId: item.id,
                                                companyName: item.companyName,
                                                guarantyId: that.activeData.thirdSettlementConfigDTOS[1].guarantyDTOS[1].id
                                            })
                                        }
                                    }
                                } else {
                                    tem = {addAmount: 0, amount: 0, companyId: item.id, companyName: item.companyName};
                                    that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                                        item.guarantyDTOS.forEach(item1 => {
                                            item1.guarantyCompanyDTOS.push(JSON.parse(JSON.stringify(tem)))
                                        })
                                    })
                                }
                            })
                        } else {
                            that.activeData.thirdSettlementConfigDTOS.forEach(item => {
                                item.guarantyDTOS.forEach(item1 => {
                                    item1.guarantyCompanyDTOS = []
                                })
                            })
                        }
                    })
                }
            },
            clearChargeMinAmount(val){
                if(val !== true || val !== 1){this.activeData.handingChargeMinAmount = null}
            },
            exportFile(index){
                let url = this.activeData.billConfigs[index].couponFilePath;
                let fileName = this.activeData.billConfigs[index].couponFileName;
                let condition = [{
                    name:'url',
                    value:url
                },{
                    name:'fileName',
                    value:fileName
                }];
                if(url && fileName){
                    ip.thirdBillDownload(this.common.joinSearchParam(condition),res =>{
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
            removeCheckRule(ruleIndex){
                this.activeData.orderCheckRule.splice(ruleIndex,1)
            },
            addCheckRule(){
                this.activeData.orderCheckRule.push('')
            },
            addChargeFee(){
                // let obj = Object.assign({},this.baseData.chargeFeeInit);
                // if (this.activeData.chargeFees && this.activeData.chargeFees.length === 1) {
                //     this.activeData.chargeFees.map(x=>{
                //         obj.disabled = true
                //     })
                // }
                this.activeData.chargeFees.push(Object.assign({},this.baseData.chargeFeeInit));
            },
            delChargeFee(chargeFeeIndex){
                this.activeData.chargeFees.splice(chargeFeeIndex,1);
                if(!this.activeData.chargeFees || this.activeData.chargeFees.length === 0){
                    this.activeData.chargeFees.push(Object.assign({},this.baseData.chargeFeeInit))
                }
            },
            visibleChargeType(val){
                // if(val){
                //     let that = this;
                //     if (this.activeData.chargeFees && this.activeData.chargeFees.length === 2) {
                //         this.activeData.chargeFees.map((x, index) => {
                //             if(index === 0){
                //                 if(x.chargeType){
                //                     that.activeData.chargeFees[1].disabled = true;
                //                 }
                //             }else{
                //                 if(x.chargeType){
                //                     that.activeData.chargeFees[0].disabled = true;
                //                 }
                //             }
                //         })
                //     }
                //     if (!this.activeData.chargeType && this.activeData.chargeFees && this.activeData.chargeFees.length === 1) {
                //
                //         this.activeData.chargeFees[0].disabled = false;
                //     }
                // }
            },
            // changeChargeType(val){
            //     let that = this;
            //     if (!val) {
            //         this.activeData.chargeFees.map(x=>{
            //            return x.disabled = false;
            //         })
            //     }
            // }
        },
        beforeMount(){
            if(this.$route.query.id){this.id = this.$route.query.id}
            this.getSearchCondition();
            ip.getHolidayList('?isLongHoliday=1&pageSize=99999&year='+new Date().getFullYear(),res=>{
                if(res.code === 200){
                    this.holidayStorage = res.data.list;
                    // this.holidayStorage.forEach(x=>{
                    //     this.holidayYearMap[x.holidayId] = x;//x.year
                    // })
                }
            })
        },
        mounted(){
            if(this.$route.query.id){
                this.id = parseInt(this.$route.query.id);
                this.isEdit = true;
                this.baseData.guarantyDetails.activityMasterId = this.id;
                this.baseData.guarantyLongVocationDetails.activityMasterId = this.id;
                this.baseData.chargeFeeInit.activityMasterId = this.id;
                // this.switchFlagLeftId = true;
                this.switchFlagRightId = true;
                this.getActiveData(this.id);
            }else{
                this.isAdd = true;
            }
            // this.getStoreTree(this.id);
            if(Number(localStorage.getItem('marketType')) === 3){
                this.getStoreTreeOnly()
            }
            this.isChecked = !!this.$route.query.detail;
        },
        filters: {
            customType:  (index)=> {
                switch(index){
                    case 1:return '财务负责人';
                    case 2:return '活动负责人';
                    case 3:return '信用控制负责人';
                    case 4:return '门店配置联系人';
                    case 5:return '发票开具联系人';
                    case 6:return '内部往来结算审批人';
                    case 7:return '账单推送异常联系人';
                    case 8:return '银行上账异常联系人';
                    case 9:return '加盟商开票数据收集人';
                    default:return;
                }
            }
        },
        beforeRouteLeave(to, from, next) {
            to.meta.isBack = to.name === 'active';
            next();
        },
    }
</script>

<style lang="scss">
    @import '../../assets/scss/master';
    .block{
        .el-date-editor .el-input__icon,.el-range-separator{
            line-height: 22px;
        }
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
    .checkInfoCardItem .el-input-group__prepend{
        background:#fff;
    }
</style>
