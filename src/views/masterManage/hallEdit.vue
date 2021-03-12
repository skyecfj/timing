<template>
    <el-form
            class="viewForm"
            label-position="top"
            ref="hallData"
            :model="hallData[0]"
            :rules="rules"
            label-width="100px">
        <div class="viewFormHall">
            <el-card>
                <div slot="header">
                    <span>基础信息</span>
                </div>
                <div class="hallContent">
                    <el-form-item label="Hyp Code">
                        <el-input size="small"  placeholder="" v-model="hallData[0].storeHypId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="JDE Code">
                        <el-input size="small"  placeholder="" v-model="hallData[0].storeJdeCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="BU类型">
                        <el-input size="small"  placeholder="" v-model="hallData[0].buType" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="餐厅名称">
                        <el-input size="small"  placeholder="" v-model="hallData[0].storeName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="餐厅中文简称">
                        <el-input size="small"  placeholder="" v-model="hallData[0].storeChineseName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="餐厅英文简称">
                        <el-input size="small"  placeholder="" v-model="hallData[0].storeEnglishName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="品牌">
                        <el-input size="small"  placeholder="" v-model="hallData[0].brand" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="拥有方式">
                        <el-input size="small"  placeholder="" v-model="hallData[0].ownerShip" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="CBD商圈">
                        <el-input size="small"  placeholder="" v-model="hallData[0].cbdBusiness" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="财务市场">
                        <el-input size="small"  placeholder="" v-model="hallData[0].financialMarket" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="法人公司">
                        <el-input size="small"  placeholder="" v-model="hallData[0].companyName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开票单位">
                        <el-input size="small"  placeholder="" v-model="hallData[0].billingUnitName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="营运市场">
                        <el-input size="small"  placeholder="" v-model="hallData[0].operateMarket" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="开票单位99店">
                        <el-input size="small"  placeholder="" v-model="hallData[0].billingUnitNnStoreName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input size="small"  placeholder="" v-model="hallData[0].remark" type="textarea" :maxlength="200"></el-input>
                    </el-form-item>
                </div>
            </el-card>
            <el-card>
                <div slot="header">
                    <span>联系信息</span>
                </div>
                <div class="hallContent">
                    <el-form-item label="详细地址" class="address">
                        <el-row :gutter="20">
                            <el-col :span="3"><el-input size="small"  placeholder="" v-model="hallData[0].province" disabled></el-input></el-col>
                            <el-col :span="3"><el-input size="small"  placeholder="" v-model="hallData[0].city" disabled></el-input></el-col>
                            <el-col :span="6"><el-input size="small"  placeholder="" v-model="hallData[0].address" disabled></el-input></el-col>
                        </el-row>
                    </el-form-item>
                    <div v-for="(item,index) in hallData[0].showUserInfo" :key="index">
                        <el-form-item
                                :label="item.storeType | customType"
                                class="hallInfo">

                            <el-input size="small" v-model="item.userName" :disabled="true">

                            </el-input>
                            <!--<el-select-->
                            <!--size="small"-->
                            <!--:ref="item.type"-->
                            <!--v-model="item.id"-->
                            <!--remote-->
                            <!--:remote-method="remoteUserName"-->
                            <!--v-scroll="(param) => {return scrollUserName(item.type,param)}"-->
                            <!--@change="(val) => {return getUserInfo(val,index)}"-->
                            <!--filterable-->
                            <!--:disabled="true">&lt;!&ndash;-item.type === 'FM' || item.type === 'FBC' || isDetails&#45;&#45;&ndash;&gt;-->
                            <!--<el-option v-for="item in userNameOpt" :key="item.id" :label="item.userName" :value="item.id"></el-option>-->
                            <!--</el-select>-->
                        </el-form-item>
                        <el-form-item
                                label="联系电话"
                                class="hallInfo"
                                :prop="item.type === 'FM' || item.type === 'FBC' ? '' : 'showUserInfo.' + index + '.mobile'"
                                :rules="item.type === 'FM' || item.type === 'FBC' ? {} : phones">
                            <el-input size="small" v-model.trim="item.mobile" :disabled="item.type === 'FM' || item.type === 'FBC' || isDetails"></el-input>
                        </el-form-item>
                        <el-form-item
                                label="固定电话"
                                class="hallInfo"
                                :prop="item.type === 'FM' || item.type === 'FBC' ? '' : 'showUserInfo.' + index + '.phone'"
                                :rules="item.type === 'FM' || item.type === 'FBC' ? {} : phones">
                            <el-input size="small" v-model.trim="item.phone" :disabled="item.type === 'FM' || item.type === 'FBC' || isDetails"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" class="hallInfo">
                            <el-input size="small" v-model.trim="item.email||item.mail" :disabled="item.type === 'FM' || item.type === 'FBC' || isDetails" disabled></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-card>
            <el-card>
                <div slot="header"><span>营业信息</span></div>
                <div class="hallContent">
                    <div class="hallContentTitle">营业日期</div>
                    <el-form-item label="开店日期" prop="startDate">
                        <el-date-picker v-model="hallData[0].startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="isDetails"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="关店日期">
                        <el-date-picker v-model="hallData[0].endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" @change="setEndDate" :disabled="isDetails || pastEndDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item></el-form-item>
                    <hr class="hallContentHr">
                    <div class="hallContentTitle">临时停业<el-button class="temSusAdd" type="text" @click="hallAddRow" v-if="!isDetails">+新增</el-button>
                        <el-button class="temSusHistory" type="text" @click="storeTemporaryStopDateDialog = true">查看历史记录</el-button></div>
                    <el-form-item label="停业日期" class="stopDate" required></el-form-item>
                    <el-form-item label="停业原因" required></el-form-item>
                    <div v-for="(item,index) in hallData[0].addStoreTemporaryStopDates" :key="index">
                        <el-form-item   :prop="'addStoreTemporaryStopDates.'+index+'.stopDate'"
                                        :rules="{required: true, message: '请选择停业日期', trigger: 'change'}"
                                        class="stopDate">
                            <el-date-picker @change="(val) => {return getStopDate(val,index)}" value-format="yyyy-MM-dd" size="small"
                                            v-model="item.stopDate" type="daterange" range-separator="-" start-placeholder="临时停业开始日期" end-placeholder="临时停业结束日期" :disabled="isDetails"></el-date-picker>
                        </el-form-item>
                        <el-form-item  prop="stopReason" :prop="'addStoreTemporaryStopDates.'+index+'.stopReason'"
                                       :rules="{required: true, message: '请输入停业原因', trigger: 'change'}"
                        >
                            <el-select size="small" v-model="item.stopReason" :disabled="isDetails">
                                <el-option value="" label="请选择"></el-option>
                                <el-option v-for="(item,index) in stopReasonOpt" :key="index" :label="item.dictionaryEntryName" :value="item.dictionaryEntryName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-button size="small" v-if="(hallData[0].addStoreTemporaryStopDates && hallData[0].addStoreTemporaryStopDates.length>0) ||(hallData[0].storeBankDepositDates&& hallData[0].storeBankDepositDates.length >0)" icon="el-icon-minus" circle @click="hallRemoveRow(index)" :disabled="isDetails"></el-button>
                    </div>
                </div>
            </el-card>
            <el-card>
                <div slot="header"><span>存行信息</span></div>
                <div class="hallContentBank">
                    <el-tabs v-model="activeName" type="card" @tab-click="checkTab">
                        <el-tab-pane v-if="!(hallData.length > 1 && hallData[0].storageType === null)" :label="hallData.length === 1 ? '设置' : '当前'" name="first">
                            <el-button size="small" type="success" @click="changeStatus" class="c-button" v-if="$route.query.id &&saveStoreFlag">重新计算存行日</el-button>
                            <el-form-item label="请选择存行类型" prop="storageType">
                                <el-radio-group v-model="hallData[0].storageType" @change="(val) => {return getStorageType(val,0)}" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">
                                    <el-radio :label="1">自行存行</el-radio>
                                    <el-radio :label="2">押运公司</el-radio>
                                    <el-radio :label="3">房东代收</el-radio>
                                </el-radio-group>
                            </el-form-item><br>
                            <el-form-item v-if="hallData[0].storageType === 1" class="saveRate">
                                <div class="fixedDate">
                                    <el-radio v-model="hallData[0].storageFrequencyType" :label="1" @change="(val)=>{clearWeekendStorageDate(val,0);}"
                                              class="bankRadio" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">固定天数</el-radio>
                                    <div class="saveBox" :class="hallData[0].storageFrequencyType === 1 ? 'saveBoxOn' : ''">
                                        <p>
                                            <span class="contentTitle">间隔天数</span>
                                            <el-form-item class="interval"  >
                                                <el-input v-if="hallData[0].storageFrequencyType === 1" v-model="hallData[0].storageFrequency" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"><span slot="suffix">天</span></el-input>
                                                <el-input v-else v-model="storageFrequency" disabled><span slot="suffix">天</span></el-input>
                                            </el-form-item>
                                        </p>
                                        <p>
                                            <span class="contentTitle">周末存行</span>
                                            <el-form-item class="interval">
                                                <el-radio-group v-model="hallData[0].weekendStorage" :disabled="hallData[0].storageFrequencyType !== 1 || isDetails || (hallData.length === 2 && hallData[0].storageType !== null)" @change="(val)=>{weekendIsStorage(val,0)}">
                                                    <el-radio :label="true">是</el-radio>
                                                    <el-radio :label="false">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </p>
                                        <p v-if="hallData[0].weekendStorage === false">
                                            <span class="contentTitle"></span>
                                            <el-form-item class="interval"   >
                                                <el-radio-group v-if="hallData[0].storageFrequencyType === 1" v-model="hallData[0].weekendStorageDate" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">
                                                    <el-radio :label="1">周六不存</el-radio>
                                                    <el-radio :label="2">周日不存</el-radio>
                                                    <el-radio :label="3" class="margin-reset">全部不存</el-radio>
                                                </el-radio-group>
                                                <el-radio-group v-else v-model="weekendStorageDate" disabled>
                                                    <el-radio :label="1">周六不存</el-radio>
                                                    <el-radio :label="2">周日不存</el-radio>
                                                    <el-radio :label="3" class="margin-reset">全部不存</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </p>
                                        <p>
                                            <span class="contentTitle">节假日存行</span>
                                            <el-form-item class="interval">
                                                <el-radio-group v-if="hallData[0].storageFrequencyType === 1"
                                                                v-model="hallData[0].holidayStorage" :disabled="hallData[0].storageFrequencyType !== 1 || isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">
                                                    <el-radio :label="true">是</el-radio>
                                                    <el-radio :label="false">否</el-radio>
                                                </el-radio-group>
                                                <el-radio-group v-else v-model="holidayStorage" disabled>
                                                    <el-radio :label="true">是</el-radio>
                                                    <el-radio :label="false">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </p>
                                    </div>
                                    <br>
                                    <br>
                                    <el-radio v-model="hallData[0].storageFrequencyType" :label="2" @change="(val)=>{clearWeekendStorageDate(val,0);}" class="bankRadio" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">固定星期几</el-radio>
                                    <div class="saveBox days" :class="hallData[0].storageFrequencyType === 2 ? 'saveBoxOn' : ''">
                                        <p>
                                            <span class="contentTitle">星期几</span>
                                            <el-form-item class="interval  days" >
                                                <!--<el-radio-group v-if="hallData[0].storageFrequencyType === 2" v-model="storageFrequencyArr1" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">-->
                                                <!--<el-radio :label='1'>一</el-radio>-->
                                                <!--<el-radio :label='2'>二</el-radio>-->
                                                <!--<el-radio :label='3'>三</el-radio><br>-->
                                                <!--<el-radio :label='4'>四</el-radio>-->
                                                <!--<el-radio :label='5'>五</el-radio>-->
                                                <!--<el-radio :label='6'>六</el-radio>-->
                                                <!--<el-radio :label='7'>日</el-radio>-->
                                                <!--</el-radio-group>-->
                                                <el-checkbox-group v-model="storageFrequencyArr1"
                                                                   v-if="hallData[0].storageFrequencyType === 2"
                                                                   :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"
                                                                   :min="1"
                                                                   :max="2"
                                                >
                                                    <el-checkbox v-for="(day,index) in days" :label="index+1" :key="index" :class="index === 3?'line':''">{{day}}</el-checkbox>
                                                    <!--<el-checkbox :label='1' :key="1">一</el-checkbox>-->
                                                    <!--<el-checkbox :label='2' :key="2">二</el-checkbox>-->
                                                    <!--<el-checkbox :label='3'>三</el-checkbox><br>-->
                                                    <!--<el-checkbox :label='4'>四</el-checkbox>-->
                                                    <!--<el-checkbox :label='5'>五</el-checkbox>-->
                                                    <!--<el-checkbox :label='6'>六</el-checkbox>-->
                                                    <!--<el-checkbox :label='7'>日</el-checkbox>-->
                                                </el-checkbox-group>
                                                <el-radio-group v-else v-model="storageFrequency" disabled>
                                                    <el-radio :label='1'>一</el-radio>
                                                    <el-radio :label='2'>二</el-radio>
                                                    <el-radio :label='3'>三</el-radio><br>
                                                    <el-radio :label='4'>四</el-radio>
                                                    <el-radio :label='5'>五</el-radio>
                                                    <el-radio :label='6'>六</el-radio>
                                                    <el-radio :label='7'>日</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </p>
                                        <p>
                                            <span class="contentTitle" >间隔周数</span>
                                            <el-form-item class="interval" >
                                                <!--<el-input v-if="hallData[0].storageFrequencyType === 2" v-model="hallData[0].weekendStorageDate" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"><span slot="suffix">周</span></el-input>-->
                                                <!--<el-input v-else v-model="weekendStorageDate" disabled><span slot="suffix">周</span></el-input>-->
                                                <el-select v-if="hallData[0].storageFrequencyType === 2" v-model="hallData[0].weekendStorageDate"
                                                           :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)" style="width:120px;height:36px;">
                                                    <el-option :value="1" label="一周"></el-option>
                                                    <el-option :value="2" label="两周"></el-option>
                                                    <el-option :value="3" label="三周" ></el-option>
                                                    <el-option :value="4" label="四周"></el-option>
                                                </el-select>
                                                <el-select v-else v-model="weekendStorageDate" disabled style="width:120px;height:36px;">
                                                    <el-option :value="1" label="一周"></el-option>
                                                    <el-option :value="2" label="两周"></el-option>
                                                    <el-option :value="3" label="三周" ></el-option>
                                                    <el-option :value="4" label="四周"></el-option>
                                                </el-select>

                                            </el-form-item>
                                        </p>
                                        <p>
                                            <span class="contentTitle">节假日存行</span>
                                            <el-form-item class="interval"  >
                                                <el-radio-group v-if="hallData[0].storageFrequencyType === 2" v-model="hallData[0].holidayStorage"
                                                                :disabled="hallData[0].storageFrequencyType !== 2 || isDetails || (hallData.length === 2 && hallData[0].storageType !== null)" key="1-holiday-0">
                                                    <el-radio :label="true">是</el-radio>
                                                    <el-radio :label="false">否</el-radio>
                                                </el-radio-group>
                                                <el-radio-group v-else v-model="holidayStorage" disabled key="2-holiday-0">
                                                    <el-radio :label="true">是</el-radio>
                                                    <el-radio :label="false">否</el-radio>
                                                </el-radio-group>
                                            </el-form-item>
                                        </p>
                                    </div>
                                </div>
                                <!-- 日历 -->
                                <!--<vue-calendar-swiper-->
                                        <!--ref="calendar"-->
                                        <!--:events="calendar.events"-->
                                        <!--:lunar="calendar.lunar"-->
                                        <!--:value="calendar.value"-->
                                        <!--:values="calendar.values"-->
                                        <!--:weeks="calendar.weeks"-->
                                        <!--:months="calendar.months"-->
                                        <!--:totalMonth="calendar.totalMonth"-->
                                        <!--@select="calendar.select"-->
                                        <!--@selectMonth="calendar.selectMonth"-->
                                        <!--@selectYear="calendar.selectYear"-->
                                        <!--class="contentCalendar">-->
                                <!--</vue-calendar-swiper>-->
                                <div class="calendar-dialog-body">
                                    <calendar ref="calendar" :isToday="true" :range="calendar.range" :zero="calendar.zero" :multi="calendar.multi" :lunar="calendar.lunar" :value="calendar.value" @select="calendar.select"></calendar>
                                </div>
                                <!-- 日历 -->
                            </el-form-item>
                            <el-form-item v-if="hallData[0].storageType === 2" class="saveRate saveBox saveBoxOn" :class="hallData[0].storageType === 2 ? 'escort' : ''">
                                <!--<el-input ></el-input>-->
                                <!--<el-select size="small"  placeholder="请输入押运公司名称" v-model="hallData[0].landlordJdeCode" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">-->
                                <!--<el-option v-for="(item,index) in customers" :key="index" :value="item.customerName" :label="item.customerNumber"></el-option>-->
                                <!--</el-select>-->
                                <remoteSelect
                                        placeholder="请选择押运公司名称"
                                        :remoteFn="'getCustomerList'"
                                        :optLabel="'customerName'"
                                        :optValue="'customerNumber'"
                                        @getChangeData="getClient"
                                        :type="3"
                                        ref="clientRef1"
                                        :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"
                                ></remoteSelect>
                            </el-form-item>
                            <el-form-item v-if="hallData[0].storageType === 3" class="saveRate saveBox saveBoxOn"  :class="hallData[0].storageType === 3 ? 'landlord' : ''">
                                <!--<el-input size="small"  placeholder="请输入房东名称" v-model="hallData[0].landlordJdeCode" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"></el-input>-->
                                <!--<el-select size="small"  placeholder="请输入房东名称" v-model="hallData[0].landlordJdeCode" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)">-->
                                <!--<el-option v-for="(item,index) in customers" :key="index" :value="item.customerName" :label="item.customerNumber"></el-option>-->
                                <!--</el-select>-->
                                <remoteSelect
                                        placeholder="请输入房东名称"
                                        :remoteFn="'getCustomerList'"
                                        :optLabel="'customerName'"
                                        :optValue="'customerNumber'"
                                        @getChangeData="getClient"
                                        :type="3"
                                        :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"
                                        ref="clientRef1"
                                ></remoteSelect>
                            </el-form-item>
                            <el-form-item label="生效日期"
                                          :prop="(hallData[0].endDate && hallData[0].endDate <= currentTime) ? '' : 'depositStartDate'"
                                          v-if="hallData[0].storageType !== null">
                                <el-date-picker v-model="hallData[0].depositStartDate" @change="(val) => {return verifyDepositStartDate(val,0)}" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="isDetails || editDepositDate || (hallData.length === 2 && hallData[0].storageType !== null)"></el-date-picker>
                            </el-form-item>
                            <div v-if="hallData[0].storageType === 1 || hallData[0].storageType === 2 " class="hallContentTitle">银行信息<el-button class="temSusAdd" type="text" @click="bankAddRow(0)" >+新增</el-button></div><!--v-if="!isDetails && !(hallData.length === 2 && hallData[0].storageType !== null)"--->
                            <div v-if="hallData[0].storageType === 1 || hallData[0].storageType === 2" v-for="(bankJDE,index) in hallData[0].storeBankList" :key="index">
                                <el-form-item
                                        label="银行JDE编号"
                                        class="bankInfo"
                                        :prop="'storeBankList.' + index + '.bankJdeCode'"
                                        :rules="{ required: true, message: '银行JDE编号不能为空', trigger: 'change'}">
                                    <el-select size="small" v-model="bankJDE.bankJdeCode" placeholder="请选择" @change="getBankNameAndAccount(0,index)" filterable
                                    ><!---:disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"--->
                                        <el-option v-for="item in JDEBankOpt" :key="item.jdeAccount" :label="item.jdeAccount" :value="item.jdeAccount"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="银行账号" class="bankInfo">
                                    <el-input size="small" v-model.trim="bankJDE.depositBankAccount" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="开户行" class="bankInfo">
                                    <el-input size="small" v-model.trim="bankJDE.depositBankName" disabled></el-input>
                                </el-form-item>
                                <el-form-item class="bankInfo">
                                    <el-button size="small" v-if="hallData[0].storeBankList.length > 1" icon="el-icon-minus" circle @click="bankRemoveRow(index,0)" ></el-button><!--:disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"--->
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <el-checkbox v-model="bankJDE.defaultValue" @change="makeDefault(index,0)" >{{bankJDE.defaultValue ? '默认' : '设为默认'}}</el-checkbox>
                                </el-form-item>
                            </div>
                            <el-form-item v-if="hallData[0].storageType === 1" label="现金核对卡号" class="bankInfo">
                                <el-input size="small" v-model.trim="hallData[0].caiZhiCardNo" maxlength="19" :disabled="isDetails || (hallData.length === 2 && hallData[0].storageType !== null)"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane v-if="hallData.length > 1" label="未来" name="second">
                            <!--<el-form   :model="hallData[1]" style="display: inline-block;margin-bottom:5px" ref="hallData1">-->
                                <el-button size="small" type="success" class="c-button clearButton" @click="clearHallContent">清空</el-button>
                                <el-form-item label="请选择存行类型">
                                    <el-radio-group v-model="hallData[1].storageType" @change="(val) => {return getStorageType(val,1)}" :disabled="isDetails">
                                        <el-radio :label="1">自行存行</el-radio>
                                        <el-radio :label="2" v-if="hallData.length > 1 && hallData[0].storageType !== 2">押运公司</el-radio>
                                        <el-radio :label="3" v-if="hallData.length > 1 && hallData[0].storageType !== 3">房东代收</el-radio>
                                    </el-radio-group>
                                </el-form-item><br>
                                <el-form-item v-if="hallData[1].storageType === 1" class="saveRate">
                                    <div class="fixedDate">
                                        <el-radio v-model="hallData[1].storageFrequencyType" :label="1" @change="(val)=>{clearWeekendStorageDate(val,1);}" class="bankRadio" :disabled="isDetails">固定天数</el-radio>
                                        <div class="saveBox" :class="hallData[1].storageFrequencyType === 1 ? 'saveBoxOn' : ''">
                                            <p>
                                                <span class="contentTitle">间隔天数</span>
                                                <el-form-item class="interval">
                                                    <el-input v-if="hallData[1].storageFrequencyType === 1" v-model="hallData[1].storageFrequency" :disabled="isDetails"><span slot="suffix">天</span></el-input>
                                                    <el-input v-else v-model="storageFrequency" disabled><span slot="suffix">天</span></el-input>
                                                </el-form-item>
                                            </p>
                                            <p>
                                                <span class="contentTitle">周末存行</span>
                                                <el-form-item class="interval" >
                                                    <el-radio-group v-model="hallData[1].weekendStorage" :disabled="hallData[1].storageFrequencyType !== 1 || isDetails" @change="(val)=>{weekendIsStorage(val,1)}">
                                                        <el-radio :label="true">是</el-radio>
                                                        <el-radio :label="false">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                            <p v-if="hallData[1].weekendStorage === false">
                                                <span class="contentTitle"></span>
                                                <el-form-item class="interval" >
                                                    <el-radio-group v-if="hallData[1].storageFrequencyType === 1" v-model="hallData[1].weekendStorageDate" :disabled="isDetails" >
                                                        <el-radio :label="1">周六不存</el-radio>
                                                        <el-radio :label="2">周日不存</el-radio>
                                                        <el-radio :label="3" class="margin-reset">全部不存</el-radio>
                                                    </el-radio-group>
                                                    <el-radio-group v-else v-model="weekendStorageDate" disabled>
                                                        <el-radio :label="1">周六不存</el-radio>
                                                        <el-radio :label="2">周日不存</el-radio>
                                                        <el-radio :label="3" class="margin-reset">全部不存</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                            <p>
                                                <span class="contentTitle">节假日存行</span>
                                                <el-form-item class="interval"
                                                >
                                                    <el-radio-group v-if="hallData[1].storageFrequencyType === 1"
                                                                    v-model="hallData[1].holidayStorage" :disabled="hallData[1].storageFrequencyType !== 1 || isDetails" key="1-holiday-1">
                                                        <el-radio :label="true">是</el-radio>
                                                        <el-radio :label="false">否</el-radio>
                                                    </el-radio-group>
                                                    <el-radio-group v-else v-model="holidayStorage" disabled key="2-holiday-1">
                                                        <el-radio :label="true">是</el-radio>
                                                        <el-radio :label="false">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                        <br>
                                        <br>
                                        <el-radio v-model="hallData[1].storageFrequencyType" :label="2" @change="(val)=>{clearWeekendStorageDate(val,1);}" class="bankRadio" :disabled="isDetails">固定星期几</el-radio>
                                        <div class="saveBox days" :class="hallData[1].storageFrequencyType === 2 ? 'saveBoxOn' : ''">
                                            <p>
                                                <span class="contentTitle">星期几</span>
                                                <el-form-item class="interval" >
                                                    <el-checkbox-group v-model="storageFrequencyArr2"
                                                                       v-if="hallData[1].storageFrequencyType === 2"
                                                                       :disabled="isDetails"
                                                                       :min="1"
                                                                       :max="2"
                                                    >
                                                        <el-checkbox v-for="(day,index) in days" :label="index+1" :key="index" :class="index === 3?'line':''">{{day}}</el-checkbox>
                                                        <!--<el-checkbox :label='1' :key="1">一</el-checkbox>-->
                                                        <!--<el-checkbox :label='2' :key="2">二</el-checkbox>-->
                                                        <!--<el-checkbox :label='3'>三</el-checkbox><br>-->
                                                        <!--<el-checkbox :label='4'>四</el-checkbox>-->
                                                        <!--<el-checkbox :label='5'>五</el-checkbox>-->
                                                        <!--<el-checkbox :label='6'>六</el-checkbox>-->
                                                        <!--<el-checkbox :label='7'>日</el-checkbox>-->
                                                    </el-checkbox-group>
                                                    <el-radio-group v-else v-model="storageFrequency" disabled>
                                                        <el-radio :label='1'>一</el-radio>
                                                        <el-radio :label='2'>二</el-radio>
                                                        <el-radio :label='3'>三</el-radio><br>
                                                        <el-radio :label='4'>四</el-radio>
                                                        <el-radio :label='5'>五</el-radio>
                                                        <el-radio :label='6'>六</el-radio>
                                                        <el-radio :label='7'>日</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                            <p>
                                                <span class="contentTitle">间隔周数</span>
                                                <!--<el-form   :model="hallData[1]" style="display: inline-block;margin-bottom:5px">-->
                                                <el-form-item class="interval"
                                                >
                                                    <!--<el-input v-if="hallData[1].storageFrequencyType === 2" v-model="hallData[1].weekendStorageDate" :disabled="isDetails"><span slot="suffix">周</span></el-input>-->
                                                    <!--<el-input v-else v-model="weekendStorageDate" disabled><span slot="suffix">周</span></el-input>-->
                                                    <el-select v-if="hallData[1].storageFrequencyType === 2" v-model="hallData[1].weekendStorageDate" :disabled="isDetails" size="small" style="width:120px;height:36px;">
                                                        <el-option :value="1" label="一周"></el-option>
                                                        <el-option :value="2" label="两周"></el-option>
                                                        <el-option :value="3" label="三周" ></el-option>
                                                        <el-option :value="4" label="四周"></el-option>
                                                    </el-select>
                                                    <el-select v-else v-model="weekendStorageDate" disabled size="small" style="width:120px;height:36px;">
                                                        <el-option :value="1" label="一周"></el-option>
                                                        <el-option :value="2" label="两周"></el-option>
                                                        <el-option :value="3" label="三周" ></el-option>
                                                        <el-option :value="4" label="四周"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                                <!--</el-form>-->
                                            </p>
                                            <p>
                                                <span class="contentTitle">节假日存行</span>
                                                <el-form-item class="interval" >
                                                    <el-radio-group v-if="hallData[1].storageFrequencyType === 2"
                                                                    v-model="hallData[1].holidayStorage" :disabled="hallData[1].storageFrequencyType !== 2 || isDetails" :key="1">
                                                        <el-radio :label="true">是</el-radio>
                                                        <el-radio :label="false">否</el-radio>
                                                    </el-radio-group>
                                                    <el-radio-group v-else v-model="holidayStorage" disabled :key="2">
                                                        <el-radio :label="true">是</el-radio>
                                                        <el-radio :label="false">否</el-radio>
                                                    </el-radio-group>
                                                </el-form-item>
                                            </p>
                                        </div>
                                    </div>
                                    <!-- 日历 -->
                                    <div class="calendar-dialog-body">
                                        <calendar ref="calendar1" :range="calendar1.range" :zero="calendar1.zero" :multi="calendar1.multi" :lunar="calendar1.lunar" :value="calendar1.value" @select="calendar1.select"></calendar>
                                    </div>
                                    <!--<vue-calendar-swiper-->
                                            <!--ref="calendar1"-->
                                            <!--:events="calendar1.events"-->
                                            <!--:lunar="calendar1.lunar"-->
                                            <!--:value="calendar1.value"-->
                                            <!--:values="calendar1.values"-->
                                            <!--:weeks="calendar1.weeks"-->
                                            <!--:months="calendar1.months"-->
                                            <!--:totalMonth="calendar1.totalMonth"-->
                                            <!--@select="calendar1.select"-->
                                            <!--@selectMonth="calendar1.selectMonth"-->
                                            <!--@selectYear="calendar1.selectYear"-->
                                            <!--class="contentCalendar">-->
                                    <!--</vue-calendar-swiper>-->
                                    <!-- 日历 -->
                                </el-form-item>
                                <el-form-item v-if="hallData[1].storageType === 2" class="saveRate saveBox saveBoxOn" :class="hallData[1].storageType === 2 ? 'escort' : ''">
                                    <!--<el-input size="small"  placeholder="请输入押运公司名称" v-model="hallData[1].landlordJdeCode" :disabled="isDetails"></el-input>-->
                                    <!--<el-select size="small"  placeholder="请输入押运公司名称" v-model="hallData[1].landlordJdeCode" :disabled="isDetails ">-->
                                    <!--<el-option v-for="(item,index) in customers" :key="index" :value="item.customerName" :label="item.customerNumber"></el-option>-->
                                    <!--</el-select>-->
                                    <remoteSelect
                                            placeholder="请输入押运公司名称"
                                            :remoteFn="'getCustomerList'"
                                            :optLabel="'customerName'"
                                            :optValue="'customerNumber'"
                                            :paramFromParentVal="hallData[1].landlordJdeCode"
                                            @getChangeData="getClient2"
                                            :type="3"
                                            ref="clientRef2"
                                    ></remoteSelect>
                                </el-form-item>
                                <el-form-item v-if="hallData[1].storageType === 3" class="saveRate saveBox saveBoxOn"  :class="hallData[1].storageType === 3 ? 'landlord' : ''">
                                    <!--<el-input size="small"  placeholder="请输入房东名称" v-model="hallData[1].landlordJdeCode" :disabled="isDetails"></el-input>-->
                                    <!--<el-select size="small"  placeholder="请输入房东名称" v-model="hallData[1].landlordJdeCode" :disabled="isDetails ">-->
                                    <!--<el-option v-for="(item,index) in customers" :key="index" :value="item.customerName" :label="item.customerNumber"></el-option>-->
                                    <!--</el-select>-->
                                    <remoteSelect
                                            placeholder="请输入房东名称"
                                            :remoteFn="'getCustomerList'"
                                            :optLabel="'customerName'"
                                            :optValue="'customerNumber'"
                                            :paramFromParentVal="hallData[1].landlordJdeCode"
                                            @getChangeData="getClient2"
                                            :type="3"
                                            ref="clientRef2"
                                    ></remoteSelect>
                                </el-form-item>
                                <el-form
                                ref="hallData1"
                                :model="hallData[1]">
                                    <el-form-item label="生效日期" v-if="hallData[1].storageType !== null" prop="depositStartDate"
                                                  :rules="(hallData[0].endDate && hallData[0].endDate <= currentTime) ? {} : {required: true, message: '请选择', trigger: 'change'}">
                                        <el-date-picker v-model="hallData[1].depositStartDate" @change="(val) => {return verifyDepositStartDate(val,1)}" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" :disabled="editDepositDate"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                            <div v-if="hallData[1].storageType !== 3" class="hallContentTitle">银行信息<el-button class="temSusAdd" type="text" @click="bankAddRow(1)" >+新增</el-button></div>
                            <div v-if="hallData[1].storageType === 1 || hallData[1].storageType === 2" v-for="(bankJDE,index) in hallData[1].storeBankList" :key="index">
                                <el-form-item label="银行JDE编号" class="bankInfo">
                                    <el-select size="small" v-model="bankJDE.bankJdeCode" placeholder="请选择" @change="getBankNameAndAccount(1,index)"
                                               filterable :disabled="isDetails"><!---:disabled="isDetails"--->
                                        <el-option v-for="item in JDEBankOpt" :key="item.jdeAccount" :label="item.jdeAccount" :value="item.jdeAccount"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="银行账号" class="bankInfo">
                                    <el-input size="small" v-model.trim="bankJDE.depositBankAccount" disabled ></el-input>
                                </el-form-item>
                                <el-form-item label="开户行" class="bankInfo">
                                    <el-input size="small" v-model.trim="bankJDE.depositBankName" disabled ></el-input>
                                </el-form-item>
                                <el-form-item class="bankInfo">
                                    <el-button size="small" v-if="hallData[1].storeBankList.length > 1" icon="el-icon-minus" circle @click="bankRemoveRow(index,1)" ></el-button><!--同上--->
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <el-checkbox v-model="bankJDE.defaultValue" @change="makeDefault(index,1)" :disabled="isDetails">{{bankJDE.defaultValue ? '默认' : '设为默认'}}</el-checkbox>
                                </el-form-item>
                            </div>
                            <el-form-item v-if="hallData[1].storageType === 1" label="现金核对卡号" class="bankInfo">
                                <el-input size="small" v-model.trim="hallData[1].caiZhiCardNo" maxlength="19" :disabled="isDetails"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-card>
        </div>
        <div class="viewFormContent">
            <el-form-item class="hall-form-item" label="JDE同步时间">
                <el-input size="small" placeholder="" v-model="hallData[0].jdeModifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item class="hall-form-item" label="FSC更新时间">
                <el-input size="small" placeholder="" v-model="hallData[0].modifiedTime" disabled></el-input>
            </el-form-item>
            <el-form-item class="hall-form-item" label="FSC更新人">
                <el-input size="small" placeholder="" v-model="hallData[0].fscUserName" disabled></el-input>
            </el-form-item>
        </div>
        <div class="buttomButton" v-if="!isDetails">
            <el-form-item>
                <el-button size="small" type="success" plain @click='cancel' class="c-button">取消</el-button>
                <el-button size="small" type="success" @click="save('hallData')" class="c-button">保存</el-button>
            </el-form-item>
        </div>
        <!-- 临时停业历史记录 -->
        <el-dialog title="历史记录" :visible.sync="storeTemporaryStopDateDialog">
            <el-table :data="storeTemporaryStopDatesLog" border>
                <el-table-column property="stopStartDate" label="开始日期"></el-table-column>
                <el-table-column property="stopEndDate" label="结束日期"></el-table-column>
                <el-table-column property="stopReason" label="停业原因"></el-table-column>
            </el-table>
        </el-dialog>
        <!-- 临时停业历史记录 -->
    </el-form>
</template>

<script>
    import ip from '../../model/api'
    import scroll from '@/directives/index'
    import remoteSelect from '@/components/common/remoteSelect'
    import calendar from '@/components/common/calendar/calendar.vue'
    const addDate = {
        stopStartDate:null,
        stopEndDate:null,
        stopDate:null,
        stopReason:''
    };
    const bankJDE = {
        bankJdeCode:'',
        depositBankAccount:'',
        depositBankName:'',
        defaultValue:false
    };
    export default {
        name: "hallEdit",
        directives: { scroll },//引入 滚动指令
        data(){
            var phone = (rule,value,callback) => {
                if(!/^[0-9\-]+$/.test(value) && !this.common.isNullString(value)){
                    callback(new Error('只能输入数字和-'));
                }else{
                    callback()
                }
            };
            return{
                id:'',
                hallData:[{addStoreTemporaryStopDates:[]}],
                rules:{
                    startDate:{required: true, message: '请选择开店日期', trigger: 'change'},
                    // stopDate:{required: true, message: '请选择停业日期', trigger: 'change'},
                    stopReason:{required: true, message: '请填写停业原因', trigger: 'blur change'},
                    storageType:{required: true, message: '请选择', trigger: 'change'},
                    depositStartDate:{required: true, message: '请选择', trigger: 'change'},
                },
                module:'主档管理',
                subModule:'餐厅主档',
                isDetails:false,
                //临时停业历史记录
                storeTemporaryStopDateDialog:false,
                storeTemporaryStopDatesLog:[],
                // addStoreTemporaryStopDates:[],
                //存行信息
                JDEBankOpt: [],
                depositBankAccount:'',
                depositBankName:'',
                //存行设置
                // customerNameOpt:[],
                weekendStorageDate:'',
                storageFrequency:'',
                storageFrequencyArr1:[],
                storageFrequencyArr2:[],
                holidayStorage:'',
                //联系信息
                // contactType:['RGM','AM','DM','OM','MM','FBC','FM'],
                userNameOpt:[],
                //营业信息
                startDate:'',
                endDate:'',
                //临时停业原因
                stopReasonOpt:[],

                //限制
                phones:{ validator: phone, trigger: ['blur','change'] },

                //当前时间
                currentTime:null,
                pastEndDate:false,

                userNameSize:10,
                editDepositDate:false,
                activeName:'first',

                //--------------------日历-----------------------
                year:'',
                months:[],
                selectMonth:1,
                calendar: {
                    lunar: false,//显示农历
                    //value:[2019,1,23],//默认日期，如果没有设置就默认今天
                    value: [],//有哪些时间点是被选中的
                    // weeks: ['日', '一', '二', '三', '四', '五', '六'],
                    // months: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
                    // totalMonth: 14,//一共显示几个月
                    display:"2017/02/16,2021/02/16",
                    zero:true,
                    multi:true,
                    select(val) {
                    },
                    // selectMonth(month, year) {
                    // },
                    // selectYear(year) {
                    // }
                },
                calendar1: {
                    lunar: false,//显示农历
                    //value:[2019,1,23],//默认日期，如果没有设置就默认今天
                    value: [],//有哪些时间点是被选中的
                    // weeks: ['日', '一', '二', '三', '四', '五', '六'],
                    // months: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
                    display:"2017/02/16,2021/02/16",
                    zero:true,
                    multi:true,
                    // totalMonth: 14,//一共显示几个月
                    select(val) {
                    },
                    // selectMonth(month, year) {
                    // },
                    // selectYear(year) {
                    // }
                },
                days:[ '一', '二', '三', '四', '五', '六','日'],
                saveStoreFlag:false
                // customers:[]
            }
        },
        components:{
            remoteSelect,
            calendar
        },
        methods:{
            cancel(){
                this.common.deleteTag(this.$route,this,'hall');
            },
            hallAddRow(){
                this.hallData[0].addStoreTemporaryStopDates.push(Object.assign({},addDate))
            },
            hallRemoveRow(index){
                this.hallData[0].addStoreTemporaryStopDates.splice(index,1)
            },
            bankAddRow(num){
                if(!this.hallData[num].storeBankList){
                    this.$set(this.hallData[num],'storeBankList',[]);
                    this.hallData[num].storeBankList.push(Object.assign({},bankJDE))
                }else{
                    this.hallData[num].storeBankList.push(Object.assign({},bankJDE))
                }
            },
            bankRemoveRow(index,num){
                this.hallData[num].storeBankList.splice(index,1)
            },
            getHallData(id){
                let that = this;
                ip.getStoreDetailById(id,res => {
                    that.currentTime = this.common.getNowFormatDate();
                    that.hallData = [];
                    if(res.data && res.data.length > 1){
                        res.data.forEach(data1 => {if(data1.storageStatus === 1){that.hallData.push(JSON.parse(JSON.stringify(data1)))}});
                        res.data.forEach(data2 => {if(data2.storageStatus === 2){that.hallData.push(JSON.parse(JSON.stringify(data2)))}});
                        if(that.hallData[0].storageType === null){that.activeName = 'second'}
                    }else{
                        if(res.data[0].storageType!==null){
                            //再次设置
                            that.hallData.push(JSON.parse(JSON.stringify(res.data[0])));
                            that.hallData.push(JSON.parse(JSON.stringify(res.data[0])));
                            //未来的设置
                            that.hallData[1].storageStatus = 2;
                            that.hallData[1].storageType = null;
                            that.hallData[1].storageFrequencyType = null;
                            that.hallData[1].storageFrequency = [];
                            that.hallData[1].storageFrequency = null;
                            that.hallData[1].weekendStorage = null;
                            that.hallData[1].weekendStorageDate = null;
                            that.hallData[1].holidayStorage = null;
                            that.hallData[1].landlordJdeCode = null;
                            that.hallData[1].depositStartDate = null;
                            that.hallData[1].storeBankList = [Object.assign({},bankJDE)];
                            that.hallData[1].caiZhiCardNo = null;
                        }else{
                            //第一次设置
                            that.hallData.push(JSON.parse(JSON.stringify(res.data[0])))
                        }
                    }
                    //处理临时停业
                    that.$set(that.hallData[0],'addStoreTemporaryStopDates',[]);
                    if(that.hallData[0].storeTemporaryStopDates){
                        that.hallData[0].storeTemporaryStopDates.forEach(item => {
                            if(item.stopEndDate < that.currentTime){
                                that.storeTemporaryStopDatesLog.push(item)
                            }else{
                                that.$set(item,'stopDate',[item.stopStartDate,item.stopEndDate]);

                                that.hallData[0].addStoreTemporaryStopDates.push(item)
                            }
                        });
                        // if(that.hallData[0].addStoreTemporaryStopDates.length < 1){
                        //     that.hallData[0].addStoreTemporaryStopDates.push(Object.assign({},addDate))
                        // }
                    }else{
                        that.hallData[0].storeTemporaryStopDates = [];
                        // that.hallData[0].addStoreTemporaryStopDates.push(Object.assign({},addDate))
                    }
                    //处理联系信息
                    if(!this.hallData[0].userInfo || this.hallData[0].userInfo .length === 0){
                        this.hallData[0].userInfo=[{},{}];
                    }
                    let  userInAndPsCustom = this.hallData[0].psCustomers.concat(this.hallData[0].userInfo);
                    userInAndPsCustom[5].storeType = 6;
                    userInAndPsCustom[6].storeType = 7;
                    that.$set(that.hallData[0],'showUserInfo',userInAndPsCustom);
                    // that.contactType.forEach(item => {
                    //     that.hallData[0].showUserInfo.push({type:item,info:{}});
                    // });
                    //  userInAndPsCustom.map((item,index)=>{
                    //      let obj = {};
                    //      return { type }
                    //  })
                    // if(that.hallData[0].userInfo){
                    //     that.hallData[0].userInfo.forEach(item => {
                    //         let outRange = false;
                    //         that.userNameOpt.forEach(item1 => {if(item.psId === item1.psId){outRange = true}});
                    //         if(!outRange){that.userNameOpt.push(item)}
                    //     })
                    // }
                    // if(that.hallData[0].userInfo){
                    //     this.handleUserInfo();
                    // }
                    //处理自行存行
                    ;
                    if(that.hallData[0].storeBankDepositDates){
                        that.hallData[0].storeBankDepositDates.forEach(item => {
                            that.calendar.value.push(item.depositDate.split('-').map(Number))
                        });
                        // that.calendar.value = [["2019","12","30"]]
                        // that.calendar.value = [that.hallData[0].storeBankDepositDates[that.hallData[0].storeBankDepositDates.length-1].depositDate.split('-'),that.hallData[0].storeBankDepositDates[0].depositDate.split('-')];
                        // that.calendar.value =  that.hallData[0].storeBankDepositDates[that.hallData[0].storeBankDepositDates.length-1].depositDate.split('-')
                    }
                    if(that.hallData.length > 1 && that.hallData[1].storeBankDepositDates){
                        that.hallData[1].storeBankDepositDates.forEach(item => {
                            that.calendar1.value.push(item.depositDate.split('-').map(Number))
                        });
                        // that.calendar1.value = [that.hallData[1].storeBankDepositDates[that.hallData[1].storeBankDepositDates.length-1].depositDate.split('-'),that.hallData[1].storeBankDepositDates[0].depositDate.split('-')];
                        // that.calendar1.value =  that.hallData[1].storeBankDepositDates[that.hallData[1].storeBankDepositDates.length-1].depositDate.split('-')
                    }
                    that.hallData.forEach((item,index)=>{
                        if(item.storageFrequencyType ){
                            if(item.storageFrequency.indexOf(',') !== -1){
                                if(index === 0){
                                    that.storageFrequencyArr1 = _.map(item.storageFrequency.split(','), _.parseInt)
                                }else{
                                    that.storageFrequencyArr2 = _.map(item.storageFrequency.split(','), _.parseInt)
                                }
                            }else{
                                if(index === 0){
                                    that.storageFrequencyArr1 = [parseInt(item.storageFrequency)]
                                }else{
                                    that.storageFrequencyArr2 = [parseInt(item.storageFrequency)]
                                }
                            }
                        }
                    });
                    //处理营业日期
                    if(that.hallData[0].startDate === '0-00-00'){that.hallData[0].startDate = null}
                    if(that.hallData[0].endDate === '0-00-00'){
                        that.hallData[0].endDate = null
                    }else{
                        that.hallData[0].endDate < that.currentTime ? that.pastEndDate = true : that.pastEndDate = false
                    }
                    //处理生效日期
                    (that.hallData[0].endDate && that.hallData[0].endDate <= that.currentTime) ? that.editDepositDate = true : that.editDepositDate = false;
                    //处理银行信息
                    if(!that.hallData[0].storeBankList){
                        that.hallData[0].storeBankList = [Object.assign({},bankJDE)]
                    }

                    if(that.hallData[1]&&that.hallData[1].storageType ===  null && that.hallData[0].storeBankList && that.hallData[0].storeBankList.length>0){//未来的银行信息等于当前的银行信息
                        that.hallData[1].storeBankList = JSON.parse(JSON.stringify(that.hallData[0].storeBankList))//.map(x=>{ x.id=null})
                        that.hallData[1].storeBankList.forEach(x=>{
                            x.id = null ;
                        })
                    }
                    let condition = [
                        // {
                        //     name:'companyId',
                        //     value:that.hallData[0].companyCode
                        // },
                        {
                            name:'brandId',
                            value:that.hallData[0].brandId||''
                        }
                    ];
                    ip.getBankByCompany(that.common.joinSearchParam(condition),[that.hallData[0].companyCode],res => {
                        if(res.code === 200){
                            that.JDEBankOpt = Object.values(res.data)[0]
                        }
                    })
                    if(that.hallData[0] && that.hallData[0].storageType === 1){
                        that.saveStoreFlag = true;
                    }
                    ;
                    that.$nextTick(()=>{
                        that.hallData.forEach((item,index)=>{
                            that.$refs.calendar.setToday();//进来初始化日历显示在当前月
                            if(index === 0 && that.$refs.clientRef1){
                                that.$refs.clientRef1.showItem(item.landlordJdeCode);
                            }
                        })
                    });
                })
            },
            getBankNameAndAccount(num,index){
                this.JDEBankOpt.forEach(item => {
                    if(this.hallData[num].storeBankList[index].bankJdeCode === item.jdeAccount){
                        this.hallData[num].storeBankList[index].depositBankName = item.depositBankName;
                        this.hallData[num].storeBankList[index].depositBankAccount = item.depositBankAccount;
                    }
                })
            },
            scrollUserName(type,param){
                let that = this;
                if(param){
                    this.userNameSize += 10;
                    let tem = [
                        {
                            name:'keyWord',
                            value:this.$refs[type][0].$children[0].currentValue
                        },{
                            name:'pageSize',
                            value:this.userNameSize
                        },{
                            name:'pageIndex',
                            value:1
                        }
                    ];
                    ip.listFscUsersByKeyWord(this.common.joinSearchParam(tem),res => {that.userNameOpt = res.data})
                }
            },
            remoteUserName(val){
                let that = this;
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
                    }
                ];
                ip.listFscUsersByKeyWord(this.common.joinSearchParam(tem),res => {that.userNameOpt = res.data})
            },
            // getUserInfo(val,index){
                // let obj = {};
                // obj = this.userNameOpt.find(item => {
                //     return item.id === val
                // });
                // this.hallData[0].showUserInfo[index].info = JSON.parse(JSON.stringify(obj));
            // },
            makeDefault(bankJDEIndex,num){
                this.hallData[num].storeBankList.forEach((item,index) => {
                    bankJDEIndex === index ? item.defaultValue = true : item.defaultValue = false
                })
            },
            clearWeekendStorageDate(num,type){//切换固定天数和固定星期几的时候进行删除 but none
                let varr = this.hallData&& this.hallData.length>0?[num]:null
                if(varr){
                    varr.weekendStorageDate = '';
                    varr.storageFrequency = '';
                    varr.storageFrequencyArr1 = [];
                    varr.storageFrequencyArr2 = [];
                    varr.weekendStorage = '';
                    varr.holidayStorage = ''
                }
                if(num === 2){
                    this.hallData[type].weekendStorageDate = 2;
                }
            },
            // handleUserInfo(){
                // let that = this;
                // let userInAndPsCustom = [];
                // userInAndPsCustom = this.hallData[0].psCustomers.concat(this.hallData[0].userInfo);
                // for(let item of userInAndPsCustom){
                //     if(item){
                //         if(that.hallData[0].rgm === item.psId){
                //
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'RGM'}).info = item;
                //             continue;
                //         }
                //         if(that.hallData[0].dm === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'DM'}).info = item;
                //             continue;
                //         }
                //         if(that.hallData[0].am === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'AM'}).info = item;
                //             continue;
                //         }
                //         if(that.hallData[0].mm === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'MM'}).info = item ;
                //             continue;
                //         }
                //         if(that.hallData[0].om === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'OM'}).info = item ;
                //             continue;
                //         }
                //         if(that.hallData[0].fm === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'FM'}).info = item;
                //             continue;
                //         }
                //         if(that.hallData[0].fbc === item.psId){
                //             that.hallData[0].showUserInfo.find(item => {return item.type === 'FBC'}).info = item;
                //             continue;
                //         }
                //     }
                // }
            // },
            save(formName){
                let that = this;
                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        if(that.$refs['hallData1']) {
                            let flag = true
                            that.$refs['hallData1'].validate((valid1) => {
                                if (!valid1) {
                                    flag = false;
                                }
                            })
                            if(!flag){
                                that.showTips('请将信息填写完整','info');
                                return false;
                            }
                        }

                        if(that.hallData.length>0 ){
                            try {
                                that.hallData.forEach((hall, index) => {
                                    if (hall.storeBankList && hall.storeBankList.length > 0) {
                                        if (_.isUndefined(hall.storeBankList.find(x => {
                                            return !!x.defaultValue
                                        }))  && hall.storageType &&hall.storageType !==3) {
                                            throw new Error('请选择至少一个默认银行');
                                        }else if (hall.storeBankList.filter(x => {
                                            return !!x.defaultValue
                                        }).length>1 && hall.storageType&& hall.storageType !==3){
                                            throw new Error('默认银行只能选择一个');
                                        }
                                    }
                                    hall.storeBank = hall.storeBankList;
                                    if(hall.storageType === 3 || hall.storageType === 2){
                                        hall.storageFrequencyType = null;
                                    }
                                    if (hall.storageFrequencyType === 2) {
                                        if (index === 0) {
                                            hall.storageFrequency = that.storageFrequencyArr1.join(',');
                                        } else {
                                            hall.storageFrequency = that.storageFrequencyArr2.join(',');
                                        }
                                    }
                                    if (hall.storeBank && hall.storeBank.length > 0) {
                                        hall.storeBank.forEach(bank => {
                                            that.$set(bank, 'storeId', that.id)
                                        });
                                        delete hall.storeBankDepositDates
                                    }
                                    //添加是否有设为默认
                                });
                            } catch (e) {
                                that.$message({
                                    type:'warning',
                                    message:e.message
                                })
                                return ;
                            }
                        }
                        //判断自行存行的信息是否完整
                        if(that.hallData[0].storageType === 1){
                            if(that.hallData[0].storageFrequencyType ===1){
                                if(that.hallData[0].weekendStorageDate === false){
                                    if(that.hallData[0].storageFrequency === '' || that.hallData[0].weekendStorageDate === '' || that.hallData[0].weekendStorage === ''){
                                        that.showTips('请将自行存行填写完整','warning');return false
                                    }
                                }else{
                                    if(that.hallData[0].storageFrequency === '' || that.hallData[0].weekendStorage === ''){
                                        that.showTips('请将自行存行填写完整','warning');return false
                                    }
                                }
                            }else if(that.hallData[0].storageFrequencyType === 2){
                                if(that.hallData[0].storageFrequency === '' || that.hallData[0].weekendStorageDate === '' || that.hallData[0].holidayStorage === ''){
                                    that.showTips('请将自行存行填写完整','warning');return false
                                }
                            }
                        }

                        //处理userInfo
                        // that.hallData[0].userInfo = [];
                        that.hallData[0].showUserInfo.forEach(item => {
                            if(item.storeType === 1){
                                that.hallData[0].psCustomers.push(item.info)
                            }else if(item.storeType === 2){
                                that.hallData[0].psCustomers.push(item.info);
                            }else if(item.storeType === 3){
                                that.hallData[0].psCustomers.push(item.info);
                            }else if(item.storeType === 4){
                                that.hallData[0].psCustomers.push(item.info)
                            }else if(item.storeType === 5){
                                that.hallData[0].psCustomers.push(item.info)
                            }
                            // else if(item.type === 'FM'){
                            //     JSON.stringify(item.info) === '{}' ? that.hallData[0].fm = null : (that.hallData[0].fm = item.info.psId,that.hallData[0].psCustomers.push(item.info))
                            // }else if(item.type === 'FBC'){
                            //     JSON.stringify(item.info) === '{}' ? that.hallData[0].fbc = null : (that.hallData[0].fbc = item.info.psId,that.hallData[0].psCustomers.push(item.info))
                            // }
                        });
                        // if(that.hallData[0].psCustomers.length < 1) {that.hallData[0].psCustomers = null}
                        //去除重复联系人
                        // if(that.hallData[0].userInfo){
                        //     let length = that.hallData[0].userInfo.length;
                        //     for(let i=length - 1;i >= 0;i--){
                        //         for(let j=i - 1;j >= 0;j--){
                        //             if(that.hallData[0].userInfo[i] && that.hallData[0].userInfo[j]){
                        //                 if(that.hallData[0].userInfo[i].id === that.hallData[0].userInfo[j].id){
                        //                     that.hallData[0].userInfo.splice(j,1)
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        that.hallData[0].bsAndThirdUserInfo = that.hallData[0].psCustomers;
                        //处理临时停业日期
                        that.hallData[0].storeTemporaryStopDates = [];
                        that.storeTemporaryStopDatesLog.forEach(item => {
                            that.hallData[0].storeTemporaryStopDates.push(item)
                        });

                        try {
                            that.hallData[0].addStoreTemporaryStopDates.forEach(item => {
                                if(item.stopReason && (!item.stopStartDate||!item.stopEndDate)){
                                    throw new Error("请选择临时停业的停业日期!")
                                }
                                if(JSON.stringify(item) !== JSON.stringify(addDate)){
                                    item.storeJdeCode = that.hallData[0].storeJdeCode;
                                    item.storeCode = that.hallData[0].storeHypId;
                                    that.hallData[0].storeTemporaryStopDates.push(item)
                                }
                            });
                        }catch(e){
                            that.common.messageUtil({
                                type:'warning',
                                message:e.message
                            });
                            return;
                        }
                        if(that.hallData[0].storeTemporaryStopDates.length < 1){
                            that.hallData[0].temporaryStopDate = null
                        }else{
                            that.hallData[0].temporaryStopDate = that.hallData[0].storeTemporaryStopDates
                        }
                        if(that.hallData.length === 1){
                            let futureHallData = JSON.parse(JSON.stringify(that.hallData[0]));
                            that.hallData[0].depositStartDate > that.currentTime ? (futureHallData.storageStatus = 2,that.hallData[0].storageStatus = 1) : (futureHallData.storageStatus = 1,that.hallData[0].storageStatus = 2);
                            that.hallData[0].storageType = null;
                            that.hallData[0].storageFrequencyType = null;
                            that.hallData[0].storageFrequency = null;
                            // that.hallData[0].storageFrequencyArr = [];
                            that.hallData[0].weekendStorage = null;
                            that.hallData[0].weekendStorageDate = null;
                            that.hallData[0].holidayStorage = null;
                            that.hallData[0].landlordJdeCode = null;
                            that.hallData[0].depositStartDate = null;
                            that.hallData[0].storeBankList = [Object.assign({},bankJDE)];
                            that.hallData[0].caiZhiCardNo = null;
                            that.hallData.push(futureHallData)
                        }else if(that.hallData.length === 2){
                            that.hallData[1].remark = that.hallData[0].remark;
                            if(that.hallData[1].depositStartDate === that.currentTime){
                                that.hallData[1].storageStatus = 1;
                                that.hallData[1].storeBankList = that.hallData[0].storeBankList;
                                that.hallData[1].storeBank = that.hallData[0].storeBankList;
                                that.hallData[0].storageStatus = 2;
                                that.hallData[0].storageType = null;
                                that.hallData[0].storageFrequencyType = null;
                                that.hallData[0].storageFrequency = null;
                                // that.hallData[0].storageFrequencyArr = [];
                                that.hallData[0].weekendStorage = null;
                                that.hallData[0].weekendStorageDate = null;
                                that.hallData[0].holidayStorage = null;
                                that.hallData[0].landlordJdeCode = null;
                                that.hallData[0].depositStartDate = null;
                                that.hallData[0].storeBankList = [Object.assign({},bankJDE)];
                                that.hallData[0].caiZhiCardNo = null;
                            }
                        }
                        let param = [{name:'module',value:that.module},{name:'subModule',value:that.subModule}];

                        //设置关店日期
                        if(that.hallData[1].endDate === '0-00-00'){that.hallData[1].endDate = that.hallData[0].endDate}
                        if(that.hallData[1].startDate === '0-00-00'){that.hallData[1].startDate = that.hallData[0].startDate}
                        if((that.hallData[0].storageType !== 3 && that.hallData[0].storageType !==null && that.hallData[1].storageType === null) ||
                            (that.hallData[1].storageType !== 3 && that.hallData[1].storageType !==null && that.hallData[0].storageType!== null)){//checkbox选中且不等于房东代收
                            let isDefault1 = false;
                            let isDefault2 = false;
                            if(that.hallData[0].storageType !== 3 && that.hallData[0].storageType !==null){//存行信息下面第一个tab的checkbox选择了并且选择的不是房东代收
                                that.hallData[0].storeBankList.forEach(bank => {if(bank.defaultValue === true){isDefault1 = true}})
                            }
                            if(that.hallData[0].storageType === null || that.hallData[0].storageType === 3){//没选或者选择了房东代收
                                isDefault1 = true
                            }
                            if(that.hallData[1].storageType !== 3 && that.hallData[1].storageType !==null){//存行信息下面第二个tab的checkbox选择了并且选择的不是房东代收
                                if(that.hallData[1].storeBankList && that.hallData[1].storeBankList.length>0){
                                    that.hallData[1].storeBankList.forEach(bank => {if(bank.defaultValue === true){isDefault2 = true}})
                                }else{
                                    isDefault2 = true
                                }
                            }
                            if(that.hallData[1].storageType === null || that.hallData[1].storageType === 3){//没选或者选择了房东代收
                                isDefault2 = true
                            }
                            if(isDefault1 && isDefault2){
                                //调接口保存
                                ip.updateStore(that.common.joinSearchParam(param),that.hallData,res => {
                                    res.code === 200 ? (that.showTips(res.data,'success'),that.cancel()) : that.showTips(res.msg,'info')
                                })
                            }else{
                                that.showTips('请选择默认银行','warning');
                            }
                        }else{
                            //调接口保存
                            ip.updateStore(that.common.joinSearchParam(param),that.hallData,res => {
                                res.code === 200 ? (that.showTips(res.data,'success'),that.cancel()) : that.showTips(res.msg,'info')
                            })
                        }

                    } else {
                        that.showTips('请将信息填写完整','info');return false
                    }
                });
            },
            showTips(text,type){this.common.messageUtil({message: text, type: type})},
            getDefaultUserNames(){
                let that = this;
                ip.listFscUsersByKeyWord('?pageSize=10&pageIndex=1',res => {that.userNameOpt = res.data});
                ip.getDictionaryByNumber('TEMPORALREASONS',res => {that.stopReasonOpt = res.data})
            },
            // getCustomer(){
            //     let that = this;
            //     ip.getCustomerList('?pageSize=20',res => {res.data&&res.data.list? that.customers = res.data.list:[]})
            // },
            getStopDate(val,index){
                let that = this;
                this.hallData[0].addStoreTemporaryStopDates.forEach((item,addIndex) => {
                    if(index !== addIndex && item.stopDate){
                        //临时停业日期之间不能有交集
                        if(val && !(val[0] > that.hallData[0].addStoreTemporaryStopDates[addIndex].stopDate[1] || val[1] < that.hallData[0].addStoreTemporaryStopDates[addIndex].stopDate[0])){
                            that.showTips('临时停业日期之间不能有交集','warning');
                            that.hallData[0].addStoreTemporaryStopDates[index].stopDate = null
                        }
                    }
                });
                if(this.hallData[0].addStoreTemporaryStopDates[index].stopDate){
                    if(val && val[0]<this.hallData[0].startDate){
                        this.showTips('临时停业日期不得早于开店日期','warning');
                        this.hallData[0].addStoreTemporaryStopDates[index].stopDate = null
                    }
                }
                if(this.hallData[0].addStoreTemporaryStopDates[index].stopDate){
                    this.hallData[0].addStoreTemporaryStopDates[index].stopStartDate = val[0];
                    this.hallData[0].addStoreTemporaryStopDates[index].stopEndDate = val[1];
                }else{
                    this.hallData[0].addStoreTemporaryStopDates[index].stopStartDate = null;
                    this.hallData[0].addStoreTemporaryStopDates[index].stopEndDate = null;
                }
            },
            getStorageType(val,num){
                let that = this;
                if(this.hallData && this.hallData.length>0){
                    this.hallData[num].landlordJdeCode = '';
                    if(this.$refs['clientRef'+(num+1)]){
                        this.$refs['clientRef'+(num+1)]['modelValue'] = '';
                    }
                    this.hallData[num].depositStartDate = null;
                    if(val === 1){
                        this.hallData[num].storageFrequencyType = 1;
                        this.clearWeekendStorageDate(num)
                    }else if(val === 3){
                        this.hallData[num].storeBankList = [Object.assign({},bankJDE)]
                    }
                    if(this.$refs.calendar1){
                        that.$refs.calendar1.setToday()
                    }
                }
                // ;
                // if( that.hallData[1].storageType ===  null){//未来的银行信息等于当前的银行信息
                //     ;
                //     if( that.hallData[1].storageType !==  3){
                //         that.hallData[1].storeBankList = JSON.parse(JSON.stringify(that.hallData[0].storeBankList))
                //     }
                // }
            },
            setEndDate(){
                this.currentTime = this.common.getNowFormatDate();
                if(this.hallData[0].endDate < this.currentTime){
                    this.showTips('关店日期不得早于当前日期','warning');
                    this.hallData[0].endDate = null
                }
            },
            verifyDepositStartDate(val,num){
                if(this.hallData[0].startDate && this.hallData[0].startDate !== null){
                    if(this.currentTime < this.hallData[0].startDate){
                        if(val !== this.hallData[0].startDate){this.hallData[num].depositStartDate = this.hallData[0].startDate;this.showTips('生效日期只能设置为开店日期','info')}
                    }else if((this.hallData[0].endDate && this.currentTime >= this.hallData[0].startDate && this.currentTime < this.hallData[0].endDate) || (!this.hallData[0].endDate && this.currentTime >= this.hallData[0].startDate)){
                        if(val < this.currentTime){this.hallData[num].depositStartDate = null;this.showTips('设置生效日期需大于或等于当前日期','info')}
                    }
                }
                if(this.hallData[0].addStoreTemporaryStopDates.length >=1 && this.hallData[0].addStoreTemporaryStopDates[0].stopStartDate !== null){
                    this.hallData[0].addStoreTemporaryStopDates.forEach(date => {
                        if(this.currentTime >= date.stopStartDate && this.currentTime < date.stopEndDate){
                            if(val <= date.stopEndDate){this.hallData[num].depositStartDate = null;this.showTips('设置生效日期需大于等于再开业日期','info')}
                        }
                    })
                }
                this.hallData[num].depositStartDate > this.currentTime ? this.hallData[num].storageStatus = 2 : this.hallData[num].storageStatus = 1
            },
            clearHallContent(){
                this.hallData[1].storageStatus = 2;
                this.hallData[1].storageType = null;
                this.hallData[1].storageFrequencyType = null;
                this.hallData[1].storageFrequency = null;
                this.hallData[1].weekendStorage = null;
                this.hallData[1].weekendStorageDate = null;
                this.hallData[1].holidayStorage = null;
                this.hallData[1].landlordJdeCode = null;
                this.hallData[1].depositStartDate = null;
                this.hallData[1].storeBankList = [Object.assign({},bankJDE)];
                this.hallData[1].caiZhiCardNo = null;
            },
            checkTab(val){
                //押运公司 房东代收回显
                let that = this;
                this.$nextTick(()=>{
                    that.hallData.forEach((item,index)=>{
                        // if(index === 0 && that.$refs.clientRef1){
                        //     that.$refs.clientRef1.modelValue = Number(item.landlordJdeCode);
                        // }else
                        if(index === 1 && that.$refs.clientRef2){ //只为回显第二个
                            that.$refs.clientRef2.showItem(item.landlordJdeCode);
                            // that.$refs.clientRef2.modelValue = Number(item.landlordJdeCode);

                        }

                        if(item.storageStatus === 2){
                            let indexItem = index===1?0:1;
                            if(item.storageType ===  null&& that.hallData[indexItem].storeBankList && that.hallData[indexItem].storeBankList.length>0){//未来的银行信息等于当前的银行信息
                                item.storeBankList = JSON.parse(JSON.stringify(that.hallData[indexItem].storeBankList))
                                item.storeBankList.forEach(x=>{
                                    x.id = null ;
                                })
                            }
                        }
                    })
                });
            },
            getClient(res){
                this.hallData[0].landlordJdeCode = res;
            },
            getClient2(res){
                this.hallData[1].landlordJdeCode = res;
            },
            changeStatus(){
                let that = this;
                ip.changeSaveBank('?id='+this.id,res=>{
                    if(res.code === 200){
                        // that.getHallData(that.$route.query.id);
                        location.reload();
                    }
                })
            },
            weekendIsStorage(val,index){
                if(!val){
                    this.hallData[index].weekendStorageDate = 3;
                }
            }
        },
        beforeMount(){
            // this.getCustomer();
            this.getDefaultUserNames();
        },
        mounted(){
            /* 日历 */
            if(this.$route.query.id){
                this.id = this.$route.query.id;
                this.getHallData(this.$route.query.id);
            }
            this.$route.query.detail ? this.isDetails = true : this.isDetails = false;
            let that = this;
        },
        filters: {
            customType:  (index)=> {
                switch(index){
                    case 1:return 'RGM';
                    case 3:return 'AM';
                    case 2:return 'DM';
                    case 5:return 'OM';
                    case 4:return 'MM';
                    case 6:return 'FBC';
                    case 7:return 'FM';
                    default:return;
                }
            }
        },
    }
</script>

<style lang="scss">
    @import '../../assets/scss/master';
    .landlord{
        padding:0 10px;
        width:200px
    }
    .days /deep/ .el-checkbox{
        display: inline-block;
        width: 39px;
        margin: 0 11px;
    }
    .days /deep/ .el-checkbox-group{
        line-height: 18px;
    }
    .el-radio.margin-reset{
        margin-left:0;
    }
    .calendar-dialog-body{
        background: #fff;
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 2px;
        width: 405px;
        display: inline-block;
        margin-left: 40px;
    }
</style>
