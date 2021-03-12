<template>
    <div class="thirdBillCoverMg">
        <div class="search-content">
            <div class="selectContent">
                <div class="selectTitle">交易日期</div>
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
                <div class="selectTitle">账单名称</div>
                <el-input v-model.trim="billName" size="small" clearable></el-input>
            </div>
            <br>
            <div class="selectContent offset-top">
                <el-button size="small" @click="searchData1(1)" class="c-button c-button--primary" v-if="first">查询
                </el-button>
                <el-button size="small" @click="searchData2(1)" class="c-button c-button--primary" v-if="second">查询
                </el-button>
                <el-button size="small" @click="reset" class="c-button c-button--primary" >重置
                </el-button>
            </div>
        </div>
        <div class="content">
            <el-tabs v-model="activeName" >
                <el-tab-pane label="待处理新账单" name="difference">
                    <leftTable :dynamicData="search1Data" v-on:currentPage="getPageIndex1($event)"
                               v-on:pageSize="getPageSize1($event)" :totalRecords="totalRecords1"  :pageIndex="pageIndex1"
                               @refresh-list="searchData1()"></leftTable>
                </el-tab-pane>
                <!--<el-tab-pane label="有效验证不通过" name="fail">-->
                    <!--<rightTable :dynamicData="search2Data" v-on:currentPage="getPageIndex2($event)"-->
                                <!--v-on:pageSize="getPageSize2($event)" :totalRecords="totalRecords2" :pageIndex="pageIndex2"-->
                                <!--@refresh-list="searchData2()"></rightTable>-->
                <!--</el-tab-pane>-->

            </el-tabs>
        </div>
    </div>
</template>

<script>
    import leftTable from './2ndTables/billCoverDifference'
    // import rightTable from './2ndTables/efficientValidateFail'
    import api from '../../../../model/apidr'

    export default {
        name: "thirdBillCoverMg",
        components: {
            leftTable,
            // rightTable
        },
        data() {
            return {
                activeName: 'difference',
                bookDate:[],
                first: true,
                second: false,
                billName: '',
                search1Data: [],
                search2Data: [],
                pageSize1: 25,
                pageIndex1: 1,
                // pageSize2: 10,
                // pageIndex2: 1,
                totalRecords1: 0,
                // totalRecords2: 0
            }
        },

        methods: {
            // handleClick(tab, event) {
            //     var that = this;
            //     if (tab.index === "0") {
            //         this.index1 = true;
            //         this.index2 = false;
            //         that.first = true;
            //         that.second = false;
            //         this.searchData1();
            //     } else if (tab.index === "1") {
            //         this.index1 = false;
            //         this.index2 = true;
            //         that.first = false;
            //         that.second = true;
            //         this.searchData2();
            //     }
            // },
            searchData1(pageIndex) {
                let that = this;
                if(this.first){
                    api.getThirdBillCoverList(this.geParam(1,pageIndex), function (res) {
                        that.totalRecords1 = 0;
                        that.search1Data = [];
                        if (res.code === 200) {
                            that.totalRecords1 = res.data?res.data.totalRecords:0;
                            that.search1Data = res.data?res.data.list:[];
                        }
                    })
                }
            },
            getPageSize1(res) {
                this.pageSize1 = res;
                this.searchData1();
            },
            // getPageSize2(res) {
            //     this.pageSize2 = res;
            //     this.searchData2();
            // },
            getPageIndex1(res) {
                this.pageIndex1 = res;
                this.searchData1();
            },
            // getPageIndex2(res) {
            //     this.pageIndex2 = res;
            //     this.searchData2();
            // },
            geParam(type,pageIndex){
                if(pageIndex){
                    if(type === 1){
                        this.pageIndex1 = 1;
                    }else{
                        this.pageIndex2 = 1;
                    }
                }
               return {
                    pageIndex:type ===1?this.pageIndex1:this.pageIndex2,
                    pageSize: type ===1?this.pageSize1:this.pageSize2,
                    thirdBillName: this.billName,
                    tradeEndDate: this.bookDate?this.bookDate[1]:'',
                    tradeStartDate: this.bookDate?this.bookDate[0]:''
                }
            },
            // searchData2(pageIndex) {
            //     let that = this;
            //     api.getEfficientValidateList(this.geParam(2,pageIndex), function (res) {
            //         that.totalRecords2 = 0;
            //         that.search2Data = [];
            //         if (res.code === 200) {
            //             that.totalRecords2 = res.data.totalRecords;
            //             that.search2Data = res.data.list;
            //         }
            //     })
            // },
            // refreshList(res) {
            //     if (res === 'left') {
            //         this.searchData1();
            //     } else {
            //         this.searchData2();
            //     }
            // },
            reset(){
                this.bookDate = [];
                this.billName = '';
            }
        },
        activated() {
            if (this.$route.meta.isBack) {
                this.searchData1();
            }
            this.$route.meta.isBack = false;
        },
        mounted() {
            this.searchData1();
        }
    }
</script>

<style scoped>
    .offset-top {
        margin-top: 10px;
    }
</style>
