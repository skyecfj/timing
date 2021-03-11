<template>
       <div class="cbContainer">
            <div class="cbSelects">
              <div class="cbSelectRow">
                <span class="cbSelect">
                  <div>业务类型</div>
                    <el-select size="small"  v-model="value" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                 </span>
                 <span class="cbSelect">
                   <div>子业务类型</div>
                     <el-select size="small"  v-model="value" placeholder="请选择">
                       <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                 </span>
                 <span class="cbSelect">
                   <div>凭证类型</div>
                     <el-select size="small"  v-model="value" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                </span>
                <span class="cbSelect">
                  <div>账套</div>
                    <el-select size="small"  v-model="value" placeholder="请选择">
                      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </span>
                <span class="cbSelect">
                  <div>摘要</div>
                    <el-input size="small"  v-model.trim="input" placeholder="请输入摘要内容"></el-input>
                </span>
            </div>
               <div class="cbSelectRow">
                 <span class="cbSelect">
                   <div>制单日期</div>
                     <el-select size="small"  v-model="value" placeholder="请选择">
                       <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                   <span>-</span>
                     <el-select size="small"  v-model="value" placeholder="请选择">
                       <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                       </el-select>
                 </span>
                <el-button size="small"  type="success">查询</el-button>
                <el-button size="small"  type="primary" plain>重置</el-button>
              </div>
          </div>
          <div class="cbBContent">
            <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%">
              <el-table-column prop="date" label="业务类型">
              </el-table-column>
              <el-table-column prop="name" label="子业务类型">
              </el-table-column>
              <el-table-column prop="address" label="凭证类型">
              </el-table-column>
              <el-table-column prop="time" label="制单日期">
              </el-table-column>
              <el-table-column prop="address" label="账期">
              </el-table-column>
              <el-table-column prop="address" label="摘要">
              </el-table-column>
              <el-table-column prop="address" label="会计科目">
              </el-table-column>
              <el-table-column prop="address" label="账套">
              </el-table-column>
              <el-table-column prop="address" label="金额">
              </el-table-column>
              <el-table-column prop="address" label="制单人">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span class="check vouHanleCloumn" @click="checkDetail(scope.row)">查看</span>
                  <span class="delete vouHanleCloumn" @click="deleteRow(scope.$index,tableData)">删除</span>
                  <span class="cancel vouHanleCloumn">撤销</span>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage"
                :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="100">
              </el-pagination>
            </div>
          </div>
        </div>
</template>
<script>
    export default{
      name:'voucherContent',
      data() {
			return {
        openeds: ['2'],
        isShowVc:true,
        isShowVd:false,
         currentPage:1,
				 isActive:'true',
				 navTitle:{
      				  fontSize: '20px'
				 },
         options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: 'BOC',
        input: '',
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄',
            time:'2018-07-08'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄',
            time:'2018-07-09'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄',
            time:'2018-07-10'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-11'
          },{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-12'
          },{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-13'
          },{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-08'
          },{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-08'
          },{
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄',
            time:'2018-07-08'
          }]
			}

		},
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);

      },
      handleClose(key, keyPath) {

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      headRow(row, column, rowIndex, columnIndex){
        return 'text-align:center';
      },
      cellClass(){
        return 'text-align:center';
      },
      checkDetail(rowObject){
       // this.isShowVc = false;
       // this.isShowVd = true;
       // this.$emit('fn',true);
       console.log('getsrt');
        this.$emit('getSelectItem','凭证查看明细');
      },
      deleteRow(index,rows){
       rows.splice(index, 1);
      },
      showVConent(){
        this.isShowVc = true;
        this.isShowVd = false;
      },
      linkVoucherDetail(){
        this.$router.push('/checkBusiness/billManage');
      }
    }
    }
</script>
<style scoped lang="scss">
  @import '../../assets/scss/home.scss';
  @import '../../assets/scss/checkBusiness.scss';
  $col-primary:#2AAF37;
  $col-warning:#f56c6c;

    .cbBContent {
      .check {
        color: $col-primary;
      }
      .delete {
        color: $col-warning;
      }
      .cancel {
        color: $col-cancel;
      }
      .vouHanleCloumn {
        padding-right: 5px;
        cursor: pointer;
      }
    }
    .voucherDetailBTop {
      margin-top: 0px;
    }

</style>
