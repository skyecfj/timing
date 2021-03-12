<template>
       <div class="mainContent">
           <div class="cbBContentTitle">
               <div class="cbBContentRight">
                   <el-button size="small"  @click="save" class="c-button c-button--primary">保存</el-button>
               </div>
           </div>
            <div class="searchContent">
              <el-row>
                <el-col :span="8">
                  <div class="selectContent">
                    <div class="selectTitle">业务类型</div>
                      <el-select size="small"  v-model="BT" placeholder="请选择">
                        <el-option v-for="item in optionsBT" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                 </div>
               </el-col>
               <el-col :span="8">
                 <div class="selectContent">
                   <div class="selectTitle">子业务类型</div>
                     <el-select size="small"  v-model="SuBT" placeholder="请选择">
                       <el-option v-for="item in optionsSuBT" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                 </div>
               </el-col>
               <el-col :span="8">
                 <div class="selectContent">
                   <div class="selectTitle">凭证类型</div>
                   <el-select size="small"  v-model="VT" placeholder="请选择">
                      <el-option v-for="item in optionsVT" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                </div>
             </el-col>
          </el-row>
          <el-row>
                <el-col :span="8">
                  <div class="selectContent">
                    <div class="selectTitle">账套</div>
                    <el-select size="small"  v-model="ZT" placeholder="请选择">
                      <el-option v-for="item in optionsZT" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                 </div>
               </el-col>
               <el-col :span="8">
                 <div class="selectContent">
                   <div class="selectTitle">JDE账务模型</div>
                     <el-select size="small"  v-model="JDE" placeholder="请选择">
                       <el-option v-for="item in optionsJDE" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                     </el-select>
                 </div>
               </el-col>
               <el-col :span="8">
                 <div class="selectContent">
                   <div class="selectTitle">单据类型</div>
                     <el-select size="small"  v-model="DJT" placeholder="请选择">
                      <el-option v-for="item in optionsDJT" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                      </el-select>
                </div>
             </el-col>
          </el-row>
          <el-row>
                <el-col :span="8">
                  <div class="selectContent">
                    <div class="selectTitle">制单日期</div>
                    <el-date-picker v-model="optionData" type="date" placeholder="选择日期"></el-date-picker>
                 </div>
               </el-col>
               <el-col :span="8">
                 <div class="selectContent">
                   <div class="selectTitle"></div>
                   <el-upload class="upload-demo" ref="upload" action="" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
                   <el-button size="small"  type="text" icon="el-icon-upload" @click="uploadFile" slot="trigger">上传附件</el-button>
                   </el-upload>
                 </div>
               </el-col>
          </el-row>
          </div>
          <div class="cbBContent">
            <el-table :data="tableData" :header-cell-style="headRow" :cell-style="cellClass" style="width: 100%" max-height="500" ref="tableContent">
              <el-table-column label="摘要">
                <template slot-scope="scope">
                  <el-input size="small"  placeholder="请输入摘要" v-model.trim="scope.row.inputDesc"></el-input>
                </template>
              </el-table-column>
              <el-table-column  label="BU">
                <template slot-scope="scope">
                  <el-select size="small"  v-model="scope.row.stateBu" placeholder="111111">
                      <el-option v-for="item in optionsBu" :key="item.label" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column  label="会计科目">
                <template slot-scope="scope">
                  <el-select size="small"  v-model="scope.row.stateAccount" placeholder="111111">
                      <el-option v-for="item in optionAccount" :key="item.label" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column label="子账类型">
                <template slot-scope="scope">
                  <el-select size="small"  v-model="scope.row.stateSubT" placeholder="111111">
                      <el-option v-for="item in optionsSubT" :key="item.label" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column  label="子账">
                <template slot-scope="scope">
                  <el-select size="small"  v-model="scope.row.stateSub" placeholder="111111">
                      <el-option v-for="item in optionsSub" :key="item.label" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column  label="说明">
                <template slot-scope="scope">
                  <el-select size="small"  v-model="scope.row.state" placeholder="111111">
                      <el-option v-for="item in optionState" :key="item.label" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                </template>
              </el-table-column>
              <el-table-column  label="金额">
                <template slot-scope="scope">
                  <el-input size="small"  placeholder="请输入金额" v-model.trim="scope.row.inputMoney" type="number"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <div class="newAddContent" @click="newAdd">
              <span><i class="el-icon-plus">新增一条</i></span>
            </div>
          </div>
        </div>
</template>
<script>
    const defaultData = {
        tableData: [],
        BT:'全部',
        SuBT: '全部',
        VT: '全部',
        ZT: '全部',
        JDE: '全部',
        DJT: '全部',
        optionData: new Date(),
    }
    export default{
      name:'manualVoucher',
      index: '1',
      isAdd: true,
      data() {
		 return {
        optionsBT: [{value:'请选择'},{value:'餐厅1',label:'餐厅1'},{value:'餐厅2',label:'餐厅2'}],
        optionsSuBT: [{value:'请选择'},{value:'订单账务1',label:'订单账务1'},{value:'订单账务2',label:'订单账务2'}],
        optionsVT: [{value:'请选择'},{value:'自由商城1',label:'自由商城1'},{value:'自由商城2',label:'自由商城2'}],
        optionsZT: [{value:'请选择'},{value:'GP1',label:'GP1'},{value:'GP2',label:'GP2'}],
        optionsJDE: [{value:'请选择'},{value:'JDE1',label:'JDE1'},{value:'JDE2',label:'JDE2'}],
        optionsDJT: [{value:'请选择'},{value:'JE1',label:'JE1'},{value:'JE2',label:'JE2'}],
        inputDesc:'',
        optionsBu:[{value:'请选择'},{value: '86023',label:'86023'}, {value: '86024',label:'86024'}],
        optionAccount:[{value:'请选择'},{value:'11512',label:'11512'},{value:'11513',label:'11513'}],
        optionsSubT:[{value:'请选择'},{value:'品牌',label:'品牌'},{value:'个体',label:'个体'}],
        optionsSub:[{value:'请选择'},{value:'肯德基1',label:'肯德基1'},{value:'肯德基2',label:'肯德基2'}],
        optionState:[{value:'请选择'},{value:'说明1',label:'说明1'},{value:'说明2',label:'说明2'}],
        inputMoney:'',
        // postData: Object.assign({}, defaultData),
        tableData: [],
        BT:'全部',
        SuBT: '全部',
        VT: '全部',
        ZT: '全部',
        JDE: '全部',
        DJT: '全部',
        optionData: new Date(),
        fileList:[]
			}
		},
    created() {
      let isEdit = JSON.parse(sessionStorage.getItem('isManualEdit'))
      console.log(isEdit)
      if(!isEdit)
      {
        console.log('created222')
        this.tableData = []
        //  this.postData = Object.assign({}, defaultData)
      }
      else{
      console.log('created11')
        this.getParams()
      }

    },
    activated (){
     console.log(this.$route.params.isEdit)
     console.log('activated')
    },
    methods: {
      headRow(row, column, rowIndex, columnIndex){
        return 'text-align:center';
      },
      cellClass(){
        return 'text-align:center';
      },
      checkDetail(rowObject){
        this.$emit('getSelectItem','手工账务');
      },
      save(){
        console.log(this.tableData);
        this.$confirm('确定保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.common.deleteTag(this.$route,this)
        }).catch(() => {
          this.common.messageUtil({
            type: 'info',
            message: '已取消保存'
          });
        });
      },
      getParams(){
        this.isAdd = false
        this.tableData = []
        // this.postData = Object.assign({}, this.$route.params)
        this.tableData = JSON.parse(JSON.stringify(this.$route.params.tableData))
        this.BT = this.$route.params.BT
        this.SuBT = this.$route.params.SuBT
        this.VT = this.$route.params.VT
        this.ZT = this.$route.params.ZT
        this.JDE = this.$route.params.JDE
        this.DJT = this.$route.params.DJT
        this.optionData = this.$route.params.optionData
      },
      newAdd(){
        this.tableData.push({inputDesc:'',
        stateBu:'全部',
        stateAccount:'全部',
        stateSubT:'全部',
        stateSub:'全部',
        state:'全部',
        inputMoney:''
        })
     },
     uploadFile(){

     },
     handleRemove(file, fileList) {
        console.log(file, fileList);
     },
      handlePreview(file) {
        console.log(file);
     }
   }
}
</script>
<style scoped lang="scss">
  @import '../../assets/scss/checkBusiness.scss';
  .mainContent {
    .el-table {
      overflow-y: auto;
    }
    .newAddContent {
      text-align: center;
      background-color: white;
      padding: 5px;
      font-size:12px;
      span {
        cursor: pointer;
      }
    }
     .cbBContentTitle {
         height: 80px;
         margin-bottom: $section-space;
     }
     .searchContent {
       .el-row {
         padding: 5px;
       }
       .selectContent {
         width: 100%;
         .el-select , .el-date-editor.el-input{
           width: 80%;
         }
         .selectTitle {
           height: 22px;
         }
       }
     }
  }
</style>