<template>
  <div>
  <!--body部分-->
    <div class="bottContain">
      <el-row>
  <!--右侧部分-->
            <el-col>
             <div class="rightContain">
  <!--右侧查询框-->
              <div class="seachDiv">
              <div class="seleDivdd">
                <el-date-picker  v-model="filters.date" type="date" placeholder="创建日期" class="seleDate">
                </el-date-picker>
              </div>
              <div class="seleDivdd">
              <el-select size="small"   v-model="filters.status" placeholder="状态" class="seleStatus">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
                <el-button size="small"  type="success" class="findButt" @click="query" >查询</el-button>
                <el-button size="small"  type="success" @click="reset" plain >重置</el-button>
              </div>
              </div>

<!--订单表格-->
            <div class="rightTableDR">
            <template>
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="支付宝商家中心订单" name="first" class="tab">
                <div class="loadAction">
                  <span class="upLoad"><i class="el-icon-upload"></i>上传</span>
                  <span class="downLoad"><i class="el-icon-download"></i>下载</span>
                </div>
<!--表头-->
            <template>
              <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        @selection-change="handleSelectionChange"
                        :default-sort = "{prop: 'date', order: 'descending'}"
                        border style="width:100%">
                <el-table-column prop="orderID" label="商家订单号"  width="300" >
                </el-table-column>
                <el-table-column  prop="creationDate" sortable label="创建日期" width="160" >
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" >
                </el-table-column>
                <el-table-column prop="goodsType" label="商品类别" width="130" >
                </el-table-column>
                <el-table-column prop="Status" label="状态" width="130" >
                </el-table-column>
                <el-table-column prop="getDate" sortable label="获取日期" width="160" >
                </el-table-column>
                <el-table-column prop="trimDate"  sortable label="整理日期" width="160" >
                </el-table-column>
                <el-table-column prop="updateMan" label="更新人" width="160"  >
                </el-table-column>
              </el-table>
<!--分页-->
              <div class="paginationDR">
               <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="pageSizesList"
                      :page-size="pageSize"
                      background
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tableData.length">
              </el-pagination>
              </div>
            </template>
            </el-tab-pane>
              <el-tab-pane label="支付宝商家中心账单" name="second" class="tabpan">
<!--下载-->
            <template>
              <div class="loadAction">
                <span class="upLoad"><i class="el-icon-upload"></i>上传</span>
                <span class="downLoad"><i class="el-icon-download"></i>下载</span>
              </div>
<!--账单表格-->
              <el-table :data="tableDataSec.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        @selection-change="handleSelectionChange"
                        border style="width: 100%">
                <el-table-column prop="orderID" label="商家订单号" width="220" >
                </el-table-column>
                <el-table-column prop="creationDate" label="创建日期" width="100" >
                </el-table-column>
                <el-table-column prop="goodsName" label="商品名称" >
                </el-table-column>
                <el-table-column prop="goodsType" label="商品类别" width="80" >
                </el-table-column>
                <el-table-column prop="orderMon" label="订单月份" width="80" >
                </el-table-column>
                <el-table-column prop="busType" label="业务类型" width="80" >
                </el-table-column>
                <el-table-column prop="Status" label="状态" width="80" >
                </el-table-column>
                <el-table-column prop="getDate" label="获取日期" width="100" >
                </el-table-column>
                <el-table-column prop="trimDate" label="整理日期" width="100" >
                </el-table-column>
                <el-table-column prop="updateMan" label="更新人" width="80" >
                </el-table-column>
                <el-table-column prop="remarK" label="备注" >
                </el-table-column>
              </el-table>
<!--分页-->
              <div class="paginationDR">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSizesList"
                        :page-size="pageSize"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="tableDataSec.length">
                </el-pagination>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</el-col>
</el-row>
        </div>
    </div>

</template>
<script>
	export default {
    name:'dataReduction',
		data() {
			return {
        filters:{
          date:'',
          status:''
        },
				activeName: 'first',
        currentPage: 1,
        pageSizesList: [25, 50, 75, 100, 125],
        pageSize: 25,
				statusOptions:[{
          label: '请选择',
          value: ''
        },{
          label: '劵',
          value: '劵'
				}],
				tableData: [{
          orderID: 'T200P168896055470759321',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-11',
          trimDate:'2018-05-15',
          updateMan:'毛利小五郎'
        },{
          orderID: 'T200P168896055470759322',
          creationDate:'2017-01-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-20',
          trimDate:'2018-05-15',
          updateMan:'大山的子孙哟'
        },{
          orderID: 'T200P168896055470759345',
          creationDate:'2017-04-20',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'太阳'
        },{
          orderID: 'T200P168896055470759656',
          creationDate:'2015-06-04',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-01',
          trimDate:'2018-05-15',
          updateMan:'田青青'
        },{
          orderID: 'T200P168896055470759354',
          creationDate:'2014-05-07',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-17',
          trimDate:'2018-05-15',
          updateMan:'小发发'
        },{
          orderID: 'T200P168896055470759765',
          creationDate:'2018-11-20',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-05',
          trimDate:'2018-05-15',
          updateMan:'武大郎'
        },{
          orderID: 'T200P1688960554707593543',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'一人之下'
        },{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'炁体源流'
        },{
          orderID: 'T200P168896055470759398',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'毛利小五郎'
        },{
          orderID: 'T200P168896055470759323',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'大空翼'
        },{
          orderID: 'T200P168896055470759986',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'江流儿'
        },{
          orderID: 'T200P1688960554707593876',
          creationDate:'2018-05-30',
          goodsName:'电子劵码  5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'老锅'
        },{
          orderID: 'T200P168896055470759334',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'松江'
        },{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'电子劵 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'绝对拍档'
        },{
          orderID: 'T200P168896055470759456',
          creationDate:'2018-05-30',
          goodsName:'电子劵5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'狄仁杰'
        },{
          orderID: 'T200P168896055470759435',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'西红柿'
        },{
          orderID: 'T200P168896055470759567',
          creationDate:'2018-05-30',
          goodsName:'无敌鸡腿套餐',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'毛利小五郎'
        },{
          orderID: 'T200P1688960554707593578',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'莫兰屯'
        },{
          orderID: 'T200P168896055470759345',
          creationDate:'2018-05-30',
          goodsName:'电子劵 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'绝对拍档'
        },{
          orderID: 'T200P168896055470759543',
          creationDate:'2018-05-30',
          goodsName:'电子劵5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'狄仁杰'
        },{
          orderID: 'T200P168896055470759789',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'西红柿'
        },{
          orderID: 'T200P168896055470759098',
          creationDate:'2018-05-30',
          goodsName:'无敌鸡腿套餐',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'毛利小五郎'
        },{
          orderID: 'T200P168896055470759356',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'莫兰屯'
        },{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'电子劵码 肯德基 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'周星驰'
        },{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'电子 5份K记饭桶 多次劵',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'火龙果'
        }],
		    tableDataSec: [{
          orderID: 'Tdsorewriuyfdtyrtyrurtyu',
          creationDate:'2018-05-30',
          goodsName:'阿斯达啊哈哈哈特意政府的故事',
          goodsType:'银行卡',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2008-02-15',
          trimDate:'2018-05-15',
          updateMan:'是读后感',
          remarK:'麻辣香锅'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'的感觉我大概发个更富有',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'的时候',
          remarK:'海底捞'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'通过后方天羽圣导天鹰分局地址',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'都会出现',
          remarK:'一家人就要整整齐齐'
        },{
          orderID: 'Tdsorewriuyfdtyrtyrurtyu',
          creationDate:'2018-05-30',
          goodsName:'阿斯达啊哈哈哈特意政府的故事',
          goodsType:'银行卡',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2008-02-15',
          trimDate:'2018-05-15',
          updateMan:'是读后感',
          remarK:'麻辣香锅'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'的感觉我大概发个更富有',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'的时候',
          remarK:'海底捞'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'通过后方天羽圣导天鹰分局地址',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'都会出现',
          remarK:'一家人就要整整齐齐'
        },{
          orderID: 'Tdsorewriuyfdtyrtyrurtyu',
          creationDate:'2018-05-30',
          goodsName:'阿斯达啊哈哈哈特意政府的故事',
          goodsType:'银行卡',
          orderMon:'201805',
					busType:'交易',
          Status:'未确认',
          getDate:'2008-02-15',
          trimDate:'2018-05-15',
          updateMan:'是读后感',
          remarK:'麻辣香锅'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'的感觉我大概发个更富有',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'的时候',
          remarK:'海底捞'
        },
		{
          orderID: 'T200P168896055470759326',
          creationDate:'2018-05-30',
          goodsName:'通过后方天羽圣导天鹰分局地址',
          goodsType:'劵',
          orderMon:'201805',
					busType:'交易',
          Status:'已确认',
          getDate:'2018-05-14',
          trimDate:'2018-05-15',
          updateMan:'都会出现',
          remarK:'一家人就要整整齐齐'
        }],
			}
		},
		 methods: {
        handleClick(tab, event) {},
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
       //查询
        query(){
          let para={
            date:this.filters.date,
            status:this.filters.status
          };
          // console.log(para.date+"--"+para.status);

        },
        //重置
         reset(){
           this.filters.date="",
           this.filters.status=""
      },
        handleSizeChange:function(size) {
            this.pageSize = size;
        },
        handleCurrentChange:function(currentPage) {
            this.currentPage = currentPage;
        }
    },
        beforeMount(){
            // console.log(this.$route);
        }

	}
</script>
<style scoped lang="scss">
$col-primary:#2AAF37;
$col-bg:#F0F0F0;
$col-bgc:white;
$col-font:#606266;
*{
	list-style:none;
}
.container .header{
background-color:$col-bgc !important;
}
.bottContain{
  padding-bottom:30px;
   background:$col-bg;
}
.seachDiv{
	height:117px;
	background:$col-bgc;
}
.seleDivdd{
	float:left;
	margin:20px 30px;
	text-align:left;
	.seleDate{
		margin-top:20px;
	}
	.seleStatus{
		margin-top:20px;
	}
	.findButt{
		margin:0 10px 0 60px;
	}
}
.rightTableDR{
	margin-top:30px;
	background:$col-bgc;
  padding:30px 30px 0 30px;
	.loadAction{
		float:right;
		margin:10px 30px 20px 0;
	.upLoad{
		color:#2AAF37;
		margin-right:30px;
	}
	.downLoad{
		color:blue;
	}
	}
}
.rightTableDR .el-tabs__item{
font-size:18px;
color:#e4e7ed;
}
.el-tabs__item:hover{
   color:$col-primary;
}

.el-tabs__header .is-active{
 color:$col-primary;
  font-size:18px;
}
.el-tabs__active-bar .is-top{
  background-color:$col-primary;
}
.el-table .cell{
  text-align:center;
}
.paginationDR{
   text-align:right;
   margin:30px;
}

</style>
