<template>
    <div class="mainContent">
        <div class="searchContent">
            <div class="selectContent" >
                <div class="selectTitle">日期</div>
                <el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </div>
            <el-button size="small" type="success" class="c-button" @click="adjustCardPlatBalance('cardPlatBalanceData')"><i class="fa fa-edit c-button-icon--left"></i>手动调整</el-button>
            <el-button size="small" type="success" class="c-button" @click="createData"><i class="fa fa-tags c-button-icon--left"></i>数据生成</el-button>
            <el-button size="small" type="success" @click="getCardPlatBalanceList">查询</el-button>
            <el-button size="small" type="success" plain @click="reset" class="c-button">重置</el-button>
            <el-button size="small" type="success" class="c-button" @click="exportFiles"><i class="fa fa-download c-button-icon--left"></i>下载</el-button>
        </div>
        <div class="dataContent">
            <el-table :data="tableData" border>
                <el-table-column prop="dataDate" label="日期"></el-table-column>
                <el-table-column prop="dataItem" label="类型"></el-table-column>
                <el-table-column prop="sumAmount" label="Amount(UNP+ZHX)"></el-table-column>
                <el-table-column prop="unpAmount" label="Amount(UNP)"></el-table-column>
                <el-table-column prop="zhxAmount" label="Amount(ZHX)"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="sumNetAmount" label="Net_Amount(UNP+ZHX)"></el-table-column>
                <el-table-column prop="unpNetAmount" label="Net_Amount(UNP)"></el-table-column>
                <el-table-column prop="zhxNetAmount" label="Net_Amount(ZHX)"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="pageSizeList"
                               :page-size="pageSize" class="gross" background layout="total, sizes, prev, pager, next, jumper" :total="totalRecords">
                </el-pagination>
            </div>
        </div>
        <el-dialog class="dialogContent" title="手动调整" :visible.sync="dialogCardPlatBalance" width="50%">
            <el-form :model="cardPlatBalanceData" ref="cardPlatBalanceData" label-width="120px" :rules="rules">
                <el-form-item label="日期" prop="changeDate">
                    <el-date-picker @change="getAdjustInfo" v-model="cardPlatBalanceData.changeDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="卡类型" prop="cardType">
                    <el-select @change="getAdjustInfo" size="small" v-model="cardPlatBalanceData.cardType" placeholder="请选择">
                        <el-option v-for="item in cardTypeOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="dataItem" prop="dataItem">
                    <el-select @change="getAdjustInfo" size="small" v-model="cardPlatBalanceData.dataItem" placeholder="请选择">
                        <el-option v-for="item in dataItemOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="调整值">
                    <el-input size="small" placeholder="" v-model.trim="cardPlatBalanceData.changeAmount"></el-input>
                </el-form-item>
                <el-form-item label="调整原因">
                    <el-input size="small" placeholder="" v-model.trim="cardPlatBalanceData.changeReason"></el-input>
                </el-form-item>
                <el-form-item label="调整项时间范围">
                    <el-radio-group v-model="cardPlatBalanceData.changeMonthDay">
                        <el-radio label="M">月</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small"  type="success" plain @click='dialogCardPlatBalance = false' class="c-button">取消</el-button>
                <el-button size="small"  type="success" @click="updateCardPlatBalance('cardPlatBalanceData')" class="c-button">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ip from '@/model/api'

    export default {
        name: 'cardPlatBalance',
        data () {
            return {
                date:null,
                tableData: [],
                pageSizeList: [25, 50, 75, 100, 125],
                pageSize: 25,
                currentPage: 1,
                totalRecords: 0,
                dialogCardPlatBalance:false,
                cardPlatBalanceData:{
                    cardType:'ZHX',
                    dataItem:'M1',
                    changeDate:null,
                    changeAmount:0.00,
                    changeReason:null,
                    changeMonthDay:'M'
                },
                rules:{
                    changeDate:{ required: true, message: '请选择日期', trigger: 'change' },
                    cardType:{ required: true, message: '请选择卡类型', trigger: 'change' },
                    dataItem:{ required: true, message: '请选择dataItem', trigger: 'change' },
                },
                cardTypeOpt:[{
                    value:'ZHX',
                    label:'资和信'
                },{
                    value:'UNP',
                    label:'银商'
                }],
                dataItemOpt:[{value:'M1',label:'手工调整1'}]
            }
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val;
                this.getCardPlatBalanceList()
            },
            handleCurrentChange (val) {
                this.currentPage = val;
                this.getCardPlatBalanceList()
            },
            getCardPlatBalanceList(){
                var that = this;
                var param = [{
                    name:'pageIndex',
                    value:this.currentPage
                },
                {
                    name:'pageSize',
                    value:this.pageSize
                },
                {
                    name:'date',
                    value:this.date
                }];
                ip.getCardPlatBalanceList(this.common.joinSearchParam(param),res => {
                    if(res.code === 200){
                        that.tableData = res.data.list;
                        that.totalRecords = res.data.totalRecords
                    }else{
                        that.tableData = []
                    }
                })
            },
            exportFiles(){
                var that = this;
                var param = {
                    pageIndex:this.currentPage,
                    pageSize:this.pageSize,
                    date:this.date
                };
                ip.exportCardPlatBalance(param, 'application/vnd.ms-excel', res => {
                    if (res.code) {
                        that.showTips(res.msg,'error')
                    } else {
                        let link = document.createElement('a');
                        link.href = res;
                        link.download = '卡平台累计平衡报告.xlsx';
                        link.target = '_blank';link.click()
                    }
                })
            },
            showTips (text,type) {this.common.messageUtil({message: text, type: type})},
            createData(){
                var that = this;
                if(this.date){
                    ip.createCardPlatBalance(this.date,res => {
                        res.code === 200 ? that.showTips(res.data,'success') : that.showTips(res.msg,'error')
                    })
                }else{
                    that.showTips('请选择日期','info')
                }
            },
            updateCardPlatBalance(formName){
                var that = this;
                that.$refs[formName].validate((valid) => {
                    if(valid){
                        ip.updateCardPlatBalanceList(that.cardPlatBalanceData,res => {
                            res.code === 200 ? (that.showTips(res.data,'success'),that.dialogCardPlatBalance = false) : that.showTips(res.msg,'info')
                        })
                    }else{
                        return false
                    }
                })
            },
            getAdjustInfo(){
                var that = this;
                this.cardPlatBalanceData.changeAmount = 0.00;
                this.cardPlatBalanceData.changeReason = null;
                var param = [{
                    name:'changeDate',
                    value:this.cardPlatBalanceData.changeDate
                },
                {
                    name:'dataItem',
                    value:this.cardPlatBalanceData.dataItem
                },
                {
                    name:'cardType',
                    value:this.cardPlatBalanceData.cardType
                }];
                if(this.cardPlatBalanceData.cardType && this.cardPlatBalanceData.dataItem && this.cardPlatBalanceData.changeDate){
                    ip.getBalanceChangeItem(this.common.joinSearchParam(param),res => {
                        if(res.code === 200){
                            that.cardPlatBalanceData.changeAmount = res.data.changeAmount;
                            that.cardPlatBalanceData.changeReason = res.data.changeReason;
                        }
                    })
                }
            },
            adjustCardPlatBalance(formName){
                var _self = this;
                if(this.$refs[formName] !== undefined){
                    _self.$refs[formName].resetFields();
                }
                this.dialogCardPlatBalance = true;
                this.cardPlatBalanceData = {
                    cardType:'ZHX',
                    dataItem:'M1',
                    changeDate:null,
                    changeAmount:0.00,
                    changeReason:null,
                    changeMonthDay:'M'
                };
                if(this.date){
                    this.cardPlatBalanceData.changeDate = this.date
                }
            },
            reset(){
                this.date = null
            }
        }
    }
</script>

<style>
</style>
