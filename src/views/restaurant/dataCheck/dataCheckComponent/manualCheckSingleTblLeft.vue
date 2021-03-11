<template>
  <div :data-id="leftTblConfig.requiredSearchObj.checkStatus" >
    <el-table ref="leftTbl"  :data="leftTblData" style="width: 100%" :border="true" @selection-change="handleLeftSelectionChange" 
              :row-class-name="tableRowClassName" @row-dblclick="leftTblClick" :height="tblHeight" v-loading="loadingSummury"
              element-loading-text="Loading">
      <el-table-column  v-for="(headerItem,index) in leftTHeaderConfig.labels" align="center"
                        :width="calTheadWidth(pageUtil.tblSearchConfigs[leftTblConfig.dataType][index])"
                        v-bind:key="index"
                        :prop="leftTHeaderConfig.props[index]"
                        :label="headerItem"
                        v-if="leftTblConfig.requiredSearchObj.checkStatus === 0 || (leftTblConfig.requiredSearchObj.checkStatus === 1 && leftTHeaderConfig.props[index] != 'realSaveAmount' && leftTHeaderConfig.props[index] != 'unSaveBankReason' )">
        <template slot="header" slot-scope="scope">
          <div v-if="tblSearchConfigs[index].type == 'date'" class="header-search header-date-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-date-picker  type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                             v-model="leftTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                             v-on:change="$emit('toogleRefreshLeftTbl',true,leftTempSelectedDatas)" ></el-date-picker>
          </div>
          <div v-if="tblSearchConfigs[index].type == 'rangeInput'" class="header-search header-range-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-input class="range-start" v-model="leftTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshLeftTbl',true)"/>
            <span class="split" >-</span>
            <el-input class="range-end" v-model="leftTblSearchObj[tblSearchConfigs[index].prop[1]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshLeftTbl',true)"/>
          </div>
          <div v-if="tblSearchConfigs[index].type == 'input'" class="header-search header-input-search" >
            <p class="header-label" >{{headerItem}}</p>
            <el-input v-model="leftTblSearchObj[tblSearchConfigs[index].prop[0]]" 
                      v-on:keyup.enter.native="$emit('toogleRefreshLeftTbl',true)"/>
          </div>
        </template>
        <template slot-scope="scope" >
          <div v-if="index == 0 && (scope.row.voucherId || scope.row.specialVoucherId)" class="icon-content" > 
            <span class="column-icon split" >账</span>
          </div>
          <span v-if="scope.column.label == '差异原因'" :title="scope.row[scope.column.property]" >{{(scope.row[scope.column.property] && scope.row[scope.column.property].length) > 8 ? scope.row[scope.column.property].substring(0,8)+'...':scope.row[scope.column.property]}}</span>
          <span v-else >{{scope.row[scope.column.property]}}</span>
          <div v-if="scope.column.label == leftTHeaderConfig.iconColumn" class="icon-content" >
            <span v-if="scope.row.fscActivityCode == '支票' && scope.row[scope.column.property]"  class="column-icon check" >支票</span>
            <span v-if="scope.row.rootId && scope.row[scope.column.property]" class="column-icon split" >拆</span>
          </div>
        </template>                
      </el-table-column>
      <el-table-column  v-if="leftTblConfig.requiredSearchObj.checkStatus === 1" min-width="130px" align="center" 
                        prop="notspfFlag" label="调整类型" :render-header="renderLeftHeader" key="adjustType" width="90px"></el-table-column>
      <el-table-column  v-if="leftTblConfig.requiredSearchObj.checkStatus === 1 && pageName == 'manual-check-statement'" align="center"
                        prop="userName" label="操作人" key="updateUser" width="70px">
        <template slot="header" slot-scope="scope">
          <p class="header-label" >操作人</p>
            <el-input v-model="leftTblSearchObj.modiferUser" 
                      v-on:keyup.enter.native="$emit('toogleRefreshLeftTbl',true)"/>
        </template>
      </el-table-column>
      <el-table-column  v-if="leftTblConfig.requiredSearchObj.checkStatus === 0 && leftTblConfig.dataType != 'escortsummary' && pageName == 'manual-check-statement'" align="center"
                        prop="splitReason" label="拆分理由" :render-header="renderLeftHeader" key="splitReason"  width="90px">
        <template slot-scope="scope" >
          <span v-if="scope.row.splitReason && scope.row.splitReason.length > 8" :title="scope.row.splitReason" >{{scope.row.splitReason.substring(0,8)}}...</span>
          <span v-else :title="scope.row.splitReason" >{{scope.row.splitReason}}</span>
        </template>
      </el-table-column>
      <el-table-column  v-if="leftTblConfig.requiredSearchObj.checkStatus === 0"  fixed="right" width="38px" class-name="right-check-column" type="selection" key='tblCheckBox' ></el-table-column>
      <el-table-column  v-else-if="leftTblConfig.requiredSearchObj.checkStatus === 1"  fixed="right" width="38px"  class-name="right-checked-column" key="checkedShow" >
        <template slot-scope="scope" >
          <el-checkbox v-model="scope.row.seleted" @change="(val)=>{handleLeftCheckedDatasChange(val,scope.row.id)}" ></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import api from '../../../../model/api'
  import apiStore from '../../../../model/apidr'
  import pageUtilCash from '../../../../utils/restaurant/dataCheck/cashManualCheck'
  import pageUtilNonCash from '../../../../utils/restaurant/dataCheck/nonCashManualCheck'

  export default{
    name  : 'manualCheckSingleTblLeft',
    props : ['leftTblConfig','pageName','refreshLeftTbl','resetLeftTblFlag','currentSinIdsForLeft','currentSummmeryIdsForLeft','sumRefreshObj',
             'refreshCashCheckedLeft','leftSelectedIdsParam','leftInvertIdsParam','cashCheckedLeftRefreshDown','cashCheckedRightRefreshDown'], 
    beforeMount(){
      let windowHeight = window.innerHeight;
      this.tblHeight = windowHeight * 0.59;
      this.pageUtil = this.pageName == 'manual-check-statement' ? pageUtilCash : pageUtilNonCash;
      this.leftTHeaderConfig = this.pageUtil.tblColumns[this.leftTblConfig.dataType];
      this.tblSearchConfigs = this.pageUtil.tblSearchConfigs[this.leftTblConfig.dataType];
      this.leftTblSearchObj  = Object.assign({},this.pageUtil.tblSearchDtos[this.leftTblConfig.dataType]);
      this.getAdjustType();
    },
    mounted(){
      this.getData();
    },
    data() {
			return {
        search : '',
        pageUtil : {},
        tblHeight : 0,
        sumIdsForLeft : '',
        sinIdsForLeft : '',
        leftTblData : [],
        leftTHeaderConfig   : {},
        tblSearchConfigs : [],
        leftTblSearchObj : {},
        leftInvertIds : [],
        adjustTypes : [{
          adjustType : '请选择'
        }],
        leftTempSelectedDatas : [],
        leftTempCheckedDatas  : [],
        leftTempCheckedDatasStr : '',
        leftHasReslot : false,
        leftRefreshDown : false,
        loadingSummury : true
			}
    },
    watch : {
      //刷新列表
      refreshLeftTbl(val,oldVal){
        if(val != oldVal && val){
          this.$nextTick(function(){
            if(this.resetLeftTblFlag){
              this.getLeftTblColumns();
              this.$emit('resetLeftTblDown',false); 
            }
            this.getData(); 
          })
        }
      },
      refreshCashCheckedLeft(val,oldVal){
        if(val){
          this.$nextTick(function(){
            if(!this.cashCheckedLeftRefreshDown){
              this.getData('cashCheckedRefresh');
            }
            if(this.cashCheckedLeftRefreshDown && this.cashCheckedRightRefreshDown ){
              this.$emit('bothRefreshDown');
            }
          })
        }
      },
      cashCheckedLeftRefreshDown(val,oldVal){
        if(val){
          if(this.pageName == 'manual-check-statement' && this.leftTblConfig.requiredSearchObj.checkStatus == 1){
            this.$emit('setLeftCashCheckedDatas',this.leftTempCheckedDatas)
          }
        }
      },
      leftTempSelectedDatas(val,oldVal){
        if(val.length){
          this.toggleLeftSelection(val);
          this.leftHasReslot = true;
        } 
      },
      leftTempCheckedDatasStr:{
        handler(val,oldVal){
          if(this.pageName != 'manual-check-statement'){
            this.$emit('selectedLeftRow', this.leftTempCheckedDatas);
          }
        },
        deep:true
      }
    },
    methods : {
      calTheadWidth(headerObj){
        let checkedStatus = this.leftTblConfig.requiredSearchObj.checkStatus;
        let winWidth = window.innerWidth;
        if(!headerObj){
          return null;
        }else{
          if(checkedStatus === 0){
            if(headerObj.unCheckedMin && winWidth > headerObj.unCheckedMin){
              return null;
            }else{
              return headerObj.unCheckWidth;
            }
          }else if(checkedStatus === 1){
            if(headerObj.checkedMin && winWidth > headerObj.checkedMin){
              return null;
            }else{
              return headerObj.checkedWidth;
            }
          }
        }
      },
      tableRowClassName({row, rowIndex}) {
        let checkedStatus = this.leftTblConfig.requiredSearchObj.checkStatus;
        if(row.multiFlag === 1 && checkedStatus === 0) {
          return 'multi-row';
        }else{
          return '';
        }
      },
      //获取调整类型下拉框数据
      getAdjustType(){
        let _self = this;
        let param = this.common.formatPathParam({
          itemCode : this.pageName == 'manual-check-statement'? '现金,支票' : ' '
        });
        apiStore.getAdjustTypeByBohKeyworld(param,function(res){
          if(res.code === 200){
            _self.adjustTypes = _self.adjustTypes.concat(res.data);
          }else{
            _self.adjustTypes = [{
              adjustType : '请选择'
            }];
          }
          _self.adjustTypes.push({
            adjustType : '非SPF手工账务'
          });
          // if(_self.pageName != 'manual-check-statement'){
          //   _self.adjustTypes = _self.adjustTypes.concat([{
          //     adjustType : '长假保证金'
          //   },{
          //     adjustType : '日常保证金'
          //   },{
          //     adjustType : '预付款'
          //   }]);
          // }
        })
      },
      //获取表配置
      getLeftTblColumns(){
        //let _self = this;
        this.leftTHeaderConfig = this.pageUtil.tblColumns[this.leftTblConfig.dataType];
        this.tblSearchConfigs  = this.pageUtil.tblSearchConfigs[this.leftTblConfig.dataType];
        this.leftTblSearchObj  = Object.assign({},this.pageUtil.tblSearchDtos[this.leftTblConfig.dataType]);
      },
      //查询列表
      getData(refreshType){ 
        this.restSelectedStatus();
        this.loadingSummury = true;
        this.sumIdsForLeft = this.currentSummmeryIdsForLeft? this.currentSummmeryIdsForLeft : '';
        this.sinIdsForLeft = this.currentSinIdsForLeft? this.currentSinIdsForLeft : '';
        let _self = this;
        let searchUrl = '/'+ this.pageName +'/select-unsplit-'+ this.leftTblConfig.dataType + (this.pageName == 'manual-check-statement'? '-by-condition-all' : '');
        let searchObj = Object.assign(this.leftTblSearchObj,this.leftTblConfig.requiredSearchObj)
        let searchParam  = '';
        if(this.pageName != 'manual-check-statement' || this.leftTblConfig.requiredSearchObj.checkStatus != 1){
          searchParam = (this.sumIdsForLeft ||  this.sinIdsForLeft)? this.common.formatPathParam(searchObj) + this.sinIdsForLeft + this.sumIdsForLeft : this.common.formatPathParam(searchObj);
        }else{
          searchParam = this.common.formatPathParam(searchObj) + this.common.formatPathParam(this.leftSelectedIdsParam) + this.common.formatPathParam(this.leftInvertIdsParam);
        }
        apiStore.getSummurySideData(searchUrl,searchParam,function(result){
          _self.loadingSummury = false;
          _self.sinIdsForLeft = '';
          _self.sumIdsForLeft = '';
          _self.$emit('toogleRefreshLeftTbl',false);
          _self.leftTblData = [];
          if(result.code != 404 && result.code != 200){
            _self.common.errorMessage(result.msg);
            return false;
          }
          let dataList = _self.pageName == 'manual-check-statement' ? result.data.result : result.data;
          if(dataList){
            //数组去重
            if(result.data.invertIds){
              let tempInvertIds = _self.leftInvertIds.concat(result.data.invertIds);
              let newObj = new Set(tempInvertIds);    // {1,2,3,4}
              _self.leftInvertIds = Array.from(newObj);
            }
            _self.leftTblData = dataList;
            if(refreshType == 'cashCheckedRefresh'){
              _self.$emit('cashLeftCheckedChange',_self.leftTempCheckedDatas,_self.leftInvertIds,'notSelf',_self.leftTblConfig.dataType);
              _self.$emit('cashLeftCheckedRefreshDown')
              _self.$emit('cashCheckedLeftRefreshDown',true);
            }
            let selectedRows = [];
            dataList.forEach(function(item,index){
              if(item.seleted){
                selectedRows.push(item);
              }
            });
            if(selectedRows.length){
              _self.leftTempCheckedDatas = selectedRows.concat();
              _self.leftTempCheckedDatasStr = JSON.stringify(selectedRows);
            }else{
              _self.leftTempCheckedDatas = [];
              _self.leftTempCheckedDatasStr = ''
            }
            _self.leftTempSelectedDatas = selectedRows;
          }
        })
      },
      setTblHeaderConfig(){
        let _self = this;
        let storage = window.localStorage;
        let params = JSON.parse(storage.params);
        for(let i = 0; i < tblHeaderConfig.noBillTblHeader.length; i ++){
          if(tblHeaderConfig.noBillTblHeader[i].type == params.type){
            _self.leftTHeaderConfig = tblHeaderConfig.noBillTblHeader[i];
            if(tblHeaderConfig.noBillTblHeader[i].isSameHeader){
              _self.leftTHeaderConfig.labels = tblHeaderConfig.noBillTblHeader[i-1].labels;
              _self.leftTHeaderConfig.props  = tblHeaderConfig.noBillTblHeader[i-1].props;
            }
          }
        }
      },
      renderLeftHeader(h, { column, $index }){
        if(column.property == 'notspfFlag'){
          var $header = ( h('div',
                          { class : 'header-search header-select-search'},
                          [ h('p',{class : 'header-label'},column.label),
                            h('el-select',{
                              props:{
                                class:'header-search-item',
                                size:'small',
                                value:this.leftTblSearchObj.notspfFlag,
                              },on:{
                                input: (value) =>{
                                  this.leftTblSearchObj.notspfFlag = value;
                                  console.log(this);
                                  this.$emit('toogleRefreshLeftTbl',true);
                                }
                              }
                            },Array.apply(null,this.adjustTypes).map(function(currentValue,index,array){
                              return h('el-option',{props:index == 0? {label : currentValue.adjustType, value : ''}:{label : currentValue.adjustType, value : currentValue.adjustType }})
                            }))
                          ])
                        )
        }else{
          var $header = ( h('div',
                          { class : 'header-search header-select-search'},
                          [ h('p',{class : 'header-label'},column.label) ])
                        )
        }
        return $header;
      },
      //处理表单数据
      renderTblData(row,column,cellValue,index){
        let _self = this;
      },
      //选中行，调整
      leftTblClick(row, event, column){
        let _self = this;
        let tblConfig = Object.assign({},this.leftTblConfig);
        tblConfig.tblPosition = 'left';
        this.$emit('adjustLeftTblData',{row, event, column, tblConfig});
        // if(this.leftTblConfig.requiredSearchObj.checkStatus != 1){
        //   this.$emit('adjustLeftTblData',{row, event, column, tblConfig});
        // }
      },
      restSelectedStatus(){
        // this.leftTempCheckedDatas = [];
        // this.leftTempCheckedDatasStr = '';
        this.leftTblData.forEach(function(item,index){
          item.seleted = false;
        });
      },
      //
      handleLeftCheckedDatasChange(checkStatus,invertId){
        let _self = this;
        let tempSelectedDatas = [];
        let tempUnSelectedDatas = [];
        let slotedTblData = [];
        //this.$emit('toogleRefreshLeftTbl',true)
        this.$nextTick(function(){
          _self.leftTblData.forEach(function(item,index){
            if(item.seleted){
              tempSelectedDatas.push(item);
            }else{
              tempUnSelectedDatas.push(item);
            }
          });
          slotedTblData = tempSelectedDatas.concat(tempUnSelectedDatas);
          if(tempSelectedDatas.length){
            _self.leftTempCheckedDatas = tempSelectedDatas.concat();
            _self.leftTempCheckedDatasStr = JSON.stringify(tempSelectedDatas);
          }else{
            _self.leftTempCheckedDatas = [];
            _self.leftTempCheckedDatasStr = '';
          }
          _self.leftInvertIds = [];
          if(!checkStatus){
            _self.leftInvertIds.push(invertId);
          }
          _self.leftTblData = slotedTblData.concat();
          _self.$emit('cashLeftCheckedChange',_self.leftTempCheckedDatas,_self.leftInvertIds,'self',_self.leftTblConfig.dataType);
        })
      },
      handleLeftSelectionChange(selectedDatas) {
        let _self = this;
        this.$emit('setSelectedAmount',selectedDatas[selectedDatas.length-1]);
        if(this.leftTblConfig.requiredSearchObj.checkStatus != 1){
          this.$emit('selectedLeftRow', selectedDatas);
        }
        //未核对数据，选中调整
        if(this.leftTblConfig.requiredSearchObj.checkStatus != 1 && !this.leftHasReslot){
          let tempDataList = Object.assign([],selectedDatas);
          this.leftTblData.forEach(function(item,index){
            if(!_self.common.isInArray(tempDataList,item)){
              tempDataList.push(item);
            }
          });
          _self.leftTblData = tempDataList;
          this.leftTempSelectedDatas = selectedDatas;
        }
      },
      toggleLeftSelection(rows) {
        let _self = this;
        var toogleDown = false;
        if (rows.length) {
          this.$nextTick(function(){
            rows.forEach(function(row,index){
              if(index == rows.length - 1){
                toogleDown = true;
              }
              _self.$refs.leftTbl.toggleRowSelection(row,true);
            });
            if(toogleDown){
              this.leftHasReslot = false;
              // if(!(this.pageName == 'manual-check-statement' && this.leftTblConfig.requiredSearchObj.checkStatus == 1)){
              //   this.$emit('selectedLeftRow', rows);
              // }
              if(this.leftTblConfig.requiredSearchObj.checkStatus != 1){
                //let currentTblKey = this.pageUtil.tblSearchKeyWord[this.leftTblConfig.dataType];
                this.$emit('leftTblSelectToogleDown',rows);
              }
              // this.$emit('selectedLeftRow', rows);
              // if(this.pageName != 'manual-check-statement' || this.leftTblConfig.requiredSearchObj.checkStatus != 1){
              //   this.$emit('leftTblSelectToogleDown',rows);
              // }
            }
          })
        } else {
          this.$refs.leftTbl.clearSelection();
          this.leftHasReslot = false;
        }
        //this.leftHasReslot = false;
      }
    }
  }
</script>