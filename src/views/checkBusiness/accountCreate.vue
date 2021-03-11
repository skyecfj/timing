<!--账务生成-->
<template>
  <div class="account-create">
    <!-- search -->
    <div class="search-content" >
        <div class="selectContent">
            <div class="selectTitle">业务类型</div>
            <el-select size="small"   v-model="searchObj.businessType" placeholder="请选择" @change="getVoucherType">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in businessTypeOptions" :key="item.id" :label="item.instruction" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <div class="selectContent">
            <div class="selectTitle">子业务类型</div>
            <el-select size="small" filterable v-model="searchObj.voucherCode" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <template v-for="item in voucherStatusOpts">
                    <el-option v-if="notShow.indexOf(item.instruction) == -1" :key="item.id" :label="item.instruction" :value="item.code">
                    </el-option>
                </template>
            </el-select>
        </div>
        <div class="selectContent">
            <div class="selectTitle">JDE账务模块</div>
            <el-select size="small" filterable v-model="searchObj.jdeAccountModule" placeholder="请选择">
                <el-option label="请选择" value=""></el-option>
                <el-option v-for="item in optMap[key = 'JDEACCOUNTMODULE']" :key="item.id" :label="item.dictionaryEntryName" :value="item.id">
                </el-option>
            </el-select>
        </div>
        <el-button size="small"  type="success" class="findButt" @click="getData">查询</el-button>
        <el-button size="small"  type="success" plain class="reSet" @click="reset">重置</el-button>
    </div>

    <!--body-->
    <div class="content" >
        <el-table :data="tblData" border >
            <el-table-column prop="businessTypeStr" label="业务类型"  ></el-table-column>
            <el-table-column prop="voucherInstructionsStr" label="凭证说明"  ></el-table-column>
            <el-table-column prop="jdeAccountModule" label="JDE账务模块" column-key="JDEACCOUNTMODULE" :formatter="renderTblData"  ></el-table-column>
            <el-table-column width="120" prop="operate" label="操作"  >
                <template slot-scope="scope">
                    <el-button size="small"  @click.native.prevent="voucherCreate(scope.row.voucherCode)" type="text">生成凭证</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" >
            <el-pagination background @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-sizes="pageSizeOpt"
                            :page-size="pageSize"
                            :total="totalRecord"
                            layout="total,sizes,prev,pager,next,jumper" ></el-pagination>
        </div>
    </div>

    <!-- 批量设置原因dialog -->
    <el-dialog  title="设置账期" :visible.sync="setPaymentDayVisible" width="30%" :close-on-click-modal="false"
                custom-class="set-paymentday-dialog" @close="setPaymentDayForm.paymentDay = '';$refs['setPaymentDayForm'].resetFields()" >
        <el-form :model="setPaymentDayForm"  ref="setPaymentDayForm" label-width="100px" >
            <el-form-item label="账期" prop="paymentDay" :rules="[{ required: true, message: '请选择账期', trigger: 'change' }]">
                <el-date-picker size="small" v-model="setPaymentDayForm.paymentDay" type="month" placeholder="选择账期"
                                :picker-options="pickerOptions" format="yyyy-MM" value-format="yyyyMM" ></el-date-picker>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" class="c-button c-button--plain" @click="setPaymentDayVisible = false">取 消</el-button>
            <el-button size="small" class="c-button c-button--primary" @click="toSetPaymentDay">确 定</el-button>
        </div>
    </el-dialog>

  </div>
</template>
<script>
  import api from '../../model/api'
	export default {
    name:'accountCreate',
    created(){},
    beforeMount(){
        this.getDictionaryOptions();
        this.getBusinessType();
    },
    mounted(){
        this.getData();
    },
    data() {
        return {
            searchObj:{
                businessType: '',
                jdeAccountModule: '',
                voucherCode: ''
            },
            setPaymentDayVisible:false,
            setPaymentDayForm:{
                voucherCode : '',
                paymentDay  : ''
            },
            pickerOptions: {},
            paymentDayRange:{
                start : null,
                end   : null,
            },
            tblData:[],
            businessTypeOptions:[],
            voucherStatusOpts: [],
            notShow : ['预付款','保证金','保函','银行汇票','赊销特批','手工账务'],
            //数据字典中配置的字段
            optFromDic: ['JDEACCOUNTMODULE'],
            optMap: {},
            currentPage : 1,
            pageSizeOpt : [25,50,75,100,125],
            pageSize    : 25,
            totalRecord : 0
        }
    },
    watch : {
        paymentDayRange:{
            handler(val,oldVal){
                let start = val.start;
                let end   = val.end;
                this.pickerOptions = Object.assign({},{
                    disabledDate: (time) => {
                        return time.getTime() < start || time.getTime() > end;
                    }
                });
            },
            deep:true
        }
    },
    methods: {
        //生成凭证
        voucherCreate(voucherCode){
            let _self = this;
            if(voucherCode != 'STORE_0016' && voucherCode != 'STORE_0014'){
                this.$confirm('确定生成凭证?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.doCreatVoucher(voucherCode);
                }).catch(() => {});
            }else{
                this.setPaymentDayForm.voucherCode = voucherCode;
                this.getPaymentDayRange(voucherCode);
            }
        },
        getPaymentDayRange(voucherCode){
            let _self = this;
            let param = this.common.formatPathParam({
                closeStatus : 0,
                preCloseStatus : voucherCode == 'STORE_0014'? 1 : null
            })
            api.getPaymentDayRange(param,function(res){
                if(res.code === 200){
                    _self.paymentDayRange = {
                        start : res.data.paymentDayStartTime,
                        end   : res.data.paymentDayEndTime
                    };
                    _self.setPaymentDayVisible = true;
                }else{
                    _self.common.errorMessage(res.msg);
                }
            });
        },
        toSetPaymentDay(){
            let _self = this;
            this.$refs['setPaymentDayForm'].validate((valid) => {
                if (valid) {
                    _self.doCreatVoucher(_self.setPaymentDayForm.voucherCode,_self.setPaymentDayForm.paymentDay);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        doCreatVoucher(voucherCode,paymentDay){
            let _self = this;
            let param = {
                voucherCode : voucherCode
            }
            if(paymentDay){
                param.paymentDay = paymentDay;
            }
            api.generateVoucher(param,function(res){
                if(res.code === 200){
                    _self.common.messageUtil({
                        type : 'success',
                        message : '凭证生成成功'
                    });
                    _self.setPaymentDayVisible = false;
                }else{
                    _self.common.messageUtil({
                        type : 'info',
                        message : res.msg
                    });
                }
            })
        },
        //获取数据字典中的配置项
        getDictionaryOptions(){
            let _self = this;
            this.optFromDic.forEach(function(item,index){
                api.getDictionaryByNumber(item,function(res){
                    _self.optMap[item] = res.data;
                })
            })
        },
        //获取业务类型
        getBusinessType(){
            let _self = this;
            api.getBusinessType('',function(res){
                _self.businessTypeOptions = res.data;
            })
        },
        //获取凭证类型
        getVoucherType(){
            let _self = this;
            this.businessTypeOptions.forEach(function(item,index){
                if(_self.searchObj.businessType == item.id){
                    _self.voucherStatusOpts = item.vouchers;
                }
            })
        },
        //查询列表
        getData(){
            let _self = this;
            this.searchObj.pageIndex = this.currentPage;
            this.searchObj.pageSize  = this.pageSize;
            let param = this.common.formatPathParam(_self.searchObj);
            api.getAccountConfig(param,function(result){
                if(result.code == 200){
                    _self.tblData = result.data.list;
                    _self.totalRecord = result.data.totalRecords;
                }else if(result.code == 404){
                    _self.tblData = [];
                    _self.totalRecord = 0;
                }
            })
        },
        //处理表单数据
        renderTblData(row,column,cellValue,index){
            let _self = this;
            let actCellVal = '';
            if(this.optMap[column.columnKey]){
                this.optMap[column.columnKey].forEach(function(item,index){
                    if(cellValue == item.id){
                        actCellVal = item.dictionaryEntryName;
                    }
                })
            }
            return actCellVal;
        },
        reset(){
            this.searchObj = {
                businessType: '',
                jdeAccountModule: '',
                voucherStatus: ''
            };
            // this.getData();
        },
        handleSizeChange(val){
            this.pageSize = val;
            this.getData();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        }
    }
}
</script>
<style lang="scss" scoped>
.account-create /deep/{
    .set-paymentday-dialog{
        .el-dialog__body{
            padding: 30px 20px 0;
        }
    }
}
</style>








