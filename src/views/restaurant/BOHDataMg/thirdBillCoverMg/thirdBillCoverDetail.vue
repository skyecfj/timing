<template>
    <div class="thirdBillCoverDetail">

        <div class="content">
            <el-row :gutter="24" class="dynamic-word">
                <el-col :span="4" class="font14">账单名称</el-col>
                <el-col :span="4" class="font14">交易日期</el-col>
                <el-col :span="4" class="font14">A账单应收总金额</el-col>
                <el-col :span="4" class="font14">B账单应收总金额</el-col>
                <el-col :span="4" class="font14">差异金额(B-A)</el-col>
            </el-row>
            <el-row class="dynamic-word" :gutter="24">
                <el-col :span="4" class="font18">{{$route.query.thirdBillName}}</el-col>
                <el-col :span="4" class="font18">{{$route.query.tradeDate}}</el-col>
                <el-col :span="4" class="font18">{{$route.query.oldAmountTotal}}</el-col>
                <el-col :span="4" class="font18">{{$route.query.newAmountTotal}}</el-col>
                <el-col :span="4" class="font18">{{$route.query.diff}}</el-col>
            </el-row>
            <tableOrigin
                    :tableHead="tableHead"
                    :align="align"
                    :dynamicData="dynamicData"
                    ref="thirdBillCoverDetail"
                    size="medium"
                    :pageination="false"
            >
            </tableOrigin>
            <br>
            <div class="selectContent offset-top">
                <el-button size="small" @click="exportDataA($route.query.oldSourceBillId)"
                           class="c-button c-button--primary">导出A账单
                </el-button>
                <el-button size="small" @click="exportDataB($route.query.sourceBillId)"
                           class="c-button c-button--primary">导出B账单
                </el-button>
                <el-button size="small" @click="cover" class="c-button c-button--primary">确认覆盖</el-button>
                <el-button size="small" @click="deleteDetail" class="c-button c-button--primary">删除</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import tableOrigin from '../originalTable'
    import api from '../../../../model/apidr'

    export default {
        name: 'thirdBillCoverDetail',
        components: {
            tableOrigin
        },
        data () {
            return {
                dynamicData: [],
                tableHead: [
                    {
                        label: '',
                        value: 'itemType',
                        fixed: true,
                        formatter: (row, column, cellValue, index) => {
                            switch (row.itemType) {
                                case 1:
                                    return '金额无差异';
                                case 2:
                                    return '金额有差异';
                                case 3:
                                    return '原账单有，新账单无';
                                case 4:
                                    return '原账单无，新账单有';
                                default:
                                    return;
                            }
                        }
                    },
                    {
                        label: '餐厅数量',
                        prop: 'storeCount'
                    },
                    {
                        label: 'A账单',
                        multiple: true,
                        columns: [
                            {
                                label: '导入时间' + this.$route.query.oldAccessDate||'',
                                prop: 'oldAmount'
                            }
                        ]
                    },
                    {
                        label: 'B账单',
                        multiple: true,
                        columns: [
                            {
                                label: '导入时间' + this.$route.query.newAccessDate||'',
                                prop: 'newAmount'
                            }
                        ]
                    },
                ],
                selection: true,
                align: 'center',
            }
        },
        methods: {
            exportDataA (param) {
                let that = this;
                api.downloadThirdBillCoverTemplate('?oldSourceBillId=' + param, 'APPLICATION/OCTET-STREAM', function (res) {
                    that.common.exportTemplate('原账单下载.zip', res)
                })
            },
            exportDataB (param) {
                let that = this;
                api.downloadEfficientValidateTemplate('?sourceBillId=' + param, 'application/vnd.ms-excel', function (res, header) {
                    let name = header['content-disposition'];
                    that.common.exportTemplate(decodeURIComponent(name.substr(name.indexOf('=')+1)),res);
                })
            },
            cover () {
                let that = this;
                this.$confirm('是否确认覆盖？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    api.sureToCoverBill('?repeatId='+this.$route.query.repeatId,function(){
                        that.$emit('refresh-list', 'left');
                        that.cancel('thirdBillCoverMg');
                    });
                }).catch(err=>{
                    this.common.messageUtil({
                        type: 'info',
                        message:'取消确认覆盖！'
                    });
                })
            },
            deleteDetail () {
                var that = this;
                this.$confirm('确认删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.cancel('thirdBillCoverMg');
                    api.deleteThirdBillCover('?repeatId=' + this.$route.query.repeatId, function (res) {
                        if (res.code === 200) {
                            that.common.messageUtil({
                                type: 'success',
                                message: res.data
                            });
                            that.$emit('refresh-list', 'left');
                            that.cancel('thirdBillCoverMg');
                        } else {
                            that.common.messageUtil({
                                type: 'error',
                                message: res.msg
                            });
                        }
                    });
                })
            },
            cancel (param,) {
                this.common.deleteTag(this.$route, this, param);
            },
        },
        mounted () {
            let that = this;
            api.getThirdBillCoverDetailList('?repeatId='+this.$route.query.repeatId, function (res) {
                that.dynamicData = res.data;
            })
        },
        actived(){

        },
        beforeRouteLeave (to, from, next) {
            if (to.name === 'thirdBillCoverMg') {
                to.meta.isBack = true;
            }
            next();
        },
    }
</script>

<style lang="scss">
    .dynamic-word {
        margin-bottom: 10px;
        .font18 {
            font-size: 18px;
            font-weight: bold;
        }
        .font14 {
            font-size: 14px;
        }
    }

    .dynamic-word:last-child {
        margin-bottom: 25px;
    }

</style>